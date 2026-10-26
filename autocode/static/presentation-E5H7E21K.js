import { on as m, api as h } from "@wippy-fe/proxy";
import { o, r as T, g as v, e as I, s, h as E, l as k, i as w, j as c, k as U, m as C, w as S, p as A, q as M, t as j, v as x } from "./dto-FYq6oVap.js";
import { ref as _, onUnmounted as N, readonly as P } from "vue";
const q = "/api/v1/autocode";
function z(e, t = Date.now()) {
  return e.enabled ? e.cooldown_until && Date.parse(e.cooldown_until) > t ? "cooling" : "ready" : "disabled";
}
function G(e) {
  if (!e) return "";
  const t = new Date(e);
  return Number.isNaN(t.getTime()) ? e : t.toLocaleString(void 0, { dateStyle: "short", timeStyle: "short" });
}
const y = o({ kind: s().optional(), code: s().optional(), retryable: I().optional(), details: T(v()).optional() }), F = y.extend({ success: k(!1), error: E([s(), y.extend({ message: s() })]) });
class $ extends Error {
  kind;
  code;
  retryable;
  details;
  constructor(t, r) {
    super(t), this.name = "ApiError", this.kind = r.kind, this.details = r.details, this.code = r.code ?? (typeof r.details?.code == "string" ? r.details.code : void 0), this.retryable = r.retryable;
  }
}
function b(e) {
  const t = F.safeParse(e);
  if (!t.success) return;
  const r = t.data;
  return typeof r.error == "string" ? new $(r.error, r) : new $(r.error.message, { ...r, ...r.error });
}
const i = o({ success: k(!0) });
function L(e, t) {
  const r = b(e);
  if (r) throw r;
  i.parse(e);
  const a = t.safeParse(e);
  if (!a.success) throw new Error(`Invalid API response: ${a.error.issues.map((u) => u.path.join(".") + ": " + u.message).join("; ")}`);
  return a.data;
}
async function D(e, t, r, a) {
  try {
    const p = (e === "get" || e === "delete" ? await h[e](t) : await h[e](t, a)).data;
    return L(p, r);
  } catch (u) {
    const p = o({ response: o({ data: v() }) }).safeParse(u);
    throw p.success ? b(p.data.response.data) ?? new Error("Invalid API error response.") : u instanceof Error ? u : new Error("Request failed.");
  }
}
function n(e, t, r, a) {
  return D(e, q + t, r, a);
}
const H = {
  runs: (e) => m("chestor.autocode.runs", e),
  run: (e, t) => m(`chestor.autocode.run.${e}`, t),
  component: (e, t) => m(`component.${e}`, t)
};
function J(e) {
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
async function K(e) {
  if (!e.length) return {};
  const t = await D("post", "/api/v1/principals/resolve", o({ principals: c(o({ id: s(), label: s() })) }), { refs: e.map((r) => ({ type: "user", id: r })) });
  return Object.fromEntries(t.principals.map((r) => [r.id, r.label]));
}
function Q(e, t) {
  return e instanceof Error && e.message ? e.message : t;
}
const l = o({ id: s() }), V = {
  catalog: () => n("get", "/catalog", x),
  accounts: () => n("get", "/accounts", o({ accounts: c(M) })).then((e) => e.accounts),
  createAccount: (e) => n("post", "/accounts", l, e),
  updateAccount: (e, t) => n("put", `/accounts/${encodeURIComponent(e)}`, i, t),
  deleteAccount: (e) => n("delete", `/accounts/${encodeURIComponent(e)}`, i),
  images: () => n("get", "/images", o({ images: c(A) })).then((e) => e.images),
  image: (e) => n("get", `/images/${encodeURIComponent(e)}`, j),
  createImage: (e) => n("post", "/images", l, e),
  updateImage: (e, t) => n("put", `/images/${encodeURIComponent(e)}`, i, t),
  deleteImage: (e, t) => n("delete", `/images/${encodeURIComponent(e)}${t ? "?remove=1" : ""}`, i),
  prepareImage: (e) => n("post", `/images/${encodeURIComponent(e)}/prepare`, i),
  prune: () => n("post", "/maintenance/prune", o({ output: s() })).then((e) => e.output),
  workspaces: () => n("get", "/workspaces", o({ workspaces: c(S), roots: c(s()) })),
  createWorkspace: (e) => n("post", "/workspaces", l, e),
  deleteWorkspace: (e) => n("delete", `/workspaces/${encodeURIComponent(e)}`, i),
  drivers: () => n("get", "/drivers", o({ drivers: c(C) })).then((e) => e.drivers),
  runs: () => n("get", "/runs", o({ runs: c(w) })).then((e) => e.runs),
  run: (e, t) => n("get", `/runs/${encodeURIComponent(e)}?after=${t}`, o({ run: w, events: c(U), more: I() })),
  startRun: (e) => n("post", "/runs", l, e),
  cancelRun: (e) => n("post", `/runs/${encodeURIComponent(e)}/cancel`, i)
}, f = _(Date.now());
let g = 0, d;
function X() {
  return g++, d === void 0 && (f.value = Date.now(), d = setInterval(() => {
    f.value = Date.now();
  }, 1e3)), N(() => {
    g--, g || (clearInterval(d), d = void 0);
  }), P(f);
}
function Y(e, t) {
  return t.find((r) => r.id === e)?.icon || "tabler:terminal-2";
}
function Z(e, t = Date.now()) {
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
function ee(e, t = Date.now()) {
  if (!e.started_at) return "—";
  const a = e.status === "running" || e.status === "queued" ? t - Date.parse(e.started_at) : Date.parse(e.finished_at) - Date.parse(e.started_at);
  return R(a);
}
function te(e) {
  return `${R(e).replace(/ 00[ms]$/, "")} timeout`;
}
export {
  V as a,
  Y as b,
  z as c,
  G as d,
  Q as e,
  ee as f,
  H as l,
  K as p,
  Z as r,
  J as s,
  te as t,
  X as u
};
