import { hasInjectionContext as no, inject as Ln, effectScope as fs, ref as V, markRaw as qo, toRaw as fn, watch as _e, unref as _, isRef as Xo, isReadonly as hs, onMounted as _n, onUnmounted as gs, createApp as ms, defineComponent as Ne, computed as L, openBlock as x, createElementBlock as j, createElementVNode as u, toDisplayString as y, createCommentVNode as q, Fragment as K, renderList as re, normalizeClass as oe, createTextVNode as J, createVNode as G, nextTick as Tt, normalizeStyle as Ee, shallowRef as Ut, onBeforeUnmount as wn, withModifiers as Xe, createBlock as rt, withKeys as Jo, renderSlot as vs, withCtx as bs, triggerRef as En, withDirectives as ys, vModelText as _s } from "vue";
import { addCollection as ws, Icon as Z } from "@iconify/vue";
import { config as ro, addIcons as xs, on as mr, applyThemeMode as Sn, host as js, hostCss as ks, loadCss as Es, api as Le, define as Ss } from "@wippy-fe/proxy";
var vr = "data-wippy-visible";
function oo(e) {
  const t = e.getAttribute(vr);
  return t === "true" ? !0 : t === "false" ? !1 : null;
}
var Is = Object.defineProperty, Ts = (e, t, n) => t in e ? Is(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n, ye = (e, t, n) => Ts(e, typeof t != "symbol" ? t + "" : t, n), $s = [
  "themeConfigUrl",
  "primeVueCssUrl",
  "markdownCssUrl",
  "iframeCssUrl"
], Cs = [
  ":where([data-wippy-theme-root]).w-theme-light",
  ":where([data-wippy-theme-root]).w-theme-dark"
].join(`,
`);
function io(e) {
  const t = e.startsWith("--") ? e : `--${e}`;
  return /^--[-\w\u0080-\uFFFF]+$/.test(t) ? t : null;
}
function As(...e) {
  const t = /* @__PURE__ */ new Set();
  for (const n of e)
    if (n)
      for (const [r, o] of Object.entries(n)) {
        if ((r === "@light" || r === "@dark") && o && typeof o == "object") {
          for (const [a, s] of Object.entries(o)) {
            const c = typeof s == "string" ? io(a) : null;
            c && t.add(c);
          }
          continue;
        }
        const i = typeof o == "string" ? io(r) : null;
        i && t.add(i);
      }
  return [...t].sort();
}
function Os(e) {
  if (e.length === 0)
    return "";
  const t = e.map((n) => `  ${n}: inherit;`).join(`
`);
  return `${Cs} {
${t}
}`;
}
function Ns(e, t) {
  const n = Os(t);
  n && Zo(e, n, "@wippy-fe/css-variables-bridge");
}
function Ms(e, t) {
  const r = (t ?? $s).map(async (o) => {
    const i = ks[o];
    if (!i)
      return console.warn(`[wippy-fe/webcomponent-core] hostCss key "${o}" is undefined — skipping. Remove it from hostCssKeys if the CSS was removed.`), null;
    try {
      return await Es(i);
    } catch (a) {
      return console.warn(`[wippy-fe/webcomponent-core] Failed to load hostCss "${o}" (${i}):`, a), null;
    }
  });
  return Promise.all(r).then((o) => {
    for (const i of o) {
      if (!i)
        continue;
      const a = document.createElement("style");
      a.textContent = i, a.setAttribute("role", "@wippy-fe/host-css"), e.appendChild(a);
    }
  });
}
function Rs(e, t) {
  const n = document.createElement("style");
  n.textContent = t, e.appendChild(n);
}
function Zo(e, t, n) {
  if (typeof CSSStyleSheet < "u" && "replaceSync" in CSSStyleSheet.prototype) {
    const o = new CSSStyleSheet();
    o.replaceSync(t), e.adoptedStyleSheets = [...e.adoptedStyleSheets, o];
    return;
  }
  const r = document.createElement("style");
  r.setAttribute("role", n), r.textContent = t, e.appendChild(r);
}
function Ps(e, t) {
  Zo(e, t, "@wippy-fe/custom-css");
}
function Qo(e) {
  return e.__wippyHost ?? null;
}
function Ls(e) {
  return e.replace(/-([a-z])/g, (t, n) => n.toUpperCase());
}
function Ds(e, t, n) {
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
function ir(e, t) {
  const n = {}, r = [];
  for (const [o, i] of Object.entries(t.properties)) {
    const a = e.getAttribute(o), s = Ls(o);
    if (a === null) {
      i.default !== void 0 && (n[s] = i.default);
      continue;
    }
    const c = Ds(o, a, i);
    c.error ? r.push(c.error) : n[s] = c.value;
  }
  return { props: n, errors: r };
}
var zs = class {
  constructor(e, t) {
    ye(this, "_props"), ye(this, "_errors"), ye(this, "_content"), ye(this, "_hostVisibility"), ye(this, "_propsListeners", /* @__PURE__ */ new Set()), ye(this, "_contentListeners", /* @__PURE__ */ new Set()), ye(this, "_hostVisibilityListeners", /* @__PURE__ */ new Set()), ye(this, "_disposed", !1), ye(this, "_emitToDom"), ye(this, "props"), ye(this, "events"), ye(this, "content"), ye(this, "hostVisibility"), this._props = e.props, this._errors = e.errors, this._content = e.content, this._hostVisibility = e.hostVisibility, this._emitToDom = t;
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
}, Vs = class extends HTMLElement {
  constructor() {
    super(), ye(this, "_internals"), ye(this, "_contentObserver", null), ye(this, "_initialized", !1), ye(this, "_container", null), ye(this, "_reactive", null), ye(this, "_lastProps", null), ye(this, "_lastErrors", []), ye(this, "_lastContent", null), ye(this, "_themeUnsub", null), ye(this, "_hostVisible", null), this._internals = this.attachInternals(), this._hostVisible = oo(this);
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
    return [.../* @__PURE__ */ new Set([...t, ...n, vr])];
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
    return Qo(this);
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
        const i = ir(this, e.propsSchema);
        e.validateProps && i.errors.push(...e.validateProps(i.props)), n = i.props, r = i.errors, this._lastProps = n, this._lastErrors = r;
      }
      const o = t ? this._lastContent ?? this._extractContent(e.contentTemplate) : null;
      t && this._lastContent === null && (this._lastContent = o), this._reactive = new zs(
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
        this.onInit(n), e.inlineCss && Rs(n, e.inlineCss);
        try {
          const l = ro?.theming, d = As(
            l?.global?.cssVariables,
            l?.children?.cssVariables
          );
          Ns(n, d);
        } catch {
        }
        if (e.customCss !== !1)
          try {
            const l = ro?.theming, d = [l?.global?.customCSS, l?.children?.customCSS].filter(Boolean).join(`
`);
            d && Ps(n, d);
          } catch {
          }
        (e.hostCssKeys === void 0 || e.hostCssKeys.length > 0) && Ms(n, e.hostCssKeys), r = document.createElement("div"), r.setAttribute("data-wippy-theme-root", "");
        const c = e.containerClasses ?? [];
        c.length > 0 && r.classList.add(...c), n.appendChild(r), this._container = r, xs(ws);
      }
      this._applyTheme(), this._themeUnsub || (this._themeUnsub = mr("@theme", (c) => this._applyTheme(c)));
      const { props: o, errors: i } = ir(this, e.propsSchema);
      e.validateProps && i.push(...e.validateProps(o));
      const a = o;
      this._lastProps = a, this._lastErrors = i;
      let s = null;
      e.contentTemplate && (s = this._extractContent(e.contentTemplate), this._lastContent = s, this._contentObserver = new MutationObserver(() => {
        const c = this._extractContent(e.contentTemplate);
        this._lastContent = c, this._reactive?.notifyContent(c), this.onContentChanged(c);
      }), this._contentObserver.observe(this, {
        childList: !0,
        characterData: !0,
        subtree: !0
      })), this.onMount(n, r, a, i, s, t), this._internals.states.delete("loading"), this._internals.states.add("ready"), t || (this._initialized = !0), this.onReady(), this.emitEvent("load");
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
  _applyTheme(e = js.getThemeMode?.()) {
    Sn(e, this), this._container && Sn(e, this._container);
  }
  disconnectedCallback() {
    this._themeUnsub && (this._themeUnsub(), this._themeUnsub = null), Sn("auto", this), this._container && Sn("auto", this._container), this._contentObserver && (this._contentObserver.disconnect(), this._contentObserver = null), this.onUnmount(), this.emitEvent("unload"), this._internals.states.clear(), this._reactive?.dispose(), this._reactive = null, this._lastProps = null, this._lastErrors = [], this._lastContent = null, delete this.__wippyHost, delete this.__wippyHostBus;
  }
  attributeChangedCallback(e, t, n) {
    if (t === n)
      return;
    if (e === vr) {
      const s = this._hostVisible, c = oo(this);
      if (c === s)
        return;
      this._hostVisible = c, this.isConnected && this._initialized && (this._reactive?.notifyHostVisibility(c, s), this.onHostVisibilityChanged(c, s));
      return;
    }
    const r = this.constructor.wippyConfig, { props: o, errors: i } = ir(this, r.propsSchema);
    r.validateProps && i.push(...r.validateProps(o));
    const a = o;
    this._lastProps = a, this._lastErrors = i, this._reactive?.notifyProps(a, i), this.onPropsChanged(a, i);
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
function Us(e) {
  return e.__wippyHostBus ?? null;
}
function Fs(e) {
  return e.dataset.wippyPanelId ?? null;
}
function Bs(e) {
  const t = `[${e.name}] ${e.message}`, n = [];
  return e.fix && n.push(`fix: ${e.fix}`), e.sources?.length && n.push(`sources: ${e.sources.join(", ")}`), e.docs && n.push(`see: ${e.docs}`), n.length === 0 ? t : [t, ...n.map((r, o) => `${o < n.length - 1 ? "├▶" : "╰▶"} ${r}`)].join(`
`);
}
function sr(e, ...t) {
  return typeof e == "function" ? e(...t) : e;
}
// @__NO_SIDE_EFFECTS__
function Ws({ method: e = "warn", formatter: t = Bs } = {}) {
  return (n, { method: r = e } = {}) => {
    console[r](t(n));
  };
}
const Hs = Error.captureStackTrace;
var Gs = class ei extends Error {
  name;
  /**
  * The diagnostic code, e.g. `MATH_E001`.
  * Also appears as the `name` property.
  */
  code;
  /**
  * URL to extended documentation for this diagnostic code.
  * Auto-generated from {@link DefineDiagnosticsOptions.docsBase}.
  */
  docs;
  /**
  * Optional actionable instructions on how to resolve the problem.
  */
  fix;
  /**
  * Locations in user code that contributed to this diagnostic, in
  * `file:line:column` format. Relevant when the stack trace doesn't reflect
  * the user's source (e.g. compilers, bundlers), otherwise redundant with the
  * stack and should be omitted.
  */
  sources;
  /**
  * Structured information associated with this diagnostic code.
  */
  data;
  /**
  * Alias for {@link Error.message}: the reason this diagnostic was raised.
  */
  get why() {
    return this.message;
  }
  /**
  * @param init        structured initializer; `why` is required
  * @param captureFrom V8 stack-cutoff frame. Defaults to {@link Diagnostic}
  * so the top of the trace is the `new Diagnostic(...)` call site.
  * `defineDiagnostics` passes its action method to strip its own frames too.
  * Ignored on engines without `Error.captureStackTrace`.
  */
  constructor(t, n = ei) {
    super(t.why, { cause: t.cause }), this.code = this.name = t.code, this.fix = t.fix, this.docs = t.docs, this.sources = t.sources, this.data = t.data, Hs?.(this, n);
  }
  /**
  * Converts the diagnostic into a serializable structured object.
  */
  toJSON() {
    return {
      name: this.name,
      why: this.why,
      fix: this.fix,
      docs: this.docs,
      sources: this.sources,
      cause: this.cause,
      data: this.data,
      stack: this.stack
    };
  }
};
function Ys(e, t) {
  return typeof e == "string" ? `${e}/${t.toLowerCase()}` : e?.(t);
}
// @__NO_SIDE_EFFECTS__
function Ks(e) {
  const t = e.reporters ?? [], n = {}, { docsBase: r } = e;
  for (const o of Object.keys(e.codes)) {
    const i = e.codes[o], a = i.docs === !1 ? void 0 : i.docs || Ys(r, o), s = (c = {}, l = {}) => {
      const d = new Gs({
        code: o,
        why: sr(i.why, c),
        fix: sr(i.fix, c),
        docs: a,
        cause: c.cause,
        sources: c.sources,
        data: sr(i.data, c)
      }, s);
      for (const f of t) f(d, l);
      return d;
    };
    n[o] = s;
  }
  return n;
}
var qs = Object.create, ti = Object.defineProperty, Xs = Object.getOwnPropertyDescriptor, Js = Object.getOwnPropertyNames, Zs = Object.getPrototypeOf, Qs = Object.prototype.hasOwnProperty, ea = (e, t) => () => (t || e((t = { exports: {} }).exports, t), t.exports), ta = (e, t, n, r) => {
  if (t && typeof t == "object" || typeof t == "function") for (var o = Js(t), i = 0, a = o.length, s; i < a; i++)
    s = o[i], !Qs.call(e, s) && s !== n && ti(e, s, {
      get: ((c) => t[c]).bind(null, s),
      enumerable: !(r = Xs(t, s)) || r.enumerable
    });
  return e;
}, na = (e, t, n) => (n = e != null ? qs(Zs(e)) : {}, ta(ti(n, "default", {
  value: e,
  enumerable: !0
}), e));
const ni = typeof navigator < "u", U = typeof window < "u" ? window : typeof globalThis < "u" ? globalThis : typeof global < "u" ? global : {};
typeof U.chrome < "u" && U.chrome.devtools;
ni && (U.self, U.top);
typeof navigator < "u" && navigator.userAgent?.toLowerCase().includes("electron");
var ra = /* @__PURE__ */ na((/* @__PURE__ */ ea(((e, t) => {
  t.exports = r;
  function n(i) {
    return i instanceof Buffer ? Buffer.from(i) : new i.constructor(i.buffer.slice(), i.byteOffset, i.length);
  }
  function r(i) {
    if (i = i || {}, i.circles) return o(i);
    const a = /* @__PURE__ */ new Map();
    if (a.set(Date, (f) => new Date(f)), a.set(Map, (f, m) => new Map(c(Array.from(f), m))), a.set(Set, (f, m) => new Set(c(Array.from(f), m))), i.constructorHandlers) for (const f of i.constructorHandlers) a.set(f[0], f[1]);
    let s = null;
    return i.proto ? d : l;
    function c(f, m) {
      const p = Object.keys(f), b = new Array(p.length);
      for (let w = 0; w < p.length; w++) {
        const v = p[w], h = f[v];
        typeof h != "object" || h === null ? b[v] = h : h.constructor !== Object && (s = a.get(h.constructor)) ? b[v] = s(h, m) : ArrayBuffer.isView(h) ? b[v] = n(h) : b[v] = m(h);
      }
      return b;
    }
    function l(f) {
      if (typeof f != "object" || f === null) return f;
      if (Array.isArray(f)) return c(f, l);
      if (f.constructor !== Object && (s = a.get(f.constructor))) return s(f, l);
      const m = {};
      for (const p in f) {
        if (Object.hasOwnProperty.call(f, p) === !1) continue;
        const b = f[p];
        typeof b != "object" || b === null ? m[p] = b : b.constructor !== Object && (s = a.get(b.constructor)) ? m[p] = s(b, l) : ArrayBuffer.isView(b) ? m[p] = n(b) : m[p] = l(b);
      }
      return m;
    }
    function d(f) {
      if (typeof f != "object" || f === null) return f;
      if (Array.isArray(f)) return c(f, d);
      if (f.constructor !== Object && (s = a.get(f.constructor))) return s(f, d);
      const m = {};
      for (const p in f) {
        const b = f[p];
        typeof b != "object" || b === null ? m[p] = b : b.constructor !== Object && (s = a.get(b.constructor)) ? m[p] = s(b, d) : ArrayBuffer.isView(b) ? m[p] = n(b) : m[p] = d(b);
      }
      return m;
    }
  }
  function o(i) {
    const a = [], s = [], c = /* @__PURE__ */ new Map();
    if (c.set(Date, (p) => new Date(p)), c.set(Map, (p, b) => new Map(d(Array.from(p), b))), c.set(Set, (p, b) => new Set(d(Array.from(p), b))), i.constructorHandlers) for (const p of i.constructorHandlers) c.set(p[0], p[1]);
    let l = null;
    return i.proto ? m : f;
    function d(p, b) {
      const w = Object.keys(p), v = new Array(w.length);
      for (let h = 0; h < w.length; h++) {
        const g = w[h], E = p[g];
        if (typeof E != "object" || E === null) v[g] = E;
        else if (E.constructor !== Object && (l = c.get(E.constructor))) v[g] = l(E, b);
        else if (ArrayBuffer.isView(E)) v[g] = n(E);
        else {
          const T = a.indexOf(E);
          T !== -1 ? v[g] = s[T] : v[g] = b(E);
        }
      }
      return v;
    }
    function f(p) {
      if (typeof p != "object" || p === null) return p;
      if (Array.isArray(p)) return d(p, f);
      if (p.constructor !== Object && (l = c.get(p.constructor))) return l(p, f);
      const b = {};
      a.push(p), s.push(b);
      for (const w in p) {
        if (Object.hasOwnProperty.call(p, w) === !1) continue;
        const v = p[w];
        if (typeof v != "object" || v === null) b[w] = v;
        else if (v.constructor !== Object && (l = c.get(v.constructor))) b[w] = l(v, f);
        else if (ArrayBuffer.isView(v)) b[w] = n(v);
        else {
          const h = a.indexOf(v);
          h !== -1 ? b[w] = s[h] : b[w] = f(v);
        }
      }
      return a.pop(), s.pop(), b;
    }
    function m(p) {
      if (typeof p != "object" || p === null) return p;
      if (Array.isArray(p)) return d(p, m);
      if (p.constructor !== Object && (l = c.get(p.constructor))) return l(p, m);
      const b = {};
      a.push(p), s.push(b);
      for (const w in p) {
        const v = p[w];
        if (typeof v != "object" || v === null) b[w] = v;
        else if (v.constructor !== Object && (l = c.get(v.constructor))) b[w] = l(v, m);
        else if (ArrayBuffer.isView(v)) b[w] = n(v);
        else {
          const h = a.indexOf(v);
          h !== -1 ? b[w] = s[h] : b[w] = m(v);
        }
      }
      return a.pop(), s.pop(), b;
    }
  }
})))());
const oa = /(?:^|[-_/])(\w)/g;
function ia(e, t) {
  return t ? t.toUpperCase() : "";
}
function sa(e) {
  return e && `${e}`.replace(oa, ia);
}
function aa(e, t) {
  let n = e.replace(/^[a-z]:/i, "").replace(/\\/g, "/");
  n.endsWith(`index${t}`) && (n = n.replace(`/index${t}`, t));
  const r = n.lastIndexOf("/"), o = n.substring(r + 1);
  {
    const i = o.lastIndexOf(t);
    return o.substring(0, i);
  }
}
const so = (0, ra.default)({ circles: !0 }), la = { trailing: !0 };
function Ft(e, t = 25, n = {}) {
  if (n = {
    ...la,
    ...n
  }, !Number.isFinite(t)) throw new TypeError("Expected `wait` to be a finite number");
  let r, o, i = [], a, s;
  const c = (f, m) => (a = ca(e, f, m), a.finally(() => {
    if (a = null, n.trailing && s && !o) {
      const p = c(f, s);
      return s = null, p;
    }
  }), a), l = function(...f) {
    return n.trailing && (s = f), a || new Promise((m) => {
      const p = !o && n.leading;
      clearTimeout(o), o = setTimeout(() => {
        o = null;
        const b = n.leading ? r : c(this, f);
        s = null;
        for (const w of i) w(b);
        i = [];
      }, t), p ? (r = c(this, f), m(r)) : i.push(m);
    });
  }, d = (f) => {
    f && (clearTimeout(f), o = null);
  };
  return l.isPending = () => !!o, l.cancel = () => {
    d(o), i = [], s = null;
  }, l.flush = () => {
    if (d(o), !s || a) return;
    const f = s;
    return s = null, c(this, f);
  }, l;
}
async function ca(e, t, n) {
  return await e.apply(t, n);
}
function br(e, t = {}, n) {
  for (const r in e) {
    const o = e[r], i = n ? `${n}:${r}` : r;
    typeof o == "object" && o !== null ? br(o, t, i) : typeof o == "function" && (t[i] = o);
  }
  return t;
}
const ua = { run: (e) => e() }, da = () => ua, ri = typeof console.createTask < "u" ? console.createTask : da;
function pa(e, t) {
  const n = t.shift(), r = ri(n);
  return e.reduce(
    (o, i) => o.then(() => r.run(() => i(...t))),
    Promise.resolve()
  );
}
function fa(e, t) {
  const n = t.shift(), r = ri(n);
  return Promise.all(e.map((o) => r.run(() => o(...t))));
}
function ar(e, t) {
  for (const n of [...e])
    n(t);
}
class ha {
  constructor() {
    this._hooks = {}, this._before = void 0, this._after = void 0, this._deprecatedMessages = void 0, this._deprecatedHooks = {}, this.hook = this.hook.bind(this), this.callHook = this.callHook.bind(this), this.callHookWith = this.callHookWith.bind(this);
  }
  hook(t, n, r = {}) {
    if (!t || typeof n != "function")
      return () => {
      };
    const o = t;
    let i;
    for (; this._deprecatedHooks[t]; )
      i = this._deprecatedHooks[t], t = i.to;
    if (i && !r.allowDeprecated) {
      let a = i.message;
      a || (a = `${o} hook has been deprecated` + (i.to ? `, please use ${i.to}` : "")), this._deprecatedMessages || (this._deprecatedMessages = /* @__PURE__ */ new Set()), this._deprecatedMessages.has(a) || (console.warn(a), this._deprecatedMessages.add(a));
    }
    if (!n.name)
      try {
        Object.defineProperty(n, "name", {
          get: () => "_" + t.replace(/\W+/g, "_") + "_hook_cb",
          configurable: !0
        });
      } catch {
      }
    return this._hooks[t] = this._hooks[t] || [], this._hooks[t].push(n), () => {
      n && (this.removeHook(t, n), n = void 0);
    };
  }
  hookOnce(t, n) {
    let r, o = (...i) => (typeof r == "function" && r(), r = void 0, o = void 0, n(...i));
    return r = this.hook(t, o), r;
  }
  removeHook(t, n) {
    if (this._hooks[t]) {
      const r = this._hooks[t].indexOf(n);
      r !== -1 && this._hooks[t].splice(r, 1), this._hooks[t].length === 0 && delete this._hooks[t];
    }
  }
  deprecateHook(t, n) {
    this._deprecatedHooks[t] = typeof n == "string" ? { to: n } : n;
    const r = this._hooks[t] || [];
    delete this._hooks[t];
    for (const o of r)
      this.hook(t, o);
  }
  deprecateHooks(t) {
    Object.assign(this._deprecatedHooks, t);
    for (const n in t)
      this.deprecateHook(n, t[n]);
  }
  addHooks(t) {
    const n = br(t), r = Object.keys(n).map(
      (o) => this.hook(o, n[o])
    );
    return () => {
      for (const o of r.splice(0, r.length))
        o();
    };
  }
  removeHooks(t) {
    const n = br(t);
    for (const r in n)
      this.removeHook(r, n[r]);
  }
  removeAllHooks() {
    for (const t in this._hooks)
      delete this._hooks[t];
  }
  callHook(t, ...n) {
    return n.unshift(t), this.callHookWith(pa, t, ...n);
  }
  callHookParallel(t, ...n) {
    return n.unshift(t), this.callHookWith(fa, t, ...n);
  }
  callHookWith(t, n, ...r) {
    const o = this._before || this._after ? { name: n, args: r, context: {} } : void 0;
    this._before && ar(this._before, o);
    const i = t(
      n in this._hooks ? [...this._hooks[n]] : [],
      r
    );
    return i instanceof Promise ? i.finally(() => {
      this._after && o && ar(this._after, o);
    }) : (this._after && o && ar(this._after, o), i);
  }
  beforeEach(t) {
    return this._before = this._before || [], this._before.push(t), () => {
      if (this._before !== void 0) {
        const n = this._before.indexOf(t);
        n !== -1 && this._before.splice(n, 1);
      }
    };
  }
  afterEach(t) {
    return this._after = this._after || [], this._after.push(t), () => {
      if (this._after !== void 0) {
        const n = this._after.indexOf(t);
        n !== -1 && this._after.splice(n, 1);
      }
    };
  }
}
function oi() {
  return new ha();
}
var ga = Object.create, ii = Object.defineProperty, ma = Object.getOwnPropertyDescriptor, va = Object.getOwnPropertyNames, ba = Object.getPrototypeOf, ya = Object.prototype.hasOwnProperty, si = (e, t) => () => (t || e((t = { exports: {} }).exports, t), t.exports), _a = (e, t, n, r) => {
  if (t && typeof t == "object" || typeof t == "function") for (var o = va(t), i = 0, a = o.length, s; i < a; i++)
    s = o[i], !ya.call(e, s) && s !== n && ii(e, s, {
      get: ((c) => t[c]).bind(null, s),
      enumerable: !(r = ma(t, s)) || r.enumerable
    });
  return e;
}, wa = (e, t, n) => (n = e != null ? ga(ba(e)) : {}, _a(ii(n, "default", {
  value: e,
  enumerable: !0
}), e));
function xa(e) {
  if (typeof e == "function") return e.displayName || e.name || e.__VUE_DEVTOOLS_COMPONENT_GUSSED_NAME__ || "";
  const t = e.name || e._componentTag || e.__VUE_DEVTOOLS_COMPONENT_GUSSED_NAME__ || e.__name;
  return t === "index" && e.__file?.endsWith("index.vue") ? "" : t;
}
function ja(e) {
  const t = e.__file;
  if (t) return sa(aa(t, ".vue"));
}
function ao(e, t) {
  return e.type.__VUE_DEVTOOLS_COMPONENT_GUSSED_NAME__ = t, t;
}
function Ur(e) {
  if (e.__VUE_DEVTOOLS_NEXT_APP_RECORD__) return e.__VUE_DEVTOOLS_NEXT_APP_RECORD__;
  if (e.root) return e.appContext.app.__VUE_DEVTOOLS_NEXT_APP_RECORD__;
}
function ai(e) {
  const t = e.subTree?.type, n = Ur(e);
  return n ? n?.types?.Fragment === t : !1;
}
function Yn(e) {
  const t = xa(e?.type || {});
  if (t) return t;
  if (e?.root === e) return "Root";
  for (const r in e.parent?.type?.components) if (e.parent.type.components[r] === e?.type) return ao(e, r);
  for (const r in e.appContext?.components) if (e.appContext.components[r] === e?.type) return ao(e, r);
  const n = ja(e?.type || {});
  return n || "Anonymous Component";
}
function ka(e) {
  return `${e?.appContext?.app?.__VUE_DEVTOOLS_NEXT_APP_RECORD_ID__ ?? 0}:${e === e?.root ? "root" : e.uid}`;
}
function yr(e, t) {
  return t = t || `${e.id}:root`, e.instanceMap.get(t) || e.instanceMap.get(":root");
}
function Ea() {
  const e = {
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    get width() {
      return e.right - e.left;
    },
    get height() {
      return e.bottom - e.top;
    }
  };
  return e;
}
let In;
function Sa(e) {
  return In || (In = document.createRange()), In.selectNode(e), In.getBoundingClientRect();
}
function Ia(e) {
  const t = Ea();
  if (!e.children) return t;
  for (let n = 0, r = e.children.length; n < r; n++) {
    const o = e.children[n];
    let i;
    if (o.component) i = $t(o.component);
    else if (o.el) {
      const a = o.el;
      a.nodeType === 1 || a.getBoundingClientRect ? i = a.getBoundingClientRect() : a.nodeType === 3 && a.data.trim() && (i = Sa(a));
    }
    i && Ta(t, i);
  }
  return t;
}
function Ta(e, t) {
  return (!e.top || t.top < e.top) && (e.top = t.top), (!e.bottom || t.bottom > e.bottom) && (e.bottom = t.bottom), (!e.left || t.left < e.left) && (e.left = t.left), (!e.right || t.right > e.right) && (e.right = t.right), e;
}
const lo = {
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  width: 0,
  height: 0
};
function $t(e) {
  const t = e.subTree.el;
  return typeof window > "u" ? lo : ai(e) ? Ia(e.subTree) : t?.nodeType === 1 ? t?.getBoundingClientRect() : e.subTree.component ? $t(e.subTree.component) : lo;
}
function Fr(e) {
  return ai(e) ? $a(e.subTree) : e.subTree ? [e.subTree.el] : [];
}
function $a(e) {
  if (!e.children) return [];
  const t = [];
  return e.children.forEach((n) => {
    n.component ? t.push(...Fr(n.component)) : n?.el && t.push(n.el);
  }), t;
}
const li = "__vue-devtools-component-inspector__", ci = "__vue-devtools-component-inspector__card__", ui = "__vue-devtools-component-inspector__name__", di = "__vue-devtools-component-inspector__indicator__", pi = {
  display: "block",
  zIndex: 2147483640,
  position: "fixed",
  backgroundColor: "#42b88325",
  border: "1px solid #42b88350",
  borderRadius: "5px",
  transition: "all 0.1s ease-in",
  pointerEvents: "none"
}, Ca = {
  fontFamily: "Arial, Helvetica, sans-serif",
  padding: "5px 8px",
  borderRadius: "4px",
  textAlign: "left",
  position: "absolute",
  left: 0,
  color: "#e9e9e9",
  fontSize: "14px",
  fontWeight: 600,
  lineHeight: "24px",
  backgroundColor: "#42b883",
  boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)"
}, Aa = {
  display: "inline-block",
  fontWeight: 400,
  fontStyle: "normal",
  fontSize: "12px",
  opacity: 0.7
};
function Yt() {
  return document.getElementById(li);
}
function Oa() {
  return document.getElementById(ci);
}
function Na() {
  return document.getElementById(di);
}
function Ma() {
  return document.getElementById(ui);
}
function Br(e) {
  return {
    left: `${Math.round(e.left * 100) / 100}px`,
    top: `${Math.round(e.top * 100) / 100}px`,
    width: `${Math.round(e.width * 100) / 100}px`,
    height: `${Math.round(e.height * 100) / 100}px`
  };
}
function Wr(e) {
  const t = document.createElement("div");
  t.id = e.elementId ?? li, Object.assign(t.style, {
    ...pi,
    ...Br(e.bounds),
    ...e.style
  });
  const n = document.createElement("span");
  n.id = ci, Object.assign(n.style, {
    ...Ca,
    top: e.bounds.top < 35 ? 0 : "-35px"
  });
  const r = document.createElement("span");
  r.id = ui, r.innerHTML = `&lt;${e.name}&gt;&nbsp;&nbsp;`;
  const o = document.createElement("i");
  return o.id = di, o.innerHTML = `${Math.round(e.bounds.width * 100) / 100} x ${Math.round(e.bounds.height * 100) / 100}`, Object.assign(o.style, Aa), n.appendChild(r), n.appendChild(o), t.appendChild(n), document.body.appendChild(t), t;
}
function Hr(e) {
  const t = Yt(), n = Oa(), r = Ma(), o = Na();
  t && (Object.assign(t.style, {
    ...pi,
    ...Br(e.bounds)
  }), Object.assign(n.style, { top: e.bounds.top < 35 ? 0 : "-35px" }), r.innerHTML = `&lt;${e.name}&gt;&nbsp;&nbsp;`, o.innerHTML = `${Math.round(e.bounds.width * 100) / 100} x ${Math.round(e.bounds.height * 100) / 100}`);
}
function Ra(e) {
  const t = $t(e);
  if (!t.width && !t.height) return;
  const n = Yn(e);
  Yt() ? Hr({
    bounds: t,
    name: n
  }) : Wr({
    bounds: t,
    name: n
  });
}
function fi() {
  const e = Yt();
  e && (e.style.display = "none");
}
let _r = null;
function wr(e) {
  const t = e.target;
  if (t) {
    const n = t.__vueParentComponent;
    if (n && (_r = n, n.vnode.el)) {
      const r = $t(n), o = Yn(n);
      Yt() ? Hr({
        bounds: r,
        name: o
      }) : Wr({
        bounds: r,
        name: o
      });
    }
  }
}
function Pa(e, t) {
  e.preventDefault(), e.stopPropagation(), _r && t(ka(_r));
}
let Dn = null;
function La() {
  fi(), window.removeEventListener("mouseover", wr), window.removeEventListener("click", Dn, !0), Dn = null;
}
function Da() {
  return window.addEventListener("mouseover", wr), new Promise((e) => {
    function t(n) {
      n.preventDefault(), n.stopPropagation(), Pa(n, (r) => {
        window.removeEventListener("click", t, !0), Dn = null, window.removeEventListener("mouseover", wr);
        const o = Yt();
        o && (o.style.display = "none"), e(JSON.stringify({ id: r }));
      });
    }
    Dn = t, window.addEventListener("click", t, !0);
  });
}
function za(e) {
  const t = yr(Ce.value, e.id);
  if (t) {
    const [n] = Fr(t);
    if (typeof n.scrollIntoView == "function") n.scrollIntoView({ behavior: "smooth" });
    else {
      const r = $t(t), o = document.createElement("div"), i = {
        ...Br(r),
        position: "absolute"
      };
      Object.assign(o.style, i), document.body.appendChild(o), o.scrollIntoView({ behavior: "smooth" }), setTimeout(() => {
        document.body.removeChild(o);
      }, 2e3);
    }
    setTimeout(() => {
      const r = $t(t);
      if (r.width || r.height) {
        const o = Yn(t), i = Yt();
        i ? Hr({
          ...e,
          name: o,
          bounds: r
        }) : Wr({
          ...e,
          name: o,
          bounds: r
        }), setTimeout(() => {
          i && (i.style.display = "none");
        }, 1500);
      }
    }, 1200);
  }
}
U.__VUE_DEVTOOLS_COMPONENT_INSPECTOR_ENABLED__ ??= !0;
function Va(e) {
  let t = 0;
  const n = setInterval(() => {
    U.__VUE_INSPECTOR__ && (clearInterval(n), t += 30, e()), t >= 5e3 && clearInterval(n);
  }, 30);
}
function Ua() {
  const e = U.__VUE_INSPECTOR__, t = e.openInEditor;
  e.openInEditor = async (...n) => {
    e.disable(), t(...n);
  };
}
function Fa() {
  return new Promise((e) => {
    function t() {
      Ua(), e(U.__VUE_INSPECTOR__);
    }
    U.__VUE_INSPECTOR__ ? t() : Va(() => {
      t();
    });
  });
}
let zn = /* @__PURE__ */ (function(e) {
  return e.SKIP = "__v_skip", e.IS_REACTIVE = "__v_isReactive", e.IS_READONLY = "__v_isReadonly", e.IS_SHALLOW = "__v_isShallow", e.RAW = "__v_raw", e;
})({});
function Ba(e) {
  return !!(e && e[zn.IS_READONLY]);
}
function hi(e) {
  return Ba(e) ? hi(e[zn.RAW]) : !!(e && e[zn.IS_REACTIVE]);
}
function lr(e) {
  return !!(e && e.__v_isRef === !0);
}
function an(e) {
  const t = e && e[zn.RAW];
  return t ? an(t) : e;
}
var Wa = class {
  constructor() {
    this.refEditor = new Ha();
  }
  set(e, t, n, r) {
    const o = Array.isArray(t) ? t : t.split(".");
    for (; o.length > 1; ) {
      const s = o.shift();
      e instanceof Map ? e = e.get(s) : e instanceof Set ? e = Array.from(e.values())[s] : e = e[s], this.refEditor.isRef(e) && (e = this.refEditor.get(e));
    }
    const i = o[0], a = this.refEditor.get(e)[i];
    r ? r(e, i, n) : this.refEditor.isRef(a) ? this.refEditor.set(a, n) : e[i] = n;
  }
  get(e, t) {
    const n = Array.isArray(t) ? t : t.split(".");
    for (let r = 0; r < n.length; r++)
      if (e instanceof Map ? e = e.get(n[r]) : e = e[n[r]], this.refEditor.isRef(e) && (e = this.refEditor.get(e)), !e) return;
    return e;
  }
  has(e, t, n = !1) {
    if (typeof e > "u") return !1;
    const r = Array.isArray(t) ? t.slice() : t.split("."), o = n ? 2 : 1;
    for (; e && r.length > o; ) {
      const i = r.shift();
      e = e[i], this.refEditor.isRef(e) && (e = this.refEditor.get(e));
    }
    return e != null && Object.prototype.hasOwnProperty.call(e, r[0]);
  }
  createDefaultSetCallback(e) {
    return (t, n, r) => {
      if ((e.remove || e.newKey) && (Array.isArray(t) ? t.splice(n, 1) : an(t) instanceof Map ? t.delete(n) : an(t) instanceof Set ? t.delete(Array.from(t.values())[n]) : Reflect.deleteProperty(t, n)), !e.remove) {
        const o = t[e.newKey || n];
        this.refEditor.isRef(o) ? this.refEditor.set(o, r) : an(t) instanceof Map ? t.set(e.newKey || n, r) : an(t) instanceof Set ? t.add(r) : t[e.newKey || n] = r;
      }
    };
  }
}, Ha = class {
  set(e, t) {
    if (lr(e)) e.value = t;
    else {
      if (e instanceof Set && Array.isArray(t)) {
        e.clear(), t.forEach((o) => e.add(o));
        return;
      }
      const n = Object.keys(t);
      if (e instanceof Map) {
        const o = new Set(e.keys());
        n.forEach((i) => {
          e.set(i, Reflect.get(t, i)), o.delete(i);
        }), o.forEach((i) => e.delete(i));
        return;
      }
      const r = new Set(Object.keys(e));
      n.forEach((o) => {
        Reflect.set(e, o, Reflect.get(t, o)), r.delete(o);
      }), r.forEach((o) => Reflect.deleteProperty(e, o));
    }
  }
  get(e) {
    return lr(e) ? e.value : e;
  }
  isRef(e) {
    return lr(e) || hi(e);
  }
};
const Ga = "__VUE_DEVTOOLS_KIT_TIMELINE_LAYERS_STATE__";
function Ya() {
  if (typeof window > "u" || !ni || typeof localStorage > "u" || localStorage === null) return {
    recordingState: !1,
    mouseEventEnabled: !1,
    keyboardEventEnabled: !1,
    componentEventEnabled: !1,
    performanceEventEnabled: !1,
    selected: ""
  };
  const e = typeof localStorage.getItem < "u" ? localStorage.getItem(Ga) : null;
  return e ? JSON.parse(e) : {
    recordingState: !1,
    mouseEventEnabled: !1,
    keyboardEventEnabled: !1,
    componentEventEnabled: !1,
    performanceEventEnabled: !1,
    selected: ""
  };
}
U.__VUE_DEVTOOLS_KIT_TIMELINE_LAYERS ??= [];
const Ka = new Proxy(U.__VUE_DEVTOOLS_KIT_TIMELINE_LAYERS, { get(e, t, n) {
  return Reflect.get(e, t, n);
} });
function qa(e, t) {
  je.timelineLayersState[t.id] = !1, Ka.push({
    ...e,
    descriptorId: t.id,
    appRecord: Ur(t.app)
  });
}
U.__VUE_DEVTOOLS_KIT_INSPECTOR__ ??= [];
const Gr = new Proxy(U.__VUE_DEVTOOLS_KIT_INSPECTOR__, { get(e, t, n) {
  return Reflect.get(e, t, n);
} }), gi = Ft(() => {
  Kt.hooks.callHook(It.SEND_INSPECTOR_TO_CLIENT, mi());
});
function Xa(e, t) {
  Gr.push({
    options: e,
    descriptor: t,
    treeFilterPlaceholder: e.treeFilterPlaceholder ?? "Search tree...",
    stateFilterPlaceholder: e.stateFilterPlaceholder ?? "Search state...",
    treeFilter: "",
    selectedNodeId: "",
    appRecord: Ur(t.app)
  }), gi();
}
function mi() {
  return Gr.filter((e) => e.descriptor.app === Ce.value.app).filter((e) => e.descriptor.id !== "components").map((e) => {
    const t = e.descriptor, n = e.options;
    return {
      id: n.id,
      label: n.label,
      logo: t.logo,
      icon: `custom-ic-baseline-${n?.icon?.replace(/_/g, "-")}`,
      packageName: t.packageName,
      homepage: t.homepage,
      pluginId: t.id
    };
  });
}
function Cn(e, t) {
  return Gr.find((n) => n.options.id === e && (t ? n.descriptor.app === t : !0));
}
let Ie = /* @__PURE__ */ (function(e) {
  return e.VISIT_COMPONENT_TREE = "visitComponentTree", e.INSPECT_COMPONENT = "inspectComponent", e.EDIT_COMPONENT_STATE = "editComponentState", e.GET_INSPECTOR_TREE = "getInspectorTree", e.GET_INSPECTOR_STATE = "getInspectorState", e.EDIT_INSPECTOR_STATE = "editInspectorState", e.INSPECT_TIMELINE_EVENT = "inspectTimelineEvent", e.TIMELINE_CLEARED = "timelineCleared", e.SET_PLUGIN_SETTINGS = "setPluginSettings", e;
})({}), ve = /* @__PURE__ */ (function(e) {
  return e.ADD_INSPECTOR = "addInspector", e.SEND_INSPECTOR_TREE = "sendInspectorTree", e.SEND_INSPECTOR_STATE = "sendInspectorState", e.CUSTOM_INSPECTOR_SELECT_NODE = "customInspectorSelectNode", e.TIMELINE_LAYER_ADDED = "timelineLayerAdded", e.TIMELINE_EVENT_ADDED = "timelineEventAdded", e.GET_COMPONENT_INSTANCES = "getComponentInstances", e.GET_COMPONENT_BOUNDS = "getComponentBounds", e.GET_COMPONENT_NAME = "getComponentName", e.COMPONENT_HIGHLIGHT = "componentHighlight", e.COMPONENT_UNHIGHLIGHT = "componentUnhighlight", e;
})({}), It = /* @__PURE__ */ (function(e) {
  return e.SEND_INSPECTOR_TREE_TO_CLIENT = "sendInspectorTreeToClient", e.SEND_INSPECTOR_STATE_TO_CLIENT = "sendInspectorStateToClient", e.SEND_TIMELINE_EVENT_TO_CLIENT = "sendTimelineEventToClient", e.SEND_INSPECTOR_TO_CLIENT = "sendInspectorToClient", e.SEND_ACTIVE_APP_UNMOUNTED_TO_CLIENT = "sendActiveAppUpdatedToClient", e.DEVTOOLS_STATE_UPDATED = "devtoolsStateUpdated", e.DEVTOOLS_CONNECTED_UPDATED = "devtoolsConnectedUpdated", e.ROUTER_INFO_UPDATED = "routerInfoUpdated", e;
})({});
function Ja() {
  const e = oi();
  e.hook(ve.ADD_INSPECTOR, ({ inspector: r, plugin: o }) => {
    Xa(r, o.descriptor);
  });
  const t = Ft(async ({ inspectorId: r, plugin: o }) => {
    if (!r || !o?.descriptor?.app || je.highPerfModeEnabled) return;
    const i = Cn(r, o.descriptor.app), a = {
      app: o.descriptor.app,
      inspectorId: r,
      filter: i?.treeFilter || "",
      rootNodes: []
    };
    await new Promise((s) => {
      e.callHookWith(async (c) => {
        await Promise.all(c.map((l) => l(a))), s();
      }, Ie.GET_INSPECTOR_TREE);
    }), e.callHookWith(async (s) => {
      await Promise.all(s.map((c) => c({
        inspectorId: r,
        rootNodes: a.rootNodes
      })));
    }, It.SEND_INSPECTOR_TREE_TO_CLIENT);
  }, 120);
  e.hook(ve.SEND_INSPECTOR_TREE, t);
  const n = Ft(async ({ inspectorId: r, plugin: o }) => {
    if (!r || !o?.descriptor?.app || je.highPerfModeEnabled) return;
    const i = Cn(r, o.descriptor.app), a = {
      app: o.descriptor.app,
      inspectorId: r,
      nodeId: i?.selectedNodeId || "",
      state: null
    }, s = { currentTab: `custom-inspector:${r}` };
    a.nodeId && await new Promise((c) => {
      e.callHookWith(async (l) => {
        await Promise.all(l.map((d) => d(a, s))), c();
      }, Ie.GET_INSPECTOR_STATE);
    }), e.callHookWith(async (c) => {
      await Promise.all(c.map((l) => l({
        inspectorId: r,
        nodeId: a.nodeId,
        state: a.state
      })));
    }, It.SEND_INSPECTOR_STATE_TO_CLIENT);
  }, 120);
  return e.hook(ve.SEND_INSPECTOR_STATE, n), e.hook(ve.CUSTOM_INSPECTOR_SELECT_NODE, ({ inspectorId: r, nodeId: o, plugin: i }) => {
    const a = Cn(r, i.descriptor.app);
    a && (a.selectedNodeId = o);
  }), e.hook(ve.TIMELINE_LAYER_ADDED, ({ options: r, plugin: o }) => {
    qa(r, o.descriptor);
  }), e.hook(ve.TIMELINE_EVENT_ADDED, ({ options: r, plugin: o }) => {
    je.highPerfModeEnabled || !je.timelineLayersState?.[o.descriptor.id] && ![
      "performance",
      "component-event",
      "keyboard",
      "mouse"
    ].includes(r.layerId) || e.callHookWith(async (i) => {
      await Promise.all(i.map((a) => a(r)));
    }, It.SEND_TIMELINE_EVENT_TO_CLIENT);
  }), e.hook(ve.GET_COMPONENT_INSTANCES, async ({ app: r }) => {
    const o = r.__VUE_DEVTOOLS_NEXT_APP_RECORD__;
    if (!o) return null;
    const i = o.id.toString();
    return [...o.instanceMap].filter(([a]) => a.split(":")[0] === i).map(([, a]) => a);
  }), e.hook(ve.GET_COMPONENT_BOUNDS, async ({ instance: r }) => $t(r)), e.hook(ve.GET_COMPONENT_NAME, ({ instance: r }) => Yn(r)), e.hook(ve.COMPONENT_HIGHLIGHT, ({ uid: r }) => {
    const o = Ce.value.instanceMap.get(r);
    o && Ra(o);
  }), e.hook(ve.COMPONENT_UNHIGHLIGHT, () => {
    fi();
  }), e;
}
U.__VUE_DEVTOOLS_KIT_APP_RECORDS__ ??= [];
U.__VUE_DEVTOOLS_KIT_ACTIVE_APP_RECORD__ ??= {};
U.__VUE_DEVTOOLS_KIT_ACTIVE_APP_RECORD_ID__ ??= "";
U.__VUE_DEVTOOLS_KIT_CUSTOM_TABS__ ??= [];
U.__VUE_DEVTOOLS_KIT_CUSTOM_COMMANDS__ ??= [];
const un = "__VUE_DEVTOOLS_KIT_GLOBAL_STATE__";
function Za() {
  return {
    connected: !1,
    clientConnected: !1,
    vitePluginDetected: !0,
    appRecords: [],
    activeAppRecordId: "",
    tabs: [],
    commands: [],
    highPerfModeEnabled: !0,
    devtoolsClientDetected: {},
    perfUniqueGroupId: 0,
    timelineLayersState: Ya()
  };
}
U[un] ??= Za();
const Qa = Ft((e) => {
  Kt.hooks.callHook(It.DEVTOOLS_STATE_UPDATED, { state: e });
});
Ft((e, t) => {
  Kt.hooks.callHook(It.DEVTOOLS_CONNECTED_UPDATED, {
    state: e,
    oldState: t
  });
});
const Kn = new Proxy(U.__VUE_DEVTOOLS_KIT_APP_RECORDS__, { get(e, t, n) {
  return t === "value" ? U.__VUE_DEVTOOLS_KIT_APP_RECORDS__ : U.__VUE_DEVTOOLS_KIT_APP_RECORDS__[t];
} }), Ce = new Proxy(U.__VUE_DEVTOOLS_KIT_ACTIVE_APP_RECORD__, { get(e, t, n) {
  return t === "value" ? U.__VUE_DEVTOOLS_KIT_ACTIVE_APP_RECORD__ : t === "id" ? U.__VUE_DEVTOOLS_KIT_ACTIVE_APP_RECORD_ID__ : U.__VUE_DEVTOOLS_KIT_ACTIVE_APP_RECORD__[t];
} });
function vi() {
  Qa({
    ...U[un],
    appRecords: Kn.value,
    activeAppRecordId: Ce.id,
    tabs: U.__VUE_DEVTOOLS_KIT_CUSTOM_TABS__,
    commands: U.__VUE_DEVTOOLS_KIT_CUSTOM_COMMANDS__
  });
}
function el(e) {
  U.__VUE_DEVTOOLS_KIT_ACTIVE_APP_RECORD__ = e, vi();
}
function tl(e) {
  U.__VUE_DEVTOOLS_KIT_ACTIVE_APP_RECORD_ID__ = e, vi();
}
const je = new Proxy(U[un], {
  get(e, t) {
    return t === "appRecords" ? Kn : t === "activeAppRecordId" ? Ce.id : t === "tabs" ? U.__VUE_DEVTOOLS_KIT_CUSTOM_TABS__ : t === "commands" ? U.__VUE_DEVTOOLS_KIT_CUSTOM_COMMANDS__ : U[un][t];
  },
  deleteProperty(e, t) {
    return delete e[t], !0;
  },
  set(e, t, n) {
    return e[t] = n, U[un][t] = n, !0;
  }
});
function nl(e = {}) {
  const { file: t, host: n, baseUrl: r = window.location.origin, line: o = 0, column: i = 0 } = e;
  if (t) {
    if (n === "chrome-extension") {
      const a = t.replace(/\\/g, "\\\\"), s = window.VUE_DEVTOOLS_CONFIG?.openInEditorHost ?? "/";
      fetch(`${s}__open-in-editor?file=${encodeURI(t)}`).then((c) => {
        if (!c.ok) {
          const l = `Opening component ${a} failed`;
          console.log(`%c${l}`, "color:red");
        }
      });
    } else if (je.vitePluginDetected) {
      const a = U.__VUE_DEVTOOLS_OPEN_IN_EDITOR_BASE_URL__ ?? r;
      U.__VUE_INSPECTOR__.openInEditor(a, t, o, i);
    }
  }
}
U.__VUE_DEVTOOLS_KIT_PLUGIN_BUFFER__ ??= [];
const Yr = new Proxy(U.__VUE_DEVTOOLS_KIT_PLUGIN_BUFFER__, { get(e, t, n) {
  return Reflect.get(e, t, n);
} });
function xr(e) {
  const t = {};
  return Object.keys(e).forEach((n) => {
    t[n] = e[n].defaultValue;
  }), t;
}
function Kr(e) {
  return `__VUE_DEVTOOLS_NEXT_PLUGIN_SETTINGS__${e}__`;
}
function rl(e) {
  return (Yr.find((t) => t[0].id === e && !!t[0]?.settings)?.[0] ?? null)?.settings ?? null;
}
function bi(e, t) {
  const n = Kr(e);
  if (n) {
    const r = localStorage.getItem(n);
    if (r) return JSON.parse(r);
  }
  return xr(e ? (Yr.find((r) => r[0].id === e)?.[0] ?? null)?.settings ?? {} : t);
}
function ol(e, t) {
  const n = Kr(e);
  localStorage.getItem(n) || localStorage.setItem(n, JSON.stringify(xr(t)));
}
function il(e, t, n) {
  const r = Kr(e), o = localStorage.getItem(r), i = JSON.parse(o || "{}"), a = {
    ...i,
    [t]: n
  };
  localStorage.setItem(r, JSON.stringify(a)), Kt.hooks.callHookWith((s) => {
    s.forEach((c) => c({
      pluginId: e,
      key: t,
      oldValue: i[t],
      newValue: n,
      settings: a
    }));
  }, Ie.SET_PLUGIN_SETTINGS);
}
let Fe = /* @__PURE__ */ (function(e) {
  return e.APP_INIT = "app:init", e.APP_UNMOUNT = "app:unmount", e.COMPONENT_UPDATED = "component:updated", e.COMPONENT_ADDED = "component:added", e.COMPONENT_REMOVED = "component:removed", e.COMPONENT_EMIT = "component:emit", e.PERFORMANCE_START = "perf:start", e.PERFORMANCE_END = "perf:end", e.ADD_ROUTE = "router:add-route", e.REMOVE_ROUTE = "router:remove-route", e.RENDER_TRACKED = "render:tracked", e.RENDER_TRIGGERED = "render:triggered", e.APP_CONNECTED = "app:connected", e.SETUP_DEVTOOLS_PLUGIN = "devtools-plugin:setup", e;
})({});
const Be = U.__VUE_DEVTOOLS_HOOK ??= oi(), sl = {
  vueAppInit(e) {
    Be.hook(Fe.APP_INIT, e);
  },
  vueAppUnmount(e) {
    Be.hook(Fe.APP_UNMOUNT, e);
  },
  vueAppConnected(e) {
    Be.hook(Fe.APP_CONNECTED, e);
  },
  componentAdded(e) {
    return Be.hook(Fe.COMPONENT_ADDED, e);
  },
  componentEmit(e) {
    return Be.hook(Fe.COMPONENT_EMIT, e);
  },
  componentUpdated(e) {
    return Be.hook(Fe.COMPONENT_UPDATED, e);
  },
  componentRemoved(e) {
    return Be.hook(Fe.COMPONENT_REMOVED, e);
  },
  setupDevtoolsPlugin(e) {
    Be.hook(Fe.SETUP_DEVTOOLS_PLUGIN, e);
  },
  perfStart(e) {
    return Be.hook(Fe.PERFORMANCE_START, e);
  },
  perfEnd(e) {
    return Be.hook(Fe.PERFORMANCE_END, e);
  }
}, yi = {
  on: sl,
  setupDevToolsPlugin(e, t) {
    return Be.callHook(Fe.SETUP_DEVTOOLS_PLUGIN, e, t);
  }
};
var al = class {
  constructor({ plugin: e, ctx: t }) {
    this.hooks = t.hooks, this.plugin = e;
  }
  get on() {
    return {
      visitComponentTree: (e) => {
        this.hooks.hook(Ie.VISIT_COMPONENT_TREE, e);
      },
      inspectComponent: (e) => {
        this.hooks.hook(Ie.INSPECT_COMPONENT, e);
      },
      editComponentState: (e) => {
        this.hooks.hook(Ie.EDIT_COMPONENT_STATE, e);
      },
      getInspectorTree: (e) => {
        this.hooks.hook(Ie.GET_INSPECTOR_TREE, e);
      },
      getInspectorState: (e) => {
        this.hooks.hook(Ie.GET_INSPECTOR_STATE, e);
      },
      editInspectorState: (e) => {
        this.hooks.hook(Ie.EDIT_INSPECTOR_STATE, e);
      },
      inspectTimelineEvent: (e) => {
        this.hooks.hook(Ie.INSPECT_TIMELINE_EVENT, e);
      },
      timelineCleared: (e) => {
        this.hooks.hook(Ie.TIMELINE_CLEARED, e);
      },
      setPluginSettings: (e) => {
        this.hooks.hook(Ie.SET_PLUGIN_SETTINGS, e);
      }
    };
  }
  notifyComponentUpdate(e) {
    if (je.highPerfModeEnabled) return;
    const t = mi().find((n) => n.packageName === this.plugin.descriptor.packageName);
    if (t?.id) {
      if (e) {
        const n = [
          e.appContext.app,
          e.uid,
          e.parent?.uid,
          e
        ];
        Be.callHook(Fe.COMPONENT_UPDATED, ...n);
      } else Be.callHook(Fe.COMPONENT_UPDATED);
      this.hooks.callHook(ve.SEND_INSPECTOR_STATE, {
        inspectorId: t.id,
        plugin: this.plugin
      });
    }
  }
  addInspector(e) {
    this.hooks.callHook(ve.ADD_INSPECTOR, {
      inspector: e,
      plugin: this.plugin
    }), this.plugin.descriptor.settings && ol(e.id, this.plugin.descriptor.settings);
  }
  sendInspectorTree(e) {
    je.highPerfModeEnabled || this.hooks.callHook(ve.SEND_INSPECTOR_TREE, {
      inspectorId: e,
      plugin: this.plugin
    });
  }
  sendInspectorState(e) {
    je.highPerfModeEnabled || this.hooks.callHook(ve.SEND_INSPECTOR_STATE, {
      inspectorId: e,
      plugin: this.plugin
    });
  }
  selectInspectorNode(e, t) {
    this.hooks.callHook(ve.CUSTOM_INSPECTOR_SELECT_NODE, {
      inspectorId: e,
      nodeId: t,
      plugin: this.plugin
    });
  }
  visitComponentTree(e) {
    return this.hooks.callHook(Ie.VISIT_COMPONENT_TREE, e);
  }
  now() {
    return je.highPerfModeEnabled ? 0 : Date.now();
  }
  addTimelineLayer(e) {
    this.hooks.callHook(ve.TIMELINE_LAYER_ADDED, {
      options: e,
      plugin: this.plugin
    });
  }
  addTimelineEvent(e) {
    je.highPerfModeEnabled || this.hooks.callHook(ve.TIMELINE_EVENT_ADDED, {
      options: e,
      plugin: this.plugin
    });
  }
  getSettings(e) {
    return bi(e ?? this.plugin.descriptor.id, this.plugin.descriptor.settings);
  }
  getComponentInstances(e) {
    return this.hooks.callHook(ve.GET_COMPONENT_INSTANCES, { app: e });
  }
  getComponentBounds(e) {
    return this.hooks.callHook(ve.GET_COMPONENT_BOUNDS, { instance: e });
  }
  getComponentName(e) {
    return this.hooks.callHook(ve.GET_COMPONENT_NAME, { instance: e });
  }
  highlightElement(e) {
    const t = e.__VUE_DEVTOOLS_NEXT_UID__;
    return this.hooks.callHook(ve.COMPONENT_HIGHLIGHT, { uid: t });
  }
  unhighlightElement() {
    return this.hooks.callHook(ve.COMPONENT_UNHIGHLIGHT);
  }
};
const ll = al, cl = "__vue_devtool_undefined__", ul = "__vue_devtool_infinity__", dl = "__vue_devtool_negative_infinity__", pl = "__vue_devtool_nan__", fl = {
  [cl]: "undefined",
  [pl]: "NaN",
  [ul]: "Infinity",
  [dl]: "-Infinity"
};
Object.entries(fl).reduce((e, [t, n]) => (e[n] = t, e), {});
U.__VUE_DEVTOOLS_KIT__REGISTERED_PLUGIN_APPS__ ??= /* @__PURE__ */ new Set();
function _i(e, t) {
  return yi.setupDevToolsPlugin(e, t);
}
function hl(e, t) {
  const [n, r] = e;
  if (n.app !== t) return;
  const o = new ll({
    plugin: {
      setupFn: r,
      descriptor: n
    },
    ctx: Kt
  });
  n.packageName === "vuex" && o.on.editInspectorState((i) => {
    o.sendInspectorState(i.inspectorId);
  }), r(o);
}
function wi(e, t) {
  U.__VUE_DEVTOOLS_KIT__REGISTERED_PLUGIN_APPS__.has(e) || je.highPerfModeEnabled && !t?.inspectingComponent || (U.__VUE_DEVTOOLS_KIT__REGISTERED_PLUGIN_APPS__.add(e), Yr.forEach((n) => {
    hl(n, e);
  }));
}
const Vn = "__VUE_DEVTOOLS_ROUTER__", hn = "__VUE_DEVTOOLS_ROUTER_INFO__";
U[hn] ??= {
  currentRoute: null,
  routes: []
};
U[Vn] ??= {};
new Proxy(U[hn], { get(e, t) {
  return U[hn][t];
} });
new Proxy(U[Vn], { get(e, t) {
  if (t === "value") return U[Vn];
} });
function gl(e) {
  const t = /* @__PURE__ */ new Map();
  return (e?.getRoutes() || []).filter((n) => !t.has(n.path) && t.set(n.path, 1));
}
function qr(e) {
  return e.map((t) => {
    let { path: n, name: r, children: o, meta: i } = t;
    return o?.length && (o = qr(o)), {
      path: n,
      name: r,
      children: o,
      meta: i
    };
  });
}
function ml(e) {
  if (e) {
    const { fullPath: t, hash: n, href: r, path: o, name: i, matched: a, params: s, query: c } = e;
    return {
      fullPath: t,
      hash: n,
      href: r,
      path: o,
      name: i,
      params: s,
      query: c,
      matched: qr(a)
    };
  }
  return e;
}
function vl(e, t) {
  function n() {
    const r = e.app?.config.globalProperties.$router, o = ml(r?.currentRoute.value), i = qr(gl(r)), a = console.warn;
    console.warn = () => {
    }, U[hn] = {
      currentRoute: o ? so(o) : {},
      routes: so(i)
    }, U[Vn] = r, console.warn = a;
  }
  n(), yi.on.componentUpdated(Ft(() => {
    t.value?.app === e.app && (n(), !je.highPerfModeEnabled && Kt.hooks.callHook(It.ROUTER_INFO_UPDATED, { state: U[hn] }));
  }, 200));
}
function bl(e) {
  return {
    async getInspectorTree(t) {
      const n = {
        ...t,
        app: Ce.value.app,
        rootNodes: []
      };
      return await new Promise((r) => {
        e.callHookWith(async (o) => {
          await Promise.all(o.map((i) => i(n))), r();
        }, Ie.GET_INSPECTOR_TREE);
      }), n.rootNodes;
    },
    async getInspectorState(t) {
      const n = {
        ...t,
        app: Ce.value.app,
        state: null
      }, r = { currentTab: `custom-inspector:${t.inspectorId}` };
      return await new Promise((o) => {
        e.callHookWith(async (i) => {
          await Promise.all(i.map((a) => a(n, r))), o();
        }, Ie.GET_INSPECTOR_STATE);
      }), n.state;
    },
    editInspectorState(t) {
      const n = new Wa(), r = {
        ...t,
        app: Ce.value.app,
        set: (o, i = t.path, a = t.state.value, s) => {
          n.set(o, i, a, s || n.createDefaultSetCallback(t.state));
        }
      };
      e.callHookWith((o) => {
        o.forEach((i) => i(r));
      }, Ie.EDIT_INSPECTOR_STATE);
    },
    sendInspectorState(t) {
      const n = Cn(t);
      e.callHook(ve.SEND_INSPECTOR_STATE, {
        inspectorId: t,
        plugin: {
          descriptor: n.descriptor,
          setupFn: () => ({})
        }
      });
    },
    inspectComponentInspector() {
      return Da();
    },
    cancelInspectComponentInspector() {
      return La();
    },
    getComponentRenderCode(t) {
      const n = yr(Ce.value, t);
      if (n) return typeof n?.type != "function" ? n.render.toString() : n.type.toString();
    },
    scrollToComponent(t) {
      return za({ id: t });
    },
    openInEditor: nl,
    getVueInspector: Fa,
    toggleApp(t, n) {
      const r = Kn.value.find((o) => o.id === t);
      r && (tl(t), el(r), vl(r, Ce), gi(), wi(r.app, n));
    },
    inspectDOM(t) {
      const n = yr(Ce.value, t);
      if (n) {
        const [r] = Fr(n);
        r && (U.__VUE_DEVTOOLS_INSPECT_DOM_TARGET__ = r);
      }
    },
    updatePluginSettings(t, n, r) {
      il(t, n, r);
    },
    getPluginSettings(t) {
      return {
        options: rl(t),
        values: bi(t)
      };
    }
  };
}
U.__VUE_DEVTOOLS_ENV__ ??= { vitePluginDetected: !1 };
const co = Ja();
U.__VUE_DEVTOOLS_KIT_CONTEXT__ ??= {
  hooks: co,
  get state() {
    return {
      ...je,
      activeAppRecordId: Ce.id,
      activeAppRecord: Ce.value,
      appRecords: Kn.value
    };
  },
  api: bl(co)
};
const Kt = U.__VUE_DEVTOOLS_KIT_CONTEXT__;
var yl = /* @__PURE__ */ si(((e, t) => {
  (function(n) {
    var r = {
      À: "A",
      Á: "A",
      Â: "A",
      Ã: "A",
      Ä: "Ae",
      Å: "A",
      Æ: "AE",
      Ç: "C",
      È: "E",
      É: "E",
      Ê: "E",
      Ë: "E",
      Ì: "I",
      Í: "I",
      Î: "I",
      Ï: "I",
      Ð: "D",
      Ñ: "N",
      Ò: "O",
      Ó: "O",
      Ô: "O",
      Õ: "O",
      Ö: "Oe",
      Ő: "O",
      Ø: "O",
      Ù: "U",
      Ú: "U",
      Û: "U",
      Ü: "Ue",
      Ű: "U",
      Ý: "Y",
      Þ: "TH",
      ß: "ss",
      à: "a",
      á: "a",
      â: "a",
      ã: "a",
      ä: "ae",
      å: "a",
      æ: "ae",
      ç: "c",
      è: "e",
      é: "e",
      ê: "e",
      ë: "e",
      ì: "i",
      í: "i",
      î: "i",
      ï: "i",
      ð: "d",
      ñ: "n",
      ò: "o",
      ó: "o",
      ô: "o",
      õ: "o",
      ö: "oe",
      ő: "o",
      ø: "o",
      ù: "u",
      ú: "u",
      û: "u",
      ü: "ue",
      ű: "u",
      ý: "y",
      þ: "th",
      ÿ: "y",
      "ẞ": "SS",
      ا: "a",
      أ: "a",
      إ: "i",
      آ: "aa",
      ؤ: "u",
      ئ: "e",
      ء: "a",
      ب: "b",
      ت: "t",
      ث: "th",
      ج: "j",
      ح: "h",
      خ: "kh",
      د: "d",
      ذ: "th",
      ر: "r",
      ز: "z",
      س: "s",
      ش: "sh",
      ص: "s",
      ض: "dh",
      ط: "t",
      ظ: "z",
      ع: "a",
      غ: "gh",
      ف: "f",
      ق: "q",
      ك: "k",
      ل: "l",
      م: "m",
      ن: "n",
      ه: "h",
      و: "w",
      ي: "y",
      ى: "a",
      ة: "h",
      ﻻ: "la",
      ﻷ: "laa",
      ﻹ: "lai",
      ﻵ: "laa",
      گ: "g",
      چ: "ch",
      پ: "p",
      ژ: "zh",
      ک: "k",
      ی: "y",
      "َ": "a",
      "ً": "an",
      "ِ": "e",
      "ٍ": "en",
      "ُ": "u",
      "ٌ": "on",
      "ْ": "",
      "٠": "0",
      "١": "1",
      "٢": "2",
      "٣": "3",
      "٤": "4",
      "٥": "5",
      "٦": "6",
      "٧": "7",
      "٨": "8",
      "٩": "9",
      "۰": "0",
      "۱": "1",
      "۲": "2",
      "۳": "3",
      "۴": "4",
      "۵": "5",
      "۶": "6",
      "۷": "7",
      "۸": "8",
      "۹": "9",
      က: "k",
      ခ: "kh",
      ဂ: "g",
      ဃ: "ga",
      င: "ng",
      စ: "s",
      ဆ: "sa",
      ဇ: "z",
      "စျ": "za",
      ည: "ny",
      ဋ: "t",
      ဌ: "ta",
      ဍ: "d",
      ဎ: "da",
      ဏ: "na",
      တ: "t",
      ထ: "ta",
      ဒ: "d",
      ဓ: "da",
      န: "n",
      ပ: "p",
      ဖ: "pa",
      ဗ: "b",
      ဘ: "ba",
      မ: "m",
      ယ: "y",
      ရ: "ya",
      လ: "l",
      ဝ: "w",
      သ: "th",
      ဟ: "h",
      ဠ: "la",
      အ: "a",
      "ြ": "y",
      "ျ": "ya",
      "ွ": "w",
      "ြွ": "yw",
      "ျွ": "ywa",
      "ှ": "h",
      ဧ: "e",
      "၏": "-e",
      ဣ: "i",
      ဤ: "-i",
      ဉ: "u",
      ဦ: "-u",
      ဩ: "aw",
      "သြော": "aw",
      ဪ: "aw",
      "၀": "0",
      "၁": "1",
      "၂": "2",
      "၃": "3",
      "၄": "4",
      "၅": "5",
      "၆": "6",
      "၇": "7",
      "၈": "8",
      "၉": "9",
      "္": "",
      "့": "",
      "း": "",
      č: "c",
      ď: "d",
      ě: "e",
      ň: "n",
      ř: "r",
      š: "s",
      ť: "t",
      ů: "u",
      ž: "z",
      Č: "C",
      Ď: "D",
      Ě: "E",
      Ň: "N",
      Ř: "R",
      Š: "S",
      Ť: "T",
      Ů: "U",
      Ž: "Z",
      ހ: "h",
      ށ: "sh",
      ނ: "n",
      ރ: "r",
      ބ: "b",
      ޅ: "lh",
      ކ: "k",
      އ: "a",
      ވ: "v",
      މ: "m",
      ފ: "f",
      ދ: "dh",
      ތ: "th",
      ލ: "l",
      ގ: "g",
      ޏ: "gn",
      ސ: "s",
      ޑ: "d",
      ޒ: "z",
      ޓ: "t",
      ޔ: "y",
      ޕ: "p",
      ޖ: "j",
      ޗ: "ch",
      ޘ: "tt",
      ޙ: "hh",
      ޚ: "kh",
      ޛ: "th",
      ޜ: "z",
      ޝ: "sh",
      ޞ: "s",
      ޟ: "d",
      ޠ: "t",
      ޡ: "z",
      ޢ: "a",
      ޣ: "gh",
      ޤ: "q",
      ޥ: "w",
      "ަ": "a",
      "ާ": "aa",
      "ި": "i",
      "ީ": "ee",
      "ު": "u",
      "ޫ": "oo",
      "ެ": "e",
      "ޭ": "ey",
      "ޮ": "o",
      "ޯ": "oa",
      "ް": "",
      ა: "a",
      ბ: "b",
      გ: "g",
      დ: "d",
      ე: "e",
      ვ: "v",
      ზ: "z",
      თ: "t",
      ი: "i",
      კ: "k",
      ლ: "l",
      მ: "m",
      ნ: "n",
      ო: "o",
      პ: "p",
      ჟ: "zh",
      რ: "r",
      ს: "s",
      ტ: "t",
      უ: "u",
      ფ: "p",
      ქ: "k",
      ღ: "gh",
      ყ: "q",
      შ: "sh",
      ჩ: "ch",
      ც: "ts",
      ძ: "dz",
      წ: "ts",
      ჭ: "ch",
      ხ: "kh",
      ჯ: "j",
      ჰ: "h",
      α: "a",
      β: "v",
      γ: "g",
      δ: "d",
      ε: "e",
      ζ: "z",
      η: "i",
      θ: "th",
      ι: "i",
      κ: "k",
      λ: "l",
      μ: "m",
      ν: "n",
      ξ: "ks",
      ο: "o",
      π: "p",
      ρ: "r",
      σ: "s",
      τ: "t",
      υ: "y",
      φ: "f",
      χ: "x",
      ψ: "ps",
      ω: "o",
      ά: "a",
      έ: "e",
      ί: "i",
      ό: "o",
      ύ: "y",
      ή: "i",
      ώ: "o",
      ς: "s",
      ϊ: "i",
      ΰ: "y",
      ϋ: "y",
      ΐ: "i",
      Α: "A",
      Β: "B",
      Γ: "G",
      Δ: "D",
      Ε: "E",
      Ζ: "Z",
      Η: "I",
      Θ: "TH",
      Ι: "I",
      Κ: "K",
      Λ: "L",
      Μ: "M",
      Ν: "N",
      Ξ: "KS",
      Ο: "O",
      Π: "P",
      Ρ: "R",
      Σ: "S",
      Τ: "T",
      Υ: "Y",
      Φ: "F",
      Χ: "X",
      Ψ: "PS",
      Ω: "O",
      Ά: "A",
      Έ: "E",
      Ί: "I",
      Ό: "O",
      Ύ: "Y",
      Ή: "I",
      Ώ: "O",
      Ϊ: "I",
      Ϋ: "Y",
      ā: "a",
      ē: "e",
      ģ: "g",
      ī: "i",
      ķ: "k",
      ļ: "l",
      ņ: "n",
      ū: "u",
      Ā: "A",
      Ē: "E",
      Ģ: "G",
      Ī: "I",
      Ķ: "k",
      Ļ: "L",
      Ņ: "N",
      Ū: "U",
      Ќ: "Kj",
      ќ: "kj",
      Љ: "Lj",
      љ: "lj",
      Њ: "Nj",
      њ: "nj",
      Тс: "Ts",
      тс: "ts",
      ą: "a",
      ć: "c",
      ę: "e",
      ł: "l",
      ń: "n",
      ś: "s",
      ź: "z",
      ż: "z",
      Ą: "A",
      Ć: "C",
      Ę: "E",
      Ł: "L",
      Ń: "N",
      Ś: "S",
      Ź: "Z",
      Ż: "Z",
      Є: "Ye",
      І: "I",
      Ї: "Yi",
      Ґ: "G",
      є: "ye",
      і: "i",
      ї: "yi",
      ґ: "g",
      ă: "a",
      Ă: "A",
      ș: "s",
      Ș: "S",
      ț: "t",
      Ț: "T",
      ţ: "t",
      Ţ: "T",
      а: "a",
      б: "b",
      в: "v",
      г: "g",
      д: "d",
      е: "e",
      ё: "yo",
      ж: "zh",
      з: "z",
      и: "i",
      й: "i",
      к: "k",
      л: "l",
      м: "m",
      н: "n",
      о: "o",
      п: "p",
      р: "r",
      с: "s",
      т: "t",
      у: "u",
      ф: "f",
      х: "kh",
      ц: "c",
      ч: "ch",
      ш: "sh",
      щ: "sh",
      ъ: "",
      ы: "y",
      ь: "",
      э: "e",
      ю: "yu",
      я: "ya",
      А: "A",
      Б: "B",
      В: "V",
      Г: "G",
      Д: "D",
      Е: "E",
      Ё: "Yo",
      Ж: "Zh",
      З: "Z",
      И: "I",
      Й: "I",
      К: "K",
      Л: "L",
      М: "M",
      Н: "N",
      О: "O",
      П: "P",
      Р: "R",
      С: "S",
      Т: "T",
      У: "U",
      Ф: "F",
      Х: "Kh",
      Ц: "C",
      Ч: "Ch",
      Ш: "Sh",
      Щ: "Sh",
      Ъ: "",
      Ы: "Y",
      Ь: "",
      Э: "E",
      Ю: "Yu",
      Я: "Ya",
      ђ: "dj",
      ј: "j",
      ћ: "c",
      џ: "dz",
      Ђ: "Dj",
      Ј: "j",
      Ћ: "C",
      Џ: "Dz",
      ľ: "l",
      ĺ: "l",
      ŕ: "r",
      Ľ: "L",
      Ĺ: "L",
      Ŕ: "R",
      ş: "s",
      Ş: "S",
      ı: "i",
      İ: "I",
      ğ: "g",
      Ğ: "G",
      ả: "a",
      Ả: "A",
      ẳ: "a",
      Ẳ: "A",
      ẩ: "a",
      Ẩ: "A",
      đ: "d",
      Đ: "D",
      ẹ: "e",
      Ẹ: "E",
      ẽ: "e",
      Ẽ: "E",
      ẻ: "e",
      Ẻ: "E",
      ế: "e",
      Ế: "E",
      ề: "e",
      Ề: "E",
      ệ: "e",
      Ệ: "E",
      ễ: "e",
      Ễ: "E",
      ể: "e",
      Ể: "E",
      ỏ: "o",
      ọ: "o",
      Ọ: "o",
      ố: "o",
      Ố: "O",
      ồ: "o",
      Ồ: "O",
      ổ: "o",
      Ổ: "O",
      ộ: "o",
      Ộ: "O",
      ỗ: "o",
      Ỗ: "O",
      ơ: "o",
      Ơ: "O",
      ớ: "o",
      Ớ: "O",
      ờ: "o",
      Ờ: "O",
      ợ: "o",
      Ợ: "O",
      ỡ: "o",
      Ỡ: "O",
      Ở: "o",
      ở: "o",
      ị: "i",
      Ị: "I",
      ĩ: "i",
      Ĩ: "I",
      ỉ: "i",
      Ỉ: "i",
      ủ: "u",
      Ủ: "U",
      ụ: "u",
      Ụ: "U",
      ũ: "u",
      Ũ: "U",
      ư: "u",
      Ư: "U",
      ứ: "u",
      Ứ: "U",
      ừ: "u",
      Ừ: "U",
      ự: "u",
      Ự: "U",
      ữ: "u",
      Ữ: "U",
      ử: "u",
      Ử: "ư",
      ỷ: "y",
      Ỷ: "y",
      ỳ: "y",
      Ỳ: "Y",
      ỵ: "y",
      Ỵ: "Y",
      ỹ: "y",
      Ỹ: "Y",
      ạ: "a",
      Ạ: "A",
      ấ: "a",
      Ấ: "A",
      ầ: "a",
      Ầ: "A",
      ậ: "a",
      Ậ: "A",
      ẫ: "a",
      Ẫ: "A",
      ắ: "a",
      Ắ: "A",
      ằ: "a",
      Ằ: "A",
      ặ: "a",
      Ặ: "A",
      ẵ: "a",
      Ẵ: "A",
      "⓪": "0",
      "①": "1",
      "②": "2",
      "③": "3",
      "④": "4",
      "⑤": "5",
      "⑥": "6",
      "⑦": "7",
      "⑧": "8",
      "⑨": "9",
      "⑩": "10",
      "⑪": "11",
      "⑫": "12",
      "⑬": "13",
      "⑭": "14",
      "⑮": "15",
      "⑯": "16",
      "⑰": "17",
      "⑱": "18",
      "⑲": "18",
      "⑳": "18",
      "⓵": "1",
      "⓶": "2",
      "⓷": "3",
      "⓸": "4",
      "⓹": "5",
      "⓺": "6",
      "⓻": "7",
      "⓼": "8",
      "⓽": "9",
      "⓾": "10",
      "⓿": "0",
      "⓫": "11",
      "⓬": "12",
      "⓭": "13",
      "⓮": "14",
      "⓯": "15",
      "⓰": "16",
      "⓱": "17",
      "⓲": "18",
      "⓳": "19",
      "⓴": "20",
      "Ⓐ": "A",
      "Ⓑ": "B",
      "Ⓒ": "C",
      "Ⓓ": "D",
      "Ⓔ": "E",
      "Ⓕ": "F",
      "Ⓖ": "G",
      "Ⓗ": "H",
      "Ⓘ": "I",
      "Ⓙ": "J",
      "Ⓚ": "K",
      "Ⓛ": "L",
      "Ⓜ": "M",
      "Ⓝ": "N",
      "Ⓞ": "O",
      "Ⓟ": "P",
      "Ⓠ": "Q",
      "Ⓡ": "R",
      "Ⓢ": "S",
      "Ⓣ": "T",
      "Ⓤ": "U",
      "Ⓥ": "V",
      "Ⓦ": "W",
      "Ⓧ": "X",
      "Ⓨ": "Y",
      "Ⓩ": "Z",
      "ⓐ": "a",
      "ⓑ": "b",
      "ⓒ": "c",
      "ⓓ": "d",
      "ⓔ": "e",
      "ⓕ": "f",
      "ⓖ": "g",
      "ⓗ": "h",
      "ⓘ": "i",
      "ⓙ": "j",
      "ⓚ": "k",
      "ⓛ": "l",
      "ⓜ": "m",
      "ⓝ": "n",
      "ⓞ": "o",
      "ⓟ": "p",
      "ⓠ": "q",
      "ⓡ": "r",
      "ⓢ": "s",
      "ⓣ": "t",
      "ⓤ": "u",
      "ⓦ": "v",
      "ⓥ": "w",
      "ⓧ": "x",
      "ⓨ": "y",
      "ⓩ": "z",
      "“": '"',
      "”": '"',
      "‘": "'",
      "’": "'",
      "∂": "d",
      ƒ: "f",
      "™": "(TM)",
      "©": "(C)",
      œ: "oe",
      Œ: "OE",
      "®": "(R)",
      "†": "+",
      "℠": "(SM)",
      "…": "...",
      "˚": "o",
      º: "o",
      ª: "a",
      "•": "*",
      "၊": ",",
      "။": ".",
      $: "USD",
      "€": "EUR",
      "₢": "BRN",
      "₣": "FRF",
      "£": "GBP",
      "₤": "ITL",
      "₦": "NGN",
      "₧": "ESP",
      "₩": "KRW",
      "₪": "ILS",
      "₫": "VND",
      "₭": "LAK",
      "₮": "MNT",
      "₯": "GRD",
      "₱": "ARS",
      "₲": "PYG",
      "₳": "ARA",
      "₴": "UAH",
      "₵": "GHS",
      "¢": "cent",
      "¥": "CNY",
      元: "CNY",
      円: "YEN",
      "﷼": "IRR",
      "₠": "EWE",
      "฿": "THB",
      "₨": "INR",
      "₹": "INR",
      "₰": "PF",
      "₺": "TRY",
      "؋": "AFN",
      "₼": "AZN",
      лв: "BGN",
      "៛": "KHR",
      "₡": "CRC",
      "₸": "KZT",
      ден: "MKD",
      zł: "PLN",
      "₽": "RUB",
      "₾": "GEL"
    }, o = ["်", "ް"], i = {
      "ာ": "a",
      "ါ": "a",
      "ေ": "e",
      "ဲ": "e",
      "ိ": "i",
      "ီ": "i",
      "ို": "o",
      "ု": "u",
      "ူ": "u",
      "ေါင်": "aung",
      "ော": "aw",
      "ော်": "aw",
      "ေါ": "aw",
      "ေါ်": "aw",
      "်": "်",
      "က်": "et",
      "ိုက်": "aik",
      "ောက်": "auk",
      "င်": "in",
      "ိုင်": "aing",
      "ောင်": "aung",
      "စ်": "it",
      "ည်": "i",
      "တ်": "at",
      "ိတ်": "eik",
      "ုတ်": "ok",
      "ွတ်": "ut",
      "ေတ်": "it",
      "ဒ်": "d",
      "ိုဒ်": "ok",
      "ုဒ်": "ait",
      "န်": "an",
      "ာန်": "an",
      "ိန်": "ein",
      "ုန်": "on",
      "ွန်": "un",
      "ပ်": "at",
      "ိပ်": "eik",
      "ုပ်": "ok",
      "ွပ်": "ut",
      "န်ုပ်": "nub",
      "မ်": "an",
      "ိမ်": "ein",
      "ုမ်": "on",
      "ွမ်": "un",
      "ယ်": "e",
      "ိုလ်": "ol",
      "ဉ်": "in",
      "ံ": "an",
      "ိံ": "ein",
      "ုံ": "on",
      "ައް": "ah",
      "ަށް": "ah"
    }, a = {
      en: {},
      az: {
        ç: "c",
        ə: "e",
        ğ: "g",
        ı: "i",
        ö: "o",
        ş: "s",
        ü: "u",
        Ç: "C",
        Ə: "E",
        Ğ: "G",
        İ: "I",
        Ö: "O",
        Ş: "S",
        Ü: "U"
      },
      cs: {
        č: "c",
        ď: "d",
        ě: "e",
        ň: "n",
        ř: "r",
        š: "s",
        ť: "t",
        ů: "u",
        ž: "z",
        Č: "C",
        Ď: "D",
        Ě: "E",
        Ň: "N",
        Ř: "R",
        Š: "S",
        Ť: "T",
        Ů: "U",
        Ž: "Z"
      },
      fi: {
        ä: "a",
        Ä: "A",
        ö: "o",
        Ö: "O"
      },
      hu: {
        ä: "a",
        Ä: "A",
        ö: "o",
        Ö: "O",
        ü: "u",
        Ü: "U",
        ű: "u",
        Ű: "U"
      },
      lt: {
        ą: "a",
        č: "c",
        ę: "e",
        ė: "e",
        į: "i",
        š: "s",
        ų: "u",
        ū: "u",
        ž: "z",
        Ą: "A",
        Č: "C",
        Ę: "E",
        Ė: "E",
        Į: "I",
        Š: "S",
        Ų: "U",
        Ū: "U"
      },
      lv: {
        ā: "a",
        č: "c",
        ē: "e",
        ģ: "g",
        ī: "i",
        ķ: "k",
        ļ: "l",
        ņ: "n",
        š: "s",
        ū: "u",
        ž: "z",
        Ā: "A",
        Č: "C",
        Ē: "E",
        Ģ: "G",
        Ī: "i",
        Ķ: "k",
        Ļ: "L",
        Ņ: "N",
        Š: "S",
        Ū: "u",
        Ž: "Z"
      },
      pl: {
        ą: "a",
        ć: "c",
        ę: "e",
        ł: "l",
        ń: "n",
        ó: "o",
        ś: "s",
        ź: "z",
        ż: "z",
        Ą: "A",
        Ć: "C",
        Ę: "e",
        Ł: "L",
        Ń: "N",
        Ó: "O",
        Ś: "S",
        Ź: "Z",
        Ż: "Z"
      },
      sv: {
        ä: "a",
        Ä: "A",
        ö: "o",
        Ö: "O"
      },
      sk: {
        ä: "a",
        Ä: "A"
      },
      sr: {
        љ: "lj",
        њ: "nj",
        Љ: "Lj",
        Њ: "Nj",
        đ: "dj",
        Đ: "Dj"
      },
      tr: {
        Ü: "U",
        Ö: "O",
        ü: "u",
        ö: "o"
      }
    }, s = {
      ar: {
        "∆": "delta",
        "∞": "la-nihaya",
        "♥": "hob",
        "&": "wa",
        "|": "aw",
        "<": "aqal-men",
        ">": "akbar-men",
        "∑": "majmou",
        "¤": "omla"
      },
      az: {},
      ca: {
        "∆": "delta",
        "∞": "infinit",
        "♥": "amor",
        "&": "i",
        "|": "o",
        "<": "menys que",
        ">": "mes que",
        "∑": "suma dels",
        "¤": "moneda"
      },
      cs: {
        "∆": "delta",
        "∞": "nekonecno",
        "♥": "laska",
        "&": "a",
        "|": "nebo",
        "<": "mensi nez",
        ">": "vetsi nez",
        "∑": "soucet",
        "¤": "mena"
      },
      de: {
        "∆": "delta",
        "∞": "unendlich",
        "♥": "Liebe",
        "&": "und",
        "|": "oder",
        "<": "kleiner als",
        ">": "groesser als",
        "∑": "Summe von",
        "¤": "Waehrung"
      },
      dv: {
        "∆": "delta",
        "∞": "kolunulaa",
        "♥": "loabi",
        "&": "aai",
        "|": "noonee",
        "<": "ah vure kuda",
        ">": "ah vure bodu",
        "∑": "jumula",
        "¤": "faisaa"
      },
      en: {
        "∆": "delta",
        "∞": "infinity",
        "♥": "love",
        "&": "and",
        "|": "or",
        "<": "less than",
        ">": "greater than",
        "∑": "sum",
        "¤": "currency"
      },
      es: {
        "∆": "delta",
        "∞": "infinito",
        "♥": "amor",
        "&": "y",
        "|": "u",
        "<": "menos que",
        ">": "mas que",
        "∑": "suma de los",
        "¤": "moneda"
      },
      fa: {
        "∆": "delta",
        "∞": "bi-nahayat",
        "♥": "eshgh",
        "&": "va",
        "|": "ya",
        "<": "kamtar-az",
        ">": "bishtar-az",
        "∑": "majmooe",
        "¤": "vahed"
      },
      fi: {
        "∆": "delta",
        "∞": "aarettomyys",
        "♥": "rakkaus",
        "&": "ja",
        "|": "tai",
        "<": "pienempi kuin",
        ">": "suurempi kuin",
        "∑": "summa",
        "¤": "valuutta"
      },
      fr: {
        "∆": "delta",
        "∞": "infiniment",
        "♥": "Amour",
        "&": "et",
        "|": "ou",
        "<": "moins que",
        ">": "superieure a",
        "∑": "somme des",
        "¤": "monnaie"
      },
      ge: {
        "∆": "delta",
        "∞": "usasruloba",
        "♥": "siqvaruli",
        "&": "da",
        "|": "an",
        "<": "naklebi",
        ">": "meti",
        "∑": "jami",
        "¤": "valuta"
      },
      gr: {},
      hu: {
        "∆": "delta",
        "∞": "vegtelen",
        "♥": "szerelem",
        "&": "es",
        "|": "vagy",
        "<": "kisebb mint",
        ">": "nagyobb mint",
        "∑": "szumma",
        "¤": "penznem"
      },
      it: {
        "∆": "delta",
        "∞": "infinito",
        "♥": "amore",
        "&": "e",
        "|": "o",
        "<": "minore di",
        ">": "maggiore di",
        "∑": "somma",
        "¤": "moneta"
      },
      lt: {
        "∆": "delta",
        "∞": "begalybe",
        "♥": "meile",
        "&": "ir",
        "|": "ar",
        "<": "maziau nei",
        ">": "daugiau nei",
        "∑": "suma",
        "¤": "valiuta"
      },
      lv: {
        "∆": "delta",
        "∞": "bezgaliba",
        "♥": "milestiba",
        "&": "un",
        "|": "vai",
        "<": "mazak neka",
        ">": "lielaks neka",
        "∑": "summa",
        "¤": "valuta"
      },
      my: {
        "∆": "kwahkhyaet",
        "∞": "asaonasme",
        "♥": "akhyait",
        "&": "nhin",
        "|": "tho",
        "<": "ngethaw",
        ">": "kyithaw",
        "∑": "paungld",
        "¤": "ngwekye"
      },
      mk: {},
      nl: {
        "∆": "delta",
        "∞": "oneindig",
        "♥": "liefde",
        "&": "en",
        "|": "of",
        "<": "kleiner dan",
        ">": "groter dan",
        "∑": "som",
        "¤": "valuta"
      },
      pl: {
        "∆": "delta",
        "∞": "nieskonczonosc",
        "♥": "milosc",
        "&": "i",
        "|": "lub",
        "<": "mniejsze niz",
        ">": "wieksze niz",
        "∑": "suma",
        "¤": "waluta"
      },
      pt: {
        "∆": "delta",
        "∞": "infinito",
        "♥": "amor",
        "&": "e",
        "|": "ou",
        "<": "menor que",
        ">": "maior que",
        "∑": "soma",
        "¤": "moeda"
      },
      ro: {
        "∆": "delta",
        "∞": "infinit",
        "♥": "dragoste",
        "&": "si",
        "|": "sau",
        "<": "mai mic ca",
        ">": "mai mare ca",
        "∑": "suma",
        "¤": "valuta"
      },
      ru: {
        "∆": "delta",
        "∞": "beskonechno",
        "♥": "lubov",
        "&": "i",
        "|": "ili",
        "<": "menshe",
        ">": "bolshe",
        "∑": "summa",
        "¤": "valjuta"
      },
      sk: {
        "∆": "delta",
        "∞": "nekonecno",
        "♥": "laska",
        "&": "a",
        "|": "alebo",
        "<": "menej ako",
        ">": "viac ako",
        "∑": "sucet",
        "¤": "mena"
      },
      sr: {},
      tr: {
        "∆": "delta",
        "∞": "sonsuzluk",
        "♥": "ask",
        "&": "ve",
        "|": "veya",
        "<": "kucuktur",
        ">": "buyuktur",
        "∑": "toplam",
        "¤": "para birimi"
      },
      uk: {
        "∆": "delta",
        "∞": "bezkinechnist",
        "♥": "lubov",
        "&": "i",
        "|": "abo",
        "<": "menshe",
        ">": "bilshe",
        "∑": "suma",
        "¤": "valjuta"
      },
      vn: {
        "∆": "delta",
        "∞": "vo cuc",
        "♥": "yeu",
        "&": "va",
        "|": "hoac",
        "<": "nho hon",
        ">": "lon hon",
        "∑": "tong",
        "¤": "tien te"
      }
    }, c = [
      ";",
      "?",
      ":",
      "@",
      "&",
      "=",
      "+",
      "$",
      ",",
      "/"
    ].join(""), l = [
      ";",
      "?",
      ":",
      "@",
      "&",
      "=",
      "+",
      "$",
      ","
    ].join(""), d = [
      ".",
      "!",
      "~",
      "*",
      "'",
      "(",
      ")"
    ].join(""), f = function(v, h) {
      var g = "-", E = "", T = "", S = !0, N = {}, O, z, P, Y, ne, M, I, A, te, ie, C, ee, B, X, ue = "";
      if (typeof v != "string") return "";
      if (typeof h == "string" && (g = h), I = s.en, A = a.en, typeof h == "object") {
        O = h.maintainCase || !1, N = h.custom && typeof h.custom == "object" ? h.custom : N, P = +h.truncate > 1 && h.truncate || !1, Y = h.uric || !1, ne = h.uricNoSlash || !1, M = h.mark || !1, S = !(h.symbols === !1 || h.lang === !1), g = h.separator || g, Y && (ue += c), ne && (ue += l), M && (ue += d), I = h.lang && s[h.lang] && S ? s[h.lang] : S ? s.en : {}, A = h.lang && a[h.lang] ? a[h.lang] : h.lang === !1 || h.lang === !0 ? {} : a.en, h.titleCase && typeof h.titleCase.length == "number" && Array.prototype.toString.call(h.titleCase) ? (h.titleCase.forEach(function(se) {
          N[se + ""] = se + "";
        }), z = !0) : z = !!h.titleCase, h.custom && typeof h.custom.length == "number" && Array.prototype.toString.call(h.custom) && h.custom.forEach(function(se) {
          N[se + ""] = se + "";
        }), Object.keys(N).forEach(function(se) {
          var de;
          se.length > 1 ? de = new RegExp("\\b" + p(se) + "\\b", "gi") : de = new RegExp(p(se), "gi"), v = v.replace(de, N[se]);
        });
        for (C in N) ue += C;
      }
      for (ue += g, ue = p(ue), v = v.replace(/(^\s+|\s+$)/g, ""), B = !1, X = !1, ie = 0, ee = v.length; ie < ee; ie++)
        C = v[ie], b(C, N) ? B = !1 : A[C] ? (C = B && A[C].match(/[A-Za-z0-9]/) ? " " + A[C] : A[C], B = !1) : C in r ? (ie + 1 < ee && o.indexOf(v[ie + 1]) >= 0 ? (T += C, C = "") : X === !0 ? (C = i[T] + r[C], T = "") : C = B && r[C].match(/[A-Za-z0-9]/) ? " " + r[C] : r[C], B = !1, X = !1) : C in i ? (T += C, C = "", ie === ee - 1 && (C = i[T]), X = !0) : I[C] && !(Y && c.indexOf(C) !== -1) && !(ne && l.indexOf(C) !== -1) ? (C = B || E.substr(-1).match(/[A-Za-z0-9]/) ? g + I[C] : I[C], C += v[ie + 1] !== void 0 && v[ie + 1].match(/[A-Za-z0-9]/) ? g : "", B = !0) : (X === !0 ? (C = i[T] + C, T = "", X = !1) : B && (/[A-Za-z0-9]/.test(C) || E.substr(-1).match(/A-Za-z0-9]/)) && (C = " " + C), B = !1), E += C.replace(new RegExp("[^\\w\\s" + ue + "_-]", "g"), g);
      return z && (E = E.replace(/(\w)(\S*)/g, function(se, de, me) {
        var he = de.toUpperCase() + (me !== null ? me : "");
        return Object.keys(N).indexOf(he.toLowerCase()) < 0 ? he : he.toLowerCase();
      })), E = E.replace(/\s+/g, g).replace(new RegExp("\\" + g + "+", "g"), g).replace(new RegExp("(^\\" + g + "+|\\" + g + "+$)", "g"), ""), P && E.length > P && (te = E.charAt(P) === g, E = E.slice(0, P), te || (E = E.slice(0, E.lastIndexOf(g)))), !O && !z && (E = E.toLowerCase()), E;
    }, m = function(v) {
      return function(g) {
        return f(g, v);
      };
    }, p = function(v) {
      return v.replace(/[-\\^$*+?.()|[\]{}\/]/g, "\\$&");
    }, b = function(w, v) {
      for (var h in v) if (v[h] === w) return !0;
    };
    if (typeof t < "u" && t.exports)
      t.exports = f, t.exports.createSlug = m;
    else if (typeof define < "u" && define.amd) define([], function() {
      return f;
    });
    else try {
      if (n.getSlug || n.createSlug) throw "speakingurl: globals exists /(getSlug|createSlug)/";
      n.getSlug = f, n.createSlug = m;
    } catch {
    }
  })(e);
}));
(/* @__PURE__ */ si(((e, t) => {
  t.exports = yl();
})))();
U.__VUE_DEVTOOLS_NEXT_APP_RECORD_INFO__ ??= {
  id: 0,
  appIds: /* @__PURE__ */ new Set()
};
function _l(e) {
  je.highPerfModeEnabled = e ?? !je.highPerfModeEnabled, !e && Ce.value && wi(Ce.value.app);
}
function wl(e) {
  je.devtoolsClientDetected = {
    ...je.devtoolsClientDetected,
    ...e
  }, _l(!Object.values(je.devtoolsClientDetected).some(Boolean));
}
U.__VUE_DEVTOOLS_UPDATE_CLIENT_DETECTED__ ??= wl;
var xl = class {
  constructor() {
    this.keyToValue = /* @__PURE__ */ new Map(), this.valueToKey = /* @__PURE__ */ new Map();
  }
  set(e, t) {
    this.keyToValue.set(e, t), this.valueToKey.set(t, e);
  }
  getByKey(e) {
    return this.keyToValue.get(e);
  }
  getByValue(e) {
    return this.valueToKey.get(e);
  }
  clear() {
    this.keyToValue.clear(), this.valueToKey.clear();
  }
}, xi = class {
  constructor(e) {
    this.generateIdentifier = e, this.kv = new xl();
  }
  register(e, t) {
    this.kv.getByValue(e) || (t || (t = this.generateIdentifier(e)), this.kv.set(t, e));
  }
  clear() {
    this.kv.clear();
  }
  getIdentifier(e) {
    return this.kv.getByValue(e);
  }
  getValue(e) {
    return this.kv.getByKey(e);
  }
}, jl = class extends xi {
  constructor() {
    super((e) => e.name), this.classToAllowedProps = /* @__PURE__ */ new Map();
  }
  register(e, t) {
    typeof t == "object" ? (t.allowProps && this.classToAllowedProps.set(e, t.allowProps), super.register(e, t.identifier)) : super.register(e, t);
  }
  getAllowedProps(e) {
    return this.classToAllowedProps.get(e);
  }
};
function kl(e) {
  if ("values" in Object) return Object.values(e);
  const t = [];
  for (const n in e) e.hasOwnProperty(n) && t.push(e[n]);
  return t;
}
function El(e, t) {
  const n = kl(e);
  if ("find" in n) return n.find(t);
  const r = n;
  for (let o = 0; o < r.length; o++) {
    const i = r[o];
    if (t(i)) return i;
  }
}
function Bt(e, t) {
  Object.entries(e).forEach(([n, r]) => t(r, n));
}
function An(e, t) {
  return e.indexOf(t) !== -1;
}
function uo(e, t) {
  for (let n = 0; n < e.length; n++) {
    const r = e[n];
    if (t(r)) return r;
  }
}
var Sl = class {
  constructor() {
    this.transfomers = {};
  }
  register(e) {
    this.transfomers[e.name] = e;
  }
  findApplicable(e) {
    return El(this.transfomers, (t) => t.isApplicable(e));
  }
  findByName(e) {
    return this.transfomers[e];
  }
};
const Il = (e) => Object.prototype.toString.call(e).slice(8, -1), ji = (e) => typeof e > "u", Tl = (e) => e === null, gn = (e) => typeof e != "object" || e === null || e === Object.prototype ? !1 : Object.getPrototypeOf(e) === null ? !0 : Object.getPrototypeOf(e) === Object.prototype, jr = (e) => gn(e) && Object.keys(e).length === 0, gt = (e) => Array.isArray(e), $l = (e) => typeof e == "string", Cl = (e) => typeof e == "number" && !isNaN(e), Al = (e) => typeof e == "boolean", Ol = (e) => e instanceof RegExp, mn = (e) => e instanceof Map, vn = (e) => e instanceof Set, ki = (e) => Il(e) === "Symbol", Nl = (e) => e instanceof Date && !isNaN(e.valueOf()), Ml = (e) => e instanceof Error, po = (e) => typeof e == "number" && isNaN(e), Rl = (e) => Al(e) || Tl(e) || ji(e) || Cl(e) || $l(e) || ki(e), Pl = (e) => typeof e == "bigint", Ll = (e) => e === 1 / 0 || e === -1 / 0, Dl = (e) => ArrayBuffer.isView(e) && !(e instanceof DataView), zl = (e) => e instanceof URL, Ei = (e) => e.replace(/\./g, "\\."), cr = (e) => e.map(String).map(Ei).join("."), dn = (e) => {
  const t = [];
  let n = "";
  for (let o = 0; o < e.length; o++) {
    let i = e.charAt(o);
    if (i === "\\" && e.charAt(o + 1) === ".") {
      n += ".", o++;
      continue;
    }
    if (i === ".") {
      t.push(n), n = "";
      continue;
    }
    n += i;
  }
  const r = n;
  return t.push(r), t;
};
function nt(e, t, n, r) {
  return {
    isApplicable: e,
    annotation: t,
    transform: n,
    untransform: r
  };
}
const Si = [
  nt(ji, "undefined", () => null, () => {
  }),
  nt(Pl, "bigint", (e) => e.toString(), (e) => typeof BigInt < "u" ? BigInt(e) : (console.error("Please add a BigInt polyfill."), e)),
  nt(Nl, "Date", (e) => e.toISOString(), (e) => new Date(e)),
  nt(Ml, "Error", (e, t) => {
    const n = {
      name: e.name,
      message: e.message
    };
    return t.allowedErrorProps.forEach((r) => {
      n[r] = e[r];
    }), n;
  }, (e, t) => {
    const n = new Error(e.message);
    return n.name = e.name, n.stack = e.stack, t.allowedErrorProps.forEach((r) => {
      n[r] = e[r];
    }), n;
  }),
  nt(Ol, "regexp", (e) => "" + e, (e) => {
    const t = e.slice(1, e.lastIndexOf("/")), n = e.slice(e.lastIndexOf("/") + 1);
    return new RegExp(t, n);
  }),
  nt(vn, "set", (e) => [...e.values()], (e) => new Set(e)),
  nt(mn, "map", (e) => [...e.entries()], (e) => new Map(e)),
  nt((e) => po(e) || Ll(e), "number", (e) => po(e) ? "NaN" : e > 0 ? "Infinity" : "-Infinity", Number),
  nt((e) => e === 0 && 1 / e === -1 / 0, "number", () => "-0", Number),
  nt(zl, "URL", (e) => e.toString(), (e) => new URL(e))
];
function qn(e, t, n, r) {
  return {
    isApplicable: e,
    annotation: t,
    transform: n,
    untransform: r
  };
}
const Ii = qn((e, t) => ki(e) ? !!t.symbolRegistry.getIdentifier(e) : !1, (e, t) => ["symbol", t.symbolRegistry.getIdentifier(e)], (e) => e.description, (e, t, n) => {
  const r = n.symbolRegistry.getValue(t[1]);
  if (!r) throw new Error("Trying to deserialize unknown symbol");
  return r;
}), Vl = [
  Int8Array,
  Uint8Array,
  Int16Array,
  Uint16Array,
  Int32Array,
  Uint32Array,
  Float32Array,
  Float64Array,
  Uint8ClampedArray
].reduce((e, t) => (e[t.name] = t, e), {}), Ti = qn(Dl, (e) => ["typed-array", e.constructor.name], (e) => [...e], (e, t) => {
  const n = Vl[t[1]];
  if (!n) throw new Error("Trying to deserialize unknown typed array");
  return new n(e);
});
function $i(e, t) {
  return e?.constructor ? !!t.classRegistry.getIdentifier(e.constructor) : !1;
}
const Ci = qn($i, (e, t) => ["class", t.classRegistry.getIdentifier(e.constructor)], (e, t) => {
  const n = t.classRegistry.getAllowedProps(e.constructor);
  if (!n) return { ...e };
  const r = {};
  return n.forEach((o) => {
    r[o] = e[o];
  }), r;
}, (e, t, n) => {
  const r = n.classRegistry.getValue(t[1]);
  if (!r) throw new Error(`Trying to deserialize unknown class '${t[1]}' - check https://github.com/blitz-js/superjson/issues/116#issuecomment-773996564`);
  return Object.assign(Object.create(r.prototype), e);
}), Ai = qn((e, t) => !!t.customTransformerRegistry.findApplicable(e), (e, t) => ["custom", t.customTransformerRegistry.findApplicable(e).name], (e, t) => t.customTransformerRegistry.findApplicable(e).serialize(e), (e, t, n) => {
  const r = n.customTransformerRegistry.findByName(t[1]);
  if (!r) throw new Error("Trying to deserialize unknown custom value");
  return r.deserialize(e);
}), Ul = [
  Ci,
  Ii,
  Ai,
  Ti
], fo = (e, t) => {
  const n = uo(Ul, (o) => o.isApplicable(e, t));
  if (n) return {
    value: n.transform(e, t),
    type: n.annotation(e, t)
  };
  const r = uo(Si, (o) => o.isApplicable(e, t));
  if (r) return {
    value: r.transform(e, t),
    type: r.annotation
  };
}, Oi = {};
Si.forEach((e) => {
  Oi[e.annotation] = e;
});
const Fl = (e, t, n) => {
  if (gt(t)) switch (t[0]) {
    case "symbol":
      return Ii.untransform(e, t, n);
    case "class":
      return Ci.untransform(e, t, n);
    case "custom":
      return Ai.untransform(e, t, n);
    case "typed-array":
      return Ti.untransform(e, t, n);
    default:
      throw new Error("Unknown transformation: " + t);
  }
  else {
    const r = Oi[t];
    if (!r) throw new Error("Unknown transformation: " + t);
    return r.untransform(e, n);
  }
}, Dt = (e, t) => {
  if (t > e.size) throw new Error("index out of bounds");
  const n = e.keys();
  for (; t > 0; )
    n.next(), t--;
  return n.next().value;
};
function Ni(e) {
  if (An(e, "__proto__")) throw new Error("__proto__ is not allowed as a property");
  if (An(e, "prototype")) throw new Error("prototype is not allowed as a property");
  if (An(e, "constructor")) throw new Error("constructor is not allowed as a property");
}
const Bl = (e, t) => {
  Ni(t);
  for (let n = 0; n < t.length; n++) {
    const r = t[n];
    if (vn(e)) e = Dt(e, +r);
    else if (mn(e)) {
      const o = +r, i = +t[++n] == 0 ? "key" : "value", a = Dt(e, o);
      switch (i) {
        case "key":
          e = a;
          break;
        case "value":
          e = e.get(a);
          break;
      }
    } else e = e[r];
  }
  return e;
}, kr = (e, t, n) => {
  if (Ni(t), t.length === 0) return n(e);
  let r = e;
  for (let i = 0; i < t.length - 1; i++) {
    const a = t[i];
    if (gt(r)) {
      const s = +a;
      r = r[s];
    } else if (gn(r)) r = r[a];
    else if (vn(r)) {
      const s = +a;
      r = Dt(r, s);
    } else if (mn(r)) {
      if (i === t.length - 2) break;
      const s = +a, c = +t[++i] == 0 ? "key" : "value", l = Dt(r, s);
      switch (c) {
        case "key":
          r = l;
          break;
        case "value":
          r = r.get(l);
          break;
      }
    }
  }
  const o = t[t.length - 1];
  if (gt(r) ? r[+o] = n(r[+o]) : gn(r) && (r[o] = n(r[o])), vn(r)) {
    const i = Dt(r, +o), a = n(i);
    i !== a && (r.delete(i), r.add(a));
  }
  if (mn(r)) {
    const i = +t[t.length - 2], a = Dt(r, i);
    switch (+o == 0 ? "key" : "value") {
      case "key": {
        const s = n(a);
        r.set(s, r.get(a)), s !== a && r.delete(a);
        break;
      }
      case "value":
        r.set(a, n(r.get(a)));
        break;
    }
  }
  return e;
};
function Er(e, t, n = []) {
  if (!e) return;
  if (!gt(e)) {
    Bt(e, (i, a) => Er(i, t, [...n, ...dn(a)]));
    return;
  }
  const [r, o] = e;
  o && Bt(o, (i, a) => {
    Er(i, t, [...n, ...dn(a)]);
  }), t(r, n);
}
function Wl(e, t, n) {
  return Er(t, (r, o) => {
    e = kr(e, o, (i) => Fl(i, r, n));
  }), e;
}
function Hl(e, t) {
  function n(r, o) {
    const i = Bl(e, dn(o));
    r.map(dn).forEach((a) => {
      e = kr(e, a, () => i);
    });
  }
  if (gt(t)) {
    const [r, o] = t;
    r.forEach((i) => {
      e = kr(e, dn(i), () => e);
    }), o && Bt(o, n);
  } else Bt(t, n);
  return e;
}
const Gl = (e, t) => gn(e) || gt(e) || mn(e) || vn(e) || $i(e, t);
function Yl(e, t, n) {
  const r = n.get(e);
  r ? r.push(t) : n.set(e, [t]);
}
function Kl(e, t) {
  const n = {};
  let r;
  return e.forEach((o) => {
    if (o.length <= 1) return;
    t || (o = o.map((s) => s.map(String)).sort((s, c) => s.length - c.length));
    const [i, ...a] = o;
    i.length === 0 ? r = a.map(cr) : n[cr(i)] = a.map(cr);
  }), r ? jr(n) ? [r] : [r, n] : jr(n) ? void 0 : n;
}
const Mi = (e, t, n, r, o = [], i = [], a = /* @__PURE__ */ new Map()) => {
  const s = Rl(e);
  if (!s) {
    Yl(e, o, t);
    const p = a.get(e);
    if (p) return r ? { transformedValue: null } : p;
  }
  if (!Gl(e, n)) {
    const p = fo(e, n), b = p ? {
      transformedValue: p.value,
      annotations: [p.type]
    } : { transformedValue: e };
    return s || a.set(e, b), b;
  }
  if (An(i, e)) return { transformedValue: null };
  const c = fo(e, n), l = c?.value ?? e, d = gt(l) ? [] : {}, f = {};
  Bt(l, (p, b) => {
    if (b === "__proto__" || b === "constructor" || b === "prototype") throw new Error(`Detected property ${b}. This is a prototype pollution risk, please remove it from your object.`);
    const w = Mi(p, t, n, r, [...o, b], [...i, e], a);
    d[b] = w.transformedValue, gt(w.annotations) ? f[b] = w.annotations : gn(w.annotations) && Bt(w.annotations, (v, h) => {
      f[Ei(b) + "." + h] = v;
    });
  });
  const m = jr(f) ? {
    transformedValue: d,
    annotations: c ? [c.type] : void 0
  } : {
    transformedValue: d,
    annotations: c ? [c.type, f] : f
  };
  return s || a.set(e, m), m;
};
function Ri(e) {
  return Object.prototype.toString.call(e).slice(8, -1);
}
function ho(e) {
  return Ri(e) === "Array";
}
function ql(e) {
  if (Ri(e) !== "Object") return !1;
  const t = Object.getPrototypeOf(e);
  return !!t && t.constructor === Object && t === Object.prototype;
}
function Xl(e, t, n, r, o) {
  const i = {}.propertyIsEnumerable.call(r, t) ? "enumerable" : "nonenumerable";
  i === "enumerable" && (e[t] = n), o && i === "nonenumerable" && Object.defineProperty(e, t, {
    value: n,
    enumerable: !1,
    writable: !0,
    configurable: !0
  });
}
function Sr(e, t = {}) {
  if (ho(e)) return e.map((o) => Sr(o, t));
  if (!ql(e)) return e;
  const n = Object.getOwnPropertyNames(e), r = Object.getOwnPropertySymbols(e);
  return [...n, ...r].reduce((o, i) => {
    if (ho(t.props) && !t.props.includes(i)) return o;
    const a = e[i];
    return Xl(o, i, Sr(a, t), e, t.nonenumerable), o;
  }, {});
}
var fe = class {
  /**
  * @param dedupeReferentialEqualities  If true, SuperJSON will make sure only one instance of referentially equal objects are serialized and the rest are replaced with `null`.
  */
  constructor({ dedupe: e = !1 } = {}) {
    this.classRegistry = new jl(), this.symbolRegistry = new xi((t) => t.description ?? ""), this.customTransformerRegistry = new Sl(), this.allowedErrorProps = [], this.dedupe = e;
  }
  serialize(e) {
    const t = /* @__PURE__ */ new Map(), n = Mi(e, t, this, this.dedupe), r = { json: n.transformedValue };
    n.annotations && (r.meta = {
      ...r.meta,
      values: n.annotations
    });
    const o = Kl(t, this.dedupe);
    return o && (r.meta = {
      ...r.meta,
      referentialEqualities: o
    }), r;
  }
  deserialize(e) {
    const { json: t, meta: n } = e;
    let r = Sr(t);
    return n?.values && (r = Wl(r, n.values, this)), n?.referentialEqualities && (r = Hl(r, n.referentialEqualities)), r;
  }
  stringify(e) {
    return JSON.stringify(this.serialize(e));
  }
  parse(e) {
    return this.deserialize(JSON.parse(e));
  }
  registerClass(e, t) {
    this.classRegistry.register(e, t);
  }
  registerSymbol(e, t) {
    this.symbolRegistry.register(e, t);
  }
  registerCustom(e, t) {
    this.customTransformerRegistry.register({
      name: t,
      ...e
    });
  }
  allowErrorProps(...e) {
    this.allowedErrorProps.push(...e);
  }
};
fe.defaultInstance = new fe();
fe.serialize = fe.defaultInstance.serialize.bind(fe.defaultInstance);
fe.deserialize = fe.defaultInstance.deserialize.bind(fe.defaultInstance);
fe.stringify = fe.defaultInstance.stringify.bind(fe.defaultInstance);
fe.parse = fe.defaultInstance.parse.bind(fe.defaultInstance);
fe.registerClass = fe.defaultInstance.registerClass.bind(fe.defaultInstance);
fe.registerSymbol = fe.defaultInstance.registerSymbol.bind(fe.defaultInstance);
fe.registerCustom = fe.defaultInstance.registerCustom.bind(fe.defaultInstance);
fe.allowErrorProps = fe.defaultInstance.allowErrorProps.bind(fe.defaultInstance);
U.__VUE_DEVTOOLS_KIT_MESSAGE_CHANNELS__ ??= [];
U.__VUE_DEVTOOLS_KIT_RPC_CLIENT__ ??= null;
U.__VUE_DEVTOOLS_KIT_RPC_SERVER__ ??= null;
U.__VUE_DEVTOOLS_KIT_VITE_RPC_CLIENT__ ??= null;
U.__VUE_DEVTOOLS_KIT_VITE_RPC_SERVER__ ??= null;
U.__VUE_DEVTOOLS_KIT_BROADCAST_RPC_SERVER__ ??= null;
/*!
 * pinia v4.0.3
 * (c) 2026 Eduardo San Martin Morote
 * @license MIT
 */
const Un = typeof window < "u", Jl = /* @__PURE__ */ Ks({
  reporters: [/* @__PURE__ */ Ws()],
  codes: {
    PINIA_R1001: {
      why: 'Directly pass all stores to "mapStores()" without putting them in an array. This will fail in production.',
      fix: "Replace mapStores([useAuthStore, useCartStore]) with mapStores(useAuthStore, useCartStore).",
      docs: "https://pinia.vuejs.org/cookbook/options-api.html#Giving-access-to-the-whole-store"
    },
    PINIA_R1002: {
      why: (e) => `A getter cannot have the same name as another state property. Found "${e.name}" in store "${e.id}".`,
      fix: "Rename either the getter or the state property.",
      docs: "https://pinia.vuejs.org/core-concepts/getters.html#Accessing-other-getters"
    },
    PINIA_R1003: {
      why: (e) => `The "state" must be a plain object. Found in store "${e.id}".`,
      fix: "Return a plain object, e.g. avoid state: () => new MyClass().",
      docs: "https://pinia.vuejs.org/core-concepts/state.html#State"
    },
    PINIA_R1004: {
      why: "Pinia instance not found in context. This falls back to the global activePinia, which exposes you to cross-request pollution on the server.",
      fix: '"useStore()" is a composable and follows the same rules: call it at the top of setup() (or another composable), or pass the pinia instance explicitly when used outside of a component.',
      docs: "https://pinia.vuejs.org/ssr/#Using-the-store-outside-of-setup-"
    },
    PINIA_R1005: {
      why: (e) => `The store id changed from "${e.from}" to "${e.to}", forcing a reload.`,
      docs: "https://pinia.vuejs.org/cookbook/hot-module-replacement.html#HMR-Hot-Module-Replacement-"
    },
    PINIA_R1006: {
      why: (e) => `Property "${e.key}" of store "${e.id}" is not reactive (not a ref, reactive object, or shallowRef), so storeToRefs() ignores it.`,
      fix: "If it should be reactive state, wrap it with ref(), reactive(), or shallowRef(). If it is an intentional non-reactive property, wrap it with markRaw() so storeToRefs() skips it explicitly.",
      docs: "https://pinia.vuejs.org/core-concepts/plugins.html#Adding-new-external-properties"
    },
    PINIA_R1007: {
      why: (e) => `The same callback was passed to "$subscribe()" of store "${e.id}" more than once. Subscriptions are deduplicated, so the duplicate is ignored.`,
      fix: "Subscribe each callback only once. If you need to resubscribe, call the returned function to remove the previous subscription first, or create a new function.",
      docs: "https://pinia.vuejs.org/core-concepts/state.html#Subscribing-to-the-state"
    }
  }
});
let Ir;
const Pi = (e) => Ir = e, Zl = process.env.NODE_ENV !== "production" ? () => {
  const e = no() && Ln(Tr);
  return !e && !Un && Jl.PINIA_R1004({}, { method: "error" }), e || Ir;
} : () => no() && Ln(Tr) || Ir, Tr = process.env.NODE_ENV !== "production" ? Symbol("pinia") : (
  /* istanbul ignore next */
  Symbol()
), go = typeof window == "object" && window.window === window ? window : typeof self == "object" && self.self === self ? self : typeof global == "object" && global.global === global ? global : typeof globalThis == "object" ? globalThis : { HTMLElement: null };
function Ql(e, { autoBom: t = !1 } = {}) {
  return t && /^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(e.type) ? new Blob(["\uFEFF", e], { type: e.type }) : e;
}
function Xr(e, t, n) {
  const r = new XMLHttpRequest();
  r.open("GET", e), r.responseType = "blob", r.onload = function() {
    zi(r.response, t, n);
  }, r.onerror = function() {
    console.error("could not download file");
  }, r.send();
}
function Li(e) {
  const t = new XMLHttpRequest();
  t.open("HEAD", e, !1);
  try {
    t.send();
  } catch {
  }
  return t.status >= 200 && t.status <= 299;
}
function On(e) {
  try {
    e.dispatchEvent(new MouseEvent("click"));
  } catch {
    const n = new MouseEvent("click", {
      bubbles: !0,
      cancelable: !0,
      view: window,
      detail: 0,
      screenX: 80,
      screenY: 20,
      clientX: 80,
      clientY: 20,
      ctrlKey: !1,
      altKey: !1,
      shiftKey: !1,
      metaKey: !1,
      button: 0,
      relatedTarget: null
    });
    e.dispatchEvent(n);
  }
}
const Nn = typeof navigator == "object" ? navigator : { userAgent: "" }, Di = /Macintosh/.test(Nn.userAgent) && /AppleWebKit/.test(Nn.userAgent) && !/Safari/.test(Nn.userAgent), zi = Un ? typeof HTMLAnchorElement < "u" && "download" in HTMLAnchorElement.prototype && !Di ? ec : "msSaveOrOpenBlob" in Nn ? tc : nc : () => {
};
function ec(e, t = "download", n) {
  const r = document.createElement("a");
  r.download = t, r.rel = "noopener", typeof e == "string" ? (r.href = e, r.origin !== location.origin ? Li(r.href) ? Xr(e, t, n) : (r.target = "_blank", On(r)) : On(r)) : (r.href = URL.createObjectURL(e), setTimeout(function() {
    URL.revokeObjectURL(r.href);
  }, 4e4), setTimeout(function() {
    On(r);
  }, 0));
}
function tc(e, t = "download", n) {
  if (typeof e == "string") if (Li(e)) Xr(e, t, n);
  else {
    const r = document.createElement("a");
    r.href = e, r.target = "_blank", setTimeout(function() {
      On(r);
    });
  }
  else navigator.msSaveOrOpenBlob(Ql(e, n), t);
}
function nc(e, t, n, r) {
  if (r = r || open("", "_blank"), r && (r.document.title = r.document.body.innerText = "downloading..."), typeof e == "string") return Xr(e, t, n);
  const o = e.type === "application/octet-stream", i = /constructor/i.test(String(go.HTMLElement)) || "safari" in go, a = /CriOS\/[\d]+/.test(navigator.userAgent);
  if ((a || o && i || Di) && typeof FileReader < "u") {
    const s = new FileReader();
    s.onloadend = function() {
      let c = s.result;
      if (typeof c != "string")
        throw r = null, new Error("Wrong reader.result type");
      c = a ? c : c.replace(/^data:[^;]*;/, "data:attachment/file;"), r ? r.location.href = c : location.assign(c), r = null;
    }, s.readAsDataURL(e);
  } else {
    const s = URL.createObjectURL(e);
    r ? r.location.assign(s) : location.href = s, r = null, setTimeout(function() {
      URL.revokeObjectURL(s);
    }, 4e4);
  }
}
function ke(e, t) {
  const n = "🍍 " + e;
  t === "error" ? console.error(n) : t === "warn" ? console.warn(n) : console.debug(n);
}
function Jr(e) {
  return "_a" in e && "install" in e;
}
function Vi(e, t) {
  const n = fn(e)[t];
  return Xo(n) && !hs(n);
}
function Ui() {
  if (!("clipboard" in navigator))
    return ke("Your browser doesn't support the Clipboard API", "error"), !0;
}
function Fi(e) {
  return e instanceof Error && e.message.toLowerCase().includes("document is not focused") ? (ke('You need to activate the "Emulate a focused page" setting in the "Rendering" panel of devtools.', "warn"), !0) : !1;
}
async function rc(e) {
  if (!Ui())
    try {
      await navigator.clipboard.writeText(JSON.stringify(e.state.value)), ke("Global state copied to clipboard.");
    } catch (t) {
      if (Fi(t)) return;
      ke("Failed to serialize the state. Check the console for more details.", "error"), console.error(t);
    }
}
async function oc(e) {
  if (!Ui())
    try {
      Bi(e, JSON.parse(await navigator.clipboard.readText())), ke("Global state pasted from clipboard.");
    } catch (t) {
      if (Fi(t)) return;
      ke("Failed to deserialize the state from clipboard. Check the console for more details.", "error"), console.error(t);
    }
}
async function ic(e) {
  try {
    zi(new Blob([JSON.stringify(e.state.value)], { type: "text/plain;charset=utf-8" }), "pinia-state.json");
  } catch (t) {
    ke("Failed to export the state as JSON. Check the console for more details.", "error"), console.error(t);
  }
}
let st;
function sc() {
  st || (st = document.createElement("input"), st.type = "file", st.accept = ".json");
  function e() {
    return new Promise((t, n) => {
      st.onchange = async () => {
        const r = st.files;
        if (!r) return t(null);
        const o = r.item(0);
        return t(o ? {
          text: await o.text(),
          file: o
        } : null);
      }, st.oncancel = () => t(null), st.onerror = n, st.click();
    });
  }
  return e;
}
async function ac(e) {
  try {
    const t = await sc()();
    if (!t) return;
    const { text: n, file: r } = t;
    Bi(e, JSON.parse(n)), ke(`Global state imported from "${r.name}".`);
  } catch (t) {
    ke("Failed to import the state from JSON. Check the console for more details.", "error"), console.error(t);
  }
}
function Bi(e, t) {
  for (const n in t) {
    const r = e.state.value[n];
    r ? Object.assign(r, t[n]) : e.state.value[n] = t[n];
  }
}
function Qe(e) {
  return { _custom: { display: e } };
}
const Wi = "🍍 Pinia (root)", lc = "_root";
function cc(e) {
  return Jr(e) ? {
    id: lc,
    label: Wi
  } : {
    id: e.$id,
    label: e.$id
  };
}
function uc(e) {
  if (Jr(e)) {
    const n = Array.from(e._s.keys()), r = e._s;
    return {
      state: n.map((o) => ({
        editable: !0,
        key: o,
        value: e.state.value[o]
      })),
      getters: n.filter((o) => r.get(o)._getters).map((o) => {
        const i = r.get(o);
        return {
          editable: !1,
          key: o,
          value: i._getters.reduce((a, s) => (a[s] = i[s], a), {})
        };
      })
    };
  }
  const t = { state: Object.keys(e.$state).map((n) => ({
    editable: !0,
    key: n,
    value: e.$state[n]
  })) };
  return e._getters && e._getters.length && (t.getters = e._getters.map((n) => ({
    editable: Vi(e, n),
    key: n,
    value: e[n]
  }))), e._customProperties.size && (t.customProperties = Array.from(e._customProperties).map((n) => ({
    editable: !0,
    key: n,
    value: e[n]
  }))), t;
}
function dc(e) {
  return e ? Array.isArray(e) ? e.reduce((t, n) => (t.keys.push(n.key), t.operations.push(n.type), t.oldValue[n.key] = n.oldValue, t.newValue[n.key] = n.newValue, t), {
    oldValue: {},
    keys: [],
    operations: [],
    newValue: {}
  }) : {
    operation: Qe(e.type),
    key: Qe(e.key),
    oldValue: e.oldValue,
    newValue: e.newValue
  } : {};
}
function pc(e) {
  switch (e) {
    case "direct":
      return "mutation";
    case "patch function":
      return "$patch";
    case "patch object":
      return "$patch";
    default:
      return "unknown";
  }
}
let zt = !0;
const Mn = [], kt = "pinia:mutations", Te = "pinia", { assign: fc } = Object, Fn = (e) => "🍍 " + e;
function hc(e, t) {
  _i({
    id: "dev.esm.pinia",
    label: "Pinia 🍍",
    logo: "https://pinia.vuejs.org/logo.svg",
    packageName: "pinia",
    homepage: "https://pinia.vuejs.org",
    componentStateTypes: Mn,
    app: e
  }, (n) => {
    typeof n.now != "function" && ke("You seem to be using an outdated version of Vue Devtools. Are you still using the Beta release instead of the stable one? You can find the links at https://devtools.vuejs.org/guide/installation.html."), n.addTimelineLayer({
      id: kt,
      label: "Pinia 🍍",
      color: 15064968
    }), n.addInspector({
      id: Te,
      label: "Pinia 🍍",
      icon: "storage",
      treeFilterPlaceholder: "Search stores",
      actions: [
        {
          icon: "content_copy",
          action: () => {
            rc(t);
          },
          tooltip: "Serialize and copy the state"
        },
        {
          icon: "content_paste",
          action: async () => {
            await oc(t), n.sendInspectorTree(Te), n.sendInspectorState(Te);
          },
          tooltip: "Replace the state with the content of your clipboard"
        },
        {
          icon: "save",
          action: () => {
            ic(t);
          },
          tooltip: "Save the state as a JSON file"
        },
        {
          icon: "folder_open",
          action: async () => {
            await ac(t), n.sendInspectorTree(Te), n.sendInspectorState(Te);
          },
          tooltip: "Import the state from a JSON file"
        }
      ],
      nodeActions: [{
        icon: "restore",
        tooltip: 'Reset the state (with "$reset")',
        action: (r) => {
          const o = t._s.get(r);
          o ? typeof o.$reset != "function" ? ke(`Cannot reset "${r}" store because it doesn't have a "$reset" method implemented.`, "warn") : (o.$reset(), ke(`Store "${r}" reset.`)) : ke(`Cannot reset "${r}" store because it wasn't found.`, "warn");
        }
      }]
    }), n.on.inspectComponent((r) => {
      const o = r.componentInstance && r.componentInstance.proxy;
      if (o && o._pStores) {
        const i = r.componentInstance.proxy._pStores;
        Object.values(i).forEach((a) => {
          r.instanceData.state.push({
            type: Fn(a.$id),
            key: "state",
            editable: !0,
            value: a._isOptionsAPI ? { _custom: {
              value: fn(a.$state),
              actions: [{
                icon: "restore",
                tooltip: "Reset the state of this store",
                action: () => a.$reset()
              }]
            } } : Object.keys(a.$state).reduce((s, c) => (s[c] = a.$state[c], s), {})
          }), a._getters && a._getters.length && r.instanceData.state.push({
            type: Fn(a.$id),
            key: "getters",
            editable: !1,
            value: a._getters.reduce((s, c) => {
              try {
                s[c] = a[c];
              } catch (l) {
                s[c] = l;
              }
              return s;
            }, {})
          });
        });
      }
    }), n.on.getInspectorTree((r) => {
      if (r.app === e && r.inspectorId === Te) {
        let o = [t];
        o = o.concat(Array.from(t._s.values())), r.rootNodes = (r.filter ? o.filter((i) => "$id" in i ? i.$id.toLowerCase().includes(r.filter.toLowerCase()) : Wi.toLowerCase().includes(r.filter.toLowerCase())) : o).map(cc);
      }
    }), globalThis.$pinia = t, n.on.getInspectorState((r) => {
      if (r.app === e && r.inspectorId === Te) {
        const o = r.nodeId === "_root" ? t : t._s.get(r.nodeId);
        if (!o) return;
        o && (r.nodeId !== "_root" && (globalThis.$store = fn(o)), r.state = uc(o));
      }
    }), n.on.editInspectorState((r) => {
      if (r.app === e && r.inspectorId === Te) {
        const o = r.nodeId === "_root" ? t : t._s.get(r.nodeId);
        if (!o) return ke(`store "${r.nodeId}" not found`, "error");
        const { path: i } = r;
        Jr(o) ? i.unshift("state") : (i.length !== 1 || !o._customProperties.has(i[0]) && !Vi(o, i[0]) || i[0] in o.$state) && i.unshift("$state"), zt = !1, r.set(o, i, r.state.value), zt = !0;
      }
    }), n.on.editComponentState((r) => {
      if (r.type.startsWith("🍍")) {
        const o = r.type.replace(/^🍍\s*/, ""), i = t._s.get(o);
        if (!i) return ke(`store "${o}" not found`, "error");
        const { path: a } = r;
        if (a[0] !== "state") return ke(`Invalid path for store "${o}":
${a}
Only state can be modified.`);
        a[0] = "$state", zt = !1, r.set(i, a, r.state.value), zt = !0;
      }
    });
  });
}
function gc(e, t) {
  Mn.includes(Fn(t.$id)) || Mn.push(Fn(t.$id)), _i({
    id: "dev.esm.pinia",
    label: "Pinia 🍍",
    logo: "https://pinia.vuejs.org/logo.svg",
    packageName: "pinia",
    homepage: "https://pinia.vuejs.org",
    componentStateTypes: Mn,
    app: e,
    settings: { logStoreChanges: {
      label: "Notify about new/deleted stores",
      type: "boolean",
      defaultValue: !0
    } }
  }, (n) => {
    const r = typeof n.now == "function" ? n.now.bind(n) : Date.now;
    t.$onAction(({ after: a, onError: s, name: c, args: l }) => {
      const d = Hi++;
      n.addTimelineEvent({
        layerId: kt,
        event: {
          time: r(),
          title: "🛫 " + c,
          subtitle: "start",
          data: {
            store: Qe(t.$id),
            action: Qe(c),
            args: l
          },
          groupId: d
        }
      }), a((f) => {
        ft = void 0, n.addTimelineEvent({
          layerId: kt,
          event: {
            time: r(),
            title: "🛬 " + c,
            subtitle: "end",
            data: {
              store: Qe(t.$id),
              action: Qe(c),
              args: l,
              result: f
            },
            groupId: d
          }
        });
      }), s((f) => {
        ft = void 0, n.addTimelineEvent({
          layerId: kt,
          event: {
            time: r(),
            logType: "error",
            title: "💥 " + c,
            subtitle: "end",
            data: {
              store: Qe(t.$id),
              action: Qe(c),
              args: l,
              error: f
            },
            groupId: d
          }
        });
      });
    }, !0), t._customProperties.forEach((a) => {
      _e(() => _(t[a]), (s, c) => {
        n.notifyComponentUpdate(), n.sendInspectorState(Te), zt && n.addTimelineEvent({
          layerId: kt,
          event: {
            time: r(),
            title: "Change",
            subtitle: a,
            data: {
              newValue: s,
              oldValue: c
            },
            groupId: ft
          }
        });
      }, { deep: !0 });
    }), t.$subscribe(({ events: a, type: s }, c) => {
      if (n.notifyComponentUpdate(), n.sendInspectorState(Te), !zt) return;
      const l = {
        time: r(),
        title: pc(s),
        data: fc({ store: Qe(t.$id) }, dc(a)),
        groupId: ft
      };
      s === "patch function" ? l.subtitle = "⤵️" : s === "patch object" ? l.subtitle = "🧩" : a && !Array.isArray(a) && (l.subtitle = a.type), a && (l.data["rawEvent(s)"] = { _custom: {
        display: "DebuggerEvent",
        type: "object",
        tooltip: "raw DebuggerEvent[]",
        value: a
      } }), n.addTimelineEvent({
        layerId: kt,
        event: l
      });
    }, {
      detached: !0,
      flush: "sync"
    });
    const o = t._hotUpdate;
    t._hotUpdate = qo((a) => {
      o(a), n.addTimelineEvent({
        layerId: kt,
        event: {
          time: r(),
          title: "🔥 " + t.$id,
          subtitle: "HMR update",
          data: {
            store: Qe(t.$id),
            info: Qe("HMR update")
          }
        }
      }), n.notifyComponentUpdate(), n.sendInspectorTree(Te), n.sendInspectorState(Te);
    });
    const { $dispose: i } = t;
    t.$dispose = () => {
      i(), n.notifyComponentUpdate(), n.sendInspectorTree(Te), n.sendInspectorState(Te), n.getSettings().logStoreChanges && ke(`Disposed "${t.$id}" store 🗑`);
    }, n.notifyComponentUpdate(), n.sendInspectorTree(Te), n.sendInspectorState(Te), n.getSettings().logStoreChanges && ke(`"${t.$id}" store installed 🆕`);
  });
}
let Hi = 0, ft;
function mo(e, t, n) {
  const r = t.reduce((o, i) => (o[i] = fn(e)[i], o), {});
  for (const o in r) e[o] = function() {
    const i = Hi, a = n ? new Proxy(e, {
      get(...c) {
        return ft = i, Reflect.get(...c);
      },
      set(...c) {
        return ft = i, Reflect.set(...c);
      }
    }) : e;
    ft = i;
    const s = r[o].apply(a, arguments);
    return ft = void 0, s;
  };
}
function mc({ app: e, store: t, options: n }) {
  if (!t.$id.startsWith("__hot:")) {
    if (t._isOptionsAPI = !!n.state, !t._p._testing) {
      mo(t, Object.keys(n.actions), t._isOptionsAPI);
      const r = t._hotUpdate;
      fn(t)._hotUpdate = function(o) {
        r.apply(this, arguments), mo(t, Object.keys(o._hmrPayload.actions), !!t._isOptionsAPI);
      };
    }
    gc(e, t);
  }
}
function vc() {
  const e = fs(!0), t = e.run(() => V({}));
  let n = [], r = [];
  const o = qo({
    install(i) {
      Pi(o), o._a = i, i.provide(Tr, o), i.config.globalProperties.$pinia = o, process.env.NODE_ENV !== "production" && process.env.NODE_ENV !== "test" && Un && hc(i, o), r.forEach((a) => n.push(a)), r = [];
    },
    use(i) {
      return this._a ? n.push(i) : r.push(i), this;
    },
    _p: n,
    _a: null,
    _e: e,
    _s: /* @__PURE__ */ new Map(),
    state: t
  });
  return process.env.NODE_ENV !== "production" && process.env.NODE_ENV !== "test" && Un && typeof Proxy < "u" && o.use(mc), o;
}
process.env.NODE_ENV !== "production" ? Symbol("pinia:skipHydration") : (
  /* istanbul ignore next */
  Symbol()
);
var bc = Object.defineProperty, yc = (e, t, n) => t in e ? bc(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n, Pt = (e, t, n) => yc(e, typeof t != "symbol" ? t + "" : t, n), _c = /* @__PURE__ */ Symbol("wippy:emit"), Gi = /* @__PURE__ */ Symbol("wippy:props"), wc = /* @__PURE__ */ Symbol("wippy:props_error"), xc = /* @__PURE__ */ Symbol("wippy:content"), jc = /* @__PURE__ */ Symbol("wippy:panel-id"), kc = /* @__PURE__ */ Symbol("wippy:layout-bus"), Ec = /* @__PURE__ */ Symbol("wippy:host"), Yi = /* @__PURE__ */ Symbol("wippy:host-visibility");
function Sc() {
  const e = Ln(Gi);
  if (!e)
    throw new Error("useProps() must be called inside a WippyVueElement");
  return e;
}
function Ic() {
  const e = Ln(Yi);
  if (!e)
    throw new Error("useHostVisibility() must be called inside a WippyVueElement");
  return e;
}
function Tc(e) {
  const t = Ic();
  let n = !1, r = null, o = !1;
  function i() {
    if (r)
      return o = !0, r;
    let a;
    try {
      a = Promise.resolve(e());
    } catch (c) {
      a = Promise.reject(c);
    }
    const s = a.finally(() => {
      if (r === s && (r = null, n && o))
        return o = !1, i();
    });
    return r = s, s;
  }
  return _n(() => (n = !0, i())), gs(() => {
    n = !1, o = !1;
  }), _e(t, (a, s) => {
    if (n && s === !1 && a === !0)
      return i();
  }), t;
}
var $c = class extends Vs {
  constructor() {
    super(...arguments), Pt(this, "_vueApp", null), Pt(this, "_propsRef", V({})), Pt(this, "_errorsRef", V([])), Pt(this, "_contentRef", V(null)), Pt(this, "_hostVisibilityRef", V(null)), Pt(this, "_bridgeAbort", null);
  }
  /**
   * Override to provide Vue-specific configuration.
   */
  static get vueConfig() {
    throw new Error("WippyVueElement subclass must override static get vueConfig()");
  }
  onMount(e, t, n, r, o, i) {
    const a = this.constructor.vueConfig;
    this._propsRef.value = n, this._errorsRef.value = r, this._contentRef.value = o ?? null, this._hostVisibilityRef.value = this.hostVisible;
    for (const l of r)
      this.emitEvent("invalid", { message: l });
    const s = new AbortController();
    this._bridgeAbort = s, this.reactive.props.subscribe((l, d) => {
      this._propsRef.value = l, this._errorsRef.value = [...d];
      for (const f of d)
        this.emitEvent("invalid", { message: f });
    }, { signal: s.signal }), this.reactive.content && this.reactive.content.subscribe((l) => {
      this._contentRef.value = l;
    }, { signal: s.signal }), this.reactive.hostVisibility.subscribe((l) => {
      this._hostVisibilityRef.value = l;
    }, { signal: s.signal });
    const c = (l) => {
      if (s.signal.aborted)
        return;
      const d = Zl(), f = ms(l.rootComponent);
      this._vueApp = f;
      const m = vc();
      if (l.piniaPlugins)
        for (const p of l.piniaPlugins)
          m.use(p);
      if (f.use(m), l.plugins)
        for (const p of l.plugins)
          f.use(p);
      f.provide(Gi, this._propsRef), f.provide(wc, this._errorsRef), f.provide(_c, this.emitEvent.bind(this)), f.provide(xc, this._contentRef), f.provide(Yi, this._hostVisibilityRef), f.provide(jc, Fs(this)), f.provide(kc, Us(this)), f.provide(Ec, Qo(this)), l.providers && l.providers(f, this), f.mount(t), d && Pi(d);
    };
    if (a.rootComponent)
      c(a);
    else if (a.lazyConfig) {
      const l = document.createElement("wippy-loading");
      l.setAttribute("no-bg", ""), t.appendChild(l), a.lazyConfig().then((d) => {
        s.signal.aborted || (l.remove(), c(d));
      }).catch((d) => {
        if (s.signal.aborted)
          return;
        const f = d instanceof Error ? d.message : String(d), m = document.createElement("wippy-error");
        m.setAttribute("title", "Failed to load"), m.setAttribute("message", f), l.replaceWith(m), this.emitEvent("error", { message: f });
      });
    } else
      throw new Error("WippyVueElement vueConfig must provide rootComponent or lazyConfig");
  }
  onUnmount() {
    this._bridgeAbort?.abort(), this._bridgeAbort = null, this._vueApp && (this._vueApp.unmount(), this._vueApp = null);
  }
};
const Cc = /* @__PURE__ */ new Set(["queued", "dispatched", "running"]);
function Bn(e) {
  return e ? e.running === !0 || Cc.has(String(e.status || "")) : !1;
}
function Se(e, t) {
  if (!e) return "";
  const n = Math.max(0, Math.floor(t - e));
  return n < 60 ? "just now" : n < 3600 ? `${Math.floor(n / 60)}m ago` : n < 86400 ? `${Math.floor(n / 3600)}h ago` : `${Math.floor(n / 86400)}d ago`;
}
function pt(e) {
  const t = Number(e);
  return Number.isFinite(t) && t > 0 ? Math.floor(t) : 0;
}
function Ac(e, t) {
  if (!e || e.status === "never") return "Not assembled yet";
  if (Bn(e)) return "Assembling the map…";
  if (e.status === "failed") return "Last assembly failed";
  const n = [], r = pt(e.edges_added), o = pt(e.edges_removed), i = pt(e.suggested_added);
  r && n.push(`+${r} structural`), o && n.push(`−${o} retired`), i && n.push(`+${i} suggested`), n.length || n.push("No change");
  const a = Se(e.finished_at || e.started_at, t);
  return a ? `${n.join(" · ")} · ${a}` : n.join(" · ");
}
function Oc(e) {
  if (!e || e.status === "never") return "Derive every relation the records already state.";
  if (Bn(e)) return "Replaying the journal and reconciling the map.";
  if (e.status === "failed") return e.error ? String(e.error) : "The last assembly did not finish.";
  const t = [`Replayed ${pt(e.events_replayed)} records.`];
  return pt(e.candidates_judged) && t.push(`Judged ${pt(e.candidates_judged)} candidate pairs on ${e.model || "the configured class"}.`), pt(e.suggested_removed) && t.push(`Replaced ${pt(e.suggested_removed)} earlier suggestions.`), e.refine_error && t.push(`Suggestions unavailable: ${e.refine_error}`), t.join(" ");
}
function vo(e) {
  const t = e.metadata?.order ?? e.attrs?.order, n = Number(t);
  return Number.isFinite(n) ? n : Number.MAX_SAFE_INTEGER;
}
function Nc(e, t) {
  const n = /* @__PURE__ */ new Map(), r = new Set(e.map((s) => s.id));
  for (const s of e) {
    const c = s.parent_id && r.has(s.parent_id) ? s.parent_id : "", l = n.get(c) || [];
    l.push(s), n.set(c, l);
  }
  for (const s of n.values()) s.sort((c, l) => vo(c) - vo(l) || c.label.localeCompare(l.label));
  const o = [], i = /* @__PURE__ */ new Set();
  function a(s, c) {
    for (const l of n.get(s) || []) {
      if (i.has(l.id)) continue;
      i.add(l.id);
      const d = (n.get(l.id)?.length || l.child_count || 0) > 0;
      o.push({ node: l, depth: c, expanded: t.has(l.id), hasChildren: d }), t.has(l.id) && a(l.id, c + 1);
    }
  }
  return a("", 0), o;
}
function Mc(e) {
  const t = e.filter((r) => !r.parent_id), n = new Set(t.map((r) => r.id));
  for (const r of e) r.parent_id && n.has(r.parent_id) && r.child_count > 0 && n.add(r.id);
  return n;
}
function Rc(e, t, n) {
  const r = Mc(e), o = /* @__PURE__ */ new Set();
  for (const i of e)
    (n.has(i.id) ? t.has(i.id) : r.has(i.id)) && o.add(i.id);
  return o;
}
function Wt(e) {
  const t = String(e.status || e.metadata?.outcome || "").toLowerCase();
  return ["folded", "failed", "abandoned", "inconclusive", "rejected", "superseded"].includes(t);
}
function Xn(e) {
  const t = String(e.status || e.metadata?.outcome || "").toLowerCase();
  return ["done", "closed", "completed", "resolved", "retired", "failed", "abandoned", "inconclusive", "rejected", "superseded"].includes(t);
}
function bn(e) {
  return /^(cursor|agent|operator)$/i.test(e.kind);
}
const Pc = 86400, ur = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i, bo = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
function $r(e) {
  return (e || "").trim().toLowerCase();
}
function Lc(e) {
  let t = 2166136261;
  for (let n = 0; n < e.length; n++)
    t ^= e.charCodeAt(n), t = Math.imul(t, 16777619) >>> 0;
  return bo[t % 26] + bo[(t >>> 8) % 26];
}
function Dc(e) {
  const t = e.split(/\s+/).filter(Boolean);
  return t.length ? t.length === 1 ? t[0].slice(0, 2).toUpperCase() : (t[0][0] + t[1][0]).toUpperCase() : "??";
}
function lt(e, t) {
  const n = (e || "").trim(), r = (t || "").trim(), o = (n.replace(/[^a-z0-9]/gi, "").slice(-6) || "unknown").toUpperCase(), i = r && !ur.test(r) ? r : n.replace(ur, " ").replace(/[-_.:/]+/g, " ").replace(/\s+/g, " ").trim(), a = !i || ur.test(n), s = i.length > 24 ? `${i.slice(0, 23)}…` : i, c = s ? s.charAt(0).toUpperCase() + s.slice(1) : "";
  return {
    label: c ? a ? `${c} ${o}` : c : `Agent ${o}`,
    initials: a ? Lc(n || o) : Dc(s),
    short: o
  };
}
function Vt(e, t) {
  const n = e.metadata?.[t] ?? e.attrs?.[t];
  return typeof n == "string" ? n : "";
}
function zc(e, t) {
  const n = new Map(e.map((o) => [o.id, o])), r = /* @__PURE__ */ new Map();
  for (const o of t)
    /^(positioned_at|focused_on|assigned_to)$/i.test(o.kind) && r.set(o.from, o.to);
  return e.filter(bn).map((o) => {
    const i = r.get(o.id) || Vt(o, "position"), a = i ? n.get(i) : void 0;
    return {
      id: o.id,
      label: o.label,
      initials: lt(o.id, o.label).initials,
      purpose: Vt(o, "purpose") || o.summary || "Recorded position",
      status: String(o.status || "active").toLowerCase(),
      next: Vt(o, "next") || void 0,
      exitCondition: Vt(o, "exit_condition") || void 0,
      positionId: a ? a.id : void 0,
      positionLabel: a ? a.label : i || void 0,
      updated_at: o.updated_at,
      source: "graph",
      stale: !1
    };
  });
}
function Vc(e) {
  return [e.id, e.semantic_key, Vt(e, "cursor_id"), Vt(e, "agent_id")].map($r).filter(Boolean);
}
function Uc(e) {
  return e.purpose ? e.purpose : e.checkpoint?.headline ? e.checkpoint.headline : e.origin === "auto" ? "Position tracked while working" : "Recorded position";
}
function yo(e, t, n) {
  const r = lt(e.agent_id || e.cursor_id), o = e.position && e.position.graph_id === n && t.has(e.position.node_id) ? t.get(e.position.node_id) : void 0, i = (e.last_touch?.positions || []).find((a) => a.graph_id === n && t.has(a.node_id));
  return {
    id: `cursor:${e.cursor_id}`,
    label: r.label,
    initials: r.initials,
    purpose: Uc(e),
    status: String(e.state || "active").toLowerCase(),
    positionId: o?.id,
    positionLabel: o?.label || e.position?.node_id,
    updated_at: e.updated_at,
    source: "cursor",
    origin: e.origin,
    cursorId: e.cursor_id,
    agentId: e.agent_id,
    lastSeenSeq: e.last_seen_seq,
    touchNodeId: i?.node_id,
    touchLabel: i?.label || e.last_touch?.positions?.[0]?.label || e.last_touch?.title,
    stale: !1
  };
}
function Fc(e, t, n, r, o) {
  const i = zc(e, t), a = new Map(i.map((l) => [l.id, l])), s = /* @__PURE__ */ new Map();
  for (const l of e) {
    const d = bn(l) ? a.get(l.id) : void 0;
    if (d)
      for (const f of Vc(l)) s.has(f) || s.set(f, d);
  }
  const c = new Map(e.map((l) => [l.id, l]));
  for (const l of n) {
    const d = s.get($r(l.cursor_id)) || s.get($r(l.agent_id));
    if (!d) {
      i.push(yo(l, c, r));
      continue;
    }
    const f = yo(l, c, r);
    d.source = "both", d.origin = l.origin, d.cursorId = l.cursor_id, d.agentId = l.agent_id, d.lastSeenSeq = l.last_seen_seq, d.updated_at = Math.max(d.updated_at, l.updated_at), d.touchNodeId = d.touchNodeId || f.touchNodeId, d.touchLabel = d.touchLabel || f.touchLabel, !d.positionId && f.positionId && (d.positionId = f.positionId, d.positionLabel = f.positionLabel);
  }
  for (const l of i) l.stale = o - l.updated_at > Pc;
  return i.sort((l, d) => d.updated_at - l.updated_at || l.label.localeCompare(d.label));
}
function Bc(e) {
  const t = /* @__PURE__ */ new Set();
  for (const n of e) n.touchNodeId && !n.stale && t.add(n.touchNodeId);
  return t;
}
const Wc = 3600, Hc = 86400;
function Gc(e, t) {
  const n = t - e;
  return n <= Wc ? "now" : n <= Hc ? "today" : "older";
}
function Ki(e, t) {
  const n = (e || "").trim();
  if (n) return n;
  const r = (t || "").trim();
  return r ? `cursor:${r}` : "";
}
function Yc(e) {
  return e === "auto" ? "Position tracked while working" : "Recorded position";
}
function Kc(e) {
  return {
    id: e,
    agentId: "",
    cursorId: "",
    label: "",
    initials: "",
    liveness: "older",
    purpose: "",
    headline: "",
    lastActivityAt: 0,
    openSpans: 0,
    factCount: 0,
    working: !1,
    origin: "",
    lastSeenSeq: 0
  };
}
function qc(e, t) {
  e.agentId = e.agentId || t.agentId, e.cursorId = e.cursorId || t.cursorId, e.origin = e.origin || t.origin, e.lastActivityAt = Math.max(e.lastActivityAt, t.lastActivityAt), e.lastSeenSeq = Math.max(e.lastSeenSeq, t.lastSeenSeq), e.factCount += t.factCount, e.openSpans += t.openSpans, e.purpose = e.purpose || t.purpose, e.headline = e.headline || t.headline;
}
function Xc(e, t, n) {
  const r = /* @__PURE__ */ new Map(), o = /* @__PURE__ */ new Map();
  function i(s, c) {
    const l = [(s || "").trim(), c ? `cursor:${c.trim()}` : ""].filter(Boolean), d = Ki(s, c) || `cursor:${r.size}`, f = [...new Set(l.map((w) => o.get(w)).filter(Boolean))], m = f[0] || d, p = r.get(m) || Kc(m);
    r.set(m, p);
    for (const w of f.slice(1)) {
      const v = r.get(w);
      v && (qc(p, v), r.delete(w));
      for (const [h, g] of o) g === w && o.set(h, m);
    }
    for (const w of l) o.set(w, m);
    p.agentId = p.agentId || (s || "").trim(), p.cursorId = p.cursorId || (c || "").trim(), p.id = p.agentId || (p.cursorId ? `cursor:${p.cursorId}` : m);
    const b = lt(p.agentId || p.cursorId);
    return p.label = b.label, p.initials = b.initials, p;
  }
  for (const s of e) {
    const c = i(s.agent_id, s.cursor_id);
    c.origin = s.origin || c.origin, c.lastActivityAt = Math.max(c.lastActivityAt, s.updated_at), c.lastSeenSeq = Math.max(c.lastSeenSeq, s.last_seen_seq || 0), c.purpose = s.purpose || s.checkpoint?.headline || c.purpose, c.headline = s.last_touch?.title || c.headline;
  }
  for (const s of [...t].sort((c, l) => c.last_activity_at - l.last_activity_at)) {
    const c = i(s.agent_id, s.cursor_id);
    c.origin = s.origin || c.origin, c.lastActivityAt = Math.max(c.lastActivityAt, s.last_activity_at, s.ended_at || 0), c.lastSeenSeq = Math.max(c.lastSeenSeq, s.last_seq || 0), c.factCount += s.fact_count || 0, s.state === "open" && (c.openSpans += 1), c.purpose = s.working_on?.text || c.purpose, c.headline = s.last_fact?.title || c.headline;
  }
  const a = [...r.values()];
  for (const s of a)
    s.working = s.openSpans > 0, s.liveness = Gc(s.lastActivityAt, n), s.purpose = s.purpose || s.headline || Yc(s.origin);
  return a.sort((s, c) => c.lastActivityAt - s.lastActivityAt || s.label.localeCompare(c.label));
}
function Jc(e) {
  const t = { now: [], today: [], older: [] };
  for (const n of e) t[n.liveness].push(n);
  return t;
}
function Zc(e) {
  const t = [];
  return e.now.length && t.push(`${e.now.length} now`), e.today.length && t.push(`${e.today.length} today`), e.older.length && t.push(`${e.older.length} older`), t.join(" · ");
}
function Qc(e, t) {
  const n = Se(e, t);
  return n === "just now" ? "now" : n.replace(" ago", "");
}
function eu(e, t, n) {
  if (e <= 0) return "";
  const r = `${e} ${e === 1 ? "agent" : "agents"}`, o = Qc(t, n);
  return o ? `${r} · ${o}` : r;
}
function tu(e, t, n) {
  const r = (e.agentId || "").trim(), o = (e.cursorId || "").trim(), i = new Set([r, o].filter(Boolean)), a = t.find((l) => i.has(l.cursor_id) || i.has(l.agent_id)), s = a?.position?.node_id ? a.position : a?.last_touch?.positions?.[0];
  if (s?.node_id)
    return { kind: "node", graphId: s.graph_id || "", nodeId: s.node_id };
  const c = [...n].sort((l, d) => (d.last_activity_at || 0) - (l.last_activity_at || 0)).find((l) => (i.has(l.agent_id || "") || i.has(l.cursor_id || "")) && (l.task_id || l.working_on?.kind === "task" && l.working_on.text));
  if (c) {
    const l = c.task_id || c.working_on?.text || "";
    if (l) return { kind: "task", taskId: l };
  }
  return { kind: "lanes" };
}
const nu = {
  class: "jr-agents-rail",
  "aria-label": "Agents in this journal"
}, ru = { class: "jr-section-label" }, ou = { class: "jr-numeric" }, iu = {
  key: 0,
  class: "jr-empty-small"
}, su = { class: "jr-eyebrow" }, au = { class: "jr-numeric" }, lu = ["title", "onClick"], cu = { class: "jr-avatar" }, uu = { class: "jr-agent-copy" }, du = { class: "jr-agent-purpose" }, pu = {
  key: 0,
  class: "jr-agent-headline"
}, fu = { class: "jr-agent-meta" }, hu = { class: "jr-numeric" }, gu = {
  key: 0,
  class: "jr-working"
}, mu = {
  key: 1,
  class: "jr-numeric"
}, vu = {
  key: 1,
  class: "jr-agent-tier tier-older"
}, bu = ["aria-expanded"], yu = { class: "jr-numeric" }, _u = ["title", "onClick"], wu = { class: "jr-avatar" }, xu = { class: "jr-agent-copy" }, ju = { class: "jr-agent-purpose" }, ku = { class: "jr-numeric" }, Eu = /* @__PURE__ */ Ne({
  __name: "AgentsRail",
  props: {
    cursors: {},
    spans: {},
    now: {},
    selectedAgent: {}
  },
  emits: ["agent"],
  setup(e, { emit: t }) {
    const n = e, r = t, o = V(!1), i = L(() => Xc(n.cursors, n.spans, n.now)), a = L(() => Jc(i.value)), s = L(() => Zc(a.value)), c = { now: "Now", today: "Today", older: "Earlier" };
    return (l, d) => (x(), j("section", nu, [
      u("h3", ru, [
        d[1] || (d[1] = u("span", null, "Agents", -1)),
        u("em", ou, y(s.value), 1)
      ]),
      i.value.length ? q("", !0) : (x(), j("p", iu, "No agent has written to this journal yet.")),
      (x(), j(K, null, re(["now", "today"], (f) => (x(), j(K, { key: f }, [
        a.value[f].length ? (x(), j("div", {
          key: 0,
          class: oe(["jr-agent-tier", `tier-${f}`])
        }, [
          u("h4", su, [
            J(y(c[f]) + " ", 1),
            u("span", au, y(a.value[f].length), 1)
          ]),
          (x(!0), j(K, null, re(a.value[f], (m) => (x(), j("button", {
            key: m.id,
            class: oe(["jr-agent-card", `tier-${m.liveness}`, { working: m.working, active: m.id === e.selectedAgent }]),
            title: `${m.purpose} · last wrote ${_(Se)(m.lastActivityAt, e.now)}`,
            onClick: (p) => r("agent", m)
          }, [
            u("span", cu, y(m.initials), 1),
            u("span", uu, [
              u("b", null, y(m.label), 1),
              u("small", du, y(m.purpose), 1),
              m.headline ? (x(), j("small", pu, y(m.headline), 1)) : q("", !0)
            ]),
            u("span", fu, [
              u("time", hu, y(_(Se)(m.lastActivityAt, e.now)), 1),
              m.working ? (x(), j("em", gu, "open span")) : (x(), j("em", mu, y(m.factCount) + " facts", 1))
            ])
          ], 10, lu))), 128))
        ], 2)) : q("", !0)
      ], 64))), 64)),
      a.value.older.length ? (x(), j("div", vu, [
        u("button", {
          class: "jr-agent-fold",
          "aria-expanded": o.value,
          onClick: d[0] || (d[0] = (f) => o.value = !o.value)
        }, [
          G(_(Z), {
            icon: o.value ? "tabler:chevron-down" : "tabler:chevron-right",
            "aria-hidden": "true"
          }, null, 8, ["icon"]),
          d[2] || (d[2] = u("span", null, "Earlier", -1)),
          u("em", yu, y(a.value.older.length), 1)
        ], 8, bu),
        o.value ? (x(!0), j(K, { key: 0 }, re(a.value.older, (f) => (x(), j("button", {
          key: f.id,
          class: oe(["jr-agent-card", "tier-older", { active: f.id === e.selectedAgent }]),
          title: `${f.purpose} · last wrote ${_(Se)(f.lastActivityAt, e.now)}`,
          onClick: (m) => r("agent", f)
        }, [
          u("span", wu, y(f.initials), 1),
          u("span", xu, [
            u("b", null, y(f.label), 1),
            u("small", ju, y(f.purpose), 1)
          ]),
          u("time", ku, y(_(Se)(f.lastActivityAt, e.now)), 1)
        ], 10, _u))), 128)) : q("", !0)
      ])) : q("", !0)
    ]));
  }
}), Su = {
  class: "jr-focus-path",
  "aria-label": "Focus path"
}, Iu = { class: "jr-focus-moves" }, Tu = ["disabled"], $u = ["disabled"], Cu = ["disabled"], Au = {
  key: 0,
  class: "jr-crumb-sep",
  "aria-hidden": "true"
}, Ou = ["title", "aria-current", "onClick"], Nu = /* @__PURE__ */ Ne({
  __name: "FocusPath",
  props: {
    focus: {},
    canBack: { type: Boolean },
    canForward: { type: Boolean }
  },
  emits: ["crumb", "back", "forward", "up"],
  setup(e, { emit: t }) {
    const n = e, r = t, o = V(null);
    _e(() => n.focus.length, () => Tt(() => {
      o.value && (o.value.scrollLeft = o.value.scrollWidth);
    }));
    const i = {
      journal: "tabler:notebook",
      graph: "tabler:topology-star-3",
      branch: "tabler:git-branch",
      node: "tabler:point"
    };
    return (a, s) => (x(), j("nav", Su, [
      u("div", Iu, [
        u("button", {
          disabled: !e.canBack,
          "aria-label": "Back",
          title: "Back (Alt+←)",
          onClick: s[0] || (s[0] = (c) => r("back"))
        }, [
          G(_(Z), {
            icon: "tabler:chevron-left",
            "aria-hidden": "true"
          })
        ], 8, Tu),
        u("button", {
          disabled: !e.canForward,
          "aria-label": "Forward",
          title: "Forward (Alt+→)",
          onClick: s[1] || (s[1] = (c) => r("forward"))
        }, [
          G(_(Z), {
            icon: "tabler:chevron-right",
            "aria-hidden": "true"
          })
        ], 8, $u),
        u("button", {
          disabled: e.focus.length < 2,
          "aria-label": "Step out one level",
          title: "Step out (Esc)",
          onClick: s[2] || (s[2] = (c) => r("up"))
        }, [
          G(_(Z), {
            icon: "tabler:arrow-back-up",
            "aria-hidden": "true"
          })
        ], 8, Cu)
      ]),
      u("ol", {
        ref_key: "path",
        ref: o,
        class: "jr-crumbs"
      }, [
        (x(!0), j(K, null, re(e.focus, (c, l) => (x(), j("li", {
          key: `${c.kind}:${c.id}`
        }, [
          l ? (x(), j("span", Au, "/")) : q("", !0),
          u("button", {
            class: oe(["jr-crumb", `kind-${c.kind}`, { current: l === e.focus.length - 1 }]),
            title: c.label,
            "aria-current": l === e.focus.length - 1 ? "true" : void 0,
            onClick: (d) => r("crumb", l)
          }, [
            G(_(Z), {
              icon: i[c.kind] || i.node,
              "aria-hidden": "true"
            }, null, 8, ["icon"]),
            u("span", null, y(c.label), 1)
          ], 10, Ou)
        ]))), 128))
      ], 512)
    ]));
  }
}), Mu = {
  class: "jr-catalog",
  "aria-label": "Journal graphs"
}, Ru = { class: "jr-section-label" }, Pu = { class: "jr-numeric" }, Lu = { class: "jr-catalog-grid" }, Du = ["onClick"], zu = { class: "jr-catalog-icon" }, Vu = { class: "jr-catalog-copy" }, Uu = {
  key: 0,
  class: "jr-catalog-presence"
}, Fu = ["title"], Bu = ["title"], Wu = {
  key: 0,
  class: "jr-empty-small"
}, Hu = /* @__PURE__ */ Ne({
  __name: "GraphCatalog",
  props: {
    graphs: {},
    graphId: {},
    now: {}
  },
  emits: ["graph"],
  setup(e, { emit: t }) {
    const n = e, r = t;
    function o(s) {
      return s === "current-work" || s === "work" ? "tabler:route" : s === "history" ? "tabler:history" : s === "governance" ? "tabler:gavel" : s === "experiments" ? "tabler:flask-2" : s === "research" || s === "alternatives" ? "tabler:microscope" : s === "audit" ? "tabler:list-check" : s === "specification" ? "tabler:file-description" : s === "curated" ? "tabler:bookmark" : "tabler:topology-star-3";
    }
    const i = L(() => {
      const s = /* @__PURE__ */ new Map(), c = new Set(n.graphs.map((m) => m.id));
      for (const m of n.graphs) {
        const p = m.parent_graph_id && c.has(m.parent_graph_id) ? m.parent_graph_id : "", b = s.get(p) || [];
        b.push(m), s.set(p, b);
      }
      const l = [], d = /* @__PURE__ */ new Set(), f = (m, p) => {
        for (const b of s.get(m) || [])
          d.has(b.id) || (d.add(b.id), l.push({ graph: b, depth: p }), f(b.id, p + 1));
      };
      f("", 0);
      for (const m of n.graphs) d.has(m.id) || l.push({ graph: m, depth: 0 });
      return l;
    });
    function a(s) {
      return eu(s.agent_count || 0, s.last_agent_activity_at || 0, n.now);
    }
    return (s, c) => (x(), j("section", Mu, [
      u("h3", Ru, [
        c[0] || (c[0] = u("span", null, "Graphs", -1)),
        u("em", Pu, y(e.graphs.length), 1)
      ]),
      u("div", Lu, [
        (x(!0), j(K, null, re(i.value, (l) => (x(), j("button", {
          key: l.graph.id,
          class: oe(["jr-catalog-row", { active: l.graph.id === e.graphId, nested: l.depth > 0 }]),
          style: Ee({ paddingInlineStart: `${9 + Math.min(l.depth, 5) * 11}px` }),
          onClick: (d) => r("graph", l.graph.id)
        }, [
          u("span", zu, [
            G(_(Z), {
              icon: o(l.graph.kind),
              "aria-hidden": "true"
            }, null, 8, ["icon"])
          ]),
          u("span", Vu, [
            u("b", null, y(l.graph.title), 1),
            a(l.graph) ? (x(), j("small", Uu, y(a(l.graph)), 1)) : (x(), j("small", {
              key: 1,
              title: l.graph.description
            }, y(l.graph.description || l.graph.kind), 9, Fu))
          ]),
          u("span", {
            class: "jr-catalog-count jr-numeric",
            title: `${l.graph.node_count} records · ${l.graph.edge_count} relations · revision ${l.graph.revision}`
          }, y(l.graph.node_count.toLocaleString()), 9, Bu)
        ], 14, Du))), 128))
      ]),
      e.graphs.length ? q("", !0) : (x(), j("p", Wu, "No graphs have been configured on this journal yet."))
    ]));
  }
}), qi = '(function(){"use strict";function $t(t,n){var e,r=1;t==null&&(t=0),n==null&&(n=0);function i(){var o,c=e.length,s,u=0,a=0;for(o=0;o<c;++o)s=e[o],u+=s.x,a+=s.y;for(u=(u/c-t)*r,a=(a/c-n)*r,o=0;o<c;++o)s=e[o],s.x-=u,s.y-=a}return i.initialize=function(o){e=o},i.x=function(o){return arguments.length?(t=+o,i):t},i.y=function(o){return arguments.length?(n=+o,i):n},i.strength=function(o){return arguments.length?(r=+o,i):r},i}function Ot(t){const n=+this._x.call(null,t),e=+this._y.call(null,t);return yt(this.cover(n,e),n,e,t)}function yt(t,n,e,r){if(isNaN(n)||isNaN(e))return t;var i,o=t._root,c={data:r},s=t._x0,u=t._y0,a=t._x1,p=t._y1,m,x,g,_,h,f,v,d;if(!o)return t._root=c,t;for(;o.length;)if((h=n>=(m=(s+a)/2))?s=m:a=m,(f=e>=(x=(u+p)/2))?u=x:p=x,i=o,!(o=o[v=f<<1|h]))return i[v]=c,t;if(g=+t._x.call(null,o.data),_=+t._y.call(null,o.data),n===g&&e===_)return c.next=o,i?i[v]=c:t._root=c,t;do i=i?i[v]=new Array(4):t._root=new Array(4),(h=n>=(m=(s+a)/2))?s=m:a=m,(f=e>=(x=(u+p)/2))?u=x:p=x;while((v=f<<1|h)===(d=(_>=x)<<1|g>=m));return i[d]=o,i[v]=c,t}function Pt(t){var n,e,r=t.length,i,o,c=new Array(r),s=new Array(r),u=1/0,a=1/0,p=-1/0,m=-1/0;for(e=0;e<r;++e)isNaN(i=+this._x.call(null,n=t[e]))||isNaN(o=+this._y.call(null,n))||(c[e]=i,s[e]=o,i<u&&(u=i),i>p&&(p=i),o<a&&(a=o),o>m&&(m=o));if(u>p||a>m)return this;for(this.cover(u,a).cover(p,m),e=0;e<r;++e)yt(this,c[e],s[e],t[e]);return this}function Rt(t,n){if(isNaN(t=+t)||isNaN(n=+n))return this;var e=this._x0,r=this._y0,i=this._x1,o=this._y1;if(isNaN(e))i=(e=Math.floor(t))+1,o=(r=Math.floor(n))+1;else{for(var c=i-e||1,s=this._root,u,a;e>t||t>=i||r>n||n>=o;)switch(a=(n<r)<<1|t<e,u=new Array(4),u[a]=s,s=u,c*=2,a){case 0:i=e+c,o=r+c;break;case 1:e=i-c,o=r+c;break;case 2:i=e+c,r=o-c;break;case 3:e=i-c,r=o-c;break}this._root&&this._root.length&&(this._root=s)}return this._x0=e,this._y0=r,this._x1=i,this._y1=o,this}function Bt(){var t=[];return this.visit(function(n){if(!n.length)do t.push(n.data);while(n=n.next)}),t}function Ct(t){return arguments.length?this.cover(+t[0][0],+t[0][1]).cover(+t[1][0],+t[1][1]):isNaN(this._x0)?void 0:[[this._x0,this._y0],[this._x1,this._y1]]}function D(t,n,e,r,i){this.node=t,this.x0=n,this.y0=e,this.x1=r,this.y1=i}function Yt(t,n,e){var r,i=this._x0,o=this._y0,c,s,u,a,p=this._x1,m=this._y1,x=[],g=this._root,_,h;for(g&&x.push(new D(g,i,o,p,m)),e==null?e=1/0:(i=t-e,o=n-e,p=t+e,m=n+e,e*=e);_=x.pop();)if(!(!(g=_.node)||(c=_.x0)>p||(s=_.y0)>m||(u=_.x1)<i||(a=_.y1)<o))if(g.length){var f=(c+u)/2,v=(s+a)/2;x.push(new D(g[3],f,v,u,a),new D(g[2],c,v,f,a),new D(g[1],f,s,u,v),new D(g[0],c,s,f,v)),(h=(n>=v)<<1|t>=f)&&(_=x[x.length-1],x[x.length-1]=x[x.length-1-h],x[x.length-1-h]=_)}else{var d=t-+this._x.call(null,g.data),w=n-+this._y.call(null,g.data),y=d*d+w*w;if(y<e){var A=Math.sqrt(e=y);i=t-A,o=n-A,p=t+A,m=n+A,r=g.data}}return r}function Xt(t){if(isNaN(p=+this._x.call(null,t))||isNaN(m=+this._y.call(null,t)))return this;var n,e=this._root,r,i,o,c=this._x0,s=this._y0,u=this._x1,a=this._y1,p,m,x,g,_,h,f,v;if(!e)return this;if(e.length)for(;;){if((_=p>=(x=(c+u)/2))?c=x:u=x,(h=m>=(g=(s+a)/2))?s=g:a=g,n=e,!(e=e[f=h<<1|_]))return this;if(!e.length)break;(n[f+1&3]||n[f+2&3]||n[f+3&3])&&(r=n,v=f)}for(;e.data!==t;)if(i=e,!(e=e.next))return this;return(o=e.next)&&delete e.next,i?(o?i.next=o:delete i.next,this):n?(o?n[f]=o:delete n[f],(e=n[0]||n[1]||n[2]||n[3])&&e===(n[3]||n[2]||n[1]||n[0])&&!e.length&&(r?r[v]=e:this._root=e),this):(this._root=o,this)}function Gt(t){for(var n=0,e=t.length;n<e;++n)this.remove(t[n]);return this}function Ht(){return this._root}function Kt(){var t=0;return this.visit(function(n){if(!n.length)do++t;while(n=n.next)}),t}function Qt(t){var n=[],e,r=this._root,i,o,c,s,u;for(r&&n.push(new D(r,this._x0,this._y0,this._x1,this._y1));e=n.pop();)if(!t(r=e.node,o=e.x0,c=e.y0,s=e.x1,u=e.y1)&&r.length){var a=(o+s)/2,p=(c+u)/2;(i=r[3])&&n.push(new D(i,a,p,s,u)),(i=r[2])&&n.push(new D(i,o,p,a,u)),(i=r[1])&&n.push(new D(i,a,c,s,p)),(i=r[0])&&n.push(new D(i,o,c,a,p))}return this}function Vt(t){var n=[],e=[],r;for(this._root&&n.push(new D(this._root,this._x0,this._y0,this._x1,this._y1));r=n.pop();){var i=r.node;if(i.length){var o,c=r.x0,s=r.y0,u=r.x1,a=r.y1,p=(c+u)/2,m=(s+a)/2;(o=i[0])&&n.push(new D(o,c,s,p,m)),(o=i[1])&&n.push(new D(o,p,s,u,m)),(o=i[2])&&n.push(new D(o,c,m,p,a)),(o=i[3])&&n.push(new D(o,p,m,u,a))}e.push(r)}for(;r=e.pop();)t(r.node,r.x0,r.y0,r.x1,r.y1);return this}function Jt(t){return t[0]}function Ut(t){return arguments.length?(this._x=t,this):this._x}function Zt(t){return t[1]}function qt(t){return arguments.length?(this._y=t,this):this._y}function ut(t,n,e){var r=new ft(n??Jt,e??Zt,NaN,NaN,NaN,NaN);return t==null?r:r.addAll(t)}function ft(t,n,e,r,i,o){this._x=t,this._y=n,this._x0=e,this._y0=r,this._x1=i,this._y1=o,this._root=void 0}function mt(t){for(var n={data:t.data},e=n;t=t.next;)e=e.next={data:t.data};return n}var W=ut.prototype=ft.prototype;W.copy=function(){var t=new ft(this._x,this._y,this._x0,this._y0,this._x1,this._y1),n=this._root,e,r;if(!n)return t;if(!n.length)return t._root=mt(n),t;for(e=[{source:n,target:t._root=new Array(4)}];n=e.pop();)for(var i=0;i<4;++i)(r=n.source[i])&&(r.length?e.push({source:r,target:n.target[i]=new Array(4)}):n.target[i]=mt(r));return t},W.add=Ot,W.addAll=Pt,W.cover=Rt,W.data=Bt,W.extent=Ct,W.find=Yt,W.remove=Xt,W.removeAll=Gt,W.root=Ht,W.size=Kt,W.visit=Qt,W.visitAfter=Vt,W.x=Ut,W.y=qt;function L(t){return function(){return t}}function Y(t){return(t()-.5)*1e-6}function tn(t){return t.x+t.vx}function nn(t){return t.y+t.vy}function en(t){var n,e,r,i=1,o=1;typeof t!="function"&&(t=L(t==null?1:+t));function c(){for(var a,p=n.length,m,x,g,_,h,f,v=0;v<o;++v)for(m=ut(n,tn,nn).visitAfter(s),a=0;a<p;++a)x=n[a],h=e[x.index],f=h*h,g=x.x+x.vx,_=x.y+x.vy,m.visit(d);function d(w,y,A,S,z){var j=w.data,F=w.r,I=h+F;if(j){if(j.index>x.index){var R=g-j.x-j.vx,B=_-j.y-j.vy,E=R*R+B*B;E<I*I&&(R===0&&(R=Y(r),E+=R*R),B===0&&(B=Y(r),E+=B*B),E=(I-(E=Math.sqrt(E)))/E*i,x.vx+=(R*=E)*(I=(F*=F)/(f+F)),x.vy+=(B*=E)*I,j.vx-=R*(I=1-I),j.vy-=B*I)}return}return y>g+I||S<g-I||A>_+I||z<_-I}}function s(a){if(a.data)return a.r=e[a.data.index];for(var p=a.r=0;p<4;++p)a[p]&&a[p].r>a.r&&(a.r=a[p].r)}function u(){if(n){var a,p=n.length,m;for(e=new Array(p),a=0;a<p;++a)m=n[a],e[m.index]=+t(m,a,n)}}return c.initialize=function(a,p){n=a,r=p,u()},c.iterations=function(a){return arguments.length?(o=+a,c):o},c.strength=function(a){return arguments.length?(i=+a,c):i},c.radius=function(a){return arguments.length?(t=typeof a=="function"?a:L(+a),u(),c):t},c}function rn(t){return t.index}function _t(t,n){var e=t.get(n);if(!e)throw new Error("node not found: "+n);return e}function on(t){var n=rn,e=m,r,i=L(30),o,c,s,u,a,p=1;t==null&&(t=[]);function m(f){return 1/Math.min(s[f.source.index],s[f.target.index])}function x(f){for(var v=0,d=t.length;v<p;++v)for(var w=0,y,A,S,z,j,F,I;w<d;++w)y=t[w],A=y.source,S=y.target,z=S.x+S.vx-A.x-A.vx||Y(a),j=S.y+S.vy-A.y-A.vy||Y(a),F=Math.sqrt(z*z+j*j),F=(F-o[w])/F*f*r[w],z*=F,j*=F,S.vx-=z*(I=u[w]),S.vy-=j*I,A.vx+=z*(I=1-I),A.vy+=j*I}function g(){if(c){var f,v=c.length,d=t.length,w=new Map(c.map((A,S)=>[n(A,S,c),A])),y;for(f=0,s=new Array(v);f<d;++f)y=t[f],y.index=f,typeof y.source!="object"&&(y.source=_t(w,y.source)),typeof y.target!="object"&&(y.target=_t(w,y.target)),s[y.source.index]=(s[y.source.index]||0)+1,s[y.target.index]=(s[y.target.index]||0)+1;for(f=0,u=new Array(d);f<d;++f)y=t[f],u[f]=s[y.source.index]/(s[y.source.index]+s[y.target.index]);r=new Array(d),_(),o=new Array(d),h()}}function _(){if(c)for(var f=0,v=t.length;f<v;++f)r[f]=+e(t[f],f,t)}function h(){if(c)for(var f=0,v=t.length;f<v;++f)o[f]=+i(t[f],f,t)}return x.initialize=function(f,v){c=f,a=v,g()},x.links=function(f){return arguments.length?(t=f,g(),x):t},x.id=function(f){return arguments.length?(n=f,x):n},x.iterations=function(f){return arguments.length?(p=+f,x):p},x.strength=function(f){return arguments.length?(e=typeof f=="function"?f:L(+f),_(),x):e},x.distance=function(f){return arguments.length?(i=typeof f=="function"?f:L(+f),h(),x):i},x}var sn={value:()=>{}};function wt(){for(var t=0,n=arguments.length,e={},r;t<n;++t){if(!(r=arguments[t]+"")||r in e||/[\\s.]/.test(r))throw new Error("illegal type: "+r);e[r]=[]}return new et(e)}function et(t){this._=t}function an(t,n){return t.trim().split(/^|\\s+/).map(function(e){var r="",i=e.indexOf(".");if(i>=0&&(r=e.slice(i+1),e=e.slice(0,i)),e&&!n.hasOwnProperty(e))throw new Error("unknown type: "+e);return{type:e,name:r}})}et.prototype=wt.prototype={constructor:et,on:function(t,n){var e=this._,r=an(t+"",e),i,o=-1,c=r.length;if(arguments.length<2){for(;++o<c;)if((i=(t=r[o]).type)&&(i=cn(e[i],t.name)))return i;return}if(n!=null&&typeof n!="function")throw new Error("invalid callback: "+n);for(;++o<c;)if(i=(t=r[o]).type)e[i]=Mt(e[i],t.name,n);else if(n==null)for(i in e)e[i]=Mt(e[i],t.name,null);return this},copy:function(){var t={},n=this._;for(var e in n)t[e]=n[e].slice();return new et(t)},call:function(t,n){if((i=arguments.length-2)>0)for(var e=new Array(i),r=0,i,o;r<i;++r)e[r]=arguments[r+2];if(!this._.hasOwnProperty(t))throw new Error("unknown type: "+t);for(o=this._[t],r=0,i=o.length;r<i;++r)o[r].value.apply(n,e)},apply:function(t,n,e){if(!this._.hasOwnProperty(t))throw new Error("unknown type: "+t);for(var r=this._[t],i=0,o=r.length;i<o;++i)r[i].value.apply(n,e)}};function cn(t,n){for(var e=0,r=t.length,i;e<r;++e)if((i=t[e]).name===n)return i.value}function Mt(t,n,e){for(var r=0,i=t.length;r<i;++r)if(t[r].name===n){t[r]=sn,t=t.slice(0,r).concat(t.slice(r+1));break}return e!=null&&t.push({name:n,value:e}),t}var Q=0,Z=0,q=0,bt=1e3,rt,tt,it=0,X=0,ot=0,nt=typeof performance=="object"&&performance.now?performance:Date,Nt=typeof window=="object"&&window.requestAnimationFrame?window.requestAnimationFrame.bind(window):function(t){setTimeout(t,17)};function At(){return X||(Nt(un),X=nt.now()+ot)}function un(){X=0}function lt(){this._call=this._time=this._next=null}lt.prototype=kt.prototype={constructor:lt,restart:function(t,n,e){if(typeof t!="function")throw new TypeError("callback is not a function");e=(e==null?At():+e)+(n==null?0:+n),!this._next&&tt!==this&&(tt?tt._next=this:rt=this,tt=this),this._call=t,this._time=e,ht()},stop:function(){this._call&&(this._call=null,this._time=1/0,ht())}};function kt(t,n,e){var r=new lt;return r.restart(t,n,e),r}function fn(){At(),++Q;for(var t=rt,n;t;)(n=X-t._time)>=0&&t._call.call(void 0,n),t=t._next;--Q}function It(){X=(it=nt.now())+ot,Q=Z=0;try{fn()}finally{Q=0,hn(),X=0}}function ln(){var t=nt.now(),n=t-it;n>bt&&(ot-=n,it=t)}function hn(){for(var t,n=rt,e,r=1/0;n;)n._call?(r>n._time&&(r=n._time),t=n,n=n._next):(e=n._next,n._next=null,n=t?t._next=e:rt=e);tt=t,ht(r)}function ht(t){if(!Q){Z&&(Z=clearTimeout(Z));var n=t-X;n>24?(t<1/0&&(Z=setTimeout(It,t-nt.now()-ot)),q&&(q=clearInterval(q))):(q||(it=nt.now(),q=setInterval(ln,bt)),Q=1,Nt(It))}}const pn=1664525,gn=1013904223,Et=4294967296;function vn(){let t=1;return()=>(t=(pn*t+gn)%Et)/Et}function dn(t){return t.x}function xn(t){return t.y}var yn=10,mn=Math.PI*(3-Math.sqrt(5));function _n(t){var n,e=1,r=.001,i=1-Math.pow(r,1/300),o=0,c=.6,s=new Map,u=kt(m),a=wt("tick","end"),p=vn();t==null&&(t=[]);function m(){x(),a.call("tick",n),e<r&&(u.stop(),a.call("end",n))}function x(h){var f,v=t.length,d;h===void 0&&(h=1);for(var w=0;w<h;++w)for(e+=(o-e)*i,s.forEach(function(y){y(e)}),f=0;f<v;++f)d=t[f],d.fx==null?d.x+=d.vx*=c:(d.x=d.fx,d.vx=0),d.fy==null?d.y+=d.vy*=c:(d.y=d.fy,d.vy=0);return n}function g(){for(var h=0,f=t.length,v;h<f;++h){if(v=t[h],v.index=h,v.fx!=null&&(v.x=v.fx),v.fy!=null&&(v.y=v.fy),isNaN(v.x)||isNaN(v.y)){var d=yn*Math.sqrt(.5+h),w=h*mn;v.x=d*Math.cos(w),v.y=d*Math.sin(w)}(isNaN(v.vx)||isNaN(v.vy))&&(v.vx=v.vy=0)}}function _(h){return h.initialize&&h.initialize(t,p),h}return g(),n={tick:x,restart:function(){return u.restart(m),n},stop:function(){return u.stop(),n},nodes:function(h){return arguments.length?(t=h,g(),s.forEach(_),n):t},alpha:function(h){return arguments.length?(e=+h,n):e},alphaMin:function(h){return arguments.length?(r=+h,n):r},alphaDecay:function(h){return arguments.length?(i=+h,n):+i},alphaTarget:function(h){return arguments.length?(o=+h,n):o},velocityDecay:function(h){return arguments.length?(c=1-h,n):1-c},randomSource:function(h){return arguments.length?(p=h,s.forEach(_),n):p},force:function(h,f){return arguments.length>1?(f==null?s.delete(h):s.set(h,_(f)),n):s.get(h)},find:function(h,f,v){var d=0,w=t.length,y,A,S,z,j;for(v==null?v=1/0:v*=v,d=0;d<w;++d)z=t[d],y=h-z.x,A=f-z.y,S=y*y+A*A,S<v&&(j=z,v=S);return j},on:function(h,f){return arguments.length>1?(a.on(h,f),n):a.on(h)}}}function wn(){var t,n,e,r,i=L(-30),o,c=1,s=1/0,u=.81;function a(g){var _,h=t.length,f=ut(t,dn,xn).visitAfter(m);for(r=g,_=0;_<h;++_)n=t[_],f.visit(x)}function p(){if(t){var g,_=t.length,h;for(o=new Array(_),g=0;g<_;++g)h=t[g],o[h.index]=+i(h,g,t)}}function m(g){var _=0,h,f,v=0,d,w,y;if(g.length){for(d=w=y=0;y<4;++y)(h=g[y])&&(f=Math.abs(h.value))&&(_+=h.value,v+=f,d+=f*h.x,w+=f*h.y);g.x=d/v,g.y=w/v}else{h=g,h.x=h.data.x,h.y=h.data.y;do _+=o[h.data.index];while(h=h.next)}g.value=_}function x(g,_,h,f){if(!g.value)return!0;var v=g.x-n.x,d=g.y-n.y,w=f-_,y=v*v+d*d;if(w*w/u<y)return y<s&&(v===0&&(v=Y(e),y+=v*v),d===0&&(d=Y(e),y+=d*d),y<c&&(y=Math.sqrt(c*y)),n.vx+=v*g.value*r/y,n.vy+=d*g.value*r/y),!0;if(g.length||y>=s)return;(g.data!==n||g.next)&&(v===0&&(v=Y(e),y+=v*v),d===0&&(d=Y(e),y+=d*d),y<c&&(y=Math.sqrt(c*y)));do g.data!==n&&(w=o[g.data.index]*r/y,n.vx+=v*w,n.vy+=d*w);while(g=g.next)}return a.initialize=function(g,_){t=g,e=_,p()},a.strength=function(g){return arguments.length?(i=typeof g=="function"?g:L(+g),p(),a):i},a.distanceMin=function(g){return arguments.length?(c=g*g,a):Math.sqrt(c)},a.distanceMax=function(g){return arguments.length?(s=g*g,a):Math.sqrt(s)},a.theta=function(g){return arguments.length?(u=g*g,a):Math.sqrt(u)},a}function Mn(t){var n=L(.1),e,r,i;typeof t!="function"&&(t=L(t==null?0:+t));function o(s){for(var u=0,a=e.length,p;u<a;++u)p=e[u],p.vx+=(i[u]-p.x)*r[u]*s}function c(){if(e){var s,u=e.length;for(r=new Array(u),i=new Array(u),s=0;s<u;++s)r[s]=isNaN(i[s]=+t(e[s],s,e))?0:+n(e[s],s,e)}}return o.initialize=function(s){e=s,c()},o.strength=function(s){return arguments.length?(n=typeof s=="function"?s:L(+s),c(),o):n},o.x=function(s){return arguments.length?(t=typeof s=="function"?s:L(+s),c(),o):t},o}function bn(t){var n=L(.1),e,r,i;typeof t!="function"&&(t=L(t==null?0:+t));function o(s){for(var u=0,a=e.length,p;u<a;++u)p=e[u],p.vy+=(i[u]-p.y)*r[u]*s}function c(){if(e){var s,u=e.length;for(r=new Array(u),i=new Array(u),s=0;s<u;++s)r[s]=isNaN(i[s]=+t(e[s],s,e))?0:+n(e[s],s,e)}}return o.initialize=function(s){e=s,c()},o.strength=function(s){return arguments.length?(n=typeof s=="function"?s:L(+s),c(),o):n},o.y=function(s){return arguments.length?(t=typeof s=="function"?s:L(+s),c(),o):t},o}const Nn={project:"anchor",charter:"anchor",program:"anchor",workstream:"anchor",work_unit:"anchor",work:"anchor",task:"anchor",run:"anchor",milestone:"anchor",history:"anchor",era:"anchor",stage:"anchor",ontology:"anchor",subject:"anchor",goal:"anchor",epic:"anchor",phase:"anchor",invariant:"rule",constraint:"rule",rule:"rule",rule_set:"rule",design_rule:"rule",definition:"rule",requirement:"rule",governance:"rule",design:"rule",specification:"rule",policy:"rule",claim:"rule",schema:"rule",decision:"decision",approach:"decision",candidate:"decision",alternative:"decision",choice:"decision",selection:"decision",tradeoff:"decision",evidence:"evidence",proof:"evidence",experiment:"evidence",experiment_set:"evidence",observation:"evidence",audit:"evidence",artifact:"evidence",reference:"evidence",paper:"evidence",verification:"evidence",acceptance:"evidence",reflection:"evidence",integration_receipt:"evidence",measurement:"evidence",benchmark:"evidence",risk:"risk",failure:"risk",contradiction:"risk",reopening:"risk",legacy:"risk",rejected_approach:"risk",false_green:"risk",blocker:"risk",threat:"risk",conflict:"risk",regression:"risk",incident:"risk",question:"open",research_question:"open",proof_obligation:"open",obligation:"open",gate:"open",hypothesis:"open",unknown:"open",assumption:"open",agent:"agent",cursor:"agent",operator:"agent"};function pt(t){return Nn[String(t||"").toLowerCase()]||"note"}const An={anchor:"var(--jr-accent)",rule:"var(--jr-rule)",decision:"var(--jr-decision)",evidence:"var(--jr-evidence)",risk:"var(--jr-danger)",open:"var(--jr-warn)",agent:"var(--jr-accent-strong)",note:"var(--jr-muted)"};function kn(t){return An[pt(t)]}const In={contains:"structure",owns:"structure",precedes:"structure",next:"structure",defines:"structure",delegates:"structure",projects_from:"structure",binds:"structure",used_by:"structure",part_of:"structure",includes:"structure",supports:"support",verifies:"support",evaluates:"support",requires_proof:"support",candidate_for:"support",learned_from:"support",governed_by:"support",governs:"support",motivates:"support",informs:"support",cites:"support",relates:"support",duplicates:"support",contradicts:"conflict",conflicts:"conflict",refutes:"conflict",rejects:"conflict",blocks:"conflict",threatens:"conflict",deletes:"conflict",invalidates:"conflict",superseded_by:"succession",supersedes:"succession",selects:"succession",requires_integration:"succession",replaced_by:"succession",causes:"succession",positioned_at:"presence",focused_on:"presence",assigned_to:"presence"};function En(t){return In[String(t||"").toLowerCase()]||"support"}function jt(t){return En(t.kind)==="presence"}function gt(t){let n=2166136261;for(let e=0;e<t.length;e++)n^=t.charCodeAt(e),n=Math.imul(n,16777619);return n>>>0}function jn(t){let n=t||1;return()=>(n=Math.imul(1664525,n)+1013904223>>>0,n/4294967296)}const Sn=new Set([...`iljtIfr.,;:\'"!|()[]{} `]),zn=new Set([..."MWmw@%&"]);function st(t,n=9){let e=0;for(const r of t)e+=Sn.has(r)?2.5:zn.has(r)?7.6:4.95;return e*n/9}function Dn(t,n=128,e=2){const r=String(t||"").trim().split(/\\s+/).filter(Boolean);if(!r.length)return["untitled"];const i=[];let o="";for(const s of r){const u=o?`${o} ${s}`:s;o&&st(u)>n&&i.length<e-1?(i.push(o),o=s):o=u}i.push(o);const c=i.length-1;if(st(i[c])>n){let s=i[c];for(;s.length>1&&st(`${s}…`)>n;)s=s.slice(0,-1);i[c]=`${s.trimEnd()}…`}return i}function Wn(t,n){const e=6.6+Math.sqrt(Math.max(0,t))*3.1,r=n==="anchor"?1.12:n==="note"?.86:1;return Math.min(17.5,e)*r}const Ln=10.4;function Tn(t,n,e=!1){const r=pt(t.kind),i=Wn(n,r),o=Dn(t.label,e?132:112,e?2:1),c=Math.max(...o.map(s=>st(s)));return{radius:i,lines:o,halfWidth:Math.max(i+3,c/2+4),top:i+3,bottom:i+6+o.length*Ln}}function St(t,n){return t.bottom+n.top}function Fn(t){return Math.max(t.halfWidth,(t.top+t.bottom)/2)}const $n=.25,zt=420;function On(t,n){let e=1/0,r=-1/0;for(const i of t){const[o,c]=n(i);o<e&&(e=o),c>r&&(r=c)}return[e,r]}function Pn(t){const n=new Map;for(const e of t)jt(e)||(n.set(e.from,(n.get(e.from)||0)+1),n.set(e.to,(n.get(e.to)||0)+1));return n}function vt(t){const n=t.x??t.metadata?.x,e=t.y??t.metadata?.y;if(n==null||n===""||e===void 0||e===null||e==="")return;const r=Number(n),i=Number(e);return Number.isFinite(r)&&Number.isFinite(i)?[r,i]:void 0}function Rn(t,n,e,r,i,o){const c=o?void 0:vt(t);if(c)return c;const s=i?.get(t.id);if(s)return[s.px,s.py];const u=gt(`${t.kind}:${t.id}`),a=u%360/180*Math.PI,p=.25+(u>>>9)%48/80,m=(n%7-3)*5;return[e/2+Math.cos(a)*(e/2)*p+m,r/2+Math.sin(a)*(r/2)*p-m]}function Bn(t,n,e=920,r=620,i=new Set,o,c,s){const u=t,a=!!s?.unpin,p=Pn(n),m=new Map(u.map(l=>[l.id,Tn(l,p.get(l.id)||0,i.has(l.id))]));let x=0;if(o?.size)for(const l of u)o.has(l.id)&&x++;const g=x>0&&(u.length-x)/u.length>$n,_=u.map((l,M)=>{const N=m.get(l.id),b=c?.get(l.id),$=a?void 0:vt(l),[P,T]=b?[b.px,b.py]:Rn(l,M,e,r,o,a),O=Math.max(N.halfWidth,Math.min(e-N.halfWidth,P)),H=Math.max(N.top,Math.min(r-N.bottom,T)),C=!g&&o?.has(l.id);return{id:l.id,record:l,box:N,x:O,y:H,vx:0,vy:0,fx:$||b||C?O:null,fy:$||b||C?H:null}}),h=new Set(_.map(l=>l.id)),f=new Map(u.map(l=>[l.id,l])),v=l=>{let M=l;const N=new Set([M.id]);for(;M.parent_id&&f.has(M.parent_id)&&!N.has(M.parent_id);){const b=f.get(M.parent_id);if(!b.parent_id||!f.has(b.parent_id))return M.id;N.add(b.id),M=b}return M.id},d=n.filter(l=>!jt(l)&&h.has(l.from)&&h.has(l.to)).map(l=>({source:l.from,target:l.to})),w=gt([...h].sort().join("|")+d.length),y=new Map,A=[...new Set(u.map(l=>v(l)))].sort();A.forEach((l,M)=>{const N=M/A.length*Math.PI*2+w%360/180*Math.PI;y.set(l,[e/2+Math.cos(N)*e*.3,r/2+Math.sin(N)*r*.28])});const S=(l,M)=>{const N=y.get(v(l));return N?M==="x"?N[0]:N[1]:M==="x"?e/2:r/2},z=!g&&x>0,j=u.length>zt,F=l=>j?l.radius+6:Fn(l)*.92,I=_n(_).randomSource(jn(w)).alpha(z?.45:1).alphaDecay(.035).velocityDecay(.42).force("link",on(d).id(l=>l.id).distance(72).strength(.24)).force("charge",wn().strength(-108).distanceMin(16).distanceMax(300)).force("collision",en().radius(l=>F(l.box)).strength(1).iterations(3)).force("x",Mn(l=>l.record.parent_id?S(l.record,"x"):e/2).strength(l=>l.record.parent_id?.34:.2)).force("y",bn(l=>l.record.parent_id?S(l.record,"y"):r/2).strength(l=>l.record.parent_id?.34:.2)).force("center",$t(e/2,r/2).strength(.04)).stop(),R=_.length>2e3?.35:_.length>600?.6:1,B=Math.max(40,Math.round((z?90:260)*R));for(let l=0;l<B;l++)I.tick();I.stop();const E=_.map(l=>({...l.record,px:Math.max(l.box.halfWidth,Math.min(e-l.box.halfWidth,Number(l.x)||e/2)),py:Math.max(l.box.top,Math.min(r-l.box.bottom,Number(l.y)||r/2)),vx:Number(l.vx)||0,vy:Number(l.vy)||0,family:pt(l.record.kind),color:kn(l.record.kind),degree:p.get(l.id)||0,box:l.box,held:!!c?.get(l.id)})),G=l=>l.box;if(E.length>1&&!z&&(a||!E.some(l=>vt(l)))&&!c?.size){const l=M=>{const N=M==="x"?e:r,b=k=>M==="x"?G(k).halfWidth:G(k).top,$=k=>M==="x"?G(k).halfWidth:G(k).bottom,P=k=>M==="x"?k.px:k.py,[T,O]=On(E,k=>[P(k)-b(k),P(k)+$(k)]),H=Math.max(1,O-T),C=Math.min(4,Math.max(1,N*.88/H));if(C<=1.025)return;const at=(T+O)/2;for(const k of E){const V=N/2+(P(k)-at)*C;M==="x"?k.px=Math.max(b(k),Math.min(N-$(k),V)):k.py=Math.max(b(k),Math.min(N-$(k),V))}};l("x"),l("y")}const Yn=E.length>zt?0:E.length>70?64:220,dt=(l,M,N)=>{const b=G(l),$=M==="x"?l.px:l.py,P=M==="x"?b.halfWidth:b.top,T=M==="x"?e-b.halfWidth:r-b.bottom,O=Math.max(P,Math.min(Math.max(P,T),$+N));return M==="x"?l.px=O:l.py=O,O-$};for(let l=0;l<Yn;l++){let M=!1;for(let N=0;N<E.length;N++){const b=E[N],$=G(b);for(let P=N+1;P<E.length;P++){const T=E[P],O=G(T),H=T.px-b.px,C=T.py-b.py,at=$.halfWidth+O.halfWidth,k=C>=0?St($,O):St(O,$),V=at+4-Math.abs(H),xt=k+3-Math.abs(C);if(V<=0||xt<=0)continue;M=!0;const Lt=V/at<xt/k?"x":"y",Tt=J=>{const Ft=J==="x"?H:C,U=Ft===0?gt(J==="x"?`${b.id}:${T.id}`:`${T.id}:${b.id}`)%2?1:-1:Math.sign(Ft),ct=(J==="x"?V:xt)+.3;let K=0;return b.held||(K-=dt(b,J,-U*(ct/2))*U),T.held||(K+=dt(T,J,U*Math.max(0,ct-K))*U),!b.held&&K+.01<ct&&(K-=dt(b,J,-U*(ct-K))*U),K>.01};Tt(Lt)||Tt(Lt==="x"?"y":"x")}}if(!M)break}return E}const Dt=5;function Cn(t){const n=Date.now(),e=new Map(t.previous.map(([a,p,m])=>[a,{px:p,py:m}])),r=new Map(t.held.map(([a,p,m])=>[a,{px:p,py:m}])),i=Bn(t.nodes,t.edges,t.width,t.height,new Set(t.emphasis),e,r,{unpin:t.unpin}),o=new Array(i.length),c=new Array(i.length),s=new Float32Array(i.length*2),u=new Float32Array(i.length*Dt);for(let a=0;a<i.length;a++){const p=i[a];o[a]=p.id,c[a]=p.box.lines,s[a*2]=p.px,s[a*2+1]=p.py;const m=a*Dt;u[m]=p.box.radius,u[m+1]=p.box.halfWidth,u[m+2]=p.box.top,u[m+3]=p.box.bottom,u[m+4]=p.degree}return{generation:t.generation,ids:o,labels:c,positions:s,geometry:u,width:t.width,height:t.height,ms:Date.now()-n}}const Wt=self;Wt.onmessage=t=>{const n=Cn(t.data);Wt.postMessage(n,[n.positions.buffer,n.geometry.buffer])}})();\n//# sourceMappingURL=layout-worker-BsvX7bmA.js.map\n', _o = typeof self < "u" && self.Blob && new Blob([qi], { type: "text/javascript;charset=utf-8" });
function Gu(e) {
  let t;
  try {
    if (t = _o && (self.URL || self.webkitURL).createObjectURL(_o), !t) throw "";
    const n = new Worker(t, {
      name: e?.name
    });
    return n.addEventListener("error", () => {
      (self.URL || self.webkitURL).revokeObjectURL(t);
    }), n;
  } catch {
    return new Worker(
      "data:text/javascript;charset=utf-8," + encodeURIComponent(qi),
      {
        name: e?.name
      }
    );
  } finally {
    t && (self.URL || self.webkitURL).revokeObjectURL(t);
  }
}
function Yu(e, t) {
  var n, r = 1;
  e == null && (e = 0), t == null && (t = 0);
  function o() {
    var i, a = n.length, s, c = 0, l = 0;
    for (i = 0; i < a; ++i)
      s = n[i], c += s.x, l += s.y;
    for (c = (c / a - e) * r, l = (l / a - t) * r, i = 0; i < a; ++i)
      s = n[i], s.x -= c, s.y -= l;
  }
  return o.initialize = function(i) {
    n = i;
  }, o.x = function(i) {
    return arguments.length ? (e = +i, o) : e;
  }, o.y = function(i) {
    return arguments.length ? (t = +i, o) : t;
  }, o.strength = function(i) {
    return arguments.length ? (r = +i, o) : r;
  }, o;
}
function Ku(e) {
  const t = +this._x.call(null, e), n = +this._y.call(null, e);
  return Xi(this.cover(t, n), t, n, e);
}
function Xi(e, t, n, r) {
  if (isNaN(t) || isNaN(n)) return e;
  var o, i = e._root, a = { data: r }, s = e._x0, c = e._y0, l = e._x1, d = e._y1, f, m, p, b, w, v, h, g;
  if (!i) return e._root = a, e;
  for (; i.length; )
    if ((w = t >= (f = (s + l) / 2)) ? s = f : l = f, (v = n >= (m = (c + d) / 2)) ? c = m : d = m, o = i, !(i = i[h = v << 1 | w])) return o[h] = a, e;
  if (p = +e._x.call(null, i.data), b = +e._y.call(null, i.data), t === p && n === b) return a.next = i, o ? o[h] = a : e._root = a, e;
  do
    o = o ? o[h] = new Array(4) : e._root = new Array(4), (w = t >= (f = (s + l) / 2)) ? s = f : l = f, (v = n >= (m = (c + d) / 2)) ? c = m : d = m;
  while ((h = v << 1 | w) === (g = (b >= m) << 1 | p >= f));
  return o[g] = i, o[h] = a, e;
}
function qu(e) {
  var t, n, r = e.length, o, i, a = new Array(r), s = new Array(r), c = 1 / 0, l = 1 / 0, d = -1 / 0, f = -1 / 0;
  for (n = 0; n < r; ++n)
    isNaN(o = +this._x.call(null, t = e[n])) || isNaN(i = +this._y.call(null, t)) || (a[n] = o, s[n] = i, o < c && (c = o), o > d && (d = o), i < l && (l = i), i > f && (f = i));
  if (c > d || l > f) return this;
  for (this.cover(c, l).cover(d, f), n = 0; n < r; ++n)
    Xi(this, a[n], s[n], e[n]);
  return this;
}
function Xu(e, t) {
  if (isNaN(e = +e) || isNaN(t = +t)) return this;
  var n = this._x0, r = this._y0, o = this._x1, i = this._y1;
  if (isNaN(n))
    o = (n = Math.floor(e)) + 1, i = (r = Math.floor(t)) + 1;
  else {
    for (var a = o - n || 1, s = this._root, c, l; n > e || e >= o || r > t || t >= i; )
      switch (l = (t < r) << 1 | e < n, c = new Array(4), c[l] = s, s = c, a *= 2, l) {
        case 0:
          o = n + a, i = r + a;
          break;
        case 1:
          n = o - a, i = r + a;
          break;
        case 2:
          o = n + a, r = i - a;
          break;
        case 3:
          n = o - a, r = i - a;
          break;
      }
    this._root && this._root.length && (this._root = s);
  }
  return this._x0 = n, this._y0 = r, this._x1 = o, this._y1 = i, this;
}
function Ju() {
  var e = [];
  return this.visit(function(t) {
    if (!t.length) do
      e.push(t.data);
    while (t = t.next);
  }), e;
}
function Zu(e) {
  return arguments.length ? this.cover(+e[0][0], +e[0][1]).cover(+e[1][0], +e[1][1]) : isNaN(this._x0) ? void 0 : [[this._x0, this._y0], [this._x1, this._y1]];
}
function Ae(e, t, n, r, o) {
  this.node = e, this.x0 = t, this.y0 = n, this.x1 = r, this.y1 = o;
}
function Qu(e, t, n) {
  var r, o = this._x0, i = this._y0, a, s, c, l, d = this._x1, f = this._y1, m = [], p = this._root, b, w;
  for (p && m.push(new Ae(p, o, i, d, f)), n == null ? n = 1 / 0 : (o = e - n, i = t - n, d = e + n, f = t + n, n *= n); b = m.pop(); )
    if (!(!(p = b.node) || (a = b.x0) > d || (s = b.y0) > f || (c = b.x1) < o || (l = b.y1) < i))
      if (p.length) {
        var v = (a + c) / 2, h = (s + l) / 2;
        m.push(
          new Ae(p[3], v, h, c, l),
          new Ae(p[2], a, h, v, l),
          new Ae(p[1], v, s, c, h),
          new Ae(p[0], a, s, v, h)
        ), (w = (t >= h) << 1 | e >= v) && (b = m[m.length - 1], m[m.length - 1] = m[m.length - 1 - w], m[m.length - 1 - w] = b);
      } else {
        var g = e - +this._x.call(null, p.data), E = t - +this._y.call(null, p.data), T = g * g + E * E;
        if (T < n) {
          var S = Math.sqrt(n = T);
          o = e - S, i = t - S, d = e + S, f = t + S, r = p.data;
        }
      }
  return r;
}
function ed(e) {
  if (isNaN(d = +this._x.call(null, e)) || isNaN(f = +this._y.call(null, e))) return this;
  var t, n = this._root, r, o, i, a = this._x0, s = this._y0, c = this._x1, l = this._y1, d, f, m, p, b, w, v, h;
  if (!n) return this;
  if (n.length) for (; ; ) {
    if ((b = d >= (m = (a + c) / 2)) ? a = m : c = m, (w = f >= (p = (s + l) / 2)) ? s = p : l = p, t = n, !(n = n[v = w << 1 | b])) return this;
    if (!n.length) break;
    (t[v + 1 & 3] || t[v + 2 & 3] || t[v + 3 & 3]) && (r = t, h = v);
  }
  for (; n.data !== e; ) if (o = n, !(n = n.next)) return this;
  return (i = n.next) && delete n.next, o ? (i ? o.next = i : delete o.next, this) : t ? (i ? t[v] = i : delete t[v], (n = t[0] || t[1] || t[2] || t[3]) && n === (t[3] || t[2] || t[1] || t[0]) && !n.length && (r ? r[h] = n : this._root = n), this) : (this._root = i, this);
}
function td(e) {
  for (var t = 0, n = e.length; t < n; ++t) this.remove(e[t]);
  return this;
}
function nd() {
  return this._root;
}
function rd() {
  var e = 0;
  return this.visit(function(t) {
    if (!t.length) do
      ++e;
    while (t = t.next);
  }), e;
}
function od(e) {
  var t = [], n, r = this._root, o, i, a, s, c;
  for (r && t.push(new Ae(r, this._x0, this._y0, this._x1, this._y1)); n = t.pop(); )
    if (!e(r = n.node, i = n.x0, a = n.y0, s = n.x1, c = n.y1) && r.length) {
      var l = (i + s) / 2, d = (a + c) / 2;
      (o = r[3]) && t.push(new Ae(o, l, d, s, c)), (o = r[2]) && t.push(new Ae(o, i, d, l, c)), (o = r[1]) && t.push(new Ae(o, l, a, s, d)), (o = r[0]) && t.push(new Ae(o, i, a, l, d));
    }
  return this;
}
function id(e) {
  var t = [], n = [], r;
  for (this._root && t.push(new Ae(this._root, this._x0, this._y0, this._x1, this._y1)); r = t.pop(); ) {
    var o = r.node;
    if (o.length) {
      var i, a = r.x0, s = r.y0, c = r.x1, l = r.y1, d = (a + c) / 2, f = (s + l) / 2;
      (i = o[0]) && t.push(new Ae(i, a, s, d, f)), (i = o[1]) && t.push(new Ae(i, d, s, c, f)), (i = o[2]) && t.push(new Ae(i, a, f, d, l)), (i = o[3]) && t.push(new Ae(i, d, f, c, l));
    }
    n.push(r);
  }
  for (; r = n.pop(); )
    e(r.node, r.x0, r.y0, r.x1, r.y1);
  return this;
}
function sd(e) {
  return e[0];
}
function ad(e) {
  return arguments.length ? (this._x = e, this) : this._x;
}
function ld(e) {
  return e[1];
}
function cd(e) {
  return arguments.length ? (this._y = e, this) : this._y;
}
function Zr(e, t, n) {
  var r = new Qr(t ?? sd, n ?? ld, NaN, NaN, NaN, NaN);
  return e == null ? r : r.addAll(e);
}
function Qr(e, t, n, r, o, i) {
  this._x = e, this._y = t, this._x0 = n, this._y0 = r, this._x1 = o, this._y1 = i, this._root = void 0;
}
function wo(e) {
  for (var t = { data: e.data }, n = t; e = e.next; ) n = n.next = { data: e.data };
  return t;
}
var Me = Zr.prototype = Qr.prototype;
Me.copy = function() {
  var e = new Qr(this._x, this._y, this._x0, this._y0, this._x1, this._y1), t = this._root, n, r;
  if (!t) return e;
  if (!t.length) return e._root = wo(t), e;
  for (n = [{ source: t, target: e._root = new Array(4) }]; t = n.pop(); )
    for (var o = 0; o < 4; ++o)
      (r = t.source[o]) && (r.length ? n.push({ source: r, target: t.target[o] = new Array(4) }) : t.target[o] = wo(r));
  return e;
};
Me.add = Ku;
Me.addAll = qu;
Me.cover = Xu;
Me.data = Ju;
Me.extent = Zu;
Me.find = Qu;
Me.remove = ed;
Me.removeAll = td;
Me.root = nd;
Me.size = rd;
Me.visit = od;
Me.visitAfter = id;
Me.x = ad;
Me.y = cd;
function Oe(e) {
  return function() {
    return e;
  };
}
function ht(e) {
  return (e() - 0.5) * 1e-6;
}
function ud(e) {
  return e.x + e.vx;
}
function dd(e) {
  return e.y + e.vy;
}
function pd(e) {
  var t, n, r, o = 1, i = 1;
  typeof e != "function" && (e = Oe(e == null ? 1 : +e));
  function a() {
    for (var l, d = t.length, f, m, p, b, w, v, h = 0; h < i; ++h)
      for (f = Zr(t, ud, dd).visitAfter(s), l = 0; l < d; ++l)
        m = t[l], w = n[m.index], v = w * w, p = m.x + m.vx, b = m.y + m.vy, f.visit(g);
    function g(E, T, S, N, O) {
      var z = E.data, P = E.r, Y = w + P;
      if (z) {
        if (z.index > m.index) {
          var ne = p - z.x - z.vx, M = b - z.y - z.vy, I = ne * ne + M * M;
          I < Y * Y && (ne === 0 && (ne = ht(r), I += ne * ne), M === 0 && (M = ht(r), I += M * M), I = (Y - (I = Math.sqrt(I))) / I * o, m.vx += (ne *= I) * (Y = (P *= P) / (v + P)), m.vy += (M *= I) * Y, z.vx -= ne * (Y = 1 - Y), z.vy -= M * Y);
        }
        return;
      }
      return T > p + Y || N < p - Y || S > b + Y || O < b - Y;
    }
  }
  function s(l) {
    if (l.data) return l.r = n[l.data.index];
    for (var d = l.r = 0; d < 4; ++d)
      l[d] && l[d].r > l.r && (l.r = l[d].r);
  }
  function c() {
    if (t) {
      var l, d = t.length, f;
      for (n = new Array(d), l = 0; l < d; ++l) f = t[l], n[f.index] = +e(f, l, t);
    }
  }
  return a.initialize = function(l, d) {
    t = l, r = d, c();
  }, a.iterations = function(l) {
    return arguments.length ? (i = +l, a) : i;
  }, a.strength = function(l) {
    return arguments.length ? (o = +l, a) : o;
  }, a.radius = function(l) {
    return arguments.length ? (e = typeof l == "function" ? l : Oe(+l), c(), a) : e;
  }, a;
}
function fd(e) {
  return e.index;
}
function xo(e, t) {
  var n = e.get(t);
  if (!n) throw new Error("node not found: " + t);
  return n;
}
function hd(e) {
  var t = fd, n = f, r, o = Oe(30), i, a, s, c, l, d = 1;
  e == null && (e = []);
  function f(v) {
    return 1 / Math.min(s[v.source.index], s[v.target.index]);
  }
  function m(v) {
    for (var h = 0, g = e.length; h < d; ++h)
      for (var E = 0, T, S, N, O, z, P, Y; E < g; ++E)
        T = e[E], S = T.source, N = T.target, O = N.x + N.vx - S.x - S.vx || ht(l), z = N.y + N.vy - S.y - S.vy || ht(l), P = Math.sqrt(O * O + z * z), P = (P - i[E]) / P * v * r[E], O *= P, z *= P, N.vx -= O * (Y = c[E]), N.vy -= z * Y, S.vx += O * (Y = 1 - Y), S.vy += z * Y;
  }
  function p() {
    if (a) {
      var v, h = a.length, g = e.length, E = new Map(a.map((S, N) => [t(S, N, a), S])), T;
      for (v = 0, s = new Array(h); v < g; ++v)
        T = e[v], T.index = v, typeof T.source != "object" && (T.source = xo(E, T.source)), typeof T.target != "object" && (T.target = xo(E, T.target)), s[T.source.index] = (s[T.source.index] || 0) + 1, s[T.target.index] = (s[T.target.index] || 0) + 1;
      for (v = 0, c = new Array(g); v < g; ++v)
        T = e[v], c[v] = s[T.source.index] / (s[T.source.index] + s[T.target.index]);
      r = new Array(g), b(), i = new Array(g), w();
    }
  }
  function b() {
    if (a)
      for (var v = 0, h = e.length; v < h; ++v)
        r[v] = +n(e[v], v, e);
  }
  function w() {
    if (a)
      for (var v = 0, h = e.length; v < h; ++v)
        i[v] = +o(e[v], v, e);
  }
  return m.initialize = function(v, h) {
    a = v, l = h, p();
  }, m.links = function(v) {
    return arguments.length ? (e = v, p(), m) : e;
  }, m.id = function(v) {
    return arguments.length ? (t = v, m) : t;
  }, m.iterations = function(v) {
    return arguments.length ? (d = +v, m) : d;
  }, m.strength = function(v) {
    return arguments.length ? (n = typeof v == "function" ? v : Oe(+v), b(), m) : n;
  }, m.distance = function(v) {
    return arguments.length ? (o = typeof v == "function" ? v : Oe(+v), w(), m) : o;
  }, m;
}
var gd = { value: () => {
} };
function Ji() {
  for (var e = 0, t = arguments.length, n = {}, r; e < t; ++e) {
    if (!(r = arguments[e] + "") || r in n || /[\s.]/.test(r)) throw new Error("illegal type: " + r);
    n[r] = [];
  }
  return new Rn(n);
}
function Rn(e) {
  this._ = e;
}
function md(e, t) {
  return e.trim().split(/^|\s+/).map(function(n) {
    var r = "", o = n.indexOf(".");
    if (o >= 0 && (r = n.slice(o + 1), n = n.slice(0, o)), n && !t.hasOwnProperty(n)) throw new Error("unknown type: " + n);
    return { type: n, name: r };
  });
}
Rn.prototype = Ji.prototype = {
  constructor: Rn,
  on: function(e, t) {
    var n = this._, r = md(e + "", n), o, i = -1, a = r.length;
    if (arguments.length < 2) {
      for (; ++i < a; ) if ((o = (e = r[i]).type) && (o = vd(n[o], e.name))) return o;
      return;
    }
    if (t != null && typeof t != "function") throw new Error("invalid callback: " + t);
    for (; ++i < a; )
      if (o = (e = r[i]).type) n[o] = jo(n[o], e.name, t);
      else if (t == null) for (o in n) n[o] = jo(n[o], e.name, null);
    return this;
  },
  copy: function() {
    var e = {}, t = this._;
    for (var n in t) e[n] = t[n].slice();
    return new Rn(e);
  },
  call: function(e, t) {
    if ((o = arguments.length - 2) > 0) for (var n = new Array(o), r = 0, o, i; r < o; ++r) n[r] = arguments[r + 2];
    if (!this._.hasOwnProperty(e)) throw new Error("unknown type: " + e);
    for (i = this._[e], r = 0, o = i.length; r < o; ++r) i[r].value.apply(t, n);
  },
  apply: function(e, t, n) {
    if (!this._.hasOwnProperty(e)) throw new Error("unknown type: " + e);
    for (var r = this._[e], o = 0, i = r.length; o < i; ++o) r[o].value.apply(t, n);
  }
};
function vd(e, t) {
  for (var n = 0, r = e.length, o; n < r; ++n)
    if ((o = e[n]).name === t)
      return o.value;
}
function jo(e, t, n) {
  for (var r = 0, o = e.length; r < o; ++r)
    if (e[r].name === t) {
      e[r] = gd, e = e.slice(0, r).concat(e.slice(r + 1));
      break;
    }
  return n != null && e.push({ name: t, value: n }), e;
}
var Ht = 0, ln = 0, on = 0, Zi = 1e3, Wn, cn, Hn = 0, Ct = 0, Jn = 0, yn = typeof performance == "object" && performance.now ? performance : Date, Qi = typeof window == "object" && window.requestAnimationFrame ? window.requestAnimationFrame.bind(window) : function(e) {
  setTimeout(e, 17);
};
function es() {
  return Ct || (Qi(bd), Ct = yn.now() + Jn);
}
function bd() {
  Ct = 0;
}
function Cr() {
  this._call = this._time = this._next = null;
}
Cr.prototype = ts.prototype = {
  constructor: Cr,
  restart: function(e, t, n) {
    if (typeof e != "function") throw new TypeError("callback is not a function");
    n = (n == null ? es() : +n) + (t == null ? 0 : +t), !this._next && cn !== this && (cn ? cn._next = this : Wn = this, cn = this), this._call = e, this._time = n, Ar();
  },
  stop: function() {
    this._call && (this._call = null, this._time = 1 / 0, Ar());
  }
};
function ts(e, t, n) {
  var r = new Cr();
  return r.restart(e, t, n), r;
}
function yd() {
  es(), ++Ht;
  for (var e = Wn, t; e; )
    (t = Ct - e._time) >= 0 && e._call.call(void 0, t), e = e._next;
  --Ht;
}
function ko() {
  Ct = (Hn = yn.now()) + Jn, Ht = ln = 0;
  try {
    yd();
  } finally {
    Ht = 0, wd(), Ct = 0;
  }
}
function _d() {
  var e = yn.now(), t = e - Hn;
  t > Zi && (Jn -= t, Hn = e);
}
function wd() {
  for (var e, t = Wn, n, r = 1 / 0; t; )
    t._call ? (r > t._time && (r = t._time), e = t, t = t._next) : (n = t._next, t._next = null, t = e ? e._next = n : Wn = n);
  cn = e, Ar(r);
}
function Ar(e) {
  if (!Ht) {
    ln && (ln = clearTimeout(ln));
    var t = e - Ct;
    t > 24 ? (e < 1 / 0 && (ln = setTimeout(ko, e - yn.now() - Jn)), on && (on = clearInterval(on))) : (on || (Hn = yn.now(), on = setInterval(_d, Zi)), Ht = 1, Qi(ko));
  }
}
const xd = 1664525, jd = 1013904223, Eo = 4294967296;
function kd() {
  let e = 1;
  return () => (e = (xd * e + jd) % Eo) / Eo;
}
function Ed(e) {
  return e.x;
}
function Sd(e) {
  return e.y;
}
var Id = 10, Td = Math.PI * (3 - Math.sqrt(5));
function $d(e) {
  var t, n = 1, r = 1e-3, o = 1 - Math.pow(r, 1 / 300), i = 0, a = 0.6, s = /* @__PURE__ */ new Map(), c = ts(f), l = Ji("tick", "end"), d = kd();
  e == null && (e = []);
  function f() {
    m(), l.call("tick", t), n < r && (c.stop(), l.call("end", t));
  }
  function m(w) {
    var v, h = e.length, g;
    w === void 0 && (w = 1);
    for (var E = 0; E < w; ++E)
      for (n += (i - n) * o, s.forEach(function(T) {
        T(n);
      }), v = 0; v < h; ++v)
        g = e[v], g.fx == null ? g.x += g.vx *= a : (g.x = g.fx, g.vx = 0), g.fy == null ? g.y += g.vy *= a : (g.y = g.fy, g.vy = 0);
    return t;
  }
  function p() {
    for (var w = 0, v = e.length, h; w < v; ++w) {
      if (h = e[w], h.index = w, h.fx != null && (h.x = h.fx), h.fy != null && (h.y = h.fy), isNaN(h.x) || isNaN(h.y)) {
        var g = Id * Math.sqrt(0.5 + w), E = w * Td;
        h.x = g * Math.cos(E), h.y = g * Math.sin(E);
      }
      (isNaN(h.vx) || isNaN(h.vy)) && (h.vx = h.vy = 0);
    }
  }
  function b(w) {
    return w.initialize && w.initialize(e, d), w;
  }
  return p(), t = {
    tick: m,
    restart: function() {
      return c.restart(f), t;
    },
    stop: function() {
      return c.stop(), t;
    },
    nodes: function(w) {
      return arguments.length ? (e = w, p(), s.forEach(b), t) : e;
    },
    alpha: function(w) {
      return arguments.length ? (n = +w, t) : n;
    },
    alphaMin: function(w) {
      return arguments.length ? (r = +w, t) : r;
    },
    alphaDecay: function(w) {
      return arguments.length ? (o = +w, t) : +o;
    },
    alphaTarget: function(w) {
      return arguments.length ? (i = +w, t) : i;
    },
    velocityDecay: function(w) {
      return arguments.length ? (a = 1 - w, t) : 1 - a;
    },
    randomSource: function(w) {
      return arguments.length ? (d = w, s.forEach(b), t) : d;
    },
    force: function(w, v) {
      return arguments.length > 1 ? (v == null ? s.delete(w) : s.set(w, b(v)), t) : s.get(w);
    },
    find: function(w, v, h) {
      var g = 0, E = e.length, T, S, N, O, z;
      for (h == null ? h = 1 / 0 : h *= h, g = 0; g < E; ++g)
        O = e[g], T = w - O.x, S = v - O.y, N = T * T + S * S, N < h && (z = O, h = N);
      return z;
    },
    on: function(w, v) {
      return arguments.length > 1 ? (l.on(w, v), t) : l.on(w);
    }
  };
}
function Cd() {
  var e, t, n, r, o = Oe(-30), i, a = 1, s = 1 / 0, c = 0.81;
  function l(p) {
    var b, w = e.length, v = Zr(e, Ed, Sd).visitAfter(f);
    for (r = p, b = 0; b < w; ++b) t = e[b], v.visit(m);
  }
  function d() {
    if (e) {
      var p, b = e.length, w;
      for (i = new Array(b), p = 0; p < b; ++p) w = e[p], i[w.index] = +o(w, p, e);
    }
  }
  function f(p) {
    var b = 0, w, v, h = 0, g, E, T;
    if (p.length) {
      for (g = E = T = 0; T < 4; ++T)
        (w = p[T]) && (v = Math.abs(w.value)) && (b += w.value, h += v, g += v * w.x, E += v * w.y);
      p.x = g / h, p.y = E / h;
    } else {
      w = p, w.x = w.data.x, w.y = w.data.y;
      do
        b += i[w.data.index];
      while (w = w.next);
    }
    p.value = b;
  }
  function m(p, b, w, v) {
    if (!p.value) return !0;
    var h = p.x - t.x, g = p.y - t.y, E = v - b, T = h * h + g * g;
    if (E * E / c < T)
      return T < s && (h === 0 && (h = ht(n), T += h * h), g === 0 && (g = ht(n), T += g * g), T < a && (T = Math.sqrt(a * T)), t.vx += h * p.value * r / T, t.vy += g * p.value * r / T), !0;
    if (p.length || T >= s) return;
    (p.data !== t || p.next) && (h === 0 && (h = ht(n), T += h * h), g === 0 && (g = ht(n), T += g * g), T < a && (T = Math.sqrt(a * T)));
    do
      p.data !== t && (E = i[p.data.index] * r / T, t.vx += h * E, t.vy += g * E);
    while (p = p.next);
  }
  return l.initialize = function(p, b) {
    e = p, n = b, d();
  }, l.strength = function(p) {
    return arguments.length ? (o = typeof p == "function" ? p : Oe(+p), d(), l) : o;
  }, l.distanceMin = function(p) {
    return arguments.length ? (a = p * p, l) : Math.sqrt(a);
  }, l.distanceMax = function(p) {
    return arguments.length ? (s = p * p, l) : Math.sqrt(s);
  }, l.theta = function(p) {
    return arguments.length ? (c = p * p, l) : Math.sqrt(c);
  }, l;
}
function Ad(e) {
  var t = Oe(0.1), n, r, o;
  typeof e != "function" && (e = Oe(e == null ? 0 : +e));
  function i(s) {
    for (var c = 0, l = n.length, d; c < l; ++c)
      d = n[c], d.vx += (o[c] - d.x) * r[c] * s;
  }
  function a() {
    if (n) {
      var s, c = n.length;
      for (r = new Array(c), o = new Array(c), s = 0; s < c; ++s)
        r[s] = isNaN(o[s] = +e(n[s], s, n)) ? 0 : +t(n[s], s, n);
    }
  }
  return i.initialize = function(s) {
    n = s, a();
  }, i.strength = function(s) {
    return arguments.length ? (t = typeof s == "function" ? s : Oe(+s), a(), i) : t;
  }, i.x = function(s) {
    return arguments.length ? (e = typeof s == "function" ? s : Oe(+s), a(), i) : e;
  }, i;
}
function Od(e) {
  var t = Oe(0.1), n, r, o;
  typeof e != "function" && (e = Oe(e == null ? 0 : +e));
  function i(s) {
    for (var c = 0, l = n.length, d; c < l; ++c)
      d = n[c], d.vy += (o[c] - d.y) * r[c] * s;
  }
  function a() {
    if (n) {
      var s, c = n.length;
      for (r = new Array(c), o = new Array(c), s = 0; s < c; ++s)
        r[s] = isNaN(o[s] = +e(n[s], s, n)) ? 0 : +t(n[s], s, n);
    }
  }
  return i.initialize = function(s) {
    n = s, a();
  }, i.strength = function(s) {
    return arguments.length ? (t = typeof s == "function" ? s : Oe(+s), a(), i) : t;
  }, i.y = function(s) {
    return arguments.length ? (e = typeof s == "function" ? s : Oe(+s), a(), i) : e;
  }, i;
}
const Nd = {
  project: "anchor",
  charter: "anchor",
  program: "anchor",
  workstream: "anchor",
  work_unit: "anchor",
  work: "anchor",
  task: "anchor",
  run: "anchor",
  milestone: "anchor",
  history: "anchor",
  era: "anchor",
  stage: "anchor",
  ontology: "anchor",
  subject: "anchor",
  goal: "anchor",
  epic: "anchor",
  phase: "anchor",
  invariant: "rule",
  constraint: "rule",
  rule: "rule",
  rule_set: "rule",
  design_rule: "rule",
  definition: "rule",
  requirement: "rule",
  governance: "rule",
  design: "rule",
  specification: "rule",
  policy: "rule",
  claim: "rule",
  schema: "rule",
  decision: "decision",
  approach: "decision",
  candidate: "decision",
  alternative: "decision",
  choice: "decision",
  selection: "decision",
  tradeoff: "decision",
  evidence: "evidence",
  proof: "evidence",
  experiment: "evidence",
  experiment_set: "evidence",
  observation: "evidence",
  audit: "evidence",
  artifact: "evidence",
  reference: "evidence",
  paper: "evidence",
  verification: "evidence",
  acceptance: "evidence",
  reflection: "evidence",
  integration_receipt: "evidence",
  measurement: "evidence",
  benchmark: "evidence",
  risk: "risk",
  failure: "risk",
  contradiction: "risk",
  reopening: "risk",
  legacy: "risk",
  rejected_approach: "risk",
  false_green: "risk",
  blocker: "risk",
  threat: "risk",
  conflict: "risk",
  regression: "risk",
  incident: "risk",
  question: "open",
  research_question: "open",
  proof_obligation: "open",
  obligation: "open",
  gate: "open",
  hypothesis: "open",
  unknown: "open",
  assumption: "open",
  agent: "agent",
  cursor: "agent",
  operator: "agent"
};
function $e(e) {
  return Nd[String(e || "").toLowerCase()] || "note";
}
const Md = {
  anchor: "var(--jr-accent)",
  rule: "var(--jr-rule)",
  decision: "var(--jr-decision)",
  evidence: "var(--jr-evidence)",
  risk: "var(--jr-danger)",
  open: "var(--jr-warn)",
  agent: "var(--jr-accent-strong)",
  note: "var(--jr-muted)"
}, So = {
  anchor: "Structure",
  rule: "Rules",
  decision: "Decisions",
  evidence: "Evidence",
  risk: "Risk",
  open: "Open",
  agent: "Agents",
  note: "Notes"
}, ns = ["anchor", "rule", "decision", "evidence", "open", "risk", "note"];
function qt(e) {
  return Md[$e(e)];
}
function pn(e, t) {
  const n = t;
  switch (e) {
    case "anchor": {
      const r = n * 0.92, o = r * 0.34;
      return `M ${-r + o} ${-r} H ${r - o} Q ${r} ${-r} ${r} ${-r + o} V ${r - o} Q ${r} ${r} ${r - o} ${r} H ${-r + o} Q ${-r} ${r} ${-r} ${r - o} V ${-r + o} Q ${-r} ${-r} ${-r + o} ${-r} Z`;
    }
    case "rule": {
      const r = [];
      for (let o = 0; o < 6; o++) {
        const i = Math.PI / 3 * o - Math.PI / 2;
        r.push(`${(Math.cos(i) * n).toFixed(2)} ${(Math.sin(i) * n).toFixed(2)}`);
      }
      return `M ${r.join(" L ")} Z`;
    }
    case "decision": {
      const r = n * 1.16;
      return `M 0 ${-r} L ${r} 0 L 0 ${r} L ${-r} 0 Z`;
    }
    case "risk": {
      const r = n * 1.2, o = n * 1.28, i = n * 0.28;
      return `M 0 ${-r} L ${o} ${r * 0.78} Q ${o} ${r * 0.78 + i} ${o - i} ${r * 0.78 + i} H ${-o + i} Q ${-o} ${r * 0.78 + i} ${-o} ${r * 0.78} Z`;
    }
    default:
      return `M ${-n} 0 A ${n} ${n} 0 1 0 ${n} 0 A ${n} ${n} 0 1 0 ${-n} 0 Z`;
  }
}
function rs(e) {
  return e === "open";
}
const Rd = {
  contains: "structure",
  owns: "structure",
  precedes: "structure",
  next: "structure",
  defines: "structure",
  delegates: "structure",
  projects_from: "structure",
  binds: "structure",
  used_by: "structure",
  part_of: "structure",
  includes: "structure",
  supports: "support",
  verifies: "support",
  evaluates: "support",
  requires_proof: "support",
  candidate_for: "support",
  learned_from: "support",
  governed_by: "support",
  governs: "support",
  motivates: "support",
  informs: "support",
  cites: "support",
  relates: "support",
  duplicates: "support",
  contradicts: "conflict",
  conflicts: "conflict",
  refutes: "conflict",
  rejects: "conflict",
  blocks: "conflict",
  threatens: "conflict",
  deletes: "conflict",
  invalidates: "conflict",
  superseded_by: "succession",
  supersedes: "succession",
  selects: "succession",
  requires_integration: "succession",
  replaced_by: "succession",
  causes: "succession",
  positioned_at: "presence",
  focused_on: "presence",
  assigned_to: "presence"
};
function Et(e) {
  return Rd[String(e || "").toLowerCase()] || "support";
}
function eo(e) {
  return Et(e.kind) === "presence";
}
function Pd(e) {
  const t = e.metadata || {};
  return String(t.origin || "") === "derived-llm";
}
function Or(e) {
  let t = 2166136261;
  for (let n = 0; n < e.length; n++)
    t ^= e.charCodeAt(n), t = Math.imul(t, 16777619);
  return t >>> 0;
}
function Ld(e) {
  let t = e || 1;
  return () => (t = Math.imul(1664525, t) + 1013904223 >>> 0, t / 4294967296);
}
const Dd = /* @__PURE__ */ new Set([...`iljtIfr.,;:'"!|()[]{} `]), zd = /* @__PURE__ */ new Set([..."MWmw@%&"]);
function Pn(e, t = 9) {
  let n = 0;
  for (const r of e) n += Dd.has(r) ? 2.5 : zd.has(r) ? 7.6 : 4.95;
  return n * t / 9;
}
function Vd(e, t = 128, n = 2) {
  const r = String(e || "").trim().split(/\s+/).filter(Boolean);
  if (!r.length) return ["untitled"];
  const o = [];
  let i = "";
  for (const s of r) {
    const c = i ? `${i} ${s}` : s;
    i && Pn(c) > t && o.length < n - 1 ? (o.push(i), i = s) : i = c;
  }
  o.push(i);
  const a = o.length - 1;
  if (Pn(o[a]) > t) {
    let s = o[a];
    for (; s.length > 1 && Pn(`${s}…`) > t; ) s = s.slice(0, -1);
    o[a] = `${s.trimEnd()}…`;
  }
  return o;
}
function Ud(e, t) {
  const n = 6.6 + Math.sqrt(Math.max(0, e)) * 3.1, r = t === "anchor" ? 1.12 : t === "note" ? 0.86 : 1;
  return Math.min(17.5, n) * r;
}
const Nr = 10.4;
function Fd(e, t, n = !1) {
  const r = $e(e.kind), o = Ud(t, r), i = Vd(e.label, n ? 132 : 112, n ? 2 : 1), a = Math.max(...i.map((s) => Pn(s)));
  return {
    radius: o,
    lines: i,
    halfWidth: Math.max(o + 3, a / 2 + 4),
    top: o + 3,
    bottom: o + 6 + i.length * Nr
  };
}
function Io(e, t) {
  return e.bottom + t.top;
}
function Bd(e) {
  return Math.max(e.halfWidth, (e.top + e.bottom) / 2);
}
const Wd = 0.25, Mr = 420;
function Hd(e, t) {
  let n = 1 / 0, r = -1 / 0;
  for (const o of e) {
    const [i, a] = t(o);
    i < n && (n = i), a > r && (r = a);
  }
  return [n, r];
}
function os(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e)
    eo(n) || (t.set(n.from, (t.get(n.from) || 0) + 1), t.set(n.to, (t.get(n.to) || 0) + 1));
  return t;
}
function Rr(e) {
  const t = e.x ?? e.metadata?.x, n = e.y ?? e.metadata?.y;
  if (t == null || t === "" || n === void 0 || n === null || n === "") return;
  const r = Number(t), o = Number(n);
  return Number.isFinite(r) && Number.isFinite(o) ? [r, o] : void 0;
}
function Gd(e, t, n, r, o, i) {
  const a = i ? void 0 : Rr(e);
  if (a) return a;
  const s = o?.get(e.id);
  if (s) return [s.px, s.py];
  const c = Or(`${e.kind}:${e.id}`), l = c % 360 / 180 * Math.PI, d = 0.25 + (c >>> 9) % 48 / 80, f = (t % 7 - 3) * 5;
  return [
    n / 2 + Math.cos(l) * (n / 2) * d + f,
    r / 2 + Math.sin(l) * (r / 2) * d - f
  ];
}
function Yd(e, t, n = 920, r = 620, o = /* @__PURE__ */ new Set(), i, a, s) {
  const c = e, l = !!s?.unpin, d = os(t), f = new Map(c.map((C) => [C.id, Fd(C, d.get(C.id) || 0, o.has(C.id))]));
  let m = 0;
  if (i?.size) for (const C of c)
    i.has(C.id) && m++;
  const p = m > 0 && (c.length - m) / c.length > Wd, b = c.map((C, ee) => {
    const B = f.get(C.id), X = a?.get(C.id), ue = l ? void 0 : Rr(C), [se, de] = X ? [X.px, X.py] : Gd(C, ee, n, r, i, l), me = Math.max(B.halfWidth, Math.min(n - B.halfWidth, se)), he = Math.max(B.top, Math.min(r - B.bottom, de)), we = !p && i?.has(C.id);
    return {
      id: C.id,
      record: C,
      box: B,
      x: me,
      y: he,
      vx: 0,
      vy: 0,
      // `pinned` protects semantic content from automatic replacement. Only an
      // explicit layout.position-set or a reader's drag owns a screen coordinate.
      fx: ue || X || we ? me : null,
      fy: ue || X || we ? he : null
    };
  }), w = new Set(b.map((C) => C.id)), v = new Map(c.map((C) => [C.id, C])), h = (C) => {
    let ee = C;
    const B = /* @__PURE__ */ new Set([ee.id]);
    for (; ee.parent_id && v.has(ee.parent_id) && !B.has(ee.parent_id); ) {
      const X = v.get(ee.parent_id);
      if (!X.parent_id || !v.has(X.parent_id)) return ee.id;
      B.add(X.id), ee = X;
    }
    return ee.id;
  }, g = t.filter((C) => !eo(C) && w.has(C.from) && w.has(C.to)).map((C) => ({ source: C.from, target: C.to })), E = Or([...w].sort().join("|") + g.length), T = /* @__PURE__ */ new Map(), S = [...new Set(c.map((C) => h(C)))].sort();
  S.forEach((C, ee) => {
    const B = ee / S.length * Math.PI * 2 + E % 360 / 180 * Math.PI;
    T.set(C, [
      n / 2 + Math.cos(B) * n * 0.3,
      r / 2 + Math.sin(B) * r * 0.28
    ]);
  });
  const N = (C, ee) => {
    const B = T.get(h(C));
    return B ? ee === "x" ? B[0] : B[1] : ee === "x" ? n / 2 : r / 2;
  }, O = !p && m > 0, z = c.length > Mr, P = (C) => z ? C.radius + 6 : Bd(C) * 0.92, Y = $d(b).randomSource(Ld(E)).alpha(O ? 0.45 : 1).alphaDecay(0.035).velocityDecay(0.42).force("link", hd(g).id((C) => C.id).distance(72).strength(0.24)).force("charge", Cd().strength(-108).distanceMin(16).distanceMax(300)).force("collision", pd().radius((C) => P(C.box)).strength(1).iterations(3)).force("x", Ad((C) => C.record.parent_id ? N(C.record, "x") : n / 2).strength((C) => C.record.parent_id ? 0.34 : 0.2)).force("y", Od((C) => C.record.parent_id ? N(C.record, "y") : r / 2).strength((C) => C.record.parent_id ? 0.34 : 0.2)).force("center", Yu(n / 2, r / 2).strength(0.04)).stop(), ne = b.length > 2e3 ? 0.35 : b.length > 600 ? 0.6 : 1, M = Math.max(40, Math.round((O ? 90 : 260) * ne));
  for (let C = 0; C < M; C++) Y.tick();
  Y.stop();
  const I = b.map((C) => ({
    ...C.record,
    px: Math.max(C.box.halfWidth, Math.min(n - C.box.halfWidth, Number(C.x) || n / 2)),
    py: Math.max(C.box.top, Math.min(r - C.box.bottom, Number(C.y) || r / 2)),
    vx: Number(C.vx) || 0,
    vy: Number(C.vy) || 0,
    family: $e(C.record.kind),
    color: qt(C.record.kind),
    degree: d.get(C.id) || 0,
    box: C.box,
    held: !!a?.get(C.id)
  })), A = (C) => C.box;
  if (I.length > 1 && !O && (l || !I.some((C) => Rr(C))) && !a?.size) {
    const C = (ee) => {
      const B = ee === "x" ? n : r, X = (ae) => ee === "x" ? A(ae).halfWidth : A(ae).top, ue = (ae) => ee === "x" ? A(ae).halfWidth : A(ae).bottom, se = (ae) => ee === "x" ? ae.px : ae.py, [de, me] = Hd(I, (ae) => [se(ae) - X(ae), se(ae) + ue(ae)]), he = Math.max(1, me - de), we = Math.min(4, Math.max(1, B * 0.88 / he));
      if (we <= 1.025) return;
      const Je = (de + me) / 2;
      for (const ae of I) {
        const Q = B / 2 + (se(ae) - Je) * we;
        ee === "x" ? ae.px = Math.max(X(ae), Math.min(B - ue(ae), Q)) : ae.py = Math.max(X(ae), Math.min(B - ue(ae), Q));
      }
    };
    C("x"), C("y");
  }
  const te = I.length > Mr ? 0 : I.length > 70 ? 64 : 220, ie = (C, ee, B) => {
    const X = A(C), ue = ee === "x" ? C.px : C.py, se = ee === "x" ? X.halfWidth : X.top, de = ee === "x" ? n - X.halfWidth : r - X.bottom, me = Math.max(se, Math.min(Math.max(se, de), ue + B));
    return ee === "x" ? C.px = me : C.py = me, me - ue;
  };
  for (let C = 0; C < te; C++) {
    let ee = !1;
    for (let B = 0; B < I.length; B++) {
      const X = I[B], ue = A(X);
      for (let se = B + 1; se < I.length; se++) {
        const de = I[se], me = A(de), he = de.px - X.px, we = de.py - X.py, Je = ue.halfWidth + me.halfWidth, ae = we >= 0 ? Io(ue, me) : Io(me, ue), Q = Je + 4 - Math.abs(he), it = ae + 3 - Math.abs(we);
        if (Q <= 0 || it <= 0) continue;
        ee = !0;
        const We = Q / Je < it / ae ? "x" : "y", be = (Re) => {
          const xe = Re === "x" ? he : we, De = xe === 0 ? Or(Re === "x" ? `${X.id}:${de.id}` : `${de.id}:${X.id}`) % 2 ? 1 : -1 : Math.sign(xe), He = (Re === "x" ? Q : it) + 0.3;
          let ze = 0;
          return X.held || (ze -= ie(X, Re, -De * (He / 2)) * De), de.held || (ze += ie(de, Re, De * Math.max(0, He - ze)) * De), !X.held && ze + 0.01 < He && (ze -= ie(X, Re, -De * (He - ze)) * De), ze > 0.01;
        };
        be(We) || be(We === "x" ? "y" : "x");
      }
    }
    if (!ee) break;
  }
  return I;
}
function Kd(e) {
  const t = [...e].sort((o, i) => o[0] - i[0] || o[1] - i[1]), n = (o, i, a) => (i[0] - o[0]) * (a[1] - o[1]) - (i[1] - o[1]) * (a[0] - o[0]), r = (o) => {
    const i = [];
    for (const a of o) {
      for (; i.length >= 2 && n(i[i.length - 2], i[i.length - 1], a) <= 0; ) i.pop();
      i.push(a);
    }
    return i.pop(), i;
  };
  return t.length < 3 ? t : [...r(t), ...r([...t].reverse())];
}
function qd(e) {
  if (e.length < 3) return "";
  const t = [`M ${e[0][0].toFixed(1)} ${e[0][1].toFixed(1)}`], n = e.length;
  for (let r = 0; r < n; r++) {
    const o = e[(r - 1 + n) % n], i = e[r], a = e[(r + 1) % n], s = e[(r + 2) % n], c = i[0] + (a[0] - o[0]) / 6, l = i[1] + (a[1] - o[1]) / 6, d = a[0] - (s[0] - i[0]) / 6, f = a[1] - (s[1] - i[1]) / 6;
    t.push(`C ${c.toFixed(1)} ${l.toFixed(1)} ${d.toFixed(1)} ${f.toFixed(1)} ${a[0].toFixed(1)} ${a[1].toFixed(1)}`);
  }
  return `${t.join(" ")} Z`;
}
function Xd(e) {
  let t = 0;
  for (let n = 0; n < e.length; n++) {
    const [r, o] = e[n], [i, a] = e[(n + 1) % e.length];
    t += r * a - i * o;
  }
  return Math.abs(t) / 2;
}
function Jd(e, t = 0, n = 0, r = 30) {
  const o = new Map(e.map((l) => [l.id, l])), i = (l) => {
    const d = [l], f = /* @__PURE__ */ new Set([l.id]);
    let m = l;
    for (; m.parent_id && o.has(m.parent_id) && !f.has(m.parent_id); )
      f.add(m.parent_id), m = o.get(m.parent_id), d.push(m);
    return d.length >= 2 ? d[d.length - 2] : null;
  }, a = /* @__PURE__ */ new Map();
  for (const l of e) {
    const d = i(l);
    if (!d) continue;
    const f = a.get(d.id) || [];
    f.push(l), a.set(d.id, f);
  }
  const s = t * n, c = [];
  for (const [l, d] of a) {
    if (d.length < 3) continue;
    const f = o.get(l), m = [];
    for (const E of d) {
      const T = E.box.radius + 5;
      for (let S = 0; S < 8; S++) {
        const N = S / 8 * Math.PI * 2;
        m.push([E.px + Math.cos(N) * T, E.py + Math.sin(N) * T * 1.25]);
      }
    }
    const p = Kd(m);
    if (p.length < 3) continue;
    const b = p.reduce((E, T) => E + T[0], 0) / p.length, w = p.reduce((E, T) => E + T[1], 0) / p.length, v = p.map(([E, T]) => {
      const S = E - b, N = T - w, O = Math.max(1, Math.hypot(S, N));
      return [E + S / O * r, T + N / O * r];
    });
    if (s && Xd(v) > s * 0.42) continue;
    const h = qd(v);
    if (!h) continue;
    const g = Math.min(...v.map((E) => E[1]));
    c.push({
      id: l,
      label: f?.label || l,
      family: f ? f.family : "note",
      path: h,
      size: d.length,
      labelX: b,
      labelY: g + 15
    });
  }
  return c.sort((l, d) => d.size - l.size || l.id.localeCompare(d.id));
}
const Zd = ["viewBox"], Qd = ["d"], Gt = /* @__PURE__ */ Ne({
  __name: "FamilyMark",
  props: {
    family: {},
    radius: { default: 7 },
    viewBox: { default: "-12 -12 24 24" },
    hollow: { type: Boolean }
  },
  setup(e) {
    const t = e, n = L(() => pn(t.family, t.radius)), r = L(() => t.hollow ?? rs(t.family));
    return (o, i) => (x(), j("svg", {
      viewBox: e.viewBox,
      "aria-hidden": "true"
    }, [
      u("path", {
        d: n.value,
        class: oe({ hollow: r.value })
      }, null, 10, Qd)
    ], 8, Zd));
  }
}), Pr = 5;
function ep(e) {
  const t = {
    id: e.id,
    kind: e.kind,
    label: e.label,
    parent_id: e.parent_id,
    pinned: e.pinned,
    x: e.x,
    y: e.y
  }, n = e.metadata?.x, r = e.metadata?.y;
  return (n !== void 0 || r !== void 0) && (t.metadata = { x: n, y: r }), t;
}
function tp(e) {
  return { id: e.id, from: e.from, to: e.to, kind: e.kind };
}
function To(e) {
  const t = Date.now(), n = new Map(e.previous.map(([l, d, f]) => [l, { px: d, py: f }])), r = new Map(e.held.map(([l, d, f]) => [l, { px: d, py: f }])), o = Yd(
    e.nodes,
    e.edges,
    e.width,
    e.height,
    new Set(e.emphasis),
    n,
    r,
    { unpin: e.unpin }
  ), i = new Array(o.length), a = new Array(o.length), s = new Float32Array(o.length * 2), c = new Float32Array(o.length * Pr);
  for (let l = 0; l < o.length; l++) {
    const d = o[l];
    i[l] = d.id, a[l] = d.box.lines, s[l * 2] = d.px, s[l * 2 + 1] = d.py;
    const f = l * Pr;
    c[f] = d.box.radius, c[f + 1] = d.box.halfWidth, c[f + 2] = d.box.top, c[f + 3] = d.box.bottom, c[f + 4] = d.degree;
  }
  return {
    generation: e.generation,
    ids: i,
    labels: a,
    positions: s,
    geometry: c,
    width: e.width,
    height: e.height,
    ms: Date.now() - t
  };
}
const np = {
  ids: [],
  index: /* @__PURE__ */ new Map(),
  positions: new Float32Array(0),
  geometry: new Float32Array(0),
  labels: [],
  width: 0,
  height: 0,
  ms: 0
};
function dr(e) {
  const t = /* @__PURE__ */ new Map();
  for (let n = 0; n < e.ids.length; n++) t.set(e.ids[n], n);
  return {
    ids: e.ids,
    index: t,
    positions: e.positions,
    geometry: e.geometry,
    labels: e.labels,
    width: e.width,
    height: e.height,
    ms: e.ms
  };
}
function rp(e, t) {
  const n = e.index.get(t);
  return n === void 0 ? null : { x: e.positions[n * 2], y: e.positions[n * 2 + 1] };
}
class op {
  constructor(t) {
    this.makeWorker = t;
  }
  worker = null;
  generation = 0;
  memory = [];
  busy = !1;
  pending = null;
  /** Abandons the solve currently in the worker, so nothing waits on a dead one. */
  abandon = null;
  disposed = !1;
  /**
   * A reader's re-layout is a promise, not a race entrant: once asked for, it
   * rides every request until a solve actually reaches the screen. Without
   * this, a routine refresh arriving mid-solve would supersede the re-layout
   * and quietly leave the old arrangement in force.
   */
  sticky = { fresh: !1, unpin: !1 };
  /** Positions from the previous solve, so the next one keeps spatial memory. */
  remembered() {
    return this.memory;
  }
  remember(t) {
    const n = new Array(t.ids.length);
    for (let r = 0; r < t.ids.length; r++)
      n[r] = [t.ids[r], t.positions[r * 2], t.positions[r * 2 + 1]];
    this.memory = n;
  }
  request(t) {
    return {
      generation: ++this.generation,
      nodes: t.nodes.map(ep),
      edges: t.edges.map(tp),
      width: Math.max(1, Math.round(t.width)),
      height: Math.max(1, Math.round(t.height)),
      emphasis: [...t.emphasis],
      previous: t.fresh ? [] : this.memory,
      held: [...t.held].map(([n, r]) => [n, r.px, r.py]),
      unpin: t.unpin
    };
  }
  /**
   * One solve at a time, with at most one request held behind it.
   *
   * A solve over a large journal costs real time, and the things that ask for
   * one arrive in bursts: a projection refresh, a drag on the pane edge, a
   * chunk of a whole-graph read. Queuing a solve per event would run them all
   * and repaint each superseded layout in turn on the way to the current one.
   *
   * So the newest request is the only one worth answering. It replaces whatever
   * was waiting, and it supersedes whatever is running — a superseded solve
   * answers `null`, which says the caller has nothing to paint because a newer
   * layout is already on its way.
   */
  solve(t) {
    if (this.disposed) return Promise.resolve(null);
    t.fresh && (this.sticky.fresh = !0), t.unpin && (this.sticky.unpin = !0);
    const n = { ...t, fresh: this.sticky.fresh, unpin: this.sticky.unpin };
    return this.busy ? (this.pending?.settle(null), new Promise((r) => {
      this.pending = { input: n, settle: r };
    })) : this.run(n);
  }
  async run(t) {
    this.busy = !0;
    try {
      const n = await this.dispatch(t);
      return this.pending || this.disposed ? null : (n && t.fresh && (this.sticky.fresh = !1), n && t.unpin && (this.sticky.unpin = !1), n);
    } finally {
      this.busy = !1;
      const n = this.pending;
      n && !this.disposed && (this.pending = null, this.run(n.input).then(n.settle));
    }
  }
  /**
   * Runs one solve in the worker when the runtime has one, and on this thread
   * when it does not. Both run the same projection; only the thread differs.
   */
  dispatch(t) {
    const n = this.request(t);
    if (!this.worker && this.makeWorker)
      try {
        this.worker = this.makeWorker();
      } catch {
        this.worker = null;
      }
    if (!this.worker) {
      const r = dr(To(n));
      return this.remember(r), Promise.resolve(r);
    }
    return new Promise((r) => {
      const o = this.worker, i = (c) => {
        o.removeEventListener("message", a), o.removeEventListener("error", s), this.abandon = null, r(c);
      }, a = (c) => {
        if (c.data.generation !== n.generation) return;
        const l = dr(c.data);
        this.remember(l), i(l);
      }, s = () => {
        this.worker?.terminate(), this.worker = null;
        const c = dr(To(n));
        this.remember(c), i(c);
      };
      this.abandon = () => i(null), o.addEventListener("message", a), o.addEventListener("error", s), o.postMessage(n);
    });
  }
  /** Drops remembered positions so the next solve lays the graph out afresh. */
  forget() {
    this.memory = [];
  }
  dispose() {
    this.disposed = !0;
    const t = this.pending;
    this.pending = null, t?.settle(null), this.abandon?.(), this.worker?.terminate(), this.worker = null;
  }
}
const ip = 0.04, sp = 3.2;
function Gn(e) {
  return Math.max(ip, Math.min(sp, e));
}
function ap(e) {
  if (!e.length) return null;
  let t = 1 / 0, n = 1 / 0, r = -1 / 0, o = -1 / 0;
  for (const i of e)
    t = Math.min(t, i.x - i.halfWidth), r = Math.max(r, i.x + i.halfWidth), n = Math.min(n, i.y - i.halfHeight), o = Math.max(o, i.y + i.halfHeight);
  return { minX: t, minY: n, maxX: r, maxY: o };
}
function lp(e, t, n = 44, r = 1.5) {
  const o = Math.max(1, t.width), i = Math.max(1, t.height);
  if (!e) return { zoom: 1, x: o / 2, y: i / 2 };
  const a = Math.max(1, e.maxX - e.minX), s = Math.max(1, e.maxY - e.minY), c = { width: Math.max(1, o - n * 2), height: Math.max(1, i - n * 2) }, l = Gn(Math.min(r, Math.min(c.width / a, c.height / s))), d = (e.minX + e.maxX) / 2, f = (e.minY + e.maxY) / 2;
  return { zoom: l, x: o / 2 - d * l, y: i / 2 - f * l };
}
const cp = 11e3, up = 2600;
function dp(e, t, n) {
  const r = Math.max(320, t.width), o = Math.max(240, t.height), i = r / o, a = e <= Mr ? cp : up, s = Math.max(r * o, Math.max(1, e) * a);
  return { width: Math.round(Math.sqrt(s * i)), height: Math.round(Math.sqrt(s / i)) };
}
function $o(e, t, n, r) {
  const o = Gn(e.zoom * t), i = o / e.zoom;
  return { zoom: o, x: n - (n - e.x) * i, y: r - (r - e.y) * i };
}
function Lr(e, t, n) {
  return { x: (t - e.x) / e.zoom, y: (n - e.y) / e.zoom };
}
function pp(e, t, n = 96) {
  const r = n / e.zoom, o = Lr(e, 0, 0), i = Lr(e, t.width, t.height);
  return {
    minX: o.x - r,
    minY: o.y - r,
    maxX: i.x + r,
    maxY: i.y + r
  };
}
function fp(e, t, n, r, o) {
  return t + r >= e.minX && t - r <= e.maxX && n + o >= e.minY && n - o <= e.maxY;
}
const Dr = 0.78;
function Co(e, t) {
  return e < 0.22 || t > 2400 && e < 0.4 ? "envelope" : e < 0.42 || t > 1600 ? "dot" : e < Dr || t > 420 ? "mark" : "full";
}
function hp(e, t) {
  return e < 0.42 ? 0 : e >= Dr ? t <= 420 ? t : 48 : Math.max(0, Math.min(48, Math.round(48 * ((e - 0.42) / (Dr - 0.42)))));
}
function gp(e) {
  return {
    arrows: e === "full",
    labels: e === "full",
    curves: e === "full" || e === "mark"
  };
}
const Ao = 86400, mp = 34, zr = 5, vp = 12, Oo = 54, pr = 96;
function is(e, t, n) {
  return n * e.columns + t;
}
function bp(e, t) {
  const n = {
    cell: pr,
    minX: t?.minX ?? 0,
    minY: t?.minY ?? 0,
    columns: Math.max(1, Math.ceil(((t?.maxX ?? 0) - (t?.minX ?? 0)) / pr) + 1),
    rows: Math.max(1, Math.ceil(((t?.maxY ?? 0) - (t?.minY ?? 0)) / pr) + 1),
    buckets: /* @__PURE__ */ new Map()
  };
  for (let r = 0; r < e.length; r++) {
    const o = e[r], i = Math.max(0, Math.min(n.columns - 1, Math.floor((o.x - n.minX) / n.cell))), a = Math.max(0, Math.min(n.rows - 1, Math.floor((o.y - n.minY) / n.cell))), s = is(n, i, a), c = n.buckets.get(s);
    c ? c.push(r) : n.buckets.set(s, [r]);
  }
  return n;
}
function yp(e, t, n, r = /* @__PURE__ */ new Map(), o = /* @__PURE__ */ new Map()) {
  const i = new Map(t.map((p) => [p.id, p])), a = new Array(e.ids.length);
  for (let p = 0; p < e.ids.length; p++) {
    const b = e.ids[p], w = i.get(b), v = p * Pr, h = $e(w?.kind), g = e.geometry[v + 4];
    a[p] = {
      id: b,
      x: e.positions[p * 2],
      y: e.positions[p * 2 + 1],
      radius: e.geometry[v],
      halfWidth: e.geometry[v + 1],
      top: e.geometry[v + 2],
      bottom: e.geometry[v + 3],
      degree: g,
      family: h,
      lines: e.labels[p] || [],
      hollow: rs(h),
      folded: w ? Wt(w) : !1,
      settled: w ? Xn(w) : !1,
      rank: g + (w?.parent_id ? 0 : 3) + (w?.pinned ? 4 : 0),
      sessions: o.get(b)?.sessions || 0,
      lastWorkedAt: o.get(b)?.lastActivityAt || 0
    };
  }
  const s = e.index, c = [], l = [], d = /* @__PURE__ */ new Map();
  for (const p of n) {
    const b = s.get(p.from), w = s.get(p.to);
    if (b !== void 0 && w !== void 0) {
      if (b === w) continue;
      c.push({
        from: b,
        to: w,
        family: Et(p.kind),
        suggested: Pd(p),
        label: p.label || p.kind.replace(/_/g, " ")
      });
      continue;
    }
    const v = b ?? w;
    if (v === void 0) continue;
    const h = b === void 0 ? p.from : p.to, g = d.get(v) || 0;
    d.set(v, g + 1), l.push({
      at: v,
      targetId: h,
      targetLabel: r.get(h) || i.get(h)?.label || h,
      kind: p.kind.replace(/_/g, " "),
      outbound: w === void 0,
      angle: -Math.PI / 2 + g * (Math.PI / 5) * (g % 2 ? 1 : -1)
    });
  }
  const f = ap(a.map((p) => ({
    x: p.x,
    y: p.y + (p.bottom - p.top) / 2,
    halfWidth: p.halfWidth,
    halfHeight: (p.top + p.bottom) / 2
  }))), m = Jd(
    a.map((p) => ({
      id: p.id,
      parent_id: i.get(p.id)?.parent_id,
      label: i.get(p.id)?.label || p.id,
      family: p.family,
      px: p.x,
      py: p.y,
      box: { radius: p.radius }
    })),
    e.width,
    e.height
  );
  return { nodes: a, edges: c, ports: l, regions: m, index: s, bounds: f, grid: bp(a, f) };
}
function sn(e, t, n, r = 6) {
  const o = e.grid, i = Math.floor((t - o.minX) / o.cell), a = Math.floor((n - o.minY) / o.cell);
  let s = "", c = 1 / 0;
  for (let l = -1; l <= 1; l++)
    for (let d = -1; d <= 1; d++) {
      const f = i + d, m = a + l;
      if (!(f < 0 || m < 0 || f >= o.columns || m >= o.rows))
        for (const p of o.buckets.get(is(o, f, m)) || []) {
          const b = e.nodes[p], w = Math.hypot(b.x - t, b.y - n);
          w <= b.radius + r && w < c && (c = w, s = b.id);
        }
    }
  return s;
}
function ss(e, t) {
  const n = e.nodes[t.at], r = n.radius + mp;
  return { x: n.x + Math.cos(t.angle) * r, y: n.y + Math.sin(t.angle) * r };
}
function No(e, t, n, r = 5) {
  for (const o of e.ports) {
    const i = ss(e, o);
    if (Math.hypot(i.x - t, i.y - n) <= zr + r) return o;
  }
  return null;
}
function _p(e, t, n) {
  const r = pp(t, n), o = [];
  for (let i = 0; i < e.nodes.length; i++) {
    const a = e.nodes[i];
    fp(
      r,
      a.x,
      a.y + (a.bottom - a.top) / 2,
      a.halfWidth,
      (a.top + a.bottom) / 2
    ) && o.push(i);
  }
  return o;
}
const Mo = /* @__PURE__ */ new Map();
function wp(e) {
  let t = Mo.get(e);
  return t || (t = new Path2D(pn(e, 1)), Mo.set(e, t)), t;
}
const Ro = /* @__PURE__ */ new Map();
function Po(e) {
  const t = Ro.get(e);
  if (t) return t;
  const n = e.match(/-?\d*\.?\d+/g), r = n && n.length >= 3 ? [Number(n[0]), Number(n[1]), Number(n[2]), n.length > 3 ? Number(n[3]) : 1] : [128, 128, 128, 1];
  return Ro.set(e, r), r;
}
const Tn = /* @__PURE__ */ new Map(), fr = 16, xp = 4096;
function Ze(e, t, n) {
  const r = Math.max(0, Math.min(fr, Math.round(n * fr))), o = `${e}|${t}|${r}`, i = Tn.get(o);
  if (i) return i;
  const a = r / fr, [s, c, l, d] = Po(e);
  let f;
  if (t === "transparent")
    f = `rgba(${s}, ${c}, ${l}, ${(d * a).toFixed(3)})`;
  else {
    const [m, p, b, w] = Po(t), v = (h, g) => Math.round(h * a + g * (1 - a));
    f = `rgba(${v(s, m)}, ${v(c, p)}, ${v(l, b)}, ${(d * a + w * (1 - a)).toFixed(3)})`;
  }
  return Tn.size >= xp && Tn.clear(), Tn.set(o, f), f;
}
function jp(e, t, n, r) {
  const o = hp(r, t.length), i = /* @__PURE__ */ new Set();
  if (!o) return i;
  if (o >= t.length) {
    for (const s of t) i.add(s);
    return i;
  }
  const a = [...t].sort((s, c) => e.nodes[c].rank - e.nodes[s].rank || e.nodes[s].id.localeCompare(e.nodes[c].id));
  for (let s = 0; s < o; s++) i.add(a[s]);
  for (const s of [n.selectedId, n.hoveredId]) {
    const c = s ? e.index.get(s) : void 0;
    c !== void 0 && i.add(c);
  }
  return i;
}
function kp(e, t, n, r, o, i) {
  const { zoom: a } = n, s = (h) => h * a + n.x, c = (h) => h * a + n.y, l = _p(t, n, r), d = { nodes: l.length, edges: 0, labels: 0, territories: 0, territoriesHeld: 0 }, f = gp(i.detail);
  if (e.clearRect(0, 0, r.width, r.height), i.showRegions && t.regions.length) {
    const h = t.regions.slice(0, vp);
    d.territoriesHeld = t.regions.length - h.length;
    const g = [];
    e.save(), e.translate(n.x, n.y), e.scale(a, a);
    for (const E of h)
      e.fillStyle = Ze(o.family[E.family], "transparent", 0.055), e.fill(new Path2D(E.path)), d.territories++;
    e.restore(), e.textAlign = "center", e.textBaseline = "alphabetic";
    for (const E of h) {
      const T = s(E.labelX), S = c(E.labelY);
      T < -160 || T > r.width + 160 || S < 58 || S > r.height + 40 || g.some(([N, O]) => Math.abs(N - T) < Oo * 3 && Math.abs(O - S) < Oo) || (g.push([T, S]), e.fillStyle = Ze(o.family[E.family], o.bg, 0.66), e.font = `800 ${i.detail === "envelope" ? 12 : 9.5}px Inter, ui-sans-serif, system-ui, sans-serif`, e.fillText(E.label.toUpperCase(), T, S), e.fillStyle = o.muted, e.font = "600 10px Inter, ui-sans-serif, system-ui, sans-serif", e.fillText(`${E.size.toLocaleString()} records`, T, S + 14));
    }
  }
  if (i.detail === "envelope") {
    const h = Math.max(1.4, Math.min(3, a * 8)), g = /* @__PURE__ */ new Map();
    for (const E of l) {
      const T = g.get(t.nodes[E].family);
      T ? T.push(E) : g.set(t.nodes[E].family, [E]);
    }
    for (const [E, T] of g) {
      e.beginPath();
      for (const S of T) {
        const N = t.nodes[S];
        e.moveTo(s(N.x) + h, c(N.y)), e.arc(s(N.x), c(N.y), h, 0, Math.PI * 2);
      }
      e.fillStyle = Ze(o.family[E], "transparent", 0.62), e.fill();
    }
    return d;
  }
  const m = ["structure", "support", "succession", "conflict"], p = i.hoveredId || i.selectedId, b = p ? t.index.get(p) : void 0;
  for (const h of m) {
    e.beginPath();
    let g = 0;
    for (const E of t.edges) {
      if (E.family !== h || E.suggested) continue;
      const T = t.nodes[E.from], S = t.nodes[E.to], N = s(T.x), O = c(T.y), z = s(S.x), P = c(S.y);
      if (!(Math.max(N, z) < 0 || Math.min(N, z) > r.width) && !(Math.max(O, P) < 0 || Math.min(O, P) > r.height)) {
        if (e.moveTo(N, O), f.curves) {
          const Y = (N + z) / 2 - (P - O) * 0.09, ne = (O + P) / 2 + (z - N) * 0.09;
          e.quadraticCurveTo(Y, ne, z, P);
        } else
          e.lineTo(z, P);
        g++;
      }
    }
    g && (d.edges += g, e.strokeStyle = o.edge[h], e.lineWidth = h === "conflict" ? 1.4 : h === "structure" ? 0.9 : 1.2, e.globalAlpha = b === void 0 ? 1 : 0.24, e.setLineDash(h === "conflict" ? [5, 4] : h === "succession" ? [9, 4] : []), e.stroke(), e.setLineDash([]), e.globalAlpha = 1);
  }
  e.beginPath();
  let w = 0;
  for (const h of t.edges) {
    if (!h.suggested) continue;
    const g = t.nodes[h.from], E = t.nodes[h.to];
    e.moveTo(s(g.x), c(g.y)), e.lineTo(s(E.x), c(E.y)), w++;
  }
  if (w && (d.edges += w, e.strokeStyle = Ze(o.accent, "transparent", 0.34), e.lineWidth = 0.9, e.setLineDash([2, 4]), e.stroke(), e.setLineDash([])), b !== void 0) {
    e.beginPath();
    for (const h of t.edges) {
      if (h.from !== b && h.to !== b) continue;
      const g = t.nodes[h.from], E = t.nodes[h.to];
      e.moveTo(s(g.x), c(g.y)), e.lineTo(s(E.x), c(E.y));
    }
    e.strokeStyle = o.fg, e.globalAlpha = 0.55, e.lineWidth = 1.8, e.stroke(), e.globalAlpha = 1;
  }
  if (i.detail === "dot") {
    const h = /* @__PURE__ */ new Map();
    for (const g of l) {
      const E = h.get(t.nodes[g].family);
      E ? E.push(g) : h.set(t.nodes[g].family, [g]);
    }
    for (const [g, E] of h) {
      e.beginPath();
      for (const T of E) {
        const S = t.nodes[T], N = Math.max(1.4, S.radius * a * 0.62);
        e.moveTo(s(S.x) + N, c(S.y)), e.arc(s(S.x), c(S.y), N, 0, Math.PI * 2);
      }
      e.fillStyle = o.family[g], e.globalAlpha = i.mutedFamily && i.mutedFamily !== g ? 0.16 : 0.9, e.fill(), e.globalAlpha = 1;
    }
  } else
    for (const h of l) {
      const g = t.nodes[h], E = i.mutedFamily ? i.mutedFamily !== g.family : !1, T = o.family[g.family], S = Math.max(2, g.radius * a);
      e.save(), e.globalAlpha = E ? 0.18 : 1, e.translate(s(g.x), c(g.y)), e.scale(S, S);
      const N = wp(g.family);
      if (g.hollow ? (e.fillStyle = Ze(T, o.bg, 0.16), e.fill(N), e.strokeStyle = T, e.lineWidth = 2.6 / S, e.stroke(N)) : (e.fillStyle = g.settled ? Ze(T, o.bg, 0.46) : T, e.fill(N), g.folded && (e.strokeStyle = T, e.lineWidth = 1.6 / S, e.setLineDash([3 / S, 2.4 / S]), e.stroke(N), e.setLineDash([]))), e.restore(), g.lastWorkedAt && i.now - g.lastWorkedAt < Ao) {
        const O = 1 - (i.now - g.lastWorkedAt) / Ao;
        e.beginPath(), e.arc(s(g.x), c(g.y), S + 5, 0, Math.PI * 2), e.strokeStyle = Ze(o.accent, "transparent", 0.18 + O * 0.62), e.lineWidth = 1 + O * 2.2, e.stroke();
      }
      i.touched.has(g.id) && (e.beginPath(), e.arc(s(g.x), c(g.y), S + 8, 0, Math.PI * 2), e.strokeStyle = Ze(o.accent, "transparent", 0.4), e.lineWidth = 1.2, e.stroke()), (g.id === i.selectedId || g.id === i.hoveredId) && (e.beginPath(), e.arc(s(g.x), c(g.y), S + 11, 0, Math.PI * 2), e.strokeStyle = T, e.lineWidth = 1.6, e.setLineDash(g.id === i.selectedId ? [2.5, 3.5] : []), e.stroke(), e.setLineDash([]));
    }
  const v = jp(t, l, i, a);
  if (v.size) {
    e.textAlign = "center", e.textBaseline = "alphabetic", e.fillStyle = o.fg;
    for (const h of v) {
      const g = t.nodes[h];
      if (i.mutedFamily && i.mutedFamily !== g.family) continue;
      const E = g.id === i.selectedId || g.id === i.hoveredId;
      e.font = `${E ? 720 : 560} 9px Inter, ui-sans-serif, system-ui, sans-serif`;
      const T = c(g.y) + g.radius * a + 11.5;
      for (let S = 0; S < g.lines.length; S++)
        e.fillText(g.lines[S], s(g.x), T + S * Nr), d.labels++;
    }
  }
  if (i.detail === "full") {
    e.textAlign = "center", e.fillStyle = o.muted, e.font = "650 8px Inter, ui-sans-serif, system-ui, sans-serif";
    for (const h of v) {
      const g = t.nodes[h];
      if (!g.sessions) continue;
      const E = Se(g.lastWorkedAt, i.now), T = c(g.y) + g.radius * a + 11.5 + g.lines.length * Nr;
      e.fillText(`${g.sessions} session${g.sessions === 1 ? "" : "s"}${E ? ` · ${E}` : ""}`, s(g.x), T);
    }
  }
  if (f.labels && b !== void 0) {
    e.textAlign = "center", e.fillStyle = o.muted, e.font = "600 8.5px Inter, ui-sans-serif, system-ui, sans-serif";
    let h = 0;
    const g = /* @__PURE__ */ new Set();
    for (const E of t.edges) {
      if (h >= 5 || E.suggested || E.family === "structure" || E.from !== b && E.to !== b || g.has(E.label)) continue;
      g.add(E.label), h++;
      const T = t.nodes[E.from], S = t.nodes[E.to];
      e.fillText(E.label, (s(T.x) + s(S.x)) / 2, (c(T.y) + c(S.y)) / 2 - 4);
    }
  }
  if (i.detail !== "dot" && t.ports.length) {
    e.textAlign = "left", e.textBaseline = "middle";
    for (const h of t.ports) {
      const g = t.nodes[h.at], E = ss(t, h), T = s(E.x), S = c(E.y);
      if (T < -180 || T > r.width + 180 || S < -40 || S > r.height + 40 || (e.beginPath(), e.moveTo(s(g.x), c(g.y)), e.lineTo(T, S), e.strokeStyle = Ze(o.muted, "transparent", 0.4), e.lineWidth = 1, e.setLineDash([2, 3]), e.stroke(), e.setLineDash([]), e.beginPath(), e.arc(T, S, zr, 0, Math.PI * 2), e.fillStyle = o.bg, e.fill(), e.strokeStyle = o.muted, e.lineWidth = 1.4, e.stroke(), i.detail !== "full")) continue;
      e.fillStyle = o.muted, e.font = "600 8.5px Inter, ui-sans-serif, system-ui, sans-serif";
      const N = h.targetLabel.length > 26 ? `${h.targetLabel.slice(0, 25)}…` : h.targetLabel;
      e.fillText(`${h.outbound ? "→" : "←"} ${N}`, T + zr + 4, S);
    }
    e.textBaseline = "alphabetic";
  }
  for (const h of i.pins) {
    const g = t.index.get(h.nodeId);
    if (g === void 0) continue;
    const E = t.nodes[g], T = s(E.x) + E.radius * a + 12, S = c(E.y) - 26;
    if (T < -120 || T > r.width + 120 || S < -40 || S > r.height + 40) continue;
    e.globalAlpha = h.stale ? 0.38 : 1, e.beginPath(), e.moveTo(s(E.x), c(E.y)), e.lineTo(T, S + 9), e.strokeStyle = o.accent, e.lineWidth = 1, e.setLineDash([2, 2.5]), e.stroke(), e.setLineDash([]);
    const N = 26 + h.label.length * 4.6;
    e.beginPath(), e.roundRect(T, S - 9, N, 18, 9), e.fillStyle = Ze(o.accent, o.bg, 0.14), e.fill(), e.strokeStyle = Ze(o.accent, "transparent", 0.4), e.lineWidth = 1, e.stroke(), e.beginPath(), e.arc(T + 9, S, 6.4, 0, Math.PI * 2), e.fillStyle = o.accent, e.fill(), e.textAlign = "center", e.fillStyle = o.bg, e.font = "850 6.6px Inter, ui-sans-serif, system-ui, sans-serif", e.fillText(h.initials, T + 9, S + 2.3), e.textAlign = "left", e.fillStyle = o.accent, e.font = "700 8.2px Inter, ui-sans-serif, system-ui, sans-serif", e.fillText(h.label, T + 19, S + 2.6), e.globalAlpha = 1;
  }
  return d;
}
const ot = {
  anchor: "--jr-accent",
  rule: "--jr-rule",
  decision: "--jr-decision",
  evidence: "--jr-evidence",
  risk: "--jr-danger",
  open: "--jr-warn",
  agent: "--jr-accent-strong",
  note: "--jr-muted"
}, Lt = {
  structure: "--jr-muted",
  support: "--jr-success",
  conflict: "--jr-danger",
  succession: "--jr-decision",
  presence: "--jr-accent"
}, dt = {
  bg: "--jr-bg",
  fg: "--jr-fg",
  muted: "--jr-muted",
  faint: "--jr-faint",
  border: "--jr-border",
  accent: "--jr-accent",
  panel: "--jr-panel"
};
function Ep() {
  return [
    ...Object.values(dt),
    ...ns.map((e) => ot[e]),
    ot.agent,
    ...Object.values(Lt)
  ];
}
function Sp(e) {
  const t = e.createElement("div");
  t.setAttribute("aria-hidden", "true"), t.className = "jr-ink-probe";
  const n = [...new Set(Ep())];
  for (const r of n) {
    const o = e.createElement("i");
    o.dataset.token = r, o.style.color = `var(${r})`, t.appendChild(o);
  }
  return t;
}
const Lo = "CanvasText";
function Ip(e) {
  const t = /* @__PURE__ */ new Map();
  for (const r of Array.from(e.children)) {
    const o = r.dataset.token;
    if (!o) continue;
    const i = getComputedStyle(r).color;
    t.set(o, i && i !== "transparent" ? i : Lo);
  }
  const n = (r) => t.get(r) || Lo;
  return {
    bg: n(dt.bg),
    fg: n(dt.fg),
    muted: n(dt.muted),
    faint: n(dt.faint),
    border: n(dt.border),
    accent: n(dt.accent),
    panel: n(dt.panel),
    family: {
      anchor: n(ot.anchor),
      rule: n(ot.rule),
      decision: n(ot.decision),
      evidence: n(ot.evidence),
      risk: n(ot.risk),
      open: n(ot.open),
      agent: n(ot.agent),
      note: n(ot.note)
    },
    edge: {
      structure: n(Lt.structure),
      support: n(Lt.support),
      conflict: n(Lt.conflict),
      succession: n(Lt.succession),
      presence: n(Lt.presence)
    }
  };
}
function Tp(e) {
  const t = new MutationObserver(e);
  t.observe(document.documentElement, { attributes: !0, attributeFilter: ["class", "style", "data-theme"] });
  const n = window.matchMedia("(prefers-color-scheme: dark)");
  return n.addEventListener("change", e), () => {
    t.disconnect(), n.removeEventListener("change", e);
  };
}
const $p = { class: "jr-canvas-head" }, Cp = { class: "jr-canvas-stat" }, Ap = { class: "jr-canvas-drawn jr-numeric" }, Op = {
  key: 0,
  class: "jr-bound-dock",
  role: "group",
  "aria-label": "Whole graph"
}, Np = { class: "jr-bound-line" }, Mp = { class: "jr-numeric" }, Rp = { class: "jr-numeric" }, Pp = { class: "jr-bound-bar" }, Lp = { class: "jr-bound-line" }, Dp = { class: "jr-numeric" }, zp = { class: "jr-numeric" }, Vp = { class: "jr-bound-line error" }, Up = { class: "jr-bound-line" }, Fp = { class: "jr-numeric" }, Bp = {
  key: 4,
  class: "jr-bound-line"
}, Wp = { class: "jr-numeric" }, Hp = { class: "jr-numeric" }, Gp = {
  class: "jr-legend",
  role: "group",
  "aria-label": "Highlight a record family"
}, Yp = ["aria-pressed", "title", "onClick"], Kp = { class: "jr-numeric" }, qp = { class: "jr-canvas-tools" }, Xp = ["disabled"], Jp = ["disabled"], Zp = { class: "jr-zoom-value jr-numeric" }, Qp = { class: "jr-hovercard-kind" }, ef = { key: 0 }, tf = { key: 0 }, nf = { class: "jr-assemble-dock" }, rf = ["title"], of = ["disabled", "aria-busy", "title"], sf = {
  key: 0,
  class: "jr-spinner",
  "aria-hidden": "true"
}, af = {
  key: 2,
  class: "jr-canvas-state",
  role: "status"
}, lf = {
  key: 3,
  class: "jr-canvas-state"
}, cf = {
  class: "jr-canvas-state-mark",
  viewBox: "-30 -30 60 60",
  "aria-hidden": "true"
}, uf = ["d"], df = ["d"], pf = ["d"], ff = 4, hf = /* @__PURE__ */ Ne({
  __name: "GraphLens",
  props: {
    readOnly: { type: Boolean },
    nodes: {},
    edges: {},
    presence: {},
    touchedIds: {},
    selectedId: {},
    omittedNodes: {},
    omittedEdges: {},
    loading: { type: Boolean },
    assembly: {},
    assembling: { type: Boolean },
    whole: {},
    labels: {},
    activity: {},
    viewport: {},
    now: {}
  },
  emits: ["select", "focus", "port", "menu", "recompute", "loadAll", "cancelLoad", "viewport"],
  setup(e, { emit: t }) {
    const n = e, r = t, o = V(null), i = V(null), a = V(null);
    let s = null;
    const c = V({ width: 900, height: 620 }), l = V({ zoom: 1, x: 0, y: 0 }), d = V(""), f = V(""), m = V(!0), p = V(!1), b = V({ nodes: 0, edges: 0, labels: 0, territories: 0, territoriesHeld: 0 }), w = Ut(/* @__PURE__ */ new Map()), v = V(null), h = Ut(null), g = Ut(np);
    let E = null, T = null, S = null, N, O, z = 0, P, Y = !1, ne = null, M = 0, I = { x: 0, y: 0 };
    const A = L(() => n.nodes.filter((R) => !bn(R))), te = L(() => {
      const R = new Set(n.nodes.filter(bn).map(($) => $.id));
      return n.edges.filter(($) => !eo($) && !R.has($.from) && !R.has($.to));
    }), ie = L(() => {
      const R = /* @__PURE__ */ new Map();
      for (const $ of A.value) {
        const W = $e($.kind);
        R.set(W, (R.get(W) || 0) + 1);
      }
      return ns.filter(($) => R.has($)).map(($) => ({ family: $, count: R.get($) || 0 }));
    }), C = L(() => {
      const R = /* @__PURE__ */ new Set();
      for (const $ of n.presence) $.positionId && R.add($.positionId);
      return R;
    }), ee = L(() => n.presence.filter((R) => R.positionId).map((R) => ({ id: R.id, nodeId: R.positionId, initials: R.initials, label: R.label, stale: R.stale }))), B = L(() => Co(l.value.zoom, b.value.nodes || A.value.length)), X = L(() => Math.round(l.value.zoom * 100)), ue = L(() => B.value === "envelope" ? "territories" : B.value === "dot" ? "marks" : B.value === "mark" ? "marks and landmarks" : "full detail"), se = V(Math.floor(Date.now() / 1e3));
    let de;
    const me = L(() => Ac(n.assembly, se.value)), he = L(() => Oc(n.assembly)), we = L(() => (n.omittedNodes || 0) + (n.omittedEdges || 0)), Je = L(() => {
      const R = n.whole;
      return !R || !R.total ? 0 : Math.min(1, R.loaded / R.total);
    }), ae = L(() => d.value && n.nodes.find((R) => R.id === d.value) || null);
    function Q() {
      z || (z = requestAnimationFrame(() => {
        z = 0, it();
      }));
    }
    function it() {
      const R = h.value;
      if (!S || !i.value || !T || !R) return;
      const $ = Math.min(2, window.devicePixelRatio || 1), W = Math.round(c.value.width * $), ge = Math.round(c.value.height * $);
      (i.value.width !== W || i.value.height !== ge) && (i.value.width = W, i.value.height = ge), S.setTransform($, 0, 0, $, 0, 0), b.value = kp(S, R, l.value, c.value, T, {
        detail: Co(l.value.zoom, R.nodes.length),
        now: n.now,
        selectedId: n.selectedId || "",
        hoveredId: d.value,
        mutedFamily: f.value,
        touched: n.touchedIds || /* @__PURE__ */ new Set(),
        showRegions: m.value,
        pins: ee.value
      });
    }
    async function We(R = !1, $ = !1) {
      if (!E) return;
      const W = A.value, ge = te.value, Ue = dp(W.length, c.value);
      p.value = !0;
      const Pe = await E.solve({
        nodes: W,
        edges: ge,
        width: Ue.width,
        height: Ue.height,
        emphasis: C.value,
        held: w.value,
        fresh: R,
        unpin: $
      });
      Pe && (p.value = !1, g.value = Pe, h.value = yp(Pe, W, ge, n.labels || /* @__PURE__ */ new Map(), n.activity || /* @__PURE__ */ new Map()), Y || Re(), Q());
    }
    function be(R = !1) {
      clearTimeout(P), P = setTimeout(() => {
        We(R);
      }, 60);
    }
    function Re() {
      const R = h.value;
      l.value = lp(R?.bounds || null, c.value);
    }
    function xe() {
      r("viewport", { zoom: l.value.zoom, x: l.value.x, y: l.value.y });
    }
    function De() {
      Y = !1, Re(), xe(), Q();
    }
    function He(R) {
      Y = !0, l.value = $o(l.value, R, c.value.width / 2, c.value.height / 2), xe(), Q();
    }
    function ze() {
      const R = n.selectedId, $ = R ? rp(g.value, R) : null;
      if (!$) {
        De();
        return;
      }
      Y = !0;
      const W = Gn(Math.max(l.value.zoom, 1.2));
      l.value = { zoom: W, x: c.value.width / 2 - $.x * W, y: c.value.height / 2 - $.y * W }, xe(), Q();
    }
    function mt() {
      w.value = /* @__PURE__ */ new Map(), be();
    }
    function At() {
      w.value = /* @__PURE__ */ new Map(), Y = !1, We(!0, !0);
    }
    function Ot(R) {
      f.value = f.value === R ? "" : R, Q();
    }
    function Ve(R) {
      const $ = i.value?.getBoundingClientRect();
      return $ ? Lr(l.value, R.clientX - $.left, R.clientY - $.top) : { x: 0, y: 0 };
    }
    function Xt(R) {
      const $ = i.value?.getBoundingClientRect();
      $ && (Y = !0, l.value = $o(l.value, R.deltaY > 0 ? 0.9 : 1.1, R.clientX - $.left, R.clientY - $.top), xe(), Q());
    }
    function Jt(R) {
      const $ = Ve(R);
      R.currentTarget.setPointerCapture(R.pointerId), M = 0, I = { x: R.clientX, y: R.clientY };
      const ge = !!!(h.value && No(h.value, $.x, $.y)) && h.value ? sn(h.value, $.x, $.y) : "";
      if (ge) {
        const Ue = g.value.index.get(ge);
        ne = { id: ge, offsetX: g.value.positions[Ue * 2] - $.x, offsetY: g.value.positions[Ue * 2 + 1] - $.y, moved: !1 };
        return;
      }
      v.value = { x: R.clientX, y: R.clientY, from: { ...l.value } };
    }
    function Zt(R) {
      if ((ne || v.value) && (M = Math.max(M, Math.hypot(R.clientX - I.x, R.clientY - I.y))), ne) {
        const ge = Ve(R), Ue = new Map(w.value);
        Ue.set(ne.id, { px: ge.x + ne.offsetX, py: ge.y + ne.offsetY }), w.value = Ue, ne.moved = !0;
        const Pe = g.value.index.get(ne.id);
        if (Pe !== void 0) {
          g.value.positions[Pe * 2] = ge.x + ne.offsetX, g.value.positions[Pe * 2 + 1] = ge.y + ne.offsetY;
          const yt = h.value?.nodes[Pe];
          yt && (yt.x = ge.x + ne.offsetX, yt.y = ge.y + ne.offsetY);
        }
        Q();
        return;
      }
      if (v.value) {
        Y = !0, l.value = {
          zoom: v.value.from.zoom,
          x: v.value.from.x + R.clientX - v.value.x,
          y: v.value.from.y + R.clientY - v.value.y
        }, Q();
        return;
      }
      const $ = Ve(R), W = h.value ? sn(h.value, $.x, $.y) : "";
      W !== d.value && (d.value = W, Q());
    }
    function Nt() {
      v.value && xe(), v.value = null, ne?.moved && be(), ne = null;
    }
    function Ge() {
      return M > ff;
    }
    function vt(R) {
      if (Ge()) return;
      const $ = Ve(R), W = h.value ? No(h.value, $.x, $.y) : null;
      if (W) {
        r("port", W.targetId);
        return;
      }
      const ge = h.value ? sn(h.value, $.x, $.y) : "";
      ge && r("select", ge);
    }
    function bt(R) {
      if (Ge()) return;
      const $ = Ve(R), W = h.value ? sn(h.value, $.x, $.y) : "";
      W && r("focus", W);
    }
    function Mt(R) {
      const $ = Ve(R), W = h.value ? sn(h.value, $.x, $.y) : "";
      W && r("menu", W, R);
    }
    function et() {
      s && (T = Ip(s), Q());
    }
    return _n(() => {
      E = new op(() => new Gu()), S = i.value?.getContext("2d") || null, a.value && (s = Sp(document), a.value.appendChild(s)), Tt(et), O = Tp(et), de = setInterval(() => {
        se.value = Math.floor(Date.now() / 1e3);
      }, 3e4), N = new ResizeObserver((R) => {
        const $ = R[0]?.contentRect;
        if (!$) return;
        const W = { width: Math.max(200, Math.round($.width)), height: Math.max(160, Math.round($.height)) };
        W.width === c.value.width && W.height === c.value.height || (c.value = W, be());
      }), o.value && N.observe(o.value), We();
    }), wn(() => {
      N?.disconnect(), N = void 0, O?.(), O = void 0, de && clearInterval(de), de = void 0, z && cancelAnimationFrame(z), z = 0, clearTimeout(P), P = void 0, s = null, E?.dispose(), E = null;
    }), _e(() => n.viewport, (R) => {
      !R || R.zoom === void 0 || (Y = !0, l.value = { zoom: Gn(R.zoom), x: R.x || 0, y: R.y || 0 }, Q());
    }, { immediate: !0 }), _e(() => [n.nodes, n.edges], () => be()), _e(() => n.whole?.done, (R, $) => {
      !R || $ || (Y = !1, We(!0));
    }), _e(() => n.selectedId, Q), _e(() => n.touchedIds, Q), _e(() => n.presence, Q), _e(() => n.activity, () => {
      const R = h.value;
      if (R) for (const $ of R.nodes) {
        const W = n.activity?.get($.id);
        $.sessions = W?.sessions || 0, $.lastWorkedAt = W?.lastActivityAt || 0;
      }
      Q();
    }), (R, $) => (x(), j("section", {
      ref_key: "host",
      ref: o,
      class: "jr-graph",
      "aria-label": "Knowledge graph"
    }, [
      u("canvas", {
        ref_key: "canvas",
        ref: i,
        class: oe(["jr-graph-canvas", { grabbing: v.value }]),
        role: "application",
        "aria-label": "Bounded knowledge graph",
        onWheel: Xe(Xt, ["prevent"]),
        onPointerdown: Jt,
        onPointermove: Zt,
        onPointerup: Nt,
        onPointercancel: Nt,
        onPointerleave: $[0] || ($[0] = (W) => {
          d.value = "", Q();
        }),
        onClick: vt,
        onDblclick: Xe(bt, ["prevent"]),
        onContextmenu: Xe(Mt, ["prevent"])
      }, null, 34),
      u("div", {
        ref_key: "probe",
        ref: a,
        class: "jr-ink-probe-host",
        "aria-hidden": "true"
      }, null, 512),
      u("div", $p, [
        u("div", Cp, [
          u("b", null, y(e.nodes.length.toLocaleString()), 1),
          $[11] || ($[11] = u("span", null, "records", -1)),
          $[12] || ($[12] = u("i", { "aria-hidden": "true" }, null, -1)),
          u("b", null, y(e.edges.length.toLocaleString()), 1),
          $[13] || ($[13] = u("span", null, "relations", -1)),
          ee.value.length ? (x(), j(K, { key: 0 }, [
            $[9] || ($[9] = u("i", { "aria-hidden": "true" }, null, -1)),
            u("b", null, y(ee.value.length), 1),
            $[10] || ($[10] = u("span", null, "agents here", -1))
          ], 64)) : q("", !0)
        ]),
        u("p", Ap, [
          J(" Drawing " + y(b.value.nodes.toLocaleString()) + " on screen at " + y(ue.value) + " ", 1),
          b.value.territories ? (x(), j(K, { key: 0 }, [
            J(" · " + y(b.value.territories) + " territories named", 1)
          ], 64)) : q("", !0),
          b.value.territoriesHeld ? (x(), j(K, { key: 1 }, [
            J(" of " + y((b.value.territories + b.value.territoriesHeld).toLocaleString()), 1)
          ], 64)) : q("", !0)
        ])
      ]),
      we.value || e.whole?.running || e.whole?.error || e.whole?.cancelled || e.whole?.done ? (x(), j("div", Op, [
        e.whole?.running ? (x(), j(K, { key: 0 }, [
          u("p", Np, [
            $[14] || ($[14] = u("span", { class: "jr-bound-label" }, "Loading the whole graph", -1)),
            u("b", Mp, y(e.whole.loaded.toLocaleString()) + " / " + y(e.whole.total.toLocaleString()), 1),
            u("span", Rp, "· " + y(e.whole.chunks) + " chunk" + y(e.whole.chunks === 1 ? "" : "s"), 1)
          ]),
          u("div", Pp, [
            u("i", {
              style: Ee({ width: `${Math.round(Je.value * 100)}%` })
            }, null, 4)
          ]),
          u("button", {
            class: "jr-bound-stop",
            onClick: $[1] || ($[1] = (W) => r("cancelLoad"))
          }, [
            G(_(Z), {
              icon: "tabler:player-stop",
              "aria-hidden": "true"
            }),
            $[15] || ($[15] = J(" Stop ", -1))
          ])
        ], 64)) : we.value ? (x(), j(K, { key: 1 }, [
          u("p", Lp, [
            $[16] || ($[16] = u("span", { class: "jr-bound-label" }, "Window bounded", -1)),
            u("b", Dp, y((e.omittedNodes || 0).toLocaleString()), 1),
            $[17] || ($[17] = u("span", null, "records", -1)),
            $[18] || ($[18] = u("span", { class: "jr-numeric" }, "and", -1)),
            u("b", zp, y((e.omittedEdges || 0).toLocaleString()), 1),
            $[19] || ($[19] = u("span", null, "relations outside", -1))
          ]),
          u("button", {
            class: "jr-bound-load",
            onClick: $[2] || ($[2] = (W) => r("loadAll"))
          }, [
            G(_(Z), {
              icon: "tabler:arrow-bar-to-down",
              "aria-hidden": "true"
            }),
            $[20] || ($[20] = J(" Load all ", -1))
          ])
        ], 64)) : e.whole?.error ? (x(), j(K, { key: 2 }, [
          u("p", Vp, y(e.whole.error), 1),
          u("button", {
            class: "jr-bound-load",
            onClick: $[3] || ($[3] = (W) => r("loadAll"))
          }, [
            G(_(Z), {
              icon: "tabler:refresh",
              "aria-hidden": "true"
            }),
            $[21] || ($[21] = J(" Try again", -1))
          ])
        ], 64)) : e.whole?.cancelled ? (x(), j(K, { key: 3 }, [
          u("p", Up, [
            $[22] || ($[22] = u("span", { class: "jr-bound-label" }, "Stopped", -1)),
            u("b", Fp, y(e.whole.loaded.toLocaleString()), 1),
            $[23] || ($[23] = u("span", null, "loaded", -1))
          ]),
          u("button", {
            class: "jr-bound-load",
            onClick: $[4] || ($[4] = (W) => r("loadAll"))
          }, [
            G(_(Z), {
              icon: "tabler:arrow-bar-to-down",
              "aria-hidden": "true"
            }),
            $[24] || ($[24] = J(" Continue", -1))
          ])
        ], 64)) : e.whole?.done ? (x(), j("p", Bp, [
          $[27] || ($[27] = u("span", { class: "jr-bound-label" }, "Fully loaded", -1)),
          u("b", Wp, y(e.whole.loaded.toLocaleString()), 1),
          $[28] || ($[28] = u("span", null, "records and relations", -1)),
          h.value && h.value.ports.length ? (x(), j(K, { key: 0 }, [
            $[25] || ($[25] = u("span", { class: "jr-numeric" }, "·", -1)),
            u("b", Hp, y(h.value.ports.length), 1),
            $[26] || ($[26] = u("span", null, "ports out", -1))
          ], 64)) : q("", !0)
        ])) : q("", !0)
      ])) : q("", !0),
      u("div", Gp, [
        (x(!0), j(K, null, re(ie.value, (W) => (x(), j("button", {
          key: W.family,
          class: oe(["jr-legend-item", `family-${W.family}`, { on: f.value === W.family }]),
          "aria-pressed": f.value === W.family,
          title: `Highlight ${_(So)[W.family].toLowerCase()}`,
          onClick: (ge) => Ot(W.family)
        }, [
          G(Gt, {
            class: "jr-legend-mark",
            family: W.family,
            radius: 7.2,
            "view-box": "-11 -11 22 22"
          }, null, 8, ["family"]),
          u("span", null, y(_(So)[W.family]), 1),
          u("em", Kp, y(W.count.toLocaleString()), 1)
        ], 10, Yp))), 128))
      ]),
      u("div", qp, [
        u("button", {
          class: oe(["jr-tool", { on: m.value }]),
          "aria-label": "Toggle branch territories",
          title: "Branch territories",
          onClick: $[5] || ($[5] = (W) => {
            m.value = !m.value, Q();
          })
        }, [
          G(_(Z), {
            icon: "tabler:chart-area-line",
            "aria-hidden": "true"
          })
        ], 2),
        u("button", {
          class: oe(["jr-tool", { on: w.value.size > 0 }]),
          disabled: !w.value.size,
          "aria-label": "Release held records",
          title: "Release held records",
          onClick: mt
        }, [
          G(_(Z), {
            icon: "tabler:pinned-off",
            "aria-hidden": "true"
          })
        ], 10, Xp),
        u("button", {
          class: "jr-tool",
          disabled: p.value,
          "aria-label": "Re-layout the graph",
          title: "Re-layout: arrange the whole graph afresh and fit it to the pane",
          onClick: At
        }, [
          G(_(Z), {
            icon: "tabler:refresh",
            "aria-hidden": "true"
          })
        ], 8, Jp),
        $[29] || ($[29] = u("i", {
          class: "jr-tool-divider",
          "aria-hidden": "true"
        }, null, -1)),
        u("button", {
          class: "jr-tool",
          "aria-label": "Zoom out",
          title: "Zoom out",
          onClick: $[6] || ($[6] = (W) => He(0.82))
        }, [
          G(_(Z), {
            icon: "tabler:minus",
            "aria-hidden": "true"
          })
        ]),
        u("span", Zp, y(X.value) + "%", 1),
        u("button", {
          class: "jr-tool",
          "aria-label": "Zoom in",
          title: "Zoom in",
          onClick: $[7] || ($[7] = (W) => He(1.22))
        }, [
          G(_(Z), {
            icon: "tabler:plus",
            "aria-hidden": "true"
          })
        ]),
        $[30] || ($[30] = u("i", {
          class: "jr-tool-divider",
          "aria-hidden": "true"
        }, null, -1)),
        u("button", {
          class: "jr-tool",
          "aria-label": "Centre the selected record",
          title: "Centre selection",
          onClick: ze
        }, [
          G(_(Z), {
            icon: "tabler:focus-2",
            "aria-hidden": "true"
          })
        ]),
        u("button", {
          class: "jr-tool",
          "aria-label": "Fit the graph to the canvas",
          title: "Fit to canvas",
          onClick: De
        }, [
          G(_(Z), {
            icon: "tabler:arrows-maximize",
            "aria-hidden": "true"
          })
        ])
      ]),
      ae.value ? (x(), j("figure", {
        key: 1,
        class: oe(["jr-hovercard", `family-${_($e)(ae.value.kind)}`])
      }, [
        u("figcaption", null, [
          u("span", Qp, y(ae.value.kind.replace(/_/g, " ")), 1),
          u("b", null, y(ae.value.label), 1)
        ]),
        ae.value.summary ? (x(), j("p", ef, y(ae.value.summary), 1)) : q("", !0),
        u("dl", null, [
          u("div", null, [
            $[31] || ($[31] = u("dt", null, "Children", -1)),
            u("dd", null, y(ae.value.child_count), 1)
          ]),
          u("div", null, [
            $[32] || ($[32] = u("dt", null, "Revision", -1)),
            u("dd", null, y(ae.value.revision), 1)
          ]),
          ae.value.status ? (x(), j("div", tf, [
            $[33] || ($[33] = u("dt", null, "State", -1)),
            u("dd", null, y(ae.value.status), 1)
          ])) : q("", !0)
        ])
      ], 2)) : q("", !0),
      u("div", nf, [
        u("p", {
          class: "jr-assemble-line",
          title: he.value
        }, [
          u("span", {
            class: oe(["jr-assemble-state", { busy: e.assembling || p.value }]),
            "aria-hidden": "true"
          }, null, 2),
          J(" " + y(p.value ? "Laying out the graph…" : me.value), 1)
        ], 8, rf),
        e.readOnly ? q("", !0) : (x(), j("button", {
          key: 0,
          class: "jr-assemble-run",
          disabled: e.assembling,
          "aria-busy": e.assembling ? "true" : "false",
          title: e.assembling ? "An assembly pass is already running" : "Derive every relation the records state, then propose the rest",
          onClick: $[8] || ($[8] = (W) => r("recompute"))
        }, [
          e.assembling ? (x(), j("span", sf)) : (x(), rt(_(Z), {
            key: 1,
            icon: "tabler:topology-star-ring-3",
            "aria-hidden": "true"
          })),
          u("span", null, y(e.assembling ? "Assembling…" : "Recompute map"), 1)
        ], 8, of))
      ]),
      e.loading && !e.nodes.length ? (x(), j("div", af, [...$[34] || ($[34] = [
        u("span", {
          class: "jr-spinner",
          "aria-hidden": "true"
        }, null, -1),
        u("h3", null, "Projecting the window", -1),
        u("p", null, "Reading the bounded graph around the current focus.", -1)
      ])])) : e.nodes.length ? q("", !0) : (x(), j("div", lf, [
        (x(), j("svg", cf, [
          u("path", {
            d: _(pn)("anchor", 11),
            transform: "translate(-16 -8)"
          }, null, 8, uf),
          u("path", {
            d: _(pn)("rule", 9),
            transform: "translate(14 -12)"
          }, null, 8, df),
          u("path", {
            d: _(pn)("evidence", 8),
            transform: "translate(2 14)"
          }, null, 8, pf)
        ])),
        $[35] || ($[35] = u("h3", null, "Nothing in this window", -1)),
        $[36] || ($[36] = u("p", null, "This focus level holds no records yet. Step out, or pick another graph from the navigator.", -1))
      ]))
    ], 512));
  }
}), gf = /* @__PURE__ */ Ne({
  __name: "JournalContextMenu",
  props: {
    x: {},
    y: {}
  },
  emits: ["close", "details", "focus", "copy"],
  setup(e, { emit: t }) {
    const n = e, r = V(null), o = V(null), i = V({ left: "0px", top: "0px", visibility: "hidden" });
    function a() {
      const l = r.value?.getBoundingClientRect(), d = o.value?.getBoundingClientRect();
      if (!l || !d) return;
      const f = Math.max(0, Math.min(n.x - l.left, l.width - d.width)), m = Math.max(0, Math.min(n.y - l.top, l.height - d.height));
      i.value = { left: `${f}px`, top: `${m}px`, visibility: "visible" };
    }
    _e(() => [n.x, n.y], () => {
      Tt(a);
    }), _n(() => {
      Tt(() => {
        a(), o.value?.focus();
      }), window.addEventListener("resize", a);
    }), wn(() => window.removeEventListener("resize", a));
    const s = t;
    function c(l) {
      s(l), s("close");
    }
    return (l, d) => (x(), j("div", {
      ref_key: "layer",
      ref: r,
      class: "jr-context-overlay",
      onClick: d[6] || (d[6] = (f) => s("close")),
      onContextmenu: d[7] || (d[7] = Xe((f) => s("close"), ["prevent"]))
    }, [
      u("div", {
        ref_key: "panel",
        ref: o,
        class: "jr-context-menu",
        style: Ee(i.value),
        role: "menu",
        tabindex: "-1",
        onKeydown: d[3] || (d[3] = Jo(Xe((f) => s("close"), ["stop", "prevent"]), ["esc"])),
        onClick: d[4] || (d[4] = Xe(() => {
        }, ["stop"])),
        onContextmenu: d[5] || (d[5] = Xe(() => {
        }, ["prevent", "stop"]))
      }, [
        u("button", {
          role: "menuitem",
          onClick: d[0] || (d[0] = (f) => c("details"))
        }, [
          G(_(Z), {
            icon: "tabler:info-circle",
            "aria-hidden": "true"
          }),
          d[8] || (d[8] = J(" Details", -1))
        ]),
        u("button", {
          role: "menuitem",
          onClick: d[1] || (d[1] = (f) => c("focus"))
        }, [
          G(_(Z), {
            icon: "tabler:arrow-up-right",
            "aria-hidden": "true"
          }),
          d[9] || (d[9] = J(" Focus here", -1))
        ]),
        u("button", {
          role: "menuitem",
          onClick: d[2] || (d[2] = (f) => c("copy"))
        }, [
          G(_(Z), {
            icon: "tabler:copy",
            "aria-hidden": "true"
          }),
          d[10] || (d[10] = J(" Copy address", -1))
        ])
      ], 36)
    ], 544));
  }
}), Do = 300, mf = 2700, vf = 10, $n = 0.032, hr = "·journal";
function bf(e, t, n, r) {
  const o = [];
  for (const i of e) {
    if (!i.started_at) continue;
    const a = i.state === "open" ? r : i.ended_at || i.last_activity_at || i.started_at;
    o.push([i.started_at, Math.max(i.started_at, a)]);
  }
  for (const i of t)
    i.bucket_at && o.push([Math.min(i.bucket_at, r), Math.min(i.bucket_at + Math.max(60, n), r)]);
  return o;
}
function zo(e, t) {
  const n = [...e].sort((o, i) => o[0] - i[0] || o[1] - i[1]), r = [];
  for (const [o, i] of n) {
    const a = r[r.length - 1];
    a && o - a[1] <= t ? a[1] = Math.max(a[1], i) : r.push([o, i]);
  }
  return r;
}
function yf(e) {
  return e < 5400 ? `${Math.max(1, Math.round(e / 60))}m` : e < 36 * 3600 ? `${Math.round(e / 3600)}h` : `${(e / 86400).toFixed(1)}d`;
}
function Vo(e, t) {
  const n = new Date(e * 1e3), r = n.toLocaleDateString([], { month: "short", day: "numeric" }), o = n.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  return t > 30 * 86400 ? r : t > 40 * 3600 ? `${r} ${o}` : o;
}
function _f(e, t, n, r) {
  let o = bf(e, t, n, r);
  o.length || (o = [[r - Do, r]]), o.push([r - 60, r]);
  let i = mf, a = zo(o, i);
  for (; a.length > vf; )
    i *= 2, a = zo(o, i);
  const c = (a.length - 1) * $n, l = Math.max(1e-9, 1 - c), d = Math.max(1, a.reduce((S, [N, O]) => S + Math.max(1, O - N), 0)), f = [], m = [];
  let p = 0;
  for (let S = 0; S < a.length; S++) {
    const [N, O] = a[S], z = Math.max(1, O - N) / d * l;
    f.push({ from: N, to: O, x0: p, x1: p + z, idle: !1 }), p += z;
    const P = a[S + 1];
    if (P) {
      const Y = P[0] - O;
      f.push({ from: O, to: P[0], x0: p, x1: p + $n, idle: !0 }), m.push({ offset: p, width: $n, seconds: Y, label: `${yf(Y)} idle` }), p += $n;
    }
  }
  const b = f[f.length - 1];
  b && (b.x1 = 1);
  const w = a[0][0], v = a[a.length - 1][1], h = Math.max(Do, v - w), g = [], E = h > 40 * 3600 ? 0.105 : 0.055, T = (S, N) => {
    const O = g[g.length - 1];
    O && N - O.offset < E || g.push({ at: S, offset: N, label: Vo(S, h) });
  };
  for (const S of f)
    if (!S.idle && (T(S.from, S.x0), S.x1 - S.x0 > 0.24)) {
      const N = (S.from + S.to) / 2;
      T(N, (S.x0 + S.x1) / 2);
    }
  for (; g.length && 1 - g[g.length - 1].offset < E; ) g.pop();
  return g.push({ at: v, offset: 1, label: Vo(v, h) }), { from: w, to: v, segments: f, marks: g, gaps: m };
}
function Vr(e, t) {
  if (e <= t.from) return 0;
  if (e >= t.to) return 1;
  for (const n of t.segments) {
    if (e > n.to) continue;
    const r = Math.max(1, n.to - n.from);
    return n.x0 + (e - n.from) / r * (n.x1 - n.x0);
  }
  return 1;
}
function wf(e, t) {
  const n = Vr(e.startedAt, t), r = Vr(e.endedAt, t);
  return { start: n, width: Math.max(0, r - n) };
}
function xf(e, t) {
  const n = e.state === "open";
  return {
    spanId: e.span_id,
    startedAt: e.started_at,
    endedAt: n ? Math.max(t, e.last_activity_at) : e.ended_at || e.last_activity_at,
    open: n,
    purpose: e.working_on?.text || e.last_fact?.title || "",
    factCount: e.fact_count || 0,
    outcome: e.closed_reason || (n ? "open" : "sealed")
  };
}
function jf(e, t, n) {
  const r = /* @__PURE__ */ new Map();
  function o(i, a) {
    const s = Ki(i, a), c = r.get(s);
    if (c) return c;
    const l = lt(i || a || s), d = {
      agentId: s,
      label: l.label,
      initials: l.initials,
      unattributed: !1,
      spans: [],
      ticks: [],
      events: 0,
      lastActivityAt: 0
    };
    return r.set(s, d), d;
  }
  for (const i of e) {
    const a = o(i.agent_id, i.cursor_id), s = xf(i, n);
    a.spans.push(s), a.lastActivityAt = Math.max(a.lastActivityAt, i.last_activity_at, i.ended_at || 0);
  }
  for (const i of t) {
    let a;
    i.agent_id ? a = o(i.agent_id, "") : a = r.get(hr) || (() => {
      const s = {
        agentId: hr,
        label: "Journal · unattributed",
        initials: "·",
        unattributed: !0,
        spans: [],
        ticks: [],
        events: 0,
        lastActivityAt: 0
      };
      return r.set(hr, s), s;
    })(), a.ticks.push({ at: i.bucket_at, events: i.events || 0 }), a.events += i.events || 0, a.lastActivityAt = Math.max(a.lastActivityAt, i.last_ts || i.bucket_at);
  }
  for (const i of r.values())
    i.spans.sort((a, s) => a.startedAt - s.startedAt), i.ticks.sort((a, s) => a.at - s.at);
  return [...r.values()].sort((i, a) => Number(i.unattributed) - Number(a.unattributed) || a.lastActivityAt - i.lastActivityAt || i.label.localeCompare(a.label));
}
function as(e) {
  return e.task_id || e.working_on?.kind === "task" && e.working_on.text || "";
}
function kf(e, t) {
  const n = e.find((r) => r.span_id === t);
  return n ? { taskId: as(n), agentId: (n.agent_id || n.cursor_id || "").trim() } : null;
}
const Ef = {
  class: "jr-lanes",
  "aria-label": "Agent lanes"
}, Sf = { class: "jr-lens-meta" }, If = { class: "jr-lens-facts" }, Tf = { class: "jr-numeric" }, $f = { class: "jr-numeric" }, Cf = { class: "jr-numeric" }, Af = {
  key: 0,
  class: "jr-empty-state"
}, Of = {
  key: 1,
  class: "jr-lane-board"
}, Nf = {
  class: "jr-lane-ruler",
  "aria-hidden": "true"
}, Mf = { class: "jr-lane-rows" }, Rf = {
  class: "jr-lane-gaps",
  "aria-hidden": "true"
}, Pf = ["title", "disabled", "onClick"], Lf = { class: "jr-avatar" }, Df = { class: "jr-numeric" }, zf = { class: "jr-lane-track" }, Vf = ["title"], Uf = ["title", "onClick"], Ff = { class: "jr-numeric" }, Bf = /* @__PURE__ */ Ne({
  __name: "LanesLens",
  props: {
    spans: {},
    buckets: {},
    bucketWidthS: {},
    now: {}
  },
  emits: ["agent", "span"],
  setup(e, { emit: t }) {
    const n = e, r = t, o = L(() => _f(n.spans, n.buckets, n.bucketWidthS || 3600, n.now)), i = L(() => jf(n.spans, n.buckets, n.now)), a = L(() => Math.max(1, ...i.value.flatMap((c) => c.ticks.map((l) => l.events))));
    function s(c) {
      const l = wf(c, o.value);
      return { left: `${l.start * 100}%`, width: `${l.width * 100}%` };
    }
    return (c, l) => (x(), j("section", Ef, [
      u("div", Sf, [
        l[5] || (l[5] = u("span", { class: "jr-lens-title" }, "Lanes", -1)),
        u("span", If, [
          u("b", Tf, y(i.value.length), 1),
          l[0] || (l[0] = J(" lanes ", -1)),
          l[1] || (l[1] = u("i", { "aria-hidden": "true" }, null, -1)),
          u("b", $f, y(e.spans.length), 1),
          l[2] || (l[2] = J(" spans ", -1)),
          l[3] || (l[3] = u("i", { "aria-hidden": "true" }, null, -1)),
          u("b", Cf, y(e.buckets.length), 1),
          l[4] || (l[4] = J(" buckets ", -1))
        ])
      ]),
      i.value.length ? (x(), j("div", Of, [
        u("div", Nf, [
          (x(!0), j(K, null, re(o.value.marks, (d) => (x(), j("span", {
            key: d.at,
            style: Ee({ left: `${d.offset * 100}%` })
          }, y(d.label), 5))), 128))
        ]),
        u("div", Mf, [
          u("div", Rf, [
            (x(!0), j(K, null, re(o.value.gaps, (d) => (x(), j("div", {
              key: d.offset,
              class: "jr-lane-gap",
              style: Ee({ left: `${d.offset * 100}%`, width: `${d.width * 100}%` })
            }, [
              u("span", null, y(d.label), 1)
            ], 4))), 128))
          ]),
          (x(!0), j(K, null, re(i.value, (d) => (x(), j("div", {
            key: d.agentId,
            class: oe(["jr-lane", { unattributed: d.unattributed }])
          }, [
            u("button", {
              class: "jr-lane-name",
              title: d.label,
              disabled: d.unattributed,
              onClick: (f) => r("agent", d.agentId)
            }, [
              u("span", Lf, y(d.initials), 1),
              u("span", null, [
                u("b", null, y(d.label), 1),
                u("small", Df, y(d.events) + " fact" + y(d.events === 1 ? "" : "s") + " · " + y(_(Se)(d.lastActivityAt, e.now)), 1)
              ])
            ], 8, Pf),
            u("div", zf, [
              (x(!0), j(K, null, re(d.ticks, (f) => (x(), j("i", {
                key: f.at,
                class: "jr-lane-tick",
                style: Ee({ left: `${_(Vr)(f.at, o.value) * 100}%`, height: `${Math.max(12, f.events / a.value * 100)}%` }),
                title: `${f.events} facts`
              }, null, 12, Vf))), 128)),
              (x(!0), j(K, null, re(d.spans, (f) => (x(), j("button", {
                key: f.spanId,
                class: oe(["jr-lane-span", { open: f.open, [`outcome-${f.outcome}`]: f.outcome }]),
                style: Ee(s(f)),
                title: `${f.purpose} · ${f.factCount} facts · ${f.open ? "still open" : f.outcome}`,
                onClick: (m) => r("span", f.spanId)
              }, [
                u("span", null, y(f.purpose), 1),
                u("em", Ff, y(f.factCount), 1)
              ], 14, Uf))), 128))
            ])
          ], 2))), 128))
        ])
      ])) : (x(), j("div", Af, [
        G(_(Z), {
          icon: "tabler:timeline",
          "aria-hidden": "true"
        }),
        l[6] || (l[6] = u("h3", null, "No agent has worked in this journal yet", -1)),
        l[7] || (l[7] = u("p", null, "A lane appears the moment an identity writes its first fact; the span it opens is the bar.", -1))
      ]))
    ]));
  }
}), ls = 3 * 86400;
function St(e, t) {
  const n = Math.max(0, Math.floor(t - e)), r = n < 3600 ? "live" : n < ls ? "recent" : "dormant";
  return { seconds: n, label: Se(e, t), tier: r };
}
function cs(e) {
  const t = { status: e };
  return Xn(t) || Wt(t);
}
function Wf(e) {
  const t = new Set(e.map((r) => r.id)), n = /* @__PURE__ */ new Map();
  for (const r of e) {
    const o = r.parent_task_id && r.parent_task_id !== r.id && t.has(r.parent_task_id) ? r.parent_task_id : "", i = n.get(o) || [];
    i.push(r), n.set(o, i);
  }
  return n;
}
const Uo = /* @__PURE__ */ new WeakMap();
function us(e) {
  const t = Uo.get(e);
  if (t) return t;
  const n = Wf(e), r = { children: n, activity: Gf(e, n) };
  return Uo.set(e, r), r;
}
function Hf(e, t, n) {
  const r = [], o = [...t.get(e.id) || []];
  for (; o.length; ) {
    const i = o.shift();
    n.has(i.id) || (n.add(i.id), r.push(i), o.push(...t.get(i.id) || []));
  }
  return r;
}
function Gf(e, t) {
  const n = /* @__PURE__ */ new Map(), r = /* @__PURE__ */ new Set(), o = [], i = (a) => {
    for (o.push({ task: a, opened: !1 }); o.length; ) {
      const s = o.pop(), c = s.task;
      if (s.opened) {
        let l = c.updated_at;
        for (const d of t.get(c.id) || [])
          l = Math.max(l, n.get(d.id) ?? d.updated_at);
        n.set(c.id, l);
        continue;
      }
      if (!r.has(c.id)) {
        r.add(c.id), o.push({ task: c, opened: !0 });
        for (const l of t.get(c.id) || []) o.push({ task: l, opened: !1 });
      }
    }
  };
  for (const a of t.get("") || []) i(a);
  for (const a of e) r.has(a.id) || i(a);
  return n;
}
function Yf(e, t) {
  const { activity: n } = us(e), r = [], o = [];
  for (const i of e) {
    const a = n.get(i.id) ?? i.updated_at;
    St(a, t).tier === "dormant" ? o.push(i) : r.push(i);
  }
  return { worked: r, dormant: o };
}
function ds(e, t) {
  const { children: n, activity: r } = us(e), o = new Map(e.map((s) => [s.id, s])), i = (s) => St(r.get(s.id) ?? s.updated_at, t).tier === "dormant", a = [];
  for (const s of e) {
    if (!i(s)) continue;
    const c = s.parent_task_id && s.parent_task_id !== s.id ? o.get(s.parent_task_id) : void 0;
    if (c && i(c)) continue;
    const l = Hf(s, n, /* @__PURE__ */ new Set([s.id])), d = r.get(s.id) ?? s.updated_at, f = {
      root: s,
      members: l,
      lastActivityAt: d,
      age: St(d, t),
      openCount: 0,
      blockedCount: 0,
      doneCount: 0
    };
    for (const m of [s, ...l]) {
      const p = String(m.status || "").toLowerCase();
      cs(p) ? f.doneCount += 1 : p === "blocked" ? f.blockedCount += 1 : f.openCount += 1;
    }
    a.push(f);
  }
  return a.sort((s, c) => s.lastActivityAt - c.lastActivityAt || s.root.title.localeCompare(c.root.title));
}
const Kf = {
  class: "jr-now",
  "aria-label": "What is happening now"
}, qf = { class: "jr-lens-meta" }, Xf = { class: "jr-lens-facts" }, Jf = { class: "jr-numeric" }, Zf = { class: "jr-numeric" }, Qf = { class: "jr-numeric" }, eh = {
  key: 0,
  class: "jr-lens-bound"
}, th = { class: "jr-now-grid" }, nh = {
  class: "jr-now-block wide",
  "aria-label": "Who can edit"
}, rh = { class: "jr-numeric" }, oh = {
  key: 0,
  class: "jr-empty-small"
}, ih = ["onClick"], sh = { class: "jr-now-copy" }, ah = { class: "jr-numeric" }, lh = ["onClick"], ch = { class: "jr-now-copy" }, uh = {
  key: 0,
  class: "jr-numeric"
}, dh = {
  class: "jr-now-block",
  "aria-label": "Open work spans"
}, ph = { class: "jr-numeric" }, fh = {
  key: 0,
  class: "jr-empty-small"
}, hh = ["onClick"], gh = { class: "jr-avatar" }, mh = { class: "jr-now-copy" }, vh = {
  key: 0,
  class: "jr-now-fact"
}, bh = { class: "jr-now-meta" }, yh = { class: "jr-numeric" }, _h = { class: "jr-numeric" }, wh = {
  class: "jr-now-block",
  "aria-label": "Open tasks"
}, xh = { class: "jr-numeric" }, jh = {
  key: 0,
  class: "jr-empty-small"
}, kh = ["onClick"], Eh = { class: "jr-now-copy" }, Sh = { key: 0 }, Ih = ["onClick"], Th = { class: "jr-now-copy" }, $h = { key: 0 }, Ch = {
  class: "jr-now-block wide",
  "aria-label": "Recent significant facts"
}, Ah = { class: "jr-numeric" }, Oh = {
  key: 0,
  class: "jr-empty-small"
}, Nh = {
  key: 1,
  class: "jr-now-facts"
}, Mh = { class: "jr-numeric" }, Rh = /* @__PURE__ */ Ne({
  __name: "NowLens",
  props: {
    spans: {},
    workControl: {},
    tasks: {},
    events: {},
    now: {},
    spanCounts: {},
    taskBound: {}
  },
  emits: ["task", "agent", "stale"],
  setup(e, { emit: t }) {
    const n = e, r = t, o = /^(milestone|decision|blocker|finding|risk|contradiction|acceptance|reflection)$/i, i = L(() => n.spans.filter((v) => v.state === "open").sort((v, h) => h.last_activity_at - v.last_activity_at)), a = L(() => n.tasks.filter((v) => !cs(v.status))), s = L(() => Yf(a.value, n.now)), c = L(() => s.value.worked.filter((v) => v.status !== "blocked").sort((v, h) => h.updated_at - v.updated_at)), l = L(() => n.tasks.filter((v) => v.status === "blocked").sort((v, h) => h.updated_at - v.updated_at)), d = L(() => {
      const v = new Map(n.tasks.map((g) => [g.id, g])), h = /* @__PURE__ */ new Set();
      for (const g of ds(n.tasks, n.now)) {
        let E = v.get(g.root.id);
        const T = /* @__PURE__ */ new Set();
        for (; E?.parent_task_id && v.has(E.parent_task_id) && !T.has(E.id); )
          T.add(E.id), E = v.get(E.parent_task_id);
        h.add(E?.id || g.root.id);
      }
      return [...h];
    }), f = L(() => n.events.filter((v) => o.test(v.event_type)).sort((v, h) => h.seq - v.seq).slice(0, 24));
    function m(v) {
      return lt(v.agent_id || v.cursor_id || "").label;
    }
    function p(v) {
      return lt(v.agent_id || v.cursor_id || "").initials;
    }
    function b(v) {
      return v.working_on?.text || v.last_fact?.title || "Open activity span";
    }
    function w(v) {
      const h = Math.max(0, Math.floor(v - n.now));
      return h < 60 ? `${h}s` : h < 3600 ? `${Math.ceil(h / 60)}m` : `${Math.ceil(h / 3600)}h`;
    }
    return (v, h) => (x(), j("section", Kf, [
      u("div", qf, [
        h[4] || (h[4] = u("span", { class: "jr-lens-title" }, "Now", -1)),
        u("span", Xf, [
          u("b", Jf, y(i.value.length), 1),
          J(" open span" + y(i.value.length === 1 ? "" : "s") + " ", 1),
          h[1] || (h[1] = u("i", { "aria-hidden": "true" }, null, -1)),
          u("b", Zf, y(l.value.length), 1),
          h[2] || (h[2] = J(" blocked ", -1)),
          h[3] || (h[3] = u("i", { "aria-hidden": "true" }, null, -1)),
          u("b", Qf, y(d.value.length), 1),
          J(" dormant program" + y(d.value.length === 1 ? "" : "s"), 1)
        ]),
        e.taskBound.hasMore ? (x(), j("span", eh, y(e.taskBound.loaded.toLocaleString()) + " of " + y(e.taskBound.total.toLocaleString()) + " tasks ", 1)) : q("", !0),
        d.value.length ? (x(), j("button", {
          key: 1,
          class: "jr-lens-advice",
          title: "Review the work nothing has touched for days",
          onClick: h[0] || (h[0] = (g) => r("stale"))
        }, [
          G(_(Z), {
            icon: "tabler:archive",
            "aria-hidden": "true"
          }),
          J(" Review " + y(d.value.length) + " dormant ", 1)
        ])) : q("", !0)
      ]),
      u("div", th, [
        u("section", nh, [
          u("h3", null, [
            G(_(Z), {
              icon: "tabler:key",
              "aria-hidden": "true"
            }),
            h[5] || (h[5] = J(" Who can edit ", -1)),
            u("em", rh, y(e.workControl.counts.active) + " active · " + y(e.workControl.counts.resumable) + " ready to continue", 1)
          ]),
          !e.workControl.leases.length && !e.workControl.resumable.length ? (x(), j("p", oh, " No active editing session or task waiting to continue. ")) : q("", !0),
          (x(!0), j(K, null, re(e.workControl.leases, (g) => (x(), j("button", {
            key: g.lease_id,
            class: oe(["jr-now-task", "jr-authority-row", { planning: g.capability === "PLANNING" }]),
            onClick: (E) => r("task", g.task_id)
          }, [
            u("span", {
              class: oe(["jr-state-chip", g.capability === "WRITE" ? "state-in_progress" : "state-blocked"])
            }, y(g.capability === "WRITE" ? "editing" : "planning"), 3),
            u("span", sh, [
              u("b", null, y(g.task_title || "Untitled task"), 1),
              u("small", null, y(_(lt)(g.agent_id).label) + " · " + y(g.task_status?.replace(/_/g, " ") || "unknown task state"), 1)
            ]),
            u("time", ah, "expires in " + y(w(g.expires_at)), 1)
          ], 10, ih))), 128)),
          (x(!0), j(K, null, re(e.workControl.resumable, (g) => (x(), j("button", {
            key: `resume:${g.task_id}`,
            class: "jr-now-task jr-authority-row resumable",
            onClick: (E) => r("task", g.task_id)
          }, [
            h[7] || (h[7] = u("span", { class: "jr-state-chip state-open" }, "resume", -1)),
            u("span", ch, [
              u("b", null, y(g.task_title || "Untitled task"), 1),
              h[6] || (h[6] = u("small", null, "No active editing session · open this task to continue", -1))
            ]),
            g.task_updated_at ? (x(), j("time", uh, y(_(Se)(g.task_updated_at, e.now)), 1)) : q("", !0)
          ], 8, lh))), 128))
        ]),
        u("section", dh, [
          u("h3", null, [
            G(_(Z), {
              icon: "tabler:activity-heartbeat",
              "aria-hidden": "true"
            }),
            h[8] || (h[8] = J(" Open spans ", -1)),
            u("em", ph, y(e.spanCounts.open || i.value.length), 1)
          ]),
          i.value.length ? q("", !0) : (x(), j("p", fh, "No identity has an open activity span.")),
          (x(!0), j(K, null, re(i.value, (g) => (x(), j("button", {
            key: g.span_id,
            class: "jr-now-span",
            onClick: (E) => r("agent", g.agent_id || g.cursor_id || "")
          }, [
            u("span", gh, y(p(g)), 1),
            u("span", mh, [
              u("b", null, y(m(g)), 1),
              u("small", null, y(b(g)), 1),
              g.last_fact?.title ? (x(), j("small", vh, [
                G(_(Z), {
                  icon: "tabler:point",
                  "aria-hidden": "true"
                }),
                J(y(g.last_fact.title), 1)
              ])) : q("", !0)
            ]),
            u("span", bh, [
              u("time", yh, y(_(Se)(g.last_activity_at, e.now)), 1),
              u("em", _h, y(g.fact_count || 0) + " fact" + y(g.fact_count === 1 ? "" : "s"), 1)
            ])
          ], 8, hh))), 128))
        ]),
        u("section", wh, [
          u("h3", null, [
            G(_(Z), {
              icon: "tabler:checkbox",
              "aria-hidden": "true"
            }),
            h[9] || (h[9] = J(" Open work ", -1)),
            u("em", xh, y(c.value.length + l.value.length), 1)
          ]),
          !c.value.length && !l.value.length ? (x(), j("p", jh, "Nothing is open in this journal.")) : q("", !0),
          (x(!0), j(K, null, re(l.value, (g) => (x(), j("button", {
            key: g.id,
            class: "jr-now-task blocked",
            onClick: (E) => r("task", g.id)
          }, [
            h[10] || (h[10] = u("span", { class: "jr-state-chip state-blocked" }, "blocked", -1)),
            u("span", Eh, [
              u("b", null, y(g.title), 1),
              g.description ? (x(), j("small", Sh, y(g.description), 1)) : q("", !0)
            ]),
            u("time", {
              class: oe(["jr-numeric", _(St)(g.updated_at, e.now).tier])
            }, y(_(St)(g.updated_at, e.now).label), 3)
          ], 8, kh))), 128)),
          (x(!0), j(K, null, re(c.value, (g) => (x(), j("button", {
            key: g.id,
            class: "jr-now-task",
            onClick: (E) => r("task", g.id)
          }, [
            u("span", {
              class: oe(["jr-state-chip", `state-${g.status}`])
            }, y(g.status.replace(/_/g, " ")), 3),
            u("span", Th, [
              u("b", null, y(g.title), 1),
              g.description ? (x(), j("small", $h, y(g.description), 1)) : q("", !0)
            ]),
            u("time", {
              class: oe(["jr-numeric", _(St)(g.updated_at, e.now).tier])
            }, y(_(St)(g.updated_at, e.now).label), 3)
          ], 8, Ih))), 128))
        ]),
        u("section", Ch, [
          u("h3", null, [
            G(_(Z), {
              icon: "tabler:sparkles",
              "aria-hidden": "true"
            }),
            h[11] || (h[11] = J(" What changed ", -1)),
            u("em", Ah, y(f.value.length), 1)
          ]),
          f.value.length ? (x(), j("ol", Nh, [
            (x(!0), j(K, null, re(f.value, (g) => (x(), j("li", {
              key: g.id
            }, [
              u("span", {
                class: "jr-now-dot",
                style: Ee({ background: _(qt)(g.event_type) }),
                "aria-hidden": "true"
              }, null, 4),
              u("span", {
                class: oe(["jr-eyebrow", `family-${_($e)(g.event_type)}`])
              }, y(g.event_type.replace(/_/g, " ")), 3),
              u("b", null, y(g.title || g.body || "Journal entry"), 1),
              u("time", Mh, y(_(Se)(g.ts, e.now)), 1)
            ]))), 128))
          ])) : (x(), j("p", Oh, " Nothing decided, finished or blocked in the facts this journal has published so far. "))
        ])
      ])
    ]));
  }
}), Ph = {
  class: "jr-orbit",
  "aria-label": "Record orbit"
}, Lh = { class: "jr-panel-head" }, Dh = {
  key: 0,
  class: "jr-orbit-tabs",
  "aria-label": "Orbit or record"
}, zh = {
  key: 0,
  class: "jr-empty-state"
}, Vh = { class: "jr-detail-head" }, Uh = { class: "jr-detail-title" }, Fh = { class: "jr-eyebrow" }, Bh = { class: "jr-detail-summary" }, Wh = { class: "jr-detail-meta" }, Hh = { class: "jr-numeric" }, Gh = { class: "jr-numeric" }, Yh = { class: "jr-numeric" }, Kh = {
  key: 0,
  class: "jr-detail-section jr-orbit-chain"
}, qh = { class: "jr-numeric" }, Xh = { class: "jr-chain" }, Jh = ["onClick"], Zh = {
  key: 1,
  class: "jr-detail-section"
}, Qh = { class: "jr-numeric" }, eg = ["onClick"], tg = {
  key: 2,
  class: "jr-detail-section jr-danger-section"
}, ng = { class: "jr-numeric" }, rg = ["onClick"], og = ["onClick"], ig = {
  key: 3,
  class: "jr-detail-section jr-danger-section"
}, sg = { class: "jr-numeric" }, ag = ["onClick"], lg = { class: "danger" }, cg = {
  key: 4,
  class: "jr-detail-section"
}, ug = { class: "jr-numeric" }, dg = ["open"], pg = { class: "jr-numeric" }, fg = ["onClick"], hg = ["onClick"], gg = {
  key: 5,
  class: "jr-detail-section"
}, mg = { class: "jr-numeric" }, vg = { class: "jr-numeric" }, bg = {
  key: 6,
  class: "jr-detail-section jr-presence-section"
}, yg = { class: "jr-numeric" }, _g = { class: "jr-avatar" }, wg = { class: "jr-avatar" }, xg = {
  key: 0,
  class: "jr-learning"
}, jg = {
  key: 1,
  class: "jr-content-stack"
}, kg = { class: "jr-numeric" }, Eg = ["open"], Sg = { key: 0 }, Ig = { key: 1 }, Tg = {
  key: 2,
  class: "jr-detail-section jr-note-fields"
}, $g = { class: "jr-numeric" }, Cg = {
  key: 3,
  class: "jr-detail-section"
}, Ag = { class: "jr-numeric" }, Og = ["onClick"], Ng = {
  key: 4,
  class: "jr-detail-section"
}, Mg = { class: "jr-detail-section" }, Rg = { class: "jr-numeric" }, Pg = { class: "jr-numeric" }, Lg = { class: "jr-numeric" }, Dg = /* @__PURE__ */ Ne({
  __name: "OrbitPanel",
  props: {
    node: {},
    nodes: {},
    edges: {},
    presence: {},
    spans: {},
    events: {},
    graphId: {},
    now: {},
    peek: { type: Boolean }
  },
  emits: ["select", "focus", "close"],
  setup(e, { emit: t }) {
    const n = e, r = t, o = L(() => new Map(n.nodes.map((M) => [M.id, M]))), i = L(() => n.node ? n.edges.filter((M) => M.to === n.node.id && Et(M.kind) !== "presence") : []), a = L(() => n.node ? n.edges.filter((M) => M.from === n.node.id && Et(M.kind) !== "presence") : []), s = L(() => ({ ...n.node?.attrs || {}, ...n.node?.metadata || {} })), c = L(() => {
      const M = [], I = /* @__PURE__ */ new Set();
      let A = n.node?.parent_id ? o.value.get(n.node.parent_id) : void 0;
      for (; A && !I.has(A.id) && M.length < 32; )
        I.add(A.id), M.push(A), A = A.parent_id ? o.value.get(A.parent_id) : void 0;
      return M.reverse();
    }), l = L(() => n.node ? n.nodes.filter((M) => M.parent_id === n.node.id).sort((M, I) => I.updated_at - M.updated_at) : []), d = L(() => {
      const M = /* @__PURE__ */ new Map(), I = (A) => {
        const te = M.get(A);
        if (te) return te;
        const ie = { kind: A, out: [], in: [] };
        return M.set(A, ie), ie;
      };
      for (const A of a.value) I(A.kind).out.push(A);
      for (const A of i.value) I(A.kind).in.push(A);
      return [...M.values()].sort((A, te) => te.out.length + te.in.length - (A.out.length + A.in.length));
    }), f = L(() => a.value.filter((M) => /^(blocks|threatens|invalidates)$/i.test(M.kind))), m = L(() => i.value.filter((M) => /^(blocks|threatens|invalidates)$/i.test(M.kind))), p = L(() => [...i.value, ...a.value].filter((M) => Et(M.kind) === "conflict")), b = L(() => [...i.value, ...a.value].filter((M) => /support|evidence|source|reference|provenance|verif/.test(M.kind)).slice(0, 8)), w = L(() => a.value.find((M) => /supersed|successor|learned/.test(M.kind))), v = L(() => {
      const M = n.node?.id || "";
      if (!M) return [];
      const I = String(s.value.event_id || ""), A = M.replace(/^event:/, "");
      return (n.events || []).filter((te) => te.id === A || te.id === I || (te.linked_task_ids || []).includes(A)).sort((te, ie) => ie.seq - te.seq);
    }), h = L(() => (n.presence || []).filter((M) => M.positionId === n.node?.id || M.touchNodeId === n.node?.id)), g = L(() => {
      const M = new Set(v.value.map((I) => I.id));
      return (n.spans || []).filter((I) => I.last_fact && M.has(I.last_fact.event_id)).sort((I, A) => A.last_activity_at - I.last_activity_at);
    });
    function E(M) {
      return typeof M == "string" ? M : M == null ? "" : JSON.stringify(M, null, 2);
    }
    const T = L(() => {
      const M = s.value, I = [], A = (ie, C, ee = "Content") => {
        if (typeof ie == "string") {
          ie && I.push({ id: `content-${C}`, title: ee, body: ie, format: "text", role: "content", collapsed: !1 });
          return;
        }
        if (!ie || typeof ie != "object") return;
        const B = ie, X = E(B.body ?? B.text ?? B.content);
        X && I.push({
          id: String(B.id || `content-${C}`),
          title: String(B.title || B.name || ee),
          body: X,
          format: String(B.format || B.media_type || "text").toLowerCase(),
          role: String(B.role || "content"),
          collapsed: B.collapsed === !0
        });
      };
      return A(M.content, 0), (Array.isArray(M.documents) ? M.documents : Array.isArray(M.content_blocks) ? M.content_blocks : []).forEach((ie, C) => A(ie, C + 1, `Document ${C + 1}`)), I;
    }), S = L(() => {
      const M = { ...s.value };
      return delete M.content, delete M.documents, delete M.content_blocks, M;
    }), N = L(() => Object.entries(S.value).filter(([M, I]) => M !== "journal_write" && M !== "provenance" && (typeof I == "string" || typeof I == "number" || typeof I == "boolean")).slice(0, 10).map(([M, I]) => ({
      key: M,
      label: M.replace(/[_-]+/g, " ").replace(/\b\w/g, (A) => A.toUpperCase()),
      value: String(I)
    }))), O = L(() => {
      const M = n.node?.summary || "No summary has been recorded for this record.";
      return M.length > 600 ? `${M.slice(0, 599)}…` : M;
    }), z = V("orbit");
    _e(() => n.node?.id, () => {
      z.value = "orbit";
    });
    function P(M) {
      return M.from === n.node?.id ? M.to : M.from;
    }
    function Y(M) {
      return o.value.get(M)?.label || "Record outside this view";
    }
    function ne(M) {
      return M ? new Date(M * 1e3).toLocaleString([], { dateStyle: "medium", timeStyle: "short" }) : "Unknown";
    }
    return (M, I) => (x(), j("section", Ph, [
      u("header", Lh, [
        u("span", null, y(e.peek ? "Peek" : "Record"), 1),
        e.node ? (x(), j("nav", Dh, [
          u("button", {
            class: oe({ active: z.value === "orbit" }),
            onClick: I[0] || (I[0] = (A) => z.value = "orbit")
          }, "Orbit", 2),
          u("button", {
            class: oe({ active: z.value === "record" }),
            onClick: I[1] || (I[1] = (A) => z.value = "record")
          }, "Record", 2)
        ])) : q("", !0),
        u("button", {
          "aria-label": "Close",
          title: "Close",
          onClick: I[2] || (I[2] = (A) => r("close"))
        }, [
          G(_(Z), {
            icon: "tabler:x",
            "aria-hidden": "true"
          })
        ])
      ]),
      e.node ? (x(), j("div", {
        key: 1,
        class: oe(["jr-orbit-body", `family-${_($e)(e.node.kind)}`]),
        style: Ee({ "--node-color": _(qt)(e.node.kind) })
      }, [
        u("div", Vh, [
          u("div", Uh, [
            G(Gt, {
              class: "jr-kind-mark large",
              family: _($e)(e.node.kind),
              radius: 9,
              "view-box": "-14 -14 28 28"
            }, null, 8, ["family"]),
            u("div", null, [
              u("span", Fh, y(e.node.kind.replace(/_/g, " ")), 1),
              u("h2", null, y(e.node.label), 1)
            ])
          ]),
          u("p", Bh, y(O.value), 1),
          u("div", Wh, [
            e.node.status ? (x(), j("span", {
              key: 0,
              class: oe(["jr-state-chip", `state-${e.node.status.toLowerCase()}`])
            }, y(e.node.status), 3)) : q("", !0),
            u("span", Hh, "rev " + y(e.node.revision), 1),
            u("span", Gh, y(i.value.length + a.value.length) + " relations", 1),
            u("span", Yh, y(_(Se)(e.node.updated_at, e.now)), 1),
            u("button", {
              class: "jr-root-action",
              onClick: I[3] || (I[3] = (A) => r("focus", e.node.id))
            }, [
              G(_(Z), {
                icon: "tabler:arrow-up-right",
                "aria-hidden": "true"
              }),
              I[8] || (I[8] = J(" Descend", -1))
            ])
          ])
        ]),
        z.value === "orbit" ? (x(), j(K, { key: 0 }, [
          c.value.length ? (x(), j("section", Kh, [
            u("h3", null, [
              I[9] || (I[9] = J("Hangs from ", -1)),
              u("span", qh, y(c.value.length), 1)
            ]),
            u("ol", Xh, [
              (x(!0), j(K, null, re(c.value, (A, te) => (x(), j("li", {
                key: A.id,
                style: Ee({ "--step": te })
              }, [
                u("button", {
                  class: "jr-related",
                  onClick: (ie) => r("select", A.id)
                }, [
                  G(Gt, {
                    class: "jr-kind-mark",
                    family: _($e)(A.kind),
                    radius: 9
                  }, null, 8, ["family"]),
                  u("span", null, y(A.label), 1),
                  I[10] || (I[10] = u("b", { "aria-hidden": "true" }, "›", -1))
                ], 8, Jh)
              ], 4))), 128))
            ])
          ])) : q("", !0),
          l.value.length ? (x(), j("section", Zh, [
            u("h3", null, [
              I[11] || (I[11] = J("Holds ", -1)),
              u("span", Qh, y(l.value.length), 1)
            ]),
            (x(!0), j(K, null, re(l.value.slice(0, 12), (A) => (x(), j("button", {
              key: A.id,
              class: "jr-related",
              onClick: (te) => r("select", A.id)
            }, [
              u("i", null, y(A.kind.replace(/_/g, " ")), 1),
              u("span", null, y(A.label), 1),
              I[12] || (I[12] = u("b", { "aria-hidden": "true" }, "›", -1))
            ], 8, eg))), 128)),
            l.value.length > 12 ? (x(), j("button", {
              key: 0,
              class: "jr-orbit-more",
              onClick: I[4] || (I[4] = (A) => r("focus", e.node.id))
            }, " Descend to read all " + y(l.value.length), 1)) : q("", !0)
          ])) : q("", !0),
          m.value.length || f.value.length ? (x(), j("section", tg, [
            u("h3", null, [
              I[13] || (I[13] = J("Blocking ", -1)),
              u("span", ng, y(m.value.length + f.value.length), 1)
            ]),
            (x(!0), j(K, null, re(m.value, (A) => (x(), j("button", {
              key: A.id,
              class: "jr-related",
              onClick: (te) => r("select", P(A))
            }, [
              I[14] || (I[14] = u("i", { class: "danger" }, "blocked by", -1)),
              u("span", null, y(Y(P(A))), 1),
              I[15] || (I[15] = u("b", { "aria-hidden": "true" }, "‹", -1))
            ], 8, rg))), 128)),
            (x(!0), j(K, null, re(f.value, (A) => (x(), j("button", {
              key: A.id,
              class: "jr-related",
              onClick: (te) => r("select", P(A))
            }, [
              I[16] || (I[16] = u("i", { class: "danger" }, "blocks", -1)),
              u("span", null, y(Y(P(A))), 1),
              I[17] || (I[17] = u("b", { "aria-hidden": "true" }, "›", -1))
            ], 8, og))), 128))
          ])) : q("", !0),
          p.value.length ? (x(), j("section", ig, [
            u("h3", null, [
              I[18] || (I[18] = J("Contested by ", -1)),
              u("span", sg, y(p.value.length), 1)
            ]),
            (x(!0), j(K, null, re(p.value, (A) => (x(), j("button", {
              key: A.id,
              class: "jr-related",
              onClick: (te) => r("select", P(A))
            }, [
              u("i", lg, y(A.kind.replace(/_/g, " ")), 1),
              u("span", null, y(Y(P(A))), 1),
              I[19] || (I[19] = u("b", { "aria-hidden": "true" }, "›", -1))
            ], 8, ag))), 128))
          ])) : q("", !0),
          d.value.length ? (x(), j("section", cg, [
            u("h3", null, [
              I[20] || (I[20] = J("Relations by kind ", -1)),
              u("span", ug, y(d.value.length), 1)
            ]),
            (x(!0), j(K, null, re(d.value, (A) => (x(), j("details", {
              key: A.kind,
              class: "jr-relation-group",
              open: A.out.length + A.in.length <= 4
            }, [
              u("summary", null, [
                u("span", {
                  class: oe(["jr-relation-kind", `edge-${_(Et)(A.kind)}`])
                }, y(A.kind.replace(/_/g, " ")), 3),
                u("em", pg, y(A.out.length) + " out · " + y(A.in.length) + " in", 1)
              ]),
              (x(!0), j(K, null, re(A.out, (te) => (x(), j("button", {
                key: `o-${te.id}`,
                class: "jr-related",
                onClick: (ie) => r("select", P(te))
              }, [
                I[21] || (I[21] = u("i", null, "out", -1)),
                u("span", null, y(Y(P(te))), 1),
                I[22] || (I[22] = u("b", { "aria-hidden": "true" }, "›", -1))
              ], 8, fg))), 128)),
              (x(!0), j(K, null, re(A.in, (te) => (x(), j("button", {
                key: `i-${te.id}`,
                class: "jr-related",
                onClick: (ie) => r("select", P(te))
              }, [
                I[23] || (I[23] = u("i", null, "in", -1)),
                u("span", null, y(Y(P(te))), 1),
                I[24] || (I[24] = u("b", { "aria-hidden": "true" }, "‹", -1))
              ], 8, hg))), 128))
            ], 8, dg))), 128))
          ])) : q("", !0),
          v.value.length ? (x(), j("section", gg, [
            u("h3", null, [
              I[25] || (I[25] = J("Facts attached ", -1)),
              u("span", mg, y(v.value.length), 1)
            ]),
            (x(!0), j(K, null, re(v.value.slice(0, 10), (A) => (x(), j("div", {
              key: A.id,
              class: "jr-orbit-fact"
            }, [
              u("span", {
                class: oe(["jr-eyebrow", `family-${_($e)(A.event_type)}`])
              }, y(A.event_type.replace(/_/g, " ")), 3),
              u("b", null, y(A.title || A.body || "Journal entry"), 1),
              u("time", vg, y(_(Se)(A.ts, e.now)), 1)
            ]))), 128))
          ])) : q("", !0),
          h.value.length || g.value.length ? (x(), j("section", bg, [
            u("h3", null, [
              I[26] || (I[26] = J("Who has been here ", -1)),
              u("span", yg, y(h.value.length + g.value.length), 1)
            ]),
            (x(!0), j(K, null, re(h.value, (A) => (x(), j("div", {
              key: A.id,
              class: "jr-presence-row"
            }, [
              u("span", _g, y(A.initials), 1),
              u("span", null, [
                u("b", null, y(A.label), 1),
                u("small", null, y(A.purpose), 1)
              ])
            ]))), 128)),
            (x(!0), j(K, null, re(g.value, (A) => (x(), j("div", {
              key: A.span_id,
              class: "jr-presence-row"
            }, [
              u("span", wg, y(_(lt)(A.agent_id || A.cursor_id || "").initials), 1),
              u("span", null, [
                u("b", null, y(_(lt)(A.agent_id || A.cursor_id || "").label), 1),
                u("small", null, y(A.working_on?.text || "Wrote here") + " · " + y(_(Se)(A.last_activity_at, e.now)), 1)
              ])
            ]))), 128))
          ])) : q("", !0)
        ], 64)) : (x(), j(K, { key: 1 }, [
          _(Wt)(e.node) ? (x(), j("section", xg, [
            I[27] || (I[27] = u("span", { class: "jr-eyebrow" }, "Distilled learning", -1)),
            u("p", null, y(s.value.learning || s.value.distilled || e.node.summary || "This branch was folded without a learning summary."), 1)
          ])) : q("", !0),
          T.value.length ? (x(), j("section", jg, [
            u("h3", null, [
              I[28] || (I[28] = J("Content ", -1)),
              u("span", kg, y(T.value.length), 1)
            ]),
            (x(!0), j(K, null, re(T.value, (A, te) => (x(), j("details", {
              key: A.id,
              class: "jr-content-block",
              open: !A.collapsed && te === 0
            }, [
              u("summary", null, [
                u("span", null, y(A.title), 1),
                u("em", null, y(A.role) + " · " + y(A.format), 1)
              ]),
              /json|code|lua|typescript|javascript|yaml/.test(A.format) ? (x(), j("pre", Sg, y(A.body), 1)) : (x(), j("div", Ig, y(A.body), 1))
            ], 8, Eg))), 128))
          ])) : q("", !0),
          N.value.length ? (x(), j("section", Tg, [
            u("h3", null, [
              I[29] || (I[29] = J("Context ", -1)),
              u("span", $g, y(N.value.length), 1)
            ]),
            u("dl", null, [
              (x(!0), j(K, null, re(N.value, (A) => (x(), j(K, {
                key: A.key
              }, [
                u("dt", null, y(A.label), 1),
                u("dd", null, y(A.value), 1)
              ], 64))), 128))
            ])
          ])) : q("", !0),
          b.value.length ? (x(), j("section", Cg, [
            u("h3", null, [
              I[30] || (I[30] = J("Evidence ", -1)),
              u("span", Ag, y(b.value.length), 1)
            ]),
            (x(!0), j(K, null, re(b.value, (A) => (x(), j("button", {
              key: A.id,
              class: "jr-related",
              onClick: (te) => r("select", P(A))
            }, [
              u("i", null, y(A.kind.replace(/_/g, " ")), 1),
              u("span", null, y(Y(P(A))), 1),
              I[31] || (I[31] = u("b", { "aria-hidden": "true" }, "›", -1))
            ], 8, Og))), 128))
          ])) : q("", !0),
          w.value ? (x(), j("section", Ng, [
            I[33] || (I[33] = u("h3", null, "Superseded by", -1)),
            u("button", {
              class: "jr-related",
              onClick: I[5] || (I[5] = (A) => r("select", P(w.value)))
            }, [
              u("i", null, y(w.value.kind.replace(/_/g, " ")), 1),
              u("span", null, y(Y(P(w.value))), 1),
              I[32] || (I[32] = u("b", { "aria-hidden": "true" }, "›", -1))
            ])
          ])) : q("", !0),
          u("section", Mg, [
            I[38] || (I[38] = u("h3", null, "Position", -1)),
            u("dl", null, [
              I[34] || (I[34] = u("dt", null, "Parent", -1)),
              u("dd", null, y(o.value.get(e.node.parent_id || "")?.label || (e.node.parent_id ? "Parent outside this view" : "Graph root")), 1),
              I[35] || (I[35] = u("dt", null, "Children", -1)),
              u("dd", Rg, y(e.node.child_count), 1),
              I[36] || (I[36] = u("dt", null, "Updated", -1)),
              u("dd", Pg, y(ne(e.node.updated_at)), 1),
              I[37] || (I[37] = u("dt", null, "Created", -1)),
              u("dd", Lg, y(ne(e.node.created_at)), 1)
            ])
          ])
        ], 64))
      ], 6)) : (x(), j("div", zh, [
        G(_(Z), {
          icon: "tabler:focus-2",
          "aria-hidden": "true"
        }),
        I[6] || (I[6] = u("h3", null, "Nothing selected", -1)),
        I[7] || (I[7] = u("p", null, "Pick a record in any lens to read what it hangs from, what argues with it, and who has been standing on it.", -1))
      ]))
    ]));
  }
}), zg = 4, Vg = { start: 0, end: 0, padTop: 0, padBottom: 0 };
function Ug(e, t, n, r, o = zg) {
  if (r <= 0 || n <= 0) return Vg;
  const i = Math.max(0, e), a = Math.max(0, t), s = Math.floor(i / n) - o, c = Math.ceil((i + a) / n) + o, l = Math.min(r - 1, Math.max(0, s)), d = Math.min(r, Math.max(l + 1, c));
  return { start: l, end: d, padTop: l * n, padBottom: (r - d) * n };
}
function Fg(e, t) {
  return Math.max(0, e) * Math.max(0, t);
}
function Bg(e, t, n, r) {
  const o = Fg(e, r), i = o + Math.max(0, r);
  return o < t ? o : i > t + Math.max(0, n) ? Math.max(0, i - Math.max(0, n)) : Math.max(0, t);
}
const Wg = /* @__PURE__ */ Ne({
  __name: "VirtualList",
  props: {
    items: {},
    rowHeight: {},
    overscan: {},
    scrollToIndex: {},
    restoreScrollTop: {}
  },
  emits: ["scroll"],
  setup(e, { emit: t }) {
    const n = e, r = t, o = V(null), i = V(0), a = V(0);
    let s = 0, c = null;
    const l = L(() => Ug(i.value, a.value, n.rowHeight, n.items.length, n.overscan)), d = L(() => n.items.slice(l.value.start, l.value.end).map((b, w) => ({ item: b, index: l.value.start + w })));
    function f() {
      const b = o.value;
      b && (a.value = b.clientHeight, i.value = b.scrollTop);
    }
    function m() {
      s || (s = requestAnimationFrame(() => {
        s = 0, i.value = o.value?.scrollTop || 0, r("scroll", i.value);
      }));
    }
    _e(() => n.scrollToIndex, (b) => {
      const w = o.value;
      if (!w || b === void 0 || b < 0) return;
      const v = Bg(b, w.scrollTop, w.clientHeight || a.value, n.rowHeight);
      v === i.value && v === w.scrollTop || (w.scrollTop = v, i.value = v);
    });
    function p(b) {
      if (b === void 0 || b < 0) return;
      const w = o.value;
      i.value = b, w && (w.scrollTop = b);
    }
    return _e(() => n.restoreScrollTop, p), _n(() => {
      f(), p(n.restoreScrollTop), c = new ResizeObserver(f), o.value && c.observe(o.value);
    }), wn(() => {
      s && cancelAnimationFrame(s), s = 0, c?.disconnect(), c = null;
    }), (b, w) => (x(), j("div", {
      ref_key: "scroller",
      ref: o,
      class: "jr-vlist",
      onScrollPassive: m
    }, [
      u("div", {
        class: "jr-vlist-pad",
        style: Ee({ height: `${l.value.padTop}px` }),
        "aria-hidden": "true"
      }, null, 4),
      (x(!0), j(K, null, re(d.value, (v) => vs(b.$slots, "row", {
        item: v.item,
        index: v.index
      }, void 0, void 0, v.index)), 128)),
      u("div", {
        class: "jr-vlist-pad",
        style: Ee({ height: `${l.value.padBottom}px` }),
        "aria-hidden": "true"
      }, null, 4)
    ], 544));
  }
}), Hg = {
  key: 0,
  class: "jr-empty-small"
}, Gg = ["data-row", "tabindex", "aria-level", "aria-selected", "aria-setsize", "aria-posinset", "aria-expanded", "onClick", "onDblclick", "onContextmenu", "onFocusin", "onKeydown"], Yg = ["aria-label", "onClick"], Kg = {
  key: 1,
  class: "jr-disclosure-spacer",
  "aria-hidden": "true"
}, qg = { class: "jr-tree-copy" }, Xg = { class: "jr-tree-title" }, Jg = {
  key: 0,
  class: "jr-tree-summary"
}, Zg = { class: "jr-tree-meta" }, Qg = { class: "jr-tree-kind" }, em = ["title"], tm = ["title"], nm = ["aria-label", "onClick"], rm = 44, om = 34, im = /* @__PURE__ */ Ne({
  __name: "OutlineTree",
  props: {
    nodes: {},
    edges: {},
    presence: {},
    touchedIds: {},
    selectedId: {},
    compact: { type: Boolean },
    viewport: {}
  },
  emits: ["select", "focus", "menu", "viewport"],
  setup(e, { emit: t }) {
    const n = e, r = t, o = V(/* @__PURE__ */ new Set());
    let i = /* @__PURE__ */ new Set();
    _e(() => n.nodes, (S) => {
      o.value = Rc(S, o.value, i), i = new Set(S.map((N) => N.id));
    }, { immediate: !0 });
    const a = L(() => n.nodes.filter((S) => !bn(S))), s = L(() => Nc(a.value, o.value)), c = L(() => n.compact ? om : rm), l = L(() => os(n.edges || [])), d = L(() => {
      const S = /* @__PURE__ */ new Map();
      for (const N of n.presence || []) {
        if (!N.positionId) continue;
        const O = S.get(N.positionId) || [];
        O.push(N), S.set(N.positionId, O);
      }
      return S;
    }), f = V(null), m = V(-1), p = V(void 0), b = L(() => Math.min(Math.max(m.value, 0), Math.max(s.value.length - 1, 0)));
    let w = "";
    _e(() => [n.selectedId, s.value], ([S]) => {
      if (!S || S === w) return;
      const N = s.value.findIndex((O) => O.node.id === S);
      N < 0 || (w = S, m.value = N, p.value = N);
    }, { immediate: !0 });
    function v(S) {
      const N = new Set(o.value);
      N.has(S) ? N.delete(S) : N.add(S), o.value = N;
    }
    function h(S) {
      S < 0 || S >= s.value.length || (m.value = S, p.value = S, Tt(() => f.value?.querySelector(`[data-row="${S}"]`)?.focus()));
    }
    function g(S) {
      const N = s.value[S].depth;
      for (let O = S - 1; O >= 0; O--) if (s.value[O].depth < N) return O;
      return -1;
    }
    function E(S, N) {
      const O = s.value[S];
      if (!O) return;
      const z = s.value[S + 1];
      switch (N.key) {
        case "ArrowDown":
          h(S + 1);
          break;
        case "ArrowUp":
          h(S - 1);
          break;
        case "ArrowRight":
          if (!O.hasChildren) return;
          O.expanded ? z && z.depth > O.depth && h(S + 1) : v(O.node.id);
          break;
        case "ArrowLeft":
          O.hasChildren && O.expanded ? v(O.node.id) : h(g(S));
          break;
        case "Enter":
        case " ":
          r("select", O.node.id);
          break;
        default:
          return;
      }
      N.preventDefault();
    }
    function T(S) {
      return String(S.status || S.metadata?.outcome || "");
    }
    return (S, N) => (x(), j("div", {
      ref_key: "root",
      ref: f,
      class: oe(["jr-tree", { compact: e.compact }]),
      role: "tree",
      "aria-label": "Journal outline",
      style: Ee({ "--jr-row-height": `${c.value}px` })
    }, [
      s.value.length ? (x(), rt(Wg, {
        key: 1,
        role: "presentation",
        items: s.value,
        "row-height": c.value,
        "scroll-to-index": p.value,
        "restore-scroll-top": e.viewport?.scrollTop,
        onScroll: N[0] || (N[0] = (O) => r("viewport", { scrollTop: O }))
      }, {
        row: bs(({ item: O, index: z }) => [
          u("div", {
            class: oe(["jr-tree-row", `family-${_($e)(O.node.kind)}`, {
              selected: O.node.id === e.selectedId,
              folded: _(Wt)(O.node),
              settled: _(Xn)(O.node),
              branch: O.hasChildren,
              occupied: d.value.has(O.node.id),
              touched: e.touchedIds?.has(O.node.id)
            }]),
            style: Ee({ "--depth": O.depth, "--node-color": _(qt)(O.node.kind) }),
            "data-row": z,
            role: "treeitem",
            tabindex: z === b.value ? 0 : -1,
            "aria-level": O.depth + 1,
            "aria-selected": O.node.id === e.selectedId,
            "aria-setsize": s.value.length,
            "aria-posinset": z + 1,
            "aria-expanded": O.hasChildren ? O.expanded : void 0,
            onClick: (P) => r("select", O.node.id),
            onDblclick: Xe((P) => r("focus", O.node.id), ["prevent"]),
            onContextmenu: Xe((P) => r("menu", O.node.id, P), ["prevent"]),
            onFocusin: (P) => m.value = z,
            onKeydown: (P) => E(z, P)
          }, [
            N[1] || (N[1] = u("span", {
              class: "jr-tree-guides",
              "aria-hidden": "true"
            }, null, -1)),
            O.hasChildren ? (x(), j("button", {
              key: 0,
              class: "jr-disclosure",
              "aria-label": O.expanded ? "Collapse branch" : "Expand branch",
              onClick: Xe((P) => v(O.node.id), ["stop"])
            }, [
              G(_(Z), {
                icon: O.expanded ? "tabler:chevron-down" : "tabler:chevron-right",
                "aria-hidden": "true"
              }, null, 8, ["icon"])
            ], 8, Yg)) : (x(), j("span", Kg)),
            G(Gt, {
              class: "jr-kind-mark",
              family: _($e)(O.node.kind),
              radius: 7,
              "view-box": "-11 -11 22 22"
            }, null, 8, ["family"]),
            u("span", qg, [
              u("span", Xg, y(O.node.label), 1),
              !e.compact && O.node.summary ? (x(), j("span", Jg, y(O.node.summary), 1)) : q("", !0)
            ]),
            u("span", Zg, [
              u("span", Qg, y(O.node.kind.replace(/_/g, " ")), 1),
              d.value.get(O.node.id) ? (x(), j("span", {
                key: 0,
                class: "jr-tree-presence",
                title: d.value.get(O.node.id).map((P) => P.label).join(", ")
              }, [
                (x(!0), j(K, null, re(d.value.get(O.node.id).slice(0, 3), (P) => (x(), j("i", {
                  key: P.id
                }, y(P.initials), 1))), 128))
              ], 8, em)) : q("", !0),
              T(O.node) ? (x(), j("span", {
                key: 1,
                class: oe(["jr-state-chip", `state-${T(O.node).toLowerCase()}`])
              }, y(T(O.node)), 3)) : q("", !0),
              u("span", {
                class: "jr-tree-links jr-numeric",
                title: `${l.value.get(O.node.id) || 0} relations · ${O.node.child_count} children`
              }, [
                G(_(Z), {
                  icon: "tabler:link",
                  "aria-hidden": "true"
                }),
                J(y(l.value.get(O.node.id) || 0), 1)
              ], 8, tm)
            ]),
            u("button", {
              class: "jr-open-root",
              title: "Open as focus root",
              "aria-label": `Open ${O.node.label} as focus root`,
              onClick: Xe((P) => r("focus", O.node.id), ["stop"])
            }, [
              G(_(Z), {
                icon: "tabler:arrow-up-right",
                "aria-hidden": "true"
              })
            ], 8, nm)
          ], 46, Gg)
        ]),
        _: 1
      }, 8, ["items", "row-height", "scroll-to-index", "restore-scroll-top"])) : (x(), j("p", Hg, "No records in this focus window."))
    ], 6));
  }
}), sm = { class: "jr-search-lens" }, am = {
  key: 0,
  class: "jr-lens-meta"
}, lm = { class: "jr-lens-facts" }, cm = { class: "jr-numeric" }, um = {
  key: 1,
  class: "jr-loading-lines",
  "aria-label": "Searching"
}, dm = {
  key: 2,
  class: "jr-empty-state"
}, pm = {
  key: 3,
  class: "jr-empty-state"
}, fm = {
  key: 4,
  class: "jr-result-list"
}, hm = ["onClick"], gm = { class: "jr-result-rank jr-numeric" }, mm = { class: "jr-result-copy" }, vm = { class: "jr-eyebrow" }, bm = { class: "jr-numeric" }, ym = { class: "jr-score" }, _m = { class: "jr-numeric" }, wm = /* @__PURE__ */ Ne({
  __name: "SearchLens",
  props: {
    results: {},
    query: {},
    mode: {},
    loading: { type: Boolean }
  },
  emits: ["select"],
  setup(e, { emit: t }) {
    const n = t;
    function r(i) {
      return typeof i.distance == "number" ? Math.max(0, Math.min(1, 1 - i.distance)) : null;
    }
    function o(i) {
      return i ? new Date(i * 1e3).toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" }) : "";
    }
    return (i, a) => (x(), j("section", sm, [
      e.query ? (x(), j("div", am, [
        a[4] || (a[4] = u("span", { class: "jr-lens-title" }, "Recall", -1)),
        u("span", lm, [
          u("b", cm, y(e.results.length), 1),
          a[0] || (a[0] = J(" matches ", -1)),
          a[1] || (a[1] = u("i", { "aria-hidden": "true" }, null, -1)),
          J(" " + y(e.mode) + " ", 1),
          a[2] || (a[2] = u("i", { "aria-hidden": "true" }, null, -1)),
          a[3] || (a[3] = J(" bounded to this graph", -1))
        ])
      ])) : q("", !0),
      e.loading ? (x(), j("div", um, [
        (x(), j(K, null, re(5, (s) => u("i", { key: s })), 64))
      ])) : e.query ? e.results.length ? (x(), j("ol", fm, [
        (x(!0), j(K, null, re(e.results, (s, c) => (x(), j("li", {
          key: s.id
        }, [
          u("button", {
            class: oe(["jr-result", `family-${_($e)(s.kind)}`]),
            style: Ee({ "--node-color": _(qt)(s.kind) }),
            onClick: (l) => n("select", s.id)
          }, [
            u("span", gm, y(c + 1), 1),
            G(Gt, {
              class: "jr-kind-mark",
              family: _($e)(s.kind),
              radius: 8
            }, null, 8, ["family"]),
            u("span", mm, [
              u("span", vm, y(s.kind.replace(/_/g, " ")), 1),
              u("b", null, y(s.label), 1),
              u("span", null, y(s.summary || "No summary recorded."), 1),
              u("small", bm, y(o(s.updated_at)), 1)
            ]),
            u("span", ym, [
              u("b", _m, y(r(s) !== null ? r(s)?.toFixed(2) : "exact"), 1),
              u("i", null, [
                u("span", {
                  style: Ee({ width: `${(r(s) ?? 1) * 100}%` })
                }, null, 4)
              ]),
              u("small", null, y(r(s) !== null ? "semantic" : "text + attrs"), 1)
            ])
          ], 14, hm)
        ]))), 128))
      ])) : (x(), j("div", pm, [
        G(_(Z), {
          icon: "tabler:file-search",
          "aria-hidden": "true"
        }),
        a[7] || (a[7] = u("h3", null, "Nothing matched", -1)),
        a[8] || (a[8] = u("p", null, "Try a broader phrase, or open the navigator and search a different graph.", -1))
      ])) : (x(), j("div", dm, [
        G(_(Z), {
          icon: "tabler:search",
          "aria-hidden": "true"
        }),
        a[5] || (a[5] = u("h3", null, "Recall context, not just words", -1)),
        a[6] || (a[6] = u("p", null, "Match exact text or semantic meaning inside this graph. Every result keeps its address and revision, so you can cite what you find.", -1))
      ]))
    ]));
  }
}), xm = {
  class: "jr-stale",
  "aria-label": "Stale review"
}, jm = { class: "jr-lens-meta" }, km = { class: "jr-lens-facts" }, Em = { class: "jr-numeric" }, Sm = { class: "jr-numeric" }, Im = { class: "jr-numeric" }, Tm = {
  key: 0,
  class: "jr-lens-bound"
}, $m = {
  key: 0,
  class: "jr-empty-state"
}, Cm = {
  key: 1,
  class: "jr-stale-list"
}, Am = { class: "jr-stale-head" }, Om = ["aria-label", "aria-expanded", "onClick"], Nm = ["onClick"], Mm = {
  key: 0,
  class: "jr-numeric"
}, Rm = {
  key: 1,
  class: "jr-numeric"
}, Pm = { class: "jr-numeric" }, Lm = { class: "jr-numeric" }, Dm = {
  key: 2,
  class: "jr-numeric"
}, zm = { class: "jr-numeric" }, Vm = { class: "jr-numeric dormant" }, Um = {
  key: 0,
  class: "jr-stale-members"
}, Fm = ["onClick"], Bm = { class: "jr-numeric" }, Wm = ["onClick"], Hm = { class: "jr-numeric" }, Gm = /* @__PURE__ */ Ne({
  __name: "StaleReview",
  props: {
    tasks: {},
    now: {},
    taskBound: {}
  },
  emits: ["task", "close"],
  setup(e, { emit: t }) {
    const n = e, r = t, o = L(() => ds(n.tasks, n.now)), i = L(() => {
      const l = new Map(n.tasks.map((m) => [m.id, m])), d = (m) => {
        let p = l.get(m);
        const b = /* @__PURE__ */ new Set();
        for (; p?.parent_task_id && l.has(p.parent_task_id) && !b.has(p.id); )
          b.add(p.id), p = l.get(p.parent_task_id);
        return p;
      }, f = /* @__PURE__ */ new Map();
      for (const m of o.value) {
        const p = d(m.root.id) || m.root, b = f.get(p.id);
        b ? b.parts.push(m) : f.set(p.id, { root: p, parts: [m] });
      }
      return [...f.values()].map((m) => ({
        root: m.root,
        parts: m.parts.sort((p, b) => p.lastActivityAt - b.lastActivityAt),
        tasks: m.parts.reduce((p, b) => p + b.members.length + 1, 0),
        open: m.parts.reduce((p, b) => p + b.openCount, 0),
        blocked: m.parts.reduce((p, b) => p + b.blockedCount, 0),
        settled: m.parts.reduce((p, b) => p + b.doneCount, 0),
        lastActivityAt: Math.max(...m.parts.map((p) => p.lastActivityAt)),
        whole: m.parts.length === 1 && m.parts[0].root.id === m.root.id
      })).sort((m, p) => m.lastActivityAt - p.lastActivityAt);
    }), a = V(/* @__PURE__ */ new Set()), s = L(() => ({
      programs: i.value.length,
      tasks: i.value.reduce((l, d) => l + d.tasks, 0),
      open: i.value.reduce((l, d) => l + d.open, 0)
    }));
    function c(l) {
      const d = new Set(a.value);
      d.has(l) ? d.delete(l) : d.add(l), a.value = d;
    }
    return (l, d) => (x(), j("section", xm, [
      u("div", jm, [
        d[6] || (d[6] = u("span", { class: "jr-lens-title" }, "Stale review", -1)),
        u("span", km, [
          u("b", Em, y(s.value.programs), 1),
          J(" dormant program" + y(s.value.programs === 1 ? "" : "s") + " ", 1),
          d[1] || (d[1] = u("i", { "aria-hidden": "true" }, null, -1)),
          u("b", Sm, y(s.value.tasks), 1),
          d[2] || (d[2] = J(" tasks ", -1)),
          d[3] || (d[3] = u("i", { "aria-hidden": "true" }, null, -1)),
          u("b", Im, y(s.value.open), 1),
          d[4] || (d[4] = J(" still open ", -1))
        ]),
        e.taskBound.hasMore ? (x(), j("span", Tm, y(e.taskBound.loaded.toLocaleString()) + " of " + y(e.taskBound.total.toLocaleString()) + " tasks ", 1)) : q("", !0),
        u("button", {
          class: "jr-lens-advice",
          onClick: d[0] || (d[0] = (f) => r("close"))
        }, [
          G(_(Z), {
            icon: "tabler:x",
            "aria-hidden": "true"
          }),
          d[5] || (d[5] = J(" Done", -1))
        ])
      ]),
      o.value.length ? (x(), j("ol", Cm, [
        (x(!0), j(K, null, re(i.value, (f) => (x(), j("li", {
          key: f.root.id,
          class: "jr-stale-item"
        }, [
          u("div", Am, [
            u("button", {
              class: "jr-stale-fold",
              "aria-label": a.value.has(f.root.id) ? `Collapse ${f.root.title}` : `Expand ${f.root.title}`,
              "aria-expanded": a.value.has(f.root.id),
              onClick: (m) => c(f.root.id)
            }, [
              G(_(Z), {
                icon: a.value.has(f.root.id) ? "tabler:chevron-down" : "tabler:chevron-right",
                "aria-hidden": "true"
              }, null, 8, ["icon"])
            ], 8, Om),
            u("button", {
              class: "jr-stale-title",
              onClick: (m) => r("task", f.root.id)
            }, [
              u("b", null, y(f.root.title), 1),
              u("small", null, [
                f.whole ? (x(), j("span", Mm, "dormant whole")) : (x(), j("span", Rm, y(f.parts.length) + " dormant part" + y(f.parts.length === 1 ? "" : "s"), 1)),
                u("span", Pm, y(f.tasks) + " task" + y(f.tasks === 1 ? "" : "s"), 1),
                u("span", Lm, y(f.open) + " open", 1),
                f.blocked ? (x(), j("span", Dm, y(f.blocked) + " blocked", 1)) : q("", !0),
                u("span", zm, y(f.settled) + " settled", 1)
              ])
            ], 8, Nm),
            u("time", Vm, y(_(Se)(f.lastActivityAt, e.now)), 1)
          ]),
          a.value.has(f.root.id) ? (x(), j("ul", Um, [
            (x(!0), j(K, null, re(f.parts, (m) => (x(), j(K, {
              key: m.root.id
            }, [
              u("li", null, [
                u("button", {
                  onClick: (p) => r("task", m.root.id)
                }, [
                  u("span", {
                    class: oe(["jr-state-chip", `state-${m.root.status}`])
                  }, y(m.root.status.replace(/_/g, " ")), 3),
                  u("span", null, [
                    u("b", null, y(m.root.title), 1)
                  ]),
                  u("time", Bm, y(_(Se)(m.lastActivityAt, e.now)), 1)
                ], 8, Fm)
              ]),
              (x(!0), j(K, null, re(m.members, (p) => (x(), j("li", {
                key: p.id,
                class: "nested"
              }, [
                u("button", {
                  onClick: (b) => r("task", p.id)
                }, [
                  u("span", {
                    class: oe(["jr-state-chip", `state-${p.status}`])
                  }, y(p.status.replace(/_/g, " ")), 3),
                  u("span", null, y(p.title), 1),
                  u("time", Hm, y(_(Se)(p.updated_at, e.now)), 1)
                ], 8, Wm)
              ]))), 128))
            ], 64))), 128))
          ])) : q("", !0)
        ]))), 128))
      ])) : (x(), j("div", $m, [
        G(_(Z), {
          icon: "tabler:mood-check",
          "aria-hidden": "true"
        }),
        d[7] || (d[7] = u("h3", null, "Nothing has gone dormant", -1)),
        u("p", null, "Every program in this journal has been touched inside the last " + y(Math.round(_(ls) / 86400)) + " days.", 1)
      ])),
      d[8] || (d[8] = u("p", { class: "jr-stale-note" }, " Ask an agent to settle work after reviewing its history. ", -1))
    ]));
  }
}), Ym = { class: "jr-timeline-lens" }, Km = { class: "jr-lens-meta" }, qm = { class: "jr-lens-facts" }, Xm = { class: "jr-numeric" }, Jm = {
  key: 0,
  class: "jr-empty-state"
}, Zm = {
  key: 1,
  class: "jr-timeline"
}, Qm = { class: "jr-time-day" }, ev = { class: "jr-numeric" }, tv = { class: "jr-time-list" }, nv = ["disabled", "onClick"], rv = {
  class: "jr-time-rail",
  "aria-hidden": "true"
}, ov = { class: "jr-time-copy" }, iv = { class: "jr-time-kind" }, sv = { class: "jr-time-rev jr-numeric" }, av = /* @__PURE__ */ Ne({
  __name: "TimelineLens",
  props: {
    items: {},
    nodes: {}
  },
  emits: ["select"],
  setup(e, { emit: t }) {
    const n = e, r = t, o = L(() => new Map((n.nodes || []).map((d) => [d.id, d.label])));
    function i(d) {
      return d && o.value.get(d) || "Record outside this view";
    }
    function a(d, f) {
      const m = d.attrs?.[f];
      return typeof m == "string" ? m : "";
    }
    function s(d) {
      const f = d.attrs?.operation, m = f && typeof f == "object" ? f.kind : void 0;
      return typeof m == "string" ? m : "related";
    }
    function c(d, f) {
      const m = d.updated_at ? new Date(d.updated_at * 1e3) : null, p = m ? m.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "", b = d.entity_type === "edge", w = /\.add$/.test(d.kind) ? "added" : /\.remove|\.delete/.test(d.kind) ? "removed" : "updated";
      if (b) {
        const h = s(d), g = Et(h);
        return {
          item: d,
          minute: p,
          repeated: f?.minute === p,
          isEdge: b,
          title: `${i(d.from_node_id)} → ${i(d.to_node_id)}`,
          kind: h.replace(/_/g, " "),
          status: "",
          verb: w,
          family: "relation",
          colour: g === "conflict" ? "var(--jr-danger)" : g === "support" ? "var(--jr-success)" : g === "succession" ? "var(--jr-decision)" : "var(--jr-muted)"
        };
      }
      const v = a(d, "kind") || "record";
      return {
        item: d,
        minute: p,
        repeated: f?.minute === p,
        isEdge: b,
        title: d.label || a(d, "label") || "Journal entry",
        kind: v.replace(/_/g, " "),
        status: a(d, "status"),
        verb: w,
        family: $e(v),
        colour: qt(v)
      };
    }
    const l = L(() => {
      const d = /* @__PURE__ */ new Map();
      for (const f of n.items) {
        const m = f.updated_at ? new Date(f.updated_at * 1e3).toLocaleDateString([], { weekday: "long", month: "short", day: "numeric" }) : "Undated", p = d.get(m) || [];
        p.push(c(f, p[p.length - 1])), d.set(m, p);
      }
      return [...d.entries()].map(([f, m]) => ({
        day: f,
        entries: m,
        records: m.filter((p) => !p.isEdge).length,
        relations: m.filter((p) => p.isEdge).length
      }));
    });
    return (d, f) => (x(), j("section", Ym, [
      u("div", Km, [
        f[3] || (f[3] = u("span", { class: "jr-lens-title" }, "Changes", -1)),
        u("span", qm, [
          u("b", Xm, y(e.items.length), 1),
          f[0] || (f[0] = J(" revisions ", -1)),
          f[1] || (f[1] = u("i", { "aria-hidden": "true" }, null, -1)),
          f[2] || (f[2] = J(" newest first", -1))
        ])
      ]),
      e.items.length ? (x(), j("ol", Zm, [
        (x(!0), j(K, null, re(l.value, (m) => (x(), j("li", {
          key: m.day,
          class: "jr-time-group"
        }, [
          u("h3", Qm, [
            u("span", null, y(m.day), 1),
            u("em", ev, y(m.records) + " records · " + y(m.relations) + " relations", 1)
          ]),
          u("ol", tv, [
            (x(!0), j(K, null, re(m.entries, (p) => (x(), j("li", {
              key: `${p.item.entity_type}:${p.item.id}`
            }, [
              u("button", {
                class: oe(["jr-time-row", { "is-edge": p.isEdge }]),
                disabled: p.isEdge,
                onClick: (b) => !p.isEdge && r("select", p.item.id)
              }, [
                u("time", {
                  class: oe(["jr-numeric", { repeat: p.repeated }])
                }, y(p.minute), 3),
                u("span", rv, [
                  G(Gt, {
                    family: p.family === "relation" ? "note" : p.family,
                    radius: p.isEdge ? 4.4 : 6.4,
                    hollow: p.isEdge ? !1 : void 0,
                    "view-box": "-10 -10 20 20",
                    style: Ee({ color: p.colour })
                  }, null, 8, ["family", "radius", "hollow", "style"])
                ]),
                u("span", ov, [
                  u("b", null, y(p.title), 1),
                  u("small", iv, y(p.kind), 1),
                  p.status ? (x(), j("small", {
                    key: 0,
                    class: oe(["jr-state-chip", `state-${p.status.toLowerCase()}`])
                  }, y(p.status), 3)) : q("", !0)
                ]),
                u("span", sv, y(p.verb) + " · rev " + y(p.item.revision), 1)
              ], 10, nv)
            ]))), 128))
          ])
        ]))), 128))
      ])) : (x(), j("div", Jm, [
        G(_(Z), {
          icon: "tabler:timeline-event",
          "aria-hidden": "true"
        }),
        f[4] || (f[4] = u("h3", null, "No revisions in range", -1)),
        f[5] || (f[5] = u("p", null, "Nothing has been written to this graph inside the bounded query window.", -1))
      ]))
    ]));
  }
});
function at(e) {
  const t = new URLSearchParams();
  for (const [r, o] of Object.entries(e)) o !== void 0 && o !== "" && t.set(r, String(o));
  const n = t.toString();
  return n ? `?${n}` : "";
}
function qe(e, t) {
  const n = e, r = n?.response?.data?.error ?? n?.data?.error;
  return typeof r == "string" && r ? r : typeof n?.message == "string" && n.message && !/status code|request failed/i.test(n.message) ? n.message : t;
}
const Fo = 500, Bo = 1e3;
class lv {
  constructor(t) {
    this.journalId = t;
  }
  base() {
    return `/api/v1/workspace/journals/${this.journalId}`;
  }
  /**
   * The journal itself: counts, the task page, the graph catalog, the cursor
   * roll and the open work spans. Every collection in it is a keyset page.
   */
  async state() {
    try {
      const { data: t } = await Le.get(this.base());
      if (!t.success) throw new Error(t.error || "failed to read the journal");
      return t.journal;
    } catch (t) {
      throw new Error(qe(t, "Couldn’t read this Journal."));
    }
  }
  /**
   * The whole task tree. The journal snapshot carries one pinned page of tasks
   * and no usable continuation, so a count taken over it would be a count over
   * a page; the tree read honours its own bounds and answers with the work the
   * journal actually holds.
   */
  async tasks(t = 5e3, n = 6) {
    try {
      const { data: r } = await Le.get(`${this.base()}/tree${at({ depth: n, limit: t })}`);
      if (!r.success) throw new Error(r.error || "failed to read the task tree");
      const o = [], i = (a, s) => {
        for (const c of a || []) {
          const { children: l, ...d } = c;
          o.push({ ...d, parent_task_id: d.parent_task_id || s }), l?.length && i(l, d.id);
        }
      };
      return i(r.tree?.children || []), { tasks: o, bounded: o.length >= t };
    } catch (r) {
      throw new Error(qe(r, "Couldn’t read this Journal’s work."));
    }
  }
  async graphs() {
    try {
      const { data: t } = await Le.get(`${this.base()}/graphs?limit=100`);
      if (!t.success) throw new Error(t.error || "failed to list graphs");
      return t.graphs || [];
    } catch (t) {
      throw new Error(qe(t, "Couldn’t load Journal graphs."));
    }
  }
  async window(t, n) {
    try {
      const r = at({ mode: "window", node_id: n, levels: 4, limit: 160, edge_limit: 480 }), { data: o } = await Le.get(`${this.base()}/graphs/${encodeURIComponent(t)}${r}`);
      if (!o.success) throw new Error(o.error || "failed to load graph window");
      return o.result;
    } catch (r) {
      throw new Error(qe(r, "Couldn’t load the graph focus window."));
    }
  }
  /**
   * One page of the whole graph. The server states the real totals in the
   * manifest and routes the next page in its own continuation, so a reader is
   * never told a count the graph does not hold.
   */
  async bundle(t, n, r) {
    try {
      const o = at({
        mode: "bundle",
        node_limit: Fo,
        edge_limit: Bo,
        node_offset: n,
        edge_offset: r
      }), { data: i } = await Le.get(`${this.base()}/graphs/${encodeURIComponent(t)}${o}`);
      if (!i.success) throw new Error(i.error || "failed to load the graph");
      return i.result;
    } catch (o) {
      throw new Error(qe(o, "Couldn’t load the whole graph."));
    }
  }
  /** A branch as its own canvas: the complete subtree under one record. */
  async subtree(t, n, r = 0, o = 0) {
    try {
      const i = at({
        mode: "subtree",
        root_id: n,
        node_limit: Fo,
        edge_limit: Bo,
        node_offset: r,
        edge_offset: o
      }), { data: a } = await Le.get(`${this.base()}/graphs/${encodeURIComponent(t)}${i}`);
      if (!a.success) throw new Error(a.error || "failed to load the branch");
      return a.result;
    } catch (i) {
      throw new Error(qe(i, "Couldn’t open this branch."));
    }
  }
  async search(t, n, r = "search") {
    try {
      const o = at({ mode: r, query: n, limit: 60 }), { data: i } = await Le.get(`${this.base()}/graphs/${encodeURIComponent(t)}${o}`);
      if (!i.success) throw new Error(i.error || "search failed");
      return i.result?.items || [];
    } catch (o) {
      throw new Error(qe(o, "Couldn’t search this graph."));
    }
  }
  async timeline(t) {
    try {
      const n = at({ mode: "timeline", limit: 200 }), { data: r } = await Le.get(`${this.base()}/graphs/${encodeURIComponent(t)}${n}`);
      if (!r.success) throw new Error(r.error || "timeline failed");
      return r.result?.items || [];
    } catch (n) {
      throw new Error(qe(n, "Couldn’t load the graph timeline."));
    }
  }
  /** The cursor store itself: every agent that holds a position in this journal. */
  async cursors(t = 200) {
    try {
      const { data: n } = await Le.get(`${this.base()}/cursors${at({ limit: t })}`);
      if (!n.success) throw new Error(n.error || "failed to list cursors");
      return n.cursors?.items || [];
    } catch (n) {
      throw new Error(qe(n, "Couldn’t load agent positions."));
    }
  }
  /**
   * Work spans, journal-wide. A span begins at an identity's first write and
   * seals itself after inactivity, so this is what an agent actually did rather
   * than what it declared.
   */
  async spans(t = {}) {
    try {
      const n = at({
        state: t.state,
        agent_id: t.agentId,
        task_id: t.taskId,
        limit: t.limit ?? 200,
        after_activity_at: t.afterActivityAt,
        after_span_id: t.afterSpanId
      }), { data: r } = await Le.get(`${this.base()}/spans${n}`);
      if (!r.success) throw new Error(r.error || "failed to list work spans");
      return r.spans;
    } catch (n) {
      throw new Error(qe(n, "Couldn’t load work spans."));
    }
  }
  /** Server-bucketed activity, so a lane at scale is counted rather than folded. */
  async activity(t = {}) {
    try {
      const n = at({
        bucket: t.bucket || "hour",
        agent_id: t.agentId,
        since: t.since,
        limit: t.limit ?? 400,
        after_bucket_at: t.afterBucketAt,
        after_agent_id: t.afterAgentId
      }), { data: r } = await Le.get(`${this.base()}/activity${n}`);
      if (!r.success) throw new Error(r.error || "failed to read activity");
      return r.activity;
    } catch (n) {
      throw new Error(qe(n, "Couldn’t load journal activity."));
    }
  }
  /** What the last on-demand assembly of this map did. */
  async assembly(t) {
    try {
      const { data: n } = await Le.get(`${this.base()}/graphs/${encodeURIComponent(t)}/assemble`);
      return n.success && n.assembly || null;
    } catch {
      return null;
    }
  }
  /** Requests one assembly pass; a pass already under way is the answer. */
  async assemble(t) {
    try {
      const { data: n } = await Le.post(`${this.base()}/graphs/${encodeURIComponent(t)}/assemble`, {});
      if (!n.success) throw new Error(n.error || "failed to start the assembly");
      return n.assembly;
    } catch (n) {
      throw new Error(qe(n, "Couldn’t recompute this map."));
    }
  }
  async health() {
    try {
      const { data: t } = await Le.get(`${this.base()}/health`);
      return t.success ? t.health || {} : { status: "unknown" };
    } catch {
      return { status: "unknown" };
    }
  }
}
function cv() {
  return {
    nodes: [],
    edges: [],
    nodeIndex: /* @__PURE__ */ new Map(),
    edgeIndex: /* @__PURE__ */ new Map(),
    nodeOffset: 0,
    edgeOffset: 0,
    totalNodes: 0,
    totalEdges: 0,
    chunks: 0,
    done: !1,
    cancelled: !1,
    error: ""
  };
}
function uv(e, t) {
  return e ? (t.revision || 0) >= (e.revision || 0) : !0;
}
function Wo(e, t, n) {
  for (const r of n || []) {
    const o = t.get(r.id);
    o === void 0 ? (t.set(r.id, e.length), e.push(r)) : uv(e[o], r) && (e[o] = r);
  }
}
function dv(e, t) {
  return Wo(e.nodes, e.nodeIndex, t.nodes), Wo(e.edges, e.edgeIndex, t.edges), e.nodeOffset += (t.nodes || []).length, e.edgeOffset += (t.edges || []).length, e.totalNodes = Math.max(e.totalNodes, Number(t.manifest?.node_count) || 0, e.nodes.length), e.totalEdges = Math.max(e.totalEdges, Number(t.manifest?.edge_count) || 0, e.edges.length), e.chunks += 1, e;
}
function pv(e) {
  return !!e.omissions?.nodes?.continuation || !!e.omissions?.edges?.continuation;
}
function Ho(e) {
  const t = e.nodes.length + e.edges.length, n = Math.max(t, e.totalNodes + e.totalEdges);
  return { loaded: t, total: n, ratio: n ? Math.min(1, t / n) : 0 };
}
async function fv(e, t = {}) {
  const n = cv(), r = t.maxChunks ?? 400;
  try {
    for (; ; ) {
      if (t.cancellation?.cancelled) {
        n.cancelled = !0;
        break;
      }
      const o = await e({ nodeOffset: n.nodeOffset, edgeOffset: n.edgeOffset }), i = { nodes: n.nodeOffset, edges: n.edgeOffset };
      if (dv(n, o), t.onChunk?.(n), t.cancellation?.cancelled) {
        n.cancelled = !0;
        break;
      }
      if (!pv(o)) {
        n.done = !0;
        break;
      }
      if (n.nodeOffset === i.nodes && n.edgeOffset === i.edges) {
        n.done = !0;
        break;
      }
      if (n.chunks >= r) {
        n.done = !0;
        break;
      }
    }
  } catch (o) {
    n.error = o instanceof Error ? o.message : "Loading the whole graph failed.";
  }
  return n;
}
const hv = ["now", "outline", "graph", "lanes", "recall", "changes"], Go = {
  n: "now",
  o: "outline",
  g: "graph",
  t: "lanes",
  r: "recall",
  c: "changes"
}, ps = { kind: "journal", id: "", label: "Journal" };
function gv(e, t) {
  return e.length === t.length && e.every((n, r) => n.kind === t[r].kind && n.id === t[r].id);
}
function mv(e, t) {
  return e.lens === t.lens && gv(e.focus, t.focus);
}
function Yo(e) {
  return e.map((t) => `${t.kind}:${t.id}`).join("/");
}
function vv(e) {
  return encodeURIComponent(e);
}
function bv(e) {
  const t = e.focus.filter((n) => n.kind !== "journal").map((n) => `${n.kind}:${vv(n.id)}`).join("/");
  return t ? `${e.lens}/${t}` : e.lens;
}
const yv = /* @__PURE__ */ new Set(["journal", "graph", "branch", "node"]);
function _v(e) {
  const t = "".split("/").filter(Boolean), n = hv.includes(t[0]) ? t[0] : "now", r = [ps];
  let o = "";
  for (const i of t.slice(1)) {
    const a = i.indexOf(":");
    if (a < 0) continue;
    const s = i.slice(0, a), c = decodeURIComponent(i.slice(a + 1));
    !yv.has(s) || s === "journal" || !c || (s === "graph" && (o = c), r.push({ kind: s, id: c, label: c, graphId: s === "graph" ? c : o }));
  }
  return { focus: r, lens: n };
}
function wv(e) {
  for (let t = e.focus.length - 1; t >= 0; t--) {
    const n = e.focus[t];
    if (n.kind === "graph") return n.id;
    if (n.graphId) return n.graphId;
  }
  return "";
}
function xv(e) {
  const t = e.focus[e.focus.length - 1];
  return t && (t.kind === "branch" || t.kind === "node") ? t.id : "";
}
const Ko = 120, jv = 240;
class kv {
  history;
  at = 0;
  memory = /* @__PURE__ */ new Map();
  constructor(t = { focus: [ps], lens: "now" }) {
    this.history = [t];
  }
  get place() {
    return this.history[this.at];
  }
  get focus() {
    return this.place.focus;
  }
  get lens() {
    return this.place.lens;
  }
  get current() {
    return this.place.focus[this.place.focus.length - 1];
  }
  get depth() {
    return this.place.focus.length;
  }
  get canBack() {
    return this.at > 0;
  }
  get canForward() {
    return this.at < this.history.length - 1;
  }
  commit(t) {
    mv(t, this.place) || (this.history = [...this.history.slice(0, this.at + 1), t], this.history.length > Ko && (this.history = this.history.slice(this.history.length - Ko)), this.at = this.history.length - 1);
  }
  /** One step down: into a graph, a branch or a record. */
  descend(t) {
    const n = this.place.focus.findIndex((r) => r.kind === t.kind && r.id === t.id);
    if (n >= 0) {
      this.toIndex(n);
      return;
    }
    this.commit({ lens: this.place.lens, focus: [...this.place.focus, t] });
  }
  /** One step out. The journal itself is the floor. */
  ascend() {
    return this.place.focus.length <= 1 ? !1 : (this.commit({ lens: this.place.lens, focus: this.place.focus.slice(0, -1) }), !0);
  }
  /** Straight to one step of the breadcrumb. */
  toIndex(t) {
    const n = Math.max(0, Math.min(t, this.place.focus.length - 1));
    this.commit({ lens: this.place.lens, focus: this.place.focus.slice(0, n + 1) });
  }
  /** A lens projects the focus, so switching one keeps the reader in place. */
  setLens(t) {
    this.commit({ lens: t, focus: this.place.focus });
  }
  /** Replaces the whole place, as a restored route or a shared link does. */
  go(t) {
    this.commit(t);
  }
  /** Relabels the crumbs once the data that names them has loaded. */
  relabel(t) {
    this.history = this.history.map((n) => ({
      lens: n.lens,
      focus: n.focus.map((r) => {
        const o = t.get(`${r.kind}:${r.id}`);
        return o && o !== r.label ? { ...r, label: o } : r;
      })
    }));
  }
  back() {
    return this.canBack ? (this.at--, !0) : !1;
  }
  forward() {
    return this.canForward ? (this.at++, !0) : !1;
  }
  /** Every lens keeps its own arrangement of each focus. */
  rememberViewport(t) {
    const n = `${this.lens}@${Yo(this.focus)}`, r = this.memory.get(n);
    for (this.memory.delete(n), this.memory.set(n, { ...r, ...t }); this.memory.size > jv; ) {
      const o = this.memory.keys().next();
      if (o.done) break;
      this.memory.delete(o.value);
    }
  }
  viewport() {
    return this.memory.get(`${this.lens}@${Yo(this.focus)}`);
  }
  route() {
    return bv(this.place);
  }
}
const gr = {
  running: !1,
  loaded: 0,
  total: 0,
  chunks: 0,
  done: !1,
  cancelled: !1,
  error: ""
};
function Ev(e) {
  const t = L(() => new lv(e.value)), n = new kv(_v()), r = V(n.place), o = () => {
    r.value = { lens: n.lens, focus: [...n.focus] };
  }, i = V({}), a = V([]), s = Ut(null), c = Ut(null), l = Ut(null), d = V({ ...gr }), f = V({ status: "unknown" }), m = V([]), p = V([]), b = V({
    now: 0,
    leases: [],
    resumable: [],
    counts: { active: 0, write: 0, planning: 0, resumable: 0 },
    limit: 100,
    has_more: !1
  }), w = V({ open: 0, sealed: 0, total: 0 }), v = V([]), h = V([]), g = V(!1), E = V([]), T = V(3600), S = V(/* @__PURE__ */ new Map()), N = V({}), O = V(""), z = V(!0), P = V(""), Y = V(""), ne = V("hybrid"), M = V([]), I = V(!1), A = V([]), te = V(!1), ie = V(null), C = V(!1), ee = V(null), B = V(Math.floor(Date.now() / 1e3));
  let X, ue, se, de, me = 0, he = null;
  const we = [], Je = L(() => r.value.lens), ae = L(() => r.value.focus), Q = L(() => wv(r.value)), it = L(() => xv(r.value)), We = L(() => a.value.find((k) => k.id === Q.value) || s.value?.graph || null), be = L(() => c.value || s.value?.nodes || []), Re = L(() => l.value || s.value?.edges || []), xe = L(() => new Map(be.value.map((k) => [k.id, k]))), De = L(() => xe.value.get(O.value) || null), He = L(() => Fc(be.value, Re.value, m.value, Q.value, B.value)), ze = L(() => Bc(He.value)), mt = L(() => be.value.filter(Wt).length), At = L(() => be.value.filter((k) => !Wt(k) && !Xn(k)).length), Ot = L(() => {
    const k = /* @__PURE__ */ new Map();
    for (const F of p.value) {
      const H = as(F);
      if (!H) continue;
      const pe = `task:${H}`, le = k.get(pe);
      le ? (le.sessions += 1, le.lastActivityAt = Math.max(le.lastActivityAt, F.last_activity_at)) : k.set(pe, { sessions: 1, lastActivityAt: F.last_activity_at });
    }
    return k;
  }), Ve = L(() => c.value ? { nodes: 0, edges: 0 } : {
    nodes: s.value?.collapsed_node_count || 0,
    edges: s.value?.collapsed_edge_count || 0
  }), Xt = L(() => {
    let k = 0;
    for (const F of be.value) {
      let H = 1, pe = F.parent_id;
      const le = /* @__PURE__ */ new Set([F.id]);
      for (; pe && xe.value.has(pe) && !le.has(pe); )
        le.add(pe), H++, pe = xe.value.get(pe)?.parent_id;
      k = Math.max(k, H);
    }
    return k;
  });
  function Jt() {
    return `kickside.thread.${e.value}.projection.chestor.journal:graph_state`;
  }
  function Zt() {
    return `kickside.thread.${e.value}.projection.chestor.journal:state`;
  }
  function Nt() {
    return f.value.status === "ok" ? "Healthy" : f.value.status === "degraded" ? "Degraded" : "Health unknown";
  }
  function Ge() {
    const k = /* @__PURE__ */ new Map();
    for (const H of a.value) k.set(`graph:${H.id}`, H.title);
    for (const H of be.value)
      k.set(`node:${H.id}`, H.label), k.set(`branch:${H.id}`, H.label);
    n.relabel(k);
    const F = new Map(S.value);
    for (const H of be.value) F.set(H.id, H.label);
    S.value = F, o();
  }
  function vt() {
    c.value = null, l.value = null, d.value = { ...gr }, he && (he.cancelled = !0), he = null;
  }
  async function bt() {
    if (a.value = await t.value.graphs(), Q.value || !a.value.length) return;
    const k = a.value.find((F) => F.kind === "current-work") || a.value.find((F) => F.id === "map") || a.value[0];
    n.descend({ kind: "graph", id: k.id, label: k.title, graphId: k.id }), o();
  }
  function Mt(k, F) {
    if (F) return F;
    const H = n.viewport()?.selectedId;
    return H && k.some((pe) => pe.id === H) ? H : k[0]?.id || "";
  }
  async function et(k = !1) {
    if (!Q.value) return;
    const F = ++me, H = r.value.focus[r.value.focus.length - 1];
    if (H?.kind === "branch") {
      const le = await t.value.subtree(Q.value, H.id);
      if (F !== me) return;
      c.value = le.nodes || [], l.value = le.edges || [], d.value = {
        running: !1,
        loaded: (le.nodes || []).length + (le.edges || []).length,
        total: (le.manifest?.node_count || 0) + (le.manifest?.edge_count || 0),
        chunks: 1,
        done: le.complete !== !1,
        cancelled: !1,
        error: ""
      }, k || (O.value = Mt(le.nodes || [], "") || H.id);
      return;
    }
    const pe = await t.value.window(Q.value, H?.kind === "node" ? H.id : void 0);
    F === me && (s.value = pe, (!k || !pe.nodes.some((le) => le.id === O.value)) && (O.value = Mt(pe.nodes, H?.kind === "node" ? H.id : "")));
  }
  async function R() {
    const [k, F] = await Promise.all([t.value.state(), t.value.tasks()]);
    v.value = F.tasks, g.value = F.bounded, h.value = k.events || [], N.value = {
      events: k.stats?.total || 0,
      lastSeq: k.stats?.last_seq || 0,
      lastTs: k.stats?.last_ts || 0,
      tasks: k.stats?.task_count || 0,
      openTasks: k.stats?.open_task_count || 0
    }, k.graphs?.length && (a.value = k.graphs), k.work_control && (b.value = k.work_control);
  }
  async function $() {
    const [k, F] = await Promise.all([
      t.value.cursors(),
      t.value.spans({ limit: 200 })
    ]);
    m.value = k, p.value = F.items || [], w.value = {
      open: F.counts?.open || 0,
      sealed: F.counts?.sealed || 0,
      total: F.counts?.total || 0
    };
  }
  async function W() {
    const k = e.value, F = t.value, H = async (Ye) => {
      let Ke = await F.activity({ bucket: Ye, limit: 2e3 });
      const kn = [...Ke.buckets || []];
      for (let to = 0; Ke.has_more && to < 20; to++) {
        const or = Ke.next_cursor || {};
        if (or.after_bucket_at === void 0) break;
        Ke = await F.activity({ bucket: Ye, limit: 2e3, afterBucketAt: or.after_bucket_at, afterAgentId: or.after_agent_id }), kn.push(...Ke.buckets || []);
      }
      return { all: kn, width: Ke.width_s, exhausted: !Ke.has_more };
    }, pe = await F.activity({ bucket: "hour", limit: 2e3 });
    if (k !== e.value) return;
    if (!pe.has_more) {
      E.value = pe.buckets || [], T.value = pe.width_s || 3600;
      return;
    }
    const le = await H("day");
    k === e.value && (E.value = le.all, T.value = le.width || 86400);
  }
  async function ge() {
    if (!e.value) {
      P.value = "Journal entry id is required.", z.value = !1;
      return;
    }
    z.value = !0;
    try {
      await bt(), await Promise.all([
        et(),
        R(),
        $(),
        W(),
        t.value.health().then((k) => {
          f.value = k;
        }),
        wt()
      ]), Ge(), P.value = "";
    } catch (k) {
      P.value = k instanceof Error ? k.message : "Couldn’t load the Journal.";
    } finally {
      z.value = !1;
    }
  }
  async function Ue() {
    const k = Q.value;
    if (!k || d.value.running) return;
    const F = { cancelled: !1 };
    he = F, d.value = { ...gr, running: !0 };
    const H = await fv(
      (le) => t.value.bundle(k, le.nodeOffset, le.edgeOffset),
      {
        cancellation: F,
        onChunk: (le) => {
          const Ye = Ho(le);
          c.value = le.nodes, l.value = le.edges, En(c), En(l), d.value = {
            running: !0,
            loaded: Ye.loaded,
            total: Ye.total,
            chunks: le.chunks,
            done: !1,
            cancelled: !1,
            error: ""
          };
        }
      }
    );
    he === F && (he = null);
    const pe = Ho(H);
    c.value = H.nodes, l.value = H.edges, En(c), En(l), d.value = {
      running: !1,
      loaded: pe.loaded,
      total: pe.total,
      chunks: H.chunks,
      done: H.done,
      cancelled: H.cancelled,
      error: H.error
    }, Ge();
  }
  function Pe() {
    he && (he.cancelled = !0);
  }
  async function yt(k) {
    if (k === Q.value) return;
    const F = a.value.find((H) => H.id === k);
    n.go({
      lens: n.lens === "now" ? "outline" : n.lens,
      focus: [r.value.focus[0], { kind: "graph", id: k, label: F?.title || k, graphId: k }]
    }), o(), O.value = "", Y.value = "", M.value = [], ie.value = null, A.value = [], vt(), s.value = null, z.value = !0;
    try {
      wt(), await et(), Ge(), Rt(), P.value = "";
    } catch (H) {
      P.value = H instanceof Error ? H.message : "Couldn’t load graph.";
    } finally {
      z.value = !1;
    }
  }
  function Zn(k) {
    O.value = k;
  }
  function Rt() {
    i.value = { ...n.viewport() };
  }
  async function tt() {
    o(), vt(), z.value = !0;
    try {
      await et(), Ge(), Rt(), P.value = "";
    } catch (k) {
      P.value = k instanceof Error ? k.message : "Couldn’t open this focus.";
    } finally {
      z.value = !1;
    }
  }
  async function Qt(k) {
    const F = xe.value.get(k);
    F && (n.descend({
      kind: F.child_count > 0 ? "branch" : "node",
      id: k,
      label: F.label,
      graphId: Q.value
    }), O.value = k, await tt());
  }
  async function Qn(k) {
    const F = r.value.focus.find((H) => H.kind === "graph");
    F && (n.go({
      lens: r.value.lens,
      focus: [r.value.focus[0], F, { kind: "node", id: k, label: S.value.get(k) || k, graphId: F.id }]
    }), O.value = k, await tt());
  }
  async function xn() {
    return n.ascend() ? (await tt(), !0) : !1;
  }
  async function ct(k) {
    n.toIndex(k), await tt();
  }
  async function jn() {
    n.back() && await tt();
  }
  async function en() {
    n.forward() && await tt();
  }
  function tn(k) {
    n.setLens(k), o(), Rt(), k === "recall" && Tt(() => ee.value?.focus()), k === "changes" && rn(), k === "lanes" && !E.value.length && W();
  }
  async function nn() {
    if (clearTimeout(X), !Y.value.trim() || !Q.value) {
      M.value = [];
      return;
    }
    I.value = !0;
    try {
      M.value = await t.value.search(Q.value, Y.value.trim(), ne.value), P.value = "";
    } catch (k) {
      P.value = k instanceof Error ? k.message : "Search failed.", M.value = [];
    } finally {
      I.value = !1;
    }
  }
  function er() {
    clearTimeout(X), X = setTimeout(nn, 320);
  }
  async function tr(k) {
    O.value = k, xe.value.has(k) || await Qt(k);
  }
  async function rn() {
    if (!(A.value.length || te.value || !Q.value)) {
      te.value = !0;
      try {
        A.value = await t.value.timeline(Q.value), P.value = "";
      } catch (k) {
        P.value = k instanceof Error ? k.message : "Timeline failed.";
      } finally {
        te.value = !1;
      }
    }
  }
  async function _t() {
    if (!(!e.value || z.value || d.value.running))
      try {
        await Promise.all([
          bt(),
          et(!0),
          R(),
          $(),
          W(),
          t.value.health().then((k) => {
            f.value = k;
          }),
          wt()
        ]), Ge();
      } catch {
      }
  }
  async function wt() {
    if (!Q.value) return;
    const k = await t.value.assembly(Q.value);
    ie.value = k, C.value = Bn(k);
  }
  function xt() {
    clearTimeout(de), de = setTimeout(async () => {
      if (!e.value || !Q.value) return;
      const k = await t.value.assembly(Q.value);
      if (ie.value = k, Bn(k)) {
        xt();
        return;
      }
      C.value = !1, await et(!0), await bt();
    }, 1200);
  }
  async function nr() {
    if (!(!Q.value || C.value)) {
      C.value = !0;
      try {
        ie.value = await t.value.assemble(Q.value), P.value = "", xt();
      } catch (k) {
        C.value = !1, P.value = k instanceof Error ? k.message : "Couldn’t recompute this map.";
      }
    }
  }
  function rr(k) {
    const F = xe.value.get(k);
    return F ? be.value.filter((H) => (H.parent_id || "") === (F.parent_id || "")).sort((H, pe) => H.label.localeCompare(pe.label)) : [];
  }
  function ut(k) {
    const F = O.value || be.value[0]?.id || "", H = xe.value.get(F);
    if (!H) {
      O.value = be.value[0]?.id || "";
      return;
    }
    if (k === "out") {
      H.parent_id && xe.value.has(H.parent_id) && (O.value = H.parent_id);
      return;
    }
    if (k === "in") {
      const Ke = be.value.find((kn) => kn.parent_id === H.id);
      Ke && (O.value = Ke.id);
      return;
    }
    const pe = rr(F), le = pe.findIndex((Ke) => Ke.id === F), Ye = k === "next" ? le + 1 : le - 1;
    Ye >= 0 && Ye < pe.length && (O.value = pe[Ye].id);
  }
  function jt(k) {
    const F = [...be.value].sort((le, Ye) => Ye.updated_at - le.updated_at || le.id.localeCompare(Ye.id));
    if (!F.length) return;
    const H = F.findIndex((le) => le.id === O.value), pe = H < 0 ? 0 : Math.max(0, Math.min(F.length - 1, H + k));
    O.value = F[pe].id;
  }
  function ce(k) {
    const F = k.target;
    if (F && ["INPUT", "TEXTAREA"].includes(F.tagName)) {
      k.key === "Escape" && F.blur();
      return;
    }
    if (k.key === "/") {
      k.preventDefault(), tn("recall");
      return;
    }
    if (k.key === "Escape") {
      xn();
      return;
    }
    if (k.key === "Enter" && O.value) {
      Qt(O.value);
      return;
    }
    if (k.altKey && k.key === "ArrowLeft") {
      k.preventDefault(), jn();
      return;
    }
    if (k.altKey && k.key === "ArrowRight") {
      k.preventDefault(), en();
      return;
    }
    if (k.key === "[") {
      k.preventDefault(), jt(-1);
      return;
    }
    if (k.key === "]") {
      k.preventDefault(), jt(1);
      return;
    }
    if (r.value.lens !== "outline") {
      if (k.key === "ArrowLeft") {
        k.preventDefault(), ut("prev");
        return;
      }
      if (k.key === "ArrowRight") {
        k.preventDefault(), ut("next");
        return;
      }
      if (k.key === "ArrowUp") {
        k.preventDefault(), ut("out");
        return;
      }
      if (k.key === "ArrowDown") {
        k.preventDefault(), ut("in");
        return;
      }
    }
    !k.metaKey && !k.ctrlKey && !k.altKey && Go[k.key] && (k.preventDefault(), tn(Go[k.key]));
  }
  function D(k) {
    n.rememberViewport(k), i.value = { ...i.value, ...k };
  }
  return _e(Y, er), _e(ne, () => {
    Y.value.trim() && nn();
  }), _e(e, () => {
    ge();
  }), _e(O, (k) => {
    k && D({ selectedId: k });
  }), _n(() => {
    we.push(mr(Jt(), () => {
      _t();
    })), we.push(mr(Zt(), () => {
      _t();
    })), se = setInterval(_t, 15e3), ue = setInterval(() => {
      B.value = Math.floor(Date.now() / 1e3);
    }, 3e4), window.addEventListener("keydown", ce);
  }), wn(() => {
    clearTimeout(X), clearTimeout(de), se && clearInterval(se), ue && clearInterval(ue);
    for (const k of we) k();
    window.removeEventListener("keydown", ce), Pe();
  }), {
    navigation: n,
    place: r,
    lens: Je,
    focus: ae,
    graphId: Q,
    focusRecord: it,
    graphs: a,
    graphWindow: s,
    health: f,
    cursors: m,
    spans: p,
    spanCounts: w,
    workControl: b,
    tasks: v,
    taskHasMore: g,
    events: h,
    buckets: E,
    bucketWidthS: T,
    stats: N,
    selectedId: O,
    loading: z,
    error: P,
    query: Y,
    searchMode: ne,
    searchResults: M,
    searchLoading: I,
    timeline: A,
    timelineLoading: te,
    searchInput: ee,
    clock: B,
    activeGraph: We,
    nodes: be,
    edges: Re,
    nodeById: xe,
    selectedNode: De,
    presence: He,
    touchedIds: ze,
    foldedCount: mt,
    activeCount: At,
    maxDepth: Xt,
    outsideWindow: Ve,
    wholeLoad: d,
    recordActivity: Ot,
    assembly: ie,
    assembling: C,
    recomputeMap: nr,
    viewport: i,
    rememberViewport: D,
    healthLabel: Nt,
    loadAll: ge,
    refresh: _t,
    selectGraph: yt,
    selectNode: Zn,
    descend: Qt,
    ascend: xn,
    toCrumb: ct,
    back: jn,
    forward: en,
    changeLens: tn,
    runSearch: nn,
    openSearchResult: tr,
    openTimeline: rn,
    jumpToRecord: Qn,
    labelIndex: S,
    walk: ut,
    stepFact: jt,
    loadWholeGraphNow: Ue,
    cancelWholeGraph: Pe,
    canBack: L(() => (r.value, n.canBack)),
    canForward: L(() => (r.value, n.canForward))
  };
}
const Sv = {
  key: 0,
  class: "jr-boot"
}, Iv = {
  key: 1,
  class: "jr-boot error"
}, Tv = { class: "jr-boot-mark" }, $v = { class: "jr-toolbar" }, Cv = ["title"], Av = { class: "jr-kind-tag" }, Ov = { class: "jr-numeric" }, Nv = {
  key: 0,
  class: "jr-searchbox"
}, Mv = { class: "jr-searchbox-mode" }, Rv = {
  class: "jr-lens-switch",
  "aria-label": "Journal lens"
}, Pv = ["aria-label", "title", "onClick"], Lv = ["disabled"], Dv = {
  key: 2,
  class: "jr-toolbar-spinner",
  "aria-label": "Refreshing"
}, zv = {
  key: 0,
  class: "jr-error",
  role: "status"
}, Vv = ["aria-label"], Uv = { class: "jr-lens-meta" }, Fv = { class: "jr-lens-facts" }, Bv = { class: "jr-numeric" }, Wv = { class: "jr-numeric" }, Hv = { class: "jr-numeric" }, Gv = { class: "jr-numeric" }, Yv = {
  key: 1,
  class: "jr-nav-drawer",
  "aria-label": "Journal navigator"
}, Kv = { class: "jr-drawer-head" }, qv = {
  key: 2,
  class: "jr-orbit-drawer",
  "aria-label": "Record orbit"
}, Xv = /* @__PURE__ */ Ne({
  __name: "JournalApp",
  setup(e) {
    const t = Sc(), n = L(() => t.value?.entryId || ""), r = L(() => (t.value?.mode || "preview") === "preview"), o = L(() => !r.value && !t.value?.readOnly), i = V(!r.value), a = V(!1), s = V(!1), c = V(400), l = V(null), d = V(null);
    let f = null;
    const {
      lens: m,
      focus: p,
      graphId: b,
      graphs: w,
      health: v,
      cursors: h,
      spans: g,
      spanCounts: E,
      workControl: T,
      tasks: S,
      events: N,
      buckets: O,
      bucketWidthS: z,
      stats: P,
      taskHasMore: Y,
      selectedId: ne,
      loading: M,
      error: I,
      query: A,
      searchMode: te,
      searchResults: ie,
      searchLoading: C,
      timeline: ee,
      searchInput: B,
      clock: X,
      activeGraph: ue,
      nodes: se,
      edges: de,
      nodeById: me,
      selectedNode: he,
      presence: we,
      touchedIds: Je,
      foldedCount: ae,
      activeCount: Q,
      maxDepth: it,
      outsideWindow: We,
      wholeLoad: be,
      recordActivity: Re,
      assembly: xe,
      assembling: De,
      recomputeMap: He,
      healthLabel: ze,
      loadAll: mt,
      selectGraph: At,
      selectNode: Ot,
      descend: Ve,
      ascend: Xt,
      toCrumb: Jt,
      back: Zt,
      forward: Nt,
      changeLens: Ge,
      runSearch: vt,
      openSearchResult: bt,
      canBack: Mt,
      canForward: et,
      loadWholeGraphNow: R,
      cancelWholeGraph: $,
      jumpToRecord: W,
      labelIndex: ge,
      viewport: Ue,
      rememberViewport: Pe
    } = Ev(n);
    function yt() {
      o.value && He();
    }
    Tc(mt);
    const Zn = L(() => String(ue.value?.kind || "graph").replace(/[-_]+/g, " ")), Rt = L(() => ({
      loaded: S.value.length,
      total: P.value.tasks || S.value.length,
      hasMore: Y.value || (P.value.tasks || 0) > S.value.length
    })), tt = {
      now: "Now",
      outline: "Outline",
      graph: "Graph",
      lanes: "Lanes",
      recall: "Recall",
      changes: "Changes"
    }, Qt = {
      now: "tabler:bolt",
      outline: "tabler:list-tree",
      graph: "tabler:topology-star-3",
      lanes: "tabler:timeline",
      recall: "tabler:search",
      changes: "tabler:history"
    }, Qn = {
      now: "Now (n)",
      outline: "Outline (o)",
      graph: "Graph (g)",
      lanes: "Lanes (t)",
      recall: "Recall (/)",
      changes: "Changes (c)"
    }, xn = ["now", "outline", "graph", "lanes", "recall", "changes"];
    function ct(ce) {
      Ot(ce), a.value = !0;
    }
    async function jn(ce) {
      await At(ce);
    }
    function en(ce, D) {
      Ot(ce), d.value = {
        id: ce,
        x: D.clientX,
        y: D.clientY
      };
    }
    async function tn() {
      d.value = null, await Tt(), l.value?.focus();
    }
    function nn() {
      d.value && ct(d.value.id), d.value = null;
    }
    async function er() {
      const ce = d.value?.id;
      d.value = null, ce && await Ve(ce);
    }
    async function tr() {
      const ce = d.value?.id;
      d.value = null, ce && await navigator.clipboard.writeText(`${b.value}/${ce}`);
    }
    async function rn(ce) {
      await bt(ce), a.value = !0;
    }
    async function _t(ce) {
      const D = tu(ce, h.value, g.value);
      if (D.kind === "node") {
        if (D.graphId && D.graphId !== b.value && await At(D.graphId), me.value.has(D.nodeId)) {
          ct(D.nodeId);
          return;
        }
        await W(D.nodeId);
        return;
      }
      D.kind === "task" && xt(D.taskId) || Ge("lanes");
    }
    function wt(ce) {
      _t({ agentId: ce, cursorId: ce });
    }
    function xt(ce) {
      const D = se.value.find((k) => k.id === ce || k.id === `task:${ce}`);
      return D ? (Ge("outline"), ct(D.id), !0) : !1;
    }
    function nr(ce) {
      const D = kf(g.value, ce);
      D && (D.taskId && xt(D.taskId) || D.agentId && wt(D.agentId));
    }
    function rr(ce) {
      f = { x: ce.clientX, width: c.value }, window.addEventListener("pointermove", ut), window.addEventListener("pointerup", jt, { once: !0 });
    }
    function ut(ce) {
      f && (c.value = Math.max(320, Math.min(640, f.width + f.x - ce.clientX)));
    }
    function jt() {
      f = null, window.removeEventListener("pointermove", ut), window.removeEventListener("pointerup", jt);
    }
    return wn(jt), _e(m, (ce) => {
      ce !== "now" && (s.value = !1);
    }), (ce, D) => (x(), j("main", {
      ref_key: "rootEl",
      ref: l,
      tabindex: "-1",
      class: oe(["jr-app", { preview: r.value, "nav-open": i.value, "orbit-open": a.value }]),
      style: Ee({ "--jr-orbit-width": `${c.value}px` })
    }, [
      _(M) && !_(se).length && !_(S).length ? (x(), j("div", Sv, [...D[10] || (D[10] = [
        u("span", {
          class: "jr-spinner",
          "aria-hidden": "true"
        }, null, -1),
        u("h2", null, "Opening the journal", -1),
        u("p", null, "Loading your journal entries.", -1)
      ])])) : _(I) && !_(se).length && !_(S).length ? (x(), j("div", Iv, [
        u("span", Tv, [
          G(_(Z), {
            icon: "tabler:alert-triangle",
            "aria-hidden": "true"
          })
        ]),
        D[12] || (D[12] = u("h2", null, "Journal is unavailable", -1)),
        u("p", null, y(_(I)), 1),
        u("button", {
          onClick: D[0] || (D[0] = //@ts-ignore
          (...k) => _(mt) && _(mt)(...k))
        }, [
          G(_(Z), {
            icon: "tabler:refresh",
            "aria-hidden": "true"
          }),
          D[11] || (D[11] = J(" Try again", -1))
        ])
      ])) : (x(), j(K, { key: 2 }, [
        u("header", $v, [
          u("button", {
            class: oe(["jr-nav-toggle", { active: i.value }]),
            "aria-label": "Toggle the journal navigator",
            title: "Graphs and agents",
            onClick: D[1] || (D[1] = (k) => i.value = !i.value)
          }, [
            G(_(Z), {
              icon: i.value ? "tabler:layout-sidebar-left-collapse" : "tabler:layout-sidebar-left-expand",
              "aria-hidden": "true"
            }, null, 8, ["icon"])
          ], 2),
          u("div", {
            class: "jr-identity",
            title: _(ue)?.description || _(ue)?.title
          }, [
            u("h1", null, y(_(ue)?.title || "Journal"), 1),
            u("p", null, [
              u("span", Av, y(Zn.value), 1),
              u("span", {
                class: oe(["jr-health", _(v).status])
              }, y(_(ze)()), 3),
              u("span", Ov, y((_(P).events || 0).toLocaleString()) + " facts", 1)
            ])
          ], 8, Cv),
          _(m) === "recall" ? (x(), j("div", Nv, [
            G(_(Z), {
              icon: "tabler:search",
              "aria-hidden": "true"
            }),
            ys(u("input", {
              ref_key: "searchInput",
              ref: B,
              "onUpdate:modelValue": D[2] || (D[2] = (k) => Xo(A) ? A.value = k : null),
              placeholder: "Recall by text or meaning…",
              "aria-label": "Search this journal graph",
              onKeydown: D[3] || (D[3] = Jo(
                //@ts-ignore
                (...k) => _(vt) && _(vt)(...k),
                ["enter"]
              ))
            }, null, 544), [
              [_s, _(A)]
            ]),
            u("span", Mv, y(_(te)), 1)
          ])) : (x(), rt(Nu, {
            key: 1,
            focus: _(p),
            "can-back": _(Mt),
            "can-forward": _(et),
            onCrumb: _(Jt),
            onBack: _(Zt),
            onForward: _(Nt),
            onUp: _(Xt)
          }, null, 8, ["focus", "can-back", "can-forward", "onCrumb", "onBack", "onForward", "onUp"])),
          u("nav", Rv, [
            (x(), j(K, null, re(xn, (k) => u("button", {
              key: k,
              class: oe({ active: _(m) === k }),
              "aria-label": `${tt[k]} lens`,
              title: Qn[k],
              onClick: (F) => _(Ge)(k)
            }, [
              G(_(Z), {
                icon: Qt[k],
                "aria-hidden": "true"
              }, null, 8, ["icon"]),
              u("span", null, y(tt[k]), 1)
            ], 10, Pv)), 64))
          ]),
          u("button", {
            class: oe(["jr-detail-toggle", { active: a.value }]),
            disabled: !_(he),
            "aria-label": "Toggle the record orbit",
            title: "Record orbit",
            onClick: D[4] || (D[4] = (k) => a.value = !a.value)
          }, [
            G(_(Z), {
              icon: "tabler:layout-sidebar-right-expand",
              "aria-hidden": "true"
            })
          ], 10, Lv),
          _(M) ? (x(), j("span", Dv, [...D[13] || (D[13] = [
            u("span", { class: "jr-spinner" }, null, -1)
          ])])) : q("", !0)
        ]),
        _(I) ? (x(), j("div", zv, [
          G(_(Z), {
            icon: "tabler:alert-triangle",
            "aria-hidden": "true"
          }),
          J(y(_(I)) + " ", 1),
          u("button", {
            "aria-label": "Dismiss",
            title: "Dismiss",
            onClick: D[5] || (D[5] = (k) => I.value = "")
          }, [
            G(_(Z), {
              icon: "tabler:x",
              "aria-hidden": "true"
            })
          ])
        ])) : q("", !0),
        u("section", {
          class: oe(["jr-view", { "is-graph": _(m) === "graph" }]),
          "aria-label": `${tt[_(m)]} lens`
        }, [
          s.value ? (x(), rt(Gm, {
            key: 0,
            tasks: _(S),
            now: _(X),
            "task-bound": Rt.value,
            onTask: xt,
            onClose: D[6] || (D[6] = (k) => s.value = !1)
          }, null, 8, ["tasks", "now", "task-bound"])) : _(m) === "now" ? (x(), rt(Rh, {
            key: 1,
            spans: _(g),
            "work-control": _(T),
            tasks: _(S),
            events: _(N),
            now: _(X),
            "span-counts": _(E),
            "task-bound": Rt.value,
            onTask: xt,
            onAgent: wt,
            onStale: D[7] || (D[7] = (k) => s.value = !0)
          }, null, 8, ["spans", "work-control", "tasks", "events", "now", "span-counts", "task-bound"])) : _(m) === "outline" ? (x(), j(K, { key: 2 }, [
            u("div", Uv, [
              D[21] || (D[21] = u("span", { class: "jr-lens-title" }, "Outline", -1)),
              u("span", Fv, [
                u("b", Bv, y(_(Q)), 1),
                D[14] || (D[14] = J(" open ", -1)),
                D[15] || (D[15] = u("i", { "aria-hidden": "true" }, null, -1)),
                u("b", Wv, y(_(ae)), 1),
                D[16] || (D[16] = J(" folded ", -1)),
                D[17] || (D[17] = u("i", { "aria-hidden": "true" }, null, -1)),
                u("b", Hv, y(_(it)), 1),
                D[18] || (D[18] = J(" levels ", -1)),
                D[19] || (D[19] = u("i", { "aria-hidden": "true" }, null, -1)),
                u("b", Gv, y(_(se).length.toLocaleString()), 1),
                D[20] || (D[20] = J(" records ", -1))
              ])
            ]),
            G(im, {
              nodes: _(se),
              edges: _(de),
              presence: _(we),
              "touched-ids": _(Je),
              "selected-id": _(ne),
              viewport: _(Ue),
              onSelect: ct,
              onFocus: _(Ve),
              onMenu: en,
              onViewport: _(Pe)
            }, null, 8, ["nodes", "edges", "presence", "touched-ids", "selected-id", "viewport", "onFocus", "onViewport"])
          ], 64)) : _(m) === "graph" ? (x(), rt(hf, {
            key: 3,
            nodes: _(se),
            edges: _(de),
            presence: _(we),
            "touched-ids": _(Je),
            "selected-id": _(ne),
            loading: _(M),
            "omitted-nodes": _(We).nodes,
            "omitted-edges": _(We).edges,
            "read-only": !o.value,
            assembly: _(xe),
            assembling: _(De),
            whole: _(be),
            labels: _(ge),
            activity: _(Re),
            now: _(X),
            viewport: _(Ue),
            onSelect: ct,
            onFocus: _(Ve),
            onPort: _(W),
            onMenu: en,
            onRecompute: yt,
            onLoadAll: _(R),
            onCancelLoad: _($),
            onViewport: _(Pe)
          }, null, 8, ["nodes", "edges", "presence", "touched-ids", "selected-id", "loading", "omitted-nodes", "omitted-edges", "read-only", "assembly", "assembling", "whole", "labels", "activity", "now", "viewport", "onFocus", "onPort", "onLoadAll", "onCancelLoad", "onViewport"])) : _(m) === "lanes" ? (x(), rt(Bf, {
            key: 4,
            spans: _(g),
            buckets: _(O),
            "bucket-width-s": _(z),
            now: _(X),
            onAgent: wt,
            onSpan: nr
          }, null, 8, ["spans", "buckets", "bucket-width-s", "now"])) : _(m) === "recall" ? (x(), rt(wm, {
            key: 5,
            results: _(ie),
            query: _(A),
            mode: _(te),
            loading: _(C),
            onSelect: rn
          }, null, 8, ["results", "query", "mode", "loading"])) : (x(), rt(av, {
            key: 6,
            items: _(ee),
            nodes: _(se),
            onSelect: rn
          }, null, 8, ["items", "nodes"]))
        ], 10, Vv),
        i.value ? (x(), j("aside", Yv, [
          u("header", Kv, [
            u("div", null, [
              D[22] || (D[22] = u("b", null, "Journal", -1)),
              u("span", null, y(_(w).length) + " graph" + y(_(w).length === 1 ? "" : "s") + " · " + y((_(P).tasks || 0).toLocaleString()) + " task" + y(_(P).tasks === 1 ? "" : "s"), 1)
            ]),
            u("button", {
              "aria-label": "Close the navigator",
              title: "Close",
              onClick: D[8] || (D[8] = (k) => i.value = !1)
            }, [
              G(_(Z), {
                icon: "tabler:x",
                "aria-hidden": "true"
              })
            ])
          ]),
          G(Hu, {
            graphs: _(w),
            "graph-id": _(b),
            now: _(X),
            onGraph: jn
          }, null, 8, ["graphs", "graph-id", "now"]),
          G(Eu, {
            cursors: _(h),
            spans: _(g),
            now: _(X),
            onAgent: _t
          }, null, 8, ["cursors", "spans", "now"])
        ])) : q("", !0),
        a.value ? (x(), j("aside", qv, [
          u("button", {
            class: "jr-resize-handle",
            "aria-label": "Resize the orbit panel",
            title: "Drag to resize",
            onPointerdown: Xe(rr, ["prevent"])
          }, null, 32),
          G(Dg, {
            node: _(he),
            nodes: _(se),
            edges: _(de),
            presence: _(we),
            spans: _(g),
            events: _(N),
            "graph-id": _(b),
            now: _(X),
            onSelect: ct,
            onFocus: _(Ve),
            onClose: D[9] || (D[9] = (k) => a.value = !1)
          }, null, 8, ["node", "nodes", "edges", "presence", "spans", "events", "graph-id", "now", "onFocus"])
        ])) : q("", !0),
        d.value ? (x(), rt(gf, {
          key: 3,
          x: d.value.x,
          y: d.value.y,
          onClose: tn,
          onDetails: nn,
          onFocus: er,
          onCopy: tr
        }, null, 8, ["x", "y"])) : q("", !0)
      ], 64))
    ], 6));
  }
}), Jv = ':host{display:block;min-width:0;min-height:320px;height:100%;container-type:inline-size;container-name:journal;--jr-bg: var(--p-content-background);--jr-fg: var(--p-text-color);--jr-border: var(--p-content-border-color);--jr-muted: var(--p-text-muted-color, var(--p-text-secondary-color));--jr-panel: color-mix(in srgb, var(--jr-fg) 3%, var(--jr-bg));--jr-raised: color-mix(in srgb, var(--jr-fg) 6%, var(--jr-bg));--jr-sunken: color-mix(in srgb, var(--jr-fg) 4.5%, var(--jr-bg));--jr-hover: color-mix(in srgb, var(--jr-fg) 5%, transparent);--jr-border-soft: color-mix(in srgb, var(--jr-border) 58%, transparent);--jr-faint: color-mix(in srgb, var(--jr-muted) 74%, var(--jr-bg));--jr-accent: var(--p-primary-color);--jr-accent-strong: color-mix(in srgb, var(--jr-accent) 78%, var(--jr-fg));--jr-accent-soft: color-mix(in srgb, var(--jr-accent) 12%, transparent);--jr-rule: color-mix(in srgb, var(--jr-accent) 58%, var(--jr-fg));--jr-decision: color-mix(in srgb, var(--jr-accent) 78%, var(--jr-bg));--jr-evidence: color-mix(in srgb, var(--jr-accent) 40%, var(--jr-fg));--jr-danger: var(--p-danger-color, var(--p-danger-500));--jr-success: var(--p-success-color, var(--p-success-500));--jr-warn: var(--p-warn-color, var(--p-warn-500));--jr-info: var(--p-info-color, var(--p-info-500));--jr-shadow-sm: 0 1px 2px color-mix(in srgb, var(--jr-fg) 8%, transparent);--jr-shadow: 0 6px 22px -6px color-mix(in srgb, var(--jr-fg) 26%, transparent);--jr-r-sm: 6px;--jr-r: 8px;--jr-r-lg: 14px;color:var(--jr-fg);font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,sans-serif;font-size:13px;font-feature-settings:"cv05","ss01"}:host>div{width:100%;height:100%;min-height:0}*{box-sizing:border-box}button,input{font:inherit}button{border:0;background:none;color:inherit}button:focus-visible,input:focus-visible,[role=treeitem]:focus-visible,[role=button]:focus-visible{outline:var(--p-focus-ring-width) var(--p-focus-ring-style) var(--p-focus-ring-color);outline-offset:var(--p-focus-ring-offset);border-radius:var(--jr-r-sm)}.jr-numeric{font-variant-numeric:tabular-nums;font-feature-settings:"tnum"}.jr-eyebrow{color:var(--jr-muted);font-size:9px;font-style:normal;font-weight:800;letter-spacing:.09em;text-transform:uppercase}.family-anchor{--node-color: var(--jr-accent)}.family-rule{--node-color: var(--jr-rule)}.family-decision{--node-color: var(--jr-decision)}.family-evidence{--node-color: var(--jr-evidence)}.family-risk{--node-color: var(--jr-danger)}.family-open{--node-color: var(--jr-warn)}.family-agent{--node-color: var(--jr-accent-strong)}.family-note{--node-color: var(--jr-muted)}.jr-kind-mark{width:18px;height:18px;flex:0 0 auto;color:var(--node-color, var(--jr-accent))}.jr-kind-mark.large{width:26px;height:26px}.jr-kind-mark path{fill:currentColor}.jr-kind-mark path.hollow{fill:none;stroke:currentColor;stroke-width:3.2}.jr-app{position:relative;width:100%;height:100%;min-height:0;display:grid;grid-template-rows:52px minmax(0,1fr);overflow:hidden;background:var(--jr-bg);color:var(--jr-fg)}.jr-boot{position:absolute;inset:0;display:grid;place-content:center;justify-items:center;gap:6px;padding:32px;background:var(--jr-bg);text-align:center}.jr-boot h2{margin:10px 0 0;font-size:16px;font-weight:640;letter-spacing:-.01em}.jr-boot p{max-width:320px;margin:0;color:var(--jr-muted);font-size:11.5px;line-height:1.55}.jr-boot-mark{display:grid;place-items:center;width:42px;height:42px;border:1px solid color-mix(in srgb,var(--jr-danger) 32%,var(--jr-border));border-radius:50%;background:color-mix(in srgb,var(--jr-danger) 8%,transparent);color:var(--jr-danger)}.jr-boot-mark svg{width:20px;height:20px}.jr-boot button{display:inline-flex;align-items:center;gap:6px;margin-top:10px;padding:7px 13px;border:1px solid var(--jr-border);border-radius:var(--jr-r-sm);background:var(--jr-panel);cursor:pointer;font-size:11.5px;font-weight:600}.jr-boot button:hover{border-color:var(--jr-accent);color:var(--jr-accent)}.jr-boot button svg{width:14px;height:14px}.jr-spinner{width:22px;height:22px;border-radius:50%;border:2px solid var(--jr-border);border-top-color:var(--jr-accent);animation:jr-spin .8s linear infinite}@keyframes jr-spin{to{transform:rotate(360deg)}}@keyframes jr-pulse{50%{opacity:.3}}.jr-toolbar{grid-row:1;min-width:0;display:flex;align-items:center;gap:8px;padding:0 10px;border-bottom:1px solid var(--jr-border);background:var(--jr-panel);z-index:5}.jr-nav-toggle,.jr-detail-toggle{width:30px;height:30px;flex:0 0 auto;display:grid;place-items:center;border:0;border-radius:var(--jr-r-sm);background:transparent;color:var(--jr-muted);cursor:pointer}.jr-nav-toggle:hover,.jr-detail-toggle:hover:not(:disabled){background:var(--jr-hover);color:var(--jr-fg)}.jr-nav-toggle.active,.jr-detail-toggle.active{background:var(--jr-accent-soft);color:var(--jr-accent)}.jr-detail-toggle:disabled{opacity:.3;cursor:default}.jr-nav-toggle svg,.jr-detail-toggle svg{width:17px;height:17px}.jr-identity{min-width:0;max-width:260px;flex:0 1 auto;display:grid;gap:1px;padding-right:10px;border-right:1px solid var(--jr-border-soft)}.jr-identity h1{margin:0;overflow:hidden;color:var(--jr-fg);font-size:13.5px;font-weight:650;letter-spacing:-.012em;text-overflow:ellipsis;white-space:nowrap}.jr-identity p{display:flex;align-items:center;gap:6px;margin:0;color:var(--jr-muted);font-size:9.5px}.jr-kind-tag{padding:1px 5px;border-radius:4px;background:var(--jr-raised);color:var(--jr-muted);font-weight:750;letter-spacing:.05em;text-transform:uppercase}.jr-health{display:inline-flex;align-items:center;gap:4px}.jr-health:before{content:"";width:5px;height:5px;border-radius:50%;background:var(--jr-muted)}.jr-health.ok:before{background:var(--jr-success)}.jr-health.degraded:before{background:var(--jr-danger)}.jr-context{min-width:0;height:30px;flex:1 1 200px;display:flex;align-items:center;gap:2px;overflow-x:auto;overscroll-behavior-inline:contain;scrollbar-width:none;white-space:nowrap}.jr-context::-webkit-scrollbar{display:none}.jr-context-sep{flex:0 0 auto;color:var(--jr-faint);font-size:11px}.jr-context>button{max-width:170px;flex:0 0 auto;overflow:hidden;padding:3px 6px;border:0;border-radius:5px;background:transparent;color:var(--jr-muted);cursor:pointer;font-size:11px;font-weight:550;text-align:left;text-overflow:ellipsis;white-space:nowrap}.jr-context>button:hover{background:var(--jr-hover);color:var(--jr-fg)}.jr-context>button.current{color:var(--jr-fg);font-weight:680}.jr-step-out{margin-left:4px;display:grid;place-items:center;width:24px;height:24px;color:var(--jr-muted)}.jr-step-out svg{width:14px;height:14px}.jr-searchbox{min-width:120px;height:32px;flex:1 1 300px;display:flex;align-items:center;gap:8px;padding:0 10px;border:1px solid var(--jr-border);border-radius:var(--jr-r-lg);background:var(--jr-bg)}.jr-searchbox:focus-within{border-color:var(--jr-accent);box-shadow:0 0 0 3px var(--jr-accent-soft)}.jr-searchbox svg{width:15px;height:15px;flex:0 0 auto;color:var(--jr-muted)}.jr-searchbox input{min-width:0;width:100%;border:0;outline:0;color:var(--jr-fg);background:transparent;font-size:12px}.jr-searchbox input::placeholder{color:var(--jr-faint)}.jr-searchbox-mode{flex:0 0 auto;padding:2px 7px;border-radius:999px;background:var(--jr-raised);color:var(--jr-muted);font-size:9px;font-weight:750;letter-spacing:.05em;text-transform:uppercase}.jr-lens-switch{flex:0 0 auto;display:flex;align-items:center;gap:1px;padding:2px;border:1px solid var(--jr-border-soft);border-radius:var(--jr-r);background:var(--jr-bg)}.jr-lens-switch button{height:26px;display:flex;align-items:center;gap:5px;padding:0 9px;border:0;border-radius:var(--jr-r-sm);background:transparent;color:var(--jr-muted);cursor:pointer;font-size:11px;font-weight:600}.jr-lens-switch button:hover{background:var(--jr-hover);color:var(--jr-fg)}.jr-lens-switch button.active{background:var(--jr-accent-soft);color:var(--jr-accent)}.jr-lens-switch svg{width:14px;height:14px}.jr-toolbar-gap{flex:1 1 auto}.jr-toolbar-spinner{width:16px;flex:0 0 auto;display:grid;place-items:center}.jr-toolbar-spinner .jr-spinner{width:13px;height:13px;border-width:1.6px}.jr-error{position:absolute;z-index:6;top:52px;left:0;right:0;display:flex;align-items:center;gap:8px;padding:7px 12px;border-bottom:1px solid color-mix(in srgb,var(--jr-danger) 28%,var(--jr-border));background:color-mix(in srgb,var(--jr-danger) 8%,var(--jr-bg));color:var(--jr-fg);font-size:11.5px}.jr-error>svg{width:15px;height:15px;flex:0 0 auto;color:var(--jr-danger)}.jr-error button{width:22px;height:22px;margin-left:auto;display:grid;place-items:center;border:0;border-radius:4px;background:transparent;cursor:pointer}.jr-error button:hover{background:color-mix(in srgb,var(--jr-danger) 14%,transparent)}.jr-view{grid-row:2;min-width:0;min-height:0;position:relative;overflow:auto;overscroll-behavior:contain;scrollbar-gutter:stable;background:var(--jr-bg)}.jr-view.is-graph{overflow:hidden;scrollbar-gutter:auto}.jr-app.nav-open .jr-view{margin-left:258px}.jr-app.orbit-open .jr-view{margin-right:var(--jr-orbit-width)}.jr-nav-drawer,.jr-orbit-drawer{position:absolute;z-index:4;top:52px;bottom:0;overflow:auto;overscroll-behavior:contain;background:var(--jr-panel)}.jr-nav-drawer{left:0;width:258px;border-right:1px solid var(--jr-border)}.jr-orbit-drawer{right:0;width:var(--jr-orbit-width);border-left:1px solid var(--jr-border)}.jr-resize-handle{position:absolute;z-index:5;top:0;bottom:0;left:-3px;width:7px;padding:0;border:0;background:transparent;cursor:col-resize}.jr-resize-handle:hover,.jr-resize-handle:focus-visible{background:color-mix(in srgb,var(--jr-accent) 30%,transparent)}.jr-drawer-head,.jr-panel-head{position:sticky;top:0;z-index:2;display:flex;align-items:center;justify-content:space-between;gap:8px;height:42px;padding:0 8px 0 14px;border-bottom:1px solid var(--jr-border-soft);background:var(--jr-panel)}.jr-drawer-head>div{min-width:0;display:grid;gap:1px}.jr-drawer-head b{font-size:12px;font-weight:660;letter-spacing:-.01em}.jr-drawer-head span{color:var(--jr-muted);font-size:9.5px}.jr-panel-head{color:var(--jr-muted);font-size:9px;font-weight:800;letter-spacing:.09em;text-transform:uppercase}.jr-drawer-head button,.jr-panel-head button{width:26px;height:26px;flex:0 0 auto;display:grid;place-items:center;border:0;border-radius:var(--jr-r-sm);background:transparent;color:var(--jr-muted);cursor:pointer}.jr-drawer-head button:hover,.jr-panel-head button:hover{background:var(--jr-hover);color:var(--jr-fg)}.jr-drawer-head svg,.jr-panel-head svg{width:15px;height:15px}.jr-lens-meta{position:sticky;z-index:2;top:0;min-height:34px;display:flex;align-items:center;gap:14px;padding:0 16px;border-bottom:1px solid var(--jr-border-soft);background:var(--jr-bg);color:var(--jr-muted);font-size:10.5px}.jr-lens-title{color:var(--jr-fg);font-size:9px;font-weight:800;letter-spacing:.11em;text-transform:uppercase}.jr-lens-facts{display:flex;align-items:center;gap:5px}.jr-lens-facts b{color:var(--jr-fg);font-weight:650}.jr-lens-facts i,.jr-canvas-stat i{width:3px;height:3px;border-radius:50%;background:var(--jr-faint)}.jr-lens-advice{display:inline-flex;align-items:center;gap:5px;margin-left:auto;padding:3px 10px;border:1px solid color-mix(in srgb,var(--jr-accent) 30%,transparent);border-radius:999px;background:var(--jr-accent-soft);color:var(--jr-accent);cursor:pointer;white-space:nowrap}.jr-lens-advice:hover{background:color-mix(in srgb,var(--jr-accent) 20%,transparent)}.jr-lens-advice svg{width:13px;height:13px}.jr-empty-small{margin:0;padding:14px 16px;color:var(--jr-muted);font-size:11px;line-height:1.5}.jr-empty-state{min-height:280px;display:grid;place-content:center;justify-items:center;padding:32px;color:var(--jr-muted);text-align:center}.jr-empty-state>svg{width:30px;height:30px;color:var(--jr-border)}.jr-empty-state h3{margin:12px 0 4px;color:var(--jr-fg);font-size:13.5px;font-weight:640}.jr-empty-state p{max-width:330px;margin:0;font-size:11.5px;line-height:1.6}.jr-tree,.jr-result-list,.jr-timeline{max-width:1240px;margin-inline:auto}.jr-tree{padding:6px 12px 28px}.jr-tree-row{--indent: calc(var(--depth) * 20px);position:relative;min-height:40px;display:grid;grid-template-columns:18px 20px minmax(0,1fr) auto 24px;align-items:center;gap:8px;margin:1px 0;padding:5px 6px 5px calc(6px + var(--indent));border:1px solid transparent;border-radius:var(--jr-r);cursor:pointer}.jr-tree-row:hover{background:var(--jr-hover)}.jr-tree-row.selected{border-color:color-mix(in srgb,var(--node-color) 34%,var(--jr-border));background:color-mix(in srgb,var(--node-color) 8%,transparent);box-shadow:inset 3px 0 0 var(--node-color)}.jr-tree-row.folded .jr-tree-title{text-decoration:line-through;text-decoration-color:color-mix(in srgb,var(--jr-muted) 55%,transparent)}.jr-tree-row.settled:not(.selected){opacity:.55}.jr-tree-row.settled:hover{opacity:.85}.jr-tree-row.branch .jr-tree-title{font-weight:680}.jr-tree-guides{position:absolute;left:15px;top:-1px;bottom:-1px;width:var(--indent);background:repeating-linear-gradient(to right,transparent 0 19px,var(--jr-border-soft) 19px 20px);pointer-events:none}.jr-disclosure{z-index:1;width:18px;height:18px;display:grid;place-items:center;border:0;border-radius:4px;background:transparent;color:var(--jr-muted);cursor:pointer}.jr-disclosure:hover{color:var(--jr-accent);background:var(--jr-accent-soft)}.jr-disclosure svg{width:13px;height:13px}.jr-disclosure-spacer{width:18px}.jr-tree-copy{min-width:0;display:grid;gap:2px}.jr-tree-title,.jr-tree-summary{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.jr-tree-title{font-size:12px;font-weight:580;letter-spacing:-.005em}.jr-tree-summary{color:var(--jr-muted);font-size:10.5px}.jr-tree-meta{display:flex;align-items:center;justify-content:flex-end;gap:10px}.jr-tree-kind{min-width:66px;color:var(--jr-faint);font-size:9px;font-weight:750;letter-spacing:.07em;text-align:right;text-transform:uppercase}.jr-tree-presence{display:flex}.jr-tree-presence i{width:19px;height:19px;margin-left:-6px;display:grid;place-items:center;border:1.5px solid var(--jr-bg);border-radius:50%;background:var(--jr-accent-soft);color:var(--jr-accent-strong);font-size:7.5px;font-style:normal;font-weight:800}.jr-tree-row.occupied{background:color-mix(in srgb,var(--jr-accent) 3.5%,transparent)}.jr-tree-row.touched:not(.selected){box-shadow:inset 2px 0 color-mix(in srgb,var(--jr-accent) 52%,transparent)}.jr-tree-links{min-width:34px;display:inline-flex;align-items:center;gap:3px;color:var(--jr-faint);font-size:10px}.jr-tree-links svg{width:11px;height:11px}.jr-state-chip{padding:2px 7px;border:1px solid var(--jr-border);border-radius:999px;background:var(--jr-bg);color:var(--jr-muted);font-size:8.5px;font-weight:780;letter-spacing:.05em;text-transform:uppercase;white-space:nowrap}.jr-state-chip.state-failed,.jr-state-chip.state-blocked,.jr-state-chip.state-rejected,.jr-state-chip.state-superseded{border-color:color-mix(in srgb,var(--jr-danger) 34%,var(--jr-border));background:color-mix(in srgb,var(--jr-danger) 9%,transparent);color:var(--jr-danger)}.jr-state-chip.state-active,.jr-state-chip.state-adopted,.jr-state-chip.state-proven,.jr-state-chip.state-done,.jr-state-chip.state-completed{border-color:color-mix(in srgb,var(--jr-success) 34%,var(--jr-border));background:color-mix(in srgb,var(--jr-success) 9%,transparent);color:var(--jr-success)}.jr-state-chip.state-waiting,.jr-state-chip.state-open,.jr-state-chip.state-pending{border-color:color-mix(in srgb,var(--jr-warn) 34%,var(--jr-border));background:color-mix(in srgb,var(--jr-warn) 9%,transparent);color:var(--jr-warn)}.jr-open-root{opacity:0;width:24px;height:24px;display:grid;place-items:center;border:0;border-radius:5px;background:transparent;color:var(--jr-muted);cursor:pointer}.jr-open-root svg{width:13px;height:13px}.jr-open-root:hover{color:var(--jr-accent);background:var(--jr-accent-soft)}.jr-tree-row:hover .jr-open-root,.jr-tree-row.selected .jr-open-root,.jr-open-root:focus-visible{opacity:1}.jr-graph{position:absolute;inset:0;overflow:hidden;background:radial-gradient(120% 90% at 50% 8%,color-mix(in srgb,var(--jr-accent) 4%,transparent),transparent 62%),var(--jr-bg)}.jr-graph-canvas{position:absolute;inset:0;width:100%;height:100%;cursor:grab;touch-action:none}.jr-graph-canvas.grabbing{cursor:grabbing}.jr-ink-probe-host{position:absolute;width:0;height:0;overflow:hidden}.jr-ink-probe i{display:block;width:1px;height:1px}.jr-canvas-head{position:absolute;z-index:3;top:12px;left:14px;display:grid;gap:4px;pointer-events:none}.jr-canvas-stat{display:flex;align-items:center;gap:6px;color:var(--jr-muted);font-size:10.5px}.jr-canvas-stat b{color:var(--jr-fg);font-variant-numeric:tabular-nums;font-size:12.5px;font-weight:660}.jr-canvas-stat i{width:3px;height:3px;border-radius:50%;background:var(--jr-faint)}.jr-canvas-drawn{margin:0;color:var(--jr-faint);font-size:9.5px}.jr-bound-dock{position:absolute;z-index:4;top:12px;left:50%;transform:translate(-50%);display:flex;align-items:center;gap:10px;max-width:min(560px,calc(100% - 220px));padding:6px 6px 6px 12px;border:1px solid var(--jr-border-soft);border-radius:999px;background:color-mix(in srgb,var(--jr-panel) 92%,transparent);backdrop-filter:blur(10px);box-shadow:var(--jr-shadow-sm)}.jr-bound-line{display:flex;align-items:baseline;gap:5px;margin:0;color:var(--jr-muted);font-size:10.5px;white-space:nowrap}.jr-bound-line b{color:var(--jr-fg);font-weight:660}.jr-bound-line.error{color:var(--jr-danger);white-space:normal}.jr-bound-label{color:var(--jr-fg);font-weight:640}.jr-bound-bar{flex:1 1 90px;min-width:60px;height:4px;overflow:hidden;border-radius:3px;background:var(--jr-border-soft)}.jr-bound-bar i{display:block;height:100%;background:var(--jr-accent);transition:width .18s ease}.jr-bound-load,.jr-bound-stop{display:inline-flex;align-items:center;gap:5px;flex:0 0 auto;padding:5px 11px;border:0;border-radius:999px;background:var(--jr-accent);color:var(--p-primary-contrast-color, var(--jr-bg));cursor:pointer;font-size:10.5px;font-weight:640}.jr-bound-stop{background:var(--jr-raised);color:var(--jr-fg)}.jr-bound-load:hover{background:var(--jr-accent-strong)}.jr-bound-stop:hover{background:color-mix(in srgb,var(--jr-danger) 16%,var(--jr-raised));color:var(--jr-danger)}.jr-bound-load svg,.jr-bound-stop svg{width:13px;height:13px}.jr-legend{position:absolute;z-index:3;bottom:58px;left:14px;display:flex;flex-wrap:wrap;gap:2px;max-width:46%;padding:4px;border:1px solid var(--jr-border-soft);border-radius:var(--jr-r-lg);background:color-mix(in srgb,var(--jr-panel) 88%,transparent);backdrop-filter:blur(10px)}.jr-legend-item{display:inline-flex;align-items:center;gap:5px;padding:3px 8px 3px 4px;border:0;border-radius:999px;background:transparent;color:var(--jr-muted);cursor:pointer;font-size:10px;font-weight:600}.jr-legend-item:hover{background:var(--jr-hover);color:var(--jr-fg)}.jr-legend-item.on{background:color-mix(in srgb,var(--node-color) 15%,transparent);color:var(--node-color)}.jr-legend-mark{width:15px;height:15px;color:var(--node-color)}.jr-legend-mark path{fill:currentColor}.jr-legend-mark path.hollow{fill:none;stroke:currentColor;stroke-width:3.2}.jr-legend-item em{color:var(--jr-faint);font-style:normal;font-size:9.5px}.jr-legend-item.on em{color:inherit}.jr-canvas-tools{position:absolute;z-index:3;top:12px;right:14px;display:flex;align-items:center;gap:2px;padding:3px;border:1px solid var(--jr-border-soft);border-radius:var(--jr-r-lg);background:color-mix(in srgb,var(--jr-panel) 88%,transparent);backdrop-filter:blur(10px);box-shadow:var(--jr-shadow-sm)}.jr-tool{width:26px;height:26px;display:grid;place-items:center;border:0;border-radius:var(--jr-r-sm);background:transparent;color:var(--jr-muted);cursor:pointer}.jr-tool:hover:not(:disabled){color:var(--jr-accent);background:var(--jr-accent-soft)}.jr-tool.on{color:var(--jr-accent);background:var(--jr-accent-soft)}.jr-tool:disabled{opacity:.35;cursor:default}.jr-tool svg{width:14px;height:14px}.jr-tool-divider{width:1px;height:16px;margin:0 3px;background:var(--jr-border-soft)}.jr-zoom-value{min-width:40px;color:var(--jr-muted);font-size:10px;text-align:center}.jr-hovercard{position:absolute;z-index:4;right:14px;bottom:58px;display:grid;gap:7px;width:290px;margin:0;padding:11px 13px;border:1px solid var(--jr-border-soft);border-left:3px solid var(--node-color);border-radius:var(--jr-r);background:color-mix(in srgb,var(--jr-panel) 94%,transparent);backdrop-filter:blur(10px);box-shadow:var(--jr-shadow);pointer-events:none}.jr-hovercard figcaption{display:grid;gap:3px}.jr-hovercard-kind{color:var(--node-color);font-size:9px;font-weight:800;letter-spacing:.09em;text-transform:uppercase}.jr-hovercard b{font-size:12.5px;font-weight:660;letter-spacing:-.01em;line-height:1.3}.jr-hovercard p{display:-webkit-box;overflow:hidden;margin:0;color:var(--jr-muted);font-size:11px;line-height:1.55;-webkit-box-orient:vertical;-webkit-line-clamp:3}.jr-hovercard dl{display:flex;flex-wrap:wrap;gap:4px 14px;margin:0}.jr-hovercard dl>div{display:grid;gap:1px}.jr-hovercard dt{color:var(--jr-faint);font-size:8.5px;font-weight:780;letter-spacing:.07em;text-transform:uppercase}.jr-hovercard dd{margin:0;font-variant-numeric:tabular-nums;font-size:11px;font-weight:600}.jr-assemble-dock{position:absolute;z-index:3;bottom:12px;left:50%;transform:translate(-50%);display:flex;align-items:center;gap:10px;max-width:calc(100% - 28px);padding:5px 5px 5px 12px;border:1px solid var(--jr-border-soft);border-radius:999px;background:color-mix(in srgb,var(--jr-panel) 90%,transparent);backdrop-filter:blur(10px);box-shadow:var(--jr-shadow-sm)}.jr-assemble-line{display:flex;align-items:center;gap:7px;min-width:0;margin:0;overflow:hidden;color:var(--jr-muted);font-size:10.5px;text-overflow:ellipsis;white-space:nowrap}.jr-assemble-state{width:6px;height:6px;flex:0 0 auto;border-radius:50%;background:var(--jr-faint)}.jr-assemble-state.busy{background:var(--jr-accent);animation:jr-pulse 1.4s ease-in-out infinite}.jr-assemble-run{display:inline-flex;align-items:center;gap:6px;flex:0 0 auto;padding:6px 12px;border:0;border-radius:999px;background:var(--jr-raised);color:var(--jr-fg);cursor:pointer;font-size:10.5px;font-weight:640}.jr-assemble-run:hover:not(:disabled){background:var(--jr-accent);color:var(--p-primary-contrast-color, var(--jr-bg))}.jr-assemble-run:disabled{color:var(--jr-faint);background:var(--jr-hover);cursor:default}.jr-assemble-run svg{width:13px;height:13px}.jr-assemble-run .jr-spinner{width:12px;height:12px}.jr-canvas-state{position:absolute;inset:0;z-index:2;display:grid;place-content:center;justify-items:center;padding:24px;color:var(--jr-muted);text-align:center}.jr-canvas-state h3{margin:14px 0 4px;color:var(--jr-fg);font-size:13.5px;font-weight:640}.jr-canvas-state p{max-width:320px;margin:0;font-size:11.5px;line-height:1.6}.jr-canvas-state-mark{width:68px;height:68px;opacity:.3}.jr-canvas-state-mark path:nth-child(1){fill:var(--jr-accent)}.jr-canvas-state-mark path:nth-child(2){fill:var(--jr-info)}.jr-canvas-state-mark path:nth-child(3){fill:var(--jr-success)}.jr-search-lens,.jr-timeline-lens,.jr-orbit,.jr-now,.jr-lanes,.jr-stale{min-height:100%}.jr-result-list,.jr-timeline,.jr-time-list{margin:0;padding:0;list-style:none}.jr-result-list{padding:10px 16px 24px;display:grid;gap:7px}.jr-result{width:100%;display:grid;grid-template-columns:20px 22px minmax(0,1fr) auto;align-items:start;gap:11px;padding:12px 14px;border:1px solid var(--jr-border-soft);border-left:3px solid color-mix(in srgb,var(--node-color) 55%,transparent);border-radius:var(--jr-r);background:var(--jr-panel);cursor:pointer;text-align:left}.jr-result:hover{border-color:color-mix(in srgb,var(--jr-accent) 40%,var(--jr-border));background:var(--jr-raised)}.jr-result-rank{padding-top:2px;color:var(--jr-faint);font-size:10px}.jr-result-copy{min-width:0;display:grid;gap:4px}.jr-result-copy b{font-size:12.5px;font-weight:640;letter-spacing:-.01em}.jr-result-copy>span:not(.jr-eyebrow){display:-webkit-box;overflow:hidden;color:var(--jr-muted);font-size:11px;line-height:1.5;-webkit-box-orient:vertical;-webkit-line-clamp:2}.jr-result-copy small{color:var(--jr-faint);font-size:9.5px}.jr-score{display:grid;gap:4px;justify-items:end;text-align:right}.jr-score b{font-size:11px;font-weight:680}.jr-score i{width:58px;height:3px;overflow:hidden;border-radius:3px;background:var(--jr-border-soft)}.jr-score i span{display:block;height:100%;background:var(--node-color)}.jr-score small{color:var(--jr-faint);font-size:8.5px}.jr-loading-lines{display:grid;gap:7px;padding:14px 16px}.jr-loading-lines i{height:74px;border-radius:var(--jr-r);background:linear-gradient(90deg,var(--jr-sunken),var(--jr-hover),var(--jr-sunken));background-size:200% 100%;animation:jr-shimmer 1.4s infinite}@keyframes jr-shimmer{to{background-position:-200% 0}}.jr-timeline{padding:0 16px 28px}.jr-time-group{padding-top:14px}.jr-time-day{display:flex;align-items:baseline;justify-content:space-between;gap:12px;margin:0 0 2px;padding:0 0 6px 76px;border-bottom:1px solid var(--jr-border-soft);font-size:11px;font-weight:680;letter-spacing:-.005em}.jr-time-day em{color:var(--jr-faint);font-style:normal;font-variant-numeric:tabular-nums;font-size:9.5px;font-weight:500}.jr-time-row{width:100%;display:grid;grid-template-columns:56px 20px minmax(0,1fr) auto;align-items:center;gap:0;padding:0;border:0;background:transparent;cursor:pointer;text-align:left}.jr-time-row:disabled{cursor:default}.jr-time-row>time{padding:9px 10px 9px 0;color:var(--jr-faint);font-size:9.5px;text-align:right}.jr-time-row>time.repeat{color:transparent}.jr-time-row:hover>time.repeat{color:var(--jr-faint)}.jr-time-rail{position:relative;align-self:stretch;display:grid;place-items:center}.jr-time-rail:before{content:"";position:absolute;top:0;bottom:0;width:1px;background:var(--jr-border)}.jr-time-rail svg{position:relative;width:13px;height:13px}.jr-time-rail svg path{fill:currentColor}.jr-time-rail svg path.hollow{fill:var(--jr-bg);stroke:currentColor;stroke-width:3.2}.jr-time-copy{min-width:0;display:flex;align-items:center;gap:9px;padding:8px 10px 8px 12px;border-radius:var(--jr-r-sm)}.jr-time-row:hover:not(:disabled) .jr-time-copy{background:var(--jr-hover)}.jr-time-copy b{min-width:0;overflow:hidden;font-size:11.5px;font-weight:580;text-overflow:ellipsis;white-space:nowrap}.jr-time-row.is-edge .jr-time-copy b{color:var(--jr-muted);font-size:11px;font-weight:450}.jr-time-kind{flex:0 0 auto;color:var(--jr-faint);font-size:9px;font-weight:750;letter-spacing:.06em;text-transform:uppercase}.jr-time-rev{padding:8px 0 8px 12px;color:var(--jr-faint);font-size:9.5px;white-space:nowrap}.jr-catalog{padding-bottom:8px}.jr-section-label{display:flex;align-items:center;gap:8px;margin:0;padding:14px 14px 7px;color:var(--jr-faint);font-size:9px;font-weight:800;letter-spacing:.1em;text-transform:uppercase}.jr-section-label em{font-style:normal;font-weight:700;letter-spacing:.04em;text-transform:none}.jr-section-label:after{content:"";flex:1;height:1px;background:var(--jr-border-soft)}.jr-catalog-grid{display:grid;gap:2px;padding:0 8px}.jr-catalog-row{display:grid;grid-template-columns:26px minmax(0,1fr) auto;align-items:center;gap:9px;padding:7px 9px;border:1px solid transparent;border-radius:var(--jr-r);background:transparent;cursor:pointer;text-align:left}.jr-catalog-row.nested{box-shadow:inset 2px 0 0 var(--jr-border)}.jr-catalog-row:hover{background:var(--jr-hover)}.jr-catalog-row.active{border-color:color-mix(in srgb,var(--jr-accent) 32%,var(--jr-border));background:var(--jr-accent-soft)}.jr-catalog-row.active .jr-catalog-copy b{color:var(--jr-fg)}.jr-catalog-icon{width:26px;height:26px;display:grid;place-items:center;border-radius:var(--jr-r-sm);background:var(--jr-raised);color:var(--jr-muted)}.jr-catalog-row.active .jr-catalog-icon{background:color-mix(in srgb,var(--jr-accent) 16%,transparent);color:var(--jr-accent)}.jr-catalog-icon svg{width:15px;height:15px}.jr-catalog-copy{min-width:0;display:grid;gap:1px}.jr-catalog-copy b{overflow:hidden;font-size:11.5px;font-weight:600;text-overflow:ellipsis;white-space:nowrap}.jr-catalog-copy small{overflow:hidden;color:var(--jr-faint);font-size:9.5px;text-overflow:ellipsis;white-space:nowrap}.jr-catalog-copy small.jr-catalog-presence{color:var(--jr-accent-strong);font-variant-numeric:tabular-nums;font-weight:600}.jr-catalog-count{min-width:22px;padding:2px 6px;border-radius:999px;background:var(--jr-raised);color:var(--jr-muted);font-size:9px;font-weight:700;text-align:center}.jr-avatar{width:28px;height:28px;flex:0 0 auto;display:grid;place-items:center;border-radius:50%;background:var(--jr-accent-soft);color:var(--jr-accent-strong);font-size:10px;font-weight:800;letter-spacing:.02em}.jr-agents-rail{padding-bottom:20px}.jr-agent-tier{display:grid;gap:2px;padding:0 8px}.jr-agent-tier>.jr-eyebrow{padding:8px 6px 3px}.jr-agent-tier>.jr-eyebrow span{color:var(--jr-faint)}.jr-agent-card{display:grid;grid-template-columns:28px minmax(0,1fr) auto;align-items:start;gap:9px;padding:8px 9px;border:1px solid transparent;border-radius:var(--jr-r);background:transparent;cursor:pointer;text-align:left}.jr-agent-card:hover,.jr-agent-card.active{background:var(--jr-hover)}.jr-agent-card.active{border-color:color-mix(in srgb,var(--jr-accent) 30%,var(--jr-border))}.jr-agent-card.tier-today{opacity:.82}.jr-agent-card.tier-older{opacity:.6}.jr-agent-card.tier-older:hover{opacity:.9}.jr-agent-card.working .jr-avatar{background:color-mix(in srgb,var(--jr-success) 16%,transparent);color:var(--jr-success)}.jr-agent-copy{min-width:0;display:grid;gap:2px}.jr-agent-copy b{overflow:hidden;font-size:11.5px;font-weight:620;text-overflow:ellipsis;white-space:nowrap}.jr-agent-copy small{overflow:hidden;color:var(--jr-muted);font-size:9.5px;line-height:1.45;text-overflow:ellipsis;white-space:nowrap}.jr-agent-copy small.jr-agent-headline{color:var(--jr-faint)}.jr-agent-meta{display:grid;gap:2px;justify-items:end;padding-top:1px}.jr-agent-meta time,.jr-agent-meta em{color:var(--jr-faint);font-size:9px;font-style:normal}.jr-working{color:var(--jr-success);font-weight:700}.jr-agent-fold{display:flex;align-items:center;gap:6px;width:100%;padding:8px 9px;border:0;border-radius:var(--jr-r-sm);background:transparent;color:var(--jr-muted);cursor:pointer;font-size:10px;font-weight:700;letter-spacing:.06em;text-transform:uppercase}.jr-agent-fold:hover{background:var(--jr-hover);color:var(--jr-fg)}.jr-agent-fold svg{width:13px;height:13px}.jr-agent-fold em{margin-left:auto;font-style:normal;letter-spacing:0}.jr-orbit-body{padding:14px 16px 28px}.jr-detail-head{padding-bottom:14px;border-bottom:1px solid var(--jr-border)}.jr-detail-title{display:flex;align-items:flex-start;gap:11px}.jr-detail-title>div{min-width:0;display:grid;gap:2px}.jr-detail-title .jr-eyebrow{color:var(--node-color)}.jr-detail-title h2{margin:0;font-size:17px;font-weight:650;letter-spacing:-.018em;line-height:1.25}.jr-detail-summary{margin:11px 0 12px;color:var(--jr-muted);font-size:11.5px;line-height:1.6}.jr-detail-meta{display:flex;flex-wrap:wrap;align-items:center;gap:8px;color:var(--jr-faint);font-size:10px}.jr-detail-meta>span{display:inline-flex;align-items:center;gap:4px}.jr-detail-meta svg{width:11px;height:11px}.jr-root-action{display:inline-flex;align-items:center;gap:5px;margin-left:auto;padding:4px 9px;border:1px solid var(--jr-border);border-radius:var(--jr-r-sm);background:var(--jr-bg);color:var(--jr-muted);cursor:pointer;font-size:10px;font-weight:600}.jr-root-action:hover{border-color:var(--jr-accent);color:var(--jr-accent)}.jr-root-action svg{width:12px;height:12px}.jr-detail-section,.jr-content-stack{padding:13px 0;border-bottom:1px solid var(--jr-border-soft)}.jr-detail-section>h3,.jr-content-stack>h3{display:flex;align-items:center;justify-content:space-between;margin:0 0 7px;color:var(--jr-faint);font-size:9px;font-weight:800;letter-spacing:.1em;text-transform:uppercase}.jr-danger-section>h3{color:var(--jr-danger)}.jr-related{width:100%;display:grid;grid-template-columns:auto minmax(0,1fr) auto;align-items:center;gap:9px;padding:6px 6px 6px 0;border:0;border-radius:var(--jr-r-sm);background:transparent;cursor:pointer;text-align:left}.jr-related:hover{padding-left:6px;background:var(--jr-hover)}.jr-related i{min-width:74px;padding:2px 6px;border-radius:4px;background:var(--jr-raised);color:var(--jr-muted);font-size:8.5px;font-style:normal;font-weight:720;letter-spacing:.04em;text-align:center;text-transform:uppercase}.jr-related.edge-conflict i,.jr-related i.danger{background:color-mix(in srgb,var(--jr-danger) 12%,transparent);color:var(--jr-danger)}.jr-related.edge-support i{background:color-mix(in srgb,var(--jr-success) 12%,transparent);color:var(--jr-success)}.jr-related.edge-succession i{background:color-mix(in srgb,var(--jr-decision) 14%,transparent);color:var(--jr-decision)}.jr-related span{min-width:0;overflow:hidden;font-size:11px;text-overflow:ellipsis;white-space:nowrap}.jr-related b{color:var(--jr-faint)}.jr-presence-section{border-bottom:1px solid var(--jr-border-soft)}.jr-presence-row{display:grid;grid-template-columns:28px minmax(0,1fr);align-items:center;gap:9px;padding:4px 0}.jr-presence-row span{min-width:0;display:grid;gap:1px}.jr-presence-row b{font-size:11.5px;font-weight:620}.jr-presence-row small{overflow:hidden;color:var(--jr-muted);font-size:10px;text-overflow:ellipsis;white-space:nowrap}.jr-learning{margin:13px 0;padding:11px 13px;border:1px dashed color-mix(in srgb,var(--node-color) 34%,var(--jr-border));border-radius:var(--jr-r);background:color-mix(in srgb,var(--node-color) 5%,transparent)}.jr-learning .jr-eyebrow{color:var(--node-color)}.jr-learning p{margin:6px 0 0;font-size:11px;line-height:1.6}.jr-content-block{min-width:0;margin:5px 0;border:1px solid var(--jr-border-soft);border-radius:var(--jr-r-sm);background:var(--jr-bg)}.jr-content-block>summary{min-width:0;display:flex;align-items:center;justify-content:space-between;gap:9px;padding:8px 10px;cursor:pointer}.jr-content-block>summary span{min-width:0;overflow:hidden;font-size:11px;font-weight:640;text-overflow:ellipsis;white-space:nowrap}.jr-content-block>summary em{flex:0 0 auto;color:var(--jr-faint);font-size:8.5px;font-style:normal;letter-spacing:.05em;text-transform:uppercase}.jr-content-block>div,.jr-content-block>pre{margin:0;overflow:visible;padding:11px;border-top:1px solid var(--jr-border-soft);color:var(--jr-fg);font-size:11px;line-height:1.65;overflow-wrap:anywhere;white-space:pre-wrap}.jr-content-block>pre{background:var(--jr-sunken);font-family:ui-monospace,SFMono-Regular,monospace;font-size:10px}.jr-content-stack[data-renderer=rule] .jr-content-block{border-left:3px solid var(--node-color)}.jr-detail-section dl{display:grid;grid-template-columns:72px minmax(0,1fr);gap:6px 12px;margin:0;font-size:11px}.jr-detail-section dt{color:var(--jr-faint)}.jr-detail-section dd{margin:0;overflow-wrap:anywhere}.jr-note-fields dl{grid-template-columns:minmax(96px,.36fr) minmax(0,1fr);gap:9px 14px}.jr-note-fields dt{font-size:10px;font-weight:640;color:var(--jr-muted)}.jr-note-fields dd{line-height:1.6;white-space:pre-wrap}.jr-attributes{margin-top:14px;font-size:10.5px}.jr-attributes summary{padding:7px 0;color:var(--jr-faint);cursor:pointer}.jr-attributes summary:hover{color:var(--jr-muted)}.jr-address{padding:6px 0;color:var(--jr-muted);font:10px ui-monospace,SFMono-Regular,monospace;overflow-wrap:anywhere}.jr-raw{margin:4px 0 0;padding:10px;border-radius:var(--jr-r-sm);background:var(--jr-sunken);color:var(--jr-muted);font:9.5px/1.55 ui-monospace,SFMono-Regular,monospace;white-space:pre-wrap;overflow-wrap:anywhere}.jr-context-overlay{position:fixed;inset:0;z-index:30}.jr-context-menu{position:absolute;max-width:100%;max-height:100%;overflow:auto;min-width:176px;display:grid;gap:1px;padding:4px;border:1px solid var(--jr-border);border-radius:var(--jr-r);background:var(--jr-panel);box-shadow:var(--jr-shadow)}.jr-context-menu button{width:100%;display:flex;align-items:center;gap:9px;padding:7px 9px;border:0;border-radius:var(--jr-r-sm);background:transparent;cursor:pointer;text-align:left;font-size:11.5px}.jr-context-menu button:hover{color:var(--jr-accent);background:var(--jr-accent-soft)}.jr-context-menu svg{width:14px;height:14px;color:var(--jr-muted)}.jr-context-menu button:hover svg{color:inherit}@container journal (max-width: 900px){.jr-identity{max-width:170px}.jr-lens-switch span{display:none}.jr-lens-switch button{width:28px;justify-content:center;padding:0}}@container journal (max-width: 620px){.jr-app{grid-template-rows:48px minmax(0,1fr)}.jr-nav-drawer,.jr-orbit-drawer{top:48px;z-index:8;box-shadow:var(--jr-shadow)}.jr-app.nav-open .jr-view,.jr-app.orbit-open .jr-view{margin:0}.jr-nav-drawer{width:min(290px,calc(100% - 44px))}.jr-orbit-drawer{width:100%;border-left:0}.jr-orbit-drawer .jr-resize-handle,.jr-identity,.jr-tree-summary,.jr-tree-kind{display:none}.jr-tree-row{grid-template-columns:18px 20px minmax(0,1fr) auto 24px;min-height:34px}.jr-time-row{grid-template-columns:46px 18px minmax(0,1fr) auto}.jr-time-day{padding-left:64px}.jr-result{grid-template-columns:20px 22px minmax(0,1fr)}.jr-score{display:none}.jr-legend{max-width:calc(100% - 28px)}.jr-hovercard{display:none}.jr-bound-dock{max-width:calc(100% - 28px)}.jr-now-grid{grid-template-columns:minmax(0,1fr)}.jr-lane-name{width:132px}}@container journal (max-width: 420px){.jr-toolbar{gap:5px;padding-inline:6px}.jr-tree{padding-inline:6px}.jr-tree-row{--indent: calc(var(--depth) * 15px);padding-left:calc(4px + var(--indent))}.jr-tree-guides{left:12px;background:repeating-linear-gradient(to right,transparent 0 14px,var(--jr-border-soft) 14px 15px)}.jr-result-list,.jr-timeline{padding-inline:10px}.jr-focus-moves{display:none}}@media(prefers-reduced-motion:reduce){.jr-spinner,.jr-loading-lines i{animation:none}.jr-bound-bar i,.jr-crumb,.jr-lane-span{transition:none}}button:focus-visible,input:focus-visible,select:focus-visible,textarea:focus-visible,[tabindex]:focus-visible{outline:var(--p-focus-ring-width) var(--p-focus-ring-style) var(--p-focus-ring-color);outline-offset:var(--p-focus-ring-offset);box-shadow:var(--p-focus-ring-shadow)}input[type=checkbox],input[type=range]{accent-color:var(--p-primary-color)}', Zv = ".jr-focus-path{min-width:0;flex:1 1 auto;display:flex;align-items:center;gap:8px}.jr-focus-moves{flex:0 0 auto;display:flex;align-items:center;gap:1px}.jr-focus-moves button{width:24px;height:24px;display:grid;place-items:center;border:0;border-radius:var(--jr-r-sm);background:transparent;color:var(--jr-muted);cursor:pointer}.jr-focus-moves button:hover:not(:disabled){background:var(--jr-hover);color:var(--jr-fg)}.jr-focus-moves button:disabled{opacity:.28;cursor:default}.jr-focus-moves svg{width:15px;height:15px}.jr-crumbs{min-width:0;flex:1 1 auto;display:flex;align-items:center;gap:1px;margin:0;padding:0;overflow-x:auto;list-style:none;scrollbar-width:none}.jr-crumbs::-webkit-scrollbar{display:none}.jr-crumbs li{flex:0 0 auto;display:flex;align-items:center;gap:1px}.jr-crumb-sep{color:var(--jr-faint);font-size:11px}.jr-crumb{display:inline-flex;align-items:center;gap:5px;max-width:190px;padding:4px 8px;border:0;border-radius:var(--jr-r-sm);background:transparent;color:var(--jr-muted);cursor:pointer;font-size:11.5px;transition:background .12s ease}.jr-crumb span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.jr-crumb svg{width:13px;height:13px;flex:0 0 auto;opacity:.7}.jr-crumb:hover{background:var(--jr-hover);color:var(--jr-fg)}.jr-crumb.current{color:var(--jr-fg);font-weight:680}.jr-crumb.kind-graph svg{color:var(--jr-accent);opacity:1}.jr-crumb.kind-branch svg{color:var(--jr-info);opacity:1}.jr-now-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(320px,1fr));gap:14px;max-width:1240px;margin-inline:auto;padding:12px 16px 28px}.jr-now-block{min-width:0;display:grid;align-content:start;gap:2px;padding:12px 10px 14px;border:1px solid var(--jr-border-soft);border-radius:var(--jr-r-lg);background:var(--jr-panel)}.jr-now-block.wide{grid-column:1 / -1}.jr-now-block>h3{display:flex;align-items:center;gap:7px;margin:0 0 6px;padding:0 6px;color:var(--jr-muted);font-size:9.5px;font-weight:800;letter-spacing:.1em;text-transform:uppercase}.jr-now-block>h3 svg{width:14px;height:14px;color:var(--jr-accent)}.jr-now-block>h3 em{margin-left:auto;padding:1px 7px;border-radius:999px;background:var(--jr-raised);color:var(--jr-fg);font-size:9.5px;font-style:normal;letter-spacing:0}.jr-now-span,.jr-now-task{display:grid;align-items:start;gap:9px;padding:8px;border:0;border-radius:var(--jr-r);background:transparent;cursor:pointer;text-align:left}.jr-now-span{grid-template-columns:28px minmax(0,1fr) auto}.jr-now-task{grid-template-columns:auto minmax(0,1fr) auto;align-items:center}.jr-now-span:hover,.jr-now-task:hover{background:var(--jr-hover)}.jr-now-task.blocked{box-shadow:inset 2px 0 0 var(--jr-danger)}.jr-authority-row.planning{box-shadow:inset 2px 0 0 var(--jr-warn)}.jr-authority-row.resumable{box-shadow:inset 2px 0 0 var(--jr-info)}.jr-now-copy{min-width:0;display:grid;gap:2px}.jr-now-copy b{overflow:hidden;font-size:12px;font-weight:600;text-overflow:ellipsis;white-space:nowrap}.jr-now-copy small{overflow:hidden;color:var(--jr-muted);font-size:10px;line-height:1.45;text-overflow:ellipsis;white-space:nowrap}.jr-now-copy small.jr-now-fact{display:inline-flex;align-items:center;gap:3px;color:var(--jr-faint)}.jr-now-fact svg{width:10px;height:10px;flex:0 0 auto}.jr-now-meta{display:grid;gap:2px;justify-items:end}.jr-now-meta time,.jr-now-meta em{color:var(--jr-faint);font-size:9px;font-style:normal}.jr-now-task time{flex:0 0 auto;color:var(--jr-faint);font-size:9.5px}.jr-now-task time.dormant{color:var(--jr-warn)}.jr-now-task time.live{color:var(--jr-success)}.jr-now-facts{display:grid;gap:1px;margin:0;padding:0;list-style:none}.jr-now-facts li{display:grid;grid-template-columns:8px 88px minmax(0,1fr) auto;align-items:baseline;gap:9px;padding:6px 8px;border-radius:var(--jr-r-sm)}.jr-now-facts li:hover{background:var(--jr-hover)}.jr-now-dot{width:6px;height:6px;border-radius:50%;align-self:center}.jr-now-facts b{min-width:0;overflow:hidden;font-size:11.5px;font-weight:560;text-overflow:ellipsis;white-space:nowrap}.jr-now-facts time{color:var(--jr-faint);font-size:9.5px}.jr-lane-board{max-width:1240px;margin-inline:auto;padding:6px 16px 28px}.jr-lane-ruler{position:relative;height:18px;margin-left:178px;border-bottom:1px solid var(--jr-border-soft);color:var(--jr-faint);font-size:9px;font-variant-numeric:tabular-nums}.jr-lane-ruler span{position:absolute;transform:translate(-50%);white-space:nowrap}.jr-lane-ruler span:first-child{transform:none}.jr-lane-ruler span:last-child{transform:translate(-100%)}.jr-lane-rows{position:relative}.jr-lane-gaps{position:absolute;inset:0 0 0 178px;z-index:1;pointer-events:none}.jr-lane-gap{position:absolute;top:0;bottom:0;display:flex;align-items:flex-start;justify-content:center;border-inline:1px dashed var(--jr-border-soft);background:repeating-linear-gradient(-55deg,transparent 0 5px,color-mix(in srgb,var(--jr-muted) 9%,transparent) 5px 7px)}.jr-lane-gap span{margin-top:3px;padding:1px 6px;border:1px solid var(--jr-border-soft);border-radius:999px;background:var(--jr-panel);color:var(--jr-muted);font-size:9px;font-weight:560;white-space:nowrap}.jr-lane{display:grid;grid-template-columns:168px minmax(0,1fr);align-items:center;gap:10px;padding:3px 0}.jr-lane-name{display:grid;grid-template-columns:28px minmax(0,1fr);align-items:center;gap:8px;padding:5px 6px;border:0;border-radius:var(--jr-r-sm);background:transparent;cursor:pointer;text-align:left}.jr-lane-name:hover{background:var(--jr-hover)}.jr-lane-name span{min-width:0;display:grid;gap:1px}.jr-lane-name b{overflow:hidden;font-size:11px;font-weight:620;text-overflow:ellipsis;white-space:nowrap}.jr-lane-name small{color:var(--jr-faint);font-size:9px}.jr-lane-track{position:relative;height:30px;border-radius:var(--jr-r-sm);background:var(--jr-sunken)}.jr-lane-tick{position:absolute;bottom:0;width:2px;border-radius:1px;background:color-mix(in srgb,var(--jr-muted) 40%,transparent)}.jr-lane.unattributed .jr-lane-name{cursor:default}.jr-lane.unattributed .jr-lane-name b{color:var(--jr-muted);font-weight:480}.jr-lane.unattributed .jr-lane-track{background:color-mix(in srgb,var(--jr-sunken) 60%,transparent)}.jr-lane-span{position:absolute;top:4px;height:22px;min-width:14px;display:flex;align-items:center;gap:6px;overflow:hidden;padding:0 7px;border:1px solid color-mix(in srgb,var(--jr-accent) 34%,transparent);border-radius:var(--jr-r-sm);background:color-mix(in srgb,var(--jr-accent) 15%,transparent);color:var(--jr-fg);cursor:pointer;font-size:10px;transition:background .12s ease}.jr-lane-span:hover{background:color-mix(in srgb,var(--jr-accent) 26%,transparent)}.jr-lane-span span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.jr-lane-span em{margin-left:auto;color:var(--jr-muted);font-size:9px;font-style:normal}.jr-lane-span.open{border-color:var(--jr-success);background:color-mix(in srgb,var(--jr-success) 18%,transparent)}.jr-lane-span.outcome-idle{border-style:dashed}.jr-stale-list{max-width:1000px;margin:0 auto;padding:8px 16px 4px;list-style:none;display:grid;gap:6px}.jr-stale-item{border:1px solid var(--jr-border-soft);border-radius:var(--jr-r);background:var(--jr-panel)}.jr-stale-head{display:grid;grid-template-columns:24px minmax(0,1fr) auto;align-items:center;gap:9px;padding:9px 11px}.jr-stale-fold{width:24px;height:24px;display:grid;place-items:center;border:0;border-radius:var(--jr-r-sm);background:transparent;color:var(--jr-muted);cursor:pointer}.jr-stale-fold:hover{background:var(--jr-hover);color:var(--jr-fg)}.jr-stale-fold svg{width:14px;height:14px}.jr-stale-title{min-width:0;display:grid;gap:3px;border:0;background:transparent;cursor:pointer;text-align:left}.jr-stale-title b{overflow:hidden;font-size:12.5px;font-weight:620;text-overflow:ellipsis;white-space:nowrap}.jr-stale-title small{display:flex;flex-wrap:wrap;gap:10px;color:var(--jr-faint);font-size:9.5px}.jr-stale-head>time{color:var(--jr-warn);font-size:10px;font-weight:640}.jr-stale-members{margin:0;padding:0 11px 9px 44px;list-style:none;display:grid;gap:1px}.jr-stale-members button{display:grid;grid-template-columns:auto minmax(0,1fr) auto;align-items:center;gap:9px;width:100%;padding:5px 8px;border:0;border-radius:var(--jr-r-sm);background:transparent;cursor:pointer;text-align:left;font-size:11px}.jr-stale-members button:hover{background:var(--jr-hover)}.jr-stale-members span:not(.jr-state-chip){overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.jr-stale-members time{color:var(--jr-faint);font-size:9.5px}.jr-stale-note{max-width:1000px;margin:4px auto 28px;padding:0 16px;color:var(--jr-faint);font-size:10.5px;line-height:1.6}.jr-orbit-tabs{display:flex;flex:0 0 auto;gap:2px;margin-inline:auto 2px}.jr-orbit-tabs button{padding:3px 9px;border:0;border-radius:999px;background:transparent;color:var(--jr-muted);cursor:pointer;font-size:9.5px;font-weight:700;letter-spacing:.06em;text-transform:uppercase}.jr-orbit-tabs button:hover{background:var(--jr-hover);color:var(--jr-fg)}.jr-orbit-tabs button.active{background:var(--jr-accent-soft);color:var(--jr-fg)}.jr-chain{display:grid;gap:1px;margin:0;padding:0;list-style:none}.jr-chain li{padding-left:calc(var(--step) * 10px)}.jr-chain .jr-kind-mark{width:14px;height:14px}.jr-relation-group{border-bottom:1px solid var(--jr-border-soft)}.jr-relation-group:last-child{border-bottom:0}.jr-relation-group>summary{display:flex;align-items:center;justify-content:space-between;gap:9px;padding:7px 2px;cursor:pointer}.jr-relation-kind{padding:2px 7px;border-radius:999px;background:var(--jr-raised);color:var(--jr-muted);font-size:9px;font-weight:700;letter-spacing:.05em;text-transform:uppercase}.jr-relation-kind.edge-conflict{background:color-mix(in srgb,var(--jr-danger) 12%,transparent);color:var(--jr-danger)}.jr-relation-kind.edge-support{background:color-mix(in srgb,var(--jr-success) 12%,transparent);color:var(--jr-success)}.jr-relation-kind.edge-succession{background:color-mix(in srgb,var(--jr-decision) 14%,transparent);color:var(--jr-decision)}.jr-relation-group>summary em{color:var(--jr-faint);font-size:9.5px;font-style:normal}.jr-orbit-fact{display:grid;grid-template-columns:86px minmax(0,1fr) auto;align-items:baseline;gap:9px;padding:5px 2px}.jr-orbit-fact b{min-width:0;overflow:hidden;font-size:11px;font-weight:560;text-overflow:ellipsis;white-space:nowrap}.jr-orbit-fact time{color:var(--jr-faint);font-size:9.5px}.jr-orbit-more{width:100%;margin-top:4px;padding:7px;border:1px dashed var(--jr-border);border-radius:var(--jr-r-sm);background:transparent;color:var(--jr-accent);cursor:pointer;font-size:10.5px;font-weight:600}.jr-orbit-more:hover{border-color:var(--jr-accent);background:var(--jr-accent-soft)}.jr-lens-bound{display:inline-flex;align-items:center;gap:5px;margin-left:auto;color:var(--jr-warn);font-size:10px;font-variant-numeric:tabular-nums}.jr-lens-bound+.jr-lens-advice{margin-left:10px}.jr-lens-bound svg{width:13px;height:13px}.jr-stale-members li.nested button{padding-left:26px}.jr-stale-members b{font-weight:620}", Qv = ".jr-view:has(>.jr-tree){display:grid;grid-template-rows:auto minmax(0,1fr);overflow:hidden}.jr-tree{min-height:0;display:flex;flex-direction:column;padding-bottom:0}.jr-vlist{flex:1 1 auto;min-height:0;padding-bottom:28px;overflow-x:hidden;overflow-y:auto;overscroll-behavior:contain;scrollbar-gutter:stable}.jr-tree-row{height:var(--jr-row-height);min-height:var(--jr-row-height);margin:0}", eb = [Jv, Zv, Qv].join(`
`), tb = {
  type: "object",
  properties: {
    "entry-id": {
      type: "string",
      default: "",
      description: "Workspace Journal component id to load; an empty value renders the required-id state without issuing API requests."
    },
    "read-only": {
      type: "boolean",
      default: !1,
      description: "Disables editing while retaining full reading and inspection controls."
    },
    mode: {
      type: "string",
      default: "preview",
      description: "Rendering context supplied by the workspace host: preview keeps recovery compact, while full exposes every Journal lens and inspector."
    }
  }
};
class nb extends $c {
  static get wippyConfig() {
    return {
      propsSchema: tb,
      hostCssKeys: ["themeConfigUrl", "iframeCssUrl"],
      inlineCss: eb
    };
  }
  static get vueConfig() {
    return { rootComponent: Xv };
  }
}
Ss(import.meta.url, nb);
//# sourceMappingURL=index.js.map
