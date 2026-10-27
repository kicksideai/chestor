import { api as y, on as m } from "@wippy-fe/proxy";
import { o as s, r as x, g as I, f as C, s as a, h as _, l as k, i as u, j as U, w as A, k as E, m as S, p as M, q as P, t as j } from "./dto-CcYNmUR0.js";
import { watch as q, onUnmounted as w, ref as N, readonly as F } from "vue";
const L = "/api/v1/autocode", p = s({ kind: a().optional(), code: a().optional(), retryable: C().optional(), details: x(I()).optional() }), W = p.extend({ success: k(!1), error: _([a(), p.extend({ message: a() })]) });
class $ extends Error {
  kind;
  code;
  retryable;
  details;
  constructor(n, t) {
    super(n), this.name = "ApiError", this.kind = t.kind, this.details = t.details, this.code = t.code ?? (typeof t.details?.code == "string" ? t.details.code : void 0), this.retryable = t.retryable;
  }
}
function v(e) {
  const n = W.safeParse(e);
  if (!n.success) return;
  const t = n.data;
  return typeof t.error == "string" ? new $(t.error, t) : new $(t.error.message, { ...t, ...t.error });
}
const l = s({ success: k(!0) });
function B(e, n) {
  const t = v(e);
  if (t) throw t;
  l.parse(e);
  const r = n.safeParse(e);
  if (!r.success) throw new Error(`Invalid API response: ${r.error.issues.map((c) => c.path.join(".") + ": " + c.message).join("; ")}`);
  return r.data;
}
async function R(e, n, t, r) {
  try {
    const i = (e === "get" || e === "delete" ? await y[e](n) : await y[e](n, r)).data;
    return B(i, t);
  } catch (c) {
    const i = s({ response: s({ data: I() }) }).safeParse(c);
    throw i.success ? v(i.data.response.data) ?? new Error("Invalid API error response.") : c instanceof Error ? c : new Error("Request failed.");
  }
}
function o(e, n, t, r) {
  return R(e, L + n, t, r);
}
async function K(e) {
  if (!e.length) return {};
  const n = await R("post", "/api/v1/principals/resolve", s({ principals: u(s({ id: a(), label: a() })) }), { refs: e.map((t) => ({ type: "user", id: t })) });
  return Object.fromEntries(n.principals.map((t) => [t.id, t.label]));
}
const f = s({ id: a() }), O = l.extend({ docker_error: p.extend({ message: a() }).optional() }), b = f.extend({ build_error: p.extend({ message: a() }).optional() }), Q = {
  catalog: () => o("get", "/catalog", j),
  accounts: () => o("get", "/accounts", s({ accounts: u(S) })).then((e) => e.accounts),
  createAccount: (e) => o("post", "/accounts", f, e),
  updateAccount: (e, n) => o("put", `/accounts/${encodeURIComponent(e)}`, f.extend({ health_error: p.extend({ message: a() }).optional() }), n),
  deleteAccount: (e) => o("delete", `/accounts/${encodeURIComponent(e)}`, l),
  images: () => o("get", "/images", s({ images: u(E) })).then((e) => e.images),
  image: (e) => o("get", `/images/${encodeURIComponent(e)}`, P),
  createImage: (e) => o("post", "/images", b, e),
  updateImage: (e, n) => o("put", `/images/${encodeURIComponent(e)}`, b, n),
  deleteImage: (e, n) => o("delete", `/images/${encodeURIComponent(e)}${n ? "?remove=1" : ""}`, O),
  prepareImage: (e) => o("post", `/images/${encodeURIComponent(e)}/prepare`, l),
  prune: () => o("post", "/maintenance/prune", s({ output: a() })).then((e) => e.output),
  workspaces: () => o("get", "/workspaces", s({ workspaces: u(A), roots: u(a()).optional() })),
  createWorkspace: (e) => o("post", "/workspaces", f, e),
  deleteWorkspace: (e) => o("delete", `/workspaces/${encodeURIComponent(e)}`, l),
  runs: (e) => o("get", `/runs${e ? "?cursor=" + encodeURIComponent(e) : ""}`, s({ runs: u(U), next_cursor: a().optional() })),
  run: (e, n, t) => o("get", `/runs/${encodeURIComponent(e)}?${t === void 0 ? `after_seq=${n ?? 0}` : `before_seq=${t}`}`, M),
  startRun: (e) => o("post", "/runs", s({ run_id: a() }), e),
  cancelRun: (e) => o("post", `/runs/${encodeURIComponent(e)}/cancel`, l)
}, z = {
  runs: (e) => m("chestor.autocode.runs", e),
  run: (e, n) => m(`chestor.autocode.run.${e}`, n),
  component: (e, n) => m(`component.${e}`, n)
};
function V(e, n = () => !0) {
  let t = null, r = !1;
  const c = async () => {
    try {
      do
        r = !1, await e();
      while (r && n());
    } finally {
      t = null;
    }
  };
  return () => n() ? t ? (r = !0, t) : (t = c(), t) : Promise.resolve();
}
function X(e, n) {
  const t = /* @__PURE__ */ new Map();
  q(e, (r) => {
    const c = new Set(r);
    for (const [i, T] of t)
      c.has(i) || (T(), t.delete(i));
    for (const i of c)
      t.has(i) || t.set(i, z.component(i, n));
  }, { immediate: !0 }), w(() => {
    for (const r of t.values()) r();
    t.clear();
  });
}
function Y() {
  let e = !0;
  return w(() => {
    e = !1;
  }), () => e;
}
function Z(e, n = Date.now()) {
  return e.enabled ? e.cooldown_until && Date.parse(e.cooldown_until) > n ? "cooling" : e.usable ? "ready" : "unavailable" : "disabled";
}
function ee(e) {
  if (!e) return "";
  const n = new Date(e);
  return Number.isNaN(n.getTime()) ? e : n.toLocaleString(void 0, { dateStyle: "short", timeStyle: "short" });
}
function te(e, n) {
  return e instanceof Error && e.message ? e.message : n;
}
const g = N(Date.now());
let h = 0, d;
function ne() {
  return h++, d === void 0 && (g.value = Date.now(), d = setInterval(() => {
    g.value = Date.now();
  }, 1e3)), w(() => {
    h--, h || (clearInterval(d), d = void 0);
  }), F(g);
}
function oe(e, n) {
  return n.find((t) => t.id === e)?.icon || "tabler:terminal-2";
}
function re(e, n = Date.now()) {
  const t = Math.max(0, Math.floor((n - Date.parse(e)) / 1e3));
  return Number.isFinite(t) ? t < 60 ? "just now" : t < 3600 ? `${Math.floor(t / 60)}m ago` : t < 86400 ? `${Math.floor(t / 3600)}h ago` : `${Math.floor(t / 86400)}d ago` : "";
}
function D(e) {
  if (!Number.isFinite(e) || e < 0) return "—";
  const n = Math.round(e / 1e3);
  if (n < 60) return `${n}s`;
  const t = Math.floor(n / 60);
  return t < 60 ? `${t}m ${String(n % 60).padStart(2, "0")}s` : `${Math.floor(t / 60)}h ${String(t % 60).padStart(2, "0")}m`;
}
function ae(e, n = Date.now()) {
  if (!e.started_at) return "—";
  const r = e.status === "running" || e.status === "queued" ? n - Date.parse(e.started_at) : Date.parse(e.finished_at) - Date.parse(e.started_at);
  return D(r);
}
function se(e) {
  return `${D(e).replace(/ 00[ms]$/, "")} timeout`;
}
export {
  $ as A,
  Q as a,
  oe as b,
  Y as c,
  Z as d,
  te as e,
  ee as f,
  ne as g,
  ae as h,
  z as l,
  K as p,
  re as r,
  V as s,
  se as t,
  X as u
};
