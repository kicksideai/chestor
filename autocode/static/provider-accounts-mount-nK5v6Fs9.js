import { u as l, a as d, P as p } from "./wc-runtime-DbdXH-lj.js";
import { defineComponent as u, unref as e, openBlock as o, createElementBlock as t, createTextVNode as m, toDisplayString as _, createVNode as k, createBlock as g } from "vue";
import { d as v, b as y, c as f } from "./accounts.vue_vue_type_script_setup_true_lang-C1ytlcgv.js";
const x = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, C = {
  key: 1,
  class: "kx-err",
  role: "alert"
}, P = {
  key: 2,
  class: "kx-loading",
  role: "status"
}, h = /* @__PURE__ */ u({
  __name: "provider-accounts",
  setup(B) {
    const r = l(), i = d(), { catalog: s, error: n, load: c } = v();
    return (I, a) => e(r).providerId ? e(n) && !e(s) ? (o(), t("p", C, [
      m(_(e(n)) + " ", 1),
      k(e(y), {
        label: "Retry",
        severity: "secondary",
        text: "",
        size: "small",
        onClick: e(c)
      }, null, 8, ["onClick"])
    ])) : e(s) ? (o(), g(f, {
      key: e(r).providerId,
      query: "",
      "selected-agent": "",
      management: "",
      "provider-id": e(r).providerId,
      onChanged: a[0] || (a[0] = (V) => e(i)("connection-saved", { success: !0 }))
    }, null, 8, ["provider-id"])) : (o(), t("p", P, "Loading accounts…")) : (o(), t("p", x, "A provider is required."));
  }
}), N = {
  rootComponent: h,
  plugins: [p]
};
export {
  N as mountConfig
};
