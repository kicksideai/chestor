import { defineComponent as U, ref as m, computed as E, onBeforeUnmount as W, openBlock as s, createElementBlock as h, Fragment as O, createElementVNode as i, toDisplayString as w, createVNode as o, unref as l, withCtx as r, createTextVNode as P, createBlock as b, createCommentVNode as V, resolveDynamicComponent as j } from "vue";
import { _ as Y } from "./provider-accounts.vue_vue_type_script_setup_true_lang-DHbWoS7X.js";
import { Icon as q } from "@iconify/vue";
import { d as G, j as S } from "./accounts.vue_vue_type_script_setup_true_lang-DBO9rQIp.js";
import { s as H } from "./index-Db2E5nsu.js";
import { a as B } from "./presentation-Bq-Cf4TV.js";
const J = {
  class: "ac-stack",
  "aria-label": "ChatGPT sign-in"
}, K = { class: "ac-device-code" }, L = {
  class: "ac-muted",
  role: "status"
}, M = { class: "ac-setup-actions" }, Q = {
  key: 0,
  class: "ac-field"
}, X = { class: "ac-setup-actions" }, Z = /* @__PURE__ */ U({
  __name: "codex-device-setup",
  props: {
    account: {},
    labelBytes: {}
  },
  emits: ["busy", "saved"],
  setup(g, { emit: k }) {
    const _ = g, c = k, u = m(_.account?.label ?? "Codex"), n = m(), t = m("start"), C = E(() => !!n.value), x = E(() => !!u.value.trim() && new TextEncoder().encode(u.value.trim()).length <= (_.labelBytes ?? 200)), d = m("");
    let p, v = !1, f = !1, D = !1;
    const N = {
      expired: "The code expired. Start again for a new one.",
      denied: "ChatGPT declined the request. Start again when you are ready to approve it.",
      cancelled: "Sign-in was cancelled. You can start again at any time.",
      unavailable: "Could not reach ChatGPT. Try signing in again shortly.",
      save_failed: "ChatGPT approved the request, but the account could not be saved. Start again.",
      busy: "Another sign-in request is finishing. Try again shortly."
    }, $ = E(() => {
      const e = t.value;
      return e in N ? N[e] : "";
    });
    function T(e) {
      t.value = e, n.value = void 0, c("busy", !1), e === "ready" && c("saved");
    }
    function A(e) {
      clearTimeout(p), p = setTimeout(() => {
        I();
      }, e * 1e3);
    }
    async function I() {
      const e = n.value;
      if (!e || v || D) return;
      const a = f ? "cancel" : "poll";
      D = !0;
      try {
        const y = await B.codexDevice({ action: a, ticket: e.ticket });
        if (v || n.value !== e) return;
        "retry_after" in y ? (t.value = f ? "cancelling" : y.state, A(f && a === "poll" ? 0 : y.retry_after)) : T(y.state);
      } catch {
        !v && n.value === e && (f && a === "poll" ? A(0) : T("unavailable"));
      } finally {
        D = !1;
      }
    }
    async function z() {
      if (!(v || !x.value || t.value === "starting" || C.value || t.value === "rate_limited")) {
        f = !1, d.value = "", t.value = "starting", c("busy", !0);
        try {
          const e = await B.codexDevice({ action: "start", label: u.value.trim(), account_id: _.account?.id });
          if (v) {
            "ticket" in e && B.codexDevice({ action: "cancel", ticket: e.ticket }).catch(() => {
            });
            return;
          }
          "ticket" in e ? (n.value = e, t.value = "waiting", A(e.retry_after)) : (T(e.state), e.state === "rate_limited" && (p = setTimeout(() => {
            t.value = "start";
          }, e.retry_after * 1e3)));
        } catch {
          v || T("unavailable");
        }
      }
    }
    function F() {
      clearTimeout(p), f = !0, t.value = "cancelling", I();
    }
    async function R() {
      if (n.value)
        try {
          await navigator.clipboard.writeText(n.value.user_code), d.value = "Code copied";
        } catch {
          d.value = "Select the code to copy it.";
        }
    }
    return W(() => {
      v = !0, clearTimeout(p), n.value && B.codexDevice({ action: "cancel", ticket: n.value.ticket }).catch(() => {
      });
    }), (e, a) => (s(), h("section", J, [
      C.value && n.value ? (s(), h(O, { key: 0 }, [
        a[1] || (a[1] = i("ol", { class: "ac-setup-steps" }, [
          i("li", null, "Open ChatGPT in a new tab and sign in with the account you want to use."),
          i("li", null, "Enter this code to approve access for Codex.")
        ], -1)),
        i("div", K, [
          i("code", null, w(n.value.user_code), 1),
          o(l(G), {
            label: "Copy code",
            text: "",
            severity: "secondary",
            size: "small",
            onClick: R
          }, {
            icon: r(() => [
              o(l(q), {
                icon: "tabler:copy",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          }),
          i("span", L, w(d.value), 1)
        ]),
        i("div", M, [
          o(l(G), {
            as: "a",
            label: "Open ChatGPT",
            href: n.value.verification_url,
            target: "_blank",
            rel: "noopener noreferrer"
          }, {
            icon: r(() => [
              o(l(q), {
                icon: "tabler:external-link",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          }, 8, ["href"]),
          o(l(G), {
            text: "",
            severity: "secondary",
            label: "Cancel sign-in",
            disabled: t.value === "cancelling",
            onClick: F
          }, null, 8, ["disabled"])
        ]),
        o(l(S), {
          severity: "info",
          closable: !1,
          role: "status"
        }, {
          default: r(() => [
            P(w(t.value === "cancelling" ? "Cancelling sign-in…" : t.value === "rate_limited" ? "ChatGPT asked us to slow down. We’ll check again shortly." : "Waiting for approval in ChatGPT…"), 1)
          ]),
          _: 1
        })
      ], 64)) : t.value === "ready" ? (s(), b(l(S), {
        key: 1,
        severity: "success",
        closable: !1,
        role: "status"
      }, {
        default: r(() => [...a[2] || (a[2] = [
          P(" Codex is ready to run tasks with this ChatGPT account. ", -1)
        ])]),
        _: 1
      })) : (s(), h(O, { key: 2 }, [
        a[5] || (a[5] = i("p", { class: "ac-hint" }, "Connect your personal ChatGPT account to run tasks with Codex. Enable device code authorization in ChatGPT security settings if asked.", -1)),
        g.account ? V("", !0) : (s(), h("label", Q, [
          a[3] || (a[3] = i("span", null, "Account name", -1)),
          o(l(H), {
            modelValue: u.value,
            "onUpdate:modelValue": a[0] || (a[0] = (y) => u.value = y),
            disabled: t.value === "starting",
            autocomplete: "off"
          }, null, 8, ["modelValue", "disabled"])
        ])),
        $.value ? (s(), b(l(S), {
          key: 1,
          severity: t.value === "cancelled" ? "secondary" : "warn",
          closable: !1,
          role: "status"
        }, {
          default: r(() => [
            P(w($.value), 1)
          ]),
          _: 1
        }, 8, ["severity"])) : V("", !0),
        t.value === "rate_limited" ? (s(), b(l(S), {
          key: 2,
          severity: "warn",
          closable: !1,
          role: "status"
        }, {
          default: r(() => [...a[4] || (a[4] = [
            P("ChatGPT asked us to slow down. Try again in a moment.", -1)
          ])]),
          _: 1
        })) : V("", !0),
        i("div", X, [
          o(l(G), {
            label: g.account ? "Reconnect with ChatGPT" : "Sign in with ChatGPT",
            disabled: !x.value || t.value === "rate_limited",
            loading: t.value === "starting",
            onClick: z
          }, {
            icon: r(() => [
              o(l(q), {
                icon: "tabler:brand-openai",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          }, 8, ["label", "disabled", "loading"])
        ])
      ], 64))
    ]));
  }
}), ee = {
  key: 0,
  class: "ac-advanced-credential"
}, se = /* @__PURE__ */ U({
  __name: "codex-provider-accounts",
  setup(g) {
    const k = m(!1);
    return (_, c) => (s(), b(Y, { provider: "codex" }, {
      setup: r(({ account: u, labelBytes: n, busy: t, saved: C, credential: x }) => [
        o(Z, {
          account: u,
          "label-bytes": n,
          onBusy: (d) => {
            k.value = d, t(d);
          },
          onSaved: C
        }, null, 8, ["account", "label-bytes", "onBusy", "onSaved"]),
        k.value ? V("", !0) : (s(), h("details", ee, [
          c[0] || (c[0] = i("summary", { class: "kx-focus-outline" }, "Advanced · Paste a credential", -1)),
          c[1] || (c[1] = i("p", { class: "ac-hint" }, "Use an OpenAI API key or upload the login file from an existing Codex installation.", -1)),
          (s(), b(j(x)))
        ]))
      ]),
      _: 1
    }));
  }
});
export {
  se as default
};
