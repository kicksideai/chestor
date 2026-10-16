import { hasInjectionContext as Wt, inject as st, effectScope as qt, ref as Y, markRaw as Xt, createApp as Gt, defineComponent as ee, watch as be, nextTick as ge, onMounted as at, onBeforeUnmount as Ee, openBlock as a, createElementBlock as c, withModifiers as j, createElementVNode as o, normalizeStyle as H, Fragment as M, renderList as P, normalizeClass as U, toDisplayString as $, createVNode as V, unref as N, createTextVNode as ie, createCommentVNode as R, withKeys as ve, computed as D, createBlock as oe } from "vue";
import { addCollection as Jt, Icon as J } from "@iconify/vue";
import { config as Xe, addIcons as Qt, on as lt, applyThemeMode as we, host as Zt, hostCss as er, loadCss as tr, api as ke, define as rr } from "@wippy-fe/proxy";
var Ae = "data-wippy-visible";
function Ge(e) {
  const t = e.getAttribute(Ae);
  return t === "true" ? !0 : t === "false" ? !1 : null;
}
var nr = Object.defineProperty, ir = (e, t, r) => t in e ? nr(e, t, { enumerable: !0, configurable: !0, writable: !0, value: r }) : e[t] = r, B = (e, t, r) => ir(e, typeof t != "symbol" ? t + "" : t, r), or = [
  "themeConfigUrl",
  "primeVueCssUrl",
  "markdownCssUrl",
  "iframeCssUrl"
], sr = [
  ":where([data-wippy-theme-root]).w-theme-light",
  ":where([data-wippy-theme-root]).w-theme-dark"
].join(`,
`);
function Je(e) {
  const t = e.startsWith("--") ? e : `--${e}`;
  return /^--[-\w\u0080-\uFFFF]+$/.test(t) ? t : null;
}
function ar(...e) {
  const t = /* @__PURE__ */ new Set();
  for (const r of e)
    if (r)
      for (const [n, i] of Object.entries(r)) {
        if ((n === "@light" || n === "@dark") && i && typeof i == "object") {
          for (const [v, p] of Object.entries(i)) {
            const l = typeof p == "string" ? Je(v) : null;
            l && t.add(l);
          }
          continue;
        }
        const s = typeof i == "string" ? Je(n) : null;
        s && t.add(s);
      }
  return [...t].sort();
}
function lr(e) {
  if (e.length === 0)
    return "";
  const t = e.map((r) => `  ${r}: inherit;`).join(`
`);
  return `${sr} {
${t}
}`;
}
function dr(e, t) {
  const r = lr(t);
  r && dt(e, r, "@wippy-fe/css-variables-bridge");
}
function cr(e, t) {
  const n = (t ?? or).map(async (i) => {
    const s = er[i];
    if (!s)
      return console.warn(`[wippy-fe/webcomponent-core] hostCss key "${i}" is undefined — skipping. Remove it from hostCssKeys if the CSS was removed.`), null;
    try {
      return await tr(s);
    } catch (v) {
      return console.warn(`[wippy-fe/webcomponent-core] Failed to load hostCss "${i}" (${s}):`, v), null;
    }
  });
  return Promise.all(n).then((i) => {
    for (const s of i) {
      if (!s)
        continue;
      const v = document.createElement("style");
      v.textContent = s, v.setAttribute("role", "@wippy-fe/host-css"), e.appendChild(v);
    }
  });
}
function ur(e, t) {
  const r = document.createElement("style");
  r.textContent = t, e.appendChild(r);
}
function dt(e, t, r) {
  if (typeof CSSStyleSheet < "u" && "replaceSync" in CSSStyleSheet.prototype) {
    const i = new CSSStyleSheet();
    i.replaceSync(t), e.adoptedStyleSheets = [...e.adoptedStyleSheets, i];
    return;
  }
  const n = document.createElement("style");
  n.setAttribute("role", r), n.textContent = t, e.appendChild(n);
}
function mr(e, t) {
  dt(e, t, "@wippy-fe/custom-css");
}
function ct(e) {
  return e.__wippyHost ?? null;
}
function pr(e) {
  return e.replace(/-([a-z])/g, (t, r) => r.toUpperCase());
}
function vr(e, t, r) {
  switch (r.type) {
    case "string":
      return { value: t };
    case "number": {
      const n = Number.parseFloat(t);
      return Number.isNaN(n) ? { value: void 0, error: `Invalid ${e}: expected a number` } : { value: n };
    }
    case "integer": {
      const n = Number.parseInt(t, 10);
      return Number.isNaN(n) ? { value: void 0, error: `Invalid ${e}: expected an integer` } : { value: n };
    }
    case "boolean":
      return { value: t !== "false" };
    case "array":
    case "object":
      try {
        const n = JSON.parse(t);
        return r.type === "array" && !Array.isArray(n) ? { value: void 0, error: `Invalid ${e}: expected a JSON array` } : { value: n };
      } catch {
        return { value: void 0, error: `Invalid ${e}: must be valid JSON` };
      }
    default:
      return { value: t };
  }
}
function ze(e, t) {
  const r = {}, n = [];
  for (const [i, s] of Object.entries(t.properties)) {
    const v = e.getAttribute(i), p = pr(i);
    if (v === null) {
      s.default !== void 0 && (r[p] = s.default);
      continue;
    }
    const l = vr(i, v, s);
    l.error ? n.push(l.error) : r[p] = l.value;
  }
  return { props: r, errors: n };
}
var fr = class {
  constructor(e, t) {
    B(this, "_props"), B(this, "_errors"), B(this, "_content"), B(this, "_hostVisibility"), B(this, "_propsListeners", /* @__PURE__ */ new Set()), B(this, "_contentListeners", /* @__PURE__ */ new Set()), B(this, "_hostVisibilityListeners", /* @__PURE__ */ new Set()), B(this, "_disposed", !1), B(this, "_emitToDom"), B(this, "props"), B(this, "events"), B(this, "content"), B(this, "hostVisibility"), this._props = e.props, this._errors = e.errors, this._content = e.content, this._hostVisibility = e.hostVisibility, this._emitToDom = t;
    const r = this;
    this.props = {
      get value() {
        return r._props;
      },
      get errors() {
        return r._errors;
      },
      subscribe(n, i) {
        return r._subscribeProps(n, i);
      }
    }, this.events = {
      emit(n, i) {
        r._disposed || r._emitToDom(n, i);
      }
    }, this.content = e.hasContent ? {
      get value() {
        return r._content;
      },
      subscribe(n, i) {
        return r._subscribeContent(n, i);
      }
    } : null, this.hostVisibility = {
      get value() {
        return r._hostVisibility;
      },
      subscribe(n, i) {
        return r._subscribeHostVisibility(n, i);
      }
    };
  }
  /** @internal */
  notifyProps(e, t) {
    if (!this._disposed) {
      this._props = e, this._errors = t;
      for (const r of this._propsListeners)
        r(e, t);
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
      for (const r of this._hostVisibilityListeners)
        r(e, t);
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
    const r = () => {
      this._propsListeners.delete(e), t?.signal?.removeEventListener("abort", r);
    };
    return t?.signal?.addEventListener("abort", r, { once: !0 }), r;
  }
  _subscribeContent(e, t) {
    if (this._disposed || t?.signal?.aborted)
      return () => {
      };
    this._contentListeners.add(e), t?.immediate && e(this._content);
    const r = () => {
      this._contentListeners.delete(e), t?.signal?.removeEventListener("abort", r);
    };
    return t?.signal?.addEventListener("abort", r, { once: !0 }), r;
  }
  _subscribeHostVisibility(e, t) {
    if (this._disposed || t?.signal?.aborted)
      return () => {
      };
    this._hostVisibilityListeners.add(e), t?.immediate && e(this._hostVisibility, this._hostVisibility);
    const r = () => {
      this._hostVisibilityListeners.delete(e), t?.signal?.removeEventListener("abort", r);
    };
    return t?.signal?.addEventListener("abort", r, { once: !0 }), r;
  }
}, hr = class extends HTMLElement {
  constructor() {
    super(), B(this, "_internals"), B(this, "_contentObserver", null), B(this, "_initialized", !1), B(this, "_container", null), B(this, "_reactive", null), B(this, "_lastProps", null), B(this, "_lastErrors", []), B(this, "_lastContent", null), B(this, "_themeUnsub", null), B(this, "_hostVisible", null), this._internals = this.attachInternals(), this._hostVisible = Ge(this);
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
    const e = this.wippyConfig, t = Object.keys(e.propsSchema.properties), r = e.extraObservedAttributes ?? [];
    return [.../* @__PURE__ */ new Set([...t, ...r, Ae])];
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
    return ct(this);
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
      let r, n;
      if (this._lastProps !== null)
        r = this._lastProps, n = this._lastErrors;
      else {
        const s = ze(this, e.propsSchema);
        e.validateProps && s.errors.push(...e.validateProps(s.props)), r = s.props, n = s.errors, this._lastProps = r, this._lastErrors = n;
      }
      const i = t ? this._lastContent ?? this._extractContent(e.contentTemplate) : null;
      t && this._lastContent === null && (this._lastContent = i), this._reactive = new fr(
        { props: r, errors: n, content: i, hasContent: t, hostVisibility: this._hostVisible },
        this.emitEvent.bind(this)
      );
    }
    return this._reactive;
  }
  // ── Lifecycle ──────────────────────────────────────────────
  connectedCallback() {
    this._internals.states.add("loading");
    try {
      const e = this.constructor.wippyConfig, t = this._initialized, r = this.shadowRoot ?? this.attachShadow({ mode: e.shadowMode ?? "open" });
      let n;
      if (t)
        n = this._container;
      else {
        this.onInit(r), e.inlineCss && ur(r, e.inlineCss);
        try {
          const u = Xe?.theming, b = ar(
            u?.global?.cssVariables,
            u?.children?.cssVariables
          );
          dr(r, b);
        } catch {
        }
        if (e.customCss !== !1)
          try {
            const u = Xe?.theming, b = [u?.global?.customCSS, u?.children?.customCSS].filter(Boolean).join(`
`);
            b && mr(r, b);
          } catch {
          }
        (e.hostCssKeys === void 0 || e.hostCssKeys.length > 0) && cr(r, e.hostCssKeys), n = document.createElement("div"), n.setAttribute("data-wippy-theme-root", "");
        const l = e.containerClasses ?? [];
        l.length > 0 && n.classList.add(...l), r.appendChild(n), this._container = n, Qt(Jt);
      }
      this._applyTheme(), this._themeUnsub || (this._themeUnsub = lt("@theme", (l) => this._applyTheme(l)));
      const { props: i, errors: s } = ze(this, e.propsSchema);
      e.validateProps && s.push(...e.validateProps(i));
      const v = i;
      this._lastProps = v, this._lastErrors = s;
      let p = null;
      e.contentTemplate && (p = this._extractContent(e.contentTemplate), this._lastContent = p, this._contentObserver = new MutationObserver(() => {
        const l = this._extractContent(e.contentTemplate);
        this._lastContent = l, this._reactive?.notifyContent(l), this.onContentChanged(l);
      }), this._contentObserver.observe(this, {
        childList: !0,
        characterData: !0,
        subtree: !0
      })), this.onMount(r, n, v, s, p, t), this._internals.states.delete("loading"), this._internals.states.add("ready"), t || (this._initialized = !0), this.onReady(), this.emitEvent("load");
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
  _applyTheme(e = Zt.getThemeMode?.()) {
    we(e, this), this._container && we(e, this._container);
  }
  disconnectedCallback() {
    this._themeUnsub && (this._themeUnsub(), this._themeUnsub = null), we("auto", this), this._container && we("auto", this._container), this._contentObserver && (this._contentObserver.disconnect(), this._contentObserver = null), this.onUnmount(), this.emitEvent("unload"), this._internals.states.clear(), this._reactive?.dispose(), this._reactive = null, this._lastProps = null, this._lastErrors = [], this._lastContent = null, delete this.__wippyHost, delete this.__wippyHostBus;
  }
  attributeChangedCallback(e, t, r) {
    if (t === r)
      return;
    if (e === Ae) {
      const p = this._hostVisible, l = Ge(this);
      if (l === p)
        return;
      this._hostVisible = l, this.isConnected && this._initialized && (this._reactive?.notifyHostVisibility(l, p), this.onHostVisibilityChanged(l, p));
      return;
    }
    const n = this.constructor.wippyConfig, { props: i, errors: s } = ze(this, n.propsSchema);
    n.validateProps && s.push(...n.validateProps(i));
    const v = i;
    this._lastProps = v, this._lastErrors = s, this._reactive?.notifyProps(v, s), this.onPropsChanged(v, s);
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
function br(e) {
  return e.__wippyHostBus ?? null;
}
function gr(e) {
  return e.dataset.wippyPanelId ?? null;
}
/*!
 * pinia v4.0.3
 * (c) 2026 Eduardo San Martin Morote
 * @license MIT
 */
let ut;
const mt = (e) => ut = e, yr = () => Wt() && st(pt) || ut, pt = (
  /* istanbul ignore next */
  Symbol()
);
function xr() {
  const e = qt(!0), t = e.run(() => Y({}));
  let r = [], n = [];
  const i = Xt({
    install(s) {
      mt(i), i._a = s, s.provide(pt, i), s.config.globalProperties.$pinia = i, n.forEach((v) => r.push(v)), n = [];
    },
    use(s) {
      return this._a ? r.push(s) : n.push(s), this;
    },
    _p: r,
    _a: null,
    _e: e,
    _s: /* @__PURE__ */ new Map(),
    state: t
  });
  return i;
}
var _r = Object.defineProperty, wr = (e, t, r) => t in e ? _r(e, t, { enumerable: !0, configurable: !0, writable: !0, value: r }) : e[t] = r, pe = (e, t, r) => wr(e, typeof t != "symbol" ? t + "" : t, r), kr = /* @__PURE__ */ Symbol("wippy:emit"), vt = /* @__PURE__ */ Symbol("wippy:props"), Cr = /* @__PURE__ */ Symbol("wippy:props_error"), Er = /* @__PURE__ */ Symbol("wippy:content"), $r = /* @__PURE__ */ Symbol("wippy:panel-id"), Sr = /* @__PURE__ */ Symbol("wippy:layout-bus"), Ir = /* @__PURE__ */ Symbol("wippy:host"), Dr = /* @__PURE__ */ Symbol("wippy:host-visibility");
function Mr() {
  const e = st(vt);
  if (!e)
    throw new Error("useProps() must be called inside a WippyVueElement");
  return e;
}
var zr = class extends hr {
  constructor() {
    super(...arguments), pe(this, "_vueApp", null), pe(this, "_propsRef", Y({})), pe(this, "_errorsRef", Y([])), pe(this, "_contentRef", Y(null)), pe(this, "_hostVisibilityRef", Y(null)), pe(this, "_bridgeAbort", null);
  }
  /**
   * Override to provide Vue-specific configuration.
   */
  static get vueConfig() {
    throw new Error("WippyVueElement subclass must override static get vueConfig()");
  }
  onMount(e, t, r, n, i, s) {
    const v = this.constructor.vueConfig;
    this._propsRef.value = r, this._errorsRef.value = n, this._contentRef.value = i ?? null, this._hostVisibilityRef.value = this.hostVisible;
    for (const u of n)
      this.emitEvent("invalid", { message: u });
    const p = new AbortController();
    this._bridgeAbort = p, this.reactive.props.subscribe((u, b) => {
      this._propsRef.value = u, this._errorsRef.value = [...b];
      for (const g of b)
        this.emitEvent("invalid", { message: g });
    }, { signal: p.signal }), this.reactive.content && this.reactive.content.subscribe((u) => {
      this._contentRef.value = u;
    }, { signal: p.signal }), this.reactive.hostVisibility.subscribe((u) => {
      this._hostVisibilityRef.value = u;
    }, { signal: p.signal });
    const l = (u) => {
      if (p.signal.aborted)
        return;
      const b = yr(), g = Gt(u.rootComponent);
      this._vueApp = g;
      const x = xr();
      if (u.piniaPlugins)
        for (const S of u.piniaPlugins)
          x.use(S);
      if (g.use(x), u.plugins)
        for (const S of u.plugins)
          g.use(S);
      g.provide(vt, this._propsRef), g.provide(Cr, this._errorsRef), g.provide(kr, this.emitEvent.bind(this)), g.provide(Er, this._contentRef), g.provide(Dr, this._hostVisibilityRef), g.provide($r, gr(this)), g.provide(Sr, br(this)), g.provide(Ir, ct(this)), u.providers && u.providers(g, this), g.mount(t), b && mt(b);
    };
    if (v.rootComponent)
      l(v);
    else if (v.lazyConfig) {
      const u = document.createElement("wippy-loading");
      u.setAttribute("no-bg", ""), t.appendChild(u), v.lazyConfig().then((b) => {
        p.signal.aborted || (u.remove(), l(b));
      }).catch((b) => {
        if (p.signal.aborted)
          return;
        const g = b instanceof Error ? b.message : String(b), x = document.createElement("wippy-error");
        x.setAttribute("title", "Failed to load"), x.setAttribute("message", g), u.replaceWith(x), this.emitEvent("error", { message: g });
      });
    } else
      throw new Error("WippyVueElement vueConfig must provide rootComponent or lazyConfig");
  }
  onUnmount() {
    this._bridgeAbort?.abort(), this._bridgeAbort = null, this._vueApp && (this._vueApp.unmount(), this._vueApp = null);
  }
};
const Pr = ["disabled", "onClick"], Tr = /* @__PURE__ */ ee({
  __name: "ContextMenu",
  props: {
    x: {},
    y: {},
    items: {}
  },
  emits: ["close"],
  setup(e, { emit: t }) {
    const r = e, n = Y(null), i = Y(null), s = Y({ left: "0px", top: "0px", visibility: "hidden" });
    function v() {
      const u = n.value?.getBoundingClientRect(), b = i.value?.getBoundingClientRect();
      if (!u || !b) return;
      const g = Math.max(0, Math.min(r.x - u.left, u.width - b.width)), x = Math.max(0, Math.min(r.y - u.top, u.height - b.height));
      s.value = { left: `${g}px`, top: `${x}px`, visibility: "visible" };
    }
    be(() => [r.x, r.y], () => {
      ge(v);
    }), at(() => {
      ge(v), window.addEventListener("resize", v);
    }), Ee(() => window.removeEventListener("resize", v));
    const p = t;
    function l(u) {
      u.action(), p("close");
    }
    return (u, b) => (a(), c("div", {
      ref_key: "layer",
      ref: n,
      class: "rm-ctx-overlay",
      onClick: b[2] || (b[2] = (g) => p("close")),
      onContextmenu: b[3] || (b[3] = j((g) => p("close"), ["prevent"]))
    }, [
      o("div", {
        ref_key: "panel",
        ref: i,
        class: "rm-ctx",
        style: H(s.value),
        onClick: b[0] || (b[0] = j(() => {
        }, ["stop"])),
        onContextmenu: b[1] || (b[1] = j(() => {
        }, ["prevent", "stop"]))
      }, [
        (a(!0), c(M, null, P(e.items, (g, x) => (a(), c("button", {
          key: x,
          class: U(["rm-ctx-item", { "rm-ctx-danger": g.danger }]),
          disabled: g.disabled,
          onClick: (S) => l(g)
        }, $(g.label), 11, Pr))), 128))
      ], 36)
    ], 544));
  }
}), Ar = { class: "rm-empty" }, Rr = {
  key: 0,
  class: "rm-empty-actions"
}, Nr = {
  key: 1,
  class: "rm-empty-starter"
}, Or = {
  key: 2,
  class: "rm-empty-starter"
}, Lr = /* @__PURE__ */ ee({
  __name: "EmptyState",
  props: {
    editable: { type: Boolean },
    starter: {}
  },
  emits: ["add-layer", "add-starter"],
  setup(e, { emit: t }) {
    const r = t;
    return (n, i) => (a(), c("div", Ar, [
      V(N(J), {
        class: "rm-empty-icon",
        icon: "tabler:layout-rows",
        "aria-hidden": "true"
      }),
      i[3] || (i[3] = o("h2", null, "No layers yet", -1)),
      i[4] || (i[4] = o("p", null, " A roadmap is drawn in layers — the lanes of the timeline, the strata of the build order. Add the first one, or start from a set you can rename. ", -1)),
      e.editable ? (a(), c("div", Rr, [
        o("button", {
          class: "rm-btn rm-btn--primary",
          onClick: i[0] || (i[0] = (s) => r("add-layer"))
        }, [
          V(N(J), {
            icon: "tabler:plus",
            "aria-hidden": "true"
          }),
          i[2] || (i[2] = ie("Add a layer ", -1))
        ]),
        o("button", {
          class: "rm-btn",
          onClick: i[1] || (i[1] = (s) => r("add-starter"))
        }, [
          V(N(J), {
            icon: "tabler:stack-2",
            "aria-hidden": "true"
          }),
          ie("Add " + $(e.starter.length) + " starter layers ", 1)
        ])
      ])) : R("", !0),
      e.editable ? (a(), c("p", Nr, $(e.starter.join(" · ")), 1)) : (a(), c("p", Or, "Open this roadmap in full mode to add one."))
    ]));
  }
}), Vr = ["title", "aria-label"], Le = /* @__PURE__ */ ee({
  __name: "ConfidenceMeter",
  props: {
    confidence: {}
  },
  setup(e) {
    return (t, r) => (a(), c("span", {
      class: U(["rm-conf", `rm-conf--${e.confidence}`]),
      title: `confidence: ${e.confidence}`,
      "aria-label": `confidence ${e.confidence}`
    }, [...r[0] || (r[0] = [
      o("i", null, null, -1),
      o("i", null, null, -1),
      o("i", null, null, -1)
    ])], 10, Vr));
  }
}), Ur = ["aria-label"], Kr = {
  key: 0,
  d: "M5 1a4 4 0 0 1 0 8z"
}, Br = {
  key: 1,
  d: "M2.5 2.5 7.5 7.5"
}, fe = /* @__PURE__ */ ee({
  __name: "StatusGlyph",
  props: {
    status: {},
    color: {},
    title: {}
  },
  setup(e) {
    return (t, r) => (a(), c("svg", {
      class: U(["rm-st", `rm-st--${e.status}`]),
      viewBox: "0 0 10 10",
      style: H({ "--rm-glyph": e.color || "currentColor" }),
      role: "img",
      "aria-label": e.title || e.status
    }, [
      o("title", null, $(e.title || e.status), 1),
      r[0] || (r[0] = o("circle", {
        cx: "5",
        cy: "5",
        r: "4"
      }, null, -1)),
      e.status === "active" ? (a(), c("path", Kr)) : R("", !0),
      e.status === "dropped" ? (a(), c("path", Br)) : R("", !0)
    ], 14, Ur));
  }
}), Yr = /^(\d{4})-Q([1-4])$/, jr = /^(\d{4})-(0[1-9]|1[0-2])$/, ft = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
function ht(e) {
  return e === "month" ? 12 : 4;
}
function Ve(e, t) {
  const r = (t === "month" ? jr : Yr).exec(String(e || ""));
  return r ? { year: Number(r[1]), unit: Number(r[2]) } : null;
}
function Q(e, t) {
  const r = Ve(e, t);
  return r ? r.year * ht(t) + (r.unit - 1) : null;
}
function ye(e, t) {
  const r = ht(t), n = Math.floor(e / r), i = e - n * r + 1;
  return t === "month" ? `${n}-${String(i).padStart(2, "0")}` : `${n}-Q${i}`;
}
function Fr(e, t, r) {
  const n = Q(e, r);
  return n === null ? null : ye(n + t, r);
}
function Hr(e, t, r) {
  const n = Q(e, r), i = Math.max(1, Math.floor(t) || 0);
  if (n === null) return [];
  const s = [];
  for (let v = 0; v < i; v++) s.push(ye(n + v, r));
  return s;
}
function $e(e, t) {
  const r = Ve(e, t);
  if (!r) return e || "—";
  const n = `’${String(r.year % 100).padStart(2, "0")}`;
  return t === "month" ? `${ft[r.unit - 1]} ${n}` : `Q${r.unit} ${n}`;
}
function Re(e, t) {
  const r = Ve(e, t);
  return r ? t === "month" ? `${ft[r.unit - 1]} ${r.year}` : `Q${r.unit} ${r.year}` : e || "—";
}
function bt(e, t, r, n = 4) {
  const i = Q(e, r);
  if (i === null) return [];
  const s = Math.max(1, Math.floor(t) || 0), v = [];
  for (let p = -n; p < s + n; p++) v.push(ye(i + p, r));
  return v;
}
const Wr = { class: "rm-hz" }, qr = ["onDrop"], Xr = { class: "rm-hz-head" }, Gr = { class: "rm-hz-group" }, Jr = ["draggable", "onDragstart", "onClick", "onKeydown", "onContextmenu"], Qr = { class: "rm-card-title" }, Zr = { class: "rm-card-meta" }, en = { class: "rm-lchip" }, tn = { class: "rm-size" }, rn = {
  key: 0,
  class: "rm-card-period"
}, nn = {
  key: 0,
  class: "rm-hz-empty"
}, on = /* @__PURE__ */ ee({
  __name: "HorizonsLens",
  props: {
    columns: {},
    periodKind: {},
    selectedId: {},
    trace: {},
    editable: { type: Boolean }
  },
  emits: ["select", "schedule", "context"],
  setup(e, { emit: t }) {
    const r = e, n = t;
    function i(l) {
      return r.trace.selected ? {
        "is-sel": l === r.trace.selected,
        "is-need": r.trace.needs.has(l),
        "is-unlock": r.trace.unlocks.has(l),
        "is-dim": !r.trace.chain.has(l)
      } : {};
    }
    function s(l, u) {
      r.editable && (l.dataTransfer?.setData("text/plain", u.id), l.dataTransfer && (l.dataTransfer.effectAllowed = "move"));
    }
    function v(l, u) {
      if (!r.editable) return;
      const b = l.dataTransfer?.getData("text/plain") || "";
      b && n("schedule", b, u);
    }
    function p(l) {
      return { "--rm-layer": l.color || "var(--rm-accent)" };
    }
    return (l, u) => (a(), c("div", Wr, [
      (a(!0), c(M, null, P(e.columns, (b) => (a(), c("section", {
        key: b.horizon,
        class: U(["rm-hz-col", { "is-droppable": e.editable }]),
        onDragover: u[0] || (u[0] = j(() => {
        }, ["prevent"])),
        onDrop: j((g) => v(g, b.horizon), ["prevent"])
      }, [
        o("header", Xr, [
          o("b", null, $(b.title), 1),
          o("span", null, $(b.hint), 1),
          o("em", null, $(b.count), 1)
        ]),
        (a(!0), c(M, null, P(b.groups, (g) => (a(), c(M, {
          key: g.layer.id
        }, [
          o("div", Gr, $(g.layer.title), 1),
          (a(!0), c(M, null, P(g.initiatives, (x) => (a(), c("article", {
            key: x.id,
            class: U(["rm-card", [i(x.id), { "rm-card--low": x.confidence === "low" }]]),
            style: H(p(g.layer)),
            role: "button",
            tabindex: "0",
            draggable: e.editable,
            onDragstart: (S) => s(S, x),
            onClick: (S) => n("select", "initiative", x.id),
            onKeydown: [
              ve(j((S) => n("select", "initiative", x.id), ["prevent"]), ["enter"]),
              ve(j((S) => n("select", "initiative", x.id), ["prevent"]), ["space"])
            ],
            onContextmenu: j((S) => n("context", S, "initiative", x.id), ["prevent"])
          }, [
            o("div", Qr, [
              V(fe, {
                status: x.status,
                color: g.layer.color
              }, null, 8, ["status", "color"]),
              o("span", null, $(x.title), 1)
            ]),
            o("div", Zr, [
              o("span", en, [
                o("i", {
                  class: "rm-dot",
                  style: H({ "--rm-dot-color": g.layer.color || "var(--rm-accent)" })
                }, null, 4),
                ie($(g.layer.title), 1)
              ]),
              o("span", tn, $(x.size), 1),
              V(Le, {
                confidence: x.confidence
              }, null, 8, ["confidence"]),
              x.start_period ? (a(), c("span", rn, $(N($e)(x.start_period, e.periodKind)), 1)) : R("", !0)
            ])
          ], 46, Jr))), 128))
        ], 64))), 128)),
        b.groups.length ? R("", !0) : (a(), c("p", nn, "Nothing here."))
      ], 42, qr))), 128))
    ]));
  }
}), sn = [
  { label: "Accent", value: "var(--p-primary-color)" },
  { label: "Muted", value: "var(--p-text-muted-color)" },
  { label: "Soft accent", value: "color-mix(in srgb, var(--p-primary-color) 45%, var(--p-text-color))" },
  { label: "Medium accent", value: "color-mix(in srgb, var(--p-primary-color) 70%, var(--p-text-color))" },
  { label: "Strong accent", value: "color-mix(in srgb, var(--p-primary-color) 85%, var(--p-text-color))" }
], gt = ["idea", "planned", "active", "done", "dropped"], an = ["low", "med", "high"], ln = ["S", "M", "L", "XL"], dn = ["requires", "informs"], Ne = ["timeline", "horizons", "strata", "outcomes"], F = {
  LAYER_ADDED: "chestor.roadmap.events:layer.added",
  LAYER_UPDATED: "chestor.roadmap.events:layer.updated",
  LAYER_REMOVED: "chestor.roadmap.events:layer.removed",
  OUTCOME_ADDED: "chestor.roadmap.events:outcome.added",
  OUTCOME_UPDATED: "chestor.roadmap.events:outcome.updated",
  OUTCOME_REMOVED: "chestor.roadmap.events:outcome.removed",
  INITIATIVE_ADDED: "chestor.roadmap.events:initiative.added",
  INITIATIVE_UPDATED: "chestor.roadmap.events:initiative.updated",
  INITIATIVE_REMOVED: "chestor.roadmap.events:initiative.removed",
  DEPENDENCY_ADDED: "chestor.roadmap.events:dependency.added",
  DEPENDENCY_UPDATED: "chestor.roadmap.events:dependency.updated",
  DEPENDENCY_REMOVED: "chestor.roadmap.events:dependency.removed",
  MILESTONE_ADDED: "chestor.roadmap.events:milestone.added",
  MILESTONE_UPDATED: "chestor.roadmap.events:milestone.updated",
  MILESTONE_REMOVED: "chestor.roadmap.events:milestone.removed",
  SETTINGS_UPDATED: "chestor.roadmap.events:roadmap.settings-updated",
  LENS_STATE_SET: "chestor.roadmap.events:roadmap.lens-state-set"
}, cn = "chestor.roadmap:state", Qe = {
  period_kind: "quarter",
  origin: "",
  columns: 5,
  default_lens: "timeline",
  lens_state: {}
}, un = { class: "rm-form" }, mn = { class: "rm-field" }, pn = ["value", "disabled"], vn = { class: "rm-field" }, fn = ["value", "disabled"], hn = { class: "rm-field-row" }, bn = { class: "rm-field" }, gn = ["value", "disabled"], yn = ["value"], xn = { class: "rm-field" }, _n = ["value", "disabled"], wn = ["value"], kn = { class: "rm-field-row" }, Cn = { class: "rm-field" }, En = ["value", "disabled"], $n = ["value"], Sn = { class: "rm-field" }, In = ["value", "disabled"], Dn = ["value"], Mn = { class: "rm-field" }, zn = ["value", "disabled"], Pn = ["value"], Tn = { class: "rm-field-row" }, An = { class: "rm-field" }, Rn = ["value", "disabled"], Nn = ["value"], On = { class: "rm-field rm-field--narrow" }, Ln = ["value", "disabled"], Vn = { class: "rm-field" }, Un = { class: "rm-field-value" }, Kn = ["value", "disabled"], Bn = { class: "rm-field-row" }, Yn = { class: "rm-field" }, jn = ["value", "disabled"], Fn = { class: "rm-field" }, Hn = ["value", "disabled"], Wn = { class: "rm-chain" }, qn = {
  key: 0,
  class: "rm-chain-empty"
}, Xn = ["onClick"], Gn = {
  key: 1,
  class: "rm-chain-empty"
}, Jn = ["onClick"], Qn = /* @__PURE__ */ ee({
  __name: "InitiativeForm",
  props: {
    state: {},
    initiative: {},
    trace: {},
    editable: { type: Boolean }
  },
  emits: ["patch", "select"],
  setup(e, { emit: t }) {
    const r = e, n = t, i = D(() => r.state.settings.period_kind), s = D(() => bt(r.state.settings.origin, r.state.settings.columns, i.value)), v = D(() => r.state.layers), p = D(() => r.state.outcomes);
    function l(K) {
      return r.state.initiatives.find((y) => y.id === K)?.title || "Unavailable initiative";
    }
    const u = D(() => [...r.trace.needs]), b = D(() => [...r.trace.unlocks]);
    function g(K, y) {
      n("patch", { [y]: K.target.value });
    }
    function x(K, y) {
      n("patch", { [y]: K.target.value });
    }
    function S(K) {
      const y = Math.max(1, Math.round(Number(K.target.value) || 1));
      n("patch", { span: y });
    }
    function O(K) {
      const y = Math.min(1, Math.max(0, Number(K.target.value) / 100));
      n("patch", { progress: y });
    }
    function L(K) {
      const y = K.target.value;
      n("patch", { tags: y.split(",").map((k) => k.trim()).filter(Boolean) });
    }
    return (K, y) => (a(), c("div", un, [
      o("label", mn, [
        y[9] || (y[9] = o("span", null, "Title", -1)),
        o("input", {
          class: "rm-input",
          type: "text",
          value: e.initiative.title,
          disabled: !e.editable,
          onChange: y[0] || (y[0] = (k) => g(k, "title"))
        }, null, 40, pn)
      ]),
      o("label", vn, [
        y[10] || (y[10] = o("span", null, "Description", -1)),
        o("textarea", {
          class: "rm-input rm-input--area",
          rows: "3",
          value: e.initiative.description,
          disabled: !e.editable,
          onChange: y[1] || (y[1] = (k) => g(k, "description"))
        }, null, 40, fn)
      ]),
      o("div", hn, [
        o("label", bn, [
          y[11] || (y[11] = o("span", null, "Layer", -1)),
          o("select", {
            class: "rm-input",
            value: e.initiative.layer_id,
            disabled: !e.editable,
            onChange: y[2] || (y[2] = (k) => x(k, "layer_id"))
          }, [
            (a(!0), c(M, null, P(v.value, (k) => (a(), c("option", {
              key: k.id,
              value: k.id
            }, $(k.title), 9, yn))), 128))
          ], 40, gn)
        ]),
        o("label", xn, [
          y[13] || (y[13] = o("span", null, "Outcome", -1)),
          o("select", {
            class: "rm-input",
            value: e.initiative.outcome_id,
            disabled: !e.editable,
            onChange: y[3] || (y[3] = (k) => x(k, "outcome_id"))
          }, [
            y[12] || (y[12] = o("option", { value: "" }, "— none —", -1)),
            (a(!0), c(M, null, P(p.value, (k) => (a(), c("option", {
              key: k.id,
              value: k.id
            }, $(k.title), 9, wn))), 128))
          ], 40, _n)
        ])
      ]),
      o("div", kn, [
        o("label", Cn, [
          y[14] || (y[14] = o("span", null, "Status", -1)),
          o("select", {
            class: "rm-input",
            value: e.initiative.status,
            disabled: !e.editable,
            onChange: y[4] || (y[4] = (k) => x(k, "status"))
          }, [
            (a(!0), c(M, null, P(N(gt), (k) => (a(), c("option", {
              key: k,
              value: k
            }, $(k), 9, $n))), 128))
          ], 40, En)
        ]),
        o("label", Sn, [
          y[15] || (y[15] = o("span", null, "Size", -1)),
          o("select", {
            class: "rm-input",
            value: e.initiative.size,
            disabled: !e.editable,
            onChange: y[5] || (y[5] = (k) => x(k, "size"))
          }, [
            (a(!0), c(M, null, P(N(ln), (k) => (a(), c("option", {
              key: k,
              value: k
            }, $(k), 9, Dn))), 128))
          ], 40, In)
        ])
      ]),
      o("label", Mn, [
        o("span", null, [
          y[16] || (y[16] = ie("Confidence ", -1)),
          V(Le, {
            confidence: e.initiative.confidence
          }, null, 8, ["confidence"])
        ]),
        o("select", {
          class: "rm-input",
          value: e.initiative.confidence,
          disabled: !e.editable,
          onChange: y[6] || (y[6] = (k) => x(k, "confidence"))
        }, [
          (a(!0), c(M, null, P(N(an), (k) => (a(), c("option", {
            key: k,
            value: k
          }, $(k), 9, Pn))), 128))
        ], 40, zn)
      ]),
      o("div", Tn, [
        o("label", An, [
          y[18] || (y[18] = o("span", null, "Start", -1)),
          o("select", {
            class: "rm-input",
            value: e.initiative.start_period,
            disabled: !e.editable,
            onChange: y[7] || (y[7] = (k) => x(k, "start_period"))
          }, [
            y[17] || (y[17] = o("option", { value: "" }, "— unscheduled —", -1)),
            (a(!0), c(M, null, P(s.value, (k) => (a(), c("option", {
              key: k,
              value: k
            }, $(N(Re)(k, i.value)), 9, Nn))), 128))
          ], 40, Rn)
        ]),
        o("label", On, [
          y[19] || (y[19] = o("span", null, "Span", -1)),
          o("input", {
            class: "rm-input",
            type: "number",
            min: "1",
            value: e.initiative.span,
            disabled: !e.editable,
            onChange: S
          }, null, 40, Ln)
        ])
      ]),
      o("label", Vn, [
        o("span", null, [
          y[20] || (y[20] = ie("Progress ", -1)),
          o("em", Un, $(Math.round((e.initiative.progress || 0) * 100)) + "%", 1)
        ]),
        o("input", {
          class: "rm-range",
          type: "range",
          min: "0",
          max: "100",
          step: "5",
          value: Math.round((e.initiative.progress || 0) * 100),
          disabled: !e.editable || e.initiative.status === "done",
          onChange: O
        }, null, 40, Kn)
      ]),
      o("div", Bn, [
        o("label", Yn, [
          y[21] || (y[21] = o("span", null, "Owner", -1)),
          o("input", {
            class: "rm-input",
            type: "text",
            value: e.initiative.owner,
            disabled: !e.editable,
            onChange: y[8] || (y[8] = (k) => g(k, "owner"))
          }, null, 40, jn)
        ]),
        o("label", Fn, [
          y[22] || (y[22] = o("span", null, "Tags", -1)),
          o("input", {
            class: "rm-input",
            type: "text",
            value: e.initiative.tags.join(", "),
            disabled: !e.editable,
            onChange: L
          }, null, 40, Hn)
        ])
      ]),
      o("section", Wn, [
        y[23] || (y[23] = o("h4", null, "Needs", -1)),
        u.value.length ? R("", !0) : (a(), c("p", qn, "Nothing — this can start on its own.")),
        (a(!0), c(M, null, P(u.value, (k) => (a(), c("button", {
          key: k,
          class: "rm-chain-row",
          onClick: (z) => n("select", "initiative", k)
        }, $(l(k)), 9, Xn))), 128)),
        y[24] || (y[24] = o("h4", null, "Unlocks", -1)),
        b.value.length ? R("", !0) : (a(), c("p", Gn, "Nothing depends on this yet.")),
        (a(!0), c(M, null, P(b.value, (k) => (a(), c("button", {
          key: k,
          class: "rm-chain-row",
          onClick: (z) => n("select", "initiative", k)
        }, $(l(k)), 9, Jn))), 128))
      ])
    ]));
  }
}), Zn = { class: "rm-legend" }, ei = { key: 0 }, ti = /* @__PURE__ */ ee({
  __name: "Legend",
  props: {
    layers: {}
  },
  setup(e) {
    const t = {
      idea: "Idea — not a promise",
      planned: "Planned",
      active: "In progress",
      done: "Shipped",
      dropped: "Dropped"
    };
    return (r, n) => (a(), c("div", Zn, [
      e.layers.length ? (a(), c("section", ei, [
        n[0] || (n[0] = o("h4", null, "Layers", -1)),
        (a(!0), c(M, null, P(e.layers, (i) => (a(), c("div", {
          key: i.id,
          class: "rm-legend-row"
        }, [
          o("i", {
            class: "rm-dot",
            style: H({ "--rm-dot-color": i.color || "var(--rm-accent)" })
          }, null, 4),
          o("span", null, $(i.title), 1)
        ]))), 128))
      ])) : R("", !0),
      o("section", null, [
        n[1] || (n[1] = o("h4", null, "Status", -1)),
        (a(!0), c(M, null, P(N(gt), (i) => (a(), c("div", {
          key: i,
          class: "rm-legend-row"
        }, [
          V(fe, { status: i }, null, 8, ["status"]),
          o("span", null, $(t[i]), 1)
        ]))), 128)),
        n[2] || (n[2] = o("div", { class: "rm-legend-row" }, [
          o("i", { class: "rm-swatch rm-swatch--low" }),
          o("span", null, "Low confidence")
        ], -1))
      ]),
      n[3] || (n[3] = o("p", { class: "rm-legend-hint" }, "Select an initiative to trace what it needs and what it unlocks across every lens.", -1))
    ]));
  }
}), ri = { class: "rm-panel" }, ni = { class: "rm-panel-head" }, ii = {
  key: 0,
  class: "rm-suggest"
}, oi = { class: "rm-suggest-actions" }, si = ["disabled"], ai = { class: "rm-panel-body" }, li = {
  key: 1,
  class: "rm-form"
}, di = { class: "rm-field" }, ci = ["value", "disabled"], ui = { class: "rm-field" }, mi = ["value", "disabled"], pi = { class: "rm-field-row" }, vi = { class: "rm-field" }, fi = ["value", "disabled"], hi = ["value"], bi = { class: "rm-field rm-field--narrow" }, gi = ["value", "disabled"], yi = {
  key: 2,
  class: "rm-form"
}, xi = { class: "rm-field" }, _i = ["value", "disabled"], wi = { class: "rm-field" }, ki = ["value", "disabled"], Ci = { class: "rm-field rm-field--narrow" }, Ei = ["value", "disabled"], $i = {
  key: 3,
  class: "rm-form"
}, Si = { class: "rm-field" }, Ii = ["value", "disabled"], Di = { class: "rm-field" }, Mi = ["value", "disabled"], zi = { class: "rm-field-row" }, Pi = { class: "rm-field" }, Ti = ["value", "disabled"], Ai = ["value"], Ri = { class: "rm-field" }, Ni = ["value", "disabled"], Oi = ["value"], Li = {
  key: 0,
  class: "rm-chain"
}, Vi = ["onClick"], Ui = {
  key: 4,
  class: "rm-form"
}, Ki = { class: "rm-dep" }, Bi = { class: "rm-field" }, Yi = ["value", "disabled"], ji = ["value"], Fi = { class: "rm-field" }, Hi = ["value", "disabled"], Wi = {
  key: 1,
  class: "rm-panel-foot"
}, qi = /* @__PURE__ */ ee({
  __name: "Inspector",
  props: {
    state: {},
    selection: {},
    trace: {},
    editable: { type: Boolean },
    suggestion: {}
  },
  emits: ["patch", "remove", "select", "apply-suggestion", "dismiss-suggestion", "close"],
  setup(e, { emit: t }) {
    const r = e, n = t, i = D(() => r.state.settings.period_kind), s = D(() => bt(r.state.settings.origin, r.state.settings.columns, i.value)), v = D(() => r.selection?.kind === "initiative" && r.state.initiatives.find((z) => z.id === r.selection?.id) || null), p = D(() => r.selection?.kind === "layer" && r.state.layers.find((z) => z.id === r.selection?.id) || null), l = D(() => r.selection?.kind === "outcome" && r.state.outcomes.find((z) => z.id === r.selection?.id) || null), u = D(() => r.selection?.kind === "milestone" && r.state.milestones.find((z) => z.id === r.selection?.id) || null), b = D(() => r.selection?.kind === "dependency" && r.state.dependencies.find((z) => z.id === r.selection?.id) || null), g = {
      initiative: "Initiative",
      dependency: "Dependency",
      milestone: "Milestone",
      layer: "Layer",
      outcome: "Outcome"
    }, x = D(() => r.selection ? g[r.selection.kind] : "Roadmap");
    function S(z) {
      return r.state.initiatives.find((h) => h.id === z)?.title || "Initiative outside this view";
    }
    function O(z) {
      r.selection && n("patch", r.selection.kind, r.selection.id, z);
    }
    function L(z, h) {
      O({ [h]: z.target.value });
    }
    function K(z, h) {
      O({ [h]: z.target.value });
    }
    function y(z) {
      O({ sort_order: Math.round(Number(z.target.value) || 0) });
    }
    const k = D(() => {
      const z = r.suggestion;
      return z ? `Move to ${z.horizon} by starting in ${Re(z.period, i.value)}.` : "";
    });
    return (z, h) => (a(), c("aside", ri, [
      o("header", ni, [
        o("h3", null, $(x.value), 1),
        o("button", {
          class: "rm-icon-btn",
          title: "Close panel",
          "aria-label": "Close panel",
          onClick: h[0] || (h[0] = (w) => n("close"))
        }, [
          V(N(J), {
            icon: "tabler:x",
            "aria-hidden": "true"
          })
        ])
      ]),
      e.suggestion ? (a(), c("div", ii, [
        o("p", null, $(k.value), 1),
        o("div", oi, [
          o("button", {
            class: "rm-btn rm-btn--primary rm-btn--mini",
            disabled: !e.editable,
            onClick: h[1] || (h[1] = (w) => n("apply-suggestion"))
          }, "Set start", 8, si),
          o("button", {
            class: "rm-btn rm-btn--mini",
            onClick: h[2] || (h[2] = (w) => n("dismiss-suggestion"))
          }, "Keep as is")
        ])
      ])) : R("", !0),
      o("div", ai, [
        v.value ? (a(), oe(Qn, {
          key: 0,
          state: e.state,
          initiative: v.value,
          trace: e.trace,
          editable: e.editable,
          onPatch: O,
          onSelect: h[3] || (h[3] = (w, te) => n("select", w, te))
        }, null, 8, ["state", "initiative", "trace", "editable"])) : p.value ? (a(), c("div", li, [
          o("label", di, [
            h[18] || (h[18] = o("span", null, "Title", -1)),
            o("input", {
              class: "rm-input",
              type: "text",
              value: p.value.title,
              disabled: !e.editable,
              onChange: h[4] || (h[4] = (w) => L(w, "title"))
            }, null, 40, ci)
          ]),
          o("label", ui, [
            h[19] || (h[19] = o("span", null, "Description", -1)),
            o("input", {
              class: "rm-input",
              type: "text",
              value: p.value.description,
              disabled: !e.editable,
              onChange: h[5] || (h[5] = (w) => L(w, "description"))
            }, null, 40, mi)
          ]),
          o("div", pi, [
            o("label", vi, [
              h[20] || (h[20] = o("span", null, "Colour", -1)),
              o("select", {
                class: "rm-input",
                value: p.value.color || "var(--p-text-muted-color)",
                disabled: !e.editable,
                onChange: h[6] || (h[6] = (w) => K(w, "color"))
              }, [
                (a(!0), c(M, null, P(N(sn), (w) => (a(), c("option", {
                  key: w.value,
                  value: w.value
                }, $(w.label), 9, hi))), 128))
              ], 40, fi)
            ]),
            o("label", bi, [
              h[21] || (h[21] = o("span", null, "Order", -1)),
              o("input", {
                class: "rm-input",
                type: "number",
                value: p.value.sort_order,
                disabled: !e.editable,
                onChange: y
              }, null, 40, gi)
            ])
          ]),
          h[22] || (h[22] = o("p", { class: "rm-note" }, "Order runs bottom to top: the foundation is 0.", -1))
        ])) : l.value ? (a(), c("div", yi, [
          o("label", xi, [
            h[23] || (h[23] = o("span", null, "Title", -1)),
            o("input", {
              class: "rm-input",
              type: "text",
              value: l.value.title,
              disabled: !e.editable,
              onChange: h[7] || (h[7] = (w) => L(w, "title"))
            }, null, 40, _i)
          ]),
          o("label", wi, [
            h[24] || (h[24] = o("span", null, "Why it exists", -1)),
            o("textarea", {
              class: "rm-input rm-input--area",
              rows: "3",
              value: l.value.description,
              disabled: !e.editable,
              onChange: h[8] || (h[8] = (w) => L(w, "description"))
            }, null, 40, ki)
          ]),
          o("label", Ci, [
            h[25] || (h[25] = o("span", null, "Order", -1)),
            o("input", {
              class: "rm-input",
              type: "number",
              value: l.value.sort_order,
              disabled: !e.editable,
              onChange: y
            }, null, 40, Ei)
          ])
        ])) : u.value ? (a(), c("div", $i, [
          o("label", Si, [
            h[26] || (h[26] = o("span", null, "Title", -1)),
            o("input", {
              class: "rm-input",
              type: "text",
              value: u.value.title,
              disabled: !e.editable,
              onChange: h[9] || (h[9] = (w) => L(w, "title"))
            }, null, 40, Ii)
          ]),
          o("label", Di, [
            h[27] || (h[27] = o("span", null, "Description", -1)),
            o("input", {
              class: "rm-input",
              type: "text",
              value: u.value.description,
              disabled: !e.editable,
              onChange: h[10] || (h[10] = (w) => L(w, "description"))
            }, null, 40, Mi)
          ]),
          o("div", zi, [
            o("label", Pi, [
              h[28] || (h[28] = o("span", null, "Period", -1)),
              o("select", {
                class: "rm-input",
                value: u.value.period,
                disabled: !e.editable,
                onChange: h[11] || (h[11] = (w) => K(w, "period"))
              }, [
                (a(!0), c(M, null, P(s.value, (w) => (a(), c("option", {
                  key: w,
                  value: w
                }, $(N(Re)(w, i.value)), 9, Ai))), 128))
              ], 40, Ti)
            ]),
            o("label", Ri, [
              h[30] || (h[30] = o("span", null, "Layer", -1)),
              o("select", {
                class: "rm-input",
                value: u.value.layer_id,
                disabled: !e.editable,
                onChange: h[12] || (h[12] = (w) => K(w, "layer_id"))
              }, [
                h[29] || (h[29] = o("option", { value: "" }, "— all layers —", -1)),
                (a(!0), c(M, null, P(e.state.layers, (w) => (a(), c("option", {
                  key: w.id,
                  value: w.id
                }, $(w.title), 9, Oi))), 128))
              ], 40, Ni)
            ])
          ]),
          u.value.initiative_ids.length ? (a(), c("section", Li, [
            h[31] || (h[31] = o("h4", null, "Marks", -1)),
            (a(!0), c(M, null, P(u.value.initiative_ids, (w) => (a(), c("button", {
              key: w,
              class: "rm-chain-row",
              onClick: (te) => n("select", "initiative", w)
            }, $(S(w)), 9, Vi))), 128))
          ])) : R("", !0)
        ])) : b.value ? (a(), c("div", Ui, [
          o("div", Ki, [
            o("button", {
              class: "rm-chain-row",
              onClick: h[13] || (h[13] = (w) => n("select", "initiative", b.value.from_id))
            }, $(S(b.value.from_id)), 1),
            h[32] || (h[32] = o("span", { class: "rm-dep-arrow" }, "unlocks", -1)),
            o("button", {
              class: "rm-chain-row",
              onClick: h[14] || (h[14] = (w) => n("select", "initiative", b.value.to_id))
            }, $(S(b.value.to_id)), 1)
          ]),
          o("label", Bi, [
            h[33] || (h[33] = o("span", null, "Kind", -1)),
            o("select", {
              class: "rm-input",
              value: b.value.kind,
              disabled: !e.editable,
              onChange: h[15] || (h[15] = (w) => K(w, "kind"))
            }, [
              (a(!0), c(M, null, P(N(dn), (w) => (a(), c("option", {
                key: w,
                value: w
              }, $(w), 9, ji))), 128))
            ], 40, Yi)
          ]),
          o("label", Fi, [
            h[34] || (h[34] = o("span", null, "Note", -1)),
            o("input", {
              class: "rm-input",
              type: "text",
              value: b.value.note,
              disabled: !e.editable,
              onChange: h[16] || (h[16] = (w) => L(w, "note"))
            }, null, 40, Hi)
          ]),
          h[35] || (h[35] = o("p", { class: "rm-note" }, "Only a requires edge sits on the critical path; informs is advisory.", -1))
        ])) : (a(), oe(ti, {
          key: 5,
          layers: e.state.layers
        }, null, 8, ["layers"]))
      ]),
      e.selection && e.editable ? (a(), c("footer", Wi, [
        o("button", {
          class: "rm-btn rm-btn--danger",
          onClick: h[17] || (h[17] = (w) => n("remove", e.selection.kind, e.selection.id))
        }, [
          V(N(J), {
            icon: "tabler:trash",
            "aria-hidden": "true"
          }),
          ie("Remove " + $(x.value.toLowerCase()), 1)
        ])
      ])) : R("", !0)
    ]));
  }
});
function Xi(e) {
  return e.status === "done" ? 1 : e.status === "active" ? yt(e.progress) : 0;
}
function yt(e) {
  const t = Number(e);
  return Number.isFinite(t) ? Math.min(1, Math.max(0, t)) : 0;
}
function Ze(e) {
  const t = e.filter((n) => n.status !== "dropped");
  return t.length ? t.reduce((n, i) => n + Xi(i), 0) / t.length : 0;
}
function Gi(e, t = {}) {
  const r = e.settings.period_kind, n = (p, l) => {
    const u = Q(p.start_period, r), b = Q(l.start_period, r);
    return u !== b ? (u ?? Number.MAX_SAFE_INTEGER) - (b ?? Number.MAX_SAFE_INTEGER) : p.sort_order - l.sort_order || p.title.localeCompare(l.title);
  }, i = e.outcomes.map((p) => {
    const l = e.initiatives.filter((u) => u.outcome_id === p.id).sort(n);
    return { outcome: p, initiatives: l, progress: Ze(l) };
  });
  t.sortByProgress && i.sort((p, l) => l.progress - p.progress);
  const s = new Set(e.outcomes.map((p) => p.id)), v = e.initiatives.filter((p) => !p.outcome_id || !s.has(p.outcome_id)).sort(n);
  return v.length && i.push({ outcome: null, initiatives: v, progress: Ze(v) }), i;
}
function et(e) {
  return Math.round(yt(e) * 100);
}
const Ji = { class: "rm-oc" }, Qi = ["role", "tabindex", "onClick", "onKeydown", "onContextmenu"], Zi = { class: "rm-obj-why" }, eo = { class: "rm-meter" }, to = { class: "rm-meter-track" }, ro = { class: "rm-meter-value" }, no = { class: "rm-bets" }, io = ["onClick", "onKeydown", "onContextmenu"], oo = { class: "rm-bet-line" }, so = { class: "rm-bet-title" }, ao = { class: "rm-bet-period" }, lo = {
  key: 0,
  class: "rm-bet rm-bet--empty"
}, co = /* @__PURE__ */ ee({
  __name: "OutcomesLens",
  props: {
    cards: {},
    layers: {},
    periodKind: {},
    selectedId: {},
    trace: {}
  },
  emits: ["select", "context"],
  setup(e, { emit: t }) {
    const r = e, n = t;
    function i(v) {
      return r.layers.find((p) => p.id === v);
    }
    function s(v) {
      return r.trace.selected ? {
        "is-sel": v === r.trace.selected,
        "is-need": r.trace.needs.has(v),
        "is-unlock": r.trace.unlocks.has(v),
        "is-dim": !r.trace.chain.has(v)
      } : {};
    }
    return (v, p) => (a(), c("div", Ji, [
      (a(!0), c(M, null, P(e.cards, (l) => (a(), c("section", {
        key: l.outcome?.id || "unfiled",
        class: "rm-obj"
      }, [
        o("header", {
          class: U(["rm-obj-head", { "is-clickable": !!l.outcome }]),
          role: l.outcome ? "button" : void 0,
          tabindex: l.outcome ? 0 : void 0,
          onClick: (u) => l.outcome && n("select", "outcome", l.outcome.id),
          onKeydown: ve(j((u) => l.outcome && n("select", "outcome", l.outcome.id), ["prevent"]), ["enter"]),
          onContextmenu: j((u) => l.outcome && n("context", u, "outcome", l.outcome.id), ["prevent"])
        }, [
          o("h3", null, $(l.outcome ? l.outcome.title : "Unfiled bets"), 1),
          o("p", Zi, $(l.outcome ? l.outcome.description : "Work that serves no stated outcome."), 1)
        ], 42, Qi),
        o("div", eo, [
          o("span", to, [
            o("span", {
              class: "rm-meter-fill",
              style: H({ width: `${N(et)(l.progress)}%` })
            }, null, 4)
          ]),
          o("span", ro, $(N(et)(l.progress)) + "%", 1)
        ]),
        o("ul", no, [
          (a(!0), c(M, null, P(l.initiatives, (u) => (a(), c("li", {
            key: u.id,
            class: U(["rm-bet", s(u.id)]),
            style: H({ "--rm-layer": i(u.layer_id)?.color || "var(--rm-accent)" }),
            role: "button",
            tabindex: "0",
            onClick: (b) => n("select", "initiative", u.id),
            onKeydown: ve(j((b) => n("select", "initiative", u.id), ["prevent"]), ["enter"]),
            onContextmenu: j((b) => n("context", b, "initiative", u.id), ["prevent"])
          }, [
            V(fe, {
              status: u.status,
              color: i(u.layer_id)?.color
            }, null, 8, ["status", "color"]),
            o("span", oo, [
              o("i", {
                class: "rm-dot",
                style: H({ "--rm-dot-color": i(u.layer_id)?.color || "var(--rm-accent)" })
              }, null, 4),
              o("span", so, $(u.title), 1),
              V(Le, {
                confidence: u.confidence
              }, null, 8, ["confidence"])
            ]),
            o("span", ao, $(u.start_period ? N($e)(u.start_period, e.periodKind) : "—"), 1)
          ], 46, io))), 128)),
          l.initiatives.length ? R("", !0) : (a(), c("li", lo, "No bets filed here yet."))
        ])
      ]))), 128))
    ]));
  }
});
function uo(e, t, r) {
  if (r === "vertical") {
    const l = e.x + e.width / 2, u = e.y, b = t.x + t.width / 2, g = t.y + t.height, x = (u + g) / 2;
    return `M${q(l)},${q(u)} C${q(l)},${q(x)} ${q(b)},${q(x)} ${q(b)},${q(g)}`;
  }
  const n = e.x + e.width, i = e.y + e.height / 2, s = t.x, v = t.y + t.height / 2, p = Math.max(16, (s - n) / 2);
  return `M${q(n)},${q(i)} C${q(n + p)},${q(i)} ${q(s - p)},${q(v)} ${q(s)},${q(v)}`;
}
function q(e) {
  return Math.round(e * 100) / 100;
}
function xt(e, t, r) {
  const n = r.chain, i = r.selectedOnly || "", s = [];
  for (const v of e || []) {
    if (i && v.from_id !== i && v.to_id !== i) continue;
    const p = t.get(v.from_id), l = t.get(v.to_id);
    !p || !l || s.push({
      id: v.id,
      d: uo(p, l, r.orientation),
      kind: v.kind,
      hot: !!(n && n.has(v.from_id) && n.has(v.to_id))
    });
  }
  return s;
}
function mo(e, t = {}) {
  const r = e.settings.period_kind, n = [...e.layers].sort((s, v) => v.sort_order - s.sort_order || v.title.localeCompare(s.title)), i = t.rank;
  return n.map((s) => {
    const v = e.initiatives.filter((p) => p.layer_id === s.id && (t.includeDropped || p.status !== "dropped")).sort((p, l) => {
      if (i) {
        const g = (i.get(l.id) ?? 0) - (i.get(p.id) ?? 0);
        if (g) return g;
      }
      const u = Q(p.start_period, r), b = Q(l.start_period, r);
      return u !== b ? (u ?? Number.MAX_SAFE_INTEGER) - (b ?? Number.MAX_SAFE_INTEGER) : p.sort_order - l.sort_order || p.title.localeCompare(l.title);
    });
    return { layer: s, initiatives: v };
  });
}
function po(e, t = {}) {
  return (e || []).filter((r) => r.kind === "requires" || t.includeInforms && r.kind === "informs");
}
function vo(e, t, r) {
  return xt(e, t, { orientation: "vertical", chain: r });
}
const fo = {
  class: "rm-overlay",
  "aria-hidden": "true"
}, ho = ["d"], bo = { class: "rm-stratum-lab" }, go = { key: 0 }, yo = { class: "rm-stratum-pills" }, xo = ["data-initiative-id", "title", "onClick", "onContextmenu"], _o = {
  key: 0,
  class: "rm-pill-rank"
}, wo = {
  key: 0,
  class: "rm-stratum-empty"
}, ko = /* @__PURE__ */ ee({
  __name: "StrataLens",
  props: {
    bands: {},
    edges: {},
    selectedId: {},
    trace: {},
    ranks: {}
  },
  emits: ["select", "context"],
  setup(e, { emit: t }) {
    const r = e, n = t, i = Y(null), s = Y(/* @__PURE__ */ new Map());
    function v() {
      const b = i.value;
      if (!b) {
        s.value = /* @__PURE__ */ new Map();
        return;
      }
      const g = b.getBoundingClientRect(), x = /* @__PURE__ */ new Map();
      for (const S of Array.from(b.querySelectorAll("[data-initiative-id]"))) {
        const O = S.dataset.initiativeId || "";
        if (!O) continue;
        const L = S.getBoundingClientRect();
        x.set(O, { id: O, x: L.left - g.left, y: L.top - g.top, width: L.width, height: L.height });
      }
      s.value = x;
    }
    const p = D(() => vo(r.edges, s.value, r.trace.chain));
    let l = null;
    be(i, (b) => {
      l?.disconnect(), l = null, !(!b || typeof ResizeObserver > "u") && (l = new ResizeObserver(() => v()), l.observe(b));
    }, { immediate: !0 }), be(() => r.bands, () => {
      ge(v);
    }, { immediate: !0 }), Ee(() => {
      l?.disconnect(), l = null;
    });
    function u(b) {
      return r.trace.selected ? {
        "is-sel": b === r.trace.selected,
        "is-need": r.trace.needs.has(b),
        "is-unlock": r.trace.unlocks.has(b),
        "is-dim": !r.trace.chain.has(b)
      } : {};
    }
    return (b, g) => (a(), c("div", {
      class: "rm-strata",
      ref_key: "rootEl",
      ref: i
    }, [
      (a(), c("svg", fo, [
        (a(!0), c(M, null, P(p.value, (x) => (a(), c("path", {
          key: x.id,
          d: x.d,
          class: U([`rm-edge--${x.kind}`, { "is-hot": x.hot }])
        }, null, 10, ho))), 128))
      ])),
      (a(!0), c(M, null, P(e.bands, (x) => (a(), c("div", {
        key: x.layer.id,
        class: "rm-stratum"
      }, [
        o("div", bo, [
          o("i", {
            class: "rm-dot",
            style: H({ "--rm-dot-color": x.layer.color || "var(--rm-accent)" })
          }, null, 4),
          o("div", null, [
            ie($(x.layer.title) + " ", 1),
            x.layer.description ? (a(), c("small", go, $(x.layer.description), 1)) : R("", !0)
          ])
        ]),
        o("div", yo, [
          (a(!0), c(M, null, P(x.initiatives, (S) => (a(), c("button", {
            key: S.id,
            class: U(["rm-pill", [`rm-pill--${S.status}`, u(S.id), { "rm-pill--low": S.confidence === "low" }]]),
            style: H({ "--rm-layer": x.layer.color || "var(--rm-accent)" }),
            "data-initiative-id": S.id,
            title: e.ranks && e.ranks.get(S.id) ? `${S.title} — blocks ${e.ranks.get(S.id)}` : S.title,
            onClick: (O) => n("select", "initiative", S.id),
            onContextmenu: j((O) => n("context", O, "initiative", S.id), ["prevent"])
          }, [
            V(fe, {
              status: S.status
            }, null, 8, ["status"]),
            o("span", null, $(S.title), 1),
            e.ranks && e.ranks.get(S.id) ? (a(), c("em", _o, $(e.ranks.get(S.id)), 1)) : R("", !0)
          ], 46, xo))), 128)),
          x.initiatives.length ? R("", !0) : (a(), c("span", wo, "No work in this layer."))
        ])
      ]))), 128))
    ], 512));
  }
});
function _t(e, t, r, n, i = 0.5) {
  const s = Q(e, n);
  if (s === null || r <= 0) return null;
  const v = (s - t + i) / r;
  return v < 0 || v > 1 ? null : v;
}
function Co(e) {
  return typeof e != "number" || !Number.isFinite(e) ? 0.5 : Math.min(1, Math.max(0, e));
}
function Eo(e, t) {
  const r = [], n = [];
  for (const i of e) {
    const s = Q(i.start_period, t);
    if (s === null) {
      n.push(i);
      continue;
    }
    const v = Math.max(1, Math.round(i.span) || 1);
    r.push({ initiative: i, start: s, end: s + v - 1 });
  }
  return r.sort((i, s) => i.start - s.start || s.end - s.start - (i.end - i.start) || i.initiative.title.localeCompare(s.initiative.title)), { placed: r, unscheduled: n };
}
function $o(e) {
  const t = [];
  for (const r of e) {
    let n = t.find((i) => i.every((s) => r.start > s.end || r.end < s.start));
    n || (n = [], t.push(n)), n.push(r);
  }
  return t;
}
function So(e, t, r, n) {
  const i = /* @__PURE__ */ new Map();
  for (const p of e || []) {
    if (t === null) continue;
    const l = i.get(p.period);
    if (l) {
      l.group.push(p);
      continue;
    }
    const u = _t(p.period, t, r, n);
    u !== null && i.set(p.period, { left: u, group: [p] });
  }
  const s = [];
  let v = 1;
  for (const [p, { left: l, group: u }] of i)
    u.sort((b, g) => b.title.localeCompare(g.title) || b.id.localeCompare(g.id)), v = Math.max(v, u.length), u.forEach((b, g) => s.push({ milestone: b, period: p, row: g, left: l }));
  return { marks: s, rows: v };
}
function Io(e, t = {}) {
  const r = e.settings.period_kind, n = Q(e.settings.origin, r), i = Math.max(1, Math.floor(e.settings.columns) || 0), v = Hr(e.settings.origin, i, r).map((S, O) => ({
    key: S,
    label: $e(S, r),
    index: (n ?? 0) + O,
    current: S === e.current_period
  })), p = n ?? 0, l = p + i - 1, u = e.initiatives.filter((S) => t.includeDropped || S.status !== "dropped"), b = e.layers.map((S) => {
    const O = u.filter((h) => h.layer_id === S.id), { placed: L, unscheduled: K } = Eo(O, r), y = L.filter((h) => h.end >= p && h.start <= l), k = L.filter((h) => h.end < p || h.start > l).map((h) => h.initiative), z = $o(y).map((h) => h.map((w) => {
      const te = Math.max(w.start, p), re = Math.min(w.end, l);
      return {
        initiative: w.initiative,
        colStart: te - p + 1,
        span: re - te + 1,
        clippedStart: w.start < p,
        clippedEnd: w.end > l
      };
    }));
    return { layer: S, rows: z, unscheduled: K, offscreen: k };
  }), g = So(e.milestones, n, i, r), x = n === null ? null : _t(e.current_period, n, i, r, Co(e.current_position));
  return { columns: v, lanes: b, milestones: g.marks, milestoneRows: g.rows, todayPosition: x };
}
function Do(e, t, r, n) {
  return r ? xt(e, t, { orientation: "horizontal", selectedOnly: r, chain: n }) : [];
}
function Mo(e, t) {
  return !Number.isFinite(t) || t <= 0 ? 0 : Math.round(e / t);
}
function Pe(e) {
  const t = Mo(e.dx, e.columnWidth), r = Math.max(1, Math.round(e.span) || 1);
  if (e.mode === "resize") {
    const s = Math.max(1, e.windowEnd - e.startIndex + 1);
    return { startIndex: e.startIndex, span: Math.min(s, Math.max(1, r + t)) };
  }
  const n = Math.max(e.windowStart, e.windowEnd - r + 1);
  return { startIndex: Math.min(n, Math.max(e.windowStart, e.startIndex + t)), span: r };
}
function zo(e, t) {
  if (!e.length) return null;
  for (const i of e) if (t >= i.top && t < i.bottom) return i.layerId;
  let r = e[0], n = 1 / 0;
  for (const i of e) {
    const s = t < i.top ? i.top - t : t - i.bottom;
    s < n && (n = s, r = i);
  }
  return r.layerId;
}
const Po = { class: "rm-tl-head" }, To = ["title", "aria-label", "onClick", "onContextmenu"], Ao = { class: "rm-tl-lab" }, Ro = { key: 0 }, No = { class: "rm-tl-rows" }, Oo = ["data-initiative-id", "title", "onPointerdown", "onClick", "onKeydown", "onContextmenu"], Lo = { class: "rm-bar-title" }, Vo = { class: "rm-bar-size" }, Uo = ["aria-label", "onPointerdown"], Ko = {
  key: 0,
  class: "rm-tl-row rm-tl-row--empty"
}, Bo = {
  key: 0,
  class: "rm-tl-aside"
}, Yo = ["title", "onClick", "onContextmenu"], jo = ["title", "onClick"], Fo = {
  class: "rm-overlay",
  "aria-hidden": "true"
}, Ho = ["d"], Wo = /* @__PURE__ */ ee({
  __name: "TimelineLens",
  props: {
    state: {},
    model: {},
    selectedId: {},
    trace: {},
    editable: { type: Boolean },
    compact: { type: Boolean }
  },
  emits: ["select", "place", "context"],
  setup(e, { emit: t }) {
    const r = e, n = t, i = Y(null), s = /* @__PURE__ */ new Map(), v = Y(/* @__PURE__ */ new Map()), p = D(() => r.state.settings.period_kind), l = D(() => Q(r.state.settings.origin, p.value) ?? 0), u = D(() => Math.max(1, r.model.columns.length)), b = D(() => ({ "--rm-cols": String(u.value) })), g = Y(null);
    let x = 0;
    function S(C) {
      Date.now() < x || n("select", "initiative", C);
    }
    function O(C, _) {
      _ instanceof HTMLElement ? s.set(C, _) : s.delete(C);
    }
    function L() {
      const C = i.value;
      if (!C) {
        v.value = /* @__PURE__ */ new Map();
        return;
      }
      const _ = C.getBoundingClientRect(), E = /* @__PURE__ */ new Map();
      for (const I of Array.from(C.querySelectorAll("[data-initiative-id]"))) {
        const W = I.dataset.initiativeId || "";
        if (!W) continue;
        const T = I.getBoundingClientRect();
        E.set(W, { id: W, x: T.left - _.left, y: T.top - _.top, width: T.width, height: T.height });
      }
      v.value = E;
    }
    const K = D(() => Do(r.state.dependencies, v.value, r.selectedId, r.trace.chain));
    let y = null;
    be(i, (C) => {
      y?.disconnect(), y = null, !(!C || typeof ResizeObserver > "u") && (y = new ResizeObserver(() => L()), y.observe(C));
    }, { immediate: !0 }), be([() => r.model, () => r.selectedId], () => {
      ge(L);
    }, { immediate: !0, deep: !1 }), Ee(() => {
      y?.disconnect(), y = null, ue(!1);
    });
    function k(C) {
      const _ = g.value, I = {
        "--rm-layer": r.state.layers.find((X) => X.id === C.initiative.layer_id)?.color || "var(--rm-accent)",
        "--rm-progress": `${Math.round((C.initiative.progress || 0) * 100)}%`,
        gridColumn: `${C.colStart} / span ${C.span}`
      };
      if (!_ || _.id !== C.initiative.id) return I;
      if (_.mode === "resize") {
        const X = Pe(z(_));
        return I.gridColumn = `${C.colStart} / span ${Math.max(1, Math.min(u.value - C.colStart + 1, X.span))}`, I;
      }
      const T = (Pe(z(_)).startIndex - _.startIndex) * _.columnWidth;
      return I.transform = `translate(${T}px, ${_.dy}px)`, I;
    }
    function z(C) {
      return {
        mode: C.mode,
        startIndex: C.startIndex,
        span: C.span,
        dx: C.dx,
        columnWidth: C.columnWidth,
        windowStart: l.value,
        windowEnd: l.value + u.value - 1
      };
    }
    function h() {
      const C = i.value;
      if (!C) return [];
      const _ = C.getBoundingClientRect(), E = [];
      for (const I of r.state.layers) {
        const W = s.get(I.id);
        if (!W) continue;
        const T = W.getBoundingClientRect();
        E.push({ layerId: I.id, top: T.top - _.top, bottom: T.bottom - _.top });
      }
      return E;
    }
    function w() {
      const _ = r.state.layers.map((E) => s.get(E.id)).find(Boolean)?.querySelector(".rm-tl-rows");
      return _ ? _.clientWidth / u.value : 0;
    }
    function te(C, _, E) {
      if (!r.editable || C.button !== 0) return;
      const I = Q(_.initiative.start_period, p.value);
      I !== null && (C.preventDefault(), C.stopPropagation(), g.value = {
        id: _.initiative.id,
        mode: E,
        pointerId: C.pointerId,
        originX: C.clientX,
        originY: C.clientY,
        dx: 0,
        dy: 0,
        startIndex: I,
        span: Math.max(1, Math.round(_.initiative.span) || 1),
        layerId: _.initiative.layer_id,
        targetLayerId: _.initiative.layer_id,
        columnWidth: w(),
        bands: h(),
        moved: !1
      }, window.addEventListener("pointermove", re), window.addEventListener("pointerup", ae), window.addEventListener("keydown", ce, !0));
    }
    function re(C) {
      const _ = g.value;
      if (!(!_ || C.pointerId !== _.pointerId)) {
        if (_.dx = C.clientX - _.originX, _.dy = _.mode === "move" ? C.clientY - _.originY : 0, (Math.abs(_.dx) > 3 || Math.abs(_.dy) > 3) && (_.moved = !0), _.mode === "move") {
          const E = i.value, I = E ? C.clientY - E.getBoundingClientRect().top : 0;
          _.targetLayerId = zo(_.bands, I) || _.layerId;
        }
        g.value = { ..._ };
      }
    }
    function ae(C) {
      const _ = g.value;
      !_ || C.pointerId !== _.pointerId || ue(_.moved);
    }
    function ce(C) {
      C.key !== "Escape" || !g.value || (C.preventDefault(), C.stopPropagation(), ue(!1));
    }
    function ue(C) {
      const _ = g.value;
      if (window.removeEventListener("pointermove", re), window.removeEventListener("pointerup", ae), window.removeEventListener("keydown", ce, !0), g.value = null, !_ || !C) return;
      x = Date.now() + 300;
      const E = Pe(z(_)), I = {};
      _.mode === "resize" ? E.span !== _.span && (I.span = E.span) : (E.startIndex !== _.startIndex && (I.startPeriod = ye(E.startIndex, p.value)), _.targetLayerId !== _.layerId && (I.layerId = _.targetLayerId)), Object.keys(I).length && n("place", _.id, I);
    }
    function me(C) {
      return r.trace.selected ? {
        "is-sel": C === r.trace.selected,
        "is-need": r.trace.needs.has(C),
        "is-unlock": r.trace.unlocks.has(C),
        "is-dim": !r.trace.chain.has(C)
      } : {};
    }
    function he(C) {
      return r.state.layers.find((_) => _.id === C)?.color || "var(--rm-accent)";
    }
    return (C, _) => (a(), c("div", {
      class: U(["rm-tl", { "rm-tl--compact": e.compact, "rm-tl--dragging": !!g.value }]),
      style: H(b.value),
      ref_key: "gridEl",
      ref: i
    }, [
      o("div", Po, [
        _[0] || (_[0] = o("div", { class: "rm-tl-head-lab" }, "Layer", -1)),
        (a(!0), c(M, null, P(e.model.columns, (E) => (a(), c("div", {
          key: E.key,
          class: U({ "is-current": E.current })
        }, $(E.label), 3))), 128))
      ]),
      o("div", {
        class: "rm-tl-ms",
        style: H({ "--rm-ms-rows": String(e.model.milestoneRows) })
      }, [
        _[2] || (_[2] = o("div", { class: "rm-tl-head-lab" }, "Milestones", -1)),
        (a(!0), c(M, null, P(e.model.milestones, (E) => (a(), c("button", {
          key: E.milestone.id,
          class: "rm-ms",
          style: H({ left: `calc(var(--rm-label) + (100% - var(--rm-label)) * ${E.left})`, "--rm-ms-row": String(E.row) }),
          title: E.milestone.title,
          "aria-label": `Milestone ${E.milestone.title}`,
          onClick: (I) => n("select", "milestone", E.milestone.id),
          onContextmenu: j((I) => n("context", I, "milestone", E.milestone.id), ["prevent"])
        }, [
          _[1] || (_[1] = o("i", null, null, -1)),
          ie($(E.milestone.title), 1)
        ], 44, To))), 128))
      ], 4),
      (a(!0), c(M, null, P(e.model.lanes, (E) => (a(), c("div", {
        key: E.layer.id,
        class: U(["rm-tl-lane", { "is-drop": g.value?.mode === "move" && g.value?.targetLayerId === E.layer.id }]),
        ref_for: !0,
        ref: (I) => O(E.layer.id, I)
      }, [
        o("div", Ao, [
          o("i", {
            class: "rm-dot",
            style: H({ "--rm-dot-color": E.layer.color || "var(--rm-accent)" })
          }, null, 4),
          o("div", null, [
            ie($(E.layer.title) + " ", 1),
            E.layer.description ? (a(), c("small", Ro, $(E.layer.description), 1)) : R("", !0)
          ])
        ]),
        o("div", No, [
          (a(!0), c(M, null, P(E.rows, (I, W) => (a(), c("div", {
            key: W,
            class: "rm-tl-row"
          }, [
            (a(!0), c(M, null, P(I, (T) => (a(), c("div", {
              key: T.initiative.id,
              class: U(["rm-bar", [
                `rm-bar--${T.initiative.status}`,
                me(T.initiative.id),
                {
                  "rm-bar--low": T.initiative.confidence === "low",
                  "rm-bar--clip-start": T.clippedStart,
                  "rm-bar--clip-end": T.clippedEnd,
                  "is-dragging": g.value?.id === T.initiative.id
                }
              ]]),
              style: H(k(T)),
              "data-initiative-id": T.initiative.id,
              role: "button",
              tabindex: "0",
              title: T.initiative.title,
              onPointerdown: (X) => te(X, T, "move"),
              onClick: (X) => S(T.initiative.id),
              onKeydown: [
                ve(j((X) => S(T.initiative.id), ["prevent"]), ["enter"]),
                ve(j((X) => S(T.initiative.id), ["prevent"]), ["space"])
              ],
              onContextmenu: j((X) => n("context", X, "initiative", T.initiative.id), ["prevent"])
            }, [
              V(fe, {
                status: T.initiative.status,
                title: T.initiative.status
              }, null, 8, ["status", "title"]),
              o("span", Lo, $(T.initiative.title), 1),
              o("span", Vo, $(T.initiative.size), 1),
              e.editable ? (a(), c("span", {
                key: 0,
                class: "rm-bar-grip",
                role: "separator",
                "aria-label": `Resize ${T.initiative.title}`,
                onPointerdown: j((X) => te(X, T, "resize"), ["stop"])
              }, null, 40, Uo)) : R("", !0)
            ], 46, Oo))), 128))
          ]))), 128)),
          E.rows.length ? R("", !0) : (a(), c("div", Ko))
        ]),
        E.unscheduled.length || E.offscreen.length ? (a(), c("div", Bo, [
          (a(!0), c(M, null, P(E.unscheduled, (I) => (a(), c("button", {
            key: I.id,
            class: U(["rm-chip rm-chip--idea", me(I.id)]),
            style: H({ "--rm-layer": he(I.layer_id) }),
            title: `${I.title} — no start period`,
            onClick: (W) => n("select", "initiative", I.id),
            onContextmenu: j((W) => n("context", W, "initiative", I.id), ["prevent"])
          }, [
            V(fe, {
              status: I.status
            }, null, 8, ["status"]),
            ie($(I.title), 1)
          ], 46, Yo))), 128)),
          (a(!0), c(M, null, P(E.offscreen, (I) => (a(), c("button", {
            key: I.id,
            class: U(["rm-chip rm-chip--offscreen", me(I.id)]),
            style: H({ "--rm-layer": he(I.layer_id) }),
            title: `${I.title} — ${I.start_period}, outside the visible window`,
            onClick: (W) => n("select", "initiative", I.id)
          }, $(I.title), 15, jo))), 128))
        ])) : R("", !0)
      ], 2))), 128)),
      e.model.todayPosition !== null ? (a(), c("div", {
        key: 0,
        class: "rm-today",
        style: H({ "--rm-today-pos": String(e.model.todayPosition) })
      }, null, 4)) : R("", !0),
      (a(), c("svg", Fo, [
        (a(!0), c(M, null, P(K.value, (E) => (a(), c("path", {
          key: E.id,
          d: E.d,
          class: U([`rm-edge--${E.kind}`, { "is-hot": E.hot }])
        }, null, 10, Ho))), 128))
      ]))
    ], 6));
  }
});
function Ce(e, t) {
  const r = e, n = r?.response?.data?.error ?? r?.data?.error, i = typeof n == "string" && n ? n : typeof r?.message == "string" && r.message && !/status code|request failed/i.test(r.message) ? r.message : "";
  return i ? /nothing to undo/i.test(i) ? "Nothing to undo." : /nothing to redo/i.test(i) ? "Nothing to redo." : i : t;
}
class qo {
  constructor(t) {
    this.roadmapId = t;
  }
  base() {
    return `/api/v1/workspace/roadmaps/${this.roadmapId}`;
  }
  /** The full snapshot: settings, every collection, current period, history position. */
  async state() {
    try {
      const { data: t } = await ke.get(this.base());
      if (!t.success) throw new Error(t.error || "failed to load the roadmap");
      return t.roadmap;
    } catch (t) {
      throw new Error(Ce(t, "Couldn’t load the roadmap."));
    }
  }
  /** One validated batch; the whole batch fails or the whole batch lands. */
  async apply(t) {
    try {
      const { data: r } = await ke.post(`${this.base()}/apply`, { commands: t });
      if (!r.success) throw new Error(r.error || "apply failed");
      return r.roadmap;
    } catch (r) {
      throw new Error(Ce(r, "Couldn’t save the change."));
    }
  }
  async undo() {
    try {
      const { data: t } = await ke.post(`${this.base()}/undo`, {});
      if (!t.success) throw new Error(t.error || "undo failed");
      return t.roadmap;
    } catch (t) {
      throw new Error(Ce(t, "Nothing to undo."));
    }
  }
  async redo() {
    try {
      const { data: t } = await ke.post(`${this.base()}/redo`, {});
      if (!t.success) throw new Error(t.error || "redo failed");
      return t.roadmap;
    } catch (t) {
      throw new Error(Ce(t, "Nothing to redo."));
    }
  }
}
function se() {
  const e = globalThis.crypto;
  return e && typeof e.randomUUID == "function" ? e.randomUUID() : `id-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}
function tt(e) {
  const t = { id: e.id || se(), title: e.title };
  return e.description && (t.description = e.description), e.color && (t.color = e.color), e.icon && (t.icon = e.icon), e.sortOrder !== void 0 && (t.sort_order = e.sortOrder), { type: F.LAYER_ADDED, body: t };
}
function Xo(e, t) {
  return { type: F.LAYER_UPDATED, body: { id: e, ...t } };
}
function Go(e) {
  return { type: F.LAYER_REMOVED, body: { id: e } };
}
function Jo(e) {
  const t = { id: e.id || se(), title: e.title };
  return e.description && (t.description = e.description), e.sortOrder !== void 0 && (t.sort_order = e.sortOrder), { type: F.OUTCOME_ADDED, body: t };
}
function Qo(e, t) {
  return { type: F.OUTCOME_UPDATED, body: { id: e, ...t } };
}
function Zo(e) {
  return { type: F.OUTCOME_REMOVED, body: { id: e } };
}
function es(e) {
  const t = { id: e.id || se(), title: e.title, layer_id: e.layerId };
  return e.description && (t.description = e.description), e.outcomeId && (t.outcome_id = e.outcomeId), e.status && (t.status = e.status), e.confidence && (t.confidence = e.confidence), e.size && (t.size = e.size), e.startPeriod && (t.start_period = e.startPeriod), e.span !== void 0 && (t.span = e.span), e.progress !== void 0 && (t.progress = e.progress), e.owner && (t.owner = e.owner), e.tags && (t.tags = e.tags), e.properties && (t.properties = e.properties), e.sortOrder !== void 0 && (t.sort_order = e.sortOrder), { type: F.INITIATIVE_ADDED, body: t };
}
function ts(e, t) {
  return { type: F.INITIATIVE_UPDATED, body: { id: e, ...t } };
}
function rs(e, t) {
  const r = { id: e };
  return t.startPeriod !== void 0 && (r.start_period = t.startPeriod), t.span !== void 0 && (r.span = Math.max(1, Math.round(t.span))), t.layerId !== void 0 && (r.layer_id = t.layerId), { type: F.INITIATIVE_UPDATED, body: r };
}
function ns(e) {
  return { type: F.INITIATIVE_REMOVED, body: { id: e } };
}
function rt(e) {
  const t = { id: e.id || se(), from_id: e.fromId, to_id: e.toId };
  return e.kind && (t.kind = e.kind), e.note && (t.note = e.note), { type: F.DEPENDENCY_ADDED, body: t };
}
function is(e, t) {
  return { type: F.DEPENDENCY_UPDATED, body: { id: e, ...t } };
}
function nt(e) {
  return { type: F.DEPENDENCY_REMOVED, body: { id: e } };
}
function os(e) {
  const t = { id: e.id || se(), title: e.title, period: e.period };
  return e.description && (t.description = e.description), e.layerId && (t.layer_id = e.layerId), e.initiativeIds && (t.initiative_ids = e.initiativeIds), { type: F.MILESTONE_ADDED, body: t };
}
function it(e, t) {
  return { type: F.MILESTONE_UPDATED, body: { id: e, ...t } };
}
function ss(e) {
  return { type: F.MILESTONE_REMOVED, body: { id: e } };
}
function Te(e) {
  return { type: F.SETTINGS_UPDATED, body: { settings: { ...e } } };
}
function as(e, t) {
  return { type: F.LENS_STATE_SET, body: { lens: e, state: t } };
}
const wt = 2;
function ls(e, t, r) {
  if (e.status === "done" || e.status === "dropped") return "past";
  const n = Q(e.start_period, r), i = Q(t, r);
  return n === null || i === null || n > i + wt ? "later" : n <= i ? "now" : "next";
}
const ot = [
  { horizon: "now", title: "Now", hint: "in flight or next up" },
  { horizon: "next", title: "Next", hint: "after current work lands" },
  { horizon: "later", title: "Later", hint: "directionally right, not scheduled" }
];
function ds(e, t = {}) {
  const r = e.settings.period_kind;
  return (t.includePast ? [...ot, { horizon: "past", title: "Shipped", hint: "done or dropped" }] : ot).map((i) => {
    const s = e.initiatives.filter((p) => ls(p, e.current_period, r) === i.horizon), v = [];
    for (const p of e.layers) {
      const l = s.filter((u) => u.layer_id === p.id);
      l.length && v.push({ layer: p, initiatives: l });
    }
    return { ...i, groups: v, count: s.length };
  });
}
function cs(e, t, r) {
  const n = Q(t, r);
  return n === null ? null : e === "now" ? n : e === "next" ? n + 1 : e === "later" ? n + wt + 1 : null;
}
function us(e, t) {
  return `kickside.thread.${e}.projection.${t}`;
}
const ms = ["start_period", "span", "layer_id"];
function ps(e, t, r) {
  for (const n of t) {
    if (n.type !== F.INITIATIVE_UPDATED) continue;
    const i = String(n.body.id || "");
    if (!i) continue;
    const s = {};
    for (const v of ms)
      if (n.body[v] !== void 0) {
        if (v === "span") {
          const p = Number(n.body.span);
          Number.isFinite(p) && (s.span = p);
          continue;
        }
        s[v] = String(n.body[v]);
      }
    Object.keys(s).length && e.set(i, { revision: r, placement: s });
  }
}
function vs(e, t) {
  for (const [r, n] of e)
    n.revision === t && e.delete(r);
}
function fs(e, t) {
  return (t.start_period === void 0 || e.start_period === t.start_period) && (t.span === void 0 || e.span === t.span) && (t.layer_id === void 0 || e.layer_id === t.layer_id);
}
function hs(e, t, r) {
  if (!t.size) return e;
  const n = new Set((e.initiatives || []).map((s) => s.id));
  for (const s of [...t.keys()]) n.has(s) || t.delete(s);
  if (!t.size) return e;
  const i = (e.initiatives || []).map((s) => {
    const v = t.get(s.id);
    return v ? r && fs(s, v.placement) ? (t.delete(s.id), s) : { ...s, ...v.placement } : s;
  });
  return { ...e, initiatives: i };
}
const bs = /* @__PURE__ */ new Set(["INPUT", "TEXTAREA", "SELECT"]);
function Ue(e) {
  const t = e?.tagName;
  return typeof t == "string" && bs.has(t.toUpperCase());
}
function gs(e) {
  if (Ue(e.target)) return null;
  const t = !!(e.ctrlKey || e.metaKey);
  return t && (e.key === "z" || e.key === "Z") ? e.shiftKey ? "redo" : "undo" : t && (e.key === "y" || e.key === "Y") ? "redo" : e.key === "Delete" || e.key === "Backspace" ? "delete" : e.key === "Escape" ? "escape" : null;
}
function ys(e) {
  if (Ue(e.target) || e.ctrlKey || e.metaKey || e.altKey || e.shiftKey) return null;
  const t = Number(e.key);
  return !Number.isInteger(t) || t < 1 || t > Ne.length ? null : Ne[t - 1];
}
function xs(e, t = "requires") {
  const r = /* @__PURE__ */ new Map(), n = /* @__PURE__ */ new Map();
  for (const i of e || []) {
    if (t === "requires" && i.kind !== "requires" || !i.from_id || !i.to_id) continue;
    const s = r.get(i.to_id) || [];
    s.push(i.from_id), r.set(i.to_id, s);
    const v = n.get(i.from_id) || [];
    v.push(i.to_id), n.set(i.from_id, v);
  }
  return { needs: r, unlocks: n };
}
function Oe(e, t, r) {
  const n = /* @__PURE__ */ new Set(), i = [...t.get(e) || []];
  for (; i.length; ) {
    const s = i.shift();
    s === e || n.has(s) || (n.add(s), r && i.push(...t.get(s) || []));
  }
  return n;
}
const _s = { selected: "", needs: /* @__PURE__ */ new Set(), unlocks: /* @__PURE__ */ new Set(), chain: /* @__PURE__ */ new Set() };
function ws(e, t, r = !1) {
  if (!e) return _s;
  const n = Oe(e, t.needs, r), i = Oe(e, t.unlocks, r), s = /* @__PURE__ */ new Set([e, ...n, ...i]);
  return { selected: e, needs: n, unlocks: i, chain: s };
}
function ks(e, t) {
  return Oe(e, t.unlocks, !0).size;
}
function Cs(e, t) {
  return e.map((r) => ({ id: r, score: ks(r, t) })).sort((r, n) => n.score - r.score || r.id.localeCompare(n.id));
}
const Es = { class: "rm-top" }, $s = { class: "rm-brand" }, Ss = {
  key: 0,
  class: "rm-lenses",
  "aria-label": "Lens"
}, Is = ["aria-pressed", "title", "aria-label", "onClick"], Ds = {
  key: 1,
  class: "rm-tools"
}, Ms = { class: "rm-window" }, zs = ["value"], Ps = ["value"], Ts = ["disabled"], As = ["disabled"], Rs = {
  key: 0,
  class: "rm-error",
  role: "status"
}, Ns = { class: "rm-body" }, Os = { class: "rm-stage" }, Ls = {
  key: 0,
  class: "rm-status"
}, Vs = {
  key: 1,
  class: "rm-foot"
}, Us = { key: 0 }, Ks = /* @__PURE__ */ ee({
  __name: "RoadmapApp",
  setup(e) {
    const t = Mr(), r = D(() => t.value?.entryId || ""), n = D(() => (t.value?.mode || "preview") === "full"), i = D(() => n.value && !t.value?.readOnly), s = Y(null), v = Y(!0), p = Y(""), l = Y("timeline"), u = Y(null), b = Y(!0), g = Y(null), x = Y(null), S = Y(null), O = Y({}), L = /* @__PURE__ */ new Map();
    let K = 0, y = 0, k = !1, z = Promise.resolve();
    const h = D(() => new qo(r.value)), w = ["var(--p-text-muted-color)", "var(--p-primary-color)", "color-mix(in srgb, var(--p-primary-color) 70%, var(--p-text-color))", "color-mix(in srgb, var(--p-primary-color) 55%, var(--p-text-color))", "color-mix(in srgb, var(--p-primary-color) 85%, var(--p-text-color))"], te = ["Platform", "Product", "Cloud", "Services", "Monetization"];
    function re(d, m) {
      return O.value[d]?.[m] === !0;
    }
    function ae(d, m) {
      const f = { ...O.value[d] || {}, [m]: !re(d, m) };
      O.value = { ...O.value, [d]: f };
    }
    const ce = D(() => re("timeline", "dropped")), ue = D(() => re("horizons", "past")), me = D(() => re("strata", "informs")), he = D(() => re("strata", "critical")), C = D(() => re("outcomes", "progress")), _ = D(() => xs(s.value?.dependencies || [])), E = D(() => u.value?.kind === "initiative" ? u.value.id : null), I = D(() => ws(E.value, _.value, l.value === "strata")), W = D(() => s.value ? Io(s.value, { includeDropped: ce.value }) : null), T = D(() => s.value ? ds(s.value, { includePast: ue.value }) : []), X = D(() => {
      if (!(!s.value || !he.value))
        return new Map(Cs(s.value.initiatives.map((d) => d.id), _.value).map((d) => [d.id, d.score]));
    }), kt = D(() => s.value ? mo(s.value, { includeDropped: ce.value, rank: X.value }) : []), Ct = D(() => po(s.value?.dependencies || [], { includeInforms: me.value })), Et = D(() => s.value ? Gi(s.value, { sortByProgress: C.value }) : []), $t = D(() => (s.value?.layers.length || 0) > 0), St = D(() => {
      const d = W.value;
      return !d || !d.columns.length ? "" : `${d.columns[0].label} – ${d.columns[d.columns.length - 1].label}`;
    }), It = {
      timeline: "tabler:timeline",
      horizons: "tabler:layout-columns",
      strata: "tabler:stack-2",
      outcomes: "tabler:target-arrow"
    };
    function Se(d, m = !1) {
      const f = hs(d, L, m), A = f.settings || Qe;
      s.value = {
        entry_id: f.entry_id || r.value,
        thread_id: f.thread_id || "",
        settings: {
          period_kind: A.period_kind || "quarter",
          origin: A.origin || "",
          columns: Math.max(1, Number(A.columns) || Qe.columns),
          default_lens: A.default_lens || "timeline",
          lens_state: A.lens_state || {}
        },
        current_period: f.current_period || "",
        current_position: typeof f.current_position == "number" ? f.current_position : void 0,
        layers: f.layers || [],
        outcomes: f.outcomes || [],
        initiatives: f.initiatives || [],
        dependencies: f.dependencies || [],
        milestones: f.milestones || [],
        counts: f.counts || { layers: 0, outcomes: 0, initiatives: 0, dependencies: 0, milestones: 0 },
        can_undo: f.can_undo === !0,
        can_redo: f.can_redo === !0
      }, k || (k = !0, O.value = s.value.settings.lens_state, l.value = n.value ? s.value.settings.default_lens : "timeline"), u.value && !Dt(u.value) && (u.value = null);
    }
    function Dt(d) {
      const m = s.value;
      return m ? {
        initiative: m.initiatives,
        dependency: m.dependencies,
        milestone: m.milestones,
        layer: m.layers,
        outcome: m.outcomes
      }[d.kind].some((A) => A.id === d.id) : !1;
    }
    async function Ie(d = !1) {
      if (!r.value) {
        p.value = "entry id required", v.value = !1;
        return;
      }
      const m = ++y;
      try {
        const f = await h.value.state();
        if (m !== y) return;
        Se(f, d), p.value = "";
      } catch (f) {
        if (m !== y) return;
        p.value = f instanceof Error ? f.message : "Couldn’t load the roadmap.";
      } finally {
        m === y && (v.value = !1);
      }
    }
    function Ke(d) {
      const m = z.then(d);
      return z = m.catch((f) => {
        p.value = f instanceof Error ? f.message : "Couldn’t save the change.";
      }), m;
    }
    async function Mt(d, m = {}) {
      try {
        Se(await h.value.apply(d)), p.value = "";
      } catch (f) {
        m.moveRevision !== void 0 && (vs(L, m.moveRevision), await Ie()), p.value = f instanceof Error ? f.message : "Couldn’t save the change.";
      }
    }
    function Z(d, m = {}) {
      return !i.value || !d.length ? Promise.resolve() : Ke(() => Mt(d, m));
    }
    async function zt(d) {
      const m = s.value;
      if (m && !(d === "undo" && !m.can_undo) && !(d === "redo" && !m.can_redo))
        try {
          L.clear(), Se(d === "undo" ? await h.value.undo() : await h.value.redo()), p.value = "";
        } catch (f) {
          p.value = f instanceof Error ? f.message : `Couldn’t ${d}.`;
        }
    }
    function xe(d) {
      return i.value ? Ke(() => zt(d)) : Promise.resolve();
    }
    function ne(d, m) {
      const f = u.value;
      u.value = f && f.kind === d && f.id === m ? null : { kind: d, id: m }, u.value && (b.value = !0), x.value = null;
    }
    function Be(d) {
      l.value = d;
    }
    const Ye = D(() => s.value?.settings.default_lens === l.value);
    function Pt() {
      Ye.value || Z([Te({ default_lens: l.value })]);
    }
    function Tt() {
      Z([as(l.value, O.value[l.value] || {})]);
    }
    async function At() {
      g.value = null, await ge(), S.value?.focus();
    }
    function Rt(d) {
      g.value = {
        x: d.clientX,
        y: d.clientY,
        items: [
          { label: "Set as default lens", action: Pt, disabled: Ye.value },
          { label: "Remember view", action: Tt }
        ]
      };
    }
    function Nt(d, m, f) {
      Z([{
        initiative: ts,
        dependency: is,
        milestone: it,
        layer: Xo,
        outcome: Qo
      }[d](m, f)]);
    }
    function Ot(d, m) {
      const f = s.value;
      if (!f) return [];
      if (d !== "initiative")
        return [{
          dependency: nt,
          milestone: ss,
          layer: Go,
          outcome: Zo
        }[d](m)];
      const A = [];
      for (const G of f.dependencies)
        (G.from_id === m || G.to_id === m) && A.push(nt(G.id));
      for (const G of f.milestones)
        G.initiative_ids.includes(m) && A.push(it(G.id, { initiative_ids: G.initiative_ids.filter((de) => de !== m) }));
      return A.push(ns(m)), A;
    }
    function De(d, m) {
      const f = Ot(d, m);
      f.length && (u.value?.id === m && (u.value = null), Z(f));
    }
    function je(d, m) {
      const f = rs(d, m), A = ++K;
      ps(L, [f], A), Z([f], { moveRevision: A });
    }
    function Fe(d) {
      const m = s.value;
      if (!m || !m.layers.length) return;
      const f = se(), A = d || (E.value ? m.initiatives.find((G) => G.id === E.value)?.layer_id : "") || m.layers[0].id;
      Z([es({ id: f, title: "New initiative", layerId: A, startPeriod: m.current_period, status: "idea" })]), ne("initiative", f);
    }
    function He() {
      const d = s.value;
      if (!d) return;
      const m = se(), f = d.layers.reduce((A, G) => Math.max(A, G.sort_order), -1) + 1;
      Z([tt({ id: m, title: "New layer", color: w[f % w.length], sortOrder: f })]), ne("layer", m);
    }
    function Lt() {
      const d = te.map((m, f) => tt({ title: m, color: w[f % w.length], sortOrder: f }));
      Z(d);
    }
    function Vt() {
      const d = s.value;
      if (!d) return;
      const m = se();
      Z([Jo({ id: m, title: "New outcome", sortOrder: d.outcomes.length })]), ne("outcome", m);
    }
    function Ut() {
      const d = s.value;
      if (!d || !d.current_period) return;
      const m = se();
      Z([os({ id: m, title: "New milestone", period: d.current_period })]), ne("milestone", m);
    }
    function We(d) {
      const m = s.value;
      if (!m) return;
      const f = Fr(m.settings.origin, d, m.settings.period_kind);
      f && Z([Te({ origin: f })]);
    }
    function Kt(d) {
      const m = Math.max(1, Math.round(Number(d.target.value) || 0));
      Z([Te({ columns: m })]);
    }
    function Bt(d, m) {
      const f = s.value;
      if (!f) return;
      const A = cs(m, f.current_period, f.settings.period_kind);
      A !== null && (ne("initiative", d), x.value = { id: d, horizon: m, period: ye(A, f.settings.period_kind) });
    }
    function Yt() {
      const d = x.value;
      d && (x.value = null, je(d.id, { startPeriod: d.period }));
    }
    function _e(d, m, f) {
      if (!i.value) return;
      const A = [{ label: "Open in panel", action: () => ne(m, f) }];
      if (m === "initiative") {
        const G = s.value, de = E.value;
        de && de !== f && (A.push({ label: `Make “${qe(de)}” need this`, action: () => void Z([rt({ fromId: f, toId: de })]) }), A.push({ label: `Make this need “${qe(de)}”`, action: () => void Z([rt({ fromId: de, toId: f })]) })), G && A.push({ label: "Add initiative in this layer", action: () => Fe(G.initiatives.find((Ht) => Ht.id === f)?.layer_id) });
      }
      A.push({ label: `Remove ${m}`, action: () => De(m, f), danger: !0 }), g.value = { x: d.clientX, y: d.clientY, items: A };
    }
    function qe(d) {
      return s.value?.initiatives.find((m) => m.id === d)?.title || d;
    }
    function jt(d) {
      g.value = {
        x: d.clientX,
        y: d.clientY,
        items: [
          { label: "Initiative", action: () => Fe() },
          { label: "Layer", action: () => He() },
          { label: "Outcome", action: () => Vt() },
          { label: "Milestone", action: () => Ut() }
        ]
      };
    }
    function le(d) {
      d.preventDefault(), d.stopPropagation();
    }
    function Ft(d) {
      if (!n.value) return;
      if (Ue(d.target)) {
        if (d.key === "Escape") {
          const A = d.target;
          typeof A.blur == "function" && A.blur(), le(d);
        }
        return;
      }
      const m = ys({ key: d.key, ctrlKey: d.ctrlKey, metaKey: d.metaKey, shiftKey: d.shiftKey, altKey: d.altKey, target: d.target });
      if (m) {
        le(d), Be(m);
        return;
      }
      const f = gs({ key: d.key, ctrlKey: d.ctrlKey, metaKey: d.metaKey, shiftKey: d.shiftKey, target: d.target });
      !i.value && ["undo", "redo", "delete"].includes(f || "") || (f === "undo" ? (le(d), xe("undo")) : f === "redo" ? (le(d), xe("redo")) : f === "delete" ? u.value && (le(d), De(u.value.kind, u.value.id)) : f === "escape" && (g.value ? (le(d), g.value = null) : x.value ? (le(d), x.value = null) : u.value && (le(d), u.value = null)));
    }
    let Me = [];
    return at(async () => {
      await Ie();
      const d = s.value?.thread_id;
      if (d)
        try {
          Me.push(lt(us(d, cn), () => {
            Ie(!0);
          }));
        } catch {
          p.value = "Live updates are unavailable. Reload to read the latest roadmap.";
        }
    }), Ee(() => {
      const d = [];
      for (const m of Me)
        try {
          m();
        } catch (f) {
          d.push(f);
        }
      if (Me = [], d.length) throw new AggregateError(d, "Couldn’t close live updates.");
    }), (d, m) => (a(), c("div", {
      ref_key: "rootEl",
      ref: S,
      class: U(["rm", { "rm--preview": !n.value }]),
      tabindex: "0",
      onKeydown: Ft
    }, [
      o("header", Es, [
        o("span", $s, [
          V(N(J), {
            icon: "tabler:map-2",
            "aria-hidden": "true"
          }),
          m[13] || (m[13] = o("span", null, "Roadmap", -1))
        ]),
        n.value ? (a(), c("nav", Ss, [
          (a(!0), c(M, null, P(N(Ne), (f) => (a(), c("button", {
            key: f,
            class: U(["rm-lens-btn", { "is-active": l.value === f }]),
            "aria-pressed": l.value === f,
            title: `${f[0].toUpperCase() + f.slice(1)} lens`,
            "aria-label": `${f[0].toUpperCase() + f.slice(1)} lens`,
            onClick: (A) => Be(f)
          }, [
            V(N(J), {
              icon: It[f],
              "aria-hidden": "true"
            }, null, 8, ["icon"]),
            o("span", null, $(f[0].toUpperCase() + f.slice(1)), 1)
          ], 10, Is))), 128))
        ])) : R("", !0),
        m[15] || (m[15] = o("span", { class: "rm-spacer" }, null, -1)),
        n.value && s.value ? (a(), c("div", Ds, [
          l.value === "timeline" ? (a(), c(M, { key: 0 }, [
            o("button", {
              class: "rm-icon-btn",
              title: "Earlier window",
              "aria-label": "Earlier window",
              onClick: m[0] || (m[0] = (f) => We(-1))
            }, [
              V(N(J), {
                icon: "tabler:chevron-left",
                "aria-hidden": "true"
              })
            ]),
            o("span", Ms, $(St.value), 1),
            o("button", {
              class: "rm-icon-btn",
              title: "Later window",
              "aria-label": "Later window",
              onClick: m[1] || (m[1] = (f) => We(1))
            }, [
              V(N(J), {
                icon: "tabler:chevron-right",
                "aria-hidden": "true"
              })
            ]),
            o("select", {
              class: "rm-select",
              value: s.value.settings.columns,
              title: "Visible periods",
              "aria-label": "Visible periods",
              onChange: Kt
            }, [
              (a(), c(M, null, P([3, 4, 5, 6, 8, 12], (f) => o("option", {
                key: f,
                value: f
              }, $(f) + " cols", 9, Ps)), 64))
            ], 40, zs),
            o("button", {
              class: U(["rm-chip-btn", { "is-on": ce.value }]),
              onClick: m[2] || (m[2] = (f) => ae("timeline", "dropped"))
            }, "Dropped", 2)
          ], 64)) : l.value === "horizons" ? (a(), c("button", {
            key: 1,
            class: U(["rm-chip-btn", { "is-on": ue.value }]),
            onClick: m[3] || (m[3] = (f) => ae("horizons", "past"))
          }, "Shipped", 2)) : l.value === "strata" ? (a(), c(M, { key: 2 }, [
            o("button", {
              class: U(["rm-chip-btn", { "is-on": me.value }]),
              onClick: m[4] || (m[4] = (f) => ae("strata", "informs"))
            }, "Informs", 2),
            o("button", {
              class: U(["rm-chip-btn", { "is-on": he.value }]),
              onClick: m[5] || (m[5] = (f) => ae("strata", "critical"))
            }, "Critical", 2)
          ], 64)) : (a(), c("button", {
            key: 3,
            class: U(["rm-chip-btn", { "is-on": C.value }]),
            onClick: m[6] || (m[6] = (f) => ae("outcomes", "progress"))
          }, "Sort by progress", 2)),
          o("button", {
            class: "rm-icon-btn rm-more-btn",
            title: "View options",
            "aria-label": "View options",
            onClick: Rt
          }, [
            V(N(J), {
              icon: "tabler:dots",
              "aria-hidden": "true"
            })
          ]),
          m[14] || (m[14] = o("span", { class: "rm-vsep" }, null, -1)),
          i.value ? (a(), c("button", {
            key: 4,
            class: "rm-icon-btn",
            title: "Add",
            "aria-label": "Add",
            onClick: jt
          }, [
            V(N(J), {
              icon: "tabler:plus",
              "aria-hidden": "true"
            })
          ])) : R("", !0),
          i.value ? (a(), c("button", {
            key: 5,
            class: "rm-icon-btn",
            disabled: !s.value.can_undo,
            title: "Undo",
            "aria-label": "Undo",
            onClick: m[7] || (m[7] = (f) => xe("undo"))
          }, [
            V(N(J), {
              icon: "tabler:arrow-back-up",
              "aria-hidden": "true"
            })
          ], 8, Ts)) : R("", !0),
          i.value ? (a(), c("button", {
            key: 6,
            class: "rm-icon-btn",
            disabled: !s.value.can_redo,
            title: "Redo",
            "aria-label": "Redo",
            onClick: m[8] || (m[8] = (f) => xe("redo"))
          }, [
            V(N(J), {
              icon: "tabler:arrow-forward-up",
              "aria-hidden": "true"
            })
          ], 8, As)) : R("", !0),
          o("button", {
            class: U(["rm-icon-btn", { "is-on": b.value }]),
            title: "Toggle panel",
            "aria-label": "Toggle panel",
            onClick: m[9] || (m[9] = (f) => b.value = !b.value)
          }, [
            V(N(J), {
              icon: "tabler:layout-sidebar-right",
              "aria-hidden": "true"
            })
          ], 2)
        ])) : R("", !0)
      ]),
      p.value ? (a(), c("div", Rs, [
        o("span", null, $(p.value), 1),
        o("button", {
          class: "rm-icon-btn",
          title: "Dismiss",
          "aria-label": "Dismiss",
          onClick: m[10] || (m[10] = (f) => p.value = "")
        }, [
          V(N(J), {
            icon: "tabler:x",
            "aria-hidden": "true"
          })
        ])
      ])) : R("", !0),
      o("div", Ns, [
        o("main", Os, [
          v.value ? (a(), c("p", Ls, "Loading the roadmap…")) : s.value && !$t.value ? (a(), oe(Lr, {
            key: 1,
            editable: i.value,
            starter: te,
            onAddLayer: He,
            onAddStarter: Lt
          }, null, 8, ["editable"])) : s.value && l.value === "timeline" && W.value ? (a(), oe(Wo, {
            key: 2,
            state: s.value,
            model: W.value,
            "selected-id": E.value,
            trace: I.value,
            editable: i.value,
            compact: !n.value,
            onSelect: ne,
            onPlace: je,
            onContext: _e
          }, null, 8, ["state", "model", "selected-id", "trace", "editable", "compact"])) : s.value && l.value === "horizons" ? (a(), oe(on, {
            key: 3,
            columns: T.value,
            "period-kind": s.value.settings.period_kind,
            "selected-id": E.value,
            trace: I.value,
            editable: i.value,
            onSelect: ne,
            onSchedule: Bt,
            onContext: _e
          }, null, 8, ["columns", "period-kind", "selected-id", "trace", "editable"])) : s.value && l.value === "strata" ? (a(), oe(ko, {
            key: 4,
            bands: kt.value,
            edges: Ct.value,
            "selected-id": E.value,
            trace: I.value,
            ranks: X.value,
            onSelect: ne,
            onContext: _e
          }, null, 8, ["bands", "edges", "selected-id", "trace", "ranks"])) : s.value ? (a(), oe(co, {
            key: 5,
            cards: Et.value,
            layers: s.value.layers,
            "period-kind": s.value.settings.period_kind,
            "selected-id": E.value,
            trace: I.value,
            onSelect: ne,
            onContext: _e
          }, null, 8, ["cards", "layers", "period-kind", "selected-id", "trace"])) : R("", !0)
        ]),
        n.value && b.value && s.value ? (a(), oe(qi, {
          key: 0,
          state: s.value,
          selection: u.value,
          trace: I.value,
          editable: i.value,
          suggestion: x.value,
          onPatch: Nt,
          onRemove: De,
          onSelect: ne,
          onApplySuggestion: Yt,
          onDismissSuggestion: m[11] || (m[11] = (f) => x.value = null),
          onClose: m[12] || (m[12] = (f) => b.value = !1)
        }, null, 8, ["state", "selection", "trace", "editable", "suggestion"])) : R("", !0)
      ]),
      !n.value && s.value ? (a(), c("footer", Vs, [
        o("span", null, $(s.value.counts.initiatives) + " initiatives across " + $(s.value.counts.layers) + " layers", 1),
        s.value.current_period ? (a(), c("span", Us, $(N($e)(s.value.current_period, s.value.settings.period_kind)), 1)) : R("", !0)
      ])) : R("", !0),
      g.value ? (a(), oe(Tr, {
        key: 2,
        x: g.value.x,
        y: g.value.y,
        items: g.value.items,
        onClose: At
      }, null, 8, ["x", "y", "items"])) : R("", !0)
    ], 34));
  }
}), Bs = ':host{display:block;position:relative;width:100%;height:100%;container-type:inline-size;container-name:roadmap;--rm-bg: var(--p-content-background);--rm-text: var(--p-text-color);--rm-muted: var(--p-text-muted-color, var(--p-text-secondary-color));--rm-line: var(--p-content-border-color);--rm-line-soft: color-mix(in srgb, var(--rm-line) 55%, transparent);--rm-surface: color-mix(in srgb, var(--rm-text) 4%, var(--rm-bg));--rm-panel: color-mix(in srgb, var(--rm-text) 2%, var(--rm-bg));--rm-raised: color-mix(in srgb, var(--rm-text) 7%, var(--rm-bg));--rm-hover: color-mix(in srgb, var(--rm-text) 6%, transparent);--rm-accent: var(--p-primary-color);--rm-accent-soft: color-mix(in srgb, var(--rm-accent) 14%, transparent);--rm-danger: var(--p-danger-color, var(--p-danger-500));--rm-info: var(--p-info-color, var(--p-info-500));--rm-today: var(--p-danger-color, var(--p-danger-500));--rm-fs-label: 10px;--rm-fs-meta: 11px;--rm-fs-body: 12px;--rm-fs-title: 14px;--rm-1: 4px;--rm-2: 8px;--rm-3: 12px;--rm-4: 16px;--rm-5: 20px;--rm-6: 24px;--rm-r-sm: 6px;--rm-r: 8px;--rm-r-lg: 14px;--rm-shadow: 0 6px 22px -8px color-mix(in srgb, var(--rm-text) 28%, transparent);color:var(--rm-text);background:var(--rm-bg);font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,sans-serif;font-size:var(--rm-fs-body);line-height:1.45}:host([mode="preview"]){min-height:320px}*{box-sizing:border-box}button,input,select,textarea{font:inherit;color:inherit}button{border:0;background:none;cursor:pointer}.rm{position:absolute;inset:0;display:flex;flex-direction:column;background:var(--rm-bg);overflow:hidden;outline:none}:where(.rm) button:focus-visible,:where(.rm) input:focus-visible,:where(.rm) select:focus-visible,:where(.rm) textarea:focus-visible,:where(.rm) [role=button]:focus-visible{outline:var(--p-focus-ring-width) var(--p-focus-ring-style) var(--p-focus-ring-color);outline-offset:var(--p-focus-ring-offset);border-radius:var(--rm-r-sm)}.rm-top{display:flex;align-items:center;gap:var(--rm-3);padding:var(--rm-2) var(--rm-3);border-bottom:1px solid var(--rm-line);background:var(--rm-panel);flex:none}.rm-brand{display:inline-flex;align-items:center;gap:var(--rm-2);font-weight:600;font-size:var(--rm-fs-title)}.rm-brand svg{width:16px;height:16px;color:var(--rm-accent)}.rm-spacer{flex:1}.rm-lenses{display:inline-flex;gap:2px;padding:2px;border:1px solid var(--rm-line);border-radius:var(--rm-r);background:var(--rm-bg)}.rm-lens-btn{display:inline-flex;align-items:center;gap:5px;height:24px;padding:0 var(--rm-2);border-radius:var(--rm-r-sm);color:var(--rm-muted);font-size:var(--rm-fs-meta);text-transform:capitalize}.rm-lens-btn svg{width:14px;height:14px}.rm-lens-btn:hover{background:var(--rm-hover);color:var(--rm-text)}.rm-lens-btn.is-active{background:var(--rm-accent-soft);color:var(--rm-text);font-weight:600}.rm-tools{display:inline-flex;align-items:center;gap:var(--rm-1)}.rm-window{font-size:var(--rm-fs-meta);color:var(--rm-muted);font-variant-numeric:tabular-nums;white-space:nowrap}.rm-vsep{width:1px;height:18px;background:var(--rm-line);margin:0 var(--rm-1)}.rm-icon-btn{display:inline-flex;align-items:center;justify-content:center;width:28px;height:28px;border-radius:var(--rm-r-sm);color:var(--rm-muted)}.rm-icon-btn svg{width:16px;height:16px}.rm-icon-btn:hover:not(:disabled){background:var(--rm-hover);color:var(--rm-text)}.rm-icon-btn:disabled{opacity:.38;cursor:default}.rm-icon-btn.is-on{color:var(--rm-accent);background:var(--rm-accent-soft)}.rm-chip-btn{height:22px;padding:0 var(--rm-2);border:1px solid var(--rm-line);border-radius:var(--rm-r-sm);color:var(--rm-muted);font-size:var(--rm-fs-meta)}.rm-chip-btn:hover{color:var(--rm-text)}.rm-chip-btn.is-on{border-color:var(--rm-accent);color:var(--rm-text);background:var(--rm-accent-soft)}.rm-select{height:24px;padding:0 var(--rm-1);border:1px solid var(--rm-line);border-radius:var(--rm-r-sm);background:var(--rm-bg);font-size:var(--rm-fs-meta);color:var(--rm-muted)}.rm-error{display:flex;align-items:center;gap:var(--rm-2);padding:var(--rm-2) var(--rm-3);border-bottom:1px solid var(--rm-line);background:color-mix(in srgb,var(--rm-danger) 10%,var(--rm-bg));color:var(--rm-text);font-size:var(--rm-fs-meta);flex:none}.rm-error span{flex:1;min-width:0;overflow-wrap:anywhere}.rm-body{position:relative;display:flex;flex:1;min-height:0}.rm-stage{flex:1;min-width:0;overflow:auto;padding:var(--rm-3)}.rm-status{color:var(--rm-muted);font-size:var(--rm-fs-meta);padding:var(--rm-4)}.rm-foot{display:flex;justify-content:space-between;gap:var(--rm-2);padding:var(--rm-1) var(--rm-3);border-top:1px solid var(--rm-line);color:var(--rm-muted);font-size:var(--rm-fs-label);text-transform:uppercase;letter-spacing:.08em;flex:none}.rm-dot{width:8px;height:8px;border-radius:50%;background:var(--rm-dot-color, var(--rm-accent));flex:none}.rm-size{font-size:var(--rm-fs-label);font-weight:600;font-variant-numeric:tabular-nums;color:var(--rm-muted)}.rm-st{width:10px;height:10px;flex:none}.rm-st circle{fill:none;stroke:var(--rm-glyph, currentColor);stroke-width:1.5}.rm-st path{fill:var(--rm-glyph, currentColor)}.rm-st--done circle{fill:var(--rm-glyph, currentColor)}.rm-st--idea circle{stroke-dasharray:2 1.5}.rm-st--dropped{opacity:.55}.rm-st--dropped path{fill:none;stroke:var(--rm-glyph, currentColor);stroke-width:1.5}.rm-conf{display:inline-flex;gap:1.5px;align-items:flex-end}.rm-conf i{width:3px;background:var(--rm-line);border-radius:1px}.rm-conf i:nth-child(1){height:4px}.rm-conf i:nth-child(2){height:6px}.rm-conf i:nth-child(3){height:8px}.rm-conf--high i,.rm-conf--med i:nth-child(-n+2),.rm-conf--low i:first-child{background:var(--rm-muted)}.rm .is-dim{opacity:.3}.rm .is-sel{box-shadow:0 0 0 2px var(--rm-accent)}.rm .is-need{box-shadow:0 0 0 2px var(--rm-muted)}.rm .is-unlock{box-shadow:0 0 0 2px var(--rm-muted);border-style:dashed}.rm-bar--low,.rm-pill--low,.rm-card--low,.rm-swatch--low{background-image:repeating-linear-gradient(135deg,transparent 0 4px,color-mix(in srgb,var(--rm-layer, var(--rm-text)) 26%,transparent) 4px 6px)}.rm-overlay{position:absolute;inset:0;width:100%;height:100%;pointer-events:none;overflow:visible;z-index:0}.rm-overlay path{fill:none;stroke:var(--rm-line);stroke-width:1.25}.rm-overlay path.rm-edge--informs{stroke-dasharray:3 3}.rm-overlay path.is-hot{stroke:var(--rm-accent);stroke-width:1.75}.rm-tl{--rm-label: 156px;position:relative;min-width:720px}.rm-tl--compact{--rm-label: 120px;min-width:560px}.rm-tl-head,.rm-tl-ms{display:grid;grid-template-columns:var(--rm-label) repeat(var(--rm-cols),1fr)}.rm-tl-head{border-bottom:1px solid var(--rm-line)}.rm-tl-head>div{padding:var(--rm-1) var(--rm-2);border-left:1px solid var(--rm-line-soft);color:var(--rm-muted);font-size:var(--rm-fs-label);font-weight:700;letter-spacing:.1em;text-transform:uppercase}.rm-tl-head>div:first-child{border-left:0}.rm-tl-head>div.is-current{color:var(--rm-text)}.rm-tl-ms{position:relative;height:calc(26px + (var(--rm-ms-rows, 1) - 1) * 18px);border-bottom:1px solid var(--rm-line-soft)}.rm-tl-head-lab{align-self:center;padding:0 var(--rm-2);color:var(--rm-muted);font-size:var(--rm-fs-label);font-weight:700;letter-spacing:.1em;text-transform:uppercase}.rm-ms{position:absolute;top:calc(13px + var(--rm-ms-row, 0) * 18px);transform:translate(-50%,-50%);display:inline-flex;align-items:center;gap:5px;padding:0 var(--rm-1);color:var(--rm-text);font-size:var(--rm-fs-meta);white-space:nowrap;z-index:2}.rm-ms i{width:8px;height:8px;background:var(--rm-text);transform:rotate(45deg);flex:none}.rm-ms:hover{color:var(--rm-accent)}.rm-ms:hover i{background:var(--rm-accent)}.rm-tl-lane{display:grid;grid-template-columns:var(--rm-label) 1fr;border-bottom:1px solid var(--rm-line-soft)}.rm-tl-lane:last-of-type{border-bottom:0}.rm-tl-lane.is-drop{background:var(--rm-accent-soft)}.rm-tl-lab{grid-column:1;grid-row:1;display:flex;align-items:flex-start;gap:var(--rm-2);padding:var(--rm-2);font-weight:500}.rm-tl-lab .rm-dot{margin-top:5px}.rm-tl-lab small{display:block;color:var(--rm-muted);font-size:var(--rm-fs-label);font-weight:400}.rm-tl-rows{grid-column:2;grid-row:1;display:flex;flex-direction:column;gap:var(--rm-1);padding:var(--rm-2) 0;background-image:linear-gradient(to right,var(--rm-line-soft) 1px,transparent 1px);background-size:calc(100% / var(--rm-cols)) 100%}.rm-tl-row{display:grid;grid-template-columns:repeat(var(--rm-cols),1fr);height:24px}.rm-tl-row--empty{height:14px}.rm-tl--compact .rm-tl-row{height:20px}.rm-bar{position:relative;z-index:1;display:flex;align-items:center;gap:6px;margin:0 3px;padding:0 var(--rm-2);border:1px solid var(--rm-layer, var(--rm-accent));border-radius:5px;background:color-mix(in srgb,var(--rm-layer, var(--rm-accent)) 14%,var(--rm-bg));color:var(--rm-text);font-size:var(--rm-fs-meta);white-space:nowrap;overflow:hidden;cursor:pointer;touch-action:none}.rm-bar-title{position:relative;overflow:hidden;text-overflow:ellipsis}.rm-bar-size{position:relative;margin-left:auto;font-size:var(--rm-fs-label);font-weight:600;color:var(--rm-muted)}.rm-bar .rm-st{position:relative}.rm-bar--planned{background:var(--rm-bg)}.rm-bar--idea{border-style:dashed;background:transparent;color:var(--rm-muted)}.rm-bar--done{background:color-mix(in srgb,var(--rm-layer, var(--rm-accent)) 24%,var(--rm-bg));color:var(--rm-text)}.rm-bar--done .rm-bar-size{color:var(--rm-muted)}.rm-bar--dropped{opacity:.45;border-style:dotted;background:transparent}.rm-bar--active:before{content:"";position:absolute;inset:0;width:var(--rm-progress, 0%);background:color-mix(in srgb,var(--rm-layer, var(--rm-accent)) 30%,transparent)}.rm-bar--clip-start{border-left-style:dotted;border-top-left-radius:0;border-bottom-left-radius:0}.rm-bar--clip-end{border-right-style:dotted;border-top-right-radius:0;border-bottom-right-radius:0}.rm-bar.is-dragging{z-index:5;box-shadow:var(--rm-shadow);cursor:grabbing}.rm-tl--dragging{user-select:none}.rm-bar-grip{position:absolute;top:0;right:0;width:8px;height:100%;cursor:ew-resize;background:linear-gradient(to right,transparent,color-mix(in srgb,var(--rm-layer, var(--rm-accent)) 40%,transparent))}.rm-tl-aside{grid-column:2;grid-row:2;display:flex;flex-wrap:wrap;gap:var(--rm-1);padding:0 var(--rm-1) var(--rm-2)}.rm-chip{display:inline-flex;align-items:center;gap:5px;height:20px;padding:0 var(--rm-2);border:1px dashed var(--rm-line);border-radius:10px;color:var(--rm-muted);font-size:var(--rm-fs-label)}.rm-chip:hover{color:var(--rm-text);border-color:var(--rm-layer, var(--rm-accent))}.rm-chip--offscreen{border-style:dotted}.rm-today{position:absolute;top:0;bottom:0;width:0;border-left:1px dashed var(--rm-today);left:calc(var(--rm-label) + (100% - var(--rm-label)) * var(--rm-today-pos, 0));pointer-events:none;z-index:3}.rm-today:after{content:"today";position:absolute;top:2px;left:4px;color:var(--rm-today);font-size:var(--rm-fs-label);font-weight:600;letter-spacing:.06em}.rm-hz{display:grid;grid-template-columns:repeat(3,minmax(200px,1fr));gap:var(--rm-3);min-width:660px}.rm-hz-col{display:flex;flex-direction:column;gap:var(--rm-2);padding:var(--rm-2);border:1px solid var(--rm-line-soft);border-radius:var(--rm-r);background:var(--rm-panel)}.rm-hz-head{display:flex;align-items:baseline;gap:var(--rm-2);padding:var(--rm-1) var(--rm-1) var(--rm-2);border-bottom:1px solid var(--rm-line)}.rm-hz-head b{font-size:var(--rm-fs-body);font-weight:600}.rm-hz-head span{color:var(--rm-muted);font-size:var(--rm-fs-label)}.rm-hz-head em{margin-left:auto;color:var(--rm-muted);font-size:var(--rm-fs-label);font-style:normal;font-variant-numeric:tabular-nums}.rm-hz-group{margin-top:var(--rm-1);padding:0 var(--rm-1);color:var(--rm-muted);font-size:var(--rm-fs-label);font-weight:700;letter-spacing:.1em;text-transform:uppercase}.rm-hz-empty{margin:0;padding:var(--rm-2) var(--rm-1);color:var(--rm-muted);font-size:var(--rm-fs-meta)}.rm-card{display:flex;flex-direction:column;gap:6px;padding:var(--rm-2) 10px;border:1px solid var(--rm-line);border-radius:14px;background:var(--rm-bg);cursor:pointer}.rm-card-title{display:flex;align-items:center;gap:6px;font-weight:500}.rm-card-meta{display:flex;align-items:center;gap:var(--rm-2);color:var(--rm-muted);font-size:var(--rm-fs-label)}.rm-card-period{margin-left:auto;font-variant-numeric:tabular-nums}.rm-lchip{display:inline-flex;align-items:center;gap:4px;padding:1px 6px 1px 4px;border-radius:4px;background:color-mix(in srgb,var(--rm-layer, var(--rm-accent)) 16%,transparent);color:var(--rm-layer, var(--rm-accent));font-weight:500}.rm-lchip .rm-dot{width:6px;height:6px}.rm-strata{position:relative;display:flex;flex-direction:column;min-width:660px}.rm-stratum{display:grid;grid-template-columns:156px 1fr;align-items:center;min-height:60px;border-top:1px dashed var(--rm-line)}.rm-stratum:first-of-type{border-top:0}.rm-stratum-lab{display:flex;align-items:center;gap:var(--rm-2);padding:var(--rm-2);font-weight:500}.rm-stratum-lab small{display:block;color:var(--rm-muted);font-size:var(--rm-fs-label);font-weight:400}.rm-stratum-pills{display:flex;flex-wrap:wrap;gap:var(--rm-2);padding:var(--rm-3) var(--rm-2)}.rm-stratum-empty{color:var(--rm-muted);font-size:var(--rm-fs-meta)}.rm-pill{position:relative;z-index:1;display:inline-flex;align-items:center;gap:6px;height:26px;padding:0 10px;border:1px solid var(--rm-layer, var(--rm-accent));border-radius:6px;background:color-mix(in srgb,var(--rm-layer, var(--rm-accent)) 12%,var(--rm-bg));font-size:var(--rm-fs-meta);white-space:nowrap}.rm-pill--planned{background:var(--rm-bg)}.rm-pill--idea{border-style:dashed;background:transparent;color:var(--rm-muted)}.rm-pill--done{background:color-mix(in srgb,var(--rm-layer, var(--rm-accent)) 72%,var(--rm-bg));border-color:transparent;color:var(--rm-bg)}.rm-pill--dropped{opacity:.45;border-style:dotted;background:transparent}.rm-pill-rank{padding:0 5px;border-radius:14px;background:var(--rm-raised);color:var(--rm-muted);font-size:var(--rm-fs-label);font-style:normal;font-variant-numeric:tabular-nums}.rm-oc{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:var(--rm-3)}.rm-obj{display:flex;flex-direction:column;gap:var(--rm-2);padding:var(--rm-3);border:1px solid var(--rm-line);border-radius:var(--rm-r);background:var(--rm-panel)}.rm-obj-head h3{margin:0;font-size:var(--rm-fs-title);font-weight:600;line-height:1.25}.rm-obj-head.is-clickable{cursor:pointer}.rm-obj-why{margin:var(--rm-1) 0 0;color:var(--rm-muted);font-size:var(--rm-fs-meta)}.rm-meter{display:flex;align-items:center;gap:var(--rm-2);color:var(--rm-muted);font-size:var(--rm-fs-label);font-variant-numeric:tabular-nums}.rm-meter-track{flex:1;height:4px;border-radius:2px;background:var(--rm-line);overflow:hidden}.rm-meter-fill{display:block;height:100%;background:var(--rm-accent)}.rm-bets{display:flex;flex-direction:column;margin:0;padding:0;list-style:none;border-top:1px solid var(--rm-line)}.rm-bet{display:grid;grid-template-columns:12px 1fr auto;align-items:center;gap:var(--rm-2);padding:6px var(--rm-1);border-bottom:1px solid var(--rm-line-soft);border-radius:4px;cursor:pointer}.rm-bet:last-child{border-bottom:0}.rm-bet:hover{background:var(--rm-hover)}.rm-bet-line{display:flex;align-items:center;gap:6px;min-width:0}.rm-bet-line .rm-dot{width:6px;height:6px}.rm-bet-title{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.rm-bet-period{color:var(--rm-muted);font-size:var(--rm-fs-label);font-variant-numeric:tabular-nums}.rm-bet--empty{display:block;color:var(--rm-muted);font-size:var(--rm-fs-meta);cursor:default}.rm-panel{display:flex;flex-direction:column;width:300px;flex:none;border-left:1px solid var(--rm-line);background:var(--rm-panel);overflow:hidden}.rm-panel-head{display:flex;align-items:center;gap:var(--rm-2);padding:var(--rm-2) var(--rm-2) var(--rm-2) var(--rm-3);border-bottom:1px solid var(--rm-line);flex:none}.rm-panel-head h3{flex:1;margin:0;color:var(--rm-muted);font-size:var(--rm-fs-label);font-weight:700;letter-spacing:.12em;text-transform:uppercase}.rm-panel-body{flex:1;min-height:0;overflow:auto;padding:var(--rm-3)}.rm-panel-foot{padding:var(--rm-2) var(--rm-3);border-top:1px solid var(--rm-line);flex:none}.rm-suggest{padding:var(--rm-2) var(--rm-3);border-bottom:1px solid var(--rm-line);background:var(--rm-accent-soft);font-size:var(--rm-fs-meta)}.rm-suggest p{margin:0 0 var(--rm-2)}.rm-suggest-actions{display:flex;gap:var(--rm-1)}.rm-form{display:flex;flex-direction:column;gap:var(--rm-3)}.rm-field{display:flex;flex-direction:column;gap:var(--rm-1);min-width:0}.rm-field>span{display:flex;align-items:center;gap:6px;color:var(--rm-muted);font-size:var(--rm-fs-label);font-weight:700;letter-spacing:.1em;text-transform:uppercase}.rm-field-value{font-style:normal;letter-spacing:0;font-variant-numeric:tabular-nums}.rm-field-row{display:flex;gap:var(--rm-2)}.rm-field-row>.rm-field{flex:1}.rm-field--narrow{max-width:84px}.rm-input{width:100%;min-width:0;padding:6px var(--rm-2);border:1px solid var(--rm-line);border-radius:var(--rm-r-sm);background:var(--rm-bg);font-size:var(--rm-fs-body)}.rm-input:disabled{opacity:.6}.rm-input--area{resize:vertical}.rm-input--color{padding:2px;height:28px}.rm-range{width:100%;accent-color:var(--rm-accent)}.rm-note{margin:0;color:var(--rm-muted);font-size:var(--rm-fs-label)}.rm-chain{display:flex;flex-direction:column;gap:var(--rm-1)}.rm-chain h4{margin:var(--rm-2) 0 0;color:var(--rm-muted);font-size:var(--rm-fs-label);font-weight:700;letter-spacing:.12em;text-transform:uppercase}.rm-chain-row{padding:5px var(--rm-2);border:1px solid var(--rm-line-soft);border-radius:var(--rm-r-sm);background:var(--rm-bg);font-size:var(--rm-fs-meta);text-align:left}.rm-chain-row:hover{border-color:var(--rm-accent);color:var(--rm-accent)}.rm-chain-empty{margin:0;color:var(--rm-muted);font-size:var(--rm-fs-meta)}.rm-dep{display:flex;flex-direction:column;gap:var(--rm-1)}.rm-dep-arrow{color:var(--rm-muted);font-size:var(--rm-fs-label);font-weight:700;letter-spacing:.12em;text-transform:uppercase;text-align:center}.rm-btn{display:inline-flex;align-items:center;justify-content:center;gap:6px;height:28px;padding:0 var(--rm-3);border:1px solid var(--rm-line);border-radius:var(--rm-r);background:var(--rm-bg);font-size:var(--rm-fs-body)}.rm-btn svg{width:15px;height:15px}.rm-btn:hover:not(:disabled){background:var(--rm-hover)}.rm-btn:disabled{opacity:.5;cursor:default}.rm-btn--mini{height:22px;padding:0 var(--rm-2);font-size:var(--rm-fs-meta)}.rm-btn--primary{border-color:var(--rm-accent);background:var(--rm-accent-soft);color:var(--rm-text);font-weight:600}.rm-btn--danger{width:100%;border-color:color-mix(in srgb,var(--rm-danger) 40%,var(--rm-line));color:var(--rm-danger)}.rm-legend{display:flex;flex-direction:column;gap:var(--rm-4)}.rm-legend h4{margin:0 0 var(--rm-2);color:var(--rm-muted);font-size:var(--rm-fs-label);font-weight:700;letter-spacing:.12em;text-transform:uppercase}.rm-legend-row{display:flex;align-items:center;gap:var(--rm-2);padding:2px 0;font-size:var(--rm-fs-meta)}.rm-swatch{width:18px;height:10px;border:1px solid var(--rm-line);border-radius:2px;flex:none}.rm-legend-hint{margin:0;color:var(--rm-muted);font-size:var(--rm-fs-meta)}.rm-empty{display:flex;flex-direction:column;align-items:center;gap:var(--rm-2);max-width:44ch;margin:12% auto 0;text-align:center}.rm-empty-icon{width:32px;height:32px;color:var(--rm-muted)}.rm-empty h2{margin:0;font-size:var(--rm-fs-title);font-weight:600}.rm-empty p{margin:0;color:var(--rm-muted)}.rm-empty-actions{display:flex;gap:var(--rm-2);margin-top:var(--rm-2)}.rm-empty-starter{font-size:var(--rm-fs-label);letter-spacing:.06em;text-transform:uppercase}.rm-ctx-overlay{position:fixed;inset:0;z-index:100}.rm-ctx{position:absolute;min-width:180px;padding:var(--rm-1);border:1px solid var(--rm-line);border-radius:var(--rm-r);background:var(--rm-bg);box-shadow:var(--rm-shadow)}.rm-ctx-item{display:block;width:100%;padding:5px var(--rm-2);border-radius:var(--rm-r-sm);font-size:var(--rm-fs-meta);text-align:left}.rm-ctx-item:hover{background:var(--rm-hover)}.rm-ctx-item:disabled{color:var(--rm-muted);cursor:default;background:none}.rm-ctx-danger{color:var(--rm-danger)}@container roadmap (max-width: 1040px){.rm-lens-btn span,.rm-window{display:none}}@container roadmap (max-width: 820px){.rm-panel{position:absolute;right:0;top:0;bottom:0;z-index:30;max-width:100%;box-shadow:0 6px 18px #00000029}.rm-tools .rm-chip-btn{display:none}}@container roadmap (max-width: 620px){.rm-tl{--rm-label: 110px}.rm-stratum{grid-template-columns:110px 1fr}}button:focus-visible,input:focus-visible,select:focus-visible,textarea:focus-visible,[tabindex]:focus-visible{outline:var(--p-focus-ring-width) var(--p-focus-ring-style) var(--p-focus-ring-color);outline-offset:var(--p-focus-ring-offset);box-shadow:var(--p-focus-ring-shadow)}input[type=checkbox],input[type=range]{accent-color:var(--p-primary-color)}.rm-card,.rm-obj,.rm-stratum{border-radius:14px}', Ys = {
  type: "object",
  properties: {
    "entry-id": {
      type: "string",
      default: "",
      description: "Workspace roadmap component id to load; an empty value renders the required-id error state without issuing API requests."
    },
    "read-only": {
      type: "boolean",
      default: !1,
      description: "Disables editing while retaining full reading and inspection controls."
    },
    mode: {
      type: "string",
      default: "preview",
      description: "Rendering mode: preview for the compact read-only timeline, or full for the lens switcher, editing controls, inspector, and undo/redo."
    }
  }
};
class js extends zr {
  static get wippyConfig() {
    return {
      propsSchema: Ys,
      hostCssKeys: ["themeConfigUrl", "iframeCssUrl"],
      inlineCss: Bs
    };
  }
  static get vueConfig() {
    return { rootComponent: Ks };
  }
}
rr(import.meta.url, js);
//# sourceMappingURL=index.js.map
