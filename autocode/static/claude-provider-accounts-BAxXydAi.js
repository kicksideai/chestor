import { defineComponent as f, computed as _, openBlock as a, createElementBlock as s, Fragment as g, createVNode as p, toDisplayString as r, createCommentVNode as l, createBlock as v, withCtx as d, renderList as h, createElementVNode as n, createTextVNode as m } from "vue";
import { _ as w } from "./provider-accounts.vue_vue_type_script_setup_true_lang-Dcpi-bPZ.js";
import { _ as b } from "./Disclosure.vue_vue_type_script_setup_true_lang-CrWwplXA.js";
import { g as C } from "./accounts.vue_vue_type_script_setup_true_lang-BS36zsOI.js";
const k = {
  key: 0,
  class: "ac-hint"
}, x = { key: 0 }, y = /* @__PURE__ */ f({
  __name: "claude-account-usage",
  props: {
    account: {}
  },
  setup(o) {
    const u = o, e = _(() => {
      const t = u.account.rate_limits;
      return t?.overage_disabled_reason === "org_level_disabled" ? "Your organization has disabled extra usage. Wait for the reset or use another account." : t?.overage_status === "rejected" || t?.overage_disabled_reason ? "Extra usage is unavailable for this account. Wait for the reset or use another account." : t?.overage_status === "warning" ? "Claude is approaching its extra usage limit." : t?.is_using_overage ? "Claude is using extra usage." : t?.overage_status === "allowed" ? "Extra usage is available for this account." : "";
    }), i = _(() => !!u.account.rate_limits?.windows.length || !!e.value);
    return (t, E) => (a(), s(g, null, [
      p(C, { account: o.account }, null, 8, ["account"]),
      e.value ? (a(), s("p", k, r(e.value), 1)) : l("", !0),
      i.value ? (a(), v(b, {
        key: 1,
        class: "ac-account-details",
        label: "Usage details"
      }, {
        default: d(() => [
          (a(!0), s(g, null, h(o.account.rate_limits?.windows, (c) => (a(), s("div", {
            key: c.window
          }, [
            n("code", null, r(c.window) + " · " + r(c.status), 1)
          ]))), 128)),
          e.value ? (a(), s("div", x, [
            n("code", null, r(o.account.rate_limits?.overage_disabled_reason || o.account.rate_limits?.overage_status), 1)
          ])) : l("", !0)
        ]),
        _: 1
      })) : l("", !0)
    ], 64));
  }
}), D = /* @__PURE__ */ f({
  __name: "claude-provider-accounts",
  setup(o) {
    return (u, e) => (a(), v(w, { provider: "claude" }, {
      guide: d(() => [...e[0] || (e[0] = [
        n("p", { class: "ac-hint" }, "Connect your own Claude subscription to run tasks with Claude Code.", -1),
        n("ol", { class: "ac-setup-steps" }, [
          n("li", null, [
            m("Run "),
            n("code", null, "claude setup-token"),
            m(" in a terminal and sign in to your Claude account when the browser opens.")
          ]),
          n("li", null, "Paste the generated subscription token below. An existing Claude Code login file also works.")
        ], -1)
      ])]),
      usage: d(({ account: i }) => [
        p(y, { account: i }, null, 8, ["account"])
      ]),
      _: 1
    }));
  }
});
export {
  D as default
};
