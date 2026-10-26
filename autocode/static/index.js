import { u as le, a as be, _ as ce, b as xe, c as Ce, s as Ae, P as Te } from "./styles-DEgY6oCi.js";
import { u as de, W as Ve } from "./dto-FYq6oVap.js";
import { defineComponent as ee, openBlock as t, createElementBlock as n, Fragment as G, renderList as z, normalizeClass as F, createVNode as R, unref as u, createTextVNode as U, toDisplayString as l, ref as d, computed as M, watch as Y, createElementVNode as e, withDirectives as X, vModelText as ie, createCommentVNode as m, vModelSelect as ue, vModelCheckbox as Re, createBlock as Q, onUnmounted as re, nextTick as ve, withCtx as te, withKeys as ye, withModifiers as fe, onMounted as Le } from "vue";
import { Icon as q } from "@iconify/vue";
import he from "primevue/button";
import { b as oe, u as ne, c as se, d as ae, a as H, e as Z, l as pe, r as me, f as _e, t as Se, s as ke, p as Ue } from "./presentation-E5H7E21K.js";
import { d as Ee, m as qe, a as Ie, _ as Ne } from "./driver-options.vue_vue_type_script_setup_true_lang-P5mXashh.js";
import { loadByTagName as Pe, host as Be, define as De } from "@wippy-fe/proxy";
import { a as Me } from "./driver-account-types-BLQ6-wgb.js";
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
  setup(i) {
    return (D, f) => i.agents.length <= 6 ? (t(), n("div", We, [
      (t(!0), n(G, null, z(i.agents, ($) => (t(), n("button", {
        key: $.id,
        disabled: i.disabled,
        type: "button",
        class: F(["ac-chip kx-focus-halo", { active: i.modelValue === $.id }]),
        "aria-pressed": i.modelValue === $.id,
        onClick: (S) => D.$emit("update:modelValue", $.id)
      }, [
        R(u(q), {
          icon: u(oe)($.id, i.agents),
          "aria-hidden": "true"
        }, null, 8, ["icon"]),
        U(l($.title), 1)
      ], 10, je))), 128))
    ])) : (t(), n("select", {
      key: 1,
      disabled: i.disabled,
      class: "kx-focus-halo",
      "aria-label": "Agent",
      value: i.modelValue,
      onChange: f[0] || (f[0] = ($) => D.$emit("update:modelValue", $.target.value))
    }, [
      (t(!0), n(G, null, z(i.agents, ($) => (t(), n("option", {
        key: $.id,
        value: $.id
      }, l($.title), 9, He))), 128))
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
}, ct = { class: "ac-dialog-foot" }, it = ["disabled"], dt = /* @__PURE__ */ ee({
  __name: "task-form",
  props: {
    accounts: {},
    images: {},
    workspaces: {},
    drivers: {}
  },
  emits: ["started", "goto", "agentChanged", "cancel"],
  setup(i, { emit: D }) {
    const f = i, $ = D, S = le(), o = d(null);
    function y() {
      const s = S.value.settings_path;
      s && o.value?.dispatchEvent(new CustomEvent("navigate", { detail: { path: s }, bubbles: !0, composed: !0 }));
    }
    const k = d(Ee(S.value, f.accounts)), g = d(""), A = d(""), C = d(""), T = d(""), V = d(""), w = d({}), r = d(!1), b = d(0), E = d(!1), W = d(""), K = M(() => S.value.agents.find((s) => s.id === k.value)), N = M(() => f.drivers.find((s) => s.id === k.value)), B = M(() => f.accounts.filter((s) => s.agent === k.value && s.usable && s.enabled)), P = ne(), j = M(() => B.value.filter((s) => se(s, P.value) === "ready")), O = M(() => qe(f.images, k.value));
    function J(s) {
      return se(s, P.value) === "cooling" ? `${s.label} (cooling down until ${ae(s.cooldown_until)})` : s.label;
    }
    Y([O, B, () => f.workspaces], () => {
      O.value.some((s) => s.id === A.value) || (A.value = O.value[0]?.id ?? ""), g.value && !B.value.some((s) => s.id === g.value) && (g.value = ""), C.value && !f.workspaces.some((s) => s.id === C.value) && (C.value = "");
    }, { immediate: !0 }), Y(k, () => {
      g.value = "", b.value = 0, $("agentChanged", k.value);
    }, { immediate: !0 }), Y(() => N.value?.id, () => {
      const s = N.value;
      w.value = Ie(s), r.value = !!s?.unattended;
    }, { immediate: !0 }), Y(r, (s) => {
      const a = N.value?.unattended;
      if (!s || !a) return;
      const v = { ...w.value };
      for (const c of Object.keys(a)) delete v[c];
      w.value = v;
    });
    async function x() {
      W.value = "", E.value = !0;
      try {
        const { id: s } = await H.startRun({
          agent: k.value,
          account_id: g.value,
          image_id: A.value,
          workspace_id: C.value,
          repo_url: T.value,
          prompt: V.value,
          options: w.value,
          unattended: r.value
        });
        V.value = "", $("started", s);
      } catch (s) {
        W.value = Z(s, "Could not start the task.");
      } finally {
        E.value = !1;
      }
    }
    return (s, a) => (t(), n("section", {
      ref_key: "root",
      ref: o,
      class: "ac-form ac-new"
    }, [
      e("label", Ge, [
        a[11] || (a[11] = e("span", null, "Prompt", -1)),
        X(e("textarea", {
          "onUpdate:modelValue": a[0] || (a[0] = (v) => V.value = v),
          autofocus: "",
          rows: "8",
          class: "kx-focus-halo",
          placeholder: "What should the agent do?"
        }, null, 512), [
          [ie, V.value]
        ])
      ]),
      e("div", Ke, [
        a[12] || (a[12] = e("span", null, "Agent", -1)),
        R($e, {
          modelValue: k.value,
          "onUpdate:modelValue": a[1] || (a[1] = (v) => k.value = v),
          agents: u(S).agents
        }, null, 8, ["modelValue", "agents"])
      ]),
      k.value && !B.value.length ? (t(), n("p", ze, [
        U(" No " + l(K.value?.title) + " accounts you can run on. ", 1),
        e("button", {
          class: "ac-link kx-focus-outline",
          type: "button",
          onClick: a[2] || (a[2] = (v) => $("goto", "accounts", k.value))
        }, "Add an account")
      ])) : m("", !0),
      O.value.length ? m("", !0) : (t(), n("p", Fe, [
        U(" No image with " + l(K.value?.title ?? k.value) + "; ask an administrator. ", 1),
        u(S).manage && u(S).settings_path ? (t(), n("button", {
          key: 0,
          class: "ac-link kx-focus-outline",
          type: "button",
          onClick: y
        }, "Manage images")) : m("", !0)
      ])),
      e("div", Je, [
        e("label", Qe, [
          a[13] || (a[13] = e("span", null, "Account", -1)),
          X(e("select", {
            "onUpdate:modelValue": a[3] || (a[3] = (v) => g.value = v),
            class: "kx-focus-halo"
          }, [
            e("option", Xe, "Auto (" + l(j.value.length) + " ready)", 1),
            (t(!0), n(G, null, z(B.value, (v) => (t(), n("option", {
              key: v.id,
              value: v.id
            }, l(J(v)), 9, Ye))), 128))
          ], 512), [
            [ue, g.value]
          ])
        ]),
        e("label", Ze, [
          a[14] || (a[14] = e("span", null, "Image", -1)),
          X(e("select", {
            "onUpdate:modelValue": a[4] || (a[4] = (v) => A.value = v),
            class: "kx-focus-halo"
          }, [
            (t(!0), n(G, null, z(O.value, (v) => (t(), n("option", {
              key: v.id,
              value: v.id
            }, l(v.label), 9, et))), 128))
          ], 512), [
            [ue, A.value]
          ])
        ]),
        e("label", tt, [
          a[16] || (a[16] = e("span", null, "Workspace", -1)),
          X(e("select", {
            "onUpdate:modelValue": a[5] || (a[5] = (v) => C.value = v),
            class: "kx-focus-halo"
          }, [
            a[15] || (a[15] = e("option", { value: "" }, "Scratch directory", -1)),
            (t(!0), n(G, null, z(i.workspaces, (v) => (t(), n("option", {
              key: v.id,
              value: v.id
            }, l(v.name) + l(v.writable ? "" : " (read-only)"), 9, at))), 128))
          ], 512), [
            [ue, C.value]
          ])
        ])
      ]),
      e("details", nt, [
        a[19] || (a[19] = e("summary", { class: "kx-focus-outline" }, "Advanced", -1)),
        e("div", st, [
          e("label", lt, [
            a[17] || (a[17] = e("span", null, "Git repository", -1)),
            X(e("input", {
              "onUpdate:modelValue": a[6] || (a[6] = (v) => T.value = v),
              class: "ac-mono kx-focus-halo",
              placeholder: "Optional: https://github.com/org/repo.git"
            }, null, 512), [
              [ie, T.value]
            ])
          ]),
          N.value?.unattended ? (t(), n("label", ot, [
            X(e("input", {
              "onUpdate:modelValue": a[7] || (a[7] = (v) => r.value = v),
              type: "checkbox",
              class: "kx-focus-outline"
            }, null, 512), [
              [Re, r.value]
            ]),
            a[18] || (a[18] = U(" Unattended · skip permission prompts when the image allows it ", -1))
          ])) : m("", !0),
          N.value ? (t(), Q(Ne, {
            key: N.value.id,
            modelValue: w.value,
            "onUpdate:modelValue": a[8] || (a[8] = (v) => w.value = v),
            options: N.value.options,
            locked: r.value && N.value.unattended ? N.value.unattended : {},
            onInvalid: a[9] || (a[9] = (v) => b.value = v)
          }, null, 8, ["modelValue", "options", "locked"])) : m("", !0)
        ])
      ]),
      W.value ? (t(), n("p", ut, l(W.value), 1)) : m("", !0),
      e("footer", ct, [
        e("button", {
          type: "button",
          class: "ac-btn kx-focus-halo",
          onClick: a[10] || (a[10] = (v) => $("cancel"))
        }, "Cancel"),
        e("button", {
          type: "button",
          class: "ac-btn primary kx-focus-halo",
          disabled: E.value || b.value > 0 || !k.value || !(g.value || j.value.length) || !A.value || !V.value.trim(),
          onClick: x
        }, [
          R(u(q), { icon: "tabler:player-play" }),
          U(" " + l(E.value ? "Starting…" : "Start"), 1)
        ], 8, it)
      ])
    ], 512));
  }
}), rt = { class: "ac-form ac-detail" }, vt = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, pt = {
  key: 1,
  class: "kx-loading"
}, mt = { class: "ac-detail-head" }, kt = { class: "ac-card-head" }, gt = ["disabled"], yt = { class: "ac-detail-title" }, ft = { class: "ac-run-meta ac-detail-meta" }, bt = ["title"], ht = { key: 0 }, _t = { key: 1 }, $t = { key: 2 }, wt = { key: 3 }, xt = { key: 4 }, Ct = { key: 5 }, At = {
  class: "ac-detail-section",
  "aria-labelledby": "ac-prompt-heading"
}, Tt = { class: "ac-section-head" }, Vt = ["aria-expanded"], Rt = {
  key: 0,
  class: "ac-detail-section ac-result",
  "aria-labelledby": "ac-result-heading"
}, Lt = { class: "ac-section-head" }, St = { id: "ac-result-heading" }, Ut = { class: "ac-row-actions" }, Et = ["aria-expanded"], qt = {
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
}, Pt = { class: "ac-section-head" }, Bt = { class: "ac-muted" }, Dt = { class: "ac-event-kind" }, Mt = { class: "ac-event-text" }, Wt = {
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
  setup(i, { emit: D }) {
    const f = i, $ = D, S = le(), o = d(null), y = d([]), k = d(""), g = d(null), A = d(null), C = d(!1), T = d(!1), V = d(!1), w = d(""), r = ne(), b = M(() => (o.value?.prompt.length ?? 0) > 500 || (o.value?.prompt.split(`
`).length ?? 0) > 5), E = M(() => (o.value?.result.length ?? 0) > 1800 || (o.value?.result.split(`
`).length ?? 0) > 10);
    let W = !0, K = !0, N;
    const B = (p) => p.status === "queued" || p.status === "running";
    function P() {
      g.value && (K = g.value.scrollHeight - g.value.scrollTop - g.value.clientHeight < 40);
    }
    const j = ke(async () => {
      try {
        let p = !0;
        for (; p && W; ) {
          const _ = y.value.length ? y.value[y.value.length - 1].seq : 0, I = await H.run(f.runId, _);
          if (!W) return;
          o.value = I.run, I.events.length && (y.value = y.value.concat(I.events), await ve(), K && g.value?.scrollTo({ top: g.value.scrollHeight })), p = I.more;
        }
        W && o.value && $("changed", o.value), k.value = "";
      } catch (p) {
        k.value = Z(p, "Could not load the task.");
      }
    }), O = pe.run(f.runId, () => {
      j();
    });
    de(j), re(() => {
      W = !1, O(), clearTimeout(N);
    });
    async function J() {
      try {
        await H.cancelRun(f.runId), await j();
      } catch (p) {
        k.value = Z(p, "Could not cancel the task.");
      }
    }
    async function x() {
      try {
        const p = o.value?.result ?? "";
        try {
          await navigator.clipboard.writeText(p);
        } catch {
          const _ = document.createElement("textarea"), I = A.value?.getRootNode(), ge = I instanceof ShadowRoot || I instanceof Document ? I.activeElement : null, we = ge instanceof HTMLElement ? ge : null;
          _.value = p, _.readOnly = !0, _.style.cssText = "position:fixed;opacity:0;pointer-events:none;", A.value?.parentElement?.append(_);
          try {
            if (_.select(), !document.execCommand("copy")) throw new Error("Copy failed");
          } finally {
            _.remove(), we?.focus({ preventScroll: !0 });
          }
        }
        V.value = !0, w.value = "", clearTimeout(N), N = setTimeout(() => {
          V.value = !1;
        }, 2e3);
      } catch {
        w.value = "Could not copy. Select the result text to copy it.";
      }
    }
    function s() {
      T.value = !T.value, T.value || A.value?.scrollTo({ top: 0 });
    }
    function a(p) {
      return typeof p.options?.model == "string" ? p.options.model : "";
    }
    function v(p) {
      return f.accounts.find((_) => _.id === p)?.label ?? "Unlisted account";
    }
    function c(p) {
      return f.workspaces.find((_) => _.id === p)?.name ?? "Unlisted workspace";
    }
    function h(p) {
      return f.images.find((_) => _.id === p)?.label ?? "Unlisted image";
    }
    function L(p) {
      const _ = [];
      return p.usage.input_tokens !== void 0 && _.push(`${p.usage.input_tokens} input`), p.usage.output_tokens !== void 0 && _.push(`${p.usage.output_tokens} output`), p.usage.cached_tokens !== void 0 && _.push(`${p.usage.cached_tokens} cached`), _.length ? `${_.join(" · ")} tokens` : "";
    }
    return (p, _) => (t(), n("section", rt, [
      k.value ? (t(), n("p", vt, [
        U(l(k.value) + " ", 1),
        e("button", {
          type: "button",
          class: "ac-link kx-focus-outline",
          onClick: _[0] || (_[0] = //@ts-ignore
          (...I) => u(j) && u(j)(...I))
        }, "Retry")
      ])) : m("", !0),
      !o.value && !k.value ? (t(), n("div", pt, [
        R(u(q), {
          icon: "tabler:loader-2",
          class: "spin"
        }),
        _[2] || (_[2] = U(" Loading the task…", -1))
      ])) : o.value ? (t(), n(G, { key: 2 }, [
        e("header", mt, [
          e("div", kt, [
            e("span", {
              class: F(["kx-tag-sm ac-tone", o.value.status])
            }, l(o.value.status), 3),
            B(o.value) ? (t(), n("button", {
              key: 0,
              type: "button",
              class: "ac-btn danger kx-focus-halo",
              disabled: o.value.cancel_requested,
              onClick: J
            }, [
              R(u(q), { icon: "tabler:player-stop" }),
              U(" " + l(o.value.cancel_requested ? "Cancelling…" : "Cancel"), 1)
            ], 8, gt)) : m("", !0)
          ]),
          e("h2", yt, l(o.value.prompt.split(`
`)[0]), 1),
          e("div", ft, [
            e("span", null, [
              R(u(q), {
                icon: u(oe)(o.value.agent, u(S).agents)
              }, null, 8, ["icon"]),
              U(l(u(S).agents.find((I) => I.id === o.value?.agent)?.title ?? o.value.agent), 1)
            ]),
            e("span", null, l(v(o.value.account_id)), 1),
            e("span", null, l(h(o.value.image_id)), 1),
            e("span", {
              title: u(ae)(o.value.started_at || o.value.created_at)
            }, l(o.value.started_at ? "Started" : "Queued") + " " + l(u(me)(o.value.started_at || o.value.created_at, u(r))), 9, bt),
            o.value.started_at ? (t(), n("span", ht, l(u(_e)(o.value, u(r))) + " " + l(B(o.value) ? "elapsed" : "duration"), 1)) : m("", !0),
            o.value.timeout_ms ? (t(), n("span", _t, l(u(Se)(o.value.timeout_ms)), 1)) : m("", !0),
            e("span", null, l(o.value.unattended ? "Unattended" : "Attended"), 1),
            o.value.workflow ? (t(), n("span", $t, "Workflow")) : m("", !0),
            o.value.workspace_id ? (t(), n("span", wt, l(c(o.value.workspace_id)), 1)) : m("", !0),
            a(o.value) ? (t(), n("span", xt, l(a(o.value)), 1)) : m("", !0),
            L(o.value) ? (t(), n("span", Ct, l(L(o.value)), 1)) : m("", !0)
          ])
        ]),
        e("section", At, [
          e("div", Tt, [
            _[3] || (_[3] = e("h3", { id: "ac-prompt-heading" }, "Prompt", -1)),
            b.value ? (t(), n("button", {
              key: 0,
              type: "button",
              class: "ac-link kx-focus-outline",
              "aria-expanded": C.value,
              "aria-controls": "ac-prompt-text",
              onClick: _[1] || (_[1] = (I) => C.value = !C.value)
            }, l(C.value ? "Collapse prompt" : "Expand prompt"), 9, Vt)) : m("", !0)
          ]),
          e("pre", {
            id: "ac-prompt-text",
            class: F(["ac-pre ac-prompt", { expanded: C.value || !b.value }])
          }, [
            e("span", null, l(o.value.prompt), 1)
          ], 2)
        ]),
        o.value.result ? (t(), n("section", Rt, [
          e("div", Lt, [
            e("h3", St, l(o.value.status === "succeeded" ? "Result" : "Partial result"), 1),
            e("div", Ut, [
              E.value ? (t(), n("button", {
                key: 0,
                type: "button",
                class: "ac-link kx-focus-outline",
                "aria-expanded": T.value,
                "aria-controls": "ac-result-text",
                onClick: s
              }, l(T.value ? "Collapse result" : "Expand result"), 9, Et)) : m("", !0),
              e("button", {
                type: "button",
                class: "ac-btn kx-focus-halo",
                onClick: x
              }, [
                R(u(q), {
                  icon: V.value ? "tabler:check" : "tabler:copy"
                }, null, 8, ["icon"]),
                U(l(V.value ? "Copied" : "Copy"), 1)
              ])
            ])
          ]),
          w.value ? (t(), n("p", qt, l(w.value), 1)) : m("", !0),
          e("pre", {
            id: "ac-result-text",
            ref_key: "result",
            ref: A,
            class: F(["ac-pre ac-result-text", { expanded: T.value }]),
            tabindex: "0",
            "aria-label": "Result"
          }, l(o.value.result), 3)
        ])) : m("", !0),
        o.value.error ? (t(), n("p", It, l(o.value.error), 1)) : m("", !0),
        e("section", Nt, [
          e("div", Pt, [
            _[4] || (_[4] = e("h3", { id: "ac-log-heading" }, "Log", -1)),
            e("span", Bt, l(y.value.length) + " events", 1)
          ]),
          e("div", {
            ref_key: "stream",
            ref: g,
            class: "ac-stream",
            tabindex: "0",
            "aria-label": "Task log",
            onScroll: P
          }, [
            (t(!0), n(G, null, z(y.value, (I) => (t(), n("div", {
              key: I.seq,
              class: F(["ac-event", I.kind])
            }, [
              e("span", Dt, l(I.kind), 1),
              e("pre", Mt, l(I.text), 1)
            ], 2))), 128)),
            B(o.value) ? (t(), n("div", Wt, "Working…")) : y.value.length ? m("", !0) : (t(), n("div", jt, "No log events."))
          ], 544)
        ])
      ], 64)) : m("", !0)
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
  setup(i, { expose: D, emit: f }) {
    const $ = i, S = f, o = le(), y = d(!1);
    D({ open: () => {
      y.value = !0;
    } });
    const k = d([]), g = d([]), A = d([]), C = d([]), T = d([]), V = d(!1), w = d(""), r = d(null), b = ne(), E = ke(async () => {
      try {
        const [x, s, a, v, c] = await Promise.all([H.accounts(), H.images(), H.runs(), H.workspaces(), H.drivers()]);
        k.value = x, g.value = s, T.value = a, A.value = v.workspaces, C.value = c, V.value = !0, w.value = "";
      } catch (x) {
        w.value = Z(x, "Could not load tasks.");
      }
    }), W = pe.runs(() => {
      E();
    });
    be(() => [...g.value, ...k.value].map((x) => x.id), () => {
      E();
    }), de(E), re(W);
    async function K(x) {
      y.value = !1, await E(), r.value = x;
    }
    function N() {
      E();
    }
    const B = M(() => k.value.some((x) => x.usable && x.enabled)), P = M(() => T.value.filter((x) => [x.prompt, x.status, x.agent, j(x.agent), J(x.account_id)].join(" ").toLowerCase().includes($.query.trim().toLowerCase())));
    Y(T, (x) => S("count", x.length));
    function j(x) {
      return o.value.agents.find((s) => s.id === x)?.title ?? x;
    }
    function O(x) {
      return g.value.find((s) => s.id === x)?.label ?? "Unlisted image";
    }
    function J(x) {
      return k.value.find((s) => s.id === x)?.label ?? "unlisted account";
    }
    return (x, s) => V.value ? (t(), n("div", Gt, [
      w.value ? (t(), n("p", Kt, [
        U(l(w.value) + " ", 1),
        e("button", {
          class: "ac-link kx-focus-outline",
          type: "button",
          onClick: s[1] || (s[1] = //@ts-ignore
          (...a) => u(E) && u(E)(...a))
        }, "Retry")
      ])) : m("", !0),
      T.value.length ? P.value.length ? m("", !0) : (t(), n("div", Qt, [...s[11] || (s[11] = [
        e("div", { class: "kx-empty-title" }, "No matches", -1),
        e("div", { class: "kx-empty-sub" }, "Try another task, agent or account.", -1)
      ])])) : (t(), n("div", zt, [
        e("div", Ft, [
          R(u(q), { icon: "tabler:terminal-2" })
        ]),
        s[10] || (s[10] = e("div", { class: "kx-empty-title" }, "No tasks yet", -1)),
        e("div", Jt, l(B.value ? "Give a coding agent a task and follow its progress here." : "Add an account to give your coding agent a place to start."), 1),
        R(u(he), {
          label: B.value ? "New task" : "Add account",
          onClick: s[2] || (s[2] = (a) => B.value ? y.value = !0 : S("goto"))
        }, {
          icon: te(() => [
            R(u(q), { icon: "tabler:plus" })
          ]),
          _: 1
        }, 8, ["label"])
      ])),
      T.value.length ? (t(), n("p", Xt, "Search filters the loaded tasks.")) : m("", !0),
      P.value.length ? (t(), n("ul", Yt, [
        (t(!0), n(G, null, z(P.value, (a) => (t(), n("li", {
          key: a.id,
          class: "ac-run"
        }, [
          e("button", {
            type: "button",
            class: "ac-run-main kx-focus-halo",
            onClick: (v) => r.value = a.id
          }, [
            e("span", ea, [
              e("span", ta, [
                e("span", aa, l(a.prompt.split(`
`)[0]), 1),
                e("span", {
                  class: F(["kx-tag-sm ac-tone", a.status])
                }, l(a.status), 3),
                a.workflow ? (t(), n("span", na, "Workflow")) : m("", !0)
              ]),
              e("span", sa, [
                e("span", null, [
                  R(u(q), {
                    icon: u(oe)(a.agent, u(o).agents)
                  }, null, 8, ["icon"]),
                  U(l(j(a.agent)), 1)
                ]),
                e("span", null, l(J(a.account_id)), 1),
                e("span", null, l(O(a.image_id)), 1),
                e("span", {
                  title: u(ae)(a.started_at || a.created_at)
                }, l(u(me)(a.started_at || a.created_at, u(b))), 9, la),
                a.started_at ? (t(), n("span", oa, l(u(_e)(a, u(b))) + " " + l(a.status === "running" ? "elapsed" : "duration"), 1)) : m("", !0)
              ])
            ]),
            R(u(q), {
              icon: "tabler:chevron-right",
              class: "ac-run-chevron ac-muted"
            })
          ], 8, Zt)
        ]))), 128))
      ])) : m("", !0),
      y.value ? (t(), Q(ce, {
        key: 5,
        title: "New task",
        wide: "",
        onClose: s[6] || (s[6] = (a) => y.value = !1)
      }, {
        default: te(() => [
          R(dt, {
            accounts: k.value,
            images: g.value,
            workspaces: A.value,
            drivers: C.value,
            onStarted: K,
            onCancel: s[3] || (s[3] = (a) => y.value = !1),
            onAgentChanged: s[4] || (s[4] = (a) => S("agentChanged", a)),
            onGoto: s[5] || (s[5] = (a, v) => S("goto", v))
          }, null, 8, ["accounts", "images", "workspaces", "drivers"])
        ]),
        _: 1
      })) : m("", !0),
      r.value ? (t(), Q(ce, {
        key: 6,
        title: "Task details",
        wide: "",
        onClose: s[8] || (s[8] = (a) => r.value = null)
      }, {
        footer: te(() => [
          e("button", {
            type: "button",
            class: "ac-btn kx-focus-halo",
            onClick: s[7] || (s[7] = (a) => r.value = null)
          }, "Close")
        ]),
        default: te(() => [
          (t(), Q(Ot, {
            key: r.value,
            "run-id": r.value,
            accounts: k.value,
            images: g.value,
            workspaces: A.value,
            onChanged: N
          }, null, 8, ["run-id", "accounts", "images", "workspaces"]))
        ]),
        _: 1
      })) : m("", !0)
    ])) : (t(), n("div", Ht, [
      w.value ? (t(), n(G, { key: 0 }, [
        U(l(w.value) + " ", 1),
        e("button", {
          class: "ac-link kx-focus-outline",
          type: "button",
          onClick: s[0] || (s[0] = //@ts-ignore
          (...a) => u(E) && u(E)(...a))
        }, "Retry")
      ], 64)) : (t(), n(G, { key: 1 }, [
        R(u(q), {
          icon: "tabler:loader-2",
          class: "spin"
        }),
        s[9] || (s[9] = U(" Loading tasks…", -1))
      ], 64))
    ]));
  }
}), ca = { class: "ac-account-main" }, ia = { class: "ac-row-title" }, da = ["onKeydown"], ra = {
  key: 1,
  class: "ac-row-name"
}, va = {
  key: 2,
  class: "kx-tag-sm ac-tone"
}, pa = { class: "ac-muted" }, ma = ["title"], ka = { key: 1 }, ga = {
  key: 0,
  class: "ac-muted"
}, ya = {
  key: 1,
  class: "ac-muted ac-strong"
}, fa = {
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
  setup(i, { emit: D }) {
    const f = i, $ = D, S = { ready: "ready", cooling: "cooling down", disabled: "disabled" }, o = ne(), y = M(() => se(f.account, o.value)), k = M(() => f.account.mine ? "" : `Shared with you by ${f.ownerLabel}`), g = d(!1), A = d(""), C = d(null);
    function T() {
      A.value = f.account.label, g.value = !0, ve(() => C.value?.select());
    }
    function V() {
      if (!g.value) return;
      g.value = !1;
      const w = A.value.trim();
      w && w !== f.account.label && $("rename", w);
    }
    return (w, r) => (t(), n("li", {
      class: F(["ac-row ac-account ac-hover-actions", { off: !i.account.enabled || !i.account.usable }])
    }, [
      e("div", ca, [
        e("div", ia, [
          e("span", {
            class: F(["kx-tag-sm ac-tone", y.value])
          }, l(S[y.value]), 3),
          g.value ? X((t(), n("input", {
            key: 0,
            ref_key: "input",
            ref: C,
            "onUpdate:modelValue": r[0] || (r[0] = (b) => A.value = b),
            class: "ac-rename kx-focus-halo",
            "aria-label": "Account label",
            onKeydown: [
              ye(fe(V, ["prevent"]), ["enter"]),
              r[1] || (r[1] = ye(fe((b) => g.value = !1, ["prevent"]), ["escape"]))
            ],
            onBlur: V
          }, null, 40, da)), [
            [ie, A.value]
          ]) : (t(), n("span", ra, l(i.account.label), 1)),
          i.account.subscription ? (t(), n("span", va, "personal")) : m("", !0)
        ]),
        e("div", pa, [
          U(l(i.kindLabel) + " · " + l(i.account.runs_day) + " " + l(i.account.runs_day === 1 ? "task" : "tasks") + " in the last 24 hours · " + l(i.account.failures_day) + " " + l(i.account.failures_day === 1 ? "failure" : "failures") + " · ", 1),
          i.account.last_used_at ? (t(), n("span", {
            key: 0,
            title: u(ae)(i.account.last_used_at)
          }, "last used " + l(u(me)(i.account.last_used_at, u(o))), 9, ma)) : (t(), n("span", ka, "never used"))
        ]),
        k.value ? (t(), n("div", ga, l(k.value), 1)) : m("", !0),
        i.account.usable ? i.account.subscription ? (t(), n("div", fa, "Subscription login: personal use only")) : m("", !0) : (t(), n("div", ya, [
          R(u(q), { icon: "tabler:lock" }),
          U(" " + l(i.account.unavailable_reason || "Account unavailable for tasks"), 1)
        ])),
        i.account.endpoint ? (t(), n("div", ba, l(i.account.endpoint.protocol) + " · " + l(i.account.endpoint.base_url) + l(i.account.endpoint.model ? " · " + i.account.endpoint.model : ""), 1)) : m("", !0),
        y.value === "cooling" ? (t(), n("div", ha, "Back in rotation at " + l(u(ae)(i.account.cooldown_until)), 1)) : m("", !0),
        i.account.last_error ? (t(), n("div", _a, l(i.account.last_error), 1)) : m("", !0)
      ]),
      e("div", $a, [
        i.account.writable ? (t(), n("label", {
          key: 0,
          class: "ac-switch",
          title: i.account.enabled ? "Takes tasks" : "Out of rotation"
        }, [
          e("input", {
            type: "checkbox",
            checked: i.account.enabled,
            "aria-label": i.account.enabled ? "Take out of rotation" : "Put in rotation",
            onChange: r[2] || (r[2] = (b) => $("toggle"))
          }, null, 40, xa),
          r[4] || (r[4] = e("span", null, null, -1))
        ], 8, wa)) : m("", !0),
        i.account.writable ? (t(), n("button", {
          key: 1,
          type: "button",
          class: "ac-icon-btn kx-focus-outline",
          title: "Rename",
          "aria-label": "Rename account",
          onClick: T
        }, [
          R(u(q), { icon: "tabler:pencil" })
        ])) : m("", !0),
        i.account.deletable ? (t(), n("button", {
          key: 2,
          type: "button",
          class: "ac-icon-btn kx-focus-outline",
          title: "Delete",
          "aria-label": "Delete account",
          onClick: r[3] || (r[3] = (b) => $("remove"))
        }, [
          R(u(q), { icon: "tabler:trash" })
        ])) : m("", !0)
      ])
    ], 2));
  }
}), Aa = { class: "ac-stack" }, Ta = {
  key: 0,
  class: "kx-err inline"
}, Va = {
  key: 1,
  class: "kx-loading"
}, Ra = {
  key: 2,
  class: "kx-empty"
}, La = { class: "kx-empty-ico" }, Sa = {
  key: 3,
  class: "kx-empty"
}, Ua = { class: "ac-card-head" }, Ea = { class: "ac-card-title" }, qa = { class: "ac-muted" }, Ia = { class: "ac-account-grid" }, Na = { class: "ac-form" }, Pa = ["^config"], Ba = /* @__PURE__ */ ee({
  __name: "accounts",
  props: {
    query: {},
    selectedAgent: {}
  },
  emits: ["count"],
  setup(i, { expose: D, emit: f }) {
    const $ = i, S = f, o = d(!1);
    D({ open: () => {
      o.value = !0;
    } });
    const y = le(), k = ne(), g = d([]), A = d({}), C = d(""), T = d(!1), V = d(!1), w = d(""), r = d(0), b = d($.selectedAgent || y.value.agents[0]?.id || "");
    Y(() => $.selectedAgent, (c) => {
      c && (b.value = c);
    });
    const E = M(() => y.value.agents.find((c) => c.id === b.value)), W = M(() => JSON.stringify({ driver: E.value, busy: V.value, error: w.value, saved: r.value, limits: y.value.account_limits })), K = M(() => [...y.value.agents, ...[...new Set(g.value.map((c) => c.agent))].filter((c) => !y.value.agents.some((h) => h.id === c)).map((c) => ({ id: c, title: `Unavailable agent: ${c}`, icon: "tabler:terminal-2" }))].map((c) => ({ agent: c, accounts: g.value.filter((h) => h.agent === c.id && [h.label, c.title, h.credential_kind].join(" ").toLowerCase().includes($.query.toLowerCase())) })).filter((c) => c.accounts.length));
    function N(c) {
      return y.value.agents.find((h) => h.id === c.agent)?.credentials.find((h) => h.id === c.credential_kind)?.label ?? c.credential_kind;
    }
    async function B(c) {
      const h = [...new Set(c.filter((L) => !L.mine).map((L) => L.owner))].filter((L) => !(L in A.value));
      A.value = { ...A.value, ...await Ue(h) };
    }
    const P = ke(async () => {
      try {
        const c = await H.accounts();
        g.value = c, await B(c), T.value = !0, C.value = "";
      } catch (c) {
        C.value = Z(c, "Could not load accounts.");
      }
    });
    be(() => g.value.map((c) => c.id), () => {
      P();
    });
    const j = pe.runs(() => {
      P();
    });
    re(j), de(P);
    async function O(c, h) {
      C.value = "";
      try {
        await c(), await P();
      } catch (L) {
        C.value = Z(L, h);
      }
    }
    async function J(c) {
      if (!(c instanceof CustomEvent)) return;
      const h = Me.safeParse(c.detail);
      if (!h.success || V.value) {
        w.value = "Invalid account submission.";
        return;
      }
      const L = h.data;
      w.value = "", V.value = !0;
      try {
        await H.createAccount(L), r.value++, o.value = !1, await P();
      } catch (p) {
        w.value = Z(p, "Could not save the account.");
      } finally {
        V.value = !1;
      }
    }
    Y(g, (c) => S("count", c.length));
    const x = (c) => O(() => H.updateAccount(c.id, { enabled: !c.enabled }), "Could not update the account."), s = (c, h) => O(() => H.updateAccount(c.id, { label: h }), "Could not rename the account.");
    async function a(c) {
      await Be.confirm({
        header: "Delete account",
        message: `Delete account "${c.label}"? Tasks keep their history.`,
        icon: "tabler:trash",
        acceptLabel: "Delete",
        rejectLabel: "Cancel",
        acceptClass: "p-button-danger"
      }) && await O(() => H.deleteAccount(c.id), "Could not delete the account.");
    }
    function v() {
      V.value || (o.value = !1);
    }
    return Le(() => {
      Pe("chestor-autocode-driver-account", { timeoutMs: 8e3 }).catch(() => {
        C.value = "The driver account card could not load.";
      });
    }), (c, h) => (t(), n("div", Aa, [
      C.value ? (t(), n("p", Ta, [
        U(l(C.value) + " ", 1),
        e("button", {
          type: "button",
          class: "ac-link kx-focus-outline",
          onClick: h[0] || (h[0] = //@ts-ignore
          (...L) => u(P) && u(P)(...L))
        }, "Retry")
      ])) : m("", !0),
      !T.value && !C.value ? (t(), n("div", Va, "Loading accounts…")) : m("", !0),
      T.value && !g.value.length ? (t(), n("div", Ra, [
        e("div", La, [
          R(u(q), { icon: "tabler:key" })
        ]),
        h[3] || (h[3] = e("div", { class: "kx-empty-title" }, "No accounts yet", -1)),
        h[4] || (h[4] = e("div", { class: "kx-empty-sub" }, "Add an API key, your own endpoint or a personal subscription login.", -1)),
        R(u(he), {
          label: "Add account",
          onClick: h[1] || (h[1] = (L) => o.value = !0)
        }, {
          icon: te(() => [
            R(u(q), { icon: "tabler:plus" })
          ]),
          _: 1
        })
      ])) : T.value && !K.value.length ? (t(), n("div", Sa, [...h[5] || (h[5] = [
        e("div", { class: "kx-empty-title" }, "No matches", -1),
        e("div", { class: "kx-empty-sub" }, "Try another account or agent.", -1)
      ])])) : m("", !0),
      (t(!0), n(G, null, z(K.value, (L) => (t(), n("section", {
        key: L.agent.id,
        class: "ac-stack"
      }, [
        e("div", Ua, [
          e("h2", Ea, [
            R(u(q), {
              icon: u(oe)(L.agent.id, u(y).agents)
            }, null, 8, ["icon"]),
            U(l(L.agent.title), 1)
          ]),
          e("span", qa, l(L.accounts.filter((p) => p.usable && u(se)(p, u(k)) === "ready").length) + " of " + l(L.accounts.length) + " ready", 1)
        ]),
        e("ul", Ia, [
          (t(!0), n(G, null, z(L.accounts, (p) => (t(), Q(Ca, {
            key: p.id,
            account: p,
            "kind-label": N(p),
            "owner-label": A.value[p.owner] || p.owner,
            onToggle: (_) => x(p),
            onRename: (_) => s(p, _),
            onRemove: (_) => a(p)
          }, null, 8, ["account", "kind-label", "owner-label", "onToggle", "onRename", "onRemove"]))), 128))
        ])
      ]))), 128)),
      o.value ? (t(), Q(ce, {
        key: 4,
        title: "Add account",
        onClose: v
      }, {
        default: te(() => [
          e("div", Na, [
            R($e, {
              disabled: V.value,
              modelValue: b.value,
              "onUpdate:modelValue": h[2] || (h[2] = (L) => b.value = L),
              agents: u(y).agents
            }, null, 8, ["disabled", "modelValue", "agents"]),
            h[6] || (h[6] = e("p", { class: "ac-hint" }, "Tasks balance across your ready accounts automatically.", -1)),
            E.value ? (t(), n("chestor-autocode-driver-account", {
              key: 0,
              "^config": W.value,
              onSubmit: J
            }, null, 40, Pa)) : m("", !0)
          ])
        ]),
        _: 1
      })) : m("", !0)
    ]));
  }
}), Da = { class: "ac" }, Ma = { class: "ac-bar" }, Wa = {
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
  setup(i) {
    const D = [
      { id: "tasks", label: "Tasks", icon: "tabler:player-play" },
      { id: "accounts", label: "Accounts", icon: "tabler:key" }
    ], f = d("tasks"), { catalog: $, error: S, load: o } = xe(), y = d(""), k = d(0), g = d(null), A = d(null), C = d("");
    async function T(w) {
      w && (C.value = w), f.value = "accounts", y.value = "", await ve(), A.value?.open();
    }
    function V() {
      f.value === "tasks" ? g.value?.open() : A.value?.open();
    }
    return (w, r) => (t(), n("div", Da, [
      R(Ce, {
        title: "Autocode",
        subtitle: "Run coding agents with your accounts and workspaces.",
        count: `${k.value} ${f.value === "tasks" ? "task" : "account"}${k.value === 1 ? "" : "s"}`,
        action: f.value === "tasks" ? "New task" : "Add account",
        query: y.value,
        "onUpdate:query": r[0] || (r[0] = (b) => y.value = b),
        placeholder: f.value === "tasks" ? "Search tasks…" : "Search accounts…",
        onCreate: V
      }, null, 8, ["count", "action", "query", "placeholder"]),
      e("div", Ma, [
        e("nav", Wa, [
          (t(), n(G, null, z(D, (b) => e("button", {
            key: b.id,
            type: "button",
            class: F(["ac-tab kx-focus-outline", { active: f.value === b.id }]),
            "aria-pressed": f.value === b.id,
            onClick: (E) => {
              f.value = b.id, y.value = "", k.value = 0;
            }
          }, [
            R(u(q), {
              icon: b.icon
            }, null, 8, ["icon"]),
            U(" " + l(b.label), 1)
          ], 10, ja)), 64))
        ])
      ]),
      u(S) && !u($) ? (t(), n("p", Oa, [
        U(l(u(S)) + " ", 1),
        e("button", {
          class: "ac-link kx-focus-outline",
          type: "button",
          onClick: r[1] || (r[1] = //@ts-ignore
          (...b) => u(o) && u(o)(...b))
        }, "Retry")
      ])) : u($) ? (t(), n("main", Ga, [
        f.value === "tasks" ? (t(), Q(ua, {
          key: 0,
          ref_key: "tasks",
          ref: g,
          query: y.value,
          onCount: r[2] || (r[2] = (b) => k.value = b),
          onAgentChanged: r[3] || (r[3] = (b) => C.value = b),
          onGoto: T
        }, null, 8, ["query"])) : (t(), Q(Ba, {
          key: 1,
          ref_key: "accounts",
          ref: A,
          query: y.value,
          "selected-agent": C.value,
          onCount: r[4] || (r[4] = (b) => k.value = b)
        }, null, 8, ["query", "selected-agent"]))
      ])) : (t(), n("div", Ha, [
        R(u(q), {
          icon: "tabler:loader-2",
          class: "spin"
        }),
        r[5] || (r[5] = U(" Loading…", -1))
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
De(import.meta.url, Ja);
