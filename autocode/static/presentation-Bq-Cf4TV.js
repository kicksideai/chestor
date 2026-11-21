import { api as R, on as v } from "@wippy-fe/proxy";
import { f as S, o as a, n as f, l as m, s, g as T, h as q, d as u, i as N, w as F, j as L, c as A, k as C, m as W, p as B, q as O, r as b, u as _, v as z, x as G, y as H } from "./dto-CHThMR8e.js";
import { watch as J, onUnmounted as I, nextTick as K, readonly as Q, ref as V } from "vue";
const X = S([
  a({
    state: m("waiting"),
    ticket: s(),
    user_code: s(),
    verification_url: m("https://auth.openai.com/codex/device"),
    expires_at: f().int(),
    retry_after: f().int().positive()
  }),
  a({ state: T(["waiting", "rate_limited", "busy"]), retry_after: f().int().positive() }),
  a({ state: m("ready"), account_id: s() }),
  a({ state: T(["expired", "denied", "cancelled", "unavailable", "save_failed"]) })
]), Y = "/api/v1/autocode", h = a({ kind: s().optional(), code: s().optional(), retryable: A().optional(), details: b(_()).optional() }), Z = h.extend({ success: m(!1), error: S([s(), h.extend({ message: s() })]) });
class D extends Error {
  kind;
  code;
  retryable;
  details;
  constructor(n, t) {
    super(n), this.name = "ApiError", this.kind = t.kind, this.details = t.details, this.code = t.code ?? (typeof t.details?.code == "string" ? t.details.code : void 0), this.retryable = t.retryable;
  }
}
function P(e) {
  const n = Z.safeParse(e);
  if (!n.success) return;
  const t = n.data;
  return typeof t.error == "string" ? new D(t.error, t) : new D(t.error.message, { ...t, ...t.error });
}
const l = a({ success: m(!0) });
function ee(e, n) {
  const t = P(e);
  if (t) throw t;
  l.parse(e);
  const r = n.safeParse(e);
  if (!r.success) throw new Error(`Invalid API response: ${r.error.issues.map((i) => i.path.join(".") + ": " + i.message).join("; ")}`);
  return r.data;
}
async function w(e, n, t, r) {
  try {
    const c = (e === "get" || e === "delete" ? await R[e](n) : await R[e](n, r)).data;
    return ee(c, t);
  } catch (i) {
    const c = a({ response: a({ data: _() }) }).safeParse(i);
    throw c.success ? P(c.data.response.data) ?? new Error("Invalid API error response.") : i instanceof Error ? i : new Error("Request failed.");
  }
}
function o(e, n, t, r) {
  return w(e, Y + n, t, r);
}
async function se(e) {
  if (!e.length) return {};
  const n = await w("post", "/api/v1/principals/resolve", a({ principals: u(a({ id: s(), label: s() })) }), { refs: e.map((t) => ({ type: "user", id: t })) });
  return Object.fromEntries(n.principals.map((t) => [t.id, t.label]));
}
const p = a({ id: s() }), U = p.extend({ build_error: h.extend({ message: s() }).optional() }), te = a({ id: s(), title: s(), description: s(), web_component: s().optional(), context_schema: a({ properties: b(b(_())).optional(), required: u(s()).optional() }).passthrough().optional() }), ie = {
  traits: () => w("get", "/api/v1/agents/traits", a({ traits: u(te) })).then((e) => e.traits),
  toolSurface: (e, n) => o("post", "/tool-surface", a({ count: f().int().nonnegative(), limit: f().int().positive() }), { agent: e, tools: n }),
  profiles: () => o("get", "/profiles", a({ profiles: u(O) })).then((e) => e.profiles),
  createProfile: (e) => o("post", "/profiles", p, e),
  updateProfile: (e, n) => o("put", `/profiles/${encodeURIComponent(e)}`, p, n),
  deleteProfile: (e) => o("delete", `/profiles/${encodeURIComponent(e)}`, l),
  catalog: () => o("get", "/catalog", H),
  limits: () => o("get", "/limits", a({ settings: u(B) })).then((e) => e.settings),
  saveLimit: (e, n) => w("put", "/api/v1/settings", l, { namespace: "chestor.autocode", key: e, value: n }),
  managedAccounts: (e) => o(
    "get",
    "/management/accounts" + (e ? "?" + new URLSearchParams(e).toString() : ""),
    a({ accounts: u(C), providers: u(W), agent: s().optional() })
  ),
  codexDevice: (e) => o("post", "/management/accounts/codex/device", X, e),
  accounts: () => o("get", "/accounts", a({ accounts: u(C) })).then((e) => e.accounts),
  connectAccount: (e) => o("post", "/management/accounts/connect", p.extend({ checked: A() }), e),
  createAccount: (e) => o("post", "/accounts", p, e),
  updateAccount: (e, n) => o("put", `/accounts/${encodeURIComponent(e)}`, p.extend({ health_error: h.extend({ message: s() }).optional() }), n),
  deleteAccount: (e) => o("delete", `/accounts/${encodeURIComponent(e)}`, l),
  images: () => o("get", "/images", a({ images: u(L) })).then((e) => e.images),
  image: (e) => o("get", `/images/${encodeURIComponent(e)}`, G),
  createImage: (e) => o("post", "/images", U, e),
  updateImage: (e, n) => o("put", `/images/${encodeURIComponent(e)}`, U, n),
  deleteImage: (e, n) => o("delete", `/images/${encodeURIComponent(e)}${n ? "?remove=1" : ""}`, l),
  prepareImage: (e) => o("post", `/images/${encodeURIComponent(e)}/prepare`, l),
  prune: () => o("post", "/maintenance/prune", a({ output: s() })).then((e) => e.output),
  workspaces: () => o("get", "/workspaces", a({ workspaces: u(F), roots: u(s()).optional() })),
  createWorkspace: (e) => o("post", "/workspaces", p, e),
  deleteWorkspace: (e) => o("delete", `/workspaces/${encodeURIComponent(e)}`, l),
  runs: (e) => o("get", `/runs${e ? "?cursor=" + encodeURIComponent(e) : ""}`, a({ runs: u(N), next_cursor: s().optional() })),
  run: (e, n, t) => o("get", `/runs/${encodeURIComponent(e)}?${t === void 0 ? `after_seq=${n ?? 0}` : `before_seq=${t}`}`, z),
  startRun: (e) => o("post", "/runs", a({ run_id: s(), notification_error: q.optional() }), e),
  cancelRun: (e) => o("post", `/runs/${encodeURIComponent(e)}/cancel`, l)
}, ne = {
  runs: (e) => v("chestor.autocode.runs", e),
  run: (e, n) => v(`chestor.autocode.run.${e}`, n),
  component: (e, n) => v(`component.${e}`, n)
};
function ce(e, n = () => !0) {
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
async function ue(e, n, t, r, i, c) {
  let d = await e();
  const k = async () => {
    if (!r()) return !1;
    const x = n(d), M = x.some((j) => !t.value.includes(j));
    return t.value = x, await K(), r() && i(d), M;
  };
  return await k() && r() && (d = await e(), await k() && r() && c()), d;
}
function le(e, n) {
  const t = /* @__PURE__ */ new Map();
  J(e, (r) => {
    const i = new Set(r);
    for (const [c, d] of t)
      i.has(c) || (d(), t.delete(c));
    for (const c of i)
      t.has(c) || t.set(c, ne.component(c, n));
  }, { immediate: !0 }), I(() => {
    for (const r of t.values()) r();
    t.clear();
  });
}
function pe() {
  let e = !0;
  return I(() => {
    e = !1;
  }), () => e;
}
function de(e, n = Date.now()) {
  return e.enabled ? e.rate_limits?.windows.some((t) => t.status === "rejected" && t.resets_at !== void 0 && t.resets_at * 1e3 > n) || e.cooldown_until && Date.parse(e.cooldown_until) > n ? "cooling" : e.usable ? "ready" : "unavailable" : "disabled";
}
function fe(e) {
  if (!e) return "";
  const n = new Date(e);
  return Number.isNaN(n.getTime()) ? e : n.toLocaleString(void 0, { dateStyle: "short", timeStyle: "short" });
}
function me(e, n) {
  return e instanceof Error && e.message ? e.message : n;
}
const y = V(Date.now());
let $ = 0, g;
function ge() {
  return $++, g === void 0 && (y.value = Date.now(), g = setInterval(() => {
    y.value = Date.now();
  }, 1e3)), I(() => {
    $--, $ || (clearInterval(g), g = void 0);
  }), Q(y);
}
function he(e, n) {
  return n.find((t) => t.id === e)?.icon || "tabler:terminal-2";
}
function we(e, n = Date.now()) {
  const t = Math.max(0, Math.floor((n - Date.parse(e)) / 1e3));
  return Number.isFinite(t) ? t < 60 ? "just now" : t < 3600 ? `${Math.floor(t / 60)}m ago` : t < 86400 ? `${Math.floor(t / 3600)}h ago` : `${Math.floor(t / 86400)}d ago` : "";
}
function E(e) {
  if (!Number.isFinite(e) || e < 0) return "—";
  const n = Math.round(e / 1e3);
  if (n < 60) return `${n}s`;
  const t = Math.floor(n / 60);
  return t < 60 ? `${t}m ${String(n % 60).padStart(2, "0")}s` : `${Math.floor(t / 60)}h ${String(t % 60).padStart(2, "0")}m`;
}
function ve(e, n = Date.now()) {
  if (!e.started_at) return "—";
  const r = e.status === "running" || e.status === "queued" ? n - Date.parse(e.started_at) : Date.parse(e.finished_at) - Date.parse(e.started_at);
  return E(r);
}
function ye(e) {
  return `${E(e).replace(/ 00[ms]$/, "")} timeout`;
}
export {
  D as A,
  ie as a,
  he as b,
  pe as c,
  ge as d,
  me as e,
  de as f,
  fe as g,
  we as h,
  ve as i,
  ne as l,
  se as p,
  ue as r,
  ce as s,
  ye as t,
  le as u
};
