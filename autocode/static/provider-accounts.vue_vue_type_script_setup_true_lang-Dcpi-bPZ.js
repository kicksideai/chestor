import { defineComponent as k, unref as e, openBlock as r, createElementBlock as a, createTextVNode as y, toDisplayString as f, createVNode as _, createBlock as $, createSlots as C, withCtx as n, renderSlot as i, normalizeProps as c, guardReactiveProps as u } from "vue";
import { f as h, s as B, e as I } from "./accounts.vue_vue_type_script_setup_true_lang-BS36zsOI.js";
import { u as P, a as S } from "./wc-runtime-CvWl7e3g.js";
const q = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, x = {
  key: 1,
  class: "kx-err",
  role: "alert"
}, z = {
  key: 2,
  class: "kx-loading",
  role: "status"
}, V = /* @__PURE__ */ k({
  __name: "provider-accounts",
  props: {
    provider: {}
  },
  setup(m) {
    const t = P(), v = S(), { catalog: d, error: l, load: g } = h();
    return (o, p) => e(t).providerId ? e(l) && !e(d) ? (r(), a("p", x, [
      y(f(e(l)) + " ", 1),
      _(e(B), {
        label: "Retry",
        severity: "secondary",
        text: "",
        size: "small",
        onClick: e(g)
      }, null, 8, ["onClick"])
    ])) : e(d) ? (r(), $(I, {
      key: e(t).providerId,
      query: "",
      "selected-agent": "",
      management: "",
      "provider-id": e(t).providerId,
      provider: m.provider,
      onChanged: p[0] || (p[0] = (s) => e(v)("connection-saved", { success: !0 }))
    }, C({ _: 2 }, [
      o.$slots.guide ? {
        name: "guide",
        fn: n(() => [
          i(o.$slots, "guide")
        ]),
        key: "0"
      } : void 0,
      o.$slots.usage ? {
        name: "usage",
        fn: n((s) => [
          i(o.$slots, "usage", c(u(s)))
        ]),
        key: "1"
      } : void 0,
      o.$slots.setup ? {
        name: "setup",
        fn: n((s) => [
          i(o.$slots, "setup", c(u(s)))
        ]),
        key: "2"
      } : void 0
    ]), 1032, ["provider-id", "provider"])) : (r(), a("p", z, "Loading accounts…")) : (r(), a("p", q, "A provider is required."));
  }
});
export {
  V as _
};
