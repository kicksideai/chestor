import { hasInjectionContext as mi, inject as qe, effectScope as pi, ref as Y, markRaw as fi, createApp as hi, onMounted as fn, onUnmounted as vi, watch as fe, readonly as gi, getCurrentInstance as wt, nextTick as yi, reactive as bi, renderSlot as se, openBlock as x, createBlock as ve, Teleport as hn, createCommentVNode as z, useId as _i, mergeProps as E, resolveDirective as Si, createElementBlock as j, createElementVNode as tt, withDirectives as wi, resolveDynamicComponent as $t, normalizeClass as $i, toDisplayString as vn, resolveComponent as Ot, withCtx as Pt, createVNode as Oi, Transition as Pi, Fragment as ye, renderList as Ct, createTextVNode as Ci, h as Ti } from "vue";
import { addCollection as ki } from "@iconify/vue";
import { config as Tt, addIcons as Li, on as xi, applyThemeMode as Ie, host as Ei, hostCss as Ai, loadCss as Ii } from "@wippy-fe/proxy";
var nt = "data-wippy-visible";
function kt(e) {
  const t = e.getAttribute(nt);
  return t === "true" ? !0 : t === "false" ? !1 : null;
}
var Ni = Object.defineProperty, gn = (e) => {
  throw TypeError(e);
}, ji = (e, t, n) => t in e ? Ni(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n, C = (e, t, n) => ji(e, typeof t != "symbol" ? t + "" : t, n), yn = (e, t, n) => t.has(e) || gn("Cannot " + n), Ri = (e, t, n) => (yn(e, t, "read from private field"), n ? n.call(e) : t.get(e)), Vi = (e, t, n) => t.has(e) ? gn("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, n), Mi = (e, t, n, i) => (yn(e, t, "write to private field"), t.set(e, n), n), Di = [
  "themeConfigUrl",
  "primeVueCssUrl",
  "markdownCssUrl",
  "iframeCssUrl"
], Hi = [
  ":where([data-wippy-theme-root]).w-theme-light",
  ":where([data-wippy-theme-root]).w-theme-dark"
].join(`,
`);
function Lt(e) {
  const t = e.startsWith("--") ? e : `--${e}`;
  return /^--[-\w\u0080-\uFFFF]+$/.test(t) ? t : null;
}
function zi(...e) {
  const t = /* @__PURE__ */ new Set();
  for (const n of e)
    if (n)
      for (const [i, r] of Object.entries(n)) {
        if ((i === "@light" || i === "@dark") && r && typeof r == "object") {
          for (const [a, l] of Object.entries(r)) {
            const s = typeof l == "string" ? Lt(a) : null;
            s && t.add(s);
          }
          continue;
        }
        const o = typeof r == "string" ? Lt(i) : null;
        o && t.add(o);
      }
  return [...t].sort();
}
function Ui(e) {
  if (e.length === 0)
    return "";
  const t = e.map((n) => `  ${n}: inherit;`).join(`
`);
  return `${Hi} {
${t}
}`;
}
function Bi(e, t) {
  const n = Ui(t);
  n && bn(e, n, "@wippy-fe/css-variables-bridge");
}
function Wi(e, t) {
  const i = (t ?? Di).map(async (r) => {
    const o = Ai[r];
    if (!o)
      return console.warn(`[wippy-fe/webcomponent-core] hostCss key "${r}" is undefined — skipping. Remove it from hostCssKeys if the CSS was removed.`), null;
    try {
      return await Ii(o);
    } catch (a) {
      return console.warn(`[wippy-fe/webcomponent-core] Failed to load hostCss "${r}" (${o}):`, a), null;
    }
  });
  return Promise.all(i).then((r) => {
    for (const o of r) {
      if (!o)
        continue;
      const a = document.createElement("style");
      a.textContent = o, a.setAttribute("role", "@wippy-fe/host-css"), e.appendChild(a);
    }
  });
}
function Fi(e, t) {
  const n = document.createElement("style");
  n.textContent = t, e.appendChild(n);
}
function bn(e, t, n) {
  if (typeof CSSStyleSheet < "u" && "replaceSync" in CSSStyleSheet.prototype) {
    const r = new CSSStyleSheet();
    r.replaceSync(t), e.adoptedStyleSheets = [...e.adoptedStyleSheets, r];
    return;
  }
  const i = document.createElement("style");
  i.setAttribute("role", n), i.textContent = t, e.appendChild(i);
}
function Ki(e, t) {
  bn(e, t, "@wippy-fe/custom-css");
}
function _n(e) {
  return e.__wippyHost ?? null;
}
function Yi(e) {
  return e.replace(/-([a-z])/g, (t, n) => n.toUpperCase());
}
function Gi(e, t, n) {
  switch (n.type) {
    case "string":
      return { value: t };
    case "number": {
      const i = Number.parseFloat(t);
      return Number.isNaN(i) ? { value: void 0, error: `Invalid ${e}: expected a number` } : { value: i };
    }
    case "integer": {
      const i = Number.parseInt(t, 10);
      return Number.isNaN(i) ? { value: void 0, error: `Invalid ${e}: expected an integer` } : { value: i };
    }
    case "boolean":
      return { value: t !== "false" };
    case "array":
    case "object":
      try {
        const i = JSON.parse(t);
        return n.type === "array" && !Array.isArray(i) ? { value: void 0, error: `Invalid ${e}: expected a JSON array` } : { value: i };
      } catch {
        return { value: void 0, error: `Invalid ${e}: must be valid JSON` };
      }
    default:
      return { value: t };
  }
}
function Ze(e, t) {
  const n = {}, i = [];
  for (const [r, o] of Object.entries(t.properties)) {
    const a = e.getAttribute(r), l = Yi(r);
    if (a === null) {
      o.default !== void 0 && (n[l] = o.default);
      continue;
    }
    const s = Gi(r, a, o);
    s.error ? i.push(s.error) : n[l] = s.value;
  }
  return { props: n, errors: i };
}
var qi = class {
  constructor(e, t) {
    C(this, "_props"), C(this, "_errors"), C(this, "_content"), C(this, "_hostVisibility"), C(this, "_propsListeners", /* @__PURE__ */ new Set()), C(this, "_contentListeners", /* @__PURE__ */ new Set()), C(this, "_hostVisibilityListeners", /* @__PURE__ */ new Set()), C(this, "_disposed", !1), C(this, "_emitToDom"), C(this, "props"), C(this, "events"), C(this, "content"), C(this, "hostVisibility"), this._props = e.props, this._errors = e.errors, this._content = e.content, this._hostVisibility = e.hostVisibility, this._emitToDom = t;
    const n = this;
    this.props = {
      get value() {
        return n._props;
      },
      get errors() {
        return n._errors;
      },
      subscribe(i, r) {
        return n._subscribeProps(i, r);
      }
    }, this.events = {
      emit(i, r) {
        n._disposed || n._emitToDom(i, r);
      }
    }, this.content = e.hasContent ? {
      get value() {
        return n._content;
      },
      subscribe(i, r) {
        return n._subscribeContent(i, r);
      }
    } : null, this.hostVisibility = {
      get value() {
        return n._hostVisibility;
      },
      subscribe(i, r) {
        return n._subscribeHostVisibility(i, r);
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
}, Ue, Zi = class extends HTMLElement {
  constructor() {
    super(), C(this, "_internals"), C(this, "_contentObserver", null), C(this, "_initialized", !1), C(this, "_container", null), Vi(this, Ue, null), C(this, "_attachment", 0), C(this, "_reactive", null), C(this, "_lastProps", null), C(this, "_lastErrors", []), C(this, "_lastContent", null), C(this, "_themeUnsub", null), C(this, "_hostVisible", null), this._internals = this.attachInternals(), this._hostVisible = kt(this);
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
    return [.../* @__PURE__ */ new Set([...t, ...n, nt])];
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
    return _n(this);
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
      let n, i;
      if (this._lastProps !== null)
        n = this._lastProps, i = this._lastErrors;
      else {
        const o = Ze(this, e.propsSchema);
        e.validateProps && o.errors.push(...e.validateProps(o.props)), n = o.props, i = o.errors, this._lastProps = n, this._lastErrors = i;
      }
      const r = t ? this._lastContent ?? this._extractContent(e.contentTemplate) : null;
      t && this._lastContent === null && (this._lastContent = r), this._reactive = new qi(
        { props: n, errors: i, content: r, hasContent: t, hostVisibility: this._hostVisible },
        this.emitEvent.bind(this)
      );
    }
    return this._reactive;
  }
  // ── Lifecycle ──────────────────────────────────────────────
  connectedCallback() {
    const e = ++this._attachment;
    this._internals.states.add("loading");
    try {
      const t = this.constructor.wippyConfig, n = this._initialized, i = Ri(this, Ue) ?? Mi(this, Ue, this.shadowRoot ?? this.attachShadow({ mode: t.shadowMode ?? "open" }));
      let r;
      if (this._container)
        r = this._container;
      else {
        if (this.onInit(i), e !== this._attachment)
          return;
        t.inlineCss && Fi(i, t.inlineCss);
        try {
          const d = Tt?.theming, c = zi(
            d?.global?.cssVariables,
            d?.children?.cssVariables
          );
          Bi(i, c);
        } catch {
        }
        if (t.customCss !== !1)
          try {
            const d = Tt?.theming, c = [d?.global?.customCSS, d?.children?.customCSS].filter(Boolean).join(`
`);
            c && Ki(i, c);
          } catch {
          }
        (t.hostCssKeys === void 0 || t.hostCssKeys.length > 0) && Wi(i, t.hostCssKeys), r = document.createElement("div"), r.setAttribute("data-wippy-theme-root", "");
        const u = t.containerClasses ?? [];
        u.length > 0 && r.classList.add(...u), i.appendChild(r), this._container = r, Li(ki);
      }
      this._applyTheme(), this._themeUnsub || (this._themeUnsub = xi("@theme", (u) => this._applyTheme(u)));
      const { props: o, errors: a } = Ze(this, t.propsSchema);
      t.validateProps && a.push(...t.validateProps(o));
      const l = o;
      this._lastProps = l, this._lastErrors = a;
      let s = null;
      if (t.contentTemplate && (s = this._extractContent(t.contentTemplate), this._lastContent = s, this._contentObserver = new MutationObserver(() => {
        const u = this._extractContent(t.contentTemplate);
        this._lastContent = u, this._reactive?.notifyContent(u), this.onContentChanged(u);
      }), this._contentObserver.observe(this, {
        childList: !0,
        characterData: !0,
        subtree: !0
      })), this.onMount(i, r, l, a, s, n), e !== this._attachment)
        return;
      this._internals.states.delete("loading"), this._internals.states.add("ready"), n || (this._initialized = !0), this.onReady(), e === this._attachment && this.emitEvent("load");
    } catch (t) {
      if (e !== this._attachment || (this.onError(t), e !== this._attachment))
        return;
      this._internals.states.delete("loading"), this._internals.states.add("error"), this.emitEvent("error", {
        message: t instanceof Error ? t.message : String(t),
        error: t
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
  _applyTheme(e = Ei.getThemeMode?.()) {
    Ie(e, this), this._container && Ie(e, this._container);
  }
  disconnectedCallback() {
    const e = ++this._attachment;
    this._themeUnsub && (this._themeUnsub(), this._themeUnsub = null), Ie("auto", this), this._container && Ie("auto", this._container), this._contentObserver && (this._contentObserver.disconnect(), this._contentObserver = null), this.onUnmount(), e === this._attachment && (this.emitEvent("unload"), e === this._attachment && (this._internals.states.clear(), this._reactive?.dispose(), this._reactive = null, this._lastProps = null, this._lastErrors = [], this._lastContent = null, delete this.__wippyHost, delete this.__wippyHostBus));
  }
  attributeChangedCallback(e, t, n) {
    if (t === n)
      return;
    if (e === nt) {
      const l = this._hostVisible, s = kt(this);
      if (s === l)
        return;
      this._hostVisible = s, this.isConnected && this._initialized && (this._reactive?.notifyHostVisibility(s, l), this.onHostVisibilityChanged(s, l));
      return;
    }
    const i = this.constructor.wippyConfig, { props: r, errors: o } = Ze(this, i.propsSchema);
    i.validateProps && o.push(...i.validateProps(r));
    const a = r;
    this._lastProps = a, this._lastErrors = o, this._reactive?.notifyProps(a, o), this.onPropsChanged(a, o);
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
   *
   * A template keeps its children in one of two places. Parsed HTML (page
   * markup, `innerHTML`) puts them in `template.content`, a DocumentFragment.
   * DOM APIs add them as the template element's own child nodes and leave
   * `template.content` empty: that is how a Vue SFC sets
   * `<template data-type="...">{{ text }}</template>`. The content fragment is
   * read first, then the element's own children. Only text is returned, never
   * markup, in both cases.
   */
  _extractContent(e) {
    const t = this.querySelector(`template[data-type="${e}"]`);
    return t ? t.content.textContent?.trim() || t.textContent?.trim() || "" : null;
  }
  /** Called when child `<template>` content changes. Override to update framework state. */
  onContentChanged(e) {
  }
};
Ue = /* @__PURE__ */ new WeakMap();
function Qi(e) {
  return e.__wippyHostBus ?? null;
}
function Ji(e) {
  return e.dataset.wippyPanelId ?? null;
}
/*!
 * pinia v2.3.1
 * (c) 2025 Eduardo San Martin Morote
 * @license MIT
 */
let Sn;
const wn = (e) => Sn = e, Xi = () => mi() && qe($n) || Sn, $n = (
  /* istanbul ignore next */
  Symbol()
);
var xt;
(function(e) {
  e.direct = "direct", e.patchObject = "patch object", e.patchFunction = "patch function";
})(xt || (xt = {}));
function er() {
  const e = pi(!0), t = e.run(() => Y({}));
  let n = [], i = [];
  const r = fi({
    install(o) {
      wn(r), r._a = o, o.provide($n, r), o.config.globalProperties.$pinia = r, i.forEach((a) => n.push(a)), i = [];
    },
    use(o) {
      return this._a ? n.push(o) : i.push(o), this;
    },
    _p: n,
    // it's actually undefined here
    // @ts-expect-error
    _a: null,
    _e: e,
    _s: /* @__PURE__ */ new Map(),
    state: t
  });
  return r;
}
var tr = Object.defineProperty, nr = (e, t, n) => t in e ? tr(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n, F = (e, t, n) => nr(e, typeof t != "symbol" ? t + "" : t, n);
function Vs(e, t) {
  return { lazyConfig: e, mountLifecycle: !0, lazyUi: t };
}
function Et(e, t, n) {
  const i = e.createElement("div"), r = n ? t.failed : t.loading;
  i.dataset.lazyState = n ? "failed" : "loading", i.setAttribute("role", n ? "alert" : "status"), i.setAttribute("aria-label", r), i.style.cssText = "display:grid;place-items:center;text-align:center;";
  const o = t.surface === "page";
  if (i.style.cssText += o ? "block-size:100%;min-block-size:0;" : "min-block-size:2rem;font-size:.875rem;", n)
    i.style.color = "var(--p-danger-500, currentColor)", i.textContent = !o && t.iconOnly ? "⚠" : r, !o && t.iconOnly && (i.title = r);
  else {
    const a = e.createElement("style");
    a.textContent = '@media (prefers-reduced-motion: no-preference) { [data-lazy-state="loading"] > [data-wippy-spinner] { animation: wippy-lazy-spin 1s linear infinite; } } @keyframes wippy-lazy-spin { to { transform: rotate(1turn); } }';
    const l = e.createElement("span");
    l.dataset.wippySpinner = "", l.setAttribute("aria-hidden", "true"), l.style.cssText = "display:block;box-sizing:border-box;inline-size:1em;block-size:1em;border:2px solid var(--p-surface-300, currentColor);border-top-color:var(--p-primary-color, currentColor);border-radius:50%;", l.style.fontSize = o ? "2rem" : "1em", i.append(a, l);
  }
  return i;
}
var On = /* @__PURE__ */ Symbol("wippy:emit"), Pn = /* @__PURE__ */ Symbol("wippy:props"), ir = /* @__PURE__ */ Symbol("wippy:props_error"), rr = /* @__PURE__ */ Symbol("wippy:content"), or = /* @__PURE__ */ Symbol("wippy:panel-id"), sr = /* @__PURE__ */ Symbol("wippy:layout-bus"), ar = /* @__PURE__ */ Symbol("wippy:host"), Cn = /* @__PURE__ */ Symbol("wippy:host-visibility");
function Ms() {
  const e = qe(Pn);
  if (!e)
    throw new Error("useProps() must be called inside a WippyVueElement");
  return e;
}
function Ds() {
  const e = qe(On);
  if (!e)
    throw new Error("useEvents() must be called inside a WippyVueElement");
  return e;
}
function lr() {
  const e = qe(Cn);
  if (!e)
    throw new Error("useHostVisibility() must be called inside a WippyVueElement");
  return e;
}
function Hs(e) {
  const t = lr();
  let n = !1, i = null, r = !1;
  function o() {
    if (i)
      return r = !0, i;
    let a;
    try {
      a = Promise.resolve(e());
    } catch (s) {
      a = Promise.reject(s);
    }
    const l = a.finally(() => {
      if (i === l && (i = null, n && r))
        return r = !1, o();
    });
    return i = l, l;
  }
  return fn(() => (n = !0, o())), vi(() => {
    n = !1, r = !1;
  }), fe(t, (a, l) => {
    if (n && l === !1 && a === !0)
      return o();
  }), t;
}
var Ne = /* @__PURE__ */ new WeakMap();
function At(e, t) {
  const n = Ne.get(e);
  if (n)
    return n;
  const i = Promise.resolve().then(t);
  return Ne.set(e, i), i.catch(() => {
    Ne.get(e) === i && Ne.delete(e);
  }), i;
}
var zs = class extends Zi {
  constructor() {
    super(...arguments), F(this, "_vueApp", null), F(this, "_mountingApp", !1), F(this, "_mountState", "idle"), F(this, "_feedback", null), F(this, "_propsRef", Y({})), F(this, "_errorsRef", Y([])), F(this, "_contentRef", Y(null)), F(this, "_hostVisibilityRef", Y(null)), F(this, "_bridgeAbort", null);
  }
  /**
   * Override to provide Vue-specific configuration.
   */
  static get vueConfig() {
    throw new Error("WippyVueElement subclass must override static get vueConfig()");
  }
  /** Prepare the implementation without creating a Vue or Pinia instance. */
  static async preloadImplementation() {
    const e = this.vueConfig;
    e.mountLifecycle && !e.rootComponent && e.lazyConfig && await At(this, e.lazyConfig);
  }
  /** Undefined on configurations that use only the legacy load event. */
  get wippyMountState() {
    return this.constructor.vueConfig.mountLifecycle ? this._mountState : void 0;
  }
  onMount(e, t, n, i, r, o) {
    const a = this.constructor, l = a.vueConfig, s = new AbortController();
    this._bridgeAbort = s;
    const u = () => !s.signal.aborted && this._bridgeAbort === s;
    this._mountState = "mounting", this._propsRef.value = n, this._errorsRef.value = i, this._contentRef.value = r ?? null, this._hostVisibilityRef.value = this.hostVisible;
    for (const c of i)
      if (this.emitEvent("invalid", { message: c }), !u())
        return;
    this.reactive.props.subscribe((c, m) => {
      this._propsRef.value = c, this._errorsRef.value = [...m];
      for (const p of m)
        this.emitEvent("invalid", { message: p });
    }, { signal: s.signal }), this.reactive.content && this.reactive.content.subscribe((c) => {
      this._contentRef.value = c;
    }, { signal: s.signal }), this.reactive.hostVisibility.subscribe((c) => {
      this._hostVisibilityRef.value = c;
    }, { signal: s.signal });
    const d = (c) => {
      if (!u())
        return;
      const m = Xi(), p = hi(c.rootComponent);
      let f = !1, g = !1, v, y;
      this._mountingApp = !0;
      try {
        const _ = er();
        if (c.piniaPlugins)
          for (const w of c.piniaPlugins)
            _.use(w);
        p.use(_);
        for (const w of c.plugins ?? [])
          p.use(w);
        if (p.provide(Pn, this._propsRef), p.provide(ir, this._errorsRef), p.provide(On, this.emitEvent.bind(this)), p.provide(rr, this._contentRef), p.provide(Cn, this._hostVisibilityRef), p.provide(or, Ji(this)), p.provide(sr, Qi(this)), p.provide(ar, _n(this)), c.providers?.(p, this), !u())
          return;
        if (y = p.config.errorHandler, l.mountLifecycle && (p.config.errorHandler = (w, h, b) => {
          g || (v = w), g = !0, y?.(w, h, b);
        }), p.mount(t), f = !0, g)
          throw v;
        u() && (this._vueApp = p);
      } finally {
        l.mountLifecycle && f && (p.config.errorHandler = y);
        try {
          f && (g || !u()) && p.unmount();
        } finally {
          wn(m), this._mountingApp = !1;
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
            d(l);
          } catch (c) {
            u() && (this._mountState = "failed", this.emitEvent("error", { message: c instanceof Error ? c.message : String(c), error: c }));
          }
        });
        return;
      }
      try {
        d(l);
      } catch (c) {
        if (u())
          throw this._mountState = "failed", c;
      }
    } else if (l.lazyConfig) {
      const c = t.ownerDocument, m = l.lazyUi;
      m?.surface === "page" && (t.style.blockSize = "100%", t.style.minBlockSize = "0");
      let p = !1, f, g;
      const v = () => {
        clearTimeout(f), clearTimeout(g), this._feedback?.remove(), this._feedback = null;
      };
      s.signal.addEventListener("abort", v, { once: !0 });
      const y = () => {
        if (!u() || p)
          return;
        const b = m ? Et(c, m, !1) : c.createElement("wippy-loading");
        b.setAttribute("no-bg", ""), this._feedback = b, t.appendChild(b);
      }, _ = (b) => {
        if (!u())
          return;
        p = !0, v(), this._mountState = "failed";
        const L = m?.failed ?? (b instanceof Error ? b.message : String(b)), A = m ? Et(c, m, !0) : c.createElement("wippy-error");
        m || (A.setAttribute("title", "Failed to load"), A.setAttribute("message", L)), this._feedback = A, t.appendChild(A), this.emitEvent("error", m ? { message: L, error: b } : { message: L });
      }, w = m?.delay ?? (m?.surface === "compact" ? 200 : 0);
      w > 0 ? f = setTimeout(y, w) : y(), m && (g = setTimeout(() => _(new Error("The component did not load in time.")), m.timeout ?? 3e4)), (l.mountLifecycle ? At(a, l.lazyConfig) : l.lazyConfig()).then((b) => {
        !u() || p || (p = !0, v(), d(b));
      }, (b) => {
        p || _(b);
      }).catch(_);
    } else
      throw this._mountState = "failed", new Error("WippyVueElement vueConfig must provide rootComponent or lazyConfig");
  }
  onUnmount() {
    this._bridgeAbort?.abort(), this._bridgeAbort = null, this._mountState = "idle", this._feedback?.remove(), this._feedback = null;
    const e = this._vueApp;
    this._vueApp = null, e?.unmount();
  }
}, ur = Object.defineProperty, It = Object.getOwnPropertySymbols, cr = Object.prototype.hasOwnProperty, dr = Object.prototype.propertyIsEnumerable, Nt = (e, t, n) => t in e ? ur(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n, mr = (e, t) => {
  for (var n in t || (t = {})) cr.call(t, n) && Nt(e, n, t[n]);
  if (It) for (var n of It(t)) dr.call(t, n) && Nt(e, n, t[n]);
  return e;
};
function Ee(e) {
  return e == null || e === "" || Array.isArray(e) && e.length === 0 || !(e instanceof Date) && typeof e == "object" && Object.keys(e).length === 0;
}
function mt(e) {
  return typeof e == "function" && "call" in e && "apply" in e;
}
function k(e) {
  return !Ee(e);
}
function B(e, t = !0) {
  return e instanceof Object && e.constructor === Object && (t || Object.keys(e).length !== 0);
}
function Tn(e = {}, t = {}) {
  let n = mr({}, e);
  return Object.keys(t).forEach((i) => {
    let r = i;
    B(t[r]) && r in e && B(e[r]) ? n[r] = Tn(e[r], t[r]) : n[r] = t[r];
  }), n;
}
function pr(...e) {
  return e.reduce((t, n, i) => i === 0 ? n : Tn(t, n), {});
}
function R(e, ...t) {
  return mt(e) ? e(...t) : e;
}
function V(e, t = !0) {
  return typeof e == "string" && (t || e !== "");
}
function U(e) {
  return V(e) ? e.replace(/(-|_)/g, "").toLowerCase() : e;
}
function pt(e, t = "", n = {}) {
  let i = U(t).split("."), r = i.shift();
  if (r) {
    if (B(e)) {
      let o = Object.keys(e).find((a) => U(a) === r) || "";
      return pt(R(e[o], n), i.join("."), n);
    }
    return;
  }
  return R(e, n);
}
function kn(e, t = !0) {
  return Array.isArray(e) && (t || e.length !== 0);
}
function fr(e) {
  return k(e) && !isNaN(e);
}
function ae(e, t) {
  if (t) {
    let n = t.test(e);
    return t.lastIndex = 0, n;
  }
  return !1;
}
function hr(...e) {
  return pr(...e);
}
function Se(e) {
  return e && e.replace(/\/\*(?:(?!\*\/)[\s\S])*\*\/|[\r\n\t]+/g, "").replace(/ {2,}/g, " ").replace(/ ([{:}]) /g, "$1").replace(/([;,]) /g, "$1").replace(/ !/g, "!").replace(/: /g, ":").trim();
}
function vr(e) {
  return V(e, !1) ? e[0].toUpperCase() + e.slice(1) : e;
}
function Ln(e) {
  return V(e) ? e.replace(/(_)/g, "-").replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase() : e;
}
function ft() {
  let e = /* @__PURE__ */ new Map();
  return { on(t, n) {
    let i = e.get(t);
    return i ? i.push(n) : i = [n], e.set(t, i), this;
  }, off(t, n) {
    let i = e.get(t);
    return i && i.splice(i.indexOf(n) >>> 0, 1), this;
  }, emit(t, n) {
    let i = e.get(t);
    i && i.forEach((r) => {
      r(n);
    });
  }, clear() {
    e.clear();
  } };
}
function ht(...e) {
  if (e) {
    let t = [];
    for (let n = 0; n < e.length; n++) {
      let i = e[n];
      if (!i) continue;
      let r = typeof i;
      if (r === "string" || r === "number") t.push(i);
      else if (r === "object") {
        let o = Array.isArray(i) ? [ht(...i)] : Object.entries(i).map(([a, l]) => l ? a : void 0);
        t = o.length ? t.concat(o.filter((a) => !!a)) : t;
      }
    }
    return t.join(" ").trim();
  }
}
function gr(e, t) {
  return e ? e.classList ? e.classList.contains(t) : new RegExp("(^| )" + t + "( |$)", "gi").test(e.className) : !1;
}
function yr(e, t) {
  if (e && t) {
    let n = (i) => {
      gr(e, i) || (e.classList ? e.classList.add(i) : e.className += " " + i);
    };
    [t].flat().filter(Boolean).forEach((i) => i.split(" ").forEach(n));
  }
}
function Qe(e, t) {
  if (e && t) {
    let n = (i) => {
      e.classList ? e.classList.remove(i) : e.className = e.className.replace(new RegExp("(^|\\b)" + i.split(" ").join("|") + "(\\b|$)", "gi"), " ");
    };
    [t].flat().filter(Boolean).forEach((i) => i.split(" ").forEach(n));
  }
}
function jt(e) {
  for (let t of document?.styleSheets) try {
    for (let n of t?.cssRules) for (let i of n?.style) if (e.test(i)) return { name: i, value: n.style.getPropertyValue(i).trim() };
  } catch {
  }
  return null;
}
function br(e) {
  let t = { width: 0, height: 0 };
  if (e) {
    let [n, i] = [e.style.visibility, e.style.display], r = e.getBoundingClientRect();
    e.style.visibility = "hidden", e.style.display = "block", t.width = r.width || e.offsetWidth, t.height = r.height || e.offsetHeight, e.style.display = i, e.style.visibility = n;
  }
  return t;
}
function _r() {
  let e = window, t = document, n = t.documentElement, i = t.getElementsByTagName("body")[0], r = e.innerWidth || n.clientWidth || i.clientWidth, o = e.innerHeight || n.clientHeight || i.clientHeight;
  return { width: r, height: o };
}
function it(e) {
  return e ? Math.abs(e.scrollLeft) : 0;
}
function Sr() {
  let e = document.documentElement;
  return (window.pageXOffset || it(e)) - (e.clientLeft || 0);
}
function wr() {
  let e = document.documentElement;
  return (window.pageYOffset || e.scrollTop) - (e.clientTop || 0);
}
function $r(e) {
  return e ? getComputedStyle(e).direction === "rtl" : !1;
}
function Or(e, t, n = !0) {
  var i, r, o, a;
  if (e) {
    let l = e.offsetParent ? { width: e.offsetWidth, height: e.offsetHeight } : br(e), s = l.height, u = l.width, d = t.offsetHeight, c = t.offsetWidth, m = t.getBoundingClientRect(), p = wr(), f = Sr(), g = _r(), v, y, _ = "top";
    m.top + d + s > g.height ? (v = m.top + p - s, _ = "bottom", v < 0 && (v = p)) : v = d + m.top + p, m.left + u > g.width ? y = Math.max(0, m.left + f + c - u) : y = m.left + f, $r(e) ? e.style.insetInlineEnd = y + "px" : e.style.insetInlineStart = y + "px", e.style.top = v + "px", e.style.transformOrigin = _, n && (e.style.marginTop = _ === "bottom" ? `calc(${(r = (i = jt(/-anchor-gutter$/)) == null ? void 0 : i.value) != null ? r : "2px"} * -1)` : (a = (o = jt(/-anchor-gutter$/)) == null ? void 0 : o.value) != null ? a : "");
  }
}
function Pr(e, t) {
  e && (typeof t == "string" ? e.style.cssText = t : Object.entries(t || {}).forEach(([n, i]) => e.style[n] = i));
}
function Be(e, t) {
  return e instanceof HTMLElement ? e.offsetWidth : 0;
}
function xn(e) {
  if (e) {
    let t = e.parentNode;
    return t && t instanceof ShadowRoot && t.host && (t = t.host), t;
  }
  return null;
}
function Cr(e) {
  return !!(e !== null && typeof e < "u" && e.nodeName && xn(e));
}
function ge(e) {
  return typeof Element < "u" ? e instanceof Element : e !== null && typeof e == "object" && e.nodeType === 1 && typeof e.nodeName == "string";
}
function Us() {
  if (window.getSelection) {
    let e = window.getSelection() || {};
    e.empty ? e.empty() : e.removeAllRanges && e.rangeCount > 0 && e.getRangeAt(0).getClientRects().length > 0 && e.removeAllRanges();
  }
}
function We(e, t = {}) {
  if (ge(e)) {
    let n = (i, r) => {
      var o, a;
      let l = (o = e?.$attrs) != null && o[i] ? [(a = e?.$attrs) == null ? void 0 : a[i]] : [];
      return [r].flat().reduce((s, u) => {
        if (u != null) {
          let d = typeof u;
          if (d === "string" || d === "number") s.push(u);
          else if (d === "object") {
            let c = Array.isArray(u) ? n(i, u) : Object.entries(u).map(([m, p]) => i === "style" && (p || p === 0) ? `${m.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase()}:${p}` : p ? m : void 0);
            s = c.length ? s.concat(c.filter((m) => !!m)) : s;
          }
        }
        return s;
      }, l);
    };
    Object.entries(t).forEach(([i, r]) => {
      if (r != null) {
        let o = i.match(/^on(.+)/);
        o ? e.addEventListener(o[1].toLowerCase(), r) : i === "p-bind" || i === "pBind" ? We(e, r) : (r = i === "class" ? [...new Set(n("class", r))].join(" ").trim() : i === "style" ? n("style", r).join(";").trim() : r, (e.$attrs = e.$attrs || {}) && (e.$attrs[i] = r), e.setAttribute(i, r));
      }
    });
  }
}
function Tr(e, t = {}, ...n) {
  {
    let i = document.createElement(e);
    return We(i, t), i.append(...n), i;
  }
}
function je(e, t) {
  return ge(e) ? Array.from(e.querySelectorAll(t)) : [];
}
function Fe(e, t) {
  return ge(e) ? e.matches(t) ? e : e.querySelector(t) : null;
}
function Re(e, t) {
  e && document.activeElement !== e && e.focus(t);
}
function kr(e, t) {
  if (ge(e)) {
    let n = e.getAttribute(t);
    return isNaN(n) ? n === "true" || n === "false" ? n === "true" : n : +n;
  }
}
function Rt(e) {
  if (e) {
    let t = e.offsetHeight, n = getComputedStyle(e);
    return t -= parseFloat(n.paddingTop) + parseFloat(n.paddingBottom) + parseFloat(n.borderTopWidth) + parseFloat(n.borderBottomWidth), t;
  }
  return 0;
}
function Lr(e) {
  if (e) {
    let t = e.getBoundingClientRect();
    return { top: t.top + (window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0), left: t.left + (window.pageXOffset || it(document.documentElement) || it(document.body) || 0) };
  }
  return { top: "auto", left: "auto" };
}
function xr(e, t) {
  return e ? e.offsetHeight : 0;
}
function En(e, t = []) {
  let n = xn(e);
  return n === null ? t : En(n, t.concat([n]));
}
function Er(e) {
  let t = [];
  if (e) {
    let n = En(e), i = /(auto|scroll)/, r = (o) => {
      try {
        let a = window.getComputedStyle(o, null);
        return i.test(a.getPropertyValue("overflow")) || i.test(a.getPropertyValue("overflowX")) || i.test(a.getPropertyValue("overflowY"));
      } catch {
        return !1;
      }
    };
    for (let o of n) {
      let a = o.nodeType === 1 && o.dataset.scrollselectors;
      if (a) {
        let l = a.split(",");
        for (let s of l) {
          let u = Fe(o, s);
          u && r(u) && t.push(u);
        }
      }
      o.nodeType !== 9 && r(o) && t.push(o);
    }
  }
  return t;
}
function Bs() {
  if (window.getSelection) return window.getSelection().toString();
  if (document.getSelection) return document.getSelection().toString();
}
function Vt(e) {
  if (e) {
    let t = e.offsetWidth, n = getComputedStyle(e);
    return t -= parseFloat(n.paddingLeft) + parseFloat(n.paddingRight) + parseFloat(n.borderLeftWidth) + parseFloat(n.borderRightWidth), t;
  }
  return 0;
}
function An() {
  return !!(typeof window < "u" && window.document && window.document.createElement);
}
function Ar() {
  return "ontouchstart" in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
}
function Ir(e, t = "", n) {
  ge(e) && n !== null && n !== void 0 && e.setAttribute(t, n);
}
var Ve = {};
function Nr(e = "pui_id_") {
  return Object.hasOwn(Ve, e) || (Ve[e] = 0), Ve[e]++, `${e}${Ve[e]}`;
}
function jr() {
  let e = [], t = (a, l, s = 999) => {
    let u = r(a, l, s), d = u.value + (u.key === a ? 0 : s) + 1;
    return e.push({ key: a, value: d }), d;
  }, n = (a) => {
    e = e.filter((l) => l.value !== a);
  }, i = (a, l) => r(a).value, r = (a, l, s = 0) => [...e].reverse().find((u) => !0) || { key: a, value: s }, o = (a) => a && parseInt(a.style.zIndex, 10) || 0;
  return { get: o, set: (a, l, s) => {
    l && (l.style.zIndex = String(t(a, !0, s)));
  }, clear: (a) => {
    a && (n(o(a)), a.style.zIndex = "");
  }, getCurrent: (a) => i(a) };
}
var Je = jr(), Rr = Object.defineProperty, Vr = Object.defineProperties, Mr = Object.getOwnPropertyDescriptors, Ke = Object.getOwnPropertySymbols, In = Object.prototype.hasOwnProperty, Nn = Object.prototype.propertyIsEnumerable, Mt = (e, t, n) => t in e ? Rr(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n, D = (e, t) => {
  for (var n in t || (t = {})) In.call(t, n) && Mt(e, n, t[n]);
  if (Ke) for (var n of Ke(t)) Nn.call(t, n) && Mt(e, n, t[n]);
  return e;
}, Xe = (e, t) => Vr(e, Mr(t)), K = (e, t) => {
  var n = {};
  for (var i in e) In.call(e, i) && t.indexOf(i) < 0 && (n[i] = e[i]);
  if (e != null && Ke) for (var i of Ke(e)) t.indexOf(i) < 0 && Nn.call(e, i) && (n[i] = e[i]);
  return n;
}, Dr = ft(), I = Dr, we = /{([^}]*)}/g, jn = /(\d+\s+[\+\-\*\/]\s+\d+)/g, Rn = /var\([^)]+\)/g;
function Dt(e) {
  return V(e) ? e.replace(/[A-Z]/g, (t, n) => n === 0 ? t : "." + t.toLowerCase()).toLowerCase() : e;
}
function Hr(e) {
  return B(e) && e.hasOwnProperty("$value") && e.hasOwnProperty("$type") ? e.$value : e;
}
function zr(e) {
  return e.replaceAll(/ /g, "").replace(/[^\w]/g, "-");
}
function rt(e = "", t = "") {
  return zr(`${V(e, !1) && V(t, !1) ? `${e}-` : e}${t}`);
}
function Vn(e = "", t = "") {
  return `--${rt(e, t)}`;
}
function Ur(e = "") {
  let t = (e.match(/{/g) || []).length, n = (e.match(/}/g) || []).length;
  return (t + n) % 2 !== 0;
}
function Mn(e, t = "", n = "", i = [], r) {
  if (V(e)) {
    let o = e.trim();
    if (Ur(o)) return;
    if (ae(o, we)) {
      let a = o.replaceAll(we, (l) => {
        let s = l.replace(/{|}/g, "").split(".").filter((u) => !i.some((d) => ae(u, d)));
        return `var(${Vn(n, Ln(s.join("-")))}${k(r) ? `, ${r}` : ""})`;
      });
      return ae(a.replace(Rn, "0"), jn) ? `calc(${a})` : a;
    }
    return o;
  } else if (fr(e)) return e;
}
function Br(e, t, n) {
  V(t, !1) && e.push(`${t}:${n};`);
}
function pe(e, t) {
  return e ? `${e}{${t}}` : "";
}
function Dn(e, t) {
  if (e.indexOf("dt(") === -1) return e;
  function n(a, l) {
    let s = [], u = 0, d = "", c = null, m = 0;
    for (; u <= a.length; ) {
      let p = a[u];
      if ((p === '"' || p === "'" || p === "`") && a[u - 1] !== "\\" && (c = c === p ? null : p), !c && (p === "(" && m++, p === ")" && m--, (p === "," || u === a.length) && m === 0)) {
        let f = d.trim();
        f.startsWith("dt(") ? s.push(Dn(f, l)) : s.push(i(f)), d = "", u++;
        continue;
      }
      p !== void 0 && (d += p), u++;
    }
    return s;
  }
  function i(a) {
    let l = a[0];
    if ((l === '"' || l === "'" || l === "`") && a[a.length - 1] === l) return a.slice(1, -1);
    let s = Number(a);
    return isNaN(s) ? a : s;
  }
  let r = [], o = [];
  for (let a = 0; a < e.length; a++) if (e[a] === "d" && e.slice(a, a + 3) === "dt(") o.push(a), a += 2;
  else if (e[a] === ")" && o.length > 0) {
    let l = o.pop();
    o.length === 0 && r.push([l, a]);
  }
  if (!r.length) return e;
  for (let a = r.length - 1; a >= 0; a--) {
    let [l, s] = r[a], u = e.slice(l + 3, s), d = n(u, t), c = t(...d);
    e = e.slice(0, l) + c + e.slice(s + 1);
  }
  return e;
}
var le = (...e) => Wr(P.getTheme(), ...e), Wr = (e = {}, t, n, i) => {
  if (t) {
    let { variable: r, options: o } = P.defaults || {}, { prefix: a, transform: l } = e?.options || o || {}, s = ae(t, we) ? t : `{${t}}`;
    return i === "value" || Ee(i) && l === "strict" ? P.getTokenValue(t) : Mn(s, void 0, a, [r.excludedKeyRegex], n);
  }
  return "";
};
function Me(e, ...t) {
  if (e instanceof Array) {
    let n = e.reduce((i, r, o) => {
      var a;
      return i + r + ((a = R(t[o], { dt: le })) != null ? a : "");
    }, "");
    return Dn(n, le);
  }
  return R(e, { dt: le });
}
function Fr(e, t = {}) {
  let n = P.defaults.variable, { prefix: i = n.prefix, selector: r = n.selector, excludedKeyRegex: o = n.excludedKeyRegex } = t, a = [], l = [], s = [{ node: e, path: i }];
  for (; s.length; ) {
    let { node: d, path: c } = s.pop();
    for (let m in d) {
      let p = d[m], f = Hr(p), g = ae(m, o) ? rt(c) : rt(c, Ln(m));
      if (B(f)) s.push({ node: f, path: g });
      else {
        let v = Vn(g), y = Mn(f, g, i, [o]);
        Br(l, v, y);
        let _ = g;
        i && _.startsWith(i + "-") && (_ = _.slice(i.length + 1)), a.push(_.replace(/-/g, "."));
      }
    }
  }
  let u = l.join("");
  return { value: l, tokens: a, declarations: u, css: pe(r, u) };
}
var M = { regex: { rules: { class: { pattern: /^\.([a-zA-Z][\w-]*)$/, resolve(e) {
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
    var i;
    return (i = t.map((r) => r.resolve(n)).find((r) => r.matched)) != null ? i : this.rules.custom.resolve(n);
  });
} }, _toVariables(e, t) {
  return Fr(e, { prefix: t?.prefix });
}, getCommon({ name: e = "", theme: t = {}, params: n, set: i, defaults: r }) {
  var o, a, l, s, u, d, c;
  let { preset: m, options: p } = t, f, g, v, y, _, w, h;
  if (k(m) && p.transform !== "strict") {
    let { primitive: b, semantic: L, extend: A } = m, G = L || {}, { colorScheme: q } = G, ee = K(G, ["colorScheme"]), Z = A || {}, { colorScheme: te } = Z, ne = K(Z, ["colorScheme"]), Q = q || {}, { dark: ie } = Q, ue = K(Q, ["dark"]), re = te || {}, { dark: ce } = re, de = K(re, ["dark"]), W = k(b) ? this._toVariables({ primitive: b }, p) : {}, H = k(ee) ? this._toVariables({ semantic: ee }, p) : {}, oe = k(ue) ? this._toVariables({ light: ue }, p) : {}, Ae = k(ie) ? this._toVariables({ dark: ie }, p) : {}, me = k(ne) ? this._toVariables({ semantic: ne }, p) : {}, _t = k(de) ? this._toVariables({ light: de }, p) : {}, St = k(ce) ? this._toVariables({ dark: ce }, p) : {}, [Gn, qn] = [(o = W.declarations) != null ? o : "", W.tokens], [Zn, Qn] = [(a = H.declarations) != null ? a : "", H.tokens || []], [Jn, Xn] = [(l = oe.declarations) != null ? l : "", oe.tokens || []], [ei, ti] = [(s = Ae.declarations) != null ? s : "", Ae.tokens || []], [ni, ii] = [(u = me.declarations) != null ? u : "", me.tokens || []], [ri, oi] = [(d = _t.declarations) != null ? d : "", _t.tokens || []], [si, ai] = [(c = St.declarations) != null ? c : "", St.tokens || []];
    f = this.transformCSS(e, Gn, "light", "variable", p, i, r), g = qn;
    let li = this.transformCSS(e, `${Zn}${Jn}`, "light", "variable", p, i, r), ui = this.transformCSS(e, `${ei}`, "dark", "variable", p, i, r);
    v = `${li}${ui}`, y = [.../* @__PURE__ */ new Set([...Qn, ...Xn, ...ti])];
    let ci = this.transformCSS(e, `${ni}${ri}color-scheme:light`, "light", "variable", p, i, r), di = this.transformCSS(e, `${si}color-scheme:dark`, "dark", "variable", p, i, r);
    _ = `${ci}${di}`, w = [.../* @__PURE__ */ new Set([...ii, ...oi, ...ai])], h = R(m.css, { dt: le });
  }
  return { primitive: { css: f, tokens: g }, semantic: { css: v, tokens: y }, global: { css: _, tokens: w }, style: h };
}, getPreset({ name: e = "", preset: t = {}, options: n, params: i, set: r, defaults: o, selector: a }) {
  var l, s, u;
  let d, c, m;
  if (k(t) && n.transform !== "strict") {
    let p = e.replace("-directive", ""), f = t, { colorScheme: g, extend: v, css: y } = f, _ = K(f, ["colorScheme", "extend", "css"]), w = v || {}, { colorScheme: h } = w, b = K(w, ["colorScheme"]), L = g || {}, { dark: A } = L, G = K(L, ["dark"]), q = h || {}, { dark: ee } = q, Z = K(q, ["dark"]), te = k(_) ? this._toVariables({ [p]: D(D({}, _), b) }, n) : {}, ne = k(G) ? this._toVariables({ [p]: D(D({}, G), Z) }, n) : {}, Q = k(A) ? this._toVariables({ [p]: D(D({}, A), ee) }, n) : {}, [ie, ue] = [(l = te.declarations) != null ? l : "", te.tokens || []], [re, ce] = [(s = ne.declarations) != null ? s : "", ne.tokens || []], [de, W] = [(u = Q.declarations) != null ? u : "", Q.tokens || []], H = this.transformCSS(p, `${ie}${re}`, "light", "variable", n, r, o, a), oe = this.transformCSS(p, de, "dark", "variable", n, r, o, a);
    d = `${H}${oe}`, c = [.../* @__PURE__ */ new Set([...ue, ...ce, ...W])], m = R(y, { dt: le });
  }
  return { css: d, tokens: c, style: m };
}, getPresetC({ name: e = "", theme: t = {}, params: n, set: i, defaults: r }) {
  var o;
  let { preset: a, options: l } = t, s = (o = a?.components) == null ? void 0 : o[e];
  return this.getPreset({ name: e, preset: s, options: l, params: n, set: i, defaults: r });
}, getPresetD({ name: e = "", theme: t = {}, params: n, set: i, defaults: r }) {
  var o, a;
  let l = e.replace("-directive", ""), { preset: s, options: u } = t, d = ((o = s?.components) == null ? void 0 : o[l]) || ((a = s?.directives) == null ? void 0 : a[l]);
  return this.getPreset({ name: l, preset: d, options: u, params: n, set: i, defaults: r });
}, applyDarkColorScheme(e) {
  return !(e.darkModeSelector === "none" || e.darkModeSelector === !1);
}, getColorSchemeOption(e, t) {
  var n;
  return this.applyDarkColorScheme(e) ? this.regex.resolve(e.darkModeSelector === !0 ? t.options.darkModeSelector : (n = e.darkModeSelector) != null ? n : t.options.darkModeSelector) : [];
}, getLayerOrder(e, t = {}, n, i) {
  let { cssLayer: r } = t;
  return r ? `@layer ${R(r.order || r.name || "primeui", n)}` : "";
}, getCommonStyleSheet({ name: e = "", theme: t = {}, params: n, props: i = {}, set: r, defaults: o }) {
  let a = this.getCommon({ name: e, theme: t, params: n, set: r, defaults: o }), l = Object.entries(i).reduce((s, [u, d]) => s.push(`${u}="${d}"`) && s, []).join(" ");
  return Object.entries(a || {}).reduce((s, [u, d]) => {
    if (B(d) && Object.hasOwn(d, "css")) {
      let c = Se(d.css), m = `${u}-variables`;
      s.push(`<style type="text/css" data-primevue-style-id="${m}" ${l}>${c}</style>`);
    }
    return s;
  }, []).join("");
}, getStyleSheet({ name: e = "", theme: t = {}, params: n, props: i = {}, set: r, defaults: o }) {
  var a;
  let l = { name: e, theme: t, params: n, set: r, defaults: o }, s = (a = e.includes("-directive") ? this.getPresetD(l) : this.getPresetC(l)) == null ? void 0 : a.css, u = Object.entries(i).reduce((d, [c, m]) => d.push(`${c}="${m}"`) && d, []).join(" ");
  return s ? `<style type="text/css" data-primevue-style-id="${e}-variables" ${u}>${Se(s)}</style>` : "";
}, createTokens(e = {}, t, n = "", i = "", r = {}) {
  let o = function(l, s = {}, u = []) {
    if (u.includes(this.path)) return console.warn(`Circular reference detected at ${this.path}`), { colorScheme: l, path: this.path, paths: s, value: void 0 };
    u.push(this.path), s.name = this.path, s.binding || (s.binding = {});
    let d = this.value;
    if (typeof this.value == "string" && we.test(this.value)) {
      let c = this.value.trim().replace(we, (m) => {
        var p;
        let f = m.slice(1, -1), g = this.tokens[f];
        if (!g) return console.warn(`Token not found for path: ${f}`), "__UNRESOLVED__";
        let v = g.computed(l, s, u);
        return Array.isArray(v) && v.length === 2 ? `light-dark(${v[0].value},${v[1].value})` : (p = v?.value) != null ? p : "__UNRESOLVED__";
      });
      d = jn.test(c.replace(Rn, "0")) ? `calc(${c})` : c;
    }
    return Ee(s.binding) && delete s.binding, u.pop(), { colorScheme: l, path: this.path, paths: s, value: d.includes("__UNRESOLVED__") ? void 0 : d };
  }, a = (l, s, u) => {
    Object.entries(l).forEach(([d, c]) => {
      let m = ae(d, t.variable.excludedKeyRegex) ? s : s ? `${s}.${Dt(d)}` : Dt(d), p = u ? `${u}.${d}` : d;
      B(c) ? a(c, m, p) : (r[m] || (r[m] = { paths: [], computed: (f, g = {}, v = []) => {
        if (r[m].paths.length === 1) return r[m].paths[0].computed(r[m].paths[0].scheme, g.binding, v);
        if (f && f !== "none") for (let y = 0; y < r[m].paths.length; y++) {
          let _ = r[m].paths[y];
          if (_.scheme === f) return _.computed(f, g.binding, v);
        }
        return r[m].paths.map((y) => y.computed(y.scheme, g[y.scheme], v));
      } }), r[m].paths.push({ path: p, value: c, scheme: p.includes("colorScheme.light") ? "light" : p.includes("colorScheme.dark") ? "dark" : "none", computed: o, tokens: r }));
    });
  };
  return a(e, n, i), r;
}, getTokenValue(e, t, n) {
  var i;
  let r = ((l) => l.split(".").filter((s) => !ae(s.toLowerCase(), n.variable.excludedKeyRegex)).join("."))(t), o = t.includes("colorScheme.light") ? "light" : t.includes("colorScheme.dark") ? "dark" : void 0, a = [(i = e[r]) == null ? void 0 : i.computed(o)].flat().filter((l) => l);
  return a.length === 1 ? a[0].value : a.reduce((l = {}, s) => {
    let u = s, { colorScheme: d } = u, c = K(u, ["colorScheme"]);
    return l[d] = c, l;
  }, void 0);
}, getSelectorRule(e, t, n, i) {
  return n === "class" || n === "attr" ? pe(k(t) ? `${e}${t},${e} ${t}` : e, i) : pe(e, pe(t ?? ":root,:host", i));
}, transformCSS(e, t, n, i, r = {}, o, a, l) {
  if (k(t)) {
    let { cssLayer: s } = r;
    if (i !== "style") {
      let u = this.getColorSchemeOption(r, a);
      t = n === "dark" ? u.reduce((d, { type: c, selector: m }) => (k(m) && (d += m.includes("[CSS]") ? m.replace("[CSS]", t) : this.getSelectorRule(m, l, c, t)), d), "") : pe(l ?? ":root,:host", t);
    }
    if (s) {
      let u = { name: "primeui" };
      B(s) && (u.name = R(s.name, { name: e, type: i })), k(u.name) && (t = pe(`@layer ${u.name}`, t), o?.layerNames(u.name));
    }
    return t;
  }
  return "";
} }, P = { defaults: { variable: { prefix: "p", selector: ":root,:host", excludedKeyRegex: /^(primitive|semantic|components|directives|variables|colorscheme|light|dark|common|root|states|extend|css)$/gi }, options: { prefix: "p", darkModeSelector: "system", cssLayer: !1 } }, _theme: void 0, _layerNames: /* @__PURE__ */ new Set(), _loadedStyleNames: /* @__PURE__ */ new Set(), _loadingStyles: /* @__PURE__ */ new Set(), _tokens: {}, update(e = {}) {
  let { theme: t } = e;
  t && (this._theme = Xe(D({}, t), { options: D(D({}, this.defaults.options), t.options) }), this._tokens = M.createTokens(this.preset, this.defaults), this.clearLoadedStyleNames());
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
  this.update({ theme: e }), I.emit("theme:change", e);
}, getPreset() {
  return this.preset;
}, setPreset(e) {
  this._theme = Xe(D({}, this.theme), { preset: e }), this._tokens = M.createTokens(e, this.defaults), this.clearLoadedStyleNames(), I.emit("preset:change", e), I.emit("theme:change", this.theme);
}, getOptions() {
  return this.options;
}, setOptions(e) {
  this._theme = Xe(D({}, this.theme), { options: e }), this.clearLoadedStyleNames(), I.emit("options:change", e), I.emit("theme:change", this.theme);
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
  return M.getTokenValue(this.tokens, e, this.defaults);
}, getCommon(e = "", t) {
  return M.getCommon({ name: e, theme: this.theme, params: t, defaults: this.defaults, set: { layerNames: this.setLayerNames.bind(this) } });
}, getComponent(e = "", t) {
  let n = { name: e, theme: this.theme, params: t, defaults: this.defaults, set: { layerNames: this.setLayerNames.bind(this) } };
  return M.getPresetC(n);
}, getDirective(e = "", t) {
  let n = { name: e, theme: this.theme, params: t, defaults: this.defaults, set: { layerNames: this.setLayerNames.bind(this) } };
  return M.getPresetD(n);
}, getCustomPreset(e = "", t, n, i) {
  let r = { name: e, preset: t, options: this.options, selector: n, params: i, defaults: this.defaults, set: { layerNames: this.setLayerNames.bind(this) } };
  return M.getPreset(r);
}, getLayerOrderCSS(e = "") {
  return M.getLayerOrder(e, this.options, { names: this.getLayerNames() }, this.defaults);
}, transformCSS(e = "", t, n = "style", i) {
  return M.transformCSS(e, t, i, n, this.options, { layerNames: this.setLayerNames.bind(this) }, this.defaults);
}, getCommonStyleSheet(e = "", t, n = {}) {
  return M.getCommonStyleSheet({ name: e, theme: this.theme, params: t, props: n, defaults: this.defaults, set: { layerNames: this.setLayerNames.bind(this) } });
}, getStyleSheet(e, t, n = {}) {
  return M.getStyleSheet({ name: e, theme: this.theme, params: t, props: n, defaults: this.defaults, set: { layerNames: this.setLayerNames.bind(this) } });
}, onStyleMounted(e) {
  this._loadingStyles.add(e);
}, onStyleUpdated(e) {
  this._loadingStyles.add(e);
}, onStyleLoaded(e, { name: t }) {
  this._loadingStyles.size && (this._loadingStyles.delete(t), I.emit(`theme:${t}:load`, e), !this._loadingStyles.size && I.emit("theme:load"));
} }, N = {
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
}, Kr = `
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
function $e(e) {
  "@babel/helpers - typeof";
  return $e = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, $e(e);
}
function Ht(e, t) {
  var n = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var i = Object.getOwnPropertySymbols(e);
    t && (i = i.filter(function(r) {
      return Object.getOwnPropertyDescriptor(e, r).enumerable;
    })), n.push.apply(n, i);
  }
  return n;
}
function zt(e) {
  for (var t = 1; t < arguments.length; t++) {
    var n = arguments[t] != null ? arguments[t] : {};
    t % 2 ? Ht(Object(n), !0).forEach(function(i) {
      Yr(e, i, n[i]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : Ht(Object(n)).forEach(function(i) {
      Object.defineProperty(e, i, Object.getOwnPropertyDescriptor(n, i));
    });
  }
  return e;
}
function Yr(e, t, n) {
  return (t = Gr(t)) in e ? Object.defineProperty(e, t, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = n, e;
}
function Gr(e) {
  var t = qr(e, "string");
  return $e(t) == "symbol" ? t : t + "";
}
function qr(e, t) {
  if ($e(e) != "object" || !e) return e;
  var n = e[Symbol.toPrimitive];
  if (n !== void 0) {
    var i = n.call(e, t);
    if ($e(i) != "object") return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
function Zr(e) {
  var t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !0;
  wt() && wt().components ? fn(e) : t ? e() : yi(e);
}
var Qr = 0;
function Jr(e) {
  var t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, n = Y(!1), i = Y(e), r = Y(null), o = An() ? window.document : void 0, a = t.document, l = a === void 0 ? o : a, s = t.immediate, u = s === void 0 ? !0 : s, d = t.manual, c = d === void 0 ? !1 : d, m = t.name, p = m === void 0 ? "style_".concat(++Qr) : m, f = t.id, g = f === void 0 ? void 0 : f, v = t.media, y = v === void 0 ? void 0 : v, _ = t.nonce, w = _ === void 0 ? void 0 : _, h = t.first, b = h === void 0 ? !1 : h, L = t.onMounted, A = L === void 0 ? void 0 : L, G = t.onUpdated, q = G === void 0 ? void 0 : G, ee = t.onLoad, Z = ee === void 0 ? void 0 : ee, te = t.props, ne = te === void 0 ? {} : te, Q = function() {
  }, ie = function(ce) {
    var de = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    if (l) {
      var W = zt(zt({}, ne), de), H = W.name || p, oe = W.id || g, Ae = W.nonce || w;
      r.value = l.querySelector('style[data-primevue-style-id="'.concat(H, '"]')) || l.getElementById(oe) || l.createElement("style"), r.value.isConnected || (i.value = ce || e, We(r.value, {
        type: "text/css",
        id: oe,
        media: y,
        nonce: Ae
      }), b ? l.head.prepend(r.value) : l.head.appendChild(r.value), Ir(r.value, "data-primevue-style-id", H), We(r.value, W), r.value.onload = function(me) {
        return Z?.(me, {
          name: H
        });
      }, A?.(H)), !n.value && (Q = fe(i, function(me) {
        r.value.textContent = me, q?.(H);
      }, {
        immediate: !0
      }), n.value = !0);
    }
  }, ue = function() {
    !l || !n.value || (Q(), Cr(r.value) && l.head.removeChild(r.value), n.value = !1, r.value = null);
  };
  return u && !c && Zr(ie), {
    id: g,
    name: p,
    el: r,
    css: i,
    unload: ue,
    load: ie,
    isLoaded: gi(n)
  };
}
function Oe(e) {
  "@babel/helpers - typeof";
  return Oe = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, Oe(e);
}
var Ut, Bt, Wt, Ft;
function Kt(e, t) {
  return no(e) || to(e, t) || eo(e, t) || Xr();
}
function Xr() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function eo(e, t) {
  if (e) {
    if (typeof e == "string") return Yt(e, t);
    var n = {}.toString.call(e).slice(8, -1);
    return n === "Object" && e.constructor && (n = e.constructor.name), n === "Map" || n === "Set" ? Array.from(e) : n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? Yt(e, t) : void 0;
  }
}
function Yt(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var n = 0, i = Array(t); n < t; n++) i[n] = e[n];
  return i;
}
function to(e, t) {
  var n = e == null ? null : typeof Symbol < "u" && e[Symbol.iterator] || e["@@iterator"];
  if (n != null) {
    var i, r, o, a, l = [], s = !0, u = !1;
    try {
      if (o = (n = n.call(e)).next, t !== 0) for (; !(s = (i = o.call(n)).done) && (l.push(i.value), l.length !== t); s = !0) ;
    } catch (d) {
      u = !0, r = d;
    } finally {
      try {
        if (!s && n.return != null && (a = n.return(), Object(a) !== a)) return;
      } finally {
        if (u) throw r;
      }
    }
    return l;
  }
}
function no(e) {
  if (Array.isArray(e)) return e;
}
function Gt(e, t) {
  var n = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var i = Object.getOwnPropertySymbols(e);
    t && (i = i.filter(function(r) {
      return Object.getOwnPropertyDescriptor(e, r).enumerable;
    })), n.push.apply(n, i);
  }
  return n;
}
function et(e) {
  for (var t = 1; t < arguments.length; t++) {
    var n = arguments[t] != null ? arguments[t] : {};
    t % 2 ? Gt(Object(n), !0).forEach(function(i) {
      io(e, i, n[i]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : Gt(Object(n)).forEach(function(i) {
      Object.defineProperty(e, i, Object.getOwnPropertyDescriptor(n, i));
    });
  }
  return e;
}
function io(e, t, n) {
  return (t = ro(t)) in e ? Object.defineProperty(e, t, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = n, e;
}
function ro(e) {
  var t = oo(e, "string");
  return Oe(t) == "symbol" ? t : t + "";
}
function oo(e, t) {
  if (Oe(e) != "object" || !e) return e;
  var n = e[Symbol.toPrimitive];
  if (n !== void 0) {
    var i = n.call(e, t);
    if (Oe(i) != "object") return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
function De(e, t) {
  return t || (t = e.slice(0)), Object.freeze(Object.defineProperties(e, { raw: { value: Object.freeze(t) } }));
}
var so = function(t) {
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
}, ao = {}, lo = {}, T = {
  name: "base",
  css: so,
  style: Kr,
  classes: ao,
  inlineStyles: lo,
  load: function(t) {
    var n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, i = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : function(o) {
      return o;
    }, r = i(Me(Ut || (Ut = De(["", ""])), t));
    return k(r) ? Jr(Se(r), et({
      name: this.name
    }, n)) : {};
  },
  loadCSS: function() {
    var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    return this.load(this.css, t);
  },
  loadStyle: function() {
    var t = this, n = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, i = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "";
    return this.load(this.style, n, function() {
      var r = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "";
      return P.transformCSS(n.name || t.name, "".concat(r).concat(Me(Bt || (Bt = De(["", ""])), i)));
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
  getPresetTheme: function(t, n, i) {
    return P.getCustomPreset(this.name, t, n, i);
  },
  getLayerOrderThemeCSS: function() {
    return P.getLayerOrderCSS(this.name);
  },
  getStyleSheet: function() {
    var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "", n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    if (this.css) {
      var i = R(this.css, {
        dt: le
      }) || "", r = Se(Me(Wt || (Wt = De(["", "", ""])), i, t)), o = Object.entries(n).reduce(function(a, l) {
        var s = Kt(l, 2), u = s[0], d = s[1];
        return a.push("".concat(u, '="').concat(d, '"')) && a;
      }, []).join(" ");
      return k(r) ? '<style type="text/css" data-primevue-style-id="'.concat(this.name, '" ').concat(o, ">").concat(r, "</style>") : "";
    }
    return "";
  },
  getCommonThemeStyleSheet: function(t) {
    var n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    return P.getCommonStyleSheet(this.name, t, n);
  },
  getThemeStyleSheet: function(t) {
    var n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, i = [P.getStyleSheet(this.name, t, n)];
    if (this.style) {
      var r = this.name === "base" ? "global-style" : "".concat(this.name, "-style"), o = Me(Ft || (Ft = De(["", ""])), R(this.style, {
        dt: le
      })), a = Se(P.transformCSS(r, o)), l = Object.entries(n).reduce(function(s, u) {
        var d = Kt(u, 2), c = d[0], m = d[1];
        return s.push("".concat(c, '="').concat(m, '"')) && s;
      }, []).join(" ");
      k(a) && i.push('<style type="text/css" data-primevue-style-id="'.concat(r, '" ').concat(l, ">").concat(a, "</style>"));
    }
    return i.join("");
  },
  extend: function(t) {
    return et(et({}, this), {}, {
      css: void 0,
      style: void 0
    }, t);
  }
}, X = ft();
function Pe(e) {
  "@babel/helpers - typeof";
  return Pe = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, Pe(e);
}
function qt(e, t) {
  var n = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var i = Object.getOwnPropertySymbols(e);
    t && (i = i.filter(function(r) {
      return Object.getOwnPropertyDescriptor(e, r).enumerable;
    })), n.push.apply(n, i);
  }
  return n;
}
function He(e) {
  for (var t = 1; t < arguments.length; t++) {
    var n = arguments[t] != null ? arguments[t] : {};
    t % 2 ? qt(Object(n), !0).forEach(function(i) {
      uo(e, i, n[i]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : qt(Object(n)).forEach(function(i) {
      Object.defineProperty(e, i, Object.getOwnPropertyDescriptor(n, i));
    });
  }
  return e;
}
function uo(e, t, n) {
  return (t = co(t)) in e ? Object.defineProperty(e, t, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = n, e;
}
function co(e) {
  var t = mo(e, "string");
  return Pe(t) == "symbol" ? t : t + "";
}
function mo(e, t) {
  if (Pe(e) != "object" || !e) return e;
  var n = e[Symbol.toPrimitive];
  if (n !== void 0) {
    var i = n.call(e, t);
    if (Pe(i) != "object") return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var po = {
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
    text: [N.STARTS_WITH, N.CONTAINS, N.NOT_CONTAINS, N.ENDS_WITH, N.EQUALS, N.NOT_EQUALS],
    numeric: [N.EQUALS, N.NOT_EQUALS, N.LESS_THAN, N.LESS_THAN_OR_EQUAL_TO, N.GREATER_THAN, N.GREATER_THAN_OR_EQUAL_TO],
    date: [N.DATE_IS, N.DATE_IS_NOT, N.DATE_BEFORE, N.DATE_AFTER]
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
}, fo = Symbol();
function ho(e, t) {
  var n = {
    config: bi(t)
  };
  return e.config.globalProperties.$primevue = n, e.provide(fo, n), vo(), go(e, n), n;
}
var he = [];
function vo() {
  I.clear(), he.forEach(function(e) {
    return e?.();
  }), he = [];
}
function go(e, t) {
  var n = Y(!1), i = function() {
    var u;
    if (((u = t.config) === null || u === void 0 ? void 0 : u.theme) !== "none" && !P.isStyleNameLoaded("common")) {
      var d, c, m = ((d = T.getCommonTheme) === null || d === void 0 ? void 0 : d.call(T)) || {}, p = m.primitive, f = m.semantic, g = m.global, v = m.style, y = {
        nonce: (c = t.config) === null || c === void 0 || (c = c.csp) === null || c === void 0 ? void 0 : c.nonce
      };
      T.load(p?.css, He({
        name: "primitive-variables"
      }, y)), T.load(f?.css, He({
        name: "semantic-variables"
      }, y)), T.load(g?.css, He({
        name: "global-variables"
      }, y)), T.loadStyle(He({
        name: "global-style"
      }, y), v), P.setLoadedStyleName("common");
    }
  };
  I.on("theme:change", function(s) {
    n.value || (e.config.globalProperties.$primevue.config.theme = s, n.value = !0);
  });
  var r = fe(t.config, function(s, u) {
    X.emit("config:change", {
      newValue: s,
      oldValue: u
    });
  }, {
    immediate: !0,
    deep: !0
  }), o = fe(function() {
    return t.config.ripple;
  }, function(s, u) {
    X.emit("config:ripple:change", {
      newValue: s,
      oldValue: u
    });
  }, {
    immediate: !0,
    deep: !0
  }), a = fe(function() {
    return t.config.theme;
  }, function(s, u) {
    n.value || P.setTheme(s), t.config.unstyled || i(), n.value = !1, X.emit("config:theme:change", {
      newValue: s,
      oldValue: u
    });
  }, {
    immediate: !0,
    deep: !1
  }), l = fe(function() {
    return t.config.unstyled;
  }, function(s, u) {
    !s && t.config.theme && i(), X.emit("config:unstyled:change", {
      newValue: s,
      oldValue: u
    });
  }, {
    immediate: !0,
    deep: !0
  });
  he.push(r), he.push(o), he.push(a), he.push(l);
}
var yo = {
  install: function(t, n) {
    var i = hr(po, n);
    ho(t, i);
  }
}, vt = {
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
    this.mounted = An();
  },
  computed: {
    inline: function() {
      return this.disabled || this.appendTo === "self";
    }
  }
};
function bo(e, t, n, i, r, o) {
  return o.inline ? se(e.$slots, "default", {
    key: 0
  }) : r.mounted ? (x(), ve(hn, {
    key: 1,
    to: n.appendTo
  }, [se(e.$slots, "default")], 8, ["to"])) : z("", !0);
}
vt.render = bo;
var J = {
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
function _o() {
  var e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "pc", t = _i();
  return "".concat(e).concat(t.replace("v-", "").replaceAll("-", "_"));
}
var Zt = T.extend({
  name: "common"
});
function Ce(e) {
  "@babel/helpers - typeof";
  return Ce = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, Ce(e);
}
function So(e) {
  return Un(e) || wo(e) || zn(e) || Hn();
}
function wo(e) {
  if (typeof Symbol < "u" && e[Symbol.iterator] != null || e["@@iterator"] != null) return Array.from(e);
}
function be(e, t) {
  return Un(e) || $o(e, t) || zn(e, t) || Hn();
}
function Hn() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function zn(e, t) {
  if (e) {
    if (typeof e == "string") return ot(e, t);
    var n = {}.toString.call(e).slice(8, -1);
    return n === "Object" && e.constructor && (n = e.constructor.name), n === "Map" || n === "Set" ? Array.from(e) : n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? ot(e, t) : void 0;
  }
}
function ot(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var n = 0, i = Array(t); n < t; n++) i[n] = e[n];
  return i;
}
function $o(e, t) {
  var n = e == null ? null : typeof Symbol < "u" && e[Symbol.iterator] || e["@@iterator"];
  if (n != null) {
    var i, r, o, a, l = [], s = !0, u = !1;
    try {
      if (o = (n = n.call(e)).next, t === 0) {
        if (Object(n) !== n) return;
        s = !1;
      } else for (; !(s = (i = o.call(n)).done) && (l.push(i.value), l.length !== t); s = !0) ;
    } catch (d) {
      u = !0, r = d;
    } finally {
      try {
        if (!s && n.return != null && (a = n.return(), Object(a) !== a)) return;
      } finally {
        if (u) throw r;
      }
    }
    return l;
  }
}
function Un(e) {
  if (Array.isArray(e)) return e;
}
function Qt(e, t) {
  var n = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var i = Object.getOwnPropertySymbols(e);
    t && (i = i.filter(function(r) {
      return Object.getOwnPropertyDescriptor(e, r).enumerable;
    })), n.push.apply(n, i);
  }
  return n;
}
function $(e) {
  for (var t = 1; t < arguments.length; t++) {
    var n = arguments[t] != null ? arguments[t] : {};
    t % 2 ? Qt(Object(n), !0).forEach(function(i) {
      _e(e, i, n[i]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : Qt(Object(n)).forEach(function(i) {
      Object.defineProperty(e, i, Object.getOwnPropertyDescriptor(n, i));
    });
  }
  return e;
}
function _e(e, t, n) {
  return (t = Oo(t)) in e ? Object.defineProperty(e, t, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = n, e;
}
function Oo(e) {
  var t = Po(e, "string");
  return Ce(t) == "symbol" ? t : t + "";
}
function Po(e, t) {
  if (Ce(e) != "object" || !e) return e;
  var n = e[Symbol.toPrimitive];
  if (n !== void 0) {
    var i = n.call(e, t);
    if (Ce(i) != "object") return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var gt = {
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
        I.off("theme:change", this._loadCoreStyles), t || (this._loadCoreStyles(), this._themeChangeListener(this._loadCoreStyles));
      }
    },
    dt: {
      immediate: !0,
      handler: function(t, n) {
        var i = this;
        I.off("theme:change", this._themeScopedListener), t ? (this._loadScopedThemeStyles(t), this._themeScopedListener = function() {
          return i._loadScopedThemeStyles(t);
        }, this._themeChangeListener(this._themeScopedListener)) : this._unloadScopedThemeStyles();
      }
    }
  },
  scopedStyleEl: void 0,
  rootEl: void 0,
  uid: void 0,
  $attrSelector: void 0,
  beforeCreate: function() {
    var t, n, i, r, o, a, l, s, u, d, c, m = (t = this.pt) === null || t === void 0 ? void 0 : t._usept, p = m ? (n = this.pt) === null || n === void 0 || (n = n.originalValue) === null || n === void 0 ? void 0 : n[this.$.type.name] : void 0, f = m ? (i = this.pt) === null || i === void 0 || (i = i.value) === null || i === void 0 ? void 0 : i[this.$.type.name] : this.pt;
    (r = f || p) === null || r === void 0 || (r = r.hooks) === null || r === void 0 || (o = r.onBeforeCreate) === null || o === void 0 || o.call(r);
    var g = (a = this.$primevueConfig) === null || a === void 0 || (a = a.pt) === null || a === void 0 ? void 0 : a._usept, v = g ? (l = this.$primevue) === null || l === void 0 || (l = l.config) === null || l === void 0 || (l = l.pt) === null || l === void 0 ? void 0 : l.originalValue : void 0, y = g ? (s = this.$primevue) === null || s === void 0 || (s = s.config) === null || s === void 0 || (s = s.pt) === null || s === void 0 ? void 0 : s.value : (u = this.$primevue) === null || u === void 0 || (u = u.config) === null || u === void 0 ? void 0 : u.pt;
    (d = y || v) === null || d === void 0 || (d = d[this.$.type.name]) === null || d === void 0 || (d = d.hooks) === null || d === void 0 || (c = d.onBeforeCreate) === null || c === void 0 || c.call(d), this.$attrSelector = _o(), this.uid = this.$attrs.id || this.$attrSelector.replace("pc", "pv_id_");
  },
  created: function() {
    this._hook("onCreated");
  },
  beforeMount: function() {
    var t;
    this.rootEl = Fe(ge(this.$el) ? this.$el : (t = this.$el) === null || t === void 0 ? void 0 : t.parentElement, "[".concat(this.$attrSelector, "]")), this.rootEl && (this.rootEl.$pc = $({
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
        var n = this._usePT(this._getPT(this.pt, this.$.type.name), this._getOptionValue, "hooks.".concat(t)), i = this._useDefaultPT(this._getOptionValue, "hooks.".concat(t));
        n?.(), i?.();
      }
    },
    _mergeProps: function(t) {
      for (var n = arguments.length, i = new Array(n > 1 ? n - 1 : 0), r = 1; r < n; r++)
        i[r - 1] = arguments[r];
      return mt(t) ? t.apply(void 0, i) : E.apply(void 0, i);
    },
    _load: function() {
      J.isStyleNameLoaded("base") || (T.loadCSS(this.$styleOptions), this._loadGlobalStyles(), J.setLoadedStyleName("base")), this._loadThemeStyles();
    },
    _loadStyles: function() {
      this._load(), this._themeChangeListener(this._load);
    },
    _loadCoreStyles: function() {
      var t, n;
      !J.isStyleNameLoaded((t = this.$style) === null || t === void 0 ? void 0 : t.name) && (n = this.$style) !== null && n !== void 0 && n.name && (Zt.loadCSS(this.$styleOptions), this.$options.style && this.$style.loadCSS(this.$styleOptions), J.setLoadedStyleName(this.$style.name));
    },
    _loadGlobalStyles: function() {
      var t = this._useGlobalPT(this._getOptionValue, "global.css", this.$params);
      k(t) && T.load(t, $({
        name: "global"
      }, this.$styleOptions));
    },
    _loadThemeStyles: function() {
      var t, n;
      if (!(this.isUnstyled || this.$theme === "none")) {
        if (!P.isStyleNameLoaded("common")) {
          var i, r, o = ((i = this.$style) === null || i === void 0 || (r = i.getCommonTheme) === null || r === void 0 ? void 0 : r.call(i)) || {}, a = o.primitive, l = o.semantic, s = o.global, u = o.style;
          T.load(a?.css, $({
            name: "primitive-variables"
          }, this.$styleOptions)), T.load(l?.css, $({
            name: "semantic-variables"
          }, this.$styleOptions)), T.load(s?.css, $({
            name: "global-variables"
          }, this.$styleOptions)), T.loadStyle($({
            name: "global-style"
          }, this.$styleOptions), u), P.setLoadedStyleName("common");
        }
        if (!P.isStyleNameLoaded((t = this.$style) === null || t === void 0 ? void 0 : t.name) && (n = this.$style) !== null && n !== void 0 && n.name) {
          var d, c, m, p, f = ((d = this.$style) === null || d === void 0 || (c = d.getComponentTheme) === null || c === void 0 ? void 0 : c.call(d)) || {}, g = f.css, v = f.style;
          (m = this.$style) === null || m === void 0 || m.load(g, $({
            name: "".concat(this.$style.name, "-variables")
          }, this.$styleOptions)), (p = this.$style) === null || p === void 0 || p.loadStyle($({
            name: "".concat(this.$style.name, "-style")
          }, this.$styleOptions), v), P.setLoadedStyleName(this.$style.name);
        }
        if (!P.isStyleNameLoaded("layer-order")) {
          var y, _, w = (y = this.$style) === null || y === void 0 || (_ = y.getLayerOrderThemeCSS) === null || _ === void 0 ? void 0 : _.call(y);
          T.load(w, $({
            name: "layer-order",
            first: !0
          }, this.$styleOptions)), P.setLoadedStyleName("layer-order");
        }
      }
    },
    _loadScopedThemeStyles: function(t) {
      var n, i, r, o = ((n = this.$style) === null || n === void 0 || (i = n.getPresetTheme) === null || i === void 0 ? void 0 : i.call(n, t, "[".concat(this.$attrSelector, "]"))) || {}, a = o.css, l = (r = this.$style) === null || r === void 0 ? void 0 : r.load(a, $({
        name: "".concat(this.$attrSelector, "-").concat(this.$style.name)
      }, this.$styleOptions));
      this.scopedStyleEl = l.el;
    },
    _unloadScopedThemeStyles: function() {
      var t;
      (t = this.scopedStyleEl) === null || t === void 0 || (t = t.value) === null || t === void 0 || t.remove();
    },
    _themeChangeListener: function() {
      var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : function() {
      };
      J.clearLoadedStyleNames(), I.on("theme:change", t);
    },
    _removeThemeListeners: function() {
      I.off("theme:change", this._loadCoreStyles), I.off("theme:change", this._load), I.off("theme:change", this._themeScopedListener);
    },
    _getHostInstance: function(t) {
      return t ? this.$options.hostName ? t.$.type.name === this.$options.hostName ? t : this._getHostInstance(t.$parentInstance) : t.$parentInstance : void 0;
    },
    _getPropValue: function(t) {
      var n;
      return this[t] || ((n = this._getHostInstance(this)) === null || n === void 0 ? void 0 : n[t]);
    },
    _getOptionValue: function(t) {
      var n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "", i = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
      return pt(t, n, i);
    },
    _getPTValue: function() {
      var t, n = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, i = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "", r = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {}, o = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : !0, a = /./g.test(i) && !!r[i.split(".")[0]], l = this._getPropValue("ptOptions") || ((t = this.$primevueConfig) === null || t === void 0 ? void 0 : t.ptOptions) || {}, s = l.mergeSections, u = s === void 0 ? !0 : s, d = l.mergeProps, c = d === void 0 ? !1 : d, m = o ? a ? this._useGlobalPT(this._getPTClassValue, i, r) : this._useDefaultPT(this._getPTClassValue, i, r) : void 0, p = a ? void 0 : this._getPTSelf(n, this._getPTClassValue, i, $($({}, r), {}, {
        global: m || {}
      })), f = this._getPTDatasets(i);
      return u || !u && p ? c ? this._mergeProps(c, m, p, f) : $($($({}, m), p), f) : $($({}, p), f);
    },
    _getPTSelf: function() {
      for (var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, n = arguments.length, i = new Array(n > 1 ? n - 1 : 0), r = 1; r < n; r++)
        i[r - 1] = arguments[r];
      return E(
        this._usePT.apply(this, [this._getPT(t, this.$name)].concat(i)),
        // Exp; <component :pt="{}"
        this._usePT.apply(this, [this.$_attrsPT].concat(i))
        // Exp; <component :pt:[passthrough_key]:[attribute]="{value}" or <component :pt:[passthrough_key]="() =>{value}"
      );
    },
    _getPTDatasets: function() {
      var t, n, i = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "", r = "data-pc-", o = i === "root" && k((t = this.pt) === null || t === void 0 ? void 0 : t["data-pc-section"]);
      return i !== "transition" && $($({}, i === "root" && $($(_e({}, "".concat(r, "name"), U(o ? (n = this.pt) === null || n === void 0 ? void 0 : n["data-pc-section"] : this.$.type.name)), o && _e({}, "".concat(r, "extend"), U(this.$.type.name))), {}, _e({}, "".concat(this.$attrSelector), ""))), {}, _e({}, "".concat(r, "section"), U(i)));
    },
    _getPTClassValue: function() {
      var t = this._getOptionValue.apply(this, arguments);
      return V(t) || kn(t) ? {
        class: t
      } : t;
    },
    _getPT: function(t) {
      var n = this, i = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "", r = arguments.length > 2 ? arguments[2] : void 0, o = function(l) {
        var s, u = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !1, d = r ? r(l) : l, c = U(i), m = U(n.$name);
        return (s = u ? c !== m ? d?.[c] : void 0 : d?.[c]) !== null && s !== void 0 ? s : d;
      };
      return t != null && t.hasOwnProperty("_usept") ? {
        _usept: t._usept,
        originalValue: o(t.originalValue),
        value: o(t.value)
      } : o(t, !0);
    },
    _usePT: function(t, n, i, r) {
      var o = function(g) {
        return n(g, i, r);
      };
      if (t != null && t.hasOwnProperty("_usept")) {
        var a, l = t._usept || ((a = this.$primevueConfig) === null || a === void 0 ? void 0 : a.ptOptions) || {}, s = l.mergeSections, u = s === void 0 ? !0 : s, d = l.mergeProps, c = d === void 0 ? !1 : d, m = o(t.originalValue), p = o(t.value);
        return m === void 0 && p === void 0 ? void 0 : V(p) ? p : V(m) ? m : u || !u && p ? c ? this._mergeProps(c, m, p) : $($({}, m), p) : p;
      }
      return o(t);
    },
    _useGlobalPT: function(t, n, i) {
      return this._usePT(this.globalPT, t, n, i);
    },
    _useDefaultPT: function(t, n, i) {
      return this._usePT(this.defaultPT, t, n, i);
    },
    ptm: function() {
      var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "", n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
      return this._getPTValue(this.pt, t, $($({}, this.$params), n));
    },
    ptmi: function() {
      var t, n = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "", i = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, r = E(this.$_attrsWithoutPT, this.ptm(n, i));
      return r?.hasOwnProperty("id") && ((t = r.id) !== null && t !== void 0 || (r.id = this.$id)), r;
    },
    ptmo: function() {
      var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "", i = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
      return this._getPTValue(t, n, $({
        instance: this
      }, i), !1);
    },
    cx: function() {
      var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "", n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
      return this.isUnstyled ? void 0 : this._getOptionValue(this.$style.classes, t, $($({}, this.$params), n));
    },
    sx: function() {
      var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "", n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !0, i = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
      if (n) {
        var r = this._getOptionValue(this.$style.inlineStyles, t, $($({}, this.$params), i)), o = this._getOptionValue(Zt.inlineStyles, t, $($({}, this.$params), i));
        return [o, r];
      }
    }
  },
  computed: {
    globalPT: function() {
      var t, n = this;
      return this._getPT((t = this.$primevueConfig) === null || t === void 0 ? void 0 : t.pt, void 0, function(i) {
        return R(i, {
          instance: n
        });
      });
    },
    defaultPT: function() {
      var t, n = this;
      return this._getPT((t = this.$primevueConfig) === null || t === void 0 ? void 0 : t.pt, void 0, function(i) {
        return n._getOptionValue(i, n.$name, $({}, n.$params)) || R(i, $({}, n.$params));
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
      return Object.fromEntries(Object.entries(this.$props).filter(function(i) {
        var r = be(i, 1), o = r[0];
        return n?.includes(o);
      }));
    },
    $theme: function() {
      var t;
      return (t = this.$primevueConfig) === null || t === void 0 ? void 0 : t.theme;
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
        var n = be(t, 1), i = n[0];
        return i?.startsWith("pt:");
      }).reduce(function(t, n) {
        var i = be(n, 2), r = i[0], o = i[1], a = r.split(":"), l = So(a), s = ot(l).slice(1);
        return s?.reduce(function(u, d, c, m) {
          return !u[d] && (u[d] = c === m.length - 1 ? o : {}), u[d];
        }, t), t;
      }, {});
    },
    $_attrsWithoutPT: function() {
      return Object.entries(this.$attrs || {}).filter(function(t) {
        var n = be(t, 1), i = n[0];
        return !(i != null && i.startsWith("pt:"));
      }).reduce(function(t, n) {
        var i = be(n, 2), r = i[0], o = i[1];
        return t[r] = o, t;
      }, {});
    }
  }
}, Co = `
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
`, To = {
  root: function(t) {
    var n = t.instance;
    return ["p-contextmenu p-component", {
      "p-contextmenu-mobile": n.queryMatches
    }];
  },
  rootList: "p-contextmenu-root-list",
  item: function(t) {
    var n = t.instance, i = t.processedItem;
    return ["p-contextmenu-item", {
      "p-contextmenu-item-active": n.isItemActive(i),
      "p-focus": n.isItemFocused(i),
      "p-disabled": n.isItemDisabled(i)
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
  style: Co,
  classes: To
});
var ko = `
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
`, Lo = T.extend({
  name: "baseicon",
  css: ko
});
function Te(e) {
  "@babel/helpers - typeof";
  return Te = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, Te(e);
}
function Jt(e, t) {
  var n = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var i = Object.getOwnPropertySymbols(e);
    t && (i = i.filter(function(r) {
      return Object.getOwnPropertyDescriptor(e, r).enumerable;
    })), n.push.apply(n, i);
  }
  return n;
}
function Xt(e) {
  for (var t = 1; t < arguments.length; t++) {
    var n = arguments[t] != null ? arguments[t] : {};
    t % 2 ? Jt(Object(n), !0).forEach(function(i) {
      xo(e, i, n[i]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : Jt(Object(n)).forEach(function(i) {
      Object.defineProperty(e, i, Object.getOwnPropertyDescriptor(n, i));
    });
  }
  return e;
}
function xo(e, t, n) {
  return (t = Eo(t)) in e ? Object.defineProperty(e, t, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = n, e;
}
function Eo(e) {
  var t = Ao(e, "string");
  return Te(t) == "symbol" ? t : t + "";
}
function Ao(e, t) {
  if (Te(e) != "object" || !e) return e;
  var n = e[Symbol.toPrimitive];
  if (n !== void 0) {
    var i = n.call(e, t);
    if (Te(i) != "object") return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var Ws = {
  name: "BaseIcon",
  extends: gt,
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
  style: Lo,
  provide: function() {
    return {
      $pcIcon: this,
      $parentInstance: this
    };
  },
  methods: {
    pti: function() {
      var t = Ee(this.label);
      return Xt(Xt({}, !this.isUnstyled && {
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
function ke(e) {
  "@babel/helpers - typeof";
  return ke = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, ke(e);
}
function en(e, t) {
  return Ro(e) || jo(e, t) || No(e, t) || Io();
}
function Io() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function No(e, t) {
  if (e) {
    if (typeof e == "string") return tn(e, t);
    var n = {}.toString.call(e).slice(8, -1);
    return n === "Object" && e.constructor && (n = e.constructor.name), n === "Map" || n === "Set" ? Array.from(e) : n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? tn(e, t) : void 0;
  }
}
function tn(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var n = 0, i = Array(t); n < t; n++) i[n] = e[n];
  return i;
}
function jo(e, t) {
  var n = e == null ? null : typeof Symbol < "u" && e[Symbol.iterator] || e["@@iterator"];
  if (n != null) {
    var i, r, o, a, l = [], s = !0, u = !1;
    try {
      if (o = (n = n.call(e)).next, t !== 0) for (; !(s = (i = o.call(n)).done) && (l.push(i.value), l.length !== t); s = !0) ;
    } catch (d) {
      u = !0, r = d;
    } finally {
      try {
        if (!s && n.return != null && (a = n.return(), Object(a) !== a)) return;
      } finally {
        if (u) throw r;
      }
    }
    return l;
  }
}
function Ro(e) {
  if (Array.isArray(e)) return e;
}
function nn(e, t) {
  var n = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var i = Object.getOwnPropertySymbols(e);
    t && (i = i.filter(function(r) {
      return Object.getOwnPropertyDescriptor(e, r).enumerable;
    })), n.push.apply(n, i);
  }
  return n;
}
function O(e) {
  for (var t = 1; t < arguments.length; t++) {
    var n = arguments[t] != null ? arguments[t] : {};
    t % 2 ? nn(Object(n), !0).forEach(function(i) {
      st(e, i, n[i]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : nn(Object(n)).forEach(function(i) {
      Object.defineProperty(e, i, Object.getOwnPropertyDescriptor(n, i));
    });
  }
  return e;
}
function st(e, t, n) {
  return (t = Vo(t)) in e ? Object.defineProperty(e, t, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = n, e;
}
function Vo(e) {
  var t = Mo(e, "string");
  return ke(t) == "symbol" ? t : t + "";
}
function Mo(e, t) {
  if (ke(e) != "object" || !e) return e;
  var n = e[Symbol.toPrimitive];
  if (n !== void 0) {
    var i = n.call(e, t);
    if (ke(i) != "object") return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var S = {
  _getMeta: function() {
    return [B(arguments.length <= 0 ? void 0 : arguments[0]) || arguments.length <= 0 ? void 0 : arguments[0], R(B(arguments.length <= 0 ? void 0 : arguments[0]) ? arguments.length <= 0 ? void 0 : arguments[0] : arguments.length <= 1 ? void 0 : arguments[1])];
  },
  _getConfig: function(t, n) {
    var i, r, o;
    return (i = (t == null || (r = t.instance) === null || r === void 0 ? void 0 : r.$primevue) || (n == null || (o = n.ctx) === null || o === void 0 || (o = o.appContext) === null || o === void 0 || (o = o.config) === null || o === void 0 || (o = o.globalProperties) === null || o === void 0 ? void 0 : o.$primevue)) === null || i === void 0 ? void 0 : i.config;
  },
  _getOptionValue: pt,
  _getPTValue: function() {
    var t, n, i = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, r = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, o = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : "", a = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : {}, l = arguments.length > 4 && arguments[4] !== void 0 ? arguments[4] : !0, s = function() {
      var _ = S._getOptionValue.apply(S, arguments);
      return V(_) || kn(_) ? {
        class: _
      } : _;
    }, u = ((t = i.binding) === null || t === void 0 || (t = t.value) === null || t === void 0 ? void 0 : t.ptOptions) || ((n = i.$primevueConfig) === null || n === void 0 ? void 0 : n.ptOptions) || {}, d = u.mergeSections, c = d === void 0 ? !0 : d, m = u.mergeProps, p = m === void 0 ? !1 : m, f = l ? S._useDefaultPT(i, i.defaultPT(), s, o, a) : void 0, g = S._usePT(i, S._getPT(r, i.$name), s, o, O(O({}, a), {}, {
      global: f || {}
    })), v = S._getPTDatasets(i, o);
    return c || !c && g ? p ? S._mergeProps(i, p, f, g, v) : O(O(O({}, f), g), v) : O(O({}, g), v);
  },
  _getPTDatasets: function() {
    var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "", i = "data-pc-";
    return O(O({}, n === "root" && st({}, "".concat(i, "name"), U(t.$name))), {}, st({}, "".concat(i, "section"), U(n)));
  },
  _getPT: function(t) {
    var n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "", i = arguments.length > 2 ? arguments[2] : void 0, r = function(a) {
      var l, s = i ? i(a) : a, u = U(n);
      return (l = s?.[u]) !== null && l !== void 0 ? l : s;
    };
    return t && Object.hasOwn(t, "_usept") ? {
      _usept: t._usept,
      originalValue: r(t.originalValue),
      value: r(t.value)
    } : r(t);
  },
  _usePT: function() {
    var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, n = arguments.length > 1 ? arguments[1] : void 0, i = arguments.length > 2 ? arguments[2] : void 0, r = arguments.length > 3 ? arguments[3] : void 0, o = arguments.length > 4 ? arguments[4] : void 0, a = function(v) {
      return i(v, r, o);
    };
    if (n && Object.hasOwn(n, "_usept")) {
      var l, s = n._usept || ((l = t.$primevueConfig) === null || l === void 0 ? void 0 : l.ptOptions) || {}, u = s.mergeSections, d = u === void 0 ? !0 : u, c = s.mergeProps, m = c === void 0 ? !1 : c, p = a(n.originalValue), f = a(n.value);
      return p === void 0 && f === void 0 ? void 0 : V(f) ? f : V(p) ? p : d || !d && f ? m ? S._mergeProps(t, m, p, f) : O(O({}, p), f) : f;
    }
    return a(n);
  },
  _useDefaultPT: function() {
    var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, i = arguments.length > 2 ? arguments[2] : void 0, r = arguments.length > 3 ? arguments[3] : void 0, o = arguments.length > 4 ? arguments[4] : void 0;
    return S._usePT(t, n, i, r, o);
  },
  _loadStyles: function() {
    var t, n = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, i = arguments.length > 1 ? arguments[1] : void 0, r = arguments.length > 2 ? arguments[2] : void 0, o = S._getConfig(i, r), a = {
      nonce: o == null || (t = o.csp) === null || t === void 0 ? void 0 : t.nonce
    };
    S._loadCoreStyles(n, a), S._loadThemeStyles(n, a), S._loadScopedThemeStyles(n, a), S._removeThemeListeners(n), n.$loadStyles = function() {
      return S._loadThemeStyles(n, a);
    }, S._themeChangeListener(n.$loadStyles);
  },
  _loadCoreStyles: function() {
    var t, n, i = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, r = arguments.length > 1 ? arguments[1] : void 0;
    if (!J.isStyleNameLoaded((t = i.$style) === null || t === void 0 ? void 0 : t.name) && (n = i.$style) !== null && n !== void 0 && n.name) {
      var o;
      T.loadCSS(r), (o = i.$style) === null || o === void 0 || o.loadCSS(r), J.setLoadedStyleName(i.$style.name);
    }
  },
  _loadThemeStyles: function() {
    var t, n, i, r = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, o = arguments.length > 1 ? arguments[1] : void 0;
    if (!(r != null && r.isUnstyled() || (r == null || (t = r.theme) === null || t === void 0 ? void 0 : t.call(r)) === "none")) {
      if (!P.isStyleNameLoaded("common")) {
        var a, l, s = ((a = r.$style) === null || a === void 0 || (l = a.getCommonTheme) === null || l === void 0 ? void 0 : l.call(a)) || {}, u = s.primitive, d = s.semantic, c = s.global, m = s.style;
        T.load(u?.css, O({
          name: "primitive-variables"
        }, o)), T.load(d?.css, O({
          name: "semantic-variables"
        }, o)), T.load(c?.css, O({
          name: "global-variables"
        }, o)), T.loadStyle(O({
          name: "global-style"
        }, o), m), P.setLoadedStyleName("common");
      }
      if (!P.isStyleNameLoaded((n = r.$style) === null || n === void 0 ? void 0 : n.name) && (i = r.$style) !== null && i !== void 0 && i.name) {
        var p, f, g, v, y = ((p = r.$style) === null || p === void 0 || (f = p.getDirectiveTheme) === null || f === void 0 ? void 0 : f.call(p)) || {}, _ = y.css, w = y.style;
        (g = r.$style) === null || g === void 0 || g.load(_, O({
          name: "".concat(r.$style.name, "-variables")
        }, o)), (v = r.$style) === null || v === void 0 || v.loadStyle(O({
          name: "".concat(r.$style.name, "-style")
        }, o), w), P.setLoadedStyleName(r.$style.name);
      }
      if (!P.isStyleNameLoaded("layer-order")) {
        var h, b, L = (h = r.$style) === null || h === void 0 || (b = h.getLayerOrderThemeCSS) === null || b === void 0 ? void 0 : b.call(h);
        T.load(L, O({
          name: "layer-order",
          first: !0
        }, o)), P.setLoadedStyleName("layer-order");
      }
    }
  },
  _loadScopedThemeStyles: function() {
    var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, n = arguments.length > 1 ? arguments[1] : void 0, i = t.preset();
    if (i && t.$attrSelector) {
      var r, o, a, l = ((r = t.$style) === null || r === void 0 || (o = r.getPresetTheme) === null || o === void 0 ? void 0 : o.call(r, i, "[".concat(t.$attrSelector, "]"))) || {}, s = l.css, u = (a = t.$style) === null || a === void 0 ? void 0 : a.load(s, O({
        name: "".concat(t.$attrSelector, "-").concat(t.$style.name)
      }, n));
      t.scopedStyleEl = u.el;
    }
  },
  _themeChangeListener: function() {
    var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : function() {
    };
    J.clearLoadedStyleNames(), I.on("theme:change", t);
  },
  _removeThemeListeners: function() {
    var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    I.off("theme:change", t.$loadStyles), t.$loadStyles = void 0;
  },
  _hook: function(t, n, i, r, o, a) {
    var l, s, u = "on".concat(vr(n)), d = S._getConfig(r, o), c = i?.$instance, m = S._usePT(c, S._getPT(r == null || (l = r.value) === null || l === void 0 ? void 0 : l.pt, t), S._getOptionValue, "hooks.".concat(u)), p = S._useDefaultPT(c, d == null || (s = d.pt) === null || s === void 0 || (s = s.directives) === null || s === void 0 ? void 0 : s[t], S._getOptionValue, "hooks.".concat(u)), f = {
      el: i,
      binding: r,
      vnode: o,
      prevVnode: a
    };
    m?.(c, f), p?.(c, f);
  },
  /* eslint-disable-next-line no-unused-vars */
  _mergeProps: function() {
    for (var t = arguments.length > 1 ? arguments[1] : void 0, n = arguments.length, i = new Array(n > 2 ? n - 2 : 0), r = 2; r < n; r++)
      i[r - 2] = arguments[r];
    return mt(t) ? t.apply(void 0, i) : E.apply(void 0, i);
  },
  _extend: function(t) {
    var n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, i = function(l, s, u, d, c) {
      var m, p, f, g;
      s._$instances = s._$instances || {};
      var v = S._getConfig(u, d), y = s._$instances[t] || {}, _ = Ee(y) ? O(O({}, n), n?.methods) : {};
      s._$instances[t] = O(O({}, y), {}, {
        /* new instance variables to pass in directive methods */
        $name: t,
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
        $primevueConfig: v,
        $attrSelector: (m = s.$pd) === null || m === void 0 || (m = m[t]) === null || m === void 0 ? void 0 : m.attrSelector,
        /* computed instance variables */
        defaultPT: function() {
          return S._getPT(v?.pt, void 0, function(h) {
            var b;
            return h == null || (b = h.directives) === null || b === void 0 ? void 0 : b[t];
          });
        },
        isUnstyled: function() {
          var h, b;
          return ((h = s._$instances[t]) === null || h === void 0 || (h = h.$binding) === null || h === void 0 || (h = h.value) === null || h === void 0 ? void 0 : h.unstyled) !== void 0 ? (b = s._$instances[t]) === null || b === void 0 || (b = b.$binding) === null || b === void 0 || (b = b.value) === null || b === void 0 ? void 0 : b.unstyled : v?.unstyled;
        },
        theme: function() {
          var h;
          return (h = s._$instances[t]) === null || h === void 0 || (h = h.$primevueConfig) === null || h === void 0 ? void 0 : h.theme;
        },
        preset: function() {
          var h;
          return (h = s._$instances[t]) === null || h === void 0 || (h = h.$binding) === null || h === void 0 || (h = h.value) === null || h === void 0 ? void 0 : h.dt;
        },
        /* instance's methods */
        ptm: function() {
          var h, b = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "", L = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
          return S._getPTValue(s._$instances[t], (h = s._$instances[t]) === null || h === void 0 || (h = h.$binding) === null || h === void 0 || (h = h.value) === null || h === void 0 ? void 0 : h.pt, b, O({}, L));
        },
        ptmo: function() {
          var h = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, b = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "", L = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
          return S._getPTValue(s._$instances[t], h, b, L, !1);
        },
        cx: function() {
          var h, b, L = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "", A = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
          return (h = s._$instances[t]) !== null && h !== void 0 && h.isUnstyled() ? void 0 : S._getOptionValue((b = s._$instances[t]) === null || b === void 0 || (b = b.$style) === null || b === void 0 ? void 0 : b.classes, L, O({}, A));
        },
        sx: function() {
          var h, b = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "", L = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !0, A = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
          return L ? S._getOptionValue((h = s._$instances[t]) === null || h === void 0 || (h = h.$style) === null || h === void 0 ? void 0 : h.inlineStyles, b, O({}, A)) : void 0;
        }
      }, _), s.$instance = s._$instances[t], (p = (f = s.$instance)[l]) === null || p === void 0 || p.call(f, s, u, d, c), s["$".concat(t)] = s.$instance, S._hook(t, l, s, u, d, c), s.$pd || (s.$pd = {}), s.$pd[t] = O(O({}, (g = s.$pd) === null || g === void 0 ? void 0 : g[t]), {}, {
        name: t,
        instance: s._$instances[t]
      });
    }, r = function(l) {
      var s, u, d, c = l._$instances[t], m = c?.watch, p = function(v) {
        var y, _ = v.newValue, w = v.oldValue;
        return m == null || (y = m.config) === null || y === void 0 ? void 0 : y.call(c, _, w);
      }, f = function(v) {
        var y, _ = v.newValue, w = v.oldValue;
        return m == null || (y = m["config.ripple"]) === null || y === void 0 ? void 0 : y.call(c, _, w);
      };
      c.$watchersCallback = {
        config: p,
        "config.ripple": f
      }, m == null || (s = m.config) === null || s === void 0 || s.call(c, c?.$primevueConfig), X.on("config:change", p), m == null || (u = m["config.ripple"]) === null || u === void 0 || u.call(c, c == null || (d = c.$primevueConfig) === null || d === void 0 ? void 0 : d.ripple), X.on("config:ripple:change", f);
    }, o = function(l) {
      var s = l._$instances[t].$watchersCallback;
      s && (X.off("config:change", s.config), X.off("config:ripple:change", s["config.ripple"]), l._$instances[t].$watchersCallback = void 0);
    };
    return {
      created: function(l, s, u, d) {
        l.$pd || (l.$pd = {}), l.$pd[t] = {
          name: t,
          attrSelector: Nr("pd")
        }, i("created", l, s, u, d);
      },
      beforeMount: function(l, s, u, d) {
        var c;
        S._loadStyles((c = l.$pd[t]) === null || c === void 0 ? void 0 : c.instance, s, u), i("beforeMount", l, s, u, d), r(l);
      },
      mounted: function(l, s, u, d) {
        var c;
        S._loadStyles((c = l.$pd[t]) === null || c === void 0 ? void 0 : c.instance, s, u), i("mounted", l, s, u, d);
      },
      beforeUpdate: function(l, s, u, d) {
        i("beforeUpdate", l, s, u, d);
      },
      updated: function(l, s, u, d) {
        var c;
        S._loadStyles((c = l.$pd[t]) === null || c === void 0 ? void 0 : c.instance, s, u), i("updated", l, s, u, d);
      },
      beforeUnmount: function(l, s, u, d) {
        var c;
        o(l), S._removeThemeListeners((c = l.$pd[t]) === null || c === void 0 ? void 0 : c.instance), i("beforeUnmount", l, s, u, d);
      },
      unmounted: function(l, s, u, d) {
        var c;
        (c = l.$pd[t]) === null || c === void 0 || (c = c.instance) === null || c === void 0 || (c = c.scopedStyleEl) === null || c === void 0 || (c = c.value) === null || c === void 0 || c.remove(), i("unmounted", l, s, u, d);
      }
    };
  },
  extend: function() {
    var t = S._getMeta.apply(S, arguments), n = en(t, 2), i = n[0], r = n[1];
    return O({
      extend: function() {
        var a = S._getMeta.apply(S, arguments), l = en(a, 2), s = l[0], u = l[1];
        return S.extend(s, O(O(O({}, r), r?.methods), u));
      }
    }, S._extend(i, r));
  }
}, Do = `
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
}, zo = T.extend({
  name: "ripple-directive",
  style: Do,
  classes: Ho
}), Uo = S.extend({
  style: zo
});
function Le(e) {
  "@babel/helpers - typeof";
  return Le = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, Le(e);
}
function Bo(e) {
  return Yo(e) || Ko(e) || Fo(e) || Wo();
}
function Wo() {
  throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function Fo(e, t) {
  if (e) {
    if (typeof e == "string") return at(e, t);
    var n = {}.toString.call(e).slice(8, -1);
    return n === "Object" && e.constructor && (n = e.constructor.name), n === "Map" || n === "Set" ? Array.from(e) : n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? at(e, t) : void 0;
  }
}
function Ko(e) {
  if (typeof Symbol < "u" && e[Symbol.iterator] != null || e["@@iterator"] != null) return Array.from(e);
}
function Yo(e) {
  if (Array.isArray(e)) return at(e);
}
function at(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var n = 0, i = Array(t); n < t; n++) i[n] = e[n];
  return i;
}
function rn(e, t, n) {
  return (t = Go(t)) in e ? Object.defineProperty(e, t, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = n, e;
}
function Go(e) {
  var t = qo(e, "string");
  return Le(t) == "symbol" ? t : t + "";
}
function qo(e, t) {
  if (Le(e) != "object" || !e) return e;
  var n = e[Symbol.toPrimitive];
  if (n !== void 0) {
    var i = n.call(e, t);
    if (Le(i) != "object") return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var Zo = Uo.extend("ripple", {
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
      n || (n = Tr("span", rn(rn({
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
      var n = this, i = t.currentTarget, r = this.getInk(i);
      if (!(!r || getComputedStyle(r, null).display === "none")) {
        if (!this.isUnstyled() && Qe(r, "p-ink-active"), r.setAttribute("data-p-ink-active", "false"), !Rt(r) && !Vt(r)) {
          var o = Math.max(Be(i), xr(i));
          r.style.height = o + "px", r.style.width = o + "px";
        }
        var a = Lr(i), l = t.pageX - a.left + document.body.scrollTop - Vt(r) / 2, s = t.pageY - a.top + document.body.scrollLeft - Rt(r) / 2;
        r.style.top = s + "px", r.style.left = l + "px", !this.isUnstyled() && yr(r, "p-ink-active"), r.setAttribute("data-p-ink-active", "true"), this.timeout = setTimeout(function() {
          r && (!n.isUnstyled() && Qe(r, "p-ink-active"), r.setAttribute("data-p-ink-active", "false"));
        }, 401);
      }
    },
    onAnimationEnd: function(t) {
      this.timeout && clearTimeout(this.timeout), !this.isUnstyled() && Qe(t.currentTarget, "p-ink-active"), t.currentTarget.setAttribute("data-p-ink-active", "false");
    },
    getInk: function(t) {
      return t && t.children ? Bo(t.children).find(function(n) {
        return kr(n, "data-pc-name") === "ripple";
      }) : void 0;
    }
  }
});
function xe(e) {
  "@babel/helpers - typeof";
  return xe = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, xe(e);
}
function Qo(e, t) {
  if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function");
}
function Jo(e, t) {
  for (var n = 0; n < t.length; n++) {
    var i = t[n];
    i.enumerable = i.enumerable || !1, i.configurable = !0, "value" in i && (i.writable = !0), Object.defineProperty(e, es(i.key), i);
  }
}
function Xo(e, t, n) {
  return t && Jo(e.prototype, t), Object.defineProperty(e, "prototype", { writable: !1 }), e;
}
function es(e) {
  var t = ts(e, "string");
  return xe(t) == "symbol" ? t : t + "";
}
function ts(e, t) {
  if (xe(e) != "object" || !e) return e;
  var n = e[Symbol.toPrimitive];
  if (n !== void 0) {
    var i = n.call(e, t);
    if (xe(i) != "object") return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return String(e);
}
var ns = /* @__PURE__ */ (function() {
  function e(t) {
    var n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : function() {
    };
    Qo(this, e), this.element = t, this.listener = n;
  }
  return Xo(e, [{
    key: "bindScrollListener",
    value: function() {
      this.scrollableParents = Er(this.element);
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
})(), is = ft(), rs = `
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
`, os = {
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
}, ss = T.extend({
  name: "menu",
  style: rs,
  classes: os
}), as = {
  name: "BaseMenu",
  extends: gt,
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
  style: ss,
  provide: function() {
    return {
      $pcMenu: this,
      $parentInstance: this
    };
  }
}, Bn = {
  name: "Menuitem",
  hostName: "Menu",
  extends: gt,
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
    getItemProp: function(t, n) {
      return t && t.item ? R(t.item[n]) : void 0;
    },
    getPTOptions: function(t) {
      return this.ptm(t, {
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
    onItemClick: function(t) {
      var n = this.getItemProp(this.item, "command");
      n && n({
        originalEvent: t,
        item: this.item.item
      }), this.$emit("item-click", {
        originalEvent: t,
        item: this.item,
        id: this.id
      });
    },
    onItemMouseMove: function(t) {
      this.$emit("item-mousemove", {
        originalEvent: t,
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
    getMenuItemProps: function(t) {
      return {
        action: E({
          class: this.cx("itemLink"),
          tabindex: "-1"
        }, this.getPTOptions("itemLink")),
        icon: E({
          class: [this.cx("itemIcon"), t.icon]
        }, this.getPTOptions("itemIcon")),
        label: E({
          class: this.cx("itemLabel")
        }, this.getPTOptions("itemLabel"))
      };
    }
  },
  computed: {
    dataP: function() {
      return ht({
        focus: this.isItemFocused(),
        disabled: this.disabled()
      });
    }
  },
  directives: {
    ripple: Zo
  }
}, ls = ["id", "aria-label", "aria-disabled", "data-p-focused", "data-p-disabled", "data-p"], us = ["data-p"], cs = ["href", "target"], ds = ["data-p"], ms = ["data-p"];
function ps(e, t, n, i, r, o) {
  var a = Si("ripple");
  return o.visible() ? (x(), j("li", E({
    key: 0,
    id: n.id,
    class: [e.cx("item"), n.item.class],
    role: "menuitem",
    style: n.item.style,
    "aria-label": o.label(),
    "aria-disabled": o.disabled(),
    "data-p-focused": o.isItemFocused(),
    "data-p-disabled": o.disabled() || !1,
    "data-p": o.dataP
  }, o.getPTOptions("item")), [tt("div", E({
    class: e.cx("itemContent"),
    onClick: t[0] || (t[0] = function(l) {
      return o.onItemClick(l);
    }),
    onMousemove: t[1] || (t[1] = function(l) {
      return o.onItemMouseMove(l);
    }),
    "data-p": o.dataP
  }, o.getPTOptions("itemContent")), [n.templates.item ? n.templates.item ? (x(), ve($t(n.templates.item), {
    key: 1,
    item: n.item,
    label: o.label(),
    props: o.getMenuItemProps(n.item)
  }, null, 8, ["item", "label", "props"])) : z("", !0) : wi((x(), j("a", E({
    key: 0,
    href: n.item.url,
    class: e.cx("itemLink"),
    target: n.item.target,
    tabindex: "-1"
  }, o.getPTOptions("itemLink")), [n.templates.itemicon ? (x(), ve($t(n.templates.itemicon), {
    key: 0,
    item: n.item,
    class: $i(e.cx("itemIcon"))
  }, null, 8, ["item", "class"])) : n.item.icon ? (x(), j("span", E({
    key: 1,
    class: [e.cx("itemIcon"), n.item.icon],
    "data-p": o.dataP
  }, o.getPTOptions("itemIcon")), null, 16, ds)) : z("", !0), tt("span", E({
    class: e.cx("itemLabel"),
    "data-p": o.dataP
  }, o.getPTOptions("itemLabel")), vn(o.label()), 17, ms)], 16, cs)), [[a]])], 16, us)], 16, ls)) : z("", !0);
}
Bn.render = ps;
function on(e) {
  return gs(e) || vs(e) || hs(e) || fs();
}
function fs() {
  throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function hs(e, t) {
  if (e) {
    if (typeof e == "string") return lt(e, t);
    var n = {}.toString.call(e).slice(8, -1);
    return n === "Object" && e.constructor && (n = e.constructor.name), n === "Map" || n === "Set" ? Array.from(e) : n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? lt(e, t) : void 0;
  }
}
function vs(e) {
  if (typeof Symbol < "u" && e[Symbol.iterator] != null || e["@@iterator"] != null) return Array.from(e);
}
function gs(e) {
  if (Array.isArray(e)) return lt(e);
}
function lt(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var n = 0, i = Array(t); n < t; n++) i[n] = e[n];
  return i;
}
var Wn = {
  name: "Menu",
  extends: as,
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
    this.unbindResizeListener(), this.unbindOutsideClickListener(), this.scrollHandler && (this.scrollHandler.destroy(), this.scrollHandler = null), this.target = null, this.container && this.autoZIndex && Je.clear(this.container), this.container = null;
  },
  methods: {
    itemClick: function(t) {
      var n = t.item;
      this.disabled(n) || (n.command && n.command(t), this.overlayVisible && this.hide(), !this.popup && this.focusedOptionIndex !== t.id && (this.focusedOptionIndex = t.id));
    },
    itemMouseMove: function(t) {
      this.focused && (this.focusedOptionIndex = t.id);
    },
    onListFocus: function(t) {
      this.focused = !0, !this.popup && this.changeFocusedOptionIndex(0), this.$emit("focus", t);
    },
    onListBlur: function(t) {
      this.focused = !1, this.focusedOptionIndex = -1, this.$emit("blur", t);
    },
    onListKeyDown: function(t) {
      switch (t.code) {
        case "ArrowDown":
          this.onArrowDownKey(t);
          break;
        case "ArrowUp":
          this.onArrowUpKey(t);
          break;
        case "Home":
          this.onHomeKey(t);
          break;
        case "End":
          this.onEndKey(t);
          break;
        case "Enter":
        case "NumpadEnter":
          this.onEnterKey(t);
          break;
        case "Space":
          this.onSpaceKey(t);
          break;
        case "Escape":
          this.popup && (Re(this.target), this.hide());
        case "Tab":
          this.overlayVisible && this.hide();
          break;
      }
    },
    onArrowDownKey: function(t) {
      var n = this.findNextOptionIndex(this.focusedOptionIndex);
      this.changeFocusedOptionIndex(n), t.preventDefault();
    },
    onArrowUpKey: function(t) {
      if (t.altKey && this.popup)
        Re(this.target), this.hide(), t.preventDefault();
      else {
        var n = this.findPrevOptionIndex(this.focusedOptionIndex);
        this.changeFocusedOptionIndex(n), t.preventDefault();
      }
    },
    onHomeKey: function(t) {
      this.changeFocusedOptionIndex(0), t.preventDefault();
    },
    onEndKey: function(t) {
      this.changeFocusedOptionIndex(je(this.container, 'li[data-pc-section="item"][data-p-disabled="false"]').length - 1), t.preventDefault();
    },
    onEnterKey: function(t) {
      var n = Fe(this.list, 'li[id="'.concat("".concat(this.focusedOptionIndex), '"]')), i = n && Fe(n, 'a[data-pc-section="itemlink"]');
      this.popup && Re(this.target), i ? i.click() : n && n.click(), t.preventDefault();
    },
    onSpaceKey: function(t) {
      this.onEnterKey(t);
    },
    findNextOptionIndex: function(t) {
      var n = je(this.container, 'li[data-pc-section="item"][data-p-disabled="false"]'), i = on(n).findIndex(function(r) {
        return r.id === t;
      });
      return i > -1 ? i + 1 : 0;
    },
    findPrevOptionIndex: function(t) {
      var n = je(this.container, 'li[data-pc-section="item"][data-p-disabled="false"]'), i = on(n).findIndex(function(r) {
        return r.id === t;
      });
      return i > -1 ? i - 1 : 0;
    },
    changeFocusedOptionIndex: function(t) {
      var n = je(this.container, 'li[data-pc-section="item"][data-p-disabled="false"]'), i = t >= n.length ? n.length - 1 : t < 0 ? 0 : t;
      i > -1 && (this.focusedOptionIndex = n[i].getAttribute("id"));
    },
    toggle: function(t, n) {
      this.overlayVisible ? this.hide() : this.show(t, n);
    },
    show: function(t, n) {
      this.overlayVisible = !0, this.target = n ?? t.currentTarget;
    },
    hide: function() {
      this.overlayVisible = !1, this.target = null;
    },
    onEnter: function(t) {
      Pr(t, {
        position: "absolute",
        top: "0"
      }), this.alignOverlay(), this.bindOutsideClickListener(), this.bindResizeListener(), this.bindScrollListener(), this.autoZIndex && Je.set("menu", t, this.baseZIndex || this.$primevue.config.zIndex.menu), this.popup && Re(this.list), this.$emit("show");
    },
    onLeave: function() {
      this.unbindOutsideClickListener(), this.unbindResizeListener(), this.unbindScrollListener(), this.$emit("hide");
    },
    onAfterLeave: function(t) {
      this.autoZIndex && Je.clear(t);
    },
    alignOverlay: function() {
      Or(this.container, this.target);
      var t = Be(this.target);
      t > Be(this.container) && (this.container.style.minWidth = Be(this.target) + "px");
    },
    bindOutsideClickListener: function() {
      var t = this;
      this.outsideClickListener || (this.outsideClickListener = function(n) {
        var i = t.container && !t.container.contains(n.target), r = !(t.target && (t.target === n.target || t.target.contains(n.target)));
        t.overlayVisible && i && r ? t.hide() : !t.popup && i && r && (t.focusedOptionIndex = -1);
      }, document.addEventListener("click", this.outsideClickListener, !0));
    },
    unbindOutsideClickListener: function() {
      this.outsideClickListener && (document.removeEventListener("click", this.outsideClickListener, !0), this.outsideClickListener = null);
    },
    bindScrollListener: function() {
      var t = this;
      this.scrollHandler || (this.scrollHandler = new ns(this.target, function() {
        t.overlayVisible && t.hide();
      })), this.scrollHandler.bindScrollListener();
    },
    unbindScrollListener: function() {
      this.scrollHandler && this.scrollHandler.unbindScrollListener();
    },
    bindResizeListener: function() {
      var t = this;
      this.resizeListener || (this.resizeListener = function() {
        t.overlayVisible && !Ar() && t.hide();
      }, window.addEventListener("resize", this.resizeListener));
    },
    unbindResizeListener: function() {
      this.resizeListener && (window.removeEventListener("resize", this.resizeListener), this.resizeListener = null);
    },
    visible: function(t) {
      return typeof t.visible == "function" ? t.visible() : t.visible !== !1;
    },
    disabled: function(t) {
      return typeof t.disabled == "function" ? t.disabled() : t.disabled;
    },
    label: function(t) {
      return typeof t.label == "function" ? t.label() : t.label;
    },
    onOverlayClick: function(t) {
      is.emit("overlay-click", {
        originalEvent: t,
        target: this.target
      });
    },
    containerRef: function(t) {
      this.container = t;
    },
    listRef: function(t) {
      this.list = t;
    }
  },
  computed: {
    focusedOptionId: function() {
      return this.focusedOptionIndex !== -1 ? this.focusedOptionIndex : null;
    },
    dataP: function() {
      return ht({
        popup: this.popup
      });
    }
  },
  components: {
    PVMenuitem: Bn,
    Portal: vt
  }
}, ys = ["id", "data-p"], bs = ["id", "tabindex", "aria-activedescendant", "aria-label", "aria-labelledby"], _s = ["id"];
function Ss(e, t, n, i, r, o) {
  var a = Ot("PVMenuitem"), l = Ot("Portal");
  return x(), ve(l, {
    appendTo: e.appendTo,
    disabled: !e.popup
  }, {
    default: Pt(function() {
      return [Oi(Pi, E({
        name: "p-anchored-overlay",
        onEnter: o.onEnter,
        onLeave: o.onLeave,
        onAfterLeave: o.onAfterLeave
      }, e.ptm("transition")), {
        default: Pt(function() {
          return [!e.popup || r.overlayVisible ? (x(), j("div", E({
            key: 0,
            ref: o.containerRef,
            id: e.$id,
            class: e.cx("root"),
            onClick: t[3] || (t[3] = function() {
              return o.onOverlayClick && o.onOverlayClick.apply(o, arguments);
            }),
            "data-p": o.dataP
          }, e.ptmi("root")), [e.$slots.start ? (x(), j("div", E({
            key: 0,
            class: e.cx("start")
          }, e.ptm("start")), [se(e.$slots, "start")], 16)) : z("", !0), tt("ul", E({
            ref: o.listRef,
            id: e.$id + "_list",
            class: e.cx("list"),
            role: "menu",
            tabindex: e.tabindex,
            "aria-activedescendant": r.focused ? o.focusedOptionId : void 0,
            "aria-label": e.ariaLabel,
            "aria-labelledby": e.ariaLabelledby,
            onFocus: t[0] || (t[0] = function() {
              return o.onListFocus && o.onListFocus.apply(o, arguments);
            }),
            onBlur: t[1] || (t[1] = function() {
              return o.onListBlur && o.onListBlur.apply(o, arguments);
            }),
            onKeydown: t[2] || (t[2] = function() {
              return o.onListKeyDown && o.onListKeyDown.apply(o, arguments);
            })
          }, e.ptm("list")), [(x(!0), j(ye, null, Ct(e.model, function(s, u) {
            return x(), j(ye, {
              key: o.label(s) + u.toString()
            }, [s.items && o.visible(s) && !s.separator ? (x(), j(ye, {
              key: 0
            }, [s.items ? (x(), j("li", E({
              key: 0,
              id: e.$id + "_" + u,
              class: [e.cx("submenuLabel"), s.class],
              role: "none"
            }, {
              ref_for: !0
            }, e.ptm("submenuLabel")), [se(e.$slots, e.$slots.submenulabel ? "submenulabel" : "submenuheader", {
              item: s
            }, function() {
              return [Ci(vn(o.label(s)), 1)];
            })], 16, _s)) : z("", !0), (x(!0), j(ye, null, Ct(s.items, function(d, c) {
              return x(), j(ye, {
                key: d.label + u + "_" + c
              }, [o.visible(d) && !d.separator ? (x(), ve(a, {
                key: 0,
                id: e.$id + "_" + u + "_" + c,
                item: d,
                templates: e.$slots,
                focusedOptionId: o.focusedOptionId,
                unstyled: e.unstyled,
                onItemClick: o.itemClick,
                onItemMousemove: o.itemMouseMove,
                pt: e.pt
              }, null, 8, ["id", "item", "templates", "focusedOptionId", "unstyled", "onItemClick", "onItemMousemove", "pt"])) : o.visible(d) && d.separator ? (x(), j("li", E({
                key: "separator" + u + c,
                class: [e.cx("separator"), s.class],
                style: d.style,
                role: "separator"
              }, {
                ref_for: !0
              }, e.ptm("separator")), null, 16)) : z("", !0)], 64);
            }), 128))], 64)) : o.visible(s) && s.separator ? (x(), j("li", E({
              key: "separator" + u.toString(),
              class: [e.cx("separator"), s.class],
              style: s.style,
              role: "separator"
            }, {
              ref_for: !0
            }, e.ptm("separator")), null, 16)) : (x(), ve(a, {
              key: o.label(s) + u.toString(),
              id: e.$id + "_" + u,
              item: s,
              index: u,
              templates: e.$slots,
              focusedOptionId: o.focusedOptionId,
              unstyled: e.unstyled,
              onItemClick: o.itemClick,
              onItemMousemove: o.itemMouseMove,
              pt: e.pt
            }, null, 8, ["id", "item", "index", "templates", "focusedOptionId", "unstyled", "onItemClick", "onItemMousemove", "pt"]))], 64);
          }), 128))], 16, bs), e.$slots.end ? (x(), j("div", E({
            key: 1,
            class: e.cx("end")
          }, e.ptm("end")), [se(e.$slots, "end")], 16)) : z("", !0)], 16, ys)) : z("", !0)];
        }),
        _: 3
      }, 16, ["onEnter", "onLeave", "onAfterLeave"])];
    }),
    _: 3
  }, 8, ["appendTo", "disabled"]);
}
Wn.render = Ss;
const ws = "data-wippy-overlay-layer";
function Fn() {
  return typeof window < "u" && typeof window.document < "u";
}
function Kn() {
  return Fn() && typeof HTMLElement < "u" && "popover" in HTMLElement.prototype;
}
function $s() {
  return Kn() && typeof CSS < "u" && typeof CSS.supports == "function" && CSS.supports("anchor-name: --a") && CSS.supports("position-area", "bottom span-right") && CSS.supports("position-try-fallbacks", "flip-block") && CSS.supports("min-width", "min(anchor-size(width), 100vw)") && CSS.supports("max-width", "stretch");
}
const Os = /\bp-(?:select|multiselect|treeselect|cascadeselect)-overlay\b/;
let Ps = 0;
const Ye = /* @__PURE__ */ new WeakMap();
function sn(e, t) {
  const n = e.style;
  n.setProperty("position", "fixed", "important"), n.setProperty("inset", "auto", "important"), n.setProperty("margin", "0", "important"), n.setProperty("position-anchor", t), n.setProperty("position-area", "bottom span-right"), n.setProperty("position-try-fallbacks", "flip-block, flip-inline, flip-block flip-inline"), n.setProperty("min-width", "min(anchor-size(width), 100vw)", "important"), n.setProperty("max-width", "stretch", "important");
}
function Cs(e, t) {
  if (!Os.test(e.className))
    return;
  const n = e.style.cssText;
  sn(e, t), e.getAttribute("popover") !== "manual" && e.setAttribute("popover", "manual");
  try {
    e.matches(":popover-open") || e.showPopover();
  } catch {
  }
  if (!e.matches(":popover-open")) {
    e.removeAttribute("popover"), e.style.cssText = n;
    return;
  }
  if (!Ye.has(e)) {
    const i = new MutationObserver(() => {
      const r = e.style;
      (r.top !== "auto" || r.left !== "auto" || r.margin !== "0px" || r.getPropertyPriority("top") !== "important" || r.getPropertyPriority("left") !== "important" || r.getPropertyPriority("margin") !== "important" || r.getPropertyPriority("min-width") !== "important" || r.maxWidth !== "stretch" || r.getPropertyPriority("max-width") !== "important") && sn(e, t);
    });
    i.observe(e, { attributes: !0, attributeFilter: ["style"] }), Ye.set(e, i);
  }
}
function yt(e) {
  const t = Ye.get(e);
  t && (t.disconnect(), Ye.delete(e));
}
function Ts(e) {
  const t = e && typeof e.getRootNode == "function" ? e.getRootNode() : null;
  return t instanceof ShadowRoot ? t : null;
}
function ut(e) {
  e.style.top = "0px", e.style.left = "0px";
  const t = e.getBoundingClientRect();
  e.style.top = `${-window.scrollY - t.top}px`, e.style.left = `${-window.scrollX - t.left}px`;
}
const Ge = /* @__PURE__ */ new Set(), bt = /* @__PURE__ */ new WeakMap();
let an = !1, ct = !1;
const ln = ["w-theme-dark", "w-theme-light"], ze = "data-wippy-theme-root", dt = /* @__PURE__ */ new WeakMap();
function ks(e) {
  const t = [];
  let n = e ? e.parentNode : null;
  for (; n && n.nodeType === 1; )
    t.push(n), n = n.parentNode;
  return t;
}
function Ls(e, t, n) {
  const i = [...ks(t), n.host], r = () => {
    let a;
    for (const l of i) {
      if (ln.some((s) => l.classList.contains(s))) {
        a = l;
        break;
      }
      if (l.hasAttribute(ze))
        break;
    }
    for (const l of ln)
      e.classList.toggle(l, !!(a && a.classList.contains(l)));
    a ? e.setAttribute(ze, "") : e.removeAttribute(ze);
  };
  r();
  const o = new MutationObserver(r);
  for (const a of i)
    o.observe(a, { attributes: !0, attributeFilter: ["class", ze] });
  dt.set(e, o);
}
function Yn(e) {
  dt.get(e)?.disconnect(), dt.delete(e);
}
function xs() {
  ct = !1;
  for (const e of Ge) {
    if (!e.isConnected) {
      for (const t of Array.from(e.children))
        t instanceof HTMLElement && yt(t);
      Ge.delete(e), bt.get(e)?.disconnect(), Yn(e);
      continue;
    }
    e.childElementCount > 0 && ut(e);
  }
}
function un() {
  ct || (ct = !0, requestAnimationFrame(xs));
}
function Es(e) {
  const t = document.createElement("div");
  t.setAttribute(ws, "");
  const n = Kn();
  if (t.style.cssText = n ? "position:fixed;width:0 !important;height:0 !important;margin:0 !important;border:0 !important;padding:0 !important;background:transparent !important;color:inherit !important;overflow:visible !important;" : "position:fixed;top:0;left:0;width:0;height:0;", n && t.setAttribute("popover", "manual"), e.appendChild(t), n) {
    try {
      t.showPopover();
    } catch {
    }
    t.matches(":popover-open") || (t.removeAttribute("popover"), t.style.cssText = "position:fixed;top:0;left:0;width:0;height:0;");
  }
  ut(t);
  const i = new MutationObserver((r) => {
    const o = t.__wippyAnchorName;
    for (const a of r) {
      if (o)
        for (const l of Array.from(a.addedNodes))
          l instanceof HTMLElement && Cs(l, o);
      for (const l of Array.from(a.removedNodes))
        l instanceof HTMLElement && yt(l);
    }
    t.isConnected && t.childElementCount > 0 && ut(t);
  });
  return i.observe(t, { childList: !0 }), bt.set(t, i), Ge.add(t), an || (an = !0, window.addEventListener("scroll", un, { capture: !0, passive: !0 }), window.addEventListener("resize", un, { passive: !0 })), t;
}
function cn(e) {
  if (!(!e.hostRoot || e.layer) && (e.layer = Es(e.hostRoot), Ls(e.layer, e.$el, e.hostRoot), $s())) {
    const t = e.$el ? e.$el.parentElement : null;
    t && (e.anchorName = `--wippy-a-${++Ps}`, e.anchorTrigger = t, t.style.setProperty("anchor-name", e.anchorName), e.layer.__wippyAnchorName = e.anchorName);
  }
}
function dn(e) {
  if (e.anchorTrigger && (e.anchorTrigger.style.removeProperty("anchor-name"), e.anchorTrigger = null), e.anchorName = null, e.layer) {
    for (const t of Array.from(e.layer.children))
      t instanceof HTMLElement && yt(t);
    Ge.delete(e.layer), bt.get(e.layer)?.disconnect(), Yn(e.layer), e.layer.remove(), e.layer = null;
  }
}
let mn = !1;
function As() {
  if (mn)
    return;
  const e = Wn;
  !e.methods || typeof e.methods.bindOutsideClickListener != "function" || (e.methods.bindOutsideClickListener = function() {
    this.outsideClickListener || (this.outsideClickListener = (t) => {
      const n = t.composedPath(), i = this.container && !n.includes(this.container), r = !(this.target && n.includes(this.target));
      this.overlayVisible && i && r ? this.hide() : !this.popup && i && r && (this.focusedOptionIndex = -1);
    }, document.addEventListener("click", this.outsideClickListener, !0));
  }, mn = !0);
}
let pn = !1;
function Is() {
  if (pn)
    return;
  pn = !0;
  const e = vt;
  e.computed = e.computed || {}, e.computed.inline = function() {
    return !!this.disabled || this.appendTo === "self";
  }, e.computed.resolvedTarget = function() {
    return this.appendTo == null || this.appendTo === "body" ? this.hostRoot ? this.layer : document.body : this.appendTo;
  }, e.data = function() {
    return { mounted: !1, hostRoot: null, layer: null, anchorName: null, anchorTrigger: null };
  }, e.mounted = function() {
    Fn() && (this.hostRoot = Ts(this.$el), this.mounted = !0, this.hostRoot && (this.inline || cn(this), this.$watch("inline", (t) => {
      t ? dn(this) : cn(this);
    })));
  }, e.render = function() {
    return this.inline ? se(this.$slots, "default", { key: 0 }) : this.mounted ? Ti(hn, { key: 1, to: this.resolvedTarget || document.body }, [
      se(this.$slots, "default")
    ]) : z("", !0);
  }, e.unmounted = function() {
    dn(this);
  };
}
const Fs = {
  install: (e) => {
    As(), Is(), e.use(yo, { theme: "none" });
  }
};
export {
  T as B,
  Bs as M,
  Fs as P,
  kr as Q,
  Zo as R,
  zs as W,
  Ds as a,
  Hs as b,
  Ee as c,
  k as d,
  gt as e,
  ht as f,
  Wn as g,
  Re as h,
  Vs as l,
  Us as p,
  Ws as s,
  Ms as u,
  Fe as z
};
