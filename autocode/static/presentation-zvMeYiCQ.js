import { api as b, on as g } from "@wippy-fe/proxy";
import { o as s, r as E, g as R, f as A, s as c, i as P, l as _, j as S, h as u, k as M, w as j, m as q, p as N, q as F, v as L, x as W, y as B } from "./dto-BNKl23sa.js";
import { watch as O, onUnmounted as y, nextTick as z, ref as G, readonly as H } from "vue";
const J = "/api/v1/autocode", m = s({ kind: c().optional(), code: c().optional(), retryable: A().optional(), details: E(R()).optional() }), K = m.extend({ success: _(!1), error: P([c(), m.extend({ message: c() })]) });
class v extends Error {
  kind;
  code;
  retryable;
  details;
  constructor(n, t) {
    super(n), this.name = "ApiError", this.kind = t.kind, this.details = t.details, this.code = t.code ?? (typeof t.details?.code == "string" ? t.details.code : void 0), this.retryable = t.retryable;
  }
}
function C(e) {
  const n = K.safeParse(e);
  if (!n.success) return;
  const t = n.data;
  return typeof t.error == "string" ? new v(t.error, t) : new v(t.error.message, { ...t, ...t.error });
}
const l = s({ success: _(!0) });
function Q(e, n) {
  const t = C(e);
  if (t) throw t;
  l.parse(e);
  const r = n.safeParse(e);
  if (!r.success) throw new Error(`Invalid API response: ${r.error.issues.map((a) => a.path.join(".") + ": " + a.message).join("; ")}`);
  return r.data;
}
async function T(e, n, t, r) {
  try {
    const i = (e === "get" || e === "delete" ? await b[e](n) : await b[e](n, r)).data;
    return Q(i, t);
  } catch (a) {
    const i = s({ response: s({ data: R() }) }).safeParse(a);
    throw i.success ? C(i.data.response.data) ?? new Error("Invalid API error response.") : a instanceof Error ? a : new Error("Request failed.");
  }
}
function o(e, n, t, r) {
  return T(e, J + n, t, r);
}
async function ee(e) {
  if (!e.length) return {};
  const n = await T("post", "/api/v1/principals/resolve", s({ principals: u(s({ id: c(), label: c() })) }), { refs: e.map((t) => ({ type: "user", id: t })) });
  return Object.fromEntries(n.principals.map((t) => [t.id, t.label]));
}
const d = s({ id: c() }), k = d.extend({ build_error: m.extend({ message: c() }).optional() }), te = {
  profiles: () => o("get", "/profiles", s({ profiles: u(F) })).then((e) => e.profiles),
  createProfile: (e) => o("post", "/profiles", d, e),
  updateProfile: (e, n) => o("put", `/profiles/${encodeURIComponent(e)}`, d, n),
  deleteProfile: (e) => o("delete", `/profiles/${encodeURIComponent(e)}`, l),
  catalog: () => o("get", "/catalog", B),
  accounts: () => o("get", "/accounts", s({ accounts: u(N) })).then((e) => e.accounts),
  createAccount: (e) => o("post", "/accounts", d, e),
  updateAccount: (e, n) => o("put", `/accounts/${encodeURIComponent(e)}`, d.extend({ health_error: m.extend({ message: c() }).optional() }), n),
  deleteAccount: (e) => o("delete", `/accounts/${encodeURIComponent(e)}`, l),
  images: () => o("get", "/images", s({ images: u(q) })).then((e) => e.images),
  image: (e) => o("get", `/images/${encodeURIComponent(e)}`, W),
  createImage: (e) => o("post", "/images", k, e),
  updateImage: (e, n) => o("put", `/images/${encodeURIComponent(e)}`, k, n),
  deleteImage: (e, n) => o("delete", `/images/${encodeURIComponent(e)}${n ? "?remove=1" : ""}`, l),
  prepareImage: (e) => o("post", `/images/${encodeURIComponent(e)}/prepare`, l),
  prune: () => o("post", "/maintenance/prune", s({ output: c() })).then((e) => e.output),
  workspaces: () => o("get", "/workspaces", s({ workspaces: u(j), roots: u(c()).optional() })),
  createWorkspace: (e) => o("post", "/workspaces", d, e),
  deleteWorkspace: (e) => o("delete", `/workspaces/${encodeURIComponent(e)}`, l),
  runs: (e) => o("get", `/runs${e ? "?cursor=" + encodeURIComponent(e) : ""}`, s({ runs: u(M), next_cursor: c().optional() })),
  run: (e, n, t) => o("get", `/runs/${encodeURIComponent(e)}?${t === void 0 ? `after_seq=${n ?? 0}` : `before_seq=${t}`}`, L),
  startRun: (e) => o("post", "/runs", s({ run_id: c(), notification_error: S.optional() }), e),
  cancelRun: (e) => o("post", `/runs/${encodeURIComponent(e)}/cancel`, l)
}, V = {
  runs: (e) => g("chestor.autocode.runs", e),
  run: (e, n) => g(`chestor.autocode.run.${e}`, n),
  component: (e, n) => g(`component.${e}`, n)
};
function ne(e, n = () => !0) {
  let t = null, r = !1;
  const a = async () => {
    try {
      do
        r = !1, await e();
      while (r && n());
    } finally {
      t = null;
    }
  };
  return () => n() ? t ? (r = !0, t) : (t = a(), t) : Promise.resolve();
}
async function oe(e, n, t, r, a, i) {
  let p = await e();
  const $ = async () => {
    if (!r()) return !1;
    const I = n(p), D = I.some((U) => !t.value.includes(U));
    return t.value = I, await z(), r() && a(p), D;
  };
  return await $() && r() && (p = await e(), await $() && r() && i()), p;
}
function re(e, n) {
  const t = /* @__PURE__ */ new Map();
  O(e, (r) => {
    const a = new Set(r);
    for (const [i, p] of t)
      a.has(i) || (p(), t.delete(i));
    for (const i of a)
      t.has(i) || t.set(i, V.component(i, n));
  }, { immediate: !0 }), y(() => {
    for (const r of t.values()) r();
    t.clear();
  });
}
function ae() {
  let e = !0;
  return y(() => {
    e = !1;
  }), () => e;
}
function se(e, n = Date.now()) {
  return e.enabled ? e.rate_limits?.windows.some((t) => t.status === "rejected" && t.resets_at !== void 0 && t.resets_at * 1e3 > n) || e.cooldown_until && Date.parse(e.cooldown_until) > n ? "cooling" : e.usable ? "ready" : "unavailable" : "disabled";
}
function ie(e) {
  if (!e) return "";
  const n = new Date(e);
  return Number.isNaN(n.getTime()) ? e : n.toLocaleString(void 0, { dateStyle: "short", timeStyle: "short" });
}
function ce(e, n) {
  return e instanceof Error && e.message ? e.message : n;
}
const w = G(Date.now());
let h = 0, f;
function ue() {
  return h++, f === void 0 && (w.value = Date.now(), f = setInterval(() => {
    w.value = Date.now();
  }, 1e3)), y(() => {
    h--, h || (clearInterval(f), f = void 0);
  }), H(w);
}
function le(e, n) {
  return n.find((t) => t.id === e)?.icon || "tabler:terminal-2";
}
function pe(e, n = Date.now()) {
  const t = Math.max(0, Math.floor((n - Date.parse(e)) / 1e3));
  return Number.isFinite(t) ? t < 60 ? "just now" : t < 3600 ? `${Math.floor(t / 60)}m ago` : t < 86400 ? `${Math.floor(t / 3600)}h ago` : `${Math.floor(t / 86400)}d ago` : "";
}
function x(e) {
  if (!Number.isFinite(e) || e < 0) return "—";
  const n = Math.round(e / 1e3);
  if (n < 60) return `${n}s`;
  const t = Math.floor(n / 60);
  return t < 60 ? `${t}m ${String(n % 60).padStart(2, "0")}s` : `${Math.floor(t / 60)}h ${String(t % 60).padStart(2, "0")}m`;
}
function de(e, n = Date.now()) {
  if (!e.started_at) return "—";
  const r = e.status === "running" || e.status === "queued" ? n - Date.parse(e.started_at) : Date.parse(e.finished_at) - Date.parse(e.started_at);
  return x(r);
}
function fe(e) {
  return `${x(e).replace(/ 00[ms]$/, "")} timeout`;
}
export {
  v as A,
  te as a,
  le as b,
  ae as c,
  se as d,
  ce as e,
  ie as f,
  ue as g,
  pe as h,
  de as i,
  V as l,
  ee as p,
  oe as r,
  ne as s,
  fe as t,
  re as u
};
