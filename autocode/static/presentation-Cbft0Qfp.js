import { api as y, on as m } from "@wippy-fe/proxy";
import { o as c, r as D, g as I, f as C, s, h as _, l as k, i as u, j as U, w as A, k as E, m as S, p as M, q as P, t as j } from "./dto-CcYNmUR0.js";
import { watch as q, onUnmounted as h, nextTick as N, ref as F, readonly as L } from "vue";
const W = "/api/v1/autocode", p = c({ kind: s().optional(), code: s().optional(), retryable: C().optional(), details: D(I()).optional() }), B = p.extend({ success: k(!1), error: _([s(), p.extend({ message: s() })]) });
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
  const n = B.safeParse(e);
  if (!n.success) return;
  const t = n.data;
  return typeof t.error == "string" ? new $(t.error, t) : new $(t.error.message, { ...t, ...t.error });
}
const l = c({ success: k(!0) });
function O(e, n) {
  const t = v(e);
  if (t) throw t;
  l.parse(e);
  const r = n.safeParse(e);
  if (!r.success) throw new Error(`Invalid API response: ${r.error.issues.map((o) => o.path.join(".") + ": " + o.message).join("; ")}`);
  return r.data;
}
async function R(e, n, t, r) {
  try {
    const i = (e === "get" || e === "delete" ? await y[e](n) : await y[e](n, r)).data;
    return O(i, t);
  } catch (o) {
    const i = c({ response: c({ data: I() }) }).safeParse(o);
    throw i.success ? v(i.data.response.data) ?? new Error("Invalid API error response.") : o instanceof Error ? o : new Error("Request failed.");
  }
}
function a(e, n, t, r) {
  return R(e, W + n, t, r);
}
async function Q(e) {
  if (!e.length) return {};
  const n = await R("post", "/api/v1/principals/resolve", c({ principals: u(c({ id: s(), label: s() })) }), { refs: e.map((t) => ({ type: "user", id: t })) });
  return Object.fromEntries(n.principals.map((t) => [t.id, t.label]));
}
const f = c({ id: s() }), z = l.extend({ docker_error: p.extend({ message: s() }).optional() }), b = f.extend({ build_error: p.extend({ message: s() }).optional() }), V = {
  catalog: () => a("get", "/catalog", j),
  accounts: () => a("get", "/accounts", c({ accounts: u(S) })).then((e) => e.accounts),
  createAccount: (e) => a("post", "/accounts", f, e),
  updateAccount: (e, n) => a("put", `/accounts/${encodeURIComponent(e)}`, f.extend({ health_error: p.extend({ message: s() }).optional() }), n),
  deleteAccount: (e) => a("delete", `/accounts/${encodeURIComponent(e)}`, l),
  images: () => a("get", "/images", c({ images: u(E) })).then((e) => e.images),
  image: (e) => a("get", `/images/${encodeURIComponent(e)}`, P),
  createImage: (e) => a("post", "/images", b, e),
  updateImage: (e, n) => a("put", `/images/${encodeURIComponent(e)}`, b, n),
  deleteImage: (e, n) => a("delete", `/images/${encodeURIComponent(e)}${n ? "?remove=1" : ""}`, z),
  prepareImage: (e) => a("post", `/images/${encodeURIComponent(e)}/prepare`, l),
  prune: () => a("post", "/maintenance/prune", c({ output: s() })).then((e) => e.output),
  workspaces: () => a("get", "/workspaces", c({ workspaces: u(A), roots: u(s()).optional() })),
  createWorkspace: (e) => a("post", "/workspaces", f, e),
  deleteWorkspace: (e) => a("delete", `/workspaces/${encodeURIComponent(e)}`, l),
  runs: (e) => a("get", `/runs${e ? "?cursor=" + encodeURIComponent(e) : ""}`, c({ runs: u(U), next_cursor: s().optional() })),
  run: (e, n, t) => a("get", `/runs/${encodeURIComponent(e)}?${t === void 0 ? `after_seq=${n ?? 0}` : `before_seq=${t}`}`, M),
  startRun: (e) => a("post", "/runs", c({ run_id: s() }), e),
  cancelRun: (e) => a("post", `/runs/${encodeURIComponent(e)}/cancel`, l)
}, G = {
  runs: (e) => m("chestor.autocode.runs", e),
  run: (e, n) => m(`chestor.autocode.run.${e}`, n),
  component: (e, n) => m(`component.${e}`, n)
};
function X(e, n = () => !0) {
  let t = null, r = !1;
  const o = async () => {
    try {
      do
        r = !1, await e();
      while (r && n());
    } finally {
      t = null;
    }
  };
  return () => n() ? t ? (r = !0, t) : (t = o(), t) : Promise.resolve();
}
async function Y(e, n, t, r) {
  let o = await e();
  for (; r() && n(o).some((i) => !t.value.includes(i)); ) {
    if (t.value = n(o), await N(), !r()) return o;
    o = await e();
  }
  return r() && (t.value = n(o)), o;
}
function Z(e, n) {
  const t = /* @__PURE__ */ new Map();
  q(e, (r) => {
    const o = new Set(r);
    for (const [i, x] of t)
      o.has(i) || (x(), t.delete(i));
    for (const i of o)
      t.has(i) || t.set(i, G.component(i, n));
  }, { immediate: !0 }), h(() => {
    for (const r of t.values()) r();
    t.clear();
  });
}
function ee() {
  let e = !0;
  return h(() => {
    e = !1;
  }), () => e;
}
function te(e, n = Date.now()) {
  return e.enabled ? e.cooldown_until && Date.parse(e.cooldown_until) > n ? "cooling" : e.usable ? "ready" : "unavailable" : "disabled";
}
function ne(e) {
  if (!e) return "";
  const n = new Date(e);
  return Number.isNaN(n.getTime()) ? e : n.toLocaleString(void 0, { dateStyle: "short", timeStyle: "short" });
}
function re(e, n) {
  return e instanceof Error && e.message ? e.message : n;
}
const g = F(Date.now());
let w = 0, d;
function oe() {
  return w++, d === void 0 && (g.value = Date.now(), d = setInterval(() => {
    g.value = Date.now();
  }, 1e3)), h(() => {
    w--, w || (clearInterval(d), d = void 0);
  }), L(g);
}
function ae(e, n) {
  return n.find((t) => t.id === e)?.icon || "tabler:terminal-2";
}
function se(e, n = Date.now()) {
  const t = Math.max(0, Math.floor((n - Date.parse(e)) / 1e3));
  return Number.isFinite(t) ? t < 60 ? "just now" : t < 3600 ? `${Math.floor(t / 60)}m ago` : t < 86400 ? `${Math.floor(t / 3600)}h ago` : `${Math.floor(t / 86400)}d ago` : "";
}
function T(e) {
  if (!Number.isFinite(e) || e < 0) return "—";
  const n = Math.round(e / 1e3);
  if (n < 60) return `${n}s`;
  const t = Math.floor(n / 60);
  return t < 60 ? `${t}m ${String(n % 60).padStart(2, "0")}s` : `${Math.floor(t / 60)}h ${String(t % 60).padStart(2, "0")}m`;
}
function ie(e, n = Date.now()) {
  if (!e.started_at) return "—";
  const r = e.status === "running" || e.status === "queued" ? n - Date.parse(e.started_at) : Date.parse(e.finished_at) - Date.parse(e.started_at);
  return T(r);
}
function ce(e) {
  return `${T(e).replace(/ 00[ms]$/, "")} timeout`;
}
export {
  $ as A,
  V as a,
  ae as b,
  ee as c,
  te as d,
  re as e,
  ne as f,
  oe as g,
  se as h,
  ie as i,
  G as l,
  Q as p,
  Y as r,
  X as s,
  ce as t,
  Z as u
};
