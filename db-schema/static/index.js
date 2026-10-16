import { hasInjectionContext as $l, inject as mt, effectScope as Ai, ref as _e, markRaw as Xt, createApp as Sl, getCurrentScope as ms, watch as Ne, provide as Rt, getCurrentInstance as on, defineComponent as Se, createPropsRestProxy as Nl, toRef as Ee, computed as ce, onMounted as st, openBlock as V, createElementBlock as te, normalizeClass as Ve, unref as K, renderSlot as Ie, useSlots as ys, onUnmounted as kl, createVNode as Re, withCtx as tt, reactive as Cl, onScopeDispose as Kn, nextTick as Ye, onBeforeMount as Ml, shallowRef as $t, createElementVNode as Z, Fragment as Pe, renderList as ot, normalizeStyle as Be, onBeforeUnmount as No, isMemoSame as Tl, createBlock as De, createCommentVNode as me, toDisplayString as Ce, isRef as Pi, toRefs as Il, customRef as Dl, toValue as be, resolveComponent as _s, h as $e, useAttrs as zi, mergeProps as ao, resolveDynamicComponent as Ct, createTextVNode as Jn, readonly as Al, watchEffect as Pl, normalizeProps as zl, withModifiers as Xo } from "vue";
import { addCollection as Ol } from "@iconify/vue";
import { config as ir, addIcons as Rl, on as ws, applyThemeMode as zn, host as Bl, hostCss as Vl, loadCss as Ll, api as rr, define as Hl } from "@wippy-fe/proxy";
var li = "data-wippy-visible";
function sr(e) {
  const t = e.getAttribute(li);
  return t === "true" ? !0 : t === "false" ? !1 : null;
}
var Fl = Object.defineProperty, Ul = (e, t, n) => t in e ? Fl(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n, Te = (e, t, n) => Ul(e, typeof t != "symbol" ? t + "" : t, n), Yl = [
  "themeConfigUrl",
  "primeVueCssUrl",
  "markdownCssUrl",
  "iframeCssUrl"
], Xl = [
  ":where([data-wippy-theme-root]).w-theme-light",
  ":where([data-wippy-theme-root]).w-theme-dark"
].join(`,
`);
function ar(e) {
  const t = e.startsWith("--") ? e : `--${e}`;
  return /^--[-\w\u0080-\uFFFF]+$/.test(t) ? t : null;
}
function Gl(...e) {
  const t = /* @__PURE__ */ new Set();
  for (const n of e)
    if (n)
      for (const [o, i] of Object.entries(n)) {
        if ((o === "@light" || o === "@dark") && i && typeof i == "object") {
          for (const [s, a] of Object.entries(i)) {
            const l = typeof a == "string" ? ar(s) : null;
            l && t.add(l);
          }
          continue;
        }
        const r = typeof i == "string" ? ar(o) : null;
        r && t.add(r);
      }
  return [...t].sort();
}
function ql(e) {
  if (e.length === 0)
    return "";
  const t = e.map((n) => `  ${n}: inherit;`).join(`
`);
  return `${Xl} {
${t}
}`;
}
function Wl(e, t) {
  const n = ql(t);
  n && bs(e, n, "@wippy-fe/css-variables-bridge");
}
function Zl(e, t) {
  const o = (t ?? Yl).map(async (i) => {
    const r = Vl[i];
    if (!r)
      return console.warn(`[wippy-fe/webcomponent-core] hostCss key "${i}" is undefined — skipping. Remove it from hostCssKeys if the CSS was removed.`), null;
    try {
      return await Ll(r);
    } catch (s) {
      return console.warn(`[wippy-fe/webcomponent-core] Failed to load hostCss "${i}" (${r}):`, s), null;
    }
  });
  return Promise.all(o).then((i) => {
    for (const r of i) {
      if (!r)
        continue;
      const s = document.createElement("style");
      s.textContent = r, s.setAttribute("role", "@wippy-fe/host-css"), e.appendChild(s);
    }
  });
}
function Kl(e, t) {
  const n = document.createElement("style");
  n.textContent = t, e.appendChild(n);
}
function bs(e, t, n) {
  if (typeof CSSStyleSheet < "u" && "replaceSync" in CSSStyleSheet.prototype) {
    const i = new CSSStyleSheet();
    i.replaceSync(t), e.adoptedStyleSheets = [...e.adoptedStyleSheets, i];
    return;
  }
  const o = document.createElement("style");
  o.setAttribute("role", n), o.textContent = t, e.appendChild(o);
}
function Jl(e, t) {
  bs(e, t, "@wippy-fe/custom-css");
}
function xs(e) {
  return e.__wippyHost ?? null;
}
function Ql(e) {
  return e.replace(/-([a-z])/g, (t, n) => n.toUpperCase());
}
function jl(e, t, n) {
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
function Go(e, t) {
  const n = {}, o = [];
  for (const [i, r] of Object.entries(t.properties)) {
    const s = e.getAttribute(i), a = Ql(i);
    if (s === null) {
      r.default !== void 0 && (n[a] = r.default);
      continue;
    }
    const l = jl(i, s, r);
    l.error ? o.push(l.error) : n[a] = l.value;
  }
  return { props: n, errors: o };
}
var eu = class {
  constructor(e, t) {
    Te(this, "_props"), Te(this, "_errors"), Te(this, "_content"), Te(this, "_hostVisibility"), Te(this, "_propsListeners", /* @__PURE__ */ new Set()), Te(this, "_contentListeners", /* @__PURE__ */ new Set()), Te(this, "_hostVisibilityListeners", /* @__PURE__ */ new Set()), Te(this, "_disposed", !1), Te(this, "_emitToDom"), Te(this, "props"), Te(this, "events"), Te(this, "content"), Te(this, "hostVisibility"), this._props = e.props, this._errors = e.errors, this._content = e.content, this._hostVisibility = e.hostVisibility, this._emitToDom = t;
    const n = this;
    this.props = {
      get value() {
        return n._props;
      },
      get errors() {
        return n._errors;
      },
      subscribe(o, i) {
        return n._subscribeProps(o, i);
      }
    }, this.events = {
      emit(o, i) {
        n._disposed || n._emitToDom(o, i);
      }
    }, this.content = e.hasContent ? {
      get value() {
        return n._content;
      },
      subscribe(o, i) {
        return n._subscribeContent(o, i);
      }
    } : null, this.hostVisibility = {
      get value() {
        return n._hostVisibility;
      },
      subscribe(o, i) {
        return n._subscribeHostVisibility(o, i);
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
}, tu = class extends HTMLElement {
  constructor() {
    super(), Te(this, "_internals"), Te(this, "_contentObserver", null), Te(this, "_initialized", !1), Te(this, "_container", null), Te(this, "_reactive", null), Te(this, "_lastProps", null), Te(this, "_lastErrors", []), Te(this, "_lastContent", null), Te(this, "_themeUnsub", null), Te(this, "_hostVisible", null), this._internals = this.attachInternals(), this._hostVisible = sr(this);
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
    return [.../* @__PURE__ */ new Set([...t, ...n, li])];
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
    return xs(this);
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
        const r = Go(this, e.propsSchema);
        e.validateProps && r.errors.push(...e.validateProps(r.props)), n = r.props, o = r.errors, this._lastProps = n, this._lastErrors = o;
      }
      const i = t ? this._lastContent ?? this._extractContent(e.contentTemplate) : null;
      t && this._lastContent === null && (this._lastContent = i), this._reactive = new eu(
        { props: n, errors: o, content: i, hasContent: t, hostVisibility: this._hostVisible },
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
        this.onInit(n), e.inlineCss && Kl(n, e.inlineCss);
        try {
          const u = ir?.theming, c = Gl(
            u?.global?.cssVariables,
            u?.children?.cssVariables
          );
          Wl(n, c);
        } catch {
        }
        if (e.customCss !== !1)
          try {
            const u = ir?.theming, c = [u?.global?.customCSS, u?.children?.customCSS].filter(Boolean).join(`
`);
            c && Jl(n, c);
          } catch {
          }
        (e.hostCssKeys === void 0 || e.hostCssKeys.length > 0) && Zl(n, e.hostCssKeys), o = document.createElement("div"), o.setAttribute("data-wippy-theme-root", "");
        const l = e.containerClasses ?? [];
        l.length > 0 && o.classList.add(...l), n.appendChild(o), this._container = o, Rl(Ol);
      }
      this._applyTheme(), this._themeUnsub || (this._themeUnsub = ws("@theme", (l) => this._applyTheme(l)));
      const { props: i, errors: r } = Go(this, e.propsSchema);
      e.validateProps && r.push(...e.validateProps(i));
      const s = i;
      this._lastProps = s, this._lastErrors = r;
      let a = null;
      e.contentTemplate && (a = this._extractContent(e.contentTemplate), this._lastContent = a, this._contentObserver = new MutationObserver(() => {
        const l = this._extractContent(e.contentTemplate);
        this._lastContent = l, this._reactive?.notifyContent(l), this.onContentChanged(l);
      }), this._contentObserver.observe(this, {
        childList: !0,
        characterData: !0,
        subtree: !0
      })), this.onMount(n, o, s, r, a, t), this._internals.states.delete("loading"), this._internals.states.add("ready"), t || (this._initialized = !0), this.onReady(), this.emitEvent("load");
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
  _applyTheme(e = Bl.getThemeMode?.()) {
    zn(e, this), this._container && zn(e, this._container);
  }
  disconnectedCallback() {
    this._themeUnsub && (this._themeUnsub(), this._themeUnsub = null), zn("auto", this), this._container && zn("auto", this._container), this._contentObserver && (this._contentObserver.disconnect(), this._contentObserver = null), this.onUnmount(), this.emitEvent("unload"), this._internals.states.clear(), this._reactive?.dispose(), this._reactive = null, this._lastProps = null, this._lastErrors = [], this._lastContent = null, delete this.__wippyHost, delete this.__wippyHostBus;
  }
  attributeChangedCallback(e, t, n) {
    if (t === n)
      return;
    if (e === li) {
      const a = this._hostVisible, l = sr(this);
      if (l === a)
        return;
      this._hostVisible = l, this.isConnected && this._initialized && (this._reactive?.notifyHostVisibility(l, a), this.onHostVisibilityChanged(l, a));
      return;
    }
    const o = this.constructor.wippyConfig, { props: i, errors: r } = Go(this, o.propsSchema);
    o.validateProps && r.push(...o.validateProps(i));
    const s = i;
    this._lastProps = s, this._lastErrors = r, this._reactive?.notifyProps(s, r), this.onPropsChanged(s, r);
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
function nu(e) {
  return e.__wippyHostBus ?? null;
}
function ou(e) {
  return e.dataset.wippyPanelId ?? null;
}
/*!
 * pinia v4.0.3
 * (c) 2026 Eduardo San Martin Morote
 * @license MIT
 */
let Es;
const $s = (e) => Es = e, iu = () => $l() && mt(Ss) || Es, Ss = (
  /* istanbul ignore next */
  Symbol()
);
function ru() {
  const e = Ai(!0), t = e.run(() => _e({}));
  let n = [], o = [];
  const i = Xt({
    install(r) {
      $s(i), i._a = r, r.provide(Ss, i), r.config.globalProperties.$pinia = i, o.forEach((s) => n.push(s)), o = [];
    },
    use(r) {
      return this._a ? n.push(r) : o.push(r), this;
    },
    _p: n,
    _a: null,
    _e: e,
    _s: /* @__PURE__ */ new Map(),
    state: t
  });
  return i;
}
var su = Object.defineProperty, au = (e, t, n) => t in e ? su(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n, Ft = (e, t, n) => au(e, typeof t != "symbol" ? t + "" : t, n), lu = /* @__PURE__ */ Symbol("wippy:emit"), Ns = /* @__PURE__ */ Symbol("wippy:props"), uu = /* @__PURE__ */ Symbol("wippy:props_error"), cu = /* @__PURE__ */ Symbol("wippy:content"), du = /* @__PURE__ */ Symbol("wippy:panel-id"), fu = /* @__PURE__ */ Symbol("wippy:layout-bus"), hu = /* @__PURE__ */ Symbol("wippy:host"), pu = /* @__PURE__ */ Symbol("wippy:host-visibility");
function vu() {
  const e = mt(Ns);
  if (!e)
    throw new Error("useProps() must be called inside a WippyVueElement");
  return e;
}
var gu = class extends tu {
  constructor() {
    super(...arguments), Ft(this, "_vueApp", null), Ft(this, "_propsRef", _e({})), Ft(this, "_errorsRef", _e([])), Ft(this, "_contentRef", _e(null)), Ft(this, "_hostVisibilityRef", _e(null)), Ft(this, "_bridgeAbort", null);
  }
  /**
   * Override to provide Vue-specific configuration.
   */
  static get vueConfig() {
    throw new Error("WippyVueElement subclass must override static get vueConfig()");
  }
  onMount(e, t, n, o, i, r) {
    const s = this.constructor.vueConfig;
    this._propsRef.value = n, this._errorsRef.value = o, this._contentRef.value = i ?? null, this._hostVisibilityRef.value = this.hostVisible;
    for (const u of o)
      this.emitEvent("invalid", { message: u });
    const a = new AbortController();
    this._bridgeAbort = a, this.reactive.props.subscribe((u, c) => {
      this._propsRef.value = u, this._errorsRef.value = [...c];
      for (const d of c)
        this.emitEvent("invalid", { message: d });
    }, { signal: a.signal }), this.reactive.content && this.reactive.content.subscribe((u) => {
      this._contentRef.value = u;
    }, { signal: a.signal }), this.reactive.hostVisibility.subscribe((u) => {
      this._hostVisibilityRef.value = u;
    }, { signal: a.signal });
    const l = (u) => {
      if (a.signal.aborted)
        return;
      const c = iu(), d = Sl(u.rootComponent);
      this._vueApp = d;
      const h = ru();
      if (u.piniaPlugins)
        for (const p of u.piniaPlugins)
          h.use(p);
      if (d.use(h), u.plugins)
        for (const p of u.plugins)
          d.use(p);
      d.provide(Ns, this._propsRef), d.provide(uu, this._errorsRef), d.provide(lu, this.emitEvent.bind(this)), d.provide(cu, this._contentRef), d.provide(pu, this._hostVisibilityRef), d.provide(du, ou(this)), d.provide(fu, nu(this)), d.provide(hu, xs(this)), u.providers && u.providers(d, this), d.mount(t), c && $s(c);
    };
    if (s.rootComponent)
      l(s);
    else if (s.lazyConfig) {
      const u = document.createElement("wippy-loading");
      u.setAttribute("no-bg", ""), t.appendChild(u), s.lazyConfig().then((c) => {
        a.signal.aborted || (u.remove(), l(c));
      }).catch((c) => {
        if (a.signal.aborted)
          return;
        const d = c instanceof Error ? c.message : String(c), h = document.createElement("wippy-error");
        h.setAttribute("title", "Failed to load"), h.setAttribute("message", d), u.replaceWith(h), this.emitEvent("error", { message: d });
      });
    } else
      throw new Error("WippyVueElement vueConfig must provide rootComponent or lazyConfig");
  }
  onUnmount() {
    this._bridgeAbort?.abort(), this._bridgeAbort = null, this._vueApp && (this._vueApp.unmount(), this._vueApp = null);
  }
};
function mn(e) {
  return ms() ? (Kn(e), !0) : !1;
}
function dt(e) {
  return typeof e == "function" ? e() : K(e);
}
const mu = typeof window < "u" && typeof document < "u", yu = (e) => typeof e < "u", _u = Object.prototype.toString, wu = (e) => _u.call(e) === "[object Object]", bu = () => {
};
function xu(e, t) {
  function n(...o) {
    return new Promise((i, r) => {
      Promise.resolve(e(() => t.apply(this, o), { fn: t, thisArg: this, args: o })).then(i).catch(r);
    });
  }
  return n;
}
const ks = (e) => e();
function Eu(e = ks) {
  const t = _e(!0);
  function n() {
    t.value = !1;
  }
  function o() {
    t.value = !0;
  }
  const i = (...r) => {
    t.value && e(...r);
  };
  return { isActive: Al(t), pause: n, resume: o, eventFilter: i };
}
function lr(e, t = !1, n = "Timeout") {
  return new Promise((o, i) => {
    setTimeout(t ? () => i(n) : o, e);
  });
}
function $u(e, t, n = {}) {
  const {
    eventFilter: o = ks,
    ...i
  } = n;
  return Ne(
    e,
    xu(
      o,
      t
    ),
    i
  );
}
function Ut(e, t, n = {}) {
  const {
    eventFilter: o,
    ...i
  } = n, { eventFilter: r, pause: s, resume: a, isActive: l } = Eu(o);
  return { stop: $u(
    e,
    t,
    {
      ...i,
      eventFilter: r
    }
  ), pause: s, resume: a, isActive: l };
}
function Su(e, t = {}) {
  if (!Pi(e))
    return Il(e);
  const n = Array.isArray(e.value) ? Array.from({ length: e.value.length }) : {};
  for (const o in e.value)
    n[o] = Dl(() => ({
      get() {
        return e.value[o];
      },
      set(i) {
        var r;
        if ((r = dt(t.replaceRef)) != null ? r : !0)
          if (Array.isArray(e.value)) {
            const a = [...e.value];
            a[o] = i, e.value = a;
          } else {
            const a = { ...e.value, [o]: i };
            Object.setPrototypeOf(a, Object.getPrototypeOf(e.value)), e.value = a;
          }
        else
          e.value[o] = i;
      }
    }));
  return n;
}
function ui(e, t = !1) {
  function n(d, { flush: h = "sync", deep: p = !1, timeout: E, throwOnTimeout: b } = {}) {
    let S = null;
    const P = [new Promise((y) => {
      S = Ne(
        e,
        ($) => {
          d($) !== t && (S?.(), y($));
        },
        {
          flush: h,
          deep: p,
          immediate: !0
        }
      );
    })];
    return E != null && P.push(
      lr(E, b).then(() => dt(e)).finally(() => S?.())
    ), Promise.race(P);
  }
  function o(d, h) {
    if (!Pi(d))
      return n(($) => $ === d, h);
    const { flush: p = "sync", deep: E = !1, timeout: b, throwOnTimeout: S } = h ?? {};
    let _ = null;
    const y = [new Promise(($) => {
      _ = Ne(
        [e, d],
        ([R, U]) => {
          t !== (R === U) && (_?.(), $(R));
        },
        {
          flush: p,
          deep: E,
          immediate: !0
        }
      );
    })];
    return b != null && y.push(
      lr(b, S).then(() => dt(e)).finally(() => (_?.(), dt(e)))
    ), Promise.race(y);
  }
  function i(d) {
    return n((h) => !!h, d);
  }
  function r(d) {
    return o(null, d);
  }
  function s(d) {
    return o(void 0, d);
  }
  function a(d) {
    return n(Number.isNaN, d);
  }
  function l(d, h) {
    return n((p) => {
      const E = Array.from(p);
      return E.includes(d) || E.includes(dt(d));
    }, h);
  }
  function u(d) {
    return c(1, d);
  }
  function c(d = 1, h) {
    let p = -1;
    return n(() => (p += 1, p >= d), h);
  }
  return Array.isArray(dt(e)) ? {
    toMatch: n,
    toContains: l,
    changed: u,
    changedTimes: c,
    get not() {
      return ui(e, !t);
    }
  } : {
    toMatch: n,
    toBe: o,
    toBeTruthy: i,
    toBeNull: r,
    toBeNaN: a,
    toBeUndefined: s,
    changed: u,
    changedTimes: c,
    get not() {
      return ui(e, !t);
    }
  };
}
function ci(e) {
  return ui(e);
}
function Nu(e) {
  var t;
  const n = dt(e);
  return (t = n?.$el) != null ? t : n;
}
const Cs = mu ? window : void 0;
function Ms(...e) {
  let t, n, o, i;
  if (typeof e[0] == "string" || Array.isArray(e[0]) ? ([n, o, i] = e, t = Cs) : [t, n, o, i] = e, !t)
    return bu;
  Array.isArray(n) || (n = [n]), Array.isArray(o) || (o = [o]);
  const r = [], s = () => {
    r.forEach((c) => c()), r.length = 0;
  }, a = (c, d, h, p) => (c.addEventListener(d, h, p), () => c.removeEventListener(d, h, p)), l = Ne(
    () => [Nu(t), dt(i)],
    ([c, d]) => {
      if (s(), !c)
        return;
      const h = wu(d) ? { ...d } : d;
      r.push(
        ...n.flatMap((p) => o.map((E) => a(c, p, E, h)))
      );
    },
    { immediate: !0, flush: "post" }
  ), u = () => {
    l(), s();
  };
  return mn(u), u;
}
function ku(e) {
  return typeof e == "function" ? e : typeof e == "string" ? (t) => t.key === e : Array.isArray(e) ? (t) => e.includes(t.key) : () => !0;
}
function ur(...e) {
  let t, n, o = {};
  e.length === 3 ? (t = e[0], n = e[1], o = e[2]) : e.length === 2 ? typeof e[1] == "object" ? (t = !0, n = e[0], o = e[1]) : (t = e[0], n = e[1]) : (t = !0, n = e[0]);
  const {
    target: i = Cs,
    eventName: r = "keydown",
    passive: s = !1,
    dedupe: a = !1
  } = o, l = ku(t);
  return Ms(i, r, (c) => {
    c.repeat && dt(a) || l(c) && n(c);
  }, s);
}
function Cu(e) {
  return JSON.parse(JSON.stringify(e));
}
function qo(e, t, n, o = {}) {
  var i, r, s;
  const {
    clone: a = !1,
    passive: l = !1,
    eventName: u,
    deep: c = !1,
    defaultValue: d,
    shouldEmit: h
  } = o, p = on(), E = n || p?.emit || ((i = p?.$emit) == null ? void 0 : i.bind(p)) || ((s = (r = p?.proxy) == null ? void 0 : r.$emit) == null ? void 0 : s.bind(p?.proxy));
  let b = u;
  t || (t = "modelValue"), b = b || `update:${t.toString()}`;
  const S = (y) => a ? typeof a == "function" ? a(y) : Cu(y) : y, _ = () => yu(e[t]) ? S(e[t]) : d, P = (y) => {
    h ? h(y) && E(b, y) : E(b, y);
  };
  if (l) {
    const y = _(), $ = _e(y);
    let R = !1;
    return Ne(
      () => e[t],
      (U) => {
        R || (R = !0, $.value = S(U), Ye(() => R = !1));
      }
    ), Ne(
      $,
      (U) => {
        !R && (U !== e[t] || c) && P(U);
      },
      { deep: c }
    ), $;
  } else
    return ce({
      get() {
        return _();
      },
      set(y) {
        P(y);
      }
    });
}
var Mu = { value: () => {
} };
function ko() {
  for (var e = 0, t = arguments.length, n = {}, o; e < t; ++e) {
    if (!(o = arguments[e] + "") || o in n || /[\s.]/.test(o))
      throw new Error("illegal type: " + o);
    n[o] = [];
  }
  return new Qn(n);
}
function Qn(e) {
  this._ = e;
}
function Tu(e, t) {
  return e.trim().split(/^|\s+/).map(function(n) {
    var o = "", i = n.indexOf(".");
    if (i >= 0 && (o = n.slice(i + 1), n = n.slice(0, i)), n && !t.hasOwnProperty(n))
      throw new Error("unknown type: " + n);
    return { type: n, name: o };
  });
}
Qn.prototype = ko.prototype = {
  constructor: Qn,
  on: function(e, t) {
    var n = this._, o = Tu(e + "", n), i, r = -1, s = o.length;
    if (arguments.length < 2) {
      for (; ++r < s; )
        if ((i = (e = o[r]).type) && (i = Iu(n[i], e.name)))
          return i;
      return;
    }
    if (t != null && typeof t != "function")
      throw new Error("invalid callback: " + t);
    for (; ++r < s; )
      if (i = (e = o[r]).type)
        n[i] = cr(n[i], e.name, t);
      else if (t == null)
        for (i in n)
          n[i] = cr(n[i], e.name, null);
    return this;
  },
  copy: function() {
    var e = {}, t = this._;
    for (var n in t)
      e[n] = t[n].slice();
    return new Qn(e);
  },
  call: function(e, t) {
    if ((i = arguments.length - 2) > 0)
      for (var n = new Array(i), o = 0, i, r; o < i; ++o)
        n[o] = arguments[o + 2];
    if (!this._.hasOwnProperty(e))
      throw new Error("unknown type: " + e);
    for (r = this._[e], o = 0, i = r.length; o < i; ++o)
      r[o].value.apply(t, n);
  },
  apply: function(e, t, n) {
    if (!this._.hasOwnProperty(e))
      throw new Error("unknown type: " + e);
    for (var o = this._[e], i = 0, r = o.length; i < r; ++i)
      o[i].value.apply(t, n);
  }
};
function Iu(e, t) {
  for (var n = 0, o = e.length, i; n < o; ++n)
    if ((i = e[n]).name === t)
      return i.value;
}
function cr(e, t, n) {
  for (var o = 0, i = e.length; o < i; ++o)
    if (e[o].name === t) {
      e[o] = Mu, e = e.slice(0, o).concat(e.slice(o + 1));
      break;
    }
  return n != null && e.push({ name: t, value: n }), e;
}
var di = "http://www.w3.org/1999/xhtml";
const dr = {
  svg: "http://www.w3.org/2000/svg",
  xhtml: di,
  xlink: "http://www.w3.org/1999/xlink",
  xml: "http://www.w3.org/XML/1998/namespace",
  xmlns: "http://www.w3.org/2000/xmlns/"
};
function Co(e) {
  var t = e += "", n = t.indexOf(":");
  return n >= 0 && (t = e.slice(0, n)) !== "xmlns" && (e = e.slice(n + 1)), dr.hasOwnProperty(t) ? { space: dr[t], local: e } : e;
}
function Du(e) {
  return function() {
    var t = this.ownerDocument, n = this.namespaceURI;
    return n === di && t.documentElement.namespaceURI === di ? t.createElement(e) : t.createElementNS(n, e);
  };
}
function Au(e) {
  return function() {
    return this.ownerDocument.createElementNS(e.space, e.local);
  };
}
function Ts(e) {
  var t = Co(e);
  return (t.local ? Au : Du)(t);
}
function Pu() {
}
function Oi(e) {
  return e == null ? Pu : function() {
    return this.querySelector(e);
  };
}
function zu(e) {
  typeof e != "function" && (e = Oi(e));
  for (var t = this._groups, n = t.length, o = new Array(n), i = 0; i < n; ++i)
    for (var r = t[i], s = r.length, a = o[i] = new Array(s), l, u, c = 0; c < s; ++c)
      (l = r[c]) && (u = e.call(l, l.__data__, c, r)) && ("__data__" in l && (u.__data__ = l.__data__), a[c] = u);
  return new Xe(o, this._parents);
}
function Ou(e) {
  return e == null ? [] : Array.isArray(e) ? e : Array.from(e);
}
function Ru() {
  return [];
}
function Is(e) {
  return e == null ? Ru : function() {
    return this.querySelectorAll(e);
  };
}
function Bu(e) {
  return function() {
    return Ou(e.apply(this, arguments));
  };
}
function Vu(e) {
  typeof e == "function" ? e = Bu(e) : e = Is(e);
  for (var t = this._groups, n = t.length, o = [], i = [], r = 0; r < n; ++r)
    for (var s = t[r], a = s.length, l, u = 0; u < a; ++u)
      (l = s[u]) && (o.push(e.call(l, l.__data__, u, s)), i.push(l));
  return new Xe(o, i);
}
function Ds(e) {
  return function() {
    return this.matches(e);
  };
}
function As(e) {
  return function(t) {
    return t.matches(e);
  };
}
var Lu = Array.prototype.find;
function Hu(e) {
  return function() {
    return Lu.call(this.children, e);
  };
}
function Fu() {
  return this.firstElementChild;
}
function Uu(e) {
  return this.select(e == null ? Fu : Hu(typeof e == "function" ? e : As(e)));
}
var Yu = Array.prototype.filter;
function Xu() {
  return Array.from(this.children);
}
function Gu(e) {
  return function() {
    return Yu.call(this.children, e);
  };
}
function qu(e) {
  return this.selectAll(e == null ? Xu : Gu(typeof e == "function" ? e : As(e)));
}
function Wu(e) {
  typeof e != "function" && (e = Ds(e));
  for (var t = this._groups, n = t.length, o = new Array(n), i = 0; i < n; ++i)
    for (var r = t[i], s = r.length, a = o[i] = [], l, u = 0; u < s; ++u)
      (l = r[u]) && e.call(l, l.__data__, u, r) && a.push(l);
  return new Xe(o, this._parents);
}
function Ps(e) {
  return new Array(e.length);
}
function Zu() {
  return new Xe(this._enter || this._groups.map(Ps), this._parents);
}
function lo(e, t) {
  this.ownerDocument = e.ownerDocument, this.namespaceURI = e.namespaceURI, this._next = null, this._parent = e, this.__data__ = t;
}
lo.prototype = {
  constructor: lo,
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
function Ku(e) {
  return function() {
    return e;
  };
}
function Ju(e, t, n, o, i, r) {
  for (var s = 0, a, l = t.length, u = r.length; s < u; ++s)
    (a = t[s]) ? (a.__data__ = r[s], o[s] = a) : n[s] = new lo(e, r[s]);
  for (; s < l; ++s)
    (a = t[s]) && (i[s] = a);
}
function Qu(e, t, n, o, i, r, s) {
  var a, l, u = /* @__PURE__ */ new Map(), c = t.length, d = r.length, h = new Array(c), p;
  for (a = 0; a < c; ++a)
    (l = t[a]) && (h[a] = p = s.call(l, l.__data__, a, t) + "", u.has(p) ? i[a] = l : u.set(p, l));
  for (a = 0; a < d; ++a)
    p = s.call(e, r[a], a, r) + "", (l = u.get(p)) ? (o[a] = l, l.__data__ = r[a], u.delete(p)) : n[a] = new lo(e, r[a]);
  for (a = 0; a < c; ++a)
    (l = t[a]) && u.get(h[a]) === l && (i[a] = l);
}
function ju(e) {
  return e.__data__;
}
function ec(e, t) {
  if (!arguments.length)
    return Array.from(this, ju);
  var n = t ? Qu : Ju, o = this._parents, i = this._groups;
  typeof e != "function" && (e = Ku(e));
  for (var r = i.length, s = new Array(r), a = new Array(r), l = new Array(r), u = 0; u < r; ++u) {
    var c = o[u], d = i[u], h = d.length, p = tc(e.call(c, c && c.__data__, u, o)), E = p.length, b = a[u] = new Array(E), S = s[u] = new Array(E), _ = l[u] = new Array(h);
    n(c, d, b, S, _, p, t);
    for (var P = 0, y = 0, $, R; P < E; ++P)
      if ($ = b[P]) {
        for (P >= y && (y = P + 1); !(R = S[y]) && ++y < E; )
          ;
        $._next = R || null;
      }
  }
  return s = new Xe(s, o), s._enter = a, s._exit = l, s;
}
function tc(e) {
  return typeof e == "object" && "length" in e ? e : Array.from(e);
}
function nc() {
  return new Xe(this._exit || this._groups.map(Ps), this._parents);
}
function oc(e, t, n) {
  var o = this.enter(), i = this, r = this.exit();
  return typeof e == "function" ? (o = e(o), o && (o = o.selection())) : o = o.append(e + ""), t != null && (i = t(i), i && (i = i.selection())), n == null ? r.remove() : n(r), o && i ? o.merge(i).order() : i;
}
function ic(e) {
  for (var t = e.selection ? e.selection() : e, n = this._groups, o = t._groups, i = n.length, r = o.length, s = Math.min(i, r), a = new Array(i), l = 0; l < s; ++l)
    for (var u = n[l], c = o[l], d = u.length, h = a[l] = new Array(d), p, E = 0; E < d; ++E)
      (p = u[E] || c[E]) && (h[E] = p);
  for (; l < i; ++l)
    a[l] = n[l];
  return new Xe(a, this._parents);
}
function rc() {
  for (var e = this._groups, t = -1, n = e.length; ++t < n; )
    for (var o = e[t], i = o.length - 1, r = o[i], s; --i >= 0; )
      (s = o[i]) && (r && s.compareDocumentPosition(r) ^ 4 && r.parentNode.insertBefore(s, r), r = s);
  return this;
}
function sc(e) {
  e || (e = ac);
  function t(d, h) {
    return d && h ? e(d.__data__, h.__data__) : !d - !h;
  }
  for (var n = this._groups, o = n.length, i = new Array(o), r = 0; r < o; ++r) {
    for (var s = n[r], a = s.length, l = i[r] = new Array(a), u, c = 0; c < a; ++c)
      (u = s[c]) && (l[c] = u);
    l.sort(t);
  }
  return new Xe(i, this._parents).order();
}
function ac(e, t) {
  return e < t ? -1 : e > t ? 1 : e >= t ? 0 : NaN;
}
function lc() {
  var e = arguments[0];
  return arguments[0] = this, e.apply(null, arguments), this;
}
function uc() {
  return Array.from(this);
}
function cc() {
  for (var e = this._groups, t = 0, n = e.length; t < n; ++t)
    for (var o = e[t], i = 0, r = o.length; i < r; ++i) {
      var s = o[i];
      if (s)
        return s;
    }
  return null;
}
function dc() {
  let e = 0;
  for (const t of this)
    ++e;
  return e;
}
function fc() {
  return !this.node();
}
function hc(e) {
  for (var t = this._groups, n = 0, o = t.length; n < o; ++n)
    for (var i = t[n], r = 0, s = i.length, a; r < s; ++r)
      (a = i[r]) && e.call(a, a.__data__, r, i);
  return this;
}
function pc(e) {
  return function() {
    this.removeAttribute(e);
  };
}
function vc(e) {
  return function() {
    this.removeAttributeNS(e.space, e.local);
  };
}
function gc(e, t) {
  return function() {
    this.setAttribute(e, t);
  };
}
function mc(e, t) {
  return function() {
    this.setAttributeNS(e.space, e.local, t);
  };
}
function yc(e, t) {
  return function() {
    var n = t.apply(this, arguments);
    n == null ? this.removeAttribute(e) : this.setAttribute(e, n);
  };
}
function _c(e, t) {
  return function() {
    var n = t.apply(this, arguments);
    n == null ? this.removeAttributeNS(e.space, e.local) : this.setAttributeNS(e.space, e.local, n);
  };
}
function wc(e, t) {
  var n = Co(e);
  if (arguments.length < 2) {
    var o = this.node();
    return n.local ? o.getAttributeNS(n.space, n.local) : o.getAttribute(n);
  }
  return this.each((t == null ? n.local ? vc : pc : typeof t == "function" ? n.local ? _c : yc : n.local ? mc : gc)(n, t));
}
function zs(e) {
  return e.ownerDocument && e.ownerDocument.defaultView || e.document && e || e.defaultView;
}
function bc(e) {
  return function() {
    this.style.removeProperty(e);
  };
}
function xc(e, t, n) {
  return function() {
    this.style.setProperty(e, t, n);
  };
}
function Ec(e, t, n) {
  return function() {
    var o = t.apply(this, arguments);
    o == null ? this.style.removeProperty(e) : this.style.setProperty(e, o, n);
  };
}
function $c(e, t, n) {
  return arguments.length > 1 ? this.each((t == null ? bc : typeof t == "function" ? Ec : xc)(e, t, n ?? "")) : Kt(this.node(), e);
}
function Kt(e, t) {
  return e.style.getPropertyValue(t) || zs(e).getComputedStyle(e, null).getPropertyValue(t);
}
function Sc(e) {
  return function() {
    delete this[e];
  };
}
function Nc(e, t) {
  return function() {
    this[e] = t;
  };
}
function kc(e, t) {
  return function() {
    var n = t.apply(this, arguments);
    n == null ? delete this[e] : this[e] = n;
  };
}
function Cc(e, t) {
  return arguments.length > 1 ? this.each((t == null ? Sc : typeof t == "function" ? kc : Nc)(e, t)) : this.node()[e];
}
function Os(e) {
  return e.trim().split(/^|\s+/);
}
function Ri(e) {
  return e.classList || new Rs(e);
}
function Rs(e) {
  this._node = e, this._names = Os(e.getAttribute("class") || "");
}
Rs.prototype = {
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
function Bs(e, t) {
  for (var n = Ri(e), o = -1, i = t.length; ++o < i; )
    n.add(t[o]);
}
function Vs(e, t) {
  for (var n = Ri(e), o = -1, i = t.length; ++o < i; )
    n.remove(t[o]);
}
function Mc(e) {
  return function() {
    Bs(this, e);
  };
}
function Tc(e) {
  return function() {
    Vs(this, e);
  };
}
function Ic(e, t) {
  return function() {
    (t.apply(this, arguments) ? Bs : Vs)(this, e);
  };
}
function Dc(e, t) {
  var n = Os(e + "");
  if (arguments.length < 2) {
    for (var o = Ri(this.node()), i = -1, r = n.length; ++i < r; )
      if (!o.contains(n[i]))
        return !1;
    return !0;
  }
  return this.each((typeof t == "function" ? Ic : t ? Mc : Tc)(n, t));
}
function Ac() {
  this.textContent = "";
}
function Pc(e) {
  return function() {
    this.textContent = e;
  };
}
function zc(e) {
  return function() {
    var t = e.apply(this, arguments);
    this.textContent = t ?? "";
  };
}
function Oc(e) {
  return arguments.length ? this.each(e == null ? Ac : (typeof e == "function" ? zc : Pc)(e)) : this.node().textContent;
}
function Rc() {
  this.innerHTML = "";
}
function Bc(e) {
  return function() {
    this.innerHTML = e;
  };
}
function Vc(e) {
  return function() {
    var t = e.apply(this, arguments);
    this.innerHTML = t ?? "";
  };
}
function Lc(e) {
  return arguments.length ? this.each(e == null ? Rc : (typeof e == "function" ? Vc : Bc)(e)) : this.node().innerHTML;
}
function Hc() {
  this.nextSibling && this.parentNode.appendChild(this);
}
function Fc() {
  return this.each(Hc);
}
function Uc() {
  this.previousSibling && this.parentNode.insertBefore(this, this.parentNode.firstChild);
}
function Yc() {
  return this.each(Uc);
}
function Xc(e) {
  var t = typeof e == "function" ? e : Ts(e);
  return this.select(function() {
    return this.appendChild(t.apply(this, arguments));
  });
}
function Gc() {
  return null;
}
function qc(e, t) {
  var n = typeof e == "function" ? e : Ts(e), o = t == null ? Gc : typeof t == "function" ? t : Oi(t);
  return this.select(function() {
    return this.insertBefore(n.apply(this, arguments), o.apply(this, arguments) || null);
  });
}
function Wc() {
  var e = this.parentNode;
  e && e.removeChild(this);
}
function Zc() {
  return this.each(Wc);
}
function Kc() {
  var e = this.cloneNode(!1), t = this.parentNode;
  return t ? t.insertBefore(e, this.nextSibling) : e;
}
function Jc() {
  var e = this.cloneNode(!0), t = this.parentNode;
  return t ? t.insertBefore(e, this.nextSibling) : e;
}
function Qc(e) {
  return this.select(e ? Jc : Kc);
}
function jc(e) {
  return arguments.length ? this.property("__data__", e) : this.node().__data__;
}
function ed(e) {
  return function(t) {
    e.call(this, t, this.__data__);
  };
}
function td(e) {
  return e.trim().split(/^|\s+/).map(function(t) {
    var n = "", o = t.indexOf(".");
    return o >= 0 && (n = t.slice(o + 1), t = t.slice(0, o)), { type: t, name: n };
  });
}
function nd(e) {
  return function() {
    var t = this.__on;
    if (t) {
      for (var n = 0, o = -1, i = t.length, r; n < i; ++n)
        r = t[n], (!e.type || r.type === e.type) && r.name === e.name ? this.removeEventListener(r.type, r.listener, r.options) : t[++o] = r;
      ++o ? t.length = o : delete this.__on;
    }
  };
}
function od(e, t, n) {
  return function() {
    var o = this.__on, i, r = ed(t);
    if (o) {
      for (var s = 0, a = o.length; s < a; ++s)
        if ((i = o[s]).type === e.type && i.name === e.name) {
          this.removeEventListener(i.type, i.listener, i.options), this.addEventListener(i.type, i.listener = r, i.options = n), i.value = t;
          return;
        }
    }
    this.addEventListener(e.type, r, n), i = { type: e.type, name: e.name, value: t, listener: r, options: n }, o ? o.push(i) : this.__on = [i];
  };
}
function id(e, t, n) {
  var o = td(e + ""), i, r = o.length, s;
  if (arguments.length < 2) {
    var a = this.node().__on;
    if (a) {
      for (var l = 0, u = a.length, c; l < u; ++l)
        for (i = 0, c = a[l]; i < r; ++i)
          if ((s = o[i]).type === c.type && s.name === c.name)
            return c.value;
    }
    return;
  }
  for (a = t ? od : nd, i = 0; i < r; ++i)
    this.each(a(o[i], t, n));
  return this;
}
function Ls(e, t, n) {
  var o = zs(e), i = o.CustomEvent;
  typeof i == "function" ? i = new i(t, n) : (i = o.document.createEvent("Event"), n ? (i.initEvent(t, n.bubbles, n.cancelable), i.detail = n.detail) : i.initEvent(t, !1, !1)), e.dispatchEvent(i);
}
function rd(e, t) {
  return function() {
    return Ls(this, e, t);
  };
}
function sd(e, t) {
  return function() {
    return Ls(this, e, t.apply(this, arguments));
  };
}
function ad(e, t) {
  return this.each((typeof t == "function" ? sd : rd)(e, t));
}
function* ld() {
  for (var e = this._groups, t = 0, n = e.length; t < n; ++t)
    for (var o = e[t], i = 0, r = o.length, s; i < r; ++i)
      (s = o[i]) && (yield s);
}
var Hs = [null];
function Xe(e, t) {
  this._groups = e, this._parents = t;
}
function Tn() {
  return new Xe([[document.documentElement]], Hs);
}
function ud() {
  return this;
}
Xe.prototype = Tn.prototype = {
  constructor: Xe,
  select: zu,
  selectAll: Vu,
  selectChild: Uu,
  selectChildren: qu,
  filter: Wu,
  data: ec,
  enter: Zu,
  exit: nc,
  join: oc,
  merge: ic,
  selection: ud,
  order: rc,
  sort: sc,
  call: lc,
  nodes: uc,
  node: cc,
  size: dc,
  empty: fc,
  each: hc,
  attr: wc,
  style: $c,
  property: Cc,
  classed: Dc,
  text: Oc,
  html: Lc,
  raise: Fc,
  lower: Yc,
  append: Xc,
  insert: qc,
  remove: Zc,
  clone: Qc,
  datum: jc,
  on: id,
  dispatch: ad,
  [Symbol.iterator]: ld
};
function We(e) {
  return typeof e == "string" ? new Xe([[document.querySelector(e)]], [document.documentElement]) : new Xe([[e]], Hs);
}
function cd(e) {
  let t;
  for (; t = e.sourceEvent; )
    e = t;
  return e;
}
function je(e, t) {
  if (e = cd(e), t === void 0 && (t = e.currentTarget), t) {
    var n = t.ownerSVGElement || t;
    if (n.createSVGPoint) {
      var o = n.createSVGPoint();
      return o.x = e.clientX, o.y = e.clientY, o = o.matrixTransform(t.getScreenCTM().inverse()), [o.x, o.y];
    }
    if (t.getBoundingClientRect) {
      var i = t.getBoundingClientRect();
      return [e.clientX - i.left - t.clientLeft, e.clientY - i.top - t.clientTop];
    }
  }
  return [e.pageX, e.pageY];
}
const dd = { passive: !1 }, yn = { capture: !0, passive: !1 };
function Wo(e) {
  e.stopImmediatePropagation();
}
function Gt(e) {
  e.preventDefault(), e.stopImmediatePropagation();
}
function Fs(e) {
  var t = e.document.documentElement, n = We(e).on("dragstart.drag", Gt, yn);
  "onselectstart" in t ? n.on("selectstart.drag", Gt, yn) : (t.__noselect = t.style.MozUserSelect, t.style.MozUserSelect = "none");
}
function Us(e, t) {
  var n = e.document.documentElement, o = We(e).on("dragstart.drag", null);
  t && (o.on("click.drag", Gt, yn), setTimeout(function() {
    o.on("click.drag", null);
  }, 0)), "onselectstart" in n ? o.on("selectstart.drag", null) : (n.style.MozUserSelect = n.__noselect, delete n.__noselect);
}
const On = (e) => () => e;
function fi(e, {
  sourceEvent: t,
  subject: n,
  target: o,
  identifier: i,
  active: r,
  x: s,
  y: a,
  dx: l,
  dy: u,
  dispatch: c
}) {
  Object.defineProperties(this, {
    type: { value: e, enumerable: !0, configurable: !0 },
    sourceEvent: { value: t, enumerable: !0, configurable: !0 },
    subject: { value: n, enumerable: !0, configurable: !0 },
    target: { value: o, enumerable: !0, configurable: !0 },
    identifier: { value: i, enumerable: !0, configurable: !0 },
    active: { value: r, enumerable: !0, configurable: !0 },
    x: { value: s, enumerable: !0, configurable: !0 },
    y: { value: a, enumerable: !0, configurable: !0 },
    dx: { value: l, enumerable: !0, configurable: !0 },
    dy: { value: u, enumerable: !0, configurable: !0 },
    _: { value: c }
  });
}
fi.prototype.on = function() {
  var e = this._.on.apply(this._, arguments);
  return e === this._ ? this : e;
};
function fd(e) {
  return !e.ctrlKey && !e.button;
}
function hd() {
  return this.parentNode;
}
function pd(e, t) {
  return t ?? { x: e.x, y: e.y };
}
function vd() {
  return navigator.maxTouchPoints || "ontouchstart" in this;
}
function gd() {
  var e = fd, t = hd, n = pd, o = vd, i = {}, r = ko("start", "drag", "end"), s = 0, a, l, u, c, d = 0;
  function h($) {
    $.on("mousedown.drag", p).filter(o).on("touchstart.drag", S).on("touchmove.drag", _, dd).on("touchend.drag touchcancel.drag", P).style("touch-action", "none").style("-webkit-tap-highlight-color", "rgba(0,0,0,0)");
  }
  function p($, R) {
    if (!(c || !e.call(this, $, R))) {
      var U = y(this, t.call(this, $, R), $, R, "mouse");
      U && (We($.view).on("mousemove.drag", E, yn).on("mouseup.drag", b, yn), Fs($.view), Wo($), u = !1, a = $.clientX, l = $.clientY, U("start", $));
    }
  }
  function E($) {
    if (Gt($), !u) {
      var R = $.clientX - a, U = $.clientY - l;
      u = R * R + U * U > d;
    }
    i.mouse("drag", $);
  }
  function b($) {
    We($.view).on("mousemove.drag mouseup.drag", null), Us($.view, u), Gt($), i.mouse("end", $);
  }
  function S($, R) {
    if (e.call(this, $, R)) {
      var U = $.changedTouches, L = t.call(this, $, R), Y = U.length, ie, H;
      for (ie = 0; ie < Y; ++ie)
        (H = y(this, L, $, R, U[ie].identifier, U[ie])) && (Wo($), H("start", $, U[ie]));
    }
  }
  function _($) {
    var R = $.changedTouches, U = R.length, L, Y;
    for (L = 0; L < U; ++L)
      (Y = i[R[L].identifier]) && (Gt($), Y("drag", $, R[L]));
  }
  function P($) {
    var R = $.changedTouches, U = R.length, L, Y;
    for (c && clearTimeout(c), c = setTimeout(function() {
      c = null;
    }, 500), L = 0; L < U; ++L)
      (Y = i[R[L].identifier]) && (Wo($), Y("end", $, R[L]));
  }
  function y($, R, U, L, Y, ie) {
    var H = r.copy(), X = je(ie || U, R), C, oe, f;
    if ((f = n.call($, new fi("beforestart", {
      sourceEvent: U,
      target: h,
      identifier: Y,
      active: s,
      x: X[0],
      y: X[1],
      dx: 0,
      dy: 0,
      dispatch: H
    }), L)) != null)
      return C = f.x - X[0] || 0, oe = f.y - X[1] || 0, function N(v, I, k) {
        var z = X, T;
        switch (v) {
          case "start":
            i[Y] = N, T = s++;
            break;
          case "end":
            delete i[Y], --s;
          case "drag":
            X = je(k || I, R), T = s;
            break;
        }
        H.call(
          v,
          $,
          new fi(v, {
            sourceEvent: I,
            subject: f,
            target: h,
            identifier: Y,
            active: T,
            x: X[0] + C,
            y: X[1] + oe,
            dx: X[0] - z[0],
            dy: X[1] - z[1],
            dispatch: H
          }),
          L
        );
      };
  }
  return h.filter = function($) {
    return arguments.length ? (e = typeof $ == "function" ? $ : On(!!$), h) : e;
  }, h.container = function($) {
    return arguments.length ? (t = typeof $ == "function" ? $ : On($), h) : t;
  }, h.subject = function($) {
    return arguments.length ? (n = typeof $ == "function" ? $ : On($), h) : n;
  }, h.touchable = function($) {
    return arguments.length ? (o = typeof $ == "function" ? $ : On(!!$), h) : o;
  }, h.on = function() {
    var $ = r.on.apply(r, arguments);
    return $ === r ? h : $;
  }, h.clickDistance = function($) {
    return arguments.length ? (d = ($ = +$) * $, h) : Math.sqrt(d);
  }, h;
}
function Bi(e, t, n) {
  e.prototype = t.prototype = n, n.constructor = e;
}
function Ys(e, t) {
  var n = Object.create(e.prototype);
  for (var o in t)
    n[o] = t[o];
  return n;
}
function In() {
}
var _n = 0.7, uo = 1 / _n, qt = "\\s*([+-]?\\d+)\\s*", wn = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)\\s*", it = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)%\\s*", md = /^#([0-9a-f]{3,8})$/, yd = new RegExp(`^rgb\\(${qt},${qt},${qt}\\)$`), _d = new RegExp(`^rgb\\(${it},${it},${it}\\)$`), wd = new RegExp(`^rgba\\(${qt},${qt},${qt},${wn}\\)$`), bd = new RegExp(`^rgba\\(${it},${it},${it},${wn}\\)$`), xd = new RegExp(`^hsl\\(${wn},${it},${it}\\)$`), Ed = new RegExp(`^hsla\\(${wn},${it},${it},${wn}\\)$`), fr = {
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
Bi(In, Bt, {
  copy(e) {
    return Object.assign(new this.constructor(), this, e);
  },
  displayable() {
    return this.rgb().displayable();
  },
  hex: hr,
  // Deprecated! Use color.formatHex.
  formatHex: hr,
  formatHex8: $d,
  formatHsl: Sd,
  formatRgb: pr,
  toString: pr
});
function hr() {
  return this.rgb().formatHex();
}
function $d() {
  return this.rgb().formatHex8();
}
function Sd() {
  return Xs(this).formatHsl();
}
function pr() {
  return this.rgb().formatRgb();
}
function Bt(e) {
  var t, n;
  return e = (e + "").trim().toLowerCase(), (t = md.exec(e)) ? (n = t[1].length, t = parseInt(t[1], 16), n === 6 ? vr(t) : n === 3 ? new Fe(t >> 8 & 15 | t >> 4 & 240, t >> 4 & 15 | t & 240, (t & 15) << 4 | t & 15, 1) : n === 8 ? Rn(t >> 24 & 255, t >> 16 & 255, t >> 8 & 255, (t & 255) / 255) : n === 4 ? Rn(t >> 12 & 15 | t >> 8 & 240, t >> 8 & 15 | t >> 4 & 240, t >> 4 & 15 | t & 240, ((t & 15) << 4 | t & 15) / 255) : null) : (t = yd.exec(e)) ? new Fe(t[1], t[2], t[3], 1) : (t = _d.exec(e)) ? new Fe(t[1] * 255 / 100, t[2] * 255 / 100, t[3] * 255 / 100, 1) : (t = wd.exec(e)) ? Rn(t[1], t[2], t[3], t[4]) : (t = bd.exec(e)) ? Rn(t[1] * 255 / 100, t[2] * 255 / 100, t[3] * 255 / 100, t[4]) : (t = xd.exec(e)) ? yr(t[1], t[2] / 100, t[3] / 100, 1) : (t = Ed.exec(e)) ? yr(t[1], t[2] / 100, t[3] / 100, t[4]) : fr.hasOwnProperty(e) ? vr(fr[e]) : e === "transparent" ? new Fe(NaN, NaN, NaN, 0) : null;
}
function vr(e) {
  return new Fe(e >> 16 & 255, e >> 8 & 255, e & 255, 1);
}
function Rn(e, t, n, o) {
  return o <= 0 && (e = t = n = NaN), new Fe(e, t, n, o);
}
function Nd(e) {
  return e instanceof In || (e = Bt(e)), e ? (e = e.rgb(), new Fe(e.r, e.g, e.b, e.opacity)) : new Fe();
}
function hi(e, t, n, o) {
  return arguments.length === 1 ? Nd(e) : new Fe(e, t, n, o ?? 1);
}
function Fe(e, t, n, o) {
  this.r = +e, this.g = +t, this.b = +n, this.opacity = +o;
}
Bi(Fe, hi, Ys(In, {
  brighter(e) {
    return e = e == null ? uo : Math.pow(uo, e), new Fe(this.r * e, this.g * e, this.b * e, this.opacity);
  },
  darker(e) {
    return e = e == null ? _n : Math.pow(_n, e), new Fe(this.r * e, this.g * e, this.b * e, this.opacity);
  },
  rgb() {
    return this;
  },
  clamp() {
    return new Fe(Pt(this.r), Pt(this.g), Pt(this.b), co(this.opacity));
  },
  displayable() {
    return -0.5 <= this.r && this.r < 255.5 && -0.5 <= this.g && this.g < 255.5 && -0.5 <= this.b && this.b < 255.5 && 0 <= this.opacity && this.opacity <= 1;
  },
  hex: gr,
  // Deprecated! Use color.formatHex.
  formatHex: gr,
  formatHex8: kd,
  formatRgb: mr,
  toString: mr
}));
function gr() {
  return `#${Dt(this.r)}${Dt(this.g)}${Dt(this.b)}`;
}
function kd() {
  return `#${Dt(this.r)}${Dt(this.g)}${Dt(this.b)}${Dt((isNaN(this.opacity) ? 1 : this.opacity) * 255)}`;
}
function mr() {
  const e = co(this.opacity);
  return `${e === 1 ? "rgb(" : "rgba("}${Pt(this.r)}, ${Pt(this.g)}, ${Pt(this.b)}${e === 1 ? ")" : `, ${e})`}`;
}
function co(e) {
  return isNaN(e) ? 1 : Math.max(0, Math.min(1, e));
}
function Pt(e) {
  return Math.max(0, Math.min(255, Math.round(e) || 0));
}
function Dt(e) {
  return e = Pt(e), (e < 16 ? "0" : "") + e.toString(16);
}
function yr(e, t, n, o) {
  return o <= 0 ? e = t = n = NaN : n <= 0 || n >= 1 ? e = t = NaN : t <= 0 && (e = NaN), new Ze(e, t, n, o);
}
function Xs(e) {
  if (e instanceof Ze)
    return new Ze(e.h, e.s, e.l, e.opacity);
  if (e instanceof In || (e = Bt(e)), !e)
    return new Ze();
  if (e instanceof Ze)
    return e;
  e = e.rgb();
  var t = e.r / 255, n = e.g / 255, o = e.b / 255, i = Math.min(t, n, o), r = Math.max(t, n, o), s = NaN, a = r - i, l = (r + i) / 2;
  return a ? (t === r ? s = (n - o) / a + (n < o) * 6 : n === r ? s = (o - t) / a + 2 : s = (t - n) / a + 4, a /= l < 0.5 ? r + i : 2 - r - i, s *= 60) : a = l > 0 && l < 1 ? 0 : s, new Ze(s, a, l, e.opacity);
}
function Cd(e, t, n, o) {
  return arguments.length === 1 ? Xs(e) : new Ze(e, t, n, o ?? 1);
}
function Ze(e, t, n, o) {
  this.h = +e, this.s = +t, this.l = +n, this.opacity = +o;
}
Bi(Ze, Cd, Ys(In, {
  brighter(e) {
    return e = e == null ? uo : Math.pow(uo, e), new Ze(this.h, this.s, this.l * e, this.opacity);
  },
  darker(e) {
    return e = e == null ? _n : Math.pow(_n, e), new Ze(this.h, this.s, this.l * e, this.opacity);
  },
  rgb() {
    var e = this.h % 360 + (this.h < 0) * 360, t = isNaN(e) || isNaN(this.s) ? 0 : this.s, n = this.l, o = n + (n < 0.5 ? n : 1 - n) * t, i = 2 * n - o;
    return new Fe(
      Zo(e >= 240 ? e - 240 : e + 120, i, o),
      Zo(e, i, o),
      Zo(e < 120 ? e + 240 : e - 120, i, o),
      this.opacity
    );
  },
  clamp() {
    return new Ze(_r(this.h), Bn(this.s), Bn(this.l), co(this.opacity));
  },
  displayable() {
    return (0 <= this.s && this.s <= 1 || isNaN(this.s)) && 0 <= this.l && this.l <= 1 && 0 <= this.opacity && this.opacity <= 1;
  },
  formatHsl() {
    const e = co(this.opacity);
    return `${e === 1 ? "hsl(" : "hsla("}${_r(this.h)}, ${Bn(this.s) * 100}%, ${Bn(this.l) * 100}%${e === 1 ? ")" : `, ${e})`}`;
  }
}));
function _r(e) {
  return e = (e || 0) % 360, e < 0 ? e + 360 : e;
}
function Bn(e) {
  return Math.max(0, Math.min(1, e || 0));
}
function Zo(e, t, n) {
  return (e < 60 ? t + (n - t) * e / 60 : e < 180 ? n : e < 240 ? t + (n - t) * (240 - e) / 60 : t) * 255;
}
const Vi = (e) => () => e;
function Md(e, t) {
  return function(n) {
    return e + n * t;
  };
}
function Td(e, t, n) {
  return e = Math.pow(e, n), t = Math.pow(t, n) - e, n = 1 / n, function(o) {
    return Math.pow(e + o * t, n);
  };
}
function Id(e) {
  return (e = +e) == 1 ? Gs : function(t, n) {
    return n - t ? Td(t, n, e) : Vi(isNaN(t) ? n : t);
  };
}
function Gs(e, t) {
  var n = t - e;
  return n ? Md(e, n) : Vi(isNaN(e) ? t : e);
}
const fo = (function e(t) {
  var n = Id(t);
  function o(i, r) {
    var s = n((i = hi(i)).r, (r = hi(r)).r), a = n(i.g, r.g), l = n(i.b, r.b), u = Gs(i.opacity, r.opacity);
    return function(c) {
      return i.r = s(c), i.g = a(c), i.b = l(c), i.opacity = u(c), i + "";
    };
  }
  return o.gamma = e, o;
})(1);
function Dd(e, t) {
  t || (t = []);
  var n = e ? Math.min(t.length, e.length) : 0, o = t.slice(), i;
  return function(r) {
    for (i = 0; i < n; ++i)
      o[i] = e[i] * (1 - r) + t[i] * r;
    return o;
  };
}
function Ad(e) {
  return ArrayBuffer.isView(e) && !(e instanceof DataView);
}
function Pd(e, t) {
  var n = t ? t.length : 0, o = e ? Math.min(n, e.length) : 0, i = new Array(o), r = new Array(n), s;
  for (s = 0; s < o; ++s)
    i[s] = pn(e[s], t[s]);
  for (; s < n; ++s)
    r[s] = t[s];
  return function(a) {
    for (s = 0; s < o; ++s)
      r[s] = i[s](a);
    return r;
  };
}
function zd(e, t) {
  var n = /* @__PURE__ */ new Date();
  return e = +e, t = +t, function(o) {
    return n.setTime(e * (1 - o) + t * o), n;
  };
}
function et(e, t) {
  return e = +e, t = +t, function(n) {
    return e * (1 - n) + t * n;
  };
}
function Od(e, t) {
  var n = {}, o = {}, i;
  (e === null || typeof e != "object") && (e = {}), (t === null || typeof t != "object") && (t = {});
  for (i in t)
    i in e ? n[i] = pn(e[i], t[i]) : o[i] = t[i];
  return function(r) {
    for (i in n)
      o[i] = n[i](r);
    return o;
  };
}
var pi = /[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g, Ko = new RegExp(pi.source, "g");
function Rd(e) {
  return function() {
    return e;
  };
}
function Bd(e) {
  return function(t) {
    return e(t) + "";
  };
}
function qs(e, t) {
  var n = pi.lastIndex = Ko.lastIndex = 0, o, i, r, s = -1, a = [], l = [];
  for (e = e + "", t = t + ""; (o = pi.exec(e)) && (i = Ko.exec(t)); )
    (r = i.index) > n && (r = t.slice(n, r), a[s] ? a[s] += r : a[++s] = r), (o = o[0]) === (i = i[0]) ? a[s] ? a[s] += i : a[++s] = i : (a[++s] = null, l.push({ i: s, x: et(o, i) })), n = Ko.lastIndex;
  return n < t.length && (r = t.slice(n), a[s] ? a[s] += r : a[++s] = r), a.length < 2 ? l[0] ? Bd(l[0].x) : Rd(t) : (t = l.length, function(u) {
    for (var c = 0, d; c < t; ++c)
      a[(d = l[c]).i] = d.x(u);
    return a.join("");
  });
}
function pn(e, t) {
  var n = typeof t, o;
  return t == null || n === "boolean" ? Vi(t) : (n === "number" ? et : n === "string" ? (o = Bt(t)) ? (t = o, fo) : qs : t instanceof Bt ? fo : t instanceof Date ? zd : Ad(t) ? Dd : Array.isArray(t) ? Pd : typeof t.valueOf != "function" && typeof t.toString != "function" || isNaN(t) ? Od : et)(e, t);
}
var wr = 180 / Math.PI, vi = {
  translateX: 0,
  translateY: 0,
  rotate: 0,
  skewX: 0,
  scaleX: 1,
  scaleY: 1
};
function Ws(e, t, n, o, i, r) {
  var s, a, l;
  return (s = Math.sqrt(e * e + t * t)) && (e /= s, t /= s), (l = e * n + t * o) && (n -= e * l, o -= t * l), (a = Math.sqrt(n * n + o * o)) && (n /= a, o /= a, l /= a), e * o < t * n && (e = -e, t = -t, l = -l, s = -s), {
    translateX: i,
    translateY: r,
    rotate: Math.atan2(t, e) * wr,
    skewX: Math.atan(l) * wr,
    scaleX: s,
    scaleY: a
  };
}
var Vn;
function Vd(e) {
  const t = new (typeof DOMMatrix == "function" ? DOMMatrix : WebKitCSSMatrix)(e + "");
  return t.isIdentity ? vi : Ws(t.a, t.b, t.c, t.d, t.e, t.f);
}
function Ld(e) {
  return e == null || (Vn || (Vn = document.createElementNS("http://www.w3.org/2000/svg", "g")), Vn.setAttribute("transform", e), !(e = Vn.transform.baseVal.consolidate())) ? vi : (e = e.matrix, Ws(e.a, e.b, e.c, e.d, e.e, e.f));
}
function Zs(e, t, n, o) {
  function i(u) {
    return u.length ? u.pop() + " " : "";
  }
  function r(u, c, d, h, p, E) {
    if (u !== d || c !== h) {
      var b = p.push("translate(", null, t, null, n);
      E.push({ i: b - 4, x: et(u, d) }, { i: b - 2, x: et(c, h) });
    } else (d || h) && p.push("translate(" + d + t + h + n);
  }
  function s(u, c, d, h) {
    u !== c ? (u - c > 180 ? c += 360 : c - u > 180 && (u += 360), h.push({ i: d.push(i(d) + "rotate(", null, o) - 2, x: et(u, c) })) : c && d.push(i(d) + "rotate(" + c + o);
  }
  function a(u, c, d, h) {
    u !== c ? h.push({ i: d.push(i(d) + "skewX(", null, o) - 2, x: et(u, c) }) : c && d.push(i(d) + "skewX(" + c + o);
  }
  function l(u, c, d, h, p, E) {
    if (u !== d || c !== h) {
      var b = p.push(i(p) + "scale(", null, ",", null, ")");
      E.push({ i: b - 4, x: et(u, d) }, { i: b - 2, x: et(c, h) });
    } else (d !== 1 || h !== 1) && p.push(i(p) + "scale(" + d + "," + h + ")");
  }
  return function(u, c) {
    var d = [], h = [];
    return u = e(u), c = e(c), r(u.translateX, u.translateY, c.translateX, c.translateY, d, h), s(u.rotate, c.rotate, d, h), a(u.skewX, c.skewX, d, h), l(u.scaleX, u.scaleY, c.scaleX, c.scaleY, d, h), u = c = null, function(p) {
      for (var E = -1, b = h.length, S; ++E < b; )
        d[(S = h[E]).i] = S.x(p);
      return d.join("");
    };
  };
}
var Hd = Zs(Vd, "px, ", "px)", "deg)"), Fd = Zs(Ld, ", ", ")", ")"), Ud = 1e-12;
function br(e) {
  return ((e = Math.exp(e)) + 1 / e) / 2;
}
function Yd(e) {
  return ((e = Math.exp(e)) - 1 / e) / 2;
}
function Xd(e) {
  return ((e = Math.exp(2 * e)) - 1) / (e + 1);
}
const jn = (function e(t, n, o) {
  function i(r, s) {
    var a = r[0], l = r[1], u = r[2], c = s[0], d = s[1], h = s[2], p = c - a, E = d - l, b = p * p + E * E, S, _;
    if (b < Ud)
      _ = Math.log(h / u) / t, S = function(L) {
        return [
          a + L * p,
          l + L * E,
          u * Math.exp(t * L * _)
        ];
      };
    else {
      var P = Math.sqrt(b), y = (h * h - u * u + o * b) / (2 * u * n * P), $ = (h * h - u * u - o * b) / (2 * h * n * P), R = Math.log(Math.sqrt(y * y + 1) - y), U = Math.log(Math.sqrt($ * $ + 1) - $);
      _ = (U - R) / t, S = function(L) {
        var Y = L * _, ie = br(R), H = u / (n * P) * (ie * Xd(t * Y + R) - Yd(R));
        return [
          a + H * p,
          l + H * E,
          u * ie / br(t * Y + R)
        ];
      };
    }
    return S.duration = _ * 1e3 * t / Math.SQRT2, S;
  }
  return i.rho = function(r) {
    var s = Math.max(1e-3, +r), a = s * s, l = a * a;
    return e(s, a, l);
  }, i;
})(Math.SQRT2, 2, 4);
var Jt = 0, un = 0, rn = 0, Ks = 1e3, ho, cn, po = 0, Vt = 0, Mo = 0, bn = typeof performance == "object" && performance.now ? performance : Date, Js = typeof window == "object" && window.requestAnimationFrame ? window.requestAnimationFrame.bind(window) : function(e) {
  setTimeout(e, 17);
};
function Li() {
  return Vt || (Js(Gd), Vt = bn.now() + Mo);
}
function Gd() {
  Vt = 0;
}
function vo() {
  this._call = this._time = this._next = null;
}
vo.prototype = Qs.prototype = {
  constructor: vo,
  restart: function(e, t, n) {
    if (typeof e != "function")
      throw new TypeError("callback is not a function");
    n = (n == null ? Li() : +n) + (t == null ? 0 : +t), !this._next && cn !== this && (cn ? cn._next = this : ho = this, cn = this), this._call = e, this._time = n, gi();
  },
  stop: function() {
    this._call && (this._call = null, this._time = 1 / 0, gi());
  }
};
function Qs(e, t, n) {
  var o = new vo();
  return o.restart(e, t, n), o;
}
function qd() {
  Li(), ++Jt;
  for (var e = ho, t; e; )
    (t = Vt - e._time) >= 0 && e._call.call(void 0, t), e = e._next;
  --Jt;
}
function xr() {
  Vt = (po = bn.now()) + Mo, Jt = un = 0;
  try {
    qd();
  } finally {
    Jt = 0, Zd(), Vt = 0;
  }
}
function Wd() {
  var e = bn.now(), t = e - po;
  t > Ks && (Mo -= t, po = e);
}
function Zd() {
  for (var e, t = ho, n, o = 1 / 0; t; )
    t._call ? (o > t._time && (o = t._time), e = t, t = t._next) : (n = t._next, t._next = null, t = e ? e._next = n : ho = n);
  cn = e, gi(o);
}
function gi(e) {
  if (!Jt) {
    un && (un = clearTimeout(un));
    var t = e - Vt;
    t > 24 ? (e < 1 / 0 && (un = setTimeout(xr, e - bn.now() - Mo)), rn && (rn = clearInterval(rn))) : (rn || (po = bn.now(), rn = setInterval(Wd, Ks)), Jt = 1, Js(xr));
  }
}
function Er(e, t, n) {
  var o = new vo();
  return t = t == null ? 0 : +t, o.restart((i) => {
    o.stop(), e(i + t);
  }, t, n), o;
}
var Kd = ko("start", "end", "cancel", "interrupt"), Jd = [], js = 0, $r = 1, mi = 2, eo = 3, Sr = 4, yi = 5, to = 6;
function To(e, t, n, o, i, r) {
  var s = e.__transition;
  if (!s)
    e.__transition = {};
  else if (n in s)
    return;
  Qd(e, n, {
    name: t,
    index: o,
    // For context during callback.
    group: i,
    // For context during callback.
    on: Kd,
    tween: Jd,
    time: r.time,
    delay: r.delay,
    duration: r.duration,
    ease: r.ease,
    timer: null,
    state: js
  });
}
function Hi(e, t) {
  var n = Je(e, t);
  if (n.state > js)
    throw new Error("too late; already scheduled");
  return n;
}
function at(e, t) {
  var n = Je(e, t);
  if (n.state > eo)
    throw new Error("too late; already running");
  return n;
}
function Je(e, t) {
  var n = e.__transition;
  if (!n || !(n = n[t]))
    throw new Error("transition not found");
  return n;
}
function Qd(e, t, n) {
  var o = e.__transition, i;
  o[t] = n, n.timer = Qs(r, 0, n.time);
  function r(u) {
    n.state = $r, n.timer.restart(s, n.delay, n.time), n.delay <= u && s(u - n.delay);
  }
  function s(u) {
    var c, d, h, p;
    if (n.state !== $r)
      return l();
    for (c in o)
      if (p = o[c], p.name === n.name) {
        if (p.state === eo)
          return Er(s);
        p.state === Sr ? (p.state = to, p.timer.stop(), p.on.call("interrupt", e, e.__data__, p.index, p.group), delete o[c]) : +c < t && (p.state = to, p.timer.stop(), p.on.call("cancel", e, e.__data__, p.index, p.group), delete o[c]);
      }
    if (Er(function() {
      n.state === eo && (n.state = Sr, n.timer.restart(a, n.delay, n.time), a(u));
    }), n.state = mi, n.on.call("start", e, e.__data__, n.index, n.group), n.state === mi) {
      for (n.state = eo, i = new Array(h = n.tween.length), c = 0, d = -1; c < h; ++c)
        (p = n.tween[c].value.call(e, e.__data__, n.index, n.group)) && (i[++d] = p);
      i.length = d + 1;
    }
  }
  function a(u) {
    for (var c = u < n.duration ? n.ease.call(null, u / n.duration) : (n.timer.restart(l), n.state = yi, 1), d = -1, h = i.length; ++d < h; )
      i[d].call(e, c);
    n.state === yi && (n.on.call("end", e, e.__data__, n.index, n.group), l());
  }
  function l() {
    n.state = to, n.timer.stop(), delete o[t];
    for (var u in o)
      return;
    delete e.__transition;
  }
}
function no(e, t) {
  var n = e.__transition, o, i, r = !0, s;
  if (n) {
    t = t == null ? null : t + "";
    for (s in n) {
      if ((o = n[s]).name !== t) {
        r = !1;
        continue;
      }
      i = o.state > mi && o.state < yi, o.state = to, o.timer.stop(), o.on.call(i ? "interrupt" : "cancel", e, e.__data__, o.index, o.group), delete n[s];
    }
    r && delete e.__transition;
  }
}
function jd(e) {
  return this.each(function() {
    no(this, e);
  });
}
function ef(e, t) {
  var n, o;
  return function() {
    var i = at(this, e), r = i.tween;
    if (r !== n) {
      o = n = r;
      for (var s = 0, a = o.length; s < a; ++s)
        if (o[s].name === t) {
          o = o.slice(), o.splice(s, 1);
          break;
        }
    }
    i.tween = o;
  };
}
function tf(e, t, n) {
  var o, i;
  if (typeof n != "function")
    throw new Error();
  return function() {
    var r = at(this, e), s = r.tween;
    if (s !== o) {
      i = (o = s).slice();
      for (var a = { name: t, value: n }, l = 0, u = i.length; l < u; ++l)
        if (i[l].name === t) {
          i[l] = a;
          break;
        }
      l === u && i.push(a);
    }
    r.tween = i;
  };
}
function nf(e, t) {
  var n = this._id;
  if (e += "", arguments.length < 2) {
    for (var o = Je(this.node(), n).tween, i = 0, r = o.length, s; i < r; ++i)
      if ((s = o[i]).name === e)
        return s.value;
    return null;
  }
  return this.each((t == null ? ef : tf)(n, e, t));
}
function Fi(e, t, n) {
  var o = e._id;
  return e.each(function() {
    var i = at(this, o);
    (i.value || (i.value = {}))[t] = n.apply(this, arguments);
  }), function(i) {
    return Je(i, o).value[t];
  };
}
function ea(e, t) {
  var n;
  return (typeof t == "number" ? et : t instanceof Bt ? fo : (n = Bt(t)) ? (t = n, fo) : qs)(e, t);
}
function of(e) {
  return function() {
    this.removeAttribute(e);
  };
}
function rf(e) {
  return function() {
    this.removeAttributeNS(e.space, e.local);
  };
}
function sf(e, t, n) {
  var o, i = n + "", r;
  return function() {
    var s = this.getAttribute(e);
    return s === i ? null : s === o ? r : r = t(o = s, n);
  };
}
function af(e, t, n) {
  var o, i = n + "", r;
  return function() {
    var s = this.getAttributeNS(e.space, e.local);
    return s === i ? null : s === o ? r : r = t(o = s, n);
  };
}
function lf(e, t, n) {
  var o, i, r;
  return function() {
    var s, a = n(this), l;
    return a == null ? void this.removeAttribute(e) : (s = this.getAttribute(e), l = a + "", s === l ? null : s === o && l === i ? r : (i = l, r = t(o = s, a)));
  };
}
function uf(e, t, n) {
  var o, i, r;
  return function() {
    var s, a = n(this), l;
    return a == null ? void this.removeAttributeNS(e.space, e.local) : (s = this.getAttributeNS(e.space, e.local), l = a + "", s === l ? null : s === o && l === i ? r : (i = l, r = t(o = s, a)));
  };
}
function cf(e, t) {
  var n = Co(e), o = n === "transform" ? Fd : ea;
  return this.attrTween(e, typeof t == "function" ? (n.local ? uf : lf)(n, o, Fi(this, "attr." + e, t)) : t == null ? (n.local ? rf : of)(n) : (n.local ? af : sf)(n, o, t));
}
function df(e, t) {
  return function(n) {
    this.setAttribute(e, t.call(this, n));
  };
}
function ff(e, t) {
  return function(n) {
    this.setAttributeNS(e.space, e.local, t.call(this, n));
  };
}
function hf(e, t) {
  var n, o;
  function i() {
    var r = t.apply(this, arguments);
    return r !== o && (n = (o = r) && ff(e, r)), n;
  }
  return i._value = t, i;
}
function pf(e, t) {
  var n, o;
  function i() {
    var r = t.apply(this, arguments);
    return r !== o && (n = (o = r) && df(e, r)), n;
  }
  return i._value = t, i;
}
function vf(e, t) {
  var n = "attr." + e;
  if (arguments.length < 2)
    return (n = this.tween(n)) && n._value;
  if (t == null)
    return this.tween(n, null);
  if (typeof t != "function")
    throw new Error();
  var o = Co(e);
  return this.tween(n, (o.local ? hf : pf)(o, t));
}
function gf(e, t) {
  return function() {
    Hi(this, e).delay = +t.apply(this, arguments);
  };
}
function mf(e, t) {
  return t = +t, function() {
    Hi(this, e).delay = t;
  };
}
function yf(e) {
  var t = this._id;
  return arguments.length ? this.each((typeof e == "function" ? gf : mf)(t, e)) : Je(this.node(), t).delay;
}
function _f(e, t) {
  return function() {
    at(this, e).duration = +t.apply(this, arguments);
  };
}
function wf(e, t) {
  return t = +t, function() {
    at(this, e).duration = t;
  };
}
function bf(e) {
  var t = this._id;
  return arguments.length ? this.each((typeof e == "function" ? _f : wf)(t, e)) : Je(this.node(), t).duration;
}
function xf(e, t) {
  if (typeof t != "function")
    throw new Error();
  return function() {
    at(this, e).ease = t;
  };
}
function Ef(e) {
  var t = this._id;
  return arguments.length ? this.each(xf(t, e)) : Je(this.node(), t).ease;
}
function $f(e, t) {
  return function() {
    var n = t.apply(this, arguments);
    if (typeof n != "function")
      throw new Error();
    at(this, e).ease = n;
  };
}
function Sf(e) {
  if (typeof e != "function")
    throw new Error();
  return this.each($f(this._id, e));
}
function Nf(e) {
  typeof e != "function" && (e = Ds(e));
  for (var t = this._groups, n = t.length, o = new Array(n), i = 0; i < n; ++i)
    for (var r = t[i], s = r.length, a = o[i] = [], l, u = 0; u < s; ++u)
      (l = r[u]) && e.call(l, l.__data__, u, r) && a.push(l);
  return new vt(o, this._parents, this._name, this._id);
}
function kf(e) {
  if (e._id !== this._id)
    throw new Error();
  for (var t = this._groups, n = e._groups, o = t.length, i = n.length, r = Math.min(o, i), s = new Array(o), a = 0; a < r; ++a)
    for (var l = t[a], u = n[a], c = l.length, d = s[a] = new Array(c), h, p = 0; p < c; ++p)
      (h = l[p] || u[p]) && (d[p] = h);
  for (; a < o; ++a)
    s[a] = t[a];
  return new vt(s, this._parents, this._name, this._id);
}
function Cf(e) {
  return (e + "").trim().split(/^|\s+/).every(function(t) {
    var n = t.indexOf(".");
    return n >= 0 && (t = t.slice(0, n)), !t || t === "start";
  });
}
function Mf(e, t, n) {
  var o, i, r = Cf(t) ? Hi : at;
  return function() {
    var s = r(this, e), a = s.on;
    a !== o && (i = (o = a).copy()).on(t, n), s.on = i;
  };
}
function Tf(e, t) {
  var n = this._id;
  return arguments.length < 2 ? Je(this.node(), n).on.on(e) : this.each(Mf(n, e, t));
}
function If(e) {
  return function() {
    var t = this.parentNode;
    for (var n in this.__transition)
      if (+n !== e)
        return;
    t && t.removeChild(this);
  };
}
function Df() {
  return this.on("end.remove", If(this._id));
}
function Af(e) {
  var t = this._name, n = this._id;
  typeof e != "function" && (e = Oi(e));
  for (var o = this._groups, i = o.length, r = new Array(i), s = 0; s < i; ++s)
    for (var a = o[s], l = a.length, u = r[s] = new Array(l), c, d, h = 0; h < l; ++h)
      (c = a[h]) && (d = e.call(c, c.__data__, h, a)) && ("__data__" in c && (d.__data__ = c.__data__), u[h] = d, To(u[h], t, n, h, u, Je(c, n)));
  return new vt(r, this._parents, t, n);
}
function Pf(e) {
  var t = this._name, n = this._id;
  typeof e != "function" && (e = Is(e));
  for (var o = this._groups, i = o.length, r = [], s = [], a = 0; a < i; ++a)
    for (var l = o[a], u = l.length, c, d = 0; d < u; ++d)
      if (c = l[d]) {
        for (var h = e.call(c, c.__data__, d, l), p, E = Je(c, n), b = 0, S = h.length; b < S; ++b)
          (p = h[b]) && To(p, t, n, b, h, E);
        r.push(h), s.push(c);
      }
  return new vt(r, s, t, n);
}
var zf = Tn.prototype.constructor;
function Of() {
  return new zf(this._groups, this._parents);
}
function Rf(e, t) {
  var n, o, i;
  return function() {
    var r = Kt(this, e), s = (this.style.removeProperty(e), Kt(this, e));
    return r === s ? null : r === n && s === o ? i : i = t(n = r, o = s);
  };
}
function ta(e) {
  return function() {
    this.style.removeProperty(e);
  };
}
function Bf(e, t, n) {
  var o, i = n + "", r;
  return function() {
    var s = Kt(this, e);
    return s === i ? null : s === o ? r : r = t(o = s, n);
  };
}
function Vf(e, t, n) {
  var o, i, r;
  return function() {
    var s = Kt(this, e), a = n(this), l = a + "";
    return a == null && (l = a = (this.style.removeProperty(e), Kt(this, e))), s === l ? null : s === o && l === i ? r : (i = l, r = t(o = s, a));
  };
}
function Lf(e, t) {
  var n, o, i, r = "style." + t, s = "end." + r, a;
  return function() {
    var l = at(this, e), u = l.on, c = l.value[r] == null ? a || (a = ta(t)) : void 0;
    (u !== n || i !== c) && (o = (n = u).copy()).on(s, i = c), l.on = o;
  };
}
function Hf(e, t, n) {
  var o = (e += "") == "transform" ? Hd : ea;
  return t == null ? this.styleTween(e, Rf(e, o)).on("end.style." + e, ta(e)) : typeof t == "function" ? this.styleTween(e, Vf(e, o, Fi(this, "style." + e, t))).each(Lf(this._id, e)) : this.styleTween(e, Bf(e, o, t), n).on("end.style." + e, null);
}
function Ff(e, t, n) {
  return function(o) {
    this.style.setProperty(e, t.call(this, o), n);
  };
}
function Uf(e, t, n) {
  var o, i;
  function r() {
    var s = t.apply(this, arguments);
    return s !== i && (o = (i = s) && Ff(e, s, n)), o;
  }
  return r._value = t, r;
}
function Yf(e, t, n) {
  var o = "style." + (e += "");
  if (arguments.length < 2)
    return (o = this.tween(o)) && o._value;
  if (t == null)
    return this.tween(o, null);
  if (typeof t != "function")
    throw new Error();
  return this.tween(o, Uf(e, t, n ?? ""));
}
function Xf(e) {
  return function() {
    this.textContent = e;
  };
}
function Gf(e) {
  return function() {
    var t = e(this);
    this.textContent = t ?? "";
  };
}
function qf(e) {
  return this.tween("text", typeof e == "function" ? Gf(Fi(this, "text", e)) : Xf(e == null ? "" : e + ""));
}
function Wf(e) {
  return function(t) {
    this.textContent = e.call(this, t);
  };
}
function Zf(e) {
  var t, n;
  function o() {
    var i = e.apply(this, arguments);
    return i !== n && (t = (n = i) && Wf(i)), t;
  }
  return o._value = e, o;
}
function Kf(e) {
  var t = "text";
  if (arguments.length < 1)
    return (t = this.tween(t)) && t._value;
  if (e == null)
    return this.tween(t, null);
  if (typeof e != "function")
    throw new Error();
  return this.tween(t, Zf(e));
}
function Jf() {
  for (var e = this._name, t = this._id, n = na(), o = this._groups, i = o.length, r = 0; r < i; ++r)
    for (var s = o[r], a = s.length, l, u = 0; u < a; ++u)
      if (l = s[u]) {
        var c = Je(l, t);
        To(l, e, n, u, s, {
          time: c.time + c.delay + c.duration,
          delay: 0,
          duration: c.duration,
          ease: c.ease
        });
      }
  return new vt(o, this._parents, e, n);
}
function Qf() {
  var e, t, n = this, o = n._id, i = n.size();
  return new Promise(function(r, s) {
    var a = { value: s }, l = { value: function() {
      --i === 0 && r();
    } };
    n.each(function() {
      var u = at(this, o), c = u.on;
      c !== e && (t = (e = c).copy(), t._.cancel.push(a), t._.interrupt.push(a), t._.end.push(l)), u.on = t;
    }), i === 0 && r();
  });
}
var jf = 0;
function vt(e, t, n, o) {
  this._groups = e, this._parents = t, this._name = n, this._id = o;
}
function na() {
  return ++jf;
}
var ut = Tn.prototype;
vt.prototype = {
  constructor: vt,
  select: Af,
  selectAll: Pf,
  selectChild: ut.selectChild,
  selectChildren: ut.selectChildren,
  filter: Nf,
  merge: kf,
  selection: Of,
  transition: Jf,
  call: ut.call,
  nodes: ut.nodes,
  node: ut.node,
  size: ut.size,
  empty: ut.empty,
  each: ut.each,
  on: Tf,
  attr: cf,
  attrTween: vf,
  style: Hf,
  styleTween: Yf,
  text: qf,
  textTween: Kf,
  remove: Df,
  tween: nf,
  delay: yf,
  duration: bf,
  ease: Ef,
  easeVarying: Sf,
  end: Qf,
  [Symbol.iterator]: ut[Symbol.iterator]
};
function eh(e) {
  return ((e *= 2) <= 1 ? e * e * e : (e -= 2) * e * e + 2) / 2;
}
var th = {
  time: null,
  // Set on use.
  delay: 0,
  duration: 250,
  ease: eh
};
function nh(e, t) {
  for (var n; !(n = e.__transition) || !(n = n[t]); )
    if (!(e = e.parentNode))
      throw new Error(`transition ${t} not found`);
  return n;
}
function oh(e) {
  var t, n;
  e instanceof vt ? (t = e._id, e = e._name) : (t = na(), (n = th).time = Li(), e = e == null ? null : e + "");
  for (var o = this._groups, i = o.length, r = 0; r < i; ++r)
    for (var s = o[r], a = s.length, l, u = 0; u < a; ++u)
      (l = s[u]) && To(l, e, t, u, s, n || nh(l, t));
  return new vt(o, this._parents, e, t);
}
Tn.prototype.interrupt = jd;
Tn.prototype.transition = oh;
const Ln = (e) => () => e;
function ih(e, {
  sourceEvent: t,
  target: n,
  transform: o,
  dispatch: i
}) {
  Object.defineProperties(this, {
    type: { value: e, enumerable: !0, configurable: !0 },
    sourceEvent: { value: t, enumerable: !0, configurable: !0 },
    target: { value: n, enumerable: !0, configurable: !0 },
    transform: { value: o, enumerable: !0, configurable: !0 },
    _: { value: i }
  });
}
function ft(e, t, n) {
  this.k = e, this.x = t, this.y = n;
}
ft.prototype = {
  constructor: ft,
  scale: function(e) {
    return e === 1 ? this : new ft(this.k * e, this.x, this.y);
  },
  translate: function(e, t) {
    return e === 0 & t === 0 ? this : new ft(this.k, this.x + this.k * e, this.y + this.k * t);
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
var Qt = new ft(1, 0, 0);
ft.prototype;
function Jo(e) {
  e.stopImmediatePropagation();
}
function sn(e) {
  e.preventDefault(), e.stopImmediatePropagation();
}
function rh(e) {
  return (!e.ctrlKey || e.type === "wheel") && !e.button;
}
function sh() {
  var e = this;
  return e instanceof SVGElement ? (e = e.ownerSVGElement || e, e.hasAttribute("viewBox") ? (e = e.viewBox.baseVal, [[e.x, e.y], [e.x + e.width, e.y + e.height]]) : [[0, 0], [e.width.baseVal.value, e.height.baseVal.value]]) : [[0, 0], [e.clientWidth, e.clientHeight]];
}
function Nr() {
  return this.__zoom || Qt;
}
function ah(e) {
  return -e.deltaY * (e.deltaMode === 1 ? 0.05 : e.deltaMode ? 1 : 2e-3) * (e.ctrlKey ? 10 : 1);
}
function lh() {
  return navigator.maxTouchPoints || "ontouchstart" in this;
}
function uh(e, t, n) {
  var o = e.invertX(t[0][0]) - n[0][0], i = e.invertX(t[1][0]) - n[1][0], r = e.invertY(t[0][1]) - n[0][1], s = e.invertY(t[1][1]) - n[1][1];
  return e.translate(
    i > o ? (o + i) / 2 : Math.min(0, o) || Math.max(0, i),
    s > r ? (r + s) / 2 : Math.min(0, r) || Math.max(0, s)
  );
}
function ch() {
  var e = rh, t = sh, n = uh, o = ah, i = lh, r = [0, 1 / 0], s = [[-1 / 0, -1 / 0], [1 / 0, 1 / 0]], a = 250, l = jn, u = ko("start", "zoom", "end"), c, d, h, p = 500, E = 150, b = 0, S = 10;
  function _(f) {
    f.property("__zoom", Nr).on("wheel.zoom", Y, { passive: !1 }).on("mousedown.zoom", ie).on("dblclick.zoom", H).filter(i).on("touchstart.zoom", X).on("touchmove.zoom", C).on("touchend.zoom touchcancel.zoom", oe).style("-webkit-tap-highlight-color", "rgba(0,0,0,0)");
  }
  _.transform = function(f, N, v, I) {
    var k = f.selection ? f.selection() : f;
    k.property("__zoom", Nr), f !== k ? R(f, N, v, I) : k.interrupt().each(function() {
      U(this, arguments).event(I).start().zoom(null, typeof N == "function" ? N.apply(this, arguments) : N).end();
    });
  }, _.scaleBy = function(f, N, v, I) {
    _.scaleTo(f, function() {
      var k = this.__zoom.k, z = typeof N == "function" ? N.apply(this, arguments) : N;
      return k * z;
    }, v, I);
  }, _.scaleTo = function(f, N, v, I) {
    _.transform(f, function() {
      var k = t.apply(this, arguments), z = this.__zoom, T = v == null ? $(k) : typeof v == "function" ? v.apply(this, arguments) : v, B = z.invert(T), q = typeof N == "function" ? N.apply(this, arguments) : N;
      return n(y(P(z, q), T, B), k, s);
    }, v, I);
  }, _.translateBy = function(f, N, v, I) {
    _.transform(f, function() {
      return n(this.__zoom.translate(
        typeof N == "function" ? N.apply(this, arguments) : N,
        typeof v == "function" ? v.apply(this, arguments) : v
      ), t.apply(this, arguments), s);
    }, null, I);
  }, _.translateTo = function(f, N, v, I, k) {
    _.transform(f, function() {
      var z = t.apply(this, arguments), T = this.__zoom, B = I == null ? $(z) : typeof I == "function" ? I.apply(this, arguments) : I;
      return n(Qt.translate(B[0], B[1]).scale(T.k).translate(
        typeof N == "function" ? -N.apply(this, arguments) : -N,
        typeof v == "function" ? -v.apply(this, arguments) : -v
      ), z, s);
    }, I, k);
  };
  function P(f, N) {
    return N = Math.max(r[0], Math.min(r[1], N)), N === f.k ? f : new ft(N, f.x, f.y);
  }
  function y(f, N, v) {
    var I = N[0] - v[0] * f.k, k = N[1] - v[1] * f.k;
    return I === f.x && k === f.y ? f : new ft(f.k, I, k);
  }
  function $(f) {
    return [(+f[0][0] + +f[1][0]) / 2, (+f[0][1] + +f[1][1]) / 2];
  }
  function R(f, N, v, I) {
    f.on("start.zoom", function() {
      U(this, arguments).event(I).start();
    }).on("interrupt.zoom end.zoom", function() {
      U(this, arguments).event(I).end();
    }).tween("zoom", function() {
      var k = this, z = arguments, T = U(k, z).event(I), B = t.apply(k, z), q = v == null ? $(B) : typeof v == "function" ? v.apply(k, z) : v, j = Math.max(B[1][0] - B[0][0], B[1][1] - B[0][1]), re = k.__zoom, G = typeof N == "function" ? N.apply(k, z) : N, F = l(re.invert(q).concat(j / re.k), G.invert(q).concat(j / G.k));
      return function(ee) {
        if (ee === 1)
          ee = G;
        else {
          var he = F(ee), ve = j / he[2];
          ee = new ft(ve, q[0] - he[0] * ve, q[1] - he[1] * ve);
        }
        T.zoom(null, ee);
      };
    });
  }
  function U(f, N, v) {
    return !v && f.__zooming || new L(f, N);
  }
  function L(f, N) {
    this.that = f, this.args = N, this.active = 0, this.sourceEvent = null, this.extent = t.apply(f, N), this.taps = 0;
  }
  L.prototype = {
    event: function(f) {
      return f && (this.sourceEvent = f), this;
    },
    start: function() {
      return ++this.active === 1 && (this.that.__zooming = this, this.emit("start")), this;
    },
    zoom: function(f, N) {
      return this.mouse && f !== "mouse" && (this.mouse[1] = N.invert(this.mouse[0])), this.touch0 && f !== "touch" && (this.touch0[1] = N.invert(this.touch0[0])), this.touch1 && f !== "touch" && (this.touch1[1] = N.invert(this.touch1[0])), this.that.__zoom = N, this.emit("zoom"), this;
    },
    end: function() {
      return --this.active === 0 && (delete this.that.__zooming, this.emit("end")), this;
    },
    emit: function(f) {
      var N = We(this.that).datum();
      u.call(
        f,
        this.that,
        new ih(f, {
          sourceEvent: this.sourceEvent,
          target: _,
          transform: this.that.__zoom,
          dispatch: u
        }),
        N
      );
    }
  };
  function Y(f, ...N) {
    if (!e.apply(this, arguments))
      return;
    var v = U(this, N).event(f), I = this.__zoom, k = Math.max(r[0], Math.min(r[1], I.k * Math.pow(2, o.apply(this, arguments)))), z = je(f);
    if (v.wheel)
      (v.mouse[0][0] !== z[0] || v.mouse[0][1] !== z[1]) && (v.mouse[1] = I.invert(v.mouse[0] = z)), clearTimeout(v.wheel);
    else {
      if (I.k === k)
        return;
      v.mouse = [z, I.invert(z)], no(this), v.start();
    }
    sn(f), v.wheel = setTimeout(T, E), v.zoom("mouse", n(y(P(I, k), v.mouse[0], v.mouse[1]), v.extent, s));
    function T() {
      v.wheel = null, v.end();
    }
  }
  function ie(f, ...N) {
    if (h || !e.apply(this, arguments))
      return;
    var v = f.currentTarget, I = U(this, N, !0).event(f), k = We(f.view).on("mousemove.zoom", q, !0).on("mouseup.zoom", j, !0), z = je(f, v), T = f.clientX, B = f.clientY;
    Fs(f.view), Jo(f), I.mouse = [z, this.__zoom.invert(z)], no(this), I.start();
    function q(re) {
      if (sn(re), !I.moved) {
        var G = re.clientX - T, F = re.clientY - B;
        I.moved = G * G + F * F > b;
      }
      I.event(re).zoom("mouse", n(y(I.that.__zoom, I.mouse[0] = je(re, v), I.mouse[1]), I.extent, s));
    }
    function j(re) {
      k.on("mousemove.zoom mouseup.zoom", null), Us(re.view, I.moved), sn(re), I.event(re).end();
    }
  }
  function H(f, ...N) {
    if (e.apply(this, arguments)) {
      var v = this.__zoom, I = je(f.changedTouches ? f.changedTouches[0] : f, this), k = v.invert(I), z = v.k * (f.shiftKey ? 0.5 : 2), T = n(y(P(v, z), I, k), t.apply(this, N), s);
      sn(f), a > 0 ? We(this).transition().duration(a).call(R, T, I, f) : We(this).call(_.transform, T, I, f);
    }
  }
  function X(f, ...N) {
    if (e.apply(this, arguments)) {
      var v = f.touches, I = v.length, k = U(this, N, f.changedTouches.length === I).event(f), z, T, B, q;
      for (Jo(f), T = 0; T < I; ++T)
        B = v[T], q = je(B, this), q = [q, this.__zoom.invert(q), B.identifier], k.touch0 ? !k.touch1 && k.touch0[2] !== q[2] && (k.touch1 = q, k.taps = 0) : (k.touch0 = q, z = !0, k.taps = 1 + !!c);
      c && (c = clearTimeout(c)), z && (k.taps < 2 && (d = q[0], c = setTimeout(function() {
        c = null;
      }, p)), no(this), k.start());
    }
  }
  function C(f, ...N) {
    if (this.__zooming) {
      var v = U(this, N).event(f), I = f.changedTouches, k = I.length, z, T, B, q;
      for (sn(f), z = 0; z < k; ++z)
        T = I[z], B = je(T, this), v.touch0 && v.touch0[2] === T.identifier ? v.touch0[0] = B : v.touch1 && v.touch1[2] === T.identifier && (v.touch1[0] = B);
      if (T = v.that.__zoom, v.touch1) {
        var j = v.touch0[0], re = v.touch0[1], G = v.touch1[0], F = v.touch1[1], ee = (ee = G[0] - j[0]) * ee + (ee = G[1] - j[1]) * ee, he = (he = F[0] - re[0]) * he + (he = F[1] - re[1]) * he;
        T = P(T, Math.sqrt(ee / he)), B = [(j[0] + G[0]) / 2, (j[1] + G[1]) / 2], q = [(re[0] + F[0]) / 2, (re[1] + F[1]) / 2];
      } else if (v.touch0)
        B = v.touch0[0], q = v.touch0[1];
      else
        return;
      v.zoom("touch", n(y(T, B, q), v.extent, s));
    }
  }
  function oe(f, ...N) {
    if (this.__zooming) {
      var v = U(this, N).event(f), I = f.changedTouches, k = I.length, z, T;
      for (Jo(f), h && clearTimeout(h), h = setTimeout(function() {
        h = null;
      }, p), z = 0; z < k; ++z)
        T = I[z], v.touch0 && v.touch0[2] === T.identifier ? delete v.touch0 : v.touch1 && v.touch1[2] === T.identifier && delete v.touch1;
      if (v.touch1 && !v.touch0 && (v.touch0 = v.touch1, delete v.touch1), v.touch0)
        v.touch0[1] = this.__zoom.invert(v.touch0[0]);
      else if (v.end(), v.taps === 2 && (T = je(T, this), Math.hypot(d[0] - T[0], d[1] - T[1]) < S)) {
        var B = We(this).on("dblclick.zoom");
        B && B.apply(this, arguments);
      }
    }
  }
  return _.wheelDelta = function(f) {
    return arguments.length ? (o = typeof f == "function" ? f : Ln(+f), _) : o;
  }, _.filter = function(f) {
    return arguments.length ? (e = typeof f == "function" ? f : Ln(!!f), _) : e;
  }, _.touchable = function(f) {
    return arguments.length ? (i = typeof f == "function" ? f : Ln(!!f), _) : i;
  }, _.extent = function(f) {
    return arguments.length ? (t = typeof f == "function" ? f : Ln([[+f[0][0], +f[0][1]], [+f[1][0], +f[1][1]]]), _) : t;
  }, _.scaleExtent = function(f) {
    return arguments.length ? (r[0] = +f[0], r[1] = +f[1], _) : [r[0], r[1]];
  }, _.translateExtent = function(f) {
    return arguments.length ? (s[0][0] = +f[0][0], s[1][0] = +f[1][0], s[0][1] = +f[0][1], s[1][1] = +f[1][1], _) : [[s[0][0], s[0][1]], [s[1][0], s[1][1]]];
  }, _.constrain = function(f) {
    return arguments.length ? (n = f, _) : n;
  }, _.duration = function(f) {
    return arguments.length ? (a = +f, _) : a;
  }, _.interpolate = function(f) {
    return arguments.length ? (l = f, _) : l;
  }, _.on = function() {
    var f = u.on.apply(u, arguments);
    return f === u ? _ : f;
  }, _.clickDistance = function(f) {
    return arguments.length ? (b = (f = +f) * f, _) : Math.sqrt(b);
  }, _.tapDistance = function(f) {
    return arguments.length ? (S = +f, _) : S;
  }, _;
}
var ae = /* @__PURE__ */ ((e) => (e.Left = "left", e.Top = "top", e.Right = "right", e.Bottom = "bottom", e))(ae || {}), Ui = /* @__PURE__ */ ((e) => (e.Partial = "partial", e.Full = "full", e))(Ui || {}), Mt = /* @__PURE__ */ ((e) => (e.Bezier = "default", e.SimpleBezier = "simple-bezier", e.Straight = "straight", e.Step = "step", e.SmoothStep = "smoothstep", e))(Mt || {}), St = /* @__PURE__ */ ((e) => (e.Strict = "strict", e.Loose = "loose", e))(St || {}), go = /* @__PURE__ */ ((e) => (e.Arrow = "arrow", e.ArrowClosed = "arrowclosed", e))(go || {}), vn = /* @__PURE__ */ ((e) => (e.Free = "free", e.Vertical = "vertical", e.Horizontal = "horizontal", e))(vn || {}), oa = /* @__PURE__ */ ((e) => (e.TopLeft = "top-left", e.TopCenter = "top-center", e.TopRight = "top-right", e.BottomLeft = "bottom-left", e.BottomCenter = "bottom-center", e.BottomRight = "bottom-right", e))(oa || {});
const dh = ["INPUT", "SELECT", "TEXTAREA"], fh = typeof document < "u" ? document : null;
function _i(e) {
  var t, n;
  const o = ((n = (t = e.composedPath) == null ? void 0 : t.call(e)) == null ? void 0 : n[0]) || e.target, i = typeof o?.hasAttribute == "function" ? o.hasAttribute("contenteditable") : !1, r = typeof o?.closest == "function" ? o.closest(".nokey") : null;
  return dh.includes(o?.nodeName) || i || !!r;
}
function hh(e) {
  return e.ctrlKey || e.metaKey || e.shiftKey || e.altKey;
}
function kr(e, t, n, o) {
  const i = t.replace("+", `
`).replace(`

`, `
+`).split(`
`).map((s) => s.trim().toLowerCase());
  if (i.length === 1)
    return e.toLowerCase() === t.toLowerCase();
  o || n.add(e.toLowerCase());
  const r = i.every(
    (s, a) => n.has(s) && Array.from(n.values())[a] === i[a]
  );
  return o && n.delete(e.toLowerCase()), r;
}
function ph(e, t) {
  return (n) => {
    if (!n.code && !n.key)
      return !1;
    const o = vh(n.code, e);
    return Array.isArray(e) ? e.some((i) => kr(n[o], i, t, n.type === "keyup")) : kr(n[o], e, t, n.type === "keyup");
  };
}
function vh(e, t) {
  return t.includes(e) ? "code" : "key";
}
function gn(e, t) {
  const n = ce(() => be(t?.target) ?? fh), o = $t(be(e) === !0);
  let i = !1;
  const r = /* @__PURE__ */ new Set();
  let s = l(be(e));
  Ne(
    () => be(e),
    (u, c) => {
      typeof c == "boolean" && typeof u != "boolean" && a(), s = l(u);
    },
    {
      immediate: !0
    }
  ), Ms(["blur", "contextmenu"], a), ur(
    (...u) => s(...u),
    (u) => {
      var c, d;
      const h = be(t?.actInsideInputWithModifier) ?? !0, p = be(t?.preventDefault) ?? !1;
      if (i = hh(u), (!i || i && !h) && _i(u))
        return;
      const b = ((d = (c = u.composedPath) == null ? void 0 : c.call(u)) == null ? void 0 : d[0]) || u.target, S = b?.nodeName === "BUTTON" || b?.nodeName === "A";
      !p && (i || !S) && u.preventDefault(), o.value = !0;
    },
    { eventName: "keydown", target: n }
  ), ur(
    (...u) => s(...u),
    (u) => {
      const c = be(t?.actInsideInputWithModifier) ?? !0;
      if (o.value) {
        if ((!i || i && !c) && _i(u))
          return;
        i = !1, o.value = !1;
      }
    },
    { eventName: "keyup", target: n }
  );
  function a() {
    i = !1, r.clear(), o.value = be(e) === !0;
  }
  function l(u) {
    return u === null ? (a(), () => !1) : typeof u == "boolean" ? (a(), o.value = u, () => !1) : Array.isArray(u) || typeof u == "string" ? ph(u, r) : u;
  }
  return o;
}
const ia = "vue-flow__node-desc", ra = "vue-flow__edge-desc", gh = "vue-flow__aria-live", sa = ["Enter", " ", "Escape"], Wt = {
  ArrowUp: { x: 0, y: -1 },
  ArrowDown: { x: 0, y: 1 },
  ArrowLeft: { x: -1, y: 0 },
  ArrowRight: { x: 1, y: 0 }
};
function mo(e) {
  return {
    ...e.computedPosition || { x: 0, y: 0 },
    width: e.dimensions.width || 0,
    height: e.dimensions.height || 0
  };
}
function yo(e, t) {
  const n = Math.max(0, Math.min(e.x + e.width, t.x + t.width) - Math.max(e.x, t.x)), o = Math.max(0, Math.min(e.y + e.height, t.y + t.height) - Math.max(e.y, t.y));
  return Math.ceil(n * o);
}
function Io(e) {
  return {
    width: e.offsetWidth,
    height: e.offsetHeight
  };
}
function Lt(e, t = 0, n = 1) {
  return Math.min(Math.max(e, t), n);
}
function aa(e, t) {
  return {
    x: Lt(e.x, t[0][0], t[1][0]),
    y: Lt(e.y, t[0][1], t[1][1])
  };
}
function Cr(e) {
  const t = e.getRootNode();
  return "elementFromPoint" in t ? t : window.document;
}
function Nt(e) {
  return e && typeof e == "object" && "id" in e && "source" in e && "target" in e;
}
function zt(e) {
  return e && typeof e == "object" && "id" in e && "position" in e && !Nt(e);
}
function dn(e) {
  return zt(e) && "computedPosition" in e;
}
function Hn(e) {
  return !Number.isNaN(e) && Number.isFinite(e);
}
function mh(e) {
  return Hn(e.width) && Hn(e.height) && Hn(e.x) && Hn(e.y);
}
function yh(e, t, n) {
  const o = {
    id: e.id.toString(),
    type: e.type ?? "default",
    dimensions: Xt({
      width: 0,
      height: 0
    }),
    computedPosition: Xt({
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
    data: Ae(e.data) ? e.data : {},
    events: Xt(Ae(e.events) ? e.events : {})
  };
  return Object.assign(t ?? o, e, { id: e.id.toString(), parentNode: n });
}
function la(e, t, n) {
  var o, i;
  const r = {
    id: e.id.toString(),
    type: e.type ?? t?.type ?? "default",
    source: e.source.toString(),
    target: e.target.toString(),
    sourceHandle: (o = e.sourceHandle) == null ? void 0 : o.toString(),
    targetHandle: (i = e.targetHandle) == null ? void 0 : i.toString(),
    updatable: e.updatable ?? n?.updatable,
    selectable: e.selectable ?? n?.selectable,
    focusable: e.focusable ?? n?.focusable,
    data: Ae(e.data) ? e.data : {},
    events: Xt(Ae(e.events) ? e.events : {}),
    label: e.label ?? "",
    interactionWidth: e.interactionWidth ?? n?.interactionWidth,
    ...n ?? {}
  };
  return Object.assign(t ?? r, e, { id: e.id.toString() });
}
function ua(e, t, n, o) {
  const i = typeof e == "string" ? e : e.id, r = /* @__PURE__ */ new Set(), s = o === "source" ? "target" : "source";
  for (const a of n)
    a[s] === i && r.add(a[o]);
  return t.filter((a) => r.has(a.id));
}
function _h(...e) {
  if (e.length === 3) {
    const [r, s, a] = e;
    return ua(r, s, a, "target");
  }
  const [t, n] = e, o = typeof t == "string" ? t : t.id;
  return n.filter((r) => Nt(r) && r.source === o).map((r) => n.find((s) => zt(s) && s.id === r.target));
}
function wh(...e) {
  if (e.length === 3) {
    const [r, s, a] = e;
    return ua(r, s, a, "source");
  }
  const [t, n] = e, o = typeof t == "string" ? t : t.id;
  return n.filter((r) => Nt(r) && r.target === o).map((r) => n.find((s) => zt(s) && s.id === r.source));
}
function ca({ source: e, sourceHandle: t, target: n, targetHandle: o }) {
  return `vueflow__edge-${e}${t ?? ""}-${n}${o ?? ""}`;
}
function bh(e, t) {
  return t.some(
    (n) => Nt(n) && n.source === e.source && n.target === e.target && (n.sourceHandle === e.sourceHandle || !n.sourceHandle && !e.sourceHandle) && (n.targetHandle === e.targetHandle || !n.targetHandle && !e.targetHandle)
  );
}
function xn({ x: e, y: t }, { x: n, y: o, zoom: i }) {
  return {
    x: e * i + n,
    y: t * i + o
  };
}
function En({ x: e, y: t }, { x: n, y: o, zoom: i }, r = !1, s = [1, 1]) {
  const a = {
    x: (e - n) / i,
    y: (t - o) / i
  };
  return r ? Do(a, s) : a;
}
function da(e, t) {
  return {
    x: Math.min(e.x, t.x),
    y: Math.min(e.y, t.y),
    x2: Math.max(e.x2, t.x2),
    y2: Math.max(e.y2, t.y2)
  };
}
function _o({ x: e, y: t, width: n, height: o }) {
  return {
    x: e,
    y: t,
    x2: e + n,
    y2: t + o
  };
}
function fa({ x: e, y: t, x2: n, y2: o }) {
  return {
    x: e,
    y: t,
    width: n - e,
    height: o - t
  };
}
function xh(e, t) {
  return fa(da(_o(e), _o(t)));
}
function Yi(e) {
  let t = {
    x: Number.POSITIVE_INFINITY,
    y: Number.POSITIVE_INFINITY,
    x2: Number.NEGATIVE_INFINITY,
    y2: Number.NEGATIVE_INFINITY
  };
  for (let n = 0; n < e.length; n++) {
    const o = e[n];
    t = da(
      t,
      _o({
        ...o.computedPosition,
        ...o.dimensions
      })
    );
  }
  return fa(t);
}
function ha(e, t, n = { x: 0, y: 0, zoom: 1 }, o = !1, i = !1) {
  const r = {
    ...En(t, n),
    width: t.width / n.zoom,
    height: t.height / n.zoom
  }, s = [];
  for (const a of e) {
    const { dimensions: l, selectable: u = !0, hidden: c = !1 } = a, d = l.width ?? a.width ?? null, h = l.height ?? a.height ?? null;
    if (i && !u || c)
      continue;
    const p = yo(r, mo(a)), E = d === null || h === null, b = o && p > 0, S = (d ?? 0) * (h ?? 0);
    (E || b || p >= S || a.dragging) && s.push(a);
  }
  return s;
}
function Tt(e, t) {
  const n = /* @__PURE__ */ new Set();
  if (typeof e == "string")
    n.add(e);
  else if (e.length >= 1)
    for (const o of e)
      n.add(o.id);
  return t.filter((o) => n.has(o.source) || n.has(o.target));
}
function Yt(e, t) {
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
  return Dn(`The padding value "${e}" is invalid. Please provide a number or a string with a valid unit (px or %).`), 0;
}
function Eh(e, t, n) {
  if (typeof e == "string" || typeof e == "number") {
    const o = Yt(e, n), i = Yt(e, t);
    return {
      top: o,
      right: i,
      bottom: o,
      left: i,
      x: i * 2,
      y: o * 2
    };
  }
  if (typeof e == "object") {
    const o = Yt(e.top ?? e.y ?? 0, n), i = Yt(e.bottom ?? e.y ?? 0, n), r = Yt(e.left ?? e.x ?? 0, t), s = Yt(e.right ?? e.x ?? 0, t);
    return { top: o, right: s, bottom: i, left: r, x: r + s, y: o + i };
  }
  return { top: 0, right: 0, bottom: 0, left: 0, x: 0, y: 0 };
}
function $h(e, t, n, o, i, r) {
  const { x: s, y: a } = xn(e, { x: t, y: n, zoom: o }), { x: l, y: u } = xn(
    { x: e.x + e.width, y: e.y + e.height },
    {
      x: t,
      y: n,
      zoom: o
    }
  ), c = i - l, d = r - u;
  return {
    left: Math.floor(s),
    top: Math.floor(a),
    right: Math.floor(c),
    bottom: Math.floor(d)
  };
}
function Mr(e, t, n, o, i, r = 0.1) {
  const s = Eh(r, t, n), a = (t - s.x) / e.width, l = (n - s.y) / e.height, u = Math.min(a, l), c = Lt(u, o, i), d = e.x + e.width / 2, h = e.y + e.height / 2, p = t / 2 - d * c, E = n / 2 - h * c, b = $h(e, p, E, c, t, n), S = {
    left: Math.min(b.left - s.left, 0),
    top: Math.min(b.top - s.top, 0),
    right: Math.min(b.right - s.right, 0),
    bottom: Math.min(b.bottom - s.bottom, 0)
  };
  return {
    x: p - S.left + S.right,
    y: E - S.top + S.bottom,
    zoom: c
  };
}
function Sh(e, t) {
  return {
    x: t.x + e.x,
    y: t.y + e.y,
    z: (e.z > t.z ? e.z : t.z) + 1
  };
}
function pa(e, t) {
  if (!e.parentNode)
    return !1;
  const n = t.get(e.parentNode);
  return n ? n.selected ? !0 : pa(n, t) : !1;
}
function $n(e, t) {
  return typeof e > "u" ? "" : typeof e == "string" ? e : `${t ? `${t}__` : ""}${Object.keys(e).sort().map((o) => `${o}=${e[o]}`).join("&")}`;
}
function wi(e) {
  const t = e.ctrlKey && Sn() ? 10 : 1;
  return -e.deltaY * (e.deltaMode === 1 ? 0.05 : e.deltaMode ? 1 : 2e-3) * t;
}
function Tr(e, t, n) {
  return e < t ? Lt(Math.abs(e - t), 1, t) / t : e > n ? -Lt(Math.abs(e - n), 1, t) / t : 0;
}
function va(e, t, n = 15, o = 40) {
  const i = Tr(e.x, o, t.width - o) * n, r = Tr(e.y, o, t.height - o) * n;
  return [i, r];
}
function Qo(e, t) {
  if (t) {
    const n = e.position.x + e.dimensions.width - t.dimensions.width, o = e.position.y + e.dimensions.height - t.dimensions.height;
    if (n > 0 || o > 0 || e.position.x < 0 || e.position.y < 0) {
      let i = {};
      if (typeof t.style == "function" ? i = { ...t.style(t) } : t.style && (i = { ...t.style }), i.width = i.width ?? `${t.dimensions.width}px`, i.height = i.height ?? `${t.dimensions.height}px`, n > 0)
        if (typeof i.width == "string") {
          const r = Number(i.width.replace("px", ""));
          i.width = `${r + n}px`;
        } else
          i.width += n;
      if (o > 0)
        if (typeof i.height == "string") {
          const r = Number(i.height.replace("px", ""));
          i.height = `${r + o}px`;
        } else
          i.height += o;
      if (e.position.x < 0) {
        const r = Math.abs(e.position.x);
        if (t.position.x = t.position.x - r, typeof i.width == "string") {
          const s = Number(i.width.replace("px", ""));
          i.width = `${s + r}px`;
        } else
          i.width += r;
        e.position.x = 0;
      }
      if (e.position.y < 0) {
        const r = Math.abs(e.position.y);
        if (t.position.y = t.position.y - r, typeof i.height == "string") {
          const s = Number(i.height.replace("px", ""));
          i.height = `${s + r}px`;
        } else
          i.height += r;
        e.position.y = 0;
      }
      t.dimensions.width = Number(i.width.toString().replace("px", "")), t.dimensions.height = Number(i.height.toString().replace("px", "")), typeof t.style == "function" ? t.style = (r) => {
        const s = t.style;
        return {
          ...s(r),
          ...i
        };
      } : t.style = {
        ...t.style,
        ...i
      };
    }
  }
}
function Ir(e, t) {
  var n, o;
  const i = e.filter((s) => s.type === "add" || s.type === "remove");
  for (const s of i)
    if (s.type === "add")
      t.findIndex((l) => l.id === s.item.id) === -1 && t.push(s.item);
    else if (s.type === "remove") {
      const a = t.findIndex((l) => l.id === s.id);
      a !== -1 && t.splice(a, 1);
    }
  const r = t.map((s) => s.id);
  for (const s of t)
    for (const a of e)
      if (a.id === s.id)
        switch (a.type) {
          case "select":
            s.selected = a.selected;
            break;
          case "position":
            if (dn(s) && (typeof a.position < "u" && (s.position = a.position), typeof a.dragging < "u" && (s.dragging = a.dragging), s.expandParent && s.parentNode)) {
              const l = t[r.indexOf(s.parentNode)];
              l && dn(l) && Qo(s, l);
            }
            break;
          case "dimensions":
            if (dn(s) && (typeof a.dimensions < "u" && (s.dimensions = a.dimensions), typeof a.updateStyle < "u" && a.updateStyle && (s.style = {
              ...s.style || {},
              width: `${(n = a.dimensions) == null ? void 0 : n.width}px`,
              height: `${(o = a.dimensions) == null ? void 0 : o.height}px`
            }), typeof a.resizing < "u" && (s.resizing = a.resizing), s.expandParent && s.parentNode)) {
              const l = t[r.indexOf(s.parentNode)];
              l && dn(l) && (!!l.dimensions.width && !!l.dimensions.height ? Qo(s, l) : Ye(() => {
                Qo(s, l);
              }));
            }
            break;
        }
  return t;
}
function _t(e, t) {
  return {
    id: e,
    type: "select",
    selected: t
  };
}
function Dr(e) {
  return {
    item: e,
    type: "add"
  };
}
function Ar(e) {
  return {
    id: e,
    type: "remove"
  };
}
function Pr(e, t, n, o, i) {
  return {
    id: e,
    source: t,
    target: n,
    sourceHandle: o || null,
    targetHandle: i || null,
    type: "remove"
  };
}
function bt(e, t = /* @__PURE__ */ new Set(), n = !1) {
  const o = [];
  for (const [i, r] of e) {
    const s = t.has(i);
    !(r.selected === void 0 && !s) && r.selected !== s && (n && (r.selected = s), o.push(_t(r.id, s)));
  }
  return o;
}
const zr = () => {
};
function ne(e) {
  const t = /* @__PURE__ */ new Set();
  let n = zr, o = () => !1;
  const i = () => t.size > 0 || o(), r = (h) => {
    n = h;
  }, s = () => {
    n = zr;
  }, a = (h) => {
    o = h;
  }, l = () => {
    o = () => !1;
  }, u = (h) => {
    t.delete(h);
  };
  return {
    on: (h) => {
      t.add(h);
      const p = () => u(h);
      return mn(p), { off: p };
    },
    off: u,
    trigger: (h) => {
      const p = [n];
      return i() ? p.push(...t) : e && p.push(e), Promise.allSettled(p.map((E) => E(h)));
    },
    hasListeners: i,
    listeners: t,
    setEmitter: r,
    removeEmitter: s,
    setHasEmitListeners: a,
    removeHasEmitListeners: l
  };
}
function Or(e, t, n) {
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
function Nh(e, t, n, o) {
  var i, r;
  const s = /* @__PURE__ */ new Map();
  for (const [a, l] of e)
    (l.selected || l.id === o) && (!l.parentNode || !pa(l, e)) && (l.draggable || t && typeof l.draggable > "u") && e.get(a) && s.set(a, {
      id: l.id,
      position: l.position || { x: 0, y: 0 },
      distance: {
        x: n.x - ((i = l.computedPosition) == null ? void 0 : i.x) || 0,
        y: n.y - ((r = l.computedPosition) == null ? void 0 : r.y) || 0
      },
      from: { x: l.computedPosition.x, y: l.computedPosition.y },
      extent: l.extent,
      parentNode: l.parentNode,
      dimensions: { ...l.dimensions },
      expandParent: l.expandParent
    });
  return Array.from(s.values());
}
function jo({
  id: e,
  dragItems: t,
  findNode: n
}) {
  const o = [];
  for (const i of t) {
    const r = n(i.id);
    r && o.push(r);
  }
  return [e ? o.find((i) => i.id === e) : o[0], o];
}
function ga(e) {
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
function kh(e, t, n) {
  const [o, i, r, s] = typeof e != "string" ? ga(e.padding) : [0, 0, 0, 0];
  return n && typeof n.computedPosition.x < "u" && typeof n.computedPosition.y < "u" && typeof n.dimensions.width < "u" && typeof n.dimensions.height < "u" ? [
    [n.computedPosition.x + s, n.computedPosition.y + o],
    [
      n.computedPosition.x + n.dimensions.width - i,
      n.computedPosition.y + n.dimensions.height - r
    ]
  ] : !1;
}
function Ch(e, t, n, o) {
  let i = e.extent || n;
  if ((i === "parent" || !Array.isArray(i) && i?.range === "parent") && !e.expandParent)
    if (e.parentNode && o && e.dimensions.width && e.dimensions.height) {
      const r = kh(i, e, o);
      r && (i = r);
    } else
      t(new Oe(ze.NODE_EXTENT_INVALID, e.id)), i = n;
  else if (Array.isArray(i)) {
    const r = o?.computedPosition.x || 0, s = o?.computedPosition.y || 0;
    i = [
      [i[0][0] + r, i[0][1] + s],
      [i[1][0] + r, i[1][1] + s]
    ];
  } else if (i !== "parent" && i?.range && Array.isArray(i.range)) {
    const [r, s, a, l] = ga(i.padding), u = o?.computedPosition.x || 0, c = o?.computedPosition.y || 0;
    i = [
      [i.range[0][0] + u + l, i.range[0][1] + c + r],
      [i.range[1][0] + u - s, i.range[1][1] + c - a]
    ];
  }
  return i === "parent" ? [
    [Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY],
    [Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY]
  ] : i;
}
function Mh({ width: e, height: t }, n) {
  return [n[0], [n[1][0] - (e || 0), n[1][1] - (t || 0)]];
}
function Xi(e, t, n, o, i) {
  const r = Mh(e.dimensions, Ch(e, n, o, i)), s = aa(t, r);
  return {
    position: {
      x: s.x - (i?.computedPosition.x || 0),
      y: s.y - (i?.computedPosition.y || 0)
    },
    computedPosition: s
  };
}
function jt(e, t, n = ae.Left, o = !1) {
  const i = (t?.x ?? 0) + e.computedPosition.x, r = (t?.y ?? 0) + e.computedPosition.y, { width: s, height: a } = t ?? Ah(e);
  if (o)
    return { x: i + s / 2, y: r + a / 2 };
  switch (t?.position ?? n) {
    case ae.Top:
      return { x: i + s / 2, y: r };
    case ae.Right:
      return { x: i + s, y: r + a / 2 };
    case ae.Bottom:
      return { x: i + s / 2, y: r + a };
    case ae.Left:
      return { x: i, y: r + a / 2 };
  }
}
function Rr(e, t) {
  return e && (t ? e.find((n) => n.id === t) : e[0]) || null;
}
function Th({
  sourcePos: e,
  targetPos: t,
  sourceWidth: n,
  sourceHeight: o,
  targetWidth: i,
  targetHeight: r,
  width: s,
  height: a,
  viewport: l
}) {
  const u = {
    x: Math.min(e.x, t.x),
    y: Math.min(e.y, t.y),
    x2: Math.max(e.x + n, t.x + i),
    y2: Math.max(e.y + o, t.y + r)
  };
  u.x === u.x2 && (u.x2 += 1), u.y === u.y2 && (u.y2 += 1);
  const c = _o({
    x: (0 - l.x) / l.zoom,
    y: (0 - l.y) / l.zoom,
    width: s / l.zoom,
    height: a / l.zoom
  }), d = Math.max(0, Math.min(c.x2, u.x2) - Math.max(c.x, u.x)), h = Math.max(0, Math.min(c.y2, u.y2) - Math.max(c.y, u.y));
  return Math.ceil(d * h) > 0;
}
function Ih(e, t, n = !1) {
  const o = typeof e.zIndex == "number";
  let i = o ? e.zIndex : 0;
  const r = t(e.source), s = t(e.target);
  return !r || !s ? 0 : (n && (i = o ? e.zIndex : Math.max(r.computedPosition.z || 0, s.computedPosition.z || 0)), i);
}
var ze = /* @__PURE__ */ ((e) => (e.MISSING_STYLES = "MISSING_STYLES", e.MISSING_VIEWPORT_DIMENSIONS = "MISSING_VIEWPORT_DIMENSIONS", e.NODE_INVALID = "NODE_INVALID", e.NODE_NOT_FOUND = "NODE_NOT_FOUND", e.NODE_MISSING_PARENT = "NODE_MISSING_PARENT", e.NODE_TYPE_MISSING = "NODE_TYPE_MISSING", e.NODE_EXTENT_INVALID = "NODE_EXTENT_INVALID", e.EDGE_INVALID = "EDGE_INVALID", e.EDGE_NOT_FOUND = "EDGE_NOT_FOUND", e.EDGE_SOURCE_MISSING = "EDGE_SOURCE_MISSING", e.EDGE_TARGET_MISSING = "EDGE_TARGET_MISSING", e.EDGE_TYPE_MISSING = "EDGE_TYPE_MISSING", e.EDGE_SOURCE_TARGET_SAME = "EDGE_SOURCE_TARGET_SAME", e.EDGE_SOURCE_TARGET_MISSING = "EDGE_SOURCE_TARGET_MISSING", e.EDGE_ORPHANED = "EDGE_ORPHANED", e.USEVUEFLOW_OPTIONS = "USEVUEFLOW_OPTIONS", e))(ze || {});
const Br = {
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
class Oe extends Error {
  constructor(t, ...n) {
    var o;
    super((o = Br[t]) == null ? void 0 : o.call(Br, ...n)), this.name = "VueFlowError", this.code = t, this.args = n;
  }
}
function Gi(e) {
  return "clientX" in e;
}
function Dh(e) {
  return "sourceEvent" in e;
}
function nt(e, t) {
  const n = Gi(e);
  let o, i;
  return n ? (o = e.clientX, i = e.clientY) : "touches" in e && e.touches.length > 0 ? (o = e.touches[0].clientX, i = e.touches[0].clientY) : "changedTouches" in e && e.changedTouches.length > 0 ? (o = e.changedTouches[0].clientX, i = e.changedTouches[0].clientY) : (o = 0, i = 0), {
    x: o - (t?.left ?? 0),
    y: i - (t?.top ?? 0)
  };
}
const Sn = () => {
  var e;
  return typeof navigator < "u" && ((e = navigator?.userAgent) == null ? void 0 : e.indexOf("Mac")) >= 0;
};
function Ah(e) {
  var t, n;
  return {
    width: ((t = e.dimensions) == null ? void 0 : t.width) ?? e.width ?? 0,
    height: ((n = e.dimensions) == null ? void 0 : n.height) ?? e.height ?? 0
  };
}
function Do(e, t = [1, 1]) {
  return {
    x: t[0] * Math.round(e.x / t[0]),
    y: t[1] * Math.round(e.y / t[1])
  };
}
const Ph = () => !0;
function ei(e) {
  e?.classList.remove("valid", "connecting", "vue-flow__handle-valid", "vue-flow__handle-connecting");
}
function zh(e, t, n) {
  const o = [], i = {
    x: e.x - n,
    y: e.y - n,
    width: n * 2,
    height: n * 2
  };
  for (const r of t.values())
    yo(i, mo(r)) > 0 && o.push(r);
  return o;
}
const Oh = 250;
function Rh(e, t, n, o) {
  var i, r;
  let s = [], a = Number.POSITIVE_INFINITY;
  const l = zh(e, n, t + Oh);
  for (const u of l) {
    const c = [...((i = u.handleBounds) == null ? void 0 : i.source) ?? [], ...((r = u.handleBounds) == null ? void 0 : r.target) ?? []];
    for (const d of c) {
      if (o.nodeId === d.nodeId && o.type === d.type && o.id === d.id)
        continue;
      const { x: h, y: p } = jt(u, d, d.position, !0), E = Math.sqrt((h - e.x) ** 2 + (p - e.y) ** 2);
      E > t || (E < a ? (s = [{ ...d, x: h, y: p }], a = E) : E === a && s.push({ ...d, x: h, y: p }));
    }
  }
  if (!s.length)
    return null;
  if (s.length > 1) {
    const u = o.type === "source" ? "target" : "source";
    return s.find((c) => c.type === u) ?? s[0];
  }
  return s[0];
}
function Vr(e, {
  handle: t,
  connectionMode: n,
  fromNodeId: o,
  fromHandleId: i,
  fromType: r,
  doc: s,
  lib: a,
  flowId: l,
  isValidConnection: u = Ph
}, c, d, h, p) {
  const E = r === "target", b = t ? s.querySelector(`.${a}-flow__handle[data-id="${l}-${t?.nodeId}-${t?.id}-${t?.type}"]`) : null, { x: S, y: _ } = nt(e), P = s.elementFromPoint(S, _), y = P?.classList.contains(`${a}-flow__handle`) ? P : b, $ = {
    handleDomNode: y,
    isValid: !1,
    connection: null,
    toHandle: null
  };
  if (y) {
    const R = ma(void 0, y), U = y.getAttribute("data-nodeid"), L = y.getAttribute("data-handleid"), Y = y.classList.contains("connectable"), ie = y.classList.contains("connectableend");
    if (!U || !R)
      return $;
    const H = {
      source: E ? U : o,
      sourceHandle: E ? L : i,
      target: E ? o : U,
      targetHandle: E ? i : L
    };
    $.connection = H;
    const C = Y && ie && (n === St.Strict ? E && R === "source" || !E && R === "target" : U !== o || L !== i);
    $.isValid = C && u(H, {
      nodes: d,
      edges: c,
      sourceNode: h(H.source),
      targetNode: h(H.target)
    }), $.toHandle = ya(U, R, L, p, n, !0);
  }
  return $;
}
function ma(e, t) {
  return e || (t?.classList.contains("target") ? "target" : t?.classList.contains("source") ? "source" : null);
}
function Bh(e, t) {
  let n = null;
  return t ? n = "valid" : e && !t && (n = "invalid"), n;
}
function Vh(e, t) {
  let n = null;
  return t ? n = !0 : e && !t && (n = !1), n;
}
function ya(e, t, n, o, i, r = !1) {
  var s, a, l;
  const u = o.get(e);
  if (!u)
    return null;
  const c = i === St.Strict ? (s = u.handleBounds) == null ? void 0 : s[t] : [...((a = u.handleBounds) == null ? void 0 : a.source) ?? [], ...((l = u.handleBounds) == null ? void 0 : l.target) ?? []], d = (n ? c?.find((h) => h.id === n) : c?.[0]) ?? null;
  return d && r ? { ...d, ...jt(u, d, d.position, !0) } : d;
}
const bi = {
  [ae.Left]: ae.Right,
  [ae.Right]: ae.Left,
  [ae.Top]: ae.Bottom,
  [ae.Bottom]: ae.Top
}, Lh = ["production", "prod"];
function Dn(e, ...t) {
  _a() && console.warn(`[Vue Flow]: ${e}`, ...t);
}
function _a() {
  return !Lh.includes("production");
}
function Lr(e, t, n, o, i) {
  const r = t.querySelectorAll(`.vue-flow__handle.${e}`);
  return r?.length ? Array.from(r).map((s) => {
    const a = s.getBoundingClientRect();
    return {
      id: s.getAttribute("data-handleid"),
      type: e,
      nodeId: i,
      position: s.getAttribute("data-handlepos"),
      x: (a.left - n.left) / o,
      y: (a.top - n.top) / o,
      ...Io(s)
    };
  }) : null;
}
function xi(e, t, n, o, i, r = !1, s) {
  i.value = !1, e.selected ? (r || e.selected && t) && (o([e]), Ye(() => {
    s.blur();
  })) : n([e]);
}
function Ae(e) {
  return typeof K(e) < "u";
}
function Hh(e, t, n, o) {
  if (!e || !e.source || !e.target)
    return n(new Oe(ze.EDGE_INVALID, e?.id ?? "[ID UNKNOWN]")), !1;
  let i;
  return Nt(e) ? i = e : i = {
    ...e,
    id: ca(e)
  }, i = la(i, void 0, o), bh(i, t) ? !1 : i;
}
function Fh(e, t, n, o, i) {
  if (!t.source || !t.target)
    return i(new Oe(ze.EDGE_INVALID, e.id)), !1;
  if (!n)
    return i(new Oe(ze.EDGE_NOT_FOUND, e.id)), !1;
  const { id: r, ...s } = e;
  return {
    ...s,
    id: o ? ca(t) : r,
    source: t.source,
    target: t.target,
    sourceHandle: t.sourceHandle,
    targetHandle: t.targetHandle
  };
}
function Hr(e, t, n) {
  const o = {}, i = [];
  for (let r = 0; r < e.length; ++r) {
    const s = e[r];
    if (!zt(s)) {
      n(
        new Oe(ze.NODE_INVALID, s?.id) || `[ID UNKNOWN|INDEX ${r}]`
      );
      continue;
    }
    const a = yh(s, t(s.id), s.parentNode);
    s.parentNode && (o[s.parentNode] = !0), i[r] = a;
  }
  for (const r of i) {
    const s = t(r.parentNode) || i.find((a) => a.id === r.parentNode);
    r.parentNode && !s && n(new Oe(ze.NODE_MISSING_PARENT, r.id, r.parentNode)), (r.parentNode || o[r.id]) && (o[r.id] && (r.isParent = !0), s && (s.isParent = !0));
  }
  return i;
}
function Fr(e, t, n, o, i, r) {
  let s = i;
  const a = o.get(s) || /* @__PURE__ */ new Map();
  o.set(s, a.set(n, t)), s = `${i}-${e}`;
  const l = o.get(s) || /* @__PURE__ */ new Map();
  if (o.set(s, l.set(n, t)), r) {
    s = `${i}-${e}-${r}`;
    const u = o.get(s) || /* @__PURE__ */ new Map();
    o.set(s, u.set(n, t));
  }
}
function ti(e, t, n) {
  e.clear();
  for (const o of n) {
    const { source: i, target: r, sourceHandle: s = null, targetHandle: a = null } = o, l = { edgeId: o.id, source: i, target: r, sourceHandle: s, targetHandle: a }, u = `${i}-${s}--${r}-${a}`, c = `${r}-${a}--${i}-${s}`;
    Fr("source", l, c, e, i, s), Fr("target", l, u, e, r, a);
  }
}
function Ur(e, t) {
  if (e.size !== t.size)
    return !1;
  for (const n of e)
    if (!t.has(n))
      return !1;
  return !0;
}
function ni(e, t, n, o, i, r, s, a) {
  const l = [];
  for (const u of e) {
    const c = Nt(u) ? u : Hh(u, a, i, r);
    if (!c)
      continue;
    const d = n(c.source), h = n(c.target);
    if (!d || !h) {
      i(new Oe(ze.EDGE_SOURCE_TARGET_MISSING, c.id, c.source, c.target));
      continue;
    }
    if (!d) {
      i(new Oe(ze.EDGE_SOURCE_MISSING, c.id, c.source));
      continue;
    }
    if (!h) {
      i(new Oe(ze.EDGE_TARGET_MISSING, c.id, c.target));
      continue;
    }
    if (t && !t(c, {
      edges: a,
      nodes: s,
      sourceNode: d,
      targetNode: h
    })) {
      i(new Oe(ze.EDGE_INVALID, c.id));
      continue;
    }
    const p = o(c.id);
    l.push({
      ...la(c, p, r),
      sourceNode: d,
      targetNode: h
    });
  }
  return l;
}
const Yr = Symbol("vueFlow"), wa = Symbol("nodeId"), ba = Symbol("nodeRef"), Uh = Symbol("edgeId"), Yh = Symbol("edgeRef"), Ao = Symbol("slots");
function xa(e) {
  const {
    vueFlowRef: t,
    snapToGrid: n,
    snapGrid: o,
    noDragClassName: i,
    nodeLookup: r,
    nodeExtent: s,
    nodeDragThreshold: a,
    viewport: l,
    autoPanOnNodeDrag: u,
    autoPanSpeed: c,
    nodesDraggable: d,
    panBy: h,
    findNode: p,
    multiSelectionActive: E,
    nodesSelectionActive: b,
    selectNodesOnDrag: S,
    removeSelectedElements: _,
    addSelectedNodes: P,
    updateNodePositions: y,
    emits: $
  } = Me(), { onStart: R, onDrag: U, onStop: L, onClick: Y, el: ie, disabled: H, id: X, selectable: C, dragHandle: oe } = e, f = $t(!1);
  let N = [], v, I = null, k = { x: void 0, y: void 0 }, z = { x: 0, y: 0 }, T = null, B = !1, q = !1, j = 0, re = !1;
  const G = qh(), F = ({ x: ue, y: pe }) => {
    k = { x: ue, y: pe };
    let m = !1;
    if (N = N.map((g) => {
      const w = { x: ue - g.distance.x, y: pe - g.distance.y }, { computedPosition: D } = Xi(
        g,
        n.value ? Do(w, o.value) : w,
        $.error,
        s.value,
        g.parentNode ? p(g.parentNode) : void 0
      );
      return m = m || g.position.x !== D.x || g.position.y !== D.y, g.position = D, g;
    }), q = q || m, !!m && (y(N, !0, !0), f.value = !0, T)) {
      const [g, w] = jo({
        id: X,
        dragItems: N,
        findNode: p
      });
      U({ event: T, node: g, nodes: w });
    }
  }, ee = () => {
    if (!I)
      return;
    const [ue, pe] = va(z, I, c.value);
    if (ue !== 0 || pe !== 0) {
      const m = {
        x: (k.x ?? 0) - ue / l.value.zoom,
        y: (k.y ?? 0) - pe / l.value.zoom
      };
      h({ x: ue, y: pe }) && F(m);
    }
    j = requestAnimationFrame(ee);
  }, he = (ue, pe) => {
    B = !0;
    const m = p(X);
    !S.value && !E.value && m && (m.selected || _()), m && be(C) && S.value && xi(
      m,
      E.value,
      P,
      _,
      b,
      !1,
      pe
    );
    const g = G(ue.sourceEvent);
    if (k = g, N = Nh(r.value, d.value, g, X), N.length) {
      const [w, D] = jo({
        id: X,
        dragItems: N,
        findNode: p
      });
      R({ event: ue.sourceEvent, node: w, nodes: D });
    }
  }, ve = (ue, pe) => {
    var m;
    ue.sourceEvent.type === "touchmove" && ue.sourceEvent.touches.length > 1 || (q = !1, a.value === 0 && he(ue, pe), k = G(ue.sourceEvent), I = ((m = t.value) == null ? void 0 : m.getBoundingClientRect()) || null, z = nt(ue.sourceEvent, I));
  }, de = (ue, pe) => {
    const m = G(ue.sourceEvent);
    if (!re && B && u.value && (re = !0, ee()), !B) {
      const g = m.xSnapped - (k.x ?? 0), w = m.ySnapped - (k.y ?? 0);
      Math.sqrt(g * g + w * w) > a.value && he(ue, pe);
    }
    (k.x !== m.xSnapped || k.y !== m.ySnapped) && N.length && B && (T = ue.sourceEvent, z = nt(ue.sourceEvent, I), F(m));
  }, we = (ue) => {
    let pe = !1;
    if (!B && !f.value && !E.value) {
      const m = ue.sourceEvent, g = G(m), w = g.xSnapped - (k.x ?? 0), D = g.ySnapped - (k.y ?? 0), M = Math.sqrt(w * w + D * D);
      M !== 0 && M <= a.value && (Y?.(m), pe = !0);
    }
    if (N.length && !pe) {
      q && (y(N, !1, !1), q = !1);
      const [m, g] = jo({
        id: X,
        dragItems: N,
        findNode: p
      });
      L({ event: ue.sourceEvent, node: m, nodes: g });
    }
    N = [], f.value = !1, re = !1, B = !1, k = { x: void 0, y: void 0 }, cancelAnimationFrame(j);
  };
  return Ne([() => be(H), ie], ([ue, pe], m, g) => {
    if (pe) {
      const w = We(pe);
      ue || (v = gd().on("start", (D) => ve(D, pe)).on("drag", (D) => de(D, pe)).on("end", (D) => we(D)).filter((D) => {
        const M = D.target, J = be(oe);
        return !D.button && (!i.value || !Or(M, `.${i.value}`, pe) && (!J || Or(M, J, pe)));
      }), w.call(v)), g(() => {
        w.on(".drag", null), v && (v.on("start", null), v.on("drag", null), v.on("end", null));
      });
    }
  }), f;
}
function Xh() {
  return {
    doubleClick: ne(),
    click: ne(),
    mouseEnter: ne(),
    mouseMove: ne(),
    mouseLeave: ne(),
    contextMenu: ne(),
    updateStart: ne(),
    update: ne(),
    updateEnd: ne()
  };
}
function Gh(e, t) {
  const n = Xh();
  return n.doubleClick.on((o) => {
    var i, r;
    t.edgeDoubleClick(o), (r = (i = e.events) == null ? void 0 : i.doubleClick) == null || r.call(i, o);
  }), n.click.on((o) => {
    var i, r;
    t.edgeClick(o), (r = (i = e.events) == null ? void 0 : i.click) == null || r.call(i, o);
  }), n.mouseEnter.on((o) => {
    var i, r;
    t.edgeMouseEnter(o), (r = (i = e.events) == null ? void 0 : i.mouseEnter) == null || r.call(i, o);
  }), n.mouseMove.on((o) => {
    var i, r;
    t.edgeMouseMove(o), (r = (i = e.events) == null ? void 0 : i.mouseMove) == null || r.call(i, o);
  }), n.mouseLeave.on((o) => {
    var i, r;
    t.edgeMouseLeave(o), (r = (i = e.events) == null ? void 0 : i.mouseLeave) == null || r.call(i, o);
  }), n.contextMenu.on((o) => {
    var i, r;
    t.edgeContextMenu(o), (r = (i = e.events) == null ? void 0 : i.contextMenu) == null || r.call(i, o);
  }), n.updateStart.on((o) => {
    var i, r;
    t.edgeUpdateStart(o), (r = (i = e.events) == null ? void 0 : i.updateStart) == null || r.call(i, o);
  }), n.update.on((o) => {
    var i, r;
    t.edgeUpdate(o), (r = (i = e.events) == null ? void 0 : i.update) == null || r.call(i, o);
  }), n.updateEnd.on((o) => {
    var i, r;
    t.edgeUpdateEnd(o), (r = (i = e.events) == null ? void 0 : i.updateEnd) == null || r.call(i, o);
  }), Object.entries(n).reduce(
    (o, [i, r]) => (o.emit[i] = r.trigger, o.on[i] = r.on, o),
    { emit: {}, on: {} }
  );
}
function qh() {
  const { viewport: e, snapGrid: t, snapToGrid: n, vueFlowRef: o } = Me();
  return (i) => {
    var r;
    const s = ((r = o.value) == null ? void 0 : r.getBoundingClientRect()) ?? { left: 0, top: 0 }, a = Dh(i) ? i.sourceEvent : i, { x: l, y: u } = nt(a, s), c = En({ x: l, y: u }, e.value), { x: d, y: h } = n.value ? Do(c, t.value) : c;
    return {
      xSnapped: d,
      ySnapped: h,
      ...c
    };
  };
}
function Fn() {
  return !0;
}
function Ea({
  handleId: e,
  nodeId: t,
  type: n,
  isValidConnection: o,
  edgeUpdaterType: i,
  onEdgeUpdate: r,
  onEdgeUpdateEnd: s
}) {
  const {
    id: a,
    vueFlowRef: l,
    connectionMode: u,
    connectionRadius: c,
    connectOnClick: d,
    connectionClickStartHandle: h,
    nodesConnectable: p,
    autoPanOnConnect: E,
    autoPanSpeed: b,
    findNode: S,
    panBy: _,
    startConnection: P,
    updateConnection: y,
    endConnection: $,
    emits: R,
    viewport: U,
    edges: L,
    nodes: Y,
    isValidConnection: ie,
    nodeLookup: H
  } = Me();
  let X = null, C = !1, oe = null;
  function f(v) {
    var I;
    const k = be(n) === "target", z = Gi(v), T = Cr(v.target), B = v.currentTarget;
    if (B && (z && v.button === 0 || !z)) {
      let q = function(se) {
        m = nt(se, we), F = Rh(
          En(m, U.value, !1, [1, 1]),
          c.value,
          H.value,
          D
        ), g || (w(), g = !0);
        const fe = Vr(
          se,
          {
            handle: F,
            connectionMode: u.value,
            fromNodeId: be(t),
            fromHandleId: be(e),
            fromType: k ? "target" : "source",
            isValidConnection: G,
            doc: T,
            lib: "vue",
            flowId: a,
            nodeLookup: H.value
          },
          L.value,
          Y.value,
          S,
          H.value
        );
        oe = fe.handleDomNode, X = fe.connection, C = Vh(!!F, fe.isValid);
        const ye = {
          // from stays the same
          ...le,
          isValid: C,
          to: fe.toHandle && C ? xn({ x: fe.toHandle.x, y: fe.toHandle.y }, U.value) : m,
          toHandle: fe.toHandle,
          toPosition: C && fe.toHandle ? fe.toHandle.position : bi[D.position],
          toNode: fe.toHandle ? H.value.get(fe.toHandle.nodeId) : null
        };
        if (C && F && le?.toHandle && ye.toHandle && le.toHandle.type === ye.toHandle.type && le.toHandle.nodeId === ye.toHandle.nodeId && le.toHandle.id === ye.toHandle.id && le.to.x === ye.to.x && le.to.y === ye.to.y)
          return;
        const xe = F ?? fe.toHandle;
        if (y(
          xe && C ? xn(
            {
              x: xe.x,
              y: xe.y
            },
            U.value
          ) : m,
          xe,
          Bh(!!xe, C)
        ), le = ye, !F && !C && !oe)
          return ei(pe);
        X && X.source !== X.target && oe && (ei(pe), pe = oe, oe.classList.add("connecting", "vue-flow__handle-connecting"), oe.classList.toggle("valid", !!C), oe.classList.toggle("vue-flow__handle-valid", !!C));
      }, j = function(se) {
        "touches" in se && se.touches.length > 0 || ((F || oe) && X && C && (r ? r(se, X) : R.connect(X)), R.connectEnd(se), i && s?.(se), ei(pe), cancelAnimationFrame(ee), $(se), g = !1, C = !1, X = null, oe = null, T.removeEventListener("mousemove", q), T.removeEventListener("mouseup", j), T.removeEventListener("touchmove", q), T.removeEventListener("touchend", j));
      };
      const re = S(be(t));
      let G = be(o) || ie.value || Fn;
      !G && re && (G = (k ? re.isValidSourcePos : re.isValidTargetPos) || Fn);
      let F, ee = 0;
      const { x: he, y: ve } = nt(v), de = ma(be(i), B), we = (I = l.value) == null ? void 0 : I.getBoundingClientRect();
      if (!we || !de)
        return;
      const ue = ya(be(t), de, be(e), H.value, u.value);
      if (!ue)
        return;
      let pe, m = nt(v, we), g = !1;
      const w = () => {
        if (!E.value)
          return;
        const [se, fe] = va(m, we, b.value);
        _({ x: se, y: fe }), ee = requestAnimationFrame(w);
      }, D = {
        ...ue,
        nodeId: be(t),
        type: de,
        position: ue.position
      }, M = H.value.get(be(t)), Q = {
        inProgress: !0,
        isValid: null,
        from: jt(M, D, ae.Left, !0),
        fromHandle: D,
        fromPosition: D.position,
        fromNode: M,
        to: m,
        toHandle: null,
        toPosition: bi[D.position],
        toNode: null
      };
      P(
        {
          nodeId: be(t),
          id: be(e),
          type: de,
          position: B?.getAttribute("data-handlepos") || ae.Top,
          ...m
        },
        {
          x: he - we.left,
          y: ve - we.top
        }
      ), R.connectStart({ event: v, nodeId: be(t), handleId: be(e), handleType: de });
      let le = Q;
      T.addEventListener("mousemove", q), T.addEventListener("mouseup", j), T.addEventListener("touchmove", q), T.addEventListener("touchend", j);
    }
  }
  function N(v) {
    var I, k;
    if (!d.value)
      return;
    const z = be(n) === "target";
    if (!h.value) {
      R.clickConnectStart({ event: v, nodeId: be(t), handleId: be(e) }), P(
        {
          nodeId: be(t),
          type: be(n),
          id: be(e),
          position: ae.Top,
          ...nt(v)
        },
        void 0,
        !0
      );
      return;
    }
    let T = be(o) || ie.value || Fn;
    const B = S(be(t));
    if (!T && B && (T = (z ? B.isValidSourcePos : B.isValidTargetPos) || Fn), B && (typeof B.connectable > "u" ? p.value : B.connectable) === !1)
      return;
    const q = Cr(v.target), j = Vr(
      v,
      {
        handle: {
          nodeId: be(t),
          id: be(e),
          type: be(n),
          position: ae.Top,
          ...nt(v)
        },
        connectionMode: u.value,
        fromNodeId: h.value.nodeId,
        fromHandleId: h.value.id ?? null,
        fromType: h.value.type,
        isValidConnection: T,
        doc: q,
        lib: "vue",
        flowId: a,
        nodeLookup: H.value
      },
      L.value,
      Y.value,
      S,
      H.value
    ), re = ((I = j.connection) == null ? void 0 : I.source) === ((k = j.connection) == null ? void 0 : k.target);
    j.isValid && j.connection && !re && R.connect(j.connection), R.clickConnectEnd(v), $(v, !0);
  }
  return {
    handlePointerDown: f,
    handleClick: N
  };
}
function Wh() {
  return mt(wa, "");
}
function $a(e) {
  const t = e ?? Wh() ?? "", n = mt(ba, _e(null)), { findNode: o, edges: i, emits: r } = Me(), s = o(t);
  return s || r.error(new Oe(ze.NODE_NOT_FOUND, t)), {
    id: t,
    nodeEl: n,
    node: s,
    parentNode: ce(() => o(s.parentNode)),
    connectedEdges: ce(() => Tt([s], i.value))
  };
}
function Zh() {
  return {
    doubleClick: ne(),
    click: ne(),
    mouseEnter: ne(),
    mouseMove: ne(),
    mouseLeave: ne(),
    contextMenu: ne(),
    dragStart: ne(),
    drag: ne(),
    dragStop: ne()
  };
}
function Kh(e, t) {
  const n = Zh();
  return n.doubleClick.on((o) => {
    var i, r;
    t.nodeDoubleClick(o), (r = (i = e.events) == null ? void 0 : i.doubleClick) == null || r.call(i, o);
  }), n.click.on((o) => {
    var i, r;
    t.nodeClick(o), (r = (i = e.events) == null ? void 0 : i.click) == null || r.call(i, o);
  }), n.mouseEnter.on((o) => {
    var i, r;
    t.nodeMouseEnter(o), (r = (i = e.events) == null ? void 0 : i.mouseEnter) == null || r.call(i, o);
  }), n.mouseMove.on((o) => {
    var i, r;
    t.nodeMouseMove(o), (r = (i = e.events) == null ? void 0 : i.mouseMove) == null || r.call(i, o);
  }), n.mouseLeave.on((o) => {
    var i, r;
    t.nodeMouseLeave(o), (r = (i = e.events) == null ? void 0 : i.mouseLeave) == null || r.call(i, o);
  }), n.contextMenu.on((o) => {
    var i, r;
    t.nodeContextMenu(o), (r = (i = e.events) == null ? void 0 : i.contextMenu) == null || r.call(i, o);
  }), n.dragStart.on((o) => {
    var i, r;
    t.nodeDragStart(o), (r = (i = e.events) == null ? void 0 : i.dragStart) == null || r.call(i, o);
  }), n.drag.on((o) => {
    var i, r;
    t.nodeDrag(o), (r = (i = e.events) == null ? void 0 : i.drag) == null || r.call(i, o);
  }), n.dragStop.on((o) => {
    var i, r;
    t.nodeDragStop(o), (r = (i = e.events) == null ? void 0 : i.dragStop) == null || r.call(i, o);
  }), Object.entries(n).reduce(
    (o, [i, r]) => (o.emit[i] = r.trigger, o.on[i] = r.on, o),
    { emit: {}, on: {} }
  );
}
function Sa() {
  const { getSelectedNodes: e, nodeExtent: t, updateNodePositions: n, findNode: o, snapGrid: i, snapToGrid: r, nodesDraggable: s, emits: a } = Me();
  return (l, u = !1) => {
    const c = r.value ? i.value[0] : 5, d = r.value ? i.value[1] : 5, h = u ? 4 : 1, p = l.x * c * h, E = l.y * d * h, b = [];
    for (const S of e.value)
      if (S.draggable || s && typeof S.draggable > "u") {
        const _ = { x: S.computedPosition.x + p, y: S.computedPosition.y + E }, { position: P } = Xi(
          S,
          _,
          a.error,
          t.value,
          S.parentNode ? o(S.parentNode) : void 0
        );
        b.push({
          id: S.id,
          position: P,
          from: S.position,
          distance: { x: l.x, y: l.y },
          dimensions: S.dimensions
        });
      }
    n(b, !0, !1);
  };
}
const Un = 0.1, Jh = (e) => ((e *= 2) <= 1 ? e * e * e : (e -= 2) * e * e + 2) / 2;
function yt() {
  return Dn("Viewport not initialized yet."), Promise.resolve(!1);
}
const Qh = {
  zoomIn: yt,
  zoomOut: yt,
  zoomTo: yt,
  fitView: yt,
  setCenter: yt,
  fitBounds: yt,
  project: (e) => e,
  screenToFlowCoordinate: (e) => e,
  flowToScreenCoordinate: (e) => e,
  setViewport: yt,
  setTransform: yt,
  getViewport: () => ({ x: 0, y: 0, zoom: 1 }),
  getTransform: () => ({ x: 0, y: 0, zoom: 1 }),
  viewportInitialized: !1
};
function jh(e) {
  function t(o, i) {
    return new Promise((r) => {
      e.d3Selection && e.d3Zoom ? e.d3Zoom.interpolate(i?.interpolate === "linear" ? pn : jn).scaleBy(
        oi(e.d3Selection, i?.duration, i?.ease, () => {
          r(!0);
        }),
        o
      ) : r(!1);
    });
  }
  function n(o, i, r, s) {
    return new Promise((a) => {
      var l;
      const { x: u, y: c } = aa({ x: -o, y: -i }, e.translateExtent), d = Qt.translate(-u, -c).scale(r);
      e.d3Selection && e.d3Zoom ? (l = e.d3Zoom) == null || l.interpolate(s?.interpolate === "linear" ? pn : jn).transform(
        oi(e.d3Selection, s?.duration, s?.ease, () => {
          a(!0);
        }),
        d
      ) : a(!1);
    });
  }
  return ce(() => e.d3Zoom && e.d3Selection && e.dimensions.width && e.dimensions.height ? {
    viewportInitialized: !0,
    // todo: allow passing scale as option
    zoomIn: (i) => t(1.2, i),
    zoomOut: (i) => t(1 / 1.2, i),
    zoomTo: (i, r) => new Promise((s) => {
      e.d3Selection && e.d3Zoom ? e.d3Zoom.interpolate(r?.interpolate === "linear" ? pn : jn).scaleTo(
        oi(e.d3Selection, r?.duration, r?.ease, () => {
          s(!0);
        }),
        i
      ) : s(!1);
    }),
    setViewport: (i, r) => n(i.x, i.y, i.zoom, r),
    setTransform: (i, r) => n(i.x, i.y, i.zoom, r),
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
    fitView: (i = {
      padding: Un,
      includeHiddenNodes: !1,
      duration: 0
    }) => {
      var r, s;
      const a = [];
      for (const h of e.nodes)
        h.dimensions.width && h.dimensions.height && (i?.includeHiddenNodes || !h.hidden) && (!((r = i.nodes) != null && r.length) || (s = i.nodes) != null && s.length && i.nodes.includes(h.id)) && a.push(h);
      if (!a.length)
        return Promise.resolve(!1);
      const l = Yi(a), { x: u, y: c, zoom: d } = Mr(
        l,
        e.dimensions.width,
        e.dimensions.height,
        i.minZoom ?? e.minZoom,
        i.maxZoom ?? e.maxZoom,
        i.padding ?? Un
      );
      return n(u, c, d, i);
    },
    setCenter: (i, r, s) => {
      const a = typeof s?.zoom < "u" ? s.zoom : e.maxZoom, l = e.dimensions.width / 2 - i * a, u = e.dimensions.height / 2 - r * a;
      return n(l, u, a, s);
    },
    fitBounds: (i, r = { padding: Un }) => {
      const { x: s, y: a, zoom: l } = Mr(
        i,
        e.dimensions.width,
        e.dimensions.height,
        e.minZoom,
        e.maxZoom,
        r.padding ?? Un
      );
      return n(s, a, l, r);
    },
    project: (i) => En(i, e.viewport, e.snapToGrid, e.snapGrid),
    screenToFlowCoordinate: (i) => {
      if (e.vueFlowRef) {
        const { x: r, y: s } = e.vueFlowRef.getBoundingClientRect(), a = {
          x: i.x - r,
          y: i.y - s
        };
        return En(a, e.viewport, e.snapToGrid, e.snapGrid);
      }
      return { x: 0, y: 0 };
    },
    flowToScreenCoordinate: (i) => {
      if (e.vueFlowRef) {
        const { x: r, y: s } = e.vueFlowRef.getBoundingClientRect(), a = {
          x: i.x + r,
          y: i.y + s
        };
        return xn(a, e.viewport);
      }
      return { x: 0, y: 0 };
    }
  } : Qh);
}
function oi(e, t = 0, n = Jh, o = () => {
}) {
  const i = typeof t == "number" && t > 0;
  return i || o(), i ? e.transition().duration(t).ease(n).on("end", o) : e;
}
function ep(e, t, n) {
  const o = Ai(!0);
  return o.run(() => {
    const i = () => {
      o.run(() => {
        let b, S, _ = !!(n.nodes.value.length || n.edges.value.length);
        b = Ut([e.modelValue, () => {
          var P, y;
          return (y = (P = e.modelValue) == null ? void 0 : P.value) == null ? void 0 : y.length;
        }], ([P]) => {
          P && Array.isArray(P) && (S?.pause(), n.setElements(P), !S && !_ && P.length ? _ = !0 : S?.resume());
        }), S = Ut(
          [n.nodes, n.edges, () => n.edges.value.length, () => n.nodes.value.length],
          ([P, y]) => {
            var $;
            ($ = e.modelValue) != null && $.value && Array.isArray(e.modelValue.value) && (b?.pause(), e.modelValue.value = [...P, ...y], Ye(() => {
              b?.resume();
            }));
          },
          { immediate: _ }
        ), Kn(() => {
          b?.stop(), S?.stop();
        });
      });
    }, r = () => {
      o.run(() => {
        let b, S, _ = !!n.nodes.value.length;
        b = Ut([e.nodes, () => {
          var P, y;
          return (y = (P = e.nodes) == null ? void 0 : P.value) == null ? void 0 : y.length;
        }], ([P]) => {
          P && Array.isArray(P) && (S?.pause(), n.setNodes(P), !S && !_ && P.length ? _ = !0 : S?.resume());
        }), S = Ut(
          [n.nodes, () => n.nodes.value.length],
          ([P]) => {
            var y;
            (y = e.nodes) != null && y.value && Array.isArray(e.nodes.value) && (b?.pause(), e.nodes.value = [...P], Ye(() => {
              b?.resume();
            }));
          },
          { immediate: _ }
        ), Kn(() => {
          b?.stop(), S?.stop();
        });
      });
    }, s = () => {
      o.run(() => {
        let b, S, _ = !!n.edges.value.length;
        b = Ut([e.edges, () => {
          var P, y;
          return (y = (P = e.edges) == null ? void 0 : P.value) == null ? void 0 : y.length;
        }], ([P]) => {
          P && Array.isArray(P) && (S?.pause(), n.setEdges(P), !S && !_ && P.length ? _ = !0 : S?.resume());
        }), S = Ut(
          [n.edges, () => n.edges.value.length],
          ([P]) => {
            var y;
            (y = e.edges) != null && y.value && Array.isArray(e.edges.value) && (b?.pause(), e.edges.value = [...P], Ye(() => {
              b?.resume();
            }));
          },
          { immediate: _ }
        ), Kn(() => {
          b?.stop(), S?.stop();
        });
      });
    }, a = () => {
      o.run(() => {
        Ne(
          () => t.maxZoom,
          () => {
            t.maxZoom && Ae(t.maxZoom) && n.setMaxZoom(t.maxZoom);
          },
          {
            immediate: !0
          }
        );
      });
    }, l = () => {
      o.run(() => {
        Ne(
          () => t.minZoom,
          () => {
            t.minZoom && Ae(t.minZoom) && n.setMinZoom(t.minZoom);
          },
          { immediate: !0 }
        );
      });
    }, u = () => {
      o.run(() => {
        Ne(
          () => t.translateExtent,
          () => {
            t.translateExtent && Ae(t.translateExtent) && n.setTranslateExtent(t.translateExtent);
          },
          {
            immediate: !0
          }
        );
      });
    }, c = () => {
      o.run(() => {
        Ne(
          () => t.nodeExtent,
          () => {
            t.nodeExtent && Ae(t.nodeExtent) && n.setNodeExtent(t.nodeExtent);
          },
          {
            immediate: !0
          }
        );
      });
    }, d = () => {
      o.run(() => {
        Ne(
          () => t.applyDefault,
          () => {
            Ae(t.applyDefault) && (n.applyDefault.value = t.applyDefault);
          },
          {
            immediate: !0
          }
        );
      });
    }, h = () => {
      o.run(() => {
        const b = async (S) => {
          let _ = S;
          typeof t.autoConnect == "function" && (_ = await t.autoConnect(S)), _ !== !1 && n.addEdges([_]);
        };
        Ne(
          () => t.autoConnect,
          () => {
            Ae(t.autoConnect) && (n.autoConnect.value = t.autoConnect);
          },
          { immediate: !0 }
        ), Ne(
          n.autoConnect,
          (S, _, P) => {
            S ? n.onConnect(b) : n.hooks.value.connect.off(b), P(() => {
              n.hooks.value.connect.off(b);
            });
          },
          { immediate: !0 }
        );
      });
    }, p = () => {
      const b = [
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
      for (const S of Object.keys(t)) {
        const _ = S;
        if (!b.includes(_)) {
          const P = Ee(() => t[_]), y = n[_];
          Pi(y) && o.run(() => {
            Ne(
              P,
              ($) => {
                Ae($) && (y.value = $);
              },
              { immediate: !0 }
            );
          });
        }
      }
    };
    (() => {
      i(), r(), s(), l(), a(), u(), c(), d(), h(), p();
    })();
  }), () => o.stop();
}
function tp() {
  return {
    edgesChange: ne(),
    nodesChange: ne(),
    nodeDoubleClick: ne(),
    nodeClick: ne(),
    nodeMouseEnter: ne(),
    nodeMouseMove: ne(),
    nodeMouseLeave: ne(),
    nodeContextMenu: ne(),
    nodeDragStart: ne(),
    nodeDrag: ne(),
    nodeDragStop: ne(),
    nodesInitialized: ne(),
    miniMapNodeClick: ne(),
    miniMapNodeDoubleClick: ne(),
    miniMapNodeMouseEnter: ne(),
    miniMapNodeMouseMove: ne(),
    miniMapNodeMouseLeave: ne(),
    connect: ne(),
    connectStart: ne(),
    connectEnd: ne(),
    clickConnectStart: ne(),
    clickConnectEnd: ne(),
    paneReady: ne(),
    init: ne(),
    move: ne(),
    moveStart: ne(),
    moveEnd: ne(),
    selectionDragStart: ne(),
    selectionDrag: ne(),
    selectionDragStop: ne(),
    selectionContextMenu: ne(),
    selectionStart: ne(),
    selectionEnd: ne(),
    viewportChangeStart: ne(),
    viewportChange: ne(),
    viewportChangeEnd: ne(),
    paneScroll: ne(),
    paneClick: ne(),
    paneContextMenu: ne(),
    paneMouseEnter: ne(),
    paneMouseMove: ne(),
    paneMouseLeave: ne(),
    edgeContextMenu: ne(),
    edgeMouseEnter: ne(),
    edgeMouseMove: ne(),
    edgeMouseLeave: ne(),
    edgeDoubleClick: ne(),
    edgeClick: ne(),
    edgeUpdateStart: ne(),
    edgeUpdate: ne(),
    edgeUpdateEnd: ne(),
    updateNodeInternals: ne(),
    error: ne((e) => Dn(e.message))
  };
}
function np(e, t) {
  const n = on();
  Ml(() => {
    for (const [i, r] of Object.entries(t.value)) {
      const s = (a) => {
        e(i, a);
      };
      r.setEmitter(s), mn(r.removeEmitter), r.setHasEmitListeners(() => o(i)), mn(r.removeHasEmitListeners);
    }
  });
  function o(i) {
    var r;
    const s = op(i);
    return !!((r = n?.vnode.props) == null ? void 0 : r[s]);
  }
}
function op(e) {
  const [t, ...n] = e.split(":");
  return `on${t.replace(/(?:^|-)(\w)/g, (i, r) => r.toUpperCase())}${n.length ? `:${n.join(":")}` : ""}`;
}
function Na() {
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
    selectionMode: Ui.Full,
    paneDragging: !1,
    preventScrolling: !0,
    zoomOnScroll: !0,
    zoomOnPinch: !0,
    zoomOnDoubleClick: !0,
    panOnScroll: !1,
    panOnScrollSpeed: 0.5,
    panOnScrollMode: vn.Free,
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
      type: Mt.Bezier,
      style: {}
    },
    connectionMode: St.Loose,
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
    multiSelectionKeyCode: Sn() ? "Meta" : "Control",
    zoomActivationKeyCode: Sn() ? "Meta" : "Control",
    deleteKeyCode: "Backspace",
    panActivationKeyCode: "Space",
    hooks: tp(),
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
const ip = [
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
function rp(e, t, n) {
  const o = jh(e), i = (m) => {
    const g = m ?? [];
    e.hooks.updateNodeInternals.trigger(g);
  }, r = (m) => wh(m, e.nodes, e.edges), s = (m) => _h(m, e.nodes, e.edges), a = (m) => Tt(m, e.edges), l = ({ id: m, type: g, nodeId: w }) => {
    var D;
    const M = m ? `-${g}-${m}` : `-${g}`;
    return Array.from(((D = e.connectionLookup.get(`${w}${M}`)) == null ? void 0 : D.values()) ?? []);
  }, u = (m) => {
    if (m)
      return t.value.get(m);
  }, c = (m) => {
    if (m)
      return n.value.get(m);
  }, d = (m, g, w) => {
    var D, M;
    const J = [];
    for (const Q of m) {
      const le = {
        id: Q.id,
        type: "position",
        dragging: w,
        from: Q.from
      };
      if (g && (le.position = Q.position, Q.parentNode)) {
        const se = u(Q.parentNode);
        le.position = {
          x: le.position.x - (((D = se?.computedPosition) == null ? void 0 : D.x) ?? 0),
          y: le.position.y - (((M = se?.computedPosition) == null ? void 0 : M.y) ?? 0)
        };
      }
      J.push(le);
    }
    J?.length && e.hooks.nodesChange.trigger(J);
  }, h = (m) => {
    if (!e.vueFlowRef)
      return;
    const g = e.vueFlowRef.querySelector(".vue-flow__transformationpane");
    if (!g)
      return;
    const w = window.getComputedStyle(g), { m22: D } = new window.DOMMatrixReadOnly(w.transform), M = [];
    for (const J of m) {
      const Q = J, le = u(Q.id);
      if (le) {
        const se = Io(Q.nodeElement);
        if (!!(se.width && se.height && (le.dimensions.width !== se.width || le.dimensions.height !== se.height || Q.forceUpdate))) {
          const ye = Q.nodeElement.getBoundingClientRect();
          le.dimensions = se, le.handleBounds.source = Lr("source", Q.nodeElement, ye, D, le.id), le.handleBounds.target = Lr("target", Q.nodeElement, ye, D, le.id), M.push({
            id: le.id,
            type: "dimensions",
            dimensions: se
          });
        }
      }
    }
    !e.fitViewOnInitDone && e.fitViewOnInit && o.value.fitView().then(() => {
      e.fitViewOnInitDone = !0;
    }), M.length && e.hooks.nodesChange.trigger(M);
  }, p = (m, g) => {
    const w = /* @__PURE__ */ new Set(), D = /* @__PURE__ */ new Set();
    for (const Q of m)
      zt(Q) ? w.add(Q.id) : Nt(Q) && D.add(Q.id);
    const M = bt(t.value, w, !0), J = bt(n.value, D);
    if (e.multiSelectionActive) {
      for (const Q of w)
        M.push(_t(Q, g));
      for (const Q of D)
        J.push(_t(Q, g));
    }
    M.length && e.hooks.nodesChange.trigger(M), J.length && e.hooks.edgesChange.trigger(J);
  }, E = (m) => {
    if (e.multiSelectionActive) {
      const g = m.map((w) => _t(w.id, !0));
      e.hooks.nodesChange.trigger(g);
      return;
    }
    e.hooks.nodesChange.trigger(bt(t.value, new Set(m.map((g) => g.id)), !0)), e.hooks.edgesChange.trigger(bt(n.value));
  }, b = (m) => {
    if (e.multiSelectionActive) {
      const g = m.map((w) => _t(w.id, !0));
      e.hooks.edgesChange.trigger(g);
      return;
    }
    e.hooks.edgesChange.trigger(bt(n.value, new Set(m.map((g) => g.id)))), e.hooks.nodesChange.trigger(bt(t.value, /* @__PURE__ */ new Set(), !0));
  }, S = (m) => {
    p(m, !0);
  }, _ = (m) => {
    const w = (m || e.nodes).map((D) => (D.selected = !1, _t(D.id, !1)));
    e.hooks.nodesChange.trigger(w);
  }, P = (m) => {
    const w = (m || e.edges).map((D) => (D.selected = !1, _t(D.id, !1)));
    e.hooks.edgesChange.trigger(w);
  }, y = (m) => {
    if (!m || !m.length)
      return p([], !1);
    const g = m.reduce(
      (w, D) => {
        const M = _t(D.id, !1);
        return zt(D) ? w.nodes.push(M) : w.edges.push(M), w;
      },
      { nodes: [], edges: [] }
    );
    g.nodes.length && e.hooks.nodesChange.trigger(g.nodes), g.edges.length && e.hooks.edgesChange.trigger(g.edges);
  }, $ = (m) => {
    var g;
    (g = e.d3Zoom) == null || g.scaleExtent([m, e.maxZoom]), e.minZoom = m;
  }, R = (m) => {
    var g;
    (g = e.d3Zoom) == null || g.scaleExtent([e.minZoom, m]), e.maxZoom = m;
  }, U = (m) => {
    var g;
    (g = e.d3Zoom) == null || g.translateExtent(m), e.translateExtent = m;
  }, L = (m) => {
    e.nodeExtent = m, i();
  }, Y = (m) => {
    var g;
    (g = e.d3Zoom) == null || g.clickDistance(m);
  }, ie = (m) => {
    e.nodesDraggable = m, e.nodesConnectable = m, e.elementsSelectable = m;
  }, H = (m) => {
    const g = m instanceof Function ? m(e.nodes) : m;
    !e.initialized && !g.length || (e.nodes = Hr(g, u, e.hooks.error.trigger));
  }, X = (m) => {
    const g = m instanceof Function ? m(e.edges) : m;
    if (!e.initialized && !g.length)
      return;
    const w = ni(
      g,
      e.isValidConnection,
      u,
      c,
      e.hooks.error.trigger,
      e.defaultEdgeOptions,
      e.nodes,
      e.edges
    );
    ti(e.connectionLookup, n.value, w), e.edges = w;
  }, C = (m) => {
    const g = m instanceof Function ? m([...e.nodes, ...e.edges]) : m;
    !e.initialized && !g.length || (H(g.filter(zt)), X(g.filter(Nt)));
  }, oe = (m) => {
    let g = m instanceof Function ? m(e.nodes) : m;
    g = Array.isArray(g) ? g : [g];
    const w = Hr(g, u, e.hooks.error.trigger), D = [];
    for (const M of w)
      D.push(Dr(M));
    D.length && e.hooks.nodesChange.trigger(D);
  }, f = (m) => {
    let g = m instanceof Function ? m(e.edges) : m;
    g = Array.isArray(g) ? g : [g];
    const w = ni(
      g,
      e.isValidConnection,
      u,
      c,
      e.hooks.error.trigger,
      e.defaultEdgeOptions,
      e.nodes,
      e.edges
    ), D = [];
    for (const M of w)
      D.push(Dr(M));
    D.length && e.hooks.edgesChange.trigger(D);
  }, N = (m, g = !0, w = !1) => {
    const D = m instanceof Function ? m(e.nodes) : m, M = Array.isArray(D) ? D : [D], J = [], Q = [];
    function le(fe) {
      const ye = a(fe);
      for (const xe of ye)
        (!Ae(xe.deletable) || xe.deletable) && Q.push(Pr(xe.id, xe.source, xe.target, xe.sourceHandle, xe.targetHandle));
    }
    function se(fe) {
      const ye = [];
      for (const xe of e.nodes)
        xe.parentNode === fe && ye.push(xe);
      if (ye.length) {
        for (const xe of ye)
          J.push(Ar(xe.id));
        g && le(ye);
        for (const xe of ye)
          se(xe.id);
      }
    }
    for (const fe of M) {
      const ye = typeof fe == "string" ? u(fe) : fe;
      ye && (Ae(ye.deletable) && !ye.deletable || (J.push(Ar(ye.id)), g && le([ye]), w && se(ye.id)));
    }
    Q.length && e.hooks.edgesChange.trigger(Q), J.length && e.hooks.nodesChange.trigger(J);
  }, v = (m) => {
    const g = m instanceof Function ? m(e.edges) : m, w = Array.isArray(g) ? g : [g], D = [];
    for (const M of w) {
      const J = typeof M == "string" ? c(M) : M;
      J && (Ae(J.deletable) && !J.deletable || D.push(
        Pr(
          typeof M == "string" ? M : M.id,
          J.source,
          J.target,
          J.sourceHandle,
          J.targetHandle
        )
      ));
    }
    e.hooks.edgesChange.trigger(D);
  }, I = (m, g, w = !0) => {
    const D = c(m.id);
    if (!D)
      return !1;
    const M = e.edges.indexOf(D), J = Fh(m, g, D, w, e.hooks.error.trigger);
    if (J) {
      const [Q] = ni(
        [J],
        e.isValidConnection,
        u,
        c,
        e.hooks.error.trigger,
        e.defaultEdgeOptions,
        e.nodes,
        e.edges
      );
      return e.edges = e.edges.map((le, se) => se === M ? Q : le), ti(e.connectionLookup, n.value, [Q]), Q;
    }
    return !1;
  }, k = (m, g, w = { replace: !1 }) => {
    const D = c(m);
    if (!D)
      return;
    const M = typeof g == "function" ? g(D) : g;
    D.data = w.replace ? M : { ...D.data, ...M };
  }, z = (m) => Ir(m, e.nodes), T = (m) => {
    const g = Ir(m, e.edges);
    return ti(e.connectionLookup, n.value, g), g;
  }, B = (m, g, w = { replace: !1 }) => {
    const D = u(m);
    if (!D)
      return;
    const M = typeof g == "function" ? g(D) : g;
    w.replace ? e.nodes.splice(e.nodes.indexOf(D), 1, M) : Object.assign(D, M);
  }, q = (m, g, w = { replace: !1 }) => {
    const D = u(m);
    if (!D)
      return;
    const M = typeof g == "function" ? g(D) : g;
    D.data = w.replace ? M : { ...D.data, ...M };
  }, j = (m, g, w = !1) => {
    w ? e.connectionClickStartHandle = m : e.connectionStartHandle = m, e.connectionEndHandle = null, e.connectionStatus = null, g && (e.connectionPosition = g);
  }, re = (m, g = null, w = null) => {
    e.connectionStartHandle && (e.connectionPosition = m, e.connectionEndHandle = g, e.connectionStatus = w);
  }, G = (m, g) => {
    e.connectionPosition = { x: Number.NaN, y: Number.NaN }, e.connectionEndHandle = null, e.connectionStatus = null, g ? e.connectionClickStartHandle = null : e.connectionStartHandle = null;
  }, F = (m) => {
    const g = mh(m), w = g ? null : dn(m) ? m : u(m.id);
    return !g && !w ? [null, null, g] : [g ? m : mo(w), w, g];
  }, ee = (m, g = !0, w = e.nodes) => {
    const [D, M, J] = F(m);
    if (!D)
      return [];
    const Q = [];
    for (const le of w || e.nodes) {
      if (!J && (le.id === M.id || !le.computedPosition))
        continue;
      const se = mo(le), fe = yo(se, D);
      (g && fe > 0 || fe >= se.width * se.height || fe >= Number(D.width) * Number(D.height)) && Q.push(le);
    }
    return Q;
  }, he = (m, g, w = !0) => {
    const [D] = F(m);
    if (!D)
      return !1;
    const M = yo(D, g);
    return w && M > 0 || M >= Number(D.width) * Number(D.height);
  }, ve = (m) => {
    const { viewport: g, dimensions: w, d3Zoom: D, d3Selection: M, translateExtent: J } = e;
    if (!D || !M || !m.x && !m.y)
      return !1;
    const Q = Qt.translate(g.x + m.x, g.y + m.y).scale(g.zoom), le = [
      [0, 0],
      [w.width, w.height]
    ], se = D.constrain()(Q, le, J), fe = e.viewport.x !== se.x || e.viewport.y !== se.y || e.viewport.zoom !== se.k;
    return D.transform(M, se), fe;
  }, de = (m) => {
    const g = m instanceof Function ? m(e) : m, w = [
      "d3Zoom",
      "d3Selection",
      "d3ZoomHandler",
      "viewportRef",
      "vueFlowRef",
      "dimensions",
      "hooks"
    ];
    Ae(g.defaultEdgeOptions) && (e.defaultEdgeOptions = g.defaultEdgeOptions);
    const D = g.modelValue || g.nodes || g.edges ? [] : void 0;
    D && (g.modelValue && D.push(...g.modelValue), g.nodes && D.push(...g.nodes), g.edges && D.push(...g.edges), C(D));
    const M = () => {
      Ae(g.maxZoom) && R(g.maxZoom), Ae(g.minZoom) && $(g.minZoom), Ae(g.translateExtent) && U(g.translateExtent);
    };
    for (const J of Object.keys(g)) {
      const Q = J, le = g[Q];
      ![...ip, ...w].includes(Q) && Ae(le) && (e[Q] = le);
    }
    ci(() => e.d3Zoom).not.toBeNull().then(M), e.initialized || (e.initialized = !0);
  };
  return {
    updateNodePositions: d,
    updateNodeDimensions: h,
    setElements: C,
    setNodes: H,
    setEdges: X,
    addNodes: oe,
    addEdges: f,
    removeNodes: N,
    removeEdges: v,
    findNode: u,
    findEdge: c,
    updateEdge: I,
    updateEdgeData: k,
    updateNode: B,
    updateNodeData: q,
    applyEdgeChanges: T,
    applyNodeChanges: z,
    addSelectedElements: S,
    addSelectedNodes: E,
    addSelectedEdges: b,
    setMinZoom: $,
    setMaxZoom: R,
    setTranslateExtent: U,
    setNodeExtent: L,
    setPaneClickDistance: Y,
    removeSelectedElements: y,
    removeSelectedNodes: _,
    removeSelectedEdges: P,
    startConnection: j,
    updateConnection: re,
    endConnection: G,
    setInteractive: ie,
    setState: de,
    getIntersectingNodes: ee,
    getIncomers: r,
    getOutgoers: s,
    getConnectedEdges: a,
    getHandleConnections: l,
    isNodeIntersecting: he,
    panBy: ve,
    fitView: (m) => o.value.fitView(m),
    zoomIn: (m) => o.value.zoomIn(m),
    zoomOut: (m) => o.value.zoomOut(m),
    zoomTo: (m, g) => o.value.zoomTo(m, g),
    setViewport: (m, g) => o.value.setViewport(m, g),
    setTransform: (m, g) => o.value.setTransform(m, g),
    getViewport: () => o.value.getViewport(),
    getTransform: () => o.value.getTransform(),
    setCenter: (m, g, w) => o.value.setCenter(m, g, w),
    fitBounds: (m, g) => o.value.fitBounds(m, g),
    project: (m) => o.value.project(m),
    screenToFlowCoordinate: (m) => o.value.screenToFlowCoordinate(m),
    flowToScreenCoordinate: (m) => o.value.flowToScreenCoordinate(m),
    toObject: () => {
      const m = [], g = [];
      for (const w of e.nodes) {
        const {
          computedPosition: D,
          handleBounds: M,
          selected: J,
          dimensions: Q,
          isParent: le,
          resizing: se,
          dragging: fe,
          events: ye,
          ...xe
        } = w;
        m.push(xe);
      }
      for (const w of e.edges) {
        const { selected: D, sourceNode: M, targetNode: J, events: Q, ...le } = w;
        g.push(le);
      }
      return JSON.parse(
        JSON.stringify({
          nodes: m,
          edges: g,
          position: [e.viewport.x, e.viewport.y],
          zoom: e.viewport.zoom,
          viewport: e.viewport
        })
      );
    },
    fromObject: (m) => new Promise((g) => {
      const { nodes: w, edges: D, position: M, zoom: J, viewport: Q } = m;
      w && H(w), D && X(D);
      const [le, se] = Q?.x && Q?.y ? [Q.x, Q.y] : M ?? [null, null];
      if (le && se) {
        const fe = Q?.zoom || J || e.viewport.zoom;
        return ci(() => o.value.viewportInitialized).toBe(!0).then(() => {
          o.value.setViewport({
            x: le,
            y: se,
            zoom: fe
          }).then(() => {
            g(!0);
          });
        });
      } else
        g(!0);
    }),
    updateNodeInternals: i,
    viewportHelper: o,
    $reset: () => {
      const m = Na();
      if (e.edges = [], e.nodes = [], e.d3Zoom && e.d3Selection) {
        const g = Qt.translate(m.defaultViewport.x ?? 0, m.defaultViewport.y ?? 0).scale(Lt(m.defaultViewport.zoom ?? 1, m.minZoom, m.maxZoom)), w = e.viewportRef.getBoundingClientRect(), D = [
          [0, 0],
          [w.width, w.height]
        ], M = e.d3Zoom.constrain()(g, D, m.translateExtent);
        e.d3Zoom.transform(e.d3Selection, M);
      }
      de(m);
    },
    $destroy: () => {
    }
  };
}
const sp = ["data-id", "data-handleid", "data-nodeid", "data-handlepos"], ap = {
  name: "Handle",
  compatConfig: { MODE: 3 }
}, en = /* @__PURE__ */ Se({
  ...ap,
  props: {
    id: { default: null },
    type: {},
    position: { default: () => ae.Top },
    isValidConnection: { type: Function },
    connectable: { type: [Boolean, Number, String, Function], default: void 0 },
    connectableStart: { type: Boolean, default: !0 },
    connectableEnd: { type: Boolean, default: !0 }
  },
  setup(e, { expose: t }) {
    const n = Nl(e, ["position", "connectable", "connectableStart", "connectableEnd", "id"]), o = Ee(() => n.type ?? "source"), i = Ee(() => n.isValidConnection ?? null), {
      id: r,
      connectionStartHandle: s,
      connectionClickStartHandle: a,
      connectionEndHandle: l,
      vueFlowRef: u,
      nodesConnectable: c,
      noDragClassName: d,
      noPanClassName: h
    } = Me(), { id: p, node: E, nodeEl: b, connectedEdges: S } = $a(), _ = _e(), P = Ee(() => typeof e.connectableStart < "u" ? e.connectableStart : !0), y = Ee(() => typeof e.connectableEnd < "u" ? e.connectableEnd : !0), $ = Ee(
      () => {
        var X, C, oe, f, N, v;
        return ((X = s.value) == null ? void 0 : X.nodeId) === p && ((C = s.value) == null ? void 0 : C.id) === e.id && ((oe = s.value) == null ? void 0 : oe.type) === o.value || ((f = l.value) == null ? void 0 : f.nodeId) === p && ((N = l.value) == null ? void 0 : N.id) === e.id && ((v = l.value) == null ? void 0 : v.type) === o.value;
      }
    ), R = Ee(
      () => {
        var X, C, oe;
        return ((X = a.value) == null ? void 0 : X.nodeId) === p && ((C = a.value) == null ? void 0 : C.id) === e.id && ((oe = a.value) == null ? void 0 : oe.type) === o.value;
      }
    ), { handlePointerDown: U, handleClick: L } = Ea({
      nodeId: p,
      handleId: e.id,
      isValidConnection: i,
      type: o
    }), Y = ce(() => typeof e.connectable == "string" && e.connectable === "single" ? !S.value.some((X) => {
      const C = X[`${o.value}Handle`];
      return X[o.value] !== p ? !1 : C ? C === e.id : !0;
    }) : typeof e.connectable == "number" ? S.value.filter((X) => {
      const C = X[`${o.value}Handle`];
      return X[o.value] !== p ? !1 : C ? C === e.id : !0;
    }).length < e.connectable : typeof e.connectable == "function" ? e.connectable(E, S.value) : Ae(e.connectable) ? e.connectable : c.value);
    st(() => {
      var X;
      if (!E.dimensions.width || !E.dimensions.height)
        return;
      const C = (X = E.handleBounds[o.value]) == null ? void 0 : X.find((z) => z.id === e.id);
      if (!u.value || C)
        return;
      const oe = u.value.querySelector(".vue-flow__transformationpane");
      if (!b.value || !_.value || !oe || !e.id)
        return;
      const f = b.value.getBoundingClientRect(), N = _.value.getBoundingClientRect(), v = window.getComputedStyle(oe), { m22: I } = new window.DOMMatrixReadOnly(v.transform), k = {
        id: e.id,
        position: e.position,
        x: (N.left - f.left) / I,
        y: (N.top - f.top) / I,
        type: o.value,
        nodeId: p,
        ...Io(_.value)
      };
      E.handleBounds[o.value] = [...E.handleBounds[o.value] ?? [], k];
    });
    function ie(X) {
      const C = Gi(X);
      Y.value && P.value && (C && X.button === 0 || !C) && U(X);
    }
    function H(X) {
      !p || !a.value && !P.value || Y.value && L(X);
    }
    return t({
      handleClick: L,
      handlePointerDown: U,
      onClick: H,
      onPointerDown: ie
    }), (X, C) => (V(), te("div", {
      ref_key: "handle",
      ref: _,
      "data-id": `${K(r)}-${K(p)}-${e.id}-${o.value}`,
      "data-handleid": e.id,
      "data-nodeid": K(p),
      "data-handlepos": X.position,
      class: Ve(["vue-flow__handle", [
        `vue-flow__handle-${X.position}`,
        `vue-flow__handle-${e.id}`,
        K(d),
        K(h),
        o.value,
        {
          connectable: Y.value,
          connecting: R.value,
          connectablestart: P.value,
          connectableend: y.value,
          connectionindicator: Y.value && (P.value && !$.value || y.value && $.value)
        }
      ]]),
      onMousedown: ie,
      onTouchstartPassive: ie,
      onClick: H
    }, [
      Ie(X.$slots, "default", { id: X.id })
    ], 42, sp));
  }
}), Po = function({
  sourcePosition: e = ae.Bottom,
  targetPosition: t = ae.Top,
  label: n,
  connectable: o = !0,
  isValidTargetPos: i,
  isValidSourcePos: r,
  data: s
}) {
  const a = s.label ?? n;
  return [
    $e(en, { type: "target", position: t, connectable: o, isValidConnection: i }),
    typeof a != "string" && a ? $e(a) : $e(Pe, [a]),
    $e(en, { type: "source", position: e, connectable: o, isValidConnection: r })
  ];
};
Po.props = ["sourcePosition", "targetPosition", "label", "isValidTargetPos", "isValidSourcePos", "connectable", "data"];
Po.inheritAttrs = !1;
Po.compatConfig = { MODE: 3 };
const lp = Po, zo = function({
  targetPosition: e = ae.Top,
  label: t,
  connectable: n = !0,
  isValidTargetPos: o,
  data: i
}) {
  const r = i.label ?? t;
  return [
    $e(en, { type: "target", position: e, connectable: n, isValidConnection: o }),
    typeof r != "string" && r ? $e(r) : $e(Pe, [r])
  ];
};
zo.props = ["targetPosition", "label", "isValidTargetPos", "connectable", "data"];
zo.inheritAttrs = !1;
zo.compatConfig = { MODE: 3 };
const up = zo, Oo = function({
  sourcePosition: e = ae.Bottom,
  label: t,
  connectable: n = !0,
  isValidSourcePos: o,
  data: i
}) {
  const r = i.label ?? t;
  return [
    typeof r != "string" && r ? $e(r) : $e(Pe, [r]),
    $e(en, { type: "source", position: e, connectable: n, isValidConnection: o })
  ];
};
Oo.props = ["sourcePosition", "label", "isValidSourcePos", "connectable", "data"];
Oo.inheritAttrs = !1;
Oo.compatConfig = { MODE: 3 };
const cp = Oo, dp = ["transform"], fp = ["width", "height", "x", "y", "rx", "ry"], hp = ["y"], pp = {
  name: "EdgeText",
  compatConfig: { MODE: 3 }
}, vp = /* @__PURE__ */ Se({
  ...pp,
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
    const t = _e({ x: 0, y: 0, width: 0, height: 0 }), n = _e(null), o = ce(() => `translate(${e.x - t.value.width / 2} ${e.y - t.value.height / 2})`);
    st(i), Ne([() => e.x, () => e.y, n, () => e.label], i);
    function i() {
      if (!n.value)
        return;
      const r = n.value.getBBox();
      (r.width !== t.value.width || r.height !== t.value.height) && (t.value = r);
    }
    return (r, s) => (V(), te("g", {
      transform: o.value,
      class: "vue-flow__edge-textwrapper"
    }, [
      r.labelShowBg ? (V(), te("rect", {
        key: 0,
        class: "vue-flow__edge-textbg",
        width: `${t.value.width + 2 * r.labelBgPadding[0]}px`,
        height: `${t.value.height + 2 * r.labelBgPadding[1]}px`,
        x: -r.labelBgPadding[0],
        y: -r.labelBgPadding[1],
        style: Be(r.labelBgStyle),
        rx: r.labelBgBorderRadius,
        ry: r.labelBgBorderRadius
      }, null, 12, fp)) : me("", !0),
      Z("text", ao(r.$attrs, {
        ref_key: "el",
        ref: n,
        class: "vue-flow__edge-text",
        y: t.value.height / 2,
        dy: "0.3em",
        style: r.labelStyle
      }), [
        Ie(r.$slots, "default", {}, () => [
          typeof r.label != "string" ? (V(), De(Ct(r.label), { key: 0 })) : (V(), te(Pe, { key: 1 }, [
            Jn(Ce(r.label), 1)
          ], 64))
        ])
      ], 16, hp)
    ], 8, dp));
  }
}), gp = ["id", "d", "marker-end", "marker-start"], mp = ["d", "stroke-width"], yp = {
  name: "BaseEdge",
  inheritAttrs: !1,
  compatConfig: { MODE: 3 }
}, Ro = /* @__PURE__ */ Se({
  ...yp,
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
    const n = _e(null), o = _e(null), i = _e(null), r = zi();
    return t({
      pathEl: n,
      interactionEl: o,
      labelEl: i
    }), (s, a) => (V(), te(Pe, null, [
      Z("path", ao(K(r), {
        id: s.id,
        ref_key: "pathEl",
        ref: n,
        d: s.path,
        class: "vue-flow__edge-path",
        "marker-end": s.markerEnd,
        "marker-start": s.markerStart
      }), null, 16, gp),
      s.interactionWidth ? (V(), te("path", {
        key: 0,
        ref_key: "interactionEl",
        ref: o,
        fill: "none",
        d: s.path,
        "stroke-width": s.interactionWidth,
        "stroke-opacity": 0,
        class: "vue-flow__edge-interaction"
      }, null, 8, mp)) : me("", !0),
      s.label && s.labelX && s.labelY ? (V(), De(vp, {
        key: 1,
        ref_key: "labelEl",
        ref: i,
        x: s.labelX,
        y: s.labelY,
        label: s.label,
        "label-show-bg": s.labelShowBg,
        "label-bg-style": s.labelBgStyle,
        "label-bg-padding": s.labelBgPadding,
        "label-bg-border-radius": s.labelBgBorderRadius,
        "label-style": s.labelStyle
      }, null, 8, ["x", "y", "label", "label-show-bg", "label-bg-style", "label-bg-padding", "label-bg-border-radius", "label-style"])) : me("", !0)
    ], 64));
  }
});
function ka({
  sourceX: e,
  sourceY: t,
  targetX: n,
  targetY: o
}) {
  const i = Math.abs(n - e) / 2, r = n < e ? n + i : n - i, s = Math.abs(o - t) / 2, a = o < t ? o + s : o - s;
  return [r, a, i, s];
}
function Ca({
  sourceX: e,
  sourceY: t,
  targetX: n,
  targetY: o,
  sourceControlX: i,
  sourceControlY: r,
  targetControlX: s,
  targetControlY: a
}) {
  const l = e * 0.125 + i * 0.375 + s * 0.375 + n * 0.125, u = t * 0.125 + r * 0.375 + a * 0.375 + o * 0.125, c = Math.abs(l - e), d = Math.abs(u - t);
  return [l, u, c, d];
}
function Yn(e, t) {
  return e >= 0 ? 0.5 * e : t * 25 * Math.sqrt(-e);
}
function Xr({ pos: e, x1: t, y1: n, x2: o, y2: i, c: r }) {
  let s, a;
  switch (e) {
    case ae.Left:
      s = t - Yn(t - o, r), a = n;
      break;
    case ae.Right:
      s = t + Yn(o - t, r), a = n;
      break;
    case ae.Top:
      s = t, a = n - Yn(n - i, r);
      break;
    case ae.Bottom:
      s = t, a = n + Yn(i - n, r);
      break;
  }
  return [s, a];
}
function Ma(e) {
  const {
    sourceX: t,
    sourceY: n,
    sourcePosition: o = ae.Bottom,
    targetX: i,
    targetY: r,
    targetPosition: s = ae.Top,
    curvature: a = 0.25
  } = e, [l, u] = Xr({
    pos: o,
    x1: t,
    y1: n,
    x2: i,
    y2: r,
    c: a
  }), [c, d] = Xr({
    pos: s,
    x1: i,
    y1: r,
    x2: t,
    y2: n,
    c: a
  }), [h, p, E, b] = Ca({
    sourceX: t,
    sourceY: n,
    targetX: i,
    targetY: r,
    sourceControlX: l,
    sourceControlY: u,
    targetControlX: c,
    targetControlY: d
  });
  return [
    `M${t},${n} C${l},${u} ${c},${d} ${i},${r}`,
    h,
    p,
    E,
    b
  ];
}
function Gr({ pos: e, x1: t, y1: n, x2: o, y2: i }) {
  let r, s;
  switch (e) {
    case ae.Left:
    case ae.Right:
      r = 0.5 * (t + o), s = n;
      break;
    case ae.Top:
    case ae.Bottom:
      r = t, s = 0.5 * (n + i);
      break;
  }
  return [r, s];
}
function Ta(e) {
  const {
    sourceX: t,
    sourceY: n,
    sourcePosition: o = ae.Bottom,
    targetX: i,
    targetY: r,
    targetPosition: s = ae.Top
  } = e, [a, l] = Gr({
    pos: o,
    x1: t,
    y1: n,
    x2: i,
    y2: r
  }), [u, c] = Gr({
    pos: s,
    x1: i,
    y1: r,
    x2: t,
    y2: n
  }), [d, h, p, E] = Ca({
    sourceX: t,
    sourceY: n,
    targetX: i,
    targetY: r,
    sourceControlX: a,
    sourceControlY: l,
    targetControlX: u,
    targetControlY: c
  });
  return [
    `M${t},${n} C${a},${l} ${u},${c} ${i},${r}`,
    d,
    h,
    p,
    E
  ];
}
const qr = {
  [ae.Left]: { x: -1, y: 0 },
  [ae.Right]: { x: 1, y: 0 },
  [ae.Top]: { x: 0, y: -1 },
  [ae.Bottom]: { x: 0, y: 1 }
};
function _p({
  source: e,
  sourcePosition: t = ae.Bottom,
  target: n
}) {
  return t === ae.Left || t === ae.Right ? e.x < n.x ? { x: 1, y: 0 } : { x: -1, y: 0 } : e.y < n.y ? { x: 0, y: 1 } : { x: 0, y: -1 };
}
function Wr(e, t) {
  return Math.sqrt((t.x - e.x) ** 2 + (t.y - e.y) ** 2);
}
function wp({
  source: e,
  sourcePosition: t = ae.Bottom,
  target: n,
  targetPosition: o = ae.Top,
  center: i,
  offset: r
}) {
  const s = qr[t], a = qr[o], l = { x: e.x + s.x * r, y: e.y + s.y * r }, u = { x: n.x + a.x * r, y: n.y + a.y * r }, c = _p({
    source: l,
    sourcePosition: t,
    target: u
  }), d = c.x !== 0 ? "x" : "y", h = c[d];
  let p, E, b;
  const S = { x: 0, y: 0 }, _ = { x: 0, y: 0 }, [P, y, $, R] = ka({
    sourceX: e.x,
    sourceY: e.y,
    targetX: n.x,
    targetY: n.y
  });
  if (s[d] * a[d] === -1) {
    E = i.x ?? P, b = i.y ?? y;
    const L = [
      { x: E, y: l.y },
      { x: E, y: u.y }
    ], Y = [
      { x: l.x, y: b },
      { x: u.x, y: b }
    ];
    s[d] === h ? p = d === "x" ? L : Y : p = d === "x" ? Y : L;
  } else {
    const L = [{ x: l.x, y: u.y }], Y = [{ x: u.x, y: l.y }];
    if (d === "x" ? p = s.x === h ? Y : L : p = s.y === h ? L : Y, t === o) {
      const oe = Math.abs(e[d] - n[d]);
      if (oe <= r) {
        const f = Math.min(r - 1, r - oe);
        s[d] === h ? S[d] = (l[d] > e[d] ? -1 : 1) * f : _[d] = (u[d] > n[d] ? -1 : 1) * f;
      }
    }
    if (t !== o) {
      const oe = d === "x" ? "y" : "x", f = s[d] === a[oe], N = l[oe] > u[oe], v = l[oe] < u[oe];
      (s[d] === 1 && (!f && N || f && v) || s[d] !== 1 && (!f && v || f && N)) && (p = d === "x" ? L : Y);
    }
    const ie = { x: l.x + S.x, y: l.y + S.y }, H = { x: u.x + _.x, y: u.y + _.y }, X = Math.max(Math.abs(ie.x - p[0].x), Math.abs(H.x - p[0].x)), C = Math.max(Math.abs(ie.y - p[0].y), Math.abs(H.y - p[0].y));
    X >= C ? (E = (ie.x + H.x) / 2, b = p[0].y) : (E = p[0].x, b = (ie.y + H.y) / 2);
  }
  return [[
    e,
    { x: l.x + S.x, y: l.y + S.y },
    ...p,
    { x: u.x + _.x, y: u.y + _.y },
    n
  ], E, b, $, R];
}
function bp(e, t, n, o) {
  const i = Math.min(Wr(e, t) / 2, Wr(t, n) / 2, o), { x: r, y: s } = t;
  if (e.x === r && r === n.x || e.y === s && s === n.y)
    return `L${r} ${s}`;
  if (e.y === s) {
    const u = e.x < n.x ? -1 : 1, c = e.y < n.y ? 1 : -1;
    return `L ${r + i * u},${s}Q ${r},${s} ${r},${s + i * c}`;
  }
  const a = e.x < n.x ? 1 : -1, l = e.y < n.y ? -1 : 1;
  return `L ${r},${s + i * l}Q ${r},${s} ${r + i * a},${s}`;
}
function Ei(e) {
  const {
    sourceX: t,
    sourceY: n,
    sourcePosition: o = ae.Bottom,
    targetX: i,
    targetY: r,
    targetPosition: s = ae.Top,
    borderRadius: a = 5,
    centerX: l,
    centerY: u,
    offset: c = 20
  } = e, [d, h, p, E, b] = wp({
    source: { x: t, y: n },
    sourcePosition: o,
    target: { x: i, y: r },
    targetPosition: s,
    center: { x: l, y: u },
    offset: c
  });
  return [d.reduce((_, P, y) => {
    let $;
    return y > 0 && y < d.length - 1 ? $ = bp(d[y - 1], P, d[y + 1], a) : $ = `${y === 0 ? "M" : "L"}${P.x} ${P.y}`, _ += $, _;
  }, ""), h, p, E, b];
}
function xp(e) {
  const { sourceX: t, sourceY: n, targetX: o, targetY: i } = e, [r, s, a, l] = ka({
    sourceX: t,
    sourceY: n,
    targetX: o,
    targetY: i
  });
  return [`M ${t},${n}L ${o},${i}`, r, s, a, l];
}
const Ep = Se({
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
      const [n, o, i] = xp(e);
      return $e(Ro, {
        path: n,
        labelX: o,
        labelY: i,
        ...t,
        ...e
      });
    };
  }
}), $p = Ep, Sp = Se({
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
      const [n, o, i] = Ei({
        ...e,
        sourcePosition: e.sourcePosition ?? ae.Bottom,
        targetPosition: e.targetPosition ?? ae.Top
      });
      return $e(Ro, {
        path: n,
        labelX: o,
        labelY: i,
        ...t,
        ...e
      });
    };
  }
}), Ia = Sp, Np = Se({
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
    return () => $e(Ia, { ...e, ...t, borderRadius: 0 });
  }
}), kp = Np, Cp = Se({
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
      const [n, o, i] = Ma({
        ...e,
        sourcePosition: e.sourcePosition ?? ae.Bottom,
        targetPosition: e.targetPosition ?? ae.Top
      });
      return $e(Ro, {
        path: n,
        labelX: o,
        labelY: i,
        ...t,
        ...e
      });
    };
  }
}), Mp = Cp, Tp = Se({
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
      const [n, o, i] = Ta({
        ...e,
        sourcePosition: e.sourcePosition ?? ae.Bottom,
        targetPosition: e.targetPosition ?? ae.Top
      });
      return $e(Ro, {
        path: n,
        labelX: o,
        labelY: i,
        ...t,
        ...e
      });
    };
  }
}), Ip = Tp, Dp = {
  input: cp,
  default: lp,
  output: up
}, Ap = {
  default: Mp,
  straight: $p,
  step: kp,
  smoothstep: Ia,
  simplebezier: Ip
};
function Pp(e, t, n) {
  const o = ce(() => (b) => t.value.get(b)), i = ce(() => (b) => n.value.get(b)), r = ce(() => {
    const b = {
      ...Ap,
      ...e.edgeTypes
    }, S = Object.keys(b);
    for (const _ of e.edges)
      _.type && !S.includes(_.type) && (b[_.type] = _.type);
    return b;
  }), s = ce(() => {
    const b = {
      ...Dp,
      ...e.nodeTypes
    }, S = Object.keys(b);
    for (const _ of e.nodes)
      _.type && !S.includes(_.type) && (b[_.type] = _.type);
    return b;
  }), a = ce(() => e.onlyRenderVisibleElements ? ha(
    e.nodes,
    {
      x: 0,
      y: 0,
      width: e.dimensions.width,
      height: e.dimensions.height
    },
    e.viewport,
    !0
  ) : e.nodes), l = ce(() => {
    if (e.onlyRenderVisibleElements) {
      const b = [];
      for (const S of e.edges) {
        const _ = t.value.get(S.source), P = t.value.get(S.target);
        Th({
          sourcePos: _.computedPosition || { x: 0, y: 0 },
          targetPos: P.computedPosition || { x: 0, y: 0 },
          sourceWidth: _.dimensions.width,
          sourceHeight: _.dimensions.height,
          targetWidth: P.dimensions.width,
          targetHeight: P.dimensions.height,
          width: e.dimensions.width,
          height: e.dimensions.height,
          viewport: e.viewport
        }) && b.push(S);
      }
      return b;
    }
    return e.edges;
  }), u = ce(() => [...a.value, ...l.value]), c = ce(() => {
    const b = [];
    for (const S of e.nodes)
      S.selected && b.push(S);
    return b;
  }), d = ce(() => {
    const b = [];
    for (const S of e.edges)
      S.selected && b.push(S);
    return b;
  }), h = ce(() => [
    ...c.value,
    ...d.value
  ]), p = ce(() => {
    const b = [];
    for (const S of e.nodes)
      S.dimensions.width && S.dimensions.height && S.handleBounds !== void 0 && b.push(S);
    return b;
  }), E = ce(
    () => a.value.length > 0 && p.value.length === a.value.length
  );
  return {
    getNode: o,
    getEdge: i,
    getElements: u,
    getEdgeTypes: r,
    getNodeTypes: s,
    getEdges: l,
    getNodes: a,
    getSelectedElements: h,
    getSelectedNodes: c,
    getSelectedEdges: d,
    getNodesInitialized: p,
    areNodesInitialized: E
  };
}
class It {
  constructor() {
    this.currentId = 0, this.flows = /* @__PURE__ */ new Map();
  }
  static getInstance() {
    var t;
    const n = (t = on()) == null ? void 0 : t.appContext.app, o = n?.config.globalProperties.$vueFlowStorage ?? It.instance;
    return It.instance = o ?? new It(), n && (n.config.globalProperties.$vueFlowStorage = It.instance), It.instance;
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
    const o = Na(), i = Cl(o), r = {};
    for (const [h, p] of Object.entries(i.hooks)) {
      const E = `on${h.charAt(0).toUpperCase() + h.slice(1)}`;
      r[E] = p.on;
    }
    const s = {};
    for (const [h, p] of Object.entries(i.hooks))
      s[h] = p.trigger;
    const a = ce(() => {
      const h = /* @__PURE__ */ new Map();
      for (const p of i.nodes)
        h.set(p.id, p);
      return h;
    }), l = ce(() => {
      const h = /* @__PURE__ */ new Map();
      for (const p of i.edges)
        h.set(p.id, p);
      return h;
    }), u = Pp(i, a, l), c = rp(i, a, l);
    c.setState({ ...i, ...n });
    const d = {
      ...r,
      ...u,
      ...c,
      ...Su(i),
      nodeLookup: a,
      edgeLookup: l,
      emits: s,
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
function Me(e) {
  const t = It.getInstance(), n = ms(), o = typeof e == "object", i = o ? e : { id: e }, r = i.id, s = r ?? n?.vueFlowId;
  let a;
  if (n) {
    const l = mt(Yr, null);
    typeof l < "u" && l !== null && (!s || l.id === s) && (a = l);
  }
  if (a || s && (a = t.get(s)), !a || s && a.id !== s) {
    const l = r ?? t.getId(), u = t.create(l, i);
    a = u, (n ?? Ai(!0)).run(() => {
      Ne(
        u.applyDefault,
        (d, h, p) => {
          const E = (S) => {
            u.applyNodeChanges(S);
          }, b = (S) => {
            u.applyEdgeChanges(S);
          };
          d ? (u.onNodesChange(E), u.onEdgesChange(b)) : (u.hooks.value.nodesChange.off(E), u.hooks.value.edgesChange.off(b)), p(() => {
            u.hooks.value.nodesChange.off(E), u.hooks.value.edgesChange.off(b);
          });
        },
        { immediate: !0 }
      ), mn(() => {
        if (a) {
          const d = t.get(a.id);
          d ? d.$destroy() : Dn(`No store instance found for id ${a.id} in storage.`);
        }
      });
    });
  } else
    o && a.setState(i);
  if (n && (Rt(Yr, a), n.vueFlowId = a.id), o) {
    const l = on();
    l?.type.name !== "VueFlow" && a.emits.error(new Oe(ze.USEVUEFLOW_OPTIONS));
  }
  return a;
}
function zp(e) {
  const { emits: t, dimensions: n } = Me();
  let o;
  st(() => {
    const i = () => {
      var r, s;
      if (!e.value || !(((s = (r = e.value).checkVisibility) == null ? void 0 : s.call(r)) ?? !0))
        return;
      const a = Io(e.value);
      (a.width === 0 || a.height === 0) && t.error(new Oe(ze.MISSING_VIEWPORT_DIMENSIONS)), n.value = { width: a.width || 500, height: a.height || 500 };
    };
    i(), window.addEventListener("resize", i), e.value && (o = new ResizeObserver(() => i()), o.observe(e.value)), No(() => {
      window.removeEventListener("resize", i), o && e.value && o.unobserve(e.value);
    });
  });
}
const Op = {
  name: "UserSelection",
  compatConfig: { MODE: 3 }
}, Rp = /* @__PURE__ */ Se({
  ...Op,
  props: {
    userSelectionRect: {}
  },
  setup(e) {
    return (t, n) => (V(), te("div", {
      class: "vue-flow__selection vue-flow__container",
      style: Be({
        width: `${t.userSelectionRect.width}px`,
        height: `${t.userSelectionRect.height}px`,
        transform: `translate(${t.userSelectionRect.x}px, ${t.userSelectionRect.y}px)`
      })
    }, null, 4));
  }
}), Bp = ["tabIndex"], Vp = {
  name: "NodesSelection",
  compatConfig: { MODE: 3 }
}, Lp = /* @__PURE__ */ Se({
  ...Vp,
  setup(e) {
    const { emits: t, viewport: n, getSelectedNodes: o, noPanClassName: i, disableKeyboardA11y: r, userSelectionActive: s } = Me(), a = Sa(), l = _e(null), u = xa({
      el: l,
      onStart(E) {
        t.selectionDragStart(E), t.nodeDragStart(E);
      },
      onDrag(E) {
        t.selectionDrag(E), t.nodeDrag(E);
      },
      onStop(E) {
        t.selectionDragStop(E), t.nodeDragStop(E);
      }
    });
    st(() => {
      var E;
      r.value || (E = l.value) == null || E.focus({ preventScroll: !0 });
    });
    const c = ce(() => Yi(o.value)), d = ce(() => ({
      width: `${c.value.width}px`,
      height: `${c.value.height}px`,
      top: `${c.value.y}px`,
      left: `${c.value.x}px`
    }));
    function h(E) {
      t.selectionContextMenu({ event: E, nodes: o.value });
    }
    function p(E) {
      r.value || Wt[E.key] && (E.preventDefault(), a(
        {
          x: Wt[E.key].x,
          y: Wt[E.key].y
        },
        E.shiftKey
      ));
    }
    return (E, b) => !K(s) && c.value.width && c.value.height ? (V(), te("div", {
      key: 0,
      class: Ve(["vue-flow__nodesselection vue-flow__container", K(i)]),
      style: Be({ transform: `translate(${K(n).x}px,${K(n).y}px) scale(${K(n).zoom})` })
    }, [
      Z("div", {
        ref_key: "el",
        ref: l,
        class: Ve([{ dragging: K(u) }, "vue-flow__nodesselection-rect"]),
        style: Be(d.value),
        tabIndex: K(r) ? void 0 : -1,
        onContextmenu: h,
        onKeydown: p
      }, null, 46, Bp)
    ], 6)) : me("", !0);
  }
});
function Hp(e, t) {
  return {
    x: e.clientX - t.left,
    y: e.clientY - t.top
  };
}
const Fp = {
  name: "Pane",
  compatConfig: { MODE: 3 }
}, Up = /* @__PURE__ */ Se({
  ...Fp,
  props: {
    isSelecting: { type: Boolean },
    selectionKeyPressed: { type: Boolean }
  },
  setup(e) {
    const {
      vueFlowRef: t,
      nodes: n,
      viewport: o,
      emits: i,
      userSelectionActive: r,
      removeSelectedElements: s,
      userSelectionRect: a,
      elementsSelectable: l,
      nodesSelectionActive: u,
      getSelectedEdges: c,
      getSelectedNodes: d,
      removeNodes: h,
      removeEdges: p,
      selectionMode: E,
      deleteKeyCode: b,
      multiSelectionKeyCode: S,
      multiSelectionActive: _,
      edgeLookup: P,
      nodeLookup: y,
      connectionLookup: $,
      defaultEdgeOptions: R,
      connectionStartHandle: U,
      panOnDrag: L
    } = Me(), Y = $t(null), ie = $t(/* @__PURE__ */ new Set()), H = $t(/* @__PURE__ */ new Set()), X = $t(null), C = Ee(() => l.value && (e.isSelecting || r.value)), oe = Ee(() => U.value !== null);
    let f = !1, N = !1;
    const v = gn(b, { actInsideInputWithModifier: !1 }), I = gn(S);
    Ne(v, (G) => {
      G && (h(d.value), p(c.value), u.value = !1);
    }), Ne(I, (G) => {
      _.value = G;
    });
    function k(G, F) {
      return (ee) => {
        ee.target === F && G?.(ee);
      };
    }
    function z(G) {
      if (f || oe.value) {
        f = !1;
        return;
      }
      i.paneClick(G), s(), u.value = !1;
    }
    function T(G) {
      var F;
      if (Array.isArray(L.value) && ((F = L.value) != null && F.includes(2))) {
        G.preventDefault();
        return;
      }
      i.paneContextMenu(G);
    }
    function B(G) {
      i.paneScroll(G);
    }
    function q(G) {
      var F, ee, he;
      if (X.value = ((F = t.value) == null ? void 0 : F.getBoundingClientRect()) ?? null, !l.value || !e.isSelecting || G.button !== 0 || G.target !== Y.value || !X.value)
        return;
      (he = (ee = G.target) == null ? void 0 : ee.setPointerCapture) == null || he.call(ee, G.pointerId);
      const { x: ve, y: de } = Hp(G, X.value);
      N = !0, f = !1, s(), a.value = {
        width: 0,
        height: 0,
        startX: ve,
        startY: de,
        x: ve,
        y: de
      }, i.selectionStart(G);
    }
    function j(G) {
      var F;
      if (!X.value || !a.value)
        return;
      f = !0;
      const { x: ee, y: he } = nt(G, X.value), { startX: ve = 0, startY: de = 0 } = a.value, we = {
        startX: ve,
        startY: de,
        x: ee < ve ? ee : ve,
        y: he < de ? he : de,
        width: Math.abs(ee - ve),
        height: Math.abs(he - de)
      }, ue = ie.value, pe = H.value;
      ie.value = new Set(
        ha(n.value, we, o.value, E.value === Ui.Partial, !0).map(
          (g) => g.id
        )
      ), H.value = /* @__PURE__ */ new Set();
      const m = ((F = R.value) == null ? void 0 : F.selectable) ?? !0;
      for (const g of ie.value) {
        const w = $.value.get(g);
        if (w)
          for (const { edgeId: D } of w.values()) {
            const M = P.value.get(D);
            M && (M.selectable ?? m) && H.value.add(D);
          }
      }
      if (!Ur(ue, ie.value)) {
        const g = bt(y.value, ie.value, !0);
        i.nodesChange(g);
      }
      if (!Ur(pe, H.value)) {
        const g = bt(P.value, H.value);
        i.edgesChange(g);
      }
      a.value = we, r.value = !0, u.value = !1;
    }
    function re(G) {
      var F;
      G.button !== 0 || !N || ((F = G.target) == null || F.releasePointerCapture(G.pointerId), !r.value && a.value && G.target === Y.value && z(G), r.value = !1, a.value = null, u.value = ie.value.size > 0, i.selectionEnd(G), e.selectionKeyPressed && (f = !1), N = !1);
    }
    return (G, F) => (V(), te("div", {
      ref_key: "container",
      ref: Y,
      class: Ve(["vue-flow__pane vue-flow__container", { selection: G.isSelecting }]),
      onClick: F[0] || (F[0] = (ee) => C.value ? void 0 : k(z, Y.value)(ee)),
      onContextmenu: F[1] || (F[1] = (ee) => k(T, Y.value)(ee)),
      onWheelPassive: F[2] || (F[2] = (ee) => k(B, Y.value)(ee)),
      onPointerenter: F[3] || (F[3] = (ee) => C.value ? void 0 : K(i).paneMouseEnter(ee)),
      onPointerdown: F[4] || (F[4] = (ee) => C.value ? q(ee) : K(i).paneMouseMove(ee)),
      onPointermove: F[5] || (F[5] = (ee) => C.value ? j(ee) : K(i).paneMouseMove(ee)),
      onPointerup: F[6] || (F[6] = (ee) => C.value ? re(ee) : void 0),
      onPointerleave: F[7] || (F[7] = (ee) => K(i).paneMouseLeave(ee))
    }, [
      Ie(G.$slots, "default"),
      K(r) && K(a) ? (V(), De(Rp, {
        key: 0,
        "user-selection-rect": K(a)
      }, null, 8, ["user-selection-rect"])) : me("", !0),
      K(u) && K(d).length ? (V(), De(Lp, { key: 1 })) : me("", !0)
    ], 34));
  }
}), Yp = {
  name: "Transform",
  compatConfig: { MODE: 3 }
}, Xp = /* @__PURE__ */ Se({
  ...Yp,
  setup(e) {
    const { viewport: t, fitViewOnInit: n, fitViewOnInitDone: o } = Me(), i = ce(() => n.value ? !o.value : !1), r = ce(() => `translate(${t.value.x}px,${t.value.y}px) scale(${t.value.zoom})`);
    return (s, a) => (V(), te("div", {
      class: "vue-flow__transformationpane vue-flow__container",
      style: Be({ transform: r.value, opacity: i.value ? 0 : void 0 })
    }, [
      Ie(s.$slots, "default")
    ], 4));
  }
}), Gp = {
  name: "Viewport",
  compatConfig: { MODE: 3 }
}, qp = /* @__PURE__ */ Se({
  ...Gp,
  setup(e) {
    const {
      minZoom: t,
      maxZoom: n,
      defaultViewport: o,
      translateExtent: i,
      zoomActivationKeyCode: r,
      selectionKeyCode: s,
      panActivationKeyCode: a,
      panOnScroll: l,
      panOnScrollMode: u,
      panOnScrollSpeed: c,
      panOnDrag: d,
      zoomOnDoubleClick: h,
      zoomOnPinch: p,
      zoomOnScroll: E,
      preventScrolling: b,
      noWheelClassName: S,
      noPanClassName: _,
      emits: P,
      connectionStartHandle: y,
      userSelectionActive: $,
      paneDragging: R,
      d3Zoom: U,
      d3Selection: L,
      d3ZoomHandler: Y,
      viewport: ie,
      viewportRef: H,
      paneClickDistance: X
    } = Me();
    zp(H);
    const C = $t(!1), oe = $t(!1);
    let f = null, N = !1, v = 0, I = {
      x: 0,
      y: 0,
      zoom: 0
    };
    const k = gn(a), z = gn(s), T = gn(r), B = Ee(
      () => (!z.value || z.value && s.value === !0) && (k.value || d.value)
    ), q = Ee(() => k.value || l.value), j = Ee(() => s.value === !0 && B.value !== !0), re = Ee(
      () => z.value && s.value !== !0 || $.value || j.value
    ), G = Ee(() => y.value !== null);
    st(() => {
      if (!H.value) {
        Dn("Viewport element is missing");
        return;
      }
      const de = H.value, we = de.getBoundingClientRect(), ue = ch().clickDistance(X.value).scaleExtent([t.value, n.value]).translateExtent(i.value), pe = We(de).call(ue), m = pe.on("wheel.zoom"), g = Qt.translate(o.value.x ?? 0, o.value.y ?? 0).scale(Lt(o.value.zoom ?? 1, t.value, n.value)), w = [
        [0, 0],
        [we.width, we.height]
      ], D = ue.constrain()(g, w, i.value);
      ue.transform(pe, D), ue.wheelDelta(wi), U.value = ue, L.value = pe, Y.value = m, ie.value = { x: D.x, y: D.y, zoom: D.k }, ue.on("start", (M) => {
        var J;
        if (!M.sourceEvent)
          return null;
        v = M.sourceEvent.button, C.value = !0;
        const Q = he(M.transform);
        ((J = M.sourceEvent) == null ? void 0 : J.type) === "mousedown" && (R.value = !0), I = Q, P.viewportChangeStart(Q), P.moveStart({ event: M, flowTransform: Q });
      }), ue.on("end", (M) => {
        if (!M.sourceEvent)
          return null;
        if (C.value = !1, R.value = !1, F(B.value, v ?? 0) && !N && P.paneContextMenu(M.sourceEvent), N = !1, ee(I, M.transform)) {
          const J = he(M.transform);
          I = J, P.viewportChangeEnd(J), P.moveEnd({ event: M, flowTransform: J });
        }
      }), ue.filter((M) => {
        var J;
        const Q = T.value || E.value, le = p.value && M.ctrlKey, se = M.button, fe = M.type === "wheel";
        if (se === 1 && M.type === "mousedown" && (ve(M, "vue-flow__node") || ve(M, "vue-flow__edge")))
          return !0;
        if (!B.value && !Q && !q.value && !h.value && !p.value || $.value || G.value && !fe || !h.value && M.type === "dblclick" || ve(M, S.value) && fe || ve(M, _.value) && (!fe || q.value && fe && !T.value) || !p.value && M.ctrlKey && fe || !Q && !q.value && !le && fe)
          return !1;
        if (!p && M.type === "touchstart" && ((J = M.touches) == null ? void 0 : J.length) > 1)
          return M.preventDefault(), !1;
        if (!B.value && (M.type === "mousedown" || M.type === "touchstart") || j.value && Array.isArray(d.value) && d.value.includes(0) && se === 0 || Array.isArray(d.value) && !d.value.includes(se) && (M.type === "mousedown" || M.type === "touchstart"))
          return !1;
        const ye = Array.isArray(d.value) && d.value.includes(se) || s.value === !0 && Array.isArray(d.value) && !d.value.includes(0) || !se || se <= 1;
        return (!M.ctrlKey || k.value || fe) && ye;
      }), Ne(
        [$, B],
        () => {
          $.value && !C.value ? ue.on("zoom", null) : $.value || ue.on("zoom", (M) => {
            ie.value = { x: M.transform.x, y: M.transform.y, zoom: M.transform.k };
            const J = he(M.transform);
            N = F(B.value, v ?? 0), P.viewportChange(J), P.move({ event: M, flowTransform: J });
          });
        },
        { immediate: !0 }
      ), Ne(
        [$, q, u, T, p, b, S],
        () => {
          q.value && !T.value && !$.value ? pe.on(
            "wheel.zoom",
            (M) => {
              if (ve(M, S.value))
                return !1;
              const J = T.value || E.value, Q = p.value && M.ctrlKey;
              if (!(!b.value || q.value || J || Q))
                return !1;
              M.preventDefault(), M.stopImmediatePropagation();
              const se = pe.property("__zoom").k || 1, fe = Sn();
              if (!k.value && M.ctrlKey && p.value && fe) {
                const Ho = je(M), Fo = wi(M), Uo = se * 2 ** Fo;
                ue.scaleTo(pe, Uo, Ho, M);
                return;
              }
              const ye = M.deltaMode === 1 ? 20 : 1;
              let xe = u.value === vn.Vertical ? 0 : M.deltaX * ye, qe = u.value === vn.Horizontal ? 0 : M.deltaY * ye;
              !fe && M.shiftKey && u.value !== vn.Vertical && !xe && qe && (xe = qe, qe = 0), ue.translateBy(
                pe,
                -(xe / se) * c.value,
                -(qe / se) * c.value
              );
              const Le = he(pe.property("__zoom"));
              f && clearTimeout(f), oe.value ? (P.move({ event: M, flowTransform: Le }), P.viewportChange(Le), f = setTimeout(() => {
                P.moveEnd({ event: M, flowTransform: Le }), P.viewportChangeEnd(Le), oe.value = !1;
              }, 150)) : (oe.value = !0, P.moveStart({ event: M, flowTransform: Le }), P.viewportChangeStart(Le));
            },
            { passive: !1 }
          ) : typeof m < "u" && pe.on(
            "wheel.zoom",
            function(M, J) {
              const Q = !b.value && M.type === "wheel" && !M.ctrlKey, le = T.value || E.value, se = p.value && M.ctrlKey;
              if (!le && !l.value && !se && M.type === "wheel" || Q || ve(M, S.value))
                return null;
              M.preventDefault(), m.call(this, M, J);
            },
            { passive: !1 }
          );
        },
        { immediate: !0 }
      );
    });
    function F(de, we) {
      return we === 2 && Array.isArray(de) && de.includes(2);
    }
    function ee(de, we) {
      return de.x !== we.x && !Number.isNaN(we.x) || de.y !== we.y && !Number.isNaN(we.y) || de.zoom !== we.k && !Number.isNaN(we.k);
    }
    function he(de) {
      return {
        x: de.x,
        y: de.y,
        zoom: de.k
      };
    }
    function ve(de, we) {
      return de.target.closest(`.${we}`);
    }
    return (de, we) => (V(), te("div", {
      ref_key: "viewportRef",
      ref: H,
      class: "vue-flow__viewport vue-flow__container"
    }, [
      Re(Up, {
        "is-selecting": re.value,
        "selection-key-pressed": K(z),
        class: Ve({
          connecting: G.value,
          dragging: K(R),
          draggable: K(d) === !0 || Array.isArray(K(d)) && K(d).includes(0)
        })
      }, {
        default: tt(() => [
          Re(Xp, null, {
            default: tt(() => [
              Ie(de.$slots, "default")
            ]),
            _: 3
          })
        ]),
        _: 3
      }, 8, ["is-selecting", "selection-key-pressed", "class"])
    ], 512));
  }
}), Wp = ["id"], Zp = ["id"], Kp = ["id"], Jp = {
  name: "A11yDescriptions",
  compatConfig: { MODE: 3 }
}, Qp = /* @__PURE__ */ Se({
  ...Jp,
  setup(e) {
    const { id: t, disableKeyboardA11y: n, ariaLiveMessage: o } = Me();
    return (i, r) => (V(), te(Pe, null, [
      Z("div", {
        id: `${K(ia)}-${K(t)}`,
        style: { display: "none" }
      }, " Press enter or space to select a node. " + Ce(K(n) ? "" : "You can then use the arrow keys to move the node around.") + " You can then use the arrow keys to move the node around, press delete to remove it and press escape to cancel. ", 9, Wp),
      Z("div", {
        id: `${K(ra)}-${K(t)}`,
        style: { display: "none" }
      }, " Press enter or space to select an edge. You can then press delete to remove it or press escape to cancel. ", 8, Zp),
      K(n) ? me("", !0) : (V(), te("div", {
        key: 0,
        id: `${K(gh)}-${K(t)}`,
        "aria-live": "assertive",
        "aria-atomic": "true",
        style: { position: "absolute", width: "1px", height: "1px", margin: "-1px", border: "0", padding: "0", overflow: "hidden", clip: "rect(0px, 0px, 0px, 0px)", "clip-path": "inset(100%)" }
      }, Ce(K(o)), 9, Kp))
    ], 64));
  }
});
function jp() {
  const e = Me();
  Ne(
    () => e.viewportHelper.value.viewportInitialized,
    (t) => {
      t && setTimeout(() => {
        e.emits.init(e), e.emits.paneReady(e);
      }, 1);
    }
  );
}
function ev(e, t, n) {
  return n === ae.Left ? e - t : n === ae.Right ? e + t : e;
}
function tv(e, t, n) {
  return n === ae.Top ? e - t : n === ae.Bottom ? e + t : e;
}
const qi = function({
  radius: e = 10,
  centerX: t = 0,
  centerY: n = 0,
  position: o = ae.Top,
  type: i
}) {
  return $e("circle", {
    class: `vue-flow__edgeupdater vue-flow__edgeupdater-${i}`,
    cx: ev(t, e, o),
    cy: tv(n, e, o),
    r: e,
    stroke: "transparent",
    fill: "transparent"
  });
};
qi.props = ["radius", "centerX", "centerY", "position", "type"];
qi.compatConfig = { MODE: 3 };
const Zr = qi, nv = Se({
  name: "Edge",
  compatConfig: { MODE: 3 },
  props: ["id"],
  setup(e) {
    const {
      id: t,
      addSelectedEdges: n,
      connectionMode: o,
      edgeUpdaterRadius: i,
      emits: r,
      nodesSelectionActive: s,
      noPanClassName: a,
      getEdgeTypes: l,
      removeSelectedEdges: u,
      findEdge: c,
      findNode: d,
      isValidConnection: h,
      multiSelectionActive: p,
      disableKeyboardA11y: E,
      elementsSelectable: b,
      edgesUpdatable: S,
      edgesFocusable: _,
      hooks: P
    } = Me(), y = ce(() => c(e.id)), { emit: $, on: R } = Gh(y.value, r), U = mt(Ao), L = on(), Y = _e(!1), ie = _e(!1), H = _e(""), X = _e(null), C = _e("source"), oe = _e(null), f = Ee(
      () => typeof y.value.selectable > "u" ? b.value : y.value.selectable
    ), N = Ee(() => typeof y.value.updatable > "u" ? S.value : y.value.updatable), v = Ee(() => typeof y.value.focusable > "u" ? _.value : y.value.focusable);
    Rt(Uh, e.id), Rt(Yh, oe);
    const I = ce(() => y.value.class instanceof Function ? y.value.class(y.value) : y.value.class), k = ce(() => y.value.style instanceof Function ? y.value.style(y.value) : y.value.style), z = ce(() => {
      const g = y.value.type || "default", w = U?.[`edge-${g}`];
      if (w)
        return w;
      let D = y.value.template ?? l.value[g];
      if (typeof D == "string" && L) {
        const M = Object.keys(L.appContext.components);
        M && M.includes(g) && (D = _s(g, !1));
      }
      return D && typeof D != "string" ? D : (r.error(new Oe(ze.EDGE_TYPE_MISSING, D)), !1);
    }), { handlePointerDown: T } = Ea({
      nodeId: H,
      handleId: X,
      type: C,
      isValidConnection: h,
      edgeUpdaterType: C,
      onEdgeUpdate: j,
      onEdgeUpdateEnd: re
    });
    return () => {
      const g = d(y.value.source), w = d(y.value.target), D = "pathOptions" in y.value ? y.value.pathOptions : {};
      if (!g && !w)
        return r.error(new Oe(ze.EDGE_SOURCE_TARGET_MISSING, y.value.id, y.value.source, y.value.target)), null;
      if (!g)
        return r.error(new Oe(ze.EDGE_SOURCE_MISSING, y.value.id, y.value.source)), null;
      if (!w)
        return r.error(new Oe(ze.EDGE_TARGET_MISSING, y.value.id, y.value.target)), null;
      if (!y.value || y.value.hidden || g.hidden || w.hidden)
        return null;
      let M;
      o.value === St.Strict ? M = g.handleBounds.source : M = [...g.handleBounds.source || [], ...g.handleBounds.target || []];
      const J = Rr(M, y.value.sourceHandle);
      let Q;
      o.value === St.Strict ? Q = w.handleBounds.target : Q = [...w.handleBounds.target || [], ...w.handleBounds.source || []];
      const le = Rr(Q, y.value.targetHandle), se = J?.position || ae.Bottom, fe = le?.position || ae.Top, { x: ye, y: xe } = jt(g, J, se), { x: qe, y: Le } = jt(w, le, fe);
      return y.value.sourceX = ye, y.value.sourceY = xe, y.value.targetX = qe, y.value.targetY = Le, $e(
        "g",
        {
          ref: oe,
          key: e.id,
          "data-id": e.id,
          class: [
            "vue-flow__edge",
            `vue-flow__edge-${z.value === !1 ? "default" : y.value.type || "default"}`,
            a.value,
            I.value,
            {
              updating: Y.value,
              selected: y.value.selected,
              animated: y.value.animated,
              inactive: !f.value && !P.value.edgeClick.hasListeners()
            }
          ],
          tabIndex: v.value ? 0 : void 0,
          "aria-label": y.value.ariaLabel === null ? void 0 : y.value.ariaLabel ?? `Edge from ${y.value.source} to ${y.value.target}`,
          "aria-describedby": v.value ? `${ra}-${t}` : void 0,
          "aria-roledescription": "edge",
          role: v.value ? "group" : "img",
          ...y.value.domAttributes,
          onClick: F,
          onContextmenu: ee,
          onDblclick: he,
          onMouseenter: ve,
          onMousemove: de,
          onMouseleave: we,
          onKeyDown: v.value ? m : void 0
        },
        [
          ie.value ? null : $e(z.value === !1 ? l.value.default : z.value, {
            id: e.id,
            sourceNode: g,
            targetNode: w,
            source: y.value.source,
            target: y.value.target,
            type: y.value.type,
            updatable: N.value,
            selected: y.value.selected,
            animated: y.value.animated,
            label: y.value.label,
            labelStyle: y.value.labelStyle,
            labelShowBg: y.value.labelShowBg,
            labelBgStyle: y.value.labelBgStyle,
            labelBgPadding: y.value.labelBgPadding,
            labelBgBorderRadius: y.value.labelBgBorderRadius,
            data: y.value.data,
            events: { ...y.value.events, ...R },
            style: k.value,
            markerStart: `url('#${$n(y.value.markerStart, t)}')`,
            markerEnd: `url('#${$n(y.value.markerEnd, t)}')`,
            sourcePosition: se,
            targetPosition: fe,
            sourceX: ye,
            sourceY: xe,
            targetX: qe,
            targetY: Le,
            sourceHandleId: y.value.sourceHandle,
            targetHandleId: y.value.targetHandle,
            interactionWidth: y.value.interactionWidth,
            ...D
          }),
          [
            N.value === "source" || N.value === !0 ? [
              $e(
                "g",
                {
                  onMousedown: ue,
                  onMouseenter: B,
                  onMouseout: q
                },
                $e(Zr, {
                  position: se,
                  centerX: ye,
                  centerY: xe,
                  radius: i.value,
                  type: "source",
                  "data-type": "source"
                })
              )
            ] : null,
            N.value === "target" || N.value === !0 ? [
              $e(
                "g",
                {
                  onMousedown: pe,
                  onMouseenter: B,
                  onMouseout: q
                },
                $e(Zr, {
                  position: fe,
                  centerX: qe,
                  centerY: Le,
                  radius: i.value,
                  type: "target",
                  "data-type": "target"
                })
              )
            ] : null
          ]
        ]
      );
    };
    function B() {
      Y.value = !0;
    }
    function q() {
      Y.value = !1;
    }
    function j(g, w) {
      $.update({ event: g, edge: y.value, connection: w });
    }
    function re(g) {
      $.updateEnd({ event: g, edge: y.value }), ie.value = !1;
    }
    function G(g, w) {
      g.button === 0 && (ie.value = !0, H.value = w ? y.value.target : y.value.source, X.value = (w ? y.value.targetHandle : y.value.sourceHandle) ?? null, C.value = w ? "target" : "source", $.updateStart({ event: g, edge: y.value }), T(g));
    }
    function F(g) {
      var w;
      const D = { event: g, edge: y.value };
      f.value && (s.value = !1, y.value.selected && p.value ? (u([y.value]), (w = oe.value) == null || w.blur()) : n([y.value])), $.click(D);
    }
    function ee(g) {
      $.contextMenu({ event: g, edge: y.value });
    }
    function he(g) {
      $.doubleClick({ event: g, edge: y.value });
    }
    function ve(g) {
      $.mouseEnter({ event: g, edge: y.value });
    }
    function de(g) {
      $.mouseMove({ event: g, edge: y.value });
    }
    function we(g) {
      $.mouseLeave({ event: g, edge: y.value });
    }
    function ue(g) {
      G(g, !0);
    }
    function pe(g) {
      G(g, !1);
    }
    function m(g) {
      var w;
      !E.value && sa.includes(g.key) && f.value && (g.key === "Escape" ? ((w = oe.value) == null || w.blur(), u([c(e.id)])) : n([c(e.id)]));
    }
  }
}), ov = nv, iv = Se({
  name: "ConnectionLine",
  compatConfig: { MODE: 3 },
  setup() {
    var e;
    const {
      id: t,
      connectionMode: n,
      connectionStartHandle: o,
      connectionEndHandle: i,
      connectionPosition: r,
      connectionLineType: s,
      connectionLineStyle: a,
      connectionLineOptions: l,
      connectionStatus: u,
      viewport: c,
      findNode: d
    } = Me(), h = (e = mt(Ao)) == null ? void 0 : e["connection-line"], p = ce(() => {
      var P;
      return d((P = o.value) == null ? void 0 : P.nodeId);
    }), E = ce(() => {
      var P;
      return d((P = i.value) == null ? void 0 : P.nodeId) ?? null;
    }), b = ce(() => ({
      x: (r.value.x - c.value.x) / c.value.zoom,
      y: (r.value.y - c.value.y) / c.value.zoom
    })), S = ce(
      () => l.value.markerStart ? `url(#${$n(l.value.markerStart, t)})` : ""
    ), _ = ce(
      () => l.value.markerEnd ? `url(#${$n(l.value.markerEnd, t)})` : ""
    );
    return () => {
      var P, y, $;
      if (!p.value || !o.value)
        return null;
      const R = o.value.id, U = o.value.type, L = p.value.handleBounds;
      let Y = L?.[U] ?? [];
      if (n.value === St.Loose) {
        const k = L?.[U === "source" ? "target" : "source"] ?? [];
        Y = [...Y, ...k];
      }
      if (!Y)
        return null;
      const ie = (R ? Y.find((k) => k.id === R) : Y[0]) ?? null, H = ie?.position ?? ae.Top, { x: X, y: C } = jt(p.value, ie, H);
      let oe = null;
      E.value && (n.value === St.Strict ? oe = ((P = E.value.handleBounds[U === "source" ? "target" : "source"]) == null ? void 0 : P.find(
        (k) => {
          var z;
          return k.id === ((z = i.value) == null ? void 0 : z.id);
        }
      )) || null : oe = ((y = [...E.value.handleBounds.source ?? [], ...E.value.handleBounds.target ?? []]) == null ? void 0 : y.find(
        (k) => {
          var z;
          return k.id === ((z = i.value) == null ? void 0 : z.id);
        }
      )) || null);
      const f = (($ = i.value) == null ? void 0 : $.position) ?? (H ? bi[H] : null);
      if (!H || !f)
        return null;
      const N = s.value ?? l.value.type ?? Mt.Bezier;
      let v = "";
      const I = {
        sourceX: X,
        sourceY: C,
        sourcePosition: H,
        targetX: b.value.x,
        targetY: b.value.y,
        targetPosition: f
      };
      return N === Mt.Bezier ? [v] = Ma(I) : N === Mt.Step ? [v] = Ei({
        ...I,
        borderRadius: 0
      }) : N === Mt.SmoothStep ? [v] = Ei(I) : N === Mt.SimpleBezier ? [v] = Ta(I) : v = `M${X},${C} ${b.value.x},${b.value.y}`, $e(
        "svg",
        { class: "vue-flow__edges vue-flow__connectionline vue-flow__container" },
        $e(
          "g",
          { class: "vue-flow__connection" },
          h ? $e(h, {
            sourceX: X,
            sourceY: C,
            sourcePosition: H,
            targetX: b.value.x,
            targetY: b.value.y,
            targetPosition: f,
            sourceNode: p.value,
            sourceHandle: ie,
            targetNode: E.value,
            targetHandle: oe,
            markerEnd: _.value,
            markerStart: S.value,
            connectionStatus: u.value
          }) : $e("path", {
            d: v,
            class: [l.value.class, u.value, "vue-flow__connection-path"],
            style: {
              ...a.value,
              ...l.value.style
            },
            "marker-end": _.value,
            "marker-start": S.value
          })
        )
      );
    };
  }
}), rv = iv, sv = ["id", "markerWidth", "markerHeight", "markerUnits", "orient"], av = {
  name: "MarkerType",
  compatConfig: { MODE: 3 }
}, lv = /* @__PURE__ */ Se({
  ...av,
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
    return (t, n) => (V(), te("marker", {
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
      t.type === K(go).ArrowClosed ? (V(), te("polyline", {
        key: 0,
        style: Be({
          stroke: t.color,
          fill: t.color,
          strokeWidth: t.strokeWidth
        }),
        "stroke-linecap": "round",
        "stroke-linejoin": "round",
        points: "-5,-4 0,0 -5,4 -5,-4"
      }, null, 4)) : me("", !0),
      t.type === K(go).Arrow ? (V(), te("polyline", {
        key: 1,
        style: Be({
          stroke: t.color,
          strokeWidth: t.strokeWidth
        }),
        "stroke-linecap": "round",
        "stroke-linejoin": "round",
        fill: "none",
        points: "-5,-4 0,0 -5,4"
      }, null, 4)) : me("", !0)
    ], 8, sv));
  }
}), uv = {
  class: "vue-flow__marker vue-flow__container",
  "aria-hidden": "true"
}, cv = {
  name: "MarkerDefinitions",
  compatConfig: { MODE: 3 }
}, dv = /* @__PURE__ */ Se({
  ...cv,
  setup(e) {
    const { id: t, edges: n, connectionLineOptions: o, defaultMarkerColor: i } = Me(), r = ce(() => {
      const s = /* @__PURE__ */ new Set(), a = [], l = (u) => {
        if (u) {
          const c = $n(u, t);
          s.has(c) || (typeof u == "object" ? a.push({ ...u, id: c, color: u.color || i.value }) : a.push({ id: c, color: i.value, type: u }), s.add(c));
        }
      };
      for (const u of [o.value.markerEnd, o.value.markerStart])
        l(u);
      for (const u of n.value)
        for (const c of [u.markerStart, u.markerEnd])
          l(c);
      return a.sort((u, c) => u.id.localeCompare(c.id));
    });
    return (s, a) => (V(), te("svg", uv, [
      Z("defs", null, [
        (V(!0), te(Pe, null, ot(r.value, (l) => (V(), De(lv, {
          id: l.id,
          key: l.id,
          type: l.type,
          color: l.color,
          width: l.width,
          height: l.height,
          markerUnits: l.markerUnits,
          "stroke-width": l.strokeWidth,
          orient: l.orient
        }, null, 8, ["id", "type", "color", "width", "height", "markerUnits", "stroke-width", "orient"]))), 128))
      ])
    ]));
  }
}), fv = {
  name: "Edges",
  compatConfig: { MODE: 3 }
}, hv = /* @__PURE__ */ Se({
  ...fv,
  setup(e) {
    const { findNode: t, getEdges: n, elevateEdgesOnSelect: o } = Me();
    return (i, r) => (V(), te(Pe, null, [
      Re(dv),
      (V(!0), te(Pe, null, ot(K(n), (s) => (V(), te("svg", {
        key: s.id,
        class: "vue-flow__edges vue-flow__container",
        style: Be({ zIndex: K(Ih)(s, K(t), K(o)) })
      }, [
        Re(K(ov), {
          id: s.id
        }, null, 8, ["id"])
      ], 4))), 128)),
      Re(K(rv))
    ], 64));
  }
}), pv = Se({
  name: "Node",
  compatConfig: { MODE: 3 },
  props: ["id", "resizeObserver"],
  setup(e) {
    const {
      id: t,
      noPanClassName: n,
      selectNodesOnDrag: o,
      nodesSelectionActive: i,
      multiSelectionActive: r,
      emits: s,
      removeSelectedNodes: a,
      addSelectedNodes: l,
      updateNodeDimensions: u,
      onUpdateNodeInternals: c,
      getNodeTypes: d,
      nodeExtent: h,
      elevateNodesOnSelect: p,
      disableKeyboardA11y: E,
      ariaLiveMessage: b,
      snapToGrid: S,
      snapGrid: _,
      nodeDragThreshold: P,
      nodesDraggable: y,
      elementsSelectable: $,
      nodesConnectable: R,
      nodesFocusable: U,
      hooks: L
    } = Me(), Y = _e(null);
    Rt(ba, Y), Rt(wa, e.id);
    const ie = mt(Ao), H = on(), X = Sa(), { node: C, parentNode: oe } = $a(e.id), { emit: f, on: N } = Kh(C, s), v = Ee(() => typeof C.draggable > "u" ? y.value : C.draggable), I = Ee(() => typeof C.selectable > "u" ? $.value : C.selectable), k = Ee(() => typeof C.connectable > "u" ? R.value : C.connectable), z = Ee(() => typeof C.focusable > "u" ? U.value : C.focusable), T = ce(
      () => I.value || v.value || L.value.nodeClick.hasListeners() || L.value.nodeDoubleClick.hasListeners() || L.value.nodeMouseEnter.hasListeners() || L.value.nodeMouseMove.hasListeners() || L.value.nodeMouseLeave.hasListeners()
    ), B = Ee(() => !!C.dimensions.width && !!C.dimensions.height), q = ce(() => {
      const w = C.type || "default", D = ie?.[`node-${w}`];
      if (D)
        return D;
      let M = C.template || d.value[w];
      if (typeof M == "string" && H) {
        const J = Object.keys(H.appContext.components);
        J && J.includes(w) && (M = _s(w, !1));
      }
      return M && typeof M != "string" ? M : (s.error(new Oe(ze.NODE_TYPE_MISSING, M)), !1);
    }), j = xa({
      id: e.id,
      el: Y,
      disabled: () => !v.value,
      selectable: I,
      dragHandle: () => C.dragHandle,
      onStart(w) {
        f.dragStart(w);
      },
      onDrag(w) {
        f.drag(w);
      },
      onStop(w) {
        f.dragStop(w);
      },
      onClick(w) {
        m(w);
      }
    }), re = ce(() => C.class instanceof Function ? C.class(C) : C.class), G = ce(() => {
      const w = (C.style instanceof Function ? C.style(C) : C.style) || {}, D = C.width instanceof Function ? C.width(C) : C.width, M = C.height instanceof Function ? C.height(C) : C.height;
      return !w.width && D && (w.width = typeof D == "string" ? D : `${D}px`), !w.height && M && (w.height = typeof M == "string" ? M : `${M}px`), w;
    }), F = Ee(() => Number(C.zIndex ?? G.value.zIndex ?? 0));
    return c((w) => {
      (w.includes(e.id) || !w.length) && he();
    }), st(() => {
      Ne(
        () => C.hidden,
        (w = !1, D, M) => {
          !w && Y.value && (e.resizeObserver.observe(Y.value), M(() => {
            Y.value && e.resizeObserver.unobserve(Y.value);
          }));
        },
        { immediate: !0, flush: "post" }
      );
    }), Ne([() => C.type, () => C.sourcePosition, () => C.targetPosition], () => {
      Ye(() => {
        u([{ id: e.id, nodeElement: Y.value, forceUpdate: !0 }]);
      });
    }), Ne(
      [
        () => C.position.x,
        () => C.position.y,
        () => {
          var w;
          return (w = oe.value) == null ? void 0 : w.computedPosition.x;
        },
        () => {
          var w;
          return (w = oe.value) == null ? void 0 : w.computedPosition.y;
        },
        () => {
          var w;
          return (w = oe.value) == null ? void 0 : w.computedPosition.z;
        },
        F,
        () => C.selected,
        () => C.dimensions.height,
        () => C.dimensions.width,
        () => {
          var w;
          return (w = oe.value) == null ? void 0 : w.dimensions.height;
        },
        () => {
          var w;
          return (w = oe.value) == null ? void 0 : w.dimensions.width;
        }
      ],
      ([w, D, M, J, Q, le]) => {
        const se = {
          x: w,
          y: D,
          z: le + (p.value && C.selected ? 1e3 : 0)
        };
        typeof M < "u" && typeof J < "u" ? C.computedPosition = Sh({ x: M, y: J, z: Q }, se) : C.computedPosition = se;
      },
      { flush: "post", immediate: !0 }
    ), Ne([() => C.extent, h], ([w, D], [M, J]) => {
      (w !== M || D !== J) && ee();
    }), C.extent === "parent" || typeof C.extent == "object" && "range" in C.extent && C.extent.range === "parent" ? ci(() => B).toBe(!0).then(ee) : ee(), () => C.hidden ? null : $e(
      "div",
      {
        ref: Y,
        "data-id": C.id,
        class: [
          "vue-flow__node",
          `vue-flow__node-${q.value === !1 ? "default" : C.type || "default"}`,
          {
            [n.value]: v.value,
            dragging: j?.value,
            draggable: v.value,
            selected: C.selected,
            selectable: I.value,
            parent: C.isParent
          },
          re.value
        ],
        style: {
          visibility: B.value ? "visible" : "hidden",
          zIndex: C.computedPosition.z ?? F.value,
          transform: `translate(${C.computedPosition.x}px,${C.computedPosition.y}px)`,
          pointerEvents: T.value ? "all" : "none",
          ...G.value
        },
        tabIndex: z.value ? 0 : void 0,
        role: z.value ? "group" : void 0,
        "aria-describedby": E.value ? void 0 : `${ia}-${t}`,
        "aria-label": C.ariaLabel,
        "aria-roledescription": "node",
        ...C.domAttributes,
        onMouseenter: ve,
        onMousemove: de,
        onMouseleave: we,
        onContextmenu: ue,
        onClick: m,
        onDblclick: pe,
        onKeydown: g
      },
      [
        $e(q.value === !1 ? d.value.default : q.value, {
          id: C.id,
          type: C.type,
          data: C.data,
          events: { ...C.events, ...N },
          selected: C.selected,
          resizing: C.resizing,
          dragging: j.value,
          connectable: k.value,
          position: C.computedPosition,
          dimensions: C.dimensions,
          isValidTargetPos: C.isValidTargetPos,
          isValidSourcePos: C.isValidSourcePos,
          parent: C.parentNode,
          parentNodeId: C.parentNode,
          zIndex: C.computedPosition.z ?? F.value,
          targetPosition: C.targetPosition,
          sourcePosition: C.sourcePosition,
          label: C.label,
          dragHandle: C.dragHandle,
          onUpdateNodeInternals: he
        })
      ]
    );
    function ee() {
      const w = C.computedPosition, { computedPosition: D, position: M } = Xi(
        C,
        S.value ? Do(w, _.value) : w,
        s.error,
        h.value,
        oe.value
      );
      (C.computedPosition.x !== D.x || C.computedPosition.y !== D.y) && (C.computedPosition = { ...C.computedPosition, ...D }), (C.position.x !== M.x || C.position.y !== M.y) && (C.position = M);
    }
    function he() {
      Y.value && u([{ id: e.id, nodeElement: Y.value, forceUpdate: !0 }]);
    }
    function ve(w) {
      j?.value || f.mouseEnter({ event: w, node: C });
    }
    function de(w) {
      j?.value || f.mouseMove({ event: w, node: C });
    }
    function we(w) {
      j?.value || f.mouseLeave({ event: w, node: C });
    }
    function ue(w) {
      return f.contextMenu({ event: w, node: C });
    }
    function pe(w) {
      return f.doubleClick({ event: w, node: C });
    }
    function m(w) {
      I.value && (!o.value || !v.value || P.value > 0) && xi(
        C,
        r.value,
        l,
        a,
        i,
        !1,
        Y.value
      ), f.click({ event: w, node: C });
    }
    function g(w) {
      if (!(_i(w) || E.value))
        if (sa.includes(w.key) && I.value) {
          const D = w.key === "Escape";
          xi(
            C,
            r.value,
            l,
            a,
            i,
            D,
            Y.value
          );
        } else v.value && C.selected && Wt[w.key] && (w.preventDefault(), b.value = `Moved selected node ${w.key.replace("Arrow", "").toLowerCase()}. New position, x: ${~~C.position.x}, y: ${~~C.position.y}`, X(
          {
            x: Wt[w.key].x,
            y: Wt[w.key].y
          },
          w.shiftKey
        ));
    }
  }
}), vv = pv;
function gv(e = { includeHiddenNodes: !1 }) {
  const { nodes: t } = Me();
  return ce(() => {
    if (t.value.length === 0)
      return !1;
    for (const n of t.value)
      if ((e.includeHiddenNodes || !n.hidden) && (n?.handleBounds === void 0 || n.dimensions.width === 0 || n.dimensions.height === 0))
        return !1;
    return !0;
  });
}
const mv = { class: "vue-flow__nodes vue-flow__container" }, yv = {
  name: "Nodes",
  compatConfig: { MODE: 3 }
}, _v = /* @__PURE__ */ Se({
  ...yv,
  setup(e) {
    const { getNodes: t, updateNodeDimensions: n, emits: o } = Me(), i = gv(), r = _e();
    return Ne(
      i,
      (s) => {
        s && Ye(() => {
          o.nodesInitialized(t.value);
        });
      },
      { immediate: !0 }
    ), st(() => {
      r.value = new ResizeObserver((s) => {
        const a = s.map((l) => ({
          id: l.target.getAttribute("data-id"),
          nodeElement: l.target,
          forceUpdate: !0
        }));
        Ye(() => n(a));
      });
    }), No(() => {
      var s;
      return (s = r.value) == null ? void 0 : s.disconnect();
    }), (s, a) => (V(), te("div", mv, [
      r.value ? (V(!0), te(Pe, { key: 0 }, ot(K(t), (l, u, c, d) => {
        const h = [l.id];
        if (d && d.key === l.id && Tl(d, h))
          return d;
        const p = (V(), De(K(vv), {
          id: l.id,
          key: l.id,
          "resize-observer": r.value
        }, null, 8, ["id", "resize-observer"]));
        return p.memo = h, p;
      }, a, 0), 128)) : me("", !0)
    ]));
  }
});
function wv() {
  const { emits: e } = Me();
  st(() => {
    if (_a()) {
      const t = document.querySelector(".vue-flow__pane");
      t && window.getComputedStyle(t).zIndex !== "1" && e.error(new Oe(ze.MISSING_STYLES));
    }
  });
}
const bv = /* @__PURE__ */ Z("div", { class: "vue-flow__edge-labels" }, null, -1), xv = {
  name: "VueFlow",
  compatConfig: { MODE: 3 }
}, Ev = /* @__PURE__ */ Se({
  ...xv,
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
    const o = e, i = ys(), r = qo(o, "modelValue", n), s = qo(o, "nodes", n), a = qo(o, "edges", n), l = Me(o), u = ep({ modelValue: r, nodes: s, edges: a }, o, l);
    return np(n, l.hooks), jp(), wv(), Rt(Ao, i), kl(u), t(l), (c, d) => (V(), te("div", {
      ref: K(l).vueFlowRef,
      class: "vue-flow"
    }, [
      Re(qp, null, {
        default: tt(() => [
          Re(hv),
          bv,
          Re(_v),
          Ie(c.$slots, "zoom-pane")
        ]),
        _: 3
      }),
      Ie(c.$slots, "default"),
      Re(Qp)
    ], 512));
  }
}), $v = {
  name: "Panel",
  compatConfig: { MODE: 3 }
}, Da = /* @__PURE__ */ Se({
  ...$v,
  props: {
    position: {}
  },
  setup(e) {
    const t = e, { userSelectionActive: n } = Me(), o = ce(() => `${t.position}`.split("-"));
    return (i, r) => (V(), te("div", {
      class: Ve(["vue-flow__panel", o.value]),
      style: Be({ pointerEvents: K(n) ? "none" : "all" })
    }, [
      Ie(i.$slots, "default")
    ], 6));
  }
});
var ht = /* @__PURE__ */ ((e) => (e.Lines = "lines", e.Dots = "dots", e))(ht || {});
const Aa = function({ dimensions: e, size: t, color: n }) {
  return $e("path", {
    stroke: n,
    "stroke-width": t,
    d: `M${e[0] / 2} 0 V${e[1]} M0 ${e[1] / 2} H${e[0]}`
  });
}, Pa = function({ radius: e, color: t }) {
  return $e("circle", { cx: e, cy: e, r: e, fill: t });
};
ht.Lines + "", ht.Dots + "";
const Sv = {
  [ht.Dots]: "#81818a",
  [ht.Lines]: "#eee"
}, Nv = ["id", "x", "y", "width", "height", "patternTransform"], kv = {
  key: 2,
  height: "100",
  width: "100"
}, Cv = ["fill"], Mv = ["x", "y", "fill"], Tv = {
  name: "Background",
  compatConfig: { MODE: 3 }
}, Iv = /* @__PURE__ */ Se({
  ...Tv,
  props: {
    id: {},
    variant: { default: () => ht.Dots },
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
    const { id: t, viewport: n } = Me(), o = ce(() => {
      const s = n.value.zoom, [a, l] = Array.isArray(e.gap) ? e.gap : [e.gap, e.gap], u = [a * s || 1, l * s || 1], c = e.size * s, [d, h] = Array.isArray(e.offset) ? e.offset : [e.offset, e.offset], p = [d * s || 1 + u[0] / 2, h * s || 1 + u[1] / 2];
      return {
        scaledGap: u,
        offset: p,
        size: c
      };
    }), i = Ee(() => `pattern-${t}${e.id ? `-${e.id}` : ""}`), r = Ee(() => e.color || e.patternColor || Sv[e.variant || ht.Dots]);
    return (s, a) => (V(), te("svg", {
      class: "vue-flow__background vue-flow__container",
      style: Be({
        height: `${s.height > 100 ? 100 : s.height}%`,
        width: `${s.width > 100 ? 100 : s.width}%`
      })
    }, [
      Ie(s.$slots, "pattern-container", { id: i.value }, () => [
        Z("pattern", {
          id: i.value,
          x: K(n).x % o.value.scaledGap[0],
          y: K(n).y % o.value.scaledGap[1],
          width: o.value.scaledGap[0],
          height: o.value.scaledGap[1],
          patternTransform: `translate(-${o.value.offset[0]},-${o.value.offset[1]})`,
          patternUnits: "userSpaceOnUse"
        }, [
          Ie(s.$slots, "pattern", {}, () => [
            s.variant === K(ht).Lines ? (V(), De(K(Aa), {
              key: 0,
              size: s.lineWidth,
              color: r.value,
              dimensions: o.value.scaledGap
            }, null, 8, ["size", "color", "dimensions"])) : s.variant === K(ht).Dots ? (V(), De(K(Pa), {
              key: 1,
              color: r.value,
              radius: o.value.size / 2
            }, null, 8, ["color", "radius"])) : me("", !0),
            s.bgColor ? (V(), te("svg", kv, [
              Z("rect", {
                width: "100%",
                height: "100%",
                fill: s.bgColor
              }, null, 8, Cv)
            ])) : me("", !0)
          ])
        ], 8, Nv)
      ]),
      Z("rect", {
        x: s.x,
        y: s.y,
        width: "100%",
        height: "100%",
        fill: `url(#${i.value})`
      }, null, 8, Mv),
      Ie(s.$slots, "default", { id: i.value })
    ], 4));
  }
}), Dv = {
  name: "ControlButton",
  compatConfig: { MODE: 3 }
}, Av = (e, t) => {
  const n = e.__vccOpts || e;
  for (const [o, i] of t)
    n[o] = i;
  return n;
}, Pv = {
  type: "button",
  class: "vue-flow__controls-button"
};
function zv(e, t, n, o, i, r) {
  return V(), te("button", Pv, [
    Ie(e.$slots, "default")
  ]);
}
const Xn = /* @__PURE__ */ Av(Dv, [["render", zv]]), Ov = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 32 32"
}, Rv = /* @__PURE__ */ Z("path", { d: "M32 18.133H18.133V32h-4.266V18.133H0v-4.266h13.867V0h4.266v13.867H32z" }, null, -1), Bv = [
  Rv
];
function Vv(e, t) {
  return V(), te("svg", Ov, Bv);
}
const Lv = { render: Vv }, Hv = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 32 5"
}, Fv = /* @__PURE__ */ Z("path", { d: "M0 0h32v4.2H0z" }, null, -1), Uv = [
  Fv
];
function Yv(e, t) {
  return V(), te("svg", Hv, Uv);
}
const Xv = { render: Yv }, Gv = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 32 30"
}, qv = /* @__PURE__ */ Z("path", { d: "M3.692 4.63c0-.53.4-.938.939-.938h5.215V0H4.708C2.13 0 0 2.054 0 4.63v5.216h3.692V4.631zM27.354 0h-5.2v3.692h5.17c.53 0 .984.4.984.939v5.215H32V4.631A4.624 4.624 0 0 0 27.354 0zm.954 24.83c0 .532-.4.94-.939.94h-5.215v3.768h5.215c2.577 0 4.631-2.13 4.631-4.707v-5.139h-3.692v5.139zm-23.677.94a.919.919 0 0 1-.939-.94v-5.138H0v5.139c0 2.577 2.13 4.707 4.708 4.707h5.138V25.77H4.631z" }, null, -1), Wv = [
  qv
];
function Zv(e, t) {
  return V(), te("svg", Gv, Wv);
}
const Kv = { render: Zv }, Jv = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 25 32"
}, Qv = /* @__PURE__ */ Z("path", { d: "M21.333 10.667H19.81V7.619C19.81 3.429 16.38 0 12.19 0 8 0 4.571 3.429 4.571 7.619v3.048H3.048A3.056 3.056 0 0 0 0 13.714v15.238A3.056 3.056 0 0 0 3.048 32h18.285a3.056 3.056 0 0 0 3.048-3.048V13.714a3.056 3.056 0 0 0-3.048-3.047zM12.19 24.533a3.056 3.056 0 0 1-3.047-3.047 3.056 3.056 0 0 1 3.047-3.048 3.056 3.056 0 0 1 3.048 3.048 3.056 3.056 0 0 1-3.048 3.047zm4.724-13.866H7.467V7.619c0-2.59 2.133-4.724 4.723-4.724 2.591 0 4.724 2.133 4.724 4.724v3.048z" }, null, -1), jv = [
  Qv
];
function eg(e, t) {
  return V(), te("svg", Jv, jv);
}
const tg = { render: eg }, ng = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 25 32"
}, og = /* @__PURE__ */ Z("path", { d: "M21.333 10.667H19.81V7.619C19.81 3.429 16.38 0 12.19 0c-4.114 1.828-1.37 2.133.305 2.438 1.676.305 4.42 2.59 4.42 5.181v3.048H3.047A3.056 3.056 0 0 0 0 13.714v15.238A3.056 3.056 0 0 0 3.048 32h18.285a3.056 3.056 0 0 0 3.048-3.048V13.714a3.056 3.056 0 0 0-3.048-3.047zM12.19 24.533a3.056 3.056 0 0 1-3.047-3.047 3.056 3.056 0 0 1 3.047-3.048 3.056 3.056 0 0 1 3.048 3.048 3.056 3.056 0 0 1-3.048 3.047z" }, null, -1), ig = [
  og
];
function rg(e, t) {
  return V(), te("svg", ng, ig);
}
const sg = { render: rg }, ag = {
  name: "Controls",
  compatConfig: { MODE: 3 }
}, lg = /* @__PURE__ */ Se({
  ...ag,
  props: {
    showZoom: { type: Boolean, default: !0 },
    showFitView: { type: Boolean, default: !0 },
    showInteractive: { type: Boolean, default: !0 },
    fitViewParams: {},
    position: { default: () => oa.BottomLeft }
  },
  emits: ["zoomIn", "zoomOut", "fitView", "interactionChange"],
  setup(e, { emit: t }) {
    const {
      nodesDraggable: n,
      nodesConnectable: o,
      elementsSelectable: i,
      setInteractive: r,
      zoomIn: s,
      zoomOut: a,
      fitView: l,
      viewport: u,
      minZoom: c,
      maxZoom: d
    } = Me(), h = Ee(() => n.value || o.value || i.value), p = Ee(() => u.value.zoom <= c.value), E = Ee(() => u.value.zoom >= d.value);
    function b() {
      s(), t("zoomIn");
    }
    function S() {
      a(), t("zoomOut");
    }
    function _() {
      l(e.fitViewParams), t("fitView");
    }
    function P() {
      r(!h.value), t("interactionChange", !h.value);
    }
    return (y, $) => (V(), De(K(Da), {
      class: "vue-flow__controls",
      position: y.position
    }, {
      default: tt(() => [
        Ie(y.$slots, "top"),
        y.showZoom ? (V(), te(Pe, { key: 0 }, [
          Ie(y.$slots, "control-zoom-in", {}, () => [
            Re(Xn, {
              class: "vue-flow__controls-zoomin",
              disabled: E.value,
              onClick: b
            }, {
              default: tt(() => [
                Ie(y.$slots, "icon-zoom-in", {}, () => [
                  (V(), De(Ct(K(Lv))))
                ])
              ]),
              _: 3
            }, 8, ["disabled"])
          ]),
          Ie(y.$slots, "control-zoom-out", {}, () => [
            Re(Xn, {
              class: "vue-flow__controls-zoomout",
              disabled: p.value,
              onClick: S
            }, {
              default: tt(() => [
                Ie(y.$slots, "icon-zoom-out", {}, () => [
                  (V(), De(Ct(K(Xv))))
                ])
              ]),
              _: 3
            }, 8, ["disabled"])
          ])
        ], 64)) : me("", !0),
        y.showFitView ? Ie(y.$slots, "control-fit-view", { key: 1 }, () => [
          Re(Xn, {
            class: "vue-flow__controls-fitview",
            onClick: _
          }, {
            default: tt(() => [
              Ie(y.$slots, "icon-fit-view", {}, () => [
                (V(), De(Ct(K(Kv))))
              ])
            ]),
            _: 3
          })
        ]) : me("", !0),
        y.showInteractive ? Ie(y.$slots, "control-interactive", { key: 2 }, () => [
          y.showInteractive ? (V(), De(Xn, {
            key: 0,
            class: "vue-flow__controls-interactive",
            onClick: P
          }, {
            default: tt(() => [
              h.value ? Ie(y.$slots, "icon-unlock", { key: 0 }, () => [
                (V(), De(Ct(K(sg))))
              ]) : me("", !0),
              h.value ? me("", !0) : Ie(y.$slots, "icon-lock", { key: 1 }, () => [
                (V(), De(Ct(K(tg))))
              ])
            ]),
            _: 3
          })) : me("", !0)
        ]) : me("", !0),
        Ie(y.$slots, "default")
      ]),
      _: 3
    }, 8, ["position"]));
  }
});
var ug = { value: () => {
} };
function Wi() {
  for (var e = 0, t = arguments.length, n = {}, o; e < t; ++e) {
    if (!(o = arguments[e] + "") || o in n || /[\s.]/.test(o)) throw new Error("illegal type: " + o);
    n[o] = [];
  }
  return new oo(n);
}
function oo(e) {
  this._ = e;
}
function cg(e, t) {
  return e.trim().split(/^|\s+/).map(function(n) {
    var o = "", i = n.indexOf(".");
    if (i >= 0 && (o = n.slice(i + 1), n = n.slice(0, i)), n && !t.hasOwnProperty(n)) throw new Error("unknown type: " + n);
    return { type: n, name: o };
  });
}
oo.prototype = Wi.prototype = {
  constructor: oo,
  on: function(e, t) {
    var n = this._, o = cg(e + "", n), i, r = -1, s = o.length;
    if (arguments.length < 2) {
      for (; ++r < s; ) if ((i = (e = o[r]).type) && (i = dg(n[i], e.name))) return i;
      return;
    }
    if (t != null && typeof t != "function") throw new Error("invalid callback: " + t);
    for (; ++r < s; )
      if (i = (e = o[r]).type) n[i] = Kr(n[i], e.name, t);
      else if (t == null) for (i in n) n[i] = Kr(n[i], e.name, null);
    return this;
  },
  copy: function() {
    var e = {}, t = this._;
    for (var n in t) e[n] = t[n].slice();
    return new oo(e);
  },
  call: function(e, t) {
    if ((i = arguments.length - 2) > 0) for (var n = new Array(i), o = 0, i, r; o < i; ++o) n[o] = arguments[o + 2];
    if (!this._.hasOwnProperty(e)) throw new Error("unknown type: " + e);
    for (r = this._[e], o = 0, i = r.length; o < i; ++o) r[o].value.apply(t, n);
  },
  apply: function(e, t, n) {
    if (!this._.hasOwnProperty(e)) throw new Error("unknown type: " + e);
    for (var o = this._[e], i = 0, r = o.length; i < r; ++i) o[i].value.apply(t, n);
  }
};
function dg(e, t) {
  for (var n = 0, o = e.length, i; n < o; ++n)
    if ((i = e[n]).name === t)
      return i.value;
}
function Kr(e, t, n) {
  for (var o = 0, i = e.length; o < i; ++o)
    if (e[o].name === t) {
      e[o] = ug, e = e.slice(0, o).concat(e.slice(o + 1));
      break;
    }
  return n != null && e.push({ name: t, value: n }), e;
}
var $i = "http://www.w3.org/1999/xhtml";
const Jr = {
  svg: "http://www.w3.org/2000/svg",
  xhtml: $i,
  xlink: "http://www.w3.org/1999/xlink",
  xml: "http://www.w3.org/XML/1998/namespace",
  xmlns: "http://www.w3.org/2000/xmlns/"
};
function Bo(e) {
  var t = e += "", n = t.indexOf(":");
  return n >= 0 && (t = e.slice(0, n)) !== "xmlns" && (e = e.slice(n + 1)), Jr.hasOwnProperty(t) ? { space: Jr[t], local: e } : e;
}
function fg(e) {
  return function() {
    var t = this.ownerDocument, n = this.namespaceURI;
    return n === $i && t.documentElement.namespaceURI === $i ? t.createElement(e) : t.createElementNS(n, e);
  };
}
function hg(e) {
  return function() {
    return this.ownerDocument.createElementNS(e.space, e.local);
  };
}
function za(e) {
  var t = Bo(e);
  return (t.local ? hg : fg)(t);
}
function pg() {
}
function Zi(e) {
  return e == null ? pg : function() {
    return this.querySelector(e);
  };
}
function vg(e) {
  typeof e != "function" && (e = Zi(e));
  for (var t = this._groups, n = t.length, o = new Array(n), i = 0; i < n; ++i)
    for (var r = t[i], s = r.length, a = o[i] = new Array(s), l, u, c = 0; c < s; ++c)
      (l = r[c]) && (u = e.call(l, l.__data__, c, r)) && ("__data__" in l && (u.__data__ = l.__data__), a[c] = u);
  return new Ge(o, this._parents);
}
function gg(e) {
  return e == null ? [] : Array.isArray(e) ? e : Array.from(e);
}
function mg() {
  return [];
}
function Oa(e) {
  return e == null ? mg : function() {
    return this.querySelectorAll(e);
  };
}
function yg(e) {
  return function() {
    return gg(e.apply(this, arguments));
  };
}
function _g(e) {
  typeof e == "function" ? e = yg(e) : e = Oa(e);
  for (var t = this._groups, n = t.length, o = [], i = [], r = 0; r < n; ++r)
    for (var s = t[r], a = s.length, l, u = 0; u < a; ++u)
      (l = s[u]) && (o.push(e.call(l, l.__data__, u, s)), i.push(l));
  return new Ge(o, i);
}
function Ra(e) {
  return function() {
    return this.matches(e);
  };
}
function Ba(e) {
  return function(t) {
    return t.matches(e);
  };
}
var wg = Array.prototype.find;
function bg(e) {
  return function() {
    return wg.call(this.children, e);
  };
}
function xg() {
  return this.firstElementChild;
}
function Eg(e) {
  return this.select(e == null ? xg : bg(typeof e == "function" ? e : Ba(e)));
}
var $g = Array.prototype.filter;
function Sg() {
  return Array.from(this.children);
}
function Ng(e) {
  return function() {
    return $g.call(this.children, e);
  };
}
function kg(e) {
  return this.selectAll(e == null ? Sg : Ng(typeof e == "function" ? e : Ba(e)));
}
function Cg(e) {
  typeof e != "function" && (e = Ra(e));
  for (var t = this._groups, n = t.length, o = new Array(n), i = 0; i < n; ++i)
    for (var r = t[i], s = r.length, a = o[i] = [], l, u = 0; u < s; ++u)
      (l = r[u]) && e.call(l, l.__data__, u, r) && a.push(l);
  return new Ge(o, this._parents);
}
function Va(e) {
  return new Array(e.length);
}
function Mg() {
  return new Ge(this._enter || this._groups.map(Va), this._parents);
}
function wo(e, t) {
  this.ownerDocument = e.ownerDocument, this.namespaceURI = e.namespaceURI, this._next = null, this._parent = e, this.__data__ = t;
}
wo.prototype = {
  constructor: wo,
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
function Tg(e) {
  return function() {
    return e;
  };
}
function Ig(e, t, n, o, i, r) {
  for (var s = 0, a, l = t.length, u = r.length; s < u; ++s)
    (a = t[s]) ? (a.__data__ = r[s], o[s] = a) : n[s] = new wo(e, r[s]);
  for (; s < l; ++s)
    (a = t[s]) && (i[s] = a);
}
function Dg(e, t, n, o, i, r, s) {
  var a, l, u = /* @__PURE__ */ new Map(), c = t.length, d = r.length, h = new Array(c), p;
  for (a = 0; a < c; ++a)
    (l = t[a]) && (h[a] = p = s.call(l, l.__data__, a, t) + "", u.has(p) ? i[a] = l : u.set(p, l));
  for (a = 0; a < d; ++a)
    p = s.call(e, r[a], a, r) + "", (l = u.get(p)) ? (o[a] = l, l.__data__ = r[a], u.delete(p)) : n[a] = new wo(e, r[a]);
  for (a = 0; a < c; ++a)
    (l = t[a]) && u.get(h[a]) === l && (i[a] = l);
}
function Ag(e) {
  return e.__data__;
}
function Pg(e, t) {
  if (!arguments.length) return Array.from(this, Ag);
  var n = t ? Dg : Ig, o = this._parents, i = this._groups;
  typeof e != "function" && (e = Tg(e));
  for (var r = i.length, s = new Array(r), a = new Array(r), l = new Array(r), u = 0; u < r; ++u) {
    var c = o[u], d = i[u], h = d.length, p = zg(e.call(c, c && c.__data__, u, o)), E = p.length, b = a[u] = new Array(E), S = s[u] = new Array(E), _ = l[u] = new Array(h);
    n(c, d, b, S, _, p, t);
    for (var P = 0, y = 0, $, R; P < E; ++P)
      if ($ = b[P]) {
        for (P >= y && (y = P + 1); !(R = S[y]) && ++y < E; ) ;
        $._next = R || null;
      }
  }
  return s = new Ge(s, o), s._enter = a, s._exit = l, s;
}
function zg(e) {
  return typeof e == "object" && "length" in e ? e : Array.from(e);
}
function Og() {
  return new Ge(this._exit || this._groups.map(Va), this._parents);
}
function Rg(e, t, n) {
  var o = this.enter(), i = this, r = this.exit();
  return typeof e == "function" ? (o = e(o), o && (o = o.selection())) : o = o.append(e + ""), t != null && (i = t(i), i && (i = i.selection())), n == null ? r.remove() : n(r), o && i ? o.merge(i).order() : i;
}
function Bg(e) {
  for (var t = e.selection ? e.selection() : e, n = this._groups, o = t._groups, i = n.length, r = o.length, s = Math.min(i, r), a = new Array(i), l = 0; l < s; ++l)
    for (var u = n[l], c = o[l], d = u.length, h = a[l] = new Array(d), p, E = 0; E < d; ++E)
      (p = u[E] || c[E]) && (h[E] = p);
  for (; l < i; ++l)
    a[l] = n[l];
  return new Ge(a, this._parents);
}
function Vg() {
  for (var e = this._groups, t = -1, n = e.length; ++t < n; )
    for (var o = e[t], i = o.length - 1, r = o[i], s; --i >= 0; )
      (s = o[i]) && (r && s.compareDocumentPosition(r) ^ 4 && r.parentNode.insertBefore(s, r), r = s);
  return this;
}
function Lg(e) {
  e || (e = Hg);
  function t(d, h) {
    return d && h ? e(d.__data__, h.__data__) : !d - !h;
  }
  for (var n = this._groups, o = n.length, i = new Array(o), r = 0; r < o; ++r) {
    for (var s = n[r], a = s.length, l = i[r] = new Array(a), u, c = 0; c < a; ++c)
      (u = s[c]) && (l[c] = u);
    l.sort(t);
  }
  return new Ge(i, this._parents).order();
}
function Hg(e, t) {
  return e < t ? -1 : e > t ? 1 : e >= t ? 0 : NaN;
}
function Fg() {
  var e = arguments[0];
  return arguments[0] = this, e.apply(null, arguments), this;
}
function Ug() {
  return Array.from(this);
}
function Yg() {
  for (var e = this._groups, t = 0, n = e.length; t < n; ++t)
    for (var o = e[t], i = 0, r = o.length; i < r; ++i) {
      var s = o[i];
      if (s) return s;
    }
  return null;
}
function Xg() {
  let e = 0;
  for (const t of this) ++e;
  return e;
}
function Gg() {
  return !this.node();
}
function qg(e) {
  for (var t = this._groups, n = 0, o = t.length; n < o; ++n)
    for (var i = t[n], r = 0, s = i.length, a; r < s; ++r)
      (a = i[r]) && e.call(a, a.__data__, r, i);
  return this;
}
function Wg(e) {
  return function() {
    this.removeAttribute(e);
  };
}
function Zg(e) {
  return function() {
    this.removeAttributeNS(e.space, e.local);
  };
}
function Kg(e, t) {
  return function() {
    this.setAttribute(e, t);
  };
}
function Jg(e, t) {
  return function() {
    this.setAttributeNS(e.space, e.local, t);
  };
}
function Qg(e, t) {
  return function() {
    var n = t.apply(this, arguments);
    n == null ? this.removeAttribute(e) : this.setAttribute(e, n);
  };
}
function jg(e, t) {
  return function() {
    var n = t.apply(this, arguments);
    n == null ? this.removeAttributeNS(e.space, e.local) : this.setAttributeNS(e.space, e.local, n);
  };
}
function em(e, t) {
  var n = Bo(e);
  if (arguments.length < 2) {
    var o = this.node();
    return n.local ? o.getAttributeNS(n.space, n.local) : o.getAttribute(n);
  }
  return this.each((t == null ? n.local ? Zg : Wg : typeof t == "function" ? n.local ? jg : Qg : n.local ? Jg : Kg)(n, t));
}
function La(e) {
  return e.ownerDocument && e.ownerDocument.defaultView || e.document && e || e.defaultView;
}
function tm(e) {
  return function() {
    this.style.removeProperty(e);
  };
}
function nm(e, t, n) {
  return function() {
    this.style.setProperty(e, t, n);
  };
}
function om(e, t, n) {
  return function() {
    var o = t.apply(this, arguments);
    o == null ? this.style.removeProperty(e) : this.style.setProperty(e, o, n);
  };
}
function im(e, t, n) {
  return arguments.length > 1 ? this.each((t == null ? tm : typeof t == "function" ? om : nm)(e, t, n ?? "")) : tn(this.node(), e);
}
function tn(e, t) {
  return e.style.getPropertyValue(t) || La(e).getComputedStyle(e, null).getPropertyValue(t);
}
function rm(e) {
  return function() {
    delete this[e];
  };
}
function sm(e, t) {
  return function() {
    this[e] = t;
  };
}
function am(e, t) {
  return function() {
    var n = t.apply(this, arguments);
    n == null ? delete this[e] : this[e] = n;
  };
}
function lm(e, t) {
  return arguments.length > 1 ? this.each((t == null ? rm : typeof t == "function" ? am : sm)(e, t)) : this.node()[e];
}
function Ha(e) {
  return e.trim().split(/^|\s+/);
}
function Ki(e) {
  return e.classList || new Fa(e);
}
function Fa(e) {
  this._node = e, this._names = Ha(e.getAttribute("class") || "");
}
Fa.prototype = {
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
function Ua(e, t) {
  for (var n = Ki(e), o = -1, i = t.length; ++o < i; ) n.add(t[o]);
}
function Ya(e, t) {
  for (var n = Ki(e), o = -1, i = t.length; ++o < i; ) n.remove(t[o]);
}
function um(e) {
  return function() {
    Ua(this, e);
  };
}
function cm(e) {
  return function() {
    Ya(this, e);
  };
}
function dm(e, t) {
  return function() {
    (t.apply(this, arguments) ? Ua : Ya)(this, e);
  };
}
function fm(e, t) {
  var n = Ha(e + "");
  if (arguments.length < 2) {
    for (var o = Ki(this.node()), i = -1, r = n.length; ++i < r; ) if (!o.contains(n[i])) return !1;
    return !0;
  }
  return this.each((typeof t == "function" ? dm : t ? um : cm)(n, t));
}
function hm() {
  this.textContent = "";
}
function pm(e) {
  return function() {
    this.textContent = e;
  };
}
function vm(e) {
  return function() {
    var t = e.apply(this, arguments);
    this.textContent = t ?? "";
  };
}
function gm(e) {
  return arguments.length ? this.each(e == null ? hm : (typeof e == "function" ? vm : pm)(e)) : this.node().textContent;
}
function mm() {
  this.innerHTML = "";
}
function ym(e) {
  return function() {
    this.innerHTML = e;
  };
}
function _m(e) {
  return function() {
    var t = e.apply(this, arguments);
    this.innerHTML = t ?? "";
  };
}
function wm(e) {
  return arguments.length ? this.each(e == null ? mm : (typeof e == "function" ? _m : ym)(e)) : this.node().innerHTML;
}
function bm() {
  this.nextSibling && this.parentNode.appendChild(this);
}
function xm() {
  return this.each(bm);
}
function Em() {
  this.previousSibling && this.parentNode.insertBefore(this, this.parentNode.firstChild);
}
function $m() {
  return this.each(Em);
}
function Sm(e) {
  var t = typeof e == "function" ? e : za(e);
  return this.select(function() {
    return this.appendChild(t.apply(this, arguments));
  });
}
function Nm() {
  return null;
}
function km(e, t) {
  var n = typeof e == "function" ? e : za(e), o = t == null ? Nm : typeof t == "function" ? t : Zi(t);
  return this.select(function() {
    return this.insertBefore(n.apply(this, arguments), o.apply(this, arguments) || null);
  });
}
function Cm() {
  var e = this.parentNode;
  e && e.removeChild(this);
}
function Mm() {
  return this.each(Cm);
}
function Tm() {
  var e = this.cloneNode(!1), t = this.parentNode;
  return t ? t.insertBefore(e, this.nextSibling) : e;
}
function Im() {
  var e = this.cloneNode(!0), t = this.parentNode;
  return t ? t.insertBefore(e, this.nextSibling) : e;
}
function Dm(e) {
  return this.select(e ? Im : Tm);
}
function Am(e) {
  return arguments.length ? this.property("__data__", e) : this.node().__data__;
}
function Pm(e) {
  return function(t) {
    e.call(this, t, this.__data__);
  };
}
function zm(e) {
  return e.trim().split(/^|\s+/).map(function(t) {
    var n = "", o = t.indexOf(".");
    return o >= 0 && (n = t.slice(o + 1), t = t.slice(0, o)), { type: t, name: n };
  });
}
function Om(e) {
  return function() {
    var t = this.__on;
    if (t) {
      for (var n = 0, o = -1, i = t.length, r; n < i; ++n)
        r = t[n], (!e.type || r.type === e.type) && r.name === e.name ? this.removeEventListener(r.type, r.listener, r.options) : t[++o] = r;
      ++o ? t.length = o : delete this.__on;
    }
  };
}
function Rm(e, t, n) {
  return function() {
    var o = this.__on, i, r = Pm(t);
    if (o) {
      for (var s = 0, a = o.length; s < a; ++s)
        if ((i = o[s]).type === e.type && i.name === e.name) {
          this.removeEventListener(i.type, i.listener, i.options), this.addEventListener(i.type, i.listener = r, i.options = n), i.value = t;
          return;
        }
    }
    this.addEventListener(e.type, r, n), i = { type: e.type, name: e.name, value: t, listener: r, options: n }, o ? o.push(i) : this.__on = [i];
  };
}
function Bm(e, t, n) {
  var o = zm(e + ""), i, r = o.length, s;
  if (arguments.length < 2) {
    var a = this.node().__on;
    if (a) {
      for (var l = 0, u = a.length, c; l < u; ++l)
        for (i = 0, c = a[l]; i < r; ++i)
          if ((s = o[i]).type === c.type && s.name === c.name)
            return c.value;
    }
    return;
  }
  for (a = t ? Rm : Om, i = 0; i < r; ++i) this.each(a(o[i], t, n));
  return this;
}
function Xa(e, t, n) {
  var o = La(e), i = o.CustomEvent;
  typeof i == "function" ? i = new i(t, n) : (i = o.document.createEvent("Event"), n ? (i.initEvent(t, n.bubbles, n.cancelable), i.detail = n.detail) : i.initEvent(t, !1, !1)), e.dispatchEvent(i);
}
function Vm(e, t) {
  return function() {
    return Xa(this, e, t);
  };
}
function Lm(e, t) {
  return function() {
    return Xa(this, e, t.apply(this, arguments));
  };
}
function Hm(e, t) {
  return this.each((typeof t == "function" ? Lm : Vm)(e, t));
}
function* Fm() {
  for (var e = this._groups, t = 0, n = e.length; t < n; ++t)
    for (var o = e[t], i = 0, r = o.length, s; i < r; ++i)
      (s = o[i]) && (yield s);
}
var Ga = [null];
function Ge(e, t) {
  this._groups = e, this._parents = t;
}
function An() {
  return new Ge([[document.documentElement]], Ga);
}
function Um() {
  return this;
}
Ge.prototype = An.prototype = {
  constructor: Ge,
  select: vg,
  selectAll: _g,
  selectChild: Eg,
  selectChildren: kg,
  filter: Cg,
  data: Pg,
  enter: Mg,
  exit: Og,
  join: Rg,
  merge: Bg,
  selection: Um,
  order: Vg,
  sort: Lg,
  call: Fg,
  nodes: Ug,
  node: Yg,
  size: Xg,
  empty: Gg,
  each: qg,
  attr: em,
  style: im,
  property: lm,
  classed: fm,
  text: gm,
  html: wm,
  raise: xm,
  lower: $m,
  append: Sm,
  insert: km,
  remove: Mm,
  clone: Dm,
  datum: Am,
  on: Bm,
  dispatch: Hm,
  [Symbol.iterator]: Fm
};
function Et(e) {
  return typeof e == "string" ? new Ge([[document.querySelector(e)]], [document.documentElement]) : new Ge([[e]], Ga);
}
function Ym(e) {
  let t;
  for (; t = e.sourceEvent; ) e = t;
  return e;
}
function wt(e, t) {
  if (e = Ym(e), t === void 0 && (t = e.currentTarget), t) {
    var n = t.ownerSVGElement || t;
    if (n.createSVGPoint) {
      var o = n.createSVGPoint();
      return o.x = e.clientX, o.y = e.clientY, o = o.matrixTransform(t.getScreenCTM().inverse()), [o.x, o.y];
    }
    if (t.getBoundingClientRect) {
      var i = t.getBoundingClientRect();
      return [e.clientX - i.left - t.clientLeft, e.clientY - i.top - t.clientTop];
    }
  }
  return [e.pageX, e.pageY];
}
const Si = { capture: !0, passive: !1 };
function Ni(e) {
  e.preventDefault(), e.stopImmediatePropagation();
}
function Xm(e) {
  var t = e.document.documentElement, n = Et(e).on("dragstart.drag", Ni, Si);
  "onselectstart" in t ? n.on("selectstart.drag", Ni, Si) : (t.__noselect = t.style.MozUserSelect, t.style.MozUserSelect = "none");
}
function Gm(e, t) {
  var n = e.document.documentElement, o = Et(e).on("dragstart.drag", null);
  t && (o.on("click.drag", Ni, Si), setTimeout(function() {
    o.on("click.drag", null);
  }, 0)), "onselectstart" in n ? o.on("selectstart.drag", null) : (n.style.MozUserSelect = n.__noselect, delete n.__noselect);
}
function Ji(e, t, n) {
  e.prototype = t.prototype = n, n.constructor = e;
}
function qa(e, t) {
  var n = Object.create(e.prototype);
  for (var o in t) n[o] = t[o];
  return n;
}
function Pn() {
}
var Nn = 0.7, bo = 1 / Nn, Zt = "\\s*([+-]?\\d+)\\s*", kn = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)\\s*", rt = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)%\\s*", qm = /^#([0-9a-f]{3,8})$/, Wm = new RegExp(`^rgb\\(${Zt},${Zt},${Zt}\\)$`), Zm = new RegExp(`^rgb\\(${rt},${rt},${rt}\\)$`), Km = new RegExp(`^rgba\\(${Zt},${Zt},${Zt},${kn}\\)$`), Jm = new RegExp(`^rgba\\(${rt},${rt},${rt},${kn}\\)$`), Qm = new RegExp(`^hsl\\(${kn},${rt},${rt}\\)$`), jm = new RegExp(`^hsla\\(${kn},${rt},${rt},${kn}\\)$`), Qr = {
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
Ji(Pn, Cn, {
  copy(e) {
    return Object.assign(new this.constructor(), this, e);
  },
  displayable() {
    return this.rgb().displayable();
  },
  hex: jr,
  // Deprecated! Use color.formatHex.
  formatHex: jr,
  formatHex8: ey,
  formatHsl: ty,
  formatRgb: es,
  toString: es
});
function jr() {
  return this.rgb().formatHex();
}
function ey() {
  return this.rgb().formatHex8();
}
function ty() {
  return Wa(this).formatHsl();
}
function es() {
  return this.rgb().formatRgb();
}
function Cn(e) {
  var t, n;
  return e = (e + "").trim().toLowerCase(), (t = qm.exec(e)) ? (n = t[1].length, t = parseInt(t[1], 16), n === 6 ? ts(t) : n === 3 ? new Ue(t >> 8 & 15 | t >> 4 & 240, t >> 4 & 15 | t & 240, (t & 15) << 4 | t & 15, 1) : n === 8 ? Gn(t >> 24 & 255, t >> 16 & 255, t >> 8 & 255, (t & 255) / 255) : n === 4 ? Gn(t >> 12 & 15 | t >> 8 & 240, t >> 8 & 15 | t >> 4 & 240, t >> 4 & 15 | t & 240, ((t & 15) << 4 | t & 15) / 255) : null) : (t = Wm.exec(e)) ? new Ue(t[1], t[2], t[3], 1) : (t = Zm.exec(e)) ? new Ue(t[1] * 255 / 100, t[2] * 255 / 100, t[3] * 255 / 100, 1) : (t = Km.exec(e)) ? Gn(t[1], t[2], t[3], t[4]) : (t = Jm.exec(e)) ? Gn(t[1] * 255 / 100, t[2] * 255 / 100, t[3] * 255 / 100, t[4]) : (t = Qm.exec(e)) ? is(t[1], t[2] / 100, t[3] / 100, 1) : (t = jm.exec(e)) ? is(t[1], t[2] / 100, t[3] / 100, t[4]) : Qr.hasOwnProperty(e) ? ts(Qr[e]) : e === "transparent" ? new Ue(NaN, NaN, NaN, 0) : null;
}
function ts(e) {
  return new Ue(e >> 16 & 255, e >> 8 & 255, e & 255, 1);
}
function Gn(e, t, n, o) {
  return o <= 0 && (e = t = n = NaN), new Ue(e, t, n, o);
}
function ny(e) {
  return e instanceof Pn || (e = Cn(e)), e ? (e = e.rgb(), new Ue(e.r, e.g, e.b, e.opacity)) : new Ue();
}
function ki(e, t, n, o) {
  return arguments.length === 1 ? ny(e) : new Ue(e, t, n, o ?? 1);
}
function Ue(e, t, n, o) {
  this.r = +e, this.g = +t, this.b = +n, this.opacity = +o;
}
Ji(Ue, ki, qa(Pn, {
  brighter(e) {
    return e = e == null ? bo : Math.pow(bo, e), new Ue(this.r * e, this.g * e, this.b * e, this.opacity);
  },
  darker(e) {
    return e = e == null ? Nn : Math.pow(Nn, e), new Ue(this.r * e, this.g * e, this.b * e, this.opacity);
  },
  rgb() {
    return this;
  },
  clamp() {
    return new Ue(Ot(this.r), Ot(this.g), Ot(this.b), xo(this.opacity));
  },
  displayable() {
    return -0.5 <= this.r && this.r < 255.5 && -0.5 <= this.g && this.g < 255.5 && -0.5 <= this.b && this.b < 255.5 && 0 <= this.opacity && this.opacity <= 1;
  },
  hex: ns,
  // Deprecated! Use color.formatHex.
  formatHex: ns,
  formatHex8: oy,
  formatRgb: os,
  toString: os
}));
function ns() {
  return `#${At(this.r)}${At(this.g)}${At(this.b)}`;
}
function oy() {
  return `#${At(this.r)}${At(this.g)}${At(this.b)}${At((isNaN(this.opacity) ? 1 : this.opacity) * 255)}`;
}
function os() {
  const e = xo(this.opacity);
  return `${e === 1 ? "rgb(" : "rgba("}${Ot(this.r)}, ${Ot(this.g)}, ${Ot(this.b)}${e === 1 ? ")" : `, ${e})`}`;
}
function xo(e) {
  return isNaN(e) ? 1 : Math.max(0, Math.min(1, e));
}
function Ot(e) {
  return Math.max(0, Math.min(255, Math.round(e) || 0));
}
function At(e) {
  return e = Ot(e), (e < 16 ? "0" : "") + e.toString(16);
}
function is(e, t, n, o) {
  return o <= 0 ? e = t = n = NaN : n <= 0 || n >= 1 ? e = t = NaN : t <= 0 && (e = NaN), new Ke(e, t, n, o);
}
function Wa(e) {
  if (e instanceof Ke) return new Ke(e.h, e.s, e.l, e.opacity);
  if (e instanceof Pn || (e = Cn(e)), !e) return new Ke();
  if (e instanceof Ke) return e;
  e = e.rgb();
  var t = e.r / 255, n = e.g / 255, o = e.b / 255, i = Math.min(t, n, o), r = Math.max(t, n, o), s = NaN, a = r - i, l = (r + i) / 2;
  return a ? (t === r ? s = (n - o) / a + (n < o) * 6 : n === r ? s = (o - t) / a + 2 : s = (t - n) / a + 4, a /= l < 0.5 ? r + i : 2 - r - i, s *= 60) : a = l > 0 && l < 1 ? 0 : s, new Ke(s, a, l, e.opacity);
}
function iy(e, t, n, o) {
  return arguments.length === 1 ? Wa(e) : new Ke(e, t, n, o ?? 1);
}
function Ke(e, t, n, o) {
  this.h = +e, this.s = +t, this.l = +n, this.opacity = +o;
}
Ji(Ke, iy, qa(Pn, {
  brighter(e) {
    return e = e == null ? bo : Math.pow(bo, e), new Ke(this.h, this.s, this.l * e, this.opacity);
  },
  darker(e) {
    return e = e == null ? Nn : Math.pow(Nn, e), new Ke(this.h, this.s, this.l * e, this.opacity);
  },
  rgb() {
    var e = this.h % 360 + (this.h < 0) * 360, t = isNaN(e) || isNaN(this.s) ? 0 : this.s, n = this.l, o = n + (n < 0.5 ? n : 1 - n) * t, i = 2 * n - o;
    return new Ue(
      ii(e >= 240 ? e - 240 : e + 120, i, o),
      ii(e, i, o),
      ii(e < 120 ? e + 240 : e - 120, i, o),
      this.opacity
    );
  },
  clamp() {
    return new Ke(rs(this.h), qn(this.s), qn(this.l), xo(this.opacity));
  },
  displayable() {
    return (0 <= this.s && this.s <= 1 || isNaN(this.s)) && 0 <= this.l && this.l <= 1 && 0 <= this.opacity && this.opacity <= 1;
  },
  formatHsl() {
    const e = xo(this.opacity);
    return `${e === 1 ? "hsl(" : "hsla("}${rs(this.h)}, ${qn(this.s) * 100}%, ${qn(this.l) * 100}%${e === 1 ? ")" : `, ${e})`}`;
  }
}));
function rs(e) {
  return e = (e || 0) % 360, e < 0 ? e + 360 : e;
}
function qn(e) {
  return Math.max(0, Math.min(1, e || 0));
}
function ii(e, t, n) {
  return (e < 60 ? t + (n - t) * e / 60 : e < 180 ? n : e < 240 ? t + (n - t) * (240 - e) / 60 : t) * 255;
}
const Za = (e) => () => e;
function ry(e, t) {
  return function(n) {
    return e + n * t;
  };
}
function sy(e, t, n) {
  return e = Math.pow(e, n), t = Math.pow(t, n) - e, n = 1 / n, function(o) {
    return Math.pow(e + o * t, n);
  };
}
function ay(e) {
  return (e = +e) == 1 ? Ka : function(t, n) {
    return n - t ? sy(t, n, e) : Za(isNaN(t) ? n : t);
  };
}
function Ka(e, t) {
  var n = t - e;
  return n ? ry(e, n) : Za(isNaN(e) ? t : e);
}
const ss = (function e(t) {
  var n = ay(t);
  function o(i, r) {
    var s = n((i = ki(i)).r, (r = ki(r)).r), a = n(i.g, r.g), l = n(i.b, r.b), u = Ka(i.opacity, r.opacity);
    return function(c) {
      return i.r = s(c), i.g = a(c), i.b = l(c), i.opacity = u(c), i + "";
    };
  }
  return o.gamma = e, o;
})(1);
function xt(e, t) {
  return e = +e, t = +t, function(n) {
    return e * (1 - n) + t * n;
  };
}
var Ci = /[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g, ri = new RegExp(Ci.source, "g");
function ly(e) {
  return function() {
    return e;
  };
}
function uy(e) {
  return function(t) {
    return e(t) + "";
  };
}
function cy(e, t) {
  var n = Ci.lastIndex = ri.lastIndex = 0, o, i, r, s = -1, a = [], l = [];
  for (e = e + "", t = t + ""; (o = Ci.exec(e)) && (i = ri.exec(t)); )
    (r = i.index) > n && (r = t.slice(n, r), a[s] ? a[s] += r : a[++s] = r), (o = o[0]) === (i = i[0]) ? a[s] ? a[s] += i : a[++s] = i : (a[++s] = null, l.push({ i: s, x: xt(o, i) })), n = ri.lastIndex;
  return n < t.length && (r = t.slice(n), a[s] ? a[s] += r : a[++s] = r), a.length < 2 ? l[0] ? uy(l[0].x) : ly(t) : (t = l.length, function(u) {
    for (var c = 0, d; c < t; ++c) a[(d = l[c]).i] = d.x(u);
    return a.join("");
  });
}
var as = 180 / Math.PI, Mi = {
  translateX: 0,
  translateY: 0,
  rotate: 0,
  skewX: 0,
  scaleX: 1,
  scaleY: 1
};
function Ja(e, t, n, o, i, r) {
  var s, a, l;
  return (s = Math.sqrt(e * e + t * t)) && (e /= s, t /= s), (l = e * n + t * o) && (n -= e * l, o -= t * l), (a = Math.sqrt(n * n + o * o)) && (n /= a, o /= a, l /= a), e * o < t * n && (e = -e, t = -t, l = -l, s = -s), {
    translateX: i,
    translateY: r,
    rotate: Math.atan2(t, e) * as,
    skewX: Math.atan(l) * as,
    scaleX: s,
    scaleY: a
  };
}
var Wn;
function dy(e) {
  const t = new (typeof DOMMatrix == "function" ? DOMMatrix : WebKitCSSMatrix)(e + "");
  return t.isIdentity ? Mi : Ja(t.a, t.b, t.c, t.d, t.e, t.f);
}
function fy(e) {
  return e == null || (Wn || (Wn = document.createElementNS("http://www.w3.org/2000/svg", "g")), Wn.setAttribute("transform", e), !(e = Wn.transform.baseVal.consolidate())) ? Mi : (e = e.matrix, Ja(e.a, e.b, e.c, e.d, e.e, e.f));
}
function Qa(e, t, n, o) {
  function i(u) {
    return u.length ? u.pop() + " " : "";
  }
  function r(u, c, d, h, p, E) {
    if (u !== d || c !== h) {
      var b = p.push("translate(", null, t, null, n);
      E.push({ i: b - 4, x: xt(u, d) }, { i: b - 2, x: xt(c, h) });
    } else (d || h) && p.push("translate(" + d + t + h + n);
  }
  function s(u, c, d, h) {
    u !== c ? (u - c > 180 ? c += 360 : c - u > 180 && (u += 360), h.push({ i: d.push(i(d) + "rotate(", null, o) - 2, x: xt(u, c) })) : c && d.push(i(d) + "rotate(" + c + o);
  }
  function a(u, c, d, h) {
    u !== c ? h.push({ i: d.push(i(d) + "skewX(", null, o) - 2, x: xt(u, c) }) : c && d.push(i(d) + "skewX(" + c + o);
  }
  function l(u, c, d, h, p, E) {
    if (u !== d || c !== h) {
      var b = p.push(i(p) + "scale(", null, ",", null, ")");
      E.push({ i: b - 4, x: xt(u, d) }, { i: b - 2, x: xt(c, h) });
    } else (d !== 1 || h !== 1) && p.push(i(p) + "scale(" + d + "," + h + ")");
  }
  return function(u, c) {
    var d = [], h = [];
    return u = e(u), c = e(c), r(u.translateX, u.translateY, c.translateX, c.translateY, d, h), s(u.rotate, c.rotate, d, h), a(u.skewX, c.skewX, d, h), l(u.scaleX, u.scaleY, c.scaleX, c.scaleY, d, h), u = c = null, function(p) {
      for (var E = -1, b = h.length, S; ++E < b; ) d[(S = h[E]).i] = S.x(p);
      return d.join("");
    };
  };
}
var hy = Qa(dy, "px, ", "px)", "deg)"), py = Qa(fy, ", ", ")", ")"), vy = 1e-12;
function ls(e) {
  return ((e = Math.exp(e)) + 1 / e) / 2;
}
function gy(e) {
  return ((e = Math.exp(e)) - 1 / e) / 2;
}
function my(e) {
  return ((e = Math.exp(2 * e)) - 1) / (e + 1);
}
const yy = (function e(t, n, o) {
  function i(r, s) {
    var a = r[0], l = r[1], u = r[2], c = s[0], d = s[1], h = s[2], p = c - a, E = d - l, b = p * p + E * E, S, _;
    if (b < vy)
      _ = Math.log(h / u) / t, S = function(L) {
        return [
          a + L * p,
          l + L * E,
          u * Math.exp(t * L * _)
        ];
      };
    else {
      var P = Math.sqrt(b), y = (h * h - u * u + o * b) / (2 * u * n * P), $ = (h * h - u * u - o * b) / (2 * h * n * P), R = Math.log(Math.sqrt(y * y + 1) - y), U = Math.log(Math.sqrt($ * $ + 1) - $);
      _ = (U - R) / t, S = function(L) {
        var Y = L * _, ie = ls(R), H = u / (n * P) * (ie * my(t * Y + R) - gy(R));
        return [
          a + H * p,
          l + H * E,
          u * ie / ls(t * Y + R)
        ];
      };
    }
    return S.duration = _ * 1e3 * t / Math.SQRT2, S;
  }
  return i.rho = function(r) {
    var s = Math.max(1e-3, +r), a = s * s, l = a * a;
    return e(s, a, l);
  }, i;
})(Math.SQRT2, 2, 4);
var nn = 0, fn = 0, an = 0, ja = 1e3, Eo, hn, $o = 0, Ht = 0, Vo = 0, Mn = typeof performance == "object" && performance.now ? performance : Date, el = typeof window == "object" && window.requestAnimationFrame ? window.requestAnimationFrame.bind(window) : function(e) {
  setTimeout(e, 17);
};
function Qi() {
  return Ht || (el(_y), Ht = Mn.now() + Vo);
}
function _y() {
  Ht = 0;
}
function So() {
  this._call = this._time = this._next = null;
}
So.prototype = tl.prototype = {
  constructor: So,
  restart: function(e, t, n) {
    if (typeof e != "function") throw new TypeError("callback is not a function");
    n = (n == null ? Qi() : +n) + (t == null ? 0 : +t), !this._next && hn !== this && (hn ? hn._next = this : Eo = this, hn = this), this._call = e, this._time = n, Ti();
  },
  stop: function() {
    this._call && (this._call = null, this._time = 1 / 0, Ti());
  }
};
function tl(e, t, n) {
  var o = new So();
  return o.restart(e, t, n), o;
}
function wy() {
  Qi(), ++nn;
  for (var e = Eo, t; e; )
    (t = Ht - e._time) >= 0 && e._call.call(void 0, t), e = e._next;
  --nn;
}
function us() {
  Ht = ($o = Mn.now()) + Vo, nn = fn = 0;
  try {
    wy();
  } finally {
    nn = 0, xy(), Ht = 0;
  }
}
function by() {
  var e = Mn.now(), t = e - $o;
  t > ja && (Vo -= t, $o = e);
}
function xy() {
  for (var e, t = Eo, n, o = 1 / 0; t; )
    t._call ? (o > t._time && (o = t._time), e = t, t = t._next) : (n = t._next, t._next = null, t = e ? e._next = n : Eo = n);
  hn = e, Ti(o);
}
function Ti(e) {
  if (!nn) {
    fn && (fn = clearTimeout(fn));
    var t = e - Ht;
    t > 24 ? (e < 1 / 0 && (fn = setTimeout(us, e - Mn.now() - Vo)), an && (an = clearInterval(an))) : (an || ($o = Mn.now(), an = setInterval(by, ja)), nn = 1, el(us));
  }
}
function cs(e, t, n) {
  var o = new So();
  return t = t == null ? 0 : +t, o.restart((i) => {
    o.stop(), e(i + t);
  }, t, n), o;
}
var Ey = Wi("start", "end", "cancel", "interrupt"), $y = [], nl = 0, ds = 1, Ii = 2, io = 3, fs = 4, Di = 5, ro = 6;
function Lo(e, t, n, o, i, r) {
  var s = e.__transition;
  if (!s) e.__transition = {};
  else if (n in s) return;
  Sy(e, n, {
    name: t,
    index: o,
    // For context during callback.
    group: i,
    // For context during callback.
    on: Ey,
    tween: $y,
    time: r.time,
    delay: r.delay,
    duration: r.duration,
    ease: r.ease,
    timer: null,
    state: nl
  });
}
function ji(e, t) {
  var n = Qe(e, t);
  if (n.state > nl) throw new Error("too late; already scheduled");
  return n;
}
function lt(e, t) {
  var n = Qe(e, t);
  if (n.state > io) throw new Error("too late; already running");
  return n;
}
function Qe(e, t) {
  var n = e.__transition;
  if (!n || !(n = n[t])) throw new Error("transition not found");
  return n;
}
function Sy(e, t, n) {
  var o = e.__transition, i;
  o[t] = n, n.timer = tl(r, 0, n.time);
  function r(u) {
    n.state = ds, n.timer.restart(s, n.delay, n.time), n.delay <= u && s(u - n.delay);
  }
  function s(u) {
    var c, d, h, p;
    if (n.state !== ds) return l();
    for (c in o)
      if (p = o[c], p.name === n.name) {
        if (p.state === io) return cs(s);
        p.state === fs ? (p.state = ro, p.timer.stop(), p.on.call("interrupt", e, e.__data__, p.index, p.group), delete o[c]) : +c < t && (p.state = ro, p.timer.stop(), p.on.call("cancel", e, e.__data__, p.index, p.group), delete o[c]);
      }
    if (cs(function() {
      n.state === io && (n.state = fs, n.timer.restart(a, n.delay, n.time), a(u));
    }), n.state = Ii, n.on.call("start", e, e.__data__, n.index, n.group), n.state === Ii) {
      for (n.state = io, i = new Array(h = n.tween.length), c = 0, d = -1; c < h; ++c)
        (p = n.tween[c].value.call(e, e.__data__, n.index, n.group)) && (i[++d] = p);
      i.length = d + 1;
    }
  }
  function a(u) {
    for (var c = u < n.duration ? n.ease.call(null, u / n.duration) : (n.timer.restart(l), n.state = Di, 1), d = -1, h = i.length; ++d < h; )
      i[d].call(e, c);
    n.state === Di && (n.on.call("end", e, e.__data__, n.index, n.group), l());
  }
  function l() {
    n.state = ro, n.timer.stop(), delete o[t];
    for (var u in o) return;
    delete e.__transition;
  }
}
function so(e, t) {
  var n = e.__transition, o, i, r = !0, s;
  if (n) {
    t = t == null ? null : t + "";
    for (s in n) {
      if ((o = n[s]).name !== t) {
        r = !1;
        continue;
      }
      i = o.state > Ii && o.state < Di, o.state = ro, o.timer.stop(), o.on.call(i ? "interrupt" : "cancel", e, e.__data__, o.index, o.group), delete n[s];
    }
    r && delete e.__transition;
  }
}
function Ny(e) {
  return this.each(function() {
    so(this, e);
  });
}
function ky(e, t) {
  var n, o;
  return function() {
    var i = lt(this, e), r = i.tween;
    if (r !== n) {
      o = n = r;
      for (var s = 0, a = o.length; s < a; ++s)
        if (o[s].name === t) {
          o = o.slice(), o.splice(s, 1);
          break;
        }
    }
    i.tween = o;
  };
}
function Cy(e, t, n) {
  var o, i;
  if (typeof n != "function") throw new Error();
  return function() {
    var r = lt(this, e), s = r.tween;
    if (s !== o) {
      i = (o = s).slice();
      for (var a = { name: t, value: n }, l = 0, u = i.length; l < u; ++l)
        if (i[l].name === t) {
          i[l] = a;
          break;
        }
      l === u && i.push(a);
    }
    r.tween = i;
  };
}
function My(e, t) {
  var n = this._id;
  if (e += "", arguments.length < 2) {
    for (var o = Qe(this.node(), n).tween, i = 0, r = o.length, s; i < r; ++i)
      if ((s = o[i]).name === e)
        return s.value;
    return null;
  }
  return this.each((t == null ? ky : Cy)(n, e, t));
}
function er(e, t, n) {
  var o = e._id;
  return e.each(function() {
    var i = lt(this, o);
    (i.value || (i.value = {}))[t] = n.apply(this, arguments);
  }), function(i) {
    return Qe(i, o).value[t];
  };
}
function ol(e, t) {
  var n;
  return (typeof t == "number" ? xt : t instanceof Cn ? ss : (n = Cn(t)) ? (t = n, ss) : cy)(e, t);
}
function Ty(e) {
  return function() {
    this.removeAttribute(e);
  };
}
function Iy(e) {
  return function() {
    this.removeAttributeNS(e.space, e.local);
  };
}
function Dy(e, t, n) {
  var o, i = n + "", r;
  return function() {
    var s = this.getAttribute(e);
    return s === i ? null : s === o ? r : r = t(o = s, n);
  };
}
function Ay(e, t, n) {
  var o, i = n + "", r;
  return function() {
    var s = this.getAttributeNS(e.space, e.local);
    return s === i ? null : s === o ? r : r = t(o = s, n);
  };
}
function Py(e, t, n) {
  var o, i, r;
  return function() {
    var s, a = n(this), l;
    return a == null ? void this.removeAttribute(e) : (s = this.getAttribute(e), l = a + "", s === l ? null : s === o && l === i ? r : (i = l, r = t(o = s, a)));
  };
}
function zy(e, t, n) {
  var o, i, r;
  return function() {
    var s, a = n(this), l;
    return a == null ? void this.removeAttributeNS(e.space, e.local) : (s = this.getAttributeNS(e.space, e.local), l = a + "", s === l ? null : s === o && l === i ? r : (i = l, r = t(o = s, a)));
  };
}
function Oy(e, t) {
  var n = Bo(e), o = n === "transform" ? py : ol;
  return this.attrTween(e, typeof t == "function" ? (n.local ? zy : Py)(n, o, er(this, "attr." + e, t)) : t == null ? (n.local ? Iy : Ty)(n) : (n.local ? Ay : Dy)(n, o, t));
}
function Ry(e, t) {
  return function(n) {
    this.setAttribute(e, t.call(this, n));
  };
}
function By(e, t) {
  return function(n) {
    this.setAttributeNS(e.space, e.local, t.call(this, n));
  };
}
function Vy(e, t) {
  var n, o;
  function i() {
    var r = t.apply(this, arguments);
    return r !== o && (n = (o = r) && By(e, r)), n;
  }
  return i._value = t, i;
}
function Ly(e, t) {
  var n, o;
  function i() {
    var r = t.apply(this, arguments);
    return r !== o && (n = (o = r) && Ry(e, r)), n;
  }
  return i._value = t, i;
}
function Hy(e, t) {
  var n = "attr." + e;
  if (arguments.length < 2) return (n = this.tween(n)) && n._value;
  if (t == null) return this.tween(n, null);
  if (typeof t != "function") throw new Error();
  var o = Bo(e);
  return this.tween(n, (o.local ? Vy : Ly)(o, t));
}
function Fy(e, t) {
  return function() {
    ji(this, e).delay = +t.apply(this, arguments);
  };
}
function Uy(e, t) {
  return t = +t, function() {
    ji(this, e).delay = t;
  };
}
function Yy(e) {
  var t = this._id;
  return arguments.length ? this.each((typeof e == "function" ? Fy : Uy)(t, e)) : Qe(this.node(), t).delay;
}
function Xy(e, t) {
  return function() {
    lt(this, e).duration = +t.apply(this, arguments);
  };
}
function Gy(e, t) {
  return t = +t, function() {
    lt(this, e).duration = t;
  };
}
function qy(e) {
  var t = this._id;
  return arguments.length ? this.each((typeof e == "function" ? Xy : Gy)(t, e)) : Qe(this.node(), t).duration;
}
function Wy(e, t) {
  if (typeof t != "function") throw new Error();
  return function() {
    lt(this, e).ease = t;
  };
}
function Zy(e) {
  var t = this._id;
  return arguments.length ? this.each(Wy(t, e)) : Qe(this.node(), t).ease;
}
function Ky(e, t) {
  return function() {
    var n = t.apply(this, arguments);
    if (typeof n != "function") throw new Error();
    lt(this, e).ease = n;
  };
}
function Jy(e) {
  if (typeof e != "function") throw new Error();
  return this.each(Ky(this._id, e));
}
function Qy(e) {
  typeof e != "function" && (e = Ra(e));
  for (var t = this._groups, n = t.length, o = new Array(n), i = 0; i < n; ++i)
    for (var r = t[i], s = r.length, a = o[i] = [], l, u = 0; u < s; ++u)
      (l = r[u]) && e.call(l, l.__data__, u, r) && a.push(l);
  return new gt(o, this._parents, this._name, this._id);
}
function jy(e) {
  if (e._id !== this._id) throw new Error();
  for (var t = this._groups, n = e._groups, o = t.length, i = n.length, r = Math.min(o, i), s = new Array(o), a = 0; a < r; ++a)
    for (var l = t[a], u = n[a], c = l.length, d = s[a] = new Array(c), h, p = 0; p < c; ++p)
      (h = l[p] || u[p]) && (d[p] = h);
  for (; a < o; ++a)
    s[a] = t[a];
  return new gt(s, this._parents, this._name, this._id);
}
function e_(e) {
  return (e + "").trim().split(/^|\s+/).every(function(t) {
    var n = t.indexOf(".");
    return n >= 0 && (t = t.slice(0, n)), !t || t === "start";
  });
}
function t_(e, t, n) {
  var o, i, r = e_(t) ? ji : lt;
  return function() {
    var s = r(this, e), a = s.on;
    a !== o && (i = (o = a).copy()).on(t, n), s.on = i;
  };
}
function n_(e, t) {
  var n = this._id;
  return arguments.length < 2 ? Qe(this.node(), n).on.on(e) : this.each(t_(n, e, t));
}
function o_(e) {
  return function() {
    var t = this.parentNode;
    for (var n in this.__transition) if (+n !== e) return;
    t && t.removeChild(this);
  };
}
function i_() {
  return this.on("end.remove", o_(this._id));
}
function r_(e) {
  var t = this._name, n = this._id;
  typeof e != "function" && (e = Zi(e));
  for (var o = this._groups, i = o.length, r = new Array(i), s = 0; s < i; ++s)
    for (var a = o[s], l = a.length, u = r[s] = new Array(l), c, d, h = 0; h < l; ++h)
      (c = a[h]) && (d = e.call(c, c.__data__, h, a)) && ("__data__" in c && (d.__data__ = c.__data__), u[h] = d, Lo(u[h], t, n, h, u, Qe(c, n)));
  return new gt(r, this._parents, t, n);
}
function s_(e) {
  var t = this._name, n = this._id;
  typeof e != "function" && (e = Oa(e));
  for (var o = this._groups, i = o.length, r = [], s = [], a = 0; a < i; ++a)
    for (var l = o[a], u = l.length, c, d = 0; d < u; ++d)
      if (c = l[d]) {
        for (var h = e.call(c, c.__data__, d, l), p, E = Qe(c, n), b = 0, S = h.length; b < S; ++b)
          (p = h[b]) && Lo(p, t, n, b, h, E);
        r.push(h), s.push(c);
      }
  return new gt(r, s, t, n);
}
var a_ = An.prototype.constructor;
function l_() {
  return new a_(this._groups, this._parents);
}
function u_(e, t) {
  var n, o, i;
  return function() {
    var r = tn(this, e), s = (this.style.removeProperty(e), tn(this, e));
    return r === s ? null : r === n && s === o ? i : i = t(n = r, o = s);
  };
}
function il(e) {
  return function() {
    this.style.removeProperty(e);
  };
}
function c_(e, t, n) {
  var o, i = n + "", r;
  return function() {
    var s = tn(this, e);
    return s === i ? null : s === o ? r : r = t(o = s, n);
  };
}
function d_(e, t, n) {
  var o, i, r;
  return function() {
    var s = tn(this, e), a = n(this), l = a + "";
    return a == null && (l = a = (this.style.removeProperty(e), tn(this, e))), s === l ? null : s === o && l === i ? r : (i = l, r = t(o = s, a));
  };
}
function f_(e, t) {
  var n, o, i, r = "style." + t, s = "end." + r, a;
  return function() {
    var l = lt(this, e), u = l.on, c = l.value[r] == null ? a || (a = il(t)) : void 0;
    (u !== n || i !== c) && (o = (n = u).copy()).on(s, i = c), l.on = o;
  };
}
function h_(e, t, n) {
  var o = (e += "") == "transform" ? hy : ol;
  return t == null ? this.styleTween(e, u_(e, o)).on("end.style." + e, il(e)) : typeof t == "function" ? this.styleTween(e, d_(e, o, er(this, "style." + e, t))).each(f_(this._id, e)) : this.styleTween(e, c_(e, o, t), n).on("end.style." + e, null);
}
function p_(e, t, n) {
  return function(o) {
    this.style.setProperty(e, t.call(this, o), n);
  };
}
function v_(e, t, n) {
  var o, i;
  function r() {
    var s = t.apply(this, arguments);
    return s !== i && (o = (i = s) && p_(e, s, n)), o;
  }
  return r._value = t, r;
}
function g_(e, t, n) {
  var o = "style." + (e += "");
  if (arguments.length < 2) return (o = this.tween(o)) && o._value;
  if (t == null) return this.tween(o, null);
  if (typeof t != "function") throw new Error();
  return this.tween(o, v_(e, t, n ?? ""));
}
function m_(e) {
  return function() {
    this.textContent = e;
  };
}
function y_(e) {
  return function() {
    var t = e(this);
    this.textContent = t ?? "";
  };
}
function __(e) {
  return this.tween("text", typeof e == "function" ? y_(er(this, "text", e)) : m_(e == null ? "" : e + ""));
}
function w_(e) {
  return function(t) {
    this.textContent = e.call(this, t);
  };
}
function b_(e) {
  var t, n;
  function o() {
    var i = e.apply(this, arguments);
    return i !== n && (t = (n = i) && w_(i)), t;
  }
  return o._value = e, o;
}
function x_(e) {
  var t = "text";
  if (arguments.length < 1) return (t = this.tween(t)) && t._value;
  if (e == null) return this.tween(t, null);
  if (typeof e != "function") throw new Error();
  return this.tween(t, b_(e));
}
function E_() {
  for (var e = this._name, t = this._id, n = rl(), o = this._groups, i = o.length, r = 0; r < i; ++r)
    for (var s = o[r], a = s.length, l, u = 0; u < a; ++u)
      if (l = s[u]) {
        var c = Qe(l, t);
        Lo(l, e, n, u, s, {
          time: c.time + c.delay + c.duration,
          delay: 0,
          duration: c.duration,
          ease: c.ease
        });
      }
  return new gt(o, this._parents, e, n);
}
function $_() {
  var e, t, n = this, o = n._id, i = n.size();
  return new Promise(function(r, s) {
    var a = { value: s }, l = { value: function() {
      --i === 0 && r();
    } };
    n.each(function() {
      var u = lt(this, o), c = u.on;
      c !== e && (t = (e = c).copy(), t._.cancel.push(a), t._.interrupt.push(a), t._.end.push(l)), u.on = t;
    }), i === 0 && r();
  });
}
var S_ = 0;
function gt(e, t, n, o) {
  this._groups = e, this._parents = t, this._name = n, this._id = o;
}
function rl() {
  return ++S_;
}
var ct = An.prototype;
gt.prototype = {
  constructor: gt,
  select: r_,
  selectAll: s_,
  selectChild: ct.selectChild,
  selectChildren: ct.selectChildren,
  filter: Qy,
  merge: jy,
  selection: l_,
  transition: E_,
  call: ct.call,
  nodes: ct.nodes,
  node: ct.node,
  size: ct.size,
  empty: ct.empty,
  each: ct.each,
  on: n_,
  attr: Oy,
  attrTween: Hy,
  style: h_,
  styleTween: g_,
  text: __,
  textTween: x_,
  remove: i_,
  tween: My,
  delay: Yy,
  duration: qy,
  ease: Zy,
  easeVarying: Jy,
  end: $_,
  [Symbol.iterator]: ct[Symbol.iterator]
};
function N_(e) {
  return ((e *= 2) <= 1 ? e * e * e : (e -= 2) * e * e + 2) / 2;
}
var k_ = {
  time: null,
  // Set on use.
  delay: 0,
  duration: 250,
  ease: N_
};
function C_(e, t) {
  for (var n; !(n = e.__transition) || !(n = n[t]); )
    if (!(e = e.parentNode))
      throw new Error(`transition ${t} not found`);
  return n;
}
function M_(e) {
  var t, n;
  e instanceof gt ? (t = e._id, e = e._name) : (t = rl(), (n = k_).time = Qi(), e = e == null ? null : e + "");
  for (var o = this._groups, i = o.length, r = 0; r < i; ++r)
    for (var s = o[r], a = s.length, l, u = 0; u < a; ++u)
      (l = s[u]) && Lo(l, e, t, u, s, n || C_(l, t));
  return new gt(o, this._parents, e, t);
}
An.prototype.interrupt = Ny;
An.prototype.transition = M_;
const Zn = (e) => () => e;
function T_(e, {
  sourceEvent: t,
  target: n,
  transform: o,
  dispatch: i
}) {
  Object.defineProperties(this, {
    type: { value: e, enumerable: !0, configurable: !0 },
    sourceEvent: { value: t, enumerable: !0, configurable: !0 },
    target: { value: n, enumerable: !0, configurable: !0 },
    transform: { value: o, enumerable: !0, configurable: !0 },
    _: { value: i }
  });
}
function pt(e, t, n) {
  this.k = e, this.x = t, this.y = n;
}
pt.prototype = {
  constructor: pt,
  scale: function(e) {
    return e === 1 ? this : new pt(this.k * e, this.x, this.y);
  },
  translate: function(e, t) {
    return e === 0 & t === 0 ? this : new pt(this.k, this.x + this.k * e, this.y + this.k * t);
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
var tr = new pt(1, 0, 0);
pt.prototype;
function si(e) {
  e.stopImmediatePropagation();
}
function ln(e) {
  e.preventDefault(), e.stopImmediatePropagation();
}
function I_(e) {
  return (!e.ctrlKey || e.type === "wheel") && !e.button;
}
function D_() {
  var e = this;
  return e instanceof SVGElement ? (e = e.ownerSVGElement || e, e.hasAttribute("viewBox") ? (e = e.viewBox.baseVal, [[e.x, e.y], [e.x + e.width, e.y + e.height]]) : [[0, 0], [e.width.baseVal.value, e.height.baseVal.value]]) : [[0, 0], [e.clientWidth, e.clientHeight]];
}
function hs() {
  return this.__zoom || tr;
}
function A_(e) {
  return -e.deltaY * (e.deltaMode === 1 ? 0.05 : e.deltaMode ? 1 : 2e-3) * (e.ctrlKey ? 10 : 1);
}
function P_() {
  return navigator.maxTouchPoints || "ontouchstart" in this;
}
function z_(e, t, n) {
  var o = e.invertX(t[0][0]) - n[0][0], i = e.invertX(t[1][0]) - n[1][0], r = e.invertY(t[0][1]) - n[0][1], s = e.invertY(t[1][1]) - n[1][1];
  return e.translate(
    i > o ? (o + i) / 2 : Math.min(0, o) || Math.max(0, i),
    s > r ? (r + s) / 2 : Math.min(0, r) || Math.max(0, s)
  );
}
function O_() {
  var e = I_, t = D_, n = z_, o = A_, i = P_, r = [0, 1 / 0], s = [[-1 / 0, -1 / 0], [1 / 0, 1 / 0]], a = 250, l = yy, u = Wi("start", "zoom", "end"), c, d, h, p = 500, E = 150, b = 0, S = 10;
  function _(f) {
    f.property("__zoom", hs).on("wheel.zoom", Y, { passive: !1 }).on("mousedown.zoom", ie).on("dblclick.zoom", H).filter(i).on("touchstart.zoom", X).on("touchmove.zoom", C).on("touchend.zoom touchcancel.zoom", oe).style("-webkit-tap-highlight-color", "rgba(0,0,0,0)");
  }
  _.transform = function(f, N, v, I) {
    var k = f.selection ? f.selection() : f;
    k.property("__zoom", hs), f !== k ? R(f, N, v, I) : k.interrupt().each(function() {
      U(this, arguments).event(I).start().zoom(null, typeof N == "function" ? N.apply(this, arguments) : N).end();
    });
  }, _.scaleBy = function(f, N, v, I) {
    _.scaleTo(f, function() {
      var k = this.__zoom.k, z = typeof N == "function" ? N.apply(this, arguments) : N;
      return k * z;
    }, v, I);
  }, _.scaleTo = function(f, N, v, I) {
    _.transform(f, function() {
      var k = t.apply(this, arguments), z = this.__zoom, T = v == null ? $(k) : typeof v == "function" ? v.apply(this, arguments) : v, B = z.invert(T), q = typeof N == "function" ? N.apply(this, arguments) : N;
      return n(y(P(z, q), T, B), k, s);
    }, v, I);
  }, _.translateBy = function(f, N, v, I) {
    _.transform(f, function() {
      return n(this.__zoom.translate(
        typeof N == "function" ? N.apply(this, arguments) : N,
        typeof v == "function" ? v.apply(this, arguments) : v
      ), t.apply(this, arguments), s);
    }, null, I);
  }, _.translateTo = function(f, N, v, I, k) {
    _.transform(f, function() {
      var z = t.apply(this, arguments), T = this.__zoom, B = I == null ? $(z) : typeof I == "function" ? I.apply(this, arguments) : I;
      return n(tr.translate(B[0], B[1]).scale(T.k).translate(
        typeof N == "function" ? -N.apply(this, arguments) : -N,
        typeof v == "function" ? -v.apply(this, arguments) : -v
      ), z, s);
    }, I, k);
  };
  function P(f, N) {
    return N = Math.max(r[0], Math.min(r[1], N)), N === f.k ? f : new pt(N, f.x, f.y);
  }
  function y(f, N, v) {
    var I = N[0] - v[0] * f.k, k = N[1] - v[1] * f.k;
    return I === f.x && k === f.y ? f : new pt(f.k, I, k);
  }
  function $(f) {
    return [(+f[0][0] + +f[1][0]) / 2, (+f[0][1] + +f[1][1]) / 2];
  }
  function R(f, N, v, I) {
    f.on("start.zoom", function() {
      U(this, arguments).event(I).start();
    }).on("interrupt.zoom end.zoom", function() {
      U(this, arguments).event(I).end();
    }).tween("zoom", function() {
      var k = this, z = arguments, T = U(k, z).event(I), B = t.apply(k, z), q = v == null ? $(B) : typeof v == "function" ? v.apply(k, z) : v, j = Math.max(B[1][0] - B[0][0], B[1][1] - B[0][1]), re = k.__zoom, G = typeof N == "function" ? N.apply(k, z) : N, F = l(re.invert(q).concat(j / re.k), G.invert(q).concat(j / G.k));
      return function(ee) {
        if (ee === 1) ee = G;
        else {
          var he = F(ee), ve = j / he[2];
          ee = new pt(ve, q[0] - he[0] * ve, q[1] - he[1] * ve);
        }
        T.zoom(null, ee);
      };
    });
  }
  function U(f, N, v) {
    return !v && f.__zooming || new L(f, N);
  }
  function L(f, N) {
    this.that = f, this.args = N, this.active = 0, this.sourceEvent = null, this.extent = t.apply(f, N), this.taps = 0;
  }
  L.prototype = {
    event: function(f) {
      return f && (this.sourceEvent = f), this;
    },
    start: function() {
      return ++this.active === 1 && (this.that.__zooming = this, this.emit("start")), this;
    },
    zoom: function(f, N) {
      return this.mouse && f !== "mouse" && (this.mouse[1] = N.invert(this.mouse[0])), this.touch0 && f !== "touch" && (this.touch0[1] = N.invert(this.touch0[0])), this.touch1 && f !== "touch" && (this.touch1[1] = N.invert(this.touch1[0])), this.that.__zoom = N, this.emit("zoom"), this;
    },
    end: function() {
      return --this.active === 0 && (delete this.that.__zooming, this.emit("end")), this;
    },
    emit: function(f) {
      var N = Et(this.that).datum();
      u.call(
        f,
        this.that,
        new T_(f, {
          sourceEvent: this.sourceEvent,
          target: _,
          transform: this.that.__zoom,
          dispatch: u
        }),
        N
      );
    }
  };
  function Y(f, ...N) {
    if (!e.apply(this, arguments)) return;
    var v = U(this, N).event(f), I = this.__zoom, k = Math.max(r[0], Math.min(r[1], I.k * Math.pow(2, o.apply(this, arguments)))), z = wt(f);
    if (v.wheel)
      (v.mouse[0][0] !== z[0] || v.mouse[0][1] !== z[1]) && (v.mouse[1] = I.invert(v.mouse[0] = z)), clearTimeout(v.wheel);
    else {
      if (I.k === k) return;
      v.mouse = [z, I.invert(z)], so(this), v.start();
    }
    ln(f), v.wheel = setTimeout(T, E), v.zoom("mouse", n(y(P(I, k), v.mouse[0], v.mouse[1]), v.extent, s));
    function T() {
      v.wheel = null, v.end();
    }
  }
  function ie(f, ...N) {
    if (h || !e.apply(this, arguments)) return;
    var v = f.currentTarget, I = U(this, N, !0).event(f), k = Et(f.view).on("mousemove.zoom", q, !0).on("mouseup.zoom", j, !0), z = wt(f, v), T = f.clientX, B = f.clientY;
    Xm(f.view), si(f), I.mouse = [z, this.__zoom.invert(z)], so(this), I.start();
    function q(re) {
      if (ln(re), !I.moved) {
        var G = re.clientX - T, F = re.clientY - B;
        I.moved = G * G + F * F > b;
      }
      I.event(re).zoom("mouse", n(y(I.that.__zoom, I.mouse[0] = wt(re, v), I.mouse[1]), I.extent, s));
    }
    function j(re) {
      k.on("mousemove.zoom mouseup.zoom", null), Gm(re.view, I.moved), ln(re), I.event(re).end();
    }
  }
  function H(f, ...N) {
    if (e.apply(this, arguments)) {
      var v = this.__zoom, I = wt(f.changedTouches ? f.changedTouches[0] : f, this), k = v.invert(I), z = v.k * (f.shiftKey ? 0.5 : 2), T = n(y(P(v, z), I, k), t.apply(this, N), s);
      ln(f), a > 0 ? Et(this).transition().duration(a).call(R, T, I, f) : Et(this).call(_.transform, T, I, f);
    }
  }
  function X(f, ...N) {
    if (e.apply(this, arguments)) {
      var v = f.touches, I = v.length, k = U(this, N, f.changedTouches.length === I).event(f), z, T, B, q;
      for (si(f), T = 0; T < I; ++T)
        B = v[T], q = wt(B, this), q = [q, this.__zoom.invert(q), B.identifier], k.touch0 ? !k.touch1 && k.touch0[2] !== q[2] && (k.touch1 = q, k.taps = 0) : (k.touch0 = q, z = !0, k.taps = 1 + !!c);
      c && (c = clearTimeout(c)), z && (k.taps < 2 && (d = q[0], c = setTimeout(function() {
        c = null;
      }, p)), so(this), k.start());
    }
  }
  function C(f, ...N) {
    if (this.__zooming) {
      var v = U(this, N).event(f), I = f.changedTouches, k = I.length, z, T, B, q;
      for (ln(f), z = 0; z < k; ++z)
        T = I[z], B = wt(T, this), v.touch0 && v.touch0[2] === T.identifier ? v.touch0[0] = B : v.touch1 && v.touch1[2] === T.identifier && (v.touch1[0] = B);
      if (T = v.that.__zoom, v.touch1) {
        var j = v.touch0[0], re = v.touch0[1], G = v.touch1[0], F = v.touch1[1], ee = (ee = G[0] - j[0]) * ee + (ee = G[1] - j[1]) * ee, he = (he = F[0] - re[0]) * he + (he = F[1] - re[1]) * he;
        T = P(T, Math.sqrt(ee / he)), B = [(j[0] + G[0]) / 2, (j[1] + G[1]) / 2], q = [(re[0] + F[0]) / 2, (re[1] + F[1]) / 2];
      } else if (v.touch0) B = v.touch0[0], q = v.touch0[1];
      else return;
      v.zoom("touch", n(y(T, B, q), v.extent, s));
    }
  }
  function oe(f, ...N) {
    if (this.__zooming) {
      var v = U(this, N).event(f), I = f.changedTouches, k = I.length, z, T;
      for (si(f), h && clearTimeout(h), h = setTimeout(function() {
        h = null;
      }, p), z = 0; z < k; ++z)
        T = I[z], v.touch0 && v.touch0[2] === T.identifier ? delete v.touch0 : v.touch1 && v.touch1[2] === T.identifier && delete v.touch1;
      if (v.touch1 && !v.touch0 && (v.touch0 = v.touch1, delete v.touch1), v.touch0) v.touch0[1] = this.__zoom.invert(v.touch0[0]);
      else if (v.end(), v.taps === 2 && (T = wt(T, this), Math.hypot(d[0] - T[0], d[1] - T[1]) < S)) {
        var B = Et(this).on("dblclick.zoom");
        B && B.apply(this, arguments);
      }
    }
  }
  return _.wheelDelta = function(f) {
    return arguments.length ? (o = typeof f == "function" ? f : Zn(+f), _) : o;
  }, _.filter = function(f) {
    return arguments.length ? (e = typeof f == "function" ? f : Zn(!!f), _) : e;
  }, _.touchable = function(f) {
    return arguments.length ? (i = typeof f == "function" ? f : Zn(!!f), _) : i;
  }, _.extent = function(f) {
    return arguments.length ? (t = typeof f == "function" ? f : Zn([[+f[0][0], +f[0][1]], [+f[1][0], +f[1][1]]]), _) : t;
  }, _.scaleExtent = function(f) {
    return arguments.length ? (r[0] = +f[0], r[1] = +f[1], _) : [r[0], r[1]];
  }, _.translateExtent = function(f) {
    return arguments.length ? (s[0][0] = +f[0][0], s[1][0] = +f[1][0], s[0][1] = +f[0][1], s[1][1] = +f[1][1], _) : [[s[0][0], s[0][1]], [s[1][0], s[1][1]]];
  }, _.constrain = function(f) {
    return arguments.length ? (n = f, _) : n;
  }, _.duration = function(f) {
    return arguments.length ? (a = +f, _) : a;
  }, _.interpolate = function(f) {
    return arguments.length ? (l = f, _) : l;
  }, _.on = function() {
    var f = u.on.apply(u, arguments);
    return f === u ? _ : f;
  }, _.clickDistance = function(f) {
    return arguments.length ? (b = (f = +f) * f, _) : Math.sqrt(b);
  }, _.tapDistance = function(f) {
    return arguments.length ? (S = +f, _) : S;
  }, _;
}
const sl = Symbol("MiniMapSlots"), R_ = ["id", "x", "y", "rx", "ry", "width", "height", "fill", "stroke", "stroke-width", "shape-rendering"], B_ = {
  name: "MiniMapNode",
  compatConfig: { MODE: 3 },
  inheritAttrs: !1
}, V_ = /* @__PURE__ */ Se({
  ...B_,
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
    const n = e, o = mt(sl), i = zi(), r = Ee(() => i.style ?? {});
    function s(d) {
      t("click", d);
    }
    function a(d) {
      t("dblclick", d);
    }
    function l(d) {
      t("mouseenter", d);
    }
    function u(d) {
      t("mousemove", d);
    }
    function c(d) {
      t("mouseleave", d);
    }
    return (d, h) => !d.hidden && d.dimensions.width !== 0 && d.dimensions.height !== 0 ? (V(), te(Pe, { key: 0 }, [
      K(o)[`node-${n.type}`] ? (V(), De(Ct(K(o)[`node-${n.type}`]), zl(ao({ key: 0 }, { ...n, ...d.$attrs })), null, 16)) : (V(), te("rect", ao({
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
        fill: d.color || r.value.background || r.value.backgroundColor,
        stroke: d.strokeColor,
        "stroke-width": d.strokeWidth,
        "shape-rendering": d.shapeRendering,
        onClick: s,
        onDblclick: a,
        onMouseenter: l,
        onMousemove: u,
        onMouseleave: c
      }), null, 16, R_))
    ], 64)) : me("", !0);
  }
}), L_ = ["width", "height", "viewBox", "aria-labelledby"], H_ = ["id"], F_ = ["d", "fill", "stroke", "stroke-width"], U_ = {
  name: "MiniMap",
  compatConfig: { MODE: 3 }
}, Y_ = /* @__PURE__ */ Se({
  ...U_,
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
    const n = ys(), o = zi(), i = 200, r = 150, { id: s, edges: a, viewport: l, translateExtent: u, dimensions: c, emits: d, d3Selection: h, d3Zoom: p, getNodesInitialized: E } = Me(), b = _e();
    Rt(sl, n);
    const S = Ee(() => {
      var k;
      return e.width ?? ((k = o.style) == null ? void 0 : k.width) ?? i;
    }), _ = Ee(() => {
      var k;
      return e.height ?? ((k = o.style) == null ? void 0 : k.height) ?? r;
    }), P = typeof window > "u" || window.chrome ? "crispEdges" : "geometricPrecision", y = ce(() => typeof e.nodeColor == "string" ? () => e.nodeColor : e.nodeColor), $ = ce(
      () => typeof e.nodeStrokeColor == "string" ? () => e.nodeStrokeColor : e.nodeStrokeColor
    ), R = ce(
      () => typeof e.nodeClassName == "string" ? () => e.nodeClassName : typeof e.nodeClassName == "function" ? e.nodeClassName : () => ""
    ), U = ce(() => Yi(E.value.filter((k) => !k.hidden))), L = ce(() => ({
      x: -l.value.x / l.value.zoom,
      y: -l.value.y / l.value.zoom,
      width: c.value.width / l.value.zoom,
      height: c.value.height / l.value.zoom
    })), Y = ce(
      () => E.value && E.value.length ? xh(U.value, L.value) : L.value
    ), ie = ce(() => {
      const k = Y.value.width / S.value, z = Y.value.height / _.value;
      return Math.max(k, z);
    }), H = ce(() => {
      const k = ie.value * S.value, z = ie.value * _.value, T = e.offsetScale * ie.value;
      return {
        offset: T,
        x: Y.value.x - (k - Y.value.width) / 2 - T,
        y: Y.value.y - (z - Y.value.height) / 2 - T,
        width: k + T * 2,
        height: z + T * 2
      };
    }), X = ce(() => !H.value.x || !H.value.y ? "" : `
    M${H.value.x - H.value.offset},${H.value.y - H.value.offset}
    h${H.value.width + H.value.offset * 2}
    v${H.value.height + H.value.offset * 2}
    h${-H.value.width - H.value.offset * 2}z
    M${L.value.x + e.maskBorderRadius},${L.value.y}
    h${L.value.width - 2 * e.maskBorderRadius}
    a${e.maskBorderRadius},${e.maskBorderRadius} 0 0 1 ${e.maskBorderRadius},${e.maskBorderRadius}
    v${L.value.height - 2 * e.maskBorderRadius}
    a${e.maskBorderRadius},${e.maskBorderRadius} 0 0 1 -${e.maskBorderRadius},${e.maskBorderRadius}
    h${-(L.value.width - 2 * e.maskBorderRadius)}
    a${e.maskBorderRadius},${e.maskBorderRadius} 0 0 1 -${e.maskBorderRadius},-${e.maskBorderRadius}
    v${-(L.value.height - 2 * e.maskBorderRadius)}
    a${e.maskBorderRadius},${e.maskBorderRadius} 0 0 1 ${e.maskBorderRadius},-${e.maskBorderRadius}z`);
    Pl(
      (k) => {
        if (b.value) {
          const z = Et(b.value), T = (j) => {
            if (j.sourceEvent.type !== "wheel" || !h.value || !p.value)
              return;
            const re = j.sourceEvent.ctrlKey && Sn() ? 10 : 1, G = -j.sourceEvent.deltaY * (j.sourceEvent.deltaMode === 1 ? 0.05 : j.sourceEvent.deltaMode ? 1 : 2e-3) * e.zoomStep, F = l.value.zoom * 2 ** (G * re);
            p.value.scaleTo(h.value, F);
          }, B = (j) => {
            if (j.sourceEvent.type !== "mousemove" || !h.value || !p.value)
              return;
            const re = ie.value * Math.max(1, l.value.zoom) * (e.inversePan ? -1 : 1), G = {
              x: l.value.x - j.sourceEvent.movementX * re,
              y: l.value.y - j.sourceEvent.movementY * re
            }, F = [
              [0, 0],
              [c.value.width, c.value.height]
            ], ee = tr.translate(G.x, G.y).scale(l.value.zoom), he = p.value.constrain()(ee, F, u.value);
            p.value.transform(h.value, he);
          }, q = O_().wheelDelta((j) => wi(j) * (e.zoomStep / 10)).on("zoom", e.pannable ? B : () => {
          }).on("zoom.wheel", e.zoomable ? T : () => {
          });
          z.call(q), k(() => {
            z.on("zoom", null);
          });
        }
      },
      { flush: "post" }
    );
    function C(k) {
      const [z, T] = wt(k);
      t("click", { event: k, position: { x: z, y: T } });
    }
    function oe(k, z) {
      const T = { event: k, node: z, connectedEdges: Tt([z], a.value) };
      d.miniMapNodeClick(T), t("nodeClick", T);
    }
    function f(k, z) {
      const T = { event: k, node: z, connectedEdges: Tt([z], a.value) };
      d.miniMapNodeDoubleClick(T), t("nodeDblclick", T);
    }
    function N(k, z) {
      const T = { event: k, node: z, connectedEdges: Tt([z], a.value) };
      d.miniMapNodeMouseEnter(T), t("nodeMouseenter", T);
    }
    function v(k, z) {
      const T = { event: k, node: z, connectedEdges: Tt([z], a.value) };
      d.miniMapNodeMouseMove(T), t("nodeMousemove", T);
    }
    function I(k, z) {
      const T = { event: k, node: z, connectedEdges: Tt([z], a.value) };
      d.miniMapNodeMouseLeave(T), t("nodeMouseleave", T);
    }
    return (k, z) => (V(), De(K(Da), {
      position: k.position,
      class: Ve(["vue-flow__minimap", { pannable: k.pannable, zoomable: k.zoomable }])
    }, {
      default: tt(() => [
        (V(), te("svg", {
          ref_key: "el",
          ref: b,
          width: S.value,
          height: _.value,
          viewBox: [H.value.x, H.value.y, H.value.width, H.value.height].join(" "),
          role: "img",
          "aria-labelledby": `vue-flow__minimap-${K(s)}`,
          onClick: C
        }, [
          k.ariaLabel ? (V(), te("title", {
            key: 0,
            id: `vue-flow__minimap-${K(s)}`
          }, Ce(k.ariaLabel), 9, H_)) : me("", !0),
          (V(!0), te(Pe, null, ot(K(E), (T) => (V(), De(V_, {
            id: T.id,
            key: T.id,
            f: "",
            position: T.computedPosition,
            dimensions: T.dimensions,
            selected: T.selected,
            dragging: T.dragging,
            style: Be(T.style),
            class: Ve(R.value(T)),
            color: y.value(T),
            "border-radius": k.nodeBorderRadius,
            "stroke-color": $.value(T),
            "stroke-width": k.nodeStrokeWidth,
            "shape-rendering": K(P),
            type: T.type,
            hidden: T.hidden,
            onClick: (B) => oe(B, T),
            onDblclick: (B) => f(B, T),
            onMouseenter: (B) => N(B, T),
            onMousemove: (B) => v(B, T),
            onMouseleave: (B) => I(B, T)
          }, null, 8, ["id", "position", "dimensions", "selected", "dragging", "style", "class", "color", "border-radius", "stroke-color", "stroke-width", "shape-rendering", "type", "hidden", "onClick", "onDblclick", "onMouseenter", "onMousemove", "onMouseleave"]))), 128)),
          Z("path", {
            class: "vue-flow__minimap-mask",
            d: X.value,
            fill: k.maskColor,
            stroke: k.maskStrokeColor,
            "stroke-width": k.maskStrokeWidth,
            "fill-rule": "evenodd"
          }, null, 8, F_)
        ], 8, L_))
      ]),
      _: 1
    }, 8, ["position", "class"]));
  }
}), X_ = { class: "schema-node__header" }, G_ = ["title"], q_ = { class: "schema-node__header-count" }, W_ = { class: "schema-node__columns" }, Z_ = ["title"], K_ = {
  key: 0,
  class: "schema-node__badge schema-node__badge--pk"
}, J_ = {
  key: 1,
  class: "schema-node__badge schema-node__badge--uq"
}, Q_ = {
  key: 2,
  class: "schema-node__badge schema-node__badge--nn"
}, j_ = { class: "schema-node__col-type" }, e0 = {
  key: 0,
  class: "schema-node__empty"
}, t0 = /* @__PURE__ */ Se({
  __name: "SchemaNode",
  props: {
    id: {},
    type: {},
    selected: { type: Boolean },
    connectable: { type: [Boolean, Number, String, Function] },
    position: {},
    dimensions: {},
    label: {},
    isValidTargetPos: { type: Function },
    isValidSourcePos: { type: Function },
    parent: {},
    parentNodeId: {},
    dragging: { type: Boolean },
    resizing: { type: Boolean },
    zIndex: {},
    targetPosition: {},
    sourcePosition: {},
    dragHandle: {},
    data: {},
    events: {}
  },
  setup(e) {
    const t = {
      TEXT: "text",
      INTEGER: "int",
      BIGINT: "bigint",
      BOOLEAN: "bool",
      NUMERIC: "num",
      TIMESTAMP: "ts",
      UUID: "uuid",
      JSONB: "json"
    }, n = (s) => s.primary_key === !0 || s.primary_key === 1, o = (s) => s.unique_col === !0 || s.unique_col === 1, i = (s) => !(s.nullable === !0 || s.nullable === 1) && !n(s), r = (s) => t[s || ""] || (s || "").toLowerCase();
    return (s, a) => (V(), te("div", {
      class: Ve(["schema-node", { "schema-node--selected": e.selected }])
    }, [
      Z("div", X_, [
        Z("span", {
          class: "schema-node__header-name",
          title: e.data.label
        }, Ce(e.data.label), 9, G_),
        Z("span", q_, Ce(e.data.columnCount), 1)
      ]),
      Z("div", W_, [
        (V(!0), te(Pe, null, ot(e.data.columns, (l) => (V(), te("div", {
          key: l.id,
          class: "schema-node__col"
        }, [
          Re(K(en), {
            type: "target",
            position: K(ae).Left,
            id: "target-" + l.id,
            class: "schema-node__handle schema-node__handle--target",
            style: { top: "auto" }
          }, null, 8, ["position", "id"]),
          Z("span", {
            class: "schema-node__col-name",
            title: l.name
          }, Ce(l.name), 9, Z_),
          n(l) ? (V(), te("span", K_, "PK")) : me("", !0),
          o(l) ? (V(), te("span", J_, "UQ")) : me("", !0),
          i(l) ? (V(), te("span", Q_, "NN")) : me("", !0),
          Z("span", j_, Ce(r(l.col_type)), 1),
          Re(K(en), {
            type: "source",
            position: K(ae).Right,
            id: "source-" + l.id,
            class: "schema-node__handle schema-node__handle--source",
            style: { top: "auto" }
          }, null, 8, ["position", "id"])
        ]))), 128)),
        e.data.columns.length ? me("", !0) : (V(), te("div", e0, "No columns"))
      ])
    ], 2));
  }
}), n0 = ["onClick"], o0 = /* @__PURE__ */ Se({
  __name: "ContextMenu",
  props: {
    x: {},
    y: {},
    items: {}
  },
  emits: ["close"],
  setup(e, { emit: t }) {
    const n = e, o = _e(null), i = _e(null), r = _e({ left: "0px", top: "0px", visibility: "hidden" });
    function s() {
      const u = o.value?.getBoundingClientRect(), c = i.value?.getBoundingClientRect();
      if (!u || !c) return;
      const d = Math.max(0, Math.min(n.x - u.left, u.width - c.width)), h = Math.max(0, Math.min(n.y - u.top, u.height - c.height));
      r.value = { left: `${d}px`, top: `${h}px`, visibility: "visible" };
    }
    Ne(() => [n.x, n.y], () => {
      Ye(s);
    }), st(() => {
      Ye(s), window.addEventListener("resize", s);
    }), No(() => window.removeEventListener("resize", s));
    const a = t;
    function l(u) {
      u.action(), a("close");
    }
    return (u, c) => (V(), te("div", {
      ref_key: "layer",
      ref: o,
      class: "de-ctx-overlay",
      onClick: c[2] || (c[2] = (d) => a("close")),
      onContextmenu: c[3] || (c[3] = Xo((d) => a("close"), ["prevent"]))
    }, [
      Z("div", {
        ref_key: "panel",
        ref: i,
        class: "de-ctx",
        style: Be(r.value),
        onClick: c[0] || (c[0] = Xo(() => {
        }, ["stop"])),
        onContextmenu: c[1] || (c[1] = Xo(() => {
        }, ["prevent", "stop"]))
      }, [
        (V(!0), te(Pe, null, ot(e.items, (d, h) => (V(), te("button", {
          key: h,
          class: Ve(["de-ctx-item", { "de-ctx-danger": d.danger }]),
          onClick: (p) => l(d)
        }, Ce(d.label), 11, n0))), 128))
      ], 36)
    ], 544));
  }
}), ge = {
  TABLE_ADDED: "chestor.db_schema.events:table.added",
  TABLE_UPDATED: "chestor.db_schema.events:table.updated",
  TABLE_REMOVED: "chestor.db_schema.events:table.removed",
  COLUMN_ADDED: "chestor.db_schema.events:column.added",
  COLUMN_UPDATED: "chestor.db_schema.events:column.updated",
  COLUMN_REMOVED: "chestor.db_schema.events:column.removed",
  RELATION_ADDED: "chestor.db_schema.events:relation.added",
  RELATION_UPDATED: "chestor.db_schema.events:relation.updated",
  RELATION_REMOVED: "chestor.db_schema.events:relation.removed",
  LAYOUT_POSITION_SET: "chestor.db_schema.events:layout.position-set"
};
function ai(e, t) {
  return e.tables.find((n) => n.id === t);
}
function ps(e, t) {
  for (const n of e.tables) {
    const o = (n.columns || []).find((i) => i.id === t);
    if (o) return o;
  }
}
function vs(e) {
  return { type: ge.COLUMN_ADDED, body: { id: e.id, table_id: e.table_id, name: e.name, col_type: e.col_type, primary_key: e.primary_key, nullable: e.nullable, unique_col: e.unique_col } };
}
function gs(e) {
  return { type: ge.RELATION_ADDED, body: { id: e.id, from_table_id: e.from_table_id, to_table_id: e.to_table_id, from_column_id: e.from_column_id, to_column_id: e.to_column_id, relation_type: e.relation_type, name: e.name } };
}
function i0(e, t) {
  const n = e.body;
  switch (e.type) {
    case ge.TABLE_ADDED:
      return [{ type: ge.TABLE_REMOVED, body: { id: n.id } }];
    case ge.TABLE_REMOVED: {
      const o = ai(t, n.id);
      if (!o) return [];
      const i = [{ type: ge.TABLE_ADDED, body: { id: o.id, name: o.name, description: o.description } }];
      o.layout && typeof o.layout.x == "number" && i.push({ type: ge.LAYOUT_POSITION_SET, body: { table_id: o.id, x: o.layout.x, y: o.layout.y } });
      for (const r of o.columns || []) i.push(vs(r));
      for (const r of t.relations)
        (r.from_table_id === o.id || r.to_table_id === o.id) && i.push(gs(r));
      return i;
    }
    case ge.TABLE_UPDATED: {
      const o = ai(t, n.id);
      if (!o) return [];
      const i = { id: o.id };
      return "name" in n && (i.name = o.name), "description" in n && (i.description = o.description ?? ""), [{ type: ge.TABLE_UPDATED, body: i }];
    }
    case ge.COLUMN_ADDED:
      return [{ type: ge.COLUMN_REMOVED, body: { id: n.id } }];
    case ge.COLUMN_REMOVED: {
      const o = ps(t, n.id);
      return o ? [vs(o)] : [];
    }
    case ge.COLUMN_UPDATED: {
      const o = ps(t, n.id);
      if (!o) return [];
      const i = { id: o.id };
      for (const r of ["name", "col_type", "primary_key", "nullable", "unique_col"])
        r in n && (i[r] = o[r]);
      return [{ type: ge.COLUMN_UPDATED, body: i }];
    }
    case ge.RELATION_ADDED:
      return [{ type: ge.RELATION_REMOVED, body: { id: n.id } }];
    case ge.RELATION_REMOVED: {
      const o = t.relations.find((i) => i.id === n.id);
      return o ? [gs(o)] : [];
    }
    case ge.RELATION_UPDATED: {
      const o = t.relations.find((r) => r.id === n.id);
      if (!o) return [];
      const i = { id: o.id };
      return "relation_type" in n && (i.relation_type = o.relation_type), "name" in n && (i.name = o.name ?? ""), [{ type: ge.RELATION_UPDATED, body: i }];
    }
    case ge.LAYOUT_POSITION_SET: {
      const o = ai(t, n.table_id);
      return !o?.layout || typeof o.layout.x != "number" ? [] : [{ type: ge.LAYOUT_POSITION_SET, body: { table_id: o.id, x: o.layout.x, y: o.layout.y } }];
    }
    default:
      return null;
  }
}
function r0(e, t) {
  const n = [];
  for (const o of [...e].reverse()) {
    const i = i0(o, t);
    if (i === null) return null;
    n.push(...i);
  }
  return n;
}
const s0 = { one_to_many: "1:N", many_to_one: "N:1", one_to_one: "1:1", many_to_many: "N:N" }, a0 = { one_to_many: "<", many_to_one: ">", one_to_one: "-", many_to_many: "<>" };
function al(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e) for (const o of n.columns || []) t.set(o.id, o);
  return t;
}
function l0(e, t) {
  const n = new Map(e.map((r) => [r.id, r])), o = al(e), i = ["-- Schema export", ""];
  for (const r of e) {
    const s = (r.columns || []).map((a) => {
      const l = [`  ${a.name} ${a.col_type || "TEXT"}`];
      return a.primary_key ? l.push("PRIMARY KEY") : a.nullable === !1 && l.push("NOT NULL"), a.unique_col && !a.primary_key && l.push("UNIQUE"), l.join(" ");
    });
    if (!s.length) {
      i.push(`-- ${r.name}: no columns yet`, "");
      continue;
    }
    i.push(`CREATE TABLE ${r.name} (`, s.join(`,
`), ");", "");
  }
  for (const r of t) {
    const s = n.get(r.from_table_id), a = n.get(r.to_table_id);
    if (!s || !a) continue;
    const l = r.from_column_id ? o.get(r.from_column_id) : void 0, u = r.to_column_id ? o.get(r.to_column_id) : void 0;
    if (l && u) {
      const c = r.name || `fk_${s.name}_${l.name}`;
      i.push(`ALTER TABLE ${s.name} ADD CONSTRAINT ${c} FOREIGN KEY (${l.name}) REFERENCES ${a.name} (${u.name});`);
    } else
      i.push(`-- FK ${s.name} -> ${a.name} (${s0[r.relation_type] || r.relation_type})`);
  }
  return i.join(`
`);
}
function kt(e) {
  return /^[A-Za-z_][A-Za-z0-9_]*$/.test(e) ? e : `"${e.replace(/"/g, "")}"`;
}
function u0(e, t) {
  const n = new Map(e.map((r) => [r.id, r])), o = al(e), i = [];
  for (const r of e) {
    i.push(`Table ${kt(r.name)} {`);
    for (const s of r.columns || []) {
      const a = [];
      s.primary_key && a.push("pk"), s.unique_col && !s.primary_key && a.push("unique"), s.nullable === !1 && !s.primary_key && a.push("not null");
      const l = a.length ? ` [${a.join(", ")}]` : "";
      i.push(`  ${kt(s.name)} ${(s.col_type || "TEXT").toLowerCase()}${l}`);
    }
    r.description && i.push(`  Note: '${r.description.replace(/'/g, "\\'")}'`), i.push("}", "");
  }
  for (const r of t) {
    const s = n.get(r.from_table_id), a = n.get(r.to_table_id);
    if (!s || !a) continue;
    const l = r.from_column_id ? o.get(r.from_column_id) : void 0, u = r.to_column_id ? o.get(r.to_column_id) : void 0, c = a0[r.relation_type] || ">";
    if (l && u) {
      const d = r.name ? `${kt(r.name)}: ` : "";
      i.push(`Ref ${d}${kt(s.name)}.${kt(l.name)} ${c} ${kt(a.name)}.${kt(u.name)}`);
    } else
      i.push(`// Ref ${s.name} ${c} ${a.name} (column ends not set)`);
  }
  return i.join(`
`);
}
const c0 = {
  key: 0,
  class: "de-error"
}, d0 = ["disabled"], f0 = {
  key: 1,
  class: "de-toolbar"
}, h0 = { class: "de-muted de-sm" }, p0 = { class: "de-flow-wrap" }, v0 = {
  key: 0,
  class: "de-empty",
  role: "status"
}, g0 = {
  key: 1,
  class: "de-empty"
}, m0 = {
  key: 3,
  class: "de-panel"
}, y0 = { class: "de-panel-head" }, _0 = { class: "de-panel-name" }, w0 = {
  key: 0,
  class: "de-read-description"
}, b0 = { class: "de-panel-label" }, x0 = { class: "de-muted" }, E0 = { class: "de-read-columns" }, $0 = { key: 0 }, S0 = { key: 1 }, N0 = { key: 2 }, k0 = {
  key: 4,
  class: "de-panel"
}, C0 = { class: "de-panel-head" }, M0 = ["value"], T0 = ["value"], I0 = { class: "de-panel-label" }, D0 = { class: "de-muted de-sm" }, A0 = { class: "de-panel-cols" }, P0 = ["onClick"], z0 = ["value", "onChange"], O0 = ["value", "onChange"], R0 = ["value"], B0 = ["onClick"], V0 = ["onClick"], L0 = ["onClick"], H0 = {
  key: 0,
  class: "de-muted de-sm"
}, F0 = { class: "de-panel-foot" }, U0 = {
  key: 5,
  class: "de-panel de-rel-panel"
}, Y0 = { class: "de-panel-head" }, X0 = { class: "de-rel-ends" }, G0 = { class: "de-rel-end" }, q0 = { class: "de-rel-tbl" }, W0 = {
  key: 0,
  class: "de-rel-col"
}, Z0 = { class: "de-rel-end" }, K0 = { class: "de-rel-tbl" }, J0 = {
  key: 0,
  class: "de-rel-col"
}, Q0 = { class: "de-rel-section" }, j0 = { class: "de-rel-types" }, e1 = ["onClick"], t1 = { class: "de-rel-section" }, n1 = ["value"], o1 = { class: "de-panel-foot" }, i1 = "chestor.db_schema:state", r1 = /* @__PURE__ */ Se({
  __name: "DbSchema",
  setup(e) {
    const t = vu(), n = ce(() => t.value?.entryId || ""), o = ce(() => (t.value?.mode || "preview") === "full"), i = ce(() => o.value && !t.value?.readOnly), r = _e([]), s = _e([]), a = _e([]), l = _e([]), u = _e(""), c = _e(!0), d = _e(""), h = _e(null), p = _e(null), E = ["TEXT", "INTEGER", "BIGINT", "BOOLEAN", "NUMERIC", "TIMESTAMP", "UUID", "JSONB"], b = [
      { value: "one_to_one", label: "1:1" },
      { value: "one_to_many", label: "1:N" },
      { value: "many_to_one", label: "N:1" },
      { value: "many_to_many", label: "N:N" }
    ], S = { one_to_many: "1:N", many_to_one: "N:1", one_to_one: "1:1", many_to_many: "N:N" }, _ = {
      one_to_one: "var(--de-rel-one-to-one)",
      one_to_many: "var(--de-accent)",
      many_to_one: "var(--de-rel-many-to-one)",
      many_to_many: "var(--de-rel-many-to-many)"
    };
    function P(x, A) {
      const O = x, W = O?.response?.data?.error;
      return typeof W == "string" && W ? W : typeof O?.message == "string" && O.message && !/request failed|status code/i.test(O.message) ? O.message : A;
    }
    const y = () => `/api/v1/workspace/db-schema/${n.value}`, $ = () => r.value.find((x) => x.id === h.value) || null, R = () => s.value.find((x) => x.id === p.value) || null, U = (x) => r.value.find((A) => A.id === x)?.name || "?", L = (x) => {
      for (const A of r.value) {
        const O = (A.columns || []).find((W) => W.id === x);
        if (O) return O.name;
      }
      return null;
    }, Y = () => r.value.reduce((x, A) => x + (A.columns || []).length, 0), ie = `dbflow-${n.value || "x"}-${t.value?.mode || "preview"}`, { fitView: H, screenToFlowCoordinate: X, onNodesInitialized: C } = Me(ie), oe = _e(null);
    function f(x, A) {
      x.preventDefault?.(), oe.value = { x: x.clientX, y: x.clientY, items: A };
    }
    function N() {
      oe.value = null;
    }
    const v = /* @__PURE__ */ new Map();
    let I = !1;
    function k(x, A) {
      const O = v.get(x.id);
      return O && Date.now() - O.ts < 5e3 ? { x: O.x, y: O.y } : x.layout && typeof x.layout.x == "number" ? { x: x.layout.x, y: x.layout.y } : { x: 60 + A % 4 * 320, y: 60 + Math.floor(A / 4) * 300 };
    }
    const z = { schemaTable: Xt(t0) };
    function T() {
      const x = r.value.map((W, ke) => ({
        id: W.id,
        type: "schemaTable",
        position: k(W, ke),
        data: { label: W.name, tableId: W.id, columns: W.columns || [], columnCount: (W.columns || []).length }
      }));
      a.value = x;
      const A = new Set(r.value.map((W) => W.id)), O = s.value.filter((W) => A.has(W.from_table_id) && A.has(W.to_table_id)).map((W) => {
        const ke = _[W.relation_type] || "var(--de-accent)";
        return {
          id: W.id,
          source: W.from_table_id,
          target: W.to_table_id,
          sourceHandle: W.from_column_id ? "source-" + W.from_column_id : void 0,
          targetHandle: W.to_column_id ? "target-" + W.to_column_id : void 0,
          type: "smoothstep",
          class: "rel-edge",
          label: W.name || S[W.relation_type] || W.relation_type,
          data: { relation_type: W.relation_type },
          style: { stroke: ke, strokeWidth: 1.8 },
          markerEnd: { type: go.ArrowClosed, width: 14, height: 11, color: ke }
        };
      });
      l.value = O;
    }
    function B(x) {
      r.value = x?.tables ?? [], s.value = x?.relations ?? [], x?.thread_id && (u.value = x.thread_id), T();
    }
    async function q(x = !1) {
      x || (c.value = !0);
      try {
        const { data: A } = await rr.get(y());
        if (!A.success) throw new Error(A.error || "Couldn’t load the schema.");
        B(A.schema), d.value = "";
      } catch (A) {
        d.value = P(A, "Couldn’t load the schema.");
      } finally {
        x || (c.value = !1);
      }
    }
    const j = [], re = [];
    function G() {
      return JSON.parse(JSON.stringify({ tables: r.value, relations: s.value }));
    }
    async function F(x, A = !0) {
      if (i.value) {
        if (d.value = "", A) {
          const O = r0(x, G());
          O && (j.push({ undo: O, redo: x }), j.length > 100 && j.shift(), re.length = 0);
        }
        try {
          const { data: O } = await rr.post(`${y()}/apply`, { commands: x });
          if (!O.success) {
            d.value = O.error || "apply failed";
            return;
          }
          B(O.schema), d.value = "";
        } catch (O) {
          d.value = P(O, "Couldn’t save the schema.");
        }
      }
    }
    async function ee() {
      if (!i.value) return;
      const x = j.pop();
      x && (re.push(x), await F(x.undo, !1));
    }
    async function he() {
      if (!i.value) return;
      const x = re.pop();
      x && (j.push(x), await F(x.redo, !1));
    }
    const ve = (x, A) => F([{ type: x, body: A }]), de = () => crypto?.randomUUID ? crypto.randomUUID() : String(Date.now() + Math.random());
    async function we() {
      try {
        await H({ padding: 0.2, maxZoom: 1 });
      } catch (x) {
        d.value = P(x, "Couldn’t fit the schema. Try Fit again.");
      }
    }
    function ue(x, A) {
      if (!A.includes(x)) return x;
      let O = 2;
      for (; A.includes(`${x}_${O}`); ) O++;
      return `${x}_${O}`;
    }
    function pe() {
      Ye(() => {
        const A = (document.activeElement?.getRootNode?.() ?? document).querySelector?.(".de-panel-name") ?? document.querySelector(".de-panel-name");
        A?.focus(), A?.select();
      });
    }
    function m(x) {
      const A = de(), O = ue("new_table", r.value.map((ke) => ke.name)), W = [
        { type: ge.TABLE_ADDED, body: { id: A, name: O } },
        { type: ge.COLUMN_ADDED, body: { id: de(), table_id: A, name: "id", col_type: "UUID", primary_key: !0 } }
      ];
      return x && W.push({ type: ge.LAYOUT_POSITION_SET, body: { table_id: A, x: Math.round(x.x), y: Math.round(x.y) } }), F(W).then(() => {
        p.value = null, h.value = A, pe();
      }), A;
    }
    function g(x) {
      const A = de(), O = ue(x.name, r.value.map((He) => He.name)), W = [{ type: ge.TABLE_ADDED, body: { id: A, name: O, description: x.description } }];
      for (const He of x.columns || [])
        W.push({ type: ge.COLUMN_ADDED, body: { id: de(), table_id: A, name: He.name, col_type: He.col_type, primary_key: He.primary_key, nullable: He.nullable, unique_col: He.unique_col } });
      const ke = x.layout && typeof x.layout.x == "number" ? { x: x.layout.x + 40, y: x.layout.y + 40 } : void 0;
      ke && W.push({ type: ge.LAYOUT_POSITION_SET, body: { table_id: A, x: Math.round(ke.x), y: Math.round(ke.y) } }), F(W).then(() => {
        p.value = null, h.value = A;
      });
    }
    function w(x, A) {
      A && A !== x.name && ve(ge.TABLE_UPDATED, { id: x.id, name: A });
    }
    function D(x, A) {
      ve(ge.TABLE_UPDATED, { id: x.id, description: A });
    }
    function M(x) {
      ve(ge.TABLE_REMOVED, { id: x.id }), h.value === x.id && (h.value = null);
    }
    function J(x) {
      const A = ue("column", (x.columns || []).map((O) => O.name));
      ve(ge.COLUMN_ADDED, { id: de(), table_id: x.id, name: A, col_type: "TEXT" });
    }
    function Q(x, A) {
      ve(ge.COLUMN_UPDATED, { id: x.id, ...A });
    }
    function le(x) {
      ve(ge.COLUMN_REMOVED, { id: x.id });
    }
    function se(x, A) {
      A !== x.relation_type && ve(ge.RELATION_UPDATED, { id: x.id, relation_type: A });
    }
    function fe(x, A) {
      A !== (x.name || "") && ve(ge.RELATION_UPDATED, { id: x.id, name: A });
    }
    function ye(x) {
      ve(ge.RELATION_REMOVED, { id: x.id }), p.value === x.id && (p.value = null);
    }
    C(() => {
      !I && a.value.length && (I = !0, we());
    });
    function xe({ nodes: x }) {
      const A = [];
      for (const O of x || []) {
        const W = Math.round(O.position.x), ke = Math.round(O.position.y);
        v.set(O.id, { x: W, y: ke, ts: Date.now() }), A.push({ type: ge.LAYOUT_POSITION_SET, body: { table_id: O.id, x: W, y: ke } });
      }
      A.length && F(A);
    }
    let qe = null, Le = !1;
    function Ho(x) {
      Le = !1, qe = x?.nodeId && x?.handleType === "source" ? { table: x.nodeId, column: (x.handleId || "").replace("source-", "") || void 0 } : null;
    }
    function Fo(x) {
      if (Le = !0, !i.value || !x.source || !x.target) return;
      const A = (x.sourceHandle || "").replace("source-", "") || void 0, O = (x.targetHandle || "").replace("target-", "") || void 0;
      s.value.some((ke) => ke.from_table_id === x.source && ke.to_table_id === x.target && (ke.from_column_id || void 0) === A && (ke.to_column_id || void 0) === O) || ve(ge.RELATION_ADDED, {
        id: de(),
        from_table_id: x.source,
        to_table_id: x.target,
        from_column_id: A,
        to_column_id: O,
        relation_type: "one_to_many"
      });
    }
    function Uo(x) {
      const A = qe;
      if (qe = null, Le || !A || !i.value || !(x instanceof MouseEvent)) return;
      const O = x.target;
      if (!O || !O.classList.contains("vue-flow__pane")) return;
      const W = X({ x: x.clientX, y: x.clientY }), ke = de(), He = de(), xl = ue("new_table", r.value.map((El) => El.name));
      F([
        { type: ge.TABLE_ADDED, body: { id: ke, name: xl } },
        { type: ge.COLUMN_ADDED, body: { id: He, table_id: ke, name: "id", col_type: "UUID", primary_key: !0 } },
        { type: ge.LAYOUT_POSITION_SET, body: { table_id: ke, x: Math.round(W.x), y: Math.round(W.y) } },
        { type: ge.RELATION_ADDED, body: { id: de(), from_table_id: A.table, to_table_id: ke, from_column_id: A.column, to_column_id: He, relation_type: "one_to_many" } }
      ]).then(() => {
        p.value = null, h.value = ke, pe();
      });
    }
    function nr(x) {
      const A = /* @__PURE__ */ new Set(), O = /* @__PURE__ */ new Set();
      if (x) {
        A.add(x);
        for (const W of s.value)
          (W.from_table_id === x || W.to_table_id === x) && (O.add(W.id), A.add(W.from_table_id), A.add(W.to_table_id));
      }
      for (const W of a.value) W.class = x && !A.has(W.id) ? "de-dim" : "";
      for (const W of l.value) W.class = x ? O.has(W.id) ? "rel-edge de-edge-hot" : "rel-edge de-dim" : "rel-edge";
    }
    function ll({ node: x }) {
      x?.id && nr(x.id);
    }
    function ul() {
      nr(null);
    }
    function cl({ node: x }) {
      o.value && (p.value = null, h.value = x.id);
    }
    function dl({ edge: x }) {
      o.value && x?.id && (h.value = null, p.value = x.id);
    }
    function fl() {
      h.value = null, p.value = null, N();
    }
    function hl({ event: x, node: A }) {
      if (!i.value) return;
      const O = r.value.find((W) => W.id === A.id);
      O && f(x, [
        { label: "Edit table", action: () => {
          p.value = null, h.value = O.id;
        } },
        { label: "Add column", action: () => J(O) },
        { label: "Duplicate table", action: () => g(O) },
        { label: "Delete table", danger: !0, action: () => M(O) }
      ]);
    }
    function pl({ event: x, edge: A }) {
      if (!i.value) return;
      const O = s.value.find((W) => W.id === A.id);
      O && f(x, [
        { label: "Edit relation", action: () => {
          h.value = null, p.value = O.id;
        } },
        { label: "Delete relation", danger: !0, action: () => ye(O) }
      ]);
    }
    function vl(x) {
      if (!i.value) return;
      const A = x?.event || x;
      A.preventDefault?.(), f(A, [{ label: "Add table here", action: () => gl(A) }]);
    }
    function gl(x) {
      let A;
      try {
        const O = X({ x: x.clientX, y: x.clientY });
        A = { x: O.x, y: O.y };
      } catch (O) {
        d.value = P(O, "Couldn’t place this table. Try again.");
        return;
      }
      m(A);
    }
    function ml() {
      const x = r.value.map((A, O) => ({ type: ge.LAYOUT_POSITION_SET, body: { table_id: A.id, x: 60 + O % 4 * 340, y: 60 + Math.floor(O / 4) * 320 } }));
      v.clear(), x.length && F(x).then(() => Ye(we));
    }
    function or(x, A, O) {
      const W = new Blob([x], { type: O }), ke = URL.createObjectURL(W), He = document.createElement("a");
      He.href = ke, He.download = A, He.click(), setTimeout(() => URL.revokeObjectURL(ke), 1e3);
    }
    function yl(x) {
      f(x, [
        { label: "SQL (.sql)", action: () => or(l0(r.value, s.value), "schema.sql", "text/sql") },
        { label: "DBML (.dbml)", action: () => or(u0(r.value, s.value), "schema.dbml", "text/plain") }
      ]);
    }
    const _l = _e(null);
    function wl(x) {
      const A = x;
      return !!A && (A.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(A.tagName || ""));
    }
    function bl(x) {
      if (!i.value) return;
      if (wl(x.composedPath()[0] ?? x.target)) {
        x.key === "Escape" && x.composedPath()[0]?.blur?.();
        return;
      }
      const A = x.ctrlKey || x.metaKey;
      if (A && (x.key === "z" || x.key === "Z"))
        x.preventDefault(), x.shiftKey ? he() : ee();
      else if (A && (x.key === "y" || x.key === "Y"))
        x.preventDefault(), he();
      else if (A && (x.key === "d" || x.key === "D")) {
        x.preventDefault();
        const O = $();
        O && g(O);
      } else if (A && x.key === "Enter")
        if (x.preventDefault(), x.shiftKey) m();
        else {
          const O = $();
          O && J(O);
        }
      else if (x.key === "Delete" || x.key === "Backspace") {
        x.preventDefault();
        const O = R(), W = $();
        O ? ye(O) : W && M(W);
      } else x.key === "Escape" ? oe.value ? N() : (h.value = null, p.value = null) : x.shiftKey && (x.key === "1" || x.key === "!") && (x.preventDefault(), we());
    }
    let Yo = [];
    return st(async () => {
      await q();
      const x = u.value;
      if (x)
        for (const A of [`kickside.thread.${x}.projection.${i1}`, `kickside.thread.${x}`])
          try {
            Yo.push(ws(A, () => {
              q(!0);
            }));
          } catch {
            d.value = "Live updates are unavailable. Reload to read the latest schema.";
          }
    }), No(() => {
      const x = [];
      for (const A of Yo)
        try {
          A();
        } catch (O) {
          x.push(O);
        }
      if (Yo = [], x.length) throw new AggregateError(x, "Couldn’t close live updates.");
    }), (x, A) => (V(), te("div", {
      ref_key: "rootEl",
      ref: _l,
      class: Ve(["de", o.value ? "de--full" : "de--preview"]),
      tabindex: "0",
      onKeydown: bl
    }, [
      d.value ? (V(), te("div", c0, [
        Z("span", null, Ce(d.value), 1),
        Z("button", {
          class: "de-btn",
          disabled: c.value,
          "aria-label": "Retry schema loading",
          onClick: A[0] || (A[0] = (O) => q())
        }, "Retry", 8, d0),
        Z("button", {
          class: "de-x de-x-sm",
          type: "button",
          "aria-label": "Dismiss error",
          title: "Dismiss",
          onClick: A[1] || (A[1] = (O) => d.value = "")
        }, "×")
      ])) : me("", !0),
      o.value ? (V(), te("div", f0, [
        i.value ? (V(), te("button", {
          key: 0,
          class: "de-btn",
          onClick: m
        }, "+ Table")) : me("", !0),
        Z("button", {
          class: "de-btn de-ghost",
          title: "Fit to view",
          onClick: we
        }, "Fit"),
        i.value ? (V(), te("button", {
          key: 1,
          class: "de-btn de-ghost",
          title: "Auto layout",
          onClick: ml
        }, "Arrange")) : me("", !0),
        Z("button", {
          class: "de-btn de-ghost",
          title: "Export schema",
          onClick: A[2] || (A[2] = (O) => yl(O))
        }, "Export"),
        A[14] || (A[14] = Z("span", { class: "de-spacer" }, null, -1)),
        Z("span", h0, Ce(r.value.length) + " tables · " + Ce(Y()) + " cols · " + Ce(s.value.length) + " rel · live", 1)
      ])) : me("", !0),
      Z("div", p0, [
        Re(K(Ev), {
          id: ie,
          nodes: a.value,
          "onUpdate:nodes": A[3] || (A[3] = (O) => a.value = O),
          edges: l.value,
          "onUpdate:edges": A[4] || (A[4] = (O) => l.value = O),
          "node-types": z,
          class: "de-flow schema-canvas",
          "nodes-draggable": i.value,
          "nodes-connectable": i.value,
          "elements-selectable": o.value,
          "connection-line-style": { stroke: "var(--de-accent)", strokeWidth: 2, strokeDasharray: "5 4" },
          "connection-radius": 40,
          "min-zoom": 0.15,
          "max-zoom": 2,
          "default-viewport": { x: 0, y: 0, zoom: 1 },
          onNodeDragStop: xe,
          onNodeClick: cl,
          onEdgeClick: dl,
          onPaneClick: fl,
          onConnectStart: Ho,
          onConnect: Fo,
          onConnectEnd: Uo,
          onNodeContextMenu: hl,
          onEdgeContextMenu: pl,
          onPaneContextMenu: vl,
          onNodeMouseEnter: ll,
          onNodeMouseLeave: ul
        }, {
          default: tt(() => [
            Re(K(Iv), {
              pattern: "dots",
              gap: 20,
              size: 1,
              "pattern-color": "color-mix(in srgb, var(--p-text-color) 22%, transparent)"
            }),
            o.value ? (V(), De(K(lg), {
              key: 0,
              position: "bottom-left",
              "show-interactive": !1
            })) : me("", !0),
            o.value ? (V(), De(K(Y_), {
              key: 1,
              position: "bottom-right",
              pannable: !0,
              zoomable: !0
            })) : me("", !0)
          ]),
          _: 1
        }, 8, ["nodes", "edges", "nodes-draggable", "nodes-connectable", "elements-selectable"]),
        c.value ? (V(), te("div", v0, "Loading schema…")) : me("", !0),
        !r.value.length && !c.value && !d.value ? (V(), te("div", g0, Ce(i.value ? "No tables — add one to start designing." : "No tables in this schema."), 1)) : me("", !0),
        oe.value ? (V(), De(o0, {
          key: 2,
          x: oe.value.x,
          y: oe.value.y,
          items: oe.value.items,
          onClose: N
        }, null, 8, ["x", "y", "items"])) : me("", !0),
        o.value && !i.value && $() ? (V(), te("aside", m0, [
          Z("div", y0, [
            Z("h3", _0, Ce($().name), 1),
            Z("button", {
              class: "de-x",
              "aria-label": "Close table inspector",
              onClick: A[5] || (A[5] = (O) => h.value = null)
            }, "×")
          ]),
          $().description ? (V(), te("p", w0, Ce($().description), 1)) : me("", !0),
          Z("div", b0, [
            A[15] || (A[15] = Jn("Columns ", -1)),
            Z("span", x0, Ce($().columns.length), 1)
          ]),
          Z("dl", E0, [
            (V(!0), te(Pe, null, ot($().columns, (O) => (V(), te(Pe, {
              key: O.id
            }, [
              Z("dt", null, Ce(O.name), 1),
              Z("dd", null, [
                Jn(Ce(O.col_type), 1),
                O.primary_key ? (V(), te("span", $0, " · Primary key")) : me("", !0),
                O.unique_col ? (V(), te("span", S0, " · Unique")) : me("", !0),
                O.nullable === !1 ? (V(), te("span", N0, " · Required")) : me("", !0)
              ])
            ], 64))), 128))
          ]),
          A[16] || (A[16] = Z("p", { class: "de-read-description de-muted" }, "Read only", -1))
        ])) : me("", !0),
        i.value && $() ? (V(), te("aside", k0, [
          Z("div", C0, [
            A[17] || (A[17] = Z("span", { class: "de-panel-kind" }, "TABLE", -1)),
            Z("input", {
              class: "de-panel-name",
              value: $().name,
              onChange: A[6] || (A[6] = (O) => w($(), O.target.value))
            }, null, 40, M0),
            Z("button", {
              class: "de-x",
              type: "button",
              "aria-label": "Close table editor",
              title: "Close",
              onClick: A[7] || (A[7] = (O) => h.value = null)
            }, "×")
          ]),
          Z("input", {
            class: "de-panel-desc",
            value: $().description || "",
            placeholder: "Add a description…",
            onChange: A[8] || (A[8] = (O) => D($(), O.target.value))
          }, null, 40, T0),
          Z("div", I0, [
            A[18] || (A[18] = Jn("Columns ", -1)),
            Z("span", D0, Ce($().columns.length), 1)
          ]),
          Z("div", A0, [
            (V(!0), te(Pe, null, ot($().columns, (O) => (V(), te("div", {
              key: O.id,
              class: "de-panel-col"
            }, [
              Z("button", {
                class: Ve(["de-flag de-pk", { on: O.primary_key }]),
                title: "Primary key",
                onClick: (W) => Q(O, { primary_key: !O.primary_key })
              }, "PK", 10, P0),
              Z("input", {
                class: "de-col-name",
                value: O.name,
                onChange: (W) => Q(O, { name: W.target.value })
              }, null, 40, z0),
              Z("select", {
                class: "de-col-type",
                value: O.col_type,
                onChange: (W) => Q(O, { col_type: W.target.value })
              }, [
                (V(), te(Pe, null, ot(E, (W) => Z("option", {
                  key: W,
                  value: W
                }, Ce(W), 9, R0)), 64))
              ], 40, O0),
              Z("button", {
                class: Ve(["de-flag de-uq", { on: O.unique_col }]),
                title: "Unique",
                onClick: (W) => Q(O, { unique_col: !O.unique_col })
              }, "UQ", 10, B0),
              Z("button", {
                class: Ve(["de-flag de-nn", { on: O.nullable === !1 }]),
                title: "Not null",
                onClick: (W) => Q(O, { nullable: O.nullable !== !1 })
              }, "NN", 10, V0),
              Z("button", {
                class: "de-x de-x-sm",
                type: "button",
                "aria-label": "Remove column",
                title: "Remove column",
                onClick: (W) => le(O)
              }, "×", 8, L0)
            ]))), 128)),
            $().columns.length ? me("", !0) : (V(), te("p", H0, "No columns yet."))
          ]),
          Z("div", F0, [
            Z("button", {
              class: "de-btn",
              onClick: A[9] || (A[9] = (O) => J($()))
            }, "+ Column"),
            Z("button", {
              class: "de-btn de-danger",
              onClick: A[10] || (A[10] = (O) => M($()))
            }, "Delete table")
          ])
        ])) : me("", !0),
        i.value && R() ? (V(), te("aside", U0, [
          Z("div", Y0, [
            Z("span", {
              class: "de-panel-kind",
              style: Be({ color: _[R().relation_type] })
            }, "RELATION", 4),
            Z("span", {
              class: "de-rel-badge",
              style: Be({ background: "color-mix(in srgb, " + _[R().relation_type] + " 18%, transparent)", color: _[R().relation_type] })
            }, Ce(S[R().relation_type] || R().relation_type), 5),
            A[19] || (A[19] = Z("span", { class: "de-spacer" }, null, -1)),
            Z("button", {
              class: "de-x",
              type: "button",
              "aria-label": "Close relation editor",
              title: "Close",
              onClick: A[11] || (A[11] = (O) => p.value = null)
            }, "×")
          ]),
          Z("div", X0, [
            Z("div", G0, [
              Z("span", q0, Ce(U(R().from_table_id)), 1),
              L(R().from_column_id) ? (V(), te("span", W0, Ce(L(R().from_column_id)), 1)) : me("", !0)
            ]),
            Z("span", {
              class: "de-rel-arrow",
              style: Be({ color: _[R().relation_type] })
            }, "→", 4),
            Z("div", Z0, [
              Z("span", K0, Ce(U(R().to_table_id)), 1),
              L(R().to_column_id) ? (V(), te("span", J0, Ce(L(R().to_column_id)), 1)) : me("", !0)
            ])
          ]),
          Z("div", Q0, [
            A[20] || (A[20] = Z("label", { class: "de-panel-label" }, "Type", -1)),
            Z("div", j0, [
              (V(), te(Pe, null, ot(b, (O) => Z("button", {
                key: O.value,
                class: Ve(["de-rel-type", { on: R().relation_type === O.value }]),
                style: Be(R().relation_type === O.value ? { borderColor: _[O.value], color: _[O.value] } : {}),
                onClick: (W) => se(R(), O.value)
              }, Ce(O.label), 15, e1)), 64))
            ])
          ]),
          Z("div", t1, [
            A[21] || (A[21] = Z("label", { class: "de-panel-label" }, "Name", -1)),
            Z("input", {
              class: "de-col-name",
              value: R().name || "",
              placeholder: "fk_name (optional)",
              onChange: A[12] || (A[12] = (O) => fe(R(), O.target.value))
            }, null, 40, n1)
          ]),
          Z("div", o1, [
            Z("button", {
              class: "de-btn de-danger",
              onClick: A[13] || (A[13] = (O) => ye(R()))
            }, "Delete relation")
          ])
        ])) : me("", !0)
      ])
    ], 34));
  }
}), s1 = ".vue-flow{position:relative;width:100%;height:100%;overflow:hidden;z-index:0;direction:ltr}.vue-flow__container{position:absolute;height:100%;width:100%;left:0;top:0}.vue-flow__pane{z-index:1}.vue-flow__pane.draggable{cursor:grab}.vue-flow__pane.selection{cursor:pointer}.vue-flow__pane.dragging{cursor:grabbing}.vue-flow__transformationpane{transform-origin:0 0;z-index:2;pointer-events:none}.vue-flow__viewport{z-index:4;overflow:clip}.vue-flow__selection{z-index:6}.vue-flow__edge-labels{position:absolute;width:100%;height:100%;pointer-events:none;-webkit-user-select:none;-moz-user-select:none;user-select:none}.vue-flow__nodesselection-rect:focus,.vue-flow__nodesselection-rect:focus-visible{outline:none}.vue-flow .vue-flow__edges{pointer-events:none;overflow:visible}.vue-flow__edge-path,.vue-flow__connection-path{stroke:#b1b1b7;stroke-width:1;fill:none}.vue-flow__edge{pointer-events:visibleStroke;cursor:pointer}.vue-flow__edge.animated path{stroke-dasharray:5;animation:dashdraw .5s linear infinite}.vue-flow__edge.animated path.vue-flow__edge-interaction{stroke-dasharray:none;animation:none}.vue-flow__edge.inactive{pointer-events:none}.vue-flow__edge.selected,.vue-flow__edge:focus,.vue-flow__edge:focus-visible{outline:none}.vue-flow__edge.selected .vue-flow__edge-path,.vue-flow__edge:focus .vue-flow__edge-path,.vue-flow__edge:focus-visible .vue-flow__edge-path{stroke:#555}.vue-flow__edge-textwrapper{pointer-events:all}.vue-flow__edge-textbg{fill:#fff}.vue-flow__edge-text{pointer-events:none;-webkit-user-select:none;-moz-user-select:none;user-select:none}.vue-flow__connection{pointer-events:none}.vue-flow__connection .animated{stroke-dasharray:5;animation:dashdraw .5s linear infinite}.vue-flow__connectionline{z-index:1001}.vue-flow__nodes{pointer-events:none;transform-origin:0 0}.vue-flow__node{position:absolute;-webkit-user-select:none;-moz-user-select:none;user-select:none;pointer-events:all;transform-origin:0 0;box-sizing:border-box;cursor:default}.vue-flow__node.draggable{cursor:grab;pointer-events:all}.vue-flow__node.draggable.dragging{cursor:grabbing}.vue-flow__nodesselection{z-index:3;transform-origin:left top;pointer-events:none}.vue-flow__nodesselection-rect{position:absolute;pointer-events:all;cursor:grab}.vue-flow__nodesselection-rect.dragging{cursor:grabbing}.vue-flow__handle{position:absolute;pointer-events:none;min-width:5px;min-height:5px}.vue-flow__handle.connectable{pointer-events:all;cursor:crosshair}.vue-flow__handle-bottom{left:50%;bottom:0;transform:translate(-50%,50%)}.vue-flow__handle-top{left:50%;top:0;transform:translate(-50%,-50%)}.vue-flow__handle-left{top:50%;left:0;transform:translate(-50%,-50%)}.vue-flow__handle-right{top:50%;right:0;transform:translate(50%,-50%)}.vue-flow__edgeupdater{cursor:move;pointer-events:all}.vue-flow__panel{position:absolute;z-index:5;margin:15px}.vue-flow__panel.top{top:0}.vue-flow__panel.bottom{bottom:0}.vue-flow__panel.left{left:0}.vue-flow__panel.right{right:0}.vue-flow__panel.center{left:50%;transform:translate(-50%)}@keyframes dashdraw{0%{stroke-dashoffset:10}}", a1 = ":root{--vf-node-bg: #fff;--vf-node-text: #222;--vf-connection-path: #b1b1b7;--vf-handle: #555}.vue-flow__edge.updating .vue-flow__edge-path{stroke:#777}.vue-flow__edge-text{font-size:10px}.vue-flow__edge-textbg{fill:#fff}.vue-flow__connection-path{stroke:var(--vf-connection-path)}.vue-flow__node{cursor:grab}.vue-flow__node.selectable:focus,.vue-flow__node.selectable:focus-visible{outline:none}.vue-flow__node-default,.vue-flow__node-input,.vue-flow__node-output{padding:10px;border-radius:3px;width:150px;font-size:12px;text-align:center;border-width:1px;border-style:solid;color:var(--vf-node-text);background-color:var(--vf-node-bg);border-color:var(--vf-node-color)}.vue-flow__node-default.selected,.vue-flow__node-default.selected:hover,.vue-flow__node-input.selected,.vue-flow__node-input.selected:hover,.vue-flow__node-output.selected,.vue-flow__node-output.selected:hover{box-shadow:0 0 0 .5px var(--vf-box-shadow)}.vue-flow__node-default.selected,.vue-flow__node-default:focus,.vue-flow__node-default:focus-visible,.vue-flow__node-input.selected,.vue-flow__node-input:focus,.vue-flow__node-input:focus-visible,.vue-flow__node-output.selected,.vue-flow__node-output:focus,.vue-flow__node-output:focus-visible{outline:none;border:1px solid #555}.vue-flow__node-default .vue-flow__handle,.vue-flow__node-input .vue-flow__handle,.vue-flow__node-output .vue-flow__handle{background:var(--vf-handle)}.vue-flow__node-default.selectable:hover,.vue-flow__node-input.selectable:hover,.vue-flow__node-output.selectable:hover{box-shadow:0 1px 4px 1px #00000014}.vue-flow__node-input{--vf-node-color: var(--vf-node-color, #0041d0);--vf-handle: var(--vf-node-color, #0041d0);--vf-box-shadow: var(--vf-node-color, #0041d0);background:var(--vf-node-bg);border-color:var(--vf-node-color, #0041d0)}.vue-flow__node-input.selected,.vue-flow__node-input:focus,.vue-flow__node-input:focus-visible{outline:none;border:1px solid var(--vf-node-color, #0041d0)}.vue-flow__node-default{--vf-handle: var(--vf-node-color, #1a192b);--vf-box-shadow: var(--vf-node-color, #1a192b);background:var(--vf-node-bg);border-color:var(--vf-node-color, #1a192b)}.vue-flow__node-default.selected,.vue-flow__node-default:focus,.vue-flow__node-default:focus-visible{outline:none;border:1px solid var(--vf-node-color, #1a192b)}.vue-flow__node-output{--vf-handle: var(--vf-node-color, #ff0072);--vf-box-shadow: var(--vf-node-color, #ff0072);background:var(--vf-node-bg);border-color:var(--vf-node-color, #ff0072)}.vue-flow__node-output.selected,.vue-flow__node-output:focus,.vue-flow__node-output:focus-visible{outline:none;border:1px solid var(--vf-node-color, #ff0072)}.vue-flow__nodesselection-rect,.vue-flow__selection{background:#0059dc14;border:1px dotted rgba(0,89,220,.8)}.vue-flow__nodesselection-rect:focus,.vue-flow__nodesselection-rect:focus-visible,.vue-flow__selection:focus,.vue-flow__selection:focus-visible{outline:none}.vue-flow__handle{width:6px;height:6px;background:var(--vf-handle);border:1px solid #fff;border-radius:100%}", l1 = ".vue-flow__controls{box-shadow:0 0 2px 1px #00000014}.vue-flow__controls-button{background:#fefefe;border:none;border-bottom:1px solid #eee;box-sizing:content-box;display:flex;justify-content:center;align-items:center;width:16px;height:16px;cursor:pointer;user-select:none;padding:5px}.vue-flow__controls-button svg{width:100%;max-width:12px;max-height:12px}.vue-flow__controls-button:hover{background:#f4f4f4}.vue-flow__controls-button:disabled{pointer-events:none}.vue-flow__controls-button:disabled svg{fill-opacity:.4}", u1 = ".vue-flow__minimap{background-color:#fff}.vue-flow__minimap.pannable{cursor:grab}.vue-flow__minimap.dragging{cursor:grabbing}.vue-flow__minimap-mask.pannable{cursor:grab}", c1 = ":host{display:block;height:100%;min-height:0;min-width:0;position:relative;container-type:inline-size;container-name:schema;--de-surface: color-mix(in srgb, var(--p-text-color) 3%, var(--p-content-background));--de-border: var(--p-content-border-color);--de-hover: color-mix(in srgb, var(--p-text-color) 8%, transparent);--de-accent: var(--p-primary-color);--de-fg: var(--p-text-color);--de-muted: var(--p-text-muted-color);--de-bg: var(--p-content-background);--de-rel-one-to-one: var(--p-primary-color);--de-rel-many-to-one: color-mix(in srgb, var(--p-primary-color) 65%, var(--p-text-color));--de-rel-many-to-many: color-mix(in srgb, var(--p-primary-color) 40%, var(--p-text-color));--de-key-pk: var(--p-primary-color);--de-key-uq: color-mix(in srgb, var(--p-primary-color) 65%, var(--p-text-color));--de-key-nn: var(--p-text-muted-color);--vf-connection-path: var(--p-primary-color);--vf-handle: var(--p-primary-color)}.de{position:absolute;inset:0;box-sizing:border-box;font-family:var(--km-body, system-ui, sans-serif);color:var(--de-fg);background:var(--de-bg);display:flex;flex-direction:column}.de-error{color:var(--de-fg);background:color-mix(in srgb,var(--p-danger-color) 8%,var(--de-bg));border:1px solid color-mix(in srgb,var(--p-danger-color) 25%,var(--de-border));border-radius:10px;font-size:12px;margin:8px 14px;padding:10px 14px;display:flex;align-items:center;gap:8px}.de-error span{flex:1;min-width:0;overflow-wrap:anywhere}.de-muted{color:var(--de-muted);font-size:12.5px}.de-sm{font-size:11px}.de-spacer{flex:1}.de-toolbar{display:flex;align-items:center;gap:8px;padding:8px 14px;border-bottom:1px solid var(--de-border);flex-shrink:0;background:var(--de-surface)}.de-btn{border:1px solid var(--de-border);background:var(--de-hover);color:inherit;font:inherit;font-size:12px;font-weight:600;padding:5px 11px;border-radius:8px;cursor:pointer}.de-btn:hover,.de-ghost:hover{color:var(--de-accent);border-color:var(--de-accent)}.de-danger:hover{color:var(--p-danger-color);border-color:var(--p-danger-color)}.de-flow-wrap{flex:1;min-height:0;position:relative}.de-flow,.vue-flow.schema-canvas{position:absolute;inset:0}.vue-flow{background:var(--de-bg)}.schema-canvas .vue-flow__node{padding:0;border:none;background:transparent;box-shadow:0 6px 18px #00000029}.schema-canvas .vue-flow__edge.rel-edge .vue-flow__edge-path{stroke:var(--de-accent);stroke-width:1.6}.schema-canvas .vue-flow__edge.rel-edge:hover .vue-flow__edge-path{stroke:var(--p-danger-color)}.schema-canvas .vue-flow__edge.selected .vue-flow__edge-path{stroke:var(--de-accent);stroke-width:2.4}.schema-canvas .vue-flow__connectionline{z-index:1000}.schema-canvas .vue-flow__connection-path,.schema-canvas .vue-flow__connectionline path{stroke:var(--de-accent)!important;stroke-width:2!important;stroke-dasharray:5 4;fill:none}.schema-canvas .vue-flow__edge-text{fill:var(--de-fg);font-size:9px;font-weight:700}.schema-canvas .vue-flow__edge-textbg{fill:var(--de-bg)}.schema-canvas .vue-flow__controls{background:var(--de-surface);border:1px solid var(--de-border);border-radius:8px;overflow:hidden}.schema-canvas .vue-flow__controls button{background:var(--de-surface);border:none;border-bottom:1px solid var(--de-border);color:var(--de-muted);width:26px;height:26px}.schema-canvas .vue-flow__controls button:hover{color:var(--de-accent);background:var(--de-hover)}.schema-canvas .vue-flow__controls button svg{fill:currentColor}.schema-canvas .vue-flow__minimap{background:var(--de-surface);border:1px solid var(--de-border);border-radius:8px}.schema-canvas .vue-flow__minimap-node{fill:color-mix(in srgb,var(--de-accent) 45%,transparent);stroke:none}.schema-canvas .vue-flow__minimap-mask{fill:color-mix(in srgb,var(--de-bg) 55%,transparent)}.schema-node{min-width:210px;max-width:290px;border-radius:14px;overflow:hidden;background:var(--de-surface);border:1px solid var(--de-border);box-shadow:0 6px 18px #00000029;transition:box-shadow .15s}.schema-node:hover{box-shadow:0 6px 18px #00000029}.schema-node--selected{outline:2px solid var(--de-accent)}.schema-node__header{padding:8px 12px;display:flex;align-items:center;gap:8px;background:color-mix(in srgb,var(--de-accent) 14%,transparent);border-bottom:1px solid var(--de-border)}.schema-node__header-name{min-width:0;font-size:12.5px;font-weight:700;color:var(--de-fg);flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.schema-node__header-count{font-size:9px;color:var(--de-muted);font-variant-numeric:tabular-nums}.schema-node__columns{padding:4px 0}.schema-node__col{position:relative;padding:3px 12px;display:flex;align-items:center;gap:6px;height:26px}.schema-node__col:hover{background:var(--de-hover)}.schema-node__handle{width:7px!important;height:7px!important;border-radius:50%!important;background:var(--de-muted)!important;border:none!important}.schema-node__handle--target{left:0!important;transform:translate(-50%)!important}.schema-node__handle--source{right:0!important;transform:translate(50%)!important}.schema-node__col:hover .schema-node__handle{background:var(--de-accent)!important}.schema-node__col-name{min-width:0;flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--de-fg);font-family:var(--km-mono, monospace);font-size:10.5px}.schema-node__badge{flex-shrink:0;font-size:9px;font-weight:700;padding:1px 4px;border-radius:6px}.schema-node__badge--pk{background:color-mix(in srgb,var(--de-key-pk) 18%,transparent);color:var(--de-key-pk)}.schema-node__badge--uq{background:color-mix(in srgb,var(--de-key-uq) 18%,transparent);color:var(--de-key-uq)}.schema-node__badge--nn{background:color-mix(in srgb,var(--de-key-nn) 16%,transparent);color:var(--de-key-nn)}.schema-node__col-type{font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:.3px;color:var(--de-muted);flex-shrink:0}.schema-node__empty{padding:8px 12px;font-size:10px;color:var(--de-muted);font-style:italic}.de-panel{position:absolute;top:0;right:0;bottom:0;width:min(400px,100%);background:var(--de-surface);border-left:1px solid var(--de-border);display:flex;flex-direction:column;z-index:10;box-shadow:0 6px 18px #00000029}.de-panel-head{display:flex;align-items:center;gap:8px;padding:10px 12px;border-bottom:1px solid var(--de-border)}.de-panel-kind{font-size:10px;font-weight:800;letter-spacing:.6px;color:var(--de-fg);flex-shrink:0}.de-panel-name{flex:1;min-width:0;font-weight:700;font-size:13px;background:transparent;border:1px solid transparent;border-radius:8px;color:inherit;padding:3px 6px}.de-panel-name:focus{outline:none;border-color:var(--de-accent);background:var(--de-bg)}.de-panel-desc{margin:8px 12px 0;background:var(--de-bg);border:1px solid var(--de-border);border-radius:6px;color:var(--de-fg);font:inherit;font-size:11.5px;padding:6px 8px}.de-panel-desc:focus{outline:none;border-color:var(--de-accent)}.de-panel-desc::placeholder{color:var(--de-muted)}.de-panel-label{padding:10px 12px 4px;font-size:9px;font-weight:800;letter-spacing:.5px;text-transform:uppercase;color:var(--de-muted);display:flex;align-items:center;gap:6px}.de-panel-cols{flex:1;min-height:0;overflow-y:auto;padding:8px;display:flex;flex-direction:column;gap:5px}.de-panel-col{display:grid;grid-template-columns:minmax(0,1fr) auto auto auto auto auto;align-items:center;gap:4px}.de-col-name{flex:1;min-width:0;background:var(--de-bg);border:1px solid var(--de-border);border-radius:8px;color:inherit;font:inherit;font-size:11.5px;padding:4px 6px;box-sizing:border-box}.de-col-name:focus{outline:none;border-color:var(--de-accent)}.de-col-type{background:var(--de-bg);border:1px solid var(--de-border);border-radius:8px;color:var(--de-muted);font-size:10px;padding:3px}.de-flag{border:1px solid var(--de-border);background:transparent;color:var(--de-muted);font-size:10px;font-weight:700;border-radius:8px;padding:3px 4px;cursor:pointer;flex-shrink:0}.de-flag.de-pk.on{color:var(--de-key-pk);border-color:var(--de-key-pk)}.de-flag.de-uq.on{color:var(--de-key-uq);border-color:var(--de-key-uq)}.de-flag.de-nn.on{color:var(--de-key-nn);border-color:var(--de-key-nn)}.de-panel-foot{display:flex;gap:8px;padding:10px 12px;border-top:1px solid var(--de-border)}.de-x{border:0;background:transparent;color:var(--de-muted);cursor:pointer;font-size:15px;line-height:1;padding:0 2px}.de-x:hover{color:var(--p-danger-color)}.de-x-sm{font-size:13px}.de-rel-badge{font-size:9px;font-weight:800;padding:2px 7px;border-radius:6px}.de-rel-ends{display:flex;align-items:center;gap:8px;padding:12px}.de-rel-end{flex:1;min-width:0;display:flex;flex-direction:column;gap:2px;background:var(--de-bg);border:1px solid var(--de-border);border-radius:6px;padding:7px 9px}.de-rel-tbl{font-size:12px;font-weight:700;color:var(--de-fg);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.de-rel-col{font-size:10px;color:var(--de-muted);font-family:var(--km-mono, monospace);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.de-rel-arrow{font-size:16px;font-weight:700;flex-shrink:0}.de-rel-section{padding:4px 12px 8px}.de-rel-types{display:grid;grid-template-columns:repeat(4,1fr);gap:6px}.de-rel-type{border:1px solid var(--de-border);background:var(--de-bg);color:var(--de-muted);font:inherit;font-size:12px;font-weight:700;padding:7px 0;border-radius:6px;cursor:pointer;transition:border-color .1s,color .1s,background .1s}.de-rel-type:hover{color:var(--de-fg)}.de-rel-type.on{background:var(--de-hover)}.de-ctx-overlay{position:fixed;inset:0;z-index:50}.de-ctx{position:absolute;max-height:100%;max-width:100%;overflow:auto;min-width:160px;background:var(--de-surface);border:1px solid var(--de-border);border-radius:8px;padding:4px;box-shadow:0 6px 18px #00000029;display:flex;flex-direction:column}.de-ctx-item{display:block;width:100%;text-align:left;border:0;background:transparent;color:var(--de-fg);font:inherit;font-size:12px;padding:6px 10px;border-radius:8px;cursor:pointer;white-space:nowrap}.de-ctx-item:hover{background:var(--de-hover);color:var(--de-accent)}.de-ctx-danger:hover{color:var(--p-danger-color)}.de-empty{position:absolute;top:50%;left:0;right:0;transform:translateY(-50%);text-align:center;color:var(--de-muted);font-size:13px;pointer-events:none}.schema-canvas .vue-flow__node.de-dim,.schema-canvas .vue-flow__edge.de-dim{opacity:.22;transition:opacity .12s ease}.schema-canvas .vue-flow__node,.schema-canvas .vue-flow__edge{transition:opacity .12s ease}.schema-canvas .vue-flow__edge.de-edge-hot path.vue-flow__edge-path{stroke-width:2.6}button:focus-visible,input:focus-visible,select:focus-visible,textarea:focus-visible,[tabindex]:focus-visible{outline:var(--p-focus-ring-width) var(--p-focus-ring-style) var(--p-focus-ring-color);outline-offset:var(--p-focus-ring-offset);box-shadow:var(--p-focus-ring-shadow)}input[type=checkbox],input[type=range]{accent-color:var(--p-primary-color)}.de-read-description{padding:0 12px;overflow-wrap:anywhere;font-size:13px}.de-read-columns{padding:0 12px;overflow-y:auto;font-size:13px}.de-read-columns dt{overflow-wrap:anywhere;font-weight:600}.de-read-columns dd{margin:4px 0 12px;color:var(--p-text-muted-color)}", d1 = [s1, a1, l1, u1, c1].join(`
`);
class f1 extends gu {
  static get wippyConfig() {
    return {
      propsSchema: { type: "object", properties: { "entry-id": { type: "string" }, mode: { type: "string" }, "read-only": { type: "boolean", default: !1, description: "Disables editing while retaining full reading and inspection controls." } } },
      hostCssKeys: ["themeConfigUrl", "iframeCssUrl"],
      inlineCss: d1
    };
  }
  static get vueConfig() {
    return { rootComponent: r1 };
  }
}
Hl(import.meta.url, f1);
//# sourceMappingURL=index.js.map
