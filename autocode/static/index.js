import { a as le, d as ke, r as re, e as ye, t as we, u as ge, _ as ce, b as xe, c as Ce, s as Ae, P as Te } from "./styles-cTcHqrbC.js";
import { u as de, W as Ve } from "./index-DaHAsq8-.js";
import { defineComponent as Y, openBlock as a, createElementBlock as o, Fragment as j, renderList as W, normalizeClass as G, createVNode as A, unref as c, createTextVNode as S, toDisplayString as s, inject as se, ref as d, computed as M, watch as X, createElementVNode as e, withDirectives as Q, vModelText as ie, createCommentVNode as y, vModelSelect as ue, vModelCheckbox as Re, createBlock as J, onUnmounted as fe, nextTick as ve, withCtx as ee, withKeys as pe, withModifiers as me, onMounted as Le } from "vue";
import { Icon as I } from "@iconify/vue";
import be from "primevue/button";
import { d as Ue, m as Se, a as Ie, _ as qe } from "./driver-options.vue_vue_type_script_setup_true_lang-ZjeHQmke.js";
import { c as oe, d as ae, a as N, e as H, l as he, b as te, p as Ee } from "./api-xHIs_Oef.js";
import { loadByTagName as Ne, host as Pe, define as Be } from "@wippy-fe/proxy";
const De = {
  key: 0,
  class: "ac-chips",
  role: "group",
  "aria-label": "Agent"
}, Me = ["aria-pressed", "onClick"], je = ["value"], We = ["value"], _e = /* @__PURE__ */ Y({
  __name: "agent-picker",
  props: {
    agents: {},
    modelValue: {}
  },
  emits: ["update:modelValue"],
  setup(r) {
    return (P, g) => r.agents.length <= 6 ? (a(), o("div", De, [
      (a(!0), o(j, null, W(r.agents, (h) => (a(), o("button", {
        key: h.id,
        type: "button",
        class: G(["ac-chip kx-focus-halo", { active: r.modelValue === h.id }]),
        "aria-pressed": r.modelValue === h.id,
        onClick: (L) => P.$emit("update:modelValue", h.id)
      }, [
        A(c(I), {
          icon: c(le)(h.id),
          "aria-hidden": "true"
        }, null, 8, ["icon"]),
        S(s(h.title), 1)
      ], 10, Me))), 128))
    ])) : (a(), o("select", {
      key: 1,
      class: "kx-focus-halo",
      "aria-label": "Agent",
      value: r.modelValue,
      onChange: g[0] || (g[0] = (h) => P.$emit("update:modelValue", h.target.value))
    }, [
      (a(!0), o(j, null, W(r.agents, (h) => (a(), o("option", {
        key: h.id,
        value: h.id
      }, s(h.title), 9, We))), 128))
    ], 40, je));
  }
}), Oe = { class: "ac-field ac-composer" }, Ge = { class: "ac-field" }, He = {
  key: 0,
  class: "ac-muted"
}, Ke = {
  key: 1,
  class: "ac-muted"
}, Fe = { class: "ac-picker-row" }, ze = { class: "ac-field" }, Je = { value: "" }, Qe = ["value"], Xe = { class: "ac-field" }, Ye = ["value"], Ze = { class: "ac-field" }, et = ["value"], tt = { class: "ac-advanced" }, at = { class: "ac-form" }, nt = { class: "ac-field" }, ot = {
  key: 0,
  class: "ac-check"
}, lt = {
  key: 2,
  class: "ac-error",
  role: "alert"
}, st = { class: "ac-dialog-foot" }, ut = ["disabled"], ct = /* @__PURE__ */ Y({
  __name: "task-form",
  props: {
    accounts: {},
    images: {},
    workspaces: {},
    drivers: {}
  },
  emits: ["started", "goto", "agentChanged", "cancel"],
  setup(r, { emit: P }) {
    const g = r, h = P, L = se("catalog"), u = d(null);
    function b() {
      u.value?.dispatchEvent(new CustomEvent("navigate", { detail: { path: "/system/autocode" }, bubbles: !0, composed: !0 }));
    }
    const v = d(Ue(L.value, g.accounts)), f = d(""), $ = d(""), C = d(""), w = d(""), V = d(""), p = d({}), m = d(!1), x = d(0), B = d(!1), D = d(""), O = M(() => L.value.agents.find((l) => l.id === v.value)), R = M(() => g.drivers.find((l) => l.id === v.value)), E = M(() => g.accounts.filter((l) => l.agent === v.value && l.usable && l.enabled)), K = M(() => E.value.filter((l) => oe(l) === "ready")), q = M(() => Se(g.images, v.value));
    function F(l) {
      return oe(l) === "cooling" ? `${l.label} (cooling down until ${ae(l.cooldown_until)})` : l.label;
    }
    X([q, E, () => g.workspaces], () => {
      q.value.some((l) => l.id === $.value) || ($.value = q.value[0]?.id ?? ""), f.value && !E.value.some((l) => l.id === f.value) && (f.value = ""), C.value && !g.workspaces.some((l) => l.id === C.value) && (C.value = "");
    }, { immediate: !0 }), X(v, () => {
      f.value = "", x.value = 0, h("agentChanged", v.value);
    }, { immediate: !0 }), X(() => R.value?.id, () => {
      const l = R.value;
      p.value = Ie(l), m.value = !!l?.unattended;
    }, { immediate: !0 }), X(m, (l) => {
      const n = R.value?.unattended;
      if (!l || !n) return;
      const t = { ...p.value };
      for (const i of Object.keys(n)) delete t[i];
      p.value = t;
    });
    async function z() {
      D.value = "", B.value = !0;
      try {
        const { id: l } = await N.startRun({
          agent: v.value,
          account_id: f.value,
          image_id: $.value,
          workspace_id: C.value,
          repo_url: w.value,
          prompt: V.value,
          options: p.value,
          unattended: m.value
        });
        V.value = "", h("started", l);
      } catch (l) {
        D.value = H(l, "Could not start the task.");
      } finally {
        B.value = !1;
      }
    }
    return (l, n) => (a(), o("section", {
      ref_key: "root",
      ref: u,
      class: "ac-form ac-new"
    }, [
      e("label", Oe, [
        n[11] || (n[11] = e("span", null, "Prompt", -1)),
        Q(e("textarea", {
          "onUpdate:modelValue": n[0] || (n[0] = (t) => V.value = t),
          autofocus: "",
          rows: "8",
          class: "kx-focus-halo",
          placeholder: "What should the agent do?"
        }, null, 512), [
          [ie, V.value]
        ])
      ]),
      e("div", Ge, [
        n[12] || (n[12] = e("span", null, "Agent", -1)),
        A(_e, {
          modelValue: v.value,
          "onUpdate:modelValue": n[1] || (n[1] = (t) => v.value = t),
          agents: c(L).agents
        }, null, 8, ["modelValue", "agents"])
      ]),
      v.value && !E.value.length ? (a(), o("p", He, [
        S(" No " + s(O.value?.title) + " accounts you can run on. ", 1),
        e("button", {
          class: "ac-link kx-focus-outline",
          type: "button",
          onClick: n[2] || (n[2] = (t) => h("goto", "accounts", v.value))
        }, "Add an account")
      ])) : y("", !0),
      q.value.length ? y("", !0) : (a(), o("p", Ke, [
        S(" No image with " + s(O.value?.title ?? v.value) + "; ask an administrator. ", 1),
        c(L).manage ? (a(), o("button", {
          key: 0,
          class: "ac-link kx-focus-outline",
          type: "button",
          onClick: b
        }, "Manage images")) : y("", !0)
      ])),
      e("div", Fe, [
        e("label", ze, [
          n[13] || (n[13] = e("span", null, "Account", -1)),
          Q(e("select", {
            "onUpdate:modelValue": n[3] || (n[3] = (t) => f.value = t),
            class: "kx-focus-halo"
          }, [
            e("option", Je, "Auto (" + s(K.value.length) + " ready)", 1),
            (a(!0), o(j, null, W(E.value, (t) => (a(), o("option", {
              key: t.id,
              value: t.id
            }, s(F(t)), 9, Qe))), 128))
          ], 512), [
            [ue, f.value]
          ])
        ]),
        e("label", Xe, [
          n[14] || (n[14] = e("span", null, "Image", -1)),
          Q(e("select", {
            "onUpdate:modelValue": n[4] || (n[4] = (t) => $.value = t),
            class: "kx-focus-halo"
          }, [
            (a(!0), o(j, null, W(q.value, (t) => (a(), o("option", {
              key: t.id,
              value: t.id
            }, s(t.label), 9, Ye))), 128))
          ], 512), [
            [ue, $.value]
          ])
        ]),
        e("label", Ze, [
          n[16] || (n[16] = e("span", null, "Workspace", -1)),
          Q(e("select", {
            "onUpdate:modelValue": n[5] || (n[5] = (t) => C.value = t),
            class: "kx-focus-halo"
          }, [
            n[15] || (n[15] = e("option", { value: "" }, "Scratch directory", -1)),
            (a(!0), o(j, null, W(r.workspaces, (t) => (a(), o("option", {
              key: t.id,
              value: t.id
            }, s(t.name) + s(t.writable ? "" : " (read-only)"), 9, et))), 128))
          ], 512), [
            [ue, C.value]
          ])
        ])
      ]),
      e("details", tt, [
        n[19] || (n[19] = e("summary", { class: "kx-focus-outline" }, "Advanced", -1)),
        e("div", at, [
          e("label", nt, [
            n[17] || (n[17] = e("span", null, "Git repository", -1)),
            Q(e("input", {
              "onUpdate:modelValue": n[6] || (n[6] = (t) => w.value = t),
              class: "ac-mono kx-focus-halo",
              placeholder: "Optional: https://github.com/org/repo.git"
            }, null, 512), [
              [ie, w.value]
            ])
          ]),
          R.value?.unattended ? (a(), o("label", ot, [
            Q(e("input", {
              "onUpdate:modelValue": n[7] || (n[7] = (t) => m.value = t),
              type: "checkbox",
              class: "kx-focus-outline"
            }, null, 512), [
              [Re, m.value]
            ]),
            n[18] || (n[18] = S(" Unattended · skip permission prompts when the image allows it ", -1))
          ])) : y("", !0),
          R.value ? (a(), J(qe, {
            key: R.value.id,
            modelValue: p.value,
            "onUpdate:modelValue": n[8] || (n[8] = (t) => p.value = t),
            options: R.value.options,
            locked: m.value && R.value.unattended ? R.value.unattended : {},
            onInvalid: n[9] || (n[9] = (t) => x.value = t)
          }, null, 8, ["modelValue", "options", "locked"])) : y("", !0)
        ])
      ]),
      D.value ? (a(), o("p", lt, s(D.value), 1)) : y("", !0),
      e("footer", st, [
        e("button", {
          type: "button",
          class: "ac-btn kx-focus-halo",
          onClick: n[10] || (n[10] = (t) => h("cancel"))
        }, "Cancel"),
        e("button", {
          type: "button",
          class: "ac-btn primary kx-focus-halo",
          disabled: B.value || x.value > 0 || !v.value || !(f.value || K.value.length) || !$.value || !V.value.trim(),
          onClick: z
        }, [
          A(c(I), { icon: "tabler:player-play" }),
          S(" " + s(B.value ? "Starting…" : "Start"), 1)
        ], 8, ut)
      ])
    ], 512));
  }
}), it = { class: "ac-form ac-detail" }, rt = {
  key: 0,
  class: "ac-error",
  role: "alert"
}, dt = {
  key: 1,
  class: "kx-loading"
}, vt = { class: "ac-detail-head" }, pt = { class: "ac-card-head" }, mt = ["disabled"], kt = { class: "ac-detail-title" }, yt = { class: "ac-run-meta ac-detail-meta" }, gt = ["title"], ft = { key: 0 }, bt = { key: 1 }, ht = { key: 2 }, _t = { key: 3 }, $t = { key: 4 }, wt = { key: 5 }, xt = {
  class: "ac-detail-section",
  "aria-labelledby": "ac-prompt-heading"
}, Ct = { class: "ac-section-head" }, At = ["aria-expanded"], Tt = {
  key: 0,
  class: "ac-detail-section ac-result",
  "aria-labelledby": "ac-result-heading"
}, Vt = { class: "ac-section-head" }, Rt = { class: "ac-row-actions" }, Lt = ["aria-expanded"], Ut = {
  key: 0,
  class: "ac-error",
  role: "alert"
}, St = {
  key: 1,
  class: "ac-error",
  role: "alert"
}, It = {
  class: "ac-detail-section",
  "aria-labelledby": "ac-log-heading"
}, qt = { class: "ac-section-head" }, Et = { class: "ac-muted" }, Nt = { class: "ac-event-kind" }, Pt = { class: "ac-event-text" }, Bt = {
  key: 0,
  class: "ac-muted ac-pulse"
}, Dt = {
  key: 1,
  class: "ac-muted"
}, Mt = /* @__PURE__ */ Y({
  __name: "run-detail",
  props: {
    runId: {},
    accounts: {},
    images: {},
    workspaces: {}
  },
  emits: ["close", "changed"],
  setup(r, { emit: P }) {
    const g = r, h = P, L = se("catalog"), u = d(null), b = d([]), v = d(""), f = d(null), $ = d(null), C = d(!1), w = d(!1), V = d(!1), p = d(""), m = ke(), x = M(() => (u.value?.prompt.length ?? 0) > 500 || (u.value?.prompt.split(`
`).length ?? 0) > 5), B = M(() => (u.value?.result.length ?? 0) > 1800 || (u.value?.result.split(`
`).length ?? 0) > 10);
    let D = !0, O = !0, R;
    const E = (T) => T.status === "queued" || T.status === "running";
    function K() {
      f.value && (O = f.value.scrollHeight - f.value.scrollTop - f.value.clientHeight < 40);
    }
    const q = te(async () => {
      try {
        let T = !0;
        for (; T && D; ) {
          const _ = b.value.length ? b.value[b.value.length - 1].seq : 0, U = await N.run(g.runId, _);
          if (!D) return;
          u.value = U.run, U.events.length && (b.value = b.value.concat(U.events), await ve(), O && f.value?.scrollTo({ top: f.value.scrollHeight })), T = U.more;
        }
        D && u.value && h("changed", u.value), v.value = "";
      } catch (T) {
        v.value = H(T, "Could not load the run.");
      }
    }), F = he.run(g.runId, () => {
      q();
    });
    de(q), fe(() => {
      D = !1, F(), clearTimeout(R);
    });
    async function z() {
      try {
        await N.cancelRun(g.runId), await q();
      } catch (T) {
        v.value = H(T, "Could not cancel the run.");
      }
    }
    async function l() {
      try {
        const T = u.value?.result ?? "";
        try {
          await navigator.clipboard.writeText(T);
        } catch {
          const _ = document.createElement("textarea"), $e = $.value?.getRootNode()?.activeElement;
          _.value = T, _.readOnly = !0, _.style.cssText = "position:fixed;opacity:0;pointer-events:none;", $.value?.parentElement?.append(_);
          try {
            if (_.select(), !document.execCommand("copy")) throw new Error("Copy failed");
          } finally {
            _.remove(), $e?.focus({ preventScroll: !0 });
          }
        }
        V.value = !0, p.value = "", clearTimeout(R), R = setTimeout(() => {
          V.value = !1;
        }, 2e3);
      } catch {
        p.value = "Could not copy. Select the result text to copy it.";
      }
    }
    function n() {
      w.value = !w.value, w.value || $.value?.scrollTo({ top: 0 });
    }
    function t(T) {
      return typeof T.options?.model == "string" ? T.options.model : "";
    }
    function i(T) {
      return g.accounts.find((_) => _.id === T)?.label ?? "Unlisted account";
    }
    function k(T) {
      return g.workspaces.find((_) => _.id === T)?.name ?? "Unlisted workspace";
    }
    function Z(T) {
      return g.images.find((_) => _.id === T)?.label ?? "Unlisted image";
    }
    function ne(T) {
      const _ = T.usage, U = [];
      return typeof _.turns == "number" && U.push(`${_.turns} turns`), typeof _.cost_usd == "number" && U.push(`$${_.cost_usd.toFixed(4)} API-equivalent`), U.join(" · ");
    }
    return (T, _) => (a(), o("section", it, [
      v.value ? (a(), o("p", rt, [
        S(s(v.value) + " ", 1),
        e("button", {
          type: "button",
          class: "ac-link kx-focus-outline",
          onClick: _[0] || (_[0] = //@ts-ignore
          (...U) => c(q) && c(q)(...U))
        }, "Retry")
      ])) : y("", !0),
      u.value ? (a(), o(j, { key: 2 }, [
        e("header", vt, [
          e("div", pt, [
            e("span", {
              class: G(["kx-tag-sm ac-tone", u.value.status])
            }, s(u.value.status), 3),
            E(u.value) ? (a(), o("button", {
              key: 0,
              type: "button",
              class: "ac-btn danger kx-focus-halo",
              disabled: u.value.cancel_requested,
              onClick: z
            }, [
              A(c(I), { icon: "tabler:player-stop" }),
              S(" " + s(u.value.cancel_requested ? "Cancelling…" : "Cancel"), 1)
            ], 8, mt)) : y("", !0)
          ]),
          e("h2", kt, s(u.value.prompt.split(`
`)[0]), 1),
          e("div", yt, [
            e("span", null, [
              A(c(I), {
                icon: c(le)(u.value.agent)
              }, null, 8, ["icon"]),
              S(s(c(L).agents.find((U) => U.id === u.value?.agent)?.title ?? u.value.agent), 1)
            ]),
            e("span", null, s(i(u.value.account_id)), 1),
            e("span", null, s(Z(u.value.image_id)), 1),
            e("span", {
              title: c(ae)(u.value.started_at || u.value.created_at)
            }, s(u.value.started_at ? "Started" : "Queued") + " " + s(c(re)(u.value.started_at || u.value.created_at, c(m))), 9, gt),
            u.value.started_at ? (a(), o("span", ft, s(c(ye)(u.value, c(m))) + " " + s(E(u.value) ? "elapsed" : "duration"), 1)) : y("", !0),
            u.value.timeout_ms ? (a(), o("span", bt, s(c(we)(u.value.timeout_ms)), 1)) : y("", !0),
            e("span", null, s(u.value.unattended ? "Unattended" : "Attended"), 1),
            u.value.workflow ? (a(), o("span", ht, "Workflow")) : y("", !0),
            u.value.workspace_id ? (a(), o("span", _t, s(k(u.value.workspace_id)), 1)) : y("", !0),
            t(u.value) ? (a(), o("span", $t, s(t(u.value)), 1)) : y("", !0),
            ne(u.value) ? (a(), o("span", wt, s(ne(u.value)), 1)) : y("", !0)
          ])
        ]),
        e("section", xt, [
          e("div", Ct, [
            _[3] || (_[3] = e("h3", { id: "ac-prompt-heading" }, "Prompt", -1)),
            x.value ? (a(), o("button", {
              key: 0,
              type: "button",
              class: "ac-link kx-focus-outline",
              "aria-expanded": C.value,
              "aria-controls": "ac-prompt-text",
              onClick: _[1] || (_[1] = (U) => C.value = !C.value)
            }, s(C.value ? "Collapse prompt" : "Expand prompt"), 9, At)) : y("", !0)
          ]),
          e("pre", {
            id: "ac-prompt-text",
            class: G(["ac-pre ac-prompt", { expanded: C.value || !x.value }])
          }, [
            e("span", null, s(u.value.prompt), 1)
          ], 2)
        ]),
        u.value.status === "succeeded" && u.value.result ? (a(), o("section", Tt, [
          e("div", Vt, [
            _[4] || (_[4] = e("h3", { id: "ac-result-heading" }, "Result", -1)),
            e("div", Rt, [
              B.value ? (a(), o("button", {
                key: 0,
                type: "button",
                class: "ac-link kx-focus-outline",
                "aria-expanded": w.value,
                "aria-controls": "ac-result-text",
                onClick: n
              }, s(w.value ? "Collapse result" : "Expand result"), 9, Lt)) : y("", !0),
              e("button", {
                type: "button",
                class: "ac-btn kx-focus-halo",
                onClick: l
              }, [
                A(c(I), {
                  icon: V.value ? "tabler:check" : "tabler:copy"
                }, null, 8, ["icon"]),
                S(s(V.value ? "Copied" : "Copy"), 1)
              ])
            ])
          ]),
          p.value ? (a(), o("p", Ut, s(p.value), 1)) : y("", !0),
          e("pre", {
            id: "ac-result-text",
            ref_key: "result",
            ref: $,
            class: G(["ac-pre ac-result-text", { expanded: w.value }]),
            tabindex: "0",
            "aria-label": "Result"
          }, s(u.value.result), 3)
        ])) : y("", !0),
        u.value.error ? (a(), o("p", St, s(u.value.error), 1)) : y("", !0),
        e("section", It, [
          e("div", qt, [
            _[5] || (_[5] = e("h3", { id: "ac-log-heading" }, "Log", -1)),
            e("span", Et, s(b.value.length) + " events", 1)
          ]),
          e("div", {
            ref_key: "stream",
            ref: f,
            class: "ac-stream",
            tabindex: "0",
            "aria-label": "Run log",
            onScroll: K
          }, [
            (a(!0), o(j, null, W(b.value, (U) => (a(), o("div", {
              key: U.seq,
              class: G(["ac-event", U.kind])
            }, [
              e("span", Nt, s(U.kind), 1),
              e("pre", Pt, s(U.text), 1)
            ], 2))), 128)),
            E(u.value) ? (a(), o("div", Bt, "Working…")) : b.value.length ? y("", !0) : (a(), o("div", Dt, "No log events."))
          ], 544)
        ])
      ], 64)) : (a(), o("div", dt, [
        A(c(I), {
          icon: "tabler:loader-2",
          class: "spin"
        }),
        _[2] || (_[2] = S(" Loading the run…", -1))
      ]))
    ]));
  }
}), jt = {
  key: 0,
  class: "kx-loading"
}, Wt = { key: 1 }, Ot = {
  key: 0,
  class: "ac-error"
}, Gt = {
  key: 1,
  class: "kx-empty"
}, Ht = { class: "kx-empty-ico" }, Kt = { class: "kx-empty-sub" }, Ft = {
  key: 2,
  class: "kx-empty"
}, zt = {
  key: 3,
  class: "ac-run-list"
}, Jt = ["onClick"], Qt = { class: "ac-run-copy" }, Xt = { class: "ac-run-title-row" }, Yt = { class: "ac-run-title" }, Zt = {
  key: 0,
  class: "kx-tag-sm ac-tone"
}, ea = { class: "ac-run-meta" }, ta = ["title"], aa = { key: 0 }, na = /* @__PURE__ */ Y({
  __name: "tasks",
  props: {
    query: {}
  },
  emits: ["goto", "agentChanged", "count"],
  setup(r, { expose: P, emit: g }) {
    const h = r, L = g, u = se("catalog"), b = d(!1);
    P({ open: () => {
      b.value = !0;
    } });
    const v = d([]), f = d([]), $ = d([]), C = d([]), w = d([]), V = d(!1), p = d(""), m = d(null), x = ke(), B = te(async () => {
      try {
        const [t, i, k, Z, ne] = await Promise.all([N.accounts(), N.images(), N.runs(), N.workspaces(), N.drivers()]);
        v.value = t, f.value = i, w.value = k, $.value = Z.workspaces, C.value = ne, V.value = !0;
      } catch (t) {
        p.value = H(t, "Could not load tasks.");
      }
    }), D = te(async () => {
      try {
        w.value = await N.runs();
      } catch (t) {
        p.value = H(t, "Could not load runs.");
      }
    }), O = te(async () => {
      try {
        f.value = await N.images();
      } catch (t) {
        p.value = H(t, "Could not load images.");
      }
    }), R = he.runs(() => {
      D();
    });
    ge(() => f.value.map((t) => t.id), () => {
      O();
    }), de(B), fe(R);
    async function E(t) {
      b.value = !1, await D(), m.value = t;
    }
    function K(t) {
      const i = w.value.findIndex((k) => k.id === t.id);
      i >= 0 && (w.value[i] = { ...w.value[i], ...t });
    }
    const q = M(() => v.value.some((t) => t.usable && t.enabled)), F = M(() => w.value.filter((t) => [t.prompt, t.status, t.agent, z(t.agent), n(t.account_id)].join(" ").toLowerCase().includes(h.query.trim().toLowerCase())));
    X(w, (t) => L("count", t.length));
    function z(t) {
      return u.value.agents.find((i) => i.id === t)?.title ?? t;
    }
    function l(t) {
      return f.value.find((i) => i.id === t)?.label ?? "Unlisted image";
    }
    function n(t) {
      return v.value.find((i) => i.id === t)?.label ?? "unlisted account";
    }
    return (t, i) => V.value ? (a(), o("div", Wt, [
      p.value ? (a(), o("p", Ot, s(p.value), 1)) : y("", !0),
      w.value.length ? F.value.length ? (a(), o("ul", zt, [
        (a(!0), o(j, null, W(F.value, (k) => (a(), o("li", {
          key: k.id,
          class: "ac-run"
        }, [
          e("button", {
            type: "button",
            class: "ac-run-main kx-focus-halo",
            onClick: (Z) => m.value = k.id
          }, [
            e("span", Qt, [
              e("span", Xt, [
                e("span", Yt, s(k.prompt.split(`
`)[0]), 1),
                e("span", {
                  class: G(["kx-tag-sm ac-tone", k.status])
                }, s(k.status), 3),
                k.workflow ? (a(), o("span", Zt, "Workflow")) : y("", !0)
              ]),
              e("span", ea, [
                e("span", null, [
                  A(c(I), {
                    icon: c(le)(k.agent)
                  }, null, 8, ["icon"]),
                  S(s(z(k.agent)), 1)
                ]),
                e("span", null, s(n(k.account_id)), 1),
                e("span", null, s(l(k.image_id)), 1),
                e("span", {
                  title: c(ae)(k.started_at || k.created_at)
                }, s(c(re)(k.started_at || k.created_at, c(x))), 9, ta),
                k.started_at ? (a(), o("span", aa, s(c(ye)(k, c(x))) + " " + s(k.status === "running" ? "elapsed" : "duration"), 1)) : y("", !0)
              ])
            ]),
            A(c(I), {
              icon: "tabler:chevron-right",
              class: "ac-run-chevron ac-muted"
            })
          ], 8, Jt)
        ]))), 128))
      ])) : (a(), o("div", Ft, [...i[11] || (i[11] = [
        e("div", { class: "kx-empty-title" }, "No matches", -1),
        e("div", { class: "kx-empty-sub" }, "Try another task, agent or account.", -1)
      ])])) : (a(), o("div", Gt, [
        e("div", Ht, [
          A(c(I), { icon: "tabler:terminal-2" })
        ]),
        i[10] || (i[10] = e("div", { class: "kx-empty-title" }, "No tasks yet", -1)),
        e("div", Kt, s(q.value ? "Give a coding agent a task and follow its progress here." : "Add an account to give your coding agent a place to start."), 1),
        A(c(be), {
          label: q.value ? "New task" : "Add account",
          onClick: i[1] || (i[1] = (k) => q.value ? b.value = !0 : L("goto"))
        }, {
          icon: ee(() => [
            A(c(I), { icon: "tabler:plus" })
          ]),
          _: 1
        }, 8, ["label"])
      ])),
      b.value ? (a(), J(ce, {
        key: 4,
        title: "New task",
        wide: "",
        onClose: i[5] || (i[5] = (k) => b.value = !1)
      }, {
        default: ee(() => [
          A(ct, {
            accounts: v.value,
            images: f.value,
            workspaces: $.value,
            drivers: C.value,
            onStarted: E,
            onCancel: i[2] || (i[2] = (k) => b.value = !1),
            onAgentChanged: i[3] || (i[3] = (k) => L("agentChanged", k)),
            onGoto: i[4] || (i[4] = (k, Z) => L("goto", Z))
          }, null, 8, ["accounts", "images", "workspaces", "drivers"])
        ]),
        _: 1
      })) : y("", !0),
      m.value ? (a(), J(ce, {
        key: 5,
        title: "Task details",
        wide: "",
        onClose: i[8] || (i[8] = (k) => m.value = null)
      }, {
        footer: ee(() => [
          e("button", {
            type: "button",
            class: "ac-btn kx-focus-halo",
            onClick: i[7] || (i[7] = (k) => m.value = null)
          }, "Close")
        ]),
        default: ee(() => [
          (a(), J(Mt, {
            key: m.value,
            "run-id": m.value,
            accounts: v.value,
            images: f.value,
            workspaces: $.value,
            onClose: i[6] || (i[6] = (k) => m.value = null),
            onChanged: K
          }, null, 8, ["run-id", "accounts", "images", "workspaces"]))
        ]),
        _: 1
      })) : y("", !0)
    ])) : (a(), o("div", jt, [
      p.value ? (a(), o(j, { key: 0 }, [
        S(s(p.value) + " ", 1),
        e("button", {
          class: "ac-link kx-focus-outline",
          type: "button",
          onClick: i[0] || (i[0] = //@ts-ignore
          (...k) => c(B) && c(B)(...k))
        }, "Retry")
      ], 64)) : (a(), o(j, { key: 1 }, [
        A(c(I), {
          icon: "tabler:loader-2",
          class: "spin"
        }),
        i[9] || (i[9] = S(" Loading tasks…", -1))
      ], 64))
    ]));
  }
}), oa = { class: "ac-account-main" }, la = { class: "ac-row-title" }, sa = {
  key: 1,
  class: "kx-tag-sm ac-tone"
}, ua = ["onKeydown"], ca = {
  key: 3,
  class: "ac-row-name"
}, ia = {
  key: 4,
  class: "kx-tag-sm ac-tone"
}, ra = { class: "ac-muted" }, da = ["title"], va = { key: 1 }, pa = {
  key: 0,
  class: "ac-muted"
}, ma = {
  key: 1,
  class: "ac-muted ac-strong"
}, ka = {
  key: 2,
  class: "ac-muted"
}, ya = {
  key: 3,
  class: "ac-muted ac-mono"
}, ga = {
  key: 4,
  class: "ac-muted"
}, fa = {
  key: 5,
  class: "ac-error ac-small"
}, ba = { class: "ac-row-actions" }, ha = ["title"], _a = ["checked", "aria-label"], $a = /* @__PURE__ */ Y({
  __name: "account-row",
  props: {
    account: {},
    kindLabel: {},
    ownerLabel: {}
  },
  emits: ["toggle", "rename", "remove"],
  setup(r, { emit: P }) {
    const g = r, h = P, L = { ready: "ready", cooling: "cooling down", disabled: "disabled" }, u = M(() => oe(g.account)), b = M(() => g.account.mine ? "" : `Shared with you by ${g.ownerLabel}`), v = d(!1), f = d(""), $ = d(null);
    function C() {
      f.value = g.account.label, v.value = !0, ve(() => $.value?.select());
    }
    function w() {
      if (!v.value) return;
      v.value = !1;
      const V = f.value.trim();
      V && V !== g.account.label && h("rename", V);
    }
    return (V, p) => (a(), o("li", {
      class: G(["ac-row ac-account ac-hover-actions", { off: !r.account.enabled || !r.account.usable }])
    }, [
      e("div", oa, [
        e("div", la, [
          r.account.usable ? (a(), o("span", {
            key: 0,
            class: G(["kx-tag-sm ac-tone", u.value])
          }, s(L[u.value]), 3)) : (a(), o("span", sa, "personal")),
          v.value ? Q((a(), o("input", {
            key: 2,
            ref_key: "input",
            ref: $,
            "onUpdate:modelValue": p[0] || (p[0] = (m) => f.value = m),
            class: "ac-rename kx-focus-halo",
            "aria-label": "Account label",
            onKeydown: [
              pe(me(w, ["prevent"]), ["enter"]),
              p[1] || (p[1] = pe(me((m) => v.value = !1, ["prevent"]), ["escape"]))
            ],
            onBlur: w
          }, null, 40, ua)), [
            [ie, f.value]
          ]) : (a(), o("span", ca, s(r.account.label), 1)),
          r.account.subscription && r.account.usable ? (a(), o("span", ia, "personal")) : y("", !0)
        ]),
        e("div", ra, [
          S(s(r.kindLabel) + " · " + s(r.account.runs_day) + " " + s(r.account.runs_day === 1 ? "run" : "runs") + " today · " + s(r.account.failures_day) + " " + s(r.account.failures_day === 1 ? "failure" : "failures") + " · ", 1),
          r.account.last_used_at ? (a(), o("span", {
            key: 0,
            title: c(ae)(r.account.last_used_at)
          }, "last used " + s(c(re)(r.account.last_used_at)), 9, da)) : (a(), o("span", va, "never used"))
        ]),
        b.value ? (a(), o("div", pa, s(b.value), 1)) : y("", !0),
        r.account.usable ? r.account.subscription ? (a(), o("div", ka, "Subscription login: personal use only")) : y("", !0) : (a(), o("div", ma, [
          A(c(I), { icon: "tabler:lock" }),
          p[4] || (p[4] = S(" Personal - only its owner runs on it", -1))
        ])),
        r.account.endpoint ? (a(), o("div", ya, s(r.account.endpoint.protocol) + " · " + s(r.account.endpoint.base_url) + s(r.account.endpoint.model ? " · " + r.account.endpoint.model : ""), 1)) : y("", !0),
        u.value === "cooling" ? (a(), o("div", ga, "Back in rotation at " + s(c(ae)(r.account.cooldown_until)), 1)) : y("", !0),
        r.account.last_error ? (a(), o("div", fa, s(r.account.last_error), 1)) : y("", !0)
      ]),
      e("div", ba, [
        r.account.writable ? (a(), o("label", {
          key: 0,
          class: "ac-switch",
          title: r.account.enabled ? "Takes runs" : "Out of rotation"
        }, [
          e("input", {
            type: "checkbox",
            checked: r.account.enabled,
            "aria-label": r.account.enabled ? "Take out of rotation" : "Put in rotation",
            onChange: p[2] || (p[2] = (m) => h("toggle"))
          }, null, 40, _a),
          p[5] || (p[5] = e("span", null, null, -1))
        ], 8, ha)) : y("", !0),
        r.account.writable ? (a(), o("button", {
          key: 1,
          type: "button",
          class: "ac-icon-btn kx-focus-outline",
          title: "Rename",
          "aria-label": "Rename account",
          onClick: C
        }, [
          A(c(I), { icon: "tabler:pencil" })
        ])) : y("", !0),
        r.account.writable ? (a(), o("button", {
          key: 2,
          type: "button",
          class: "ac-icon-btn kx-focus-outline",
          title: "Delete",
          "aria-label": "Delete account",
          onClick: p[3] || (p[3] = (m) => h("remove"))
        }, [
          A(c(I), { icon: "tabler:trash" })
        ])) : y("", !0)
      ])
    ], 2));
  }
}), wa = { class: "ac-stack" }, xa = {
  key: 0,
  class: "kx-err inline"
}, Ca = {
  key: 1,
  class: "kx-empty"
}, Aa = { class: "kx-empty-ico" }, Ta = {
  key: 2,
  class: "kx-empty"
}, Va = { class: "ac-card-head" }, Ra = { class: "ac-card-title" }, La = { class: "ac-muted" }, Ua = { class: "ac-account-grid" }, Sa = { class: "ac-form" }, Ia = ["^config"], qa = /* @__PURE__ */ Y({
  __name: "accounts",
  props: {
    query: {},
    selectedAgent: {}
  },
  emits: ["count"],
  setup(r, { expose: P, emit: g }) {
    const h = r, L = g, u = d(!1);
    P({ open: () => {
      u.value = !0;
    } });
    const b = se("catalog"), v = d([]), f = d({}), $ = d(""), C = d(!1), w = d(""), V = d(0), p = d(h.selectedAgent || b.value.agents[0]?.id || "");
    X(() => h.selectedAgent, (l) => {
      l && (p.value = l);
    });
    const m = M(() => b.value.agents.find((l) => l.id === p.value)), x = M(() => JSON.stringify({ driver: m.value, busy: C.value, error: w.value, saved: V.value })), B = M(() => b.value.agents.map((l) => ({ agent: l, accounts: v.value.filter((n) => n.agent === l.id && [n.label, l.title, n.credential_kind].join(" ").toLowerCase().includes(h.query.toLowerCase())) })).filter((l) => l.accounts.length));
    function D(l) {
      return b.value.agents.find((n) => n.id === l.agent)?.credentials.find((n) => n.id === l.credential_kind)?.label ?? l.credential_kind;
    }
    async function O(l) {
      const n = [...new Set(l.filter((t) => !t.mine).map((t) => t.owner))].filter((t) => !(t in f.value));
      f.value = { ...f.value, ...await Ee(n) };
    }
    const R = te(async () => {
      try {
        const l = await N.accounts();
        v.value = l, await O(l);
      } catch (l) {
        $.value = H(l, "Could not load accounts.");
      }
    });
    ge(() => v.value.map((l) => l.id), () => {
      R();
    }), de(R);
    async function E(l, n) {
      $.value = "";
      try {
        await l(), await R();
      } catch (t) {
        $.value = H(t, n);
      }
    }
    async function K(l) {
      const n = l.detail;
      w.value = "", C.value = !0;
      try {
        await N.createAccount(n), V.value++, u.value = !1, await R();
      } catch (t) {
        w.value = H(t, "Could not save the account.");
      } finally {
        C.value = !1;
      }
    }
    X(v, (l) => L("count", l.length));
    const q = (l) => E(() => N.updateAccount(l.id, { enabled: !l.enabled }), "Could not update the account."), F = (l, n) => E(() => N.updateAccount(l.id, { label: n }), "Could not rename the account.");
    async function z(l) {
      await Pe.confirm({
        header: "Delete account",
        message: `Delete account "${l.label}"? Runs keep their history.`,
        icon: "tabler:trash",
        acceptLabel: "Delete",
        rejectLabel: "Cancel",
        acceptClass: "p-button-danger"
      }) && await E(() => N.deleteAccount(l.id), "Could not delete the account.");
    }
    return Le(() => {
      Ne("chestor-autocode-driver-account", { timeoutMs: 8e3 }).catch(() => {
        $.value = "The driver account card could not load.";
      });
    }), (l, n) => (a(), o("div", wa, [
      $.value ? (a(), o("p", xa, s($.value), 1)) : y("", !0),
      v.value.length ? B.value.length ? y("", !0) : (a(), o("div", Ta, [...n[5] || (n[5] = [
        e("div", { class: "kx-empty-title" }, "No matches", -1),
        e("div", { class: "kx-empty-sub" }, "Try another account or agent.", -1)
      ])])) : (a(), o("div", Ca, [
        e("div", Aa, [
          A(c(I), { icon: "tabler:key" })
        ]),
        n[3] || (n[3] = e("div", { class: "kx-empty-title" }, "No accounts yet", -1)),
        n[4] || (n[4] = e("div", { class: "kx-empty-sub" }, "Add an API key, your own endpoint or a personal subscription login.", -1)),
        A(c(be), {
          label: "Add account",
          onClick: n[0] || (n[0] = (t) => u.value = !0)
        }, {
          icon: ee(() => [
            A(c(I), { icon: "tabler:plus" })
          ]),
          _: 1
        })
      ])),
      (a(!0), o(j, null, W(B.value, (t) => (a(), o("section", {
        key: t.agent.id,
        class: "ac-stack"
      }, [
        e("div", Va, [
          e("h2", Ra, [
            A(c(I), {
              icon: c(le)(t.agent.id)
            }, null, 8, ["icon"]),
            S(s(t.agent.title), 1)
          ]),
          e("span", La, s(t.accounts.filter((i) => i.usable && c(oe)(i) === "ready").length) + " of " + s(t.accounts.length) + " ready", 1)
        ]),
        e("ul", Ua, [
          (a(!0), o(j, null, W(t.accounts, (i) => (a(), J($a, {
            key: i.id,
            account: i,
            "kind-label": D(i),
            "owner-label": f.value[i.owner] || i.owner,
            onToggle: (k) => q(i),
            onRename: (k) => F(i, k),
            onRemove: (k) => z(i)
          }, null, 8, ["account", "kind-label", "owner-label", "onToggle", "onRename", "onRemove"]))), 128))
        ])
      ]))), 128)),
      u.value ? (a(), J(ce, {
        key: 3,
        title: "Add account",
        onClose: n[2] || (n[2] = (t) => u.value = !1)
      }, {
        default: ee(() => [
          e("div", Sa, [
            A(_e, {
              modelValue: p.value,
              "onUpdate:modelValue": n[1] || (n[1] = (t) => p.value = t),
              agents: c(b).agents
            }, null, 8, ["modelValue", "agents"]),
            n[6] || (n[6] = e("p", { class: "ac-hint" }, "Tasks balance across your ready accounts automatically.", -1)),
            m.value ? (a(), o("chestor-autocode-driver-account", {
              key: 0,
              "^config": x.value,
              onSubmit: K
            }, null, 40, Ia)) : y("", !0)
          ])
        ]),
        _: 1
      })) : y("", !0)
    ]));
  }
}), Ea = { class: "ac" }, Na = { class: "ac-bar" }, Pa = {
  class: "ac-tabs",
  "aria-label": "Autocode views"
}, Ba = ["aria-pressed", "onClick"], Da = {
  key: 0,
  class: "kx-err"
}, Ma = {
  key: 1,
  class: "kx-loading"
}, ja = {
  key: 2,
  class: "ac-body"
}, Wa = /* @__PURE__ */ Y({
  __name: "autocode",
  setup(r) {
    const P = [
      { id: "tasks", label: "Tasks", icon: "tabler:player-play" },
      { id: "accounts", label: "Accounts", icon: "tabler:key" }
    ], g = d("tasks"), { catalog: h, error: L, load: u } = xe(), b = d(""), v = d(0), f = d(null), $ = d(null), C = d("");
    async function w(p) {
      p && (C.value = p), g.value = "accounts", b.value = "", await ve(), $.value?.open();
    }
    function V() {
      g.value === "tasks" ? f.value?.open() : $.value?.open();
    }
    return (p, m) => (a(), o("div", Ea, [
      A(Ce, {
        title: "Autocode",
        subtitle: "Run coding agents with your accounts and workspaces.",
        count: `${v.value} ${g.value === "tasks" ? "run" : "account"}${v.value === 1 ? "" : "s"}`,
        action: g.value === "tasks" ? "New task" : "Add account",
        query: b.value,
        "onUpdate:query": m[0] || (m[0] = (x) => b.value = x),
        placeholder: g.value === "tasks" ? "Search tasks…" : "Search accounts…",
        onCreate: V
      }, null, 8, ["count", "action", "query", "placeholder"]),
      e("div", Na, [
        e("nav", Pa, [
          (a(), o(j, null, W(P, (x) => e("button", {
            key: x.id,
            type: "button",
            class: G(["ac-tab kx-focus-outline", { active: g.value === x.id }]),
            "aria-pressed": g.value === x.id,
            onClick: (B) => {
              g.value = x.id, b.value = "", v.value = 0;
            }
          }, [
            A(c(I), {
              icon: x.icon
            }, null, 8, ["icon"]),
            S(" " + s(x.label), 1)
          ], 10, Ba)), 64))
        ])
      ]),
      c(L) && !c(h) ? (a(), o("p", Da, [
        S(s(c(L)) + " ", 1),
        e("button", {
          class: "ac-link kx-focus-outline",
          type: "button",
          onClick: m[1] || (m[1] = //@ts-ignore
          (...x) => c(u) && c(u)(...x))
        }, "Retry")
      ])) : c(h) ? (a(), o("main", ja, [
        g.value === "tasks" ? (a(), J(na, {
          key: 0,
          ref_key: "tasks",
          ref: f,
          query: b.value,
          onCount: m[2] || (m[2] = (x) => v.value = x),
          onAgentChanged: m[3] || (m[3] = (x) => C.value = x),
          onGoto: w
        }, null, 8, ["query"])) : (a(), J(qa, {
          key: 1,
          ref_key: "accounts",
          ref: $,
          query: b.value,
          "selected-agent": C.value,
          onCount: m[4] || (m[4] = (x) => v.value = x)
        }, null, 8, ["query", "selected-agent"]))
      ])) : (a(), o("div", Ma, [
        A(c(I), {
          icon: "tabler:loader-2",
          class: "spin"
        }),
        m[5] || (m[5] = S(" Loading…", -1))
      ]))
    ]));
  }
}), Oa = { props: { type: "object", properties: {} } }, Ga = {
  wippy: Oa
};
class Ha extends Ve {
  static get wippyConfig() {
    return {
      propsSchema: Ga.wippy.props,
      hostCssKeys: ["themeConfigUrl", "primeVueCssUrl", "iframeCssUrl"],
      inlineCss: Ae
    };
  }
  static get vueConfig() {
    return { rootComponent: Wa, plugins: [Te] };
  }
}
Be(import.meta.url, Ha);
//# sourceMappingURL=index.js.map
