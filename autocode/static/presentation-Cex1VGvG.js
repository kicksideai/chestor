import { api as _, on as g } from "@wippy-fe/proxy";
import { o as a, f as A, s, d as u, g as P, w as M, i as j, h as q, p as N, n as R, r as y, u as $, c as F, l as x, j as L, k as W, m as B, q as O } from "./dto-Bj1JIM6r.js";
import { onUnmounted as b, watch as z, nextTick as G, readonly as H, ref as J } from "vue";
const K = "/api/v1/autocode", m = a({ kind: s().optional(), code: s().optional(), retryable: F().optional(), details: y($()).optional() }), Q = m.extend({ success: x(!1), error: L([s(), m.extend({ message: s() })]) });
class T extends Error {
  kind;
  code;
  retryable;
  details;
  constructor(o, t) {
    super(o), this.name = "ApiError", this.kind = t.kind, this.details = t.details, this.code = t.code ?? (typeof t.details?.code == "string" ? t.details.code : void 0), this.retryable = t.retryable;
  }
}
function D(e) {
  const o = Q.safeParse(e);
  if (!o.success) return;
  const t = o.data;
  return typeof t.error == "string" ? new T(t.error, t) : new T(t.error.message, { ...t, ...t.error });
}
const l = a({ success: x(!0) });
function V(e, o) {
  const t = D(e);
  if (t) throw t;
  l.parse(e);
  const r = o.safeParse(e);
  if (!r.success) throw new Error(`Invalid API response: ${r.error.issues.map((i) => i.path.join(".") + ": " + i.message).join("; ")}`);
  return r.data;
}
async function v(e, o, t, r) {
  try {
    const c = (e === "get" || e === "delete" ? await _[e](o) : await _[e](o, r)).data;
    return V(c, t);
  } catch (i) {
    const c = a({ response: a({ data: $() }) }).safeParse(i);
    throw c.success ? D(c.data.response.data) ?? new Error("Invalid API error response.") : i instanceof Error ? i : new Error("Request failed.");
  }
}
function n(e, o, t, r) {
  return v(e, K + o, t, r);
}
async function oe(e) {
  if (!e.length) return {};
  const o = await v("post", "/api/v1/principals/resolve", a({ principals: u(a({ id: s(), label: s() })) }), { refs: e.map((t) => ({ type: "user", id: t })) });
  return Object.fromEntries(o.principals.map((t) => [t.id, t.label]));
}
const d = a({ id: s() }), C = d.extend({ build_error: m.extend({ message: s() }).optional() }), X = a({ id: s(), title: s(), description: s(), web_component: s().optional(), context_schema: a({ properties: y(y($())).optional(), required: u(s()).optional() }).passthrough().optional() }), ne = {
  traits: () => v("get", "/api/v1/agents/traits", a({ traits: u(X) })).then((e) => e.traits),
  toolSurface: (e, o) => n("post", "/tool-surface", a({ count: R().int().nonnegative(), limit: R().int().positive() }), { agent: e, tools: o }),
  profiles: () => n("get", "/profiles", a({ profiles: u(N) })).then((e) => e.profiles),
  createProfile: (e) => n("post", "/profiles", d, e),
  updateProfile: (e, o) => n("put", `/profiles/${encodeURIComponent(e)}`, d, o),
  deleteProfile: (e) => n("delete", `/profiles/${encodeURIComponent(e)}`, l),
  catalog: () => n("get", "/catalog", O),
  accounts: () => n("get", "/accounts", a({ accounts: u(q) })).then((e) => e.accounts),
  createAccount: (e) => n("post", "/accounts", d, e),
  updateAccount: (e, o) => n("put", `/accounts/${encodeURIComponent(e)}`, d.extend({ health_error: m.extend({ message: s() }).optional() }), o),
  deleteAccount: (e) => n("delete", `/accounts/${encodeURIComponent(e)}`, l),
  images: () => n("get", "/images", a({ images: u(j) })).then((e) => e.images),
  image: (e) => n("get", `/images/${encodeURIComponent(e)}`, B),
  createImage: (e) => n("post", "/images", C, e),
  updateImage: (e, o) => n("put", `/images/${encodeURIComponent(e)}`, C, o),
  deleteImage: (e, o) => n("delete", `/images/${encodeURIComponent(e)}${o ? "?remove=1" : ""}`, l),
  prepareImage: (e) => n("post", `/images/${encodeURIComponent(e)}/prepare`, l),
  prune: () => n("post", "/maintenance/prune", a({ output: s() })).then((e) => e.output),
  workspaces: () => n("get", "/workspaces", a({ workspaces: u(M), roots: u(s()).optional() })),
  createWorkspace: (e) => n("post", "/workspaces", d, e),
  deleteWorkspace: (e) => n("delete", `/workspaces/${encodeURIComponent(e)}`, l),
  runs: (e) => n("get", `/runs${e ? "?cursor=" + encodeURIComponent(e) : ""}`, a({ runs: u(P), next_cursor: s().optional() })),
  run: (e, o, t) => n("get", `/runs/${encodeURIComponent(e)}?${t === void 0 ? `after_seq=${o ?? 0}` : `before_seq=${t}`}`, W),
  startRun: (e) => n("post", "/runs", a({ run_id: s(), notification_error: A.optional() }), e),
  cancelRun: (e) => n("post", `/runs/${encodeURIComponent(e)}/cancel`, l)
}, Y = {
  runs: (e) => g("chestor.autocode.runs", e),
  run: (e, o) => g(`chestor.autocode.run.${e}`, o),
  component: (e, o) => g(`component.${e}`, o)
};
function re(e, o = () => !0) {
  let t = null, r = !1;
  const i = async () => {
    try {
      do
        r = !1, await e();
      while (r && o());
    } finally {
      t = null;
    }
  };
  return () => o() ? t ? (r = !0, t) : (t = i(), t) : Promise.resolve();
}
async function ae(e, o, t, r, i, c) {
  let p = await e();
  const I = async () => {
    if (!r()) return !1;
    const k = o(p), S = k.some((E) => !t.value.includes(E));
    return t.value = k, await G(), r() && i(p), S;
  };
  return await I() && r() && (p = await e(), await I() && r() && c()), p;
}
function se(e, o) {
  const t = /* @__PURE__ */ new Map();
  z(e, (r) => {
    const i = new Set(r);
    for (const [c, p] of t)
      i.has(c) || (p(), t.delete(c));
    for (const c of i)
      t.has(c) || t.set(c, Y.component(c, o));
  }, { immediate: !0 }), b(() => {
    for (const r of t.values()) r();
    t.clear();
  });
}
function ie() {
  let e = !0;
  return b(() => {
    e = !1;
  }), () => e;
}
function ce(e, o = Date.now()) {
  return e.enabled ? e.rate_limits?.windows.some((t) => t.status === "rejected" && t.resets_at !== void 0 && t.resets_at * 1e3 > o) || e.cooldown_until && Date.parse(e.cooldown_until) > o ? "cooling" : e.usable ? "ready" : "unavailable" : "disabled";
}
function ue(e) {
  if (!e) return "";
  const o = new Date(e);
  return Number.isNaN(o.getTime()) ? e : o.toLocaleString(void 0, { dateStyle: "short", timeStyle: "short" });
}
function le(e, o) {
  return e instanceof Error && e.message ? e.message : o;
}
const h = J(Date.now());
let w = 0, f;
function pe() {
  return w++, f === void 0 && (h.value = Date.now(), f = setInterval(() => {
    h.value = Date.now();
  }, 1e3)), b(() => {
    w--, w || (clearInterval(f), f = void 0);
  }), H(h);
}
function de(e, o) {
  return o.find((t) => t.id === e)?.icon || "tabler:terminal-2";
}
function fe(e, o = Date.now()) {
  const t = Math.max(0, Math.floor((o - Date.parse(e)) / 1e3));
  return Number.isFinite(t) ? t < 60 ? "just now" : t < 3600 ? `${Math.floor(t / 60)}m ago` : t < 86400 ? `${Math.floor(t / 3600)}h ago` : `${Math.floor(t / 86400)}d ago` : "";
}
function U(e) {
  if (!Number.isFinite(e) || e < 0) return "—";
  const o = Math.round(e / 1e3);
  if (o < 60) return `${o}s`;
  const t = Math.floor(o / 60);
  return t < 60 ? `${t}m ${String(o % 60).padStart(2, "0")}s` : `${Math.floor(t / 60)}h ${String(t % 60).padStart(2, "0")}m`;
}
function me(e, o = Date.now()) {
  if (!e.started_at) return "—";
  const r = e.status === "running" || e.status === "queued" ? o - Date.parse(e.started_at) : Date.parse(e.finished_at) - Date.parse(e.started_at);
  return U(r);
}
function ge(e) {
  return `${U(e).replace(/ 00[ms]$/, "")} timeout`;
}
export {
  T as A,
  ne as a,
  de as b,
  ie as c,
  ce as d,
  le as e,
  ue as f,
  pe as g,
  fe as h,
  me as i,
  Y as l,
  oe as p,
  ae as r,
  re as s,
  ge as t,
  se as u
};
