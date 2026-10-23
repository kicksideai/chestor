import { on as c, api as o } from "@wippy-fe/proxy";
const u = "/api/v1/autocode";
function p(e, t = Date.now()) {
  return e.enabled ? e.cooldown_until && Date.parse(e.cooldown_until) > t ? "cooling" : "ready" : "disabled";
}
function g(e) {
  if (!e) return "";
  const t = new Date(e);
  return Number.isNaN(t.getTime()) ? e : t.toLocaleString(void 0, { dateStyle: "short", timeStyle: "short" });
}
async function r(e, t, n) {
  try {
    const a = (e === "get" || e === "delete" ? await o[e](u + t) : await o[e](u + t, n)).data;
    if (!a?.success) throw new Error(a?.error || "Request failed.");
    return a;
  } catch (s) {
    const a = s?.response?.data?.error;
    throw new Error(a || (s instanceof Error ? s.message : "Request failed."));
  }
}
const d = {
  runs: (e) => c("chestor.autocode.runs", e),
  run: (e, t) => c(`chestor.autocode.run.${e}`, t),
  component: (e, t) => c(`component.${e}`, t)
};
function m(e) {
  let t = null, n = !1;
  const s = async () => {
    try {
      do
        n = !1, await e();
      while (n);
    } finally {
      t = null;
    }
  };
  return () => t ? (n = !0, t) : (t = s(), t);
}
function i(e, t) {
  const n = encodeURIComponent(e);
  return {
    resource_id: e,
    access_url: `/api/v1/component-access/grants/${n}`,
    share_url: `/api/v1/component-access/share/${n}`,
    title: t
  };
}
async function f(e) {
  const { data: t } = await o.get(i(e, "").access_url);
  if (!t?.success) throw new Error(t?.error || "Could not load the grants.");
  return t.access.filter((n) => !n.owner).length;
}
async function w(e) {
  if (!e.length) return {};
  const { data: t } = await o.post("/api/v1/principals/resolve", { refs: e.map((n) => ({ type: "user", id: n })) });
  if (!t?.success) throw new Error(t?.error || "Could not resolve the owners.");
  return Object.fromEntries(t.principals.map((n) => [n.id, n.label]));
}
function h(e, t) {
  return e instanceof Error && e.message ? e.message : t;
}
const $ = {
  catalog: () => r("get", "/catalog"),
  accounts: () => r("get", "/accounts").then((e) => e.accounts),
  createAccount: (e) => r("post", "/accounts", e),
  updateAccount: (e, t) => r("put", `/accounts/${e}`, t),
  deleteAccount: (e) => r("delete", `/accounts/${e}`),
  images: () => r("get", "/images").then((e) => e.images),
  image: (e) => r("get", `/images/${e}`),
  createImage: (e) => r("post", "/images", e),
  updateImage: (e, t) => r("put", `/images/${e}`, t),
  deleteImage: (e, t) => r("delete", `/images/${e}${t ? "?remove=1" : ""}`),
  prepareImage: (e) => r("post", `/images/${e}/prepare`),
  prune: () => r("post", "/maintenance/prune").then((e) => e.output),
  workspaces: () => r("get", "/workspaces"),
  createWorkspace: (e) => r("post", "/workspaces", e),
  deleteWorkspace: (e) => r("delete", `/workspaces/${e}`),
  drivers: () => r("get", "/drivers").then((e) => e.drivers),
  runs: () => r("get", "/runs").then((e) => e.runs),
  run: (e, t) => r("get", `/runs/${e}?after=${t}`),
  startRun: (e) => r("post", "/runs", e),
  cancelRun: (e) => r("post", `/runs/${e}/cancel`)
};
export {
  $ as a,
  m as b,
  p as c,
  g as d,
  h as e,
  f as g,
  d as l,
  w as p,
  i as s
};
//# sourceMappingURL=api-xHIs_Oef.js.map
