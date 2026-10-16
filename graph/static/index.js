import { hasInjectionContext as ff, inject as ot, effectScope as Ea, ref as le, markRaw as Rt, createApp as hf, defineComponent as $e, createPropsRestProxy as pf, toRef as Te, computed as ne, onMounted as it, openBlock as A, createElementBlock as G, normalizeClass as Me, unref as oe, renderSlot as Le, getCurrentScope as ku, watch as xe, provide as Ct, getCurrentInstance as kn, useSlots as _u, onUnmounted as gf, createVNode as ze, withCtx as ft, reactive as vf, onScopeDispose as Do, nextTick as Ke, onBeforeMount as mf, shallowRef as xt, createElementVNode as I, Fragment as ye, renderList as Se, normalizeStyle as Pe, onBeforeUnmount as oo, isMemoSame as yf, createBlock as Ie, createCommentVNode as fe, toDisplayString as he, toValue as Ce, isRef as $a, toRefs as bf, customRef as wf, resolveComponent as xu, h as De, useAttrs as Sa, mergeProps as Yo, resolveDynamicComponent as Ht, createTextVNode as zt, readonly as kf, watchEffect as _f, normalizeProps as xf, withDirectives as un, withModifiers as qe, vModelText as cn, withKeys as Ze, createStaticVNode as Ef } from "vue";
import { addCollection as $f, Icon as on } from "@iconify/vue";
import { config as us, addIcons as Sf, on as Eu, applyThemeMode as go, host as Cf, hostCss as Nf, loadCss as Mf, api as Ao, loadByTagName as Tf, define as If } from "@wippy-fe/proxy";
var Xi = "data-wippy-visible";
function cs(e) {
  const t = e.getAttribute(Xi);
  return t === "true" ? !0 : t === "false" ? !1 : null;
}
var Df = Object.defineProperty, Af = (e, t, n) => t in e ? Df(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n, Be = (e, t, n) => Af(e, typeof t != "symbol" ? t + "" : t, n), Pf = [
  "themeConfigUrl",
  "primeVueCssUrl",
  "markdownCssUrl",
  "iframeCssUrl"
], Of = [
  ":where([data-wippy-theme-root]).w-theme-light",
  ":where([data-wippy-theme-root]).w-theme-dark"
].join(`,
`);
function ds(e) {
  const t = e.startsWith("--") ? e : `--${e}`;
  return /^--[-\w\u0080-\uFFFF]+$/.test(t) ? t : null;
}
function Rf(...e) {
  const t = /* @__PURE__ */ new Set();
  for (const n of e)
    if (n)
      for (const [o, r] of Object.entries(n)) {
        if ((o === "@light" || o === "@dark") && r && typeof r == "object") {
          for (const [i, s] of Object.entries(r)) {
            const u = typeof s == "string" ? ds(i) : null;
            u && t.add(u);
          }
          continue;
        }
        const a = typeof r == "string" ? ds(o) : null;
        a && t.add(a);
      }
  return [...t].sort();
}
function zf(e) {
  if (e.length === 0)
    return "";
  const t = e.map((n) => `  ${n}: inherit;`).join(`
`);
  return `${Of} {
${t}
}`;
}
function Bf(e, t) {
  const n = zf(t);
  n && $u(e, n, "@wippy-fe/css-variables-bridge");
}
function Lf(e, t) {
  const o = (t ?? Pf).map(async (r) => {
    const a = Nf[r];
    if (!a)
      return console.warn(`[wippy-fe/webcomponent-core] hostCss key "${r}" is undefined — skipping. Remove it from hostCssKeys if the CSS was removed.`), null;
    try {
      return await Mf(a);
    } catch (i) {
      return console.warn(`[wippy-fe/webcomponent-core] Failed to load hostCss "${r}" (${a}):`, i), null;
    }
  });
  return Promise.all(o).then((r) => {
    for (const a of r) {
      if (!a)
        continue;
      const i = document.createElement("style");
      i.textContent = a, i.setAttribute("role", "@wippy-fe/host-css"), e.appendChild(i);
    }
  });
}
function Vf(e, t) {
  const n = document.createElement("style");
  n.textContent = t, e.appendChild(n);
}
function $u(e, t, n) {
  if (typeof CSSStyleSheet < "u" && "replaceSync" in CSSStyleSheet.prototype) {
    const r = new CSSStyleSheet();
    r.replaceSync(t), e.adoptedStyleSheets = [...e.adoptedStyleSheets, r];
    return;
  }
  const o = document.createElement("style");
  o.setAttribute("role", n), o.textContent = t, e.appendChild(o);
}
function Hf(e, t) {
  $u(e, t, "@wippy-fe/custom-css");
}
function Su(e) {
  return e.__wippyHost ?? null;
}
function Ff(e) {
  return e.replace(/-([a-z])/g, (t, n) => n.toUpperCase());
}
function Gf(e, t, n) {
  switch (n.type) {
    case "string":
      return { value: t };
    case "number": {
      const o = Number.parseFloat(t);
      return Number.isNaN(o) ? { value: void 0, error: `Invalid ${e}: expected a number` } : { value: o };
    }
    case "integer": {
      const o = Number.parseInt(t, 10);
      return Number.isNaN(o) ? { value: void 0, error: `Invalid ${e}: expected an integer` } : { value: o };
    }
    case "boolean":
      return { value: t !== "false" };
    case "array":
    case "object":
      try {
        const o = JSON.parse(t);
        return n.type === "array" && !Array.isArray(o) ? { value: void 0, error: `Invalid ${e}: expected a JSON array` } : { value: o };
      } catch {
        return { value: void 0, error: `Invalid ${e}: must be valid JSON` };
      }
    default:
      return { value: t };
  }
}
function zr(e, t) {
  const n = {}, o = [];
  for (const [r, a] of Object.entries(t.properties)) {
    const i = e.getAttribute(r), s = Ff(r);
    if (i === null) {
      a.default !== void 0 && (n[s] = a.default);
      continue;
    }
    const u = Gf(r, i, a);
    u.error ? o.push(u.error) : n[s] = u.value;
  }
  return { props: n, errors: o };
}
var Yf = class {
  constructor(e, t) {
    Be(this, "_props"), Be(this, "_errors"), Be(this, "_content"), Be(this, "_hostVisibility"), Be(this, "_propsListeners", /* @__PURE__ */ new Set()), Be(this, "_contentListeners", /* @__PURE__ */ new Set()), Be(this, "_hostVisibilityListeners", /* @__PURE__ */ new Set()), Be(this, "_disposed", !1), Be(this, "_emitToDom"), Be(this, "props"), Be(this, "events"), Be(this, "content"), Be(this, "hostVisibility"), this._props = e.props, this._errors = e.errors, this._content = e.content, this._hostVisibility = e.hostVisibility, this._emitToDom = t;
    const n = this;
    this.props = {
      get value() {
        return n._props;
      },
      get errors() {
        return n._errors;
      },
      subscribe(o, r) {
        return n._subscribeProps(o, r);
      }
    }, this.events = {
      emit(o, r) {
        n._disposed || n._emitToDom(o, r);
      }
    }, this.content = e.hasContent ? {
      get value() {
        return n._content;
      },
      subscribe(o, r) {
        return n._subscribeContent(o, r);
      }
    } : null, this.hostVisibility = {
      get value() {
        return n._hostVisibility;
      },
      subscribe(o, r) {
        return n._subscribeHostVisibility(o, r);
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
}, Uf = class extends HTMLElement {
  constructor() {
    super(), Be(this, "_internals"), Be(this, "_contentObserver", null), Be(this, "_initialized", !1), Be(this, "_container", null), Be(this, "_reactive", null), Be(this, "_lastProps", null), Be(this, "_lastErrors", []), Be(this, "_lastContent", null), Be(this, "_themeUnsub", null), Be(this, "_hostVisible", null), this._internals = this.attachInternals(), this._hostVisible = cs(this);
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
    return [.../* @__PURE__ */ new Set([...t, ...n, Xi])];
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
    return Su(this);
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
      let n, o;
      if (this._lastProps !== null)
        n = this._lastProps, o = this._lastErrors;
      else {
        const a = zr(this, e.propsSchema);
        e.validateProps && a.errors.push(...e.validateProps(a.props)), n = a.props, o = a.errors, this._lastProps = n, this._lastErrors = o;
      }
      const r = t ? this._lastContent ?? this._extractContent(e.contentTemplate) : null;
      t && this._lastContent === null && (this._lastContent = r), this._reactive = new Yf(
        { props: n, errors: o, content: r, hasContent: t, hostVisibility: this._hostVisible },
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
      let o;
      if (t)
        o = this._container;
      else {
        this.onInit(n), e.inlineCss && Vf(n, e.inlineCss);
        try {
          const c = us?.theming, l = Rf(
            c?.global?.cssVariables,
            c?.children?.cssVariables
          );
          Bf(n, l);
        } catch {
        }
        if (e.customCss !== !1)
          try {
            const c = us?.theming, l = [c?.global?.customCSS, c?.children?.customCSS].filter(Boolean).join(`
`);
            l && Hf(n, l);
          } catch {
          }
        (e.hostCssKeys === void 0 || e.hostCssKeys.length > 0) && Lf(n, e.hostCssKeys), o = document.createElement("div"), o.setAttribute("data-wippy-theme-root", "");
        const u = e.containerClasses ?? [];
        u.length > 0 && o.classList.add(...u), n.appendChild(o), this._container = o, Sf($f);
      }
      this._applyTheme(), this._themeUnsub || (this._themeUnsub = Eu("@theme", (u) => this._applyTheme(u)));
      const { props: r, errors: a } = zr(this, e.propsSchema);
      e.validateProps && a.push(...e.validateProps(r));
      const i = r;
      this._lastProps = i, this._lastErrors = a;
      let s = null;
      e.contentTemplate && (s = this._extractContent(e.contentTemplate), this._lastContent = s, this._contentObserver = new MutationObserver(() => {
        const u = this._extractContent(e.contentTemplate);
        this._lastContent = u, this._reactive?.notifyContent(u), this.onContentChanged(u);
      }), this._contentObserver.observe(this, {
        childList: !0,
        characterData: !0,
        subtree: !0
      })), this.onMount(n, o, i, a, s, t), this._internals.states.delete("loading"), this._internals.states.add("ready"), t || (this._initialized = !0), this.onReady(), this.emitEvent("load");
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
  _applyTheme(e = Cf.getThemeMode?.()) {
    go(e, this), this._container && go(e, this._container);
  }
  disconnectedCallback() {
    this._themeUnsub && (this._themeUnsub(), this._themeUnsub = null), go("auto", this), this._container && go("auto", this._container), this._contentObserver && (this._contentObserver.disconnect(), this._contentObserver = null), this.onUnmount(), this.emitEvent("unload"), this._internals.states.clear(), this._reactive?.dispose(), this._reactive = null, this._lastProps = null, this._lastErrors = [], this._lastContent = null, delete this.__wippyHost, delete this.__wippyHostBus;
  }
  attributeChangedCallback(e, t, n) {
    if (t === n)
      return;
    if (e === Xi) {
      const s = this._hostVisible, u = cs(this);
      if (u === s)
        return;
      this._hostVisible = u, this.isConnected && this._initialized && (this._reactive?.notifyHostVisibility(u, s), this.onHostVisibilityChanged(u, s));
      return;
    }
    const o = this.constructor.wippyConfig, { props: r, errors: a } = zr(this, o.propsSchema);
    o.validateProps && a.push(...o.validateProps(r));
    const i = r;
    this._lastProps = i, this._lastErrors = a, this._reactive?.notifyProps(i, a), this.onPropsChanged(i, a);
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
function qf(e) {
  return e.__wippyHostBus ?? null;
}
function Xf(e) {
  return e.dataset.wippyPanelId ?? null;
}
/*!
 * pinia v4.0.3
 * (c) 2026 Eduardo San Martin Morote
 * @license MIT
 */
let Cu;
const Nu = (e) => Cu = e, Wf = () => ff() && ot(Mu) || Cu, Mu = (
  /* istanbul ignore next */
  Symbol()
);
function Kf() {
  const e = Ea(!0), t = e.run(() => le({}));
  let n = [], o = [];
  const r = Rt({
    install(a) {
      Nu(r), r._a = a, a.provide(Mu, r), a.config.globalProperties.$pinia = r, o.forEach((i) => n.push(i)), o = [];
    },
    use(a) {
      return this._a ? n.push(a) : o.push(a), this;
    },
    _p: n,
    _a: null,
    _e: e,
    _s: /* @__PURE__ */ new Map(),
    state: t
  });
  return r;
}
var jf = Object.defineProperty, Zf = (e, t, n) => t in e ? jf(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n, rn = (e, t, n) => Zf(e, typeof t != "symbol" ? t + "" : t, n), Jf = /* @__PURE__ */ Symbol("wippy:emit"), Tu = /* @__PURE__ */ Symbol("wippy:props"), Qf = /* @__PURE__ */ Symbol("wippy:props_error"), eh = /* @__PURE__ */ Symbol("wippy:content"), th = /* @__PURE__ */ Symbol("wippy:panel-id"), nh = /* @__PURE__ */ Symbol("wippy:layout-bus"), oh = /* @__PURE__ */ Symbol("wippy:host"), rh = /* @__PURE__ */ Symbol("wippy:host-visibility");
function ih() {
  const e = ot(Tu);
  if (!e)
    throw new Error("useProps() must be called inside a WippyVueElement");
  return e;
}
var ah = class extends Uf {
  constructor() {
    super(...arguments), rn(this, "_vueApp", null), rn(this, "_propsRef", le({})), rn(this, "_errorsRef", le([])), rn(this, "_contentRef", le(null)), rn(this, "_hostVisibilityRef", le(null)), rn(this, "_bridgeAbort", null);
  }
  /**
   * Override to provide Vue-specific configuration.
   */
  static get vueConfig() {
    throw new Error("WippyVueElement subclass must override static get vueConfig()");
  }
  onMount(e, t, n, o, r, a) {
    const i = this.constructor.vueConfig;
    this._propsRef.value = n, this._errorsRef.value = o, this._contentRef.value = r ?? null, this._hostVisibilityRef.value = this.hostVisible;
    for (const c of o)
      this.emitEvent("invalid", { message: c });
    const s = new AbortController();
    this._bridgeAbort = s, this.reactive.props.subscribe((c, l) => {
      this._propsRef.value = c, this._errorsRef.value = [...l];
      for (const d of l)
        this.emitEvent("invalid", { message: d });
    }, { signal: s.signal }), this.reactive.content && this.reactive.content.subscribe((c) => {
      this._contentRef.value = c;
    }, { signal: s.signal }), this.reactive.hostVisibility.subscribe((c) => {
      this._hostVisibilityRef.value = c;
    }, { signal: s.signal });
    const u = (c) => {
      if (s.signal.aborted)
        return;
      const l = Wf(), d = hf(c.rootComponent);
      this._vueApp = d;
      const f = Kf();
      if (c.piniaPlugins)
        for (const h of c.piniaPlugins)
          f.use(h);
      if (d.use(f), c.plugins)
        for (const h of c.plugins)
          d.use(h);
      d.provide(Tu, this._propsRef), d.provide(Qf, this._errorsRef), d.provide(Jf, this.emitEvent.bind(this)), d.provide(eh, this._contentRef), d.provide(rh, this._hostVisibilityRef), d.provide(th, Xf(this)), d.provide(nh, qf(this)), d.provide(oh, Su(this)), c.providers && c.providers(d, this), d.mount(t), l && Nu(l);
    };
    if (i.rootComponent)
      u(i);
    else if (i.lazyConfig) {
      const c = document.createElement("wippy-loading");
      c.setAttribute("no-bg", ""), t.appendChild(c), i.lazyConfig().then((l) => {
        s.signal.aborted || (c.remove(), u(l));
      }).catch((l) => {
        if (s.signal.aborted)
          return;
        const d = l instanceof Error ? l.message : String(l), f = document.createElement("wippy-error");
        f.setAttribute("title", "Failed to load"), f.setAttribute("message", d), c.replaceWith(f), this.emitEvent("error", { message: d });
      });
    } else
      throw new Error("WippyVueElement vueConfig must provide rootComponent or lazyConfig");
  }
  onUnmount() {
    this._bridgeAbort?.abort(), this._bridgeAbort = null, this._vueApp && (this._vueApp.unmount(), this._vueApp = null);
  }
};
function Gn(e) {
  return ku() ? (Do(e), !0) : !1;
}
function _t(e) {
  return typeof e == "function" ? e() : oe(e);
}
const sh = typeof window < "u" && typeof document < "u", lh = (e) => typeof e < "u", uh = Object.prototype.toString, ch = (e) => uh.call(e) === "[object Object]", dh = () => {
};
function fh(e, t) {
  function n(...o) {
    return new Promise((r, a) => {
      Promise.resolve(e(() => t.apply(this, o), { fn: t, thisArg: this, args: o })).then(r).catch(a);
    });
  }
  return n;
}
const Iu = (e) => e();
function hh(e = Iu) {
  const t = le(!0);
  function n() {
    t.value = !1;
  }
  function o() {
    t.value = !0;
  }
  const r = (...a) => {
    t.value && e(...a);
  };
  return { isActive: kf(t), pause: n, resume: o, eventFilter: r };
}
function fs(e, t = !1, n = "Timeout") {
  return new Promise((o, r) => {
    setTimeout(t ? () => r(n) : o, e);
  });
}
function ph(e, t, n = {}) {
  const {
    eventFilter: o = Iu,
    ...r
  } = n;
  return xe(
    e,
    fh(
      o,
      t
    ),
    r
  );
}
function an(e, t, n = {}) {
  const {
    eventFilter: o,
    ...r
  } = n, { eventFilter: a, pause: i, resume: s, isActive: u } = hh(o);
  return { stop: ph(
    e,
    t,
    {
      ...r,
      eventFilter: a
    }
  ), pause: i, resume: s, isActive: u };
}
function gh(e, t = {}) {
  if (!$a(e))
    return bf(e);
  const n = Array.isArray(e.value) ? Array.from({ length: e.value.length }) : {};
  for (const o in e.value)
    n[o] = wf(() => ({
      get() {
        return e.value[o];
      },
      set(r) {
        var a;
        if ((a = _t(t.replaceRef)) != null ? a : !0)
          if (Array.isArray(e.value)) {
            const s = [...e.value];
            s[o] = r, e.value = s;
          } else {
            const s = { ...e.value, [o]: r };
            Object.setPrototypeOf(s, Object.getPrototypeOf(e.value)), e.value = s;
          }
        else
          e.value[o] = r;
      }
    }));
  return n;
}
function Wi(e, t = !1) {
  function n(d, { flush: f = "sync", deep: h = !1, timeout: b, throwOnTimeout: w } = {}) {
    let m = null;
    const v = [new Promise((g) => {
      m = xe(
        e,
        (k) => {
          d(k) !== t && (m?.(), g(k));
        },
        {
          flush: f,
          deep: h,
          immediate: !0
        }
      );
    })];
    return b != null && v.push(
      fs(b, w).then(() => _t(e)).finally(() => m?.())
    ), Promise.race(v);
  }
  function o(d, f) {
    if (!$a(d))
      return n((k) => k === d, f);
    const { flush: h = "sync", deep: b = !1, timeout: w, throwOnTimeout: m } = f ?? {};
    let p = null;
    const g = [new Promise((k) => {
      p = xe(
        [e, d],
        ([P, F]) => {
          t !== (P === F) && (p?.(), k(P));
        },
        {
          flush: h,
          deep: b,
          immediate: !0
        }
      );
    })];
    return w != null && g.push(
      fs(w, m).then(() => _t(e)).finally(() => (p?.(), _t(e)))
    ), Promise.race(g);
  }
  function r(d) {
    return n((f) => !!f, d);
  }
  function a(d) {
    return o(null, d);
  }
  function i(d) {
    return o(void 0, d);
  }
  function s(d) {
    return n(Number.isNaN, d);
  }
  function u(d, f) {
    return n((h) => {
      const b = Array.from(h);
      return b.includes(d) || b.includes(_t(d));
    }, f);
  }
  function c(d) {
    return l(1, d);
  }
  function l(d = 1, f) {
    let h = -1;
    return n(() => (h += 1, h >= d), f);
  }
  return Array.isArray(_t(e)) ? {
    toMatch: n,
    toContains: u,
    changed: c,
    changedTimes: l,
    get not() {
      return Wi(e, !t);
    }
  } : {
    toMatch: n,
    toBe: o,
    toBeTruthy: r,
    toBeNull: a,
    toBeNaN: s,
    toBeUndefined: i,
    changed: c,
    changedTimes: l,
    get not() {
      return Wi(e, !t);
    }
  };
}
function Ki(e) {
  return Wi(e);
}
function vh(e) {
  var t;
  const n = _t(e);
  return (t = n?.$el) != null ? t : n;
}
const Du = sh ? window : void 0;
function Au(...e) {
  let t, n, o, r;
  if (typeof e[0] == "string" || Array.isArray(e[0]) ? ([n, o, r] = e, t = Du) : [t, n, o, r] = e, !t)
    return dh;
  Array.isArray(n) || (n = [n]), Array.isArray(o) || (o = [o]);
  const a = [], i = () => {
    a.forEach((l) => l()), a.length = 0;
  }, s = (l, d, f, h) => (l.addEventListener(d, f, h), () => l.removeEventListener(d, f, h)), u = xe(
    () => [vh(t), _t(r)],
    ([l, d]) => {
      if (i(), !l)
        return;
      const f = ch(d) ? { ...d } : d;
      a.push(
        ...n.flatMap((h) => o.map((b) => s(l, h, b, f)))
      );
    },
    { immediate: !0, flush: "post" }
  ), c = () => {
    u(), i();
  };
  return Gn(c), c;
}
function mh(e) {
  return typeof e == "function" ? e : typeof e == "string" ? (t) => t.key === e : Array.isArray(e) ? (t) => e.includes(t.key) : () => !0;
}
function hs(...e) {
  let t, n, o = {};
  e.length === 3 ? (t = e[0], n = e[1], o = e[2]) : e.length === 2 ? typeof e[1] == "object" ? (t = !0, n = e[0], o = e[1]) : (t = e[0], n = e[1]) : (t = !0, n = e[0]);
  const {
    target: r = Du,
    eventName: a = "keydown",
    passive: i = !1,
    dedupe: s = !1
  } = o, u = mh(t);
  return Au(r, a, (l) => {
    l.repeat && _t(s) || u(l) && n(l);
  }, i);
}
function yh(e) {
  return JSON.parse(JSON.stringify(e));
}
function Br(e, t, n, o = {}) {
  var r, a, i;
  const {
    clone: s = !1,
    passive: u = !1,
    eventName: c,
    deep: l = !1,
    defaultValue: d,
    shouldEmit: f
  } = o, h = kn(), b = n || h?.emit || ((r = h?.$emit) == null ? void 0 : r.bind(h)) || ((i = (a = h?.proxy) == null ? void 0 : a.$emit) == null ? void 0 : i.bind(h?.proxy));
  let w = c;
  t || (t = "modelValue"), w = w || `update:${t.toString()}`;
  const m = (g) => s ? typeof s == "function" ? s(g) : yh(g) : g, p = () => lh(e[t]) ? m(e[t]) : d, v = (g) => {
    f ? f(g) && b(w, g) : b(w, g);
  };
  if (u) {
    const g = p(), k = le(g);
    let P = !1;
    return xe(
      () => e[t],
      (F) => {
        P || (P = !0, k.value = m(F), Ke(() => P = !1));
      }
    ), xe(
      k,
      (F) => {
        !P && (F !== e[t] || l) && v(F);
      },
      { deep: l }
    ), k;
  } else
    return ne({
      get() {
        return p();
      },
      set(g) {
        v(g);
      }
    });
}
var bh = { value: () => {
} };
function cr() {
  for (var e = 0, t = arguments.length, n = {}, o; e < t; ++e) {
    if (!(o = arguments[e] + "") || o in n || /[\s.]/.test(o))
      throw new Error("illegal type: " + o);
    n[o] = [];
  }
  return new Po(n);
}
function Po(e) {
  this._ = e;
}
function wh(e, t) {
  return e.trim().split(/^|\s+/).map(function(n) {
    var o = "", r = n.indexOf(".");
    if (r >= 0 && (o = n.slice(r + 1), n = n.slice(0, r)), n && !t.hasOwnProperty(n))
      throw new Error("unknown type: " + n);
    return { type: n, name: o };
  });
}
Po.prototype = cr.prototype = {
  constructor: Po,
  on: function(e, t) {
    var n = this._, o = wh(e + "", n), r, a = -1, i = o.length;
    if (arguments.length < 2) {
      for (; ++a < i; )
        if ((r = (e = o[a]).type) && (r = kh(n[r], e.name)))
          return r;
      return;
    }
    if (t != null && typeof t != "function")
      throw new Error("invalid callback: " + t);
    for (; ++a < i; )
      if (r = (e = o[a]).type)
        n[r] = ps(n[r], e.name, t);
      else if (t == null)
        for (r in n)
          n[r] = ps(n[r], e.name, null);
    return this;
  },
  copy: function() {
    var e = {}, t = this._;
    for (var n in t)
      e[n] = t[n].slice();
    return new Po(e);
  },
  call: function(e, t) {
    if ((r = arguments.length - 2) > 0)
      for (var n = new Array(r), o = 0, r, a; o < r; ++o)
        n[o] = arguments[o + 2];
    if (!this._.hasOwnProperty(e))
      throw new Error("unknown type: " + e);
    for (a = this._[e], o = 0, r = a.length; o < r; ++o)
      a[o].value.apply(t, n);
  },
  apply: function(e, t, n) {
    if (!this._.hasOwnProperty(e))
      throw new Error("unknown type: " + e);
    for (var o = this._[e], r = 0, a = o.length; r < a; ++r)
      o[r].value.apply(t, n);
  }
};
function kh(e, t) {
  for (var n = 0, o = e.length, r; n < o; ++n)
    if ((r = e[n]).name === t)
      return r.value;
}
function ps(e, t, n) {
  for (var o = 0, r = e.length; o < r; ++o)
    if (e[o].name === t) {
      e[o] = bh, e = e.slice(0, o).concat(e.slice(o + 1));
      break;
    }
  return n != null && e.push({ name: t, value: n }), e;
}
var ji = "http://www.w3.org/1999/xhtml";
const gs = {
  svg: "http://www.w3.org/2000/svg",
  xhtml: ji,
  xlink: "http://www.w3.org/1999/xlink",
  xml: "http://www.w3.org/XML/1998/namespace",
  xmlns: "http://www.w3.org/2000/xmlns/"
};
function dr(e) {
  var t = e += "", n = t.indexOf(":");
  return n >= 0 && (t = e.slice(0, n)) !== "xmlns" && (e = e.slice(n + 1)), gs.hasOwnProperty(t) ? { space: gs[t], local: e } : e;
}
function _h(e) {
  return function() {
    var t = this.ownerDocument, n = this.namespaceURI;
    return n === ji && t.documentElement.namespaceURI === ji ? t.createElement(e) : t.createElementNS(n, e);
  };
}
function xh(e) {
  return function() {
    return this.ownerDocument.createElementNS(e.space, e.local);
  };
}
function Pu(e) {
  var t = dr(e);
  return (t.local ? xh : _h)(t);
}
function Eh() {
}
function Ca(e) {
  return e == null ? Eh : function() {
    return this.querySelector(e);
  };
}
function $h(e) {
  typeof e != "function" && (e = Ca(e));
  for (var t = this._groups, n = t.length, o = new Array(n), r = 0; r < n; ++r)
    for (var a = t[r], i = a.length, s = o[r] = new Array(i), u, c, l = 0; l < i; ++l)
      (u = a[l]) && (c = e.call(u, u.__data__, l, a)) && ("__data__" in u && (c.__data__ = u.__data__), s[l] = c);
  return new Je(o, this._parents);
}
function Sh(e) {
  return e == null ? [] : Array.isArray(e) ? e : Array.from(e);
}
function Ch() {
  return [];
}
function Ou(e) {
  return e == null ? Ch : function() {
    return this.querySelectorAll(e);
  };
}
function Nh(e) {
  return function() {
    return Sh(e.apply(this, arguments));
  };
}
function Mh(e) {
  typeof e == "function" ? e = Nh(e) : e = Ou(e);
  for (var t = this._groups, n = t.length, o = [], r = [], a = 0; a < n; ++a)
    for (var i = t[a], s = i.length, u, c = 0; c < s; ++c)
      (u = i[c]) && (o.push(e.call(u, u.__data__, c, i)), r.push(u));
  return new Je(o, r);
}
function Ru(e) {
  return function() {
    return this.matches(e);
  };
}
function zu(e) {
  return function(t) {
    return t.matches(e);
  };
}
var Th = Array.prototype.find;
function Ih(e) {
  return function() {
    return Th.call(this.children, e);
  };
}
function Dh() {
  return this.firstElementChild;
}
function Ah(e) {
  return this.select(e == null ? Dh : Ih(typeof e == "function" ? e : zu(e)));
}
var Ph = Array.prototype.filter;
function Oh() {
  return Array.from(this.children);
}
function Rh(e) {
  return function() {
    return Ph.call(this.children, e);
  };
}
function zh(e) {
  return this.selectAll(e == null ? Oh : Rh(typeof e == "function" ? e : zu(e)));
}
function Bh(e) {
  typeof e != "function" && (e = Ru(e));
  for (var t = this._groups, n = t.length, o = new Array(n), r = 0; r < n; ++r)
    for (var a = t[r], i = a.length, s = o[r] = [], u, c = 0; c < i; ++c)
      (u = a[c]) && e.call(u, u.__data__, c, a) && s.push(u);
  return new Je(o, this._parents);
}
function Bu(e) {
  return new Array(e.length);
}
function Lh() {
  return new Je(this._enter || this._groups.map(Bu), this._parents);
}
function Uo(e, t) {
  this.ownerDocument = e.ownerDocument, this.namespaceURI = e.namespaceURI, this._next = null, this._parent = e, this.__data__ = t;
}
Uo.prototype = {
  constructor: Uo,
  appendChild: function(e) {
    return this._parent.insertBefore(e, this._next);
  },
  insertBefore: function(e, t) {
    return this._parent.insertBefore(e, t);
  },
  querySelector: function(e) {
    return this._parent.querySelector(e);
  },
  querySelectorAll: function(e) {
    return this._parent.querySelectorAll(e);
  }
};
function Vh(e) {
  return function() {
    return e;
  };
}
function Hh(e, t, n, o, r, a) {
  for (var i = 0, s, u = t.length, c = a.length; i < c; ++i)
    (s = t[i]) ? (s.__data__ = a[i], o[i] = s) : n[i] = new Uo(e, a[i]);
  for (; i < u; ++i)
    (s = t[i]) && (r[i] = s);
}
function Fh(e, t, n, o, r, a, i) {
  var s, u, c = /* @__PURE__ */ new Map(), l = t.length, d = a.length, f = new Array(l), h;
  for (s = 0; s < l; ++s)
    (u = t[s]) && (f[s] = h = i.call(u, u.__data__, s, t) + "", c.has(h) ? r[s] = u : c.set(h, u));
  for (s = 0; s < d; ++s)
    h = i.call(e, a[s], s, a) + "", (u = c.get(h)) ? (o[s] = u, u.__data__ = a[s], c.delete(h)) : n[s] = new Uo(e, a[s]);
  for (s = 0; s < l; ++s)
    (u = t[s]) && c.get(f[s]) === u && (r[s] = u);
}
function Gh(e) {
  return e.__data__;
}
function Yh(e, t) {
  if (!arguments.length)
    return Array.from(this, Gh);
  var n = t ? Fh : Hh, o = this._parents, r = this._groups;
  typeof e != "function" && (e = Vh(e));
  for (var a = r.length, i = new Array(a), s = new Array(a), u = new Array(a), c = 0; c < a; ++c) {
    var l = o[c], d = r[c], f = d.length, h = Uh(e.call(l, l && l.__data__, c, o)), b = h.length, w = s[c] = new Array(b), m = i[c] = new Array(b), p = u[c] = new Array(f);
    n(l, d, w, m, p, h, t);
    for (var v = 0, g = 0, k, P; v < b; ++v)
      if (k = w[v]) {
        for (v >= g && (g = v + 1); !(P = m[g]) && ++g < b; )
          ;
        k._next = P || null;
      }
  }
  return i = new Je(i, o), i._enter = s, i._exit = u, i;
}
function Uh(e) {
  return typeof e == "object" && "length" in e ? e : Array.from(e);
}
function qh() {
  return new Je(this._exit || this._groups.map(Bu), this._parents);
}
function Xh(e, t, n) {
  var o = this.enter(), r = this, a = this.exit();
  return typeof e == "function" ? (o = e(o), o && (o = o.selection())) : o = o.append(e + ""), t != null && (r = t(r), r && (r = r.selection())), n == null ? a.remove() : n(a), o && r ? o.merge(r).order() : r;
}
function Wh(e) {
  for (var t = e.selection ? e.selection() : e, n = this._groups, o = t._groups, r = n.length, a = o.length, i = Math.min(r, a), s = new Array(r), u = 0; u < i; ++u)
    for (var c = n[u], l = o[u], d = c.length, f = s[u] = new Array(d), h, b = 0; b < d; ++b)
      (h = c[b] || l[b]) && (f[b] = h);
  for (; u < r; ++u)
    s[u] = n[u];
  return new Je(s, this._parents);
}
function Kh() {
  for (var e = this._groups, t = -1, n = e.length; ++t < n; )
    for (var o = e[t], r = o.length - 1, a = o[r], i; --r >= 0; )
      (i = o[r]) && (a && i.compareDocumentPosition(a) ^ 4 && a.parentNode.insertBefore(i, a), a = i);
  return this;
}
function jh(e) {
  e || (e = Zh);
  function t(d, f) {
    return d && f ? e(d.__data__, f.__data__) : !d - !f;
  }
  for (var n = this._groups, o = n.length, r = new Array(o), a = 0; a < o; ++a) {
    for (var i = n[a], s = i.length, u = r[a] = new Array(s), c, l = 0; l < s; ++l)
      (c = i[l]) && (u[l] = c);
    u.sort(t);
  }
  return new Je(r, this._parents).order();
}
function Zh(e, t) {
  return e < t ? -1 : e > t ? 1 : e >= t ? 0 : NaN;
}
function Jh() {
  var e = arguments[0];
  return arguments[0] = this, e.apply(null, arguments), this;
}
function Qh() {
  return Array.from(this);
}
function ep() {
  for (var e = this._groups, t = 0, n = e.length; t < n; ++t)
    for (var o = e[t], r = 0, a = o.length; r < a; ++r) {
      var i = o[r];
      if (i)
        return i;
    }
  return null;
}
function tp() {
  let e = 0;
  for (const t of this)
    ++e;
  return e;
}
function np() {
  return !this.node();
}
function op(e) {
  for (var t = this._groups, n = 0, o = t.length; n < o; ++n)
    for (var r = t[n], a = 0, i = r.length, s; a < i; ++a)
      (s = r[a]) && e.call(s, s.__data__, a, r);
  return this;
}
function rp(e) {
  return function() {
    this.removeAttribute(e);
  };
}
function ip(e) {
  return function() {
    this.removeAttributeNS(e.space, e.local);
  };
}
function ap(e, t) {
  return function() {
    this.setAttribute(e, t);
  };
}
function sp(e, t) {
  return function() {
    this.setAttributeNS(e.space, e.local, t);
  };
}
function lp(e, t) {
  return function() {
    var n = t.apply(this, arguments);
    n == null ? this.removeAttribute(e) : this.setAttribute(e, n);
  };
}
function up(e, t) {
  return function() {
    var n = t.apply(this, arguments);
    n == null ? this.removeAttributeNS(e.space, e.local) : this.setAttributeNS(e.space, e.local, n);
  };
}
function cp(e, t) {
  var n = dr(e);
  if (arguments.length < 2) {
    var o = this.node();
    return n.local ? o.getAttributeNS(n.space, n.local) : o.getAttribute(n);
  }
  return this.each((t == null ? n.local ? ip : rp : typeof t == "function" ? n.local ? up : lp : n.local ? sp : ap)(n, t));
}
function Lu(e) {
  return e.ownerDocument && e.ownerDocument.defaultView || e.document && e || e.defaultView;
}
function dp(e) {
  return function() {
    this.style.removeProperty(e);
  };
}
function fp(e, t, n) {
  return function() {
    this.style.setProperty(e, t, n);
  };
}
function hp(e, t, n) {
  return function() {
    var o = t.apply(this, arguments);
    o == null ? this.style.removeProperty(e) : this.style.setProperty(e, o, n);
  };
}
function pp(e, t, n) {
  return arguments.length > 1 ? this.each((t == null ? dp : typeof t == "function" ? hp : fp)(e, t, n ?? "")) : gn(this.node(), e);
}
function gn(e, t) {
  return e.style.getPropertyValue(t) || Lu(e).getComputedStyle(e, null).getPropertyValue(t);
}
function gp(e) {
  return function() {
    delete this[e];
  };
}
function vp(e, t) {
  return function() {
    this[e] = t;
  };
}
function mp(e, t) {
  return function() {
    var n = t.apply(this, arguments);
    n == null ? delete this[e] : this[e] = n;
  };
}
function yp(e, t) {
  return arguments.length > 1 ? this.each((t == null ? gp : typeof t == "function" ? mp : vp)(e, t)) : this.node()[e];
}
function Vu(e) {
  return e.trim().split(/^|\s+/);
}
function Na(e) {
  return e.classList || new Hu(e);
}
function Hu(e) {
  this._node = e, this._names = Vu(e.getAttribute("class") || "");
}
Hu.prototype = {
  add: function(e) {
    var t = this._names.indexOf(e);
    t < 0 && (this._names.push(e), this._node.setAttribute("class", this._names.join(" ")));
  },
  remove: function(e) {
    var t = this._names.indexOf(e);
    t >= 0 && (this._names.splice(t, 1), this._node.setAttribute("class", this._names.join(" ")));
  },
  contains: function(e) {
    return this._names.indexOf(e) >= 0;
  }
};
function Fu(e, t) {
  for (var n = Na(e), o = -1, r = t.length; ++o < r; )
    n.add(t[o]);
}
function Gu(e, t) {
  for (var n = Na(e), o = -1, r = t.length; ++o < r; )
    n.remove(t[o]);
}
function bp(e) {
  return function() {
    Fu(this, e);
  };
}
function wp(e) {
  return function() {
    Gu(this, e);
  };
}
function kp(e, t) {
  return function() {
    (t.apply(this, arguments) ? Fu : Gu)(this, e);
  };
}
function _p(e, t) {
  var n = Vu(e + "");
  if (arguments.length < 2) {
    for (var o = Na(this.node()), r = -1, a = n.length; ++r < a; )
      if (!o.contains(n[r]))
        return !1;
    return !0;
  }
  return this.each((typeof t == "function" ? kp : t ? bp : wp)(n, t));
}
function xp() {
  this.textContent = "";
}
function Ep(e) {
  return function() {
    this.textContent = e;
  };
}
function $p(e) {
  return function() {
    var t = e.apply(this, arguments);
    this.textContent = t ?? "";
  };
}
function Sp(e) {
  return arguments.length ? this.each(e == null ? xp : (typeof e == "function" ? $p : Ep)(e)) : this.node().textContent;
}
function Cp() {
  this.innerHTML = "";
}
function Np(e) {
  return function() {
    this.innerHTML = e;
  };
}
function Mp(e) {
  return function() {
    var t = e.apply(this, arguments);
    this.innerHTML = t ?? "";
  };
}
function Tp(e) {
  return arguments.length ? this.each(e == null ? Cp : (typeof e == "function" ? Mp : Np)(e)) : this.node().innerHTML;
}
function Ip() {
  this.nextSibling && this.parentNode.appendChild(this);
}
function Dp() {
  return this.each(Ip);
}
function Ap() {
  this.previousSibling && this.parentNode.insertBefore(this, this.parentNode.firstChild);
}
function Pp() {
  return this.each(Ap);
}
function Op(e) {
  var t = typeof e == "function" ? e : Pu(e);
  return this.select(function() {
    return this.appendChild(t.apply(this, arguments));
  });
}
function Rp() {
  return null;
}
function zp(e, t) {
  var n = typeof e == "function" ? e : Pu(e), o = t == null ? Rp : typeof t == "function" ? t : Ca(t);
  return this.select(function() {
    return this.insertBefore(n.apply(this, arguments), o.apply(this, arguments) || null);
  });
}
function Bp() {
  var e = this.parentNode;
  e && e.removeChild(this);
}
function Lp() {
  return this.each(Bp);
}
function Vp() {
  var e = this.cloneNode(!1), t = this.parentNode;
  return t ? t.insertBefore(e, this.nextSibling) : e;
}
function Hp() {
  var e = this.cloneNode(!0), t = this.parentNode;
  return t ? t.insertBefore(e, this.nextSibling) : e;
}
function Fp(e) {
  return this.select(e ? Hp : Vp);
}
function Gp(e) {
  return arguments.length ? this.property("__data__", e) : this.node().__data__;
}
function Yp(e) {
  return function(t) {
    e.call(this, t, this.__data__);
  };
}
function Up(e) {
  return e.trim().split(/^|\s+/).map(function(t) {
    var n = "", o = t.indexOf(".");
    return o >= 0 && (n = t.slice(o + 1), t = t.slice(0, o)), { type: t, name: n };
  });
}
function qp(e) {
  return function() {
    var t = this.__on;
    if (t) {
      for (var n = 0, o = -1, r = t.length, a; n < r; ++n)
        a = t[n], (!e.type || a.type === e.type) && a.name === e.name ? this.removeEventListener(a.type, a.listener, a.options) : t[++o] = a;
      ++o ? t.length = o : delete this.__on;
    }
  };
}
function Xp(e, t, n) {
  return function() {
    var o = this.__on, r, a = Yp(t);
    if (o) {
      for (var i = 0, s = o.length; i < s; ++i)
        if ((r = o[i]).type === e.type && r.name === e.name) {
          this.removeEventListener(r.type, r.listener, r.options), this.addEventListener(r.type, r.listener = a, r.options = n), r.value = t;
          return;
        }
    }
    this.addEventListener(e.type, a, n), r = { type: e.type, name: e.name, value: t, listener: a, options: n }, o ? o.push(r) : this.__on = [r];
  };
}
function Wp(e, t, n) {
  var o = Up(e + ""), r, a = o.length, i;
  if (arguments.length < 2) {
    var s = this.node().__on;
    if (s) {
      for (var u = 0, c = s.length, l; u < c; ++u)
        for (r = 0, l = s[u]; r < a; ++r)
          if ((i = o[r]).type === l.type && i.name === l.name)
            return l.value;
    }
    return;
  }
  for (s = t ? Xp : qp, r = 0; r < a; ++r)
    this.each(s(o[r], t, n));
  return this;
}
function Yu(e, t, n) {
  var o = Lu(e), r = o.CustomEvent;
  typeof r == "function" ? r = new r(t, n) : (r = o.document.createEvent("Event"), n ? (r.initEvent(t, n.bubbles, n.cancelable), r.detail = n.detail) : r.initEvent(t, !1, !1)), e.dispatchEvent(r);
}
function Kp(e, t) {
  return function() {
    return Yu(this, e, t);
  };
}
function jp(e, t) {
  return function() {
    return Yu(this, e, t.apply(this, arguments));
  };
}
function Zp(e, t) {
  return this.each((typeof t == "function" ? jp : Kp)(e, t));
}
function* Jp() {
  for (var e = this._groups, t = 0, n = e.length; t < n; ++t)
    for (var o = e[t], r = 0, a = o.length, i; r < a; ++r)
      (i = o[r]) && (yield i);
}
var Uu = [null];
function Je(e, t) {
  this._groups = e, this._parents = t;
}
function ro() {
  return new Je([[document.documentElement]], Uu);
}
function Qp() {
  return this;
}
Je.prototype = ro.prototype = {
  constructor: Je,
  select: $h,
  selectAll: Mh,
  selectChild: Ah,
  selectChildren: zh,
  filter: Bh,
  data: Yh,
  enter: Lh,
  exit: qh,
  join: Xh,
  merge: Wh,
  selection: Qp,
  order: Kh,
  sort: jh,
  call: Jh,
  nodes: Qh,
  node: ep,
  size: tp,
  empty: np,
  each: op,
  attr: cp,
  style: pp,
  property: yp,
  classed: _p,
  text: Sp,
  html: Tp,
  raise: Dp,
  lower: Pp,
  append: Op,
  insert: zp,
  remove: Lp,
  clone: Fp,
  datum: Gp,
  on: Wp,
  dispatch: Zp,
  [Symbol.iterator]: Jp
};
function et(e) {
  return typeof e == "string" ? new Je([[document.querySelector(e)]], [document.documentElement]) : new Je([[e]], Uu);
}
function eg(e) {
  let t;
  for (; t = e.sourceEvent; )
    e = t;
  return e;
}
function ct(e, t) {
  if (e = eg(e), t === void 0 && (t = e.currentTarget), t) {
    var n = t.ownerSVGElement || t;
    if (n.createSVGPoint) {
      var o = n.createSVGPoint();
      return o.x = e.clientX, o.y = e.clientY, o = o.matrixTransform(t.getScreenCTM().inverse()), [o.x, o.y];
    }
    if (t.getBoundingClientRect) {
      var r = t.getBoundingClientRect();
      return [e.clientX - r.left - t.clientLeft, e.clientY - r.top - t.clientTop];
    }
  }
  return [e.pageX, e.pageY];
}
const tg = { passive: !1 }, Yn = { capture: !0, passive: !1 };
function Lr(e) {
  e.stopImmediatePropagation();
}
function dn(e) {
  e.preventDefault(), e.stopImmediatePropagation();
}
function qu(e) {
  var t = e.document.documentElement, n = et(e).on("dragstart.drag", dn, Yn);
  "onselectstart" in t ? n.on("selectstart.drag", dn, Yn) : (t.__noselect = t.style.MozUserSelect, t.style.MozUserSelect = "none");
}
function Xu(e, t) {
  var n = e.document.documentElement, o = et(e).on("dragstart.drag", null);
  t && (o.on("click.drag", dn, Yn), setTimeout(function() {
    o.on("click.drag", null);
  }, 0)), "onselectstart" in n ? o.on("selectstart.drag", null) : (n.style.MozUserSelect = n.__noselect, delete n.__noselect);
}
const vo = (e) => () => e;
function Zi(e, {
  sourceEvent: t,
  subject: n,
  target: o,
  identifier: r,
  active: a,
  x: i,
  y: s,
  dx: u,
  dy: c,
  dispatch: l
}) {
  Object.defineProperties(this, {
    type: { value: e, enumerable: !0, configurable: !0 },
    sourceEvent: { value: t, enumerable: !0, configurable: !0 },
    subject: { value: n, enumerable: !0, configurable: !0 },
    target: { value: o, enumerable: !0, configurable: !0 },
    identifier: { value: r, enumerable: !0, configurable: !0 },
    active: { value: a, enumerable: !0, configurable: !0 },
    x: { value: i, enumerable: !0, configurable: !0 },
    y: { value: s, enumerable: !0, configurable: !0 },
    dx: { value: u, enumerable: !0, configurable: !0 },
    dy: { value: c, enumerable: !0, configurable: !0 },
    _: { value: l }
  });
}
Zi.prototype.on = function() {
  var e = this._.on.apply(this._, arguments);
  return e === this._ ? this : e;
};
function ng(e) {
  return !e.ctrlKey && !e.button;
}
function og() {
  return this.parentNode;
}
function rg(e, t) {
  return t ?? { x: e.x, y: e.y };
}
function ig() {
  return navigator.maxTouchPoints || "ontouchstart" in this;
}
function ag() {
  var e = ng, t = og, n = rg, o = ig, r = {}, a = cr("start", "drag", "end"), i = 0, s, u, c, l, d = 0;
  function f(k) {
    k.on("mousedown.drag", h).filter(o).on("touchstart.drag", m).on("touchmove.drag", p, tg).on("touchend.drag touchcancel.drag", v).style("touch-action", "none").style("-webkit-tap-highlight-color", "rgba(0,0,0,0)");
  }
  function h(k, P) {
    if (!(l || !e.call(this, k, P))) {
      var F = g(this, t.call(this, k, P), k, P, "mouse");
      F && (et(k.view).on("mousemove.drag", b, Yn).on("mouseup.drag", w, Yn), qu(k.view), Lr(k), c = !1, s = k.clientX, u = k.clientY, F("start", k));
    }
  }
  function b(k) {
    if (dn(k), !c) {
      var P = k.clientX - s, F = k.clientY - u;
      c = P * P + F * F > d;
    }
    r.mouse("drag", k);
  }
  function w(k) {
    et(k.view).on("mousemove.drag mouseup.drag", null), Xu(k.view, c), dn(k), r.mouse("end", k);
  }
  function m(k, P) {
    if (e.call(this, k, P)) {
      var F = k.changedTouches, K = t.call(this, k, P), C = F.length, N, M;
      for (N = 0; N < C; ++N)
        (M = g(this, K, k, P, F[N].identifier, F[N])) && (Lr(k), M("start", k, F[N]));
    }
  }
  function p(k) {
    var P = k.changedTouches, F = P.length, K, C;
    for (K = 0; K < F; ++K)
      (C = r[P[K].identifier]) && (dn(k), C("drag", k, P[K]));
  }
  function v(k) {
    var P = k.changedTouches, F = P.length, K, C;
    for (l && clearTimeout(l), l = setTimeout(function() {
      l = null;
    }, 500), K = 0; K < F; ++K)
      (C = r[P[K].identifier]) && (Lr(k), C("end", k, P[K]));
  }
  function g(k, P, F, K, C, N) {
    var M = a.copy(), B = ct(N || F, P), S, Q, y;
    if ((y = n.call(k, new Zi("beforestart", {
      sourceEvent: F,
      target: f,
      identifier: C,
      active: i,
      x: B[0],
      y: B[1],
      dx: 0,
      dy: 0,
      dispatch: M
    }), K)) != null)
      return S = y.x - B[0] || 0, Q = y.y - B[1] || 0, function O(E, X, U) {
        var z = B, x;
        switch (E) {
          case "start":
            r[C] = O, x = i++;
            break;
          case "end":
            delete r[C], --i;
          case "drag":
            B = ct(U || X, P), x = i;
            break;
        }
        M.call(
          E,
          k,
          new Zi(E, {
            sourceEvent: X,
            subject: y,
            target: f,
            identifier: C,
            active: x,
            x: B[0] + S,
            y: B[1] + Q,
            dx: B[0] - z[0],
            dy: B[1] - z[1],
            dispatch: M
          }),
          K
        );
      };
  }
  return f.filter = function(k) {
    return arguments.length ? (e = typeof k == "function" ? k : vo(!!k), f) : e;
  }, f.container = function(k) {
    return arguments.length ? (t = typeof k == "function" ? k : vo(k), f) : t;
  }, f.subject = function(k) {
    return arguments.length ? (n = typeof k == "function" ? k : vo(k), f) : n;
  }, f.touchable = function(k) {
    return arguments.length ? (o = typeof k == "function" ? k : vo(!!k), f) : o;
  }, f.on = function() {
    var k = a.on.apply(a, arguments);
    return k === a ? f : k;
  }, f.clickDistance = function(k) {
    return arguments.length ? (d = (k = +k) * k, f) : Math.sqrt(d);
  }, f;
}
function Ma(e, t, n) {
  e.prototype = t.prototype = n, n.constructor = e;
}
function Wu(e, t) {
  var n = Object.create(e.prototype);
  for (var o in t)
    n[o] = t[o];
  return n;
}
function io() {
}
var Un = 0.7, qo = 1 / Un, fn = "\\s*([+-]?\\d+)\\s*", qn = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)\\s*", gt = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)%\\s*", sg = /^#([0-9a-f]{3,8})$/, lg = new RegExp(`^rgb\\(${fn},${fn},${fn}\\)$`), ug = new RegExp(`^rgb\\(${gt},${gt},${gt}\\)$`), cg = new RegExp(`^rgba\\(${fn},${fn},${fn},${qn}\\)$`), dg = new RegExp(`^rgba\\(${gt},${gt},${gt},${qn}\\)$`), fg = new RegExp(`^hsl\\(${qn},${gt},${gt}\\)$`), hg = new RegExp(`^hsla\\(${qn},${gt},${gt},${qn}\\)$`), vs = {
  aliceblue: 15792383,
  antiquewhite: 16444375,
  aqua: 65535,
  aquamarine: 8388564,
  azure: 15794175,
  beige: 16119260,
  bisque: 16770244,
  black: 0,
  blanchedalmond: 16772045,
  blue: 255,
  blueviolet: 9055202,
  brown: 10824234,
  burlywood: 14596231,
  cadetblue: 6266528,
  chartreuse: 8388352,
  chocolate: 13789470,
  coral: 16744272,
  cornflowerblue: 6591981,
  cornsilk: 16775388,
  crimson: 14423100,
  cyan: 65535,
  darkblue: 139,
  darkcyan: 35723,
  darkgoldenrod: 12092939,
  darkgray: 11119017,
  darkgreen: 25600,
  darkgrey: 11119017,
  darkkhaki: 12433259,
  darkmagenta: 9109643,
  darkolivegreen: 5597999,
  darkorange: 16747520,
  darkorchid: 10040012,
  darkred: 9109504,
  darksalmon: 15308410,
  darkseagreen: 9419919,
  darkslateblue: 4734347,
  darkslategray: 3100495,
  darkslategrey: 3100495,
  darkturquoise: 52945,
  darkviolet: 9699539,
  deeppink: 16716947,
  deepskyblue: 49151,
  dimgray: 6908265,
  dimgrey: 6908265,
  dodgerblue: 2003199,
  firebrick: 11674146,
  floralwhite: 16775920,
  forestgreen: 2263842,
  fuchsia: 16711935,
  gainsboro: 14474460,
  ghostwhite: 16316671,
  gold: 16766720,
  goldenrod: 14329120,
  gray: 8421504,
  green: 32768,
  greenyellow: 11403055,
  grey: 8421504,
  honeydew: 15794160,
  hotpink: 16738740,
  indianred: 13458524,
  indigo: 4915330,
  ivory: 16777200,
  khaki: 15787660,
  lavender: 15132410,
  lavenderblush: 16773365,
  lawngreen: 8190976,
  lemonchiffon: 16775885,
  lightblue: 11393254,
  lightcoral: 15761536,
  lightcyan: 14745599,
  lightgoldenrodyellow: 16448210,
  lightgray: 13882323,
  lightgreen: 9498256,
  lightgrey: 13882323,
  lightpink: 16758465,
  lightsalmon: 16752762,
  lightseagreen: 2142890,
  lightskyblue: 8900346,
  lightslategray: 7833753,
  lightslategrey: 7833753,
  lightsteelblue: 11584734,
  lightyellow: 16777184,
  lime: 65280,
  limegreen: 3329330,
  linen: 16445670,
  magenta: 16711935,
  maroon: 8388608,
  mediumaquamarine: 6737322,
  mediumblue: 205,
  mediumorchid: 12211667,
  mediumpurple: 9662683,
  mediumseagreen: 3978097,
  mediumslateblue: 8087790,
  mediumspringgreen: 64154,
  mediumturquoise: 4772300,
  mediumvioletred: 13047173,
  midnightblue: 1644912,
  mintcream: 16121850,
  mistyrose: 16770273,
  moccasin: 16770229,
  navajowhite: 16768685,
  navy: 128,
  oldlace: 16643558,
  olive: 8421376,
  olivedrab: 7048739,
  orange: 16753920,
  orangered: 16729344,
  orchid: 14315734,
  palegoldenrod: 15657130,
  palegreen: 10025880,
  paleturquoise: 11529966,
  palevioletred: 14381203,
  papayawhip: 16773077,
  peachpuff: 16767673,
  peru: 13468991,
  pink: 16761035,
  plum: 14524637,
  powderblue: 11591910,
  purple: 8388736,
  rebeccapurple: 6697881,
  red: 16711680,
  rosybrown: 12357519,
  royalblue: 4286945,
  saddlebrown: 9127187,
  salmon: 16416882,
  sandybrown: 16032864,
  seagreen: 3050327,
  seashell: 16774638,
  sienna: 10506797,
  silver: 12632256,
  skyblue: 8900331,
  slateblue: 6970061,
  slategray: 7372944,
  slategrey: 7372944,
  snow: 16775930,
  springgreen: 65407,
  steelblue: 4620980,
  tan: 13808780,
  teal: 32896,
  thistle: 14204888,
  tomato: 16737095,
  turquoise: 4251856,
  violet: 15631086,
  wheat: 16113331,
  white: 16777215,
  whitesmoke: 16119285,
  yellow: 16776960,
  yellowgreen: 10145074
};
Ma(io, Zt, {
  copy(e) {
    return Object.assign(new this.constructor(), this, e);
  },
  displayable() {
    return this.rgb().displayable();
  },
  hex: ms,
  // Deprecated! Use color.formatHex.
  formatHex: ms,
  formatHex8: pg,
  formatHsl: gg,
  formatRgb: ys,
  toString: ys
});
function ms() {
  return this.rgb().formatHex();
}
function pg() {
  return this.rgb().formatHex8();
}
function gg() {
  return Ku(this).formatHsl();
}
function ys() {
  return this.rgb().formatRgb();
}
function Zt(e) {
  var t, n;
  return e = (e + "").trim().toLowerCase(), (t = sg.exec(e)) ? (n = t[1].length, t = parseInt(t[1], 16), n === 6 ? bs(t) : n === 3 ? new Xe(t >> 8 & 15 | t >> 4 & 240, t >> 4 & 15 | t & 240, (t & 15) << 4 | t & 15, 1) : n === 8 ? mo(t >> 24 & 255, t >> 16 & 255, t >> 8 & 255, (t & 255) / 255) : n === 4 ? mo(t >> 12 & 15 | t >> 8 & 240, t >> 8 & 15 | t >> 4 & 240, t >> 4 & 15 | t & 240, ((t & 15) << 4 | t & 15) / 255) : null) : (t = lg.exec(e)) ? new Xe(t[1], t[2], t[3], 1) : (t = ug.exec(e)) ? new Xe(t[1] * 255 / 100, t[2] * 255 / 100, t[3] * 255 / 100, 1) : (t = cg.exec(e)) ? mo(t[1], t[2], t[3], t[4]) : (t = dg.exec(e)) ? mo(t[1] * 255 / 100, t[2] * 255 / 100, t[3] * 255 / 100, t[4]) : (t = fg.exec(e)) ? _s(t[1], t[2] / 100, t[3] / 100, 1) : (t = hg.exec(e)) ? _s(t[1], t[2] / 100, t[3] / 100, t[4]) : vs.hasOwnProperty(e) ? bs(vs[e]) : e === "transparent" ? new Xe(NaN, NaN, NaN, 0) : null;
}
function bs(e) {
  return new Xe(e >> 16 & 255, e >> 8 & 255, e & 255, 1);
}
function mo(e, t, n, o) {
  return o <= 0 && (e = t = n = NaN), new Xe(e, t, n, o);
}
function vg(e) {
  return e instanceof io || (e = Zt(e)), e ? (e = e.rgb(), new Xe(e.r, e.g, e.b, e.opacity)) : new Xe();
}
function Ji(e, t, n, o) {
  return arguments.length === 1 ? vg(e) : new Xe(e, t, n, o ?? 1);
}
function Xe(e, t, n, o) {
  this.r = +e, this.g = +t, this.b = +n, this.opacity = +o;
}
Ma(Xe, Ji, Wu(io, {
  brighter(e) {
    return e = e == null ? qo : Math.pow(qo, e), new Xe(this.r * e, this.g * e, this.b * e, this.opacity);
  },
  darker(e) {
    return e = e == null ? Un : Math.pow(Un, e), new Xe(this.r * e, this.g * e, this.b * e, this.opacity);
  },
  rgb() {
    return this;
  },
  clamp() {
    return new Xe(Wt(this.r), Wt(this.g), Wt(this.b), Xo(this.opacity));
  },
  displayable() {
    return -0.5 <= this.r && this.r < 255.5 && -0.5 <= this.g && this.g < 255.5 && -0.5 <= this.b && this.b < 255.5 && 0 <= this.opacity && this.opacity <= 1;
  },
  hex: ws,
  // Deprecated! Use color.formatHex.
  formatHex: ws,
  formatHex8: mg,
  formatRgb: ks,
  toString: ks
}));
function ws() {
  return `#${Ut(this.r)}${Ut(this.g)}${Ut(this.b)}`;
}
function mg() {
  return `#${Ut(this.r)}${Ut(this.g)}${Ut(this.b)}${Ut((isNaN(this.opacity) ? 1 : this.opacity) * 255)}`;
}
function ks() {
  const e = Xo(this.opacity);
  return `${e === 1 ? "rgb(" : "rgba("}${Wt(this.r)}, ${Wt(this.g)}, ${Wt(this.b)}${e === 1 ? ")" : `, ${e})`}`;
}
function Xo(e) {
  return isNaN(e) ? 1 : Math.max(0, Math.min(1, e));
}
function Wt(e) {
  return Math.max(0, Math.min(255, Math.round(e) || 0));
}
function Ut(e) {
  return e = Wt(e), (e < 16 ? "0" : "") + e.toString(16);
}
function _s(e, t, n, o) {
  return o <= 0 ? e = t = n = NaN : n <= 0 || n >= 1 ? e = t = NaN : t <= 0 && (e = NaN), new tt(e, t, n, o);
}
function Ku(e) {
  if (e instanceof tt)
    return new tt(e.h, e.s, e.l, e.opacity);
  if (e instanceof io || (e = Zt(e)), !e)
    return new tt();
  if (e instanceof tt)
    return e;
  e = e.rgb();
  var t = e.r / 255, n = e.g / 255, o = e.b / 255, r = Math.min(t, n, o), a = Math.max(t, n, o), i = NaN, s = a - r, u = (a + r) / 2;
  return s ? (t === a ? i = (n - o) / s + (n < o) * 6 : n === a ? i = (o - t) / s + 2 : i = (t - n) / s + 4, s /= u < 0.5 ? a + r : 2 - a - r, i *= 60) : s = u > 0 && u < 1 ? 0 : i, new tt(i, s, u, e.opacity);
}
function yg(e, t, n, o) {
  return arguments.length === 1 ? Ku(e) : new tt(e, t, n, o ?? 1);
}
function tt(e, t, n, o) {
  this.h = +e, this.s = +t, this.l = +n, this.opacity = +o;
}
Ma(tt, yg, Wu(io, {
  brighter(e) {
    return e = e == null ? qo : Math.pow(qo, e), new tt(this.h, this.s, this.l * e, this.opacity);
  },
  darker(e) {
    return e = e == null ? Un : Math.pow(Un, e), new tt(this.h, this.s, this.l * e, this.opacity);
  },
  rgb() {
    var e = this.h % 360 + (this.h < 0) * 360, t = isNaN(e) || isNaN(this.s) ? 0 : this.s, n = this.l, o = n + (n < 0.5 ? n : 1 - n) * t, r = 2 * n - o;
    return new Xe(
      Vr(e >= 240 ? e - 240 : e + 120, r, o),
      Vr(e, r, o),
      Vr(e < 120 ? e + 240 : e - 120, r, o),
      this.opacity
    );
  },
  clamp() {
    return new tt(xs(this.h), yo(this.s), yo(this.l), Xo(this.opacity));
  },
  displayable() {
    return (0 <= this.s && this.s <= 1 || isNaN(this.s)) && 0 <= this.l && this.l <= 1 && 0 <= this.opacity && this.opacity <= 1;
  },
  formatHsl() {
    const e = Xo(this.opacity);
    return `${e === 1 ? "hsl(" : "hsla("}${xs(this.h)}, ${yo(this.s) * 100}%, ${yo(this.l) * 100}%${e === 1 ? ")" : `, ${e})`}`;
  }
}));
function xs(e) {
  return e = (e || 0) % 360, e < 0 ? e + 360 : e;
}
function yo(e) {
  return Math.max(0, Math.min(1, e || 0));
}
function Vr(e, t, n) {
  return (e < 60 ? t + (n - t) * e / 60 : e < 180 ? n : e < 240 ? t + (n - t) * (240 - e) / 60 : t) * 255;
}
const Ta = (e) => () => e;
function bg(e, t) {
  return function(n) {
    return e + n * t;
  };
}
function wg(e, t, n) {
  return e = Math.pow(e, n), t = Math.pow(t, n) - e, n = 1 / n, function(o) {
    return Math.pow(e + o * t, n);
  };
}
function kg(e) {
  return (e = +e) == 1 ? ju : function(t, n) {
    return n - t ? wg(t, n, e) : Ta(isNaN(t) ? n : t);
  };
}
function ju(e, t) {
  var n = t - e;
  return n ? bg(e, n) : Ta(isNaN(e) ? t : e);
}
const Wo = (function e(t) {
  var n = kg(t);
  function o(r, a) {
    var i = n((r = Ji(r)).r, (a = Ji(a)).r), s = n(r.g, a.g), u = n(r.b, a.b), c = ju(r.opacity, a.opacity);
    return function(l) {
      return r.r = i(l), r.g = s(l), r.b = u(l), r.opacity = c(l), r + "";
    };
  }
  return o.gamma = e, o;
})(1);
function _g(e, t) {
  t || (t = []);
  var n = e ? Math.min(t.length, e.length) : 0, o = t.slice(), r;
  return function(a) {
    for (r = 0; r < n; ++r)
      o[r] = e[r] * (1 - a) + t[r] * a;
    return o;
  };
}
function xg(e) {
  return ArrayBuffer.isView(e) && !(e instanceof DataView);
}
function Eg(e, t) {
  var n = t ? t.length : 0, o = e ? Math.min(n, e.length) : 0, r = new Array(o), a = new Array(n), i;
  for (i = 0; i < o; ++i)
    r[i] = Bn(e[i], t[i]);
  for (; i < n; ++i)
    a[i] = t[i];
  return function(s) {
    for (i = 0; i < o; ++i)
      a[i] = r[i](s);
    return a;
  };
}
function $g(e, t) {
  var n = /* @__PURE__ */ new Date();
  return e = +e, t = +t, function(o) {
    return n.setTime(e * (1 - o) + t * o), n;
  };
}
function dt(e, t) {
  return e = +e, t = +t, function(n) {
    return e * (1 - n) + t * n;
  };
}
function Sg(e, t) {
  var n = {}, o = {}, r;
  (e === null || typeof e != "object") && (e = {}), (t === null || typeof t != "object") && (t = {});
  for (r in t)
    r in e ? n[r] = Bn(e[r], t[r]) : o[r] = t[r];
  return function(a) {
    for (r in n)
      o[r] = n[r](a);
    return o;
  };
}
var Qi = /[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g, Hr = new RegExp(Qi.source, "g");
function Cg(e) {
  return function() {
    return e;
  };
}
function Ng(e) {
  return function(t) {
    return e(t) + "";
  };
}
function Zu(e, t) {
  var n = Qi.lastIndex = Hr.lastIndex = 0, o, r, a, i = -1, s = [], u = [];
  for (e = e + "", t = t + ""; (o = Qi.exec(e)) && (r = Hr.exec(t)); )
    (a = r.index) > n && (a = t.slice(n, a), s[i] ? s[i] += a : s[++i] = a), (o = o[0]) === (r = r[0]) ? s[i] ? s[i] += r : s[++i] = r : (s[++i] = null, u.push({ i, x: dt(o, r) })), n = Hr.lastIndex;
  return n < t.length && (a = t.slice(n), s[i] ? s[i] += a : s[++i] = a), s.length < 2 ? u[0] ? Ng(u[0].x) : Cg(t) : (t = u.length, function(c) {
    for (var l = 0, d; l < t; ++l)
      s[(d = u[l]).i] = d.x(c);
    return s.join("");
  });
}
function Bn(e, t) {
  var n = typeof t, o;
  return t == null || n === "boolean" ? Ta(t) : (n === "number" ? dt : n === "string" ? (o = Zt(t)) ? (t = o, Wo) : Zu : t instanceof Zt ? Wo : t instanceof Date ? $g : xg(t) ? _g : Array.isArray(t) ? Eg : typeof t.valueOf != "function" && typeof t.toString != "function" || isNaN(t) ? Sg : dt)(e, t);
}
var Es = 180 / Math.PI, ea = {
  translateX: 0,
  translateY: 0,
  rotate: 0,
  skewX: 0,
  scaleX: 1,
  scaleY: 1
};
function Ju(e, t, n, o, r, a) {
  var i, s, u;
  return (i = Math.sqrt(e * e + t * t)) && (e /= i, t /= i), (u = e * n + t * o) && (n -= e * u, o -= t * u), (s = Math.sqrt(n * n + o * o)) && (n /= s, o /= s, u /= s), e * o < t * n && (e = -e, t = -t, u = -u, i = -i), {
    translateX: r,
    translateY: a,
    rotate: Math.atan2(t, e) * Es,
    skewX: Math.atan(u) * Es,
    scaleX: i,
    scaleY: s
  };
}
var bo;
function Mg(e) {
  const t = new (typeof DOMMatrix == "function" ? DOMMatrix : WebKitCSSMatrix)(e + "");
  return t.isIdentity ? ea : Ju(t.a, t.b, t.c, t.d, t.e, t.f);
}
function Tg(e) {
  return e == null || (bo || (bo = document.createElementNS("http://www.w3.org/2000/svg", "g")), bo.setAttribute("transform", e), !(e = bo.transform.baseVal.consolidate())) ? ea : (e = e.matrix, Ju(e.a, e.b, e.c, e.d, e.e, e.f));
}
function Qu(e, t, n, o) {
  function r(c) {
    return c.length ? c.pop() + " " : "";
  }
  function a(c, l, d, f, h, b) {
    if (c !== d || l !== f) {
      var w = h.push("translate(", null, t, null, n);
      b.push({ i: w - 4, x: dt(c, d) }, { i: w - 2, x: dt(l, f) });
    } else (d || f) && h.push("translate(" + d + t + f + n);
  }
  function i(c, l, d, f) {
    c !== l ? (c - l > 180 ? l += 360 : l - c > 180 && (c += 360), f.push({ i: d.push(r(d) + "rotate(", null, o) - 2, x: dt(c, l) })) : l && d.push(r(d) + "rotate(" + l + o);
  }
  function s(c, l, d, f) {
    c !== l ? f.push({ i: d.push(r(d) + "skewX(", null, o) - 2, x: dt(c, l) }) : l && d.push(r(d) + "skewX(" + l + o);
  }
  function u(c, l, d, f, h, b) {
    if (c !== d || l !== f) {
      var w = h.push(r(h) + "scale(", null, ",", null, ")");
      b.push({ i: w - 4, x: dt(c, d) }, { i: w - 2, x: dt(l, f) });
    } else (d !== 1 || f !== 1) && h.push(r(h) + "scale(" + d + "," + f + ")");
  }
  return function(c, l) {
    var d = [], f = [];
    return c = e(c), l = e(l), a(c.translateX, c.translateY, l.translateX, l.translateY, d, f), i(c.rotate, l.rotate, d, f), s(c.skewX, l.skewX, d, f), u(c.scaleX, c.scaleY, l.scaleX, l.scaleY, d, f), c = l = null, function(h) {
      for (var b = -1, w = f.length, m; ++b < w; )
        d[(m = f[b]).i] = m.x(h);
      return d.join("");
    };
  };
}
var Ig = Qu(Mg, "px, ", "px)", "deg)"), Dg = Qu(Tg, ", ", ")", ")"), Ag = 1e-12;
function $s(e) {
  return ((e = Math.exp(e)) + 1 / e) / 2;
}
function Pg(e) {
  return ((e = Math.exp(e)) - 1 / e) / 2;
}
function Og(e) {
  return ((e = Math.exp(2 * e)) - 1) / (e + 1);
}
const Oo = (function e(t, n, o) {
  function r(a, i) {
    var s = a[0], u = a[1], c = a[2], l = i[0], d = i[1], f = i[2], h = l - s, b = d - u, w = h * h + b * b, m, p;
    if (w < Ag)
      p = Math.log(f / c) / t, m = function(K) {
        return [
          s + K * h,
          u + K * b,
          c * Math.exp(t * K * p)
        ];
      };
    else {
      var v = Math.sqrt(w), g = (f * f - c * c + o * w) / (2 * c * n * v), k = (f * f - c * c - o * w) / (2 * f * n * v), P = Math.log(Math.sqrt(g * g + 1) - g), F = Math.log(Math.sqrt(k * k + 1) - k);
      p = (F - P) / t, m = function(K) {
        var C = K * p, N = $s(P), M = c / (n * v) * (N * Og(t * C + P) - Pg(P));
        return [
          s + M * h,
          u + M * b,
          c * N / $s(t * C + P)
        ];
      };
    }
    return m.duration = p * 1e3 * t / Math.SQRT2, m;
  }
  return r.rho = function(a) {
    var i = Math.max(1e-3, +a), s = i * i, u = s * s;
    return e(i, s, u);
  }, r;
})(Math.SQRT2, 2, 4);
var vn = 0, Dn = 0, Nn = 0, ec = 1e3, Ko, An, jo = 0, Jt = 0, fr = 0, Xn = typeof performance == "object" && performance.now ? performance : Date, tc = typeof window == "object" && window.requestAnimationFrame ? window.requestAnimationFrame.bind(window) : function(e) {
  setTimeout(e, 17);
};
function Ia() {
  return Jt || (tc(Rg), Jt = Xn.now() + fr);
}
function Rg() {
  Jt = 0;
}
function Zo() {
  this._call = this._time = this._next = null;
}
Zo.prototype = nc.prototype = {
  constructor: Zo,
  restart: function(e, t, n) {
    if (typeof e != "function")
      throw new TypeError("callback is not a function");
    n = (n == null ? Ia() : +n) + (t == null ? 0 : +t), !this._next && An !== this && (An ? An._next = this : Ko = this, An = this), this._call = e, this._time = n, ta();
  },
  stop: function() {
    this._call && (this._call = null, this._time = 1 / 0, ta());
  }
};
function nc(e, t, n) {
  var o = new Zo();
  return o.restart(e, t, n), o;
}
function zg() {
  Ia(), ++vn;
  for (var e = Ko, t; e; )
    (t = Jt - e._time) >= 0 && e._call.call(void 0, t), e = e._next;
  --vn;
}
function Ss() {
  Jt = (jo = Xn.now()) + fr, vn = Dn = 0;
  try {
    zg();
  } finally {
    vn = 0, Lg(), Jt = 0;
  }
}
function Bg() {
  var e = Xn.now(), t = e - jo;
  t > ec && (fr -= t, jo = e);
}
function Lg() {
  for (var e, t = Ko, n, o = 1 / 0; t; )
    t._call ? (o > t._time && (o = t._time), e = t, t = t._next) : (n = t._next, t._next = null, t = e ? e._next = n : Ko = n);
  An = e, ta(o);
}
function ta(e) {
  if (!vn) {
    Dn && (Dn = clearTimeout(Dn));
    var t = e - Jt;
    t > 24 ? (e < 1 / 0 && (Dn = setTimeout(Ss, e - Xn.now() - fr)), Nn && (Nn = clearInterval(Nn))) : (Nn || (jo = Xn.now(), Nn = setInterval(Bg, ec)), vn = 1, tc(Ss));
  }
}
function Cs(e, t, n) {
  var o = new Zo();
  return t = t == null ? 0 : +t, o.restart((r) => {
    o.stop(), e(r + t);
  }, t, n), o;
}
var Vg = cr("start", "end", "cancel", "interrupt"), Hg = [], oc = 0, Ns = 1, na = 2, Ro = 3, Ms = 4, oa = 5, zo = 6;
function hr(e, t, n, o, r, a) {
  var i = e.__transition;
  if (!i)
    e.__transition = {};
  else if (n in i)
    return;
  Fg(e, n, {
    name: t,
    index: o,
    // For context during callback.
    group: r,
    // For context during callback.
    on: Vg,
    tween: Hg,
    time: a.time,
    delay: a.delay,
    duration: a.duration,
    ease: a.ease,
    timer: null,
    state: oc
  });
}
function Da(e, t) {
  var n = at(e, t);
  if (n.state > oc)
    throw new Error("too late; already scheduled");
  return n;
}
function mt(e, t) {
  var n = at(e, t);
  if (n.state > Ro)
    throw new Error("too late; already running");
  return n;
}
function at(e, t) {
  var n = e.__transition;
  if (!n || !(n = n[t]))
    throw new Error("transition not found");
  return n;
}
function Fg(e, t, n) {
  var o = e.__transition, r;
  o[t] = n, n.timer = nc(a, 0, n.time);
  function a(c) {
    n.state = Ns, n.timer.restart(i, n.delay, n.time), n.delay <= c && i(c - n.delay);
  }
  function i(c) {
    var l, d, f, h;
    if (n.state !== Ns)
      return u();
    for (l in o)
      if (h = o[l], h.name === n.name) {
        if (h.state === Ro)
          return Cs(i);
        h.state === Ms ? (h.state = zo, h.timer.stop(), h.on.call("interrupt", e, e.__data__, h.index, h.group), delete o[l]) : +l < t && (h.state = zo, h.timer.stop(), h.on.call("cancel", e, e.__data__, h.index, h.group), delete o[l]);
      }
    if (Cs(function() {
      n.state === Ro && (n.state = Ms, n.timer.restart(s, n.delay, n.time), s(c));
    }), n.state = na, n.on.call("start", e, e.__data__, n.index, n.group), n.state === na) {
      for (n.state = Ro, r = new Array(f = n.tween.length), l = 0, d = -1; l < f; ++l)
        (h = n.tween[l].value.call(e, e.__data__, n.index, n.group)) && (r[++d] = h);
      r.length = d + 1;
    }
  }
  function s(c) {
    for (var l = c < n.duration ? n.ease.call(null, c / n.duration) : (n.timer.restart(u), n.state = oa, 1), d = -1, f = r.length; ++d < f; )
      r[d].call(e, l);
    n.state === oa && (n.on.call("end", e, e.__data__, n.index, n.group), u());
  }
  function u() {
    n.state = zo, n.timer.stop(), delete o[t];
    for (var c in o)
      return;
    delete e.__transition;
  }
}
function Bo(e, t) {
  var n = e.__transition, o, r, a = !0, i;
  if (n) {
    t = t == null ? null : t + "";
    for (i in n) {
      if ((o = n[i]).name !== t) {
        a = !1;
        continue;
      }
      r = o.state > na && o.state < oa, o.state = zo, o.timer.stop(), o.on.call(r ? "interrupt" : "cancel", e, e.__data__, o.index, o.group), delete n[i];
    }
    a && delete e.__transition;
  }
}
function Gg(e) {
  return this.each(function() {
    Bo(this, e);
  });
}
function Yg(e, t) {
  var n, o;
  return function() {
    var r = mt(this, e), a = r.tween;
    if (a !== n) {
      o = n = a;
      for (var i = 0, s = o.length; i < s; ++i)
        if (o[i].name === t) {
          o = o.slice(), o.splice(i, 1);
          break;
        }
    }
    r.tween = o;
  };
}
function Ug(e, t, n) {
  var o, r;
  if (typeof n != "function")
    throw new Error();
  return function() {
    var a = mt(this, e), i = a.tween;
    if (i !== o) {
      r = (o = i).slice();
      for (var s = { name: t, value: n }, u = 0, c = r.length; u < c; ++u)
        if (r[u].name === t) {
          r[u] = s;
          break;
        }
      u === c && r.push(s);
    }
    a.tween = r;
  };
}
function qg(e, t) {
  var n = this._id;
  if (e += "", arguments.length < 2) {
    for (var o = at(this.node(), n).tween, r = 0, a = o.length, i; r < a; ++r)
      if ((i = o[r]).name === e)
        return i.value;
    return null;
  }
  return this.each((t == null ? Yg : Ug)(n, e, t));
}
function Aa(e, t, n) {
  var o = e._id;
  return e.each(function() {
    var r = mt(this, o);
    (r.value || (r.value = {}))[t] = n.apply(this, arguments);
  }), function(r) {
    return at(r, o).value[t];
  };
}
function rc(e, t) {
  var n;
  return (typeof t == "number" ? dt : t instanceof Zt ? Wo : (n = Zt(t)) ? (t = n, Wo) : Zu)(e, t);
}
function Xg(e) {
  return function() {
    this.removeAttribute(e);
  };
}
function Wg(e) {
  return function() {
    this.removeAttributeNS(e.space, e.local);
  };
}
function Kg(e, t, n) {
  var o, r = n + "", a;
  return function() {
    var i = this.getAttribute(e);
    return i === r ? null : i === o ? a : a = t(o = i, n);
  };
}
function jg(e, t, n) {
  var o, r = n + "", a;
  return function() {
    var i = this.getAttributeNS(e.space, e.local);
    return i === r ? null : i === o ? a : a = t(o = i, n);
  };
}
function Zg(e, t, n) {
  var o, r, a;
  return function() {
    var i, s = n(this), u;
    return s == null ? void this.removeAttribute(e) : (i = this.getAttribute(e), u = s + "", i === u ? null : i === o && u === r ? a : (r = u, a = t(o = i, s)));
  };
}
function Jg(e, t, n) {
  var o, r, a;
  return function() {
    var i, s = n(this), u;
    return s == null ? void this.removeAttributeNS(e.space, e.local) : (i = this.getAttributeNS(e.space, e.local), u = s + "", i === u ? null : i === o && u === r ? a : (r = u, a = t(o = i, s)));
  };
}
function Qg(e, t) {
  var n = dr(e), o = n === "transform" ? Dg : rc;
  return this.attrTween(e, typeof t == "function" ? (n.local ? Jg : Zg)(n, o, Aa(this, "attr." + e, t)) : t == null ? (n.local ? Wg : Xg)(n) : (n.local ? jg : Kg)(n, o, t));
}
function ev(e, t) {
  return function(n) {
    this.setAttribute(e, t.call(this, n));
  };
}
function tv(e, t) {
  return function(n) {
    this.setAttributeNS(e.space, e.local, t.call(this, n));
  };
}
function nv(e, t) {
  var n, o;
  function r() {
    var a = t.apply(this, arguments);
    return a !== o && (n = (o = a) && tv(e, a)), n;
  }
  return r._value = t, r;
}
function ov(e, t) {
  var n, o;
  function r() {
    var a = t.apply(this, arguments);
    return a !== o && (n = (o = a) && ev(e, a)), n;
  }
  return r._value = t, r;
}
function rv(e, t) {
  var n = "attr." + e;
  if (arguments.length < 2)
    return (n = this.tween(n)) && n._value;
  if (t == null)
    return this.tween(n, null);
  if (typeof t != "function")
    throw new Error();
  var o = dr(e);
  return this.tween(n, (o.local ? nv : ov)(o, t));
}
function iv(e, t) {
  return function() {
    Da(this, e).delay = +t.apply(this, arguments);
  };
}
function av(e, t) {
  return t = +t, function() {
    Da(this, e).delay = t;
  };
}
function sv(e) {
  var t = this._id;
  return arguments.length ? this.each((typeof e == "function" ? iv : av)(t, e)) : at(this.node(), t).delay;
}
function lv(e, t) {
  return function() {
    mt(this, e).duration = +t.apply(this, arguments);
  };
}
function uv(e, t) {
  return t = +t, function() {
    mt(this, e).duration = t;
  };
}
function cv(e) {
  var t = this._id;
  return arguments.length ? this.each((typeof e == "function" ? lv : uv)(t, e)) : at(this.node(), t).duration;
}
function dv(e, t) {
  if (typeof t != "function")
    throw new Error();
  return function() {
    mt(this, e).ease = t;
  };
}
function fv(e) {
  var t = this._id;
  return arguments.length ? this.each(dv(t, e)) : at(this.node(), t).ease;
}
function hv(e, t) {
  return function() {
    var n = t.apply(this, arguments);
    if (typeof n != "function")
      throw new Error();
    mt(this, e).ease = n;
  };
}
function pv(e) {
  if (typeof e != "function")
    throw new Error();
  return this.each(hv(this._id, e));
}
function gv(e) {
  typeof e != "function" && (e = Ru(e));
  for (var t = this._groups, n = t.length, o = new Array(n), r = 0; r < n; ++r)
    for (var a = t[r], i = a.length, s = o[r] = [], u, c = 0; c < i; ++c)
      (u = a[c]) && e.call(u, u.__data__, c, a) && s.push(u);
  return new Nt(o, this._parents, this._name, this._id);
}
function vv(e) {
  if (e._id !== this._id)
    throw new Error();
  for (var t = this._groups, n = e._groups, o = t.length, r = n.length, a = Math.min(o, r), i = new Array(o), s = 0; s < a; ++s)
    for (var u = t[s], c = n[s], l = u.length, d = i[s] = new Array(l), f, h = 0; h < l; ++h)
      (f = u[h] || c[h]) && (d[h] = f);
  for (; s < o; ++s)
    i[s] = t[s];
  return new Nt(i, this._parents, this._name, this._id);
}
function mv(e) {
  return (e + "").trim().split(/^|\s+/).every(function(t) {
    var n = t.indexOf(".");
    return n >= 0 && (t = t.slice(0, n)), !t || t === "start";
  });
}
function yv(e, t, n) {
  var o, r, a = mv(t) ? Da : mt;
  return function() {
    var i = a(this, e), s = i.on;
    s !== o && (r = (o = s).copy()).on(t, n), i.on = r;
  };
}
function bv(e, t) {
  var n = this._id;
  return arguments.length < 2 ? at(this.node(), n).on.on(e) : this.each(yv(n, e, t));
}
function wv(e) {
  return function() {
    var t = this.parentNode;
    for (var n in this.__transition)
      if (+n !== e)
        return;
    t && t.removeChild(this);
  };
}
function kv() {
  return this.on("end.remove", wv(this._id));
}
function _v(e) {
  var t = this._name, n = this._id;
  typeof e != "function" && (e = Ca(e));
  for (var o = this._groups, r = o.length, a = new Array(r), i = 0; i < r; ++i)
    for (var s = o[i], u = s.length, c = a[i] = new Array(u), l, d, f = 0; f < u; ++f)
      (l = s[f]) && (d = e.call(l, l.__data__, f, s)) && ("__data__" in l && (d.__data__ = l.__data__), c[f] = d, hr(c[f], t, n, f, c, at(l, n)));
  return new Nt(a, this._parents, t, n);
}
function xv(e) {
  var t = this._name, n = this._id;
  typeof e != "function" && (e = Ou(e));
  for (var o = this._groups, r = o.length, a = [], i = [], s = 0; s < r; ++s)
    for (var u = o[s], c = u.length, l, d = 0; d < c; ++d)
      if (l = u[d]) {
        for (var f = e.call(l, l.__data__, d, u), h, b = at(l, n), w = 0, m = f.length; w < m; ++w)
          (h = f[w]) && hr(h, t, n, w, f, b);
        a.push(f), i.push(l);
      }
  return new Nt(a, i, t, n);
}
var Ev = ro.prototype.constructor;
function $v() {
  return new Ev(this._groups, this._parents);
}
function Sv(e, t) {
  var n, o, r;
  return function() {
    var a = gn(this, e), i = (this.style.removeProperty(e), gn(this, e));
    return a === i ? null : a === n && i === o ? r : r = t(n = a, o = i);
  };
}
function ic(e) {
  return function() {
    this.style.removeProperty(e);
  };
}
function Cv(e, t, n) {
  var o, r = n + "", a;
  return function() {
    var i = gn(this, e);
    return i === r ? null : i === o ? a : a = t(o = i, n);
  };
}
function Nv(e, t, n) {
  var o, r, a;
  return function() {
    var i = gn(this, e), s = n(this), u = s + "";
    return s == null && (u = s = (this.style.removeProperty(e), gn(this, e))), i === u ? null : i === o && u === r ? a : (r = u, a = t(o = i, s));
  };
}
function Mv(e, t) {
  var n, o, r, a = "style." + t, i = "end." + a, s;
  return function() {
    var u = mt(this, e), c = u.on, l = u.value[a] == null ? s || (s = ic(t)) : void 0;
    (c !== n || r !== l) && (o = (n = c).copy()).on(i, r = l), u.on = o;
  };
}
function Tv(e, t, n) {
  var o = (e += "") == "transform" ? Ig : rc;
  return t == null ? this.styleTween(e, Sv(e, o)).on("end.style." + e, ic(e)) : typeof t == "function" ? this.styleTween(e, Nv(e, o, Aa(this, "style." + e, t))).each(Mv(this._id, e)) : this.styleTween(e, Cv(e, o, t), n).on("end.style." + e, null);
}
function Iv(e, t, n) {
  return function(o) {
    this.style.setProperty(e, t.call(this, o), n);
  };
}
function Dv(e, t, n) {
  var o, r;
  function a() {
    var i = t.apply(this, arguments);
    return i !== r && (o = (r = i) && Iv(e, i, n)), o;
  }
  return a._value = t, a;
}
function Av(e, t, n) {
  var o = "style." + (e += "");
  if (arguments.length < 2)
    return (o = this.tween(o)) && o._value;
  if (t == null)
    return this.tween(o, null);
  if (typeof t != "function")
    throw new Error();
  return this.tween(o, Dv(e, t, n ?? ""));
}
function Pv(e) {
  return function() {
    this.textContent = e;
  };
}
function Ov(e) {
  return function() {
    var t = e(this);
    this.textContent = t ?? "";
  };
}
function Rv(e) {
  return this.tween("text", typeof e == "function" ? Ov(Aa(this, "text", e)) : Pv(e == null ? "" : e + ""));
}
function zv(e) {
  return function(t) {
    this.textContent = e.call(this, t);
  };
}
function Bv(e) {
  var t, n;
  function o() {
    var r = e.apply(this, arguments);
    return r !== n && (t = (n = r) && zv(r)), t;
  }
  return o._value = e, o;
}
function Lv(e) {
  var t = "text";
  if (arguments.length < 1)
    return (t = this.tween(t)) && t._value;
  if (e == null)
    return this.tween(t, null);
  if (typeof e != "function")
    throw new Error();
  return this.tween(t, Bv(e));
}
function Vv() {
  for (var e = this._name, t = this._id, n = ac(), o = this._groups, r = o.length, a = 0; a < r; ++a)
    for (var i = o[a], s = i.length, u, c = 0; c < s; ++c)
      if (u = i[c]) {
        var l = at(u, t);
        hr(u, e, n, c, i, {
          time: l.time + l.delay + l.duration,
          delay: 0,
          duration: l.duration,
          ease: l.ease
        });
      }
  return new Nt(o, this._parents, e, n);
}
function Hv() {
  var e, t, n = this, o = n._id, r = n.size();
  return new Promise(function(a, i) {
    var s = { value: i }, u = { value: function() {
      --r === 0 && a();
    } };
    n.each(function() {
      var c = mt(this, o), l = c.on;
      l !== e && (t = (e = l).copy(), t._.cancel.push(s), t._.interrupt.push(s), t._.end.push(u)), c.on = t;
    }), r === 0 && a();
  });
}
var Fv = 0;
function Nt(e, t, n, o) {
  this._groups = e, this._parents = t, this._name = n, this._id = o;
}
function ac() {
  return ++Fv;
}
var wt = ro.prototype;
Nt.prototype = {
  constructor: Nt,
  select: _v,
  selectAll: xv,
  selectChild: wt.selectChild,
  selectChildren: wt.selectChildren,
  filter: gv,
  merge: vv,
  selection: $v,
  transition: Vv,
  call: wt.call,
  nodes: wt.nodes,
  node: wt.node,
  size: wt.size,
  empty: wt.empty,
  each: wt.each,
  on: bv,
  attr: Qg,
  attrTween: rv,
  style: Tv,
  styleTween: Av,
  text: Rv,
  textTween: Lv,
  remove: kv,
  tween: qg,
  delay: sv,
  duration: cv,
  ease: fv,
  easeVarying: pv,
  end: Hv,
  [Symbol.iterator]: wt[Symbol.iterator]
};
function Gv(e) {
  return ((e *= 2) <= 1 ? e * e * e : (e -= 2) * e * e + 2) / 2;
}
var Yv = {
  time: null,
  // Set on use.
  delay: 0,
  duration: 250,
  ease: Gv
};
function Uv(e, t) {
  for (var n; !(n = e.__transition) || !(n = n[t]); )
    if (!(e = e.parentNode))
      throw new Error(`transition ${t} not found`);
  return n;
}
function qv(e) {
  var t, n;
  e instanceof Nt ? (t = e._id, e = e._name) : (t = ac(), (n = Yv).time = Ia(), e = e == null ? null : e + "");
  for (var o = this._groups, r = o.length, a = 0; a < r; ++a)
    for (var i = o[a], s = i.length, u, c = 0; c < s; ++c)
      (u = i[c]) && hr(u, e, t, c, i, n || Uv(u, t));
  return new Nt(o, this._parents, e, t);
}
ro.prototype.interrupt = Gg;
ro.prototype.transition = qv;
const wo = (e) => () => e;
function Xv(e, {
  sourceEvent: t,
  target: n,
  transform: o,
  dispatch: r
}) {
  Object.defineProperties(this, {
    type: { value: e, enumerable: !0, configurable: !0 },
    sourceEvent: { value: t, enumerable: !0, configurable: !0 },
    target: { value: n, enumerable: !0, configurable: !0 },
    transform: { value: o, enumerable: !0, configurable: !0 },
    _: { value: r }
  });
}
function Et(e, t, n) {
  this.k = e, this.x = t, this.y = n;
}
Et.prototype = {
  constructor: Et,
  scale: function(e) {
    return e === 1 ? this : new Et(this.k * e, this.x, this.y);
  },
  translate: function(e, t) {
    return e === 0 & t === 0 ? this : new Et(this.k, this.x + this.k * e, this.y + this.k * t);
  },
  apply: function(e) {
    return [e[0] * this.k + this.x, e[1] * this.k + this.y];
  },
  applyX: function(e) {
    return e * this.k + this.x;
  },
  applyY: function(e) {
    return e * this.k + this.y;
  },
  invert: function(e) {
    return [(e[0] - this.x) / this.k, (e[1] - this.y) / this.k];
  },
  invertX: function(e) {
    return (e - this.x) / this.k;
  },
  invertY: function(e) {
    return (e - this.y) / this.k;
  },
  rescaleX: function(e) {
    return e.copy().domain(e.range().map(this.invertX, this).map(e.invert, e));
  },
  rescaleY: function(e) {
    return e.copy().domain(e.range().map(this.invertY, this).map(e.invert, e));
  },
  toString: function() {
    return "translate(" + this.x + "," + this.y + ") scale(" + this.k + ")";
  }
};
var mn = new Et(1, 0, 0);
Et.prototype;
function Fr(e) {
  e.stopImmediatePropagation();
}
function Mn(e) {
  e.preventDefault(), e.stopImmediatePropagation();
}
function Wv(e) {
  return (!e.ctrlKey || e.type === "wheel") && !e.button;
}
function Kv() {
  var e = this;
  return e instanceof SVGElement ? (e = e.ownerSVGElement || e, e.hasAttribute("viewBox") ? (e = e.viewBox.baseVal, [[e.x, e.y], [e.x + e.width, e.y + e.height]]) : [[0, 0], [e.width.baseVal.value, e.height.baseVal.value]]) : [[0, 0], [e.clientWidth, e.clientHeight]];
}
function Ts() {
  return this.__zoom || mn;
}
function jv(e) {
  return -e.deltaY * (e.deltaMode === 1 ? 0.05 : e.deltaMode ? 1 : 2e-3) * (e.ctrlKey ? 10 : 1);
}
function Zv() {
  return navigator.maxTouchPoints || "ontouchstart" in this;
}
function Jv(e, t, n) {
  var o = e.invertX(t[0][0]) - n[0][0], r = e.invertX(t[1][0]) - n[1][0], a = e.invertY(t[0][1]) - n[0][1], i = e.invertY(t[1][1]) - n[1][1];
  return e.translate(
    r > o ? (o + r) / 2 : Math.min(0, o) || Math.max(0, r),
    i > a ? (a + i) / 2 : Math.min(0, a) || Math.max(0, i)
  );
}
function Qv() {
  var e = Wv, t = Kv, n = Jv, o = jv, r = Zv, a = [0, 1 / 0], i = [[-1 / 0, -1 / 0], [1 / 0, 1 / 0]], s = 250, u = Oo, c = cr("start", "zoom", "end"), l, d, f, h = 500, b = 150, w = 0, m = 10;
  function p(y) {
    y.property("__zoom", Ts).on("wheel.zoom", C, { passive: !1 }).on("mousedown.zoom", N).on("dblclick.zoom", M).filter(r).on("touchstart.zoom", B).on("touchmove.zoom", S).on("touchend.zoom touchcancel.zoom", Q).style("-webkit-tap-highlight-color", "rgba(0,0,0,0)");
  }
  p.transform = function(y, O, E, X) {
    var U = y.selection ? y.selection() : y;
    U.property("__zoom", Ts), y !== U ? P(y, O, E, X) : U.interrupt().each(function() {
      F(this, arguments).event(X).start().zoom(null, typeof O == "function" ? O.apply(this, arguments) : O).end();
    });
  }, p.scaleBy = function(y, O, E, X) {
    p.scaleTo(y, function() {
      var U = this.__zoom.k, z = typeof O == "function" ? O.apply(this, arguments) : O;
      return U * z;
    }, E, X);
  }, p.scaleTo = function(y, O, E, X) {
    p.transform(y, function() {
      var U = t.apply(this, arguments), z = this.__zoom, x = E == null ? k(U) : typeof E == "function" ? E.apply(this, arguments) : E, L = z.invert(x), te = typeof O == "function" ? O.apply(this, arguments) : O;
      return n(g(v(z, te), x, L), U, i);
    }, E, X);
  }, p.translateBy = function(y, O, E, X) {
    p.transform(y, function() {
      return n(this.__zoom.translate(
        typeof O == "function" ? O.apply(this, arguments) : O,
        typeof E == "function" ? E.apply(this, arguments) : E
      ), t.apply(this, arguments), i);
    }, null, X);
  }, p.translateTo = function(y, O, E, X, U) {
    p.transform(y, function() {
      var z = t.apply(this, arguments), x = this.__zoom, L = X == null ? k(z) : typeof X == "function" ? X.apply(this, arguments) : X;
      return n(mn.translate(L[0], L[1]).scale(x.k).translate(
        typeof O == "function" ? -O.apply(this, arguments) : -O,
        typeof E == "function" ? -E.apply(this, arguments) : -E
      ), z, i);
    }, X, U);
  };
  function v(y, O) {
    return O = Math.max(a[0], Math.min(a[1], O)), O === y.k ? y : new Et(O, y.x, y.y);
  }
  function g(y, O, E) {
    var X = O[0] - E[0] * y.k, U = O[1] - E[1] * y.k;
    return X === y.x && U === y.y ? y : new Et(y.k, X, U);
  }
  function k(y) {
    return [(+y[0][0] + +y[1][0]) / 2, (+y[0][1] + +y[1][1]) / 2];
  }
  function P(y, O, E, X) {
    y.on("start.zoom", function() {
      F(this, arguments).event(X).start();
    }).on("interrupt.zoom end.zoom", function() {
      F(this, arguments).event(X).end();
    }).tween("zoom", function() {
      var U = this, z = arguments, x = F(U, z).event(X), L = t.apply(U, z), te = E == null ? k(L) : typeof E == "function" ? E.apply(U, z) : E, H = Math.max(L[1][0] - L[0][0], L[1][1] - L[0][1]), q = U.__zoom, Y = typeof O == "function" ? O.apply(U, z) : O, Z = u(q.invert(te).concat(H / q.k), Y.invert(te).concat(H / Y.k));
      return function(ee) {
        if (ee === 1)
          ee = Y;
        else {
          var ae = Z(ee), me = H / ae[2];
          ee = new Et(me, te[0] - ae[0] * me, te[1] - ae[1] * me);
        }
        x.zoom(null, ee);
      };
    });
  }
  function F(y, O, E) {
    return !E && y.__zooming || new K(y, O);
  }
  function K(y, O) {
    this.that = y, this.args = O, this.active = 0, this.sourceEvent = null, this.extent = t.apply(y, O), this.taps = 0;
  }
  K.prototype = {
    event: function(y) {
      return y && (this.sourceEvent = y), this;
    },
    start: function() {
      return ++this.active === 1 && (this.that.__zooming = this, this.emit("start")), this;
    },
    zoom: function(y, O) {
      return this.mouse && y !== "mouse" && (this.mouse[1] = O.invert(this.mouse[0])), this.touch0 && y !== "touch" && (this.touch0[1] = O.invert(this.touch0[0])), this.touch1 && y !== "touch" && (this.touch1[1] = O.invert(this.touch1[0])), this.that.__zoom = O, this.emit("zoom"), this;
    },
    end: function() {
      return --this.active === 0 && (delete this.that.__zooming, this.emit("end")), this;
    },
    emit: function(y) {
      var O = et(this.that).datum();
      c.call(
        y,
        this.that,
        new Xv(y, {
          sourceEvent: this.sourceEvent,
          target: p,
          transform: this.that.__zoom,
          dispatch: c
        }),
        O
      );
    }
  };
  function C(y, ...O) {
    if (!e.apply(this, arguments))
      return;
    var E = F(this, O).event(y), X = this.__zoom, U = Math.max(a[0], Math.min(a[1], X.k * Math.pow(2, o.apply(this, arguments)))), z = ct(y);
    if (E.wheel)
      (E.mouse[0][0] !== z[0] || E.mouse[0][1] !== z[1]) && (E.mouse[1] = X.invert(E.mouse[0] = z)), clearTimeout(E.wheel);
    else {
      if (X.k === U)
        return;
      E.mouse = [z, X.invert(z)], Bo(this), E.start();
    }
    Mn(y), E.wheel = setTimeout(x, b), E.zoom("mouse", n(g(v(X, U), E.mouse[0], E.mouse[1]), E.extent, i));
    function x() {
      E.wheel = null, E.end();
    }
  }
  function N(y, ...O) {
    if (f || !e.apply(this, arguments))
      return;
    var E = y.currentTarget, X = F(this, O, !0).event(y), U = et(y.view).on("mousemove.zoom", te, !0).on("mouseup.zoom", H, !0), z = ct(y, E), x = y.clientX, L = y.clientY;
    qu(y.view), Fr(y), X.mouse = [z, this.__zoom.invert(z)], Bo(this), X.start();
    function te(q) {
      if (Mn(q), !X.moved) {
        var Y = q.clientX - x, Z = q.clientY - L;
        X.moved = Y * Y + Z * Z > w;
      }
      X.event(q).zoom("mouse", n(g(X.that.__zoom, X.mouse[0] = ct(q, E), X.mouse[1]), X.extent, i));
    }
    function H(q) {
      U.on("mousemove.zoom mouseup.zoom", null), Xu(q.view, X.moved), Mn(q), X.event(q).end();
    }
  }
  function M(y, ...O) {
    if (e.apply(this, arguments)) {
      var E = this.__zoom, X = ct(y.changedTouches ? y.changedTouches[0] : y, this), U = E.invert(X), z = E.k * (y.shiftKey ? 0.5 : 2), x = n(g(v(E, z), X, U), t.apply(this, O), i);
      Mn(y), s > 0 ? et(this).transition().duration(s).call(P, x, X, y) : et(this).call(p.transform, x, X, y);
    }
  }
  function B(y, ...O) {
    if (e.apply(this, arguments)) {
      var E = y.touches, X = E.length, U = F(this, O, y.changedTouches.length === X).event(y), z, x, L, te;
      for (Fr(y), x = 0; x < X; ++x)
        L = E[x], te = ct(L, this), te = [te, this.__zoom.invert(te), L.identifier], U.touch0 ? !U.touch1 && U.touch0[2] !== te[2] && (U.touch1 = te, U.taps = 0) : (U.touch0 = te, z = !0, U.taps = 1 + !!l);
      l && (l = clearTimeout(l)), z && (U.taps < 2 && (d = te[0], l = setTimeout(function() {
        l = null;
      }, h)), Bo(this), U.start());
    }
  }
  function S(y, ...O) {
    if (this.__zooming) {
      var E = F(this, O).event(y), X = y.changedTouches, U = X.length, z, x, L, te;
      for (Mn(y), z = 0; z < U; ++z)
        x = X[z], L = ct(x, this), E.touch0 && E.touch0[2] === x.identifier ? E.touch0[0] = L : E.touch1 && E.touch1[2] === x.identifier && (E.touch1[0] = L);
      if (x = E.that.__zoom, E.touch1) {
        var H = E.touch0[0], q = E.touch0[1], Y = E.touch1[0], Z = E.touch1[1], ee = (ee = Y[0] - H[0]) * ee + (ee = Y[1] - H[1]) * ee, ae = (ae = Z[0] - q[0]) * ae + (ae = Z[1] - q[1]) * ae;
        x = v(x, Math.sqrt(ee / ae)), L = [(H[0] + Y[0]) / 2, (H[1] + Y[1]) / 2], te = [(q[0] + Z[0]) / 2, (q[1] + Z[1]) / 2];
      } else if (E.touch0)
        L = E.touch0[0], te = E.touch0[1];
      else
        return;
      E.zoom("touch", n(g(x, L, te), E.extent, i));
    }
  }
  function Q(y, ...O) {
    if (this.__zooming) {
      var E = F(this, O).event(y), X = y.changedTouches, U = X.length, z, x;
      for (Fr(y), f && clearTimeout(f), f = setTimeout(function() {
        f = null;
      }, h), z = 0; z < U; ++z)
        x = X[z], E.touch0 && E.touch0[2] === x.identifier ? delete E.touch0 : E.touch1 && E.touch1[2] === x.identifier && delete E.touch1;
      if (E.touch1 && !E.touch0 && (E.touch0 = E.touch1, delete E.touch1), E.touch0)
        E.touch0[1] = this.__zoom.invert(E.touch0[0]);
      else if (E.end(), E.taps === 2 && (x = ct(x, this), Math.hypot(d[0] - x[0], d[1] - x[1]) < m)) {
        var L = et(this).on("dblclick.zoom");
        L && L.apply(this, arguments);
      }
    }
  }
  return p.wheelDelta = function(y) {
    return arguments.length ? (o = typeof y == "function" ? y : wo(+y), p) : o;
  }, p.filter = function(y) {
    return arguments.length ? (e = typeof y == "function" ? y : wo(!!y), p) : e;
  }, p.touchable = function(y) {
    return arguments.length ? (r = typeof y == "function" ? y : wo(!!y), p) : r;
  }, p.extent = function(y) {
    return arguments.length ? (t = typeof y == "function" ? y : wo([[+y[0][0], +y[0][1]], [+y[1][0], +y[1][1]]]), p) : t;
  }, p.scaleExtent = function(y) {
    return arguments.length ? (a[0] = +y[0], a[1] = +y[1], p) : [a[0], a[1]];
  }, p.translateExtent = function(y) {
    return arguments.length ? (i[0][0] = +y[0][0], i[1][0] = +y[1][0], i[0][1] = +y[0][1], i[1][1] = +y[1][1], p) : [[i[0][0], i[0][1]], [i[1][0], i[1][1]]];
  }, p.constrain = function(y) {
    return arguments.length ? (n = y, p) : n;
  }, p.duration = function(y) {
    return arguments.length ? (s = +y, p) : s;
  }, p.interpolate = function(y) {
    return arguments.length ? (u = y, p) : u;
  }, p.on = function() {
    var y = c.on.apply(c, arguments);
    return y === c ? p : y;
  }, p.clickDistance = function(y) {
    return arguments.length ? (w = (y = +y) * y, p) : Math.sqrt(w);
  }, p.tapDistance = function(y) {
    return arguments.length ? (m = +y, p) : m;
  }, p;
}
var ce = /* @__PURE__ */ ((e) => (e.Left = "left", e.Top = "top", e.Right = "right", e.Bottom = "bottom", e))(ce || {}), Pa = /* @__PURE__ */ ((e) => (e.Partial = "partial", e.Full = "full", e))(Pa || {}), Ft = /* @__PURE__ */ ((e) => (e.Bezier = "default", e.SimpleBezier = "simple-bezier", e.Straight = "straight", e.Step = "step", e.SmoothStep = "smoothstep", e))(Ft || {}), Bt = /* @__PURE__ */ ((e) => (e.Strict = "strict", e.Loose = "loose", e))(Bt || {}), Wn = /* @__PURE__ */ ((e) => (e.Arrow = "arrow", e.ArrowClosed = "arrowclosed", e))(Wn || {}), Ln = /* @__PURE__ */ ((e) => (e.Free = "free", e.Vertical = "vertical", e.Horizontal = "horizontal", e))(Ln || {}), sc = /* @__PURE__ */ ((e) => (e.TopLeft = "top-left", e.TopCenter = "top-center", e.TopRight = "top-right", e.BottomLeft = "bottom-left", e.BottomCenter = "bottom-center", e.BottomRight = "bottom-right", e))(sc || {});
const em = ["INPUT", "SELECT", "TEXTAREA"], tm = typeof document < "u" ? document : null;
function ra(e) {
  var t, n;
  const o = ((n = (t = e.composedPath) == null ? void 0 : t.call(e)) == null ? void 0 : n[0]) || e.target, r = typeof o?.hasAttribute == "function" ? o.hasAttribute("contenteditable") : !1, a = typeof o?.closest == "function" ? o.closest(".nokey") : null;
  return em.includes(o?.nodeName) || r || !!a;
}
function nm(e) {
  return e.ctrlKey || e.metaKey || e.shiftKey || e.altKey;
}
function Is(e, t, n, o) {
  const r = t.replace("+", `
`).replace(`

`, `
+`).split(`
`).map((i) => i.trim().toLowerCase());
  if (r.length === 1)
    return e.toLowerCase() === t.toLowerCase();
  o || n.add(e.toLowerCase());
  const a = r.every(
    (i, s) => n.has(i) && Array.from(n.values())[s] === r[s]
  );
  return o && n.delete(e.toLowerCase()), a;
}
function om(e, t) {
  return (n) => {
    if (!n.code && !n.key)
      return !1;
    const o = rm(n.code, e);
    return Array.isArray(e) ? e.some((r) => Is(n[o], r, t, n.type === "keyup")) : Is(n[o], e, t, n.type === "keyup");
  };
}
function rm(e, t) {
  return t.includes(e) ? "code" : "key";
}
function Vn(e, t) {
  const n = ne(() => Ce(t?.target) ?? tm), o = xt(Ce(e) === !0);
  let r = !1;
  const a = /* @__PURE__ */ new Set();
  let i = u(Ce(e));
  xe(
    () => Ce(e),
    (c, l) => {
      typeof l == "boolean" && typeof c != "boolean" && s(), i = u(c);
    },
    {
      immediate: !0
    }
  ), Au(["blur", "contextmenu"], s), hs(
    (...c) => i(...c),
    (c) => {
      var l, d;
      const f = Ce(t?.actInsideInputWithModifier) ?? !0, h = Ce(t?.preventDefault) ?? !1;
      if (r = nm(c), (!r || r && !f) && ra(c))
        return;
      const w = ((d = (l = c.composedPath) == null ? void 0 : l.call(c)) == null ? void 0 : d[0]) || c.target, m = w?.nodeName === "BUTTON" || w?.nodeName === "A";
      !h && (r || !m) && c.preventDefault(), o.value = !0;
    },
    { eventName: "keydown", target: n }
  ), hs(
    (...c) => i(...c),
    (c) => {
      const l = Ce(t?.actInsideInputWithModifier) ?? !0;
      if (o.value) {
        if ((!r || r && !l) && ra(c))
          return;
        r = !1, o.value = !1;
      }
    },
    { eventName: "keyup", target: n }
  );
  function s() {
    r = !1, a.clear(), o.value = Ce(e) === !0;
  }
  function u(c) {
    return c === null ? (s(), () => !1) : typeof c == "boolean" ? (s(), o.value = c, () => !1) : Array.isArray(c) || typeof c == "string" ? om(c, a) : c;
  }
  return o;
}
const lc = "vue-flow__node-desc", uc = "vue-flow__edge-desc", im = "vue-flow__aria-live", cc = ["Enter", " ", "Escape"], hn = {
  ArrowUp: { x: 0, y: -1 },
  ArrowDown: { x: 0, y: 1 },
  ArrowLeft: { x: -1, y: 0 },
  ArrowRight: { x: 1, y: 0 }
};
function Jo(e) {
  return {
    ...e.computedPosition || { x: 0, y: 0 },
    width: e.dimensions.width || 0,
    height: e.dimensions.height || 0
  };
}
function Qo(e, t) {
  const n = Math.max(0, Math.min(e.x + e.width, t.x + t.width) - Math.max(e.x, t.x)), o = Math.max(0, Math.min(e.y + e.height, t.y + t.height) - Math.max(e.y, t.y));
  return Math.ceil(n * o);
}
function pr(e) {
  return {
    width: e.offsetWidth,
    height: e.offsetHeight
  };
}
function Qt(e, t = 0, n = 1) {
  return Math.min(Math.max(e, t), n);
}
function dc(e, t) {
  return {
    x: Qt(e.x, t[0][0], t[1][0]),
    y: Qt(e.y, t[0][1], t[1][1])
  };
}
function Ds(e) {
  const t = e.getRootNode();
  return "elementFromPoint" in t ? t : window.document;
}
function Lt(e) {
  return e && typeof e == "object" && "id" in e && "source" in e && "target" in e;
}
function Kt(e) {
  return e && typeof e == "object" && "id" in e && "position" in e && !Lt(e);
}
function Pn(e) {
  return Kt(e) && "computedPosition" in e;
}
function ko(e) {
  return !Number.isNaN(e) && Number.isFinite(e);
}
function am(e) {
  return ko(e.width) && ko(e.height) && ko(e.x) && ko(e.y);
}
function sm(e, t, n) {
  const o = {
    id: e.id.toString(),
    type: e.type ?? "default",
    dimensions: Rt({
      width: 0,
      height: 0
    }),
    computedPosition: Rt({
      z: 0,
      ...e.position
    }),
    // todo: shouldn't be defined initially, as we want to use handleBounds to check if a node was actually initialized or not
    handleBounds: {
      source: [],
      target: []
    },
    draggable: void 0,
    selectable: void 0,
    connectable: void 0,
    focusable: void 0,
    selected: !1,
    dragging: !1,
    resizing: !1,
    initialized: !1,
    isParent: !1,
    position: {
      x: 0,
      y: 0
    },
    data: He(e.data) ? e.data : {},
    events: Rt(He(e.events) ? e.events : {})
  };
  return Object.assign(t ?? o, e, { id: e.id.toString(), parentNode: n });
}
function fc(e, t, n) {
  var o, r;
  const a = {
    id: e.id.toString(),
    type: e.type ?? t?.type ?? "default",
    source: e.source.toString(),
    target: e.target.toString(),
    sourceHandle: (o = e.sourceHandle) == null ? void 0 : o.toString(),
    targetHandle: (r = e.targetHandle) == null ? void 0 : r.toString(),
    updatable: e.updatable ?? n?.updatable,
    selectable: e.selectable ?? n?.selectable,
    focusable: e.focusable ?? n?.focusable,
    data: He(e.data) ? e.data : {},
    events: Rt(He(e.events) ? e.events : {}),
    label: e.label ?? "",
    interactionWidth: e.interactionWidth ?? n?.interactionWidth,
    ...n ?? {}
  };
  return Object.assign(t ?? a, e, { id: e.id.toString() });
}
function hc(e, t, n, o) {
  const r = typeof e == "string" ? e : e.id, a = /* @__PURE__ */ new Set(), i = o === "source" ? "target" : "source";
  for (const s of n)
    s[i] === r && a.add(s[o]);
  return t.filter((s) => a.has(s.id));
}
function lm(...e) {
  if (e.length === 3) {
    const [a, i, s] = e;
    return hc(a, i, s, "target");
  }
  const [t, n] = e, o = typeof t == "string" ? t : t.id;
  return n.filter((a) => Lt(a) && a.source === o).map((a) => n.find((i) => Kt(i) && i.id === a.target));
}
function um(...e) {
  if (e.length === 3) {
    const [a, i, s] = e;
    return hc(a, i, s, "source");
  }
  const [t, n] = e, o = typeof t == "string" ? t : t.id;
  return n.filter((a) => Lt(a) && a.target === o).map((a) => n.find((i) => Kt(i) && i.id === a.source));
}
function pc({ source: e, sourceHandle: t, target: n, targetHandle: o }) {
  return `vueflow__edge-${e}${t ?? ""}-${n}${o ?? ""}`;
}
function cm(e, t) {
  return t.some(
    (n) => Lt(n) && n.source === e.source && n.target === e.target && (n.sourceHandle === e.sourceHandle || !n.sourceHandle && !e.sourceHandle) && (n.targetHandle === e.targetHandle || !n.targetHandle && !e.targetHandle)
  );
}
function Kn({ x: e, y: t }, { x: n, y: o, zoom: r }) {
  return {
    x: e * r + n,
    y: t * r + o
  };
}
function jn({ x: e, y: t }, { x: n, y: o, zoom: r }, a = !1, i = [1, 1]) {
  const s = {
    x: (e - n) / r,
    y: (t - o) / r
  };
  return a ? gr(s, i) : s;
}
function gc(e, t) {
  return {
    x: Math.min(e.x, t.x),
    y: Math.min(e.y, t.y),
    x2: Math.max(e.x2, t.x2),
    y2: Math.max(e.y2, t.y2)
  };
}
function er({ x: e, y: t, width: n, height: o }) {
  return {
    x: e,
    y: t,
    x2: e + n,
    y2: t + o
  };
}
function vc({ x: e, y: t, x2: n, y2: o }) {
  return {
    x: e,
    y: t,
    width: n - e,
    height: o - t
  };
}
function dm(e, t) {
  return vc(gc(er(e), er(t)));
}
function Oa(e) {
  let t = {
    x: Number.POSITIVE_INFINITY,
    y: Number.POSITIVE_INFINITY,
    x2: Number.NEGATIVE_INFINITY,
    y2: Number.NEGATIVE_INFINITY
  };
  for (let n = 0; n < e.length; n++) {
    const o = e[n];
    t = gc(
      t,
      er({
        ...o.computedPosition,
        ...o.dimensions
      })
    );
  }
  return vc(t);
}
function mc(e, t, n = { x: 0, y: 0, zoom: 1 }, o = !1, r = !1) {
  const a = {
    ...jn(t, n),
    width: t.width / n.zoom,
    height: t.height / n.zoom
  }, i = [];
  for (const s of e) {
    const { dimensions: u, selectable: c = !0, hidden: l = !1 } = s, d = u.width ?? s.width ?? null, f = u.height ?? s.height ?? null;
    if (r && !c || l)
      continue;
    const h = Qo(a, Jo(s)), b = d === null || f === null, w = o && h > 0, m = (d ?? 0) * (f ?? 0);
    (b || w || h >= m || s.dragging) && i.push(s);
  }
  return i;
}
function Gt(e, t) {
  const n = /* @__PURE__ */ new Set();
  if (typeof e == "string")
    n.add(e);
  else if (e.length >= 1)
    for (const o of e)
      n.add(o.id);
  return t.filter((o) => n.has(o.source) || n.has(o.target));
}
function sn(e, t) {
  if (typeof e == "number")
    return Math.floor((t - t / (1 + e)) * 0.5);
  if (typeof e == "string" && e.endsWith("px")) {
    const n = Number.parseFloat(e);
    if (!Number.isNaN(n))
      return Math.floor(n);
  }
  if (typeof e == "string" && e.endsWith("%")) {
    const n = Number.parseFloat(e);
    if (!Number.isNaN(n))
      return Math.floor(t * n * 0.01);
  }
  return ao(`The padding value "${e}" is invalid. Please provide a number or a string with a valid unit (px or %).`), 0;
}
function fm(e, t, n) {
  if (typeof e == "string" || typeof e == "number") {
    const o = sn(e, n), r = sn(e, t);
    return {
      top: o,
      right: r,
      bottom: o,
      left: r,
      x: r * 2,
      y: o * 2
    };
  }
  if (typeof e == "object") {
    const o = sn(e.top ?? e.y ?? 0, n), r = sn(e.bottom ?? e.y ?? 0, n), a = sn(e.left ?? e.x ?? 0, t), i = sn(e.right ?? e.x ?? 0, t);
    return { top: o, right: i, bottom: r, left: a, x: a + i, y: o + r };
  }
  return { top: 0, right: 0, bottom: 0, left: 0, x: 0, y: 0 };
}
function hm(e, t, n, o, r, a) {
  const { x: i, y: s } = Kn(e, { x: t, y: n, zoom: o }), { x: u, y: c } = Kn(
    { x: e.x + e.width, y: e.y + e.height },
    {
      x: t,
      y: n,
      zoom: o
    }
  ), l = r - u, d = a - c;
  return {
    left: Math.floor(i),
    top: Math.floor(s),
    right: Math.floor(l),
    bottom: Math.floor(d)
  };
}
function As(e, t, n, o, r, a = 0.1) {
  const i = fm(a, t, n), s = (t - i.x) / e.width, u = (n - i.y) / e.height, c = Math.min(s, u), l = Qt(c, o, r), d = e.x + e.width / 2, f = e.y + e.height / 2, h = t / 2 - d * l, b = n / 2 - f * l, w = hm(e, h, b, l, t, n), m = {
    left: Math.min(w.left - i.left, 0),
    top: Math.min(w.top - i.top, 0),
    right: Math.min(w.right - i.right, 0),
    bottom: Math.min(w.bottom - i.bottom, 0)
  };
  return {
    x: h - m.left + m.right,
    y: b - m.top + m.bottom,
    zoom: l
  };
}
function pm(e, t) {
  return {
    x: t.x + e.x,
    y: t.y + e.y,
    z: (e.z > t.z ? e.z : t.z) + 1
  };
}
function yc(e, t) {
  if (!e.parentNode)
    return !1;
  const n = t.get(e.parentNode);
  return n ? n.selected ? !0 : yc(n, t) : !1;
}
function Zn(e, t) {
  return typeof e > "u" ? "" : typeof e == "string" ? e : `${t ? `${t}__` : ""}${Object.keys(e).sort().map((o) => `${o}=${e[o]}`).join("&")}`;
}
function ia(e) {
  const t = e.ctrlKey && Jn() ? 10 : 1;
  return -e.deltaY * (e.deltaMode === 1 ? 0.05 : e.deltaMode ? 1 : 2e-3) * t;
}
function Ps(e, t, n) {
  return e < t ? Qt(Math.abs(e - t), 1, t) / t : e > n ? -Qt(Math.abs(e - n), 1, t) / t : 0;
}
function bc(e, t, n = 15, o = 40) {
  const r = Ps(e.x, o, t.width - o) * n, a = Ps(e.y, o, t.height - o) * n;
  return [r, a];
}
function Gr(e, t) {
  if (t) {
    const n = e.position.x + e.dimensions.width - t.dimensions.width, o = e.position.y + e.dimensions.height - t.dimensions.height;
    if (n > 0 || o > 0 || e.position.x < 0 || e.position.y < 0) {
      let r = {};
      if (typeof t.style == "function" ? r = { ...t.style(t) } : t.style && (r = { ...t.style }), r.width = r.width ?? `${t.dimensions.width}px`, r.height = r.height ?? `${t.dimensions.height}px`, n > 0)
        if (typeof r.width == "string") {
          const a = Number(r.width.replace("px", ""));
          r.width = `${a + n}px`;
        } else
          r.width += n;
      if (o > 0)
        if (typeof r.height == "string") {
          const a = Number(r.height.replace("px", ""));
          r.height = `${a + o}px`;
        } else
          r.height += o;
      if (e.position.x < 0) {
        const a = Math.abs(e.position.x);
        if (t.position.x = t.position.x - a, typeof r.width == "string") {
          const i = Number(r.width.replace("px", ""));
          r.width = `${i + a}px`;
        } else
          r.width += a;
        e.position.x = 0;
      }
      if (e.position.y < 0) {
        const a = Math.abs(e.position.y);
        if (t.position.y = t.position.y - a, typeof r.height == "string") {
          const i = Number(r.height.replace("px", ""));
          r.height = `${i + a}px`;
        } else
          r.height += a;
        e.position.y = 0;
      }
      t.dimensions.width = Number(r.width.toString().replace("px", "")), t.dimensions.height = Number(r.height.toString().replace("px", "")), typeof t.style == "function" ? t.style = (a) => {
        const i = t.style;
        return {
          ...i(a),
          ...r
        };
      } : t.style = {
        ...t.style,
        ...r
      };
    }
  }
}
function Os(e, t) {
  var n, o;
  const r = e.filter((i) => i.type === "add" || i.type === "remove");
  for (const i of r)
    if (i.type === "add")
      t.findIndex((u) => u.id === i.item.id) === -1 && t.push(i.item);
    else if (i.type === "remove") {
      const s = t.findIndex((u) => u.id === i.id);
      s !== -1 && t.splice(s, 1);
    }
  const a = t.map((i) => i.id);
  for (const i of t)
    for (const s of e)
      if (s.id === i.id)
        switch (s.type) {
          case "select":
            i.selected = s.selected;
            break;
          case "position":
            if (Pn(i) && (typeof s.position < "u" && (i.position = s.position), typeof s.dragging < "u" && (i.dragging = s.dragging), i.expandParent && i.parentNode)) {
              const u = t[a.indexOf(i.parentNode)];
              u && Pn(u) && Gr(i, u);
            }
            break;
          case "dimensions":
            if (Pn(i) && (typeof s.dimensions < "u" && (i.dimensions = s.dimensions), typeof s.updateStyle < "u" && s.updateStyle && (i.style = {
              ...i.style || {},
              width: `${(n = s.dimensions) == null ? void 0 : n.width}px`,
              height: `${(o = s.dimensions) == null ? void 0 : o.height}px`
            }), typeof s.resizing < "u" && (i.resizing = s.resizing), i.expandParent && i.parentNode)) {
              const u = t[a.indexOf(i.parentNode)];
              u && Pn(u) && (!!u.dimensions.width && !!u.dimensions.height ? Gr(i, u) : Ke(() => {
                Gr(i, u);
              }));
            }
            break;
        }
  return t;
}
function It(e, t) {
  return {
    id: e,
    type: "select",
    selected: t
  };
}
function Rs(e) {
  return {
    item: e,
    type: "add"
  };
}
function zs(e) {
  return {
    id: e,
    type: "remove"
  };
}
function Bs(e, t, n, o, r) {
  return {
    id: e,
    source: t,
    target: n,
    sourceHandle: o || null,
    targetHandle: r || null,
    type: "remove"
  };
}
function At(e, t = /* @__PURE__ */ new Set(), n = !1) {
  const o = [];
  for (const [r, a] of e) {
    const i = t.has(r);
    !(a.selected === void 0 && !i) && a.selected !== i && (n && (a.selected = i), o.push(It(a.id, i)));
  }
  return o;
}
const Ls = () => {
};
function de(e) {
  const t = /* @__PURE__ */ new Set();
  let n = Ls, o = () => !1;
  const r = () => t.size > 0 || o(), a = (f) => {
    n = f;
  }, i = () => {
    n = Ls;
  }, s = (f) => {
    o = f;
  }, u = () => {
    o = () => !1;
  }, c = (f) => {
    t.delete(f);
  };
  return {
    on: (f) => {
      t.add(f);
      const h = () => c(f);
      return Gn(h), { off: h };
    },
    off: c,
    trigger: (f) => {
      const h = [n];
      return r() ? h.push(...t) : e && h.push(e), Promise.allSettled(h.map((b) => b(f)));
    },
    hasListeners: r,
    listeners: t,
    setEmitter: a,
    removeEmitter: i,
    setHasEmitListeners: s,
    removeHasEmitListeners: u
  };
}
function Vs(e, t, n) {
  let o = e;
  do {
    if (o && o.matches(t))
      return !0;
    if (o === n)
      return !1;
    o = o.parentElement;
  } while (o);
  return !1;
}
function gm(e, t, n, o) {
  var r, a;
  const i = /* @__PURE__ */ new Map();
  for (const [s, u] of e)
    (u.selected || u.id === o) && (!u.parentNode || !yc(u, e)) && (u.draggable || t && typeof u.draggable > "u") && e.get(s) && i.set(s, {
      id: u.id,
      position: u.position || { x: 0, y: 0 },
      distance: {
        x: n.x - ((r = u.computedPosition) == null ? void 0 : r.x) || 0,
        y: n.y - ((a = u.computedPosition) == null ? void 0 : a.y) || 0
      },
      from: { x: u.computedPosition.x, y: u.computedPosition.y },
      extent: u.extent,
      parentNode: u.parentNode,
      dimensions: { ...u.dimensions },
      expandParent: u.expandParent
    });
  return Array.from(i.values());
}
function Yr({
  id: e,
  dragItems: t,
  findNode: n
}) {
  const o = [];
  for (const r of t) {
    const a = n(r.id);
    a && o.push(a);
  }
  return [e ? o.find((r) => r.id === e) : o[0], o];
}
function wc(e) {
  if (Array.isArray(e))
    switch (e.length) {
      case 1:
        return [e[0], e[0], e[0], e[0]];
      case 2:
        return [e[0], e[1], e[0], e[1]];
      case 3:
        return [e[0], e[1], e[2], e[1]];
      case 4:
        return e;
      default:
        return [0, 0, 0, 0];
    }
  return [e, e, e, e];
}
function vm(e, t, n) {
  const [o, r, a, i] = typeof e != "string" ? wc(e.padding) : [0, 0, 0, 0];
  return n && typeof n.computedPosition.x < "u" && typeof n.computedPosition.y < "u" && typeof n.dimensions.width < "u" && typeof n.dimensions.height < "u" ? [
    [n.computedPosition.x + i, n.computedPosition.y + o],
    [
      n.computedPosition.x + n.dimensions.width - r,
      n.computedPosition.y + n.dimensions.height - a
    ]
  ] : !1;
}
function mm(e, t, n, o) {
  let r = e.extent || n;
  if ((r === "parent" || !Array.isArray(r) && r?.range === "parent") && !e.expandParent)
    if (e.parentNode && o && e.dimensions.width && e.dimensions.height) {
      const a = vm(r, e, o);
      a && (r = a);
    } else
      t(new Ye(Fe.NODE_EXTENT_INVALID, e.id)), r = n;
  else if (Array.isArray(r)) {
    const a = o?.computedPosition.x || 0, i = o?.computedPosition.y || 0;
    r = [
      [r[0][0] + a, r[0][1] + i],
      [r[1][0] + a, r[1][1] + i]
    ];
  } else if (r !== "parent" && r?.range && Array.isArray(r.range)) {
    const [a, i, s, u] = wc(r.padding), c = o?.computedPosition.x || 0, l = o?.computedPosition.y || 0;
    r = [
      [r.range[0][0] + c + u, r.range[0][1] + l + a],
      [r.range[1][0] + c - i, r.range[1][1] + l - s]
    ];
  }
  return r === "parent" ? [
    [Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY],
    [Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY]
  ] : r;
}
function ym({ width: e, height: t }, n) {
  return [n[0], [n[1][0] - (e || 0), n[1][1] - (t || 0)]];
}
function Ra(e, t, n, o, r) {
  const a = ym(e.dimensions, mm(e, n, o, r)), i = dc(t, a);
  return {
    position: {
      x: i.x - (r?.computedPosition.x || 0),
      y: i.y - (r?.computedPosition.y || 0)
    },
    computedPosition: i
  };
}
function yn(e, t, n = ce.Left, o = !1) {
  const r = (t?.x ?? 0) + e.computedPosition.x, a = (t?.y ?? 0) + e.computedPosition.y, { width: i, height: s } = t ?? _m(e);
  if (o)
    return { x: r + i / 2, y: a + s / 2 };
  switch (t?.position ?? n) {
    case ce.Top:
      return { x: r + i / 2, y: a };
    case ce.Right:
      return { x: r + i, y: a + s / 2 };
    case ce.Bottom:
      return { x: r + i / 2, y: a + s };
    case ce.Left:
      return { x: r, y: a + s / 2 };
  }
}
function Hs(e, t) {
  return e && (t ? e.find((n) => n.id === t) : e[0]) || null;
}
function bm({
  sourcePos: e,
  targetPos: t,
  sourceWidth: n,
  sourceHeight: o,
  targetWidth: r,
  targetHeight: a,
  width: i,
  height: s,
  viewport: u
}) {
  const c = {
    x: Math.min(e.x, t.x),
    y: Math.min(e.y, t.y),
    x2: Math.max(e.x + n, t.x + r),
    y2: Math.max(e.y + o, t.y + a)
  };
  c.x === c.x2 && (c.x2 += 1), c.y === c.y2 && (c.y2 += 1);
  const l = er({
    x: (0 - u.x) / u.zoom,
    y: (0 - u.y) / u.zoom,
    width: i / u.zoom,
    height: s / u.zoom
  }), d = Math.max(0, Math.min(l.x2, c.x2) - Math.max(l.x, c.x)), f = Math.max(0, Math.min(l.y2, c.y2) - Math.max(l.y, c.y));
  return Math.ceil(d * f) > 0;
}
function wm(e, t, n = !1) {
  const o = typeof e.zIndex == "number";
  let r = o ? e.zIndex : 0;
  const a = t(e.source), i = t(e.target);
  return !a || !i ? 0 : (n && (r = o ? e.zIndex : Math.max(a.computedPosition.z || 0, i.computedPosition.z || 0)), r);
}
var Fe = /* @__PURE__ */ ((e) => (e.MISSING_STYLES = "MISSING_STYLES", e.MISSING_VIEWPORT_DIMENSIONS = "MISSING_VIEWPORT_DIMENSIONS", e.NODE_INVALID = "NODE_INVALID", e.NODE_NOT_FOUND = "NODE_NOT_FOUND", e.NODE_MISSING_PARENT = "NODE_MISSING_PARENT", e.NODE_TYPE_MISSING = "NODE_TYPE_MISSING", e.NODE_EXTENT_INVALID = "NODE_EXTENT_INVALID", e.EDGE_INVALID = "EDGE_INVALID", e.EDGE_NOT_FOUND = "EDGE_NOT_FOUND", e.EDGE_SOURCE_MISSING = "EDGE_SOURCE_MISSING", e.EDGE_TARGET_MISSING = "EDGE_TARGET_MISSING", e.EDGE_TYPE_MISSING = "EDGE_TYPE_MISSING", e.EDGE_SOURCE_TARGET_SAME = "EDGE_SOURCE_TARGET_SAME", e.EDGE_SOURCE_TARGET_MISSING = "EDGE_SOURCE_TARGET_MISSING", e.EDGE_ORPHANED = "EDGE_ORPHANED", e.USEVUEFLOW_OPTIONS = "USEVUEFLOW_OPTIONS", e))(Fe || {});
const Fs = {
  MISSING_STYLES: () => "It seems that you haven't loaded the necessary styles. Please import '@vue-flow/core/dist/style.css' to ensure that the graph is rendered correctly",
  MISSING_VIEWPORT_DIMENSIONS: () => "The Vue Flow parent container needs a width and a height to render the graph",
  NODE_INVALID: (e) => `Node is invalid
Node: ${e}`,
  NODE_NOT_FOUND: (e) => `Node not found
Node: ${e}`,
  NODE_MISSING_PARENT: (e, t) => `Node is missing a parent
Node: ${e}
Parent: ${t}`,
  NODE_TYPE_MISSING: (e) => `Node type is missing
Type: ${e}`,
  NODE_EXTENT_INVALID: (e) => `Only child nodes can use a parent extent
Node: ${e}`,
  EDGE_INVALID: (e) => `An edge needs a source and a target
Edge: ${e}`,
  EDGE_SOURCE_MISSING: (e, t) => `Edge source is missing
Edge: ${e} 
Source: ${t}`,
  EDGE_TARGET_MISSING: (e, t) => `Edge target is missing
Edge: ${e} 
Target: ${t}`,
  EDGE_TYPE_MISSING: (e) => `Edge type is missing
Type: ${e}`,
  EDGE_SOURCE_TARGET_SAME: (e, t, n) => `Edge source and target are the same
Edge: ${e} 
Source: ${t} 
Target: ${n}`,
  EDGE_SOURCE_TARGET_MISSING: (e, t, n) => `Edge source or target is missing
Edge: ${e} 
Source: ${t} 
Target: ${n}`,
  EDGE_ORPHANED: (e) => `Edge was orphaned (suddenly missing source or target) and has been removed
Edge: ${e}`,
  EDGE_NOT_FOUND: (e) => `Edge not found
Edge: ${e}`,
  // deprecation errors
  USEVUEFLOW_OPTIONS: () => "The options parameter is deprecated and will be removed in the next major version. Please use the id parameter instead"
};
class Ye extends Error {
  constructor(t, ...n) {
    var o;
    super((o = Fs[t]) == null ? void 0 : o.call(Fs, ...n)), this.name = "VueFlowError", this.code = t, this.args = n;
  }
}
function za(e) {
  return "clientX" in e;
}
function km(e) {
  return "sourceEvent" in e;
}
function ht(e, t) {
  const n = za(e);
  let o, r;
  return n ? (o = e.clientX, r = e.clientY) : "touches" in e && e.touches.length > 0 ? (o = e.touches[0].clientX, r = e.touches[0].clientY) : "changedTouches" in e && e.changedTouches.length > 0 ? (o = e.changedTouches[0].clientX, r = e.changedTouches[0].clientY) : (o = 0, r = 0), {
    x: o - (t?.left ?? 0),
    y: r - (t?.top ?? 0)
  };
}
const Jn = () => {
  var e;
  return typeof navigator < "u" && ((e = navigator?.userAgent) == null ? void 0 : e.indexOf("Mac")) >= 0;
};
function _m(e) {
  var t, n;
  return {
    width: ((t = e.dimensions) == null ? void 0 : t.width) ?? e.width ?? 0,
    height: ((n = e.dimensions) == null ? void 0 : n.height) ?? e.height ?? 0
  };
}
function gr(e, t = [1, 1]) {
  return {
    x: t[0] * Math.round(e.x / t[0]),
    y: t[1] * Math.round(e.y / t[1])
  };
}
const xm = () => !0;
function Ur(e) {
  e?.classList.remove("valid", "connecting", "vue-flow__handle-valid", "vue-flow__handle-connecting");
}
function Em(e, t, n) {
  const o = [], r = {
    x: e.x - n,
    y: e.y - n,
    width: n * 2,
    height: n * 2
  };
  for (const a of t.values())
    Qo(r, Jo(a)) > 0 && o.push(a);
  return o;
}
const $m = 250;
function Sm(e, t, n, o) {
  var r, a;
  let i = [], s = Number.POSITIVE_INFINITY;
  const u = Em(e, n, t + $m);
  for (const c of u) {
    const l = [...((r = c.handleBounds) == null ? void 0 : r.source) ?? [], ...((a = c.handleBounds) == null ? void 0 : a.target) ?? []];
    for (const d of l) {
      if (o.nodeId === d.nodeId && o.type === d.type && o.id === d.id)
        continue;
      const { x: f, y: h } = yn(c, d, d.position, !0), b = Math.sqrt((f - e.x) ** 2 + (h - e.y) ** 2);
      b > t || (b < s ? (i = [{ ...d, x: f, y: h }], s = b) : b === s && i.push({ ...d, x: f, y: h }));
    }
  }
  if (!i.length)
    return null;
  if (i.length > 1) {
    const c = o.type === "source" ? "target" : "source";
    return i.find((l) => l.type === c) ?? i[0];
  }
  return i[0];
}
function Gs(e, {
  handle: t,
  connectionMode: n,
  fromNodeId: o,
  fromHandleId: r,
  fromType: a,
  doc: i,
  lib: s,
  flowId: u,
  isValidConnection: c = xm
}, l, d, f, h) {
  const b = a === "target", w = t ? i.querySelector(`.${s}-flow__handle[data-id="${u}-${t?.nodeId}-${t?.id}-${t?.type}"]`) : null, { x: m, y: p } = ht(e), v = i.elementFromPoint(m, p), g = v?.classList.contains(`${s}-flow__handle`) ? v : w, k = {
    handleDomNode: g,
    isValid: !1,
    connection: null,
    toHandle: null
  };
  if (g) {
    const P = kc(void 0, g), F = g.getAttribute("data-nodeid"), K = g.getAttribute("data-handleid"), C = g.classList.contains("connectable"), N = g.classList.contains("connectableend");
    if (!F || !P)
      return k;
    const M = {
      source: b ? F : o,
      sourceHandle: b ? K : r,
      target: b ? o : F,
      targetHandle: b ? r : K
    };
    k.connection = M;
    const S = C && N && (n === Bt.Strict ? b && P === "source" || !b && P === "target" : F !== o || K !== r);
    k.isValid = S && c(M, {
      nodes: d,
      edges: l,
      sourceNode: f(M.source),
      targetNode: f(M.target)
    }), k.toHandle = _c(F, P, K, h, n, !0);
  }
  return k;
}
function kc(e, t) {
  return e || (t?.classList.contains("target") ? "target" : t?.classList.contains("source") ? "source" : null);
}
function Cm(e, t) {
  let n = null;
  return t ? n = "valid" : e && !t && (n = "invalid"), n;
}
function Nm(e, t) {
  let n = null;
  return t ? n = !0 : e && !t && (n = !1), n;
}
function _c(e, t, n, o, r, a = !1) {
  var i, s, u;
  const c = o.get(e);
  if (!c)
    return null;
  const l = r === Bt.Strict ? (i = c.handleBounds) == null ? void 0 : i[t] : [...((s = c.handleBounds) == null ? void 0 : s.source) ?? [], ...((u = c.handleBounds) == null ? void 0 : u.target) ?? []], d = (n ? l?.find((f) => f.id === n) : l?.[0]) ?? null;
  return d && a ? { ...d, ...yn(c, d, d.position, !0) } : d;
}
const aa = {
  [ce.Left]: ce.Right,
  [ce.Right]: ce.Left,
  [ce.Top]: ce.Bottom,
  [ce.Bottom]: ce.Top
}, Mm = ["production", "prod"];
function ao(e, ...t) {
  xc() && console.warn(`[Vue Flow]: ${e}`, ...t);
}
function xc() {
  return !Mm.includes("production");
}
function Ys(e, t, n, o, r) {
  const a = t.querySelectorAll(`.vue-flow__handle.${e}`);
  return a?.length ? Array.from(a).map((i) => {
    const s = i.getBoundingClientRect();
    return {
      id: i.getAttribute("data-handleid"),
      type: e,
      nodeId: r,
      position: i.getAttribute("data-handlepos"),
      x: (s.left - n.left) / o,
      y: (s.top - n.top) / o,
      ...pr(i)
    };
  }) : null;
}
function sa(e, t, n, o, r, a = !1, i) {
  r.value = !1, e.selected ? (a || e.selected && t) && (o([e]), Ke(() => {
    i.blur();
  })) : n([e]);
}
function He(e) {
  return typeof oe(e) < "u";
}
function Tm(e, t, n, o) {
  if (!e || !e.source || !e.target)
    return n(new Ye(Fe.EDGE_INVALID, e?.id ?? "[ID UNKNOWN]")), !1;
  let r;
  return Lt(e) ? r = e : r = {
    ...e,
    id: pc(e)
  }, r = fc(r, void 0, o), cm(r, t) ? !1 : r;
}
function Im(e, t, n, o, r) {
  if (!t.source || !t.target)
    return r(new Ye(Fe.EDGE_INVALID, e.id)), !1;
  if (!n)
    return r(new Ye(Fe.EDGE_NOT_FOUND, e.id)), !1;
  const { id: a, ...i } = e;
  return {
    ...i,
    id: o ? pc(t) : a,
    source: t.source,
    target: t.target,
    sourceHandle: t.sourceHandle,
    targetHandle: t.targetHandle
  };
}
function Us(e, t, n) {
  const o = {}, r = [];
  for (let a = 0; a < e.length; ++a) {
    const i = e[a];
    if (!Kt(i)) {
      n(
        new Ye(Fe.NODE_INVALID, i?.id) || `[ID UNKNOWN|INDEX ${a}]`
      );
      continue;
    }
    const s = sm(i, t(i.id), i.parentNode);
    i.parentNode && (o[i.parentNode] = !0), r[a] = s;
  }
  for (const a of r) {
    const i = t(a.parentNode) || r.find((s) => s.id === a.parentNode);
    a.parentNode && !i && n(new Ye(Fe.NODE_MISSING_PARENT, a.id, a.parentNode)), (a.parentNode || o[a.id]) && (o[a.id] && (a.isParent = !0), i && (i.isParent = !0));
  }
  return r;
}
function qs(e, t, n, o, r, a) {
  let i = r;
  const s = o.get(i) || /* @__PURE__ */ new Map();
  o.set(i, s.set(n, t)), i = `${r}-${e}`;
  const u = o.get(i) || /* @__PURE__ */ new Map();
  if (o.set(i, u.set(n, t)), a) {
    i = `${r}-${e}-${a}`;
    const c = o.get(i) || /* @__PURE__ */ new Map();
    o.set(i, c.set(n, t));
  }
}
function qr(e, t, n) {
  e.clear();
  for (const o of n) {
    const { source: r, target: a, sourceHandle: i = null, targetHandle: s = null } = o, u = { edgeId: o.id, source: r, target: a, sourceHandle: i, targetHandle: s }, c = `${r}-${i}--${a}-${s}`, l = `${a}-${s}--${r}-${i}`;
    qs("source", u, l, e, r, i), qs("target", u, c, e, a, s);
  }
}
function Xs(e, t) {
  if (e.size !== t.size)
    return !1;
  for (const n of e)
    if (!t.has(n))
      return !1;
  return !0;
}
function Xr(e, t, n, o, r, a, i, s) {
  const u = [];
  for (const c of e) {
    const l = Lt(c) ? c : Tm(c, s, r, a);
    if (!l)
      continue;
    const d = n(l.source), f = n(l.target);
    if (!d || !f) {
      r(new Ye(Fe.EDGE_SOURCE_TARGET_MISSING, l.id, l.source, l.target));
      continue;
    }
    if (!d) {
      r(new Ye(Fe.EDGE_SOURCE_MISSING, l.id, l.source));
      continue;
    }
    if (!f) {
      r(new Ye(Fe.EDGE_TARGET_MISSING, l.id, l.target));
      continue;
    }
    if (t && !t(l, {
      edges: s,
      nodes: i,
      sourceNode: d,
      targetNode: f
    })) {
      r(new Ye(Fe.EDGE_INVALID, l.id));
      continue;
    }
    const h = o(l.id);
    u.push({
      ...fc(l, h, a),
      sourceNode: d,
      targetNode: f
    });
  }
  return u;
}
const Ws = Symbol("vueFlow"), Ec = Symbol("nodeId"), $c = Symbol("nodeRef"), Dm = Symbol("edgeId"), Am = Symbol("edgeRef"), vr = Symbol("slots");
function Sc(e) {
  const {
    vueFlowRef: t,
    snapToGrid: n,
    snapGrid: o,
    noDragClassName: r,
    nodeLookup: a,
    nodeExtent: i,
    nodeDragThreshold: s,
    viewport: u,
    autoPanOnNodeDrag: c,
    autoPanSpeed: l,
    nodesDraggable: d,
    panBy: f,
    findNode: h,
    multiSelectionActive: b,
    nodesSelectionActive: w,
    selectNodesOnDrag: m,
    removeSelectedElements: p,
    addSelectedNodes: v,
    updateNodePositions: g,
    emits: k
  } = Oe(), { onStart: P, onDrag: F, onStop: K, onClick: C, el: N, disabled: M, id: B, selectable: S, dragHandle: Q } = e, y = xt(!1);
  let O = [], E, X = null, U = { x: void 0, y: void 0 }, z = { x: 0, y: 0 }, x = null, L = !1, te = !1, H = 0, q = !1;
  const Y = Rm(), Z = ({ x: re, y: se }) => {
    U = { x: re, y: se };
    let D = !1;
    if (O = O.map((T) => {
      const R = { x: re - T.distance.x, y: se - T.distance.y }, { computedPosition: j } = Ra(
        T,
        n.value ? gr(R, o.value) : R,
        k.error,
        i.value,
        T.parentNode ? h(T.parentNode) : void 0
      );
      return D = D || T.position.x !== j.x || T.position.y !== j.y, T.position = j, T;
    }), te = te || D, !!D && (g(O, !0, !0), y.value = !0, x)) {
      const [T, R] = Yr({
        id: B,
        dragItems: O,
        findNode: h
      });
      F({ event: x, node: T, nodes: R });
    }
  }, ee = () => {
    if (!X)
      return;
    const [re, se] = bc(z, X, l.value);
    if (re !== 0 || se !== 0) {
      const D = {
        x: (U.x ?? 0) - re / u.value.zoom,
        y: (U.y ?? 0) - se / u.value.zoom
      };
      f({ x: re, y: se }) && Z(D);
    }
    H = requestAnimationFrame(ee);
  }, ae = (re, se) => {
    L = !0;
    const D = h(B);
    !m.value && !b.value && D && (D.selected || p()), D && Ce(S) && m.value && sa(
      D,
      b.value,
      v,
      p,
      w,
      !1,
      se
    );
    const T = Y(re.sourceEvent);
    if (U = T, O = gm(a.value, d.value, T, B), O.length) {
      const [R, j] = Yr({
        id: B,
        dragItems: O,
        findNode: h
      });
      P({ event: re.sourceEvent, node: R, nodes: j });
    }
  }, me = (re, se) => {
    var D;
    re.sourceEvent.type === "touchmove" && re.sourceEvent.touches.length > 1 || (te = !1, s.value === 0 && ae(re, se), U = Y(re.sourceEvent), X = ((D = t.value) == null ? void 0 : D.getBoundingClientRect()) || null, z = ht(re.sourceEvent, X));
  }, ge = (re, se) => {
    const D = Y(re.sourceEvent);
    if (!q && L && c.value && (q = !0, ee()), !L) {
      const T = D.xSnapped - (U.x ?? 0), R = D.ySnapped - (U.y ?? 0);
      Math.sqrt(T * T + R * R) > s.value && ae(re, se);
    }
    (U.x !== D.xSnapped || U.y !== D.ySnapped) && O.length && L && (x = re.sourceEvent, z = ht(re.sourceEvent, X), Z(D));
  }, ke = (re) => {
    let se = !1;
    if (!L && !y.value && !b.value) {
      const D = re.sourceEvent, T = Y(D), R = T.xSnapped - (U.x ?? 0), j = T.ySnapped - (U.y ?? 0), W = Math.sqrt(R * R + j * j);
      W !== 0 && W <= s.value && (C?.(D), se = !0);
    }
    if (O.length && !se) {
      te && (g(O, !1, !1), te = !1);
      const [D, T] = Yr({
        id: B,
        dragItems: O,
        findNode: h
      });
      K({ event: re.sourceEvent, node: D, nodes: T });
    }
    O = [], y.value = !1, q = !1, L = !1, U = { x: void 0, y: void 0 }, cancelAnimationFrame(H);
  };
  return xe([() => Ce(M), N], ([re, se], D, T) => {
    if (se) {
      const R = et(se);
      re || (E = ag().on("start", (j) => me(j, se)).on("drag", (j) => ge(j, se)).on("end", (j) => ke(j)).filter((j) => {
        const W = j.target, ie = Ce(Q);
        return !j.button && (!r.value || !Vs(W, `.${r.value}`, se) && (!ie || Vs(W, ie, se)));
      }), R.call(E)), T(() => {
        R.on(".drag", null), E && (E.on("start", null), E.on("drag", null), E.on("end", null));
      });
    }
  }), y;
}
function Pm() {
  return {
    doubleClick: de(),
    click: de(),
    mouseEnter: de(),
    mouseMove: de(),
    mouseLeave: de(),
    contextMenu: de(),
    updateStart: de(),
    update: de(),
    updateEnd: de()
  };
}
function Om(e, t) {
  const n = Pm();
  return n.doubleClick.on((o) => {
    var r, a;
    t.edgeDoubleClick(o), (a = (r = e.events) == null ? void 0 : r.doubleClick) == null || a.call(r, o);
  }), n.click.on((o) => {
    var r, a;
    t.edgeClick(o), (a = (r = e.events) == null ? void 0 : r.click) == null || a.call(r, o);
  }), n.mouseEnter.on((o) => {
    var r, a;
    t.edgeMouseEnter(o), (a = (r = e.events) == null ? void 0 : r.mouseEnter) == null || a.call(r, o);
  }), n.mouseMove.on((o) => {
    var r, a;
    t.edgeMouseMove(o), (a = (r = e.events) == null ? void 0 : r.mouseMove) == null || a.call(r, o);
  }), n.mouseLeave.on((o) => {
    var r, a;
    t.edgeMouseLeave(o), (a = (r = e.events) == null ? void 0 : r.mouseLeave) == null || a.call(r, o);
  }), n.contextMenu.on((o) => {
    var r, a;
    t.edgeContextMenu(o), (a = (r = e.events) == null ? void 0 : r.contextMenu) == null || a.call(r, o);
  }), n.updateStart.on((o) => {
    var r, a;
    t.edgeUpdateStart(o), (a = (r = e.events) == null ? void 0 : r.updateStart) == null || a.call(r, o);
  }), n.update.on((o) => {
    var r, a;
    t.edgeUpdate(o), (a = (r = e.events) == null ? void 0 : r.update) == null || a.call(r, o);
  }), n.updateEnd.on((o) => {
    var r, a;
    t.edgeUpdateEnd(o), (a = (r = e.events) == null ? void 0 : r.updateEnd) == null || a.call(r, o);
  }), Object.entries(n).reduce(
    (o, [r, a]) => (o.emit[r] = a.trigger, o.on[r] = a.on, o),
    { emit: {}, on: {} }
  );
}
function Rm() {
  const { viewport: e, snapGrid: t, snapToGrid: n, vueFlowRef: o } = Oe();
  return (r) => {
    var a;
    const i = ((a = o.value) == null ? void 0 : a.getBoundingClientRect()) ?? { left: 0, top: 0 }, s = km(r) ? r.sourceEvent : r, { x: u, y: c } = ht(s, i), l = jn({ x: u, y: c }, e.value), { x: d, y: f } = n.value ? gr(l, t.value) : l;
    return {
      xSnapped: d,
      ySnapped: f,
      ...l
    };
  };
}
function _o() {
  return !0;
}
function Cc({
  handleId: e,
  nodeId: t,
  type: n,
  isValidConnection: o,
  edgeUpdaterType: r,
  onEdgeUpdate: a,
  onEdgeUpdateEnd: i
}) {
  const {
    id: s,
    vueFlowRef: u,
    connectionMode: c,
    connectionRadius: l,
    connectOnClick: d,
    connectionClickStartHandle: f,
    nodesConnectable: h,
    autoPanOnConnect: b,
    autoPanSpeed: w,
    findNode: m,
    panBy: p,
    startConnection: v,
    updateConnection: g,
    endConnection: k,
    emits: P,
    viewport: F,
    edges: K,
    nodes: C,
    isValidConnection: N,
    nodeLookup: M
  } = Oe();
  let B = null, S = !1, Q = null;
  function y(E) {
    var X;
    const U = Ce(n) === "target", z = za(E), x = Ds(E.target), L = E.currentTarget;
    if (L && (z && E.button === 0 || !z)) {
      let te = function(pe) {
        D = ht(pe, ke), Z = Sm(
          jn(D, F.value, !1, [1, 1]),
          l.value,
          M.value,
          j
        ), T || (R(), T = !0);
        const be = Gs(
          pe,
          {
            handle: Z,
            connectionMode: c.value,
            fromNodeId: Ce(t),
            fromHandleId: Ce(e),
            fromType: U ? "target" : "source",
            isValidConnection: Y,
            doc: x,
            lib: "vue",
            flowId: s,
            nodeLookup: M.value
          },
          K.value,
          C.value,
          m,
          M.value
        );
        Q = be.handleDomNode, B = be.connection, S = Nm(!!Z, be.isValid);
        const Ee = {
          // from stays the same
          ...ve,
          isValid: S,
          to: be.toHandle && S ? Kn({ x: be.toHandle.x, y: be.toHandle.y }, F.value) : D,
          toHandle: be.toHandle,
          toPosition: S && be.toHandle ? be.toHandle.position : aa[j.position],
          toNode: be.toHandle ? M.value.get(be.toHandle.nodeId) : null
        };
        if (S && Z && ve?.toHandle && Ee.toHandle && ve.toHandle.type === Ee.toHandle.type && ve.toHandle.nodeId === Ee.toHandle.nodeId && ve.toHandle.id === Ee.toHandle.id && ve.to.x === Ee.to.x && ve.to.y === Ee.to.y)
          return;
        const Ne = Z ?? be.toHandle;
        if (g(
          Ne && S ? Kn(
            {
              x: Ne.x,
              y: Ne.y
            },
            F.value
          ) : D,
          Ne,
          Cm(!!Ne, S)
        ), ve = Ee, !Z && !S && !Q)
          return Ur(se);
        B && B.source !== B.target && Q && (Ur(se), se = Q, Q.classList.add("connecting", "vue-flow__handle-connecting"), Q.classList.toggle("valid", !!S), Q.classList.toggle("vue-flow__handle-valid", !!S));
      }, H = function(pe) {
        "touches" in pe && pe.touches.length > 0 || ((Z || Q) && B && S && (a ? a(pe, B) : P.connect(B)), P.connectEnd(pe), r && i?.(pe), Ur(se), cancelAnimationFrame(ee), k(pe), T = !1, S = !1, B = null, Q = null, x.removeEventListener("mousemove", te), x.removeEventListener("mouseup", H), x.removeEventListener("touchmove", te), x.removeEventListener("touchend", H));
      };
      const q = m(Ce(t));
      let Y = Ce(o) || N.value || _o;
      !Y && q && (Y = (U ? q.isValidSourcePos : q.isValidTargetPos) || _o);
      let Z, ee = 0;
      const { x: ae, y: me } = ht(E), ge = kc(Ce(r), L), ke = (X = u.value) == null ? void 0 : X.getBoundingClientRect();
      if (!ke || !ge)
        return;
      const re = _c(Ce(t), ge, Ce(e), M.value, c.value);
      if (!re)
        return;
      let se, D = ht(E, ke), T = !1;
      const R = () => {
        if (!b.value)
          return;
        const [pe, be] = bc(D, ke, w.value);
        p({ x: pe, y: be }), ee = requestAnimationFrame(R);
      }, j = {
        ...re,
        nodeId: Ce(t),
        type: ge,
        position: re.position
      }, W = M.value.get(Ce(t)), ue = {
        inProgress: !0,
        isValid: null,
        from: yn(W, j, ce.Left, !0),
        fromHandle: j,
        fromPosition: j.position,
        fromNode: W,
        to: D,
        toHandle: null,
        toPosition: aa[j.position],
        toNode: null
      };
      v(
        {
          nodeId: Ce(t),
          id: Ce(e),
          type: ge,
          position: L?.getAttribute("data-handlepos") || ce.Top,
          ...D
        },
        {
          x: ae - ke.left,
          y: me - ke.top
        }
      ), P.connectStart({ event: E, nodeId: Ce(t), handleId: Ce(e), handleType: ge });
      let ve = ue;
      x.addEventListener("mousemove", te), x.addEventListener("mouseup", H), x.addEventListener("touchmove", te), x.addEventListener("touchend", H);
    }
  }
  function O(E) {
    var X, U;
    if (!d.value)
      return;
    const z = Ce(n) === "target";
    if (!f.value) {
      P.clickConnectStart({ event: E, nodeId: Ce(t), handleId: Ce(e) }), v(
        {
          nodeId: Ce(t),
          type: Ce(n),
          id: Ce(e),
          position: ce.Top,
          ...ht(E)
        },
        void 0,
        !0
      );
      return;
    }
    let x = Ce(o) || N.value || _o;
    const L = m(Ce(t));
    if (!x && L && (x = (z ? L.isValidSourcePos : L.isValidTargetPos) || _o), L && (typeof L.connectable > "u" ? h.value : L.connectable) === !1)
      return;
    const te = Ds(E.target), H = Gs(
      E,
      {
        handle: {
          nodeId: Ce(t),
          id: Ce(e),
          type: Ce(n),
          position: ce.Top,
          ...ht(E)
        },
        connectionMode: c.value,
        fromNodeId: f.value.nodeId,
        fromHandleId: f.value.id ?? null,
        fromType: f.value.type,
        isValidConnection: x,
        doc: te,
        lib: "vue",
        flowId: s,
        nodeLookup: M.value
      },
      K.value,
      C.value,
      m,
      M.value
    ), q = ((X = H.connection) == null ? void 0 : X.source) === ((U = H.connection) == null ? void 0 : U.target);
    H.isValid && H.connection && !q && P.connect(H.connection), P.clickConnectEnd(E), k(E, !0);
  }
  return {
    handlePointerDown: y,
    handleClick: O
  };
}
function zm() {
  return ot(Ec, "");
}
function Nc(e) {
  const t = e ?? zm() ?? "", n = ot($c, le(null)), { findNode: o, edges: r, emits: a } = Oe(), i = o(t);
  return i || a.error(new Ye(Fe.NODE_NOT_FOUND, t)), {
    id: t,
    nodeEl: n,
    node: i,
    parentNode: ne(() => o(i.parentNode)),
    connectedEdges: ne(() => Gt([i], r.value))
  };
}
function Bm() {
  return {
    doubleClick: de(),
    click: de(),
    mouseEnter: de(),
    mouseMove: de(),
    mouseLeave: de(),
    contextMenu: de(),
    dragStart: de(),
    drag: de(),
    dragStop: de()
  };
}
function Lm(e, t) {
  const n = Bm();
  return n.doubleClick.on((o) => {
    var r, a;
    t.nodeDoubleClick(o), (a = (r = e.events) == null ? void 0 : r.doubleClick) == null || a.call(r, o);
  }), n.click.on((o) => {
    var r, a;
    t.nodeClick(o), (a = (r = e.events) == null ? void 0 : r.click) == null || a.call(r, o);
  }), n.mouseEnter.on((o) => {
    var r, a;
    t.nodeMouseEnter(o), (a = (r = e.events) == null ? void 0 : r.mouseEnter) == null || a.call(r, o);
  }), n.mouseMove.on((o) => {
    var r, a;
    t.nodeMouseMove(o), (a = (r = e.events) == null ? void 0 : r.mouseMove) == null || a.call(r, o);
  }), n.mouseLeave.on((o) => {
    var r, a;
    t.nodeMouseLeave(o), (a = (r = e.events) == null ? void 0 : r.mouseLeave) == null || a.call(r, o);
  }), n.contextMenu.on((o) => {
    var r, a;
    t.nodeContextMenu(o), (a = (r = e.events) == null ? void 0 : r.contextMenu) == null || a.call(r, o);
  }), n.dragStart.on((o) => {
    var r, a;
    t.nodeDragStart(o), (a = (r = e.events) == null ? void 0 : r.dragStart) == null || a.call(r, o);
  }), n.drag.on((o) => {
    var r, a;
    t.nodeDrag(o), (a = (r = e.events) == null ? void 0 : r.drag) == null || a.call(r, o);
  }), n.dragStop.on((o) => {
    var r, a;
    t.nodeDragStop(o), (a = (r = e.events) == null ? void 0 : r.dragStop) == null || a.call(r, o);
  }), Object.entries(n).reduce(
    (o, [r, a]) => (o.emit[r] = a.trigger, o.on[r] = a.on, o),
    { emit: {}, on: {} }
  );
}
function Mc() {
  const { getSelectedNodes: e, nodeExtent: t, updateNodePositions: n, findNode: o, snapGrid: r, snapToGrid: a, nodesDraggable: i, emits: s } = Oe();
  return (u, c = !1) => {
    const l = a.value ? r.value[0] : 5, d = a.value ? r.value[1] : 5, f = c ? 4 : 1, h = u.x * l * f, b = u.y * d * f, w = [];
    for (const m of e.value)
      if (m.draggable || i && typeof m.draggable > "u") {
        const p = { x: m.computedPosition.x + h, y: m.computedPosition.y + b }, { position: v } = Ra(
          m,
          p,
          s.error,
          t.value,
          m.parentNode ? o(m.parentNode) : void 0
        );
        w.push({
          id: m.id,
          position: v,
          from: m.position,
          distance: { x: u.x, y: u.y },
          dimensions: m.dimensions
        });
      }
    n(w, !0, !1);
  };
}
const xo = 0.1, Vm = (e) => ((e *= 2) <= 1 ? e * e * e : (e -= 2) * e * e + 2) / 2;
function Tt() {
  return ao("Viewport not initialized yet."), Promise.resolve(!1);
}
const Hm = {
  zoomIn: Tt,
  zoomOut: Tt,
  zoomTo: Tt,
  fitView: Tt,
  setCenter: Tt,
  fitBounds: Tt,
  project: (e) => e,
  screenToFlowCoordinate: (e) => e,
  flowToScreenCoordinate: (e) => e,
  setViewport: Tt,
  setTransform: Tt,
  getViewport: () => ({ x: 0, y: 0, zoom: 1 }),
  getTransform: () => ({ x: 0, y: 0, zoom: 1 }),
  viewportInitialized: !1
};
function Fm(e) {
  function t(o, r) {
    return new Promise((a) => {
      e.d3Selection && e.d3Zoom ? e.d3Zoom.interpolate(r?.interpolate === "linear" ? Bn : Oo).scaleBy(
        Wr(e.d3Selection, r?.duration, r?.ease, () => {
          a(!0);
        }),
        o
      ) : a(!1);
    });
  }
  function n(o, r, a, i) {
    return new Promise((s) => {
      var u;
      const { x: c, y: l } = dc({ x: -o, y: -r }, e.translateExtent), d = mn.translate(-c, -l).scale(a);
      e.d3Selection && e.d3Zoom ? (u = e.d3Zoom) == null || u.interpolate(i?.interpolate === "linear" ? Bn : Oo).transform(
        Wr(e.d3Selection, i?.duration, i?.ease, () => {
          s(!0);
        }),
        d
      ) : s(!1);
    });
  }
  return ne(() => e.d3Zoom && e.d3Selection && e.dimensions.width && e.dimensions.height ? {
    viewportInitialized: !0,
    // todo: allow passing scale as option
    zoomIn: (r) => t(1.2, r),
    zoomOut: (r) => t(1 / 1.2, r),
    zoomTo: (r, a) => new Promise((i) => {
      e.d3Selection && e.d3Zoom ? e.d3Zoom.interpolate(a?.interpolate === "linear" ? Bn : Oo).scaleTo(
        Wr(e.d3Selection, a?.duration, a?.ease, () => {
          i(!0);
        }),
        r
      ) : i(!1);
    }),
    setViewport: (r, a) => n(r.x, r.y, r.zoom, a),
    setTransform: (r, a) => n(r.x, r.y, r.zoom, a),
    getViewport: () => ({
      x: e.viewport.x,
      y: e.viewport.y,
      zoom: e.viewport.zoom
    }),
    getTransform: () => ({
      x: e.viewport.x,
      y: e.viewport.y,
      zoom: e.viewport.zoom
    }),
    fitView: (r = {
      padding: xo,
      includeHiddenNodes: !1,
      duration: 0
    }) => {
      var a, i;
      const s = [];
      for (const f of e.nodes)
        f.dimensions.width && f.dimensions.height && (r?.includeHiddenNodes || !f.hidden) && (!((a = r.nodes) != null && a.length) || (i = r.nodes) != null && i.length && r.nodes.includes(f.id)) && s.push(f);
      if (!s.length)
        return Promise.resolve(!1);
      const u = Oa(s), { x: c, y: l, zoom: d } = As(
        u,
        e.dimensions.width,
        e.dimensions.height,
        r.minZoom ?? e.minZoom,
        r.maxZoom ?? e.maxZoom,
        r.padding ?? xo
      );
      return n(c, l, d, r);
    },
    setCenter: (r, a, i) => {
      const s = typeof i?.zoom < "u" ? i.zoom : e.maxZoom, u = e.dimensions.width / 2 - r * s, c = e.dimensions.height / 2 - a * s;
      return n(u, c, s, i);
    },
    fitBounds: (r, a = { padding: xo }) => {
      const { x: i, y: s, zoom: u } = As(
        r,
        e.dimensions.width,
        e.dimensions.height,
        e.minZoom,
        e.maxZoom,
        a.padding ?? xo
      );
      return n(i, s, u, a);
    },
    project: (r) => jn(r, e.viewport, e.snapToGrid, e.snapGrid),
    screenToFlowCoordinate: (r) => {
      if (e.vueFlowRef) {
        const { x: a, y: i } = e.vueFlowRef.getBoundingClientRect(), s = {
          x: r.x - a,
          y: r.y - i
        };
        return jn(s, e.viewport, e.snapToGrid, e.snapGrid);
      }
      return { x: 0, y: 0 };
    },
    flowToScreenCoordinate: (r) => {
      if (e.vueFlowRef) {
        const { x: a, y: i } = e.vueFlowRef.getBoundingClientRect(), s = {
          x: r.x + a,
          y: r.y + i
        };
        return Kn(s, e.viewport);
      }
      return { x: 0, y: 0 };
    }
  } : Hm);
}
function Wr(e, t = 0, n = Vm, o = () => {
}) {
  const r = typeof t == "number" && t > 0;
  return r || o(), r ? e.transition().duration(t).ease(n).on("end", o) : e;
}
function Gm(e, t, n) {
  const o = Ea(!0);
  return o.run(() => {
    const r = () => {
      o.run(() => {
        let w, m, p = !!(n.nodes.value.length || n.edges.value.length);
        w = an([e.modelValue, () => {
          var v, g;
          return (g = (v = e.modelValue) == null ? void 0 : v.value) == null ? void 0 : g.length;
        }], ([v]) => {
          v && Array.isArray(v) && (m?.pause(), n.setElements(v), !m && !p && v.length ? p = !0 : m?.resume());
        }), m = an(
          [n.nodes, n.edges, () => n.edges.value.length, () => n.nodes.value.length],
          ([v, g]) => {
            var k;
            (k = e.modelValue) != null && k.value && Array.isArray(e.modelValue.value) && (w?.pause(), e.modelValue.value = [...v, ...g], Ke(() => {
              w?.resume();
            }));
          },
          { immediate: p }
        ), Do(() => {
          w?.stop(), m?.stop();
        });
      });
    }, a = () => {
      o.run(() => {
        let w, m, p = !!n.nodes.value.length;
        w = an([e.nodes, () => {
          var v, g;
          return (g = (v = e.nodes) == null ? void 0 : v.value) == null ? void 0 : g.length;
        }], ([v]) => {
          v && Array.isArray(v) && (m?.pause(), n.setNodes(v), !m && !p && v.length ? p = !0 : m?.resume());
        }), m = an(
          [n.nodes, () => n.nodes.value.length],
          ([v]) => {
            var g;
            (g = e.nodes) != null && g.value && Array.isArray(e.nodes.value) && (w?.pause(), e.nodes.value = [...v], Ke(() => {
              w?.resume();
            }));
          },
          { immediate: p }
        ), Do(() => {
          w?.stop(), m?.stop();
        });
      });
    }, i = () => {
      o.run(() => {
        let w, m, p = !!n.edges.value.length;
        w = an([e.edges, () => {
          var v, g;
          return (g = (v = e.edges) == null ? void 0 : v.value) == null ? void 0 : g.length;
        }], ([v]) => {
          v && Array.isArray(v) && (m?.pause(), n.setEdges(v), !m && !p && v.length ? p = !0 : m?.resume());
        }), m = an(
          [n.edges, () => n.edges.value.length],
          ([v]) => {
            var g;
            (g = e.edges) != null && g.value && Array.isArray(e.edges.value) && (w?.pause(), e.edges.value = [...v], Ke(() => {
              w?.resume();
            }));
          },
          { immediate: p }
        ), Do(() => {
          w?.stop(), m?.stop();
        });
      });
    }, s = () => {
      o.run(() => {
        xe(
          () => t.maxZoom,
          () => {
            t.maxZoom && He(t.maxZoom) && n.setMaxZoom(t.maxZoom);
          },
          {
            immediate: !0
          }
        );
      });
    }, u = () => {
      o.run(() => {
        xe(
          () => t.minZoom,
          () => {
            t.minZoom && He(t.minZoom) && n.setMinZoom(t.minZoom);
          },
          { immediate: !0 }
        );
      });
    }, c = () => {
      o.run(() => {
        xe(
          () => t.translateExtent,
          () => {
            t.translateExtent && He(t.translateExtent) && n.setTranslateExtent(t.translateExtent);
          },
          {
            immediate: !0
          }
        );
      });
    }, l = () => {
      o.run(() => {
        xe(
          () => t.nodeExtent,
          () => {
            t.nodeExtent && He(t.nodeExtent) && n.setNodeExtent(t.nodeExtent);
          },
          {
            immediate: !0
          }
        );
      });
    }, d = () => {
      o.run(() => {
        xe(
          () => t.applyDefault,
          () => {
            He(t.applyDefault) && (n.applyDefault.value = t.applyDefault);
          },
          {
            immediate: !0
          }
        );
      });
    }, f = () => {
      o.run(() => {
        const w = async (m) => {
          let p = m;
          typeof t.autoConnect == "function" && (p = await t.autoConnect(m)), p !== !1 && n.addEdges([p]);
        };
        xe(
          () => t.autoConnect,
          () => {
            He(t.autoConnect) && (n.autoConnect.value = t.autoConnect);
          },
          { immediate: !0 }
        ), xe(
          n.autoConnect,
          (m, p, v) => {
            m ? n.onConnect(w) : n.hooks.value.connect.off(w), v(() => {
              n.hooks.value.connect.off(w);
            });
          },
          { immediate: !0 }
        );
      });
    }, h = () => {
      const w = [
        "id",
        "modelValue",
        "translateExtent",
        "nodeExtent",
        "edges",
        "nodes",
        "maxZoom",
        "minZoom",
        "applyDefault",
        "autoConnect"
      ];
      for (const m of Object.keys(t)) {
        const p = m;
        if (!w.includes(p)) {
          const v = Te(() => t[p]), g = n[p];
          $a(g) && o.run(() => {
            xe(
              v,
              (k) => {
                He(k) && (g.value = k);
              },
              { immediate: !0 }
            );
          });
        }
      }
    };
    (() => {
      r(), a(), i(), u(), s(), c(), l(), d(), f(), h();
    })();
  }), () => o.stop();
}
function Ym() {
  return {
    edgesChange: de(),
    nodesChange: de(),
    nodeDoubleClick: de(),
    nodeClick: de(),
    nodeMouseEnter: de(),
    nodeMouseMove: de(),
    nodeMouseLeave: de(),
    nodeContextMenu: de(),
    nodeDragStart: de(),
    nodeDrag: de(),
    nodeDragStop: de(),
    nodesInitialized: de(),
    miniMapNodeClick: de(),
    miniMapNodeDoubleClick: de(),
    miniMapNodeMouseEnter: de(),
    miniMapNodeMouseMove: de(),
    miniMapNodeMouseLeave: de(),
    connect: de(),
    connectStart: de(),
    connectEnd: de(),
    clickConnectStart: de(),
    clickConnectEnd: de(),
    paneReady: de(),
    init: de(),
    move: de(),
    moveStart: de(),
    moveEnd: de(),
    selectionDragStart: de(),
    selectionDrag: de(),
    selectionDragStop: de(),
    selectionContextMenu: de(),
    selectionStart: de(),
    selectionEnd: de(),
    viewportChangeStart: de(),
    viewportChange: de(),
    viewportChangeEnd: de(),
    paneScroll: de(),
    paneClick: de(),
    paneContextMenu: de(),
    paneMouseEnter: de(),
    paneMouseMove: de(),
    paneMouseLeave: de(),
    edgeContextMenu: de(),
    edgeMouseEnter: de(),
    edgeMouseMove: de(),
    edgeMouseLeave: de(),
    edgeDoubleClick: de(),
    edgeClick: de(),
    edgeUpdateStart: de(),
    edgeUpdate: de(),
    edgeUpdateEnd: de(),
    updateNodeInternals: de(),
    error: de((e) => ao(e.message))
  };
}
function Um(e, t) {
  const n = kn();
  mf(() => {
    for (const [r, a] of Object.entries(t.value)) {
      const i = (s) => {
        e(r, s);
      };
      a.setEmitter(i), Gn(a.removeEmitter), a.setHasEmitListeners(() => o(r)), Gn(a.removeHasEmitListeners);
    }
  });
  function o(r) {
    var a;
    const i = qm(r);
    return !!((a = n?.vnode.props) == null ? void 0 : a[i]);
  }
}
function qm(e) {
  const [t, ...n] = e.split(":");
  return `on${t.replace(/(?:^|-)(\w)/g, (r, a) => a.toUpperCase())}${n.length ? `:${n.join(":")}` : ""}`;
}
function Tc() {
  return {
    vueFlowRef: null,
    viewportRef: null,
    nodes: [],
    edges: [],
    connectionLookup: /* @__PURE__ */ new Map(),
    nodeTypes: {},
    edgeTypes: {},
    initialized: !1,
    dimensions: {
      width: 0,
      height: 0
    },
    viewport: { x: 0, y: 0, zoom: 1 },
    d3Zoom: null,
    d3Selection: null,
    d3ZoomHandler: null,
    minZoom: 0.5,
    maxZoom: 2,
    translateExtent: [
      [Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY],
      [Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY]
    ],
    nodeExtent: [
      [Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY],
      [Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY]
    ],
    selectionMode: Pa.Full,
    paneDragging: !1,
    preventScrolling: !0,
    zoomOnScroll: !0,
    zoomOnPinch: !0,
    zoomOnDoubleClick: !0,
    panOnScroll: !1,
    panOnScrollSpeed: 0.5,
    panOnScrollMode: Ln.Free,
    paneClickDistance: 0,
    panOnDrag: !0,
    edgeUpdaterRadius: 10,
    onlyRenderVisibleElements: !1,
    defaultViewport: { x: 0, y: 0, zoom: 1 },
    nodesSelectionActive: !1,
    userSelectionActive: !1,
    userSelectionRect: null,
    defaultMarkerColor: "#b1b1b7",
    connectionLineStyle: {},
    connectionLineType: null,
    connectionLineOptions: {
      type: Ft.Bezier,
      style: {}
    },
    connectionMode: Bt.Loose,
    connectionStartHandle: null,
    connectionEndHandle: null,
    connectionClickStartHandle: null,
    connectionPosition: { x: Number.NaN, y: Number.NaN },
    connectionRadius: 20,
    connectOnClick: !0,
    connectionStatus: null,
    isValidConnection: null,
    snapGrid: [15, 15],
    snapToGrid: !1,
    edgesUpdatable: !1,
    edgesFocusable: !0,
    nodesFocusable: !0,
    nodesConnectable: !0,
    nodesDraggable: !0,
    nodeDragThreshold: 1,
    elementsSelectable: !0,
    selectNodesOnDrag: !0,
    multiSelectionActive: !1,
    selectionKeyCode: "Shift",
    multiSelectionKeyCode: Jn() ? "Meta" : "Control",
    zoomActivationKeyCode: Jn() ? "Meta" : "Control",
    deleteKeyCode: "Backspace",
    panActivationKeyCode: "Space",
    hooks: Ym(),
    applyDefault: !0,
    autoConnect: !1,
    fitViewOnInit: !1,
    fitViewOnInitDone: !1,
    noDragClassName: "nodrag",
    noWheelClassName: "nowheel",
    noPanClassName: "nopan",
    defaultEdgeOptions: void 0,
    elevateEdgesOnSelect: !1,
    elevateNodesOnSelect: !0,
    autoPanOnNodeDrag: !0,
    autoPanOnConnect: !0,
    autoPanSpeed: 15,
    disableKeyboardA11y: !1,
    ariaLiveMessage: ""
  };
}
const Xm = [
  "id",
  "vueFlowRef",
  "viewportRef",
  "initialized",
  "modelValue",
  "nodes",
  "edges",
  "maxZoom",
  "minZoom",
  "translateExtent",
  "hooks",
  "defaultEdgeOptions"
];
function Wm(e, t, n) {
  const o = Fm(e), r = (D) => {
    const T = D ?? [];
    e.hooks.updateNodeInternals.trigger(T);
  }, a = (D) => um(D, e.nodes, e.edges), i = (D) => lm(D, e.nodes, e.edges), s = (D) => Gt(D, e.edges), u = ({ id: D, type: T, nodeId: R }) => {
    var j;
    const W = D ? `-${T}-${D}` : `-${T}`;
    return Array.from(((j = e.connectionLookup.get(`${R}${W}`)) == null ? void 0 : j.values()) ?? []);
  }, c = (D) => {
    if (D)
      return t.value.get(D);
  }, l = (D) => {
    if (D)
      return n.value.get(D);
  }, d = (D, T, R) => {
    var j, W;
    const ie = [];
    for (const ue of D) {
      const ve = {
        id: ue.id,
        type: "position",
        dragging: R,
        from: ue.from
      };
      if (T && (ve.position = ue.position, ue.parentNode)) {
        const pe = c(ue.parentNode);
        ve.position = {
          x: ve.position.x - (((j = pe?.computedPosition) == null ? void 0 : j.x) ?? 0),
          y: ve.position.y - (((W = pe?.computedPosition) == null ? void 0 : W.y) ?? 0)
        };
      }
      ie.push(ve);
    }
    ie?.length && e.hooks.nodesChange.trigger(ie);
  }, f = (D) => {
    if (!e.vueFlowRef)
      return;
    const T = e.vueFlowRef.querySelector(".vue-flow__transformationpane");
    if (!T)
      return;
    const R = window.getComputedStyle(T), { m22: j } = new window.DOMMatrixReadOnly(R.transform), W = [];
    for (const ie of D) {
      const ue = ie, ve = c(ue.id);
      if (ve) {
        const pe = pr(ue.nodeElement);
        if (!!(pe.width && pe.height && (ve.dimensions.width !== pe.width || ve.dimensions.height !== pe.height || ue.forceUpdate))) {
          const Ee = ue.nodeElement.getBoundingClientRect();
          ve.dimensions = pe, ve.handleBounds.source = Ys("source", ue.nodeElement, Ee, j, ve.id), ve.handleBounds.target = Ys("target", ue.nodeElement, Ee, j, ve.id), W.push({
            id: ve.id,
            type: "dimensions",
            dimensions: pe
          });
        }
      }
    }
    !e.fitViewOnInitDone && e.fitViewOnInit && o.value.fitView().then(() => {
      e.fitViewOnInitDone = !0;
    }), W.length && e.hooks.nodesChange.trigger(W);
  }, h = (D, T) => {
    const R = /* @__PURE__ */ new Set(), j = /* @__PURE__ */ new Set();
    for (const ue of D)
      Kt(ue) ? R.add(ue.id) : Lt(ue) && j.add(ue.id);
    const W = At(t.value, R, !0), ie = At(n.value, j);
    if (e.multiSelectionActive) {
      for (const ue of R)
        W.push(It(ue, T));
      for (const ue of j)
        ie.push(It(ue, T));
    }
    W.length && e.hooks.nodesChange.trigger(W), ie.length && e.hooks.edgesChange.trigger(ie);
  }, b = (D) => {
    if (e.multiSelectionActive) {
      const T = D.map((R) => It(R.id, !0));
      e.hooks.nodesChange.trigger(T);
      return;
    }
    e.hooks.nodesChange.trigger(At(t.value, new Set(D.map((T) => T.id)), !0)), e.hooks.edgesChange.trigger(At(n.value));
  }, w = (D) => {
    if (e.multiSelectionActive) {
      const T = D.map((R) => It(R.id, !0));
      e.hooks.edgesChange.trigger(T);
      return;
    }
    e.hooks.edgesChange.trigger(At(n.value, new Set(D.map((T) => T.id)))), e.hooks.nodesChange.trigger(At(t.value, /* @__PURE__ */ new Set(), !0));
  }, m = (D) => {
    h(D, !0);
  }, p = (D) => {
    const R = (D || e.nodes).map((j) => (j.selected = !1, It(j.id, !1)));
    e.hooks.nodesChange.trigger(R);
  }, v = (D) => {
    const R = (D || e.edges).map((j) => (j.selected = !1, It(j.id, !1)));
    e.hooks.edgesChange.trigger(R);
  }, g = (D) => {
    if (!D || !D.length)
      return h([], !1);
    const T = D.reduce(
      (R, j) => {
        const W = It(j.id, !1);
        return Kt(j) ? R.nodes.push(W) : R.edges.push(W), R;
      },
      { nodes: [], edges: [] }
    );
    T.nodes.length && e.hooks.nodesChange.trigger(T.nodes), T.edges.length && e.hooks.edgesChange.trigger(T.edges);
  }, k = (D) => {
    var T;
    (T = e.d3Zoom) == null || T.scaleExtent([D, e.maxZoom]), e.minZoom = D;
  }, P = (D) => {
    var T;
    (T = e.d3Zoom) == null || T.scaleExtent([e.minZoom, D]), e.maxZoom = D;
  }, F = (D) => {
    var T;
    (T = e.d3Zoom) == null || T.translateExtent(D), e.translateExtent = D;
  }, K = (D) => {
    e.nodeExtent = D, r();
  }, C = (D) => {
    var T;
    (T = e.d3Zoom) == null || T.clickDistance(D);
  }, N = (D) => {
    e.nodesDraggable = D, e.nodesConnectable = D, e.elementsSelectable = D;
  }, M = (D) => {
    const T = D instanceof Function ? D(e.nodes) : D;
    !e.initialized && !T.length || (e.nodes = Us(T, c, e.hooks.error.trigger));
  }, B = (D) => {
    const T = D instanceof Function ? D(e.edges) : D;
    if (!e.initialized && !T.length)
      return;
    const R = Xr(
      T,
      e.isValidConnection,
      c,
      l,
      e.hooks.error.trigger,
      e.defaultEdgeOptions,
      e.nodes,
      e.edges
    );
    qr(e.connectionLookup, n.value, R), e.edges = R;
  }, S = (D) => {
    const T = D instanceof Function ? D([...e.nodes, ...e.edges]) : D;
    !e.initialized && !T.length || (M(T.filter(Kt)), B(T.filter(Lt)));
  }, Q = (D) => {
    let T = D instanceof Function ? D(e.nodes) : D;
    T = Array.isArray(T) ? T : [T];
    const R = Us(T, c, e.hooks.error.trigger), j = [];
    for (const W of R)
      j.push(Rs(W));
    j.length && e.hooks.nodesChange.trigger(j);
  }, y = (D) => {
    let T = D instanceof Function ? D(e.edges) : D;
    T = Array.isArray(T) ? T : [T];
    const R = Xr(
      T,
      e.isValidConnection,
      c,
      l,
      e.hooks.error.trigger,
      e.defaultEdgeOptions,
      e.nodes,
      e.edges
    ), j = [];
    for (const W of R)
      j.push(Rs(W));
    j.length && e.hooks.edgesChange.trigger(j);
  }, O = (D, T = !0, R = !1) => {
    const j = D instanceof Function ? D(e.nodes) : D, W = Array.isArray(j) ? j : [j], ie = [], ue = [];
    function ve(be) {
      const Ee = s(be);
      for (const Ne of Ee)
        (!He(Ne.deletable) || Ne.deletable) && ue.push(Bs(Ne.id, Ne.source, Ne.target, Ne.sourceHandle, Ne.targetHandle));
    }
    function pe(be) {
      const Ee = [];
      for (const Ne of e.nodes)
        Ne.parentNode === be && Ee.push(Ne);
      if (Ee.length) {
        for (const Ne of Ee)
          ie.push(zs(Ne.id));
        T && ve(Ee);
        for (const Ne of Ee)
          pe(Ne.id);
      }
    }
    for (const be of W) {
      const Ee = typeof be == "string" ? c(be) : be;
      Ee && (He(Ee.deletable) && !Ee.deletable || (ie.push(zs(Ee.id)), T && ve([Ee]), R && pe(Ee.id)));
    }
    ue.length && e.hooks.edgesChange.trigger(ue), ie.length && e.hooks.nodesChange.trigger(ie);
  }, E = (D) => {
    const T = D instanceof Function ? D(e.edges) : D, R = Array.isArray(T) ? T : [T], j = [];
    for (const W of R) {
      const ie = typeof W == "string" ? l(W) : W;
      ie && (He(ie.deletable) && !ie.deletable || j.push(
        Bs(
          typeof W == "string" ? W : W.id,
          ie.source,
          ie.target,
          ie.sourceHandle,
          ie.targetHandle
        )
      ));
    }
    e.hooks.edgesChange.trigger(j);
  }, X = (D, T, R = !0) => {
    const j = l(D.id);
    if (!j)
      return !1;
    const W = e.edges.indexOf(j), ie = Im(D, T, j, R, e.hooks.error.trigger);
    if (ie) {
      const [ue] = Xr(
        [ie],
        e.isValidConnection,
        c,
        l,
        e.hooks.error.trigger,
        e.defaultEdgeOptions,
        e.nodes,
        e.edges
      );
      return e.edges = e.edges.map((ve, pe) => pe === W ? ue : ve), qr(e.connectionLookup, n.value, [ue]), ue;
    }
    return !1;
  }, U = (D, T, R = { replace: !1 }) => {
    const j = l(D);
    if (!j)
      return;
    const W = typeof T == "function" ? T(j) : T;
    j.data = R.replace ? W : { ...j.data, ...W };
  }, z = (D) => Os(D, e.nodes), x = (D) => {
    const T = Os(D, e.edges);
    return qr(e.connectionLookup, n.value, T), T;
  }, L = (D, T, R = { replace: !1 }) => {
    const j = c(D);
    if (!j)
      return;
    const W = typeof T == "function" ? T(j) : T;
    R.replace ? e.nodes.splice(e.nodes.indexOf(j), 1, W) : Object.assign(j, W);
  }, te = (D, T, R = { replace: !1 }) => {
    const j = c(D);
    if (!j)
      return;
    const W = typeof T == "function" ? T(j) : T;
    j.data = R.replace ? W : { ...j.data, ...W };
  }, H = (D, T, R = !1) => {
    R ? e.connectionClickStartHandle = D : e.connectionStartHandle = D, e.connectionEndHandle = null, e.connectionStatus = null, T && (e.connectionPosition = T);
  }, q = (D, T = null, R = null) => {
    e.connectionStartHandle && (e.connectionPosition = D, e.connectionEndHandle = T, e.connectionStatus = R);
  }, Y = (D, T) => {
    e.connectionPosition = { x: Number.NaN, y: Number.NaN }, e.connectionEndHandle = null, e.connectionStatus = null, T ? e.connectionClickStartHandle = null : e.connectionStartHandle = null;
  }, Z = (D) => {
    const T = am(D), R = T ? null : Pn(D) ? D : c(D.id);
    return !T && !R ? [null, null, T] : [T ? D : Jo(R), R, T];
  }, ee = (D, T = !0, R = e.nodes) => {
    const [j, W, ie] = Z(D);
    if (!j)
      return [];
    const ue = [];
    for (const ve of R || e.nodes) {
      if (!ie && (ve.id === W.id || !ve.computedPosition))
        continue;
      const pe = Jo(ve), be = Qo(pe, j);
      (T && be > 0 || be >= pe.width * pe.height || be >= Number(j.width) * Number(j.height)) && ue.push(ve);
    }
    return ue;
  }, ae = (D, T, R = !0) => {
    const [j] = Z(D);
    if (!j)
      return !1;
    const W = Qo(j, T);
    return R && W > 0 || W >= Number(j.width) * Number(j.height);
  }, me = (D) => {
    const { viewport: T, dimensions: R, d3Zoom: j, d3Selection: W, translateExtent: ie } = e;
    if (!j || !W || !D.x && !D.y)
      return !1;
    const ue = mn.translate(T.x + D.x, T.y + D.y).scale(T.zoom), ve = [
      [0, 0],
      [R.width, R.height]
    ], pe = j.constrain()(ue, ve, ie), be = e.viewport.x !== pe.x || e.viewport.y !== pe.y || e.viewport.zoom !== pe.k;
    return j.transform(W, pe), be;
  }, ge = (D) => {
    const T = D instanceof Function ? D(e) : D, R = [
      "d3Zoom",
      "d3Selection",
      "d3ZoomHandler",
      "viewportRef",
      "vueFlowRef",
      "dimensions",
      "hooks"
    ];
    He(T.defaultEdgeOptions) && (e.defaultEdgeOptions = T.defaultEdgeOptions);
    const j = T.modelValue || T.nodes || T.edges ? [] : void 0;
    j && (T.modelValue && j.push(...T.modelValue), T.nodes && j.push(...T.nodes), T.edges && j.push(...T.edges), S(j));
    const W = () => {
      He(T.maxZoom) && P(T.maxZoom), He(T.minZoom) && k(T.minZoom), He(T.translateExtent) && F(T.translateExtent);
    };
    for (const ie of Object.keys(T)) {
      const ue = ie, ve = T[ue];
      ![...Xm, ...R].includes(ue) && He(ve) && (e[ue] = ve);
    }
    Ki(() => e.d3Zoom).not.toBeNull().then(W), e.initialized || (e.initialized = !0);
  };
  return {
    updateNodePositions: d,
    updateNodeDimensions: f,
    setElements: S,
    setNodes: M,
    setEdges: B,
    addNodes: Q,
    addEdges: y,
    removeNodes: O,
    removeEdges: E,
    findNode: c,
    findEdge: l,
    updateEdge: X,
    updateEdgeData: U,
    updateNode: L,
    updateNodeData: te,
    applyEdgeChanges: x,
    applyNodeChanges: z,
    addSelectedElements: m,
    addSelectedNodes: b,
    addSelectedEdges: w,
    setMinZoom: k,
    setMaxZoom: P,
    setTranslateExtent: F,
    setNodeExtent: K,
    setPaneClickDistance: C,
    removeSelectedElements: g,
    removeSelectedNodes: p,
    removeSelectedEdges: v,
    startConnection: H,
    updateConnection: q,
    endConnection: Y,
    setInteractive: N,
    setState: ge,
    getIntersectingNodes: ee,
    getIncomers: a,
    getOutgoers: i,
    getConnectedEdges: s,
    getHandleConnections: u,
    isNodeIntersecting: ae,
    panBy: me,
    fitView: (D) => o.value.fitView(D),
    zoomIn: (D) => o.value.zoomIn(D),
    zoomOut: (D) => o.value.zoomOut(D),
    zoomTo: (D, T) => o.value.zoomTo(D, T),
    setViewport: (D, T) => o.value.setViewport(D, T),
    setTransform: (D, T) => o.value.setTransform(D, T),
    getViewport: () => o.value.getViewport(),
    getTransform: () => o.value.getTransform(),
    setCenter: (D, T, R) => o.value.setCenter(D, T, R),
    fitBounds: (D, T) => o.value.fitBounds(D, T),
    project: (D) => o.value.project(D),
    screenToFlowCoordinate: (D) => o.value.screenToFlowCoordinate(D),
    flowToScreenCoordinate: (D) => o.value.flowToScreenCoordinate(D),
    toObject: () => {
      const D = [], T = [];
      for (const R of e.nodes) {
        const {
          computedPosition: j,
          handleBounds: W,
          selected: ie,
          dimensions: ue,
          isParent: ve,
          resizing: pe,
          dragging: be,
          events: Ee,
          ...Ne
        } = R;
        D.push(Ne);
      }
      for (const R of e.edges) {
        const { selected: j, sourceNode: W, targetNode: ie, events: ue, ...ve } = R;
        T.push(ve);
      }
      return JSON.parse(
        JSON.stringify({
          nodes: D,
          edges: T,
          position: [e.viewport.x, e.viewport.y],
          zoom: e.viewport.zoom,
          viewport: e.viewport
        })
      );
    },
    fromObject: (D) => new Promise((T) => {
      const { nodes: R, edges: j, position: W, zoom: ie, viewport: ue } = D;
      R && M(R), j && B(j);
      const [ve, pe] = ue?.x && ue?.y ? [ue.x, ue.y] : W ?? [null, null];
      if (ve && pe) {
        const be = ue?.zoom || ie || e.viewport.zoom;
        return Ki(() => o.value.viewportInitialized).toBe(!0).then(() => {
          o.value.setViewport({
            x: ve,
            y: pe,
            zoom: be
          }).then(() => {
            T(!0);
          });
        });
      } else
        T(!0);
    }),
    updateNodeInternals: r,
    viewportHelper: o,
    $reset: () => {
      const D = Tc();
      if (e.edges = [], e.nodes = [], e.d3Zoom && e.d3Selection) {
        const T = mn.translate(D.defaultViewport.x ?? 0, D.defaultViewport.y ?? 0).scale(Qt(D.defaultViewport.zoom ?? 1, D.minZoom, D.maxZoom)), R = e.viewportRef.getBoundingClientRect(), j = [
          [0, 0],
          [R.width, R.height]
        ], W = e.d3Zoom.constrain()(T, j, D.translateExtent);
        e.d3Zoom.transform(e.d3Selection, W);
      }
      ge(D);
    },
    $destroy: () => {
    }
  };
}
const Km = ["data-id", "data-handleid", "data-nodeid", "data-handlepos"], jm = {
  name: "Handle",
  compatConfig: { MODE: 3 }
}, pt = /* @__PURE__ */ $e({
  ...jm,
  props: {
    id: { default: null },
    type: {},
    position: { default: () => ce.Top },
    isValidConnection: { type: Function },
    connectable: { type: [Boolean, Number, String, Function], default: void 0 },
    connectableStart: { type: Boolean, default: !0 },
    connectableEnd: { type: Boolean, default: !0 }
  },
  setup(e, { expose: t }) {
    const n = pf(e, ["position", "connectable", "connectableStart", "connectableEnd", "id"]), o = Te(() => n.type ?? "source"), r = Te(() => n.isValidConnection ?? null), {
      id: a,
      connectionStartHandle: i,
      connectionClickStartHandle: s,
      connectionEndHandle: u,
      vueFlowRef: c,
      nodesConnectable: l,
      noDragClassName: d,
      noPanClassName: f
    } = Oe(), { id: h, node: b, nodeEl: w, connectedEdges: m } = Nc(), p = le(), v = Te(() => typeof e.connectableStart < "u" ? e.connectableStart : !0), g = Te(() => typeof e.connectableEnd < "u" ? e.connectableEnd : !0), k = Te(
      () => {
        var B, S, Q, y, O, E;
        return ((B = i.value) == null ? void 0 : B.nodeId) === h && ((S = i.value) == null ? void 0 : S.id) === e.id && ((Q = i.value) == null ? void 0 : Q.type) === o.value || ((y = u.value) == null ? void 0 : y.nodeId) === h && ((O = u.value) == null ? void 0 : O.id) === e.id && ((E = u.value) == null ? void 0 : E.type) === o.value;
      }
    ), P = Te(
      () => {
        var B, S, Q;
        return ((B = s.value) == null ? void 0 : B.nodeId) === h && ((S = s.value) == null ? void 0 : S.id) === e.id && ((Q = s.value) == null ? void 0 : Q.type) === o.value;
      }
    ), { handlePointerDown: F, handleClick: K } = Cc({
      nodeId: h,
      handleId: e.id,
      isValidConnection: r,
      type: o
    }), C = ne(() => typeof e.connectable == "string" && e.connectable === "single" ? !m.value.some((B) => {
      const S = B[`${o.value}Handle`];
      return B[o.value] !== h ? !1 : S ? S === e.id : !0;
    }) : typeof e.connectable == "number" ? m.value.filter((B) => {
      const S = B[`${o.value}Handle`];
      return B[o.value] !== h ? !1 : S ? S === e.id : !0;
    }).length < e.connectable : typeof e.connectable == "function" ? e.connectable(b, m.value) : He(e.connectable) ? e.connectable : l.value);
    it(() => {
      var B;
      if (!b.dimensions.width || !b.dimensions.height)
        return;
      const S = (B = b.handleBounds[o.value]) == null ? void 0 : B.find((z) => z.id === e.id);
      if (!c.value || S)
        return;
      const Q = c.value.querySelector(".vue-flow__transformationpane");
      if (!w.value || !p.value || !Q || !e.id)
        return;
      const y = w.value.getBoundingClientRect(), O = p.value.getBoundingClientRect(), E = window.getComputedStyle(Q), { m22: X } = new window.DOMMatrixReadOnly(E.transform), U = {
        id: e.id,
        position: e.position,
        x: (O.left - y.left) / X,
        y: (O.top - y.top) / X,
        type: o.value,
        nodeId: h,
        ...pr(p.value)
      };
      b.handleBounds[o.value] = [...b.handleBounds[o.value] ?? [], U];
    });
    function N(B) {
      const S = za(B);
      C.value && v.value && (S && B.button === 0 || !S) && F(B);
    }
    function M(B) {
      !h || !s.value && !v.value || C.value && K(B);
    }
    return t({
      handleClick: K,
      handlePointerDown: F,
      onClick: M,
      onPointerDown: N
    }), (B, S) => (A(), G("div", {
      ref_key: "handle",
      ref: p,
      "data-id": `${oe(a)}-${oe(h)}-${e.id}-${o.value}`,
      "data-handleid": e.id,
      "data-nodeid": oe(h),
      "data-handlepos": B.position,
      class: Me(["vue-flow__handle", [
        `vue-flow__handle-${B.position}`,
        `vue-flow__handle-${e.id}`,
        oe(d),
        oe(f),
        o.value,
        {
          connectable: C.value,
          connecting: P.value,
          connectablestart: v.value,
          connectableend: g.value,
          connectionindicator: C.value && (v.value && !k.value || g.value && k.value)
        }
      ]]),
      onMousedown: N,
      onTouchstartPassive: N,
      onClick: M
    }, [
      Le(B.$slots, "default", { id: B.id })
    ], 42, Km));
  }
}), mr = function({
  sourcePosition: e = ce.Bottom,
  targetPosition: t = ce.Top,
  label: n,
  connectable: o = !0,
  isValidTargetPos: r,
  isValidSourcePos: a,
  data: i
}) {
  const s = i.label ?? n;
  return [
    De(pt, { type: "target", position: t, connectable: o, isValidConnection: r }),
    typeof s != "string" && s ? De(s) : De(ye, [s]),
    De(pt, { type: "source", position: e, connectable: o, isValidConnection: a })
  ];
};
mr.props = ["sourcePosition", "targetPosition", "label", "isValidTargetPos", "isValidSourcePos", "connectable", "data"];
mr.inheritAttrs = !1;
mr.compatConfig = { MODE: 3 };
const Zm = mr, yr = function({
  targetPosition: e = ce.Top,
  label: t,
  connectable: n = !0,
  isValidTargetPos: o,
  data: r
}) {
  const a = r.label ?? t;
  return [
    De(pt, { type: "target", position: e, connectable: n, isValidConnection: o }),
    typeof a != "string" && a ? De(a) : De(ye, [a])
  ];
};
yr.props = ["targetPosition", "label", "isValidTargetPos", "connectable", "data"];
yr.inheritAttrs = !1;
yr.compatConfig = { MODE: 3 };
const Jm = yr, br = function({
  sourcePosition: e = ce.Bottom,
  label: t,
  connectable: n = !0,
  isValidSourcePos: o,
  data: r
}) {
  const a = r.label ?? t;
  return [
    typeof a != "string" && a ? De(a) : De(ye, [a]),
    De(pt, { type: "source", position: e, connectable: n, isValidConnection: o })
  ];
};
br.props = ["sourcePosition", "label", "isValidSourcePos", "connectable", "data"];
br.inheritAttrs = !1;
br.compatConfig = { MODE: 3 };
const Qm = br, ey = ["transform"], ty = ["width", "height", "x", "y", "rx", "ry"], ny = ["y"], oy = {
  name: "EdgeText",
  compatConfig: { MODE: 3 }
}, ry = /* @__PURE__ */ $e({
  ...oy,
  props: {
    x: {},
    y: {},
    label: {},
    labelStyle: { default: () => ({}) },
    labelShowBg: { type: Boolean, default: !0 },
    labelBgStyle: { default: () => ({}) },
    labelBgPadding: { default: () => [2, 4] },
    labelBgBorderRadius: { default: 2 }
  },
  setup(e) {
    const t = le({ x: 0, y: 0, width: 0, height: 0 }), n = le(null), o = ne(() => `translate(${e.x - t.value.width / 2} ${e.y - t.value.height / 2})`);
    it(r), xe([() => e.x, () => e.y, n, () => e.label], r);
    function r() {
      if (!n.value)
        return;
      const a = n.value.getBBox();
      (a.width !== t.value.width || a.height !== t.value.height) && (t.value = a);
    }
    return (a, i) => (A(), G("g", {
      transform: o.value,
      class: "vue-flow__edge-textwrapper"
    }, [
      a.labelShowBg ? (A(), G("rect", {
        key: 0,
        class: "vue-flow__edge-textbg",
        width: `${t.value.width + 2 * a.labelBgPadding[0]}px`,
        height: `${t.value.height + 2 * a.labelBgPadding[1]}px`,
        x: -a.labelBgPadding[0],
        y: -a.labelBgPadding[1],
        style: Pe(a.labelBgStyle),
        rx: a.labelBgBorderRadius,
        ry: a.labelBgBorderRadius
      }, null, 12, ty)) : fe("", !0),
      I("text", Yo(a.$attrs, {
        ref_key: "el",
        ref: n,
        class: "vue-flow__edge-text",
        y: t.value.height / 2,
        dy: "0.3em",
        style: a.labelStyle
      }), [
        Le(a.$slots, "default", {}, () => [
          typeof a.label != "string" ? (A(), Ie(Ht(a.label), { key: 0 })) : (A(), G(ye, { key: 1 }, [
            zt(he(a.label), 1)
          ], 64))
        ])
      ], 16, ny)
    ], 8, ey));
  }
}), iy = ["id", "d", "marker-end", "marker-start"], ay = ["d", "stroke-width"], sy = {
  name: "BaseEdge",
  inheritAttrs: !1,
  compatConfig: { MODE: 3 }
}, wr = /* @__PURE__ */ $e({
  ...sy,
  props: {
    id: {},
    labelX: {},
    labelY: {},
    path: {},
    label: {},
    markerStart: {},
    markerEnd: {},
    interactionWidth: { default: 20 },
    labelStyle: {},
    labelShowBg: { type: Boolean },
    labelBgStyle: {},
    labelBgPadding: {},
    labelBgBorderRadius: {}
  },
  setup(e, { expose: t }) {
    const n = le(null), o = le(null), r = le(null), a = Sa();
    return t({
      pathEl: n,
      interactionEl: o,
      labelEl: r
    }), (i, s) => (A(), G(ye, null, [
      I("path", Yo(oe(a), {
        id: i.id,
        ref_key: "pathEl",
        ref: n,
        d: i.path,
        class: "vue-flow__edge-path",
        "marker-end": i.markerEnd,
        "marker-start": i.markerStart
      }), null, 16, iy),
      i.interactionWidth ? (A(), G("path", {
        key: 0,
        ref_key: "interactionEl",
        ref: o,
        fill: "none",
        d: i.path,
        "stroke-width": i.interactionWidth,
        "stroke-opacity": 0,
        class: "vue-flow__edge-interaction"
      }, null, 8, ay)) : fe("", !0),
      i.label && i.labelX && i.labelY ? (A(), Ie(ry, {
        key: 1,
        ref_key: "labelEl",
        ref: r,
        x: i.labelX,
        y: i.labelY,
        label: i.label,
        "label-show-bg": i.labelShowBg,
        "label-bg-style": i.labelBgStyle,
        "label-bg-padding": i.labelBgPadding,
        "label-bg-border-radius": i.labelBgBorderRadius,
        "label-style": i.labelStyle
      }, null, 8, ["x", "y", "label", "label-show-bg", "label-bg-style", "label-bg-padding", "label-bg-border-radius", "label-style"])) : fe("", !0)
    ], 64));
  }
});
function Ic({
  sourceX: e,
  sourceY: t,
  targetX: n,
  targetY: o
}) {
  const r = Math.abs(n - e) / 2, a = n < e ? n + r : n - r, i = Math.abs(o - t) / 2, s = o < t ? o + i : o - i;
  return [a, s, r, i];
}
function Dc({
  sourceX: e,
  sourceY: t,
  targetX: n,
  targetY: o,
  sourceControlX: r,
  sourceControlY: a,
  targetControlX: i,
  targetControlY: s
}) {
  const u = e * 0.125 + r * 0.375 + i * 0.375 + n * 0.125, c = t * 0.125 + a * 0.375 + s * 0.375 + o * 0.125, l = Math.abs(u - e), d = Math.abs(c - t);
  return [u, c, l, d];
}
function Eo(e, t) {
  return e >= 0 ? 0.5 * e : t * 25 * Math.sqrt(-e);
}
function Ks({ pos: e, x1: t, y1: n, x2: o, y2: r, c: a }) {
  let i, s;
  switch (e) {
    case ce.Left:
      i = t - Eo(t - o, a), s = n;
      break;
    case ce.Right:
      i = t + Eo(o - t, a), s = n;
      break;
    case ce.Top:
      i = t, s = n - Eo(n - r, a);
      break;
    case ce.Bottom:
      i = t, s = n + Eo(r - n, a);
      break;
  }
  return [i, s];
}
function Ac(e) {
  const {
    sourceX: t,
    sourceY: n,
    sourcePosition: o = ce.Bottom,
    targetX: r,
    targetY: a,
    targetPosition: i = ce.Top,
    curvature: s = 0.25
  } = e, [u, c] = Ks({
    pos: o,
    x1: t,
    y1: n,
    x2: r,
    y2: a,
    c: s
  }), [l, d] = Ks({
    pos: i,
    x1: r,
    y1: a,
    x2: t,
    y2: n,
    c: s
  }), [f, h, b, w] = Dc({
    sourceX: t,
    sourceY: n,
    targetX: r,
    targetY: a,
    sourceControlX: u,
    sourceControlY: c,
    targetControlX: l,
    targetControlY: d
  });
  return [
    `M${t},${n} C${u},${c} ${l},${d} ${r},${a}`,
    f,
    h,
    b,
    w
  ];
}
function js({ pos: e, x1: t, y1: n, x2: o, y2: r }) {
  let a, i;
  switch (e) {
    case ce.Left:
    case ce.Right:
      a = 0.5 * (t + o), i = n;
      break;
    case ce.Top:
    case ce.Bottom:
      a = t, i = 0.5 * (n + r);
      break;
  }
  return [a, i];
}
function Pc(e) {
  const {
    sourceX: t,
    sourceY: n,
    sourcePosition: o = ce.Bottom,
    targetX: r,
    targetY: a,
    targetPosition: i = ce.Top
  } = e, [s, u] = js({
    pos: o,
    x1: t,
    y1: n,
    x2: r,
    y2: a
  }), [c, l] = js({
    pos: i,
    x1: r,
    y1: a,
    x2: t,
    y2: n
  }), [d, f, h, b] = Dc({
    sourceX: t,
    sourceY: n,
    targetX: r,
    targetY: a,
    sourceControlX: s,
    sourceControlY: u,
    targetControlX: c,
    targetControlY: l
  });
  return [
    `M${t},${n} C${s},${u} ${c},${l} ${r},${a}`,
    d,
    f,
    h,
    b
  ];
}
const Zs = {
  [ce.Left]: { x: -1, y: 0 },
  [ce.Right]: { x: 1, y: 0 },
  [ce.Top]: { x: 0, y: -1 },
  [ce.Bottom]: { x: 0, y: 1 }
};
function ly({
  source: e,
  sourcePosition: t = ce.Bottom,
  target: n
}) {
  return t === ce.Left || t === ce.Right ? e.x < n.x ? { x: 1, y: 0 } : { x: -1, y: 0 } : e.y < n.y ? { x: 0, y: 1 } : { x: 0, y: -1 };
}
function Js(e, t) {
  return Math.sqrt((t.x - e.x) ** 2 + (t.y - e.y) ** 2);
}
function uy({
  source: e,
  sourcePosition: t = ce.Bottom,
  target: n,
  targetPosition: o = ce.Top,
  center: r,
  offset: a
}) {
  const i = Zs[t], s = Zs[o], u = { x: e.x + i.x * a, y: e.y + i.y * a }, c = { x: n.x + s.x * a, y: n.y + s.y * a }, l = ly({
    source: u,
    sourcePosition: t,
    target: c
  }), d = l.x !== 0 ? "x" : "y", f = l[d];
  let h, b, w;
  const m = { x: 0, y: 0 }, p = { x: 0, y: 0 }, [v, g, k, P] = Ic({
    sourceX: e.x,
    sourceY: e.y,
    targetX: n.x,
    targetY: n.y
  });
  if (i[d] * s[d] === -1) {
    b = r.x ?? v, w = r.y ?? g;
    const K = [
      { x: b, y: u.y },
      { x: b, y: c.y }
    ], C = [
      { x: u.x, y: w },
      { x: c.x, y: w }
    ];
    i[d] === f ? h = d === "x" ? K : C : h = d === "x" ? C : K;
  } else {
    const K = [{ x: u.x, y: c.y }], C = [{ x: c.x, y: u.y }];
    if (d === "x" ? h = i.x === f ? C : K : h = i.y === f ? K : C, t === o) {
      const Q = Math.abs(e[d] - n[d]);
      if (Q <= a) {
        const y = Math.min(a - 1, a - Q);
        i[d] === f ? m[d] = (u[d] > e[d] ? -1 : 1) * y : p[d] = (c[d] > n[d] ? -1 : 1) * y;
      }
    }
    if (t !== o) {
      const Q = d === "x" ? "y" : "x", y = i[d] === s[Q], O = u[Q] > c[Q], E = u[Q] < c[Q];
      (i[d] === 1 && (!y && O || y && E) || i[d] !== 1 && (!y && E || y && O)) && (h = d === "x" ? K : C);
    }
    const N = { x: u.x + m.x, y: u.y + m.y }, M = { x: c.x + p.x, y: c.y + p.y }, B = Math.max(Math.abs(N.x - h[0].x), Math.abs(M.x - h[0].x)), S = Math.max(Math.abs(N.y - h[0].y), Math.abs(M.y - h[0].y));
    B >= S ? (b = (N.x + M.x) / 2, w = h[0].y) : (b = h[0].x, w = (N.y + M.y) / 2);
  }
  return [[
    e,
    { x: u.x + m.x, y: u.y + m.y },
    ...h,
    { x: c.x + p.x, y: c.y + p.y },
    n
  ], b, w, k, P];
}
function cy(e, t, n, o) {
  const r = Math.min(Js(e, t) / 2, Js(t, n) / 2, o), { x: a, y: i } = t;
  if (e.x === a && a === n.x || e.y === i && i === n.y)
    return `L${a} ${i}`;
  if (e.y === i) {
    const c = e.x < n.x ? -1 : 1, l = e.y < n.y ? 1 : -1;
    return `L ${a + r * c},${i}Q ${a},${i} ${a},${i + r * l}`;
  }
  const s = e.x < n.x ? 1 : -1, u = e.y < n.y ? -1 : 1;
  return `L ${a},${i + r * u}Q ${a},${i} ${a + r * s},${i}`;
}
function la(e) {
  const {
    sourceX: t,
    sourceY: n,
    sourcePosition: o = ce.Bottom,
    targetX: r,
    targetY: a,
    targetPosition: i = ce.Top,
    borderRadius: s = 5,
    centerX: u,
    centerY: c,
    offset: l = 20
  } = e, [d, f, h, b, w] = uy({
    source: { x: t, y: n },
    sourcePosition: o,
    target: { x: r, y: a },
    targetPosition: i,
    center: { x: u, y: c },
    offset: l
  });
  return [d.reduce((p, v, g) => {
    let k;
    return g > 0 && g < d.length - 1 ? k = cy(d[g - 1], v, d[g + 1], s) : k = `${g === 0 ? "M" : "L"}${v.x} ${v.y}`, p += k, p;
  }, ""), f, h, b, w];
}
function dy(e) {
  const { sourceX: t, sourceY: n, targetX: o, targetY: r } = e, [a, i, s, u] = Ic({
    sourceX: t,
    sourceY: n,
    targetX: o,
    targetY: r
  });
  return [`M ${t},${n}L ${o},${r}`, a, i, s, u];
}
const fy = $e({
  name: "StraightEdge",
  props: [
    "label",
    "labelStyle",
    "labelShowBg",
    "labelBgStyle",
    "labelBgPadding",
    "labelBgBorderRadius",
    "sourceY",
    "sourceX",
    "targetX",
    "targetY",
    "markerEnd",
    "markerStart",
    "interactionWidth"
  ],
  compatConfig: { MODE: 3 },
  setup(e, { attrs: t }) {
    return () => {
      const [n, o, r] = dy(e);
      return De(wr, {
        path: n,
        labelX: o,
        labelY: r,
        ...t,
        ...e
      });
    };
  }
}), hy = fy, py = $e({
  name: "SmoothStepEdge",
  props: [
    "sourcePosition",
    "targetPosition",
    "label",
    "labelStyle",
    "labelShowBg",
    "labelBgStyle",
    "labelBgPadding",
    "labelBgBorderRadius",
    "sourceY",
    "sourceX",
    "targetX",
    "targetY",
    "borderRadius",
    "markerEnd",
    "markerStart",
    "interactionWidth",
    "offset"
  ],
  compatConfig: { MODE: 3 },
  setup(e, { attrs: t }) {
    return () => {
      const [n, o, r] = la({
        ...e,
        sourcePosition: e.sourcePosition ?? ce.Bottom,
        targetPosition: e.targetPosition ?? ce.Top
      });
      return De(wr, {
        path: n,
        labelX: o,
        labelY: r,
        ...t,
        ...e
      });
    };
  }
}), Oc = py, gy = $e({
  name: "StepEdge",
  props: [
    "sourcePosition",
    "targetPosition",
    "label",
    "labelStyle",
    "labelShowBg",
    "labelBgStyle",
    "labelBgPadding",
    "labelBgBorderRadius",
    "sourceY",
    "sourceX",
    "targetX",
    "targetY",
    "markerEnd",
    "markerStart",
    "interactionWidth"
  ],
  setup(e, { attrs: t }) {
    return () => De(Oc, { ...e, ...t, borderRadius: 0 });
  }
}), vy = gy, my = $e({
  name: "BezierEdge",
  props: [
    "sourcePosition",
    "targetPosition",
    "label",
    "labelStyle",
    "labelShowBg",
    "labelBgStyle",
    "labelBgPadding",
    "labelBgBorderRadius",
    "sourceY",
    "sourceX",
    "targetX",
    "targetY",
    "curvature",
    "markerEnd",
    "markerStart",
    "interactionWidth"
  ],
  compatConfig: { MODE: 3 },
  setup(e, { attrs: t }) {
    return () => {
      const [n, o, r] = Ac({
        ...e,
        sourcePosition: e.sourcePosition ?? ce.Bottom,
        targetPosition: e.targetPosition ?? ce.Top
      });
      return De(wr, {
        path: n,
        labelX: o,
        labelY: r,
        ...t,
        ...e
      });
    };
  }
}), yy = my, by = $e({
  name: "SimpleBezierEdge",
  props: [
    "sourcePosition",
    "targetPosition",
    "label",
    "labelStyle",
    "labelShowBg",
    "labelBgStyle",
    "labelBgPadding",
    "labelBgBorderRadius",
    "sourceY",
    "sourceX",
    "targetX",
    "targetY",
    "markerEnd",
    "markerStart",
    "interactionWidth"
  ],
  compatConfig: { MODE: 3 },
  setup(e, { attrs: t }) {
    return () => {
      const [n, o, r] = Pc({
        ...e,
        sourcePosition: e.sourcePosition ?? ce.Bottom,
        targetPosition: e.targetPosition ?? ce.Top
      });
      return De(wr, {
        path: n,
        labelX: o,
        labelY: r,
        ...t,
        ...e
      });
    };
  }
}), wy = by, ky = {
  input: Qm,
  default: Zm,
  output: Jm
}, _y = {
  default: yy,
  straight: hy,
  step: vy,
  smoothstep: Oc,
  simplebezier: wy
};
function xy(e, t, n) {
  const o = ne(() => (w) => t.value.get(w)), r = ne(() => (w) => n.value.get(w)), a = ne(() => {
    const w = {
      ..._y,
      ...e.edgeTypes
    }, m = Object.keys(w);
    for (const p of e.edges)
      p.type && !m.includes(p.type) && (w[p.type] = p.type);
    return w;
  }), i = ne(() => {
    const w = {
      ...ky,
      ...e.nodeTypes
    }, m = Object.keys(w);
    for (const p of e.nodes)
      p.type && !m.includes(p.type) && (w[p.type] = p.type);
    return w;
  }), s = ne(() => e.onlyRenderVisibleElements ? mc(
    e.nodes,
    {
      x: 0,
      y: 0,
      width: e.dimensions.width,
      height: e.dimensions.height
    },
    e.viewport,
    !0
  ) : e.nodes), u = ne(() => {
    if (e.onlyRenderVisibleElements) {
      const w = [];
      for (const m of e.edges) {
        const p = t.value.get(m.source), v = t.value.get(m.target);
        bm({
          sourcePos: p.computedPosition || { x: 0, y: 0 },
          targetPos: v.computedPosition || { x: 0, y: 0 },
          sourceWidth: p.dimensions.width,
          sourceHeight: p.dimensions.height,
          targetWidth: v.dimensions.width,
          targetHeight: v.dimensions.height,
          width: e.dimensions.width,
          height: e.dimensions.height,
          viewport: e.viewport
        }) && w.push(m);
      }
      return w;
    }
    return e.edges;
  }), c = ne(() => [...s.value, ...u.value]), l = ne(() => {
    const w = [];
    for (const m of e.nodes)
      m.selected && w.push(m);
    return w;
  }), d = ne(() => {
    const w = [];
    for (const m of e.edges)
      m.selected && w.push(m);
    return w;
  }), f = ne(() => [
    ...l.value,
    ...d.value
  ]), h = ne(() => {
    const w = [];
    for (const m of e.nodes)
      m.dimensions.width && m.dimensions.height && m.handleBounds !== void 0 && w.push(m);
    return w;
  }), b = ne(
    () => s.value.length > 0 && h.value.length === s.value.length
  );
  return {
    getNode: o,
    getEdge: r,
    getElements: c,
    getEdgeTypes: a,
    getNodeTypes: i,
    getEdges: u,
    getNodes: s,
    getSelectedElements: f,
    getSelectedNodes: l,
    getSelectedEdges: d,
    getNodesInitialized: h,
    areNodesInitialized: b
  };
}
class Yt {
  constructor() {
    this.currentId = 0, this.flows = /* @__PURE__ */ new Map();
  }
  static getInstance() {
    var t;
    const n = (t = kn()) == null ? void 0 : t.appContext.app, o = n?.config.globalProperties.$vueFlowStorage ?? Yt.instance;
    return Yt.instance = o ?? new Yt(), n && (n.config.globalProperties.$vueFlowStorage = Yt.instance), Yt.instance;
  }
  set(t, n) {
    return this.flows.set(t, n);
  }
  get(t) {
    return this.flows.get(t);
  }
  remove(t) {
    return this.flows.delete(t);
  }
  create(t, n) {
    const o = Tc(), r = vf(o), a = {};
    for (const [f, h] of Object.entries(r.hooks)) {
      const b = `on${f.charAt(0).toUpperCase() + f.slice(1)}`;
      a[b] = h.on;
    }
    const i = {};
    for (const [f, h] of Object.entries(r.hooks))
      i[f] = h.trigger;
    const s = ne(() => {
      const f = /* @__PURE__ */ new Map();
      for (const h of r.nodes)
        f.set(h.id, h);
      return f;
    }), u = ne(() => {
      const f = /* @__PURE__ */ new Map();
      for (const h of r.edges)
        f.set(h.id, h);
      return f;
    }), c = xy(r, s, u), l = Wm(r, s, u);
    l.setState({ ...r, ...n });
    const d = {
      ...a,
      ...c,
      ...l,
      ...gh(r),
      nodeLookup: s,
      edgeLookup: u,
      emits: i,
      id: t,
      vueFlowVersion: "1.48.2",
      $destroy: () => {
        this.remove(t);
      }
    };
    return this.set(t, d), d;
  }
  getId() {
    return `vue-flow-${this.currentId++}`;
  }
}
function Oe(e) {
  const t = Yt.getInstance(), n = ku(), o = typeof e == "object", r = o ? e : { id: e }, a = r.id, i = a ?? n?.vueFlowId;
  let s;
  if (n) {
    const u = ot(Ws, null);
    typeof u < "u" && u !== null && (!i || u.id === i) && (s = u);
  }
  if (s || i && (s = t.get(i)), !s || i && s.id !== i) {
    const u = a ?? t.getId(), c = t.create(u, r);
    s = c, (n ?? Ea(!0)).run(() => {
      xe(
        c.applyDefault,
        (d, f, h) => {
          const b = (m) => {
            c.applyNodeChanges(m);
          }, w = (m) => {
            c.applyEdgeChanges(m);
          };
          d ? (c.onNodesChange(b), c.onEdgesChange(w)) : (c.hooks.value.nodesChange.off(b), c.hooks.value.edgesChange.off(w)), h(() => {
            c.hooks.value.nodesChange.off(b), c.hooks.value.edgesChange.off(w);
          });
        },
        { immediate: !0 }
      ), Gn(() => {
        if (s) {
          const d = t.get(s.id);
          d ? d.$destroy() : ao(`No store instance found for id ${s.id} in storage.`);
        }
      });
    });
  } else
    o && s.setState(r);
  if (n && (Ct(Ws, s), n.vueFlowId = s.id), o) {
    const u = kn();
    u?.type.name !== "VueFlow" && s.emits.error(new Ye(Fe.USEVUEFLOW_OPTIONS));
  }
  return s;
}
function Ey(e) {
  const { emits: t, dimensions: n } = Oe();
  let o;
  it(() => {
    const r = () => {
      var a, i;
      if (!e.value || !(((i = (a = e.value).checkVisibility) == null ? void 0 : i.call(a)) ?? !0))
        return;
      const s = pr(e.value);
      (s.width === 0 || s.height === 0) && t.error(new Ye(Fe.MISSING_VIEWPORT_DIMENSIONS)), n.value = { width: s.width || 500, height: s.height || 500 };
    };
    r(), window.addEventListener("resize", r), e.value && (o = new ResizeObserver(() => r()), o.observe(e.value)), oo(() => {
      window.removeEventListener("resize", r), o && e.value && o.unobserve(e.value);
    });
  });
}
const $y = {
  name: "UserSelection",
  compatConfig: { MODE: 3 }
}, Sy = /* @__PURE__ */ $e({
  ...$y,
  props: {
    userSelectionRect: {}
  },
  setup(e) {
    return (t, n) => (A(), G("div", {
      class: "vue-flow__selection vue-flow__container",
      style: Pe({
        width: `${t.userSelectionRect.width}px`,
        height: `${t.userSelectionRect.height}px`,
        transform: `translate(${t.userSelectionRect.x}px, ${t.userSelectionRect.y}px)`
      })
    }, null, 4));
  }
}), Cy = ["tabIndex"], Ny = {
  name: "NodesSelection",
  compatConfig: { MODE: 3 }
}, My = /* @__PURE__ */ $e({
  ...Ny,
  setup(e) {
    const { emits: t, viewport: n, getSelectedNodes: o, noPanClassName: r, disableKeyboardA11y: a, userSelectionActive: i } = Oe(), s = Mc(), u = le(null), c = Sc({
      el: u,
      onStart(b) {
        t.selectionDragStart(b), t.nodeDragStart(b);
      },
      onDrag(b) {
        t.selectionDrag(b), t.nodeDrag(b);
      },
      onStop(b) {
        t.selectionDragStop(b), t.nodeDragStop(b);
      }
    });
    it(() => {
      var b;
      a.value || (b = u.value) == null || b.focus({ preventScroll: !0 });
    });
    const l = ne(() => Oa(o.value)), d = ne(() => ({
      width: `${l.value.width}px`,
      height: `${l.value.height}px`,
      top: `${l.value.y}px`,
      left: `${l.value.x}px`
    }));
    function f(b) {
      t.selectionContextMenu({ event: b, nodes: o.value });
    }
    function h(b) {
      a.value || hn[b.key] && (b.preventDefault(), s(
        {
          x: hn[b.key].x,
          y: hn[b.key].y
        },
        b.shiftKey
      ));
    }
    return (b, w) => !oe(i) && l.value.width && l.value.height ? (A(), G("div", {
      key: 0,
      class: Me(["vue-flow__nodesselection vue-flow__container", oe(r)]),
      style: Pe({ transform: `translate(${oe(n).x}px,${oe(n).y}px) scale(${oe(n).zoom})` })
    }, [
      I("div", {
        ref_key: "el",
        ref: u,
        class: Me([{ dragging: oe(c) }, "vue-flow__nodesselection-rect"]),
        style: Pe(d.value),
        tabIndex: oe(a) ? void 0 : -1,
        onContextmenu: f,
        onKeydown: h
      }, null, 46, Cy)
    ], 6)) : fe("", !0);
  }
});
function Ty(e, t) {
  return {
    x: e.clientX - t.left,
    y: e.clientY - t.top
  };
}
const Iy = {
  name: "Pane",
  compatConfig: { MODE: 3 }
}, Dy = /* @__PURE__ */ $e({
  ...Iy,
  props: {
    isSelecting: { type: Boolean },
    selectionKeyPressed: { type: Boolean }
  },
  setup(e) {
    const {
      vueFlowRef: t,
      nodes: n,
      viewport: o,
      emits: r,
      userSelectionActive: a,
      removeSelectedElements: i,
      userSelectionRect: s,
      elementsSelectable: u,
      nodesSelectionActive: c,
      getSelectedEdges: l,
      getSelectedNodes: d,
      removeNodes: f,
      removeEdges: h,
      selectionMode: b,
      deleteKeyCode: w,
      multiSelectionKeyCode: m,
      multiSelectionActive: p,
      edgeLookup: v,
      nodeLookup: g,
      connectionLookup: k,
      defaultEdgeOptions: P,
      connectionStartHandle: F,
      panOnDrag: K
    } = Oe(), C = xt(null), N = xt(/* @__PURE__ */ new Set()), M = xt(/* @__PURE__ */ new Set()), B = xt(null), S = Te(() => u.value && (e.isSelecting || a.value)), Q = Te(() => F.value !== null);
    let y = !1, O = !1;
    const E = Vn(w, { actInsideInputWithModifier: !1 }), X = Vn(m);
    xe(E, (Y) => {
      Y && (f(d.value), h(l.value), c.value = !1);
    }), xe(X, (Y) => {
      p.value = Y;
    });
    function U(Y, Z) {
      return (ee) => {
        ee.target === Z && Y?.(ee);
      };
    }
    function z(Y) {
      if (y || Q.value) {
        y = !1;
        return;
      }
      r.paneClick(Y), i(), c.value = !1;
    }
    function x(Y) {
      var Z;
      if (Array.isArray(K.value) && ((Z = K.value) != null && Z.includes(2))) {
        Y.preventDefault();
        return;
      }
      r.paneContextMenu(Y);
    }
    function L(Y) {
      r.paneScroll(Y);
    }
    function te(Y) {
      var Z, ee, ae;
      if (B.value = ((Z = t.value) == null ? void 0 : Z.getBoundingClientRect()) ?? null, !u.value || !e.isSelecting || Y.button !== 0 || Y.target !== C.value || !B.value)
        return;
      (ae = (ee = Y.target) == null ? void 0 : ee.setPointerCapture) == null || ae.call(ee, Y.pointerId);
      const { x: me, y: ge } = Ty(Y, B.value);
      O = !0, y = !1, i(), s.value = {
        width: 0,
        height: 0,
        startX: me,
        startY: ge,
        x: me,
        y: ge
      }, r.selectionStart(Y);
    }
    function H(Y) {
      var Z;
      if (!B.value || !s.value)
        return;
      y = !0;
      const { x: ee, y: ae } = ht(Y, B.value), { startX: me = 0, startY: ge = 0 } = s.value, ke = {
        startX: me,
        startY: ge,
        x: ee < me ? ee : me,
        y: ae < ge ? ae : ge,
        width: Math.abs(ee - me),
        height: Math.abs(ae - ge)
      }, re = N.value, se = M.value;
      N.value = new Set(
        mc(n.value, ke, o.value, b.value === Pa.Partial, !0).map(
          (T) => T.id
        )
      ), M.value = /* @__PURE__ */ new Set();
      const D = ((Z = P.value) == null ? void 0 : Z.selectable) ?? !0;
      for (const T of N.value) {
        const R = k.value.get(T);
        if (R)
          for (const { edgeId: j } of R.values()) {
            const W = v.value.get(j);
            W && (W.selectable ?? D) && M.value.add(j);
          }
      }
      if (!Xs(re, N.value)) {
        const T = At(g.value, N.value, !0);
        r.nodesChange(T);
      }
      if (!Xs(se, M.value)) {
        const T = At(v.value, M.value);
        r.edgesChange(T);
      }
      s.value = ke, a.value = !0, c.value = !1;
    }
    function q(Y) {
      var Z;
      Y.button !== 0 || !O || ((Z = Y.target) == null || Z.releasePointerCapture(Y.pointerId), !a.value && s.value && Y.target === C.value && z(Y), a.value = !1, s.value = null, c.value = N.value.size > 0, r.selectionEnd(Y), e.selectionKeyPressed && (y = !1), O = !1);
    }
    return (Y, Z) => (A(), G("div", {
      ref_key: "container",
      ref: C,
      class: Me(["vue-flow__pane vue-flow__container", { selection: Y.isSelecting }]),
      onClick: Z[0] || (Z[0] = (ee) => S.value ? void 0 : U(z, C.value)(ee)),
      onContextmenu: Z[1] || (Z[1] = (ee) => U(x, C.value)(ee)),
      onWheelPassive: Z[2] || (Z[2] = (ee) => U(L, C.value)(ee)),
      onPointerenter: Z[3] || (Z[3] = (ee) => S.value ? void 0 : oe(r).paneMouseEnter(ee)),
      onPointerdown: Z[4] || (Z[4] = (ee) => S.value ? te(ee) : oe(r).paneMouseMove(ee)),
      onPointermove: Z[5] || (Z[5] = (ee) => S.value ? H(ee) : oe(r).paneMouseMove(ee)),
      onPointerup: Z[6] || (Z[6] = (ee) => S.value ? q(ee) : void 0),
      onPointerleave: Z[7] || (Z[7] = (ee) => oe(r).paneMouseLeave(ee))
    }, [
      Le(Y.$slots, "default"),
      oe(a) && oe(s) ? (A(), Ie(Sy, {
        key: 0,
        "user-selection-rect": oe(s)
      }, null, 8, ["user-selection-rect"])) : fe("", !0),
      oe(c) && oe(d).length ? (A(), Ie(My, { key: 1 })) : fe("", !0)
    ], 34));
  }
}), Ay = {
  name: "Transform",
  compatConfig: { MODE: 3 }
}, Py = /* @__PURE__ */ $e({
  ...Ay,
  setup(e) {
    const { viewport: t, fitViewOnInit: n, fitViewOnInitDone: o } = Oe(), r = ne(() => n.value ? !o.value : !1), a = ne(() => `translate(${t.value.x}px,${t.value.y}px) scale(${t.value.zoom})`);
    return (i, s) => (A(), G("div", {
      class: "vue-flow__transformationpane vue-flow__container",
      style: Pe({ transform: a.value, opacity: r.value ? 0 : void 0 })
    }, [
      Le(i.$slots, "default")
    ], 4));
  }
}), Oy = {
  name: "Viewport",
  compatConfig: { MODE: 3 }
}, Ry = /* @__PURE__ */ $e({
  ...Oy,
  setup(e) {
    const {
      minZoom: t,
      maxZoom: n,
      defaultViewport: o,
      translateExtent: r,
      zoomActivationKeyCode: a,
      selectionKeyCode: i,
      panActivationKeyCode: s,
      panOnScroll: u,
      panOnScrollMode: c,
      panOnScrollSpeed: l,
      panOnDrag: d,
      zoomOnDoubleClick: f,
      zoomOnPinch: h,
      zoomOnScroll: b,
      preventScrolling: w,
      noWheelClassName: m,
      noPanClassName: p,
      emits: v,
      connectionStartHandle: g,
      userSelectionActive: k,
      paneDragging: P,
      d3Zoom: F,
      d3Selection: K,
      d3ZoomHandler: C,
      viewport: N,
      viewportRef: M,
      paneClickDistance: B
    } = Oe();
    Ey(M);
    const S = xt(!1), Q = xt(!1);
    let y = null, O = !1, E = 0, X = {
      x: 0,
      y: 0,
      zoom: 0
    };
    const U = Vn(s), z = Vn(i), x = Vn(a), L = Te(
      () => (!z.value || z.value && i.value === !0) && (U.value || d.value)
    ), te = Te(() => U.value || u.value), H = Te(() => i.value === !0 && L.value !== !0), q = Te(
      () => z.value && i.value !== !0 || k.value || H.value
    ), Y = Te(() => g.value !== null);
    it(() => {
      if (!M.value) {
        ao("Viewport element is missing");
        return;
      }
      const ge = M.value, ke = ge.getBoundingClientRect(), re = Qv().clickDistance(B.value).scaleExtent([t.value, n.value]).translateExtent(r.value), se = et(ge).call(re), D = se.on("wheel.zoom"), T = mn.translate(o.value.x ?? 0, o.value.y ?? 0).scale(Qt(o.value.zoom ?? 1, t.value, n.value)), R = [
        [0, 0],
        [ke.width, ke.height]
      ], j = re.constrain()(T, R, r.value);
      re.transform(se, j), re.wheelDelta(ia), F.value = re, K.value = se, C.value = D, N.value = { x: j.x, y: j.y, zoom: j.k }, re.on("start", (W) => {
        var ie;
        if (!W.sourceEvent)
          return null;
        E = W.sourceEvent.button, S.value = !0;
        const ue = ae(W.transform);
        ((ie = W.sourceEvent) == null ? void 0 : ie.type) === "mousedown" && (P.value = !0), X = ue, v.viewportChangeStart(ue), v.moveStart({ event: W, flowTransform: ue });
      }), re.on("end", (W) => {
        if (!W.sourceEvent)
          return null;
        if (S.value = !1, P.value = !1, Z(L.value, E ?? 0) && !O && v.paneContextMenu(W.sourceEvent), O = !1, ee(X, W.transform)) {
          const ie = ae(W.transform);
          X = ie, v.viewportChangeEnd(ie), v.moveEnd({ event: W, flowTransform: ie });
        }
      }), re.filter((W) => {
        var ie;
        const ue = x.value || b.value, ve = h.value && W.ctrlKey, pe = W.button, be = W.type === "wheel";
        if (pe === 1 && W.type === "mousedown" && (me(W, "vue-flow__node") || me(W, "vue-flow__edge")))
          return !0;
        if (!L.value && !ue && !te.value && !f.value && !h.value || k.value || Y.value && !be || !f.value && W.type === "dblclick" || me(W, m.value) && be || me(W, p.value) && (!be || te.value && be && !x.value) || !h.value && W.ctrlKey && be || !ue && !te.value && !ve && be)
          return !1;
        if (!h && W.type === "touchstart" && ((ie = W.touches) == null ? void 0 : ie.length) > 1)
          return W.preventDefault(), !1;
        if (!L.value && (W.type === "mousedown" || W.type === "touchstart") || H.value && Array.isArray(d.value) && d.value.includes(0) && pe === 0 || Array.isArray(d.value) && !d.value.includes(pe) && (W.type === "mousedown" || W.type === "touchstart"))
          return !1;
        const Ee = Array.isArray(d.value) && d.value.includes(pe) || i.value === !0 && Array.isArray(d.value) && !d.value.includes(0) || !pe || pe <= 1;
        return (!W.ctrlKey || U.value || be) && Ee;
      }), xe(
        [k, L],
        () => {
          k.value && !S.value ? re.on("zoom", null) : k.value || re.on("zoom", (W) => {
            N.value = { x: W.transform.x, y: W.transform.y, zoom: W.transform.k };
            const ie = ae(W.transform);
            O = Z(L.value, E ?? 0), v.viewportChange(ie), v.move({ event: W, flowTransform: ie });
          });
        },
        { immediate: !0 }
      ), xe(
        [k, te, c, x, h, w, m],
        () => {
          te.value && !x.value && !k.value ? se.on(
            "wheel.zoom",
            (W) => {
              if (me(W, m.value))
                return !1;
              const ie = x.value || b.value, ue = h.value && W.ctrlKey;
              if (!(!w.value || te.value || ie || ue))
                return !1;
              W.preventDefault(), W.stopImmediatePropagation();
              const pe = se.property("__zoom").k || 1, be = Jn();
              if (!U.value && W.ctrlKey && h.value && be) {
                const _n = ct(W), Er = ia(W), tn = pe * 2 ** Er;
                re.scaleTo(se, tn, _n, W);
                return;
              }
              const Ee = W.deltaMode === 1 ? 20 : 1;
              let Ne = c.value === Ln.Vertical ? 0 : W.deltaX * Ee, lt = c.value === Ln.Horizontal ? 0 : W.deltaY * Ee;
              !be && W.shiftKey && c.value !== Ln.Vertical && !Ne && lt && (Ne = lt, lt = 0), re.translateBy(
                se,
                -(Ne / pe) * l.value,
                -(lt / pe) * l.value
              );
              const Ue = ae(se.property("__zoom"));
              y && clearTimeout(y), Q.value ? (v.move({ event: W, flowTransform: Ue }), v.viewportChange(Ue), y = setTimeout(() => {
                v.moveEnd({ event: W, flowTransform: Ue }), v.viewportChangeEnd(Ue), Q.value = !1;
              }, 150)) : (Q.value = !0, v.moveStart({ event: W, flowTransform: Ue }), v.viewportChangeStart(Ue));
            },
            { passive: !1 }
          ) : typeof D < "u" && se.on(
            "wheel.zoom",
            function(W, ie) {
              const ue = !w.value && W.type === "wheel" && !W.ctrlKey, ve = x.value || b.value, pe = h.value && W.ctrlKey;
              if (!ve && !u.value && !pe && W.type === "wheel" || ue || me(W, m.value))
                return null;
              W.preventDefault(), D.call(this, W, ie);
            },
            { passive: !1 }
          );
        },
        { immediate: !0 }
      );
    });
    function Z(ge, ke) {
      return ke === 2 && Array.isArray(ge) && ge.includes(2);
    }
    function ee(ge, ke) {
      return ge.x !== ke.x && !Number.isNaN(ke.x) || ge.y !== ke.y && !Number.isNaN(ke.y) || ge.zoom !== ke.k && !Number.isNaN(ke.k);
    }
    function ae(ge) {
      return {
        x: ge.x,
        y: ge.y,
        zoom: ge.k
      };
    }
    function me(ge, ke) {
      return ge.target.closest(`.${ke}`);
    }
    return (ge, ke) => (A(), G("div", {
      ref_key: "viewportRef",
      ref: M,
      class: "vue-flow__viewport vue-flow__container"
    }, [
      ze(Dy, {
        "is-selecting": q.value,
        "selection-key-pressed": oe(z),
        class: Me({
          connecting: Y.value,
          dragging: oe(P),
          draggable: oe(d) === !0 || Array.isArray(oe(d)) && oe(d).includes(0)
        })
      }, {
        default: ft(() => [
          ze(Py, null, {
            default: ft(() => [
              Le(ge.$slots, "default")
            ]),
            _: 3
          })
        ]),
        _: 3
      }, 8, ["is-selecting", "selection-key-pressed", "class"])
    ], 512));
  }
}), zy = ["id"], By = ["id"], Ly = ["id"], Vy = {
  name: "A11yDescriptions",
  compatConfig: { MODE: 3 }
}, Hy = /* @__PURE__ */ $e({
  ...Vy,
  setup(e) {
    const { id: t, disableKeyboardA11y: n, ariaLiveMessage: o } = Oe();
    return (r, a) => (A(), G(ye, null, [
      I("div", {
        id: `${oe(lc)}-${oe(t)}`,
        style: { display: "none" }
      }, " Press enter or space to select a node. " + he(oe(n) ? "" : "You can then use the arrow keys to move the node around.") + " You can then use the arrow keys to move the node around, press delete to remove it and press escape to cancel. ", 9, zy),
      I("div", {
        id: `${oe(uc)}-${oe(t)}`,
        style: { display: "none" }
      }, " Press enter or space to select an edge. You can then press delete to remove it or press escape to cancel. ", 8, By),
      oe(n) ? fe("", !0) : (A(), G("div", {
        key: 0,
        id: `${oe(im)}-${oe(t)}`,
        "aria-live": "assertive",
        "aria-atomic": "true",
        style: { position: "absolute", width: "1px", height: "1px", margin: "-1px", border: "0", padding: "0", overflow: "hidden", clip: "rect(0px, 0px, 0px, 0px)", "clip-path": "inset(100%)" }
      }, he(oe(o)), 9, Ly))
    ], 64));
  }
});
function Fy() {
  const e = Oe();
  xe(
    () => e.viewportHelper.value.viewportInitialized,
    (t) => {
      t && setTimeout(() => {
        e.emits.init(e), e.emits.paneReady(e);
      }, 1);
    }
  );
}
function Gy(e, t, n) {
  return n === ce.Left ? e - t : n === ce.Right ? e + t : e;
}
function Yy(e, t, n) {
  return n === ce.Top ? e - t : n === ce.Bottom ? e + t : e;
}
const Ba = function({
  radius: e = 10,
  centerX: t = 0,
  centerY: n = 0,
  position: o = ce.Top,
  type: r
}) {
  return De("circle", {
    class: `vue-flow__edgeupdater vue-flow__edgeupdater-${r}`,
    cx: Gy(t, e, o),
    cy: Yy(n, e, o),
    r: e,
    stroke: "transparent",
    fill: "transparent"
  });
};
Ba.props = ["radius", "centerX", "centerY", "position", "type"];
Ba.compatConfig = { MODE: 3 };
const Qs = Ba, Uy = $e({
  name: "Edge",
  compatConfig: { MODE: 3 },
  props: ["id"],
  setup(e) {
    const {
      id: t,
      addSelectedEdges: n,
      connectionMode: o,
      edgeUpdaterRadius: r,
      emits: a,
      nodesSelectionActive: i,
      noPanClassName: s,
      getEdgeTypes: u,
      removeSelectedEdges: c,
      findEdge: l,
      findNode: d,
      isValidConnection: f,
      multiSelectionActive: h,
      disableKeyboardA11y: b,
      elementsSelectable: w,
      edgesUpdatable: m,
      edgesFocusable: p,
      hooks: v
    } = Oe(), g = ne(() => l(e.id)), { emit: k, on: P } = Om(g.value, a), F = ot(vr), K = kn(), C = le(!1), N = le(!1), M = le(""), B = le(null), S = le("source"), Q = le(null), y = Te(
      () => typeof g.value.selectable > "u" ? w.value : g.value.selectable
    ), O = Te(() => typeof g.value.updatable > "u" ? m.value : g.value.updatable), E = Te(() => typeof g.value.focusable > "u" ? p.value : g.value.focusable);
    Ct(Dm, e.id), Ct(Am, Q);
    const X = ne(() => g.value.class instanceof Function ? g.value.class(g.value) : g.value.class), U = ne(() => g.value.style instanceof Function ? g.value.style(g.value) : g.value.style), z = ne(() => {
      const T = g.value.type || "default", R = F?.[`edge-${T}`];
      if (R)
        return R;
      let j = g.value.template ?? u.value[T];
      if (typeof j == "string" && K) {
        const W = Object.keys(K.appContext.components);
        W && W.includes(T) && (j = xu(T, !1));
      }
      return j && typeof j != "string" ? j : (a.error(new Ye(Fe.EDGE_TYPE_MISSING, j)), !1);
    }), { handlePointerDown: x } = Cc({
      nodeId: M,
      handleId: B,
      type: S,
      isValidConnection: f,
      edgeUpdaterType: S,
      onEdgeUpdate: H,
      onEdgeUpdateEnd: q
    });
    return () => {
      const T = d(g.value.source), R = d(g.value.target), j = "pathOptions" in g.value ? g.value.pathOptions : {};
      if (!T && !R)
        return a.error(new Ye(Fe.EDGE_SOURCE_TARGET_MISSING, g.value.id, g.value.source, g.value.target)), null;
      if (!T)
        return a.error(new Ye(Fe.EDGE_SOURCE_MISSING, g.value.id, g.value.source)), null;
      if (!R)
        return a.error(new Ye(Fe.EDGE_TARGET_MISSING, g.value.id, g.value.target)), null;
      if (!g.value || g.value.hidden || T.hidden || R.hidden)
        return null;
      let W;
      o.value === Bt.Strict ? W = T.handleBounds.source : W = [...T.handleBounds.source || [], ...T.handleBounds.target || []];
      const ie = Hs(W, g.value.sourceHandle);
      let ue;
      o.value === Bt.Strict ? ue = R.handleBounds.target : ue = [...R.handleBounds.target || [], ...R.handleBounds.source || []];
      const ve = Hs(ue, g.value.targetHandle), pe = ie?.position || ce.Bottom, be = ve?.position || ce.Top, { x: Ee, y: Ne } = yn(T, ie, pe), { x: lt, y: Ue } = yn(R, ve, be);
      return g.value.sourceX = Ee, g.value.sourceY = Ne, g.value.targetX = lt, g.value.targetY = Ue, De(
        "g",
        {
          ref: Q,
          key: e.id,
          "data-id": e.id,
          class: [
            "vue-flow__edge",
            `vue-flow__edge-${z.value === !1 ? "default" : g.value.type || "default"}`,
            s.value,
            X.value,
            {
              updating: C.value,
              selected: g.value.selected,
              animated: g.value.animated,
              inactive: !y.value && !v.value.edgeClick.hasListeners()
            }
          ],
          tabIndex: E.value ? 0 : void 0,
          "aria-label": g.value.ariaLabel === null ? void 0 : g.value.ariaLabel ?? `Edge from ${g.value.source} to ${g.value.target}`,
          "aria-describedby": E.value ? `${uc}-${t}` : void 0,
          "aria-roledescription": "edge",
          role: E.value ? "group" : "img",
          ...g.value.domAttributes,
          onClick: Z,
          onContextmenu: ee,
          onDblclick: ae,
          onMouseenter: me,
          onMousemove: ge,
          onMouseleave: ke,
          onKeyDown: E.value ? D : void 0
        },
        [
          N.value ? null : De(z.value === !1 ? u.value.default : z.value, {
            id: e.id,
            sourceNode: T,
            targetNode: R,
            source: g.value.source,
            target: g.value.target,
            type: g.value.type,
            updatable: O.value,
            selected: g.value.selected,
            animated: g.value.animated,
            label: g.value.label,
            labelStyle: g.value.labelStyle,
            labelShowBg: g.value.labelShowBg,
            labelBgStyle: g.value.labelBgStyle,
            labelBgPadding: g.value.labelBgPadding,
            labelBgBorderRadius: g.value.labelBgBorderRadius,
            data: g.value.data,
            events: { ...g.value.events, ...P },
            style: U.value,
            markerStart: `url('#${Zn(g.value.markerStart, t)}')`,
            markerEnd: `url('#${Zn(g.value.markerEnd, t)}')`,
            sourcePosition: pe,
            targetPosition: be,
            sourceX: Ee,
            sourceY: Ne,
            targetX: lt,
            targetY: Ue,
            sourceHandleId: g.value.sourceHandle,
            targetHandleId: g.value.targetHandle,
            interactionWidth: g.value.interactionWidth,
            ...j
          }),
          [
            O.value === "source" || O.value === !0 ? [
              De(
                "g",
                {
                  onMousedown: re,
                  onMouseenter: L,
                  onMouseout: te
                },
                De(Qs, {
                  position: pe,
                  centerX: Ee,
                  centerY: Ne,
                  radius: r.value,
                  type: "source",
                  "data-type": "source"
                })
              )
            ] : null,
            O.value === "target" || O.value === !0 ? [
              De(
                "g",
                {
                  onMousedown: se,
                  onMouseenter: L,
                  onMouseout: te
                },
                De(Qs, {
                  position: be,
                  centerX: lt,
                  centerY: Ue,
                  radius: r.value,
                  type: "target",
                  "data-type": "target"
                })
              )
            ] : null
          ]
        ]
      );
    };
    function L() {
      C.value = !0;
    }
    function te() {
      C.value = !1;
    }
    function H(T, R) {
      k.update({ event: T, edge: g.value, connection: R });
    }
    function q(T) {
      k.updateEnd({ event: T, edge: g.value }), N.value = !1;
    }
    function Y(T, R) {
      T.button === 0 && (N.value = !0, M.value = R ? g.value.target : g.value.source, B.value = (R ? g.value.targetHandle : g.value.sourceHandle) ?? null, S.value = R ? "target" : "source", k.updateStart({ event: T, edge: g.value }), x(T));
    }
    function Z(T) {
      var R;
      const j = { event: T, edge: g.value };
      y.value && (i.value = !1, g.value.selected && h.value ? (c([g.value]), (R = Q.value) == null || R.blur()) : n([g.value])), k.click(j);
    }
    function ee(T) {
      k.contextMenu({ event: T, edge: g.value });
    }
    function ae(T) {
      k.doubleClick({ event: T, edge: g.value });
    }
    function me(T) {
      k.mouseEnter({ event: T, edge: g.value });
    }
    function ge(T) {
      k.mouseMove({ event: T, edge: g.value });
    }
    function ke(T) {
      k.mouseLeave({ event: T, edge: g.value });
    }
    function re(T) {
      Y(T, !0);
    }
    function se(T) {
      Y(T, !1);
    }
    function D(T) {
      var R;
      !b.value && cc.includes(T.key) && y.value && (T.key === "Escape" ? ((R = Q.value) == null || R.blur(), c([l(e.id)])) : n([l(e.id)]));
    }
  }
}), qy = Uy, Xy = $e({
  name: "ConnectionLine",
  compatConfig: { MODE: 3 },
  setup() {
    var e;
    const {
      id: t,
      connectionMode: n,
      connectionStartHandle: o,
      connectionEndHandle: r,
      connectionPosition: a,
      connectionLineType: i,
      connectionLineStyle: s,
      connectionLineOptions: u,
      connectionStatus: c,
      viewport: l,
      findNode: d
    } = Oe(), f = (e = ot(vr)) == null ? void 0 : e["connection-line"], h = ne(() => {
      var v;
      return d((v = o.value) == null ? void 0 : v.nodeId);
    }), b = ne(() => {
      var v;
      return d((v = r.value) == null ? void 0 : v.nodeId) ?? null;
    }), w = ne(() => ({
      x: (a.value.x - l.value.x) / l.value.zoom,
      y: (a.value.y - l.value.y) / l.value.zoom
    })), m = ne(
      () => u.value.markerStart ? `url(#${Zn(u.value.markerStart, t)})` : ""
    ), p = ne(
      () => u.value.markerEnd ? `url(#${Zn(u.value.markerEnd, t)})` : ""
    );
    return () => {
      var v, g, k;
      if (!h.value || !o.value)
        return null;
      const P = o.value.id, F = o.value.type, K = h.value.handleBounds;
      let C = K?.[F] ?? [];
      if (n.value === Bt.Loose) {
        const U = K?.[F === "source" ? "target" : "source"] ?? [];
        C = [...C, ...U];
      }
      if (!C)
        return null;
      const N = (P ? C.find((U) => U.id === P) : C[0]) ?? null, M = N?.position ?? ce.Top, { x: B, y: S } = yn(h.value, N, M);
      let Q = null;
      b.value && (n.value === Bt.Strict ? Q = ((v = b.value.handleBounds[F === "source" ? "target" : "source"]) == null ? void 0 : v.find(
        (U) => {
          var z;
          return U.id === ((z = r.value) == null ? void 0 : z.id);
        }
      )) || null : Q = ((g = [...b.value.handleBounds.source ?? [], ...b.value.handleBounds.target ?? []]) == null ? void 0 : g.find(
        (U) => {
          var z;
          return U.id === ((z = r.value) == null ? void 0 : z.id);
        }
      )) || null);
      const y = ((k = r.value) == null ? void 0 : k.position) ?? (M ? aa[M] : null);
      if (!M || !y)
        return null;
      const O = i.value ?? u.value.type ?? Ft.Bezier;
      let E = "";
      const X = {
        sourceX: B,
        sourceY: S,
        sourcePosition: M,
        targetX: w.value.x,
        targetY: w.value.y,
        targetPosition: y
      };
      return O === Ft.Bezier ? [E] = Ac(X) : O === Ft.Step ? [E] = la({
        ...X,
        borderRadius: 0
      }) : O === Ft.SmoothStep ? [E] = la(X) : O === Ft.SimpleBezier ? [E] = Pc(X) : E = `M${B},${S} ${w.value.x},${w.value.y}`, De(
        "svg",
        { class: "vue-flow__edges vue-flow__connectionline vue-flow__container" },
        De(
          "g",
          { class: "vue-flow__connection" },
          f ? De(f, {
            sourceX: B,
            sourceY: S,
            sourcePosition: M,
            targetX: w.value.x,
            targetY: w.value.y,
            targetPosition: y,
            sourceNode: h.value,
            sourceHandle: N,
            targetNode: b.value,
            targetHandle: Q,
            markerEnd: p.value,
            markerStart: m.value,
            connectionStatus: c.value
          }) : De("path", {
            d: E,
            class: [u.value.class, c.value, "vue-flow__connection-path"],
            style: {
              ...s.value,
              ...u.value.style
            },
            "marker-end": p.value,
            "marker-start": m.value
          })
        )
      );
    };
  }
}), Wy = Xy, Ky = ["id", "markerWidth", "markerHeight", "markerUnits", "orient"], jy = {
  name: "MarkerType",
  compatConfig: { MODE: 3 }
}, Zy = /* @__PURE__ */ $e({
  ...jy,
  props: {
    id: {},
    type: {},
    color: { default: "none" },
    width: { default: 12.5 },
    height: { default: 12.5 },
    markerUnits: { default: "strokeWidth" },
    orient: { default: "auto-start-reverse" },
    strokeWidth: { default: 1 }
  },
  setup(e) {
    return (t, n) => (A(), G("marker", {
      id: t.id,
      class: "vue-flow__arrowhead",
      viewBox: "-10 -10 20 20",
      refX: "0",
      refY: "0",
      markerWidth: `${t.width}`,
      markerHeight: `${t.height}`,
      markerUnits: t.markerUnits,
      orient: t.orient
    }, [
      t.type === oe(Wn).ArrowClosed ? (A(), G("polyline", {
        key: 0,
        style: Pe({
          stroke: t.color,
          fill: t.color,
          strokeWidth: t.strokeWidth
        }),
        "stroke-linecap": "round",
        "stroke-linejoin": "round",
        points: "-5,-4 0,0 -5,4 -5,-4"
      }, null, 4)) : fe("", !0),
      t.type === oe(Wn).Arrow ? (A(), G("polyline", {
        key: 1,
        style: Pe({
          stroke: t.color,
          strokeWidth: t.strokeWidth
        }),
        "stroke-linecap": "round",
        "stroke-linejoin": "round",
        fill: "none",
        points: "-5,-4 0,0 -5,4"
      }, null, 4)) : fe("", !0)
    ], 8, Ky));
  }
}), Jy = {
  class: "vue-flow__marker vue-flow__container",
  "aria-hidden": "true"
}, Qy = {
  name: "MarkerDefinitions",
  compatConfig: { MODE: 3 }
}, e0 = /* @__PURE__ */ $e({
  ...Qy,
  setup(e) {
    const { id: t, edges: n, connectionLineOptions: o, defaultMarkerColor: r } = Oe(), a = ne(() => {
      const i = /* @__PURE__ */ new Set(), s = [], u = (c) => {
        if (c) {
          const l = Zn(c, t);
          i.has(l) || (typeof c == "object" ? s.push({ ...c, id: l, color: c.color || r.value }) : s.push({ id: l, color: r.value, type: c }), i.add(l));
        }
      };
      for (const c of [o.value.markerEnd, o.value.markerStart])
        u(c);
      for (const c of n.value)
        for (const l of [c.markerStart, c.markerEnd])
          u(l);
      return s.sort((c, l) => c.id.localeCompare(l.id));
    });
    return (i, s) => (A(), G("svg", Jy, [
      I("defs", null, [
        (A(!0), G(ye, null, Se(a.value, (u) => (A(), Ie(Zy, {
          id: u.id,
          key: u.id,
          type: u.type,
          color: u.color,
          width: u.width,
          height: u.height,
          markerUnits: u.markerUnits,
          "stroke-width": u.strokeWidth,
          orient: u.orient
        }, null, 8, ["id", "type", "color", "width", "height", "markerUnits", "stroke-width", "orient"]))), 128))
      ])
    ]));
  }
}), t0 = {
  name: "Edges",
  compatConfig: { MODE: 3 }
}, n0 = /* @__PURE__ */ $e({
  ...t0,
  setup(e) {
    const { findNode: t, getEdges: n, elevateEdgesOnSelect: o } = Oe();
    return (r, a) => (A(), G(ye, null, [
      ze(e0),
      (A(!0), G(ye, null, Se(oe(n), (i) => (A(), G("svg", {
        key: i.id,
        class: "vue-flow__edges vue-flow__container",
        style: Pe({ zIndex: oe(wm)(i, oe(t), oe(o)) })
      }, [
        ze(oe(qy), {
          id: i.id
        }, null, 8, ["id"])
      ], 4))), 128)),
      ze(oe(Wy))
    ], 64));
  }
}), o0 = $e({
  name: "Node",
  compatConfig: { MODE: 3 },
  props: ["id", "resizeObserver"],
  setup(e) {
    const {
      id: t,
      noPanClassName: n,
      selectNodesOnDrag: o,
      nodesSelectionActive: r,
      multiSelectionActive: a,
      emits: i,
      removeSelectedNodes: s,
      addSelectedNodes: u,
      updateNodeDimensions: c,
      onUpdateNodeInternals: l,
      getNodeTypes: d,
      nodeExtent: f,
      elevateNodesOnSelect: h,
      disableKeyboardA11y: b,
      ariaLiveMessage: w,
      snapToGrid: m,
      snapGrid: p,
      nodeDragThreshold: v,
      nodesDraggable: g,
      elementsSelectable: k,
      nodesConnectable: P,
      nodesFocusable: F,
      hooks: K
    } = Oe(), C = le(null);
    Ct($c, C), Ct(Ec, e.id);
    const N = ot(vr), M = kn(), B = Mc(), { node: S, parentNode: Q } = Nc(e.id), { emit: y, on: O } = Lm(S, i), E = Te(() => typeof S.draggable > "u" ? g.value : S.draggable), X = Te(() => typeof S.selectable > "u" ? k.value : S.selectable), U = Te(() => typeof S.connectable > "u" ? P.value : S.connectable), z = Te(() => typeof S.focusable > "u" ? F.value : S.focusable), x = ne(
      () => X.value || E.value || K.value.nodeClick.hasListeners() || K.value.nodeDoubleClick.hasListeners() || K.value.nodeMouseEnter.hasListeners() || K.value.nodeMouseMove.hasListeners() || K.value.nodeMouseLeave.hasListeners()
    ), L = Te(() => !!S.dimensions.width && !!S.dimensions.height), te = ne(() => {
      const R = S.type || "default", j = N?.[`node-${R}`];
      if (j)
        return j;
      let W = S.template || d.value[R];
      if (typeof W == "string" && M) {
        const ie = Object.keys(M.appContext.components);
        ie && ie.includes(R) && (W = xu(R, !1));
      }
      return W && typeof W != "string" ? W : (i.error(new Ye(Fe.NODE_TYPE_MISSING, W)), !1);
    }), H = Sc({
      id: e.id,
      el: C,
      disabled: () => !E.value,
      selectable: X,
      dragHandle: () => S.dragHandle,
      onStart(R) {
        y.dragStart(R);
      },
      onDrag(R) {
        y.drag(R);
      },
      onStop(R) {
        y.dragStop(R);
      },
      onClick(R) {
        D(R);
      }
    }), q = ne(() => S.class instanceof Function ? S.class(S) : S.class), Y = ne(() => {
      const R = (S.style instanceof Function ? S.style(S) : S.style) || {}, j = S.width instanceof Function ? S.width(S) : S.width, W = S.height instanceof Function ? S.height(S) : S.height;
      return !R.width && j && (R.width = typeof j == "string" ? j : `${j}px`), !R.height && W && (R.height = typeof W == "string" ? W : `${W}px`), R;
    }), Z = Te(() => Number(S.zIndex ?? Y.value.zIndex ?? 0));
    return l((R) => {
      (R.includes(e.id) || !R.length) && ae();
    }), it(() => {
      xe(
        () => S.hidden,
        (R = !1, j, W) => {
          !R && C.value && (e.resizeObserver.observe(C.value), W(() => {
            C.value && e.resizeObserver.unobserve(C.value);
          }));
        },
        { immediate: !0, flush: "post" }
      );
    }), xe([() => S.type, () => S.sourcePosition, () => S.targetPosition], () => {
      Ke(() => {
        c([{ id: e.id, nodeElement: C.value, forceUpdate: !0 }]);
      });
    }), xe(
      [
        () => S.position.x,
        () => S.position.y,
        () => {
          var R;
          return (R = Q.value) == null ? void 0 : R.computedPosition.x;
        },
        () => {
          var R;
          return (R = Q.value) == null ? void 0 : R.computedPosition.y;
        },
        () => {
          var R;
          return (R = Q.value) == null ? void 0 : R.computedPosition.z;
        },
        Z,
        () => S.selected,
        () => S.dimensions.height,
        () => S.dimensions.width,
        () => {
          var R;
          return (R = Q.value) == null ? void 0 : R.dimensions.height;
        },
        () => {
          var R;
          return (R = Q.value) == null ? void 0 : R.dimensions.width;
        }
      ],
      ([R, j, W, ie, ue, ve]) => {
        const pe = {
          x: R,
          y: j,
          z: ve + (h.value && S.selected ? 1e3 : 0)
        };
        typeof W < "u" && typeof ie < "u" ? S.computedPosition = pm({ x: W, y: ie, z: ue }, pe) : S.computedPosition = pe;
      },
      { flush: "post", immediate: !0 }
    ), xe([() => S.extent, f], ([R, j], [W, ie]) => {
      (R !== W || j !== ie) && ee();
    }), S.extent === "parent" || typeof S.extent == "object" && "range" in S.extent && S.extent.range === "parent" ? Ki(() => L).toBe(!0).then(ee) : ee(), () => S.hidden ? null : De(
      "div",
      {
        ref: C,
        "data-id": S.id,
        class: [
          "vue-flow__node",
          `vue-flow__node-${te.value === !1 ? "default" : S.type || "default"}`,
          {
            [n.value]: E.value,
            dragging: H?.value,
            draggable: E.value,
            selected: S.selected,
            selectable: X.value,
            parent: S.isParent
          },
          q.value
        ],
        style: {
          visibility: L.value ? "visible" : "hidden",
          zIndex: S.computedPosition.z ?? Z.value,
          transform: `translate(${S.computedPosition.x}px,${S.computedPosition.y}px)`,
          pointerEvents: x.value ? "all" : "none",
          ...Y.value
        },
        tabIndex: z.value ? 0 : void 0,
        role: z.value ? "group" : void 0,
        "aria-describedby": b.value ? void 0 : `${lc}-${t}`,
        "aria-label": S.ariaLabel,
        "aria-roledescription": "node",
        ...S.domAttributes,
        onMouseenter: me,
        onMousemove: ge,
        onMouseleave: ke,
        onContextmenu: re,
        onClick: D,
        onDblclick: se,
        onKeydown: T
      },
      [
        De(te.value === !1 ? d.value.default : te.value, {
          id: S.id,
          type: S.type,
          data: S.data,
          events: { ...S.events, ...O },
          selected: S.selected,
          resizing: S.resizing,
          dragging: H.value,
          connectable: U.value,
          position: S.computedPosition,
          dimensions: S.dimensions,
          isValidTargetPos: S.isValidTargetPos,
          isValidSourcePos: S.isValidSourcePos,
          parent: S.parentNode,
          parentNodeId: S.parentNode,
          zIndex: S.computedPosition.z ?? Z.value,
          targetPosition: S.targetPosition,
          sourcePosition: S.sourcePosition,
          label: S.label,
          dragHandle: S.dragHandle,
          onUpdateNodeInternals: ae
        })
      ]
    );
    function ee() {
      const R = S.computedPosition, { computedPosition: j, position: W } = Ra(
        S,
        m.value ? gr(R, p.value) : R,
        i.error,
        f.value,
        Q.value
      );
      (S.computedPosition.x !== j.x || S.computedPosition.y !== j.y) && (S.computedPosition = { ...S.computedPosition, ...j }), (S.position.x !== W.x || S.position.y !== W.y) && (S.position = W);
    }
    function ae() {
      C.value && c([{ id: e.id, nodeElement: C.value, forceUpdate: !0 }]);
    }
    function me(R) {
      H?.value || y.mouseEnter({ event: R, node: S });
    }
    function ge(R) {
      H?.value || y.mouseMove({ event: R, node: S });
    }
    function ke(R) {
      H?.value || y.mouseLeave({ event: R, node: S });
    }
    function re(R) {
      return y.contextMenu({ event: R, node: S });
    }
    function se(R) {
      return y.doubleClick({ event: R, node: S });
    }
    function D(R) {
      X.value && (!o.value || !E.value || v.value > 0) && sa(
        S,
        a.value,
        u,
        s,
        r,
        !1,
        C.value
      ), y.click({ event: R, node: S });
    }
    function T(R) {
      if (!(ra(R) || b.value))
        if (cc.includes(R.key) && X.value) {
          const j = R.key === "Escape";
          sa(
            S,
            a.value,
            u,
            s,
            r,
            j,
            C.value
          );
        } else E.value && S.selected && hn[R.key] && (R.preventDefault(), w.value = `Moved selected node ${R.key.replace("Arrow", "").toLowerCase()}. New position, x: ${~~S.position.x}, y: ${~~S.position.y}`, B(
          {
            x: hn[R.key].x,
            y: hn[R.key].y
          },
          R.shiftKey
        ));
    }
  }
}), r0 = o0;
function i0(e = { includeHiddenNodes: !1 }) {
  const { nodes: t } = Oe();
  return ne(() => {
    if (t.value.length === 0)
      return !1;
    for (const n of t.value)
      if ((e.includeHiddenNodes || !n.hidden) && (n?.handleBounds === void 0 || n.dimensions.width === 0 || n.dimensions.height === 0))
        return !1;
    return !0;
  });
}
const a0 = { class: "vue-flow__nodes vue-flow__container" }, s0 = {
  name: "Nodes",
  compatConfig: { MODE: 3 }
}, l0 = /* @__PURE__ */ $e({
  ...s0,
  setup(e) {
    const { getNodes: t, updateNodeDimensions: n, emits: o } = Oe(), r = i0(), a = le();
    return xe(
      r,
      (i) => {
        i && Ke(() => {
          o.nodesInitialized(t.value);
        });
      },
      { immediate: !0 }
    ), it(() => {
      a.value = new ResizeObserver((i) => {
        const s = i.map((u) => ({
          id: u.target.getAttribute("data-id"),
          nodeElement: u.target,
          forceUpdate: !0
        }));
        Ke(() => n(s));
      });
    }), oo(() => {
      var i;
      return (i = a.value) == null ? void 0 : i.disconnect();
    }), (i, s) => (A(), G("div", a0, [
      a.value ? (A(!0), G(ye, { key: 0 }, Se(oe(t), (u, c, l, d) => {
        const f = [u.id];
        if (d && d.key === u.id && yf(d, f))
          return d;
        const h = (A(), Ie(oe(r0), {
          id: u.id,
          key: u.id,
          "resize-observer": a.value
        }, null, 8, ["id", "resize-observer"]));
        return h.memo = f, h;
      }, s, 0), 128)) : fe("", !0)
    ]));
  }
});
function u0() {
  const { emits: e } = Oe();
  it(() => {
    if (xc()) {
      const t = document.querySelector(".vue-flow__pane");
      t && window.getComputedStyle(t).zIndex !== "1" && e.error(new Ye(Fe.MISSING_STYLES));
    }
  });
}
const c0 = /* @__PURE__ */ I("div", { class: "vue-flow__edge-labels" }, null, -1), d0 = {
  name: "VueFlow",
  compatConfig: { MODE: 3 }
}, f0 = /* @__PURE__ */ $e({
  ...d0,
  props: {
    id: {},
    modelValue: {},
    nodes: {},
    edges: {},
    edgeTypes: {},
    nodeTypes: {},
    connectionMode: {},
    connectionLineType: {},
    connectionLineStyle: { default: void 0 },
    connectionLineOptions: { default: void 0 },
    connectionRadius: {},
    isValidConnection: { type: [Function, null], default: void 0 },
    deleteKeyCode: { default: void 0 },
    selectionKeyCode: { type: [Boolean, null], default: void 0 },
    multiSelectionKeyCode: { default: void 0 },
    zoomActivationKeyCode: { default: void 0 },
    panActivationKeyCode: { default: void 0 },
    snapToGrid: { type: Boolean, default: void 0 },
    snapGrid: {},
    onlyRenderVisibleElements: { type: Boolean, default: void 0 },
    edgesUpdatable: { type: [Boolean, String], default: void 0 },
    nodesDraggable: { type: Boolean, default: void 0 },
    nodesConnectable: { type: Boolean, default: void 0 },
    nodeDragThreshold: {},
    elementsSelectable: { type: Boolean, default: void 0 },
    selectNodesOnDrag: { type: Boolean, default: void 0 },
    panOnDrag: { type: [Boolean, Array], default: void 0 },
    minZoom: {},
    maxZoom: {},
    defaultViewport: {},
    translateExtent: {},
    nodeExtent: {},
    defaultMarkerColor: {},
    zoomOnScroll: { type: Boolean, default: void 0 },
    zoomOnPinch: { type: Boolean, default: void 0 },
    panOnScroll: { type: Boolean, default: void 0 },
    panOnScrollSpeed: {},
    panOnScrollMode: {},
    paneClickDistance: {},
    zoomOnDoubleClick: { type: Boolean, default: void 0 },
    preventScrolling: { type: Boolean, default: void 0 },
    selectionMode: {},
    edgeUpdaterRadius: {},
    fitViewOnInit: { type: Boolean, default: void 0 },
    connectOnClick: { type: Boolean, default: void 0 },
    applyDefault: { type: Boolean, default: void 0 },
    autoConnect: { type: [Boolean, Function], default: void 0 },
    noDragClassName: {},
    noWheelClassName: {},
    noPanClassName: {},
    defaultEdgeOptions: {},
    elevateEdgesOnSelect: { type: Boolean, default: void 0 },
    elevateNodesOnSelect: { type: Boolean, default: void 0 },
    disableKeyboardA11y: { type: Boolean, default: void 0 },
    edgesFocusable: { type: Boolean, default: void 0 },
    nodesFocusable: { type: Boolean, default: void 0 },
    autoPanOnConnect: { type: Boolean, default: void 0 },
    autoPanOnNodeDrag: { type: Boolean, default: void 0 },
    autoPanSpeed: {}
  },
  emits: ["nodesChange", "edgesChange", "nodesInitialized", "paneReady", "init", "updateNodeInternals", "error", "connect", "connectStart", "connectEnd", "clickConnectStart", "clickConnectEnd", "moveStart", "move", "moveEnd", "selectionDragStart", "selectionDrag", "selectionDragStop", "selectionContextMenu", "selectionStart", "selectionEnd", "viewportChangeStart", "viewportChange", "viewportChangeEnd", "paneScroll", "paneClick", "paneContextMenu", "paneMouseEnter", "paneMouseMove", "paneMouseLeave", "edgeUpdate", "edgeContextMenu", "edgeMouseEnter", "edgeMouseMove", "edgeMouseLeave", "edgeDoubleClick", "edgeClick", "edgeUpdateStart", "edgeUpdateEnd", "nodeContextMenu", "nodeMouseEnter", "nodeMouseMove", "nodeMouseLeave", "nodeDoubleClick", "nodeClick", "nodeDragStart", "nodeDrag", "nodeDragStop", "miniMapNodeClick", "miniMapNodeDoubleClick", "miniMapNodeMouseEnter", "miniMapNodeMouseMove", "miniMapNodeMouseLeave", "update:modelValue", "update:nodes", "update:edges"],
  setup(e, { expose: t, emit: n }) {
    const o = e, r = _u(), a = Br(o, "modelValue", n), i = Br(o, "nodes", n), s = Br(o, "edges", n), u = Oe(o), c = Gm({ modelValue: a, nodes: i, edges: s }, o, u);
    return Um(n, u.hooks), Fy(), u0(), Ct(vr, r), gf(c), t(u), (l, d) => (A(), G("div", {
      ref: oe(u).vueFlowRef,
      class: "vue-flow"
    }, [
      ze(Ry, null, {
        default: ft(() => [
          ze(n0),
          c0,
          ze(l0),
          Le(l.$slots, "zoom-pane")
        ]),
        _: 3
      }),
      Le(l.$slots, "default"),
      ze(Hy)
    ], 512));
  }
}), h0 = {
  name: "Panel",
  compatConfig: { MODE: 3 }
}, Rc = /* @__PURE__ */ $e({
  ...h0,
  props: {
    position: {}
  },
  setup(e) {
    const t = e, { userSelectionActive: n } = Oe(), o = ne(() => `${t.position}`.split("-"));
    return (r, a) => (A(), G("div", {
      class: Me(["vue-flow__panel", o.value]),
      style: Pe({ pointerEvents: oe(n) ? "none" : "all" })
    }, [
      Le(r.$slots, "default")
    ], 6));
  }
});
var $t = /* @__PURE__ */ ((e) => (e.Lines = "lines", e.Dots = "dots", e))($t || {});
const zc = function({ dimensions: e, size: t, color: n }) {
  return De("path", {
    stroke: n,
    "stroke-width": t,
    d: `M${e[0] / 2} 0 V${e[1]} M0 ${e[1] / 2} H${e[0]}`
  });
}, Bc = function({ radius: e, color: t }) {
  return De("circle", { cx: e, cy: e, r: e, fill: t });
};
$t.Lines + "", $t.Dots + "";
const p0 = {
  [$t.Dots]: "#81818a",
  [$t.Lines]: "#eee"
}, g0 = ["id", "x", "y", "width", "height", "patternTransform"], v0 = {
  key: 2,
  height: "100",
  width: "100"
}, m0 = ["fill"], y0 = ["x", "y", "fill"], b0 = {
  name: "Background",
  compatConfig: { MODE: 3 }
}, w0 = /* @__PURE__ */ $e({
  ...b0,
  props: {
    id: {},
    variant: { default: () => $t.Dots },
    gap: { default: 20 },
    size: { default: 1 },
    lineWidth: { default: 1 },
    patternColor: {},
    color: {},
    bgColor: {},
    height: { default: 100 },
    width: { default: 100 },
    x: { default: 0 },
    y: { default: 0 },
    offset: { default: 0 }
  },
  setup(e) {
    const { id: t, viewport: n } = Oe(), o = ne(() => {
      const i = n.value.zoom, [s, u] = Array.isArray(e.gap) ? e.gap : [e.gap, e.gap], c = [s * i || 1, u * i || 1], l = e.size * i, [d, f] = Array.isArray(e.offset) ? e.offset : [e.offset, e.offset], h = [d * i || 1 + c[0] / 2, f * i || 1 + c[1] / 2];
      return {
        scaledGap: c,
        offset: h,
        size: l
      };
    }), r = Te(() => `pattern-${t}${e.id ? `-${e.id}` : ""}`), a = Te(() => e.color || e.patternColor || p0[e.variant || $t.Dots]);
    return (i, s) => (A(), G("svg", {
      class: "vue-flow__background vue-flow__container",
      style: Pe({
        height: `${i.height > 100 ? 100 : i.height}%`,
        width: `${i.width > 100 ? 100 : i.width}%`
      })
    }, [
      Le(i.$slots, "pattern-container", { id: r.value }, () => [
        I("pattern", {
          id: r.value,
          x: oe(n).x % o.value.scaledGap[0],
          y: oe(n).y % o.value.scaledGap[1],
          width: o.value.scaledGap[0],
          height: o.value.scaledGap[1],
          patternTransform: `translate(-${o.value.offset[0]},-${o.value.offset[1]})`,
          patternUnits: "userSpaceOnUse"
        }, [
          Le(i.$slots, "pattern", {}, () => [
            i.variant === oe($t).Lines ? (A(), Ie(oe(zc), {
              key: 0,
              size: i.lineWidth,
              color: a.value,
              dimensions: o.value.scaledGap
            }, null, 8, ["size", "color", "dimensions"])) : i.variant === oe($t).Dots ? (A(), Ie(oe(Bc), {
              key: 1,
              color: a.value,
              radius: o.value.size / 2
            }, null, 8, ["color", "radius"])) : fe("", !0),
            i.bgColor ? (A(), G("svg", v0, [
              I("rect", {
                width: "100%",
                height: "100%",
                fill: i.bgColor
              }, null, 8, m0)
            ])) : fe("", !0)
          ])
        ], 8, g0)
      ]),
      I("rect", {
        x: i.x,
        y: i.y,
        width: "100%",
        height: "100%",
        fill: `url(#${r.value})`
      }, null, 8, y0),
      Le(i.$slots, "default", { id: r.value })
    ], 4));
  }
}), k0 = {
  name: "ControlButton",
  compatConfig: { MODE: 3 }
}, _0 = (e, t) => {
  const n = e.__vccOpts || e;
  for (const [o, r] of t)
    n[o] = r;
  return n;
}, x0 = {
  type: "button",
  class: "vue-flow__controls-button"
};
function E0(e, t, n, o, r, a) {
  return A(), G("button", x0, [
    Le(e.$slots, "default")
  ]);
}
const $o = /* @__PURE__ */ _0(k0, [["render", E0]]), $0 = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 32 32"
}, S0 = /* @__PURE__ */ I("path", { d: "M32 18.133H18.133V32h-4.266V18.133H0v-4.266h13.867V0h4.266v13.867H32z" }, null, -1), C0 = [
  S0
];
function N0(e, t) {
  return A(), G("svg", $0, C0);
}
const M0 = { render: N0 }, T0 = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 32 5"
}, I0 = /* @__PURE__ */ I("path", { d: "M0 0h32v4.2H0z" }, null, -1), D0 = [
  I0
];
function A0(e, t) {
  return A(), G("svg", T0, D0);
}
const P0 = { render: A0 }, O0 = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 32 30"
}, R0 = /* @__PURE__ */ I("path", { d: "M3.692 4.63c0-.53.4-.938.939-.938h5.215V0H4.708C2.13 0 0 2.054 0 4.63v5.216h3.692V4.631zM27.354 0h-5.2v3.692h5.17c.53 0 .984.4.984.939v5.215H32V4.631A4.624 4.624 0 0 0 27.354 0zm.954 24.83c0 .532-.4.94-.939.94h-5.215v3.768h5.215c2.577 0 4.631-2.13 4.631-4.707v-5.139h-3.692v5.139zm-23.677.94a.919.919 0 0 1-.939-.94v-5.138H0v5.139c0 2.577 2.13 4.707 4.708 4.707h5.138V25.77H4.631z" }, null, -1), z0 = [
  R0
];
function B0(e, t) {
  return A(), G("svg", O0, z0);
}
const L0 = { render: B0 }, V0 = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 25 32"
}, H0 = /* @__PURE__ */ I("path", { d: "M21.333 10.667H19.81V7.619C19.81 3.429 16.38 0 12.19 0 8 0 4.571 3.429 4.571 7.619v3.048H3.048A3.056 3.056 0 0 0 0 13.714v15.238A3.056 3.056 0 0 0 3.048 32h18.285a3.056 3.056 0 0 0 3.048-3.048V13.714a3.056 3.056 0 0 0-3.048-3.047zM12.19 24.533a3.056 3.056 0 0 1-3.047-3.047 3.056 3.056 0 0 1 3.047-3.048 3.056 3.056 0 0 1 3.048 3.048 3.056 3.056 0 0 1-3.048 3.047zm4.724-13.866H7.467V7.619c0-2.59 2.133-4.724 4.723-4.724 2.591 0 4.724 2.133 4.724 4.724v3.048z" }, null, -1), F0 = [
  H0
];
function G0(e, t) {
  return A(), G("svg", V0, F0);
}
const Y0 = { render: G0 }, U0 = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 25 32"
}, q0 = /* @__PURE__ */ I("path", { d: "M21.333 10.667H19.81V7.619C19.81 3.429 16.38 0 12.19 0c-4.114 1.828-1.37 2.133.305 2.438 1.676.305 4.42 2.59 4.42 5.181v3.048H3.047A3.056 3.056 0 0 0 0 13.714v15.238A3.056 3.056 0 0 0 3.048 32h18.285a3.056 3.056 0 0 0 3.048-3.048V13.714a3.056 3.056 0 0 0-3.048-3.047zM12.19 24.533a3.056 3.056 0 0 1-3.047-3.047 3.056 3.056 0 0 1 3.047-3.048 3.056 3.056 0 0 1 3.048 3.048 3.056 3.056 0 0 1-3.048 3.047z" }, null, -1), X0 = [
  q0
];
function W0(e, t) {
  return A(), G("svg", U0, X0);
}
const K0 = { render: W0 }, j0 = {
  name: "Controls",
  compatConfig: { MODE: 3 }
}, Z0 = /* @__PURE__ */ $e({
  ...j0,
  props: {
    showZoom: { type: Boolean, default: !0 },
    showFitView: { type: Boolean, default: !0 },
    showInteractive: { type: Boolean, default: !0 },
    fitViewParams: {},
    position: { default: () => sc.BottomLeft }
  },
  emits: ["zoomIn", "zoomOut", "fitView", "interactionChange"],
  setup(e, { emit: t }) {
    const {
      nodesDraggable: n,
      nodesConnectable: o,
      elementsSelectable: r,
      setInteractive: a,
      zoomIn: i,
      zoomOut: s,
      fitView: u,
      viewport: c,
      minZoom: l,
      maxZoom: d
    } = Oe(), f = Te(() => n.value || o.value || r.value), h = Te(() => c.value.zoom <= l.value), b = Te(() => c.value.zoom >= d.value);
    function w() {
      i(), t("zoomIn");
    }
    function m() {
      s(), t("zoomOut");
    }
    function p() {
      u(e.fitViewParams), t("fitView");
    }
    function v() {
      a(!f.value), t("interactionChange", !f.value);
    }
    return (g, k) => (A(), Ie(oe(Rc), {
      class: "vue-flow__controls",
      position: g.position
    }, {
      default: ft(() => [
        Le(g.$slots, "top"),
        g.showZoom ? (A(), G(ye, { key: 0 }, [
          Le(g.$slots, "control-zoom-in", {}, () => [
            ze($o, {
              class: "vue-flow__controls-zoomin",
              disabled: b.value,
              onClick: w
            }, {
              default: ft(() => [
                Le(g.$slots, "icon-zoom-in", {}, () => [
                  (A(), Ie(Ht(oe(M0))))
                ])
              ]),
              _: 3
            }, 8, ["disabled"])
          ]),
          Le(g.$slots, "control-zoom-out", {}, () => [
            ze($o, {
              class: "vue-flow__controls-zoomout",
              disabled: h.value,
              onClick: m
            }, {
              default: ft(() => [
                Le(g.$slots, "icon-zoom-out", {}, () => [
                  (A(), Ie(Ht(oe(P0))))
                ])
              ]),
              _: 3
            }, 8, ["disabled"])
          ])
        ], 64)) : fe("", !0),
        g.showFitView ? Le(g.$slots, "control-fit-view", { key: 1 }, () => [
          ze($o, {
            class: "vue-flow__controls-fitview",
            onClick: p
          }, {
            default: ft(() => [
              Le(g.$slots, "icon-fit-view", {}, () => [
                (A(), Ie(Ht(oe(L0))))
              ])
            ]),
            _: 3
          })
        ]) : fe("", !0),
        g.showInteractive ? Le(g.$slots, "control-interactive", { key: 2 }, () => [
          g.showInteractive ? (A(), Ie($o, {
            key: 0,
            class: "vue-flow__controls-interactive",
            onClick: v
          }, {
            default: ft(() => [
              f.value ? Le(g.$slots, "icon-unlock", { key: 0 }, () => [
                (A(), Ie(Ht(oe(K0))))
              ]) : fe("", !0),
              f.value ? fe("", !0) : Le(g.$slots, "icon-lock", { key: 1 }, () => [
                (A(), Ie(Ht(oe(Y0))))
              ])
            ]),
            _: 3
          })) : fe("", !0)
        ]) : fe("", !0),
        Le(g.$slots, "default")
      ]),
      _: 3
    }, 8, ["position"]));
  }
});
var J0 = { value: () => {
} };
function La() {
  for (var e = 0, t = arguments.length, n = {}, o; e < t; ++e) {
    if (!(o = arguments[e] + "") || o in n || /[\s.]/.test(o)) throw new Error("illegal type: " + o);
    n[o] = [];
  }
  return new Lo(n);
}
function Lo(e) {
  this._ = e;
}
function Q0(e, t) {
  return e.trim().split(/^|\s+/).map(function(n) {
    var o = "", r = n.indexOf(".");
    if (r >= 0 && (o = n.slice(r + 1), n = n.slice(0, r)), n && !t.hasOwnProperty(n)) throw new Error("unknown type: " + n);
    return { type: n, name: o };
  });
}
Lo.prototype = La.prototype = {
  constructor: Lo,
  on: function(e, t) {
    var n = this._, o = Q0(e + "", n), r, a = -1, i = o.length;
    if (arguments.length < 2) {
      for (; ++a < i; ) if ((r = (e = o[a]).type) && (r = e1(n[r], e.name))) return r;
      return;
    }
    if (t != null && typeof t != "function") throw new Error("invalid callback: " + t);
    for (; ++a < i; )
      if (r = (e = o[a]).type) n[r] = el(n[r], e.name, t);
      else if (t == null) for (r in n) n[r] = el(n[r], e.name, null);
    return this;
  },
  copy: function() {
    var e = {}, t = this._;
    for (var n in t) e[n] = t[n].slice();
    return new Lo(e);
  },
  call: function(e, t) {
    if ((r = arguments.length - 2) > 0) for (var n = new Array(r), o = 0, r, a; o < r; ++o) n[o] = arguments[o + 2];
    if (!this._.hasOwnProperty(e)) throw new Error("unknown type: " + e);
    for (a = this._[e], o = 0, r = a.length; o < r; ++o) a[o].value.apply(t, n);
  },
  apply: function(e, t, n) {
    if (!this._.hasOwnProperty(e)) throw new Error("unknown type: " + e);
    for (var o = this._[e], r = 0, a = o.length; r < a; ++r) o[r].value.apply(t, n);
  }
};
function e1(e, t) {
  for (var n = 0, o = e.length, r; n < o; ++n)
    if ((r = e[n]).name === t)
      return r.value;
}
function el(e, t, n) {
  for (var o = 0, r = e.length; o < r; ++o)
    if (e[o].name === t) {
      e[o] = J0, e = e.slice(0, o).concat(e.slice(o + 1));
      break;
    }
  return n != null && e.push({ name: t, value: n }), e;
}
var ua = "http://www.w3.org/1999/xhtml";
const tl = {
  svg: "http://www.w3.org/2000/svg",
  xhtml: ua,
  xlink: "http://www.w3.org/1999/xlink",
  xml: "http://www.w3.org/XML/1998/namespace",
  xmlns: "http://www.w3.org/2000/xmlns/"
};
function kr(e) {
  var t = e += "", n = t.indexOf(":");
  return n >= 0 && (t = e.slice(0, n)) !== "xmlns" && (e = e.slice(n + 1)), tl.hasOwnProperty(t) ? { space: tl[t], local: e } : e;
}
function t1(e) {
  return function() {
    var t = this.ownerDocument, n = this.namespaceURI;
    return n === ua && t.documentElement.namespaceURI === ua ? t.createElement(e) : t.createElementNS(n, e);
  };
}
function n1(e) {
  return function() {
    return this.ownerDocument.createElementNS(e.space, e.local);
  };
}
function Lc(e) {
  var t = kr(e);
  return (t.local ? n1 : t1)(t);
}
function o1() {
}
function Va(e) {
  return e == null ? o1 : function() {
    return this.querySelector(e);
  };
}
function r1(e) {
  typeof e != "function" && (e = Va(e));
  for (var t = this._groups, n = t.length, o = new Array(n), r = 0; r < n; ++r)
    for (var a = t[r], i = a.length, s = o[r] = new Array(i), u, c, l = 0; l < i; ++l)
      (u = a[l]) && (c = e.call(u, u.__data__, l, a)) && ("__data__" in u && (c.__data__ = u.__data__), s[l] = c);
  return new Qe(o, this._parents);
}
function i1(e) {
  return e == null ? [] : Array.isArray(e) ? e : Array.from(e);
}
function a1() {
  return [];
}
function Vc(e) {
  return e == null ? a1 : function() {
    return this.querySelectorAll(e);
  };
}
function s1(e) {
  return function() {
    return i1(e.apply(this, arguments));
  };
}
function l1(e) {
  typeof e == "function" ? e = s1(e) : e = Vc(e);
  for (var t = this._groups, n = t.length, o = [], r = [], a = 0; a < n; ++a)
    for (var i = t[a], s = i.length, u, c = 0; c < s; ++c)
      (u = i[c]) && (o.push(e.call(u, u.__data__, c, i)), r.push(u));
  return new Qe(o, r);
}
function Hc(e) {
  return function() {
    return this.matches(e);
  };
}
function Fc(e) {
  return function(t) {
    return t.matches(e);
  };
}
var u1 = Array.prototype.find;
function c1(e) {
  return function() {
    return u1.call(this.children, e);
  };
}
function d1() {
  return this.firstElementChild;
}
function f1(e) {
  return this.select(e == null ? d1 : c1(typeof e == "function" ? e : Fc(e)));
}
var h1 = Array.prototype.filter;
function p1() {
  return Array.from(this.children);
}
function g1(e) {
  return function() {
    return h1.call(this.children, e);
  };
}
function v1(e) {
  return this.selectAll(e == null ? p1 : g1(typeof e == "function" ? e : Fc(e)));
}
function m1(e) {
  typeof e != "function" && (e = Hc(e));
  for (var t = this._groups, n = t.length, o = new Array(n), r = 0; r < n; ++r)
    for (var a = t[r], i = a.length, s = o[r] = [], u, c = 0; c < i; ++c)
      (u = a[c]) && e.call(u, u.__data__, c, a) && s.push(u);
  return new Qe(o, this._parents);
}
function Gc(e) {
  return new Array(e.length);
}
function y1() {
  return new Qe(this._enter || this._groups.map(Gc), this._parents);
}
function tr(e, t) {
  this.ownerDocument = e.ownerDocument, this.namespaceURI = e.namespaceURI, this._next = null, this._parent = e, this.__data__ = t;
}
tr.prototype = {
  constructor: tr,
  appendChild: function(e) {
    return this._parent.insertBefore(e, this._next);
  },
  insertBefore: function(e, t) {
    return this._parent.insertBefore(e, t);
  },
  querySelector: function(e) {
    return this._parent.querySelector(e);
  },
  querySelectorAll: function(e) {
    return this._parent.querySelectorAll(e);
  }
};
function b1(e) {
  return function() {
    return e;
  };
}
function w1(e, t, n, o, r, a) {
  for (var i = 0, s, u = t.length, c = a.length; i < c; ++i)
    (s = t[i]) ? (s.__data__ = a[i], o[i] = s) : n[i] = new tr(e, a[i]);
  for (; i < u; ++i)
    (s = t[i]) && (r[i] = s);
}
function k1(e, t, n, o, r, a, i) {
  var s, u, c = /* @__PURE__ */ new Map(), l = t.length, d = a.length, f = new Array(l), h;
  for (s = 0; s < l; ++s)
    (u = t[s]) && (f[s] = h = i.call(u, u.__data__, s, t) + "", c.has(h) ? r[s] = u : c.set(h, u));
  for (s = 0; s < d; ++s)
    h = i.call(e, a[s], s, a) + "", (u = c.get(h)) ? (o[s] = u, u.__data__ = a[s], c.delete(h)) : n[s] = new tr(e, a[s]);
  for (s = 0; s < l; ++s)
    (u = t[s]) && c.get(f[s]) === u && (r[s] = u);
}
function _1(e) {
  return e.__data__;
}
function x1(e, t) {
  if (!arguments.length) return Array.from(this, _1);
  var n = t ? k1 : w1, o = this._parents, r = this._groups;
  typeof e != "function" && (e = b1(e));
  for (var a = r.length, i = new Array(a), s = new Array(a), u = new Array(a), c = 0; c < a; ++c) {
    var l = o[c], d = r[c], f = d.length, h = E1(e.call(l, l && l.__data__, c, o)), b = h.length, w = s[c] = new Array(b), m = i[c] = new Array(b), p = u[c] = new Array(f);
    n(l, d, w, m, p, h, t);
    for (var v = 0, g = 0, k, P; v < b; ++v)
      if (k = w[v]) {
        for (v >= g && (g = v + 1); !(P = m[g]) && ++g < b; ) ;
        k._next = P || null;
      }
  }
  return i = new Qe(i, o), i._enter = s, i._exit = u, i;
}
function E1(e) {
  return typeof e == "object" && "length" in e ? e : Array.from(e);
}
function $1() {
  return new Qe(this._exit || this._groups.map(Gc), this._parents);
}
function S1(e, t, n) {
  var o = this.enter(), r = this, a = this.exit();
  return typeof e == "function" ? (o = e(o), o && (o = o.selection())) : o = o.append(e + ""), t != null && (r = t(r), r && (r = r.selection())), n == null ? a.remove() : n(a), o && r ? o.merge(r).order() : r;
}
function C1(e) {
  for (var t = e.selection ? e.selection() : e, n = this._groups, o = t._groups, r = n.length, a = o.length, i = Math.min(r, a), s = new Array(r), u = 0; u < i; ++u)
    for (var c = n[u], l = o[u], d = c.length, f = s[u] = new Array(d), h, b = 0; b < d; ++b)
      (h = c[b] || l[b]) && (f[b] = h);
  for (; u < r; ++u)
    s[u] = n[u];
  return new Qe(s, this._parents);
}
function N1() {
  for (var e = this._groups, t = -1, n = e.length; ++t < n; )
    for (var o = e[t], r = o.length - 1, a = o[r], i; --r >= 0; )
      (i = o[r]) && (a && i.compareDocumentPosition(a) ^ 4 && a.parentNode.insertBefore(i, a), a = i);
  return this;
}
function M1(e) {
  e || (e = T1);
  function t(d, f) {
    return d && f ? e(d.__data__, f.__data__) : !d - !f;
  }
  for (var n = this._groups, o = n.length, r = new Array(o), a = 0; a < o; ++a) {
    for (var i = n[a], s = i.length, u = r[a] = new Array(s), c, l = 0; l < s; ++l)
      (c = i[l]) && (u[l] = c);
    u.sort(t);
  }
  return new Qe(r, this._parents).order();
}
function T1(e, t) {
  return e < t ? -1 : e > t ? 1 : e >= t ? 0 : NaN;
}
function I1() {
  var e = arguments[0];
  return arguments[0] = this, e.apply(null, arguments), this;
}
function D1() {
  return Array.from(this);
}
function A1() {
  for (var e = this._groups, t = 0, n = e.length; t < n; ++t)
    for (var o = e[t], r = 0, a = o.length; r < a; ++r) {
      var i = o[r];
      if (i) return i;
    }
  return null;
}
function P1() {
  let e = 0;
  for (const t of this) ++e;
  return e;
}
function O1() {
  return !this.node();
}
function R1(e) {
  for (var t = this._groups, n = 0, o = t.length; n < o; ++n)
    for (var r = t[n], a = 0, i = r.length, s; a < i; ++a)
      (s = r[a]) && e.call(s, s.__data__, a, r);
  return this;
}
function z1(e) {
  return function() {
    this.removeAttribute(e);
  };
}
function B1(e) {
  return function() {
    this.removeAttributeNS(e.space, e.local);
  };
}
function L1(e, t) {
  return function() {
    this.setAttribute(e, t);
  };
}
function V1(e, t) {
  return function() {
    this.setAttributeNS(e.space, e.local, t);
  };
}
function H1(e, t) {
  return function() {
    var n = t.apply(this, arguments);
    n == null ? this.removeAttribute(e) : this.setAttribute(e, n);
  };
}
function F1(e, t) {
  return function() {
    var n = t.apply(this, arguments);
    n == null ? this.removeAttributeNS(e.space, e.local) : this.setAttributeNS(e.space, e.local, n);
  };
}
function G1(e, t) {
  var n = kr(e);
  if (arguments.length < 2) {
    var o = this.node();
    return n.local ? o.getAttributeNS(n.space, n.local) : o.getAttribute(n);
  }
  return this.each((t == null ? n.local ? B1 : z1 : typeof t == "function" ? n.local ? F1 : H1 : n.local ? V1 : L1)(n, t));
}
function Yc(e) {
  return e.ownerDocument && e.ownerDocument.defaultView || e.document && e || e.defaultView;
}
function Y1(e) {
  return function() {
    this.style.removeProperty(e);
  };
}
function U1(e, t, n) {
  return function() {
    this.style.setProperty(e, t, n);
  };
}
function q1(e, t, n) {
  return function() {
    var o = t.apply(this, arguments);
    o == null ? this.style.removeProperty(e) : this.style.setProperty(e, o, n);
  };
}
function X1(e, t, n) {
  return arguments.length > 1 ? this.each((t == null ? Y1 : typeof t == "function" ? q1 : U1)(e, t, n ?? "")) : bn(this.node(), e);
}
function bn(e, t) {
  return e.style.getPropertyValue(t) || Yc(e).getComputedStyle(e, null).getPropertyValue(t);
}
function W1(e) {
  return function() {
    delete this[e];
  };
}
function K1(e, t) {
  return function() {
    this[e] = t;
  };
}
function j1(e, t) {
  return function() {
    var n = t.apply(this, arguments);
    n == null ? delete this[e] : this[e] = n;
  };
}
function Z1(e, t) {
  return arguments.length > 1 ? this.each((t == null ? W1 : typeof t == "function" ? j1 : K1)(e, t)) : this.node()[e];
}
function Uc(e) {
  return e.trim().split(/^|\s+/);
}
function Ha(e) {
  return e.classList || new qc(e);
}
function qc(e) {
  this._node = e, this._names = Uc(e.getAttribute("class") || "");
}
qc.prototype = {
  add: function(e) {
    var t = this._names.indexOf(e);
    t < 0 && (this._names.push(e), this._node.setAttribute("class", this._names.join(" ")));
  },
  remove: function(e) {
    var t = this._names.indexOf(e);
    t >= 0 && (this._names.splice(t, 1), this._node.setAttribute("class", this._names.join(" ")));
  },
  contains: function(e) {
    return this._names.indexOf(e) >= 0;
  }
};
function Xc(e, t) {
  for (var n = Ha(e), o = -1, r = t.length; ++o < r; ) n.add(t[o]);
}
function Wc(e, t) {
  for (var n = Ha(e), o = -1, r = t.length; ++o < r; ) n.remove(t[o]);
}
function J1(e) {
  return function() {
    Xc(this, e);
  };
}
function Q1(e) {
  return function() {
    Wc(this, e);
  };
}
function eb(e, t) {
  return function() {
    (t.apply(this, arguments) ? Xc : Wc)(this, e);
  };
}
function tb(e, t) {
  var n = Uc(e + "");
  if (arguments.length < 2) {
    for (var o = Ha(this.node()), r = -1, a = n.length; ++r < a; ) if (!o.contains(n[r])) return !1;
    return !0;
  }
  return this.each((typeof t == "function" ? eb : t ? J1 : Q1)(n, t));
}
function nb() {
  this.textContent = "";
}
function ob(e) {
  return function() {
    this.textContent = e;
  };
}
function rb(e) {
  return function() {
    var t = e.apply(this, arguments);
    this.textContent = t ?? "";
  };
}
function ib(e) {
  return arguments.length ? this.each(e == null ? nb : (typeof e == "function" ? rb : ob)(e)) : this.node().textContent;
}
function ab() {
  this.innerHTML = "";
}
function sb(e) {
  return function() {
    this.innerHTML = e;
  };
}
function lb(e) {
  return function() {
    var t = e.apply(this, arguments);
    this.innerHTML = t ?? "";
  };
}
function ub(e) {
  return arguments.length ? this.each(e == null ? ab : (typeof e == "function" ? lb : sb)(e)) : this.node().innerHTML;
}
function cb() {
  this.nextSibling && this.parentNode.appendChild(this);
}
function db() {
  return this.each(cb);
}
function fb() {
  this.previousSibling && this.parentNode.insertBefore(this, this.parentNode.firstChild);
}
function hb() {
  return this.each(fb);
}
function pb(e) {
  var t = typeof e == "function" ? e : Lc(e);
  return this.select(function() {
    return this.appendChild(t.apply(this, arguments));
  });
}
function gb() {
  return null;
}
function vb(e, t) {
  var n = typeof e == "function" ? e : Lc(e), o = t == null ? gb : typeof t == "function" ? t : Va(t);
  return this.select(function() {
    return this.insertBefore(n.apply(this, arguments), o.apply(this, arguments) || null);
  });
}
function mb() {
  var e = this.parentNode;
  e && e.removeChild(this);
}
function yb() {
  return this.each(mb);
}
function bb() {
  var e = this.cloneNode(!1), t = this.parentNode;
  return t ? t.insertBefore(e, this.nextSibling) : e;
}
function wb() {
  var e = this.cloneNode(!0), t = this.parentNode;
  return t ? t.insertBefore(e, this.nextSibling) : e;
}
function kb(e) {
  return this.select(e ? wb : bb);
}
function _b(e) {
  return arguments.length ? this.property("__data__", e) : this.node().__data__;
}
function xb(e) {
  return function(t) {
    e.call(this, t, this.__data__);
  };
}
function Eb(e) {
  return e.trim().split(/^|\s+/).map(function(t) {
    var n = "", o = t.indexOf(".");
    return o >= 0 && (n = t.slice(o + 1), t = t.slice(0, o)), { type: t, name: n };
  });
}
function $b(e) {
  return function() {
    var t = this.__on;
    if (t) {
      for (var n = 0, o = -1, r = t.length, a; n < r; ++n)
        a = t[n], (!e.type || a.type === e.type) && a.name === e.name ? this.removeEventListener(a.type, a.listener, a.options) : t[++o] = a;
      ++o ? t.length = o : delete this.__on;
    }
  };
}
function Sb(e, t, n) {
  return function() {
    var o = this.__on, r, a = xb(t);
    if (o) {
      for (var i = 0, s = o.length; i < s; ++i)
        if ((r = o[i]).type === e.type && r.name === e.name) {
          this.removeEventListener(r.type, r.listener, r.options), this.addEventListener(r.type, r.listener = a, r.options = n), r.value = t;
          return;
        }
    }
    this.addEventListener(e.type, a, n), r = { type: e.type, name: e.name, value: t, listener: a, options: n }, o ? o.push(r) : this.__on = [r];
  };
}
function Cb(e, t, n) {
  var o = Eb(e + ""), r, a = o.length, i;
  if (arguments.length < 2) {
    var s = this.node().__on;
    if (s) {
      for (var u = 0, c = s.length, l; u < c; ++u)
        for (r = 0, l = s[u]; r < a; ++r)
          if ((i = o[r]).type === l.type && i.name === l.name)
            return l.value;
    }
    return;
  }
  for (s = t ? Sb : $b, r = 0; r < a; ++r) this.each(s(o[r], t, n));
  return this;
}
function Kc(e, t, n) {
  var o = Yc(e), r = o.CustomEvent;
  typeof r == "function" ? r = new r(t, n) : (r = o.document.createEvent("Event"), n ? (r.initEvent(t, n.bubbles, n.cancelable), r.detail = n.detail) : r.initEvent(t, !1, !1)), e.dispatchEvent(r);
}
function Nb(e, t) {
  return function() {
    return Kc(this, e, t);
  };
}
function Mb(e, t) {
  return function() {
    return Kc(this, e, t.apply(this, arguments));
  };
}
function Tb(e, t) {
  return this.each((typeof t == "function" ? Mb : Nb)(e, t));
}
function* Ib() {
  for (var e = this._groups, t = 0, n = e.length; t < n; ++t)
    for (var o = e[t], r = 0, a = o.length, i; r < a; ++r)
      (i = o[r]) && (yield i);
}
var jc = [null];
function Qe(e, t) {
  this._groups = e, this._parents = t;
}
function so() {
  return new Qe([[document.documentElement]], jc);
}
function Db() {
  return this;
}
Qe.prototype = so.prototype = {
  constructor: Qe,
  select: r1,
  selectAll: l1,
  selectChild: f1,
  selectChildren: v1,
  filter: m1,
  data: x1,
  enter: y1,
  exit: $1,
  join: S1,
  merge: C1,
  selection: Db,
  order: N1,
  sort: M1,
  call: I1,
  nodes: D1,
  node: A1,
  size: P1,
  empty: O1,
  each: R1,
  attr: G1,
  style: X1,
  property: Z1,
  classed: tb,
  text: ib,
  html: ub,
  raise: db,
  lower: hb,
  append: pb,
  insert: vb,
  remove: yb,
  clone: kb,
  datum: _b,
  on: Cb,
  dispatch: Tb,
  [Symbol.iterator]: Ib
};
function Ot(e) {
  return typeof e == "string" ? new Qe([[document.querySelector(e)]], [document.documentElement]) : new Qe([[e]], jc);
}
function Ab(e) {
  let t;
  for (; t = e.sourceEvent; ) e = t;
  return e;
}
function Dt(e, t) {
  if (e = Ab(e), t === void 0 && (t = e.currentTarget), t) {
    var n = t.ownerSVGElement || t;
    if (n.createSVGPoint) {
      var o = n.createSVGPoint();
      return o.x = e.clientX, o.y = e.clientY, o = o.matrixTransform(t.getScreenCTM().inverse()), [o.x, o.y];
    }
    if (t.getBoundingClientRect) {
      var r = t.getBoundingClientRect();
      return [e.clientX - r.left - t.clientLeft, e.clientY - r.top - t.clientTop];
    }
  }
  return [e.pageX, e.pageY];
}
const ca = { capture: !0, passive: !1 };
function da(e) {
  e.preventDefault(), e.stopImmediatePropagation();
}
function Pb(e) {
  var t = e.document.documentElement, n = Ot(e).on("dragstart.drag", da, ca);
  "onselectstart" in t ? n.on("selectstart.drag", da, ca) : (t.__noselect = t.style.MozUserSelect, t.style.MozUserSelect = "none");
}
function Ob(e, t) {
  var n = e.document.documentElement, o = Ot(e).on("dragstart.drag", null);
  t && (o.on("click.drag", da, ca), setTimeout(function() {
    o.on("click.drag", null);
  }, 0)), "onselectstart" in n ? o.on("selectstart.drag", null) : (n.style.MozUserSelect = n.__noselect, delete n.__noselect);
}
function Fa(e, t, n) {
  e.prototype = t.prototype = n, n.constructor = e;
}
function Zc(e, t) {
  var n = Object.create(e.prototype);
  for (var o in t) n[o] = t[o];
  return n;
}
function lo() {
}
var Qn = 0.7, nr = 1 / Qn, pn = "\\s*([+-]?\\d+)\\s*", eo = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)\\s*", vt = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)%\\s*", Rb = /^#([0-9a-f]{3,8})$/, zb = new RegExp(`^rgb\\(${pn},${pn},${pn}\\)$`), Bb = new RegExp(`^rgb\\(${vt},${vt},${vt}\\)$`), Lb = new RegExp(`^rgba\\(${pn},${pn},${pn},${eo}\\)$`), Vb = new RegExp(`^rgba\\(${vt},${vt},${vt},${eo}\\)$`), Hb = new RegExp(`^hsl\\(${eo},${vt},${vt}\\)$`), Fb = new RegExp(`^hsla\\(${eo},${vt},${vt},${eo}\\)$`), nl = {
  aliceblue: 15792383,
  antiquewhite: 16444375,
  aqua: 65535,
  aquamarine: 8388564,
  azure: 15794175,
  beige: 16119260,
  bisque: 16770244,
  black: 0,
  blanchedalmond: 16772045,
  blue: 255,
  blueviolet: 9055202,
  brown: 10824234,
  burlywood: 14596231,
  cadetblue: 6266528,
  chartreuse: 8388352,
  chocolate: 13789470,
  coral: 16744272,
  cornflowerblue: 6591981,
  cornsilk: 16775388,
  crimson: 14423100,
  cyan: 65535,
  darkblue: 139,
  darkcyan: 35723,
  darkgoldenrod: 12092939,
  darkgray: 11119017,
  darkgreen: 25600,
  darkgrey: 11119017,
  darkkhaki: 12433259,
  darkmagenta: 9109643,
  darkolivegreen: 5597999,
  darkorange: 16747520,
  darkorchid: 10040012,
  darkred: 9109504,
  darksalmon: 15308410,
  darkseagreen: 9419919,
  darkslateblue: 4734347,
  darkslategray: 3100495,
  darkslategrey: 3100495,
  darkturquoise: 52945,
  darkviolet: 9699539,
  deeppink: 16716947,
  deepskyblue: 49151,
  dimgray: 6908265,
  dimgrey: 6908265,
  dodgerblue: 2003199,
  firebrick: 11674146,
  floralwhite: 16775920,
  forestgreen: 2263842,
  fuchsia: 16711935,
  gainsboro: 14474460,
  ghostwhite: 16316671,
  gold: 16766720,
  goldenrod: 14329120,
  gray: 8421504,
  green: 32768,
  greenyellow: 11403055,
  grey: 8421504,
  honeydew: 15794160,
  hotpink: 16738740,
  indianred: 13458524,
  indigo: 4915330,
  ivory: 16777200,
  khaki: 15787660,
  lavender: 15132410,
  lavenderblush: 16773365,
  lawngreen: 8190976,
  lemonchiffon: 16775885,
  lightblue: 11393254,
  lightcoral: 15761536,
  lightcyan: 14745599,
  lightgoldenrodyellow: 16448210,
  lightgray: 13882323,
  lightgreen: 9498256,
  lightgrey: 13882323,
  lightpink: 16758465,
  lightsalmon: 16752762,
  lightseagreen: 2142890,
  lightskyblue: 8900346,
  lightslategray: 7833753,
  lightslategrey: 7833753,
  lightsteelblue: 11584734,
  lightyellow: 16777184,
  lime: 65280,
  limegreen: 3329330,
  linen: 16445670,
  magenta: 16711935,
  maroon: 8388608,
  mediumaquamarine: 6737322,
  mediumblue: 205,
  mediumorchid: 12211667,
  mediumpurple: 9662683,
  mediumseagreen: 3978097,
  mediumslateblue: 8087790,
  mediumspringgreen: 64154,
  mediumturquoise: 4772300,
  mediumvioletred: 13047173,
  midnightblue: 1644912,
  mintcream: 16121850,
  mistyrose: 16770273,
  moccasin: 16770229,
  navajowhite: 16768685,
  navy: 128,
  oldlace: 16643558,
  olive: 8421376,
  olivedrab: 7048739,
  orange: 16753920,
  orangered: 16729344,
  orchid: 14315734,
  palegoldenrod: 15657130,
  palegreen: 10025880,
  paleturquoise: 11529966,
  palevioletred: 14381203,
  papayawhip: 16773077,
  peachpuff: 16767673,
  peru: 13468991,
  pink: 16761035,
  plum: 14524637,
  powderblue: 11591910,
  purple: 8388736,
  rebeccapurple: 6697881,
  red: 16711680,
  rosybrown: 12357519,
  royalblue: 4286945,
  saddlebrown: 9127187,
  salmon: 16416882,
  sandybrown: 16032864,
  seagreen: 3050327,
  seashell: 16774638,
  sienna: 10506797,
  silver: 12632256,
  skyblue: 8900331,
  slateblue: 6970061,
  slategray: 7372944,
  slategrey: 7372944,
  snow: 16775930,
  springgreen: 65407,
  steelblue: 4620980,
  tan: 13808780,
  teal: 32896,
  thistle: 14204888,
  tomato: 16737095,
  turquoise: 4251856,
  violet: 15631086,
  wheat: 16113331,
  white: 16777215,
  whitesmoke: 16119285,
  yellow: 16776960,
  yellowgreen: 10145074
};
Fa(lo, to, {
  copy(e) {
    return Object.assign(new this.constructor(), this, e);
  },
  displayable() {
    return this.rgb().displayable();
  },
  hex: ol,
  // Deprecated! Use color.formatHex.
  formatHex: ol,
  formatHex8: Gb,
  formatHsl: Yb,
  formatRgb: rl,
  toString: rl
});
function ol() {
  return this.rgb().formatHex();
}
function Gb() {
  return this.rgb().formatHex8();
}
function Yb() {
  return Jc(this).formatHsl();
}
function rl() {
  return this.rgb().formatRgb();
}
function to(e) {
  var t, n;
  return e = (e + "").trim().toLowerCase(), (t = Rb.exec(e)) ? (n = t[1].length, t = parseInt(t[1], 16), n === 6 ? il(t) : n === 3 ? new We(t >> 8 & 15 | t >> 4 & 240, t >> 4 & 15 | t & 240, (t & 15) << 4 | t & 15, 1) : n === 8 ? So(t >> 24 & 255, t >> 16 & 255, t >> 8 & 255, (t & 255) / 255) : n === 4 ? So(t >> 12 & 15 | t >> 8 & 240, t >> 8 & 15 | t >> 4 & 240, t >> 4 & 15 | t & 240, ((t & 15) << 4 | t & 15) / 255) : null) : (t = zb.exec(e)) ? new We(t[1], t[2], t[3], 1) : (t = Bb.exec(e)) ? new We(t[1] * 255 / 100, t[2] * 255 / 100, t[3] * 255 / 100, 1) : (t = Lb.exec(e)) ? So(t[1], t[2], t[3], t[4]) : (t = Vb.exec(e)) ? So(t[1] * 255 / 100, t[2] * 255 / 100, t[3] * 255 / 100, t[4]) : (t = Hb.exec(e)) ? ll(t[1], t[2] / 100, t[3] / 100, 1) : (t = Fb.exec(e)) ? ll(t[1], t[2] / 100, t[3] / 100, t[4]) : nl.hasOwnProperty(e) ? il(nl[e]) : e === "transparent" ? new We(NaN, NaN, NaN, 0) : null;
}
function il(e) {
  return new We(e >> 16 & 255, e >> 8 & 255, e & 255, 1);
}
function So(e, t, n, o) {
  return o <= 0 && (e = t = n = NaN), new We(e, t, n, o);
}
function Ub(e) {
  return e instanceof lo || (e = to(e)), e ? (e = e.rgb(), new We(e.r, e.g, e.b, e.opacity)) : new We();
}
function fa(e, t, n, o) {
  return arguments.length === 1 ? Ub(e) : new We(e, t, n, o ?? 1);
}
function We(e, t, n, o) {
  this.r = +e, this.g = +t, this.b = +n, this.opacity = +o;
}
Fa(We, fa, Zc(lo, {
  brighter(e) {
    return e = e == null ? nr : Math.pow(nr, e), new We(this.r * e, this.g * e, this.b * e, this.opacity);
  },
  darker(e) {
    return e = e == null ? Qn : Math.pow(Qn, e), new We(this.r * e, this.g * e, this.b * e, this.opacity);
  },
  rgb() {
    return this;
  },
  clamp() {
    return new We(jt(this.r), jt(this.g), jt(this.b), or(this.opacity));
  },
  displayable() {
    return -0.5 <= this.r && this.r < 255.5 && -0.5 <= this.g && this.g < 255.5 && -0.5 <= this.b && this.b < 255.5 && 0 <= this.opacity && this.opacity <= 1;
  },
  hex: al,
  // Deprecated! Use color.formatHex.
  formatHex: al,
  formatHex8: qb,
  formatRgb: sl,
  toString: sl
}));
function al() {
  return `#${qt(this.r)}${qt(this.g)}${qt(this.b)}`;
}
function qb() {
  return `#${qt(this.r)}${qt(this.g)}${qt(this.b)}${qt((isNaN(this.opacity) ? 1 : this.opacity) * 255)}`;
}
function sl() {
  const e = or(this.opacity);
  return `${e === 1 ? "rgb(" : "rgba("}${jt(this.r)}, ${jt(this.g)}, ${jt(this.b)}${e === 1 ? ")" : `, ${e})`}`;
}
function or(e) {
  return isNaN(e) ? 1 : Math.max(0, Math.min(1, e));
}
function jt(e) {
  return Math.max(0, Math.min(255, Math.round(e) || 0));
}
function qt(e) {
  return e = jt(e), (e < 16 ? "0" : "") + e.toString(16);
}
function ll(e, t, n, o) {
  return o <= 0 ? e = t = n = NaN : n <= 0 || n >= 1 ? e = t = NaN : t <= 0 && (e = NaN), new nt(e, t, n, o);
}
function Jc(e) {
  if (e instanceof nt) return new nt(e.h, e.s, e.l, e.opacity);
  if (e instanceof lo || (e = to(e)), !e) return new nt();
  if (e instanceof nt) return e;
  e = e.rgb();
  var t = e.r / 255, n = e.g / 255, o = e.b / 255, r = Math.min(t, n, o), a = Math.max(t, n, o), i = NaN, s = a - r, u = (a + r) / 2;
  return s ? (t === a ? i = (n - o) / s + (n < o) * 6 : n === a ? i = (o - t) / s + 2 : i = (t - n) / s + 4, s /= u < 0.5 ? a + r : 2 - a - r, i *= 60) : s = u > 0 && u < 1 ? 0 : i, new nt(i, s, u, e.opacity);
}
function Xb(e, t, n, o) {
  return arguments.length === 1 ? Jc(e) : new nt(e, t, n, o ?? 1);
}
function nt(e, t, n, o) {
  this.h = +e, this.s = +t, this.l = +n, this.opacity = +o;
}
Fa(nt, Xb, Zc(lo, {
  brighter(e) {
    return e = e == null ? nr : Math.pow(nr, e), new nt(this.h, this.s, this.l * e, this.opacity);
  },
  darker(e) {
    return e = e == null ? Qn : Math.pow(Qn, e), new nt(this.h, this.s, this.l * e, this.opacity);
  },
  rgb() {
    var e = this.h % 360 + (this.h < 0) * 360, t = isNaN(e) || isNaN(this.s) ? 0 : this.s, n = this.l, o = n + (n < 0.5 ? n : 1 - n) * t, r = 2 * n - o;
    return new We(
      Kr(e >= 240 ? e - 240 : e + 120, r, o),
      Kr(e, r, o),
      Kr(e < 120 ? e + 240 : e - 120, r, o),
      this.opacity
    );
  },
  clamp() {
    return new nt(ul(this.h), Co(this.s), Co(this.l), or(this.opacity));
  },
  displayable() {
    return (0 <= this.s && this.s <= 1 || isNaN(this.s)) && 0 <= this.l && this.l <= 1 && 0 <= this.opacity && this.opacity <= 1;
  },
  formatHsl() {
    const e = or(this.opacity);
    return `${e === 1 ? "hsl(" : "hsla("}${ul(this.h)}, ${Co(this.s) * 100}%, ${Co(this.l) * 100}%${e === 1 ? ")" : `, ${e})`}`;
  }
}));
function ul(e) {
  return e = (e || 0) % 360, e < 0 ? e + 360 : e;
}
function Co(e) {
  return Math.max(0, Math.min(1, e || 0));
}
function Kr(e, t, n) {
  return (e < 60 ? t + (n - t) * e / 60 : e < 180 ? n : e < 240 ? t + (n - t) * (240 - e) / 60 : t) * 255;
}
const Qc = (e) => () => e;
function Wb(e, t) {
  return function(n) {
    return e + n * t;
  };
}
function Kb(e, t, n) {
  return e = Math.pow(e, n), t = Math.pow(t, n) - e, n = 1 / n, function(o) {
    return Math.pow(e + o * t, n);
  };
}
function jb(e) {
  return (e = +e) == 1 ? ed : function(t, n) {
    return n - t ? Kb(t, n, e) : Qc(isNaN(t) ? n : t);
  };
}
function ed(e, t) {
  var n = t - e;
  return n ? Wb(e, n) : Qc(isNaN(e) ? t : e);
}
const cl = (function e(t) {
  var n = jb(t);
  function o(r, a) {
    var i = n((r = fa(r)).r, (a = fa(a)).r), s = n(r.g, a.g), u = n(r.b, a.b), c = ed(r.opacity, a.opacity);
    return function(l) {
      return r.r = i(l), r.g = s(l), r.b = u(l), r.opacity = c(l), r + "";
    };
  }
  return o.gamma = e, o;
})(1);
function Pt(e, t) {
  return e = +e, t = +t, function(n) {
    return e * (1 - n) + t * n;
  };
}
var ha = /[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g, jr = new RegExp(ha.source, "g");
function Zb(e) {
  return function() {
    return e;
  };
}
function Jb(e) {
  return function(t) {
    return e(t) + "";
  };
}
function Qb(e, t) {
  var n = ha.lastIndex = jr.lastIndex = 0, o, r, a, i = -1, s = [], u = [];
  for (e = e + "", t = t + ""; (o = ha.exec(e)) && (r = jr.exec(t)); )
    (a = r.index) > n && (a = t.slice(n, a), s[i] ? s[i] += a : s[++i] = a), (o = o[0]) === (r = r[0]) ? s[i] ? s[i] += r : s[++i] = r : (s[++i] = null, u.push({ i, x: Pt(o, r) })), n = jr.lastIndex;
  return n < t.length && (a = t.slice(n), s[i] ? s[i] += a : s[++i] = a), s.length < 2 ? u[0] ? Jb(u[0].x) : Zb(t) : (t = u.length, function(c) {
    for (var l = 0, d; l < t; ++l) s[(d = u[l]).i] = d.x(c);
    return s.join("");
  });
}
var dl = 180 / Math.PI, pa = {
  translateX: 0,
  translateY: 0,
  rotate: 0,
  skewX: 0,
  scaleX: 1,
  scaleY: 1
};
function td(e, t, n, o, r, a) {
  var i, s, u;
  return (i = Math.sqrt(e * e + t * t)) && (e /= i, t /= i), (u = e * n + t * o) && (n -= e * u, o -= t * u), (s = Math.sqrt(n * n + o * o)) && (n /= s, o /= s, u /= s), e * o < t * n && (e = -e, t = -t, u = -u, i = -i), {
    translateX: r,
    translateY: a,
    rotate: Math.atan2(t, e) * dl,
    skewX: Math.atan(u) * dl,
    scaleX: i,
    scaleY: s
  };
}
var No;
function ew(e) {
  const t = new (typeof DOMMatrix == "function" ? DOMMatrix : WebKitCSSMatrix)(e + "");
  return t.isIdentity ? pa : td(t.a, t.b, t.c, t.d, t.e, t.f);
}
function tw(e) {
  return e == null || (No || (No = document.createElementNS("http://www.w3.org/2000/svg", "g")), No.setAttribute("transform", e), !(e = No.transform.baseVal.consolidate())) ? pa : (e = e.matrix, td(e.a, e.b, e.c, e.d, e.e, e.f));
}
function nd(e, t, n, o) {
  function r(c) {
    return c.length ? c.pop() + " " : "";
  }
  function a(c, l, d, f, h, b) {
    if (c !== d || l !== f) {
      var w = h.push("translate(", null, t, null, n);
      b.push({ i: w - 4, x: Pt(c, d) }, { i: w - 2, x: Pt(l, f) });
    } else (d || f) && h.push("translate(" + d + t + f + n);
  }
  function i(c, l, d, f) {
    c !== l ? (c - l > 180 ? l += 360 : l - c > 180 && (c += 360), f.push({ i: d.push(r(d) + "rotate(", null, o) - 2, x: Pt(c, l) })) : l && d.push(r(d) + "rotate(" + l + o);
  }
  function s(c, l, d, f) {
    c !== l ? f.push({ i: d.push(r(d) + "skewX(", null, o) - 2, x: Pt(c, l) }) : l && d.push(r(d) + "skewX(" + l + o);
  }
  function u(c, l, d, f, h, b) {
    if (c !== d || l !== f) {
      var w = h.push(r(h) + "scale(", null, ",", null, ")");
      b.push({ i: w - 4, x: Pt(c, d) }, { i: w - 2, x: Pt(l, f) });
    } else (d !== 1 || f !== 1) && h.push(r(h) + "scale(" + d + "," + f + ")");
  }
  return function(c, l) {
    var d = [], f = [];
    return c = e(c), l = e(l), a(c.translateX, c.translateY, l.translateX, l.translateY, d, f), i(c.rotate, l.rotate, d, f), s(c.skewX, l.skewX, d, f), u(c.scaleX, c.scaleY, l.scaleX, l.scaleY, d, f), c = l = null, function(h) {
      for (var b = -1, w = f.length, m; ++b < w; ) d[(m = f[b]).i] = m.x(h);
      return d.join("");
    };
  };
}
var nw = nd(ew, "px, ", "px)", "deg)"), ow = nd(tw, ", ", ")", ")"), rw = 1e-12;
function fl(e) {
  return ((e = Math.exp(e)) + 1 / e) / 2;
}
function iw(e) {
  return ((e = Math.exp(e)) - 1 / e) / 2;
}
function aw(e) {
  return ((e = Math.exp(2 * e)) - 1) / (e + 1);
}
const sw = (function e(t, n, o) {
  function r(a, i) {
    var s = a[0], u = a[1], c = a[2], l = i[0], d = i[1], f = i[2], h = l - s, b = d - u, w = h * h + b * b, m, p;
    if (w < rw)
      p = Math.log(f / c) / t, m = function(K) {
        return [
          s + K * h,
          u + K * b,
          c * Math.exp(t * K * p)
        ];
      };
    else {
      var v = Math.sqrt(w), g = (f * f - c * c + o * w) / (2 * c * n * v), k = (f * f - c * c - o * w) / (2 * f * n * v), P = Math.log(Math.sqrt(g * g + 1) - g), F = Math.log(Math.sqrt(k * k + 1) - k);
      p = (F - P) / t, m = function(K) {
        var C = K * p, N = fl(P), M = c / (n * v) * (N * aw(t * C + P) - iw(P));
        return [
          s + M * h,
          u + M * b,
          c * N / fl(t * C + P)
        ];
      };
    }
    return m.duration = p * 1e3 * t / Math.SQRT2, m;
  }
  return r.rho = function(a) {
    var i = Math.max(1e-3, +a), s = i * i, u = s * s;
    return e(i, s, u);
  }, r;
})(Math.SQRT2, 2, 4);
var wn = 0, On = 0, Tn = 0, od = 1e3, rr, Rn, ir = 0, en = 0, _r = 0, no = typeof performance == "object" && performance.now ? performance : Date, rd = typeof window == "object" && window.requestAnimationFrame ? window.requestAnimationFrame.bind(window) : function(e) {
  setTimeout(e, 17);
};
function Ga() {
  return en || (rd(lw), en = no.now() + _r);
}
function lw() {
  en = 0;
}
function ar() {
  this._call = this._time = this._next = null;
}
ar.prototype = id.prototype = {
  constructor: ar,
  restart: function(e, t, n) {
    if (typeof e != "function") throw new TypeError("callback is not a function");
    n = (n == null ? Ga() : +n) + (t == null ? 0 : +t), !this._next && Rn !== this && (Rn ? Rn._next = this : rr = this, Rn = this), this._call = e, this._time = n, ga();
  },
  stop: function() {
    this._call && (this._call = null, this._time = 1 / 0, ga());
  }
};
function id(e, t, n) {
  var o = new ar();
  return o.restart(e, t, n), o;
}
function uw() {
  Ga(), ++wn;
  for (var e = rr, t; e; )
    (t = en - e._time) >= 0 && e._call.call(void 0, t), e = e._next;
  --wn;
}
function hl() {
  en = (ir = no.now()) + _r, wn = On = 0;
  try {
    uw();
  } finally {
    wn = 0, dw(), en = 0;
  }
}
function cw() {
  var e = no.now(), t = e - ir;
  t > od && (_r -= t, ir = e);
}
function dw() {
  for (var e, t = rr, n, o = 1 / 0; t; )
    t._call ? (o > t._time && (o = t._time), e = t, t = t._next) : (n = t._next, t._next = null, t = e ? e._next = n : rr = n);
  Rn = e, ga(o);
}
function ga(e) {
  if (!wn) {
    On && (On = clearTimeout(On));
    var t = e - en;
    t > 24 ? (e < 1 / 0 && (On = setTimeout(hl, e - no.now() - _r)), Tn && (Tn = clearInterval(Tn))) : (Tn || (ir = no.now(), Tn = setInterval(cw, od)), wn = 1, rd(hl));
  }
}
function pl(e, t, n) {
  var o = new ar();
  return t = t == null ? 0 : +t, o.restart((r) => {
    o.stop(), e(r + t);
  }, t, n), o;
}
var fw = La("start", "end", "cancel", "interrupt"), hw = [], ad = 0, gl = 1, va = 2, Vo = 3, vl = 4, ma = 5, Ho = 6;
function xr(e, t, n, o, r, a) {
  var i = e.__transition;
  if (!i) e.__transition = {};
  else if (n in i) return;
  pw(e, n, {
    name: t,
    index: o,
    // For context during callback.
    group: r,
    // For context during callback.
    on: fw,
    tween: hw,
    time: a.time,
    delay: a.delay,
    duration: a.duration,
    ease: a.ease,
    timer: null,
    state: ad
  });
}
function Ya(e, t) {
  var n = st(e, t);
  if (n.state > ad) throw new Error("too late; already scheduled");
  return n;
}
function yt(e, t) {
  var n = st(e, t);
  if (n.state > Vo) throw new Error("too late; already running");
  return n;
}
function st(e, t) {
  var n = e.__transition;
  if (!n || !(n = n[t])) throw new Error("transition not found");
  return n;
}
function pw(e, t, n) {
  var o = e.__transition, r;
  o[t] = n, n.timer = id(a, 0, n.time);
  function a(c) {
    n.state = gl, n.timer.restart(i, n.delay, n.time), n.delay <= c && i(c - n.delay);
  }
  function i(c) {
    var l, d, f, h;
    if (n.state !== gl) return u();
    for (l in o)
      if (h = o[l], h.name === n.name) {
        if (h.state === Vo) return pl(i);
        h.state === vl ? (h.state = Ho, h.timer.stop(), h.on.call("interrupt", e, e.__data__, h.index, h.group), delete o[l]) : +l < t && (h.state = Ho, h.timer.stop(), h.on.call("cancel", e, e.__data__, h.index, h.group), delete o[l]);
      }
    if (pl(function() {
      n.state === Vo && (n.state = vl, n.timer.restart(s, n.delay, n.time), s(c));
    }), n.state = va, n.on.call("start", e, e.__data__, n.index, n.group), n.state === va) {
      for (n.state = Vo, r = new Array(f = n.tween.length), l = 0, d = -1; l < f; ++l)
        (h = n.tween[l].value.call(e, e.__data__, n.index, n.group)) && (r[++d] = h);
      r.length = d + 1;
    }
  }
  function s(c) {
    for (var l = c < n.duration ? n.ease.call(null, c / n.duration) : (n.timer.restart(u), n.state = ma, 1), d = -1, f = r.length; ++d < f; )
      r[d].call(e, l);
    n.state === ma && (n.on.call("end", e, e.__data__, n.index, n.group), u());
  }
  function u() {
    n.state = Ho, n.timer.stop(), delete o[t];
    for (var c in o) return;
    delete e.__transition;
  }
}
function Fo(e, t) {
  var n = e.__transition, o, r, a = !0, i;
  if (n) {
    t = t == null ? null : t + "";
    for (i in n) {
      if ((o = n[i]).name !== t) {
        a = !1;
        continue;
      }
      r = o.state > va && o.state < ma, o.state = Ho, o.timer.stop(), o.on.call(r ? "interrupt" : "cancel", e, e.__data__, o.index, o.group), delete n[i];
    }
    a && delete e.__transition;
  }
}
function gw(e) {
  return this.each(function() {
    Fo(this, e);
  });
}
function vw(e, t) {
  var n, o;
  return function() {
    var r = yt(this, e), a = r.tween;
    if (a !== n) {
      o = n = a;
      for (var i = 0, s = o.length; i < s; ++i)
        if (o[i].name === t) {
          o = o.slice(), o.splice(i, 1);
          break;
        }
    }
    r.tween = o;
  };
}
function mw(e, t, n) {
  var o, r;
  if (typeof n != "function") throw new Error();
  return function() {
    var a = yt(this, e), i = a.tween;
    if (i !== o) {
      r = (o = i).slice();
      for (var s = { name: t, value: n }, u = 0, c = r.length; u < c; ++u)
        if (r[u].name === t) {
          r[u] = s;
          break;
        }
      u === c && r.push(s);
    }
    a.tween = r;
  };
}
function yw(e, t) {
  var n = this._id;
  if (e += "", arguments.length < 2) {
    for (var o = st(this.node(), n).tween, r = 0, a = o.length, i; r < a; ++r)
      if ((i = o[r]).name === e)
        return i.value;
    return null;
  }
  return this.each((t == null ? vw : mw)(n, e, t));
}
function Ua(e, t, n) {
  var o = e._id;
  return e.each(function() {
    var r = yt(this, o);
    (r.value || (r.value = {}))[t] = n.apply(this, arguments);
  }), function(r) {
    return st(r, o).value[t];
  };
}
function sd(e, t) {
  var n;
  return (typeof t == "number" ? Pt : t instanceof to ? cl : (n = to(t)) ? (t = n, cl) : Qb)(e, t);
}
function bw(e) {
  return function() {
    this.removeAttribute(e);
  };
}
function ww(e) {
  return function() {
    this.removeAttributeNS(e.space, e.local);
  };
}
function kw(e, t, n) {
  var o, r = n + "", a;
  return function() {
    var i = this.getAttribute(e);
    return i === r ? null : i === o ? a : a = t(o = i, n);
  };
}
function _w(e, t, n) {
  var o, r = n + "", a;
  return function() {
    var i = this.getAttributeNS(e.space, e.local);
    return i === r ? null : i === o ? a : a = t(o = i, n);
  };
}
function xw(e, t, n) {
  var o, r, a;
  return function() {
    var i, s = n(this), u;
    return s == null ? void this.removeAttribute(e) : (i = this.getAttribute(e), u = s + "", i === u ? null : i === o && u === r ? a : (r = u, a = t(o = i, s)));
  };
}
function Ew(e, t, n) {
  var o, r, a;
  return function() {
    var i, s = n(this), u;
    return s == null ? void this.removeAttributeNS(e.space, e.local) : (i = this.getAttributeNS(e.space, e.local), u = s + "", i === u ? null : i === o && u === r ? a : (r = u, a = t(o = i, s)));
  };
}
function $w(e, t) {
  var n = kr(e), o = n === "transform" ? ow : sd;
  return this.attrTween(e, typeof t == "function" ? (n.local ? Ew : xw)(n, o, Ua(this, "attr." + e, t)) : t == null ? (n.local ? ww : bw)(n) : (n.local ? _w : kw)(n, o, t));
}
function Sw(e, t) {
  return function(n) {
    this.setAttribute(e, t.call(this, n));
  };
}
function Cw(e, t) {
  return function(n) {
    this.setAttributeNS(e.space, e.local, t.call(this, n));
  };
}
function Nw(e, t) {
  var n, o;
  function r() {
    var a = t.apply(this, arguments);
    return a !== o && (n = (o = a) && Cw(e, a)), n;
  }
  return r._value = t, r;
}
function Mw(e, t) {
  var n, o;
  function r() {
    var a = t.apply(this, arguments);
    return a !== o && (n = (o = a) && Sw(e, a)), n;
  }
  return r._value = t, r;
}
function Tw(e, t) {
  var n = "attr." + e;
  if (arguments.length < 2) return (n = this.tween(n)) && n._value;
  if (t == null) return this.tween(n, null);
  if (typeof t != "function") throw new Error();
  var o = kr(e);
  return this.tween(n, (o.local ? Nw : Mw)(o, t));
}
function Iw(e, t) {
  return function() {
    Ya(this, e).delay = +t.apply(this, arguments);
  };
}
function Dw(e, t) {
  return t = +t, function() {
    Ya(this, e).delay = t;
  };
}
function Aw(e) {
  var t = this._id;
  return arguments.length ? this.each((typeof e == "function" ? Iw : Dw)(t, e)) : st(this.node(), t).delay;
}
function Pw(e, t) {
  return function() {
    yt(this, e).duration = +t.apply(this, arguments);
  };
}
function Ow(e, t) {
  return t = +t, function() {
    yt(this, e).duration = t;
  };
}
function Rw(e) {
  var t = this._id;
  return arguments.length ? this.each((typeof e == "function" ? Pw : Ow)(t, e)) : st(this.node(), t).duration;
}
function zw(e, t) {
  if (typeof t != "function") throw new Error();
  return function() {
    yt(this, e).ease = t;
  };
}
function Bw(e) {
  var t = this._id;
  return arguments.length ? this.each(zw(t, e)) : st(this.node(), t).ease;
}
function Lw(e, t) {
  return function() {
    var n = t.apply(this, arguments);
    if (typeof n != "function") throw new Error();
    yt(this, e).ease = n;
  };
}
function Vw(e) {
  if (typeof e != "function") throw new Error();
  return this.each(Lw(this._id, e));
}
function Hw(e) {
  typeof e != "function" && (e = Hc(e));
  for (var t = this._groups, n = t.length, o = new Array(n), r = 0; r < n; ++r)
    for (var a = t[r], i = a.length, s = o[r] = [], u, c = 0; c < i; ++c)
      (u = a[c]) && e.call(u, u.__data__, c, a) && s.push(u);
  return new Mt(o, this._parents, this._name, this._id);
}
function Fw(e) {
  if (e._id !== this._id) throw new Error();
  for (var t = this._groups, n = e._groups, o = t.length, r = n.length, a = Math.min(o, r), i = new Array(o), s = 0; s < a; ++s)
    for (var u = t[s], c = n[s], l = u.length, d = i[s] = new Array(l), f, h = 0; h < l; ++h)
      (f = u[h] || c[h]) && (d[h] = f);
  for (; s < o; ++s)
    i[s] = t[s];
  return new Mt(i, this._parents, this._name, this._id);
}
function Gw(e) {
  return (e + "").trim().split(/^|\s+/).every(function(t) {
    var n = t.indexOf(".");
    return n >= 0 && (t = t.slice(0, n)), !t || t === "start";
  });
}
function Yw(e, t, n) {
  var o, r, a = Gw(t) ? Ya : yt;
  return function() {
    var i = a(this, e), s = i.on;
    s !== o && (r = (o = s).copy()).on(t, n), i.on = r;
  };
}
function Uw(e, t) {
  var n = this._id;
  return arguments.length < 2 ? st(this.node(), n).on.on(e) : this.each(Yw(n, e, t));
}
function qw(e) {
  return function() {
    var t = this.parentNode;
    for (var n in this.__transition) if (+n !== e) return;
    t && t.removeChild(this);
  };
}
function Xw() {
  return this.on("end.remove", qw(this._id));
}
function Ww(e) {
  var t = this._name, n = this._id;
  typeof e != "function" && (e = Va(e));
  for (var o = this._groups, r = o.length, a = new Array(r), i = 0; i < r; ++i)
    for (var s = o[i], u = s.length, c = a[i] = new Array(u), l, d, f = 0; f < u; ++f)
      (l = s[f]) && (d = e.call(l, l.__data__, f, s)) && ("__data__" in l && (d.__data__ = l.__data__), c[f] = d, xr(c[f], t, n, f, c, st(l, n)));
  return new Mt(a, this._parents, t, n);
}
function Kw(e) {
  var t = this._name, n = this._id;
  typeof e != "function" && (e = Vc(e));
  for (var o = this._groups, r = o.length, a = [], i = [], s = 0; s < r; ++s)
    for (var u = o[s], c = u.length, l, d = 0; d < c; ++d)
      if (l = u[d]) {
        for (var f = e.call(l, l.__data__, d, u), h, b = st(l, n), w = 0, m = f.length; w < m; ++w)
          (h = f[w]) && xr(h, t, n, w, f, b);
        a.push(f), i.push(l);
      }
  return new Mt(a, i, t, n);
}
var jw = so.prototype.constructor;
function Zw() {
  return new jw(this._groups, this._parents);
}
function Jw(e, t) {
  var n, o, r;
  return function() {
    var a = bn(this, e), i = (this.style.removeProperty(e), bn(this, e));
    return a === i ? null : a === n && i === o ? r : r = t(n = a, o = i);
  };
}
function ld(e) {
  return function() {
    this.style.removeProperty(e);
  };
}
function Qw(e, t, n) {
  var o, r = n + "", a;
  return function() {
    var i = bn(this, e);
    return i === r ? null : i === o ? a : a = t(o = i, n);
  };
}
function ek(e, t, n) {
  var o, r, a;
  return function() {
    var i = bn(this, e), s = n(this), u = s + "";
    return s == null && (u = s = (this.style.removeProperty(e), bn(this, e))), i === u ? null : i === o && u === r ? a : (r = u, a = t(o = i, s));
  };
}
function tk(e, t) {
  var n, o, r, a = "style." + t, i = "end." + a, s;
  return function() {
    var u = yt(this, e), c = u.on, l = u.value[a] == null ? s || (s = ld(t)) : void 0;
    (c !== n || r !== l) && (o = (n = c).copy()).on(i, r = l), u.on = o;
  };
}
function nk(e, t, n) {
  var o = (e += "") == "transform" ? nw : sd;
  return t == null ? this.styleTween(e, Jw(e, o)).on("end.style." + e, ld(e)) : typeof t == "function" ? this.styleTween(e, ek(e, o, Ua(this, "style." + e, t))).each(tk(this._id, e)) : this.styleTween(e, Qw(e, o, t), n).on("end.style." + e, null);
}
function ok(e, t, n) {
  return function(o) {
    this.style.setProperty(e, t.call(this, o), n);
  };
}
function rk(e, t, n) {
  var o, r;
  function a() {
    var i = t.apply(this, arguments);
    return i !== r && (o = (r = i) && ok(e, i, n)), o;
  }
  return a._value = t, a;
}
function ik(e, t, n) {
  var o = "style." + (e += "");
  if (arguments.length < 2) return (o = this.tween(o)) && o._value;
  if (t == null) return this.tween(o, null);
  if (typeof t != "function") throw new Error();
  return this.tween(o, rk(e, t, n ?? ""));
}
function ak(e) {
  return function() {
    this.textContent = e;
  };
}
function sk(e) {
  return function() {
    var t = e(this);
    this.textContent = t ?? "";
  };
}
function lk(e) {
  return this.tween("text", typeof e == "function" ? sk(Ua(this, "text", e)) : ak(e == null ? "" : e + ""));
}
function uk(e) {
  return function(t) {
    this.textContent = e.call(this, t);
  };
}
function ck(e) {
  var t, n;
  function o() {
    var r = e.apply(this, arguments);
    return r !== n && (t = (n = r) && uk(r)), t;
  }
  return o._value = e, o;
}
function dk(e) {
  var t = "text";
  if (arguments.length < 1) return (t = this.tween(t)) && t._value;
  if (e == null) return this.tween(t, null);
  if (typeof e != "function") throw new Error();
  return this.tween(t, ck(e));
}
function fk() {
  for (var e = this._name, t = this._id, n = ud(), o = this._groups, r = o.length, a = 0; a < r; ++a)
    for (var i = o[a], s = i.length, u, c = 0; c < s; ++c)
      if (u = i[c]) {
        var l = st(u, t);
        xr(u, e, n, c, i, {
          time: l.time + l.delay + l.duration,
          delay: 0,
          duration: l.duration,
          ease: l.ease
        });
      }
  return new Mt(o, this._parents, e, n);
}
function hk() {
  var e, t, n = this, o = n._id, r = n.size();
  return new Promise(function(a, i) {
    var s = { value: i }, u = { value: function() {
      --r === 0 && a();
    } };
    n.each(function() {
      var c = yt(this, o), l = c.on;
      l !== e && (t = (e = l).copy(), t._.cancel.push(s), t._.interrupt.push(s), t._.end.push(u)), c.on = t;
    }), r === 0 && a();
  });
}
var pk = 0;
function Mt(e, t, n, o) {
  this._groups = e, this._parents = t, this._name = n, this._id = o;
}
function ud() {
  return ++pk;
}
var kt = so.prototype;
Mt.prototype = {
  constructor: Mt,
  select: Ww,
  selectAll: Kw,
  selectChild: kt.selectChild,
  selectChildren: kt.selectChildren,
  filter: Hw,
  merge: Fw,
  selection: Zw,
  transition: fk,
  call: kt.call,
  nodes: kt.nodes,
  node: kt.node,
  size: kt.size,
  empty: kt.empty,
  each: kt.each,
  on: Uw,
  attr: $w,
  attrTween: Tw,
  style: nk,
  styleTween: ik,
  text: lk,
  textTween: dk,
  remove: Xw,
  tween: yw,
  delay: Aw,
  duration: Rw,
  ease: Bw,
  easeVarying: Vw,
  end: hk,
  [Symbol.iterator]: kt[Symbol.iterator]
};
function gk(e) {
  return ((e *= 2) <= 1 ? e * e * e : (e -= 2) * e * e + 2) / 2;
}
var vk = {
  time: null,
  // Set on use.
  delay: 0,
  duration: 250,
  ease: gk
};
function mk(e, t) {
  for (var n; !(n = e.__transition) || !(n = n[t]); )
    if (!(e = e.parentNode))
      throw new Error(`transition ${t} not found`);
  return n;
}
function yk(e) {
  var t, n;
  e instanceof Mt ? (t = e._id, e = e._name) : (t = ud(), (n = vk).time = Ga(), e = e == null ? null : e + "");
  for (var o = this._groups, r = o.length, a = 0; a < r; ++a)
    for (var i = o[a], s = i.length, u, c = 0; c < s; ++c)
      (u = i[c]) && xr(u, e, t, c, i, n || mk(u, t));
  return new Mt(o, this._parents, e, t);
}
so.prototype.interrupt = gw;
so.prototype.transition = yk;
const Mo = (e) => () => e;
function bk(e, {
  sourceEvent: t,
  target: n,
  transform: o,
  dispatch: r
}) {
  Object.defineProperties(this, {
    type: { value: e, enumerable: !0, configurable: !0 },
    sourceEvent: { value: t, enumerable: !0, configurable: !0 },
    target: { value: n, enumerable: !0, configurable: !0 },
    transform: { value: o, enumerable: !0, configurable: !0 },
    _: { value: r }
  });
}
function St(e, t, n) {
  this.k = e, this.x = t, this.y = n;
}
St.prototype = {
  constructor: St,
  scale: function(e) {
    return e === 1 ? this : new St(this.k * e, this.x, this.y);
  },
  translate: function(e, t) {
    return e === 0 & t === 0 ? this : new St(this.k, this.x + this.k * e, this.y + this.k * t);
  },
  apply: function(e) {
    return [e[0] * this.k + this.x, e[1] * this.k + this.y];
  },
  applyX: function(e) {
    return e * this.k + this.x;
  },
  applyY: function(e) {
    return e * this.k + this.y;
  },
  invert: function(e) {
    return [(e[0] - this.x) / this.k, (e[1] - this.y) / this.k];
  },
  invertX: function(e) {
    return (e - this.x) / this.k;
  },
  invertY: function(e) {
    return (e - this.y) / this.k;
  },
  rescaleX: function(e) {
    return e.copy().domain(e.range().map(this.invertX, this).map(e.invert, e));
  },
  rescaleY: function(e) {
    return e.copy().domain(e.range().map(this.invertY, this).map(e.invert, e));
  },
  toString: function() {
    return "translate(" + this.x + "," + this.y + ") scale(" + this.k + ")";
  }
};
var qa = new St(1, 0, 0);
St.prototype;
function Zr(e) {
  e.stopImmediatePropagation();
}
function In(e) {
  e.preventDefault(), e.stopImmediatePropagation();
}
function wk(e) {
  return (!e.ctrlKey || e.type === "wheel") && !e.button;
}
function kk() {
  var e = this;
  return e instanceof SVGElement ? (e = e.ownerSVGElement || e, e.hasAttribute("viewBox") ? (e = e.viewBox.baseVal, [[e.x, e.y], [e.x + e.width, e.y + e.height]]) : [[0, 0], [e.width.baseVal.value, e.height.baseVal.value]]) : [[0, 0], [e.clientWidth, e.clientHeight]];
}
function ml() {
  return this.__zoom || qa;
}
function _k(e) {
  return -e.deltaY * (e.deltaMode === 1 ? 0.05 : e.deltaMode ? 1 : 2e-3) * (e.ctrlKey ? 10 : 1);
}
function xk() {
  return navigator.maxTouchPoints || "ontouchstart" in this;
}
function Ek(e, t, n) {
  var o = e.invertX(t[0][0]) - n[0][0], r = e.invertX(t[1][0]) - n[1][0], a = e.invertY(t[0][1]) - n[0][1], i = e.invertY(t[1][1]) - n[1][1];
  return e.translate(
    r > o ? (o + r) / 2 : Math.min(0, o) || Math.max(0, r),
    i > a ? (a + i) / 2 : Math.min(0, a) || Math.max(0, i)
  );
}
function $k() {
  var e = wk, t = kk, n = Ek, o = _k, r = xk, a = [0, 1 / 0], i = [[-1 / 0, -1 / 0], [1 / 0, 1 / 0]], s = 250, u = sw, c = La("start", "zoom", "end"), l, d, f, h = 500, b = 150, w = 0, m = 10;
  function p(y) {
    y.property("__zoom", ml).on("wheel.zoom", C, { passive: !1 }).on("mousedown.zoom", N).on("dblclick.zoom", M).filter(r).on("touchstart.zoom", B).on("touchmove.zoom", S).on("touchend.zoom touchcancel.zoom", Q).style("-webkit-tap-highlight-color", "rgba(0,0,0,0)");
  }
  p.transform = function(y, O, E, X) {
    var U = y.selection ? y.selection() : y;
    U.property("__zoom", ml), y !== U ? P(y, O, E, X) : U.interrupt().each(function() {
      F(this, arguments).event(X).start().zoom(null, typeof O == "function" ? O.apply(this, arguments) : O).end();
    });
  }, p.scaleBy = function(y, O, E, X) {
    p.scaleTo(y, function() {
      var U = this.__zoom.k, z = typeof O == "function" ? O.apply(this, arguments) : O;
      return U * z;
    }, E, X);
  }, p.scaleTo = function(y, O, E, X) {
    p.transform(y, function() {
      var U = t.apply(this, arguments), z = this.__zoom, x = E == null ? k(U) : typeof E == "function" ? E.apply(this, arguments) : E, L = z.invert(x), te = typeof O == "function" ? O.apply(this, arguments) : O;
      return n(g(v(z, te), x, L), U, i);
    }, E, X);
  }, p.translateBy = function(y, O, E, X) {
    p.transform(y, function() {
      return n(this.__zoom.translate(
        typeof O == "function" ? O.apply(this, arguments) : O,
        typeof E == "function" ? E.apply(this, arguments) : E
      ), t.apply(this, arguments), i);
    }, null, X);
  }, p.translateTo = function(y, O, E, X, U) {
    p.transform(y, function() {
      var z = t.apply(this, arguments), x = this.__zoom, L = X == null ? k(z) : typeof X == "function" ? X.apply(this, arguments) : X;
      return n(qa.translate(L[0], L[1]).scale(x.k).translate(
        typeof O == "function" ? -O.apply(this, arguments) : -O,
        typeof E == "function" ? -E.apply(this, arguments) : -E
      ), z, i);
    }, X, U);
  };
  function v(y, O) {
    return O = Math.max(a[0], Math.min(a[1], O)), O === y.k ? y : new St(O, y.x, y.y);
  }
  function g(y, O, E) {
    var X = O[0] - E[0] * y.k, U = O[1] - E[1] * y.k;
    return X === y.x && U === y.y ? y : new St(y.k, X, U);
  }
  function k(y) {
    return [(+y[0][0] + +y[1][0]) / 2, (+y[0][1] + +y[1][1]) / 2];
  }
  function P(y, O, E, X) {
    y.on("start.zoom", function() {
      F(this, arguments).event(X).start();
    }).on("interrupt.zoom end.zoom", function() {
      F(this, arguments).event(X).end();
    }).tween("zoom", function() {
      var U = this, z = arguments, x = F(U, z).event(X), L = t.apply(U, z), te = E == null ? k(L) : typeof E == "function" ? E.apply(U, z) : E, H = Math.max(L[1][0] - L[0][0], L[1][1] - L[0][1]), q = U.__zoom, Y = typeof O == "function" ? O.apply(U, z) : O, Z = u(q.invert(te).concat(H / q.k), Y.invert(te).concat(H / Y.k));
      return function(ee) {
        if (ee === 1) ee = Y;
        else {
          var ae = Z(ee), me = H / ae[2];
          ee = new St(me, te[0] - ae[0] * me, te[1] - ae[1] * me);
        }
        x.zoom(null, ee);
      };
    });
  }
  function F(y, O, E) {
    return !E && y.__zooming || new K(y, O);
  }
  function K(y, O) {
    this.that = y, this.args = O, this.active = 0, this.sourceEvent = null, this.extent = t.apply(y, O), this.taps = 0;
  }
  K.prototype = {
    event: function(y) {
      return y && (this.sourceEvent = y), this;
    },
    start: function() {
      return ++this.active === 1 && (this.that.__zooming = this, this.emit("start")), this;
    },
    zoom: function(y, O) {
      return this.mouse && y !== "mouse" && (this.mouse[1] = O.invert(this.mouse[0])), this.touch0 && y !== "touch" && (this.touch0[1] = O.invert(this.touch0[0])), this.touch1 && y !== "touch" && (this.touch1[1] = O.invert(this.touch1[0])), this.that.__zoom = O, this.emit("zoom"), this;
    },
    end: function() {
      return --this.active === 0 && (delete this.that.__zooming, this.emit("end")), this;
    },
    emit: function(y) {
      var O = Ot(this.that).datum();
      c.call(
        y,
        this.that,
        new bk(y, {
          sourceEvent: this.sourceEvent,
          target: p,
          transform: this.that.__zoom,
          dispatch: c
        }),
        O
      );
    }
  };
  function C(y, ...O) {
    if (!e.apply(this, arguments)) return;
    var E = F(this, O).event(y), X = this.__zoom, U = Math.max(a[0], Math.min(a[1], X.k * Math.pow(2, o.apply(this, arguments)))), z = Dt(y);
    if (E.wheel)
      (E.mouse[0][0] !== z[0] || E.mouse[0][1] !== z[1]) && (E.mouse[1] = X.invert(E.mouse[0] = z)), clearTimeout(E.wheel);
    else {
      if (X.k === U) return;
      E.mouse = [z, X.invert(z)], Fo(this), E.start();
    }
    In(y), E.wheel = setTimeout(x, b), E.zoom("mouse", n(g(v(X, U), E.mouse[0], E.mouse[1]), E.extent, i));
    function x() {
      E.wheel = null, E.end();
    }
  }
  function N(y, ...O) {
    if (f || !e.apply(this, arguments)) return;
    var E = y.currentTarget, X = F(this, O, !0).event(y), U = Ot(y.view).on("mousemove.zoom", te, !0).on("mouseup.zoom", H, !0), z = Dt(y, E), x = y.clientX, L = y.clientY;
    Pb(y.view), Zr(y), X.mouse = [z, this.__zoom.invert(z)], Fo(this), X.start();
    function te(q) {
      if (In(q), !X.moved) {
        var Y = q.clientX - x, Z = q.clientY - L;
        X.moved = Y * Y + Z * Z > w;
      }
      X.event(q).zoom("mouse", n(g(X.that.__zoom, X.mouse[0] = Dt(q, E), X.mouse[1]), X.extent, i));
    }
    function H(q) {
      U.on("mousemove.zoom mouseup.zoom", null), Ob(q.view, X.moved), In(q), X.event(q).end();
    }
  }
  function M(y, ...O) {
    if (e.apply(this, arguments)) {
      var E = this.__zoom, X = Dt(y.changedTouches ? y.changedTouches[0] : y, this), U = E.invert(X), z = E.k * (y.shiftKey ? 0.5 : 2), x = n(g(v(E, z), X, U), t.apply(this, O), i);
      In(y), s > 0 ? Ot(this).transition().duration(s).call(P, x, X, y) : Ot(this).call(p.transform, x, X, y);
    }
  }
  function B(y, ...O) {
    if (e.apply(this, arguments)) {
      var E = y.touches, X = E.length, U = F(this, O, y.changedTouches.length === X).event(y), z, x, L, te;
      for (Zr(y), x = 0; x < X; ++x)
        L = E[x], te = Dt(L, this), te = [te, this.__zoom.invert(te), L.identifier], U.touch0 ? !U.touch1 && U.touch0[2] !== te[2] && (U.touch1 = te, U.taps = 0) : (U.touch0 = te, z = !0, U.taps = 1 + !!l);
      l && (l = clearTimeout(l)), z && (U.taps < 2 && (d = te[0], l = setTimeout(function() {
        l = null;
      }, h)), Fo(this), U.start());
    }
  }
  function S(y, ...O) {
    if (this.__zooming) {
      var E = F(this, O).event(y), X = y.changedTouches, U = X.length, z, x, L, te;
      for (In(y), z = 0; z < U; ++z)
        x = X[z], L = Dt(x, this), E.touch0 && E.touch0[2] === x.identifier ? E.touch0[0] = L : E.touch1 && E.touch1[2] === x.identifier && (E.touch1[0] = L);
      if (x = E.that.__zoom, E.touch1) {
        var H = E.touch0[0], q = E.touch0[1], Y = E.touch1[0], Z = E.touch1[1], ee = (ee = Y[0] - H[0]) * ee + (ee = Y[1] - H[1]) * ee, ae = (ae = Z[0] - q[0]) * ae + (ae = Z[1] - q[1]) * ae;
        x = v(x, Math.sqrt(ee / ae)), L = [(H[0] + Y[0]) / 2, (H[1] + Y[1]) / 2], te = [(q[0] + Z[0]) / 2, (q[1] + Z[1]) / 2];
      } else if (E.touch0) L = E.touch0[0], te = E.touch0[1];
      else return;
      E.zoom("touch", n(g(x, L, te), E.extent, i));
    }
  }
  function Q(y, ...O) {
    if (this.__zooming) {
      var E = F(this, O).event(y), X = y.changedTouches, U = X.length, z, x;
      for (Zr(y), f && clearTimeout(f), f = setTimeout(function() {
        f = null;
      }, h), z = 0; z < U; ++z)
        x = X[z], E.touch0 && E.touch0[2] === x.identifier ? delete E.touch0 : E.touch1 && E.touch1[2] === x.identifier && delete E.touch1;
      if (E.touch1 && !E.touch0 && (E.touch0 = E.touch1, delete E.touch1), E.touch0) E.touch0[1] = this.__zoom.invert(E.touch0[0]);
      else if (E.end(), E.taps === 2 && (x = Dt(x, this), Math.hypot(d[0] - x[0], d[1] - x[1]) < m)) {
        var L = Ot(this).on("dblclick.zoom");
        L && L.apply(this, arguments);
      }
    }
  }
  return p.wheelDelta = function(y) {
    return arguments.length ? (o = typeof y == "function" ? y : Mo(+y), p) : o;
  }, p.filter = function(y) {
    return arguments.length ? (e = typeof y == "function" ? y : Mo(!!y), p) : e;
  }, p.touchable = function(y) {
    return arguments.length ? (r = typeof y == "function" ? y : Mo(!!y), p) : r;
  }, p.extent = function(y) {
    return arguments.length ? (t = typeof y == "function" ? y : Mo([[+y[0][0], +y[0][1]], [+y[1][0], +y[1][1]]]), p) : t;
  }, p.scaleExtent = function(y) {
    return arguments.length ? (a[0] = +y[0], a[1] = +y[1], p) : [a[0], a[1]];
  }, p.translateExtent = function(y) {
    return arguments.length ? (i[0][0] = +y[0][0], i[1][0] = +y[1][0], i[0][1] = +y[0][1], i[1][1] = +y[1][1], p) : [[i[0][0], i[0][1]], [i[1][0], i[1][1]]];
  }, p.constrain = function(y) {
    return arguments.length ? (n = y, p) : n;
  }, p.duration = function(y) {
    return arguments.length ? (s = +y, p) : s;
  }, p.interpolate = function(y) {
    return arguments.length ? (u = y, p) : u;
  }, p.on = function() {
    var y = c.on.apply(c, arguments);
    return y === c ? p : y;
  }, p.clickDistance = function(y) {
    return arguments.length ? (w = (y = +y) * y, p) : Math.sqrt(w);
  }, p.tapDistance = function(y) {
    return arguments.length ? (m = +y, p) : m;
  }, p;
}
const cd = Symbol("MiniMapSlots"), Sk = ["id", "x", "y", "rx", "ry", "width", "height", "fill", "stroke", "stroke-width", "shape-rendering"], Ck = {
  name: "MiniMapNode",
  compatConfig: { MODE: 3 },
  inheritAttrs: !1
}, Nk = /* @__PURE__ */ $e({
  ...Ck,
  props: {
    id: {},
    type: {},
    selected: { type: Boolean },
    dragging: { type: Boolean },
    position: {},
    dimensions: {},
    borderRadius: {},
    color: {},
    shapeRendering: {},
    strokeColor: {},
    strokeWidth: {},
    hidden: { type: Boolean }
  },
  emits: ["click", "dblclick", "mouseenter", "mousemove", "mouseleave"],
  setup(e, { emit: t }) {
    const n = e, o = ot(cd), r = Sa(), a = Te(() => r.style ?? {});
    function i(d) {
      t("click", d);
    }
    function s(d) {
      t("dblclick", d);
    }
    function u(d) {
      t("mouseenter", d);
    }
    function c(d) {
      t("mousemove", d);
    }
    function l(d) {
      t("mouseleave", d);
    }
    return (d, f) => !d.hidden && d.dimensions.width !== 0 && d.dimensions.height !== 0 ? (A(), G(ye, { key: 0 }, [
      oe(o)[`node-${n.type}`] ? (A(), Ie(Ht(oe(o)[`node-${n.type}`]), xf(Yo({ key: 0 }, { ...n, ...d.$attrs })), null, 16)) : (A(), G("rect", Yo({
        key: 1,
        id: d.id
      }, d.$attrs, {
        class: ["vue-flow__minimap-node", { selected: d.selected, dragging: d.dragging }],
        x: d.position.x,
        y: d.position.y,
        rx: d.borderRadius,
        ry: d.borderRadius,
        width: d.dimensions.width,
        height: d.dimensions.height,
        fill: d.color || a.value.background || a.value.backgroundColor,
        stroke: d.strokeColor,
        "stroke-width": d.strokeWidth,
        "shape-rendering": d.shapeRendering,
        onClick: i,
        onDblclick: s,
        onMouseenter: u,
        onMousemove: c,
        onMouseleave: l
      }), null, 16, Sk))
    ], 64)) : fe("", !0);
  }
}), Mk = ["width", "height", "viewBox", "aria-labelledby"], Tk = ["id"], Ik = ["d", "fill", "stroke", "stroke-width"], Dk = {
  name: "MiniMap",
  compatConfig: { MODE: 3 }
}, Ak = /* @__PURE__ */ $e({
  ...Dk,
  props: {
    nodeColor: { type: [String, Function], default: "#e2e2e2" },
    nodeStrokeColor: { type: [String, Function], default: "transparent" },
    nodeClassName: { type: [String, Function] },
    nodeBorderRadius: { default: 5 },
    nodeStrokeWidth: { default: 2 },
    maskColor: { default: "rgb(240, 240, 240, 0.6)" },
    maskStrokeColor: { default: "none" },
    maskStrokeWidth: { default: 1 },
    position: { default: "bottom-right" },
    pannable: { type: Boolean, default: !1 },
    zoomable: { type: Boolean, default: !1 },
    width: {},
    height: {},
    ariaLabel: { default: "Vue Flow mini map" },
    inversePan: { type: Boolean, default: !1 },
    zoomStep: { default: 1 },
    offsetScale: { default: 5 },
    maskBorderRadius: { default: 0 }
  },
  emits: ["click", "nodeClick", "nodeDblclick", "nodeMouseenter", "nodeMousemove", "nodeMouseleave"],
  setup(e, { emit: t }) {
    const n = _u(), o = Sa(), r = 200, a = 150, { id: i, edges: s, viewport: u, translateExtent: c, dimensions: l, emits: d, d3Selection: f, d3Zoom: h, getNodesInitialized: b } = Oe(), w = le();
    Ct(cd, n);
    const m = Te(() => {
      var U;
      return e.width ?? ((U = o.style) == null ? void 0 : U.width) ?? r;
    }), p = Te(() => {
      var U;
      return e.height ?? ((U = o.style) == null ? void 0 : U.height) ?? a;
    }), v = typeof window > "u" || window.chrome ? "crispEdges" : "geometricPrecision", g = ne(() => typeof e.nodeColor == "string" ? () => e.nodeColor : e.nodeColor), k = ne(
      () => typeof e.nodeStrokeColor == "string" ? () => e.nodeStrokeColor : e.nodeStrokeColor
    ), P = ne(
      () => typeof e.nodeClassName == "string" ? () => e.nodeClassName : typeof e.nodeClassName == "function" ? e.nodeClassName : () => ""
    ), F = ne(() => Oa(b.value.filter((U) => !U.hidden))), K = ne(() => ({
      x: -u.value.x / u.value.zoom,
      y: -u.value.y / u.value.zoom,
      width: l.value.width / u.value.zoom,
      height: l.value.height / u.value.zoom
    })), C = ne(
      () => b.value && b.value.length ? dm(F.value, K.value) : K.value
    ), N = ne(() => {
      const U = C.value.width / m.value, z = C.value.height / p.value;
      return Math.max(U, z);
    }), M = ne(() => {
      const U = N.value * m.value, z = N.value * p.value, x = e.offsetScale * N.value;
      return {
        offset: x,
        x: C.value.x - (U - C.value.width) / 2 - x,
        y: C.value.y - (z - C.value.height) / 2 - x,
        width: U + x * 2,
        height: z + x * 2
      };
    }), B = ne(() => !M.value.x || !M.value.y ? "" : `
    M${M.value.x - M.value.offset},${M.value.y - M.value.offset}
    h${M.value.width + M.value.offset * 2}
    v${M.value.height + M.value.offset * 2}
    h${-M.value.width - M.value.offset * 2}z
    M${K.value.x + e.maskBorderRadius},${K.value.y}
    h${K.value.width - 2 * e.maskBorderRadius}
    a${e.maskBorderRadius},${e.maskBorderRadius} 0 0 1 ${e.maskBorderRadius},${e.maskBorderRadius}
    v${K.value.height - 2 * e.maskBorderRadius}
    a${e.maskBorderRadius},${e.maskBorderRadius} 0 0 1 -${e.maskBorderRadius},${e.maskBorderRadius}
    h${-(K.value.width - 2 * e.maskBorderRadius)}
    a${e.maskBorderRadius},${e.maskBorderRadius} 0 0 1 -${e.maskBorderRadius},-${e.maskBorderRadius}
    v${-(K.value.height - 2 * e.maskBorderRadius)}
    a${e.maskBorderRadius},${e.maskBorderRadius} 0 0 1 ${e.maskBorderRadius},-${e.maskBorderRadius}z`);
    _f(
      (U) => {
        if (w.value) {
          const z = Ot(w.value), x = (H) => {
            if (H.sourceEvent.type !== "wheel" || !f.value || !h.value)
              return;
            const q = H.sourceEvent.ctrlKey && Jn() ? 10 : 1, Y = -H.sourceEvent.deltaY * (H.sourceEvent.deltaMode === 1 ? 0.05 : H.sourceEvent.deltaMode ? 1 : 2e-3) * e.zoomStep, Z = u.value.zoom * 2 ** (Y * q);
            h.value.scaleTo(f.value, Z);
          }, L = (H) => {
            if (H.sourceEvent.type !== "mousemove" || !f.value || !h.value)
              return;
            const q = N.value * Math.max(1, u.value.zoom) * (e.inversePan ? -1 : 1), Y = {
              x: u.value.x - H.sourceEvent.movementX * q,
              y: u.value.y - H.sourceEvent.movementY * q
            }, Z = [
              [0, 0],
              [l.value.width, l.value.height]
            ], ee = qa.translate(Y.x, Y.y).scale(u.value.zoom), ae = h.value.constrain()(ee, Z, c.value);
            h.value.transform(f.value, ae);
          }, te = $k().wheelDelta((H) => ia(H) * (e.zoomStep / 10)).on("zoom", e.pannable ? L : () => {
          }).on("zoom.wheel", e.zoomable ? x : () => {
          });
          z.call(te), U(() => {
            z.on("zoom", null);
          });
        }
      },
      { flush: "post" }
    );
    function S(U) {
      const [z, x] = Dt(U);
      t("click", { event: U, position: { x: z, y: x } });
    }
    function Q(U, z) {
      const x = { event: U, node: z, connectedEdges: Gt([z], s.value) };
      d.miniMapNodeClick(x), t("nodeClick", x);
    }
    function y(U, z) {
      const x = { event: U, node: z, connectedEdges: Gt([z], s.value) };
      d.miniMapNodeDoubleClick(x), t("nodeDblclick", x);
    }
    function O(U, z) {
      const x = { event: U, node: z, connectedEdges: Gt([z], s.value) };
      d.miniMapNodeMouseEnter(x), t("nodeMouseenter", x);
    }
    function E(U, z) {
      const x = { event: U, node: z, connectedEdges: Gt([z], s.value) };
      d.miniMapNodeMouseMove(x), t("nodeMousemove", x);
    }
    function X(U, z) {
      const x = { event: U, node: z, connectedEdges: Gt([z], s.value) };
      d.miniMapNodeMouseLeave(x), t("nodeMouseleave", x);
    }
    return (U, z) => (A(), Ie(oe(Rc), {
      position: U.position,
      class: Me(["vue-flow__minimap", { pannable: U.pannable, zoomable: U.zoomable }])
    }, {
      default: ft(() => [
        (A(), G("svg", {
          ref_key: "el",
          ref: w,
          width: m.value,
          height: p.value,
          viewBox: [M.value.x, M.value.y, M.value.width, M.value.height].join(" "),
          role: "img",
          "aria-labelledby": `vue-flow__minimap-${oe(i)}`,
          onClick: S
        }, [
          U.ariaLabel ? (A(), G("title", {
            key: 0,
            id: `vue-flow__minimap-${oe(i)}`
          }, he(U.ariaLabel), 9, Tk)) : fe("", !0),
          (A(!0), G(ye, null, Se(oe(b), (x) => (A(), Ie(Nk, {
            id: x.id,
            key: x.id,
            f: "",
            position: x.computedPosition,
            dimensions: x.dimensions,
            selected: x.selected,
            dragging: x.dragging,
            style: Pe(x.style),
            class: Me(P.value(x)),
            color: g.value(x),
            "border-radius": U.nodeBorderRadius,
            "stroke-color": k.value(x),
            "stroke-width": U.nodeStrokeWidth,
            "shape-rendering": oe(v),
            type: x.type,
            hidden: x.hidden,
            onClick: (L) => Q(L, x),
            onDblclick: (L) => y(L, x),
            onMouseenter: (L) => O(L, x),
            onMousemove: (L) => E(L, x),
            onMouseleave: (L) => X(L, x)
          }, null, 8, ["id", "position", "dimensions", "selected", "dragging", "style", "class", "color", "border-radius", "stroke-color", "stroke-width", "shape-rendering", "type", "hidden", "onClick", "onDblclick", "onMouseenter", "onMousemove", "onMouseleave"]))), 128)),
          I("path", {
            class: "vue-flow__minimap-mask",
            d: B.value,
            fill: U.maskColor,
            stroke: U.maskStrokeColor,
            "stroke-width": U.maskStrokeWidth,
            "fill-rule": "evenodd"
          }, null, 8, Ik)
        ], 8, Mk))
      ]),
      _: 1
    }, 8, ["position", "class"]));
  }
});
function ya(e) {
  return e.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
function Jr(e) {
  let t = ya(e);
  return t = t.replace(/`([^`]+)`/g, (n, o) => `<code>${o}</code>`), t = t.replace(/\*\*([^*]+)\*\*/g, (n, o) => `<strong>${o}</strong>`), t = t.replace(/(^|[^*])\*([^*\n]+)\*/g, (n, o, r) => `${o}<em>${r}</em>`), t = t.replace(/(^|[^_])_([^_\n]+)_/g, (n, o, r) => `${o}<em>${r}</em>`), t = t.replace(
    /\[([^\]]+)\]\((https?:\/\/[^\s)]+|mailto:[^\s)]+)\)/g,
    (n, o, r) => `<a href="${r}" target="_blank" rel="noopener noreferrer">${o}</a>`
  ), t;
}
function ba(e) {
  if (!e) return "";
  const t = String(e).replace(/\r\n/g, `
`).split(`
`), n = [];
  let o = null, r = !1;
  const a = [];
  function i() {
    o && (n.push(`</${o}>`), o = null);
  }
  for (const s of t) {
    if (s.trim().startsWith("```")) {
      r ? (n.push(`<pre><code>${ya(a.join(`
`))}</code></pre>`), a.length = 0, r = !1) : (i(), r = !0);
      continue;
    }
    if (r) {
      a.push(s);
      continue;
    }
    const c = /^(#{1,6})\s+(.*)$/.exec(s);
    if (c) {
      i();
      const f = c[1].length;
      n.push(`<h${f}>${Jr(c[2])}</h${f}>`);
      continue;
    }
    const l = /^\s*\d+\.\s+(.*)$/.exec(s), d = /^\s*[-*]\s+(.*)$/.exec(s);
    if (l || d) {
      const f = l ? "ol" : "ul";
      o && o !== f && i(), o || (o = f, n.push(`<${f}>`)), n.push(`<li>${Jr(l ? l[1] : d[1])}</li>`);
      continue;
    }
    if (s.trim() === "") {
      i();
      continue;
    }
    i(), n.push(`<p>${Jr(s)}</p>`);
  }
  return r && n.push(`<pre><code>${ya(a.join(`
`))}</code></pre>`), i(), n.join("");
}
const dd = Symbol("kg-resize-node"), fd = Symbol("kg-node-edit"), Pk = { class: "g-node-top" }, Ok = { class: "g-type" }, Rk = ["title"], zk = ["title"], Bk = {
  key: 2,
  class: "g-count",
  title: "Children"
}, Lk = {
  key: 1,
  class: "g-name"
}, Vk = ["innerHTML"], Hk = {
  key: 3,
  class: "g-badges"
}, Fk = {
  key: 4,
  class: "g-tags"
}, yl = 150, bl = 640, Gk = /* @__PURE__ */ $e({
  __name: "GraphNode",
  props: {
    id: {},
    data: {},
    selected: { type: Boolean }
  },
  setup(e) {
    const t = e, n = {
      top: ce.Top,
      bottom: ce.Bottom,
      left: ce.Left,
      right: ce.Right
    }, o = ot(dd, () => {
    }), r = ot(fd, () => ({ state: xt(null), commit: () => {
    }, close: () => {
    } }), !0), { viewport: a } = Oe(), i = le(null), s = le(""), u = ne(() => r.state.value?.id === t.id);
    xe(u, (p) => {
      if (!p) return;
      const v = r.state.value?.seed;
      s.value = v ?? t.data.label, Ke(() => {
        const g = i.value;
        g && (g.focus(), v == null ? g.select() : g.setSelectionRange(g.value.length, g.value.length));
      });
    });
    function c() {
      u.value && r.commit(t.id, s.value);
    }
    function l(p) {
      p.stopPropagation(), p.key === "Enter" ? (p.preventDefault(), c()) : p.key === "Escape" && (p.preventDefault(), r.close());
    }
    const d = le(null);
    xe(() => t.data.width, () => {
      d.value = null;
    });
    const f = ne(() => Math.max(yl, Math.min(bl, Number(d.value ?? t.data.width ?? 210)))), h = ne(() => Math.max(0, Math.min(30, Number(t.data.radius ?? 6)))), b = ne(() => ba(t.data.description));
    function w(p) {
      const v = p.clientX, g = f.value, k = p.target;
      k.setPointerCapture(p.pointerId);
      const P = (K) => {
        const C = a.value.zoom || 1;
        d.value = Math.max(yl, Math.min(bl, Math.round(g + (K.clientX - v) / C)));
      }, F = () => {
        k.removeEventListener("pointermove", P), k.removeEventListener("pointerup", F), d.value !== null && d.value !== t.data.width && o(t.id, d.value);
      };
      k.addEventListener("pointermove", P), k.addEventListener("pointerup", F);
    }
    const m = ne(() => {
      const p = {};
      t.data.handles.forEach((g, k) => {
        (p[g.side] ||= []).push(k);
      });
      const v = {};
      for (const [g, k] of Object.entries(p))
        k.forEach((P, F) => {
          if (k.length <= 1) {
            v[P] = {};
            return;
          }
          const K = (F + 1) / (k.length + 1) * 100;
          v[P] = g === "top" || g === "bottom" ? { left: `${K}%` } : { top: `${K}%` };
        });
      return v;
    });
    return (p, v) => (A(), G("div", {
      class: Me(["g-node", [{ "g-node--selected": e.selected }, e.data.animation ? "g-anim-" + e.data.animation : ""]]),
      style: Pe({ "--node-color": e.data.color, "--node-bg": e.data.bg, "--node-border": e.data.border, width: f.value + "px", borderRadius: h.value + "px", borderStyle: e.data.borderStyle || "solid" })
    }, [
      (A(!0), G(ye, null, Se(e.data.handles, (g, k) => (A(), Ie(oe(pt), {
        key: g.id,
        id: g.id,
        type: g.type,
        position: n[g.side],
        style: Pe(m.value[k]),
        class: "g-port"
      }, null, 8, ["id", "type", "position", "style"]))), 128)),
      I("div", Pk, [
        v[5] || (v[5] = I("span", { class: "g-dot" }, null, -1)),
        I("span", Ok, he(e.data.typeLabel), 1),
        e.data.status && e.data.status !== "active" ? (A(), G("span", {
          key: 0,
          class: "g-status",
          title: "status: " + e.data.status
        }, he(e.data.status), 9, Rk)) : fe("", !0),
        e.data.materialCount ? (A(), G("span", {
          key: 1,
          class: "g-clip",
          title: e.data.materialCount + " material(s) — open panel"
        }, [
          v[4] || (v[4] = I("svg", {
            width: "9",
            height: "9",
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            "stroke-width": "2.2",
            "stroke-linecap": "round",
            "stroke-linejoin": "round"
          }, [
            I("path", { d: "M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" })
          ], -1)),
          zt(" " + he(e.data.materialCount), 1)
        ], 8, zk)) : fe("", !0),
        e.data.childCount ? (A(), G("span", Bk, he(e.data.childCount), 1)) : fe("", !0)
      ]),
      u.value ? un((A(), G("input", {
        key: 0,
        ref_key: "nameInput",
        ref: i,
        "onUpdate:modelValue": v[0] || (v[0] = (g) => s.value = g),
        class: "g-name-input nodrag",
        spellcheck: "false",
        onKeydown: l,
        onBlur: c,
        onPointerdown: v[1] || (v[1] = qe(() => {
        }, ["stop"])),
        onClick: v[2] || (v[2] = qe(() => {
        }, ["stop"])),
        onDblclick: v[3] || (v[3] = qe(() => {
        }, ["stop"]))
      }, null, 544)), [
        [cn, s.value]
      ]) : (A(), G("div", Lk, he(e.data.label), 1)),
      b.value ? (A(), G("div", {
        key: 2,
        class: "g-desc",
        innerHTML: b.value
      }, null, 8, Vk)) : fe("", !0),
      e.data.badges.length ? (A(), G("div", Hk, [
        (A(!0), G(ye, null, Se(e.data.badges, (g, k) => (A(), G("span", {
          key: k,
          class: "g-badge",
          style: Pe({ "--badge-color": g.color })
        }, he(g.text), 5))), 128))
      ])) : fe("", !0),
      e.data.tags.length ? (A(), G("div", Fk, [
        (A(!0), G(ye, null, Se(e.data.tags, (g) => (A(), G("span", {
          key: g,
          class: "g-tag"
        }, he(g), 1))), 128))
      ])) : fe("", !0),
      e.selected ? (A(), G("div", {
        key: 5,
        class: "g-resize nodrag",
        title: "Drag to resize",
        onPointerdown: qe(w, ["stop", "prevent"])
      }, null, 32)) : fe("", !0)
    ], 6));
  }
}), Yk = { class: "g-boundary-title" }, Uk = /* @__PURE__ */ $e({
  __name: "BoundaryNode",
  props: {
    data: {},
    selected: { type: Boolean }
  },
  setup(e) {
    return (t, n) => (A(), G("div", {
      class: Me(["g-boundary", { "g-boundary--selected": e.selected }]),
      style: Pe({ "--node-color": e.data.color })
    }, [
      ze(oe(pt), {
        id: "top",
        type: "target",
        position: oe(ce).Top,
        class: "g-port"
      }, null, 8, ["position"]),
      ze(oe(pt), {
        id: "left",
        type: "target",
        position: oe(ce).Left,
        class: "g-port"
      }, null, 8, ["position"]),
      ze(oe(pt), {
        id: "bottom",
        type: "source",
        position: oe(ce).Bottom,
        class: "g-port"
      }, null, 8, ["position"]),
      ze(oe(pt), {
        id: "right",
        type: "source",
        position: oe(ce).Right,
        class: "g-port"
      }, null, 8, ["position"]),
      I("div", Yk, he(e.data.label), 1)
    ], 6));
  }
}), qk = ["title"], Xk = { class: "g-portal-chip-body" }, Wk = { class: "g-portal-chip-name" }, Kk = {
  key: 0,
  class: "g-portal-chip-ctx"
}, jk = /* @__PURE__ */ $e({
  __name: "PortalNode",
  props: {
    id: {},
    data: {}
  },
  setup(e) {
    const t = {
      top: ce.Top,
      bottom: ce.Bottom,
      left: ce.Left,
      right: ce.Right
    };
    return (n, o) => (A(), G("div", {
      class: "g-portal-chip",
      style: Pe({ "--node-color": e.data.color }),
      title: "Reference — lives " + (e.data.contextLabel ? "in " + e.data.contextLabel : "outside this view") + ". Click to open the real node."
    }, [
      (A(!0), G(ye, null, Se(e.data.handles, (r) => (A(), Ie(oe(pt), {
        key: r.id,
        id: r.id,
        type: r.type,
        position: t[r.side],
        class: "g-portal-port"
      }, null, 8, ["id", "type", "position"]))), 128)),
      o[0] || (o[0] = I("span", { class: "g-portal-glyph" }, "⤢", -1)),
      I("span", Xk, [
        I("span", Wk, he(e.data.label), 1),
        e.data.contextLabel ? (A(), G("span", Kk, "in " + he(e.data.contextLabel), 1)) : fe("", !0)
      ])
    ], 12, qk));
  }
}), sr = [
  { label: "Accent", value: "var(--p-primary-color)" },
  { label: "Muted", value: "var(--p-text-muted-color)" },
  { label: "Soft accent", value: "color-mix(in srgb, var(--p-primary-color) 45%, var(--p-text-color))" },
  { label: "Medium accent", value: "color-mix(in srgb, var(--p-primary-color) 70%, var(--p-text-color))" },
  { label: "Strong accent", value: "color-mix(in srgb, var(--p-primary-color) 85%, var(--p-text-color))" }
];
function Zk(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var Qr, wl;
function Xa() {
  if (wl) return Qr;
  wl = 1;
  var e = "\0", t = "\0", n = "";
  class o {
    _isDirected = !0;
    _isMultigraph = !1;
    _isCompound = !1;
    // Label for the graph itself
    _label;
    // Defaults to be set when creating a new node
    _defaultNodeLabelFn = () => {
    };
    // Defaults to be set when creating a new edge
    _defaultEdgeLabelFn = () => {
    };
    // v -> label
    _nodes = {};
    // v -> edgeObj
    _in = {};
    // u -> v -> Number
    _preds = {};
    // v -> edgeObj
    _out = {};
    // v -> w -> Number
    _sucs = {};
    // e -> edgeObj
    _edgeObjs = {};
    // e -> label
    _edgeLabels = {};
    /* Number of nodes in the graph. Should only be changed by the implementation. */
    _nodeCount = 0;
    /* Number of edges in the graph. Should only be changed by the implementation. */
    _edgeCount = 0;
    _parent;
    _children;
    constructor(l) {
      l && (this._isDirected = Object.hasOwn(l, "directed") ? l.directed : !0, this._isMultigraph = Object.hasOwn(l, "multigraph") ? l.multigraph : !1, this._isCompound = Object.hasOwn(l, "compound") ? l.compound : !1), this._isCompound && (this._parent = {}, this._children = {}, this._children[t] = {});
    }
    /* === Graph functions ========= */
    /**
     * Whether graph was created with 'directed' flag set to true or not.
     */
    isDirected() {
      return this._isDirected;
    }
    /**
     * Whether graph was created with 'multigraph' flag set to true or not.
     */
    isMultigraph() {
      return this._isMultigraph;
    }
    /**
     * Whether graph was created with 'compound' flag set to true or not.
     */
    isCompound() {
      return this._isCompound;
    }
    /**
     * Sets the label of the graph.
     */
    setGraph(l) {
      return this._label = l, this;
    }
    /**
     * Gets the graph label.
     */
    graph() {
      return this._label;
    }
    /* === Node functions ========== */
    /**
     * Sets the default node label. If newDefault is a function, it will be
     * invoked ach time when setting a label for a node. Otherwise, this label
     * will be assigned as default label in case if no label was specified while
     * setting a node.
     * Complexity: O(1).
     */
    setDefaultNodeLabel(l) {
      return this._defaultNodeLabelFn = l, typeof l != "function" && (this._defaultNodeLabelFn = () => l), this;
    }
    /**
     * Gets the number of nodes in the graph.
     * Complexity: O(1).
     */
    nodeCount() {
      return this._nodeCount;
    }
    /**
     * Gets all nodes of the graph. Note, the in case of compound graph subnodes are
     * not included in list.
     * Complexity: O(1).
     */
    nodes() {
      return Object.keys(this._nodes);
    }
    /**
     * Gets list of nodes without in-edges.
     * Complexity: O(|V|).
     */
    sources() {
      var l = this;
      return this.nodes().filter((d) => Object.keys(l._in[d]).length === 0);
    }
    /**
     * Gets list of nodes without out-edges.
     * Complexity: O(|V|).
     */
    sinks() {
      var l = this;
      return this.nodes().filter((d) => Object.keys(l._out[d]).length === 0);
    }
    /**
     * Invokes setNode method for each node in names list.
     * Complexity: O(|names|).
     */
    setNodes(l, d) {
      var f = arguments, h = this;
      return l.forEach(function(b) {
        f.length > 1 ? h.setNode(b, d) : h.setNode(b);
      }), this;
    }
    /**
     * Creates or updates the value for the node v in the graph. If label is supplied
     * it is set as the value for the node. If label is not supplied and the node was
     * created by this call then the default node label will be assigned.
     * Complexity: O(1).
     */
    setNode(l, d) {
      return Object.hasOwn(this._nodes, l) ? (arguments.length > 1 && (this._nodes[l] = d), this) : (this._nodes[l] = arguments.length > 1 ? d : this._defaultNodeLabelFn(l), this._isCompound && (this._parent[l] = t, this._children[l] = {}, this._children[t][l] = !0), this._in[l] = {}, this._preds[l] = {}, this._out[l] = {}, this._sucs[l] = {}, ++this._nodeCount, this);
    }
    /**
     * Gets the label of node with specified name.
     * Complexity: O(|V|).
     */
    node(l) {
      return this._nodes[l];
    }
    /**
     * Detects whether graph has a node with specified name or not.
     */
    hasNode(l) {
      return Object.hasOwn(this._nodes, l);
    }
    /**
     * Remove the node with the name from the graph or do nothing if the node is not in
     * the graph. If the node was removed this function also removes any incident
     * edges.
     * Complexity: O(1).
     */
    removeNode(l) {
      var d = this;
      if (Object.hasOwn(this._nodes, l)) {
        var f = (h) => d.removeEdge(d._edgeObjs[h]);
        delete this._nodes[l], this._isCompound && (this._removeFromParentsChildList(l), delete this._parent[l], this.children(l).forEach(function(h) {
          d.setParent(h);
        }), delete this._children[l]), Object.keys(this._in[l]).forEach(f), delete this._in[l], delete this._preds[l], Object.keys(this._out[l]).forEach(f), delete this._out[l], delete this._sucs[l], --this._nodeCount;
      }
      return this;
    }
    /**
     * Sets node p as a parent for node v if it is defined, or removes the
     * parent for v if p is undefined. Method throws an exception in case of
     * invoking it in context of noncompound graph.
     * Average-case complexity: O(1).
     */
    setParent(l, d) {
      if (!this._isCompound)
        throw new Error("Cannot set parent in a non-compound graph");
      if (d === void 0)
        d = t;
      else {
        d += "";
        for (var f = d; f !== void 0; f = this.parent(f))
          if (f === l)
            throw new Error("Setting " + d + " as parent of " + l + " would create a cycle");
        this.setNode(d);
      }
      return this.setNode(l), this._removeFromParentsChildList(l), this._parent[l] = d, this._children[d][l] = !0, this;
    }
    _removeFromParentsChildList(l) {
      delete this._children[this._parent[l]][l];
    }
    /**
     * Gets parent node for node v.
     * Complexity: O(1).
     */
    parent(l) {
      if (this._isCompound) {
        var d = this._parent[l];
        if (d !== t)
          return d;
      }
    }
    /**
     * Gets list of direct children of node v.
     * Complexity: O(1).
     */
    children(l = t) {
      if (this._isCompound) {
        var d = this._children[l];
        if (d)
          return Object.keys(d);
      } else {
        if (l === t)
          return this.nodes();
        if (this.hasNode(l))
          return [];
      }
    }
    /**
     * Return all nodes that are predecessors of the specified node or undefined if node v is not in
     * the graph. Behavior is undefined for undirected graphs - use neighbors instead.
     * Complexity: O(|V|).
     */
    predecessors(l) {
      var d = this._preds[l];
      if (d)
        return Object.keys(d);
    }
    /**
     * Return all nodes that are successors of the specified node or undefined if node v is not in
     * the graph. Behavior is undefined for undirected graphs - use neighbors instead.
     * Complexity: O(|V|).
     */
    successors(l) {
      var d = this._sucs[l];
      if (d)
        return Object.keys(d);
    }
    /**
     * Return all nodes that are predecessors or successors of the specified node or undefined if
     * node v is not in the graph.
     * Complexity: O(|V|).
     */
    neighbors(l) {
      var d = this.predecessors(l);
      if (d) {
        const h = new Set(d);
        for (var f of this.successors(l))
          h.add(f);
        return Array.from(h.values());
      }
    }
    isLeaf(l) {
      var d;
      return this.isDirected() ? d = this.successors(l) : d = this.neighbors(l), d.length === 0;
    }
    /**
     * Creates new graph with nodes filtered via filter. Edges incident to rejected node
     * are also removed. In case of compound graph, if parent is rejected by filter,
     * than all its children are rejected too.
     * Average-case complexity: O(|E|+|V|).
     */
    filterNodes(l) {
      var d = new this.constructor({
        directed: this._isDirected,
        multigraph: this._isMultigraph,
        compound: this._isCompound
      });
      d.setGraph(this.graph());
      var f = this;
      Object.entries(this._nodes).forEach(function([w, m]) {
        l(w) && d.setNode(w, m);
      }), Object.values(this._edgeObjs).forEach(function(w) {
        d.hasNode(w.v) && d.hasNode(w.w) && d.setEdge(w, f.edge(w));
      });
      var h = {};
      function b(w) {
        var m = f.parent(w);
        return m === void 0 || d.hasNode(m) ? (h[w] = m, m) : m in h ? h[m] : b(m);
      }
      return this._isCompound && d.nodes().forEach((w) => d.setParent(w, b(w))), d;
    }
    /* === Edge functions ========== */
    /**
     * Sets the default edge label or factory function. This label will be
     * assigned as default label in case if no label was specified while setting
     * an edge or this function will be invoked each time when setting an edge
     * with no label specified and returned value * will be used as a label for edge.
     * Complexity: O(1).
     */
    setDefaultEdgeLabel(l) {
      return this._defaultEdgeLabelFn = l, typeof l != "function" && (this._defaultEdgeLabelFn = () => l), this;
    }
    /**
     * Gets the number of edges in the graph.
     * Complexity: O(1).
     */
    edgeCount() {
      return this._edgeCount;
    }
    /**
     * Gets edges of the graph. In case of compound graph subgraphs are not considered.
     * Complexity: O(|E|).
     */
    edges() {
      return Object.values(this._edgeObjs);
    }
    /**
     * Establish an edges path over the nodes in nodes list. If some edge is already
     * exists, it will update its label, otherwise it will create an edge between pair
     * of nodes with label provided or default label if no label provided.
     * Complexity: O(|nodes|).
     */
    setPath(l, d) {
      var f = this, h = arguments;
      return l.reduce(function(b, w) {
        return h.length > 1 ? f.setEdge(b, w, d) : f.setEdge(b, w), w;
      }), this;
    }
    /**
     * Creates or updates the label for the edge (v, w) with the optionally supplied
     * name. If label is supplied it is set as the value for the edge. If label is not
     * supplied and the edge was created by this call then the default edge label will
     * be assigned. The name parameter is only useful with multigraphs.
     */
    setEdge() {
      var l, d, f, h, b = !1, w = arguments[0];
      typeof w == "object" && w !== null && "v" in w ? (l = w.v, d = w.w, f = w.name, arguments.length === 2 && (h = arguments[1], b = !0)) : (l = w, d = arguments[1], f = arguments[3], arguments.length > 2 && (h = arguments[2], b = !0)), l = "" + l, d = "" + d, f !== void 0 && (f = "" + f);
      var m = i(this._isDirected, l, d, f);
      if (Object.hasOwn(this._edgeLabels, m))
        return b && (this._edgeLabels[m] = h), this;
      if (f !== void 0 && !this._isMultigraph)
        throw new Error("Cannot set a named edge when isMultigraph = false");
      this.setNode(l), this.setNode(d), this._edgeLabels[m] = b ? h : this._defaultEdgeLabelFn(l, d, f);
      var p = s(this._isDirected, l, d, f);
      return l = p.v, d = p.w, Object.freeze(p), this._edgeObjs[m] = p, r(this._preds[d], l), r(this._sucs[l], d), this._in[d][m] = p, this._out[l][m] = p, this._edgeCount++, this;
    }
    /**
     * Gets the label for the specified edge.
     * Complexity: O(1).
     */
    edge(l, d, f) {
      var h = arguments.length === 1 ? u(this._isDirected, arguments[0]) : i(this._isDirected, l, d, f);
      return this._edgeLabels[h];
    }
    /**
     * Gets the label for the specified edge and converts it to an object.
     * Complexity: O(1)
     */
    edgeAsObj() {
      const l = this.edge(...arguments);
      return typeof l != "object" ? { label: l } : l;
    }
    /**
     * Detects whether the graph contains specified edge or not. No subgraphs are considered.
     * Complexity: O(1).
     */
    hasEdge(l, d, f) {
      var h = arguments.length === 1 ? u(this._isDirected, arguments[0]) : i(this._isDirected, l, d, f);
      return Object.hasOwn(this._edgeLabels, h);
    }
    /**
     * Removes the specified edge from the graph. No subgraphs are considered.
     * Complexity: O(1).
     */
    removeEdge(l, d, f) {
      var h = arguments.length === 1 ? u(this._isDirected, arguments[0]) : i(this._isDirected, l, d, f), b = this._edgeObjs[h];
      return b && (l = b.v, d = b.w, delete this._edgeLabels[h], delete this._edgeObjs[h], a(this._preds[d], l), a(this._sucs[l], d), delete this._in[d][h], delete this._out[l][h], this._edgeCount--), this;
    }
    /**
     * Return all edges that point to the node v. Optionally filters those edges down to just those
     * coming from node u. Behavior is undefined for undirected graphs - use nodeEdges instead.
     * Complexity: O(|E|).
     */
    inEdges(l, d) {
      var f = this._in[l];
      if (f) {
        var h = Object.values(f);
        return d ? h.filter((b) => b.v === d) : h;
      }
    }
    /**
     * Return all edges that are pointed at by node v. Optionally filters those edges down to just
     * those point to w. Behavior is undefined for undirected graphs - use nodeEdges instead.
     * Complexity: O(|E|).
     */
    outEdges(l, d) {
      var f = this._out[l];
      if (f) {
        var h = Object.values(f);
        return d ? h.filter((b) => b.w === d) : h;
      }
    }
    /**
     * Returns all edges to or from node v regardless of direction. Optionally filters those edges
     * down to just those between nodes v and w regardless of direction.
     * Complexity: O(|E|).
     */
    nodeEdges(l, d) {
      var f = this.inEdges(l, d);
      if (f)
        return f.concat(this.outEdges(l, d));
    }
  }
  function r(c, l) {
    c[l] ? c[l]++ : c[l] = 1;
  }
  function a(c, l) {
    --c[l] || delete c[l];
  }
  function i(c, l, d, f) {
    var h = "" + l, b = "" + d;
    if (!c && h > b) {
      var w = h;
      h = b, b = w;
    }
    return h + n + b + n + (f === void 0 ? e : f);
  }
  function s(c, l, d, f) {
    var h = "" + l, b = "" + d;
    if (!c && h > b) {
      var w = h;
      h = b, b = w;
    }
    var m = { v: h, w: b };
    return f && (m.name = f), m;
  }
  function u(c, l) {
    return i(c, l.v, l.w, l.name);
  }
  return Qr = o, Qr;
}
var ei, kl;
function Jk() {
  return kl || (kl = 1, ei = "2.2.4"), ei;
}
var ti, _l;
function Qk() {
  return _l || (_l = 1, ti = {
    Graph: Xa(),
    version: Jk()
  }), ti;
}
var ni, xl;
function e_() {
  if (xl) return ni;
  xl = 1;
  var e = Xa();
  ni = {
    write: t,
    read: r
  };
  function t(a) {
    var i = {
      options: {
        directed: a.isDirected(),
        multigraph: a.isMultigraph(),
        compound: a.isCompound()
      },
      nodes: n(a),
      edges: o(a)
    };
    return a.graph() !== void 0 && (i.value = structuredClone(a.graph())), i;
  }
  function n(a) {
    return a.nodes().map(function(i) {
      var s = a.node(i), u = a.parent(i), c = { v: i };
      return s !== void 0 && (c.value = s), u !== void 0 && (c.parent = u), c;
    });
  }
  function o(a) {
    return a.edges().map(function(i) {
      var s = a.edge(i), u = { v: i.v, w: i.w };
      return i.name !== void 0 && (u.name = i.name), s !== void 0 && (u.value = s), u;
    });
  }
  function r(a) {
    var i = new e(a.options).setGraph(a.value);
    return a.nodes.forEach(function(s) {
      i.setNode(s.v, s.value), s.parent && i.setParent(s.v, s.parent);
    }), a.edges.forEach(function(s) {
      i.setEdge({ v: s.v, w: s.w, name: s.name }, s.value);
    }), i;
  }
  return ni;
}
var oi, El;
function t_() {
  if (El) return oi;
  El = 1, oi = e;
  function e(t) {
    var n = {}, o = [], r;
    function a(i) {
      Object.hasOwn(n, i) || (n[i] = !0, r.push(i), t.successors(i).forEach(a), t.predecessors(i).forEach(a));
    }
    return t.nodes().forEach(function(i) {
      r = [], a(i), r.length && o.push(r);
    }), o;
  }
  return oi;
}
var ri, $l;
function hd() {
  if ($l) return ri;
  $l = 1;
  class e {
    _arr = [];
    _keyIndices = {};
    /**
     * Returns the number of elements in the queue. Takes `O(1)` time.
     */
    size() {
      return this._arr.length;
    }
    /**
     * Returns the keys that are in the queue. Takes `O(n)` time.
     */
    keys() {
      return this._arr.map(function(n) {
        return n.key;
      });
    }
    /**
     * Returns `true` if **key** is in the queue and `false` if not.
     */
    has(n) {
      return Object.hasOwn(this._keyIndices, n);
    }
    /**
     * Returns the priority for **key**. If **key** is not present in the queue
     * then this function returns `undefined`. Takes `O(1)` time.
     *
     * @param {Object} key
     */
    priority(n) {
      var o = this._keyIndices[n];
      if (o !== void 0)
        return this._arr[o].priority;
    }
    /**
     * Returns the key for the minimum element in this queue. If the queue is
     * empty this function throws an Error. Takes `O(1)` time.
     */
    min() {
      if (this.size() === 0)
        throw new Error("Queue underflow");
      return this._arr[0].key;
    }
    /**
     * Inserts a new key into the priority queue. If the key already exists in
     * the queue this function returns `false`; otherwise it will return `true`.
     * Takes `O(n)` time.
     *
     * @param {Object} key the key to add
     * @param {Number} priority the initial priority for the key
     */
    add(n, o) {
      var r = this._keyIndices;
      if (n = String(n), !Object.hasOwn(r, n)) {
        var a = this._arr, i = a.length;
        return r[n] = i, a.push({ key: n, priority: o }), this._decrease(i), !0;
      }
      return !1;
    }
    /**
     * Removes and returns the smallest key in the queue. Takes `O(log n)` time.
     */
    removeMin() {
      this._swap(0, this._arr.length - 1);
      var n = this._arr.pop();
      return delete this._keyIndices[n.key], this._heapify(0), n.key;
    }
    /**
     * Decreases the priority for **key** to **priority**. If the new priority is
     * greater than the previous priority, this function will throw an Error.
     *
     * @param {Object} key the key for which to raise priority
     * @param {Number} priority the new priority for the key
     */
    decrease(n, o) {
      var r = this._keyIndices[n];
      if (o > this._arr[r].priority)
        throw new Error("New priority is greater than current priority. Key: " + n + " Old: " + this._arr[r].priority + " New: " + o);
      this._arr[r].priority = o, this._decrease(r);
    }
    _heapify(n) {
      var o = this._arr, r = 2 * n, a = r + 1, i = n;
      r < o.length && (i = o[r].priority < o[i].priority ? r : i, a < o.length && (i = o[a].priority < o[i].priority ? a : i), i !== n && (this._swap(n, i), this._heapify(i)));
    }
    _decrease(n) {
      for (var o = this._arr, r = o[n].priority, a; n !== 0 && (a = n >> 1, !(o[a].priority < r)); )
        this._swap(n, a), n = a;
    }
    _swap(n, o) {
      var r = this._arr, a = this._keyIndices, i = r[n], s = r[o];
      r[n] = s, r[o] = i, a[s.key] = n, a[i.key] = o;
    }
  }
  return ri = e, ri;
}
var ii, Sl;
function pd() {
  if (Sl) return ii;
  Sl = 1;
  var e = hd();
  ii = n;
  var t = () => 1;
  function n(r, a, i, s) {
    return o(
      r,
      String(a),
      i || t,
      s || function(u) {
        return r.outEdges(u);
      }
    );
  }
  function o(r, a, i, s) {
    var u = {}, c = new e(), l, d, f = function(h) {
      var b = h.v !== l ? h.v : h.w, w = u[b], m = i(h), p = d.distance + m;
      if (m < 0)
        throw new Error("dijkstra does not allow negative edge weights. Bad edge: " + h + " Weight: " + m);
      p < w.distance && (w.distance = p, w.predecessor = l, c.decrease(b, p));
    };
    for (r.nodes().forEach(function(h) {
      var b = h === a ? 0 : Number.POSITIVE_INFINITY;
      u[h] = { distance: b }, c.add(h, b);
    }); c.size() > 0 && (l = c.removeMin(), d = u[l], d.distance !== Number.POSITIVE_INFINITY); )
      s(l).forEach(f);
    return u;
  }
  return ii;
}
var ai, Cl;
function n_() {
  if (Cl) return ai;
  Cl = 1;
  var e = pd();
  ai = t;
  function t(n, o, r) {
    return n.nodes().reduce(function(a, i) {
      return a[i] = e(n, i, o, r), a;
    }, {});
  }
  return ai;
}
var si, Nl;
function gd() {
  if (Nl) return si;
  Nl = 1, si = e;
  function e(t) {
    var n = 0, o = [], r = {}, a = [];
    function i(s) {
      var u = r[s] = {
        onStack: !0,
        lowlink: n,
        index: n++
      };
      if (o.push(s), t.successors(s).forEach(function(d) {
        Object.hasOwn(r, d) ? r[d].onStack && (u.lowlink = Math.min(u.lowlink, r[d].index)) : (i(d), u.lowlink = Math.min(u.lowlink, r[d].lowlink));
      }), u.lowlink === u.index) {
        var c = [], l;
        do
          l = o.pop(), r[l].onStack = !1, c.push(l);
        while (s !== l);
        a.push(c);
      }
    }
    return t.nodes().forEach(function(s) {
      Object.hasOwn(r, s) || i(s);
    }), a;
  }
  return si;
}
var li, Ml;
function o_() {
  if (Ml) return li;
  Ml = 1;
  var e = gd();
  li = t;
  function t(n) {
    return e(n).filter(function(o) {
      return o.length > 1 || o.length === 1 && n.hasEdge(o[0], o[0]);
    });
  }
  return li;
}
var ui, Tl;
function r_() {
  if (Tl) return ui;
  Tl = 1, ui = t;
  var e = () => 1;
  function t(o, r, a) {
    return n(
      o,
      r || e,
      a || function(i) {
        return o.outEdges(i);
      }
    );
  }
  function n(o, r, a) {
    var i = {}, s = o.nodes();
    return s.forEach(function(u) {
      i[u] = {}, i[u][u] = { distance: 0 }, s.forEach(function(c) {
        u !== c && (i[u][c] = { distance: Number.POSITIVE_INFINITY });
      }), a(u).forEach(function(c) {
        var l = c.v === u ? c.w : c.v, d = r(c);
        i[u][l] = { distance: d, predecessor: u };
      });
    }), s.forEach(function(u) {
      var c = i[u];
      s.forEach(function(l) {
        var d = i[l];
        s.forEach(function(f) {
          var h = d[u], b = c[f], w = d[f], m = h.distance + b.distance;
          m < w.distance && (w.distance = m, w.predecessor = b.predecessor);
        });
      });
    }), i;
  }
  return ui;
}
var ci, Il;
function vd() {
  if (Il) return ci;
  Il = 1;
  function e(n) {
    var o = {}, r = {}, a = [];
    function i(s) {
      if (Object.hasOwn(r, s))
        throw new t();
      Object.hasOwn(o, s) || (r[s] = !0, o[s] = !0, n.predecessors(s).forEach(i), delete r[s], a.push(s));
    }
    if (n.sinks().forEach(i), Object.keys(o).length !== n.nodeCount())
      throw new t();
    return a;
  }
  class t extends Error {
    constructor() {
      super(...arguments);
    }
  }
  return ci = e, e.CycleException = t, ci;
}
var di, Dl;
function i_() {
  if (Dl) return di;
  Dl = 1;
  var e = vd();
  di = t;
  function t(n) {
    try {
      e(n);
    } catch (o) {
      if (o instanceof e.CycleException)
        return !1;
      throw o;
    }
    return !0;
  }
  return di;
}
var fi, Al;
function md() {
  if (Al) return fi;
  Al = 1, fi = e;
  function e(r, a, i) {
    Array.isArray(a) || (a = [a]);
    var s = r.isDirected() ? (d) => r.successors(d) : (d) => r.neighbors(d), u = i === "post" ? t : n, c = [], l = {};
    return a.forEach((d) => {
      if (!r.hasNode(d))
        throw new Error("Graph does not have node: " + d);
      u(d, s, l, c);
    }), c;
  }
  function t(r, a, i, s) {
    for (var u = [[r, !1]]; u.length > 0; ) {
      var c = u.pop();
      c[1] ? s.push(c[0]) : Object.hasOwn(i, c[0]) || (i[c[0]] = !0, u.push([c[0], !0]), o(a(c[0]), (l) => u.push([l, !1])));
    }
  }
  function n(r, a, i, s) {
    for (var u = [r]; u.length > 0; ) {
      var c = u.pop();
      Object.hasOwn(i, c) || (i[c] = !0, s.push(c), o(a(c), (l) => u.push(l)));
    }
  }
  function o(r, a) {
    for (var i = r.length; i--; )
      a(r[i], i, r);
    return r;
  }
  return fi;
}
var hi, Pl;
function a_() {
  if (Pl) return hi;
  Pl = 1;
  var e = md();
  hi = t;
  function t(n, o) {
    return e(n, o, "post");
  }
  return hi;
}
var pi, Ol;
function s_() {
  if (Ol) return pi;
  Ol = 1;
  var e = md();
  pi = t;
  function t(n, o) {
    return e(n, o, "pre");
  }
  return pi;
}
var gi, Rl;
function l_() {
  if (Rl) return gi;
  Rl = 1;
  var e = Xa(), t = hd();
  gi = n;
  function n(o, r) {
    var a = new e(), i = {}, s = new t(), u;
    function c(d) {
      var f = d.v === u ? d.w : d.v, h = s.priority(f);
      if (h !== void 0) {
        var b = r(d);
        b < h && (i[f] = u, s.decrease(f, b));
      }
    }
    if (o.nodeCount() === 0)
      return a;
    o.nodes().forEach(function(d) {
      s.add(d, Number.POSITIVE_INFINITY), a.setNode(d);
    }), s.decrease(o.nodes()[0], 0);
    for (var l = !1; s.size() > 0; ) {
      if (u = s.removeMin(), Object.hasOwn(i, u))
        a.setEdge(u, i[u]);
      else {
        if (l)
          throw new Error("Input graph is not connected: " + o);
        l = !0;
      }
      o.nodeEdges(u).forEach(c);
    }
    return a;
  }
  return gi;
}
var vi, zl;
function u_() {
  return zl || (zl = 1, vi = {
    components: t_(),
    dijkstra: pd(),
    dijkstraAll: n_(),
    findCycles: o_(),
    floydWarshall: r_(),
    isAcyclic: i_(),
    postorder: a_(),
    preorder: s_(),
    prim: l_(),
    tarjan: gd(),
    topsort: vd()
  }), vi;
}
var mi, Bl;
function rt() {
  if (Bl) return mi;
  Bl = 1;
  var e = Qk();
  return mi = {
    Graph: e.Graph,
    json: e_(),
    alg: u_(),
    version: e.version
  }, mi;
}
var yi, Ll;
function c_() {
  if (Ll) return yi;
  Ll = 1;
  class e {
    constructor() {
      let r = {};
      r._next = r._prev = r, this._sentinel = r;
    }
    dequeue() {
      let r = this._sentinel, a = r._prev;
      if (a !== r)
        return t(a), a;
    }
    enqueue(r) {
      let a = this._sentinel;
      r._prev && r._next && t(r), r._next = a._next, a._next._prev = r, a._next = r, r._prev = a;
    }
    toString() {
      let r = [], a = this._sentinel, i = a._prev;
      for (; i !== a; )
        r.push(JSON.stringify(i, n)), i = i._prev;
      return "[" + r.join(", ") + "]";
    }
  }
  function t(o) {
    o._prev._next = o._next, o._next._prev = o._prev, delete o._next, delete o._prev;
  }
  function n(o, r) {
    if (o !== "_next" && o !== "_prev")
      return r;
  }
  return yi = e, yi;
}
var bi, Vl;
function d_() {
  if (Vl) return bi;
  Vl = 1;
  let e = rt().Graph, t = c_();
  bi = o;
  let n = () => 1;
  function o(c, l) {
    if (c.nodeCount() <= 1)
      return [];
    let d = i(c, l || n);
    return r(d.graph, d.buckets, d.zeroIdx).flatMap((h) => c.outEdges(h.v, h.w));
  }
  function r(c, l, d) {
    let f = [], h = l[l.length - 1], b = l[0], w;
    for (; c.nodeCount(); ) {
      for (; w = b.dequeue(); )
        a(c, l, d, w);
      for (; w = h.dequeue(); )
        a(c, l, d, w);
      if (c.nodeCount()) {
        for (let m = l.length - 2; m > 0; --m)
          if (w = l[m].dequeue(), w) {
            f = f.concat(a(c, l, d, w, !0));
            break;
          }
      }
    }
    return f;
  }
  function a(c, l, d, f, h) {
    let b = h ? [] : void 0;
    return c.inEdges(f.v).forEach((w) => {
      let m = c.edge(w), p = c.node(w.v);
      h && b.push({ v: w.v, w: w.w }), p.out -= m, s(l, d, p);
    }), c.outEdges(f.v).forEach((w) => {
      let m = c.edge(w), p = w.w, v = c.node(p);
      v.in -= m, s(l, d, v);
    }), c.removeNode(f.v), b;
  }
  function i(c, l) {
    let d = new e(), f = 0, h = 0;
    c.nodes().forEach((m) => {
      d.setNode(m, { v: m, in: 0, out: 0 });
    }), c.edges().forEach((m) => {
      let p = d.edge(m.v, m.w) || 0, v = l(m), g = p + v;
      d.setEdge(m.v, m.w, g), h = Math.max(h, d.node(m.v).out += v), f = Math.max(f, d.node(m.w).in += v);
    });
    let b = u(h + f + 3).map(() => new t()), w = f + 1;
    return d.nodes().forEach((m) => {
      s(b, w, d.node(m));
    }), { graph: d, buckets: b, zeroIdx: w };
  }
  function s(c, l, d) {
    d.out ? d.in ? c[d.out - d.in + l].enqueue(d) : c[c.length - 1].enqueue(d) : c[0].enqueue(d);
  }
  function u(c) {
    const l = [];
    for (let d = 0; d < c; d++)
      l.push(d);
    return l;
  }
  return bi;
}
var wi, Hl;
function Ge() {
  if (Hl) return wi;
  Hl = 1;
  let e = rt().Graph;
  wi = {
    addBorderNode: l,
    addDummyNode: t,
    applyWithChunking: h,
    asNonCompoundGraph: o,
    buildLayerMatrix: s,
    intersectRect: i,
    mapValues: F,
    maxRank: b,
    normalizeRanks: u,
    notime: p,
    partition: w,
    pick: P,
    predecessorWeights: a,
    range: k,
    removeEmptyRanks: c,
    simplify: n,
    successorWeights: r,
    time: m,
    uniqueId: g,
    zipObject: K
  };
  function t(C, N, M, B) {
    for (var S = B; C.hasNode(S); )
      S = g(B);
    return M.dummy = N, C.setNode(S, M), S;
  }
  function n(C) {
    let N = new e().setGraph(C.graph());
    return C.nodes().forEach((M) => N.setNode(M, C.node(M))), C.edges().forEach((M) => {
      let B = N.edge(M.v, M.w) || { weight: 0, minlen: 1 }, S = C.edge(M);
      N.setEdge(M.v, M.w, {
        weight: B.weight + S.weight,
        minlen: Math.max(B.minlen, S.minlen)
      });
    }), N;
  }
  function o(C) {
    let N = new e({ multigraph: C.isMultigraph() }).setGraph(C.graph());
    return C.nodes().forEach((M) => {
      C.children(M).length || N.setNode(M, C.node(M));
    }), C.edges().forEach((M) => {
      N.setEdge(M, C.edge(M));
    }), N;
  }
  function r(C) {
    let N = C.nodes().map((M) => {
      let B = {};
      return C.outEdges(M).forEach((S) => {
        B[S.w] = (B[S.w] || 0) + C.edge(S).weight;
      }), B;
    });
    return K(C.nodes(), N);
  }
  function a(C) {
    let N = C.nodes().map((M) => {
      let B = {};
      return C.inEdges(M).forEach((S) => {
        B[S.v] = (B[S.v] || 0) + C.edge(S).weight;
      }), B;
    });
    return K(C.nodes(), N);
  }
  function i(C, N) {
    let M = C.x, B = C.y, S = N.x - M, Q = N.y - B, y = C.width / 2, O = C.height / 2;
    if (!S && !Q)
      throw new Error("Not possible to find intersection inside of the rectangle");
    let E, X;
    return Math.abs(Q) * y > Math.abs(S) * O ? (Q < 0 && (O = -O), E = O * S / Q, X = O) : (S < 0 && (y = -y), E = y, X = y * Q / S), { x: M + E, y: B + X };
  }
  function s(C) {
    let N = k(b(C) + 1).map(() => []);
    return C.nodes().forEach((M) => {
      let B = C.node(M), S = B.rank;
      S !== void 0 && (N[S][B.order] = M);
    }), N;
  }
  function u(C) {
    let N = C.nodes().map((B) => {
      let S = C.node(B).rank;
      return S === void 0 ? Number.MAX_VALUE : S;
    }), M = h(Math.min, N);
    C.nodes().forEach((B) => {
      let S = C.node(B);
      Object.hasOwn(S, "rank") && (S.rank -= M);
    });
  }
  function c(C) {
    let N = C.nodes().map((y) => C.node(y).rank), M = h(Math.min, N), B = [];
    C.nodes().forEach((y) => {
      let O = C.node(y).rank - M;
      B[O] || (B[O] = []), B[O].push(y);
    });
    let S = 0, Q = C.graph().nodeRankFactor;
    Array.from(B).forEach((y, O) => {
      y === void 0 && O % Q !== 0 ? --S : y !== void 0 && S && y.forEach((E) => C.node(E).rank += S);
    });
  }
  function l(C, N, M, B) {
    let S = {
      width: 0,
      height: 0
    };
    return arguments.length >= 4 && (S.rank = M, S.order = B), t(C, "border", S, N);
  }
  function d(C, N = f) {
    const M = [];
    for (let B = 0; B < C.length; B += N) {
      const S = C.slice(B, B + N);
      M.push(S);
    }
    return M;
  }
  const f = 65535;
  function h(C, N) {
    if (N.length > f) {
      const M = d(N);
      return C.apply(null, M.map((B) => C.apply(null, B)));
    } else
      return C.apply(null, N);
  }
  function b(C) {
    const M = C.nodes().map((B) => {
      let S = C.node(B).rank;
      return S === void 0 ? Number.MIN_VALUE : S;
    });
    return h(Math.max, M);
  }
  function w(C, N) {
    let M = { lhs: [], rhs: [] };
    return C.forEach((B) => {
      N(B) ? M.lhs.push(B) : M.rhs.push(B);
    }), M;
  }
  function m(C, N) {
    let M = Date.now();
    try {
      return N();
    } finally {
      console.log(C + " time: " + (Date.now() - M) + "ms");
    }
  }
  function p(C, N) {
    return N();
  }
  let v = 0;
  function g(C) {
    var N = ++v;
    return C + ("" + N);
  }
  function k(C, N, M = 1) {
    N == null && (N = C, C = 0);
    let B = (Q) => Q < N;
    M < 0 && (B = (Q) => N < Q);
    const S = [];
    for (let Q = C; B(Q); Q += M)
      S.push(Q);
    return S;
  }
  function P(C, N) {
    const M = {};
    for (const B of N)
      C[B] !== void 0 && (M[B] = C[B]);
    return M;
  }
  function F(C, N) {
    let M = N;
    return typeof N == "string" && (M = (B) => B[N]), Object.entries(C).reduce((B, [S, Q]) => (B[S] = M(Q, S), B), {});
  }
  function K(C, N) {
    return C.reduce((M, B, S) => (M[B] = N[S], M), {});
  }
  return wi;
}
var ki, Fl;
function f_() {
  if (Fl) return ki;
  Fl = 1;
  let e = d_(), t = Ge().uniqueId;
  ki = {
    run: n,
    undo: r
  };
  function n(a) {
    (a.graph().acyclicer === "greedy" ? e(a, s(a)) : o(a)).forEach((u) => {
      let c = a.edge(u);
      a.removeEdge(u), c.forwardName = u.name, c.reversed = !0, a.setEdge(u.w, u.v, c, t("rev"));
    });
    function s(u) {
      return (c) => u.edge(c).weight;
    }
  }
  function o(a) {
    let i = [], s = {}, u = {};
    function c(l) {
      Object.hasOwn(u, l) || (u[l] = !0, s[l] = !0, a.outEdges(l).forEach((d) => {
        Object.hasOwn(s, d.w) ? i.push(d) : c(d.w);
      }), delete s[l]);
    }
    return a.nodes().forEach(c), i;
  }
  function r(a) {
    a.edges().forEach((i) => {
      let s = a.edge(i);
      if (s.reversed) {
        a.removeEdge(i);
        let u = s.forwardName;
        delete s.reversed, delete s.forwardName, a.setEdge(i.w, i.v, s, u);
      }
    });
  }
  return ki;
}
var _i, Gl;
function h_() {
  if (Gl) return _i;
  Gl = 1;
  let e = Ge();
  _i = {
    run: t,
    undo: o
  };
  function t(r) {
    r.graph().dummyChains = [], r.edges().forEach((a) => n(r, a));
  }
  function n(r, a) {
    let i = a.v, s = r.node(i).rank, u = a.w, c = r.node(u).rank, l = a.name, d = r.edge(a), f = d.labelRank;
    if (c === s + 1) return;
    r.removeEdge(a);
    let h, b, w;
    for (w = 0, ++s; s < c; ++w, ++s)
      d.points = [], b = {
        width: 0,
        height: 0,
        edgeLabel: d,
        edgeObj: a,
        rank: s
      }, h = e.addDummyNode(r, "edge", b, "_d"), s === f && (b.width = d.width, b.height = d.height, b.dummy = "edge-label", b.labelpos = d.labelpos), r.setEdge(i, h, { weight: d.weight }, l), w === 0 && r.graph().dummyChains.push(h), i = h;
    r.setEdge(i, u, { weight: d.weight }, l);
  }
  function o(r) {
    r.graph().dummyChains.forEach((a) => {
      let i = r.node(a), s = i.edgeLabel, u;
      for (r.setEdge(i.edgeObj, s); i.dummy; )
        u = r.successors(a)[0], r.removeNode(a), s.points.push({ x: i.x, y: i.y }), i.dummy === "edge-label" && (s.x = i.x, s.y = i.y, s.width = i.width, s.height = i.height), a = u, i = r.node(a);
    });
  }
  return _i;
}
var xi, Yl;
function lr() {
  if (Yl) return xi;
  Yl = 1;
  const { applyWithChunking: e } = Ge();
  xi = {
    longestPath: t,
    slack: n
  };
  function t(o) {
    var r = {};
    function a(i) {
      var s = o.node(i);
      if (Object.hasOwn(r, i))
        return s.rank;
      r[i] = !0;
      let u = o.outEdges(i).map((l) => l == null ? Number.POSITIVE_INFINITY : a(l.w) - o.edge(l).minlen);
      var c = e(Math.min, u);
      return c === Number.POSITIVE_INFINITY && (c = 0), s.rank = c;
    }
    o.sources().forEach(a);
  }
  function n(o, r) {
    return o.node(r.w).rank - o.node(r.v).rank - o.edge(r).minlen;
  }
  return xi;
}
var Ei, Ul;
function yd() {
  if (Ul) return Ei;
  Ul = 1;
  var e = rt().Graph, t = lr().slack;
  Ei = n;
  function n(i) {
    var s = new e({ directed: !1 }), u = i.nodes()[0], c = i.nodeCount();
    s.setNode(u, {});
    for (var l, d; o(s, i) < c; )
      l = r(s, i), d = s.hasNode(l.v) ? t(i, l) : -t(i, l), a(s, i, d);
    return s;
  }
  function o(i, s) {
    function u(c) {
      s.nodeEdges(c).forEach((l) => {
        var d = l.v, f = c === d ? l.w : d;
        !i.hasNode(f) && !t(s, l) && (i.setNode(f, {}), i.setEdge(c, f, {}), u(f));
      });
    }
    return i.nodes().forEach(u), i.nodeCount();
  }
  function r(i, s) {
    return s.edges().reduce((c, l) => {
      let d = Number.POSITIVE_INFINITY;
      return i.hasNode(l.v) !== i.hasNode(l.w) && (d = t(s, l)), d < c[0] ? [d, l] : c;
    }, [Number.POSITIVE_INFINITY, null])[1];
  }
  function a(i, s, u) {
    i.nodes().forEach((c) => s.node(c).rank += u);
  }
  return Ei;
}
var $i, ql;
function p_() {
  if (ql) return $i;
  ql = 1;
  var e = yd(), t = lr().slack, n = lr().longestPath, o = rt().alg.preorder, r = rt().alg.postorder, a = Ge().simplify;
  $i = i, i.initLowLimValues = l, i.initCutValues = s, i.calcCutValue = c, i.leaveEdge = f, i.enterEdge = h, i.exchangeEdges = b;
  function i(v) {
    v = a(v), n(v);
    var g = e(v);
    l(g), s(g, v);
    for (var k, P; k = f(g); )
      P = h(g, v, k), b(g, v, k, P);
  }
  function s(v, g) {
    var k = r(v, v.nodes());
    k = k.slice(0, k.length - 1), k.forEach((P) => u(v, g, P));
  }
  function u(v, g, k) {
    var P = v.node(k), F = P.parent;
    v.edge(k, F).cutvalue = c(v, g, k);
  }
  function c(v, g, k) {
    var P = v.node(k), F = P.parent, K = !0, C = g.edge(k, F), N = 0;
    return C || (K = !1, C = g.edge(F, k)), N = C.weight, g.nodeEdges(k).forEach((M) => {
      var B = M.v === k, S = B ? M.w : M.v;
      if (S !== F) {
        var Q = B === K, y = g.edge(M).weight;
        if (N += Q ? y : -y, m(v, k, S)) {
          var O = v.edge(k, S).cutvalue;
          N += Q ? -O : O;
        }
      }
    }), N;
  }
  function l(v, g) {
    arguments.length < 2 && (g = v.nodes()[0]), d(v, {}, 1, g);
  }
  function d(v, g, k, P, F) {
    var K = k, C = v.node(P);
    return g[P] = !0, v.neighbors(P).forEach((N) => {
      Object.hasOwn(g, N) || (k = d(v, g, k, N, P));
    }), C.low = K, C.lim = k++, F ? C.parent = F : delete C.parent, k;
  }
  function f(v) {
    return v.edges().find((g) => v.edge(g).cutvalue < 0);
  }
  function h(v, g, k) {
    var P = k.v, F = k.w;
    g.hasEdge(P, F) || (P = k.w, F = k.v);
    var K = v.node(P), C = v.node(F), N = K, M = !1;
    K.lim > C.lim && (N = C, M = !0);
    var B = g.edges().filter((S) => M === p(v, v.node(S.v), N) && M !== p(v, v.node(S.w), N));
    return B.reduce((S, Q) => t(g, Q) < t(g, S) ? Q : S);
  }
  function b(v, g, k, P) {
    var F = k.v, K = k.w;
    v.removeEdge(F, K), v.setEdge(P.v, P.w, {}), l(v), s(v, g), w(v, g);
  }
  function w(v, g) {
    var k = v.nodes().find((F) => !g.node(F).parent), P = o(v, k);
    P = P.slice(1), P.forEach((F) => {
      var K = v.node(F).parent, C = g.edge(F, K), N = !1;
      C || (C = g.edge(K, F), N = !0), g.node(F).rank = g.node(K).rank + (N ? C.minlen : -C.minlen);
    });
  }
  function m(v, g, k) {
    return v.hasEdge(g, k);
  }
  function p(v, g, k) {
    return k.low <= g.lim && g.lim <= k.lim;
  }
  return $i;
}
var Si, Xl;
function g_() {
  if (Xl) return Si;
  Xl = 1;
  var e = lr(), t = e.longestPath, n = yd(), o = p_();
  Si = r;
  function r(u) {
    var c = u.graph().ranker;
    if (c instanceof Function)
      return c(u);
    switch (u.graph().ranker) {
      case "network-simplex":
        s(u);
        break;
      case "tight-tree":
        i(u);
        break;
      case "longest-path":
        a(u);
        break;
      case "none":
        break;
      default:
        s(u);
    }
  }
  var a = t;
  function i(u) {
    t(u), n(u);
  }
  function s(u) {
    o(u);
  }
  return Si;
}
var Ci, Wl;
function v_() {
  if (Wl) return Ci;
  Wl = 1, Ci = e;
  function e(o) {
    let r = n(o);
    o.graph().dummyChains.forEach((a) => {
      let i = o.node(a), s = i.edgeObj, u = t(o, r, s.v, s.w), c = u.path, l = u.lca, d = 0, f = c[d], h = !0;
      for (; a !== s.w; ) {
        if (i = o.node(a), h) {
          for (; (f = c[d]) !== l && o.node(f).maxRank < i.rank; )
            d++;
          f === l && (h = !1);
        }
        if (!h) {
          for (; d < c.length - 1 && o.node(f = c[d + 1]).minRank <= i.rank; )
            d++;
          f = c[d];
        }
        o.setParent(a, f), a = o.successors(a)[0];
      }
    });
  }
  function t(o, r, a, i) {
    let s = [], u = [], c = Math.min(r[a].low, r[i].low), l = Math.max(r[a].lim, r[i].lim), d, f;
    d = a;
    do
      d = o.parent(d), s.push(d);
    while (d && (r[d].low > c || l > r[d].lim));
    for (f = d, d = i; (d = o.parent(d)) !== f; )
      u.push(d);
    return { path: s.concat(u.reverse()), lca: f };
  }
  function n(o) {
    let r = {}, a = 0;
    function i(s) {
      let u = a;
      o.children(s).forEach(i), r[s] = { low: u, lim: a++ };
    }
    return o.children().forEach(i), r;
  }
  return Ci;
}
var Ni, Kl;
function m_() {
  if (Kl) return Ni;
  Kl = 1;
  let e = Ge();
  Ni = {
    run: t,
    cleanup: a
  };
  function t(i) {
    let s = e.addDummyNode(i, "root", {}, "_root"), u = o(i), c = Object.values(u), l = e.applyWithChunking(Math.max, c) - 1, d = 2 * l + 1;
    i.graph().nestingRoot = s, i.edges().forEach((h) => i.edge(h).minlen *= d);
    let f = r(i) + 1;
    i.children().forEach((h) => n(i, s, d, f, l, u, h)), i.graph().nodeRankFactor = d;
  }
  function n(i, s, u, c, l, d, f) {
    let h = i.children(f);
    if (!h.length) {
      f !== s && i.setEdge(s, f, { weight: 0, minlen: u });
      return;
    }
    let b = e.addBorderNode(i, "_bt"), w = e.addBorderNode(i, "_bb"), m = i.node(f);
    i.setParent(b, f), m.borderTop = b, i.setParent(w, f), m.borderBottom = w, h.forEach((p) => {
      n(i, s, u, c, l, d, p);
      let v = i.node(p), g = v.borderTop ? v.borderTop : p, k = v.borderBottom ? v.borderBottom : p, P = v.borderTop ? c : 2 * c, F = g !== k ? 1 : l - d[f] + 1;
      i.setEdge(b, g, {
        weight: P,
        minlen: F,
        nestingEdge: !0
      }), i.setEdge(k, w, {
        weight: P,
        minlen: F,
        nestingEdge: !0
      });
    }), i.parent(f) || i.setEdge(s, b, { weight: 0, minlen: l + d[f] });
  }
  function o(i) {
    var s = {};
    function u(c, l) {
      var d = i.children(c);
      d && d.length && d.forEach((f) => u(f, l + 1)), s[c] = l;
    }
    return i.children().forEach((c) => u(c, 1)), s;
  }
  function r(i) {
    return i.edges().reduce((s, u) => s + i.edge(u).weight, 0);
  }
  function a(i) {
    var s = i.graph();
    i.removeNode(s.nestingRoot), delete s.nestingRoot, i.edges().forEach((u) => {
      var c = i.edge(u);
      c.nestingEdge && i.removeEdge(u);
    });
  }
  return Ni;
}
var Mi, jl;
function y_() {
  if (jl) return Mi;
  jl = 1;
  let e = Ge();
  Mi = t;
  function t(o) {
    function r(a) {
      let i = o.children(a), s = o.node(a);
      if (i.length && i.forEach(r), Object.hasOwn(s, "minRank")) {
        s.borderLeft = [], s.borderRight = [];
        for (let u = s.minRank, c = s.maxRank + 1; u < c; ++u)
          n(o, "borderLeft", "_bl", a, s, u), n(o, "borderRight", "_br", a, s, u);
      }
    }
    o.children().forEach(r);
  }
  function n(o, r, a, i, s, u) {
    let c = { width: 0, height: 0, rank: u, borderType: r }, l = s[r][u - 1], d = e.addDummyNode(o, "border", c, a);
    s[r][u] = d, o.setParent(d, i), l && o.setEdge(l, d, { weight: 1 });
  }
  return Mi;
}
var Ti, Zl;
function b_() {
  if (Zl) return Ti;
  Zl = 1, Ti = {
    adjust: e,
    undo: t
  };
  function e(u) {
    let c = u.graph().rankdir.toLowerCase();
    (c === "lr" || c === "rl") && n(u);
  }
  function t(u) {
    let c = u.graph().rankdir.toLowerCase();
    (c === "bt" || c === "rl") && r(u), (c === "lr" || c === "rl") && (i(u), n(u));
  }
  function n(u) {
    u.nodes().forEach((c) => o(u.node(c))), u.edges().forEach((c) => o(u.edge(c)));
  }
  function o(u) {
    let c = u.width;
    u.width = u.height, u.height = c;
  }
  function r(u) {
    u.nodes().forEach((c) => a(u.node(c))), u.edges().forEach((c) => {
      let l = u.edge(c);
      l.points.forEach(a), Object.hasOwn(l, "y") && a(l);
    });
  }
  function a(u) {
    u.y = -u.y;
  }
  function i(u) {
    u.nodes().forEach((c) => s(u.node(c))), u.edges().forEach((c) => {
      let l = u.edge(c);
      l.points.forEach(s), Object.hasOwn(l, "x") && s(l);
    });
  }
  function s(u) {
    let c = u.x;
    u.x = u.y, u.y = c;
  }
  return Ti;
}
var Ii, Jl;
function w_() {
  if (Jl) return Ii;
  Jl = 1;
  let e = Ge();
  Ii = t;
  function t(n) {
    let o = {}, r = n.nodes().filter((l) => !n.children(l).length), a = r.map((l) => n.node(l).rank), i = e.applyWithChunking(Math.max, a), s = e.range(i + 1).map(() => []);
    function u(l) {
      if (o[l]) return;
      o[l] = !0;
      let d = n.node(l);
      s[d.rank].push(l), n.successors(l).forEach(u);
    }
    return r.sort((l, d) => n.node(l).rank - n.node(d).rank).forEach(u), s;
  }
  return Ii;
}
var Di, Ql;
function k_() {
  if (Ql) return Di;
  Ql = 1;
  let e = Ge().zipObject;
  Di = t;
  function t(o, r) {
    let a = 0;
    for (let i = 1; i < r.length; ++i)
      a += n(o, r[i - 1], r[i]);
    return a;
  }
  function n(o, r, a) {
    let i = e(a, a.map((f, h) => h)), s = r.flatMap((f) => o.outEdges(f).map((h) => ({ pos: i[h.w], weight: o.edge(h).weight })).sort((h, b) => h.pos - b.pos)), u = 1;
    for (; u < a.length; ) u <<= 1;
    let c = 2 * u - 1;
    u -= 1;
    let l = new Array(c).fill(0), d = 0;
    return s.forEach((f) => {
      let h = f.pos + u;
      l[h] += f.weight;
      let b = 0;
      for (; h > 0; )
        h % 2 && (b += l[h + 1]), h = h - 1 >> 1, l[h] += f.weight;
      d += f.weight * b;
    }), d;
  }
  return Di;
}
var Ai, eu;
function __() {
  if (eu) return Ai;
  eu = 1, Ai = e;
  function e(t, n = []) {
    return n.map((o) => {
      let r = t.inEdges(o);
      if (r.length) {
        let a = r.reduce((i, s) => {
          let u = t.edge(s), c = t.node(s.v);
          return {
            sum: i.sum + u.weight * c.order,
            weight: i.weight + u.weight
          };
        }, { sum: 0, weight: 0 });
        return {
          v: o,
          barycenter: a.sum / a.weight,
          weight: a.weight
        };
      } else
        return { v: o };
    });
  }
  return Ai;
}
var Pi, tu;
function x_() {
  if (tu) return Pi;
  tu = 1;
  let e = Ge();
  Pi = t;
  function t(r, a) {
    let i = {};
    r.forEach((u, c) => {
      let l = i[u.v] = {
        indegree: 0,
        in: [],
        out: [],
        vs: [u.v],
        i: c
      };
      u.barycenter !== void 0 && (l.barycenter = u.barycenter, l.weight = u.weight);
    }), a.edges().forEach((u) => {
      let c = i[u.v], l = i[u.w];
      c !== void 0 && l !== void 0 && (l.indegree++, c.out.push(i[u.w]));
    });
    let s = Object.values(i).filter((u) => !u.indegree);
    return n(s);
  }
  function n(r) {
    let a = [];
    function i(u) {
      return (c) => {
        c.merged || (c.barycenter === void 0 || u.barycenter === void 0 || c.barycenter >= u.barycenter) && o(u, c);
      };
    }
    function s(u) {
      return (c) => {
        c.in.push(u), --c.indegree === 0 && r.push(c);
      };
    }
    for (; r.length; ) {
      let u = r.pop();
      a.push(u), u.in.reverse().forEach(i(u)), u.out.forEach(s(u));
    }
    return a.filter((u) => !u.merged).map((u) => e.pick(u, ["vs", "i", "barycenter", "weight"]));
  }
  function o(r, a) {
    let i = 0, s = 0;
    r.weight && (i += r.barycenter * r.weight, s += r.weight), a.weight && (i += a.barycenter * a.weight, s += a.weight), r.vs = a.vs.concat(r.vs), r.barycenter = i / s, r.weight = s, r.i = Math.min(a.i, r.i), a.merged = !0;
  }
  return Pi;
}
var Oi, nu;
function E_() {
  if (nu) return Oi;
  nu = 1;
  let e = Ge();
  Oi = t;
  function t(r, a) {
    let i = e.partition(r, (b) => Object.hasOwn(b, "barycenter")), s = i.lhs, u = i.rhs.sort((b, w) => w.i - b.i), c = [], l = 0, d = 0, f = 0;
    s.sort(o(!!a)), f = n(c, u, f), s.forEach((b) => {
      f += b.vs.length, c.push(b.vs), l += b.barycenter * b.weight, d += b.weight, f = n(c, u, f);
    });
    let h = { vs: c.flat(!0) };
    return d && (h.barycenter = l / d, h.weight = d), h;
  }
  function n(r, a, i) {
    let s;
    for (; a.length && (s = a[a.length - 1]).i <= i; )
      a.pop(), r.push(s.vs), i++;
    return i;
  }
  function o(r) {
    return (a, i) => a.barycenter < i.barycenter ? -1 : a.barycenter > i.barycenter ? 1 : r ? i.i - a.i : a.i - i.i;
  }
  return Oi;
}
var Ri, ou;
function $_() {
  if (ou) return Ri;
  ou = 1;
  let e = __(), t = x_(), n = E_();
  Ri = o;
  function o(i, s, u, c) {
    let l = i.children(s), d = i.node(s), f = d ? d.borderLeft : void 0, h = d ? d.borderRight : void 0, b = {};
    f && (l = l.filter((v) => v !== f && v !== h));
    let w = e(i, l);
    w.forEach((v) => {
      if (i.children(v.v).length) {
        let g = o(i, v.v, u, c);
        b[v.v] = g, Object.hasOwn(g, "barycenter") && a(v, g);
      }
    });
    let m = t(w, u);
    r(m, b);
    let p = n(m, c);
    if (f && (p.vs = [f, p.vs, h].flat(!0), i.predecessors(f).length)) {
      let v = i.node(i.predecessors(f)[0]), g = i.node(i.predecessors(h)[0]);
      Object.hasOwn(p, "barycenter") || (p.barycenter = 0, p.weight = 0), p.barycenter = (p.barycenter * p.weight + v.order + g.order) / (p.weight + 2), p.weight += 2;
    }
    return p;
  }
  function r(i, s) {
    i.forEach((u) => {
      u.vs = u.vs.flatMap((c) => s[c] ? s[c].vs : c);
    });
  }
  function a(i, s) {
    i.barycenter !== void 0 ? (i.barycenter = (i.barycenter * i.weight + s.barycenter * s.weight) / (i.weight + s.weight), i.weight += s.weight) : (i.barycenter = s.barycenter, i.weight = s.weight);
  }
  return Ri;
}
var zi, ru;
function S_() {
  if (ru) return zi;
  ru = 1;
  let e = rt().Graph, t = Ge();
  zi = n;
  function n(r, a, i, s) {
    s || (s = r.nodes());
    let u = o(r), c = new e({ compound: !0 }).setGraph({ root: u }).setDefaultNodeLabel((l) => r.node(l));
    return s.forEach((l) => {
      let d = r.node(l), f = r.parent(l);
      (d.rank === a || d.minRank <= a && a <= d.maxRank) && (c.setNode(l), c.setParent(l, f || u), r[i](l).forEach((h) => {
        let b = h.v === l ? h.w : h.v, w = c.edge(b, l), m = w !== void 0 ? w.weight : 0;
        c.setEdge(b, l, { weight: r.edge(h).weight + m });
      }), Object.hasOwn(d, "minRank") && c.setNode(l, {
        borderLeft: d.borderLeft[a],
        borderRight: d.borderRight[a]
      }));
    }), c;
  }
  function o(r) {
    for (var a; r.hasNode(a = t.uniqueId("_root")); ) ;
    return a;
  }
  return zi;
}
var Bi, iu;
function C_() {
  if (iu) return Bi;
  iu = 1, Bi = e;
  function e(t, n, o) {
    let r = {}, a;
    o.forEach((i) => {
      let s = t.parent(i), u, c;
      for (; s; ) {
        if (u = t.parent(s), u ? (c = r[u], r[u] = s) : (c = a, a = s), c && c !== s) {
          n.setEdge(c, s);
          return;
        }
        s = u;
      }
    });
  }
  return Bi;
}
var Li, au;
function N_() {
  if (au) return Li;
  au = 1;
  let e = w_(), t = k_(), n = $_(), o = S_(), r = C_(), a = rt().Graph, i = Ge();
  Li = s;
  function s(d, f) {
    if (f && typeof f.customOrder == "function") {
      f.customOrder(d, s);
      return;
    }
    let h = i.maxRank(d), b = u(d, i.range(1, h + 1), "inEdges"), w = u(d, i.range(h - 1, -1, -1), "outEdges"), m = e(d);
    if (l(d, m), f && f.disableOptimalOrderHeuristic)
      return;
    let p = Number.POSITIVE_INFINITY, v;
    for (let g = 0, k = 0; k < 4; ++g, ++k) {
      c(g % 2 ? b : w, g % 4 >= 2), m = i.buildLayerMatrix(d);
      let P = t(d, m);
      P < p && (k = 0, v = Object.assign({}, m), p = P);
    }
    l(d, v);
  }
  function u(d, f, h) {
    const b = /* @__PURE__ */ new Map(), w = (m, p) => {
      b.has(m) || b.set(m, []), b.get(m).push(p);
    };
    for (const m of d.nodes()) {
      const p = d.node(m);
      if (typeof p.rank == "number" && w(p.rank, m), typeof p.minRank == "number" && typeof p.maxRank == "number")
        for (let v = p.minRank; v <= p.maxRank; v++)
          v !== p.rank && w(v, m);
    }
    return f.map(function(m) {
      return o(d, m, h, b.get(m) || []);
    });
  }
  function c(d, f) {
    let h = new a();
    d.forEach(function(b) {
      let w = b.graph().root, m = n(b, w, h, f);
      m.vs.forEach((p, v) => b.node(p).order = v), r(b, h, m.vs);
    });
  }
  function l(d, f) {
    Object.values(f).forEach((h) => h.forEach((b, w) => d.node(b).order = w));
  }
  return Li;
}
var Vi, su;
function M_() {
  if (su) return Vi;
  su = 1;
  let e = rt().Graph, t = Ge();
  Vi = {
    positionX: h,
    findType1Conflicts: n,
    findType2Conflicts: o,
    addConflict: a,
    hasConflict: i,
    verticalAlignment: s,
    horizontalCompaction: u,
    alignCoordinates: d,
    findSmallestWidthAlignment: l,
    balance: f
  };
  function n(m, p) {
    let v = {};
    function g(k, P) {
      let F = 0, K = 0, C = k.length, N = P[P.length - 1];
      return P.forEach((M, B) => {
        let S = r(m, M), Q = S ? m.node(S).order : C;
        (S || M === N) && (P.slice(K, B + 1).forEach((y) => {
          m.predecessors(y).forEach((O) => {
            let E = m.node(O), X = E.order;
            (X < F || Q < X) && !(E.dummy && m.node(y).dummy) && a(v, O, y);
          });
        }), K = B + 1, F = Q);
      }), P;
    }
    return p.length && p.reduce(g), v;
  }
  function o(m, p) {
    let v = {};
    function g(P, F, K, C, N) {
      let M;
      t.range(F, K).forEach((B) => {
        M = P[B], m.node(M).dummy && m.predecessors(M).forEach((S) => {
          let Q = m.node(S);
          Q.dummy && (Q.order < C || Q.order > N) && a(v, S, M);
        });
      });
    }
    function k(P, F) {
      let K = -1, C, N = 0;
      return F.forEach((M, B) => {
        if (m.node(M).dummy === "border") {
          let S = m.predecessors(M);
          S.length && (C = m.node(S[0]).order, g(F, N, B, K, C), N = B, K = C);
        }
        g(F, N, F.length, C, P.length);
      }), F;
    }
    return p.length && p.reduce(k), v;
  }
  function r(m, p) {
    if (m.node(p).dummy)
      return m.predecessors(p).find((v) => m.node(v).dummy);
  }
  function a(m, p, v) {
    if (p > v) {
      let k = p;
      p = v, v = k;
    }
    let g = m[p];
    g || (m[p] = g = {}), g[v] = !0;
  }
  function i(m, p, v) {
    if (p > v) {
      let g = p;
      p = v, v = g;
    }
    return !!m[p] && Object.hasOwn(m[p], v);
  }
  function s(m, p, v, g) {
    let k = {}, P = {}, F = {};
    return p.forEach((K) => {
      K.forEach((C, N) => {
        k[C] = C, P[C] = C, F[C] = N;
      });
    }), p.forEach((K) => {
      let C = -1;
      K.forEach((N) => {
        let M = g(N);
        if (M.length) {
          M = M.sort((S, Q) => F[S] - F[Q]);
          let B = (M.length - 1) / 2;
          for (let S = Math.floor(B), Q = Math.ceil(B); S <= Q; ++S) {
            let y = M[S];
            P[N] === N && C < F[y] && !i(v, N, y) && (P[y] = N, P[N] = k[N] = k[y], C = F[y]);
          }
        }
      });
    }), { root: k, align: P };
  }
  function u(m, p, v, g, k) {
    let P = {}, F = c(m, p, v, k), K = k ? "borderLeft" : "borderRight";
    function C(B, S) {
      let Q = F.nodes(), y = Q.pop(), O = {};
      for (; y; )
        O[y] ? B(y) : (O[y] = !0, Q.push(y), Q = Q.concat(S(y))), y = Q.pop();
    }
    function N(B) {
      P[B] = F.inEdges(B).reduce((S, Q) => Math.max(S, P[Q.v] + F.edge(Q)), 0);
    }
    function M(B) {
      let S = F.outEdges(B).reduce((y, O) => Math.min(y, P[O.w] - F.edge(O)), Number.POSITIVE_INFINITY), Q = m.node(B);
      S !== Number.POSITIVE_INFINITY && Q.borderType !== K && (P[B] = Math.max(P[B], S));
    }
    return C(N, F.predecessors.bind(F)), C(M, F.successors.bind(F)), Object.keys(g).forEach((B) => P[B] = P[v[B]]), P;
  }
  function c(m, p, v, g) {
    let k = new e(), P = m.graph(), F = b(P.nodesep, P.edgesep, g);
    return p.forEach((K) => {
      let C;
      K.forEach((N) => {
        let M = v[N];
        if (k.setNode(M), C) {
          var B = v[C], S = k.edge(B, M);
          k.setEdge(B, M, Math.max(F(m, N, C), S || 0));
        }
        C = N;
      });
    }), k;
  }
  function l(m, p) {
    return Object.values(p).reduce((v, g) => {
      let k = Number.NEGATIVE_INFINITY, P = Number.POSITIVE_INFINITY;
      Object.entries(g).forEach(([K, C]) => {
        let N = w(m, K) / 2;
        k = Math.max(C + N, k), P = Math.min(C - N, P);
      });
      const F = k - P;
      return F < v[0] && (v = [F, g]), v;
    }, [Number.POSITIVE_INFINITY, null])[1];
  }
  function d(m, p) {
    let v = Object.values(p), g = t.applyWithChunking(Math.min, v), k = t.applyWithChunking(Math.max, v);
    ["u", "d"].forEach((P) => {
      ["l", "r"].forEach((F) => {
        let K = P + F, C = m[K];
        if (C === p) return;
        let N = Object.values(C), M = g - t.applyWithChunking(Math.min, N);
        F !== "l" && (M = k - t.applyWithChunking(Math.max, N)), M && (m[K] = t.mapValues(C, (B) => B + M));
      });
    });
  }
  function f(m, p) {
    return t.mapValues(m.ul, (v, g) => {
      if (p)
        return m[p.toLowerCase()][g];
      {
        let k = Object.values(m).map((P) => P[g]).sort((P, F) => P - F);
        return (k[1] + k[2]) / 2;
      }
    });
  }
  function h(m) {
    let p = t.buildLayerMatrix(m), v = Object.assign(
      n(m, p),
      o(m, p)
    ), g = {}, k;
    ["u", "d"].forEach((F) => {
      k = F === "u" ? p : Object.values(p).reverse(), ["l", "r"].forEach((K) => {
        K === "r" && (k = k.map((B) => Object.values(B).reverse()));
        let C = (F === "u" ? m.predecessors : m.successors).bind(m), N = s(m, k, v, C), M = u(
          m,
          k,
          N.root,
          N.align,
          K === "r"
        );
        K === "r" && (M = t.mapValues(M, (B) => -B)), g[F + K] = M;
      });
    });
    let P = l(m, g);
    return d(g, P), f(g, m.graph().align);
  }
  function b(m, p, v) {
    return (g, k, P) => {
      let F = g.node(k), K = g.node(P), C = 0, N;
      if (C += F.width / 2, Object.hasOwn(F, "labelpos"))
        switch (F.labelpos.toLowerCase()) {
          case "l":
            N = -F.width / 2;
            break;
          case "r":
            N = F.width / 2;
            break;
        }
      if (N && (C += v ? N : -N), N = 0, C += (F.dummy ? p : m) / 2, C += (K.dummy ? p : m) / 2, C += K.width / 2, Object.hasOwn(K, "labelpos"))
        switch (K.labelpos.toLowerCase()) {
          case "l":
            N = K.width / 2;
            break;
          case "r":
            N = -K.width / 2;
            break;
        }
      return N && (C += v ? N : -N), N = 0, C;
    };
  }
  function w(m, p) {
    return m.node(p).width;
  }
  return Vi;
}
var Hi, lu;
function T_() {
  if (lu) return Hi;
  lu = 1;
  let e = Ge(), t = M_().positionX;
  Hi = n;
  function n(r) {
    r = e.asNonCompoundGraph(r), o(r), Object.entries(t(r)).forEach(([a, i]) => r.node(a).x = i);
  }
  function o(r) {
    let a = e.buildLayerMatrix(r), i = r.graph().ranksep, s = 0;
    a.forEach((u) => {
      const c = u.reduce((l, d) => {
        const f = r.node(d).height;
        return l > f ? l : f;
      }, 0);
      u.forEach((l) => r.node(l).y = s + c / 2), s += c + i;
    });
  }
  return Hi;
}
var Fi, uu;
function I_() {
  if (uu) return Fi;
  uu = 1;
  let e = f_(), t = h_(), n = g_(), o = Ge().normalizeRanks, r = v_(), a = Ge().removeEmptyRanks, i = m_(), s = y_(), u = b_(), c = N_(), l = T_(), d = Ge(), f = rt().Graph;
  Fi = h;
  function h(H, q) {
    let Y = q && q.debugTiming ? d.time : d.notime;
    Y("layout", () => {
      let Z = Y("  buildLayoutGraph", () => C(H));
      Y("  runLayout", () => b(Z, Y, q)), Y("  updateInputGraph", () => w(H, Z));
    });
  }
  function b(H, q, Y) {
    q("    makeSpaceForEdgeLabels", () => N(H)), q("    removeSelfEdges", () => U(H)), q("    acyclic", () => e.run(H)), q("    nestingGraph.run", () => i.run(H)), q("    rank", () => n(d.asNonCompoundGraph(H))), q("    injectEdgeLabelProxies", () => M(H)), q("    removeEmptyRanks", () => a(H)), q("    nestingGraph.cleanup", () => i.cleanup(H)), q("    normalizeRanks", () => o(H)), q("    assignRankMinMax", () => B(H)), q("    removeEdgeLabelProxies", () => S(H)), q("    normalize.run", () => t.run(H)), q("    parentDummyChains", () => r(H)), q("    addBorderSegments", () => s(H)), q("    order", () => c(H, Y)), q("    insertSelfEdges", () => z(H)), q("    adjustCoordinateSystem", () => u.adjust(H)), q("    position", () => l(H)), q("    positionSelfEdges", () => x(H)), q("    removeBorderNodes", () => X(H)), q("    normalize.undo", () => t.undo(H)), q("    fixupEdgeLabelCoords", () => O(H)), q("    undoCoordinateSystem", () => u.undo(H)), q("    translateGraph", () => Q(H)), q("    assignNodeIntersects", () => y(H)), q("    reversePoints", () => E(H)), q("    acyclic.undo", () => e.undo(H));
  }
  function w(H, q) {
    H.nodes().forEach((Y) => {
      let Z = H.node(Y), ee = q.node(Y);
      Z && (Z.x = ee.x, Z.y = ee.y, Z.rank = ee.rank, q.children(Y).length && (Z.width = ee.width, Z.height = ee.height));
    }), H.edges().forEach((Y) => {
      let Z = H.edge(Y), ee = q.edge(Y);
      Z.points = ee.points, Object.hasOwn(ee, "x") && (Z.x = ee.x, Z.y = ee.y);
    }), H.graph().width = q.graph().width, H.graph().height = q.graph().height;
  }
  let m = ["nodesep", "edgesep", "ranksep", "marginx", "marginy"], p = { ranksep: 50, edgesep: 20, nodesep: 50, rankdir: "tb" }, v = ["acyclicer", "ranker", "rankdir", "align"], g = ["width", "height", "rank"], k = { width: 0, height: 0 }, P = ["minlen", "weight", "width", "height", "labeloffset"], F = {
    minlen: 1,
    weight: 1,
    width: 0,
    height: 0,
    labeloffset: 10,
    labelpos: "r"
  }, K = ["labelpos"];
  function C(H) {
    let q = new f({ multigraph: !0, compound: !0 }), Y = te(H.graph());
    return q.setGraph(Object.assign(
      {},
      p,
      L(Y, m),
      d.pick(Y, v)
    )), H.nodes().forEach((Z) => {
      let ee = te(H.node(Z));
      const ae = L(ee, g);
      Object.keys(k).forEach((me) => {
        ae[me] === void 0 && (ae[me] = k[me]);
      }), q.setNode(Z, ae), q.setParent(Z, H.parent(Z));
    }), H.edges().forEach((Z) => {
      let ee = te(H.edge(Z));
      q.setEdge(Z, Object.assign(
        {},
        F,
        L(ee, P),
        d.pick(ee, K)
      ));
    }), q;
  }
  function N(H) {
    let q = H.graph();
    q.ranksep /= 2, H.edges().forEach((Y) => {
      let Z = H.edge(Y);
      Z.minlen *= 2, Z.labelpos.toLowerCase() !== "c" && (q.rankdir === "TB" || q.rankdir === "BT" ? Z.width += Z.labeloffset : Z.height += Z.labeloffset);
    });
  }
  function M(H) {
    H.edges().forEach((q) => {
      let Y = H.edge(q);
      if (Y.width && Y.height) {
        let Z = H.node(q.v), ae = { rank: (H.node(q.w).rank - Z.rank) / 2 + Z.rank, e: q };
        d.addDummyNode(H, "edge-proxy", ae, "_ep");
      }
    });
  }
  function B(H) {
    let q = 0;
    H.nodes().forEach((Y) => {
      let Z = H.node(Y);
      Z.borderTop && (Z.minRank = H.node(Z.borderTop).rank, Z.maxRank = H.node(Z.borderBottom).rank, q = Math.max(q, Z.maxRank));
    }), H.graph().maxRank = q;
  }
  function S(H) {
    H.nodes().forEach((q) => {
      let Y = H.node(q);
      Y.dummy === "edge-proxy" && (H.edge(Y.e).labelRank = Y.rank, H.removeNode(q));
    });
  }
  function Q(H) {
    let q = Number.POSITIVE_INFINITY, Y = 0, Z = Number.POSITIVE_INFINITY, ee = 0, ae = H.graph(), me = ae.marginx || 0, ge = ae.marginy || 0;
    function ke(re) {
      let se = re.x, D = re.y, T = re.width, R = re.height;
      q = Math.min(q, se - T / 2), Y = Math.max(Y, se + T / 2), Z = Math.min(Z, D - R / 2), ee = Math.max(ee, D + R / 2);
    }
    H.nodes().forEach((re) => ke(H.node(re))), H.edges().forEach((re) => {
      let se = H.edge(re);
      Object.hasOwn(se, "x") && ke(se);
    }), q -= me, Z -= ge, H.nodes().forEach((re) => {
      let se = H.node(re);
      se.x -= q, se.y -= Z;
    }), H.edges().forEach((re) => {
      let se = H.edge(re);
      se.points.forEach((D) => {
        D.x -= q, D.y -= Z;
      }), Object.hasOwn(se, "x") && (se.x -= q), Object.hasOwn(se, "y") && (se.y -= Z);
    }), ae.width = Y - q + me, ae.height = ee - Z + ge;
  }
  function y(H) {
    H.edges().forEach((q) => {
      let Y = H.edge(q), Z = H.node(q.v), ee = H.node(q.w), ae, me;
      Y.points ? (ae = Y.points[0], me = Y.points[Y.points.length - 1]) : (Y.points = [], ae = ee, me = Z), Y.points.unshift(d.intersectRect(Z, ae)), Y.points.push(d.intersectRect(ee, me));
    });
  }
  function O(H) {
    H.edges().forEach((q) => {
      let Y = H.edge(q);
      if (Object.hasOwn(Y, "x"))
        switch ((Y.labelpos === "l" || Y.labelpos === "r") && (Y.width -= Y.labeloffset), Y.labelpos) {
          case "l":
            Y.x -= Y.width / 2 + Y.labeloffset;
            break;
          case "r":
            Y.x += Y.width / 2 + Y.labeloffset;
            break;
        }
    });
  }
  function E(H) {
    H.edges().forEach((q) => {
      let Y = H.edge(q);
      Y.reversed && Y.points.reverse();
    });
  }
  function X(H) {
    H.nodes().forEach((q) => {
      if (H.children(q).length) {
        let Y = H.node(q), Z = H.node(Y.borderTop), ee = H.node(Y.borderBottom), ae = H.node(Y.borderLeft[Y.borderLeft.length - 1]), me = H.node(Y.borderRight[Y.borderRight.length - 1]);
        Y.width = Math.abs(me.x - ae.x), Y.height = Math.abs(ee.y - Z.y), Y.x = ae.x + Y.width / 2, Y.y = Z.y + Y.height / 2;
      }
    }), H.nodes().forEach((q) => {
      H.node(q).dummy === "border" && H.removeNode(q);
    });
  }
  function U(H) {
    H.edges().forEach((q) => {
      if (q.v === q.w) {
        var Y = H.node(q.v);
        Y.selfEdges || (Y.selfEdges = []), Y.selfEdges.push({ e: q, label: H.edge(q) }), H.removeEdge(q);
      }
    });
  }
  function z(H) {
    var q = d.buildLayerMatrix(H);
    q.forEach((Y) => {
      var Z = 0;
      Y.forEach((ee, ae) => {
        var me = H.node(ee);
        me.order = ae + Z, (me.selfEdges || []).forEach((ge) => {
          d.addDummyNode(H, "selfedge", {
            width: ge.label.width,
            height: ge.label.height,
            rank: me.rank,
            order: ae + ++Z,
            e: ge.e,
            label: ge.label
          }, "_se");
        }), delete me.selfEdges;
      });
    });
  }
  function x(H) {
    H.nodes().forEach((q) => {
      var Y = H.node(q);
      if (Y.dummy === "selfedge") {
        var Z = H.node(Y.e.v), ee = Z.x + Z.width / 2, ae = Z.y, me = Y.x - ee, ge = Z.height / 2;
        H.setEdge(Y.e, Y.label), H.removeNode(q), Y.label.points = [
          { x: ee + 2 * me / 3, y: ae - ge },
          { x: ee + 5 * me / 6, y: ae - ge },
          { x: ee + me, y: ae },
          { x: ee + 5 * me / 6, y: ae + ge },
          { x: ee + 2 * me / 3, y: ae + ge }
        ], Y.label.x = Y.x, Y.label.y = Y.y;
      }
    });
  }
  function L(H, q) {
    return d.mapValues(d.pick(H, q), Number);
  }
  function te(H) {
    var q = {};
    return H && Object.entries(H).forEach(([Y, Z]) => {
      typeof Y == "string" && (Y = Y.toLowerCase()), q[Y] = Z;
    }), q;
  }
  return Fi;
}
var Gi, cu;
function D_() {
  if (cu) return Gi;
  cu = 1;
  let e = Ge(), t = rt().Graph;
  Gi = {
    debugOrdering: n
  };
  function n(o) {
    let r = e.buildLayerMatrix(o), a = new t({ compound: !0, multigraph: !0 }).setGraph({});
    return o.nodes().forEach((i) => {
      a.setNode(i, { label: i }), a.setParent(i, "layer" + o.node(i).rank);
    }), o.edges().forEach((i) => a.setEdge(i.v, i.w, {}, i.name)), r.forEach((i, s) => {
      let u = "layer" + s;
      a.setNode(u, { rank: "same" }), i.reduce((c, l) => (a.setEdge(c, l, { style: "invis" }), l));
    }), a;
  }
  return Gi;
}
var Yi, du;
function A_() {
  return du || (du = 1, Yi = "1.1.8"), Yi;
}
var Ui, fu;
function P_() {
  return fu || (fu = 1, Ui = {
    graphlib: rt(),
    layout: I_(),
    debug: D_(),
    util: {
      time: Ge().time,
      notime: Ge().notime
    },
    version: A_()
  }), Ui;
}
var O_ = P_();
const hu = /* @__PURE__ */ Zk(O_), R_ = "var(--p-primary-color)", z_ = "var(--p-text-muted-color)", Wa = 210, B_ = 104, Hn = 30, bd = 42, wa = 20, wd = 20, ka = 108, kd = [
  { id: "top", type: "target", side: "top" },
  { id: "bottom", type: "source", side: "bottom" },
  { id: "left", type: "target", side: "left" },
  { id: "right", type: "source", side: "right" }
], Go = ["default", "smoothstep", "step", "straight"], _d = "portal:";
function L_(e) {
  return e.startsWith(_d);
}
function Ka(e) {
  const t = [], n = /* @__PURE__ */ new Map(), o = /* @__PURE__ */ new Map();
  function r(a, i = "") {
    for (const s of a || []) {
      const u = { ...s, parent_id: s.parent_id || i || void 0 };
      t.push(u), n.set(u.id, u);
      const c = u.parent_id || "";
      o.has(c) || o.set(c, []), o.get(c).push(u), s.children?.length && r(s.children, s.id);
    }
  }
  return r(e || []), { nodes: t, nodeById: n, childrenByParent: o };
}
function Fn(e) {
  return new Map((e || []).map((t) => [t.id, t]));
}
function V_(e, t, n = R_) {
  const o = e.get(t);
  return String(o?.color || o?.stroke || n);
}
function H_(e, t) {
  return String(e.get(t)?.title || t || "Node");
}
function ja(e, t) {
  return String(e.properties?.accent || e.properties?.color || V_(t, e.type));
}
function F_(e) {
  return `color-mix(in srgb, ${e} 8%, var(--kg-panel))`;
}
function G_(e) {
  return `color-mix(in srgb, ${e} 38%, var(--kg-line))`;
}
function xd(e) {
  if (Array.isArray(e)) return e;
  if (typeof e == "string" && e)
    try {
      const t = JSON.parse(e);
      if (Array.isArray(t)) return t;
    } catch (t) {
      throw new Error("Node ports are unavailable.", { cause: t });
    }
  return kd;
}
function Ed(e, t) {
  const n = t.get(e.kind);
  return String(n?.display || "panel");
}
function Y_(e, t) {
  const n = [];
  for (const o of e || []) {
    const r = Ed(o, t);
    if (r !== "badge" && r !== "both") continue;
    const a = t.get(o.kind);
    n.push({ kind: o.kind, text: o.title || a?.title || o.kind, color: String(a?.color || "var(--p-text-muted-color)") });
  }
  return n;
}
function U_(e, t) {
  let n = 0;
  for (const o of e || []) {
    const r = Ed(o, t);
    (r === "panel" || r === "both") && (n += 1);
  }
  return n;
}
function q_(e, t, n) {
  const o = e.layout?.positions?.[t.id] || t.layout;
  return o && typeof o.x == "number" && typeof o.y == "number" ? o : { x: 40 + n % 4 * 280, y: 40 + Math.floor(n / 4) * 180 };
}
function ur(e) {
  return Number(e.properties?.width || e.layout?.width || Wa);
}
function $d(e, t, n, o) {
  const r = ja(e, n), a = e.materials || [];
  return {
    label: e.name,
    description: e.description || "",
    nodeType: e.type,
    typeLabel: H_(n, e.type),
    color: r,
    bg: F_(r),
    border: G_(r),
    tags: e.tags || [],
    status: e.status || "",
    hasChildren: t.length > 0,
    childCount: t.length,
    materialCount: U_(a, o),
    badges: Y_(a, o),
    width: ur(e),
    radius: Number(e.properties?.radius ?? 6),
    borderStyle: String(e.properties?.style || "solid"),
    animation: String(e.properties?.animation || ""),
    handles: xd(e.properties?.handles)
  };
}
function X_(e, t, n, o, r, a) {
  const i = e.layout?.positions || {}, s = ja(t, r), u = Math.max(1, Math.min(n.length, 3)), c = [];
  let l = 0;
  for (const m of n)
    if (i[m.id]) c.push(i[m.id]);
    else {
      const p = l % u, v = Math.floor(l / u);
      c.push({ x: Hn + p * (Wa + wa), y: bd + v * (ka + wd) }), l++;
    }
  let d = 0, f = 0;
  n.forEach((m, p) => {
    d = Math.max(d, c[p].x + ur(m)), f = Math.max(f, c[p].y + ka);
  });
  const h = Math.max(300, d + Hn), b = Math.max(200, f + Hn), w = [{
    id: t.id,
    type: "boundary",
    position: { x: o.x, y: o.y },
    data: { label: t.name, color: s, width: h, height: b },
    style: { width: `${h}px`, height: `${b}px` }
  }];
  return n.forEach((m, p) => {
    w.push({
      id: m.id,
      type: "graphNode",
      parentNode: t.id,
      extent: "parent",
      expandParent: !0,
      position: { x: c[p].x, y: c[p].y },
      data: $d(m, [], r, a)
    });
  }), w;
}
function pu(e, t) {
  const n = t.get(e.type), o = e.properties || {}, r = String(o.stroke || n?.stroke || n?.color || z_), a = Number(o.strokeWidth || o.stroke_width || n?.stroke_width || n?.strokeWidth || 1.6), i = String(o.routing || n?.render?.routing || "default"), s = o.animated === !0 || o.animated === "true" || n?.animated === !0, u = String(o.dash || n?.dash || n?.dash_array || ""), c = String(o.direction || n?.direction || "directed"), l = o.bidirectional === !0 || c === "bidirectional", d = {
    id: e.id,
    source: e.source_id,
    target: e.target_id,
    type: i,
    label: e.label || "",
    animated: s,
    style: { stroke: r, strokeWidth: a, strokeDasharray: u },
    labelStyle: { fill: "var(--kg-muted)", fontSize: "10px" },
    labelBgStyle: { fill: "var(--kg-bg)", fillOpacity: 0.9 },
    markerEnd: { type: Wn.ArrowClosed, color: r, width: 16, height: 12 }
  };
  return l && (d.markerStart = { type: Wn.ArrowClosed, color: r, width: 16, height: 12 }), o.sourceHandle && (d.sourceHandle = String(o.sourceHandle)), o.targetHandle && (d.targetHandle = String(o.targetHandle)), d;
}
function W_(e, t, n) {
  const o = Ka(e.nodes || []), r = Fn(e.schema?.node_types || []), a = Fn(e.schema?.edge_types || []), i = Fn(e.schema?.material_types || []), s = [], u = [];
  (o.childrenByParent.get(n || "") || []).forEach((p, v) => {
    const g = o.childrenByParent.get(p.id) || [], k = q_(e, p, v);
    g.length && t.has(p.id) ? s.push(...X_(e, p, g, k, r, i)) : s.push({ id: p.id, type: "graphNode", position: { x: k.x, y: k.y }, data: $d(p, g, r, i) });
  });
  const l = new Set(s.map((p) => p.id));
  function d(p) {
    let v = p;
    for (; v; ) {
      if (l.has(v)) return v;
      v = o.nodeById.get(v)?.parent_id;
    }
  }
  function f(p) {
    return o.nodeById.get(p)?.name || p;
  }
  function h(p) {
    let v = p, g = o.nodeById.get(p);
    for (; v; ) {
      const k = o.nodeById.get(v)?.parent_id;
      if (!k) break;
      v = k, g = o.nodeById.get(v);
    }
    return g?.name || "";
  }
  const b = /* @__PURE__ */ new Map();
  function w(p) {
    const v = `${_d}${p}`;
    if (!b.has(v)) {
      const k = o.nodeById.get(p) || { type: "", name: p };
      b.set(v, {
        id: v,
        type: "portalNode",
        position: { x: 0, y: 0 },
        draggable: !1,
        selectable: !1,
        connectable: !1,
        data: {
          label: k.name,
          color: ja(k, r),
          portal: !0,
          portalTarget: p,
          contextLabel: h(p),
          handles: kd
        }
      });
    }
    return v;
  }
  const m = /* @__PURE__ */ new Map();
  for (const p of e.edges || []) {
    let v = d(p.source_id), g = d(p.target_id), k = !1;
    if (v && !g ? (g = w(p.target_id), k = !0) : !v && g && (v = w(p.source_id), k = !0), !v || !g || v === g) continue;
    if (!k && v === p.source_id && g === p.target_id) {
      u.push(pu(p, a));
      continue;
    }
    const F = `${p.type}|${v}|${g}`;
    let K = m.get(F);
    K || (K = { s: v, t: g, sample: p, portal: k, members: [] }, m.set(F, K)), K.members.push({ id: p.id, type: p.type, label: p.label || "", source: f(p.source_id), target: f(p.target_id), sourceId: p.source_id, targetId: p.target_id });
  }
  for (const p of m.values()) {
    const v = {
      ...p.sample,
      id: `agg:${p.sample.type}:${p.s}:${p.t}`,
      source_id: p.s,
      target_id: p.t,
      properties: { ...p.sample.properties || {}, sourceHandle: void 0, targetHandle: void 0 }
    }, g = pu(v, a);
    g.data = { ...g.data || {}, aggregated: !0, portal: p.portal, count: p.members.length, members: p.members }, p.members.length > 1 && (g.label = p.sample.label ? `${p.sample.label} ×${p.members.length}` : `×${p.members.length}`), u.push(g);
  }
  if (b.size) {
    let p = 0, v = Number.POSITIVE_INFINITY;
    for (const P of s)
      p = Math.max(p, P.position.x + Number(P.data?.width || Wa)), v = Math.min(v, P.position.y);
    Number.isFinite(v) || (v = 40);
    const g = 52;
    let k = 0;
    for (const P of b.values())
      P.position = { x: p + 120, y: v + k * g }, k += 1, s.push(P);
  }
  return { flowNodes: s, flowEdges: u, flat: o };
}
function K_(e, t, n) {
  const o = Ka(e.nodes || []), r = o.childrenByParent.get(n || "") || [];
  if (!r.length) return {};
  const a = new Set(r.map((l) => l.id)), i = new hu.graphlib.Graph();
  i.setGraph({ rankdir: t, nodesep: 46, ranksep: 70, marginx: 30, marginy: 30 }), i.setDefaultEdgeLabel(() => ({}));
  for (const l of r) {
    const d = o.childrenByParent.get(l.id) || [];
    let f = ur(l), h = B_;
    if (d.length) {
      const b = Math.max(1, Math.min(d.length, 3)), w = Math.ceil(d.length / 3), m = Math.max(...d.map((p) => ur(p)));
      f = Math.max(300, b * (m + wa) - wa + Hn * 2), h = w * ka + (w - 1) * wd + bd + Hn;
    }
    i.setNode(l.id, { width: f, height: h });
  }
  function s(l) {
    let d = l;
    for (; d; ) {
      if (a.has(d)) return d;
      d = o.nodeById.get(d)?.parent_id;
    }
  }
  const u = /* @__PURE__ */ new Set();
  for (const l of e.edges || []) {
    const d = s(l.source_id), f = s(l.target_id);
    if (!d || !f || d === f) continue;
    const h = `${d}->${f}`;
    u.has(h) || (u.add(h), i.setEdge(d, f));
  }
  hu.layout(i);
  const c = {};
  for (const l of r) {
    const d = i.node(l.id);
    d && (c[l.id] = { x: Math.round(d.x - d.width / 2), y: Math.round(d.y - d.height / 2) });
  }
  return c;
}
const _a = "/api/v1/workspace/entries";
function j_(e) {
  return e ? `${_a}?parent_id=${encodeURIComponent(e)}` : _a;
}
function Z_(e) {
  return `${_a}/${encodeURIComponent(e)}`;
}
function gu(e) {
  return e.container === !0 || Number(e.children_count || 0) > 0;
}
const J_ = { class: "kg-component-picker" }, Q_ = { class: "kg-component-path" }, ex = ["onClick"], tx = {
  key: 0,
  role: "status"
}, nx = {
  key: 1,
  role: "alert"
}, ox = ["aria-label"], rx = /* @__PURE__ */ $e({
  __name: "ComponentPicker",
  props: {
    modelValue: {}
  },
  emits: ["update:modelValue"],
  setup(e, { emit: t }) {
    const n = e, o = t, r = le(null), a = le([]), i = le(null), s = le(!1), u = le(""), c = ne(() => j_(a.value.at(-1)?.id || null));
    let l = null, d = 0, f = 0;
    async function h(v) {
      const g = ++f;
      if (i.value = null, !!v)
        try {
          const { data: k } = await Ao.get(Z_(v));
          if (!k.success || !k.entry) throw new Error(k.error || "Could not load the selected component.");
          g === f && (i.value = k.entry);
        } catch (k) {
          g === f && (u.value = k instanceof Error ? k.message : "Could not load the selected component.");
        }
    }
    function b(v) {
      const g = v.detail;
      if (typeof g?.thread_id != "string") {
        u.value = "Component picker returns an invalid selection.";
        return;
      }
      o("update:modelValue", g.thread_id), h(g.thread_id);
    }
    function w(v) {
      u.value = v.detail?.message || "Component picker is unavailable.";
    }
    async function m() {
      const v = ++d;
      s.value = !0, u.value = "";
      try {
        if (await Tf("wc-component-picker", { timeoutMs: 8e3 }), v !== d || !r.value) return;
        l?.removeEventListener("change", b), l?.removeEventListener("error", w), l = document.createElement("wc-component-picker"), l.setAttribute("source", c.value), l.setAttribute("placeholder", "Select a component…"), l.setAttribute("value", JSON.stringify({ thread_id: n.modelValue || "" })), l.addEventListener("change", b), l.addEventListener("error", w), r.value.replaceChildren(l);
      } catch (g) {
        v === d && (u.value = g instanceof Error ? g.message : "Component picker is unavailable.");
      } finally {
        v === d && (s.value = !1);
      }
    }
    function p() {
      i.value && gu(i.value) && (a.value = [...a.value, i.value]);
    }
    return xe(c, (v) => l?.setAttribute("source", v)), xe(() => n.modelValue || "", (v) => {
      l?.setAttribute("value", JSON.stringify({ thread_id: v })), h(v);
    }), it(() => {
      m(), h(n.modelValue || "");
    }), oo(() => {
      d += 1, f += 1, l?.removeEventListener("change", b), l?.removeEventListener("error", w), l = null;
    }), (v, g) => (A(), G("div", J_, [
      I("div", Q_, [
        I("button", {
          class: Me(["kg-mini kg-mini--wide", { active: !a.value.length }]),
          onClick: g[0] || (g[0] = (k) => a.value = [])
        }, "Root", 2),
        (A(!0), G(ye, null, Se(a.value, (k, P) => (A(), G("button", {
          key: k.id,
          class: "kg-mini kg-mini--wide",
          onClick: (F) => a.value = a.value.slice(0, P + 1)
        }, he(k.name || "Untitled folder"), 9, ex))), 128))
      ]),
      I("div", {
        ref_key: "host",
        ref: r
      }, null, 512),
      s.value ? (A(), G("span", tx, "Loading component picker…")) : fe("", !0),
      u.value ? (A(), G("div", nx, [
        zt(he(u.value) + " ", 1),
        I("button", {
          class: "kg-mini kg-mini--wide",
          onClick: m
        }, "Retry")
      ])) : fe("", !0),
      i.value && oe(gu)(i.value) ? (A(), G("button", {
        key: 2,
        class: "kg-mini kg-mini--wide",
        "aria-label": `Browse ${i.value.name || "folder"}`,
        onClick: p
      }, "Browse " + he(i.value.name || "folder"), 9, ox)) : fe("", !0)
    ]));
  }
}), ix = { class: "kg-source" }, ax = ["value"], sx = ["value"], lx = {
  key: 1,
  class: "kg-url"
}, ux = ["value"], cx = ["href"], dx = ["value"], fx = /* @__PURE__ */ $e({
  __name: "MaterialSourceEditor",
  props: {
    material: {}
  },
  emits: ["update"],
  setup(e, { emit: t }) {
    const n = e, o = t, r = ne(() => String(n.material.source?.type || "inline"));
    function a(s) {
      o("update", { source: { ...n.material.source || {}, type: s } });
    }
    function i(s, u) {
      o("update", { source: { ...n.material.source || {}, [s]: u } });
    }
    return (s, u) => (A(), G("div", ix, [
      I("select", {
        class: "kg-input kg-small",
        value: r.value,
        onChange: u[0] || (u[0] = (c) => a(c.target.value))
      }, [...u[5] || (u[5] = [
        I("option", { value: "inline" }, "inline", -1),
        I("option", { value: "url" }, "url", -1),
        I("option", { value: "upload" }, "upload", -1),
        I("option", { value: "component" }, "component", -1)
      ])], 40, ax),
      r.value === "inline" ? (A(), G("textarea", {
        key: 0,
        class: "kg-textarea kg-small",
        rows: "2",
        value: String(e.material.source?.text || ""),
        placeholder: "inline text",
        onChange: u[1] || (u[1] = (c) => i("text", c.target.value))
      }, null, 40, sx)) : r.value === "url" ? (A(), G("div", lx, [
        I("input", {
          class: "kg-input kg-small",
          value: String(e.material.source?.url || ""),
          placeholder: "https://...",
          onChange: u[2] || (u[2] = (c) => i("url", c.target.value))
        }, null, 40, ux),
        e.material.source?.url ? (A(), G("a", {
          key: 0,
          class: "kg-url-go",
          href: String(e.material.source?.url),
          target: "_blank",
          rel: "noopener",
          title: "Open"
        }, "↗", 8, cx)) : fe("", !0)
      ])) : r.value === "upload" ? (A(), G("input", {
        key: 2,
        class: "kg-input kg-small",
        value: String(e.material.source?.upload_id || ""),
        placeholder: "upload id",
        onChange: u[3] || (u[3] = (c) => i("upload_id", c.target.value))
      }, null, 40, dx)) : r.value === "component" ? (A(), Ie(rx, {
        key: 3,
        "model-value": String(e.material.source?.component_id || ""),
        "onUpdate:modelValue": u[4] || (u[4] = (c) => i("component_id", c))
      }, null, 8, ["model-value"])) : fe("", !0)
    ]));
  }
}), hx = { class: "kg-mat-kind" }, px = { class: "kg-mat-title" }, gx = ["aria-label"], vx = ["value"], mx = ["value"], yx = ["value", "placeholder", "onChange"], bx = ["value", "onChange"], wx = { value: "" }, kx = ["value"], _x = ["type", "value", "placeholder", "onChange"], Za = /* @__PURE__ */ $e({
  __name: "MaterialCard",
  props: {
    material: {},
    materialTypes: {},
    expanded: { type: Boolean }
  },
  emits: ["toggle", "update", "remove"],
  setup(e, { emit: t }) {
    const n = e, o = t, r = ne(() => n.materialTypes.find((c) => c.id === n.material.kind)), a = ne(() => String(r.value?.title || n.material.kind)), i = ne(() => {
      const c = r.value?.fields;
      return Array.isArray(c) ? c : c && typeof c == "object" ? Object.entries(c).map(([l, d]) => ({ key: l, ...d || {} })) : [];
    }), s = ne(() => {
      if (n.material.title) return n.material.title;
      const c = n.material.source;
      if (c?.type === "component") return "component reference";
      if (c?.type === "url" && c.url)
        try {
          return new URL(String(c.url)).host;
        } catch {
          return String(c.url);
        }
      if (c?.type === "upload") return "upload";
      const l = String(c?.text || n.material.summary || "");
      return l ? l.slice(0, 60) : "empty";
    });
    function u(c, l) {
      o("update", { meta: { ...n.material.meta || {}, [c]: l } });
    }
    return (c, l) => (A(), G("div", {
      class: Me(["kg-material", { "kg-material--open": e.expanded }])
    }, [
      I("div", {
        class: "kg-material-head",
        role: "button",
        tabindex: "0",
        onClick: l[1] || (l[1] = (d) => o("toggle")),
        onKeydown: [
          l[2] || (l[2] = Ze((d) => o("toggle"), ["enter"])),
          l[3] || (l[3] = Ze(qe((d) => o("toggle"), ["prevent"]), ["space"]))
        ]
      }, [
        I("span", hx, he(a.value), 1),
        I("span", px, he(s.value), 1),
        I("span", {
          class: Me(["kg-mat-chevron", { open: e.expanded }])
        }, "›", 2),
        I("button", {
          class: "kg-mini kg-danger",
          "aria-label": `Remove ${a.value} material`,
          onClick: l[0] || (l[0] = qe((d) => o("remove"), ["stop"]))
        }, "×", 8, gx)
      ], 32),
      e.expanded ? (A(), G(ye, { key: 0 }, [
        I("input", {
          class: "kg-input kg-small",
          value: e.material.title || "",
          placeholder: "title",
          onChange: l[4] || (l[4] = (d) => o("update", { title: d.target.value }))
        }, null, 40, vx),
        I("textarea", {
          class: "kg-textarea kg-small",
          rows: "2",
          value: e.material.summary || "",
          placeholder: "summary",
          onChange: l[5] || (l[5] = (d) => o("update", { summary: d.target.value }))
        }, null, 40, mx),
        (A(!0), G(ye, null, Se(i.value, (d) => (A(), G(ye, {
          key: d.key
        }, [
          d.type === "textarea" || d.key === "body" ? (A(), G("textarea", {
            key: 0,
            class: "kg-textarea kg-small",
            rows: "2",
            value: String(e.material.meta?.[d.key] ?? ""),
            placeholder: d.label || d.key,
            onChange: (f) => u(d.key, f.target.value)
          }, null, 40, yx)) : d.type === "select" ? (A(), G("select", {
            key: 1,
            class: "kg-input kg-small",
            value: String(e.material.meta?.[d.key] ?? ""),
            onChange: (f) => u(d.key, f.target.value)
          }, [
            I("option", wx, he(d.label || d.key), 1),
            (A(!0), G(ye, null, Se(d.options || [], (f) => (A(), G("option", {
              key: f,
              value: f
            }, he(f), 9, kx))), 128))
          ], 40, bx)) : (A(), G("input", {
            key: 2,
            class: "kg-input kg-small",
            type: d.type === "number" ? "number" : "text",
            value: String(e.material.meta?.[d.key] ?? ""),
            placeholder: d.label || d.key,
            onChange: (f) => u(d.key, f.target.value)
          }, null, 40, _x))
        ], 64))), 128)),
        ze(fx, {
          material: e.material,
          onUpdate: l[6] || (l[6] = (d) => o("update", d))
        }, null, 8, ["material"])
      ], 64)) : fe("", !0)
    ], 2));
  }
}), xx = { class: "kg-panel-inner" }, Ex = {
  key: 0,
  class: "kg-hdr"
}, $x = { class: "kg-hdr-top" }, Sx = { class: "kg-editable-title" }, Cx = ["innerHTML"], Nx = { class: "kg-hdr-top" }, Mx = ["value"], Tx = ["value"], Ix = {
  key: 0,
  value: "note"
}, Dx = {
  key: 0,
  class: "kg-editrow"
}, Ax = {
  key: 2,
  class: "kg-editrow"
}, Px = ["innerHTML"], Ox = {
  key: 0,
  class: "kg-row"
}, Rx = { class: "kg-disclosure-meta" }, zx = {
  key: 1,
  class: "kg-disclosure-body"
}, Bx = { class: "kg-colorrow" }, Lx = ["aria-label", "onClick"], Vx = { class: "kg-inline-field" }, Hx = { class: "kg-inline-field kg-wrap" }, Fx = ["onClick"], Gx = { class: "kg-slider-row" }, Yx = ["value"], Ux = { class: "kg-slider-val" }, qx = ["value"], Xx = { class: "kg-slider-val" }, Wx = { class: "kg-inline-field" }, Kx = { class: "kg-ports" }, jx = ["aria-label", "onClick"], Zx = { class: "kg-port-n" }, Jx = ["aria-label", "onClick"], Qx = { class: "kg-port-lbl" }, eE = { class: "kg-tags-edit" }, tE = ["aria-label", "onClick"], nE = { class: "kg-section-head" }, oE = { class: "kg-add-wrap" }, rE = ["title"], iE = {
  key: 0,
  class: "kg-add-menu"
}, aE = ["onClick"], sE = {
  key: 0,
  class: "kg-add-empty"
}, lE = { class: "kg-materials" }, uE = {
  key: 0,
  class: "kg-empty-line"
}, cE = /* @__PURE__ */ $e({
  __name: "NodePanel",
  props: {
    readOnly: { type: Boolean },
    node: {},
    nodeTypes: {},
    materialTypes: {},
    materials: {},
    hasChildren: { type: Boolean },
    expanded: { type: Boolean }
  },
  emits: ["update", "delete", "material-add", "component-ref-add", "material-update", "material-remove", "drill", "toggle-expand", "collapse", "close"],
  setup(e, { emit: t }) {
    const n = e, o = t, r = le(null), a = le(""), i = le(""), s = le(!1), u = le(!1), c = le(/* @__PURE__ */ new Set());
    xe(() => n.materials.length, (z, x) => {
      if (z > (x ?? 0)) {
        const L = n.materials[n.materials.length - 1];
        L && (c.value = /* @__PURE__ */ new Set([...c.value, L.id]));
      }
    }), xe(() => n.node.id, () => {
      c.value = /* @__PURE__ */ new Set(), u.value = !1, r.value = null;
    });
    const l = ne(() => n.node.properties || {}), d = ne(() => String(l.value.accent || l.value.color || v(n.node.type))), f = ne(() => String(l.value.style || "solid")), h = ne(() => String(l.value.animation || "")), b = ne(() => Number(l.value.width || 210)), w = ne(() => Number(l.value.radius ?? 6)), m = ne(() => [...n.nodeTypes].sort((z, x) => (z.title || z.id).localeCompare(x.title || x.id))), p = ne(() => n.materialTypes.filter((z) => !z.targets || z.targets.includes("node")));
    function v(z) {
      return String(n.nodeTypes.find((x) => x.id === z)?.color || "var(--p-primary-color)");
    }
    function g(z, x) {
      r.value = z, a.value = x;
    }
    function k(z) {
      r.value = null;
      const x = z === "name" ? n.node.name : n.node.description || "";
      a.value !== x && o("update", { [z]: a.value });
    }
    function P(z) {
      z !== n.node.type && o("update", { type: z });
    }
    function F(z, x) {
      o("update", { properties: { ...l.value, [z]: x } });
    }
    function K() {
      const z = i.value.trim();
      if (!z) return;
      const x = n.node.tags || [];
      x.includes(z) || o("update", { tags: [...x, z] }), i.value = "";
    }
    function C(z) {
      o("update", { tags: (n.node.tags || []).filter((x) => x !== z) });
    }
    function N() {
      return xd(l.value.handles);
    }
    function M(z) {
      return N().filter((x) => x.side === z).length;
    }
    function B(z) {
      const x = l.value[`_port_${z}`];
      return typeof x == "number" ? x : M(z);
    }
    function S(z) {
      const x = [...N()], L = B(z), te = z === "top" || z === "left" ? "target" : "source";
      x.push({ id: `${z}-${L}`, type: te, side: z }), o("update", { properties: { ...l.value, handles: JSON.stringify(x), [`_port_${z}`]: L + 1 } });
    }
    function Q(z) {
      const x = [...N()], L = x.filter((q) => q.side === z);
      if (!L.length) return;
      const te = L[L.length - 1], H = x.findIndex((q) => q.id === te.id);
      H >= 0 && x.splice(H, 1), o("update", { properties: { ...l.value, handles: JSON.stringify(x), [`_port_${z}`]: B(z) } });
    }
    function y(z) {
      s.value = !1, o("material-add", z);
    }
    function O() {
      return p.value.find((z) => z.id === "reference")?.id || p.value.find((z) => z.id === "component")?.id || p.value[0]?.id || "reference";
    }
    function E(z) {
      const x = new Set(c.value);
      x.has(z) ? x.delete(z) : x.add(z), c.value = x;
    }
    const X = ["", "pulse", "glow", "blink", "breathe", "shake"], U = [
      { k: "top", l: "T" },
      { k: "left", l: "L" },
      { k: "right", l: "R" },
      { k: "bottom", l: "B" }
    ];
    return (z, x) => (A(), G("div", xx, [
      e.readOnly ? (A(), G("div", Ex, [
        I("div", $x, [
          x[26] || (x[26] = I("span", { class: "kg-kicker" }, "Node", -1)),
          I("button", {
            class: "kg-x",
            "aria-label": "Close node inspector",
            onClick: x[0] || (x[0] = (L) => o("close"))
          }, "×")
        ]),
        I("h3", Sx, he(e.node.name), 1),
        I("div", {
          class: "kg-desc-preview",
          innerHTML: oe(ba)(e.node.description || e.node.name)
        }, null, 8, Cx),
        x[27] || (x[27] = I("p", { class: "kg-muted" }, "Read only", -1))
      ])) : (A(), G(ye, { key: 1 }, [
        I("div", {
          class: "kg-hdr",
          style: Pe({ borderLeftColor: d.value })
        }, [
          I("div", Nx, [
            I("span", {
              class: "kg-hdr-dot",
              style: Pe({ background: d.value })
            }, null, 4),
            I("select", {
              class: "kg-type-sel",
              value: e.node.type,
              onChange: x[1] || (x[1] = (L) => P(L.target.value))
            }, [
              (A(!0), G(ye, null, Se(m.value, (L) => (A(), G("option", {
                key: L.id,
                value: L.id
              }, he(L.title || L.id), 9, Tx))), 128)),
              m.value.length ? fe("", !0) : (A(), G("option", Ix, "note"))
            ], 40, Mx),
            I("button", {
              class: "kg-x kg-x--chev",
              title: "Hide inspector",
              "aria-label": "Hide inspector",
              onClick: x[2] || (x[2] = (L) => o("collapse"))
            }, "»"),
            I("button", {
              class: "kg-x",
              title: "Close",
              "aria-label": "Close node inspector",
              onClick: x[3] || (x[3] = (L) => o("close"))
            }, "×")
          ]),
          r.value === "name" ? (A(), G("div", Dx, [
            un(I("input", {
              class: "kg-input kg-title-input",
              "onUpdate:modelValue": x[4] || (x[4] = (L) => a.value = L),
              onKeyup: x[5] || (x[5] = Ze((L) => k("name"), ["enter"])),
              onBlur: x[6] || (x[6] = (L) => k("name")),
              autofocus: ""
            }, null, 544), [
              [cn, a.value]
            ])
          ])) : (A(), G("div", {
            key: 1,
            class: "kg-editable-title",
            role: "button",
            tabindex: "0",
            onClick: x[7] || (x[7] = (L) => g("name", e.node.name)),
            onKeydown: [
              x[8] || (x[8] = Ze((L) => g("name", e.node.name), ["enter"])),
              x[9] || (x[9] = Ze(qe((L) => g("name", e.node.name), ["prevent"]), ["space"]))
            ]
          }, he(e.node.name), 33)),
          r.value === "description" ? (A(), G("div", Ax, [
            un(I("textarea", {
              class: "kg-textarea",
              rows: "4",
              "onUpdate:modelValue": x[10] || (x[10] = (L) => a.value = L),
              onBlur: x[11] || (x[11] = (L) => k("description")),
              autofocus: ""
            }, null, 544), [
              [cn, a.value]
            ])
          ])) : (A(), G("div", {
            key: 3,
            class: "kg-desc-preview",
            role: "button",
            tabindex: "0",
            onClick: x[12] || (x[12] = (L) => g("description", e.node.description || "")),
            onKeydown: [
              x[13] || (x[13] = Ze((L) => g("description", e.node.description || ""), ["enter"])),
              x[14] || (x[14] = Ze(qe((L) => g("description", e.node.description || ""), ["prevent"]), ["space"]))
            ],
            innerHTML: e.node.description ? oe(ba)(e.node.description) : "<em>add description…</em>"
          }, null, 40, Px))
        ], 4),
        e.hasChildren ? (A(), G("div", Ox, [
          I("button", {
            class: "kg-btn kg-btn--ghost",
            onClick: x[15] || (x[15] = (L) => o("toggle-expand"))
          }, he(e.expanded ? "Collapse" : "Expand"), 1),
          I("button", {
            class: "kg-btn kg-btn--ghost",
            onClick: x[16] || (x[16] = (L) => o("drill"))
          }, "Open ›")
        ])) : fe("", !0),
        I("button", {
          class: Me(["kg-disclosure", { open: u.value }]),
          onClick: x[17] || (x[17] = (L) => u.value = !u.value)
        }, [
          x[28] || (x[28] = I("span", null, "Style", -1)),
          I("span", Rx, [
            I("span", {
              class: "kg-swatch kg-swatch--peek",
              style: Pe({ background: d.value })
            }, null, 4)
          ]),
          x[29] || (x[29] = I("span", { class: "kg-disclosure-chevron" }, "›", -1))
        ], 2),
        u.value ? (A(), G("div", zx, [
          I("div", Bx, [
            (A(!0), G(ye, null, Se(oe(sr), (L) => (A(), G("button", {
              key: L.value,
              class: Me(["kg-swatch", { active: d.value === L.value }]),
              style: Pe({ background: L.value }),
              "aria-label": `Use node color ${L.label}`,
              onClick: (te) => F("accent", L.value)
            }, null, 14, Lx))), 128))
          ]),
          I("div", Vx, [
            x[30] || (x[30] = I("span", { class: "kg-mini-label" }, "Border", -1)),
            I("button", {
              class: Me(["kg-chip", { active: f.value === "solid" }]),
              onClick: x[18] || (x[18] = (L) => F("style", "solid"))
            }, "solid", 2),
            I("button", {
              class: Me(["kg-chip", { active: f.value === "dashed" }]),
              onClick: x[19] || (x[19] = (L) => F("style", "dashed"))
            }, "dashed", 2)
          ]),
          I("div", Hx, [
            x[31] || (x[31] = I("span", { class: "kg-mini-label" }, "Animate", -1)),
            (A(), G(ye, null, Se(X, (L) => I("button", {
              key: L,
              class: Me(["kg-chip", { active: h.value === L }]),
              onClick: (te) => F("animation", L)
            }, he(L || "none"), 11, Fx)), 64))
          ]),
          I("div", Gx, [
            x[32] || (x[32] = I("span", { class: "kg-mini-label" }, "W", -1)),
            I("input", {
              type: "range",
              min: "150",
              max: "640",
              step: "10",
              value: b.value,
              onInput: x[20] || (x[20] = (L) => F("width", Number(L.target.value)))
            }, null, 40, Yx),
            I("span", Ux, he(b.value), 1),
            x[33] || (x[33] = I("span", { class: "kg-mini-label" }, "R", -1)),
            I("input", {
              type: "range",
              min: "0",
              max: "30",
              step: "2",
              value: w.value,
              onInput: x[21] || (x[21] = (L) => F("radius", Number(L.target.value)))
            }, null, 40, qx),
            I("span", Xx, he(w.value), 1)
          ])
        ])) : fe("", !0),
        I("div", Wx, [
          x[34] || (x[34] = I("span", { class: "kg-mini-label" }, "Ports", -1)),
          I("div", Kx, [
            (A(), G(ye, null, Se(U, (L) => I("div", {
              key: L.k,
              class: "kg-port-cell"
            }, [
              I("button", {
                class: "kg-mini",
                "aria-label": `Remove ${L.k} port`,
                onClick: (te) => Q(L.k)
              }, "−", 8, jx),
              I("span", Zx, he(M(L.k)), 1),
              I("button", {
                class: "kg-mini",
                "aria-label": `Add ${L.k} port`,
                onClick: (te) => S(L.k)
              }, "+", 8, Jx),
              I("span", Qx, he(L.l), 1)
            ])), 64))
          ])
        ]),
        x[36] || (x[36] = I("label", { class: "kg-label" }, "Tags", -1)),
        I("div", eE, [
          (A(!0), G(ye, null, Se(e.node.tags || [], (L) => (A(), G("span", {
            key: L,
            class: "kg-tagchip"
          }, [
            zt(he(L), 1),
            I("button", {
              class: "kg-tagx",
              "aria-label": `Remove tag ${L}`,
              onClick: (te) => C(L)
            }, "×", 8, tE)
          ]))), 128))
        ]),
        un(I("input", {
          class: "kg-input kg-small",
          "onUpdate:modelValue": x[22] || (x[22] = (L) => i.value = L),
          placeholder: "add tag + Enter",
          onKeyup: Ze(K, ["enter"])
        }, null, 544), [
          [cn, i.value]
        ]),
        I("div", nE, [
          x[35] || (x[35] = I("span", null, "Materials", -1)),
          I("button", {
            class: "kg-mini kg-mini--wide",
            title: "Attach a workspace component reference",
            onClick: x[23] || (x[23] = (L) => o("component-ref-add", O()))
          }, "+ Component ref"),
          I("div", oE, [
            I("button", {
              class: "kg-mini",
              title: p.value.length ? "Attach material" : "No material types — open Types",
              "aria-label": "Attach material",
              onClick: x[24] || (x[24] = (L) => s.value = !s.value)
            }, "+", 8, rE),
            s.value ? (A(), G("div", iE, [
              (A(!0), G(ye, null, Se(p.value, (L) => (A(), G("button", {
                key: L.id,
                class: "kg-add-item",
                onClick: (te) => y(L.id)
              }, he(L.title || L.id), 9, aE))), 128)),
              p.value.length ? fe("", !0) : (A(), G("div", sE, "no material types"))
            ])) : fe("", !0)
          ])
        ]),
        I("div", lE, [
          (A(!0), G(ye, null, Se(e.materials, (L) => (A(), Ie(Za, {
            key: L.id,
            material: L,
            "material-types": e.materialTypes,
            expanded: c.value.has(L.id),
            onToggle: (te) => E(L.id),
            onUpdate: (te) => o("material-update", { id: L.id, patch: te }),
            onRemove: (te) => o("material-remove", L.id)
          }, null, 8, ["material", "material-types", "expanded", "onToggle", "onUpdate", "onRemove"]))), 128)),
          e.materials.length ? fe("", !0) : (A(), G("div", uE, "no materials yet"))
        ]),
        I("button", {
          class: "kg-btn kg-danger kg-block",
          onClick: x[25] || (x[25] = (L) => o("delete"))
        }, "Delete node")
      ], 64))
    ]));
  }
}), dE = { class: "kg-panel-inner" }, fE = {
  key: 0,
  class: "kg-hdr"
}, hE = { class: "kg-hdr-top" }, pE = { class: "kg-hdr-top" }, gE = ["onKeydown"], vE = { class: "kg-edge-dir" }, mE = { class: "kg-edge-node" }, yE = { class: "kg-edge-arrow" }, bE = { class: "kg-edge-node" }, wE = { class: "kg-chiprow" }, kE = ["onClick"], _E = {
  key: 0,
  class: "kg-chip active"
}, xE = { class: "kg-chiprow" }, EE = { class: "kg-disclosure-meta" }, $E = {
  key: 0,
  class: "kg-disclosure-body"
}, SE = { class: "kg-colorrow" }, CE = ["aria-label", "onClick"], NE = ["value"], ME = { class: "kg-inline-field" }, TE = { class: "kg-inline-field kg-wrap" }, IE = ["onClick"], DE = { class: "kg-section-head" }, AE = { class: "kg-add-wrap" }, PE = ["title"], OE = {
  key: 0,
  class: "kg-add-menu"
}, RE = ["onClick"], zE = {
  key: 0,
  class: "kg-add-empty"
}, BE = { class: "kg-materials" }, LE = {
  key: 0,
  class: "kg-empty-line"
}, VE = /* @__PURE__ */ $e({
  __name: "EdgePanel",
  props: {
    readOnly: { type: Boolean },
    edge: {},
    edgeTypes: {},
    materialTypes: {},
    materials: {},
    sourceName: {},
    targetName: {}
  },
  emits: ["update", "reverse", "delete", "material-add", "component-ref-add", "material-update", "material-remove", "collapse", "close"],
  setup(e, { emit: t }) {
    const n = e, o = t, r = le(!1), a = le(""), i = le(!1), s = le(!1), u = le(/* @__PURE__ */ new Set());
    xe(() => n.materials.length, (C, N) => {
      if (C > (N ?? 0)) {
        const M = n.materials[n.materials.length - 1];
        M && (u.value = /* @__PURE__ */ new Set([...u.value, M.id]));
      }
    }), xe(() => n.edge.id, () => {
      u.value = /* @__PURE__ */ new Set(), s.value = !1, r.value = !1;
    });
    const c = ne(() => n.edge.properties || {}), l = ne(() => c.value.animated === !0 || c.value.animated === "true"), d = ne(() => c.value.bidirectional === !0 || c.value.direction === "bidirectional"), f = ne(() => String(c.value.stroke || "")), h = ne(() => Number(c.value.strokeWidth || 0)), b = ne(() => String(c.value.routing || "default")), w = ne(() => n.materialTypes.filter((C) => !C.targets || C.targets.includes("edge")));
    function m() {
      r.value = !0, a.value = n.edge.label || "";
    }
    function p() {
      r.value = !1, a.value !== (n.edge.label || "") && o("update", { label: a.value });
    }
    function v(C) {
      C !== n.edge.type && o("update", { type: C });
    }
    function g(C, N) {
      o("update", { properties: { ...c.value, [C]: N } });
    }
    function k(C) {
      g("direction", C ? "bidirectional" : "directed");
    }
    function P(C) {
      i.value = !1, o("material-add", C);
    }
    function F() {
      return w.value.find((C) => C.id === "reference")?.id || w.value.find((C) => C.id === "component")?.id || w.value[0]?.id || "reference";
    }
    function K(C) {
      const N = new Set(u.value);
      N.has(C) ? N.delete(C) : N.add(C), u.value = N;
    }
    return (C, N) => (A(), G("div", dE, [
      e.readOnly ? (A(), G("div", fE, [
        I("div", hE, [
          N[12] || (N[12] = I("span", { class: "kg-kicker" }, "Relation", -1)),
          I("button", {
            class: "kg-x",
            "aria-label": "Close edge inspector",
            onClick: N[0] || (N[0] = (M) => o("close"))
          }, "×")
        ]),
        I("h3", null, he(e.edge.label || "Relation"), 1),
        I("p", null, he(e.sourceName || "Source node") + " → " + he(e.targetName || "Target node"), 1),
        N[13] || (N[13] = I("p", { class: "kg-muted" }, "Read only", -1))
      ])) : (A(), G(ye, { key: 1 }, [
        I("div", {
          class: "kg-hdr",
          style: Pe({ borderLeftColor: f.value || "var(--kg-line)" })
        }, [
          I("div", pE, [
            N[14] || (N[14] = I("span", { class: "kg-kicker" }, "Edge", -1)),
            I("button", {
              class: "kg-x kg-x--chev",
              title: "Hide inspector",
              "aria-label": "Hide inspector",
              onClick: N[1] || (N[1] = (M) => o("collapse"))
            }, "»"),
            I("button", {
              class: "kg-x",
              title: "Close",
              "aria-label": "Close edge inspector",
              onClick: N[2] || (N[2] = (M) => o("close"))
            }, "×")
          ]),
          r.value ? un((A(), G("input", {
            key: 0,
            class: "kg-input kg-title-input",
            "onUpdate:modelValue": N[3] || (N[3] = (M) => a.value = M),
            onKeyup: Ze(p, ["enter"]),
            onBlur: p,
            autofocus: ""
          }, null, 544)), [
            [cn, a.value]
          ]) : (A(), G("div", {
            key: 1,
            class: "kg-editable-title",
            role: "button",
            tabindex: "0",
            onClick: m,
            onKeydown: [
              Ze(m, ["enter"]),
              Ze(qe(m, ["prevent"]), ["space"])
            ]
          }, he(e.edge.label || "set label…"), 41, gE)),
          I("div", vE, [
            I("span", mE, he(e.sourceName || "Source node"), 1),
            I("span", yE, he(d.value ? "↔" : "→"), 1),
            I("span", bE, he(e.targetName || "Target node"), 1)
          ])
        ], 4),
        N[21] || (N[21] = I("label", { class: "kg-label" }, "Type", -1)),
        I("div", wE, [
          (A(!0), G(ye, null, Se(e.edgeTypes, (M) => (A(), G("button", {
            key: M.id,
            class: Me(["kg-chip", { active: e.edge.type === M.id }]),
            onClick: (B) => v(M.id)
          }, he(M.title || M.id), 11, kE))), 128)),
          e.edgeTypes.length ? fe("", !0) : (A(), G("button", _E, he(e.edge.type), 1))
        ]),
        N[22] || (N[22] = I("label", { class: "kg-label" }, "Direction", -1)),
        I("div", xE, [
          I("button", {
            class: "kg-chip",
            title: "Swap source and target",
            onClick: N[4] || (N[4] = (M) => o("reverse"))
          }, "reverse"),
          I("button", {
            class: Me(["kg-chip", { active: d.value }]),
            title: "Render arrows in both directions",
            onClick: N[5] || (N[5] = (M) => k(!d.value))
          }, "bidirectional", 2)
        ]),
        I("button", {
          class: Me(["kg-disclosure", { open: s.value }]),
          onClick: N[6] || (N[6] = (M) => s.value = !s.value)
        }, [
          N[15] || (N[15] = I("span", null, "Style", -1)),
          I("span", EE, [
            I("span", {
              class: "kg-swatch kg-swatch--peek",
              style: Pe({ background: f.value || "var(--p-text-muted-color)" })
            }, null, 4)
          ]),
          N[16] || (N[16] = I("span", { class: "kg-disclosure-chevron" }, "›", -1))
        ], 2),
        s.value ? (A(), G("div", $E, [
          I("div", SE, [
            (A(!0), G(ye, null, Se(oe(sr), (M) => (A(), G("button", {
              key: M.value,
              class: Me(["kg-swatch", { active: f.value === M.value }]),
              style: Pe({ background: M.value }),
              "aria-label": `Use edge color ${M.label}`,
              onClick: (B) => g("stroke", M.value)
            }, null, 14, CE))), 128)),
            I("select", {
              class: "kg-input kg-small kg-wsel",
              value: h.value || "",
              onChange: N[7] || (N[7] = (M) => g("strokeWidth", Number(M.target.value)))
            }, [...N[17] || (N[17] = [
              Ef('<option value="">width</option><option value="1">1px</option><option value="2">2px</option><option value="3">3px</option><option value="4">4px</option>', 5)
            ])], 40, NE)
          ]),
          I("div", ME, [
            N[18] || (N[18] = I("span", { class: "kg-mini-label" }, "Effect", -1)),
            I("button", {
              class: Me(["kg-chip", { active: l.value }]),
              onClick: N[8] || (N[8] = (M) => g("animated", !l.value))
            }, "animated", 2)
          ]),
          I("div", TE, [
            N[19] || (N[19] = I("span", { class: "kg-mini-label" }, "Routing", -1)),
            (A(!0), G(ye, null, Se(oe(Go), (M) => (A(), G("button", {
              key: M,
              class: Me(["kg-chip", { active: b.value === M }]),
              onClick: (B) => g("routing", M)
            }, he(M), 11, IE))), 128))
          ])
        ])) : fe("", !0),
        I("div", DE, [
          N[20] || (N[20] = I("span", null, "Materials", -1)),
          I("button", {
            class: "kg-mini kg-mini--wide",
            title: "Attach a workspace component reference",
            onClick: N[9] || (N[9] = (M) => o("component-ref-add", F()))
          }, "+ Component ref"),
          I("div", AE, [
            I("button", {
              class: "kg-mini",
              title: w.value.length ? "Attach material" : "No material types — open Types",
              "aria-label": "Attach material",
              onClick: N[10] || (N[10] = (M) => i.value = !i.value)
            }, "+", 8, PE),
            i.value ? (A(), G("div", OE, [
              (A(!0), G(ye, null, Se(w.value, (M) => (A(), G("button", {
                key: M.id,
                class: "kg-add-item",
                onClick: (B) => P(M.id)
              }, he(M.title || M.id), 9, RE))), 128)),
              w.value.length ? fe("", !0) : (A(), G("div", zE, "no material types"))
            ])) : fe("", !0)
          ])
        ]),
        I("div", BE, [
          (A(!0), G(ye, null, Se(e.materials, (M) => (A(), Ie(Za, {
            key: M.id,
            material: M,
            "material-types": e.materialTypes,
            expanded: u.value.has(M.id),
            onToggle: (B) => K(M.id),
            onUpdate: (B) => o("material-update", { id: M.id, patch: B }),
            onRemove: (B) => o("material-remove", M.id)
          }, null, 8, ["material", "material-types", "expanded", "onToggle", "onUpdate", "onRemove"]))), 128)),
          e.materials.length ? fe("", !0) : (A(), G("div", LE, "none"))
        ]),
        I("button", {
          class: "kg-btn kg-danger kg-block",
          onClick: N[11] || (N[11] = (M) => o("delete"))
        }, "Delete edge")
      ], 64))
    ]));
  }
}), HE = { class: "kg-panel-inner" }, FE = { class: "kg-panel-head" }, GE = { class: "kg-head-actions" }, YE = { class: "kg-type-group" }, UE = { class: "kg-section-head" }, qE = ["value", "onChange"], XE = ["aria-label", "value", "onChange"], WE = ["value"], KE = ["aria-label", "onClick"], jE = { class: "kg-type-group" }, ZE = { class: "kg-section-head" }, JE = ["value", "onChange"], QE = ["aria-label", "value", "onChange"], e$ = ["value"], t$ = { class: "kg-anim-lbl" }, n$ = ["checked", "onChange"], o$ = ["aria-label", "onClick"], r$ = { class: "kg-type-group" }, i$ = { class: "kg-section-head" }, a$ = { class: "kg-type-row" }, s$ = ["value", "onChange"], l$ = ["value", "onChange"], u$ = ["value"], c$ = ["aria-label", "onClick"], d$ = { class: "kg-targets" }, f$ = ["checked", "onChange"], h$ = /* @__PURE__ */ $e({
  __name: "SchemaPanel",
  props: {
    nodeTypes: {},
    edgeTypes: {},
    materialTypes: {}
  },
  emits: ["type-add", "type-update", "type-remove", "seed", "collapse", "close"],
  setup(e, { emit: t }) {
    const n = t, o = ["panel", "badge", "both"], r = ["graph", "node", "edge"];
    function a(u, c, l) {
      n("type-update", { kind: u, id: c, patch: l });
    }
    function i(u, c) {
      const l = Array.isArray(u.targets) ? u.targets : [], d = l.includes(c) ? l.filter((f) => f !== c) : [...l, c];
      a("material", u.id, { targets: d });
    }
    function s(u, c) {
      return !u.targets || Array.isArray(u.targets) && u.targets.includes(c);
    }
    return (u, c) => (A(), G("div", HE, [
      I("div", FE, [
        c[6] || (c[6] = I("span", { class: "kg-panel-title" }, "Types", -1)),
        I("div", GE, [
          I("button", {
            class: "kg-mini kg-mini--wide",
            title: "Seed default types",
            onClick: c[0] || (c[0] = (l) => n("seed"))
          }, "Seed"),
          I("button", {
            class: "kg-x kg-x--chev",
            title: "Hide inspector",
            "aria-label": "Hide inspector",
            onClick: c[1] || (c[1] = (l) => n("collapse"))
          }, "»"),
          I("button", {
            class: "kg-x",
            title: "Close",
            "aria-label": "Close schema editor",
            onClick: c[2] || (c[2] = (l) => n("close"))
          }, "×")
        ])
      ]),
      I("div", YE, [
        I("div", UE, [
          c[7] || (c[7] = I("span", null, "Node types", -1)),
          I("button", {
            class: "kg-mini",
            "aria-label": "Add node type",
            onClick: c[3] || (c[3] = (l) => n("type-add", "node"))
          }, "+")
        ]),
        (A(!0), G(ye, null, Se(e.nodeTypes, (l) => (A(), G("div", {
          key: l.id,
          class: "kg-type-row"
        }, [
          I("input", {
            class: "kg-input kg-small",
            value: l.title || l.id,
            onChange: (d) => a("node", l.id, { title: d.target.value })
          }, null, 40, qE),
          I("select", {
            class: "kg-input kg-small kg-theme-select",
            "aria-label": `${l.title || l.id} color`,
            value: String(l.color || "var(--p-primary-color)"),
            onChange: (d) => a("node", l.id, { color: d.target.value })
          }, [
            (A(!0), G(ye, null, Se(oe(sr), (d) => (A(), G("option", {
              key: d.value,
              value: d.value
            }, he(d.label), 9, WE))), 128))
          ], 40, XE),
          I("button", {
            class: "kg-mini kg-danger",
            "aria-label": `Remove node type ${l.title || l.id}`,
            onClick: (d) => n("type-remove", { kind: "node", id: l.id })
          }, "×", 8, KE)
        ]))), 128))
      ]),
      I("div", jE, [
        I("div", ZE, [
          c[8] || (c[8] = I("span", null, "Edge types", -1)),
          I("button", {
            class: "kg-mini",
            "aria-label": "Add edge type",
            onClick: c[4] || (c[4] = (l) => n("type-add", "edge"))
          }, "+")
        ]),
        (A(!0), G(ye, null, Se(e.edgeTypes, (l) => (A(), G("div", {
          key: l.id,
          class: "kg-type-row"
        }, [
          I("input", {
            class: "kg-input kg-small",
            value: l.title || l.id,
            onChange: (d) => a("edge", l.id, { title: d.target.value })
          }, null, 40, JE),
          I("select", {
            class: "kg-input kg-small kg-theme-select",
            "aria-label": `${l.title || l.id} color`,
            value: String(l.color || l.stroke || "var(--p-text-muted-color)"),
            onChange: (d) => a("edge", l.id, { color: d.target.value, stroke: d.target.value })
          }, [
            (A(!0), G(ye, null, Se(oe(sr), (d) => (A(), G("option", {
              key: d.value,
              value: d.value
            }, he(d.label), 9, e$))), 128))
          ], 40, QE),
          I("label", t$, [
            I("input", {
              type: "checkbox",
              checked: l.animated === !0,
              onChange: (d) => a("edge", l.id, { animated: d.target.checked })
            }, null, 40, n$),
            c[9] || (c[9] = zt("anim", -1))
          ]),
          I("button", {
            class: "kg-mini kg-danger",
            "aria-label": `Remove edge type ${l.title || l.id}`,
            onClick: (d) => n("type-remove", { kind: "edge", id: l.id })
          }, "×", 8, o$)
        ]))), 128))
      ]),
      I("div", r$, [
        I("div", i$, [
          c[10] || (c[10] = I("span", null, "Material types", -1)),
          I("button", {
            class: "kg-mini",
            "aria-label": "Add material type",
            onClick: c[5] || (c[5] = (l) => n("type-add", "material"))
          }, "+")
        ]),
        (A(!0), G(ye, null, Se(e.materialTypes, (l) => (A(), G("div", {
          key: l.id,
          class: "kg-type-row kg-type-row--mat"
        }, [
          I("div", a$, [
            I("input", {
              class: "kg-input kg-small",
              value: l.title || l.id,
              onChange: (d) => a("material", l.id, { title: d.target.value })
            }, null, 40, s$),
            I("select", {
              class: "kg-input kg-small",
              value: String(l.display || "panel"),
              onChange: (d) => a("material", l.id, { display: d.target.value })
            }, [
              (A(), G(ye, null, Se(o, (d) => I("option", {
                key: d,
                value: d
              }, he(d), 9, u$)), 64))
            ], 40, l$),
            I("button", {
              class: "kg-mini kg-danger",
              "aria-label": `Remove material type ${l.title || l.id}`,
              onClick: (d) => n("type-remove", { kind: "material", id: l.id })
            }, "×", 8, c$)
          ]),
          I("div", d$, [
            (A(), G(ye, null, Se(r, (d) => I("label", {
              key: d,
              class: "kg-anim-lbl"
            }, [
              I("input", {
                type: "checkbox",
                checked: s(l, d),
                onChange: (f) => i(l, d)
              }, null, 40, f$),
              zt(he(d), 1)
            ])), 64))
          ])
        ]))), 128))
      ])
    ]));
  }
}), p$ = 12;
function zn(e) {
  return e.trim().toLowerCase();
}
function g$(e, t, n) {
  const o = zn(e.name || "");
  return o.startsWith(t) ? 0 : o.split(/\s+/).some((r) => r.startsWith(t)) ? 1 : o.includes(t) ? 2 : (e.tags || []).some((r) => zn(r).includes(t)) ? 3 : zn(n).includes(t) || zn(e.type || "").includes(t) ? 4 : null;
}
function v$(e, t, n) {
  const o = zn(t);
  if (!o) return [];
  const r = [];
  for (const a of e) {
    const i = String(n.get(a.type)?.title || a.type || ""), s = g$(a, o, i);
    s !== null && r.push({ node: a, score: s });
  }
  return r.sort((a, i) => a.score - i.score || (a.node.name || "").localeCompare(i.node.name || "")), r.slice(0, p$);
}
function Sd(e, t) {
  const n = [];
  let o = e.get(t)?.parent_id;
  const r = /* @__PURE__ */ new Set();
  for (; o && !r.has(o); )
    r.add(o), n.unshift(o), o = e.get(o)?.parent_id;
  return n;
}
function m$(e, t) {
  return Sd(e, t).map((n) => e.get(n)?.name || n).join(" / ");
}
const y$ = { class: "kg-search" }, b$ = {
  key: 0,
  class: "kg-search-menu"
}, w$ = ["onMousedown", "onMousemove"], k$ = { class: "kg-search-name" }, _$ = {
  key: 0,
  class: "kg-search-crumb"
}, x$ = {
  key: 0,
  class: "kg-search-none"
}, E$ = /* @__PURE__ */ $e({
  __name: "GraphSearch",
  props: {
    nodes: {},
    nodeById: {},
    typeDefs: {}
  },
  emits: ["pick"],
  setup(e, { expose: t, emit: n }) {
    const o = e, r = n, a = le(null), i = le(""), s = le(!1), u = le(0), c = ne(() => v$(o.nodes, i.value, o.typeDefs)), l = ne(() => s.value && i.value.trim().length > 0);
    function d(m) {
      return String(m.properties?.accent || o.typeDefs.get(m.type)?.color || "var(--p-primary-color)");
    }
    function f(m) {
      return m$(o.nodeById, m.id);
    }
    function h(m) {
      r("pick", m), i.value = "", a.value?.blur();
    }
    function b(m) {
      if (m.key === "ArrowDown")
        m.preventDefault(), u.value = Math.min(u.value + 1, c.value.length - 1);
      else if (m.key === "ArrowUp")
        m.preventDefault(), u.value = Math.max(u.value - 1, 0);
      else if (m.key === "Enter") {
        m.preventDefault();
        const p = c.value[u.value];
        p && h(p.node.id);
      } else m.key === "Escape" ? (m.stopPropagation(), i.value = "", a.value?.blur()) : u.value = 0;
    }
    function w(m = "") {
      i.value = m, u.value = 0, Ke(() => {
        a.value?.focus(), a.value?.setSelectionRange(m.length, m.length);
      });
    }
    return t({ focus: w }), (m, p) => (A(), G("div", y$, [
      un(I("input", {
        ref_key: "input",
        ref: a,
        "onUpdate:modelValue": p[0] || (p[0] = (v) => i.value = v),
        class: "kg-search-input",
        type: "text",
        placeholder: "Find node…  /",
        spellcheck: "false",
        onFocus: p[1] || (p[1] = (v) => s.value = !0),
        onBlur: p[2] || (p[2] = (v) => s.value = !1),
        onKeydown: b
      }, null, 544), [
        [cn, i.value]
      ]),
      l.value ? (A(), G("div", b$, [
        (A(!0), G(ye, null, Se(c.value, (v, g) => (A(), G("button", {
          key: v.node.id,
          class: Me(["kg-search-item", { active: g === u.value }]),
          onMousedown: qe((k) => h(v.node.id), ["prevent"]),
          onMousemove: (k) => u.value = g
        }, [
          I("span", {
            class: "kg-tree-dot",
            style: Pe({ background: d(v.node) })
          }, null, 4),
          I("span", k$, he(v.node.name), 1),
          f(v.node) ? (A(), G("span", _$, he(f(v.node)), 1)) : fe("", !0)
        ], 42, w$))), 128)),
        c.value.length ? fe("", !0) : (A(), G("div", x$, "No matches"))
      ])) : fe("", !0)
    ]));
  }
}), $$ = ["onClick"], S$ = /* @__PURE__ */ $e({
  __name: "ContextMenu",
  props: {
    x: {},
    y: {},
    items: {}
  },
  emits: ["close"],
  setup(e, { emit: t }) {
    const n = e, o = le(null), r = le(null), a = le({ left: "0px", top: "0px", visibility: "hidden" });
    function i() {
      const c = o.value?.getBoundingClientRect(), l = r.value?.getBoundingClientRect();
      if (!c || !l) return;
      const d = Math.max(0, Math.min(n.x - c.left, c.width - l.width)), f = Math.max(0, Math.min(n.y - c.top, c.height - l.height));
      a.value = { left: `${d}px`, top: `${f}px`, visibility: "visible" };
    }
    xe(() => [n.x, n.y], () => {
      Ke(i);
    }), it(() => {
      Ke(i), window.addEventListener("resize", i);
    }), oo(() => window.removeEventListener("resize", i));
    const s = t;
    function u(c) {
      c.action(), s("close");
    }
    return (c, l) => (A(), G("div", {
      ref_key: "layer",
      ref: o,
      class: "kg-ctx-overlay",
      onClick: l[2] || (l[2] = (d) => s("close")),
      onContextmenu: l[3] || (l[3] = qe((d) => s("close"), ["prevent"]))
    }, [
      I("div", {
        ref_key: "panel",
        ref: r,
        class: "kg-ctx",
        style: Pe(a.value),
        onClick: l[0] || (l[0] = qe(() => {
        }, ["stop"])),
        onContextmenu: l[1] || (l[1] = qe(() => {
        }, ["prevent", "stop"]))
      }, [
        (A(!0), G(ye, null, Se(e.items, (d, f) => (A(), G("button", {
          key: f,
          class: Me(["kg-ctx-item", { "kg-ctx-danger": d.danger }]),
          onClick: (h) => u(d)
        }, he(d.label), 11, $$))), 128))
      ], 36)
    ], 544));
  }
});
function C$(e) {
  const t = [];
  if (e.viewRoot && t.push({ label: "← Go up", action: e.navigateUp }), e.nodeTypes.length)
    for (const n of e.nodeTypes) t.push({ label: `Add ${n.title || n.id}`, action: () => e.addNode(n.id) });
  else
    t.push({ label: "Add node", action: () => e.addNode() });
  return t;
}
function N$(e) {
  const t = [];
  if (e.nodeTypes.length)
    for (const n of e.nodeTypes) t.push({ label: `Add ${n.title || n.id}`, action: () => e.addConnected(n.id) });
  else
    t.push({ label: "Add node", action: () => e.addConnected() });
  return t;
}
function M$(e, t, n) {
  for (let o = n.length - 1; o >= 0; o--) {
    const r = n[o];
    if (r.id !== e && !(!r.width || !r.height) && t.x >= r.x && t.x <= r.x + r.width && t.y >= r.y && t.y <= r.y + r.height)
      return r.id;
  }
  return null;
}
function vu(e) {
  return [e.x, e.x + e.width / 2, e.x + e.width];
}
function mu(e) {
  return [e.y, e.y + e.height / 2, e.y + e.height];
}
function yu(e, t) {
  return e === 1 == (t === 1);
}
function bu(e, t, n = 6) {
  let o = null, r = null;
  for (const u of t) {
    if (u.id === e.id || !u.width || !u.height) continue;
    const c = vu(u), l = vu(e);
    for (let h = 0; h < c.length; h++)
      for (let b = 0; b < l.length; b++) {
        if (!yu(h, b)) continue;
        const w = c[h] - l[b];
        Math.abs(w) <= n && (!o || Math.abs(w) < Math.abs(o.delta)) && (o = { delta: w, at: c[h], other: u });
      }
    const d = mu(u), f = mu(e);
    for (let h = 0; h < d.length; h++)
      for (let b = 0; b < f.length; b++) {
        if (!yu(h, b)) continue;
        const w = d[h] - f[b];
        Math.abs(w) <= n && (!r || Math.abs(w) < Math.abs(r.delta)) && (r = { delta: w, at: d[h], other: u });
      }
  }
  const a = e.x + (o ? o.delta : 0), i = e.y + (r ? r.delta : 0), s = [];
  return o && s.push({
    axis: "x",
    at: o.at,
    from: Math.min(i, o.other.y),
    to: Math.max(i + e.height, o.other.y + o.other.height)
  }), r && s.push({
    axis: "y",
    at: r.at,
    from: Math.min(a, r.other.x),
    to: Math.max(a + e.width, r.other.x + r.other.width)
  }), { x: a, y: i, guides: s };
}
function T$(e, t) {
  if (e.length < 2) return [];
  const n = Math.min(...e.map((u) => u.x)), o = Math.max(...e.map((u) => u.x + u.width)), r = Math.min(...e.map((u) => u.y)), a = Math.max(...e.map((u) => u.y + u.height)), i = (n + o) / 2, s = (r + a) / 2;
  return e.map((u) => {
    let c = u.x, l = u.y;
    return t === "left" ? c = n : t === "right" ? c = o - u.width : t === "center-h" ? c = Math.round(i - u.width / 2) : t === "top" ? l = r : t === "bottom" ? l = a - u.height : t === "center-v" && (l = Math.round(s - u.height / 2)), { id: u.id, x: c, y: l };
  });
}
function I$(e, t) {
  if (e.length < 3) return [];
  const n = [...e].sort((l, d) => t === "h" ? l.x - d.x : l.y - d.y), o = n[0], r = n[n.length - 1], a = n.reduce((l, d) => l + (t === "h" ? d.width : d.height), 0), s = ((t === "h" ? r.x + r.width - o.x : r.y + r.height - o.y) - a) / (n.length - 1), u = [];
  let c = t === "h" ? o.x : o.y;
  for (const l of n)
    u.push({ id: l.id, x: t === "h" ? Math.round(c) : l.x, y: t === "v" ? Math.round(c) : l.y }), c += (t === "h" ? l.width : l.height) + s;
  return u;
}
function D$(e, t, n = { x: 32, y: 32 }) {
  const o = /* @__PURE__ */ new Map(), r = e.nodes.map((i) => {
    const s = t();
    return o.set(i.id, s), { ...i, id: s, x: i.x + n.x, y: i.y + n.y };
  }), a = e.edges.filter((i) => o.has(i.source_id) && o.has(i.target_id)).map((i) => ({ ...i, source_id: o.get(i.source_id), target_id: o.get(i.target_id) }));
  return { nodes: r, edges: a };
}
const Ve = {
  NODE_ADDED: "chestor.graph.events:node.added",
  NODE_UPDATED: "chestor.graph.events:node.updated",
  NODE_REMOVED: "chestor.graph.events:node.removed",
  EDGE_ADDED: "chestor.graph.events:edge.added",
  EDGE_UPDATED: "chestor.graph.events:edge.updated",
  EDGE_REMOVED: "chestor.graph.events:edge.removed",
  MATERIAL_ATTACHED: "chestor.graph.events:material.attached",
  MATERIAL_UPDATED: "chestor.graph.events:material.updated",
  MATERIAL_DETACHED: "chestor.graph.events:material.detached",
  NODE_TYPE_REGISTERED: "chestor.graph.events:node-type.registered",
  NODE_TYPE_UPDATED: "chestor.graph.events:node-type.updated",
  NODE_TYPE_REMOVED: "chestor.graph.events:node-type.removed",
  EDGE_TYPE_REGISTERED: "chestor.graph.events:edge-type.registered",
  EDGE_TYPE_UPDATED: "chestor.graph.events:edge-type.updated",
  EDGE_TYPE_REMOVED: "chestor.graph.events:edge-type.removed",
  MATERIAL_TYPE_REGISTERED: "chestor.graph.events:material-type.registered",
  MATERIAL_TYPE_UPDATED: "chestor.graph.events:material-type.updated",
  MATERIAL_TYPE_REMOVED: "chestor.graph.events:material-type.removed",
  LAYOUT_POSITION_SET: "chestor.graph.events:layout.position-set"
}, A$ = "chestor.graph:state";
function P$(e, t) {
  return `kickside.thread.${e}.projection.${t}`;
}
function O$(e, t, n) {
  for (const o of t) {
    if (o.type !== Ve.LAYOUT_POSITION_SET) continue;
    const r = String(o.body.node_id || ""), a = Number(o.body.x), i = Number(o.body.y);
    !r || !Number.isFinite(a) || !Number.isFinite(i) || e.set(r, {
      revision: n,
      position: {
        x: a,
        y: i,
        ...Number.isFinite(Number(o.body.width)) ? { width: Number(o.body.width) } : {},
        ...Number.isFinite(Number(o.body.height)) ? { height: Number(o.body.height) } : {}
      }
    });
  }
}
function R$(e, t) {
  for (const [n, o] of e)
    o.revision === t && e.delete(n);
}
function Cd(e, t = /* @__PURE__ */ new Set()) {
  for (const n of e || [])
    t.add(n.id), Cd(n.children || [], t);
  return t;
}
function z$(e, t) {
  return e?.x === t.x && e?.y === t.y;
}
function B$(e, t, n) {
  if (!t.size) return e;
  const o = Cd(e.nodes || []), r = { ...e.layout?.positions || {} };
  for (const [a, i] of t) {
    if (!o.has(a)) {
      t.delete(a), delete r[a];
      continue;
    }
    if (n && z$(r[a], i.position)) {
      t.delete(a);
      continue;
    }
    r[a] = i.position;
  }
  return { ...e, layout: { ...e.layout || {}, positions: r } };
}
function Xt() {
  const e = globalThis.crypto;
  return e && typeof e.randomUUID == "function" ? e.randomUUID() : `id-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}
function To(e) {
  const t = { id: e.id || Xt(), type: e.type, name: e.name };
  return e.parentId && (t.parent_id = e.parentId), e.properties && (t.properties = e.properties), e.tags && (t.tags = e.tags), { type: Ve.NODE_ADDED, body: t };
}
function qi(e, t) {
  return { type: Ve.NODE_UPDATED, body: { id: e, ...t } };
}
function L$(e, t) {
  return { type: Ve.NODE_UPDATED, body: { id: e, parent_id: t || "" } };
}
function V$(e) {
  return { type: Ve.NODE_REMOVED, body: { id: e } };
}
function ln(e) {
  const t = { id: e.id || Xt(), type: e.type, source_id: e.sourceId, target_id: e.targetId };
  return e.label && (t.label = e.label), e.properties && (t.properties = e.properties), { type: Ve.EDGE_ADDED, body: t };
}
function xa(e, t) {
  return { type: Ve.EDGE_UPDATED, body: { id: e, ...t } };
}
function H$(e) {
  const t = { ...e.properties || {} }, n = t.sourceHandle, o = t.targetHandle;
  return o !== void 0 ? t.sourceHandle = o : delete t.sourceHandle, n !== void 0 ? t.targetHandle = n : delete t.targetHandle, xa(e.id, { source_id: e.target_id, target_id: e.source_id, properties: t });
}
function F$(e) {
  return { type: Ve.EDGE_REMOVED, body: { id: e } };
}
function Vt(e, t, n, o, r) {
  const a = { node_id: e, x: Math.round(t), y: Math.round(n) };
  return Number.isFinite(o) && o && (a.width = Math.round(o)), Number.isFinite(r) && r && (a.height = Math.round(r)), { type: Ve.LAYOUT_POSITION_SET, body: a };
}
function wu(e) {
  return {
    type: Ve.MATERIAL_ATTACHED,
    body: {
      id: e.id || Xt(),
      target_type: e.targetType,
      target_id: e.targetId,
      kind: e.kind,
      title: e.title ?? "Material",
      source: e.source || { type: "inline" },
      meta: e.meta || {}
    }
  };
}
function G$(e, t) {
  return { type: Ve.MATERIAL_UPDATED, body: { id: e, ...t } };
}
function Y$(e) {
  return { type: Ve.MATERIAL_DETACHED, body: { id: e } };
}
const U$ = {
  node: Ve.NODE_TYPE_REGISTERED,
  edge: Ve.EDGE_TYPE_REGISTERED,
  material: Ve.MATERIAL_TYPE_REGISTERED
}, q$ = {
  node: Ve.NODE_TYPE_UPDATED,
  edge: Ve.EDGE_TYPE_UPDATED,
  material: Ve.MATERIAL_TYPE_UPDATED
}, X$ = {
  node: Ve.NODE_TYPE_REMOVED,
  edge: Ve.EDGE_TYPE_REMOVED,
  material: Ve.MATERIAL_TYPE_REMOVED
};
function Io(e, t) {
  return { type: U$[e], body: t };
}
function W$(e, t, n) {
  return { type: q$[e], body: { id: t, ...n } };
}
function K$(e, t) {
  return { type: X$[e], body: { id: t } };
}
function j$(e, t) {
  const n = new Set(e);
  if (!n.size) return [];
  const o = /* @__PURE__ */ new Map();
  for (const s of t)
    if (n.has(s.source_id)) {
      const u = o.get(s.source_id) || [];
      u.push(s), o.set(s.source_id, u);
    }
  const r = new Set(t.map((s) => `${s.source_id}→${s.target_id}`)), a = [], i = /* @__PURE__ */ new Set();
  for (const s of t) {
    if (n.has(s.source_id) || !n.has(s.target_id)) continue;
    const u = /* @__PURE__ */ new Set([s.target_id]), c = [s.target_id];
    for (; c.length; ) {
      const l = c.shift();
      for (const d of o.get(l) || []) {
        if (n.has(d.target_id)) {
          u.has(d.target_id) || (u.add(d.target_id), c.push(d.target_id));
          continue;
        }
        const f = `${s.source_id}→${d.target_id}`;
        s.source_id !== d.target_id && (r.has(f) || i.has(f) || (i.add(f), a.push({ source_id: s.source_id, target_id: d.target_id, type: d.type })));
      }
    }
  }
  return a;
}
const Z$ = /* @__PURE__ */ new Set(["INPUT", "TEXTAREA", "SELECT"]);
function Ja(e) {
  const t = e?.tagName;
  return typeof t == "string" && Z$.has(t.toUpperCase());
}
function J$(e) {
  if (Ja(e.target)) return null;
  const t = !!(e.ctrlKey || e.metaKey);
  return t && (e.key === "z" || e.key === "Z") ? e.shiftKey ? "redo" : "undo" : t && (e.key === "y" || e.key === "Y") ? "redo" : t && (e.key === "d" || e.key === "D") ? "duplicate" : t && (e.key === "c" || e.key === "C") ? "copy" : t && (e.key === "v" || e.key === "V") ? "paste" : e.shiftKey && !t && e.key === "!" ? "fit" : e.shiftKey && !t && e.key === "@" ? "zoom-selection" : e.shiftKey && !t && e.key === "1" ? "fit" : e.shiftKey && !t && e.key === "2" ? "zoom-selection" : e.key === "Delete" || e.key === "Backspace" ? "delete" : e.key === "Escape" ? "escape" : null;
}
function Q$(e, t) {
  return Ja(e.target) || e.ctrlKey || e.metaKey || e.altKey ? null : e.key === "/" ? "search" : e.key.length === 1 && e.key !== " " ? t ? "rename" : "search" : (e.key === "Enter" || e.key === "F2") && t ? "rename" : null;
}
const e2 = { class: "kg-top" }, t2 = { class: "kg-breadcrumbs" }, n2 = ["title", "aria-label"], o2 = ["onClick"], r2 = {
  key: 0,
  class: "kg-actions"
}, i2 = ["value"], a2 = ["disabled"], s2 = ["disabled"], l2 = ["title", "aria-label"], u2 = { class: "kg-count" }, c2 = {
  key: 0,
  class: "kg-error"
}, d2 = { class: "kg-body" }, f2 = {
  key: 0,
  class: "kg-tree"
}, h2 = { class: "kg-tree-head" }, p2 = { class: "kg-muted" }, g2 = { class: "kg-tree-list" }, v2 = ["onClick", "onKeydown", "onDblclick"], m2 = ["aria-label", "onClick"], y2 = {
  key: 1,
  class: "kg-twist",
  "aria-hidden": "true"
}, b2 = { class: "kg-tree-name" }, w2 = {
  key: 2,
  class: "kg-tree-count"
}, k2 = {
  key: 0,
  class: "kg-tree-empty"
}, _2 = { class: "kg-canvas" }, x2 = {
  key: 0,
  class: "kg-guides",
  "aria-hidden": "true"
}, E2 = {
  key: 1,
  class: "kg-empty"
}, $2 = { class: "kg-empty-inner" }, S2 = { class: "kg-empty-text" }, C2 = {
  key: 2,
  class: "kg-hint"
}, N2 = {
  key: 2,
  class: "kg-panel"
}, M2 = {
  key: 2,
  class: "kg-panel-inner"
}, T2 = { class: "kg-panel-head" }, I2 = { class: "kg-agg-note" }, D2 = { class: "kg-agg-list" }, A2 = ["title", "onClick"], P2 = { class: "kg-agg-ends" }, O2 = { class: "kg-agg-type" }, R2 = {
  key: 4,
  class: "kg-panel-inner"
}, z2 = { class: "kg-panel-head" }, B2 = { class: "kg-stats" }, L2 = { class: "kg-section-head" }, V2 = {
  key: 0,
  class: "kg-materials"
}, H2 = {
  key: 0,
  class: "kg-empty-line"
}, F2 = /* @__PURE__ */ $e({
  __name: "GraphApp",
  setup(e) {
    const t = ih(), n = ne(() => t.value?.entryId || ""), o = ne(() => (t.value?.mode || "preview") === "full"), r = ne(() => o.value && !t.value?.readOnly && a.value !== null), a = le(null), i = le(Ka([])), s = le([]), u = le([]), c = le(!0), l = le(""), d = le(null), f = le(null), h = le(null), b = le(/* @__PURE__ */ new Set()), w = le(/* @__PURE__ */ new Set()), m = le(!0), p = le(!0), v = le(!1), g = le([]), k = le("TB"), P = le(null), F = le(!1), K = le(null), C = le(null), N = le(!1);
    let M;
    function B() {
      m.value = !m.value, N.value && m.value && (p.value = !1);
    }
    xe([d, f, v], () => {
      N.value && (d.value || f.value || v.value) && (m.value = !1);
    });
    const S = /* @__PURE__ */ new Map();
    let Q = 0, y = 0, O = Promise.resolve();
    const E = le(null);
    function X(_, $) {
      r.value && s.value.find((V) => V.id === _)?.type === "graphNode" && (E.value = { id: _, seed: $ });
    }
    function U() {
      E.value = null, C.value?.focus();
    }
    Ct(fd, {
      state: E,
      commit: (_, $) => {
        const V = $.trim(), J = i.value.nodeById.get(_)?.name;
        V && V !== J && Ae([qi(_, { name: V })]), U();
      },
      close: U
    }), xe(d, (_) => {
      E.value && E.value.id !== _ && (E.value = null);
    });
    const z = { graphNode: Rt(Gk), boundary: Rt(Uk), portalNode: Rt(jk) }, x = `graph-${n.value || "entry"}-${t.value?.mode || "preview"}`, { fitView: L, getSelectedNodes: te, setCenter: H, viewport: q, screenToFlowCoordinate: Y, getNodes: Z, onNodesInitialized: ee } = Oe(x), ae = () => `/api/v1/workspace/graphs/${n.value}`;
    function me(_) {
      const $ = _, V = $?.response?.data?.error ?? $?.data?.error;
      return typeof V == "string" && V ? V : _ instanceof Error && _.message && !/^request failed/i.test(_.message) && !/status code/i.test(_.message) ? _.message : "";
    }
    function ge(_, $) {
      const V = me(_);
      return V ? /nothing to undo/i.test(V) ? "Nothing to undo." : /nothing to redo/i.test(V) ? "Nothing to redo." : V : $;
    }
    const ke = ne(() => g.value.length ? g.value[g.value.length - 1] : void 0), re = ne(() => d.value && i.value.nodeById.get(d.value) || null), se = ne(() => f.value && (a.value?.edges || []).find((_) => _.id === f.value) || null), D = ne(() => a.value?.schema.node_types || []), T = ne(() => a.value?.schema.edge_types || []), R = ne(() => a.value?.schema.material_types || []), j = ne(() => Fn(D.value));
    ne(() => Fn(T.value));
    const W = ne(() => [...D.value].sort((_, $) => (_.title || _.id).localeCompare($.title || $.id))), ie = ne(() => a.value?.materials || []), ue = le(/* @__PURE__ */ new Set());
    xe(() => ie.value.length, (_, $) => {
      if (_ > ($ ?? 0)) {
        const V = ie.value[ie.value.length - 1];
        V && (ue.value = /* @__PURE__ */ new Set([...ue.value, V.id]));
      }
    });
    function ve(_) {
      const $ = new Set(ue.value);
      $.has(_) ? $.delete(_) : $.add(_), ue.value = $;
    }
    const pe = ne(() => ({
      nodes: s.value.filter((_) => _.type === "graphNode").length,
      edges: u.value.length
    })), be = ne(() => !!(re.value && (i.value.childrenByParent.get(re.value.id) || []).length)), Ee = ne(() => {
      const _ = [];
      function $(V, J) {
        for (const we of i.value.childrenByParent.get(V) || []) {
          const _e = i.value.childrenByParent.get(we.id) || [], Re = w.value.has(we.id);
          _.push({ node: we, depth: J, childCount: _e.length, expanded: Re }), Re && $(we.id, J + 1);
        }
      }
      return $("", 0), _;
    }), Ne = ne(() => g.value.map((_) => ({ id: _, name: i.value.nodeById.get(_)?.name || _ })));
    function lt(_) {
      return String(j.value.get(_)?.color || "var(--p-primary-color)");
    }
    function Ue() {
      return D.value[0]?.id || "note";
    }
    function _n() {
      return T.value[0]?.id || "relates-to";
    }
    function Er(_) {
      return R.value.find(($) => !$.targets || $.targets.includes(_))?.id || "note";
    }
    let tn = !1;
    ee(() => {
      tn && (tn = !1, po());
    });
    function xn(_ = !1) {
      if (!a.value) return;
      const $ = W_(a.value, b.value, ke.value);
      i.value = $.flat, s.value = $.flowNodes, u.value = $.flowEdges, _ && (tn = !0, s.value.length || (tn = !1));
    }
    function $r(_, $ = !1, V = {}) {
      const J = B$(_, S, V.committed === !0);
      a.value = {
        ...J,
        nodes: J.nodes || [],
        edges: J.edges || [],
        materials: J.materials || [],
        schema: {
          node_types: J.schema?.node_types || [],
          edge_types: J.schema?.edge_types || [],
          material_types: J.schema?.material_types || []
        },
        layout: { positions: J.layout?.positions || {}, viewport: J.layout?.viewport },
        settings: J.settings || {},
        can_undo: J.can_undo === !0,
        can_redo: J.can_redo === !0
      }, V.preserveCanvas || xn($);
    }
    async function Sr(_ = !1, $ = !1) {
      if (!n.value) {
        l.value = "entry id required", c.value = !1;
        return;
      }
      const V = ++y;
      try {
        const { data: J } = await Ao.get(ae());
        if (!J.success) throw new Error(J.error || "failed to load graph");
        if (V !== y) return;
        $r(J.graph, _, { committed: $ }), l.value = "";
      } catch (J) {
        if (V !== y) return;
        l.value = ge(J, "Couldn’t load the graph.");
      } finally {
        V === y && (c.value = !1);
      }
    }
    function Qa(_) {
      const $ = O.then(_);
      return O = $.catch((V) => {
        l.value = ge(V, "Couldn’t save the change.");
      }), $;
    }
    async function Nd(_, $ = !1, V = {}) {
      if (_.length)
        try {
          const { data: J } = await Ao.post(`${ae()}/apply`, { commands: _ });
          if (!J.success) throw new Error(J.error || "apply failed");
          $r(J.graph, $, { preserveCanvas: V.preserveCanvas }), l.value = "";
        } catch (J) {
          V.layoutRevision !== void 0 && (R$(S, V.layoutRevision), await Sr(!1)), l.value = ge(J, "Couldn’t save the change.");
        }
    }
    function Ae(_, $ = !1, V = {}) {
      return !r.value || !_.length ? Promise.resolve() : Qa(() => Nd(_, $, V));
    }
    async function Md(_) {
      if (a.value && !(_ === "undo" && !a.value.can_undo) && !(_ === "redo" && !a.value.can_redo))
        try {
          S.clear();
          const { data: $ } = await Ao.post(`${ae()}/${_}`, {});
          if (!$.success) throw new Error($.error || `${_} failed`);
          $r($.graph), l.value = "";
        } catch ($) {
          l.value = ge($, _ === "undo" ? "Nothing to undo." : "Nothing to redo.");
        }
    }
    function uo(_) {
      return r.value ? Qa(() => Md(_)) : Promise.resolve();
    }
    function Td(_) {
      re.value && Ae([qi(re.value.id, _)]);
    }
    function Id(_) {
      se.value && Ae([xa(se.value.id, _)]);
    }
    function Dd() {
      se.value && Ae([H$(se.value)]);
    }
    function En(_ = Ue(), $ = ke.value, V) {
      const J = Xt(), we = [To({ id: J, type: _, name: "New node", parentId: $ })];
      return V && we.push(Vt(J, Math.round(V.x), Math.round(V.y))), Ae(we), d.value = J, f.value = null, v.value = !1, p.value = !0, J;
    }
    const es = le(null);
    function Ad() {
      const _ = te.value.length ? te.value : d.value ? Z.value.filter((we) => we.id === d.value) : [];
      if (!_.length) return;
      const $ = new Set(_.map((we) => String(we.id))), V = _.flatMap((we) => {
        const _e = i.value.nodeById.get(String(we.id));
        return _e ? [{ id: _e.id, type: _e.type, name: _e.name, properties: _e.properties, tags: _e.tags, x: we.position.x, y: we.position.y }] : [];
      }), J = (a.value?.edges || []).filter((we) => $.has(we.source_id) && $.has(we.target_id)).map((we) => ({ type: we.type, source_id: we.source_id, target_id: we.target_id, label: we.label, properties: we.properties }));
      es.value = { nodes: V, edges: J };
    }
    function Pd() {
      const _ = es.value;
      if (!_ || !_.nodes.length) return;
      const $ = D$(_, Xt), V = [];
      for (const J of $.nodes)
        V.push(To({ id: J.id, type: J.type, name: J.name, parentId: ke.value, properties: J.properties, tags: J.tags })), V.push(Vt(J.id, Math.round(J.x), Math.round(J.y)));
      for (const J of $.edges) V.push(ln({ type: J.type, sourceId: J.source_id, targetId: J.target_id, label: J.label, properties: J.properties }));
      Ae(V), $.nodes.length === 1 && (d.value = $.nodes[0].id);
    }
    function Od(_) {
      const $ = te.value.filter((J) => J.dimensions?.width).map($n), V = T$($, _);
      V.length && Ae(V.map((J) => Vt(J.id, J.x, J.y)));
    }
    function ts(_) {
      const $ = te.value.filter((J) => J.dimensions?.width).map($n), V = I$($, _);
      V.length && Ae(V.map((J) => Vt(J.id, J.x, J.y)));
    }
    function Rd() {
      const _ = d.value ? i.value.nodeById.get(d.value) : null;
      if (!_) return;
      const $ = Xt(), V = Z.value.find((_e) => _e.id === _.id), J = V ? V.position : { x: 0, y: 0 }, we = [
        To({ id: $, type: _.type, name: _.name, parentId: _.parent_id ?? void 0, properties: _.properties, tags: _.tags }),
        Vt($, Math.round(J.x + 32), Math.round(J.y + 32))
      ];
      for (const _e of a.value?.edges || [])
        _e.target_id === _.id && we.push(ln({ type: _e.type, sourceId: _e.source_id, targetId: $, label: _e.label, properties: _e.properties }));
      Ae(we), d.value = $;
    }
    function zd(_) {
      const $ = Xt();
      Ae([To({ id: $, type: Ue(), name: "New child", parentId: _ })]);
    }
    function co(_) {
      if (_ = _.filter((J) => !L_(J)), !_.length) return;
      const $ = a.value?.edges || [], V = j$(_, $.map((J) => ({ id: String(J.id), type: String(J.type), source_id: String(J.source_id), target_id: String(J.target_id) })));
      Ae([
        ...V.map((J) => ln({ type: J.type, sourceId: J.source_id, targetId: J.target_id })),
        ..._.map((J) => V$(J))
      ]);
    }
    function Cr() {
      const _ = te.value;
      if (_.length > 1) {
        d.value = null, co(_.map(($) => String($.id)));
        return;
      }
      if (se.value) {
        const $ = se.value.id;
        f.value = null, Ae([F$($)]);
      } else if (re.value) {
        const $ = re.value.id;
        d.value = null, co([$]);
      }
    }
    function fo(_, $) {
      Ae(_.map((V) => L$(V, $)));
    }
    let Nr = null, Mr = !1;
    function Bd(_) {
      r.value && (F.value = !0, Mr = !1, Nr = _?.nodeId ?? null);
    }
    function Ld(_) {
      if (!r.value || !_.source || !_.target || _.source === _.target) return;
      Mr = !0;
      const $ = {};
      _.sourceHandle && ($.sourceHandle = _.sourceHandle), _.targetHandle && ($.targetHandle = _.targetHandle), Ae([ln({ type: _n(), sourceId: _.source, targetId: _.target, properties: $ })]);
    }
    function Vd(_) {
      F.value = !1;
      const $ = Nr;
      if (Nr = null, Mr || !$ || !(_ instanceof MouseEvent)) return;
      const V = Y({ x: _.clientX, y: _.clientY }), J = Z.value.map((Re) => ({
        id: Re.id,
        x: Re.computedPosition?.x ?? Re.position.x,
        y: Re.computedPosition?.y ?? Re.position.y,
        width: Re.dimensions?.width ?? 0,
        height: Re.dimensions?.height ?? 0
      })), we = M$($, V, J);
      if (we) {
        Ae([ln({ type: _n(), sourceId: $, targetId: we, properties: {} })]);
        return;
      }
      const _e = N$({
        nodeTypes: W.value,
        addConnected: (Re) => {
          const bt = En(Re ?? Ue(), ke.value, V);
          Ae([ln({ type: _n(), sourceId: $, targetId: bt, properties: {} })]);
        }
      });
      is = Date.now() + 300, P.value = { x: _.clientX, y: _.clientY, items: _e };
    }
    function Hd(_, $) {
      const V = i.value.nodeById.get(_);
      V && Ae([qi(_, { properties: { ...V.properties || {}, width: $ } })]);
    }
    Ct(dd, Hd);
    const ho = le([]);
    function $n(_) {
      return { id: String(_.id), x: _.position.x, y: _.position.y, width: Number(_.dimensions?.width || 0), height: Number(_.dimensions?.height || 0) };
    }
    function ns(_) {
      return Z.value.filter(($) => $.id !== _ && $.dimensions?.width).map($n);
    }
    function Fd(_) {
      const $ = !(_.nodes?.length > 1), V = _.event;
      if (!$ || V?.ctrlKey) {
        ho.value = [];
        return;
      }
      ho.value = bu($n(_.node), ns(String(_.node.id)), 6).guides;
    }
    function Gd(_) {
      if (!r.value) return;
      ho.value = [];
      const $ = _.nodes?.length ? _.nodes : [_.node], V = _.event;
      if ($.length === 1 && $[0] && !V?.ctrlKey) {
        const _e = bu($n($[0]), ns(String($[0].id)), 6);
        $[0].position = { x: _e.x, y: _e.y };
      }
      const J = $.filter(Boolean).map((_e) => Vt(
        String(_e.id),
        _e.position.x,
        _e.position.y,
        Number(_e.dimensions?.width || 0) || void 0,
        Number(_e.dimensions?.height || 0) || void 0
      )), we = ++Q;
      O$(S, J, we), Ae(J, !1, { layoutRevision: we, preserveCanvas: !0 });
    }
    function Tr(_, $, V) {
      Ae([wu({ targetType: _, targetId: V, kind: $ })]);
    }
    function os(_, $, V) {
      Ae([wu({ targetType: _, targetId: V, kind: $, title: "Component ref", source: { type: "component" } })]);
    }
    function Ir(_) {
      Ae([G$(_.id, _.patch)]);
    }
    function Dr(_) {
      Ae([Y$(_)]);
    }
    function Yd(_) {
      const V = { id: `${_}-${Math.floor(Math.random() * 1e4)}`, title: _ === "node" ? "Node" : _ === "edge" ? "Relation" : "Note" };
      _ === "node" && (V.color = "var(--p-primary-color)"), _ === "edge" && (V.color = "var(--p-text-muted-color)", V.stroke = "var(--p-text-muted-color)"), _ === "material" && (V.targets = ["graph", "node", "edge"], V.display = "panel"), Ae([Io(_, V)]);
    }
    function Ud(_) {
      Ae([W$(_.kind, _.id, _.patch)]);
    }
    function qd(_) {
      Ae([K$(_.kind, _.id)]);
    }
    function Xd() {
      const _ = [], $ = [
        ["note", "Note", "var(--p-text-muted-color)"],
        ["idea", "Idea", "color-mix(in srgb, var(--p-primary-color) 85%, var(--p-text-color))"],
        ["topic", "Topic", "color-mix(in srgb, var(--p-primary-color) 70%, var(--p-text-color))"],
        ["task", "Task", "var(--p-primary-color)"],
        ["question", "Question", "color-mix(in srgb, var(--p-primary-color) 40%, var(--p-text-color))"],
        ["decision", "Decision", "color-mix(in srgb, var(--p-primary-color) 45%, var(--p-text-color))"],
        ["person", "Person", "color-mix(in srgb, var(--p-primary-color) 55%, var(--p-text-color))"],
        ["resource", "Resource", "color-mix(in srgb, var(--p-primary-color) 65%, var(--p-text-color))"],
        ["goal", "Goal", "color-mix(in srgb, var(--p-primary-color) 90%, var(--p-text-color))"]
      ];
      for (const [we, _e, Re] of $) _.push(Io("node", { id: we, title: _e, color: Re }));
      const V = [
        ["relates-to", "Relates To", "var(--p-text-muted-color)", !1],
        ["leads-to", "Leads To", "color-mix(in srgb, var(--p-primary-color) 70%, var(--p-text-color))", !1],
        ["depends-on", "Depends On", "color-mix(in srgb, var(--p-primary-color) 85%, var(--p-text-color))", !1],
        ["supports", "Supports", "var(--p-primary-color)", !1],
        ["blocks", "Blocks", "color-mix(in srgb, var(--p-primary-color) 60%, var(--p-text-color))", !1],
        ["part-of", "Part Of", "color-mix(in srgb, var(--p-primary-color) 55%, var(--p-text-color))", !1]
      ];
      for (const [we, _e, Re, bt] of V) _.push(Io("edge", { id: we, title: _e, color: Re, stroke: Re, animated: bt }));
      const J = [
        ["note", "Note", "panel"],
        ["reference", "Reference", "badge"],
        ["constraint", "Constraint", "badge"],
        ["metric", "Metric", "badge"]
      ];
      for (const [we, _e, Re] of J) _.push(Io("material", { id: we, title: _e, display: Re, targets: ["graph", "node", "edge"] }));
      Ae(_);
    }
    function Wd(_) {
      const $ = _.node.data?.portalTarget;
      if ($) {
        nn($);
        return;
      }
      d.value = _.node.id, f.value = null, h.value = null, v.value = !1, p.value = !0;
    }
    function Kd(_) {
      const $ = _.edge.data;
      if ($?.aggregated) {
        h.value = { label: _.edge.label || "", count: $.count || ($.members?.length ?? 0), members: $.members || [] }, f.value = null, d.value = null, v.value = !1, p.value = !0;
        return;
      }
      h.value = null, f.value = _.edge.id, d.value = null, v.value = !1, p.value = !0;
    }
    const rs = ne(() => {
      const _ = q.value;
      return ho.value.map(($) => $.axis === "x" ? { key: `x${$.at}`, left: $.at * _.zoom + _.x, top: $.from * _.zoom + _.y, length: ($.to - $.from) * _.zoom, vertical: !0 } : { key: `y${$.at}`, left: $.from * _.zoom + _.x, top: $.at * _.zoom + _.y, length: ($.to - $.from) * _.zoom, vertical: !1 });
    });
    let is = 0;
    function jd() {
      d.value = null, f.value = null, h.value = null, Date.now() >= is && (P.value = null);
    }
    function Zd(_) {
      const $ = _.node.data?.portalTarget;
      if ($) {
        nn($);
        return;
      }
      (i.value.childrenByParent.get(_.node.id) || []).length ? Sn(_.node.id) : X(_.node.id, null);
    }
    function Jd(_) {
      if (_.edge.data?.aggregated) {
        const we = [_.edge.source, _.edge.target].find((Re) => String(Re).startsWith("portal:"));
        if (we) {
          nn(String(we).slice(7));
          return;
        }
        const _e = [_.edge.source, _.edge.target].find((Re) => (i.value.childrenByParent.get(String(Re)) || []).length);
        _e && Sn(String(_e));
        return;
      }
      const $ = (a.value?.edges || []).find((we) => we.id === _.edge.id);
      if (!$) return;
      const V = String($.properties?.routing || "default"), J = Go[(Go.indexOf(V) + 1) % Go.length];
      Ae([xa($.id, { properties: { ...$.properties || {}, routing: J } })]);
    }
    function as(_) {
      const $ = new Set(b.value);
      $.has(_) ? $.delete(_) : $.add(_), b.value = $, xn();
    }
    function Qd(_) {
      const $ = new Set(w.value);
      $.has(_) ? $.delete(_) : $.add(_), w.value = $;
    }
    function Sn(_) {
      const $ = g.value.indexOf(_);
      g.value = $ >= 0 ? g.value.slice(0, $ + 1) : [...g.value, _], b.value = /* @__PURE__ */ new Set(), d.value = null, f.value = null, h.value = null, xn(!0);
    }
    function Ar(_) {
      g.value = _ < 0 ? [] : g.value.slice(0, _ + 1), b.value = /* @__PURE__ */ new Set(), d.value = null, f.value = null, h.value = null, xn(!0);
    }
    function ss() {
      g.value.length && Ar(g.value.length - 2);
    }
    function nn(_) {
      const $ = Sd(i.value.nodeById, _);
      !s.value.some((J) => J.id === _) && JSON.stringify($) !== JSON.stringify(g.value) && (g.value = $, b.value = /* @__PURE__ */ new Set(), xn()), d.value = _, f.value = null, v.value = !1, p.value = !0, Ke(async () => {
        const J = s.value.find((bt) => bt.id === _);
        if (!J) return;
        const we = Number(J.dimensions?.width || J.data?.width || 210), _e = Number(J.dimensions?.height || 104), Re = Math.max(q.value.zoom || 1, 0.85);
        try {
          await H(J.position.x + we / 2, J.position.y + _e / 2, { zoom: Re, duration: 250 });
        } catch (bt) {
          l.value = ge(bt, "Couldn’t center this node. Try Fit view.");
        }
      });
    }
    function Pr(_) {
      const $ = _ instanceof MouseEvent ? _ : _.touches[0];
      return { x: $.clientX, y: $.clientY };
    }
    function ef(_) {
      if (!r.value || (_.event.preventDefault(), !a.value)) return;
      const $ = _.node.id, V = _.node.data?.portalTarget;
      if (V) {
        const { x: ut, y: Rr } = Pr(_.event);
        P.value = { x: ut, y: Rr, items: [{ label: "Open real node", action: () => nn(V) }] };
        return;
      }
      const J = [], we = te.value, _e = we.length > 1 ? we.map((ut) => String(ut.id)) : null;
      if (_e) {
        const ut = [
          ["Align left", "left"],
          ["Align centers", "center-h"],
          ["Align right", "right"],
          ["Align top", "top"],
          ["Align middles", "center-v"],
          ["Align bottom", "bottom"]
        ];
        for (const [Cn, df] of ut) J.push({ label: Cn, action: () => Od(df) });
        _e.length > 2 && (J.push({ label: "Distribute horizontally", action: () => ts("h") }), J.push({ label: "Distribute vertically", action: () => ts("v") }));
        for (const Cn of i.value.childrenByParent.get(ke.value || "") || [])
          _e.includes(Cn.id) || J.push({ label: `Move into "${Cn.name}"`, action: () => fo(_e, Cn.id) });
        ke.value && J.push({ label: "Move to root", action: () => fo(_e, null) }), J.push({ label: `Delete ${_e.length} nodes`, danger: !0, action: () => {
          d.value = null, co(_e);
        } });
        const { x: Rr, y: cf } = Pr(_.event);
        P.value = { x: Rr, y: cf, items: J };
        return;
      }
      (i.value.childrenByParent.get($) || []).length > 0 && (J.push({ label: "Drill into", action: () => Sn($) }), J.push({ label: b.value.has($) ? "Collapse" : "Expand as boundary", action: () => as($) })), J.push({ label: "Add child", action: () => zd($) });
      const bt = (i.value.childrenByParent.get(ke.value || "") || []).filter((ut) => ut.id !== $);
      for (const ut of bt.slice(0, 8)) J.push({ label: `Move into "${ut.name}"`, action: () => fo([$], ut.id) });
      i.value.nodeById.get($)?.parent_id && J.push({ label: "Move to root", action: () => fo([$], null) }), J.push({ label: "Delete", danger: !0, action: () => {
        d.value = null, co([$]);
      } });
      const { x: lf, y: uf } = Pr(_.event);
      P.value = { x: lf, y: uf, items: J };
    }
    function tf(_) {
      if (!a.value || !r.value) return;
      const $ = Y({ x: _.clientX, y: _.clientY }), V = En(Ue(), ke.value, $);
      X(V, null);
    }
    function nf(_) {
      if (!r.value || (_.preventDefault(), !a.value)) return;
      const $ = Y({ x: _.clientX, y: _.clientY }), V = C$({
        viewRoot: ke.value,
        nodeTypes: W.value,
        navigateUp: () => ss(),
        addNode: (J) => En(J ?? Ue(), ke.value, $)
      });
      P.value = { x: _.clientX, y: _.clientY, items: V };
    }
    async function ls() {
      if (!r.value || !a.value) return;
      const _ = K_(a.value, k.value, ke.value), $ = Object.entries(_).map(([V, J]) => Vt(V, J.x, J.y));
      $.length && await Ae($, !0);
    }
    function of() {
      k.value = k.value === "TB" ? "LR" : "TB", ls();
    }
    async function po(_ = { padding: 0.16, duration: 200 }) {
      try {
        await L(_);
      } catch ($) {
        l.value = ge($, "Couldn’t fit the graph. Try Fit view again.");
      }
    }
    function je(_) {
      _.preventDefault(), _.stopPropagation();
    }
    function rf(_) {
      if (!o.value) return;
      if (Ja(_.target)) {
        if (_.key === "Escape") {
          const J = _.target;
          typeof J.blur == "function" && J.blur(), je(_);
        }
        return;
      }
      const $ = Q$({ key: _.key, ctrlKey: _.ctrlKey, metaKey: _.metaKey, altKey: _.altKey, target: _.target }, !!d.value);
      if ($ === "rename" && r.value && d.value) {
        je(_), X(d.value, _.key.length === 1 ? _.key : null);
        return;
      }
      if ($ === "search") {
        je(_), K.value?.focus(_.key === "/" ? "" : _.key);
        return;
      }
      const V = J$({ key: _.key, ctrlKey: _.ctrlKey, metaKey: _.metaKey, shiftKey: _.shiftKey, target: _.target });
      !r.value && ["delete", "undo", "redo", "duplicate", "paste"].includes(V || "") || (V === "delete" ? (je(_), Cr()) : V === "undo" ? (je(_), uo("undo")) : V === "redo" ? (je(_), uo("redo")) : V === "duplicate" ? (je(_), Rd()) : V === "copy" ? Ad() : V === "paste" ? (je(_), Pd()) : V === "fit" ? (je(_), po()) : V === "zoom-selection" ? d.value && (je(_), po({ nodes: [d.value], padding: 0.4, duration: 200, maxZoom: 1.2 })) : V === "escape" && (P.value ? (je(_), P.value = null) : d.value || f.value ? (je(_), d.value = null, f.value = null) : ke.value && (je(_), ss())));
    }
    function af(_) {
      const $ = _.target.value;
      $ && (En($), _.target.value = "");
    }
    function sf() {
      v.value = !v.value, v.value && (p.value = !0);
    }
    let Or = [];
    return it(async () => {
      M = new ResizeObserver(([$]) => {
        if (!$) return;
        const V = $.contentRect.width <= 900;
        V && !N.value && (m.value = !1, p.value = !1), N.value = V;
      }), C.value && M.observe(C.value), await Sr(!0);
      const _ = a.value?.thread_id;
      if (_)
        try {
          Or.push(Eu(P$(_, A$), () => {
            Sr(!1, !0);
          }));
        } catch {
          l.value = "Live updates are unavailable. Reload to read the latest graph.";
        }
    }), oo(() => {
      M?.disconnect();
      const _ = [];
      for (const $ of Or)
        try {
          $();
        } catch (V) {
          _.push(V);
        }
      if (Or = [], _.length) throw new AggregateError(_, "Couldn’t close live updates.");
    }), (_, $) => (A(), G("div", {
      ref_key: "rootEl",
      ref: C,
      class: Me(["kg", { "kg--preview": !o.value, "kg-connecting": F.value }]),
      tabindex: "0",
      onKeydown: rf
    }, [
      I("div", e2, [
        I("div", t2, [
          o.value ? (A(), G("button", {
            key: 0,
            class: "kg-icon-btn",
            title: m.value ? "Hide structure" : "Show structure",
            "aria-label": m.value ? "Hide structure" : "Show structure",
            onClick: B
          }, [
            ze(oe(on), {
              icon: "tabler:layout-sidebar",
              "aria-hidden": "true"
            })
          ], 8, n2)) : fe("", !0),
          I("button", {
            class: Me(["kg-crumb", { active: !Ne.value.length }]),
            onClick: $[0] || ($[0] = (V) => Ar(-1))
          }, "Graph", 2),
          (A(!0), G(ye, null, Se(Ne.value, (V, J) => (A(), G(ye, {
            key: V.id
          }, [
            $[26] || ($[26] = I("span", { class: "kg-sep" }, "/", -1)),
            I("button", {
              class: Me(["kg-crumb", { active: J === Ne.value.length - 1 }]),
              onClick: (we) => Ar(J)
            }, he(V.name), 11, o2)
          ], 64))), 128))
        ]),
        o.value ? (A(), G("div", r2, [
          ze(E$, {
            ref_key: "searchRef",
            ref: K,
            nodes: i.value.nodes,
            "node-by-id": i.value.nodeById,
            "type-defs": j.value,
            onPick: nn
          }, null, 8, ["nodes", "node-by-id", "type-defs"]),
          $[28] || ($[28] = I("span", { class: "kg-vsep" }, null, -1)),
          r.value ? (A(), G("select", {
            key: 0,
            class: "kg-sel",
            onChange: af
          }, [
            $[27] || ($[27] = I("option", {
              value: "",
              disabled: "",
              selected: ""
            }, "+ Node", -1)),
            (A(!0), G(ye, null, Se(W.value, (V) => (A(), G("option", {
              key: V.id,
              value: V.id
            }, he(V.title || V.id), 9, i2))), 128))
          ], 32)) : fe("", !0),
          $[29] || ($[29] = I("span", { class: "kg-vsep" }, null, -1)),
          r.value ? (A(), G("button", {
            key: 1,
            class: "kg-icon-btn",
            disabled: !a.value?.can_undo,
            title: "Undo",
            "aria-label": "Undo",
            onClick: $[1] || ($[1] = (V) => uo("undo"))
          }, [
            ze(oe(on), {
              icon: "tabler:arrow-back-up",
              "aria-hidden": "true"
            })
          ], 8, a2)) : fe("", !0),
          r.value ? (A(), G("button", {
            key: 2,
            class: "kg-icon-btn",
            disabled: !a.value?.can_redo,
            title: "Redo",
            "aria-label": "Redo",
            onClick: $[2] || ($[2] = (V) => uo("redo"))
          }, [
            ze(oe(on), {
              icon: "tabler:arrow-forward-up",
              "aria-hidden": "true"
            })
          ], 8, s2)) : fe("", !0),
          $[30] || ($[30] = I("span", { class: "kg-vsep" }, null, -1)),
          I("button", {
            class: "kg-icon-btn",
            title: "Fit view",
            "aria-label": "Fit view",
            onClick: $[3] || ($[3] = (V) => po())
          }, [
            ze(oe(on), {
              icon: "tabler:arrows-maximize",
              "aria-hidden": "true"
            })
          ]),
          r.value ? (A(), G("button", {
            key: 3,
            class: "kg-icon-btn",
            title: "Arrange nodes",
            "aria-label": "Auto layout",
            onClick: ls
          }, [
            ze(oe(on), {
              icon: "tabler:layout-distribute-horizontal",
              "aria-hidden": "true"
            })
          ])) : fe("", !0),
          r.value ? (A(), G("button", {
            key: 4,
            class: "kg-icon-btn",
            title: k.value === "TB" ? "Top→Bottom" : "Left→Right",
            "aria-label": k.value === "TB" ? "Use left-to-right layout" : "Use top-to-bottom layout",
            onClick: of
          }, [
            ze(oe(on), {
              icon: k.value === "TB" ? "tabler:arrows-vertical" : "tabler:arrows-horizontal",
              "aria-hidden": "true"
            }, null, 8, ["icon"])
          ], 8, l2)) : fe("", !0),
          $[31] || ($[31] = I("span", { class: "kg-vsep" }, null, -1)),
          r.value ? (A(), G("button", {
            key: 5,
            class: Me(["kg-btn kg-btn--ghost", { active: v.value }]),
            onClick: sf
          }, "Types", 2)) : fe("", !0),
          I("span", u2, he(pe.value.nodes) + " nodes · " + he(pe.value.edges) + " edges", 1)
        ])) : fe("", !0)
      ]),
      l.value ? (A(), G("div", c2, [
        I("span", null, he(l.value), 1),
        I("button", {
          class: "kg-error-x",
          title: "Dismiss",
          "aria-label": "Dismiss error",
          onClick: $[4] || ($[4] = (V) => l.value = "")
        }, "×")
      ])) : fe("", !0),
      I("div", d2, [
        o.value && m.value ? (A(), G("aside", f2, [
          I("div", h2, [
            $[32] || ($[32] = I("span", null, "Structure", -1)),
            I("span", p2, he(i.value.nodes.length), 1)
          ]),
          I("div", g2, [
            (A(!0), G(ye, null, Se(Ee.value, (V) => (A(), G("div", {
              key: V.node.id,
              class: Me(["kg-tree-row", { active: d.value === V.node.id }]),
              role: "button",
              tabindex: "0",
              style: Pe({ paddingLeft: `${8 + V.depth * 12}px` }),
              onClick: (J) => {
                d.value = V.node.id, f.value = null, v.value = !1, p.value = !0;
              },
              onKeydown: [
                Ze((J) => {
                  d.value = V.node.id, f.value = null, v.value = !1, p.value = !0;
                }, ["enter"]),
                Ze(qe((J) => {
                  d.value = V.node.id, f.value = null, v.value = !1, p.value = !0;
                }, ["prevent"]), ["space"])
              ],
              onDblclick: (J) => Sn(V.node.id)
            }, [
              V.childCount ? (A(), G("button", {
                key: 0,
                class: "kg-twist",
                "aria-label": V.expanded ? `Collapse ${V.node.name}` : `Expand ${V.node.name}`,
                onClick: qe((J) => Qd(V.node.id), ["stop"])
              }, he(V.expanded ? "▾" : "▸"), 9, m2)) : (A(), G("span", y2)),
              I("span", {
                class: "kg-tree-dot",
                style: Pe({ background: lt(V.node.type) })
              }, null, 4),
              I("span", b2, he(V.node.name), 1),
              V.childCount ? (A(), G("span", w2, he(V.childCount), 1)) : fe("", !0)
            ], 46, v2))), 128)),
            Ee.value.length ? fe("", !0) : (A(), G("div", k2, "No nodes"))
          ])
        ])) : fe("", !0),
        I("main", _2, [
          ze(oe(f0), {
            id: x,
            nodes: s.value,
            "onUpdate:nodes": $[5] || ($[5] = (V) => s.value = V),
            edges: u.value,
            "onUpdate:edges": $[6] || ($[6] = (V) => u.value = V),
            "node-types": z,
            "nodes-draggable": r.value,
            "nodes-connectable": r.value,
            "elements-selectable": o.value,
            "selection-key-code": "Shift",
            "multi-selection-key-code": "Shift",
            "delete-key-code": null,
            "zoom-on-double-click": !1,
            "snap-to-grid": !0,
            "snap-grid": [10, 10],
            "min-zoom": 0.1,
            "max-zoom": 2.5,
            "connection-radius": 40,
            class: Me(["kg-flow", { "kg-connect-live": F.value }]),
            onPaneDoubleClick: tf,
            onConnectStart: Bd,
            onConnectEnd: Vd,
            onNodeClick: Wd,
            onNodeDoubleClick: Zd,
            onEdgeClick: Kd,
            onEdgeDoubleClick: Jd,
            onPaneClick: jd,
            onConnect: Ld,
            onNodeDrag: Fd,
            onNodeDragStop: Gd,
            onNodeContextMenu: ef,
            onPaneContextMenu: nf
          }, {
            default: ft(() => [
              ze(oe(w0), {
                pattern: "dots",
                gap: 22,
                size: 1,
                "pattern-color": "color-mix(in srgb, var(--kg-muted) 30%, transparent)"
              }),
              o.value ? (A(), Ie(oe(Z0), {
                key: 0,
                position: "bottom-left",
                "show-interactive": !1
              })) : fe("", !0),
              o.value ? (A(), Ie(oe(Ak), {
                key: 1,
                position: "bottom-right",
                pannable: !0,
                zoomable: !0
              })) : fe("", !0)
            ]),
            _: 1
          }, 8, ["nodes", "edges", "nodes-draggable", "nodes-connectable", "elements-selectable", "class"]),
          rs.value.length ? (A(), G("div", x2, [
            (A(!0), G(ye, null, Se(rs.value, (V) => (A(), G("div", {
              key: V.key,
              class: Me(["kg-guide", { vertical: V.vertical }]),
              style: Pe(V.vertical ? { left: V.left + "px", top: V.top + "px", height: V.length + "px" } : { left: V.left + "px", top: V.top + "px", width: V.length + "px" })
            }, null, 6))), 128))
          ])) : fe("", !0),
          a.value && !c.value && !l.value && !s.value.length ? (A(), G("div", E2, [
            I("div", $2, [
              I("p", S2, he(ke.value ? "No children here" : "Empty graph"), 1),
              r.value ? (A(), G("button", {
                key: 0,
                class: "kg-btn",
                onClick: $[7] || ($[7] = (V) => En())
              }, "Add a node")) : fe("", !0)
            ])
          ])) : fe("", !0),
          r.value ? (A(), G("span", C2, "Drag a port to connect · / to find")) : fe("", !0)
        ]),
        o.value && !p.value ? (A(), G("button", {
          key: 1,
          class: "kg-panel-rail",
          title: "Show inspector",
          "aria-label": "Show inspector",
          onClick: $[8] || ($[8] = (V) => p.value = !0)
        }, "‹")) : o.value ? (A(), G("aside", N2, [
          v.value ? (A(), Ie(h$, {
            key: 0,
            "node-types": D.value,
            "edge-types": T.value,
            "material-types": R.value,
            onTypeAdd: Yd,
            onTypeUpdate: Ud,
            onTypeRemove: qd,
            onSeed: Xd,
            onCollapse: $[9] || ($[9] = (V) => p.value = !1),
            onClose: $[10] || ($[10] = (V) => v.value = !1)
          }, null, 8, ["node-types", "edge-types", "material-types"])) : re.value ? (A(), Ie(cE, {
            key: 1,
            "read-only": !r.value,
            node: re.value,
            "node-types": D.value,
            "material-types": R.value,
            materials: re.value.materials || [],
            "has-children": be.value,
            expanded: b.value.has(re.value.id),
            onUpdate: Td,
            onDelete: Cr,
            onMaterialAdd: $[11] || ($[11] = (V) => re.value && Tr("node", V, re.value.id)),
            onComponentRefAdd: $[12] || ($[12] = (V) => re.value && os("node", V, re.value.id)),
            onMaterialUpdate: Ir,
            onMaterialRemove: Dr,
            onDrill: $[13] || ($[13] = () => re.value && Sn(re.value.id)),
            onToggleExpand: $[14] || ($[14] = () => re.value && as(re.value.id)),
            onCollapse: $[15] || ($[15] = (V) => p.value = !1),
            onClose: $[16] || ($[16] = (V) => d.value = null)
          }, null, 8, ["read-only", "node", "node-types", "material-types", "materials", "has-children", "expanded"])) : h.value ? (A(), G("div", M2, [
            I("div", T2, [
              $[33] || ($[33] = I("span", { class: "kg-kicker" }, "Virtual edge", -1)),
              I("button", {
                class: "kg-x kg-x--chev",
                title: "Hide inspector",
                "aria-label": "Hide inspector",
                onClick: $[17] || ($[17] = (V) => p.value = !1)
              }, "»"),
              I("button", {
                class: "kg-x",
                title: "Close",
                "aria-label": "Close",
                onClick: $[18] || ($[18] = (V) => h.value = null)
              }, "×")
            ]),
            I("div", I2, "Summarizes " + he(h.value.count) + " relation" + he(h.value.count === 1 ? "" : "s") + " hidden by the current layer. Double-click the edge to jump to where they live.", 1),
            $[35] || ($[35] = I("div", { class: "kg-section-head" }, [
              I("span", null, "Underlying relations")
            ], -1)),
            I("div", D2, [
              (A(!0), G(ye, null, Se(h.value.members, (V) => (A(), G("button", {
                key: V.id,
                class: "kg-agg-row",
                title: "Jump to " + V.source,
                onClick: (J) => nn(V.sourceId)
              }, [
                I("span", P2, [
                  zt(he(V.source) + " ", 1),
                  $[34] || ($[34] = I("span", { class: "kg-agg-arrow" }, "→", -1)),
                  zt(" " + he(V.target), 1)
                ]),
                I("span", O2, he(V.label || V.type), 1)
              ], 8, A2))), 128))
            ])
          ])) : se.value ? (A(), Ie(VE, {
            key: 3,
            "read-only": !r.value,
            edge: se.value,
            "edge-types": T.value,
            "material-types": R.value,
            materials: se.value.materials || [],
            "source-name": i.value.nodeById.get(se.value.source_id)?.name,
            "target-name": i.value.nodeById.get(se.value.target_id)?.name,
            onUpdate: Id,
            onReverse: Dd,
            onDelete: Cr,
            onMaterialAdd: $[19] || ($[19] = (V) => se.value && Tr("edge", V, se.value.id)),
            onComponentRefAdd: $[20] || ($[20] = (V) => se.value && os("edge", V, se.value.id)),
            onMaterialUpdate: Ir,
            onMaterialRemove: Dr,
            onCollapse: $[21] || ($[21] = (V) => p.value = !1),
            onClose: $[22] || ($[22] = (V) => f.value = null)
          }, null, 8, ["read-only", "edge", "edge-types", "material-types", "materials", "source-name", "target-name"])) : (A(), G("div", R2, [
            I("div", z2, [
              $[36] || ($[36] = I("span", { class: "kg-panel-title" }, "Graph", -1)),
              I("button", {
                class: "kg-x kg-x--chev",
                title: "Hide inspector",
                "aria-label": "Hide inspector",
                onClick: $[23] || ($[23] = (V) => p.value = !1)
              }, "»")
            ]),
            I("div", B2, [
              I("span", null, he(pe.value.nodes) + " nodes", 1),
              I("span", null, he(pe.value.edges) + " edges", 1),
              I("span", null, he(ie.value.length) + " materials", 1)
            ]),
            I("div", L2, [
              $[37] || ($[37] = I("span", null, "Graph materials", -1)),
              r.value ? (A(), G("button", {
                key: 0,
                class: "kg-mini",
                "aria-label": "Add graph material",
                onClick: $[24] || ($[24] = (V) => Tr("graph", Er("graph")))
              }, "+")) : fe("", !0)
            ]),
            r.value ? (A(), G("div", V2, [
              (A(!0), G(ye, null, Se(ie.value, (V) => (A(), Ie(Za, {
                key: V.id,
                material: V,
                "material-types": R.value,
                expanded: ue.value.has(V.id),
                onToggle: (J) => ve(V.id),
                onUpdate: (J) => Ir({ id: V.id, patch: J }),
                onRemove: (J) => Dr(V.id)
              }, null, 8, ["material", "material-types", "expanded", "onToggle", "onUpdate", "onRemove"]))), 128)),
              ie.value.length ? fe("", !0) : (A(), G("div", H2, "no graph materials"))
            ])) : fe("", !0)
          ]))
        ])) : fe("", !0)
      ]),
      P.value ? (A(), Ie(S$, {
        key: 1,
        x: P.value.x,
        y: P.value.y,
        items: P.value.items,
        onClose: $[25] || ($[25] = (V) => P.value = null)
      }, null, 8, ["x", "y", "items"])) : fe("", !0)
    ], 34));
  }
}), G2 = ".vue-flow{position:relative;width:100%;height:100%;overflow:hidden;z-index:0;direction:ltr}.vue-flow__container{position:absolute;height:100%;width:100%;left:0;top:0}.vue-flow__pane{z-index:1}.vue-flow__pane.draggable{cursor:grab}.vue-flow__pane.selection{cursor:pointer}.vue-flow__pane.dragging{cursor:grabbing}.vue-flow__transformationpane{transform-origin:0 0;z-index:2;pointer-events:none}.vue-flow__viewport{z-index:4;overflow:clip}.vue-flow__selection{z-index:6}.vue-flow__edge-labels{position:absolute;width:100%;height:100%;pointer-events:none;-webkit-user-select:none;-moz-user-select:none;user-select:none}.vue-flow__nodesselection-rect:focus,.vue-flow__nodesselection-rect:focus-visible{outline:none}.vue-flow .vue-flow__edges{pointer-events:none;overflow:visible}.vue-flow__edge-path,.vue-flow__connection-path{stroke:#b1b1b7;stroke-width:1;fill:none}.vue-flow__edge{pointer-events:visibleStroke;cursor:pointer}.vue-flow__edge.animated path{stroke-dasharray:5;animation:dashdraw .5s linear infinite}.vue-flow__edge.animated path.vue-flow__edge-interaction{stroke-dasharray:none;animation:none}.vue-flow__edge.inactive{pointer-events:none}.vue-flow__edge.selected,.vue-flow__edge:focus,.vue-flow__edge:focus-visible{outline:none}.vue-flow__edge.selected .vue-flow__edge-path,.vue-flow__edge:focus .vue-flow__edge-path,.vue-flow__edge:focus-visible .vue-flow__edge-path{stroke:#555}.vue-flow__edge-textwrapper{pointer-events:all}.vue-flow__edge-textbg{fill:#fff}.vue-flow__edge-text{pointer-events:none;-webkit-user-select:none;-moz-user-select:none;user-select:none}.vue-flow__connection{pointer-events:none}.vue-flow__connection .animated{stroke-dasharray:5;animation:dashdraw .5s linear infinite}.vue-flow__connectionline{z-index:1001}.vue-flow__nodes{pointer-events:none;transform-origin:0 0}.vue-flow__node{position:absolute;-webkit-user-select:none;-moz-user-select:none;user-select:none;pointer-events:all;transform-origin:0 0;box-sizing:border-box;cursor:default}.vue-flow__node.draggable{cursor:grab;pointer-events:all}.vue-flow__node.draggable.dragging{cursor:grabbing}.vue-flow__nodesselection{z-index:3;transform-origin:left top;pointer-events:none}.vue-flow__nodesselection-rect{position:absolute;pointer-events:all;cursor:grab}.vue-flow__nodesselection-rect.dragging{cursor:grabbing}.vue-flow__handle{position:absolute;pointer-events:none;min-width:5px;min-height:5px}.vue-flow__handle.connectable{pointer-events:all;cursor:crosshair}.vue-flow__handle-bottom{left:50%;bottom:0;transform:translate(-50%,50%)}.vue-flow__handle-top{left:50%;top:0;transform:translate(-50%,-50%)}.vue-flow__handle-left{top:50%;left:0;transform:translate(-50%,-50%)}.vue-flow__handle-right{top:50%;right:0;transform:translate(50%,-50%)}.vue-flow__edgeupdater{cursor:move;pointer-events:all}.vue-flow__panel{position:absolute;z-index:5;margin:15px}.vue-flow__panel.top{top:0}.vue-flow__panel.bottom{bottom:0}.vue-flow__panel.left{left:0}.vue-flow__panel.right{right:0}.vue-flow__panel.center{left:50%;transform:translate(-50%)}@keyframes dashdraw{0%{stroke-dashoffset:10}}", Y2 = ":root{--vf-node-bg: #fff;--vf-node-text: #222;--vf-connection-path: #b1b1b7;--vf-handle: #555}.vue-flow__edge.updating .vue-flow__edge-path{stroke:#777}.vue-flow__edge-text{font-size:10px}.vue-flow__edge-textbg{fill:#fff}.vue-flow__connection-path{stroke:var(--vf-connection-path)}.vue-flow__node{cursor:grab}.vue-flow__node.selectable:focus,.vue-flow__node.selectable:focus-visible{outline:none}.vue-flow__node-default,.vue-flow__node-input,.vue-flow__node-output{padding:10px;border-radius:3px;width:150px;font-size:12px;text-align:center;border-width:1px;border-style:solid;color:var(--vf-node-text);background-color:var(--vf-node-bg);border-color:var(--vf-node-color)}.vue-flow__node-default.selected,.vue-flow__node-default.selected:hover,.vue-flow__node-input.selected,.vue-flow__node-input.selected:hover,.vue-flow__node-output.selected,.vue-flow__node-output.selected:hover{box-shadow:0 0 0 .5px var(--vf-box-shadow)}.vue-flow__node-default.selected,.vue-flow__node-default:focus,.vue-flow__node-default:focus-visible,.vue-flow__node-input.selected,.vue-flow__node-input:focus,.vue-flow__node-input:focus-visible,.vue-flow__node-output.selected,.vue-flow__node-output:focus,.vue-flow__node-output:focus-visible{outline:none;border:1px solid #555}.vue-flow__node-default .vue-flow__handle,.vue-flow__node-input .vue-flow__handle,.vue-flow__node-output .vue-flow__handle{background:var(--vf-handle)}.vue-flow__node-default.selectable:hover,.vue-flow__node-input.selectable:hover,.vue-flow__node-output.selectable:hover{box-shadow:0 1px 4px 1px #00000014}.vue-flow__node-input{--vf-node-color: var(--vf-node-color, #0041d0);--vf-handle: var(--vf-node-color, #0041d0);--vf-box-shadow: var(--vf-node-color, #0041d0);background:var(--vf-node-bg);border-color:var(--vf-node-color, #0041d0)}.vue-flow__node-input.selected,.vue-flow__node-input:focus,.vue-flow__node-input:focus-visible{outline:none;border:1px solid var(--vf-node-color, #0041d0)}.vue-flow__node-default{--vf-handle: var(--vf-node-color, #1a192b);--vf-box-shadow: var(--vf-node-color, #1a192b);background:var(--vf-node-bg);border-color:var(--vf-node-color, #1a192b)}.vue-flow__node-default.selected,.vue-flow__node-default:focus,.vue-flow__node-default:focus-visible{outline:none;border:1px solid var(--vf-node-color, #1a192b)}.vue-flow__node-output{--vf-handle: var(--vf-node-color, #ff0072);--vf-box-shadow: var(--vf-node-color, #ff0072);background:var(--vf-node-bg);border-color:var(--vf-node-color, #ff0072)}.vue-flow__node-output.selected,.vue-flow__node-output:focus,.vue-flow__node-output:focus-visible{outline:none;border:1px solid var(--vf-node-color, #ff0072)}.vue-flow__nodesselection-rect,.vue-flow__selection{background:#0059dc14;border:1px dotted rgba(0,89,220,.8)}.vue-flow__nodesselection-rect:focus,.vue-flow__nodesselection-rect:focus-visible,.vue-flow__selection:focus,.vue-flow__selection:focus-visible{outline:none}.vue-flow__handle{width:6px;height:6px;background:var(--vf-handle);border:1px solid #fff;border-radius:100%}", U2 = ".vue-flow__controls{box-shadow:0 0 2px 1px #00000014}.vue-flow__controls-button{background:#fefefe;border:none;border-bottom:1px solid #eee;box-sizing:content-box;display:flex;justify-content:center;align-items:center;width:16px;height:16px;cursor:pointer;user-select:none;padding:5px}.vue-flow__controls-button svg{width:100%;max-width:12px;max-height:12px}.vue-flow__controls-button:hover{background:#f4f4f4}.vue-flow__controls-button:disabled{pointer-events:none}.vue-flow__controls-button:disabled svg{fill-opacity:.4}", q2 = ".vue-flow__minimap{background-color:#fff}.vue-flow__minimap.pannable{cursor:grab}.vue-flow__minimap.dragging{cursor:grabbing}.vue-flow__minimap-mask.pannable{cursor:grab}", X2 = ':host{container:graph / inline-size;--kg-bg: var(--p-content-background);--kg-surface: color-mix(in srgb, var(--p-content-background) 94%, var(--p-text-color));--kg-panel: color-mix(in srgb, var(--p-content-background) 98%, var(--p-text-color));--kg-line: var(--p-content-border-color);--kg-line-soft: color-mix(in srgb, var(--p-content-border-color) 60%, transparent);--kg-text: var(--p-text-color);--kg-muted: var(--p-text-muted-color);--kg-accent: var(--p-primary-color);--kg-danger: var(--p-danger-color);--kg-info: var(--p-info-color);--kg-fs-label: 10px;--kg-fs-meta: 11px;--kg-fs-body: 12px;--kg-fs-title: 14px;--kg-1: 4px;--kg-2: 8px;--kg-3: 12px;--kg-4: 16px;--kg-5: 20px;--kg-6: 24px;display:block;position:relative;width:100%;height:100%;color:var(--kg-text);font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,sans-serif}:host([mode="preview"]){min-height:320px}*{box-sizing:border-box}.kg{position:absolute;inset:0;display:flex;flex-direction:column;background:var(--kg-bg);overflow:hidden;outline:none}.kg-top{display:flex;align-items:center;gap:var(--kg-3);padding:var(--kg-2) var(--kg-3);border-bottom:1px solid var(--kg-line);background:var(--kg-panel);flex-shrink:0;min-width:0}.kg-breadcrumbs{display:flex;align-items:center;gap:var(--kg-1);min-width:0;flex:1;overflow:hidden}.kg-actions{display:flex;align-items:center;gap:var(--kg-1);flex-shrink:0}.kg-sep{color:var(--kg-muted);opacity:.5;font-size:var(--kg-fs-meta)}.kg-vsep{width:1px;height:var(--kg-4);background:var(--kg-line-soft);margin:0 var(--kg-1)}.kg-count{font-size:var(--kg-fs-meta);color:var(--kg-muted);margin-left:var(--kg-2);white-space:nowrap}.kg-btn,.kg-crumb,.kg-icon-btn,.kg-mini,.kg-sel{border:1px solid var(--kg-line);background:var(--kg-surface);color:var(--kg-text);height:28px;border-radius:8px;padding:0 10px;font:inherit;font-size:var(--kg-fs-body);font-weight:600;cursor:pointer;white-space:nowrap;transition:border-color .12s,color .12s,background .12s}.kg-btn:hover,.kg-crumb:hover,.kg-icon-btn:hover:not(:disabled),.kg-mini:hover,.kg-sel:hover{border-color:color-mix(in srgb,var(--kg-accent) 42%,var(--kg-line));color:var(--kg-accent)}.kg-btn--ghost{background:transparent}.kg-btn--ghost.active{background:color-mix(in srgb,var(--kg-accent) 12%,transparent);border-color:color-mix(in srgb,var(--kg-accent) 34%,var(--kg-line));color:var(--kg-text)}.kg-icon-btn,.kg-mini{width:28px;padding:0;display:inline-flex;align-items:center;justify-content:center}.kg-icon-btn:disabled{opacity:.35;cursor:not-allowed}.kg-mini{width:22px;height:22px;border-radius:8px;font-size:var(--kg-fs-body);color:var(--kg-muted)}.kg-mini--wide{width:auto;padding:0 8px;font-size:var(--kg-fs-label);text-transform:uppercase;letter-spacing:.06em}.kg-sel{padding:0 6px}.kg-sel option{background:var(--kg-panel);color:var(--kg-text)}.kg-crumb{max-width:170px;overflow:hidden;text-overflow:ellipsis;background:transparent;border-color:transparent}.kg-crumb:hover{border-color:var(--kg-line)}.kg-crumb.active{color:var(--kg-text);border-color:var(--kg-accent);font-weight:700}.kg-danger{color:var(--kg-danger)}.kg-danger:hover{border-color:color-mix(in srgb,var(--kg-danger) 45%,var(--kg-line))!important;color:var(--kg-danger)!important;background:color-mix(in srgb,var(--kg-danger) 6%,transparent)}.kg-block{width:100%;margin-top:14px}.kg-muted{color:var(--kg-muted);font-size:var(--kg-fs-meta)}.kg-x{width:22px;height:22px;flex-shrink:0;border:0;background:transparent;border-radius:8px;color:var(--kg-muted);font-size:15px;line-height:1;cursor:pointer}.kg-x:hover{color:var(--kg-danger);background:color-mix(in srgb,var(--kg-danger) 8%,transparent)}.kg-x--chev{font-size:13px}.kg-x--chev:hover{color:var(--kg-accent);background:color-mix(in srgb,var(--kg-accent) 8%,transparent)}.kg-error{position:relative;z-index:30;flex:none;margin:var(--kg-3);display:flex;align-items:center;gap:8px;max-width:min(620px,calc(100% - 24px));padding:8px 10px;border:1px solid color-mix(in srgb,var(--kg-danger) 32%,var(--kg-line));background:color-mix(in srgb,var(--kg-danger) 7%,var(--kg-panel));color:var(--kg-text);border-radius:10px;font-size:var(--kg-fs-body)}.kg-error span{flex:1;min-width:0;overflow-wrap:anywhere}.kg-error-x{border:0;background:transparent;color:var(--kg-danger);cursor:pointer;font-size:14px;line-height:1;padding:0}.kg-body{position:relative;flex:1;min-height:0;display:flex;background:var(--kg-bg)}.kg-tree{width:210px;flex-shrink:0;border-right:1px solid var(--kg-line);background:var(--kg-panel);min-height:0;overflow:auto;display:flex;flex-direction:column}.kg-panel{width:300px;flex-shrink:0;border-left:1px solid var(--kg-line);background:var(--kg-panel);min-height:0;overflow:auto;position:relative}.kg-panel-inner{padding:var(--kg-4)}.kg-panel-rail{width:20px;flex-shrink:0;border-left:1px solid var(--kg-line);background:var(--kg-panel);color:var(--kg-muted);cursor:pointer;border-top:0;border-right:0;border-bottom:0;font-size:13px}.kg-panel-rail:hover{color:var(--kg-accent)}.kg-tree-head{height:34px;padding:0 var(--kg-3);flex-shrink:0;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid var(--kg-line);font-size:var(--kg-fs-label);font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--kg-muted)}.kg-tree-list{padding:var(--kg-2);overflow:auto}.kg-tree-row{width:100%;height:28px;display:grid;grid-template-columns:12px 8px 1fr auto;align-items:center;gap:var(--kg-2);border:0;border-radius:8px;background:transparent;padding-right:var(--kg-2);color:var(--kg-text);cursor:pointer;font:inherit;font-size:var(--kg-fs-body);text-align:left}.kg-tree-row:hover{background:color-mix(in srgb,var(--kg-text) 5%,transparent)}.kg-tree-row.active{background:color-mix(in srgb,var(--kg-accent) 12%,transparent);font-weight:600}.kg-twist{width:12px;height:20px;padding:0;border:0;background:transparent;color:var(--kg-muted);font:inherit;font-size:var(--kg-fs-label);cursor:pointer}.kg-tree-dot{width:7px;height:7px;border-radius:2px}.kg-tree-name{overflow:hidden;white-space:nowrap;text-overflow:ellipsis}.kg-tree-empty{padding:14px 8px;font-size:var(--kg-fs-meta);color:var(--kg-muted);text-align:center}.kg-tree-count{min-width:18px;height:16px;display:inline-flex;align-items:center;justify-content:center;padding:0 var(--kg-1);border-radius:4px;background:color-mix(in srgb,var(--kg-muted) 12%,transparent);color:var(--kg-muted);font-size:var(--kg-fs-label);font-weight:700}.kg-canvas{flex:1;min-width:0;min-height:0;position:relative;background:var(--kg-bg)}.kg-flow{width:100%;height:100%}.kg-hint{position:absolute;bottom:var(--kg-3);left:50%;transform:translate(-50%);font-size:var(--kg-fs-label);color:color-mix(in srgb,var(--kg-muted) 60%,transparent);pointer-events:none;z-index:2}.kg-empty{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;pointer-events:none}.kg-empty-inner{text-align:center;pointer-events:auto}.kg-empty-text{font-size:var(--kg-fs-body);color:var(--kg-muted);margin-bottom:10px}.kg-empty .kg-btn{pointer-events:auto}.g-node{--node-color: var(--kg-accent);min-height:56px;padding:8px 10px;background:var(--node-bg, color-mix(in srgb, var(--node-color) 8%, var(--kg-panel)));border:1px solid var(--node-border, color-mix(in srgb, var(--node-color) 38%, var(--kg-line)));box-shadow:0 3px 10px color-mix(in srgb,var(--kg-text) 12%,transparent);user-select:none;position:relative;transition:box-shadow .15s,border-color .15s}.g-node:hover{box-shadow:0 5px 16px color-mix(in srgb,var(--kg-text) 18%,transparent)}.g-node--selected{outline:2px solid color-mix(in srgb,var(--node-color) 58%,transparent);outline-offset:2px}.g-portal-chip{--node-color: var(--kg-accent);display:flex;align-items:center;gap:7px;max-width:190px;padding:5px 12px 5px 9px;background:color-mix(in srgb,var(--kg-panel) 88%,transparent);border:1px dashed color-mix(in srgb,var(--node-color) 45%,var(--kg-line));border-radius:999px;opacity:.72;cursor:pointer;user-select:none;transition:opacity .15s,border-color .15s,box-shadow .15s}.g-portal-chip:hover{opacity:1;border-color:color-mix(in srgb,var(--node-color) 70%,var(--kg-line));box-shadow:0 2px 8px color-mix(in srgb,var(--kg-text) 10%,transparent)}.g-portal-glyph{flex-shrink:0;color:var(--node-color);font-size:12px;line-height:1}.g-portal-chip-body{min-width:0;display:flex;flex-direction:column}.g-portal-chip-name{overflow:hidden;white-space:nowrap;text-overflow:ellipsis;color:var(--kg-text);font-size:var(--kg-fs-meta);font-weight:600;line-height:1.25}.g-portal-chip-ctx{overflow:hidden;white-space:nowrap;text-overflow:ellipsis;color:var(--kg-muted);font-size:9px;line-height:1.3}.g-portal-port{width:1px;height:1px;min-width:0;min-height:0;border:0;background:transparent;pointer-events:none}.g-node-top{min-height:16px;display:flex;align-items:center;gap:6px}.g-dot{width:7px;height:7px;border-radius:2px;background:var(--node-color);flex-shrink:0}.g-type{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--node-color);font-size:10px;font-weight:800;letter-spacing:.4px;text-transform:uppercase}.g-status{display:inline-flex;align-items:center;height:14px;font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.3px;padding:0 5px;border-radius:3px;background:color-mix(in srgb,var(--kg-info) 14%,transparent);color:var(--kg-info)}.g-clip{display:inline-flex;align-items:center;gap:2px;height:14px;padding:0 5px;border-radius:3px;background:color-mix(in srgb,var(--kg-text) 7%,transparent);color:var(--kg-muted);font-size:9px;font-weight:700}.g-count{min-width:16px;height:14px;display:inline-flex;align-items:center;justify-content:center;padding:0 4px;border-radius:3px;background:color-mix(in srgb,var(--node-color) 14%,transparent);color:var(--kg-muted);font-size:9px;font-weight:700}.g-name{margin-top:4px;font-size:14px;line-height:1.25;font-weight:750;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.g-name-input{width:100%;margin-top:4px;padding:0 3px;font:inherit;font-size:14px;line-height:1.25;font-weight:750;color:var(--kg-text);background:color-mix(in srgb,var(--kg-text) 6%,transparent);border:1px solid color-mix(in srgb,var(--node-color) 55%,transparent);border-radius:4px;outline:none;cursor:text}.g-desc{margin-top:3px;color:var(--kg-muted);font-size:11px;line-height:1.35;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}.g-desc p{margin:0 0 2px}.g-desc code{font-size:9px;background:color-mix(in srgb,var(--kg-text) 8%,transparent);padding:0 3px;border-radius:2px}.g-desc strong{color:var(--kg-text)}.g-desc a{color:var(--node-color);text-decoration:none}.g-desc ul,.g-desc ol{margin:1px 0;padding-left:13px}.g-badges{display:flex;flex-wrap:wrap;gap:4px;margin-top:4px}.g-badge{--badge-color: var(--p-text-muted-color);font-size:9px;font-weight:600;padding:1px 5px;border-radius:3px;white-space:nowrap;max-width:100%;overflow:hidden;text-overflow:ellipsis;color:var(--badge-color);background:color-mix(in srgb,var(--badge-color) 12%,transparent);border:1px solid color-mix(in srgb,var(--badge-color) 26%,transparent)}.g-tags{display:flex;flex-wrap:wrap;gap:4px;margin-top:4px}.g-tag{height:16px;padding:0 6px;display:inline-flex;align-items:center;border-radius:4px;background:color-mix(in srgb,var(--kg-muted) 11%,transparent);color:var(--kg-muted);font-size:9px;font-weight:650}.g-port{width:8px;height:8px;border:0;background:var(--node-color);opacity:0;border-radius:50%;transition:opacity .12s,width .12s,height .12s;cursor:crosshair}.g-node:hover .g-port,.g-boundary:hover .g-port{opacity:.5}.g-port:hover{opacity:1!important;width:12px;height:12px}.kg-connecting .g-port{opacity:.55}.g-port.vue-flow__handle-connecting,.g-port.vue-flow__handle-valid{opacity:1!important;width:12px;height:12px}.g-resize{position:absolute;top:10px;bottom:10px;right:-4px;width:8px;border-radius:4px;cursor:ew-resize;background:color-mix(in srgb,var(--node-color) 40%,transparent);transition:background .12s}.g-resize:hover{background:var(--node-color)}.g-anim-pulse{animation:kg-pulse 2s ease-in-out infinite}.g-anim-glow{animation:kg-glow 2s ease-in-out infinite}.g-anim-blink{animation:kg-blink 1.5s steps(1) infinite}.g-anim-breathe{animation:kg-breathe 3s ease-in-out infinite}.g-anim-shake{animation:kg-shake .5s ease-in-out infinite}@keyframes kg-pulse{0%,to{opacity:1}50%{opacity:.68}}@keyframes kg-glow{0%,to{box-shadow:0 0 4px var(--node-color)}50%{box-shadow:0 0 18px var(--node-color)}}@keyframes kg-blink{0%,49%{border-color:var(--node-color)}50%,to{border-color:var(--node-border)}}@keyframes kg-breathe{0%,to{transform:scale(1)}50%{transform:scale(1.02)}}@keyframes kg-shake{0%,to{transform:translate(0)}25%{transform:translate(-2px)}75%{transform:translate(2px)}}.g-boundary{--node-color: var(--kg-accent);width:100%;height:100%;border:1.5px dashed color-mix(in srgb,var(--node-color) 54%,var(--kg-line));border-radius:7px;background:color-mix(in srgb,var(--node-color) 5%,transparent);position:relative}.g-boundary--selected{outline:2px solid color-mix(in srgb,var(--node-color) 30%,transparent);outline-offset:3px}.g-boundary-title{position:absolute;top:-13px;left:14px;height:22px;display:flex;align-items:center;padding:0 10px;border-radius:8px;background:var(--node-color);color:var(--p-primary-contrast-color);font-size:11px;font-weight:750}.kg-hdr{margin:0 0 var(--kg-4);padding:var(--kg-3);border-left:3px solid var(--kg-line);border-radius:8px;background:color-mix(in srgb,var(--kg-text) 3%,transparent)}.kg-hdr-top{display:flex;align-items:center;gap:6px;margin-bottom:var(--kg-2)}.kg-hdr-dot{width:8px;height:8px;border-radius:2px;flex-shrink:0}.kg-panel-head{display:flex;align-items:center;justify-content:space-between;gap:var(--kg-2);margin:0 0 var(--kg-4)}.kg-panel-title{font-size:var(--kg-fs-title);font-weight:750}.kg-head-actions{display:flex;align-items:center;gap:6px}.kg-kicker{font-size:var(--kg-fs-label);font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--kg-muted);flex:1}.kg-label{display:block;margin:var(--kg-4) 0 var(--kg-2);padding-top:var(--kg-3);border-top:1px solid var(--kg-line-soft);font-size:var(--kg-fs-label);font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--kg-muted)}.kg-type-sel{flex:1;height:24px;min-width:0;border:1px solid var(--kg-line);border-radius:8px;background:var(--kg-surface);color:var(--kg-muted);font:inherit;font-size:var(--kg-fs-label);font-weight:700;letter-spacing:.08em;text-transform:uppercase;padding:0 5px;cursor:pointer}.kg-type-sel:hover{color:var(--kg-text);border-color:color-mix(in srgb,var(--kg-accent) 42%,var(--kg-line))}.kg-type-sel option{background:var(--kg-panel);text-transform:none;letter-spacing:normal;font-size:var(--kg-fs-body)}.kg-input,.kg-textarea{width:100%;min-width:0;border:1px solid var(--kg-line);border-radius:8px;background:var(--kg-surface);color:var(--kg-text);font:inherit;font-size:var(--kg-fs-body);padding:6px 8px;transition:border-color .12s}.kg-input:hover,.kg-textarea:hover{border-color:color-mix(in srgb,var(--kg-muted) 45%,var(--kg-line))}.kg-input:focus,.kg-textarea:focus{outline:none;border-color:color-mix(in srgb,var(--kg-accent) 50%,var(--kg-line))}.kg-input.kg-small,.kg-textarea.kg-small{padding:4px 7px;font-size:var(--kg-fs-meta)}.kg-title-input{font-size:var(--kg-fs-title);font-weight:750;background:transparent;border-color:transparent;padding-left:0}.kg-title-input:focus{border-color:color-mix(in srgb,var(--kg-accent) 50%,var(--kg-line));padding-left:8px}.kg-textarea{resize:vertical;line-height:1.45}.kg-editable-title{font-size:var(--kg-fs-title);font-weight:750;cursor:text;padding:2px 0;border-radius:8px}.kg-editable-title:hover{color:var(--kg-accent)}.kg-desc-preview{font-size:var(--kg-fs-body);color:var(--kg-muted);line-height:1.45;margin:2px 0 6px;cursor:text;min-height:18px;border-radius:8px;padding:2px 0}.kg-desc-preview:hover{color:var(--kg-text)}.kg-desc-preview p{margin:0 0 4px}.kg-desc-preview code{font-size:var(--kg-fs-meta);background:color-mix(in srgb,var(--kg-text) 8%,transparent);padding:0 3px;border-radius:2px}.kg-desc-preview ul,.kg-desc-preview ol{margin:3px 0;padding-left:16px}.kg-desc-preview a{color:var(--kg-info)}.kg-editrow{margin:4px 0}.kg-colorrow{display:flex;flex-wrap:wrap;align-items:center;gap:4px}.kg-swatch{width:17px;height:17px;border-radius:8px;cursor:pointer;border:2px solid transparent;transition:border-color .1s,transform .1s}.kg-swatch:hover{border-color:color-mix(in srgb,var(--kg-text) 25%,transparent);transform:scale(1.1)}.kg-swatch.active{border-color:color-mix(in srgb,var(--kg-text) 55%,transparent)}.kg-color{width:34px;height:30px;border:1px solid var(--kg-line);border-radius:8px;background:transparent;padding:2px;cursor:pointer}.kg-color--sm{width:20px;height:18px;border-radius:8px;padding:1px}.kg-inline-field{display:flex;align-items:center;gap:5px;margin-top:8px}.kg-inline-field.kg-wrap{flex-wrap:wrap}.kg-mini-label{font-size:var(--kg-fs-label);color:var(--kg-muted);min-width:46px;flex-shrink:0;text-transform:uppercase;letter-spacing:.06em;font-weight:600}.kg-chip{font-size:var(--kg-fs-meta);padding:3px 8px;border-radius:8px;border:1px solid var(--kg-line);background:var(--kg-surface);color:var(--kg-muted);cursor:pointer;font-family:inherit;font-weight:600;transition:color .12s,border-color .12s,background .12s}.kg-chip:hover{color:var(--kg-text);border-color:color-mix(in srgb,var(--kg-muted) 45%,var(--kg-line))}.kg-chip.active{background:color-mix(in srgb,var(--kg-accent) 12%,transparent);color:var(--kg-accent);border-color:color-mix(in srgb,var(--kg-accent) 28%,var(--kg-line))}.kg-chiprow{display:flex;flex-wrap:wrap;gap:4px}.kg-edge-dir{display:grid;grid-template-columns:minmax(0,1fr) 22px minmax(0,1fr);align-items:center;gap:5px;margin-top:8px}.kg-edge-node{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;border:1px solid var(--kg-line);border-radius:8px;background:var(--kg-surface);color:var(--kg-muted);padding:4px 6px;font-size:var(--kg-fs-meta);font-weight:600;text-align:center}.kg-edge-arrow{text-align:center;color:var(--kg-muted);font-size:14px;line-height:1}.kg-slider-row{display:flex;align-items:center;gap:5px;margin-top:10px}.kg-slider-row input[type=range]{flex:1;min-width:0;height:3px;accent-color:var(--kg-accent);cursor:pointer}.kg-slider-val{font-size:var(--kg-fs-meta);color:var(--kg-muted);width:28px;text-align:right;flex-shrink:0;font-variant-numeric:tabular-nums}.kg-ports{display:flex;gap:8px;flex-wrap:wrap}.kg-port-cell{display:flex;align-items:center;gap:2px}.kg-port-cell .kg-mini{width:18px;height:18px;border-radius:8px}.kg-port-n{font-size:var(--kg-fs-meta);color:var(--kg-text);width:14px;text-align:center;font-weight:700;font-variant-numeric:tabular-nums}.kg-port-lbl{font-size:var(--kg-fs-label);color:var(--kg-muted);margin-left:1px}.kg-tags-edit{display:flex;flex-wrap:wrap;gap:var(--kg-1);margin-bottom:var(--kg-2)}.kg-tagchip{display:inline-flex;align-items:center;gap:3px;height:20px;padding:0 4px 0 8px;border-radius:8px;background:color-mix(in srgb,var(--kg-muted) 11%,transparent);color:var(--kg-muted);font-size:var(--kg-fs-meta);font-weight:650}.kg-tagx{border:0;background:none;color:var(--kg-muted);cursor:pointer;font-size:var(--kg-fs-body);line-height:1;padding:0}.kg-tagx:hover{color:var(--kg-danger)}.kg-section-head{display:flex;align-items:center;gap:var(--kg-2);margin:var(--kg-4) 0 var(--kg-2);padding-top:var(--kg-3);border-top:1px solid var(--kg-line-soft);font-size:var(--kg-fs-label);font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--kg-muted)}.kg-section-head>span:first-child{flex:1}.kg-disclosure{display:flex;align-items:center;gap:var(--kg-2);width:100%;margin-top:var(--kg-4);padding:var(--kg-3) 0 var(--kg-2);border:0;border-top:1px solid var(--kg-line-soft);background:transparent;cursor:pointer;font:inherit;font-size:var(--kg-fs-label);font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--kg-muted)}.kg-disclosure:hover{color:var(--kg-text)}.kg-disclosure>span:first-child{flex:1;text-align:left}.kg-disclosure-meta{display:inline-flex;align-items:center;gap:4px}.kg-disclosure-chevron{font-size:var(--kg-fs-body);line-height:1;transition:transform .12s}.kg-disclosure.open .kg-disclosure-chevron{transform:rotate(90deg)}.kg-disclosure-body{display:grid;gap:2px;padding:2px 0 4px}.kg-swatch--peek{width:12px;height:12px;border-radius:3px;cursor:inherit;pointer-events:none}.kg-add-wrap{position:relative}.kg-add-menu{position:absolute;right:0;top:26px;z-index:20;min-width:150px;max-height:260px;overflow-y:auto;background:var(--kg-panel);border:1px solid var(--kg-line);border-radius:8px;box-shadow:0 6px 18px #00000029;padding:4px;display:flex;flex-direction:column;gap:1px}.kg-add-item{text-align:left;border:1px solid transparent;background:transparent;color:var(--kg-text);font:inherit;font-size:var(--kg-fs-meta);letter-spacing:normal;text-transform:none;padding:6px 8px;border-radius:8px;cursor:pointer}.kg-add-item:hover{background:color-mix(in srgb,var(--kg-accent) 10%,transparent);color:var(--kg-accent)}.kg-add-empty{font-size:var(--kg-fs-label);color:var(--kg-muted);padding:6px 8px;text-transform:none;letter-spacing:normal}.kg-materials{display:grid;gap:6px;margin-bottom:12px}.kg-material{display:grid;gap:6px;padding:6px 8px;border:1px solid var(--kg-line-soft);border-radius:8px;background:var(--kg-surface);transition:border-color .12s}.kg-material:hover{border-color:color-mix(in srgb,var(--kg-muted) 40%,var(--kg-line))}.kg-material--open{border-color:var(--kg-line);padding:8px}.kg-material-head{display:flex;align-items:center;gap:6px;cursor:pointer;min-width:0;border-radius:8px}.kg-mat-title{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:var(--kg-fs-meta);color:var(--kg-text)}.kg-mat-chevron{color:var(--kg-muted);font-size:var(--kg-fs-body);line-height:1;transition:transform .12s;flex-shrink:0}.kg-mat-chevron.open{transform:rotate(90deg)}.kg-material-head .kg-mini{opacity:0;transition:opacity .12s}.kg-material:hover .kg-material-head .kg-mini,.kg-material--open .kg-material-head .kg-mini{opacity:1}.kg-mat-kind{flex-shrink:0;font-size:var(--kg-fs-label);text-transform:uppercase;letter-spacing:.08em;font-weight:800;padding:2px 6px;border-radius:8px;background:color-mix(in srgb,var(--kg-text) 6%,transparent);color:var(--kg-muted)}.kg-source{display:grid;gap:5px;padding-top:6px;border-top:1px dashed var(--kg-line-soft)}.kg-url{display:flex;align-items:center;gap:5px}.kg-url .kg-input{flex:1}.kg-url-go{flex-shrink:0;color:var(--kg-muted);text-decoration:none;font-size:13px}.kg-url-go:hover{color:var(--kg-info)}.kg-component-picker{display:grid;gap:6px}.kg-component-selected{display:flex;align-items:center;gap:6px;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;padding:4px 8px;border-radius:8px;background:color-mix(in srgb,var(--kg-accent) 8%,transparent);color:var(--kg-text);font-size:var(--kg-fs-meta);font-weight:600}.kg-component-selected-dot{width:6px;height:6px;border-radius:50%;background:var(--kg-accent);flex-shrink:0}.kg-component-raw{color:var(--kg-muted);font-family:ui-monospace,monospace;font-size:var(--kg-fs-label)}.kg-component-path{display:flex;flex-wrap:wrap;gap:4px}.kg-component-path .active{color:var(--kg-accent);border-color:color-mix(in srgb,var(--kg-accent) 28%,var(--kg-line))}.kg-component-list{display:grid;gap:3px;max-height:180px;overflow:auto;padding:3px;border:1px solid var(--kg-line-soft);border-radius:8px;background:color-mix(in srgb,var(--kg-text) 2%,transparent)}.kg-component-row{display:grid;grid-template-columns:minmax(0,1fr) auto;align-items:center;gap:4px;border-radius:8px}.kg-component-row.active{background:color-mix(in srgb,var(--kg-accent) 10%,transparent)}.kg-component-pick{min-width:0;display:grid;gap:1px;text-align:left;border:0;background:transparent;color:var(--kg-text);font:inherit;cursor:pointer;padding:5px 6px;border-radius:8px}.kg-component-pick:hover{background:color-mix(in srgb,var(--kg-accent) 9%,transparent)}.kg-component-name{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:var(--kg-fs-body);font-weight:650}.kg-component-type{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--kg-muted);font-size:var(--kg-fs-label);text-transform:uppercase;letter-spacing:.06em}.kg-empty-line{font-size:var(--kg-fs-meta);color:var(--kg-muted);font-style:italic}.kg-agg-note{color:var(--kg-muted);font-size:var(--kg-fs-meta);line-height:1.4;margin:var(--kg-2) 0}.kg-agg-list{display:flex;flex-direction:column;gap:4px}.kg-agg-row{display:flex;flex-direction:column;gap:1px;align-items:flex-start;text-align:left;width:100%;padding:6px 8px;border:1px solid var(--kg-line);border-radius:8px;background:color-mix(in srgb,var(--kg-text) 3%,transparent);cursor:pointer}.kg-agg-row:hover{border-color:var(--kg-accent);background:color-mix(in srgb,var(--kg-accent) 8%,transparent)}.kg-agg-ends{font-size:var(--kg-fs-meta);font-weight:700;color:var(--kg-text)}.kg-agg-arrow{color:var(--kg-muted)}.kg-agg-type{font-size:var(--kg-fs-label);color:var(--kg-muted)}.kg-stats{display:flex;flex-wrap:wrap;gap:var(--kg-2);margin:0}.kg-stats span{height:24px;display:inline-flex;align-items:center;border-radius:8px;padding:0 var(--kg-2);background:color-mix(in srgb,var(--kg-text) 5%,transparent);color:var(--kg-muted);font-size:var(--kg-fs-meta);font-weight:700}.kg-row{display:flex;align-items:center;gap:var(--kg-2);margin-top:var(--kg-2);flex-wrap:wrap}.kg-type-group{margin-bottom:4px}.kg-type-row{display:flex;align-items:center;gap:6px;margin-bottom:7px}.kg-type-row--mat{flex-direction:column;align-items:stretch;gap:5px;padding:7px;border:1px solid var(--kg-line);border-radius:8px;background:var(--kg-surface)}.kg-type-row--mat .kg-type-row{margin-bottom:0}.kg-type-id{font-size:var(--kg-fs-label);font-family:ui-monospace,monospace;color:var(--kg-muted);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:70px}.kg-targets{display:flex;gap:10px}.kg-anim-lbl{display:inline-flex;align-items:center;gap:4px;font-size:var(--kg-fs-meta);color:var(--kg-muted);cursor:pointer}.kg-anim-lbl input{margin:0;accent-color:var(--kg-accent)}.kg-wsel{width:auto}.kg-ctx-overlay{position:fixed;inset:0;z-index:100}.kg-ctx{position:absolute;min-width:168px;max-height:60vh;overflow-y:auto;background:var(--kg-panel);border:1px solid var(--kg-line);border-radius:8px;padding:4px;box-shadow:0 8px 26px #0003}.kg-ctx-item{display:block;width:100%;text-align:left;background:none;border:0;color:var(--kg-text);font:inherit;font-size:var(--kg-fs-body);padding:6px 10px;cursor:pointer;border-radius:8px;white-space:nowrap}.kg-ctx-item:hover{background:color-mix(in srgb,var(--kg-accent) 10%,transparent);color:var(--kg-accent)}.kg-ctx-danger{color:var(--kg-danger)}.kg-ctx-danger:hover{background:color-mix(in srgb,var(--kg-danger) 10%,transparent);color:var(--kg-danger)}.vue-flow__node{background:transparent!important;border:0!important;border-radius:0!important;padding:0!important;box-shadow:none!important}.vue-flow__node.selected{box-shadow:none!important}.vue-flow__edge-path{stroke-linecap:round}.vue-flow__connection-path{stroke:var(--kg-accent);stroke-width:2;stroke-dasharray:7 5;fill:none;animation:kg-conn-dash .5s linear infinite}@keyframes kg-conn-dash{to{stroke-dashoffset:-12}}.vue-flow__edge.selected .vue-flow__edge-path{stroke-width:3!important}.vue-flow__edge-text{font-size:10px;fill:var(--kg-muted)}.vue-flow__controls,.vue-flow__minimap{border:1px solid var(--kg-line);border-radius:8px;overflow:hidden;box-shadow:none;background:var(--kg-panel);margin:var(--kg-3)}.vue-flow__minimap{width:160px;height:108px}.vue-flow__controls button{background:var(--kg-panel);border-bottom:1px solid var(--kg-line);color:var(--kg-muted);width:26px;height:26px}.vue-flow__controls button:hover{background:color-mix(in srgb,var(--kg-text) 5%,transparent);color:var(--kg-text)}.vue-flow__controls button svg{fill:currentColor}.vue-flow__minimap-mask{fill:color-mix(in srgb,var(--p-text-color) 8%,transparent)}.vue-flow__minimap-node{fill:var(--p-text-muted-color);stroke:var(--p-content-background)}.vue-flow__selection{background:color-mix(in srgb,var(--kg-accent) 8%,transparent);border:1px solid color-mix(in srgb,var(--kg-accent) 34%,transparent)}.kg-search{position:relative;width:210px;flex-shrink:1;min-width:120px}.kg-search-input{width:100%;height:28px;border:1px solid var(--kg-line);border-radius:8px;background:var(--kg-surface);color:var(--kg-text);font:inherit;font-size:var(--kg-fs-body);padding:0 10px;transition:border-color .12s}.kg-search-input::placeholder{color:var(--kg-muted)}.kg-search-input:focus{outline:none;border-color:color-mix(in srgb,var(--kg-accent) 50%,var(--kg-line))}.kg-search-menu{position:absolute;left:0;right:-60px;top:32px;z-index:60;max-height:320px;overflow-y:auto;background:var(--kg-panel);border:1px solid var(--kg-line);border-radius:8px;box-shadow:0 8px 26px color-mix(in srgb,var(--kg-text) 22%,transparent);padding:4px;display:flex;flex-direction:column;gap:1px}.kg-search-item{display:flex;align-items:center;gap:var(--kg-2);width:100%;min-width:0;border:0;background:transparent;color:var(--kg-text);font:inherit;font-size:var(--kg-fs-body);text-align:left;padding:6px 8px;border-radius:8px;cursor:pointer}.kg-search-item.active{background:color-mix(in srgb,var(--kg-accent) 10%,transparent)}.kg-search-name{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-weight:600}.kg-search-crumb{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;margin-left:auto;color:var(--kg-muted);font-size:var(--kg-fs-label)}.kg-search-none{padding:8px;font-size:var(--kg-fs-meta);color:var(--kg-muted);text-align:center}@container graph (max-width: 900px){.kg-tree,.kg-panel{position:absolute;top:0;bottom:0;z-index:40;box-shadow:0 0 18px #00000029}.kg-tree{left:0}.kg-panel{right:0}}.kg-connect-live .g-node{box-shadow:0 0 0 2px color-mix(in srgb,var(--node-color) 30%,transparent),0 3px 10px color-mix(in srgb,var(--kg-text) 12%,transparent)}.kg-connect-live .vue-flow__pane{cursor:crosshair}.kg-guides{position:absolute;inset:0;pointer-events:none;z-index:30;overflow:hidden}.kg-guide{position:absolute;background:color-mix(in srgb,var(--kg-accent) 75%,transparent)}.kg-guide.vertical{width:1px}.kg-guide:not(.vertical){height:1px}button:focus-visible,input:focus-visible,select:focus-visible,textarea:focus-visible,[tabindex]:focus-visible{outline:var(--p-focus-ring-width) var(--p-focus-ring-style) var(--p-focus-ring-color);outline-offset:var(--p-focus-ring-offset);box-shadow:var(--p-focus-ring-shadow)}input[type=checkbox],input[type=range]{accent-color:var(--p-primary-color)}.kg-theme-select{max-width:120px}.kg-colorrow{flex-wrap:wrap}.kg-icon-btn svg{width:16px;height:16px}.kg-chip,.kg-tagchip,.kg-mat-kind,.g-status,.g-clip,.g-badge,.g-tag{border-radius:6px}.kg-material,.kg-component-list{border-radius:14px}.kg-tree-count,.g-count{border-radius:999px}@container graph (max-width: 900px){.kg-top{flex-wrap:wrap}.kg-breadcrumbs{flex-basis:100%}.kg-actions{flex:1;min-width:0}.kg-search{flex:1}.kg-tree{width:160px}.kg-panel{width:280px}.kg-count,.kg-hint{display:none}.kg-actions{gap:var(--kg-1)}}', W2 = [G2, Y2, U2, q2, X2].join(`
`), K2 = {
  type: "object",
  properties: {
    "entry-id": {
      type: "string",
      default: "",
      description: "Workspace graph component id to load; an empty value renders the required-id error state."
    },
    "read-only": {
      type: "boolean",
      default: !1,
      description: "Disables editing while retaining full reading and inspection controls."
    },
    mode: {
      type: "string",
      default: "preview",
      description: "Rendering mode: preview for the compact read-focused canvas, or full for editing and navigation controls."
    }
  }
};
class j2 extends ah {
  static get wippyConfig() {
    return {
      propsSchema: K2,
      hostCssKeys: ["themeConfigUrl", "iframeCssUrl"],
      inlineCss: W2
    };
  }
  static get vueConfig() {
    return { rootComponent: F2 };
  }
}
If(import.meta.url, j2);
//# sourceMappingURL=index.js.map
