import { hasInjectionContext as q, inject as A, effectScope as Q, ref as v, markRaw as X, createApp as Z, defineComponent as C, onMounted as rr, watch as L, onBeforeUnmount as er, openBlock as b, createElementBlock as y, createElementVNode as z, createTextVNode as or, toDisplayString as V, createCommentVNode as I, normalizeClass as j, createBlock as tr, unref as P, renderSlot as O, createVNode as N } from "vue";
import { addCollection as ir, Icon as R } from "@iconify/vue";
import { config as B, addIcons as ar, on as nr, applyThemeMode as E, host as sr, hostCss as pr, loadCss as lr, api as f, loadByTagName as cr } from "@wippy-fe/proxy";
var $ = "data-wippy-visible";
function M(r) {
  const e = r.getAttribute($);
  return e === "true" ? !0 : e === "false" ? !1 : null;
}
var dr = Object.defineProperty, mr = (r, e, o) => e in r ? dr(r, e, { enumerable: !0, configurable: !0, writable: !0, value: o }) : r[e] = o, g = (r, e, o) => mr(r, typeof e != "symbol" ? e + "" : e, o), gr = [
  "themeConfigUrl",
  "primeVueCssUrl",
  "markdownCssUrl",
  "iframeCssUrl"
], ur = [
  ":where([data-wippy-theme-root]).w-theme-light",
  ":where([data-wippy-theme-root]).w-theme-dark"
].join(`,
`);
function F(r) {
  const e = r.startsWith("--") ? r : `--${r}`;
  return /^--[-\w\u0080-\uFFFF]+$/.test(e) ? e : null;
}
function hr(...r) {
  const e = /* @__PURE__ */ new Set();
  for (const o of r)
    if (o)
      for (const [t, i] of Object.entries(o)) {
        if ((t === "@light" || t === "@dark") && i && typeof i == "object") {
          for (const [p, n] of Object.entries(i)) {
            const l = typeof n == "string" ? F(p) : null;
            l && e.add(l);
          }
          continue;
        }
        const a = typeof i == "string" ? F(t) : null;
        a && e.add(a);
      }
  return [...e].sort();
}
function xr(r) {
  if (r.length === 0)
    return "";
  const e = r.map((o) => `  ${o}: inherit;`).join(`
`);
  return `${ur} {
${e}
}`;
}
function fr(r, e) {
  const o = xr(e);
  o && U(r, o, "@wippy-fe/css-variables-bridge");
}
function vr(r, e) {
  const t = (e ?? gr).map(async (i) => {
    const a = pr[i];
    if (!a)
      return console.warn(`[wippy-fe/webcomponent-core] hostCss key "${i}" is undefined — skipping. Remove it from hostCssKeys if the CSS was removed.`), null;
    try {
      return await lr(a);
    } catch (p) {
      return console.warn(`[wippy-fe/webcomponent-core] Failed to load hostCss "${i}" (${a}):`, p), null;
    }
  });
  return Promise.all(t).then((i) => {
    for (const a of i) {
      if (!a)
        continue;
      const p = document.createElement("style");
      p.textContent = a, p.setAttribute("role", "@wippy-fe/host-css"), r.appendChild(p);
    }
  });
}
function br(r, e) {
  const o = document.createElement("style");
  o.textContent = e, r.appendChild(o);
}
function U(r, e, o) {
  if (typeof CSSStyleSheet < "u" && "replaceSync" in CSSStyleSheet.prototype) {
    const i = new CSSStyleSheet();
    i.replaceSync(e), r.adoptedStyleSheets = [...r.adoptedStyleSheets, i];
    return;
  }
  const t = document.createElement("style");
  t.setAttribute("role", o), t.textContent = e, r.appendChild(t);
}
function kr(r, e) {
  U(r, e, "@wippy-fe/custom-css");
}
function H(r) {
  return r.__wippyHost ?? null;
}
function wr(r) {
  return r.replace(/-([a-z])/g, (e, o) => o.toUpperCase());
}
function yr(r, e, o) {
  switch (o.type) {
    case "string":
      return { value: e };
    case "number": {
      const t = Number.parseFloat(e);
      return Number.isNaN(t) ? { value: void 0, error: `Invalid ${r}: expected a number` } : { value: t };
    }
    case "integer": {
      const t = Number.parseInt(e, 10);
      return Number.isNaN(t) ? { value: void 0, error: `Invalid ${r}: expected an integer` } : { value: t };
    }
    case "boolean":
      return { value: e !== "false" };
    case "array":
    case "object":
      try {
        const t = JSON.parse(e);
        return o.type === "array" && !Array.isArray(t) ? { value: void 0, error: `Invalid ${r}: expected a JSON array` } : { value: t };
      } catch {
        return { value: void 0, error: `Invalid ${r}: must be valid JSON` };
      }
    default:
      return { value: e };
  }
}
function S(r, e) {
  const o = {}, t = [];
  for (const [i, a] of Object.entries(e.properties)) {
    const p = r.getAttribute(i), n = wr(i);
    if (p === null) {
      a.default !== void 0 && (o[n] = a.default);
      continue;
    }
    const l = yr(i, p, a);
    l.error ? t.push(l.error) : o[n] = l.value;
  }
  return { props: o, errors: t };
}
var _r = class {
  constructor(r, e) {
    g(this, "_props"), g(this, "_errors"), g(this, "_content"), g(this, "_hostVisibility"), g(this, "_propsListeners", /* @__PURE__ */ new Set()), g(this, "_contentListeners", /* @__PURE__ */ new Set()), g(this, "_hostVisibilityListeners", /* @__PURE__ */ new Set()), g(this, "_disposed", !1), g(this, "_emitToDom"), g(this, "props"), g(this, "events"), g(this, "content"), g(this, "hostVisibility"), this._props = r.props, this._errors = r.errors, this._content = r.content, this._hostVisibility = r.hostVisibility, this._emitToDom = e;
    const o = this;
    this.props = {
      get value() {
        return o._props;
      },
      get errors() {
        return o._errors;
      },
      subscribe(t, i) {
        return o._subscribeProps(t, i);
      }
    }, this.events = {
      emit(t, i) {
        o._disposed || o._emitToDom(t, i);
      }
    }, this.content = r.hasContent ? {
      get value() {
        return o._content;
      },
      subscribe(t, i) {
        return o._subscribeContent(t, i);
      }
    } : null, this.hostVisibility = {
      get value() {
        return o._hostVisibility;
      },
      subscribe(t, i) {
        return o._subscribeHostVisibility(t, i);
      }
    };
  }
  /** @internal */
  notifyProps(r, e) {
    if (!this._disposed) {
      this._props = r, this._errors = e;
      for (const o of this._propsListeners)
        o(r, e);
    }
  }
  /** @internal */
  notifyContent(r) {
    if (!this._disposed) {
      this._content = r;
      for (const e of this._contentListeners)
        e(r);
    }
  }
  /** @internal */
  notifyHostVisibility(r, e) {
    if (!(this._disposed || r === e)) {
      this._hostVisibility = r;
      for (const o of this._hostVisibilityListeners)
        o(r, e);
    }
  }
  /** @internal */
  dispose() {
    this._disposed || (this._disposed = !0, this._propsListeners.clear(), this._contentListeners.clear(), this._hostVisibilityListeners.clear());
  }
  _subscribeProps(r, e) {
    if (this._disposed || e?.signal?.aborted)
      return () => {
      };
    this._propsListeners.add(r), e?.immediate && r(this._props, this._errors);
    const o = () => {
      this._propsListeners.delete(r), e?.signal?.removeEventListener("abort", o);
    };
    return e?.signal?.addEventListener("abort", o, { once: !0 }), o;
  }
  _subscribeContent(r, e) {
    if (this._disposed || e?.signal?.aborted)
      return () => {
      };
    this._contentListeners.add(r), e?.immediate && r(this._content);
    const o = () => {
      this._contentListeners.delete(r), e?.signal?.removeEventListener("abort", o);
    };
    return e?.signal?.addEventListener("abort", o, { once: !0 }), o;
  }
  _subscribeHostVisibility(r, e) {
    if (this._disposed || e?.signal?.aborted)
      return () => {
      };
    this._hostVisibilityListeners.add(r), e?.immediate && r(this._hostVisibility, this._hostVisibility);
    const o = () => {
      this._hostVisibilityListeners.delete(r), e?.signal?.removeEventListener("abort", o);
    };
    return e?.signal?.addEventListener("abort", o, { once: !0 }), o;
  }
}, zr = class extends HTMLElement {
  constructor() {
    super(), g(this, "_internals"), g(this, "_contentObserver", null), g(this, "_initialized", !1), g(this, "_container", null), g(this, "_reactive", null), g(this, "_lastProps", null), g(this, "_lastErrors", []), g(this, "_lastContent", null), g(this, "_themeUnsub", null), g(this, "_hostVisible", null), this._internals = this.attachInternals(), this._hostVisible = M(this);
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
    const r = this.wippyConfig, e = Object.keys(r.propsSchema.properties), o = r.extraObservedAttributes ?? [];
    return [.../* @__PURE__ */ new Set([...e, ...o, $])];
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
    return H(this);
  }
  /**
   * Emit a CustomEvent that bubbles and crosses shadow DOM boundaries.
   */
  emitEvent(r, e) {
    this.dispatchEvent(new CustomEvent(r, {
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
      const r = this.constructor.wippyConfig, e = !!r.contentTemplate;
      let o, t;
      if (this._lastProps !== null)
        o = this._lastProps, t = this._lastErrors;
      else {
        const a = S(this, r.propsSchema);
        r.validateProps && a.errors.push(...r.validateProps(a.props)), o = a.props, t = a.errors, this._lastProps = o, this._lastErrors = t;
      }
      const i = e ? this._lastContent ?? this._extractContent(r.contentTemplate) : null;
      e && this._lastContent === null && (this._lastContent = i), this._reactive = new _r(
        { props: o, errors: t, content: i, hasContent: e, hostVisibility: this._hostVisible },
        this.emitEvent.bind(this)
      );
    }
    return this._reactive;
  }
  // ── Lifecycle ──────────────────────────────────────────────
  connectedCallback() {
    this._internals.states.add("loading");
    try {
      const r = this.constructor.wippyConfig, e = this._initialized, o = this.shadowRoot ?? this.attachShadow({ mode: r.shadowMode ?? "open" });
      let t;
      if (e)
        t = this._container;
      else {
        this.onInit(o), r.inlineCss && br(o, r.inlineCss);
        try {
          const c = B?.theming, u = hr(
            c?.global?.cssVariables,
            c?.children?.cssVariables
          );
          fr(o, u);
        } catch {
        }
        if (r.customCss !== !1)
          try {
            const c = B?.theming, u = [c?.global?.customCSS, c?.children?.customCSS].filter(Boolean).join(`
`);
            u && kr(o, u);
          } catch {
          }
        (r.hostCssKeys === void 0 || r.hostCssKeys.length > 0) && vr(o, r.hostCssKeys), t = document.createElement("div"), t.setAttribute("data-wippy-theme-root", "");
        const l = r.containerClasses ?? [];
        l.length > 0 && t.classList.add(...l), o.appendChild(t), this._container = t, ar(ir);
      }
      this._applyTheme(), this._themeUnsub || (this._themeUnsub = nr("@theme", (l) => this._applyTheme(l)));
      const { props: i, errors: a } = S(this, r.propsSchema);
      r.validateProps && a.push(...r.validateProps(i));
      const p = i;
      this._lastProps = p, this._lastErrors = a;
      let n = null;
      r.contentTemplate && (n = this._extractContent(r.contentTemplate), this._lastContent = n, this._contentObserver = new MutationObserver(() => {
        const l = this._extractContent(r.contentTemplate);
        this._lastContent = l, this._reactive?.notifyContent(l), this.onContentChanged(l);
      }), this._contentObserver.observe(this, {
        childList: !0,
        characterData: !0,
        subtree: !0
      })), this.onMount(o, t, p, a, n, e), this._internals.states.delete("loading"), this._internals.states.add("ready"), e || (this._initialized = !0), this.onReady(), this.emitEvent("load");
    } catch (r) {
      this.onError(r), this._internals.states.delete("loading"), this._internals.states.add("error"), this.emitEvent("error", {
        message: r instanceof Error ? r.message : String(r),
        error: r
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
  _applyTheme(r = sr.getThemeMode?.()) {
    E(r, this), this._container && E(r, this._container);
  }
  disconnectedCallback() {
    this._themeUnsub && (this._themeUnsub(), this._themeUnsub = null), E("auto", this), this._container && E("auto", this._container), this._contentObserver && (this._contentObserver.disconnect(), this._contentObserver = null), this.onUnmount(), this.emitEvent("unload"), this._internals.states.clear(), this._reactive?.dispose(), this._reactive = null, this._lastProps = null, this._lastErrors = [], this._lastContent = null, delete this.__wippyHost, delete this.__wippyHostBus;
  }
  attributeChangedCallback(r, e, o) {
    if (e === o)
      return;
    if (r === $) {
      const n = this._hostVisible, l = M(this);
      if (l === n)
        return;
      this._hostVisible = l, this.isConnected && this._initialized && (this._reactive?.notifyHostVisibility(l, n), this.onHostVisibilityChanged(l, n));
      return;
    }
    const t = this.constructor.wippyConfig, { props: i, errors: a } = S(this, t.propsSchema);
    t.validateProps && a.push(...t.validateProps(i));
    const p = i;
    this._lastProps = p, this._lastErrors = a, this._reactive?.notifyProps(p, a), this.onPropsChanged(p, a);
  }
  // ── Hooks ──────────────────────────────────────────────────
  /** Called right after shadow DOM is attached, before CSS or container. */
  onInit(r) {
  }
  /** Called after internals state is set to ready, before the `load` event. */
  onReady() {
  }
  /** Called when connectedCallback throws. Default logs to console. */
  onError(r) {
    console.error(`${this.constructor.name} initialization failed:`, r);
  }
  /** Called when observed attributes change. Override to update framework state. */
  onPropsChanged(r, e) {
  }
  /**
   * Called when the host changes logical activity. `null` means unmanaged.
   * This does not imply a DOM remount or a CSS/viewport visibility change.
   */
  onHostVisibilityChanged(r, e) {
  }
  /**
   * Extract text from a child `<template data-type="...">` element.
   * Uses `.content.textContent` since `<template>` stores content in a DocumentFragment.
   */
  _extractContent(r) {
    return this.querySelector(`template[data-type="${r}"]`)?.content.textContent?.trim() ?? null;
  }
  /** Called when child `<template>` content changes. Override to update framework state. */
  onContentChanged(r) {
  }
};
function Cr(r) {
  return r.__wippyHostBus ?? null;
}
function Er(r) {
  return r.dataset.wippyPanelId ?? null;
}
/*!
 * pinia v4.0.3
 * (c) 2026 Eduardo San Martin Morote
 * @license MIT
 */
let W;
const K = (r) => W = r, Sr = () => q() && A(Y) || W, Y = (
  /* istanbul ignore next */
  Symbol()
);
function Vr() {
  const r = Q(!0), e = r.run(() => v({}));
  let o = [], t = [];
  const i = X({
    install(a) {
      K(i), i._a = a, a.provide(Y, i), a.config.globalProperties.$pinia = i, t.forEach((p) => o.push(p)), t = [];
    },
    use(a) {
      return this._a ? o.push(a) : t.push(a), this;
    },
    _p: o,
    _a: null,
    _e: r,
    _s: /* @__PURE__ */ new Map(),
    state: e
  });
  return i;
}
var Pr = Object.defineProperty, Rr = (r, e, o) => e in r ? Pr(r, e, { enumerable: !0, configurable: !0, writable: !0, value: o }) : r[e] = o, _ = (r, e, o) => Rr(r, typeof e != "symbol" ? e + "" : e, o), J = /* @__PURE__ */ Symbol("wippy:emit"), G = /* @__PURE__ */ Symbol("wippy:props"), $r = /* @__PURE__ */ Symbol("wippy:props_error"), Ar = /* @__PURE__ */ Symbol("wippy:content"), Ir = /* @__PURE__ */ Symbol("wippy:panel-id"), jr = /* @__PURE__ */ Symbol("wippy:layout-bus"), Or = /* @__PURE__ */ Symbol("wippy:host"), Tr = /* @__PURE__ */ Symbol("wippy:host-visibility");
function qr() {
  const r = A(G);
  if (!r)
    throw new Error("useProps() must be called inside a WippyVueElement");
  return r;
}
function Qr() {
  const r = A(J);
  if (!r)
    throw new Error("useEvents() must be called inside a WippyVueElement");
  return r;
}
var Xr = class extends zr {
  constructor() {
    super(...arguments), _(this, "_vueApp", null), _(this, "_propsRef", v({})), _(this, "_errorsRef", v([])), _(this, "_contentRef", v(null)), _(this, "_hostVisibilityRef", v(null)), _(this, "_bridgeAbort", null);
  }
  /**
   * Override to provide Vue-specific configuration.
   */
  static get vueConfig() {
    throw new Error("WippyVueElement subclass must override static get vueConfig()");
  }
  onMount(r, e, o, t, i, a) {
    const p = this.constructor.vueConfig;
    this._propsRef.value = o, this._errorsRef.value = t, this._contentRef.value = i ?? null, this._hostVisibilityRef.value = this.hostVisible;
    for (const c of t)
      this.emitEvent("invalid", { message: c });
    const n = new AbortController();
    this._bridgeAbort = n, this.reactive.props.subscribe((c, u) => {
      this._propsRef.value = c, this._errorsRef.value = [...u];
      for (const s of u)
        this.emitEvent("invalid", { message: s });
    }, { signal: n.signal }), this.reactive.content && this.reactive.content.subscribe((c) => {
      this._contentRef.value = c;
    }, { signal: n.signal }), this.reactive.hostVisibility.subscribe((c) => {
      this._hostVisibilityRef.value = c;
    }, { signal: n.signal });
    const l = (c) => {
      if (n.signal.aborted)
        return;
      const u = Sr(), s = Z(c.rootComponent);
      this._vueApp = s;
      const x = Vr();
      if (c.piniaPlugins)
        for (const d of c.piniaPlugins)
          x.use(d);
      if (s.use(x), c.plugins)
        for (const d of c.plugins)
          s.use(d);
      s.provide(G, this._propsRef), s.provide($r, this._errorsRef), s.provide(J, this.emitEvent.bind(this)), s.provide(Ar, this._contentRef), s.provide(Tr, this._hostVisibilityRef), s.provide(Ir, Er(this)), s.provide(jr, Cr(this)), s.provide(Or, H(this)), c.providers && c.providers(s, this), s.mount(e), u && K(u);
    };
    if (p.rootComponent)
      l(p);
    else if (p.lazyConfig) {
      const c = document.createElement("wippy-loading");
      c.setAttribute("no-bg", ""), e.appendChild(c), p.lazyConfig().then((u) => {
        n.signal.aborted || (c.remove(), l(u));
      }).catch((u) => {
        if (n.signal.aborted)
          return;
        const s = u instanceof Error ? u.message : String(u), x = document.createElement("wippy-error");
        x.setAttribute("title", "Failed to load"), x.setAttribute("message", s), c.replaceWith(x), this.emitEvent("error", { message: s });
      });
    } else
      throw new Error("WippyVueElement vueConfig must provide rootComponent or lazyConfig");
  }
  onUnmount() {
    this._bridgeAbort?.abort(), this._bridgeAbort = null, this._vueApp && (this._vueApp.unmount(), this._vueApp = null);
  }
};
const w = "/api/v1/workspace/entries";
function D(r, e) {
  const o = r?.response?.data ?? r?.data;
  return typeof o?.error == "string" && o.error ? o.error : r instanceof Error ? r.message : e;
}
function Zr() {
  const r = v([]), e = v("");
  async function o() {
    try {
      const { data: d } = await f.get(`${w}/types`);
      d.success && (r.value = d.types ?? []);
    } catch (d) {
      e.value = D(d, "failed to load types");
    }
  }
  async function t(d) {
    const m = d ? `${w}?parent_id=${encodeURIComponent(d)}` : w;
    try {
      const { data: h } = await f.get(m);
      if (!h.success) throw new Error(h.error || "Could not load this folder.");
      return h.entries ?? [];
    } catch (h) {
      throw new Error(D(h, "Could not load this folder."));
    }
  }
  async function i(d) {
    const { data: m } = await f.get(`${w}/${d}`);
    return m.success ? m.entry : null;
  }
  async function a(d) {
    const { data: m } = await f.get(`${w}/${d}/breadcrumbs`);
    return m.success ? m.breadcrumbs ?? [] : [];
  }
  async function p(d) {
    const { data: m } = await f.post(w, d);
    if (!m.success) throw new Error(m.error || "failed to create");
    return m.entry;
  }
  async function n(d, m) {
    const h = new FormData();
    h.append("file", d), h.append("metadata", JSON.stringify({ target_parent_id: m ?? "", filename: d.name }));
    const { data: k } = await f.post("/api/v1/uploads", h, { headers: { "Content-Type": "multipart/form-data" } }), T = k.uuid || k.upload_id || k.id || k.upload?.id;
    if (!T) throw new Error(k.error || "upload failed");
    return String(T);
  }
  async function l(d, m) {
    const { data: h } = await f.put(`${w}/${d}`, m);
    if (!h.success) throw new Error(h.error || "failed to update");
    return h.entry;
  }
  async function c(d) {
    const { data: m } = await f.post(
      "/api/v1/transfer/export",
      { component_ids: [d] },
      { responseType: "blob" }
    );
    return m;
  }
  async function u(d, m) {
    const { data: h } = await f.post(`${w}/${d}/move`, { parent_id: m ?? "" });
    if (!h.success) throw new Error(h.error || "failed to move");
  }
  async function s(d) {
    const { data: m } = await f.delete(`${w}/${d}`);
    if (!m.success) throw new Error(m.error || "failed to delete");
    return { inProgress: m.in_progress === !0 };
  }
  async function x(d) {
    const m = await t(d);
    let h = m.length;
    for (const k of m)
      (k.type === "folder" || k.container) && (h += await x(k.id));
    return h;
  }
  return { types: r, error: e, loadTypes: o, list: t, get: i, breadcrumbs: a, create: p, uploadFile: n, update: l, move: u, remove: s, countDescendants: x, exportEntry: c };
}
const Lr = { class: "wc-iconfield" }, Nr = {
  key: 0,
  role: "status"
}, Br = {
  key: 1,
  role: "alert"
}, re = /* @__PURE__ */ C({
  __name: "IconField",
  props: {
    modelValue: {},
    fallback: {}
  },
  emits: ["update:modelValue"],
  setup(r, { emit: e }) {
    const o = r, t = e, i = v(null), a = v(!1), p = v("");
    let n = null, l = 0;
    function c(s) {
      t("update:modelValue", String(s.detail || ""));
    }
    async function u() {
      const s = ++l, x = i.value;
      if (x) {
        if (a.value = !0, p.value = "", !customElements.get("wc-icon-picker"))
          try {
            await cr("wc-icon-picker", { timeoutMs: 8e3 });
          } catch {
            s === l && (p.value = "Icon picker is unavailable."), s === l && (a.value = !1);
            return;
          }
        s !== l || i.value !== x || (n = document.createElement("wc-icon-picker"), n.setAttribute("value", o.modelValue || ""), o.fallback && n.setAttribute("fallback", o.fallback), n.addEventListener("select", c), x.replaceChildren(n), a.value = !1);
      }
    }
    return rr(() => {
      u();
    }), L(() => o.modelValue, (s) => {
      n && n.getAttribute("value") !== s && n.setAttribute("value", s || "");
    }), L(() => o.fallback, (s) => {
      n && (s ? n.setAttribute("fallback", s) : n.removeAttribute("fallback"));
    }), er(() => {
      l += 1, n && n.removeEventListener("select", c), n = null;
    }), (s, x) => (b(), y("div", Lr, [
      z("div", {
        ref_key: "host",
        ref: i
      }, null, 512),
      a.value ? (b(), y("span", Nr, "Loading icon picker…")) : p.value ? (b(), y("span", Br, [
        or(V(p.value) + " ", 1),
        z("button", {
          type: "button",
          onClick: u
        }, "Retry")
      ])) : I("", !0)
    ]));
  }
}), Mr = ["type", "disabled"], Fr = {
  key: 0,
  class: "km-spin",
  "aria-hidden": "true"
}, ee = /* @__PURE__ */ C({
  __name: "Button",
  props: {
    icon: {},
    variant: { default: "primary" },
    type: { default: "button" },
    loading: { type: Boolean },
    disabled: { type: Boolean },
    small: { type: Boolean }
  },
  emits: ["click"],
  setup(r, { emit: e }) {
    const o = e;
    return (t, i) => (b(), y("button", {
      type: r.type,
      class: j(["km-btn", [`km-btn-${r.variant}`, r.small && "sm"]]),
      disabled: r.disabled || r.loading,
      onClick: i[0] || (i[0] = (a) => o("click"))
    }, [
      r.loading ? (b(), y("span", Fr)) : r.icon ? (b(), tr(P(R), {
        key: 1,
        icon: r.icon,
        "aria-hidden": "true"
      }, null, 8, ["icon"])) : I("", !0),
      O(t.$slots, "default")
    ], 10, Mr));
  }
}), Dr = { class: "km-field" }, Ur = { class: "km-field-label" }, Hr = {
  key: 0,
  class: "km-field-help"
}, oe = /* @__PURE__ */ C({
  __name: "FormField",
  props: {
    label: {},
    help: {}
  },
  setup(r) {
    return (e, o) => (b(), y("label", Dr, [
      z("span", Ur, V(r.label), 1),
      O(e.$slots, "default"),
      r.help ? (b(), y("small", Hr, V(r.help), 1)) : I("", !0)
    ]));
  }
}), Wr = ["type", "value", "placeholder", "readonly", "disabled", "autocomplete", "min", "max", "step"], te = /* @__PURE__ */ C({
  __name: "TextInput",
  props: {
    modelValue: {},
    type: { default: "text" },
    placeholder: {},
    readonly: { type: Boolean },
    disabled: { type: Boolean },
    autocomplete: {},
    min: {},
    max: {},
    step: {},
    mono: { type: Boolean }
  },
  emits: ["update:modelValue"],
  setup(r, { emit: e }) {
    const o = e;
    function t(i) {
      const a = i.target;
      o("update:modelValue", a.value);
    }
    return (i, a) => (b(), y("input", {
      class: j(["km-input", r.mono && "mono"]),
      type: r.type,
      value: r.modelValue,
      placeholder: r.placeholder,
      readonly: r.readonly,
      disabled: r.disabled,
      autocomplete: r.autocomplete,
      min: r.min,
      max: r.max,
      step: r.step,
      onInput: t
    }, null, 42, Wr));
  }
}), Kr = { class: "km-notice-text" }, ie = /* @__PURE__ */ C({
  __name: "Notice",
  props: {
    tone: { default: "info" }
  },
  emits: ["dismiss"],
  setup(r, { emit: e }) {
    const o = e;
    return (t, i) => (b(), y("div", {
      class: j(["km-notice", `t-${r.tone}`]),
      role: "status"
    }, [
      N(P(R), {
        icon: r.tone === "error" ? "tabler:alert-triangle" : "tabler:info-circle",
        "aria-hidden": "true"
      }, null, 8, ["icon"]),
      z("span", Kr, [
        O(t.$slots, "default")
      ]),
      z("button", {
        class: "km-notice-x",
        "aria-label": "Dismiss",
        onClick: i[0] || (i[0] = (a) => o("dismiss"))
      }, [
        N(P(R), {
          icon: "tabler:x",
          "aria-hidden": "true"
        })
      ])
    ], 2));
  }
}), ae = ':root{--p-form-field-padding-x: .75rem;--p-form-field-padding-y: .5rem;--p-form-field-sm-padding-x: .625rem;--p-form-field-sm-padding-y: .375rem;--p-form-field-lg-padding-x: .875rem;--p-form-field-lg-padding-y: .625rem;--p-form-field-border-radius: .375rem;--p-form-field-transition-duration: .2s;--p-form-field-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), 0 1px 2px 0 rgba(18, 18, 23, .05);--p-focus-ring-width: 1px;--p-focus-ring-style: solid;--p-focus-ring-color: color-mix(in srgb, var(--p-primary-color) 100%, transparent);--p-focus-ring-offset: 2px;--p-toggleswitch-width: 2.5rem;--p-toggleswitch-height: 1.5rem;--p-toggleswitch-border-radius: 30px;--p-toggleswitch-gap: .25rem;--p-toggleswitch-border-width: 1px;--p-toggleswitch-transition-duration: .2s;--p-toggleswitch-slide-duration: .2s;--p-toggleswitch-handle-size: 1rem;--p-toggleswitch-handle-border-radius: 9999px}:root{color-scheme:light dark;--p-primary: rgb(0, 95, 178);--p-primary-50: color-mix(in srgb, var(--p-primary) 5%, white);--p-primary-100: color-mix(in srgb, var(--p-primary) 10%, white);--p-primary-200: color-mix(in srgb, var(--p-primary) 20%, white);--p-primary-300: color-mix(in srgb, var(--p-primary) 30%, white);--p-primary-400: color-mix(in srgb, var(--p-primary) 40%, white);--p-primary-500: var(--p-primary);--p-primary-600: color-mix(in srgb, var(--p-primary) 80%, black);--p-primary-700: color-mix(in srgb, var(--p-primary) 70%, black);--p-primary-800: color-mix(in srgb, var(--p-primary) 60%, black);--p-primary-900: color-mix(in srgb, var(--p-primary) 50%, black);--p-primary-950: color-mix(in srgb, var(--p-primary) 40%, black);--p-secondary: #6f7385;--p-secondary-50: color-mix(in srgb, var(--p-secondary) 5%, white);--p-secondary-100: color-mix(in srgb, var(--p-secondary) 10%, white);--p-secondary-200: color-mix(in srgb, var(--p-secondary) 20%, white);--p-secondary-300: color-mix(in srgb, var(--p-secondary) 35%, white);--p-secondary-400: color-mix(in srgb, var(--p-secondary) 65%, white);--p-secondary-500: var(--p-secondary);--p-secondary-600: color-mix(in srgb, var(--p-secondary) 80%, black);--p-secondary-700: color-mix(in srgb, var(--p-secondary) 65%, black);--p-secondary-800: color-mix(in srgb, var(--p-secondary) 55%, black);--p-secondary-900: color-mix(in srgb, var(--p-secondary) 50%, black);--p-secondary-950: color-mix(in srgb, var(--p-secondary) 30%, black);--p-danger: rgb(239, 68, 68);--p-danger-50: color-mix(in srgb, var(--p-danger) 5%, white);--p-danger-100: color-mix(in srgb, var(--p-danger) 10%, white);--p-danger-200: color-mix(in srgb, var(--p-danger) 20%, white);--p-danger-300: color-mix(in srgb, var(--p-danger) 30%, white);--p-danger-400: color-mix(in srgb, var(--p-danger) 40%, white);--p-danger-500: var(--p-danger);--p-danger-600: color-mix(in srgb, var(--p-danger) 80%, black);--p-danger-700: color-mix(in srgb, var(--p-danger) 70%, black);--p-danger-800: color-mix(in srgb, var(--p-danger) 60%, black);--p-danger-900: color-mix(in srgb, var(--p-danger) 50%, black);--p-danger-950: color-mix(in srgb, var(--p-danger) 40%, black);--p-success: rgb(34, 197, 94);--p-success-50: color-mix(in srgb, var(--p-success) 5%, white);--p-success-100: color-mix(in srgb, var(--p-success) 10%, white);--p-success-200: color-mix(in srgb, var(--p-success) 20%, white);--p-success-300: color-mix(in srgb, var(--p-success) 30%, white);--p-success-400: color-mix(in srgb, var(--p-success) 40%, white);--p-success-500: var(--p-success);--p-success-600: color-mix(in srgb, var(--p-success) 80%, black);--p-success-700: color-mix(in srgb, var(--p-success) 70%, black);--p-success-800: color-mix(in srgb, var(--p-success) 60%, black);--p-success-900: color-mix(in srgb, var(--p-success) 50%, black);--p-success-950: color-mix(in srgb, var(--p-success) 40%, black);--p-warn: rgb(249, 115, 22);--p-warn-50: color-mix(in srgb, var(--p-warn) 5%, white);--p-warn-100: color-mix(in srgb, var(--p-warn) 10%, white);--p-warn-200: color-mix(in srgb, var(--p-warn) 20%, white);--p-warn-300: color-mix(in srgb, var(--p-warn) 30%, white);--p-warn-400: color-mix(in srgb, var(--p-warn) 40%, white);--p-warn-500: var(--p-warn);--p-warn-600: color-mix(in srgb, var(--p-warn) 80%, black);--p-warn-700: color-mix(in srgb, var(--p-warn) 70%, black);--p-warn-800: color-mix(in srgb, var(--p-warn) 60%, black);--p-warn-900: color-mix(in srgb, var(--p-warn) 50%, black);--p-warn-950: color-mix(in srgb, var(--p-warn) 40%, black);--p-info: rgb(14, 165, 233);--p-info-50: color-mix(in srgb, var(--p-info) 5%, white);--p-info-100: color-mix(in srgb, var(--p-info) 10%, white);--p-info-200: color-mix(in srgb, var(--p-info) 20%, white);--p-info-300: color-mix(in srgb, var(--p-info) 30%, white);--p-info-400: color-mix(in srgb, var(--p-info) 40%, white);--p-info-500: var(--p-info);--p-info-600: color-mix(in srgb, var(--p-info) 80%, black);--p-info-700: color-mix(in srgb, var(--p-info) 70%, black);--p-info-800: color-mix(in srgb, var(--p-info) 60%, black);--p-info-900: color-mix(in srgb, var(--p-info) 50%, black);--p-info-950: color-mix(in srgb, var(--p-info) 40%, black);--p-help: rgb(168, 85, 247);--p-help-50: color-mix(in srgb, var(--p-help) 5%, white);--p-help-100: color-mix(in srgb, var(--p-help) 10%, white);--p-help-200: color-mix(in srgb, var(--p-help) 20%, white);--p-help-300: color-mix(in srgb, var(--p-help) 30%, white);--p-help-400: color-mix(in srgb, var(--p-help) 40%, white);--p-help-500: var(--p-help);--p-help-600: color-mix(in srgb, var(--p-help) 80%, black);--p-help-700: color-mix(in srgb, var(--p-help) 70%, black);--p-help-800: color-mix(in srgb, var(--p-help) 60%, black);--p-help-900: color-mix(in srgb, var(--p-help) 50%, black);--p-help-950: color-mix(in srgb, var(--p-help) 40%, black);--p-accent: rgb(20, 184, 166);--p-accent-50: color-mix(in srgb, var(--p-accent) 5%, white);--p-accent-100: color-mix(in srgb, var(--p-accent) 10%, white);--p-accent-200: color-mix(in srgb, var(--p-accent) 20%, white);--p-accent-300: color-mix(in srgb, var(--p-accent) 30%, white);--p-accent-400: color-mix(in srgb, var(--p-accent) 40%, white);--p-accent-500: var(--p-accent);--p-accent-600: color-mix(in srgb, var(--p-accent) 80%, black);--p-accent-700: color-mix(in srgb, var(--p-accent) 70%, black);--p-accent-800: color-mix(in srgb, var(--p-accent) 60%, black);--p-accent-900: color-mix(in srgb, var(--p-accent) 50%, black);--p-accent-950: color-mix(in srgb, var(--p-accent) 40%, black);--p-surface-0: #ffffff;--p-surface-50: #fafafa;--p-surface-100: #f5f5f5;--p-surface-200: #e5e5e5;--p-surface-300: #d4d4d4;--p-surface-400: #a3a3a3;--p-surface-500: #737373;--p-surface-600: #525252;--p-surface-700: #404040;--p-surface-800: #262626;--p-surface-850: color-mix(in srgb, var(--p-surface-800) 50%, var(--p-surface-900));--p-surface-900: #171717;--p-surface-950: #0a0a0a;--p-content-border-radius: 6px;--p-font-heading-family: var(--v-font-family-head, Arial);--p-font-heading-scale: 1;--p-font-heading-line-height: 1.5;--p-font-heading-letter-spacing: normal;--p-font-heading-stretch: normal;--p-font-heading-variation-settings: normal;--p-font-body-scale: 1;--p-font-body-line-height: 1.5;--p-font-body-letter-spacing: normal;--p-font-body-stretch: normal;--p-font-body-variation-settings: normal;--p-font-mono-family: ui-monospace}:root{--p-primary-color: var(--p-primary-500);--p-primary-contrast-color: var(--p-surface-0);--p-primary-hover-color: var(--p-primary-600);--p-primary-active-color: var(--p-primary-700);--p-secondary-color: var(--p-secondary-500);--p-secondary-contrast-color: var(--p-surface-0);--p-secondary-hover-color: var(--p-secondary-600);--p-secondary-active-color: var(--p-secondary-700);--p-danger-color: var(--p-danger-500);--p-danger-contrast-color: var(--p-surface-0);--p-danger-hover-color: var(--p-danger-600);--p-danger-active-color: var(--p-danger-700);--p-success-color: var(--p-success-500);--p-success-contrast-color: var(--p-surface-0);--p-success-hover-color: var(--p-success-600);--p-success-active-color: var(--p-success-700);--p-warn-color: var(--p-warn-500);--p-warn-contrast-color: var(--p-surface-0);--p-warn-hover-color: var(--p-warn-600);--p-warn-active-color: var(--p-warn-700);--p-info-color: var(--p-info-500);--p-info-contrast-color: var(--p-surface-0);--p-info-hover-color: var(--p-info-600);--p-info-active-color: var(--p-info-700);--p-help-color: var(--p-help-500);--p-help-contrast-color: var(--p-surface-0);--p-help-hover-color: var(--p-help-600);--p-help-active-color: var(--p-help-700);--p-accent-color: var(--p-accent-500);--p-accent-contrast-color: var(--p-surface-0);--p-accent-hover-color: var(--p-accent-600);--p-accent-active-color: var(--p-accent-700);--p-content-border-color: var(--p-surface-200);--p-content-hover-background: var(--p-surface-100);--p-content-hover-color: var(--p-surface-800);--p-highlight-background: var(--p-primary-50);--p-highlight-color: var(--p-primary-700);--p-highlight-focus-background: var(--p-primary-100);--p-highlight-focus-color: var(--p-primary-800);--p-content-background: var(--p-surface-0);--p-text-color: var(--p-surface-700);--p-text-hover-color: var(--p-surface-800);--p-text-muted-color: var(--p-surface-500);--p-text-hover-muted-color: var(--p-surface-600)}@media(prefers-color-scheme:dark){:root:not(.w-theme-light){--p-surface-D: #fff;--p-surface-0: #fff;--p-surface-50: #fafafa;--p-surface-100: #f4f4f5;--p-surface-200: #e4e4e7;--p-surface-300: #d4d4d8;--p-surface-400: #a1a1aa;--p-surface-500: #71717a;--p-surface-600: #545250;--p-surface-700: #403e3c;--p-surface-800: #2b2927;--p-surface-850: color-mix(in srgb, var(--p-surface-800) 50%, var(--p-surface-900));--p-surface-900: #1c1a19;--p-surface-950: #0f0e0d;--p-primary: rgb(0, 125, 178);--p-primary-50: color-mix(in srgb, var(--p-primary) 5%, white);--p-primary-100: color-mix(in srgb, var(--p-primary) 10%, white);--p-primary-200: color-mix(in srgb, var(--p-primary) 20%, white);--p-primary-300: color-mix(in srgb, var(--p-primary) 30%, white);--p-primary-400: color-mix(in srgb, var(--p-primary) 40%, white);--p-primary-500: var(--p-primary);--p-primary-600: color-mix(in srgb, var(--p-primary) 80%, black);--p-primary-700: color-mix(in srgb, var(--p-primary) 70%, black);--p-primary-800: color-mix(in srgb, var(--p-primary) 60%, black);--p-primary-900: color-mix(in srgb, var(--p-primary) 50%, black);--p-primary-950: color-mix(in srgb, var(--p-primary) 40%, black);--p-primary-color: var(--p-primary-400);--p-primary-contrast-color: var(--p-surface-900);--p-primary-hover-color: var(--p-primary-300);--p-primary-active-color: var(--p-primary-200);--p-secondary-color: var(--p-secondary-400);--p-secondary-contrast-color: var(--p-surface-900);--p-secondary-hover-color: var(--p-secondary-300);--p-secondary-active-color: var(--p-secondary-200);--p-danger-color: var(--p-danger-400);--p-danger-contrast-color: var(--p-surface-900);--p-danger-hover-color: var(--p-danger-300);--p-danger-active-color: var(--p-danger-200);--p-success-color: var(--p-success-400);--p-success-contrast-color: var(--p-surface-900);--p-success-hover-color: var(--p-success-300);--p-success-active-color: var(--p-success-200);--p-warn-color: var(--p-warn-400);--p-warn-contrast-color: var(--p-surface-900);--p-warn-hover-color: var(--p-warn-300);--p-warn-active-color: var(--p-warn-200);--p-info-color: var(--p-info-400);--p-info-contrast-color: var(--p-surface-900);--p-info-hover-color: var(--p-info-300);--p-info-active-color: var(--p-info-200);--p-help-color: var(--p-help-400);--p-help-contrast-color: var(--p-surface-900);--p-help-hover-color: var(--p-help-300);--p-help-active-color: var(--p-help-200);--p-accent-color: var(--p-accent-400);--p-accent-contrast-color: var(--p-surface-900);--p-accent-hover-color: var(--p-accent-300);--p-accent-active-color: var(--p-accent-200);--p-content-border-color: var(--p-surface-700);--p-content-hover-background: var(--p-surface-800);--p-content-hover-color: var(--p-surface-0);--p-highlight-background: color-mix(in srgb, var(--p-primary-400), transparent 84%);--p-highlight-color: rgba(255, 255, 255, 87%);--p-highlight-focus-background: color-mix(in srgb, var(--p-primary-400), transparent 76%);--p-highlight-focus-color: rgba(255, 255, 255, 87%);--p-content-background: var(--p-surface-900);--p-text-color: var(--p-surface-0);--p-text-hover-color: var(--p-surface-0);--p-text-muted-color: var(--p-surface-400);--p-text-hover-muted-color: var(--p-surface-300)}}:root.w-theme-dark,.w-theme-dark{color-scheme:dark;--p-surface-D: #fff;--p-surface-0: #fff;--p-surface-50: #fafafa;--p-surface-100: #f4f4f5;--p-surface-200: #e4e4e7;--p-surface-300: #d4d4d8;--p-surface-400: #a1a1aa;--p-surface-500: #71717a;--p-surface-600: #545250;--p-surface-700: #403e3c;--p-surface-800: #2b2927;--p-surface-850: color-mix(in srgb, var(--p-surface-800) 50%, var(--p-surface-900));--p-surface-900: #1c1a19;--p-surface-950: #0f0e0d;--p-primary: rgb(0, 125, 178);--p-primary-50: color-mix(in srgb, var(--p-primary) 5%, white);--p-primary-100: color-mix(in srgb, var(--p-primary) 10%, white);--p-primary-200: color-mix(in srgb, var(--p-primary) 20%, white);--p-primary-300: color-mix(in srgb, var(--p-primary) 30%, white);--p-primary-400: color-mix(in srgb, var(--p-primary) 40%, white);--p-primary-500: var(--p-primary);--p-primary-600: color-mix(in srgb, var(--p-primary) 80%, black);--p-primary-700: color-mix(in srgb, var(--p-primary) 70%, black);--p-primary-800: color-mix(in srgb, var(--p-primary) 60%, black);--p-primary-900: color-mix(in srgb, var(--p-primary) 50%, black);--p-primary-950: color-mix(in srgb, var(--p-primary) 40%, black);--p-primary-color: var(--p-primary-400);--p-primary-contrast-color: var(--p-surface-900);--p-primary-hover-color: var(--p-primary-300);--p-primary-active-color: var(--p-primary-200);--p-secondary-color: var(--p-secondary-400);--p-secondary-contrast-color: var(--p-surface-900);--p-secondary-hover-color: var(--p-secondary-300);--p-secondary-active-color: var(--p-secondary-200);--p-danger-color: var(--p-danger-400);--p-danger-contrast-color: var(--p-surface-900);--p-danger-hover-color: var(--p-danger-300);--p-danger-active-color: var(--p-danger-200);--p-success-color: var(--p-success-400);--p-success-contrast-color: var(--p-surface-900);--p-success-hover-color: var(--p-success-300);--p-success-active-color: var(--p-success-200);--p-warn-color: var(--p-warn-400);--p-warn-contrast-color: var(--p-surface-900);--p-warn-hover-color: var(--p-warn-300);--p-warn-active-color: var(--p-warn-200);--p-info-color: var(--p-info-400);--p-info-contrast-color: var(--p-surface-900);--p-info-hover-color: var(--p-info-300);--p-info-active-color: var(--p-info-200);--p-help-color: var(--p-help-400);--p-help-contrast-color: var(--p-surface-900);--p-help-hover-color: var(--p-help-300);--p-help-active-color: var(--p-help-200);--p-accent-color: var(--p-accent-400);--p-accent-contrast-color: var(--p-surface-900);--p-accent-hover-color: var(--p-accent-300);--p-accent-active-color: var(--p-accent-200);--p-content-border-color: var(--p-surface-700);--p-content-hover-background: var(--p-surface-800);--p-content-hover-color: var(--p-surface-0);--p-highlight-background: color-mix(in srgb, var(--p-primary-400), transparent 84%);--p-highlight-color: rgba(255, 255, 255, 87%);--p-highlight-focus-background: color-mix(in srgb, var(--p-primary-400), transparent 76%);--p-highlight-focus-color: rgba(255, 255, 255, 87%);--p-content-background: var(--p-surface-900);--p-text-color: var(--p-surface-0);--p-text-hover-color: var(--p-surface-0);--p-text-muted-color: var(--p-surface-400);--p-text-hover-muted-color: var(--p-surface-300)}:root.w-theme-light,.w-theme-light{color-scheme:light;--p-surface-0: #ffffff;--p-surface-50: #fafafa;--p-surface-100: #f5f5f5;--p-surface-200: #e5e5e5;--p-surface-300: #d4d4d4;--p-surface-400: #a3a3a3;--p-surface-500: #737373;--p-surface-600: #525252;--p-surface-700: #404040;--p-surface-800: #262626;--p-surface-850: color-mix(in srgb, var(--p-surface-800) 50%, var(--p-surface-900));--p-surface-900: #171717;--p-surface-950: #0a0a0a;--p-primary: rgb(0, 95, 178);--p-primary-50: color-mix(in srgb, var(--p-primary) 5%, white);--p-primary-100: color-mix(in srgb, var(--p-primary) 10%, white);--p-primary-200: color-mix(in srgb, var(--p-primary) 20%, white);--p-primary-300: color-mix(in srgb, var(--p-primary) 30%, white);--p-primary-400: color-mix(in srgb, var(--p-primary) 40%, white);--p-primary-500: var(--p-primary);--p-primary-600: color-mix(in srgb, var(--p-primary) 80%, black);--p-primary-700: color-mix(in srgb, var(--p-primary) 70%, black);--p-primary-800: color-mix(in srgb, var(--p-primary) 60%, black);--p-primary-900: color-mix(in srgb, var(--p-primary) 50%, black);--p-primary-950: color-mix(in srgb, var(--p-primary) 40%, black);--p-primary-color: var(--p-primary-500);--p-primary-contrast-color: var(--p-surface-0);--p-primary-hover-color: var(--p-primary-600);--p-primary-active-color: var(--p-primary-700);--p-secondary-color: var(--p-secondary-500);--p-secondary-contrast-color: var(--p-surface-0);--p-secondary-hover-color: var(--p-secondary-600);--p-secondary-active-color: var(--p-secondary-700);--p-danger-color: var(--p-danger-500);--p-danger-contrast-color: var(--p-surface-0);--p-danger-hover-color: var(--p-danger-600);--p-danger-active-color: var(--p-danger-700);--p-success-color: var(--p-success-500);--p-success-contrast-color: var(--p-surface-0);--p-success-hover-color: var(--p-success-600);--p-success-active-color: var(--p-success-700);--p-warn-color: var(--p-warn-500);--p-warn-contrast-color: var(--p-surface-0);--p-warn-hover-color: var(--p-warn-600);--p-warn-active-color: var(--p-warn-700);--p-info-color: var(--p-info-500);--p-info-contrast-color: var(--p-surface-0);--p-info-hover-color: var(--p-info-600);--p-info-active-color: var(--p-info-700);--p-help-color: var(--p-help-500);--p-help-contrast-color: var(--p-surface-0);--p-help-hover-color: var(--p-help-600);--p-help-active-color: var(--p-help-700);--p-accent-color: var(--p-accent-500);--p-accent-contrast-color: var(--p-surface-0);--p-accent-hover-color: var(--p-accent-600);--p-accent-active-color: var(--p-accent-700);--p-content-border-color: var(--p-surface-200);--p-content-hover-background: var(--p-surface-100);--p-content-hover-color: var(--p-surface-800);--p-highlight-background: var(--p-primary-50);--p-highlight-color: var(--p-primary-700);--p-highlight-focus-background: var(--p-primary-100);--p-highlight-focus-color: var(--p-primary-800);--p-content-background: var(--p-surface-0);--p-text-color: var(--p-surface-700);--p-text-hover-color: var(--p-surface-800);--p-text-muted-color: var(--p-surface-500);--p-text-hover-muted-color: var(--p-surface-600)}:host{display:block;height:100%;min-height:0;--km-bg: var(--p-content-background);--km-fg: var(--p-text-color);--km-muted: var(--p-text-muted-color);--km-border: var(--p-content-border-color);--km-primary: var(--p-primary-color);--km-on-primary: var(--p-primary-contrast-color);--km-radius: 14px;--km-radius-sm: 8px;--km-radius-pill: 6px;--km-rail-w: 296px;--system-surface-gutter: var(--kickside-system-surface-gutter, 24px);--km-hover: color-mix(in srgb, var(--p-text-color) 7%, transparent);--km-sunken: color-mix(in srgb, var(--p-text-color) 4%, transparent);--km-ring: var(--p-focus-ring-shadow);--km-shadow: 0 20px 60px rgba(0, 0, 0, .35);--km-shadow-sm: 0 12px 40px rgba(0, 0, 0, .3)}:host>div{height:100%;min-height:0}*,*:before,*:after{box-sizing:border-box}.km{height:100%;min-height:0;display:flex;flex-direction:column;background:var(--km-bg);color:var(--km-fg);font-family:inherit}.km-top-notice{width:calc(100% - (var(--system-surface-gutter) * 2));margin:12px 0 0 var(--system-surface-gutter)}.km-shell{flex:1;min-height:0;width:100%;margin:0;display:grid;grid-template-columns:var(--km-rail-w) minmax(0,1fr);border-left:1px solid var(--km-border);border-right:1px solid var(--km-border)}.km-rail{min-width:0;min-height:0;display:flex;flex-direction:column;border-right:1px solid var(--km-border)}.km-rail-body{flex:1;min-height:0;overflow:auto;padding:6px}.km-main{min-width:0;min-height:0;display:flex;flex-direction:column;overflow:hidden}.km-railhead{flex:0 0 auto;display:flex;align-items:center;justify-content:space-between;gap:8px;min-height:48px;padding:0 8px 0 14px;border-bottom:1px solid var(--km-border)}.km-railhead-title{display:inline-flex;align-items:center;gap:7px;font-size:12px;font-weight:760;letter-spacing:.03em;text-transform:uppercase;color:var(--km-muted)}.km-railhead-title b{min-width:18px;padding:1px 6px;border-radius:999px;background:var(--km-sunken);color:var(--km-fg);font-size:11px;font-weight:700;text-align:center}.km-railhead-acts{display:inline-flex;align-items:center;gap:2px}.km-iconbtn{width:32px;height:32px;flex:0 0 auto;display:inline-flex;align-items:center;justify-content:center;border:1px solid transparent;border-radius:var(--km-radius-sm);background:transparent;color:var(--km-muted);cursor:pointer;transition:background-color .12s ease,color .12s ease,border-color .12s ease}.km-iconbtn svg{width:18px;height:18px}.km-iconbtn.sm{width:28px;height:28px}.km-iconbtn.sm svg{width:16px;height:16px}.km-iconbtn.lg{width:36px;height:36px}.km-iconbtn:hover{color:var(--km-fg);background:var(--km-hover)}.km-iconbtn.bordered{border-color:var(--km-border)}.km-iconbtn.on{color:var(--km-primary);background:color-mix(in srgb,var(--km-primary) 12%,transparent)}.km-iconbtn.danger:hover{color:var(--p-danger-600, var(--p-danger-500));background:color-mix(in srgb,var(--p-danger-500) 12%,transparent)}.km-iconbtn.tone-ok{color:var(--p-success-600, var(--p-success-500));background:color-mix(in srgb,var(--p-success-500) 10%,transparent)}.km-iconbtn.tone-ok:hover,.km-iconbtn.tone-ok.on{color:var(--p-success-600, var(--p-success-500));background:color-mix(in srgb,var(--p-success-500) 16%,transparent)}.km-iconbtn.tone-bad{color:var(--p-danger-600, var(--p-danger-500));background:color-mix(in srgb,var(--p-danger-500) 10%,transparent)}.km-iconbtn.tone-bad:hover,.km-iconbtn.tone-bad.on{color:var(--p-danger-600, var(--p-danger-500));background:color-mix(in srgb,var(--p-danger-500) 16%,transparent)}.km-iconbtn:disabled{opacity:.4;cursor:default;background:transparent;color:var(--km-muted)}.km-iconbtn:focus-visible{outline:none;box-shadow:var(--km-ring)}.km-btn{height:34px;display:inline-flex;align-items:center;justify-content:center;gap:6px;padding:0 13px;border:1px solid transparent;border-radius:var(--km-radius-sm);font:inherit;font-size:13px;font-weight:680;white-space:nowrap;cursor:pointer;transition:background-color .12s ease,color .12s ease,border-color .12s ease,filter .12s ease}.km-btn svg{width:16px;height:16px}.km-btn.sm{height:30px;padding:0 10px;font-size:12.5px}.km-btn:disabled{opacity:.5;cursor:default}.km-btn:focus-visible{outline:none;box-shadow:var(--km-ring)}.km-btn-primary{color:var(--km-on-primary);background:var(--km-primary)}.km-btn-primary:hover:not(:disabled){filter:brightness(1.06)}.km-btn-ghost{color:var(--km-fg);border-color:var(--km-border)}.km-btn-ghost:hover:not(:disabled){background:var(--km-hover)}.km-btn-soft{color:var(--km-fg);background:var(--km-sunken)}.km-btn-soft:hover:not(:disabled){background:var(--km-hover)}.km-btn-danger{color:var(--p-danger-contrast-color);background:var(--p-danger-500)}.km-btn-danger:hover:not(:disabled){filter:brightness(1.06)}.km-input{width:100%;min-width:0;height:34px;padding:0 10px;border:1px solid var(--km-border);border-radius:var(--km-radius-sm);background:var(--km-bg);color:var(--km-fg);font:inherit;font-size:13px}.km-input:focus{outline:none;border-color:var(--km-primary);box-shadow:var(--km-ring)}.km-input:read-only{color:var(--km-muted);background:var(--km-sunken)}.km-input:disabled{opacity:.6}.km-input.mono{font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace}.km-textarea{height:auto;min-height:120px;padding:9px 10px;line-height:1.45;resize:vertical}.km-search{position:relative;display:flex;align-items:center;min-width:0}.km-search-ico{position:absolute;left:9px;width:16px;height:16px;color:var(--km-muted);pointer-events:none}.km-search-input{width:100%;height:34px;padding:0 30px;border:1px solid var(--km-border);border-radius:var(--km-radius-sm);background:var(--km-bg);color:var(--km-fg);font:inherit;font-size:13px}.km-search-input:focus{outline:none;border-color:var(--km-primary);box-shadow:var(--km-ring)}.km-search-clear{position:absolute;right:6px;width:22px;height:22px;display:inline-flex;align-items:center;justify-content:center;border:0;border-radius:6px;background:transparent;color:var(--km-muted);cursor:pointer}.km-search-clear:hover{color:var(--km-fg);background:var(--km-hover)}.km-search-clear svg{width:14px;height:14px}.km-select{position:relative;min-width:0;display:flex}.km-select-el{width:100%;height:34px;padding:0 30px 0 10px;border:1px solid var(--km-border);border-radius:var(--km-radius-sm);background:var(--km-bg);color:var(--km-fg);font:inherit;font-size:13px;cursor:pointer;appearance:none}.km-select-el:focus{outline:none;border-color:var(--km-primary);box-shadow:var(--km-ring)}.km-select-chev{position:absolute;right:9px;top:50%;transform:translateY(-50%);width:15px;height:15px;color:var(--km-muted);pointer-events:none}.km-field{min-width:0;display:flex;flex-direction:column;gap:5px}.km-field-label{color:var(--km-muted);font-size:11.5px;font-weight:680}.km-field-help{color:var(--km-muted);font-size:11.5px;line-height:1.35}.ws-name-row{display:flex;align-items:center;gap:8px}.ws-name-row .wc-iconfield{flex:0 0 auto;display:inline-flex;align-items:center}.ws-name-row .km-input{flex:1 1 auto;min-width:0}.km-toggle{display:inline-flex;align-items:center;gap:9px;cursor:pointer;user-select:none}.km-toggle.disabled{opacity:.5;cursor:default}.km-toggle-input{position:absolute;opacity:0;width:0;height:0}.km-toggle-track{position:relative;width:36px;height:20px;flex:0 0 auto;border-radius:999px;background:color-mix(in srgb,var(--p-text-color) 22%,transparent);transition:background-color .15s ease}.km-toggle-thumb{position:absolute;top:2px;left:2px;width:16px;height:16px;border-radius:50%;background:#fff;box-shadow:0 1px 2px #0000004d;transition:transform .15s ease}.km-toggle.on .km-toggle-track{background:var(--km-primary)}.km-toggle.on .km-toggle-thumb{transform:translate(16px)}.km-toggle-input:focus-visible+.km-toggle-track{box-shadow:var(--km-ring)}.km-toggle-label{font-size:13px;color:var(--km-fg)}.km-pill{display:inline-flex;align-items:center;gap:4px;max-width:190px;min-height:21px;padding:1px 8px;border-radius:var(--km-radius-pill);font-size:10.5px;font-weight:660;line-height:1.4;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.km-pill svg{width:12px;height:12px}.km-pill-dot{width:6px;height:6px;border-radius:50%;background:currentColor}.t-muted{color:var(--km-muted);background:var(--km-sunken)}.t-ok{color:var(--p-success-600, var(--p-success-500));background:color-mix(in srgb,var(--p-success-500) 14%,transparent)}.t-bad{color:var(--p-danger-600, var(--p-danger-500));background:color-mix(in srgb,var(--p-danger-500) 14%,transparent)}.t-warn{color:var(--p-warn-600, var(--p-warn-500));background:color-mix(in srgb,var(--p-warn-500) 18%,transparent)}.t-info{color:var(--p-info-600, var(--p-info-500));background:color-mix(in srgb,var(--p-info-500) 14%,transparent)}.t-accent{color:var(--km-primary);background:color-mix(in srgb,var(--km-primary) 13%,transparent)}.km-prow-dot.t-muted{background:color-mix(in srgb,var(--p-text-color) 35%,transparent)}.km-prow-dot.t-ok{background:var(--p-success-500)}.km-prow-dot.t-bad{background:var(--p-danger-500)}.km-prow-dot.t-warn{background:var(--p-warn-500)}.km-prow-dot.t-info{background:var(--p-info-500)}.km-prow-dot.t-accent{background:var(--km-primary)}.km-notice{display:flex;align-items:center;gap:9px;padding:9px 10px 9px 12px;border:1px solid var(--km-border);border-radius:var(--km-radius-sm);font-size:13px}.km-notice svg{width:17px;height:17px;flex:0 0 auto}.km-notice-text{flex:1;min-width:0}.km-notice.t-info{color:var(--km-fg);background:var(--km-sunken)}.km-notice.t-error{color:var(--p-danger-600, var(--p-danger-500));border-color:color-mix(in srgb,var(--p-danger-500) 32%,var(--km-border));background:color-mix(in srgb,var(--p-danger-500) 9%,transparent)}.km-notice-x{width:24px;height:24px;display:inline-flex;align-items:center;justify-content:center;border:0;border-radius:6px;background:transparent;color:inherit;cursor:pointer;opacity:.7}.km-notice-x:hover{opacity:1;background:color-mix(in srgb,currentColor 12%,transparent)}.km-notice-x svg{width:14px;height:14px}.km-loading{display:flex;align-items:center;justify-content:center;gap:9px;padding:40px 20px;color:var(--km-muted);font-size:13px}.km-loading svg{width:20px;height:20px}.km-empty{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;padding:48px 24px;text-align:center}.km-empty-ico{width:30px;height:30px;color:var(--km-muted)}.km-empty-title{font-size:14px;font-weight:720}.km-empty-hint{margin:0;max-width:340px;color:var(--km-muted);font-size:12.5px;line-height:1.45}.km-empty .km-btn{margin-top:4px}.km-avatar{width:32px;height:32px;flex:0 0 auto;display:inline-flex;align-items:center;justify-content:center;border-radius:var(--km-radius-sm);color:var(--km-primary);background:color-mix(in srgb,var(--km-primary) 12%,transparent)}.km-avatar svg{width:18px;height:18px}.km-avatar.sm{width:26px;height:26px;border-radius:8px}.km-avatar.sm svg{width:15px;height:15px}.km-avatar.lg{width:40px;height:40px}.km-avatar.lg svg{width:22px;height:22px}.km-plist{display:flex;flex-direction:column;gap:2px}.km-plist-all{width:100%;height:32px;display:flex;align-items:center;padding:0 10px;border:0;border-radius:var(--km-radius-sm);background:transparent;color:var(--km-muted);font:inherit;font-size:12.5px;font-weight:640;text-align:left;cursor:pointer}.km-plist-all:hover{background:var(--km-hover);color:var(--km-fg)}.km-plist-all.on{background:color-mix(in srgb,var(--km-primary) 12%,transparent);color:var(--km-primary)}.km-plist-empty{display:flex;flex-direction:column;align-items:flex-start;gap:8px;padding:10px;color:var(--km-muted);font-size:12.5px}.km-plist-empty p{margin:0}.km-prow{position:relative;display:grid;grid-template-columns:minmax(0,1fr) auto;align-items:center;border-radius:var(--km-radius-sm)}.km-prow:hover{background:var(--km-hover)}.km-prow.on{background:color-mix(in srgb,var(--km-primary) 11%,transparent)}.km-prow.on:before{content:"";position:absolute;left:0;top:7px;bottom:7px;width:3px;border-radius:0 999px 999px 0;background:var(--km-primary)}.km-prow-main{min-width:0;display:grid;grid-template-columns:26px minmax(0,1fr) auto;align-items:center;gap:9px;padding:7px 8px 7px 10px;border:0;background:transparent;color:inherit;font:inherit;text-align:left;cursor:pointer}.km-prow-text{min-width:0}.km-prow-name{display:flex;align-items:center;gap:6px;min-width:0;font-size:13px;font-weight:640;line-height:1.25}.km-prow-name>:first-child{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.km-prow-dot{width:7px;height:7px;flex:0 0 auto;border-radius:50%}.km-prow-cred{width:13px;height:13px;flex:0 0 auto;color:var(--km-muted)}.km-prow-sub{display:block;margin-top:1px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--km-muted);font-size:11.5px;line-height:1.3}.km-prow-acts{display:flex;align-items:center;gap:1px;padding-right:6px;opacity:0;transition:opacity .12s ease}.km-prow:hover .km-prow-acts,.km-prow:focus-within .km-prow-acts{opacity:1}.km-prow-msg{grid-column:1 / -1;padding:0 10px 7px 45px;margin-top:-4px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--km-muted);font-size:11px}.km-picker{display:flex;flex-direction:column;gap:18px}.km-picker-sec{display:flex;flex-direction:column;gap:7px}.km-picker-sec-title{color:var(--km-muted);font-size:11px;font-weight:760;letter-spacing:.03em;text-transform:uppercase}.km-picker-list{display:flex;flex-direction:column;gap:4px}.km-picker-item{display:grid;grid-template-columns:32px minmax(0,1fr) 16px;align-items:center;gap:11px;padding:9px 10px;border:1px solid var(--km-border);border-radius:var(--km-radius-sm);background:transparent;color:var(--km-fg);font:inherit;text-align:left;cursor:pointer;transition:border-color .12s ease,background-color .12s ease}.km-picker-item:hover{border-color:color-mix(in srgb,var(--km-primary) 50%,var(--km-border));background:var(--km-hover)}.km-picker-item:focus-visible{outline:none;box-shadow:var(--km-ring)}.km-picker-ico{width:32px;height:32px;display:inline-flex;align-items:center;justify-content:center;border-radius:var(--km-radius-sm);color:var(--km-primary);background:color-mix(in srgb,var(--km-primary) 11%,transparent)}.km-picker-ico svg{width:18px;height:18px}.km-picker-body{min-width:0;display:flex;flex-direction:column;gap:2px}.km-picker-name{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:13px;font-weight:660}.km-picker-desc{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--km-muted);font-size:11.5px}.km-picker-go{width:16px;height:16px;color:var(--km-muted)}.km-pool{flex:1;min-height:0;display:flex;flex-direction:column;--km-cols: 32px minmax(0, 1.3fr) minmax(0, 1.75fr) 76px 122px}.km-pool-head{flex:0 0 auto;display:flex;flex-direction:column;gap:10px;padding:12px 16px;border-bottom:1px solid var(--km-border)}.km-pool-head-top{display:flex;align-items:center;justify-content:space-between;gap:14px;flex-wrap:wrap}.km-pool-title{display:flex;align-items:center;gap:10px;font-size:14px;font-weight:760}.km-pool-counts{display:inline-flex;align-items:center;gap:5px}.km-pool-head-top .km-search{width:min(280px,42vw)}.km-pool-filters{display:grid;grid-template-columns:repeat(5,minmax(0,1fr)) auto;gap:8px;align-items:center}.km-pool-body{flex:1;min-height:0;display:flex;align-items:center;justify-content:center}.km-pool-table{flex:1;min-height:0;overflow:auto}.km-pool-more{display:flex;justify-content:center;padding:16px}.km-pool-cols{position:sticky;top:0;z-index:1;display:grid;grid-template-columns:var(--km-cols);gap:13px;padding:8px 16px;border-bottom:1px solid var(--km-border);background:var(--km-bg)}.km-pool-cols span{color:var(--km-muted);font-size:10.5px;font-weight:700;letter-spacing:.04em;text-transform:uppercase}.km-pool-cols-r{text-align:right}.km-mrow{display:grid;grid-template-columns:var(--km-cols);gap:13px;align-items:center;min-height:56px;padding:9px 16px;border-bottom:1px solid var(--km-border)}.km-mrow:hover{background:var(--km-sunken)}.km-mrow-off{opacity:.55}.km-mrow-off:hover{opacity:.85}.km-mrow-id{min-width:0}.km-mrow-title{display:flex;align-items:center;gap:8px;min-width:0;font-size:13px;font-weight:660;line-height:1.25}.km-mrow-title-text{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.km-mrow-title .km-pill{flex:0 0 auto}.km-mrow-sub{margin-top:2px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--km-muted);font-size:11.5px}.km-mrow-prov{font-weight:620;color:var(--km-fg)}.km-mrow-mono{font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace}.km-mrow-tags{min-width:0;display:flex;flex-direction:column;align-items:flex-start;gap:4px;padding:2px 0}.km-tag-group{display:flex;align-items:center;gap:4px;flex-wrap:wrap;min-width:0;max-width:100%}.km-tag-classes .km-pill{border:1px solid color-mix(in srgb,var(--km-primary) 32%,transparent);font-weight:700}.km-tag-caps .km-pill{font-weight:600}.km-mrow-limits{display:flex;flex-direction:column;gap:2px;justify-self:end;text-align:right}.km-mrow-limits span{color:var(--km-muted);font-size:11px}.km-mrow-limits b{color:var(--km-fg);font-weight:680}.km-mrow-limit-chips{display:none}.km-mrow-acts{display:flex;align-items:center;gap:1px;justify-self:end}.km-mrow-probe{grid-column:1 / -1;min-width:0;display:flex;flex-direction:column;gap:10px;margin-top:2px;padding:10px 12px 12px 46px;border:1px solid var(--km-border);border-radius:var(--km-radius-sm);background:color-mix(in srgb,var(--p-text-color) 2%,transparent);font-size:13px}.km-mrow-probe.ok{border-color:color-mix(in srgb,var(--p-success-500) 30%,var(--km-border));background:color-mix(in srgb,var(--p-success-500) 7%,transparent)}.km-mrow-probe.fail{border-color:color-mix(in srgb,var(--p-danger-500) 30%,var(--km-border));background:color-mix(in srgb,var(--p-danger-500) 7%,transparent)}.km-mrow-probe-head{min-width:0;display:flex;align-items:center;flex-wrap:wrap;gap:8px}.km-mrow-probe-head>svg{width:17px;height:17px;flex:0 0 auto}.km-mrow-probe.ok .km-mrow-probe-head>svg{color:var(--p-success-600, var(--p-success-500))}.km-mrow-probe.fail .km-mrow-probe-head>svg{color:var(--p-danger-600, var(--p-danger-500))}.km-mrow-probe-msg{flex:1 1 220px;min-width:0;overflow-wrap:anywhere}.km-mrow-probe-head .km-btn{margin-left:auto}.km-mrow-probe-body{display:flex;flex-direction:column;gap:10px;min-width:0}.km-drawer-mask{position:fixed;inset:0;z-index:1000;display:flex;justify-content:flex-end;background:color-mix(in srgb,var(--p-text-color) 38%,transparent)}.km-drawer{width:min(560px,calc(100vw - 36px));height:100%;display:flex;flex-direction:column;background:var(--km-bg);border-left:1px solid var(--km-border);box-shadow:-18px 0 48px #00000038}.km-drawer.wide{width:min(720px,calc(100vw - 36px))}.km-drawer-h{flex:0 0 auto;display:flex;align-items:center;gap:8px;min-height:54px;padding:0 10px 0 16px;border-bottom:1px solid var(--km-border)}.km-drawer-title{flex:1;min-width:0;display:inline-flex;align-items:center;gap:8px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:14px;font-weight:760}.km-drawer-title svg{width:18px;height:18px;color:var(--km-muted)}.km-drawer-b{flex:1;min-height:0;overflow:auto;padding:16px}.km-drawer-f{flex:0 0 auto;display:flex;justify-content:flex-end;gap:8px;padding:12px 16px;border-top:1px solid var(--km-border)}.km-drawer-enter-active,.km-drawer-leave-active{transition:opacity .18s ease}.km-drawer-enter-active .km-drawer,.km-drawer-leave-active .km-drawer{transition:transform .2s ease}.km-drawer-enter-from,.km-drawer-leave-to{opacity:0}.km-drawer-enter-from .km-drawer,.km-drawer-leave-to .km-drawer{transform:translate(24px)}.km-modal-mask{position:fixed;inset:0;z-index:1100;display:flex;align-items:center;justify-content:center;padding:18px;background:color-mix(in srgb,var(--p-text-color) 42%,transparent)}.km-confirm{width:min(420px,calc(100vw - 36px));padding:18px;border:1px solid var(--km-border);border-radius:var(--km-radius);background:var(--km-bg);box-shadow:0 18px 52px #00000042}.km-confirm-title{font-size:15px;font-weight:760}.km-confirm-msg{margin:8px 0 0;color:var(--km-muted);font-size:13px;line-height:1.45}.km-confirm-acts{display:flex;justify-content:flex-end;gap:8px;margin-top:18px}.km-modal-enter-active,.km-modal-leave-active{transition:opacity .15s ease}.km-modal-enter-from,.km-modal-leave-to{opacity:0}.km-form{display:flex;flex-direction:column;gap:16px}.km-editor-head{display:flex;align-items:center;gap:11px}.km-editor-head-text{min-width:0}.km-editor-head-title{font-size:14px;font-weight:740}.km-editor-head-sub{margin-top:2px;color:var(--km-muted);font-size:12px;line-height:1.4}.km-form-sec{display:flex;flex-direction:column;gap:10px}.km-form-sec+.km-form-sec{padding-top:16px;border-top:1px solid var(--km-border)}.km-form-sec-title{color:var(--km-muted);font-size:11px;font-weight:760;letter-spacing:.03em;text-transform:uppercase}.km-form-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:11px}.km-form-grid.four{grid-template-columns:repeat(4,minmax(0,1fr))}.km-adv-toggle{display:inline-flex;align-items:center;gap:6px;align-self:flex-start;padding:4px 0;background:none;border:none;cursor:pointer;color:var(--km-muted);font:inherit;font-size:12px;font-weight:700}.km-adv-toggle svg{width:15px;height:15px}.km-form-foot{position:sticky;bottom:-16px;display:flex;flex-wrap:wrap;justify-content:flex-end;gap:8px;margin:0 -16px -16px;padding:14px 16px;border-top:1px solid var(--km-border);background:var(--km-bg)}.km-form-id{font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:11.5px;color:var(--km-muted)}.km-form-foot-sp{flex:1}.km-taginput{position:relative;display:flex;flex-wrap:wrap;align-items:center;gap:6px;width:100%;min-height:36px;padding:5px 8px;border:1px solid var(--km-border);border-radius:var(--km-radius-sm);background:var(--km-bg);cursor:text;transition:border-color .12s ease,box-shadow .12s ease}.km-taginput:focus-within{border-color:var(--km-primary);box-shadow:var(--km-ring)}.km-taginput.disabled{opacity:.6;cursor:default}.km-tag{display:inline-flex;align-items:center;gap:4px;height:24px;max-width:100%;padding:0 4px 0 9px;border-radius:6px;background:color-mix(in srgb,var(--km-primary) 13%,transparent);color:var(--km-fg);font-size:12.5px}.km-tag-label{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.km-tag-x{display:inline-flex;align-items:center;justify-content:center;width:16px;height:16px;flex:0 0 auto;padding:0;border:0;border-radius:8px;background:transparent;color:var(--km-muted);cursor:pointer}.km-tag-x:hover{color:var(--km-fg);background:color-mix(in srgb,var(--p-text-color) 14%,transparent)}.km-tag-x svg{width:12px;height:12px}.km-tag-field{flex:1;min-width:90px;height:24px;border:0;background:transparent;outline:none;color:var(--km-fg);font:inherit;font-size:13px}.km-taginput-wrap{display:flex;flex-direction:column;gap:7px}.km-tag-sug{display:flex;flex-wrap:wrap;gap:5px}.km-tag-sug-item{display:inline-flex;align-items:center;gap:4px;height:24px;padding:0 9px 0 7px;border:1px dashed var(--km-border);border-radius:6px;background:transparent;color:var(--km-muted);font:inherit;font-size:12px;cursor:pointer;transition:border-color .12s ease,color .12s ease,background-color .12s ease}.km-tag-sug-item:hover:not(:disabled){border-style:solid;border-color:color-mix(in srgb,var(--km-primary) 40%,var(--km-border));color:var(--km-fg);background:color-mix(in srgb,var(--km-primary) 8%,transparent)}.km-tag-sug-item:disabled{opacity:.5;cursor:default}.km-tag-sug-item svg{width:13px;height:13px}.km-adv-toggle{display:inline-flex;align-items:center;gap:6px;padding:0;border:0;background:transparent;color:var(--km-muted);font:inherit;font-size:11px;font-weight:760;letter-spacing:.03em;text-transform:uppercase;cursor:pointer}.km-adv-toggle:hover{color:var(--km-fg)}.km-adv-chev{width:14px;height:14px;transition:transform .15s ease}.km-adv-toggle.open .km-adv-chev{transform:rotate(90deg)}.km-adv-body{display:flex;flex-direction:column;gap:10px;margin-top:10px}.km-test-result{display:flex;align-items:center;gap:8px;padding:8px 11px;border-radius:var(--km-radius-sm);font-size:12.5px}.km-test-result svg{width:16px;height:16px;flex:0 0 auto}.km-test-result span{min-width:0;overflow-wrap:anywhere}.km-test-result.testing{color:var(--km-muted);background:var(--km-sunken)}.km-test-result.ok{color:var(--p-success-600, var(--p-success-500));background:color-mix(in srgb,var(--p-success-500) 12%,transparent)}.km-test-result.fail{color:var(--p-danger-600, var(--p-danger-500));background:color-mix(in srgb,var(--p-danger-500) 10%,transparent)}.km-probe{border:1px solid var(--km-border);border-radius:var(--km-radius-sm);font-size:13px}.km-probe.ok{border-color:color-mix(in srgb,var(--p-success-500) 30%,var(--km-border));background:color-mix(in srgb,var(--p-success-500) 8%,transparent)}.km-probe.fail{border-color:color-mix(in srgb,var(--p-danger-500) 30%,var(--km-border));background:color-mix(in srgb,var(--p-danger-500) 8%,transparent)}.km-probe-head{display:flex;flex-wrap:wrap;align-items:center;gap:9px;padding:9px 10px 9px 12px}.km-probe-head>svg{width:17px;height:17px;flex:0 0 auto}.km-probe.ok .km-probe-head>svg{color:var(--p-success-600, var(--p-success-500))}.km-probe.fail .km-probe-head>svg{color:var(--p-danger-600, var(--p-danger-500))}.km-probe-msg{flex:1;min-width:0}.km-probe-time{flex:0 0 auto;padding:1px 7px;border-radius:var(--km-radius-pill);background:var(--km-sunken);color:var(--km-muted);font-size:11px;font-weight:700;font-variant-numeric:tabular-nums}.km-probe-adv-btn{flex:0 0 auto}.km-probe-x{width:24px;height:24px;display:inline-flex;align-items:center;justify-content:center;flex:0 0 auto;border:0;border-radius:6px;background:transparent;color:var(--km-muted);cursor:pointer;opacity:.7}.km-probe-x:hover{opacity:1;background:color-mix(in srgb,currentColor 12%,transparent)}.km-probe-x svg{width:14px;height:14px}.km-probe-adv{display:flex;flex-direction:column;gap:10px;padding:10px 12px 12px;border-top:1px solid var(--km-border)}.km-probe-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:6px 16px}.km-probe-kv{display:flex;align-items:baseline;gap:8px;min-width:0}.km-probe-kv span{flex:0 0 96px;color:var(--km-muted);font-size:11.5px}.km-probe-kv code{min-width:0;overflow:hidden;text-overflow:ellipsis;font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:11.5px}.km-probe-tokens{display:flex;flex-wrap:wrap;align-items:center;gap:6px}.km-probe-tokens-l{color:var(--km-muted);font-size:11.5px;margin-right:2px}.km-probe-tok{padding:1px 8px;border-radius:var(--km-radius-pill);background:var(--km-sunken);color:var(--km-muted);font-size:11px;font-variant-numeric:tabular-nums}.km-probe-tok b{color:var(--km-fg);font-weight:700}.km-probe-out{display:flex;flex-direction:column;gap:4px}.km-probe-out span{color:var(--km-muted);font-size:11.5px;font-weight:700}.km-probe-out pre{margin:0;max-height:160px;overflow:auto;padding:9px 10px;border-radius:6px;background:var(--km-sunken);font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:11.5px;line-height:1.45;white-space:pre-wrap;word-break:break-word}.km-tabs{flex:0 0 auto;display:flex;gap:2px;padding:0 12px;border-bottom:1px solid var(--km-border)}.km-tab{position:relative;display:inline-flex;align-items:center;gap:7px;height:44px;padding:0 12px;border:0;background:transparent;color:var(--km-muted);font:inherit;font-size:13px;font-weight:700;cursor:pointer}.km-tab:hover,.km-tab.on{color:var(--km-fg)}.km-tab.on:after{content:"";position:absolute;left:8px;right:8px;bottom:-1px;height:2px;border-radius:2px 2px 0 0;background:var(--km-primary)}.km-tab b{min-width:18px;padding:0 6px;border-radius:999px;background:var(--km-sunken);color:var(--km-muted);font-size:11px;font-weight:700;text-align:center}.km-tab.on b{background:color-mix(in srgb,var(--km-primary) 14%,transparent);color:var(--km-primary)}.km-classes{flex:1;min-height:0;display:flex;flex-direction:column}.km-classes-list{display:flex;flex-direction:column;gap:10px;padding:14px 16px}.km-class{flex:0 0 auto;border:1px solid var(--km-border);border-radius:var(--km-radius);overflow:hidden}.km-class-head{display:flex;align-items:center;gap:10px;padding:10px 12px;background:var(--km-sunken);border-bottom:1px solid var(--km-border)}.km-class-head-text{flex:1;min-width:0}.km-class-title{display:flex;align-items:center;gap:8px;font-size:13.5px;font-weight:720}.km-class-ref{font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:11px;font-weight:600;color:var(--km-primary);background:color-mix(in srgb,var(--km-primary) 12%,transparent);padding:1px 6px;border-radius:6px}.km-class-desc{margin-top:3px;color:var(--km-muted);font-size:12px;line-height:1.4}.km-class-meta{display:flex;align-items:center;gap:8px;flex:0 0 auto}.km-class-count{color:var(--km-muted);font-size:11.5px;white-space:nowrap}.km-class-members{display:flex;flex-direction:column}.km-class-member{display:grid;grid-template-columns:58px minmax(0,1.2fr) minmax(0,1fr) auto;align-items:center;gap:10px;padding:8px 12px;border-bottom:1px solid var(--km-border)}.km-class-member:last-child{border-bottom:0}.km-class-member.top{background:color-mix(in srgb,var(--p-success-500) 6%,transparent)}.km-class-rank{width:20px;height:20px;display:inline-flex;align-items:center;justify-content:center;border-radius:6px;background:var(--km-sunken);color:var(--km-muted);font-size:11px;font-weight:700}.km-class-member-name{font-size:13px;font-weight:620;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.km-class-member-id{color:var(--km-muted);font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:11px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.km-class-member-pri{color:var(--km-muted);font-size:11px;justify-self:end;white-space:nowrap}.km-class-empty{padding:12px;color:var(--km-muted);font-size:12px}.km-spin{display:inline-block;flex:0 0 auto;width:15px;height:15px;border:2px solid color-mix(in srgb,currentColor 26%,transparent);border-top-color:currentColor;border-radius:50%;animation:km-spin-rot .6s linear infinite}.km-spin.lg{width:22px;height:22px;border-width:2.5px}@keyframes km-spin-rot{to{transform:rotate(360deg)}}@media(max-width:1080px){.km-pool-filters{grid-template-columns:repeat(3,minmax(0,1fr))}}@media(max-width:860px){.km-shell{grid-template-columns:1fr;grid-template-rows:auto minmax(0,1fr)}.km-rail{border-right:0;border-bottom:1px solid var(--km-border);max-height:40vh}.km-pool-cols{display:none}.km-mrow{grid-template-columns:34px minmax(0,1fr) 122px;gap:6px 10px;align-items:center}.km-mrow .km-avatar{grid-column:1;grid-row:1}.km-mrow-id{grid-column:2;grid-row:1}.km-mrow-acts{grid-column:3;grid-row:1;align-self:start;justify-content:flex-end}.km-mrow-limits{display:none}.km-mrow-limit-chips{grid-column:2 / 3;grid-row:2;display:flex;align-items:center;flex-wrap:wrap;gap:5px;min-width:0}.km-mrow-limit-chips span{display:inline-flex;align-items:baseline;gap:3px;min-width:0;padding:2px 6px;border:1px solid var(--km-border);border-radius:6px;color:var(--km-muted);background:var(--km-sunken);font-size:10.5px;line-height:1.2;white-space:nowrap}.km-mrow-limit-chips b{color:var(--km-fg);font-weight:700}.km-mrow-tags{grid-column:2 / -1;grid-row:3;flex-direction:row;flex-wrap:wrap;align-items:center}.km-mrow-tags .km-tag-group{flex-wrap:wrap}.km-mrow-probe{grid-column:1 / -1;padding-left:10px}.km-mrow-probe-head .km-btn{margin-left:0}.km-form-grid,.km-form-grid.four{grid-template-columns:1fr}.km-class-member{grid-template-columns:auto minmax(0,1fr) auto}.km-class-member-id{display:none}}@media(max-width:560px){.km-pool-filters{grid-template-columns:repeat(2,minmax(0,1fr))}.km-pool-head-top .km-search{width:100%}.km-probe-grid{grid-template-columns:1fr}}.ob{display:flex;flex-direction:column;min-height:0}.ob-stage{display:flex;flex-direction:column;gap:20px}.ob-foot{display:flex;align-items:center;gap:10px;margin-top:24px;padding-top:18px;border-top:1px solid var(--p-content-border-color)}.ob-foot-sp{flex:1}.ob-btn{padding:11px 20px;border-radius:var(--km-radius-sm);border:0;cursor:pointer;font:inherit;font-size:13.5px;font-weight:700;transition:transform .15s,color .15s,filter .15s}.ob-btn:hover:not(:disabled){transform:translateY(-1px)}.ob-ghost{background:transparent;color:var(--p-text-muted-color)}.ob-ghost:hover{color:var(--p-text-color)}.ob-primary{background:var(--p-primary-color);color:var(--p-primary-contrast-color)}.ob-primary:hover:not(:disabled){filter:brightness(1.06)}.ob-primary:disabled{opacity:.5;cursor:default}.ob-result{display:flex;align-items:center;gap:8px;padding:10px 12px;border-radius:var(--km-radius-sm);font-size:12.5px}.ob-result.fail{background:color-mix(in srgb,var(--p-danger-500) 12%,transparent);color:var(--p-danger-700)}.ob-result svg{width:16px;height:16px;flex:none}.ob-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px}.ob-tile{display:flex;flex-direction:column;align-items:flex-start;gap:8px;padding:16px;text-align:left;cursor:pointer;border:1px solid var(--km-border);border-radius:14px;background:var(--km-bg);transition:border-color .15s,background .15s,transform .15s}.ob-tile:hover{border-color:var(--km-primary);background:var(--km-hover);transform:translateY(-2px)}.ob-tile-ico{width:40px;height:40px;display:grid;place-items:center;border-radius:11px;background:color-mix(in srgb,var(--km-primary) 12%,transparent);color:var(--km-primary)}.ob-tile-ico svg{width:22px;height:22px}.ob-tile-name{font-size:14px;font-weight:700;color:var(--km-fg)}.ob-tile-desc{font-size:11.5px;color:var(--km-muted);line-height:1.45}.ob-connecting{display:flex;flex-direction:column;align-items:center;gap:12px;padding:40px 24px;text-align:center;border:1px solid var(--km-border);border-radius:var(--km-radius);background:var(--km-sunken)}.ob-connecting-note{margin:0;font-size:12px;color:var(--km-muted);max-width:360px;line-height:1.5}.ob-autobar{display:flex;align-items:center;justify-content:space-between;gap:12px}.ob-auto-hint{font-size:12px;color:var(--km-muted)}.ob-block{display:flex;flex-direction:column;gap:12px}.ob-block-head{display:flex;align-items:center;justify-content:space-between;gap:10px;font-size:11px;font-weight:700;letter-spacing:.04em;text-transform:uppercase;color:var(--km-muted)}.ob-providers{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}.ob-prov{display:flex;align-items:center;gap:9px;min-width:0;padding:8px 10px;border:1px solid var(--km-border);border-radius:var(--km-radius-sm);background:var(--km-sunken)}.ob-prov-body{flex:1;min-width:0}.ob-prov-name{font-size:12.5px;font-weight:600;color:var(--km-fg);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.ob-prov-sub{font-size:11px;color:var(--km-muted);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.ob-dot{width:8px;height:8px;border-radius:50%;flex:none;background:color-mix(in srgb,var(--km-fg) 25%,transparent)}.ob-dot.ok{background:var(--p-success-500)}.ob-dot.bad{background:var(--p-danger-500)}.ob-dot.warn{background:var(--p-warn-500)}.ob-classes{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}.ob-class{display:flex;flex-direction:column;gap:7px;min-width:0;padding:9px 11px;border:1px solid var(--km-border);border-radius:var(--km-radius-sm)}.ob-class-top{display:flex;align-items:center;gap:8px;min-width:0}.ob-class-ico{width:24px;height:24px;flex:none;display:grid;place-items:center;border-radius:6px;background:var(--km-sunken);color:var(--km-primary)}.ob-class-ico svg{width:15px;height:15px}.ob-class-name{font-size:12.5px;font-weight:600;color:var(--km-fg);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.ob-class .km-select{width:100%}@media(max-width:480px){.ob-providers,.ob-classes{grid-template-columns:1fr}}.ws{container:workspace / inline-size;min-width:0;display:flex;flex-direction:column;height:100%;background:var(--km-bg);color:var(--km-fg);font-family:var(--km-body, system-ui)}.ws-strip{display:flex;align-items:center;gap:8px;height:40px;padding:0 12px;border-bottom:1px solid var(--km-border);background:var(--km-surface, var(--km-bg));flex-shrink:0}.ws-home{display:inline-flex;align-items:center;justify-content:center;width:24px;height:24px;border:0;background:transparent;color:var(--km-muted);border-radius:8px;cursor:pointer}.ws-home:hover{color:var(--km-primary);background:var(--km-hover)}.ws-home svg{width:15px;height:15px}.ws-crumbs{display:flex;align-items:center;gap:2px;min-width:0;overflow-x:auto}.ws-sep{color:var(--km-border);font-size:12px}.ws-crumb{border:0;background:transparent;color:var(--km-muted);font:inherit;font-size:12.5px;font-weight:600;padding:2px 6px;border-radius:8px;cursor:pointer;white-space:nowrap}.ws-crumb:hover{color:var(--km-primary);background:var(--km-hover)}.ws-spacer{flex:1}.ws-body{flex:1;display:flex;min-height:0}.ws-list-pane{flex:1;overflow-y:auto;min-width:0}.ws-list-pane--aside{border-right:1px solid var(--km-border)}.ws-list{display:flex;flex-direction:column;padding:4px 0}.ws-row{display:flex;align-items:center;gap:10px;height:34px;padding:0 14px;cursor:pointer;border-bottom:1px solid color-mix(in srgb,var(--km-border) 40%,transparent)}.ws-row:hover{background:var(--km-hover)}.ws-row--sel{background:color-mix(in srgb,var(--km-primary) 8%,transparent)}.ws-row-ico{width:17px;height:17px;flex-shrink:0}.ws-row-name{flex:1;min-width:0;font-size:13px;font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.ws-row-del{opacity:0;border:0;background:transparent;color:var(--km-muted);cursor:pointer;width:24px;height:24px;border-radius:8px}.ws-row:hover .ws-row-del{opacity:1}.ws-row-del:hover{color:var(--p-danger-color);background:var(--km-hover)}.ws-row-del svg{width:15px;height:15px}.ws-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(92px,1fr));gap:6px;padding:12px}.ws-tile{display:flex;flex-direction:column;align-items:center;gap:6px;padding:12px 6px;border:1px solid transparent;border-radius:var(--km-radius-sm);cursor:pointer;text-align:center}.ws-tile:hover{background:var(--km-hover);border-color:var(--km-border)}.ws-tile--sel{border-color:var(--km-primary);background:color-mix(in srgb,var(--km-primary) 8%,transparent)}.ws-tile-ico{width:30px;height:30px}.ws-tile-name{font-size:11.5px;line-height:1.3;word-break:break-word}.ws-preview{width:var(--ws-preview-width, 440px);max-width:55%;flex-shrink:0;display:flex;flex-direction:column;min-height:0}.ws-preview-head{display:flex;align-items:center;gap:8px;height:40px;padding:0 12px;border-bottom:1px solid var(--km-border)}.ws-preview-title{min-width:0;flex:1;font-size:13px;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.ws-renderer{flex:1;min-height:0;width:100%}.ws-renderer-host{position:relative;height:100%;width:100%;min-height:0}.ws-renderer-mount{position:absolute;inset:0;overflow:auto}.ws-renderer-flow{position:static;height:auto}.ws-renderer-flow .ws-renderer-mount{position:static;inset:auto;height:auto;overflow:visible}.ws-renderer-fail{padding:24px;color:var(--km-muted);font-size:12.5px}.ws-create-mount{position:static;height:auto}.ws-preview-empty{display:flex;flex-direction:column;align-items:center;gap:10px;padding:40px 20px;color:var(--km-muted);font-size:12.5px}.ws-cv{overflow-y:auto;height:100%;padding:12px 14px;display:flex;flex-direction:column;gap:14px}.ws-cv--full{max-width:760px;margin:0 auto;width:100%;padding:24px}.ws-cv-section{display:flex;flex-direction:column;border:1px solid var(--km-border);border-radius:var(--km-radius-sm);overflow:hidden}.ws-cv-sec-title{font-size:11px;font-weight:700;letter-spacing:.04em;text-transform:uppercase;color:var(--km-muted);padding:8px 12px;border-bottom:1px solid var(--km-border);background:var(--km-hover)}.ws-cv-row{display:flex;gap:12px;padding:8px 12px;font-size:12.5px;border-bottom:1px solid color-mix(in srgb,var(--km-border) 40%,transparent)}.ws-cv-row:last-child{border-bottom:0}.ws-cv-k{flex-shrink:0;width:120px;color:var(--km-muted);text-transform:capitalize}.ws-cv-v{flex:1;min-width:0;color:var(--km-fg);word-break:break-word}.ws-cv-mono{font-family:monospace;font-size:11.5px}.ws-modal{position:fixed;inset:0;z-index:50;display:grid;place-items:center;background:color-mix(in srgb,var(--p-text-color) 45%,transparent)}.ws-create-panel{position:relative;width:min(880px,calc(100vw - 40px));max-width:94vw;max-height:88vh;background:var(--km-bg);border:1px solid var(--km-border);border-radius:var(--km-radius);box-shadow:var(--km-shadow);overflow:hidden auto}.ws-dialog{width:380px;max-width:92vw;background:var(--km-bg);border:1px solid var(--km-border);border-radius:var(--km-radius);padding:18px;display:flex;flex-direction:column;gap:14px;box-shadow:var(--km-shadow)}.ws-dialog-head{font-size:15px;font-weight:800}.ws-dialog-foot{display:flex;justify-content:flex-end;gap:8px}.ws-confirm-body{font-size:13px;line-height:1.5;color:var(--km-fg)}.ec-name-row{display:flex;align-items:center;gap:8px}.ec-name-row>:last-child{flex:1;min-width:0}.ws-type-grid{display:flex;flex-direction:column;gap:4px}.ws-type-btn{display:flex;flex-direction:row;align-items:center;gap:10px;padding:9px 11px;border:1px solid var(--km-border);background:var(--km-bg);border-radius:var(--km-radius-sm);cursor:pointer;color:var(--km-fg);font:inherit;font-size:13px;text-align:left}.ws-type-btn:hover{background:var(--km-hover)}.ws-type-btn.on{border-color:var(--km-primary);background:color-mix(in srgb,var(--km-primary) 10%,transparent)}.ws-type-btn svg{width:18px;height:18px;flex-shrink:0}.ws-list-pane{position:relative}.ws-list-pane--drop{outline:2px dashed var(--km-primary);outline-offset:-6px}.ws-drop-hint{position:absolute;inset:0;z-index:5;display:flex;align-items:center;justify-content:center;gap:8px;background:color-mix(in srgb,var(--km-primary) 10%,transparent);color:var(--km-primary);font-weight:700;font-size:14px;pointer-events:none}.ws-drop-hint svg{width:22px;height:22px}.ws-dialog-head{display:flex;align-items:center}.ws-dialog--share{width:520px}.ws-share-host{display:contents}.ws-divider{width:2px;flex-shrink:0;cursor:col-resize;background:var(--km-border);transition:background .12s}.ws-divider:hover,.ws-divider.resizing{background:var(--km-primary)}.ws-edge{position:absolute;left:0;top:0;bottom:0;width:3px;background:transparent}.ws-row{position:relative;padding-left:17px}.ws-row:hover .ws-edge{background:color-mix(in srgb,var(--km-primary) 40%,transparent)}.ws-row--sel .ws-edge{background:var(--km-primary)}.ws-row--drop{background:color-mix(in srgb,var(--km-primary) 14%,transparent);outline:1px dashed var(--km-primary);outline-offset:-1px}.ws-row--drag{opacity:.4}.ws-age{width:30px;text-align:right;font-size:10px;font-family:monospace;color:var(--km-muted);flex-shrink:0}.ws-row-menu{opacity:0;border:0;background:transparent;color:var(--km-muted);cursor:pointer;width:22px;height:22px;border-radius:8px;flex-shrink:0}.ws-row:hover .ws-row-menu{opacity:1}.ws-row-menu:hover{color:var(--km-primary);background:var(--km-hover)}.ws-row-menu svg{width:15px;height:15px}.ws-menu-layer{position:fixed;inset:0;z-index:60}.ws-menu{position:absolute;max-height:100%;max-width:100%;overflow:auto;z-index:60;min-width:190px;background:var(--km-bg);border:1px solid var(--km-border);border-radius:var(--km-radius-sm);padding:5px;box-shadow:var(--km-shadow-sm);display:flex;flex-direction:column}.ws-menu-item{display:flex;align-items:center;gap:9px;padding:7px 9px;border:0;background:transparent;color:var(--km-fg);font:inherit;font-size:12.5px;text-align:left;border-radius:8px;cursor:pointer}.ws-menu-item:hover{background:var(--km-hover)}.ws-menu-item svg{width:15px;height:15px;color:var(--km-muted)}.ws-menu-danger{color:var(--p-danger-color)}.ws-menu-danger svg{color:currentColor}.ws-menu-div{height:1px;background:var(--km-border);margin:4px 0}.ws-swatches{display:flex;flex-wrap:wrap;gap:6px}.ws-swatch{width:24px;height:24px;border-radius:50%;border:2px solid var(--km-border);cursor:pointer;display:grid;place-items:center;color:var(--km-muted)}.ws-swatch.on{border-color:var(--km-fg);box-shadow:0 0 0 2px var(--km-bg),0 0 0 4px var(--km-primary)}.ws-swatch svg{width:13px;height:13px}.ws-meta-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px 14px;padding:10px 0;border-top:1px solid var(--km-border);margin-top:4px}.ws-meta-grid>div{display:flex;flex-direction:column;gap:2px;min-width:0}.ws-meta-grid span{font-size:10px;text-transform:uppercase;letter-spacing:.04em;color:var(--km-muted)}.ws-meta-grid code{font-size:11.5px;font-family:monospace;color:var(--km-fg);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.ws{position:relative}.ws-manage{position:absolute;inset:0;z-index:40;display:flex;flex-direction:column;background:var(--km-bg)}.ws-manage-head{display:flex;align-items:center;gap:10px;height:48px;padding:0 14px;border-bottom:1px solid var(--km-border);flex-shrink:0}.ws-manage-title{font-size:15px;font-weight:800;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.ws-manage-body{flex:1;min-height:0;width:100%}.ws-iconfield,.wc-iconfield{display:inline-block}.ws-filter{width:min(240px,30vw)}.ws-crumb--drop{background:color-mix(in srgb,var(--km-primary) 18%,transparent);outline:1px dashed var(--km-primary);outline-offset:-1px;border-radius:6px}.ws-tile{position:relative}.ws-tile-menu{position:absolute;top:6px;right:6px;opacity:0}.ws-tile:hover .ws-tile-menu,.ws-tile:focus-within .ws-tile-menu{opacity:1}.ws-move-crumbs{display:flex;align-items:center;gap:2px;flex-wrap:wrap;padding:4px 0 8px}.ws-move-list{max-height:300px;overflow-y:auto;display:flex;flex-direction:column;gap:2px;margin-bottom:8px}.ws-move-folder{display:flex;align-items:center;gap:8px;padding:7px 10px;border:0;background:transparent;color:var(--km-fg);border-radius:8px;cursor:pointer;text-align:left;font:inherit}.ws-move-folder:hover{background:var(--km-hover)}.ws-move-folder svg{width:16px;height:16px;flex:none}.ws-move-into{margin-left:auto;color:var(--km-muted)}.ws-move-none{color:var(--km-muted);font-size:12.5px;padding:10px;margin:0}button:focus-visible,input:focus-visible,select:focus-visible,textarea:focus-visible,[tabindex]:focus-visible{outline:var(--p-focus-ring-width) var(--p-focus-ring-style) var(--p-focus-ring-color);outline-offset:var(--p-focus-ring-offset);box-shadow:var(--p-focus-ring-shadow)}input[type=checkbox],input[type=range]{accent-color:var(--p-primary-color)}@container workspace (max-width: 760px){.ws-body{position:relative}.ws-preview{position:absolute;inset:0;width:100%;max-width:100%;background:var(--km-bg);z-index:10}.ws-divider{display:none}}.ws-preview-head>svg,.ws-preview-head>button{flex-shrink:0}.ws-divider{touch-action:none}';
export {
  Xr as W,
  oe as _,
  Qr as a,
  Zr as b,
  re as c,
  te as d,
  ie as e,
  ee as f,
  ae as s,
  qr as u
};
//# sourceMappingURL=styles-DH7MJabM.js.map
