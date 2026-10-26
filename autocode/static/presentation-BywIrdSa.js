import { on as m, api as h } from "@wippy-fe/proxy";
import { o, r as D, g as $, e as v, s, h as T, l as I, i as C, j as c, k as U, m as E, p as x, w as S, q as A, t as M, v as _, x as j } from "./dto-BwnY4_Sk.js";
import { ref as N, onUnmounted as P, readonly as q } from "vue";
const F = "/api/v1/autocode";
function H(e, t = Date.now()) {
  return e.enabled ? e.cooldown_until && Date.parse(e.cooldown_until) > t ? "cooling" : "ready" : "disabled";
}
function J(e) {
  if (!e) return "";
  const t = new Date(e);
  return Number.isNaN(t.getTime()) ? e : t.toLocaleString(void 0, { dateStyle: "short", timeStyle: "short" });
}
const w = o({ kind: s().optional(), code: s().optional(), retryable: v().optional(), details: D($()).optional() }), L = w.extend({ success: I(!1), error: T([s(), w.extend({ message: s() })]) });
class y extends Error {
  kind;
  code;
  retryable;
  details;
  constructor(t, r) {
    super(t), this.name = "ApiError", this.kind = r.kind, this.details = r.details, this.code = r.code ?? (typeof r.details?.code == "string" ? r.details.code : void 0), this.retryable = r.retryable;
  }
}
function b(e) {
  const t = L.safeParse(e);
  if (!t.success) return;
  const r = t.data;
  return typeof r.error == "string" ? new y(r.error, r) : new y(r.error.message, { ...r, ...r.error });
}
const i = o({ success: I(!0) });
function W(e, t) {
  const r = b(e);
  if (r) throw r;
  i.parse(e);
  const a = t.safeParse(e);
  if (!a.success) throw new Error(`Invalid API response: ${a.error.issues.map((u) => u.path.join(".") + ": " + u.message).join("; ")}`);
  return a.data;
}
async function k(e, t, r, a) {
  try {
    const p = (e === "get" || e === "delete" ? await h[e](t) : await h[e](t, a)).data;
    return W(p, r);
  } catch (u) {
    const p = o({ response: o({ data: $() }) }).safeParse(u);
    throw p.success ? b(p.data.response.data) ?? new Error("Invalid API error response.") : u instanceof Error ? u : new Error("Request failed.");
  }
}
function n(e, t, r, a) {
  return k(e, F + t, r, a);
}
const K = {
  runs: (e) => m("chestor.autocode.runs", e),
  run: (e, t) => m(`chestor.autocode.run.${e}`, t),
  component: (e, t) => m(`component.${e}`, t)
};
function Q(e) {
  let t = null, r = !1;
  const a = async () => {
    try {
      do
        r = !1, await e();
      while (r);
    } finally {
      t = null;
    }
  };
  return () => t ? (r = !0, t) : (t = a(), t);
}
async function V(e) {
  if (!e.length) return {};
  const t = await k("post", "/api/v1/principals/resolve", o({ principals: c(o({ id: s(), label: s() })) }), { refs: e.map((r) => ({ type: "user", id: r })) });
  return Object.fromEntries(t.principals.map((r) => [r.id, r.label]));
}
function X(e, t) {
  return e instanceof Error && e.message ? e.message : t;
}
const d = o({ id: s() }), B = d.extend({ build_error: w.extend({ message: s() }).optional() }), Y = {
  catalog: () => n("get", "/catalog", j),
  accounts: () => n("get", "/accounts", o({ accounts: c(M) })).then((e) => e.accounts),
  createAccount: (e) => n("post", "/accounts", d, e),
  updateAccount: (e, t) => n("put", `/accounts/${encodeURIComponent(e)}`, i, t),
  deleteAccount: (e) => n("delete", `/accounts/${encodeURIComponent(e)}`, i),
  images: () => n("get", "/images", o({ images: c(A) })).then((e) => e.images),
  image: (e) => n("get", `/images/${encodeURIComponent(e)}`, _),
  createImage: (e) => n("post", "/images", B, e),
  updateImage: (e, t) => n("put", `/images/${encodeURIComponent(e)}`, i, t),
  deleteImage: (e, t) => n("delete", `/images/${encodeURIComponent(e)}${t ? "?remove=1" : ""}`, i),
  prepareImage: (e) => n("post", `/images/${encodeURIComponent(e)}/prepare`, i),
  prune: () => n("post", "/maintenance/prune", o({ output: s() })).then((e) => e.output),
  workspaces: () => n("get", "/workspaces", o({ workspaces: c(S), roots: c(s()).optional() })),
  createWorkspace: (e) => n("post", "/workspaces", d, e),
  deleteWorkspace: (e) => n("delete", `/workspaces/${encodeURIComponent(e)}`, i),
  drivers: () => n("get", "/drivers", o({ drivers: c(x) })).then((e) => e.drivers),
  runs: (e) => n("get", `/runs${e ? "?cursor=" + encodeURIComponent(e) : ""}`, o({ runs: c(E), next_cursor: s().optional() })),
  run: (e, t) => n("get", `/runs/${encodeURIComponent(e)}?after=${t}`, o({ run: C, events: c(U), more: v() })),
  startRun: (e) => n("post", "/runs", d, e),
  cancelRun: (e) => n("post", `/runs/${encodeURIComponent(e)}/cancel`, i)
}, f = N(Date.now());
let g = 0, l;
function Z() {
  return g++, l === void 0 && (f.value = Date.now(), l = setInterval(() => {
    f.value = Date.now();
  }, 1e3)), P(() => {
    g--, g || (clearInterval(l), l = void 0);
  }), q(f);
}
function ee(e, t) {
  return t.find((r) => r.id === e)?.icon || "tabler:terminal-2";
}
function te(e, t = Date.now()) {
  const r = Math.max(0, Math.floor((t - Date.parse(e)) / 1e3));
  return Number.isFinite(r) ? r < 60 ? "just now" : r < 3600 ? `${Math.floor(r / 60)}m ago` : r < 86400 ? `${Math.floor(r / 3600)}h ago` : `${Math.floor(r / 86400)}d ago` : "";
}
function R(e) {
  if (!Number.isFinite(e) || e < 0) return "—";
  const t = Math.round(e / 1e3);
  if (t < 60) return `${t}s`;
  const r = Math.floor(t / 60);
  return r < 60 ? `${r}m ${String(t % 60).padStart(2, "0")}s` : `${Math.floor(r / 60)}h ${String(r % 60).padStart(2, "0")}m`;
}
function re(e, t = Date.now()) {
  if (!e.started_at) return "—";
  const a = e.status === "running" || e.status === "queued" ? t - Date.parse(e.started_at) : Date.parse(e.finished_at) - Date.parse(e.started_at);
  return R(a);
}
function ne(e) {
  return `${R(e).replace(/ 00[ms]$/, "")} timeout`;
}
export {
  Y as a,
  ee as b,
  H as c,
  J as d,
  X as e,
  re as f,
  K as l,
  V as p,
  te as r,
  Q as s,
  ne as t,
  Z as u
};
