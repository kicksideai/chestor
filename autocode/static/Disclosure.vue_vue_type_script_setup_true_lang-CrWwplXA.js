import { api as X, on as B } from "@wippy-fe/proxy";
import { f as re, o as i, n as P, l as C, s, g as Y, h as he, d as f, i as fe, w as me, j as ve, c as ae, k as ee, m as ge, p as ye, q as be, r as j, u as q, v as Ae, x as $e, y as Pe } from "./dto-CHThMR8e.js";
import { watch as Ce, onUnmounted as z, nextTick as we, readonly as Te, ref as ke, openBlock as u, createElementBlock as $, mergeProps as d, createElementVNode as T, createBlock as h, Transition as Ie, withCtx as m, withDirectives as ce, resolveDynamicComponent as g, renderSlot as y, vShow as _e, createCommentVNode as D, normalizeClass as k, resolveDirective as xe, resolveComponent as H, Fragment as Se, renderList as De, createVNode as w, toDisplayString as ie, defineComponent as Ue, useModel as Ee, unref as x, createTextVNode as Le, mergeModels as Ke } from "vue";
import { s as V, B as L, e as K, R as Ne, f as Be, h as He, Q as ne, z as Re } from "./wc-runtime-CvWl7e3g.js";
const Fe = re([
  i({
    state: C("waiting"),
    ticket: s(),
    user_code: s(),
    verification_url: C("https://auth.openai.com/codex/device"),
    expires_at: P().int(),
    retry_after: P().int().positive()
  }),
  i({ state: Y(["waiting", "rate_limited", "busy"]), retry_after: P().int().positive() }),
  i({ state: C("ready"), account_id: s() }),
  i({ state: Y(["expired", "denied", "cancelled", "unavailable", "save_failed"]) })
]), je = "/api/v1/autocode", U = i({ kind: s().optional(), code: s().optional(), retryable: ae().optional(), details: j(q()).optional() }), Me = U.extend({ success: C(!1), error: re([s(), U.extend({ message: s() })]) });
class te extends Error {
  kind;
  code;
  retryable;
  details;
  constructor(n, t) {
    super(n), this.name = "ApiError", this.kind = t.kind, this.details = t.details, this.code = t.code ?? (typeof t.details?.code == "string" ? t.details.code : void 0), this.retryable = t.retryable;
  }
}
function se(e) {
  const n = Me.safeParse(e);
  if (!n.success) return;
  const t = n.data;
  return typeof t.error == "string" ? new te(t.error, t) : new te(t.error.message, { ...t, ...t.error });
}
const b = i({ success: C(!0) });
function Oe(e, n) {
  const t = se(e);
  if (t) throw t;
  b.parse(e);
  const o = n.safeParse(e);
  if (!o.success) throw new Error(`Invalid API response: ${o.error.issues.map((a) => a.path.join(".") + ": " + a.message).join("; ")}`);
  return o.data;
}
async function E(e, n, t, o) {
  try {
    const r = (e === "get" || e === "delete" ? await X[e](n) : await X[e](n, o)).data;
    return Oe(r, t);
  } catch (a) {
    const r = i({ response: i({ data: q() }) }).safeParse(a);
    throw r.success ? se(r.data.response.data) ?? new Error("Invalid API error response.") : a instanceof Error ? a : new Error("Request failed.");
  }
}
function c(e, n, t, o) {
  return E(e, je + n, t, o);
}
async function Un(e) {
  if (!e.length) return {};
  const n = await E("post", "/api/v1/principals/resolve", i({ principals: f(i({ id: s(), label: s() })) }), { refs: e.map((t) => ({ type: "user", id: t })) });
  return Object.fromEntries(n.principals.map((t) => [t.id, t.label]));
}
const A = i({ id: s() }), oe = A.extend({ build_error: U.extend({ message: s() }).optional() }), We = i({ id: s(), title: s(), description: s(), web_component: s().optional(), context_schema: i({ properties: j(j(q())).optional(), required: f(s()).optional() }).passthrough().optional() }), En = {
  traits: () => E("get", "/api/v1/agents/traits", i({ traits: f(We) })).then((e) => e.traits),
  toolSurface: (e, n) => c("post", "/tool-surface", i({ count: P().int().nonnegative(), limit: P().int().positive() }), { agent: e, tools: n }),
  profiles: () => c("get", "/profiles", i({ profiles: f(be) })).then((e) => e.profiles),
  createProfile: (e) => c("post", "/profiles", A, e),
  updateProfile: (e, n) => c("put", `/profiles/${encodeURIComponent(e)}`, A, n),
  deleteProfile: (e) => c("delete", `/profiles/${encodeURIComponent(e)}`, b),
  catalog: () => c("get", "/catalog", Pe),
  limits: () => c("get", "/limits", i({ settings: f(ye) })).then((e) => e.settings),
  saveLimit: (e, n) => E("put", "/api/v1/settings", b, { namespace: "chestor.autocode", key: e, value: n }),
  managedAccounts: (e) => c(
    "get",
    "/management/accounts" + (e ? "?" + new URLSearchParams(e).toString() : ""),
    i({ accounts: f(ee), providers: f(ge), agent: s().optional() })
  ),
  codexDevice: (e) => c("post", "/management/accounts/codex/device", Fe, e),
  accounts: () => c("get", "/accounts", i({ accounts: f(ee) })).then((e) => e.accounts),
  connectAccount: (e) => c("post", "/management/accounts/connect", A.extend({ checked: ae() }), e),
  createAccount: (e) => c("post", "/accounts", A, e),
  updateAccount: (e, n) => c("put", `/accounts/${encodeURIComponent(e)}`, A.extend({ health_error: U.extend({ message: s() }).optional() }), n),
  deleteAccount: (e) => c("delete", `/accounts/${encodeURIComponent(e)}`, b),
  images: () => c("get", "/images", i({ images: f(ve) })).then((e) => e.images),
  image: (e) => c("get", `/images/${encodeURIComponent(e)}`, $e),
  createImage: (e) => c("post", "/images", oe, e),
  updateImage: (e, n) => c("put", `/images/${encodeURIComponent(e)}`, oe, n),
  deleteImage: (e, n) => c("delete", `/images/${encodeURIComponent(e)}${n ? "?remove=1" : ""}`, b),
  prepareImage: (e) => c("post", `/images/${encodeURIComponent(e)}/prepare`, b),
  prune: () => c("post", "/maintenance/prune", i({ output: s() })).then((e) => e.output),
  workspaces: () => c("get", "/workspaces", i({ workspaces: f(me), roots: f(s()).optional() })),
  createWorkspace: (e) => c("post", "/workspaces", A, e),
  deleteWorkspace: (e) => c("delete", `/workspaces/${encodeURIComponent(e)}`, b),
  runs: (e) => c("get", `/runs${e ? "?cursor=" + encodeURIComponent(e) : ""}`, i({ runs: f(fe), next_cursor: s().optional() })),
  run: (e, n, t) => c("get", `/runs/${encodeURIComponent(e)}?${t === void 0 ? `after_seq=${n ?? 0}` : `before_seq=${t}`}`, Ae),
  startRun: (e) => c("post", "/runs", i({ run_id: s(), notification_error: he.optional() }), e),
  cancelRun: (e) => c("post", `/runs/${encodeURIComponent(e)}/cancel`, b)
}, qe = {
  runs: (e) => B("chestor.autocode.runs", e),
  run: (e, n) => B(`chestor.autocode.run.${e}`, n),
  component: (e, n) => B(`component.${e}`, n)
};
function Ln(e, n = () => !0) {
  let t = null, o = !1;
  const a = async () => {
    try {
      do
        o = !1, await e();
      while (o && n());
    } finally {
      t = null;
    }
  };
  return () => n() ? t ? (o = !0, t) : (t = a(), t) : Promise.resolve();
}
async function Kn(e, n, t, o, a, r) {
  let v = await e();
  const I = async () => {
    if (!o()) return !1;
    const _ = n(v), l = _.some((p) => !t.value.includes(p));
    return t.value = _, await we(), o() && a(v), l;
  };
  return await I() && o() && (v = await e(), await I() && o() && r()), v;
}
function Nn(e, n) {
  const t = /* @__PURE__ */ new Map();
  Ce(e, (o) => {
    const a = new Set(o);
    for (const [r, v] of t)
      a.has(r) || (v(), t.delete(r));
    for (const r of a)
      t.has(r) || t.set(r, qe.component(r, n));
  }, { immediate: !0 }), z(() => {
    for (const o of t.values()) o();
    t.clear();
  });
}
function Bn() {
  let e = !0;
  return z(() => {
    e = !1;
  }), () => e;
}
function Hn(e, n = Date.now()) {
  return e.enabled ? e.rate_limits?.windows.some((t) => t.status === "rejected" && t.resets_at !== void 0 && t.resets_at * 1e3 > n) || e.cooldown_until && Date.parse(e.cooldown_until) > n ? "cooling" : e.usable ? "ready" : "unavailable" : "disabled";
}
function Rn(e) {
  if (!e) return "";
  const n = new Date(e);
  return Number.isNaN(n.getTime()) ? e : n.toLocaleString(void 0, { dateStyle: "short", timeStyle: "short" });
}
function Fn(e, n) {
  return e instanceof Error && e.message ? e.message : n;
}
const R = ke(Date.now());
let F = 0, S;
function jn() {
  return F++, S === void 0 && (R.value = Date.now(), S = setInterval(() => {
    R.value = Date.now();
  }, 1e3)), z(() => {
    F--, F || (clearInterval(S), S = void 0);
  }), Te(R);
}
function Mn(e, n) {
  return n.find((t) => t.id === e)?.icon || "tabler:terminal-2";
}
function On(e, n = Date.now()) {
  const t = Math.max(0, Math.floor((n - Date.parse(e)) / 1e3));
  return Number.isFinite(t) ? t < 60 ? "just now" : t < 3600 ? `${Math.floor(t / 60)}m ago` : t < 86400 ? `${Math.floor(t / 3600)}h ago` : `${Math.floor(t / 86400)}d ago` : "";
}
function de(e) {
  if (!Number.isFinite(e) || e < 0) return "—";
  const n = Math.round(e / 1e3);
  if (n < 60) return `${n}s`;
  const t = Math.floor(n / 60);
  return t < 60 ? `${t}m ${String(n % 60).padStart(2, "0")}s` : `${Math.floor(t / 60)}h ${String(t % 60).padStart(2, "0")}m`;
}
function Wn(e, n = Date.now()) {
  if (!e.started_at) return "—";
  const o = e.status === "running" || e.status === "queued" ? n - Date.parse(e.started_at) : Date.parse(e.finished_at) - Date.parse(e.started_at);
  return de(o);
}
function qn(e) {
  return `${de(e).replace(/ 00[ms]$/, "")} timeout`;
}
var le = {
  name: "ChevronRightIcon",
  extends: V
};
function ze(e) {
  return Ge(e) || Qe(e) || Ze(e) || Ve();
}
function Ve() {
  throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function Ze(e, n) {
  if (e) {
    if (typeof e == "string") return M(e, n);
    var t = {}.toString.call(e).slice(8, -1);
    return t === "Object" && e.constructor && (t = e.constructor.name), t === "Map" || t === "Set" ? Array.from(e) : t === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? M(e, n) : void 0;
  }
}
function Qe(e) {
  if (typeof Symbol < "u" && e[Symbol.iterator] != null || e["@@iterator"] != null) return Array.from(e);
}
function Ge(e) {
  if (Array.isArray(e)) return M(e);
}
function M(e, n) {
  (n == null || n > e.length) && (n = e.length);
  for (var t = 0, o = Array(n); t < n; t++) o[t] = e[t];
  return o;
}
function Je(e, n, t, o, a, r) {
  return u(), $("svg", d({
    width: "14",
    height: "14",
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, e.pti()), ze(n[0] || (n[0] = [T("path", {
    d: "M4.38708 13C4.28408 13.0005 4.18203 12.9804 4.08691 12.9409C3.99178 12.9014 3.9055 12.8433 3.83313 12.7701C3.68634 12.6231 3.60388 12.4238 3.60388 12.2161C3.60388 12.0084 3.68634 11.8091 3.83313 11.6622L8.50507 6.99022L3.83313 2.31827C3.69467 2.16968 3.61928 1.97313 3.62287 1.77005C3.62645 1.56698 3.70872 1.37322 3.85234 1.22959C3.99596 1.08597 4.18972 1.00371 4.3928 1.00012C4.59588 0.996539 4.79242 1.07192 4.94102 1.21039L10.1669 6.43628C10.3137 6.58325 10.3962 6.78249 10.3962 6.99022C10.3962 7.19795 10.3137 7.39718 10.1669 7.54416L4.94102 12.7701C4.86865 12.8433 4.78237 12.9014 4.68724 12.9409C4.59212 12.9804 4.49007 13.0005 4.38708 13Z",
    fill: "currentColor"
  }, null, -1)])), 16);
}
le.render = Je;
var Z = {
  name: "ChevronUpIcon",
  extends: V
};
function Xe(e) {
  return tn(e) || nn(e) || en(e) || Ye();
}
function Ye() {
  throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function en(e, n) {
  if (e) {
    if (typeof e == "string") return O(e, n);
    var t = {}.toString.call(e).slice(8, -1);
    return t === "Object" && e.constructor && (t = e.constructor.name), t === "Map" || t === "Set" ? Array.from(e) : t === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? O(e, n) : void 0;
  }
}
function nn(e) {
  if (typeof Symbol < "u" && e[Symbol.iterator] != null || e["@@iterator"] != null) return Array.from(e);
}
function tn(e) {
  if (Array.isArray(e)) return O(e);
}
function O(e, n) {
  (n == null || n > e.length) && (n = e.length);
  for (var t = 0, o = Array(n); t < n; t++) o[t] = e[t];
  return o;
}
function on(e, n, t, o, a, r) {
  return u(), $("svg", d({
    width: "14",
    height: "14",
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, e.pti()), Xe(n[0] || (n[0] = [T("path", {
    d: "M12.2097 10.4113C12.1057 10.4118 12.0027 10.3915 11.9067 10.3516C11.8107 10.3118 11.7237 10.2532 11.6506 10.1792L6.93602 5.46461L2.22139 10.1476C2.07272 10.244 1.89599 10.2877 1.71953 10.2717C1.54307 10.2556 1.3771 10.1808 1.24822 10.0593C1.11933 9.93766 1.035 9.77633 1.00874 9.6011C0.982477 9.42587 1.0158 9.2469 1.10338 9.09287L6.37701 3.81923C6.52533 3.6711 6.72639 3.58789 6.93602 3.58789C7.14565 3.58789 7.3467 3.6711 7.49502 3.81923L12.7687 9.09287C12.9168 9.24119 13 9.44225 13 9.65187C13 9.8615 12.9168 10.0626 12.7687 10.2109C12.616 10.3487 12.4151 10.4207 12.2097 10.4113Z",
    fill: "currentColor"
  }, null, -1)])), 16);
}
Z.render = on;
var rn = {
  root: "p-accordioncontent",
  contentWrapper: "p-accordioncontent-wrapper",
  content: "p-accordioncontent-content"
}, an = L.extend({
  name: "accordioncontent",
  classes: rn
}), cn = {
  name: "BaseAccordionContent",
  extends: K,
  props: {
    as: {
      type: [String, Object],
      default: "DIV"
    },
    asChild: {
      type: Boolean,
      default: !1
    }
  },
  style: an,
  provide: function() {
    return {
      $pcAccordionContent: this,
      $parentInstance: this
    };
  }
}, Q = {
  name: "AccordionContent",
  extends: cn,
  inheritAttrs: !1,
  inject: ["$pcAccordion", "$pcAccordionPanel"],
  computed: {
    id: function() {
      return "".concat(this.$pcAccordion.$id, "_accordioncontent_").concat(this.$pcAccordionPanel.value);
    },
    ariaLabelledby: function() {
      return "".concat(this.$pcAccordion.$id, "_accordionheader_").concat(this.$pcAccordionPanel.value);
    },
    attrs: function() {
      return d(this.a11yAttrs, this.ptmi("root", this.ptParams));
    },
    a11yAttrs: function() {
      return {
        id: this.id,
        role: "region",
        "aria-labelledby": this.ariaLabelledby,
        "data-pc-name": "accordioncontent",
        "data-p-active": this.$pcAccordionPanel.active
      };
    },
    ptParams: function() {
      return {
        context: {
          active: this.$pcAccordionPanel.active
        }
      };
    }
  }
};
function sn(e, n, t, o, a, r) {
  return e.asChild ? y(e.$slots, "default", {
    key: 1,
    class: k(e.cx("root")),
    active: r.$pcAccordionPanel.active,
    a11yAttrs: r.a11yAttrs
  }) : (u(), h(Ie, d({
    key: 0,
    name: "p-collapsible"
  }, e.ptm("transition", r.ptParams)), {
    default: m(function() {
      return [!r.$pcAccordion.lazy || r.$pcAccordionPanel.active ? ce((u(), h(g(e.as), d({
        key: 0,
        class: e.cx("root")
      }, r.attrs), {
        default: m(function() {
          return [T("div", d({
            class: e.cx("contentWrapper")
          }, e.ptm("contentWrapper", r.ptParams)), [T("div", d({
            class: e.cx("content")
          }, e.ptm("content", r.ptParams)), [y(e.$slots, "default")], 16)], 16)];
        }),
        _: 3
      }, 16, ["class"])), [[_e, r.$pcAccordion.lazy ? !0 : r.$pcAccordionPanel.active]]) : D("", !0)];
    }),
    _: 3
  }, 16));
}
Q.render = sn;
var ue = {
  name: "ChevronDownIcon",
  extends: V
};
function dn(e) {
  return hn(e) || pn(e) || un(e) || ln();
}
function ln() {
  throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function un(e, n) {
  if (e) {
    if (typeof e == "string") return W(e, n);
    var t = {}.toString.call(e).slice(8, -1);
    return t === "Object" && e.constructor && (t = e.constructor.name), t === "Map" || t === "Set" ? Array.from(e) : t === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? W(e, n) : void 0;
  }
}
function pn(e) {
  if (typeof Symbol < "u" && e[Symbol.iterator] != null || e["@@iterator"] != null) return Array.from(e);
}
function hn(e) {
  if (Array.isArray(e)) return W(e);
}
function W(e, n) {
  (n == null || n > e.length) && (n = e.length);
  for (var t = 0, o = Array(n); t < n; t++) o[t] = e[t];
  return o;
}
function fn(e, n, t, o, a, r) {
  return u(), $("svg", d({
    width: "14",
    height: "14",
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, e.pti()), dn(n[0] || (n[0] = [T("path", {
    d: "M7.01744 10.398C6.91269 10.3985 6.8089 10.378 6.71215 10.3379C6.61541 10.2977 6.52766 10.2386 6.45405 10.1641L1.13907 4.84913C1.03306 4.69404 0.985221 4.5065 1.00399 4.31958C1.02276 4.13266 1.10693 3.95838 1.24166 3.82747C1.37639 3.69655 1.55301 3.61742 1.74039 3.60402C1.92777 3.59062 2.11386 3.64382 2.26584 3.75424L7.01744 8.47394L11.769 3.75424C11.9189 3.65709 12.097 3.61306 12.2748 3.62921C12.4527 3.64535 12.6199 3.72073 12.7498 3.84328C12.8797 3.96582 12.9647 4.12842 12.9912 4.30502C13.0177 4.48162 12.9841 4.662 12.8958 4.81724L7.58083 10.1322C7.50996 10.2125 7.42344 10.2775 7.32656 10.3232C7.22968 10.3689 7.12449 10.3944 7.01744 10.398Z",
    fill: "currentColor"
  }, null, -1)])), 16);
}
ue.render = fn;
var mn = {
  root: "p-accordionheader",
  toggleicon: "p-accordionheader-toggle-icon"
}, vn = L.extend({
  name: "accordionheader",
  classes: mn
}), gn = {
  name: "BaseAccordionHeader",
  extends: K,
  props: {
    as: {
      type: [String, Object],
      default: "BUTTON"
    },
    asChild: {
      type: Boolean,
      default: !1
    }
  },
  style: vn,
  provide: function() {
    return {
      $pcAccordionHeader: this,
      $parentInstance: this
    };
  }
}, G = {
  name: "AccordionHeader",
  extends: gn,
  inheritAttrs: !1,
  inject: ["$pcAccordion", "$pcAccordionPanel"],
  methods: {
    onFocus: function() {
      this.$pcAccordion.selectOnFocus && this.changeActiveValue();
    },
    onClick: function() {
      !this.$pcAccordion.selectOnFocus && this.changeActiveValue();
    },
    onKeydown: function(n) {
      switch (n.code) {
        case "ArrowDown":
          this.onArrowDownKey(n);
          break;
        case "ArrowUp":
          this.onArrowUpKey(n);
          break;
        case "Home":
          this.onHomeKey(n);
          break;
        case "End":
          this.onEndKey(n);
          break;
        case "Enter":
        case "NumpadEnter":
        case "Space":
          this.onEnterKey(n);
          break;
      }
    },
    onArrowDownKey: function(n) {
      var t = this.findNextPanel(this.findPanel(n.currentTarget));
      t ? this.changeFocusedPanel(n, t) : this.onHomeKey(n), n.preventDefault();
    },
    onArrowUpKey: function(n) {
      var t = this.findPrevPanel(this.findPanel(n.currentTarget));
      t ? this.changeFocusedPanel(n, t) : this.onEndKey(n), n.preventDefault();
    },
    onHomeKey: function(n) {
      var t = this.findFirstPanel();
      this.changeFocusedPanel(n, t), n.preventDefault();
    },
    onEndKey: function(n) {
      var t = this.findLastPanel();
      this.changeFocusedPanel(n, t), n.preventDefault();
    },
    onEnterKey: function(n) {
      this.changeActiveValue(), n.preventDefault();
    },
    findPanel: function(n) {
      return n?.closest('[data-pc-name="accordionpanel"]');
    },
    findHeader: function(n) {
      return Re(n, '[data-pc-name="accordionheader"]');
    },
    findNextPanel: function(n) {
      var t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !1, o = t ? n : n.nextElementSibling;
      return o ? ne(o, "data-p-disabled") ? this.findNextPanel(o) : this.findHeader(o) : null;
    },
    findPrevPanel: function(n) {
      var t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !1, o = t ? n : n.previousElementSibling;
      return o ? ne(o, "data-p-disabled") ? this.findPrevPanel(o) : this.findHeader(o) : null;
    },
    findFirstPanel: function() {
      return this.findNextPanel(this.$pcAccordion.$el.firstElementChild, !0);
    },
    findLastPanel: function() {
      return this.findPrevPanel(this.$pcAccordion.$el.lastElementChild, !0);
    },
    changeActiveValue: function() {
      this.$pcAccordion.updateValue(this.$pcAccordionPanel.value);
    },
    changeFocusedPanel: function(n, t) {
      He(this.findHeader(t));
    }
  },
  computed: {
    id: function() {
      return "".concat(this.$pcAccordion.$id, "_accordionheader_").concat(this.$pcAccordionPanel.value);
    },
    ariaControls: function() {
      return "".concat(this.$pcAccordion.$id, "_accordioncontent_").concat(this.$pcAccordionPanel.value);
    },
    attrs: function() {
      return d(this.asAttrs, this.a11yAttrs, this.ptmi("root", this.ptParams));
    },
    asAttrs: function() {
      return this.as === "BUTTON" ? {
        type: "button",
        disabled: this.$pcAccordionPanel.disabled
      } : void 0;
    },
    a11yAttrs: function() {
      return {
        id: this.id,
        tabindex: this.$pcAccordion.tabindex,
        "aria-expanded": this.$pcAccordionPanel.active,
        "aria-controls": this.ariaControls,
        "data-pc-name": "accordionheader",
        "data-p-disabled": this.$pcAccordionPanel.disabled,
        "data-p-active": this.$pcAccordionPanel.active,
        onFocus: this.onFocus,
        onKeydown: this.onKeydown
      };
    },
    ptParams: function() {
      return {
        context: {
          active: this.$pcAccordionPanel.active
        }
      };
    },
    dataP: function() {
      return Be({
        active: this.$pcAccordionPanel.active
      });
    }
  },
  components: {
    ChevronUpIcon: Z,
    ChevronDownIcon: ue
  },
  directives: {
    ripple: Ne
  }
};
function yn(e, n, t, o, a, r) {
  var v = xe("ripple");
  return e.asChild ? y(e.$slots, "default", {
    key: 1,
    class: k(e.cx("root")),
    active: r.$pcAccordionPanel.active,
    a11yAttrs: r.a11yAttrs,
    onClick: r.onClick
  }) : ce((u(), h(g(e.as), d({
    key: 0,
    "data-p": r.dataP,
    class: e.cx("root"),
    onClick: r.onClick
  }, r.attrs), {
    default: m(function() {
      return [y(e.$slots, "default", {
        active: r.$pcAccordionPanel.active
      }), y(e.$slots, "toggleicon", {
        active: r.$pcAccordionPanel.active,
        class: k(e.cx("toggleicon"))
      }, function() {
        return [r.$pcAccordionPanel.active ? (u(), h(g(r.$pcAccordion.$slots.collapseicon ? r.$pcAccordion.$slots.collapseicon : r.$pcAccordion.collapseIcon ? "span" : "ChevronUpIcon"), d({
          key: 0,
          class: [r.$pcAccordion.collapseIcon, e.cx("toggleicon")],
          "aria-hidden": "true"
        }, e.ptm("toggleicon", r.ptParams)), null, 16, ["class"])) : (u(), h(g(r.$pcAccordion.$slots.expandicon ? r.$pcAccordion.$slots.expandicon : r.$pcAccordion.expandIcon ? "span" : "ChevronDownIcon"), d({
          key: 1,
          class: [r.$pcAccordion.expandIcon, e.cx("toggleicon")],
          "aria-hidden": "true"
        }, e.ptm("toggleicon", r.ptParams)), null, 16, ["class"]))];
      })];
    }),
    _: 3
  }, 16, ["data-p", "class", "onClick"])), [[v]]);
}
G.render = yn;
var bn = {
  root: function(n) {
    var t = n.instance, o = n.props;
    return ["p-accordionpanel", {
      "p-accordionpanel-active": t.active,
      "p-disabled": o.disabled
    }];
  }
}, An = L.extend({
  name: "accordionpanel",
  classes: bn
}), $n = {
  name: "BaseAccordionPanel",
  extends: K,
  props: {
    value: {
      type: [String, Number],
      default: void 0
    },
    disabled: {
      type: Boolean,
      default: !1
    },
    as: {
      type: [String, Object],
      default: "DIV"
    },
    asChild: {
      type: Boolean,
      default: !1
    }
  },
  style: An,
  provide: function() {
    return {
      $pcAccordionPanel: this,
      $parentInstance: this
    };
  }
}, J = {
  name: "AccordionPanel",
  extends: $n,
  inheritAttrs: !1,
  inject: ["$pcAccordion"],
  computed: {
    active: function() {
      return this.$pcAccordion.isItemActive(this.value);
    },
    attrs: function() {
      return d(this.a11yAttrs, this.ptmi("root", this.ptParams));
    },
    a11yAttrs: function() {
      return {
        "data-pc-name": "accordionpanel",
        "data-p-disabled": this.disabled,
        "data-p-active": this.active
      };
    },
    ptParams: function() {
      return {
        context: {
          active: this.active
        }
      };
    }
  }
};
function Pn(e, n, t, o, a, r) {
  return e.asChild ? y(e.$slots, "default", {
    key: 1,
    class: k(e.cx("root")),
    active: r.active,
    a11yAttrs: r.a11yAttrs
  }) : (u(), h(g(e.as), d({
    key: 0,
    class: e.cx("root")
  }, r.attrs), {
    default: m(function() {
      return [y(e.$slots, "default")];
    }),
    _: 3
  }, 16, ["class"]));
}
J.render = Pn;
var Cn = `
    .p-accordionpanel {
        display: flex;
        flex-direction: column;
        border-style: solid;
        border-width: dt('accordion.panel.border.width');
        border-color: dt('accordion.panel.border.color');
    }

    .p-accordionheader {
        all: unset;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: dt('accordion.header.padding');
        color: dt('accordion.header.color');
        background: dt('accordion.header.background');
        border-style: solid;
        border-width: dt('accordion.header.border.width');
        border-color: dt('accordion.header.border.color');
        font-weight: dt('accordion.header.font.weight');
        border-radius: dt('accordion.header.border.radius');
        transition:
            background dt('accordion.transition.duration'),
            color dt('accordion.transition.duration'),
            outline-color dt('accordion.transition.duration'),
            box-shadow dt('accordion.transition.duration');
        outline-color: transparent;
    }

    .p-accordionpanel:first-child > .p-accordionheader {
        border-width: dt('accordion.header.first.border.width');
        border-start-start-radius: dt('accordion.header.first.top.border.radius');
        border-start-end-radius: dt('accordion.header.first.top.border.radius');
    }

    .p-accordionpanel:last-child > .p-accordionheader {
        border-end-start-radius: dt('accordion.header.last.bottom.border.radius');
        border-end-end-radius: dt('accordion.header.last.bottom.border.radius');
    }

    .p-accordionpanel:last-child.p-accordionpanel-active > .p-accordionheader {
        border-end-start-radius: dt('accordion.header.last.active.bottom.border.radius');
        border-end-end-radius: dt('accordion.header.last.active.bottom.border.radius');
    }

    .p-accordionheader-toggle-icon {
        color: dt('accordion.header.toggle.icon.color');
    }

    .p-accordionpanel:not(.p-disabled) .p-accordionheader:focus-visible {
        box-shadow: dt('accordion.header.focus.ring.shadow');
        outline: dt('accordion.header.focus.ring.width') dt('accordion.header.focus.ring.style') dt('accordion.header.focus.ring.color');
        outline-offset: dt('accordion.header.focus.ring.offset');
    }

    .p-accordionpanel:not(.p-accordionpanel-active):not(.p-disabled) > .p-accordionheader:hover {
        background: dt('accordion.header.hover.background');
        color: dt('accordion.header.hover.color');
    }

    .p-accordionpanel:not(.p-accordionpanel-active):not(.p-disabled) .p-accordionheader:hover .p-accordionheader-toggle-icon {
        color: dt('accordion.header.toggle.icon.hover.color');
    }

    .p-accordionpanel:not(.p-disabled).p-accordionpanel-active > .p-accordionheader {
        background: dt('accordion.header.active.background');
        color: dt('accordion.header.active.color');
    }

    .p-accordionpanel:not(.p-disabled).p-accordionpanel-active > .p-accordionheader .p-accordionheader-toggle-icon {
        color: dt('accordion.header.toggle.icon.active.color');
    }

    .p-accordionpanel:not(.p-disabled).p-accordionpanel-active > .p-accordionheader:hover {
        background: dt('accordion.header.active.hover.background');
        color: dt('accordion.header.active.hover.color');
    }

    .p-accordionpanel:not(.p-disabled).p-accordionpanel-active > .p-accordionheader:hover .p-accordionheader-toggle-icon {
        color: dt('accordion.header.toggle.icon.active.hover.color');
    }

    .p-accordioncontent {
        display: grid;
        grid-template-rows: 1fr;
    }

    .p-accordioncontent-wrapper {
        min-height: 0;
    }

    .p-accordioncontent-content {
        border-style: solid;
        border-width: dt('accordion.content.border.width');
        border-color: dt('accordion.content.border.color');
        background-color: dt('accordion.content.background');
        color: dt('accordion.content.color');
        padding: dt('accordion.content.padding');
    }
`, wn = {
  root: "p-accordion p-component"
}, Tn = L.extend({
  name: "accordion",
  style: Cn,
  classes: wn
}), kn = {
  name: "BaseAccordion",
  extends: K,
  props: {
    value: {
      type: [String, Number, Array],
      default: void 0
    },
    multiple: {
      type: Boolean,
      default: !1
    },
    lazy: {
      type: Boolean,
      default: !1
    },
    tabindex: {
      type: Number,
      default: 0
    },
    selectOnFocus: {
      type: Boolean,
      default: !1
    },
    expandIcon: {
      type: String,
      default: void 0
    },
    collapseIcon: {
      type: String,
      default: void 0
    },
    // @deprecated since v4.
    activeIndex: {
      type: [Number, Array],
      default: null
    }
  },
  style: Tn,
  provide: function() {
    return {
      $pcAccordion: this,
      $parentInstance: this
    };
  }
}, pe = {
  name: "Accordion",
  extends: kn,
  inheritAttrs: !1,
  emits: ["update:value", "update:activeIndex", "tab-open", "tab-close", "tab-click"],
  data: function() {
    return {
      d_value: this.value
    };
  },
  watch: {
    value: function(n) {
      this.d_value = n;
    },
    activeIndex: {
      immediate: !0,
      handler: function(n) {
        this.hasAccordionTab && (this.d_value = this.multiple ? n?.map(String) : n?.toString());
      }
    }
  },
  methods: {
    isItemActive: function(n) {
      var t;
      return this.multiple ? (t = this.d_value) === null || t === void 0 ? void 0 : t.includes(n) : this.d_value === n;
    },
    updateValue: function(n) {
      var t, o = this.isItemActive(n);
      this.multiple ? o ? this.d_value = this.d_value.filter(function(a) {
        return a !== n;
      }) : this.d_value ? this.d_value.push(n) : this.d_value = [n] : this.d_value = o ? null : n, this.$emit("update:value", this.d_value), this.$emit("update:activeIndex", this.multiple ? (t = this.d_value) === null || t === void 0 ? void 0 : t.map(Number) : Number(this.d_value)), this.$emit(o ? "tab-close" : "tab-open", {
        originalEvent: void 0,
        index: Number(n)
      });
    },
    // @deprecated since v4. Use new structure instead.
    isAccordionTab: function(n) {
      return n.type.name === "AccordionTab";
    },
    getTabProp: function(n, t) {
      return n.props ? n.props[t] : void 0;
    },
    getKey: function(n, t) {
      return this.getTabProp(n, "header") || t;
    },
    getHeaderPT: function(n, t) {
      var o = this;
      return {
        root: d({
          onClick: function(r) {
            return o.onTabClick(r, t);
          }
        }, this.getTabProp(n, "headerProps"), this.getTabPT(n, "header", t)),
        toggleicon: d(this.getTabProp(n, "headeractionprops"), this.getTabPT(n, "headeraction", t))
      };
    },
    getContentPT: function(n, t) {
      return {
        root: d(this.getTabProp(n, "contentProps"), this.getTabPT(n, "toggleablecontent", t)),
        transition: this.getTabPT(n, "transition", t),
        content: this.getTabPT(n, "content", t)
      };
    },
    getTabPT: function(n, t, o) {
      var a = this.tabs.length, r = {
        props: n.props || {},
        parent: {
          instance: this,
          props: this.$props,
          state: this.$data
        },
        context: {
          index: o,
          count: a,
          first: o === 0,
          last: o === a - 1,
          active: this.isItemActive("".concat(o))
        }
      };
      return d(this.ptm("accordiontab.".concat(t), r), this.ptmo(this.getTabProp(n, "pt"), t, r));
    },
    onTabClick: function(n, t) {
      this.$emit("tab-click", {
        originalEvent: n,
        index: t
      });
    }
  },
  computed: {
    // @deprecated since v4.
    tabs: function() {
      var n = this;
      return this.$slots.default().reduce(function(t, o) {
        return n.isAccordionTab(o) ? t.push(o) : o.children && o.children instanceof Array && o.children.forEach(function(a) {
          n.isAccordionTab(a) && t.push(a);
        }), t;
      }, []);
    },
    hasAccordionTab: function() {
      return this.tabs.length;
    }
  },
  components: {
    AccordionPanel: J,
    AccordionHeader: G,
    AccordionContent: Q,
    ChevronUpIcon: Z,
    ChevronRightIcon: le
  }
};
function In(e, n, t, o, a, r) {
  var v = H("AccordionHeader"), I = H("AccordionContent"), _ = H("AccordionPanel");
  return u(), $("div", d({
    class: e.cx("root")
  }, e.ptmi("root")), [r.hasAccordionTab ? (u(!0), $(Se, {
    key: 0
  }, De(r.tabs, function(l, p) {
    return u(), h(_, {
      key: r.getKey(l, p),
      value: "".concat(p),
      pt: {
        root: r.getTabPT(l, "root", p)
      },
      disabled: r.getTabProp(l, "disabled")
    }, {
      default: m(function() {
        return [w(v, {
          class: k(r.getTabProp(l, "headerClass")),
          pt: r.getHeaderPT(l, p)
        }, {
          toggleicon: m(function(N) {
            return [N.active ? (u(), h(g(e.$slots.collapseicon ? e.$slots.collapseicon : e.collapseIcon ? "span" : "ChevronDownIcon"), d({
              key: 0,
              class: [e.collapseIcon, N.class],
              "aria-hidden": "true"
            }, {
              ref_for: !0
            }, r.getTabPT(l, "headericon", p)), null, 16, ["class"])) : (u(), h(g(e.$slots.expandicon ? e.$slots.expandicon : e.expandIcon ? "span" : "ChevronUpIcon"), d({
              key: 1,
              class: [e.expandIcon, N.class],
              "aria-hidden": "true"
            }, {
              ref_for: !0
            }, r.getTabPT(l, "headericon", p)), null, 16, ["class"]))];
          }),
          default: m(function() {
            return [l.children && l.children.headericon ? (u(), h(g(l.children.headericon), {
              key: 0,
              isTabActive: r.isItemActive("".concat(p)),
              active: r.isItemActive("".concat(p)),
              index: p
            }, null, 8, ["isTabActive", "active", "index"])) : D("", !0), l.props && l.props.header ? (u(), $("span", d({
              key: 1,
              ref_for: !0
            }, r.getTabPT(l, "headertitle", p)), ie(l.props.header), 17)) : D("", !0), l.children && l.children.header ? (u(), h(g(l.children.header), {
              key: 2
            })) : D("", !0)];
          }),
          _: 2
        }, 1032, ["class", "pt"]), w(I, {
          pt: r.getContentPT(l, p)
        }, {
          default: m(function() {
            return [(u(), h(g(l)))];
          }),
          _: 2
        }, 1032, ["pt"])];
      }),
      _: 2
    }, 1032, ["value", "pt", "disabled"]);
  }), 128)) : y(e.$slots, "default", {
    key: 1
  })], 16);
}
pe.render = In;
const zn = /* @__PURE__ */ Ue({
  __name: "Disclosure",
  props: /* @__PURE__ */ Ke({
    label: {}
  }, {
    open: { type: Boolean, default: !1 },
    openModifiers: {}
  }),
  emits: ["update:open"],
  setup(e) {
    const n = Ee(e, "open");
    return (t, o) => (u(), h(x(pe), {
      class: "kx-disclosure",
      value: n.value ? "content" : void 0,
      "onUpdate:value": o[0] || (o[0] = (a) => n.value = a === "content")
    }, {
      default: m(() => [
        w(x(J), { value: "content" }, {
          default: m(() => [
            w(x(G), { class: "kx-disclosure-toggle" }, {
              default: m(() => [
                Le(ie(e.label), 1)
              ]),
              _: 1
            }),
            w(x(Q), { pt: {
              transition: { name: "kx-disclosure-motion" },
              contentWrapper: { class: "kx-disclosure-content" }
            } }, {
              default: m(() => [
                y(t.$slots, "default")
              ]),
              _: 3
            })
          ]),
          _: 3
        })
      ]),
      _: 3
    }, 8, ["value"]));
  }
});
export {
  te as A,
  zn as _,
  En as a,
  Mn as b,
  Bn as c,
  jn as d,
  Fn as e,
  Hn as f,
  Rn as g,
  On as h,
  Wn as i,
  qe as l,
  Un as p,
  Kn as r,
  Ln as s,
  qn as t,
  Nn as u
};
