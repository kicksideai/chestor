import { defineComponent as f, computed as _, openBlock as s, createElementBlock as n, Fragment as g, createVNode as p, toDisplayString as r, createCommentVNode as l, createElementVNode as e, renderList as h, createBlock as w, withCtx as m, createTextVNode as v } from "vue";
import { _ as k } from "./provider-accounts.vue_vue_type_script_setup_true_lang-DHbWoS7X.js";
import { i as x } from "./accounts.vue_vue_type_script_setup_true_lang-DBO9rQIp.js";
const C = {
  key: 0,
  class: "ac-hint"
}, b = {
  key: 1,
  class: "ac-account-details"
}, y = { key: 0 }, E = /* @__PURE__ */ f({
  __name: "claude-account-usage",
  props: {
    account: {}
  },
  setup(o) {
    const u = o, t = _(() => {
      const a = u.account.rate_limits;
      return a?.overage_disabled_reason === "org_level_disabled" ? "Your organization has disabled extra usage. Wait for the reset or use another account." : a?.overage_status === "rejected" || a?.overage_disabled_reason ? "Extra usage is unavailable for this account. Wait for the reset or use another account." : a?.overage_status === "warning" ? "Claude is approaching its extra usage limit." : a?.is_using_overage ? "Claude is using extra usage." : a?.overage_status === "allowed" ? "Extra usage is available for this account." : "";
    }), i = _(() => !!u.account.rate_limits?.windows.length || !!t.value);
    return (a, d) => (s(), n(g, null, [
      p(x, { account: o.account }, null, 8, ["account"]),
      t.value ? (s(), n("p", C, r(t.value), 1)) : l("", !0),
      i.value ? (s(), n("details", b, [
        d[0] || (d[0] = e("summary", { class: "kx-focus-outline" }, "Usage details", -1)),
        (s(!0), n(g, null, h(o.account.rate_limits?.windows, (c) => (s(), n("div", {
          key: c.window
        }, [
          e("code", null, r(c.window) + " · " + r(c.status), 1)
        ]))), 128)),
        t.value ? (s(), n("div", y, [
          e("code", null, r(o.account.rate_limits?.overage_disabled_reason || o.account.rate_limits?.overage_status), 1)
        ])) : l("", !0)
      ])) : l("", !0)
    ], 64));
  }
}), $ = /* @__PURE__ */ f({
  __name: "claude-provider-accounts",
  setup(o) {
    return (u, t) => (s(), w(k, { provider: "claude" }, {
      guide: m(() => [...t[0] || (t[0] = [
        e("p", { class: "ac-hint" }, "Connect your own Claude subscription to run tasks with Claude Code.", -1),
        e("ol", { class: "ac-setup-steps" }, [
          e("li", null, [
            v("Run "),
            e("code", null, "claude setup-token"),
            v(" in a terminal and sign in to your Claude account when the browser opens.")
          ]),
          e("li", null, "Paste the generated subscription token below. An existing Claude Code login file also works.")
        ], -1)
      ])]),
      usage: m(({ account: i }) => [
        p(E, { account: i }, null, 8, ["account"])
      ]),
      _: 1
    }));
  }
});
export {
  $ as default
};
