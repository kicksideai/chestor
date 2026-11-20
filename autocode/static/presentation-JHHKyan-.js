import { api as R, on as h } from "@wippy-fe/proxy";
import { o as a, f as E, s, d as u, g as M, w as j, i as q, h as _, j as N, l as F, p as L, n as T, r as v, u as $, c as W, k as U, m as B, q as O, v as z, x as G } from "./dto-PQMIoW9W.js";
import { watch as H, onUnmounted as b, nextTick as J, readonly as K, ref as Q } from "vue";
const V = "/api/v1/autocode", m = a({ kind: s().optional(), code: s().optional(), retryable: W().optional(), details: v($()).optional() }), X = m.extend({ success: U(!1), error: B([s(), m.extend({ message: s() })]) });
class x extends Error {
  kind;
  code;
  retryable;
  details;
  constructor(n, t) {
    super(n), this.name = "ApiError", this.kind = t.kind, this.details = t.details, this.code = t.code ?? (typeof t.details?.code == "string" ? t.details.code : void 0), this.retryable = t.retryable;
  }
}
function D(e) {
  const n = X.safeParse(e);
  if (!n.success) return;
  const t = n.data;
  return typeof t.error == "string" ? new x(t.error, t) : new x(t.error.message, { ...t, ...t.error });
}
const l = a({ success: U(!0) });
function Y(e, n) {
  const t = D(e);
  if (t) throw t;
  l.parse(e);
  const r = n.safeParse(e);
  if (!r.success) throw new Error(`Invalid API response: ${r.error.issues.map((i) => i.path.join(".") + ": " + i.message).join("; ")}`);
  return r.data;
}
async function g(e, n, t, r) {
  try {
    const c = (e === "get" || e === "delete" ? await R[e](n) : await R[e](n, r)).data;
    return Y(c, t);
  } catch (i) {
    const c = a({ response: a({ data: $() }) }).safeParse(i);
    throw c.success ? D(c.data.response.data) ?? new Error("Invalid API error response.") : i instanceof Error ? i : new Error("Request failed.");
  }
}
function o(e, n, t, r) {
  return g(e, V + n, t, r);
}
async function re(e) {
  if (!e.length) return {};
  const n = await g("post", "/api/v1/principals/resolve", a({ principals: u(a({ id: s(), label: s() })) }), { refs: e.map((t) => ({ type: "user", id: t })) });
  return Object.fromEntries(n.principals.map((t) => [t.id, t.label]));
}
const d = a({ id: s() }), C = d.extend({ build_error: m.extend({ message: s() }).optional() }), Z = a({ id: s(), title: s(), description: s(), web_component: s().optional(), context_schema: a({ properties: v(v($())).optional(), required: u(s()).optional() }).passthrough().optional() }), ae = {
  traits: () => g("get", "/api/v1/agents/traits", a({ traits: u(Z) })).then((e) => e.traits),
  toolSurface: (e, n) => o("post", "/tool-surface", a({ count: T().int().nonnegative(), limit: T().int().positive() }), { agent: e, tools: n }),
  profiles: () => o("get", "/profiles", a({ profiles: u(L) })).then((e) => e.profiles),
  createProfile: (e) => o("post", "/profiles", d, e),
  updateProfile: (e, n) => o("put", `/profiles/${encodeURIComponent(e)}`, d, n),
  deleteProfile: (e) => o("delete", `/profiles/${encodeURIComponent(e)}`, l),
  catalog: () => o("get", "/catalog", G),
  limits: () => o("get", "/limits", a({ settings: u(F) })).then((e) => e.settings),
  saveLimit: (e, n) => g("put", "/api/v1/settings", l, { namespace: "chestor.autocode", key: e, value: n }),
  managedAccounts: (e) => o(
    "get",
    "/management/accounts" + (e ? "?" + new URLSearchParams(e).toString() : ""),
    a({ accounts: u(_), providers: u(N), agent: s().optional() })
  ),
  accounts: () => o("get", "/accounts", a({ accounts: u(_) })).then((e) => e.accounts),
  createAccount: (e) => o("post", "/accounts", d, e),
  updateAccount: (e, n) => o("put", `/accounts/${encodeURIComponent(e)}`, d.extend({ health_error: m.extend({ message: s() }).optional() }), n),
  deleteAccount: (e) => o("delete", `/accounts/${encodeURIComponent(e)}`, l),
  images: () => o("get", "/images", a({ images: u(q) })).then((e) => e.images),
  image: (e) => o("get", `/images/${encodeURIComponent(e)}`, z),
  createImage: (e) => o("post", "/images", C, e),
  updateImage: (e, n) => o("put", `/images/${encodeURIComponent(e)}`, C, n),
  deleteImage: (e, n) => o("delete", `/images/${encodeURIComponent(e)}${n ? "?remove=1" : ""}`, l),
  prepareImage: (e) => o("post", `/images/${encodeURIComponent(e)}/prepare`, l),
  prune: () => o("post", "/maintenance/prune", a({ output: s() })).then((e) => e.output),
  workspaces: () => o("get", "/workspaces", a({ workspaces: u(j), roots: u(s()).optional() })),
  createWorkspace: (e) => o("post", "/workspaces", d, e),
  deleteWorkspace: (e) => o("delete", `/workspaces/${encodeURIComponent(e)}`, l),
  runs: (e) => o("get", `/runs${e ? "?cursor=" + encodeURIComponent(e) : ""}`, a({ runs: u(M), next_cursor: s().optional() })),
  run: (e, n, t) => o("get", `/runs/${encodeURIComponent(e)}?${t === void 0 ? `after_seq=${n ?? 0}` : `before_seq=${t}`}`, O),
  startRun: (e) => o("post", "/runs", a({ run_id: s(), notification_error: E.optional() }), e),
  cancelRun: (e) => o("post", `/runs/${encodeURIComponent(e)}/cancel`, l)
}, ee = {
  runs: (e) => h("chestor.autocode.runs", e),
  run: (e, n) => h(`chestor.autocode.run.${e}`, n),
  component: (e, n) => h(`component.${e}`, n)
};
function se(e, n = () => !0) {
  let t = null, r = !1;
  const i = async () => {
    try {
      do
        r = !1, await e();
      while (r && n());
    } finally {
      t = null;
    }
  };
  return () => n() ? t ? (r = !0, t) : (t = i(), t) : Promise.resolve();
}
async function ie(e, n, t, r, i, c) {
  let p = await e();
  const I = async () => {
    if (!r()) return !1;
    const k = n(p), P = k.some((A) => !t.value.includes(A));
    return t.value = k, await J(), r() && i(p), P;
  };
  return await I() && r() && (p = await e(), await I() && r() && c()), p;
}
function ce(e, n) {
  const t = /* @__PURE__ */ new Map();
  H(e, (r) => {
    const i = new Set(r);
    for (const [c, p] of t)
      i.has(c) || (p(), t.delete(c));
    for (const c of i)
      t.has(c) || t.set(c, ee.component(c, n));
  }, { immediate: !0 }), b(() => {
    for (const r of t.values()) r();
    t.clear();
  });
}
function ue() {
  let e = !0;
  return b(() => {
    e = !1;
  }), () => e;
}
function le(e, n = Date.now()) {
  return e.enabled ? e.rate_limits?.windows.some((t) => t.status === "rejected" && t.resets_at !== void 0 && t.resets_at * 1e3 > n) || e.cooldown_until && Date.parse(e.cooldown_until) > n ? "cooling" : e.usable ? "ready" : "unavailable" : "disabled";
}
function pe(e) {
  if (!e) return "";
  const n = new Date(e);
  return Number.isNaN(n.getTime()) ? e : n.toLocaleString(void 0, { dateStyle: "short", timeStyle: "short" });
}
function de(e, n) {
  return e instanceof Error && e.message ? e.message : n;
}
const w = Q(Date.now());
let y = 0, f;
function fe() {
  return y++, f === void 0 && (w.value = Date.now(), f = setInterval(() => {
    w.value = Date.now();
  }, 1e3)), b(() => {
    y--, y || (clearInterval(f), f = void 0);
  }), K(w);
}
function me(e, n) {
  return n.find((t) => t.id === e)?.icon || "tabler:terminal-2";
}
function ge(e, n = Date.now()) {
  const t = Math.max(0, Math.floor((n - Date.parse(e)) / 1e3));
  return Number.isFinite(t) ? t < 60 ? "just now" : t < 3600 ? `${Math.floor(t / 60)}m ago` : t < 86400 ? `${Math.floor(t / 3600)}h ago` : `${Math.floor(t / 86400)}d ago` : "";
}
function S(e) {
  if (!Number.isFinite(e) || e < 0) return "—";
  const n = Math.round(e / 1e3);
  if (n < 60) return `${n}s`;
  const t = Math.floor(n / 60);
  return t < 60 ? `${t}m ${String(n % 60).padStart(2, "0")}s` : `${Math.floor(t / 60)}h ${String(t % 60).padStart(2, "0")}m`;
}
function he(e, n = Date.now()) {
  if (!e.started_at) return "—";
  const r = e.status === "running" || e.status === "queued" ? n - Date.parse(e.started_at) : Date.parse(e.finished_at) - Date.parse(e.started_at);
  return S(r);
}
function we(e) {
  return `${S(e).replace(/ 00[ms]$/, "")} timeout`;
}
export {
  x as A,
  ae as a,
  me as b,
  ue as c,
  fe as d,
  de as e,
  le as f,
  pe as g,
  ge as h,
  he as i,
  ee as l,
  re as p,
  ie as r,
  se as s,
  we as t,
  ce as u
};
