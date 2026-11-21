import { defineComponent as U, ref as h, computed as E, onBeforeUnmount as W, openBlock as s, createElementBlock as x, Fragment as O, createElementVNode as i, toDisplayString as w, createVNode as o, unref as l, withCtx as c, createTextVNode as P, createBlock as y, createCommentVNode as V, resolveDynamicComponent as Y } from "vue";
import { a as G, _ as j } from "./Disclosure.vue_vue_type_script_setup_true_lang-CrWwplXA.js";
import { _ as H } from "./provider-accounts.vue_vue_type_script_setup_true_lang-Dcpi-bPZ.js";
import { Icon as q } from "@iconify/vue";
import { s as S, h as B } from "./accounts.vue_vue_type_script_setup_true_lang-BS36zsOI.js";
import { s as J } from "./index-BBR9l5Id.js";
const K = {
  class: "ac-stack",
  "aria-label": "ChatGPT sign-in"
}, L = { class: "ac-device-code" }, M = {
  class: "ac-muted",
  role: "status"
}, Q = { class: "ac-setup-actions" }, X = {
  key: 0,
  class: "ac-field"
}, Z = { class: "ac-setup-actions" }, ee = /* @__PURE__ */ U({
  __name: "codex-device-setup",
  props: {
    account: {},
    labelBytes: {}
  },
  emits: ["busy", "saved"],
  setup(b, { emit: g }) {
    const _ = b, v = g, r = h(_.account?.label ?? "Codex"), n = h(), t = h("start"), k = E(() => !!n.value), C = E(() => !!r.value.trim() && new TextEncoder().encode(r.value.trim()).length <= (_.labelBytes ?? 200)), u = h("");
    let m, d = !1, f = !1, D = !1;
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
      t.value = e, n.value = void 0, v("busy", !1), e === "ready" && v("saved");
    }
    function A(e) {
      clearTimeout(m), m = setTimeout(() => {
        I();
      }, e * 1e3);
    }
    async function I() {
      const e = n.value;
      if (!e || d || D) return;
      const a = f ? "cancel" : "poll";
      D = !0;
      try {
        const p = await G.codexDevice({ action: a, ticket: e.ticket });
        if (d || n.value !== e) return;
        "retry_after" in p ? (t.value = f ? "cancelling" : p.state, A(f && a === "poll" ? 0 : p.retry_after)) : T(p.state);
      } catch {
        !d && n.value === e && (f && a === "poll" ? A(0) : T("unavailable"));
      } finally {
        D = !1;
      }
    }
    async function z() {
      if (!(d || !C.value || t.value === "starting" || k.value || t.value === "rate_limited")) {
        f = !1, u.value = "", t.value = "starting", v("busy", !0);
        try {
          const e = await G.codexDevice({ action: "start", label: r.value.trim(), account_id: _.account?.id });
          if (d) {
            "ticket" in e && G.codexDevice({ action: "cancel", ticket: e.ticket }).catch(() => {
            });
            return;
          }
          "ticket" in e ? (n.value = e, t.value = "waiting", A(e.retry_after)) : (T(e.state), e.state === "rate_limited" && (m = setTimeout(() => {
            t.value = "start";
          }, e.retry_after * 1e3)));
        } catch {
          d || T("unavailable");
        }
      }
    }
    function F() {
      clearTimeout(m), f = !0, t.value = "cancelling", I();
    }
    async function R() {
      if (n.value)
        try {
          await navigator.clipboard.writeText(n.value.user_code), u.value = "Code copied";
        } catch {
          u.value = "Select the code to copy it.";
        }
    }
    return W(() => {
      d = !0, clearTimeout(m), n.value && G.codexDevice({ action: "cancel", ticket: n.value.ticket }).catch(() => {
      });
    }), (e, a) => (s(), x("section", K, [
      k.value && n.value ? (s(), x(O, { key: 0 }, [
        a[1] || (a[1] = i("ol", { class: "ac-setup-steps" }, [
          i("li", null, "Open ChatGPT in a new tab and sign in with the account you want to use."),
          i("li", null, "Enter this code to approve access for Codex.")
        ], -1)),
        i("div", L, [
          i("code", null, w(n.value.user_code), 1),
          o(l(S), {
            label: "Copy code",
            text: "",
            severity: "secondary",
            size: "small",
            onClick: R
          }, {
            icon: c(() => [
              o(l(q), {
                icon: "tabler:copy",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          }),
          i("span", M, w(u.value), 1)
        ]),
        i("div", Q, [
          o(l(S), {
            as: "a",
            label: "Open ChatGPT",
            href: n.value.verification_url,
            target: "_blank",
            rel: "noopener noreferrer"
          }, {
            icon: c(() => [
              o(l(q), {
                icon: "tabler:external-link",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          }, 8, ["href"]),
          o(l(S), {
            text: "",
            severity: "secondary",
            label: "Cancel sign-in",
            disabled: t.value === "cancelling",
            onClick: F
          }, null, 8, ["disabled"])
        ]),
        o(l(B), {
          severity: "info",
          closable: !1,
          role: "status"
        }, {
          default: c(() => [
            P(w(t.value === "cancelling" ? "Cancelling sign-in…" : t.value === "rate_limited" ? "ChatGPT asked us to slow down. We’ll check again shortly." : "Waiting for approval in ChatGPT…"), 1)
          ]),
          _: 1
        })
      ], 64)) : t.value === "ready" ? (s(), y(l(B), {
        key: 1,
        severity: "success",
        closable: !1,
        role: "status"
      }, {
        default: c(() => [...a[2] || (a[2] = [
          P(" Codex is ready to run tasks with this ChatGPT account. ", -1)
        ])]),
        _: 1
      })) : (s(), x(O, { key: 2 }, [
        a[5] || (a[5] = i("p", { class: "ac-hint" }, "Connect your personal ChatGPT account to run tasks with Codex. Enable device code authorization in ChatGPT security settings if asked.", -1)),
        b.account ? V("", !0) : (s(), x("label", X, [
          a[3] || (a[3] = i("span", null, "Account name", -1)),
          o(l(J), {
            modelValue: r.value,
            "onUpdate:modelValue": a[0] || (a[0] = (p) => r.value = p),
            disabled: t.value === "starting",
            autocomplete: "off"
          }, null, 8, ["modelValue", "disabled"])
        ])),
        $.value ? (s(), y(l(B), {
          key: 1,
          severity: t.value === "cancelled" ? "secondary" : "warn",
          closable: !1,
          role: "status"
        }, {
          default: c(() => [
            P(w($.value), 1)
          ]),
          _: 1
        }, 8, ["severity"])) : V("", !0),
        t.value === "rate_limited" ? (s(), y(l(B), {
          key: 2,
          severity: "warn",
          closable: !1,
          role: "status"
        }, {
          default: c(() => [...a[4] || (a[4] = [
            P("ChatGPT asked us to slow down. Try again in a moment.", -1)
          ])]),
          _: 1
        })) : V("", !0),
        i("div", Z, [
          o(l(S), {
            label: b.account ? "Reconnect with ChatGPT" : "Sign in with ChatGPT",
            disabled: !C.value || t.value === "rate_limited",
            loading: t.value === "starting",
            onClick: z
          }, {
            icon: c(() => [
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
}), se = /* @__PURE__ */ U({
  __name: "codex-provider-accounts",
  setup(b) {
    const g = h(!1);
    return (_, v) => (s(), y(H, { provider: "codex" }, {
      setup: c(({ account: r, labelBytes: n, busy: t, saved: k, credential: C }) => [
        o(ee, {
          account: r,
          "label-bytes": n,
          onBusy: (u) => {
            g.value = u, t(u);
          },
          onSaved: k
        }, null, 8, ["account", "label-bytes", "onBusy", "onSaved"]),
        g.value ? V("", !0) : (s(), y(j, {
          key: 0,
          class: "ac-advanced-credential",
          label: "Advanced · Paste a credential"
        }, {
          default: c(() => [
            v[0] || (v[0] = i("p", { class: "ac-hint" }, "Use an OpenAI API key or upload the login file from an existing Codex installation.", -1)),
            (s(), y(Y(C)))
          ]),
          _: 2
        }, 1024))
      ]),
      _: 1
    }));
  }
});
export {
  se as default
};
