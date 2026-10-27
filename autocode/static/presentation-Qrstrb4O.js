import { on as d, api as h } from "@wippy-fe/proxy";
import { o, r as R, g as $, e as D, s as a, h as T, l as I, i as u, j as C, k as U, w as E, m as S, p as _, q as x, t as A, v as M } from "./dto-BHfrzLGW.js";
import { ref as j, onUnmounted as P, readonly as q } from "vue";
const N = "/api/v1/autocode";
function G(e, t = Date.now()) {
  return e.enabled ? e.cooldown_until && Date.parse(e.cooldown_until) > t ? "cooling" : e.usable ? "ready" : "unavailable" : "disabled";
}
function H(e) {
  if (!e) return "";
  const t = new Date(e);
  return Number.isNaN(t.getTime()) ? e : t.toLocaleString(void 0, { dateStyle: "short", timeStyle: "short" });
}
const g = o({ kind: a().optional(), code: a().optional(), retryable: D().optional(), details: R($()).optional() }), F = g.extend({ success: I(!1), error: T([a(), g.extend({ message: a() })]) });
class y extends Error {
  kind;
  code;
  retryable;
  details;
  constructor(t, r) {
    super(t), this.name = "ApiError", this.kind = r.kind, this.details = r.details, this.code = r.code ?? (typeof r.details?.code == "string" ? r.details.code : void 0), this.retryable = r.retryable;
  }
}
function v(e) {
  const t = F.safeParse(e);
  if (!t.success) return;
  const r = t.data;
  return typeof r.error == "string" ? new y(r.error, r) : new y(r.error.message, { ...r, ...r.error });
}
const c = o({ success: I(!0) });
function L(e, t) {
  const r = v(e);
  if (r) throw r;
  c.parse(e);
  const s = t.safeParse(e);
  if (!s.success) throw new Error(`Invalid API response: ${s.error.issues.map((i) => i.path.join(".") + ": " + i.message).join("; ")}`);
  return s.data;
}
async function b(e, t, r, s) {
  try {
    const l = (e === "get" || e === "delete" ? await h[e](t) : await h[e](t, s)).data;
    return L(l, r);
  } catch (i) {
    const l = o({ response: o({ data: $() }) }).safeParse(i);
    throw l.success ? v(l.data.response.data) ?? new Error("Invalid API error response.") : i instanceof Error ? i : new Error("Request failed.");
  }
}
function n(e, t, r, s) {
  return b(e, N + t, r, s);
}
const J = {
  runs: (e) => d("chestor.autocode.runs", e),
  run: (e, t) => d(`chestor.autocode.run.${e}`, t),
  component: (e, t) => d(`component.${e}`, t)
};
function K(e) {
  let t = null, r = !1;
  const s = async () => {
    try {
      do
        r = !1, await e();
      while (r);
    } finally {
      t = null;
    }
  };
  return () => t ? (r = !0, t) : (t = s(), t);
}
async function Q(e) {
  if (!e.length) return {};
  const t = await b("post", "/api/v1/principals/resolve", o({ principals: u(o({ id: a(), label: a() })) }), { refs: e.map((r) => ({ type: "user", id: r })) });
  return Object.fromEntries(t.principals.map((r) => [r.id, r.label]));
}
function V(e, t) {
  return e instanceof Error && e.message ? e.message : t;
}
const w = o({ id: a() }), W = w.extend({ build_error: g.extend({ message: a() }).optional() }), X = {
  catalog: () => n("get", "/catalog", M),
  accounts: () => n("get", "/accounts", o({ accounts: u(_) })).then((e) => e.accounts),
  createAccount: (e) => n("post", "/accounts", w, e),
  updateAccount: (e, t) => n("put", `/accounts/${encodeURIComponent(e)}`, c, t),
  deleteAccount: (e) => n("delete", `/accounts/${encodeURIComponent(e)}`, c),
  images: () => n("get", "/images", o({ images: u(S) })).then((e) => e.images),
  image: (e) => n("get", `/images/${encodeURIComponent(e)}`, A),
  createImage: (e) => n("post", "/images", W, e),
  updateImage: (e, t) => n("put", `/images/${encodeURIComponent(e)}`, c, t),
  deleteImage: (e, t) => n("delete", `/images/${encodeURIComponent(e)}${t ? "?remove=1" : ""}`, c),
  prepareImage: (e) => n("post", `/images/${encodeURIComponent(e)}/prepare`, c),
  prune: () => n("post", "/maintenance/prune", o({ output: a() })).then((e) => e.output),
  workspaces: () => n("get", "/workspaces", o({ workspaces: u(E), roots: u(a()).optional() })),
  createWorkspace: (e) => n("post", "/workspaces", w, e),
  deleteWorkspace: (e) => n("delete", `/workspaces/${encodeURIComponent(e)}`, c),
  drivers: () => n("get", "/drivers", o({ drivers: u(U) })).then((e) => e.drivers),
  runs: (e) => n("get", `/runs${e ? "?cursor=" + encodeURIComponent(e) : ""}`, o({ runs: u(C), next_cursor: a().optional() })),
  run: (e, t) => n("get", `/runs/${encodeURIComponent(e)}?after_seq=${t}`, x),
  startRun: (e) => n("post", "/runs", o({ run_id: a() }), e),
  cancelRun: (e) => n("post", `/runs/${encodeURIComponent(e)}/cancel`, c)
}, m = j(Date.now());
let f = 0, p;
function Y() {
  return f++, p === void 0 && (m.value = Date.now(), p = setInterval(() => {
    m.value = Date.now();
  }, 1e3)), P(() => {
    f--, f || (clearInterval(p), p = void 0);
  }), q(m);
}
function Z(e, t) {
  return t.find((r) => r.id === e)?.icon || "tabler:terminal-2";
}
function ee(e, t = Date.now()) {
  const r = Math.max(0, Math.floor((t - Date.parse(e)) / 1e3));
  return Number.isFinite(r) ? r < 60 ? "just now" : r < 3600 ? `${Math.floor(r / 60)}m ago` : r < 86400 ? `${Math.floor(r / 3600)}h ago` : `${Math.floor(r / 86400)}d ago` : "";
}
function k(e) {
  if (!Number.isFinite(e) || e < 0) return "—";
  const t = Math.round(e / 1e3);
  if (t < 60) return `${t}s`;
  const r = Math.floor(t / 60);
  return r < 60 ? `${r}m ${String(t % 60).padStart(2, "0")}s` : `${Math.floor(r / 60)}h ${String(r % 60).padStart(2, "0")}m`;
}
function te(e, t = Date.now()) {
  if (!e.started_at) return "—";
  const s = e.status === "running" || e.status === "queued" ? t - Date.parse(e.started_at) : Date.parse(e.finished_at) - Date.parse(e.started_at);
  return k(s);
}
function re(e) {
  return `${k(e).replace(/ 00[ms]$/, "")} timeout`;
}
export {
  X as a,
  Z as b,
  G as c,
  H as d,
  V as e,
  te as f,
  J as l,
  Q as p,
  ee as r,
  K as s,
  re as t,
  Y as u
};
