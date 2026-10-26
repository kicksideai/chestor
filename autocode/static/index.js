import { u as le, a as he, _ as ce, b as xe, c as Ce, s as Ae, P as Te } from "./styles-Dyj6gwe5.js";
import { u as de, W as Ve } from "./dto-BwnY4_Sk.js";
import { defineComponent as ee, openBlock as t, createElementBlock as a, Fragment as O, renderList as K, normalizeClass as F, createVNode as R, unref as o, createTextVNode as U, toDisplayString as s, ref as v, computed as B, watch as Z, createElementVNode as e, withDirectives as Y, vModelText as ie, createCommentVNode as k, vModelSelect as ue, vModelCheckbox as Le, createBlock as J, onUnmounted as ve, nextTick as pe, withCtx as te, withKeys as ye, withModifiers as be, onMounted as Re } from "vue";
import { Icon as q } from "@iconify/vue";
import re from "primevue/button";
import { b as oe, u as ne, c as se, d as ae, a as M, e as Q, l as me, r as ke, f as _e, t as Se, s as ge, p as Ue } from "./presentation-BywIrdSa.js";
import { d as Ee, m as qe, a as Ie, _ as Ne } from "./driver-options.vue_vue_type_script_setup_true_lang-P5mXashh.js";
import { loadByTagName as Pe, host as Me, define as Be } from "@wippy-fe/proxy";
import { a as De } from "./driver-account-types-qZx5PFoW.js";
const We = {
  key: 0,
  class: "ac-chips",
  role: "group",
  "aria-label": "Agent"
}, je = ["disabled", "aria-pressed", "onClick"], Oe = ["disabled", "value"], He = ["value"], $e = /* @__PURE__ */ ee({
  __name: "agent-picker",
  props: {
    agents: {},
    modelValue: {},
    disabled: { type: Boolean }
  },
  emits: ["update:modelValue"],
  setup(r) {
    return (P, $) => r.agents.length <= 6 ? (t(), a("div", We, [
      (t(!0), a(O, null, K(r.agents, (w) => (t(), a("button", {
        key: w.id,
        disabled: r.disabled,
        type: "button",
        class: F(["ac-chip kx-focus-halo", { active: r.modelValue === w.id }]),
        "aria-pressed": r.modelValue === w.id,
        onClick: (S) => P.$emit("update:modelValue", w.id)
      }, [
        R(o(q), {
          icon: o(oe)(w.id, r.agents),
          "aria-hidden": "true"
        }, null, 8, ["icon"]),
        U(s(w.title), 1)
      ], 10, je))), 128))
    ])) : (t(), a("select", {
      key: 1,
      disabled: r.disabled,
      class: "kx-focus-halo",
      "aria-label": "Agent",
      value: r.modelValue,
      onChange: $[0] || ($[0] = (w) => P.$emit("update:modelValue", w.target.value))
    }, [
      (t(!0), a(O, null, K(r.agents, (w) => (t(), a("option", {
        key: w.id,
        value: w.id
      }, s(w.title), 9, He))), 128))
    ], 40, Oe));
  }
}), Ge = { class: "ac-field ac-composer" }, Ke = { class: "ac-field" }, ze = {
  key: 0,
  class: "ac-muted"
}, Fe = {
  key: 1,
  class: "ac-muted"
}, Je = { class: "ac-picker-row" }, Qe = { class: "ac-field" }, Xe = { value: "" }, Ye = ["value"], Ze = { class: "ac-field" }, et = ["value"], tt = { class: "ac-field" }, at = ["value"], nt = { class: "ac-advanced" }, st = { class: "ac-form" }, lt = { class: "ac-field" }, ot = {
  key: 0,
  class: "ac-check"
}, ut = {
  key: 2,
  class: "kx-err",
  role: "alert"
}, ct = { class: "ac-dialog-foot" }, it = ["disabled"], rt = /* @__PURE__ */ ee({
  __name: "task-form",
  props: {
    accounts: {},
    images: {},
    workspaces: {},
    drivers: {}
  },
  emits: ["started", "goto", "agentChanged", "cancel"],
  setup(r, { emit: P }) {
    const $ = r, w = P, S = le(), u = v(null);
    function _() {
      const f = S.value.settings_path;
      f && u.value?.dispatchEvent(new CustomEvent("navigate", { detail: { path: f }, bubbles: !0, composed: !0 }));
    }
    const b = v(Ee(S.value, $.accounts)), h = v(""), C = v(""), x = v(""), V = v(""), A = v(""), T = v({}), p = v(!1), g = v(0), D = v(!1), N = v(""), H = B(() => S.value.agents.find((f) => f.id === b.value)), L = B(() => $.drivers.find((f) => f.id === b.value)), W = B(() => $.accounts.filter((f) => f.agent === b.value && f.usable && f.enabled)), I = ne(), G = B(() => W.value.filter((f) => se(f, I.value) === "ready")), j = B(() => qe($.images, b.value));
    function X(f) {
      return se(f, I.value) === "cooling" ? `${f.label} (cooling down until ${ae(f.cooldown_until)})` : f.label;
    }
    Z([j, W, () => $.workspaces], () => {
      j.value.some((f) => f.id === C.value) || (C.value = j.value[0]?.id ?? ""), h.value && !W.value.some((f) => f.id === h.value) && (h.value = ""), x.value && !$.workspaces.some((f) => f.id === x.value) && (x.value = "");
    }, { immediate: !0 }), Z(b, () => {
      h.value = "", g.value = 0, w("agentChanged", b.value);
    }, { immediate: !0 }), Z(() => L.value?.id, () => {
      const f = L.value;
      T.value = Ie(f), p.value = !!f?.unattended;
    }, { immediate: !0 }), Z(p, (f) => {
      const d = L.value?.unattended;
      if (!f || !d) return;
      const y = { ...T.value };
      for (const i of Object.keys(d)) delete y[i];
      T.value = y;
    });
    async function z() {
      N.value = "", D.value = !0;
      try {
        const { id: f } = await M.startRun({
          agent: b.value,
          account_id: h.value,
          image_id: C.value,
          workspace_id: x.value,
          repo_url: V.value,
          prompt: A.value,
          options: T.value,
          unattended: p.value
        });
        A.value = "", w("started", f);
      } catch (f) {
        N.value = Q(f, "Could not start the task.");
      } finally {
        D.value = !1;
      }
    }
    return (f, d) => (t(), a("section", {
      ref_key: "root",
      ref: u,
      class: "ac-form ac-new"
    }, [
      e("label", Ge, [
        d[11] || (d[11] = e("span", null, "Prompt", -1)),
        Y(e("textarea", {
          "onUpdate:modelValue": d[0] || (d[0] = (y) => A.value = y),
          autofocus: "",
          rows: "8",
          class: "kx-focus-halo",
          placeholder: "What should the agent do?"
        }, null, 512), [
          [ie, A.value]
        ])
      ]),
      e("div", Ke, [
        d[12] || (d[12] = e("span", null, "Agent", -1)),
        R($e, {
          modelValue: b.value,
          "onUpdate:modelValue": d[1] || (d[1] = (y) => b.value = y),
          agents: o(S).agents
        }, null, 8, ["modelValue", "agents"])
      ]),
      b.value && !W.value.length ? (t(), a("p", ze, [
        U(" No " + s(H.value?.title) + " accounts you can run on. ", 1),
        e("button", {
          class: "ac-link kx-focus-outline",
          type: "button",
          onClick: d[2] || (d[2] = (y) => w("goto", "accounts", b.value))
        }, "Add an account")
      ])) : k("", !0),
      j.value.length ? k("", !0) : (t(), a("p", Fe, [
        U(" No image with " + s(H.value?.title ?? b.value) + "; ask an administrator. ", 1),
        o(S).can_images && o(S).settings_path ? (t(), a("button", {
          key: 0,
          class: "ac-link kx-focus-outline",
          type: "button",
          onClick: _
        }, "Manage images")) : k("", !0)
      ])),
      e("div", Je, [
        e("label", Qe, [
          d[13] || (d[13] = e("span", null, "Account", -1)),
          Y(e("select", {
            "onUpdate:modelValue": d[3] || (d[3] = (y) => h.value = y),
            class: "kx-focus-halo"
          }, [
            e("option", Xe, "Auto (" + s(G.value.length) + " ready)", 1),
            (t(!0), a(O, null, K(W.value, (y) => (t(), a("option", {
              key: y.id,
              value: y.id
            }, s(X(y)), 9, Ye))), 128))
          ], 512), [
            [ue, h.value]
          ])
        ]),
        e("label", Ze, [
          d[14] || (d[14] = e("span", null, "Image", -1)),
          Y(e("select", {
            "onUpdate:modelValue": d[4] || (d[4] = (y) => C.value = y),
            class: "kx-focus-halo"
          }, [
            (t(!0), a(O, null, K(j.value, (y) => (t(), a("option", {
              key: y.id,
              value: y.id
            }, s(y.label), 9, et))), 128))
          ], 512), [
            [ue, C.value]
          ])
        ]),
        e("label", tt, [
          d[16] || (d[16] = e("span", null, "Workspace", -1)),
          Y(e("select", {
            "onUpdate:modelValue": d[5] || (d[5] = (y) => x.value = y),
            class: "kx-focus-halo"
          }, [
            d[15] || (d[15] = e("option", { value: "" }, "Scratch directory", -1)),
            (t(!0), a(O, null, K(r.workspaces, (y) => (t(), a("option", {
              key: y.id,
              value: y.id
            }, s(y.name) + s(y.writable ? "" : " (read-only)"), 9, at))), 128))
          ], 512), [
            [ue, x.value]
          ])
        ])
      ]),
      e("details", nt, [
        d[19] || (d[19] = e("summary", { class: "kx-focus-outline" }, "Advanced", -1)),
        e("div", st, [
          e("label", lt, [
            d[17] || (d[17] = e("span", null, "Git repository", -1)),
            Y(e("input", {
              "onUpdate:modelValue": d[6] || (d[6] = (y) => V.value = y),
              class: "ac-mono kx-focus-halo",
              placeholder: "Optional: https://github.com/org/repo.git"
            }, null, 512), [
              [ie, V.value]
            ])
          ]),
          L.value?.unattended ? (t(), a("label", ot, [
            Y(e("input", {
              "onUpdate:modelValue": d[7] || (d[7] = (y) => p.value = y),
              type: "checkbox",
              class: "kx-focus-outline"
            }, null, 512), [
              [Le, p.value]
            ]),
            d[18] || (d[18] = U(" Unattended · skip permission prompts when the image allows it ", -1))
          ])) : k("", !0),
          L.value ? (t(), J(Ne, {
            key: L.value.id,
            modelValue: T.value,
            "onUpdate:modelValue": d[8] || (d[8] = (y) => T.value = y),
            options: L.value.options,
            locked: p.value && L.value.unattended ? L.value.unattended : {},
            onInvalid: d[9] || (d[9] = (y) => g.value = y)
          }, null, 8, ["modelValue", "options", "locked"])) : k("", !0)
        ])
      ]),
      N.value ? (t(), a("p", ut, s(N.value), 1)) : k("", !0),
      e("footer", ct, [
        e("button", {
          type: "button",
          class: "ac-btn kx-focus-halo",
          onClick: d[10] || (d[10] = (y) => w("cancel"))
        }, "Cancel"),
        e("button", {
          type: "button",
          class: "ac-btn primary kx-focus-halo",
          disabled: D.value || g.value > 0 || !b.value || !(h.value || G.value.length) || !C.value || !A.value.trim(),
          onClick: z
        }, [
          R(o(q), { icon: "tabler:player-play" }),
          U(" " + s(D.value ? "Starting…" : "Start"), 1)
        ], 8, it)
      ])
    ], 512));
  }
}), dt = { class: "ac-form ac-detail" }, vt = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, pt = {
  key: 1,
  class: "kx-loading"
}, mt = { class: "ac-detail-head" }, kt = { class: "ac-card-head" }, gt = ["disabled"], ft = { class: "ac-detail-title" }, yt = { class: "ac-run-meta ac-detail-meta" }, bt = ["title"], ht = { key: 0 }, _t = { key: 1 }, $t = { key: 2 }, wt = { key: 3 }, xt = { key: 4 }, Ct = { key: 5 }, At = {
  class: "ac-detail-section",
  "aria-labelledby": "ac-prompt-heading"
}, Tt = { class: "ac-section-head" }, Vt = ["aria-expanded"], Lt = {
  key: 0,
  class: "ac-detail-section ac-result",
  "aria-labelledby": "ac-result-heading"
}, Rt = { class: "ac-section-head" }, St = { id: "ac-result-heading" }, Ut = { class: "ac-row-actions" }, Et = ["aria-expanded"], qt = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, It = {
  key: 1,
  class: "kx-err",
  role: "alert"
}, Nt = {
  class: "ac-detail-section",
  "aria-labelledby": "ac-log-heading"
}, Pt = { class: "ac-section-head" }, Mt = { class: "ac-muted" }, Bt = { class: "ac-event-kind" }, Dt = { class: "ac-event-text" }, Wt = {
  key: 0,
  class: "ac-muted ac-pulse"
}, jt = {
  key: 1,
  class: "ac-muted"
}, Ot = /* @__PURE__ */ ee({
  __name: "run-detail",
  props: {
    runId: {},
    accounts: {},
    images: {},
    workspaces: {}
  },
  emits: ["changed"],
  setup(r, { emit: P }) {
    const $ = r, w = P, S = le(), u = v(null), _ = v([]), b = v(""), h = v(null), C = v(null), x = v(!1), V = v(!1), A = v(!1), T = v(""), p = ne(), g = B(() => (u.value?.prompt.length ?? 0) > 500 || (u.value?.prompt.split(`
`).length ?? 0) > 5), D = B(() => (u.value?.result.length ?? 0) > 1800 || (u.value?.result.split(`
`).length ?? 0) > 10);
    let N = !0, H = !0, L;
    const W = (n) => n.status === "queued" || n.status === "running";
    function I() {
      h.value && (H = h.value.scrollHeight - h.value.scrollTop - h.value.clientHeight < 40);
    }
    const G = ge(async () => {
      try {
        let n = !0;
        for (; n && N; ) {
          const m = _.value.length ? _.value[_.value.length - 1].seq : 0, E = await M.run($.runId, m);
          if (!N) return;
          u.value = E.run, E.events.length && (_.value = _.value.concat(E.events), await pe(), H && h.value?.scrollTo({ top: h.value.scrollHeight })), n = E.more;
        }
        N && u.value && w("changed", u.value), b.value = "";
      } catch (n) {
        b.value = Q(n, "Could not load the task.");
      }
    }), j = me.run($.runId, () => {
      G();
    });
    de(G), ve(() => {
      N = !1, j(), clearTimeout(L);
    });
    async function X() {
      try {
        await M.cancelRun($.runId), await G();
      } catch (n) {
        b.value = Q(n, "Could not cancel the task.");
      }
    }
    async function z() {
      try {
        const n = u.value?.result ?? "";
        try {
          await navigator.clipboard.writeText(n);
        } catch {
          const m = document.createElement("textarea"), E = C.value?.getRootNode(), fe = E instanceof ShadowRoot || E instanceof Document ? E.activeElement : null, we = fe instanceof HTMLElement ? fe : null;
          m.value = n, m.readOnly = !0, m.style.cssText = "position:fixed;opacity:0;pointer-events:none;", C.value?.parentElement?.append(m);
          try {
            if (m.select(), !document.execCommand("copy")) throw new Error("Copy failed");
          } finally {
            m.remove(), we?.focus({ preventScroll: !0 });
          }
        }
        A.value = !0, T.value = "", clearTimeout(L), L = setTimeout(() => {
          A.value = !1;
        }, 2e3);
      } catch {
        T.value = "Could not copy. Select the result text to copy it.";
      }
    }
    function f() {
      V.value = !V.value, V.value || C.value?.scrollTo({ top: 0 });
    }
    function d(n) {
      return typeof n.options?.model == "string" ? n.options.model : "";
    }
    function y(n) {
      return $.accounts.find((m) => m.id === n)?.label ?? "Unlisted account";
    }
    function i(n) {
      return $.workspaces.find((m) => m.id === n)?.name ?? "Unlisted workspace";
    }
    function l(n) {
      return $.images.find((m) => m.id === n)?.label ?? "Unlisted image";
    }
    function c(n) {
      const m = [];
      return n.usage.input_tokens !== void 0 && m.push(`${n.usage.input_tokens} input`), n.usage.output_tokens !== void 0 && m.push(`${n.usage.output_tokens} output`), n.usage.cached_tokens !== void 0 && m.push(`${n.usage.cached_tokens} cached`), m.length ? `${m.join(" · ")} tokens` : "";
    }
    return (n, m) => (t(), a("section", dt, [
      b.value ? (t(), a("p", vt, [
        U(s(b.value) + " ", 1),
        e("button", {
          type: "button",
          class: "ac-link kx-focus-outline",
          onClick: m[0] || (m[0] = //@ts-ignore
          (...E) => o(G) && o(G)(...E))
        }, "Retry")
      ])) : k("", !0),
      !u.value && !b.value ? (t(), a("div", pt, [
        R(o(q), {
          icon: "tabler:loader-2",
          class: "spin"
        }),
        m[2] || (m[2] = U(" Loading the task…", -1))
      ])) : u.value ? (t(), a(O, { key: 2 }, [
        e("header", mt, [
          e("div", kt, [
            e("span", {
              class: F(["kx-tag-sm ac-tone", u.value.status])
            }, s(u.value.status), 3),
            W(u.value) ? (t(), a("button", {
              key: 0,
              type: "button",
              class: "ac-btn danger kx-focus-halo",
              disabled: u.value.cancel_requested,
              onClick: X
            }, [
              R(o(q), { icon: "tabler:player-stop" }),
              U(" " + s(u.value.cancel_requested ? "Cancelling…" : "Cancel"), 1)
            ], 8, gt)) : k("", !0)
          ]),
          e("h2", ft, s(u.value.prompt.split(`
`)[0]), 1),
          e("div", yt, [
            e("span", null, [
              R(o(q), {
                icon: o(oe)(u.value.agent, o(S).agents)
              }, null, 8, ["icon"]),
              U(s(o(S).agents.find((E) => E.id === u.value?.agent)?.title ?? u.value.agent), 1)
            ]),
            e("span", null, s(y(u.value.account_id)), 1),
            e("span", null, s(l(u.value.image_id)), 1),
            e("span", {
              title: o(ae)(u.value.started_at || u.value.created_at)
            }, s(u.value.started_at ? "Started" : "Queued") + " " + s(o(ke)(u.value.started_at || u.value.created_at, o(p))), 9, bt),
            u.value.started_at ? (t(), a("span", ht, s(o(_e)(u.value, o(p))) + " " + s(W(u.value) ? "elapsed" : "duration"), 1)) : k("", !0),
            u.value.timeout_ms ? (t(), a("span", _t, s(o(Se)(u.value.timeout_ms)), 1)) : k("", !0),
            e("span", null, s(u.value.unattended ? "Unattended" : "Attended"), 1),
            u.value.workflow ? (t(), a("span", $t, "Workflow")) : k("", !0),
            u.value.workspace_id ? (t(), a("span", wt, s(i(u.value.workspace_id)), 1)) : k("", !0),
            d(u.value) ? (t(), a("span", xt, s(d(u.value)), 1)) : k("", !0),
            c(u.value) ? (t(), a("span", Ct, s(c(u.value)), 1)) : k("", !0)
          ])
        ]),
        e("section", At, [
          e("div", Tt, [
            m[3] || (m[3] = e("h3", { id: "ac-prompt-heading" }, "Prompt", -1)),
            g.value ? (t(), a("button", {
              key: 0,
              type: "button",
              class: "ac-link kx-focus-outline",
              "aria-expanded": x.value,
              "aria-controls": "ac-prompt-text",
              onClick: m[1] || (m[1] = (E) => x.value = !x.value)
            }, s(x.value ? "Collapse prompt" : "Expand prompt"), 9, Vt)) : k("", !0)
          ]),
          e("pre", {
            id: "ac-prompt-text",
            class: F(["ac-pre ac-prompt", { expanded: x.value || !g.value }])
          }, [
            e("span", null, s(u.value.prompt), 1)
          ], 2)
        ]),
        u.value.result ? (t(), a("section", Lt, [
          e("div", Rt, [
            e("h3", St, s(u.value.status === "succeeded" ? "Result" : "Partial result"), 1),
            e("div", Ut, [
              D.value ? (t(), a("button", {
                key: 0,
                type: "button",
                class: "ac-link kx-focus-outline",
                "aria-expanded": V.value,
                "aria-controls": "ac-result-text",
                onClick: f
              }, s(V.value ? "Collapse result" : "Expand result"), 9, Et)) : k("", !0),
              e("button", {
                type: "button",
                class: "ac-btn kx-focus-halo",
                onClick: z
              }, [
                R(o(q), {
                  icon: A.value ? "tabler:check" : "tabler:copy"
                }, null, 8, ["icon"]),
                U(s(A.value ? "Copied" : "Copy"), 1)
              ])
            ])
          ]),
          T.value ? (t(), a("p", qt, s(T.value), 1)) : k("", !0),
          e("pre", {
            id: "ac-result-text",
            ref_key: "result",
            ref: C,
            class: F(["ac-pre ac-result-text", { expanded: V.value }]),
            tabindex: "0",
            "aria-label": "Result"
          }, s(u.value.result), 3)
        ])) : k("", !0),
        u.value.error ? (t(), a("p", It, s(u.value.error), 1)) : k("", !0),
        e("section", Nt, [
          e("div", Pt, [
            m[4] || (m[4] = e("h3", { id: "ac-log-heading" }, "Log", -1)),
            e("span", Mt, s(_.value.length) + " events", 1)
          ]),
          e("div", {
            ref_key: "stream",
            ref: h,
            class: "ac-stream",
            tabindex: "0",
            "aria-label": "Task log",
            onScroll: I
          }, [
            (t(!0), a(O, null, K(_.value, (E) => (t(), a("div", {
              key: E.seq,
              class: F(["ac-event", E.kind])
            }, [
              e("span", Bt, s(E.kind), 1),
              e("pre", Dt, s(E.text), 1)
            ], 2))), 128)),
            W(u.value) ? (t(), a("div", Wt, "Working…")) : _.value.length ? k("", !0) : (t(), a("div", jt, "No log events."))
          ], 544)
        ])
      ], 64)) : k("", !0)
    ]));
  }
}), Ht = {
  key: 0,
  class: "kx-loading"
}, Gt = { key: 1 }, Kt = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, zt = {
  key: 1,
  class: "kx-empty"
}, Ft = { class: "kx-empty-ico" }, Jt = { class: "kx-empty-sub" }, Qt = {
  key: 2,
  class: "kx-empty"
}, Xt = {
  key: 3,
  class: "ac-muted"
}, Yt = {
  key: 4,
  class: "ac-run-list"
}, Zt = ["onClick"], ea = { class: "ac-run-copy" }, ta = { class: "ac-run-title-row" }, aa = { class: "ac-run-title" }, na = {
  key: 0,
  class: "kx-tag-sm ac-tone"
}, sa = { class: "ac-run-meta" }, la = ["title"], oa = { key: 0 }, ua = /* @__PURE__ */ ee({
  __name: "tasks",
  props: {
    query: {}
  },
  emits: ["goto", "agentChanged", "count"],
  setup(r, { expose: P, emit: $ }) {
    const w = r, S = $, u = le(), _ = v(!1);
    P({ open: () => {
      _.value = !0;
    } });
    const b = v([]), h = v([]), C = v([]), x = v([]), V = v([]), A = v(), T = v(!1), p = v(""), g = v(null), D = ne(), N = v(!1);
    let H = 0;
    const L = ge(async () => {
      H++, N.value = !0;
      try {
        const [l, c, n, m, E] = await Promise.all([M.accounts(), M.images(), M.runs(), M.workspaces(), M.drivers()]);
        b.value = l, h.value = c, V.value = n.runs, A.value = n.next_cursor, C.value = m.workspaces, x.value = E, T.value = !0, p.value = "";
      } catch (l) {
        p.value = Q(l, "Could not load tasks.");
      } finally {
        N.value = !1;
      }
    }), W = me.runs(() => {
      L();
    });
    he(() => [...h.value, ...b.value].map((l) => l.id), () => {
      L();
    }), de(L), ve(W);
    const I = v(!1);
    async function G() {
      if (!(!A.value || I.value || N.value)) {
        I.value = !0;
        try {
          const l = H, c = await M.runs(A.value);
          if (H !== l) return;
          const n = new Set(V.value.map((m) => m.id));
          V.value.push(...c.runs.filter((m) => !n.has(m.id))), A.value = c.next_cursor;
        } catch (l) {
          p.value = Q(l, "Could not load more tasks.");
        } finally {
          I.value = !1;
        }
      }
    }
    async function j(l) {
      _.value = !1, await L(), g.value = l;
    }
    function X() {
      L();
    }
    const z = B(() => b.value.some((l) => l.usable && l.enabled)), f = B(() => V.value.filter((l) => [l.prompt_summary, l.status, l.agent, d(l.agent), i(l.account_id)].join(" ").toLowerCase().includes(w.query.trim().toLowerCase())));
    Z(V, (l) => S("count", l.length));
    function d(l) {
      return u.value.agents.find((c) => c.id === l)?.title ?? l;
    }
    function y(l) {
      return h.value.find((c) => c.id === l)?.label ?? "Unlisted image";
    }
    function i(l) {
      return b.value.find((c) => c.id === l)?.label ?? "unlisted account";
    }
    return (l, c) => T.value ? (t(), a("div", Gt, [
      p.value ? (t(), a("p", Kt, [
        U(s(p.value) + " ", 1),
        e("button", {
          class: "ac-link kx-focus-outline",
          type: "button",
          onClick: c[1] || (c[1] = //@ts-ignore
          (...n) => o(L) && o(L)(...n))
        }, "Retry")
      ])) : k("", !0),
      V.value.length ? f.value.length ? k("", !0) : (t(), a("div", Qt, [...c[11] || (c[11] = [
        e("div", { class: "kx-empty-title" }, "No matches", -1),
        e("div", { class: "kx-empty-sub" }, "Try another task, agent or account.", -1)
      ])])) : (t(), a("div", zt, [
        e("div", Ft, [
          R(o(q), { icon: "tabler:terminal-2" })
        ]),
        c[10] || (c[10] = e("div", { class: "kx-empty-title" }, "No tasks yet", -1)),
        e("div", Jt, s(z.value ? "Give a coding agent a task and follow its progress here." : "Add an account to give your coding agent a place to start."), 1),
        R(o(re), {
          label: z.value ? "New task" : "Add account",
          onClick: c[2] || (c[2] = (n) => z.value ? _.value = !0 : S("goto"))
        }, {
          icon: te(() => [
            R(o(q), { icon: "tabler:plus" })
          ]),
          _: 1
        }, 8, ["label"])
      ])),
      V.value.length ? (t(), a("p", Xt, "Search filters the loaded tasks.")) : k("", !0),
      f.value.length ? (t(), a("ul", Yt, [
        (t(!0), a(O, null, K(f.value, (n) => (t(), a("li", {
          key: n.id,
          class: "ac-run"
        }, [
          e("button", {
            type: "button",
            class: "ac-run-main kx-focus-halo",
            onClick: (m) => g.value = n.id
          }, [
            e("span", ea, [
              e("span", ta, [
                e("span", aa, s(n.prompt_summary.split(`
`)[0]), 1),
                e("span", {
                  class: F(["kx-tag-sm ac-tone", n.status])
                }, s(n.status), 3),
                n.workflow ? (t(), a("span", na, "Workflow")) : k("", !0)
              ]),
              e("span", sa, [
                e("span", null, [
                  R(o(q), {
                    icon: o(oe)(n.agent, o(u).agents)
                  }, null, 8, ["icon"]),
                  U(s(d(n.agent)), 1)
                ]),
                e("span", null, s(i(n.account_id)), 1),
                e("span", null, s(y(n.image_id)), 1),
                e("span", {
                  title: o(ae)(n.started_at || n.created_at)
                }, s(o(ke)(n.started_at || n.created_at, o(D))), 9, la),
                n.started_at ? (t(), a("span", oa, s(o(_e)(n, o(D))) + " " + s(n.status === "running" ? "elapsed" : "duration"), 1)) : k("", !0)
              ])
            ]),
            R(o(q), {
              icon: "tabler:chevron-right",
              class: "ac-run-chevron ac-muted"
            })
          ], 8, Zt)
        ]))), 128))
      ])) : k("", !0),
      A.value ? (t(), J(o(re), {
        key: 5,
        label: "Load more tasks",
        loading: I.value,
        disabled: N.value,
        onClick: G
      }, null, 8, ["loading", "disabled"])) : k("", !0),
      _.value ? (t(), J(ce, {
        key: 6,
        title: "New task",
        wide: "",
        onClose: c[6] || (c[6] = (n) => _.value = !1)
      }, {
        default: te(() => [
          R(rt, {
            accounts: b.value,
            images: h.value,
            workspaces: C.value,
            drivers: x.value,
            onStarted: j,
            onCancel: c[3] || (c[3] = (n) => _.value = !1),
            onAgentChanged: c[4] || (c[4] = (n) => S("agentChanged", n)),
            onGoto: c[5] || (c[5] = (n, m) => S("goto", m))
          }, null, 8, ["accounts", "images", "workspaces", "drivers"])
        ]),
        _: 1
      })) : k("", !0),
      g.value ? (t(), J(ce, {
        key: 7,
        title: "Task details",
        wide: "",
        onClose: c[8] || (c[8] = (n) => g.value = null)
      }, {
        footer: te(() => [
          e("button", {
            type: "button",
            class: "ac-btn kx-focus-halo",
            onClick: c[7] || (c[7] = (n) => g.value = null)
          }, "Close")
        ]),
        default: te(() => [
          (t(), J(Ot, {
            key: g.value,
            "run-id": g.value,
            accounts: b.value,
            images: h.value,
            workspaces: C.value,
            onChanged: X
          }, null, 8, ["run-id", "accounts", "images", "workspaces"]))
        ]),
        _: 1
      })) : k("", !0)
    ])) : (t(), a("div", Ht, [
      p.value ? (t(), a(O, { key: 0 }, [
        U(s(p.value) + " ", 1),
        e("button", {
          class: "ac-link kx-focus-outline",
          type: "button",
          onClick: c[0] || (c[0] = //@ts-ignore
          (...n) => o(L) && o(L)(...n))
        }, "Retry")
      ], 64)) : (t(), a(O, { key: 1 }, [
        R(o(q), {
          icon: "tabler:loader-2",
          class: "spin"
        }),
        c[9] || (c[9] = U(" Loading tasks…", -1))
      ], 64))
    ]));
  }
}), ca = { class: "ac-account-main" }, ia = { class: "ac-row-title" }, ra = ["onKeydown"], da = {
  key: 1,
  class: "ac-row-name"
}, va = {
  key: 2,
  class: "kx-tag-sm ac-tone"
}, pa = { class: "ac-muted" }, ma = ["title"], ka = { key: 1 }, ga = {
  key: 0,
  class: "ac-muted"
}, fa = {
  key: 1,
  class: "ac-muted ac-strong"
}, ya = {
  key: 2,
  class: "ac-muted"
}, ba = {
  key: 3,
  class: "ac-muted ac-mono"
}, ha = {
  key: 4,
  class: "ac-muted"
}, _a = {
  key: 5,
  class: "kx-err ac-small"
}, $a = { class: "ac-row-actions" }, wa = ["title"], xa = ["checked", "aria-label"], Ca = /* @__PURE__ */ ee({
  __name: "account-row",
  props: {
    account: {},
    kindLabel: {},
    ownerLabel: {}
  },
  emits: ["toggle", "rename", "remove"],
  setup(r, { emit: P }) {
    const $ = r, w = P, S = { ready: "ready", cooling: "cooling down", disabled: "disabled" }, u = ne(), _ = B(() => se($.account, u.value)), b = B(() => $.account.mine ? "" : `Shared with you by ${$.ownerLabel}`), h = v(!1), C = v(""), x = v(null);
    function V() {
      C.value = $.account.label, h.value = !0, pe(() => x.value?.select());
    }
    function A() {
      if (!h.value) return;
      h.value = !1;
      const T = C.value.trim();
      T && T !== $.account.label && w("rename", T);
    }
    return (T, p) => (t(), a("li", {
      class: F(["ac-row ac-account ac-hover-actions", { off: !r.account.enabled || !r.account.usable }])
    }, [
      e("div", ca, [
        e("div", ia, [
          e("span", {
            class: F(["kx-tag-sm ac-tone", _.value])
          }, s(S[_.value]), 3),
          h.value ? Y((t(), a("input", {
            key: 0,
            ref_key: "input",
            ref: x,
            "onUpdate:modelValue": p[0] || (p[0] = (g) => C.value = g),
            class: "ac-rename kx-focus-halo",
            "aria-label": "Account label",
            onKeydown: [
              ye(be(A, ["prevent"]), ["enter"]),
              p[1] || (p[1] = ye(be((g) => h.value = !1, ["prevent"]), ["escape"]))
            ],
            onBlur: A
          }, null, 40, ra)), [
            [ie, C.value]
          ]) : (t(), a("span", da, s(r.account.label), 1)),
          r.account.subscription ? (t(), a("span", va, "personal")) : k("", !0)
        ]),
        e("div", pa, [
          U(s(r.kindLabel) + " · " + s(r.account.runs_day) + " " + s(r.account.runs_day === 1 ? "task" : "tasks") + " in the last 24 hours · " + s(r.account.failures_day) + " " + s(r.account.failures_day === 1 ? "failure" : "failures") + " · ", 1),
          r.account.last_used_at ? (t(), a("span", {
            key: 0,
            title: o(ae)(r.account.last_used_at)
          }, "last used " + s(o(ke)(r.account.last_used_at, o(u))), 9, ma)) : (t(), a("span", ka, "never used"))
        ]),
        b.value ? (t(), a("div", ga, s(b.value), 1)) : k("", !0),
        r.account.usable ? r.account.subscription ? (t(), a("div", ya, "Subscription login: personal use only")) : k("", !0) : (t(), a("div", fa, [
          R(o(q), { icon: "tabler:lock" }),
          U(" " + s(r.account.unavailable_reason || "Account unavailable for tasks"), 1)
        ])),
        r.account.endpoint ? (t(), a("div", ba, s(r.account.endpoint.protocol) + " · " + s(r.account.endpoint.base_url) + s(r.account.endpoint.model ? " · " + r.account.endpoint.model : ""), 1)) : k("", !0),
        _.value === "cooling" ? (t(), a("div", ha, "Back in rotation at " + s(o(ae)(r.account.cooldown_until)), 1)) : k("", !0),
        r.account.last_error ? (t(), a("div", _a, s(r.account.last_error), 1)) : k("", !0)
      ]),
      e("div", $a, [
        r.account.writable ? (t(), a("label", {
          key: 0,
          class: "ac-switch",
          title: r.account.enabled ? "Takes tasks" : "Out of rotation"
        }, [
          e("input", {
            type: "checkbox",
            checked: r.account.enabled,
            "aria-label": r.account.enabled ? "Take out of rotation" : "Put in rotation",
            onChange: p[2] || (p[2] = (g) => w("toggle"))
          }, null, 40, xa),
          p[4] || (p[4] = e("span", null, null, -1))
        ], 8, wa)) : k("", !0),
        r.account.writable ? (t(), a("button", {
          key: 1,
          type: "button",
          class: "ac-icon-btn kx-focus-outline",
          title: "Rename",
          "aria-label": "Rename account",
          onClick: V
        }, [
          R(o(q), { icon: "tabler:pencil" })
        ])) : k("", !0),
        r.account.deletable ? (t(), a("button", {
          key: 2,
          type: "button",
          class: "ac-icon-btn kx-focus-outline",
          title: "Delete",
          "aria-label": "Delete account",
          onClick: p[3] || (p[3] = (g) => w("remove"))
        }, [
          R(o(q), { icon: "tabler:trash" })
        ])) : k("", !0)
      ])
    ], 2));
  }
}), Aa = { class: "ac-stack" }, Ta = {
  key: 0,
  class: "kx-err inline"
}, Va = {
  key: 1,
  class: "kx-loading"
}, La = {
  key: 2,
  class: "kx-empty"
}, Ra = { class: "kx-empty-ico" }, Sa = {
  key: 3,
  class: "kx-empty"
}, Ua = { class: "ac-card-head" }, Ea = { class: "ac-card-title" }, qa = { class: "ac-muted" }, Ia = { class: "ac-account-grid" }, Na = { class: "ac-form" }, Pa = ["^config"], Ma = /* @__PURE__ */ ee({
  __name: "accounts",
  props: {
    query: {},
    selectedAgent: {}
  },
  emits: ["count"],
  setup(r, { expose: P, emit: $ }) {
    const w = r, S = $, u = v(!1);
    P({ open: () => {
      u.value = !0;
    } });
    const _ = le(), b = ne(), h = v([]), C = v({}), x = v(""), V = v(!1), A = v(!1), T = v(""), p = v(0), g = v(w.selectedAgent || _.value.agents[0]?.id || "");
    Z(() => w.selectedAgent, (i) => {
      i && (g.value = i);
    });
    const D = B(() => _.value.agents.find((i) => i.id === g.value)), N = B(() => JSON.stringify({ driver: D.value, busy: A.value, error: T.value, saved: p.value, limits: _.value.account_limits })), H = B(() => [..._.value.agents, ...[...new Set(h.value.map((i) => i.agent))].filter((i) => !_.value.agents.some((l) => l.id === i)).map((i) => ({ id: i, title: `Unavailable agent: ${i}`, icon: "tabler:terminal-2" }))].map((i) => ({ agent: i, accounts: h.value.filter((l) => l.agent === i.id && [l.label, i.title, l.credential_kind].join(" ").toLowerCase().includes(w.query.toLowerCase())) })).filter((i) => i.accounts.length));
    function L(i) {
      return _.value.agents.find((l) => l.id === i.agent)?.credentials.find((l) => l.id === i.credential_kind)?.label ?? i.credential_kind;
    }
    async function W(i) {
      const l = [...new Set(i.filter((c) => !c.mine).map((c) => c.owner))].filter((c) => !(c in C.value));
      C.value = { ...C.value, ...await Ue(l) };
    }
    const I = ge(async () => {
      try {
        const i = await M.accounts();
        h.value = i, await W(i), V.value = !0, x.value = "";
      } catch (i) {
        x.value = Q(i, "Could not load accounts.");
      }
    });
    he(() => h.value.map((i) => i.id), () => {
      I();
    });
    const G = me.runs(() => {
      I();
    });
    ve(G), de(I);
    async function j(i, l) {
      x.value = "";
      try {
        await i(), await I();
      } catch (c) {
        x.value = Q(c, l);
      }
    }
    async function X(i) {
      if (!(i instanceof CustomEvent)) return;
      const l = De.safeParse(i.detail);
      if (!l.success || A.value) {
        T.value = "Invalid account submission.";
        return;
      }
      const c = l.data;
      T.value = "", A.value = !0;
      try {
        await M.createAccount(c), p.value++, u.value = !1, await I();
      } catch (n) {
        T.value = Q(n, "Could not save the account.");
      } finally {
        A.value = !1;
      }
    }
    Z(h, (i) => S("count", i.length));
    const z = (i) => j(() => M.updateAccount(i.id, { enabled: !i.enabled }), "Could not update the account."), f = (i, l) => j(() => M.updateAccount(i.id, { label: l }), "Could not rename the account.");
    async function d(i) {
      await Me.confirm({
        header: "Delete account",
        message: `Delete account "${i.label}"? Tasks keep their history.`,
        icon: "tabler:trash",
        acceptLabel: "Delete",
        rejectLabel: "Cancel",
        acceptClass: "p-button-danger"
      }) && await j(() => M.deleteAccount(i.id), "Could not delete the account.");
    }
    function y() {
      A.value || (u.value = !1);
    }
    return Re(() => {
      Pe("chestor-autocode-driver-account", { timeoutMs: 8e3 }).catch(() => {
        x.value = "The driver account card could not load.";
      });
    }), (i, l) => (t(), a("div", Aa, [
      x.value ? (t(), a("p", Ta, [
        U(s(x.value) + " ", 1),
        e("button", {
          type: "button",
          class: "ac-link kx-focus-outline",
          onClick: l[0] || (l[0] = //@ts-ignore
          (...c) => o(I) && o(I)(...c))
        }, "Retry")
      ])) : k("", !0),
      !V.value && !x.value ? (t(), a("div", Va, "Loading accounts…")) : k("", !0),
      V.value && !h.value.length ? (t(), a("div", La, [
        e("div", Ra, [
          R(o(q), { icon: "tabler:key" })
        ]),
        l[3] || (l[3] = e("div", { class: "kx-empty-title" }, "No accounts yet", -1)),
        l[4] || (l[4] = e("div", { class: "kx-empty-sub" }, "Add an API key, your own endpoint or a personal subscription login.", -1)),
        R(o(re), {
          label: "Add account",
          onClick: l[1] || (l[1] = (c) => u.value = !0)
        }, {
          icon: te(() => [
            R(o(q), { icon: "tabler:plus" })
          ]),
          _: 1
        })
      ])) : V.value && !H.value.length ? (t(), a("div", Sa, [...l[5] || (l[5] = [
        e("div", { class: "kx-empty-title" }, "No matches", -1),
        e("div", { class: "kx-empty-sub" }, "Try another account or agent.", -1)
      ])])) : k("", !0),
      (t(!0), a(O, null, K(H.value, (c) => (t(), a("section", {
        key: c.agent.id,
        class: "ac-stack"
      }, [
        e("div", Ua, [
          e("h2", Ea, [
            R(o(q), {
              icon: o(oe)(c.agent.id, o(_).agents)
            }, null, 8, ["icon"]),
            U(s(c.agent.title), 1)
          ]),
          e("span", qa, s(c.accounts.filter((n) => n.usable && o(se)(n, o(b)) === "ready").length) + " of " + s(c.accounts.length) + " ready", 1)
        ]),
        e("ul", Ia, [
          (t(!0), a(O, null, K(c.accounts, (n) => (t(), J(Ca, {
            key: n.id,
            account: n,
            "kind-label": L(n),
            "owner-label": C.value[n.owner] || n.owner,
            onToggle: (m) => z(n),
            onRename: (m) => f(n, m),
            onRemove: (m) => d(n)
          }, null, 8, ["account", "kind-label", "owner-label", "onToggle", "onRename", "onRemove"]))), 128))
        ])
      ]))), 128)),
      u.value ? (t(), J(ce, {
        key: 4,
        title: "Add account",
        onClose: y
      }, {
        default: te(() => [
          e("div", Na, [
            R($e, {
              disabled: A.value,
              modelValue: g.value,
              "onUpdate:modelValue": l[2] || (l[2] = (c) => g.value = c),
              agents: o(_).agents
            }, null, 8, ["disabled", "modelValue", "agents"]),
            l[6] || (l[6] = e("p", { class: "ac-hint" }, "Tasks balance across your ready accounts automatically.", -1)),
            D.value ? (t(), a("chestor-autocode-driver-account", {
              key: 0,
              "^config": N.value,
              onSubmit: X
            }, null, 40, Pa)) : k("", !0)
          ])
        ]),
        _: 1
      })) : k("", !0)
    ]));
  }
}), Ba = { class: "ac" }, Da = { class: "ac-bar" }, Wa = {
  class: "ac-tabs",
  "aria-label": "Autocode views"
}, ja = ["aria-pressed", "onClick"], Oa = {
  key: 0,
  class: "kx-err"
}, Ha = {
  key: 1,
  class: "kx-loading"
}, Ga = {
  key: 2,
  class: "ac-body"
}, Ka = /* @__PURE__ */ ee({
  __name: "autocode",
  setup(r) {
    const P = [
      { id: "tasks", label: "Tasks", icon: "tabler:player-play" },
      { id: "accounts", label: "Accounts", icon: "tabler:key" }
    ], $ = v("tasks"), { catalog: w, error: S, load: u } = xe(), _ = v(""), b = v(0), h = v(null), C = v(null), x = v("");
    async function V(T) {
      T && (x.value = T), $.value = "accounts", _.value = "", await pe(), C.value?.open();
    }
    function A() {
      $.value === "tasks" ? h.value?.open() : C.value?.open();
    }
    return (T, p) => (t(), a("div", Ba, [
      R(Ce, {
        title: "Autocode",
        subtitle: "Run coding agents with your accounts and workspaces.",
        count: `${b.value} ${$.value === "tasks" ? "task" : "account"}${b.value === 1 ? "" : "s"}`,
        action: $.value === "tasks" ? "New task" : "Add account",
        query: _.value,
        "onUpdate:query": p[0] || (p[0] = (g) => _.value = g),
        placeholder: $.value === "tasks" ? "Search tasks…" : "Search accounts…",
        onCreate: A
      }, null, 8, ["count", "action", "query", "placeholder"]),
      e("div", Da, [
        e("nav", Wa, [
          (t(), a(O, null, K(P, (g) => e("button", {
            key: g.id,
            type: "button",
            class: F(["ac-tab kx-focus-outline", { active: $.value === g.id }]),
            "aria-pressed": $.value === g.id,
            onClick: (D) => {
              $.value = g.id, _.value = "", b.value = 0;
            }
          }, [
            R(o(q), {
              icon: g.icon
            }, null, 8, ["icon"]),
            U(" " + s(g.label), 1)
          ], 10, ja)), 64))
        ])
      ]),
      o(S) && !o(w) ? (t(), a("p", Oa, [
        U(s(o(S)) + " ", 1),
        e("button", {
          class: "ac-link kx-focus-outline",
          type: "button",
          onClick: p[1] || (p[1] = //@ts-ignore
          (...g) => o(u) && o(u)(...g))
        }, "Retry")
      ])) : o(w) ? (t(), a("main", Ga, [
        $.value === "tasks" ? (t(), J(ua, {
          key: 0,
          ref_key: "tasks",
          ref: h,
          query: _.value,
          onCount: p[2] || (p[2] = (g) => b.value = g),
          onAgentChanged: p[3] || (p[3] = (g) => x.value = g),
          onGoto: V
        }, null, 8, ["query"])) : (t(), J(Ma, {
          key: 1,
          ref_key: "accounts",
          ref: C,
          query: _.value,
          "selected-agent": x.value,
          onCount: p[4] || (p[4] = (g) => b.value = g)
        }, null, 8, ["query", "selected-agent"]))
      ])) : (t(), a("div", Ha, [
        R(o(q), {
          icon: "tabler:loader-2",
          class: "spin"
        }),
        p[5] || (p[5] = U(" Loading…", -1))
      ]))
    ]));
  }
}), za = { props: { type: "object", properties: {} } }, Fa = {
  wippy: za
};
class Ja extends Ve {
  static get wippyConfig() {
    return {
      propsSchema: Fa.wippy.props,
      hostCssKeys: ["themeConfigUrl", "primeVueCssUrl", "iframeCssUrl"],
      inlineCss: Ae
    };
  }
  static get vueConfig() {
    return { rootComponent: Ka, plugins: [Te] };
  }
}
Be(import.meta.url, Ja);
