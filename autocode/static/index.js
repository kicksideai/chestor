import { u as oe, a as _e, _ as ie, b as Ce, c as Ae, s as Te, P as Ve } from "./styles-7hidlKti.js";
import { u as ve, W as Le } from "./dto-BHfrzLGW.js";
import { defineComponent as te, openBlock as a, createElementBlock as n, Fragment as O, renderList as z, normalizeClass as F, createVNode as L, unref as o, createTextVNode as q, toDisplayString as l, ref as c, computed as H, watch as ee, createElementVNode as e, withDirectives as Z, vModelText as re, createCommentVNode as m, vModelSelect as ce, vModelCheckbox as Re, createBlock as J, onUnmounted as pe, nextTick as me, withCtx as ae, withKeys as be, withModifiers as he, onMounted as Se } from "vue";
import { Icon as I } from "@iconify/vue";
import de from "primevue/button";
import { b as ue, u as le, c as se, d as ne, a as j, e as Q, l as ke, r as ge, f as $e, t as Ue, s as ye, p as Ee } from "./presentation-Qrstrb4O.js";
import { d as qe, m as Ie, a as Ne, _ as De } from "./driver-options.vue_vue_type_script_setup_true_lang-P5mXashh.js";
import { loadByTagName as Me, host as Pe, define as Be } from "@wippy-fe/proxy";
import { a as We } from "./driver-account-types-CF75NS0z.js";
const je = {
  key: 0,
  class: "ac-chips",
  role: "group",
  "aria-label": "Agent"
}, He = ["disabled", "aria-pressed", "onClick"], Oe = ["disabled", "value"], Ge = ["value"], we = /* @__PURE__ */ te({
  __name: "agent-picker",
  props: {
    agents: {},
    modelValue: {},
    disabled: { type: Boolean }
  },
  emits: ["update:modelValue"],
  setup(i) {
    return (W, h) => i.agents.length <= 6 ? (a(), n("div", je, [
      (a(!0), n(O, null, z(i.agents, (_) => (a(), n("button", {
        key: _.id,
        disabled: i.disabled,
        type: "button",
        class: F(["ac-chip kx-focus-halo", { active: i.modelValue === _.id }]),
        "aria-pressed": i.modelValue === _.id,
        onClick: (R) => W.$emit("update:modelValue", _.id)
      }, [
        L(o(I), {
          icon: o(ue)(_.id, i.agents),
          "aria-hidden": "true"
        }, null, 8, ["icon"]),
        q(l(_.title), 1)
      ], 10, He))), 128))
    ])) : (a(), n("select", {
      key: 1,
      disabled: i.disabled,
      class: "kx-focus-halo",
      "aria-label": "Agent",
      value: i.modelValue,
      onChange: h[0] || (h[0] = (_) => W.$emit("update:modelValue", _.target.value))
    }, [
      (a(!0), n(O, null, z(i.agents, (_) => (a(), n("option", {
        key: _.id,
        value: _.id
      }, l(_.title), 9, Ge))), 128))
    ], 40, Oe));
  }
}), Ke = ["disabled"], ze = { class: "ac-field ac-composer" }, Fe = { class: "ac-field" }, Je = {
  key: 0,
  class: "ac-muted"
}, Qe = {
  key: 1,
  class: "ac-muted"
}, Xe = { class: "ac-picker-row" }, Ye = { class: "ac-field" }, Ze = { value: "" }, et = ["value"], tt = { class: "ac-field" }, at = ["value"], nt = { class: "ac-field" }, lt = ["value"], st = { class: "ac-advanced" }, ot = { class: "ac-form" }, ut = { class: "ac-field" }, ct = {
  key: 0,
  class: "ac-check"
}, it = {
  key: 2,
  class: "kx-err",
  role: "alert"
}, rt = { class: "ac-dialog-foot" }, dt = ["disabled"], vt = /* @__PURE__ */ te({
  __name: "task-form",
  props: {
    accounts: {},
    images: {},
    workspaces: {},
    drivers: {}
  },
  emits: ["started", "goto", "agentChanged", "cancel", "busy"],
  setup(i, { emit: W }) {
    const h = i, _ = W, R = oe(), u = c(null);
    function $() {
      const f = R.value.settings_path;
      f && u.value?.dispatchEvent(new CustomEvent("navigate", { detail: { path: f }, bubbles: !0, composed: !0 }));
    }
    const T = c(qe(R.value, h.accounts)), b = c(""), w = c(""), x = c(""), S = c(""), C = c(""), A = c({}), g = c(!1), y = c(0), U = c(!1), G = c(""), P = H(() => R.value.agents.find((f) => f.id === T.value)), N = H(() => h.drivers.find((f) => f.id === T.value)), E = H(() => h.accounts.filter((f) => f.agent === T.value && f.usable && f.enabled)), M = le(), K = H(() => E.value.filter((f) => se(f, M.value) === "ready")), D = H(() => Ie(h.images, T.value));
    function X(f) {
      return se(f, M.value) === "cooling" ? `${f.label} (cooling down until ${ne(f.cooldown_until)})` : f.label;
    }
    ee([D, E, () => h.workspaces], () => {
      D.value.some((f) => f.id === w.value) || (w.value = D.value[0]?.id ?? ""), b.value && !E.value.some((f) => f.id === b.value) && (b.value = ""), x.value && !h.workspaces.some((f) => f.id === x.value) && (x.value = "");
    }, { immediate: !0 }), ee(T, () => {
      b.value = "", y.value = 0, _("agentChanged", T.value);
    }, { immediate: !0 }), ee(() => N.value?.id, () => {
      const f = N.value;
      A.value = Ne(f), g.value = !!f?.unattended;
    }, { immediate: !0 }), ee(g, (f) => {
      const r = N.value?.unattended;
      if (!f || !r) return;
      const t = { ...A.value };
      for (const k of Object.keys(r)) delete t[k];
      A.value = t;
    });
    async function Y() {
      if (!U.value) {
        G.value = "", U.value = !0, _("busy", !0);
        try {
          const { run_id: f } = await j.startRun({
            agent: T.value,
            account_id: b.value,
            image_id: w.value,
            workspace_id: x.value,
            repo_url: S.value,
            prompt: C.value,
            options: A.value,
            unattended: g.value
          });
          C.value = "", _("started", f);
        } catch (f) {
          G.value = Q(f, "Could not start the task.");
        } finally {
          U.value = !1, _("busy", !1);
        }
      }
    }
    return (f, r) => (a(), n("fieldset", {
      ref_key: "root",
      ref: u,
      class: "ac-form ac-new",
      disabled: U.value
    }, [
      e("label", ze, [
        r[11] || (r[11] = e("span", null, "Prompt", -1)),
        Z(e("textarea", {
          "onUpdate:modelValue": r[0] || (r[0] = (t) => C.value = t),
          autofocus: "",
          rows: "8",
          class: "kx-focus-halo",
          placeholder: "What should the agent do?"
        }, null, 512), [
          [re, C.value]
        ])
      ]),
      e("div", Fe, [
        r[12] || (r[12] = e("span", null, "Agent", -1)),
        L(we, {
          modelValue: T.value,
          "onUpdate:modelValue": r[1] || (r[1] = (t) => T.value = t),
          agents: o(R).agents
        }, null, 8, ["modelValue", "agents"])
      ]),
      T.value && !E.value.length ? (a(), n("p", Je, [
        q(" No " + l(P.value?.title) + " accounts you can run on. ", 1),
        e("button", {
          class: "ac-link kx-focus-outline",
          type: "button",
          onClick: r[2] || (r[2] = (t) => _("goto", "accounts", T.value))
        }, "Add an account")
      ])) : m("", !0),
      D.value.length ? m("", !0) : (a(), n("p", Qe, [
        q(" No image with " + l(P.value?.title ?? T.value) + "; ask an administrator. ", 1),
        o(R).can_images && o(R).settings_path ? (a(), n("button", {
          key: 0,
          class: "ac-link kx-focus-outline",
          type: "button",
          onClick: $
        }, "Manage images")) : m("", !0)
      ])),
      e("div", Xe, [
        e("label", Ye, [
          r[13] || (r[13] = e("span", null, "Account", -1)),
          Z(e("select", {
            "onUpdate:modelValue": r[3] || (r[3] = (t) => b.value = t),
            class: "kx-focus-halo"
          }, [
            e("option", Ze, "Auto (" + l(K.value.length) + " ready)", 1),
            (a(!0), n(O, null, z(E.value, (t) => (a(), n("option", {
              key: t.id,
              value: t.id
            }, l(X(t)), 9, et))), 128))
          ], 512), [
            [ce, b.value]
          ])
        ]),
        e("label", tt, [
          r[14] || (r[14] = e("span", null, "Image", -1)),
          Z(e("select", {
            "onUpdate:modelValue": r[4] || (r[4] = (t) => w.value = t),
            class: "kx-focus-halo"
          }, [
            (a(!0), n(O, null, z(D.value, (t) => (a(), n("option", {
              key: t.id,
              value: t.id
            }, l(t.label), 9, at))), 128))
          ], 512), [
            [ce, w.value]
          ])
        ]),
        e("label", nt, [
          r[16] || (r[16] = e("span", null, "Workspace", -1)),
          Z(e("select", {
            "onUpdate:modelValue": r[5] || (r[5] = (t) => x.value = t),
            class: "kx-focus-halo"
          }, [
            r[15] || (r[15] = e("option", { value: "" }, "Scratch directory", -1)),
            (a(!0), n(O, null, z(i.workspaces, (t) => (a(), n("option", {
              key: t.id,
              value: t.id
            }, l(t.name) + l(t.writable ? "" : " (read-only)"), 9, lt))), 128))
          ], 512), [
            [ce, x.value]
          ])
        ])
      ]),
      e("details", st, [
        r[19] || (r[19] = e("summary", { class: "kx-focus-outline" }, "Advanced", -1)),
        e("div", ot, [
          e("label", ut, [
            r[17] || (r[17] = e("span", null, "Git repository", -1)),
            Z(e("input", {
              "onUpdate:modelValue": r[6] || (r[6] = (t) => S.value = t),
              class: "ac-mono kx-focus-halo",
              placeholder: "Optional: https://github.com/org/repo.git"
            }, null, 512), [
              [re, S.value]
            ])
          ]),
          N.value?.unattended ? (a(), n("label", ct, [
            Z(e("input", {
              "onUpdate:modelValue": r[7] || (r[7] = (t) => g.value = t),
              type: "checkbox",
              class: "kx-focus-outline"
            }, null, 512), [
              [Re, g.value]
            ]),
            r[18] || (r[18] = q(" Unattended · skip permission prompts when the image allows it ", -1))
          ])) : m("", !0),
          N.value ? (a(), J(De, {
            key: N.value.id,
            modelValue: A.value,
            "onUpdate:modelValue": r[8] || (r[8] = (t) => A.value = t),
            options: N.value.options,
            locked: g.value && N.value.unattended ? N.value.unattended : {},
            onInvalid: r[9] || (r[9] = (t) => y.value = t)
          }, null, 8, ["modelValue", "options", "locked"])) : m("", !0)
        ])
      ]),
      G.value ? (a(), n("p", it, l(G.value), 1)) : m("", !0),
      e("footer", rt, [
        e("button", {
          type: "button",
          class: "ac-btn kx-focus-halo",
          onClick: r[10] || (r[10] = (t) => _("cancel"))
        }, "Cancel"),
        e("button", {
          type: "button",
          class: "ac-btn primary kx-focus-halo",
          disabled: U.value || y.value > 0 || !T.value || !(b.value || K.value.length) || !w.value || !C.value.trim(),
          onClick: Y
        }, [
          L(o(I), { icon: "tabler:player-play" }),
          q(" " + l(U.value ? "Starting…" : "Start"), 1)
        ], 8, dt)
      ])
    ], 8, Ke));
  }
}), pt = { class: "ac-form ac-detail" }, mt = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, kt = {
  key: 1,
  class: "kx-loading"
}, gt = { class: "ac-detail-head" }, yt = { class: "ac-card-head" }, ft = ["disabled"], bt = { class: "ac-detail-title" }, ht = { class: "ac-run-meta ac-detail-meta" }, _t = ["title"], $t = { key: 0 }, wt = { key: 1 }, xt = { key: 2 }, Ct = { key: 3 }, At = { key: 4 }, Tt = { key: 5 }, Vt = {
  class: "ac-detail-section",
  "aria-labelledby": "ac-prompt-heading"
}, Lt = { class: "ac-section-head" }, Rt = ["aria-expanded"], St = {
  key: 0,
  class: "ac-detail-section ac-result",
  "aria-labelledby": "ac-result-heading"
}, Ut = { class: "ac-section-head" }, Et = { id: "ac-result-heading" }, qt = { class: "ac-row-actions" }, It = ["aria-expanded"], Nt = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, Dt = {
  key: 1,
  class: "kx-err",
  role: "alert"
}, Mt = {
  class: "ac-detail-section",
  "aria-labelledby": "ac-log-heading"
}, Pt = { class: "ac-section-head" }, Bt = { class: "ac-muted" }, Wt = { class: "ac-event-kind" }, jt = { class: "ac-event-text" }, Ht = {
  key: 0,
  class: "ac-muted ac-pulse"
}, Ot = {
  key: 1,
  class: "ac-muted"
}, Gt = /* @__PURE__ */ te({
  __name: "run-detail",
  props: {
    runId: {},
    accounts: {},
    images: {},
    workspaces: {}
  },
  emits: ["changed"],
  setup(i, { emit: W }) {
    const h = i, _ = W, R = oe(), u = c(null), $ = c([]), T = c(0), b = c(""), w = c(null), x = c(null), S = c(!1), C = c(!1), A = c(!1), g = c(""), y = le(), U = H(() => (u.value?.prompt.length ?? 0) > 500 || (u.value?.prompt.split(`
`).length ?? 0) > 5), G = H(() => (u.value?.result.length ?? 0) > 1800 || (u.value?.result.split(`
`).length ?? 0) > 10);
    let P = !0, N = !0, E;
    const M = (s) => s.status === "queued" || s.status === "running";
    function K() {
      w.value && (N = w.value.scrollHeight - w.value.scrollTop - w.value.clientHeight < 40);
    }
    const D = ye(async () => {
      try {
        let s = !0;
        for (; s && P; ) {
          const p = await j.run(h.runId, T.value);
          if (!P) return;
          u.value = p.run, T.value = p.next_seq, p.events.length && ($.value = $.value.concat(p.events), await me(), N && w.value?.scrollTo({ top: w.value.scrollHeight })), s = p.more;
        }
        P && u.value && _("changed", u.value), b.value = "";
      } catch (s) {
        b.value = Q(s, "Could not load the task.");
      }
    }), X = ke.run(h.runId, () => {
      D();
    });
    ve(D), pe(() => {
      P = !1, X(), clearTimeout(E);
    });
    async function Y() {
      try {
        await j.cancelRun(h.runId), await D();
      } catch (s) {
        b.value = Q(s, "Could not cancel the task.");
      }
    }
    async function f() {
      try {
        const s = u.value?.result ?? "";
        try {
          await navigator.clipboard.writeText(s);
        } catch {
          const p = document.createElement("textarea"), B = x.value?.getRootNode(), fe = B instanceof ShadowRoot || B instanceof Document ? B.activeElement : null, xe = fe instanceof HTMLElement ? fe : null;
          p.value = s, p.readOnly = !0, p.style.cssText = "position:fixed;opacity:0;pointer-events:none;", x.value?.parentElement?.append(p);
          try {
            if (p.select(), !document.execCommand("copy")) throw new Error("Copy failed");
          } finally {
            p.remove(), xe?.focus({ preventScroll: !0 });
          }
        }
        A.value = !0, g.value = "", clearTimeout(E), E = setTimeout(() => {
          A.value = !1;
        }, 2e3);
      } catch {
        g.value = "Could not copy. Select the result text to copy it.";
      }
    }
    function r() {
      C.value = !C.value, C.value || x.value?.scrollTo({ top: 0 });
    }
    function t(s) {
      return typeof s.options?.model == "string" ? s.options.model : "";
    }
    function k(s) {
      return h.accounts.find((p) => p.id === s)?.label ?? "Unlisted account";
    }
    function V(s) {
      return h.workspaces.find((p) => p.id === s)?.name ?? "Unlisted workspace";
    }
    function d(s) {
      return h.images.find((p) => p.id === s)?.label ?? "Unlisted image";
    }
    function v(s) {
      const p = [];
      return s.usage.input_tokens !== void 0 && p.push(`${s.usage.input_tokens} input`), s.usage.output_tokens !== void 0 && p.push(`${s.usage.output_tokens} output`), s.usage.cached_tokens !== void 0 && p.push(`${s.usage.cached_tokens} cached`), p.length ? `${p.join(" · ")} tokens` : "";
    }
    return (s, p) => (a(), n("section", pt, [
      b.value ? (a(), n("p", mt, [
        q(l(b.value) + " ", 1),
        e("button", {
          type: "button",
          class: "ac-link kx-focus-outline",
          onClick: p[0] || (p[0] = //@ts-ignore
          (...B) => o(D) && o(D)(...B))
        }, "Retry")
      ])) : m("", !0),
      !u.value && !b.value ? (a(), n("div", kt, [
        L(o(I), {
          icon: "tabler:loader-2",
          class: "spin"
        }),
        p[2] || (p[2] = q(" Loading the task…", -1))
      ])) : u.value ? (a(), n(O, { key: 2 }, [
        e("header", gt, [
          e("div", yt, [
            e("span", {
              class: F(["kx-tag-sm ac-tone", u.value.status])
            }, l(u.value.status), 3),
            M(u.value) ? (a(), n("button", {
              key: 0,
              type: "button",
              class: "ac-btn danger kx-focus-halo",
              disabled: u.value.cancel_requested,
              onClick: Y
            }, [
              L(o(I), { icon: "tabler:player-stop" }),
              q(" " + l(u.value.cancel_requested ? "Cancelling…" : "Cancel"), 1)
            ], 8, ft)) : m("", !0)
          ]),
          e("h2", bt, l(u.value.prompt.split(`
`)[0]), 1),
          e("div", ht, [
            e("span", null, [
              L(o(I), {
                icon: o(ue)(u.value.agent, o(R).agents)
              }, null, 8, ["icon"]),
              q(l(o(R).agents.find((B) => B.id === u.value?.agent)?.title ?? u.value.agent), 1)
            ]),
            e("span", null, l(k(u.value.account_id)), 1),
            e("span", null, l(d(u.value.image_id)), 1),
            e("span", {
              title: o(ne)(u.value.started_at || u.value.created_at)
            }, l(u.value.started_at ? "Started" : "Queued") + " " + l(o(ge)(u.value.started_at || u.value.created_at, o(y))), 9, _t),
            u.value.started_at ? (a(), n("span", $t, l(o($e)(u.value, o(y))) + " " + l(M(u.value) ? "elapsed" : "duration"), 1)) : m("", !0),
            u.value.timeout_ms ? (a(), n("span", wt, l(o(Ue)(u.value.timeout_ms)), 1)) : m("", !0),
            e("span", null, l(u.value.unattended ? "Unattended" : "Attended"), 1),
            u.value.workflow ? (a(), n("span", xt, "Workflow")) : m("", !0),
            u.value.workspace_id ? (a(), n("span", Ct, l(V(u.value.workspace_id)), 1)) : m("", !0),
            t(u.value) ? (a(), n("span", At, l(t(u.value)), 1)) : m("", !0),
            v(u.value) ? (a(), n("span", Tt, l(v(u.value)), 1)) : m("", !0)
          ])
        ]),
        e("section", Vt, [
          e("div", Lt, [
            p[3] || (p[3] = e("h3", { id: "ac-prompt-heading" }, "Prompt", -1)),
            U.value ? (a(), n("button", {
              key: 0,
              type: "button",
              class: "ac-link kx-focus-outline",
              "aria-expanded": S.value,
              "aria-controls": "ac-prompt-text",
              onClick: p[1] || (p[1] = (B) => S.value = !S.value)
            }, l(S.value ? "Collapse prompt" : "Expand prompt"), 9, Rt)) : m("", !0)
          ]),
          e("pre", {
            id: "ac-prompt-text",
            class: F(["ac-pre ac-prompt", { expanded: S.value || !U.value }])
          }, [
            e("span", null, l(u.value.prompt), 1)
          ], 2)
        ]),
        u.value.result ? (a(), n("section", St, [
          e("div", Ut, [
            e("h3", Et, l(u.value.status === "succeeded" ? "Result" : "Partial result"), 1),
            e("div", qt, [
              G.value ? (a(), n("button", {
                key: 0,
                type: "button",
                class: "ac-link kx-focus-outline",
                "aria-expanded": C.value,
                "aria-controls": "ac-result-text",
                onClick: r
              }, l(C.value ? "Collapse result" : "Expand result"), 9, It)) : m("", !0),
              e("button", {
                type: "button",
                class: "ac-btn kx-focus-halo",
                onClick: f
              }, [
                L(o(I), {
                  icon: A.value ? "tabler:check" : "tabler:copy"
                }, null, 8, ["icon"]),
                q(l(A.value ? "Copied" : "Copy"), 1)
              ])
            ])
          ]),
          g.value ? (a(), n("p", Nt, l(g.value), 1)) : m("", !0),
          e("pre", {
            id: "ac-result-text",
            ref_key: "result",
            ref: x,
            class: F(["ac-pre ac-result-text", { expanded: C.value }]),
            tabindex: "0",
            "aria-label": "Result"
          }, l(u.value.result), 3)
        ])) : m("", !0),
        u.value.error ? (a(), n("p", Dt, l(u.value.error), 1)) : m("", !0),
        e("section", Mt, [
          e("div", Pt, [
            p[4] || (p[4] = e("h3", { id: "ac-log-heading" }, "Log", -1)),
            e("span", Bt, l($.value.length) + " events", 1)
          ]),
          e("div", {
            ref_key: "stream",
            ref: w,
            class: "ac-stream",
            tabindex: "0",
            "aria-label": "Task log",
            onScroll: K
          }, [
            (a(!0), n(O, null, z($.value, (B) => (a(), n("div", {
              key: B.seq,
              class: F(["ac-event", B.kind])
            }, [
              e("span", Wt, l(B.kind), 1),
              e("pre", jt, l(B.text), 1)
            ], 2))), 128)),
            M(u.value) ? (a(), n("div", Ht, "Working…")) : $.value.length ? m("", !0) : (a(), n("div", Ot, "No log events."))
          ], 544)
        ])
      ], 64)) : m("", !0)
    ]));
  }
}), Kt = {
  key: 0,
  class: "kx-loading"
}, zt = { key: 1 }, Ft = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, Jt = {
  key: 1,
  class: "kx-empty"
}, Qt = { class: "kx-empty-ico" }, Xt = { class: "kx-empty-sub" }, Yt = {
  key: 2,
  class: "kx-empty"
}, Zt = {
  key: 3,
  class: "ac-run-list"
}, ea = ["onClick"], ta = { class: "ac-run-copy" }, aa = { class: "ac-run-title-row" }, na = { class: "ac-run-title" }, la = {
  key: 0,
  class: "kx-tag-sm ac-tone"
}, sa = { class: "ac-run-meta" }, oa = ["title"], ua = { key: 0 }, ca = {
  key: 4,
  class: "ac-load-more"
}, ia = /* @__PURE__ */ te({
  __name: "tasks",
  props: {
    query: {}
  },
  emits: ["goto", "agentChanged", "count"],
  setup(i, { expose: W, emit: h }) {
    const _ = i, R = h, u = oe(), $ = c(!1), T = c(!1);
    W({ open: () => {
      $.value = !0;
    } });
    const b = c([]), w = c([]), x = c([]), S = c([]), C = c([]), A = c(), g = c(!1), y = c(""), U = c(null), G = le(), P = c(!1);
    let N = 0;
    const E = ye(async () => {
      N++, P.value = !0;
      try {
        const [d, v, s, p, B] = await Promise.all([j.accounts(), j.images(), j.runs(), j.workspaces(), j.drivers()]);
        b.value = d, w.value = v, C.value = s.runs, A.value = s.next_cursor, x.value = p.workspaces, S.value = B, g.value = !0, y.value = "";
      } catch (d) {
        y.value = Q(d, "Could not load tasks.");
      } finally {
        P.value = !1;
      }
    }), M = ke.runs(() => {
      E();
    });
    _e(() => [...w.value, ...b.value].map((d) => d.id), () => {
      E();
    }), ve(E), pe(M);
    const K = c(!1);
    async function D() {
      if (!(!A.value || K.value || P.value)) {
        K.value = !0;
        try {
          const d = N, v = await j.runs(A.value);
          if (N !== d) return;
          const s = new Set(C.value.map((p) => p.id));
          C.value.push(...v.runs.filter((p) => !s.has(p.id))), A.value = v.next_cursor;
        } catch (d) {
          y.value = Q(d, "Could not load more tasks.");
        } finally {
          K.value = !1;
        }
      }
    }
    async function X(d) {
      $.value = !1, await E(), U.value = d;
    }
    function Y() {
      E();
    }
    const f = H(() => b.value.some((d) => d.usable && d.enabled)), r = H(() => C.value.filter((d) => [d.prompt_summary, d.status, d.agent, t(d.agent), V(d.account_id)].join(" ").toLowerCase().includes(_.query.trim().toLowerCase())));
    ee(() => C.value.length, (d) => R("count", d));
    function t(d) {
      return u.value.agents.find((v) => v.id === d)?.title ?? d;
    }
    function k(d) {
      return w.value.find((v) => v.id === d)?.label ?? "Unlisted image";
    }
    function V(d) {
      return b.value.find((v) => v.id === d)?.label ?? "Unlisted account";
    }
    return (d, v) => g.value ? (a(), n("div", zt, [
      y.value ? (a(), n("p", Ft, [
        q(l(y.value) + " ", 1),
        e("button", {
          class: "ac-link kx-focus-outline",
          type: "button",
          onClick: v[1] || (v[1] = //@ts-ignore
          (...s) => o(E) && o(E)(...s))
        }, "Retry")
      ])) : m("", !0),
      C.value.length ? r.value.length ? m("", !0) : (a(), n("div", Yt, [...v[12] || (v[12] = [
        e("div", { class: "kx-empty-title" }, "No matches", -1),
        e("div", { class: "kx-empty-sub" }, "Try another task, agent or account.", -1)
      ])])) : (a(), n("div", Jt, [
        e("div", Qt, [
          L(o(I), { icon: "tabler:terminal-2" })
        ]),
        v[11] || (v[11] = e("div", { class: "kx-empty-title" }, "No tasks yet", -1)),
        e("div", Xt, l(f.value ? "Give a coding agent a task and follow its progress here." : "Add an account to give your coding agent a place to start."), 1),
        L(o(de), {
          label: f.value ? "New task" : "Add account",
          onClick: v[2] || (v[2] = (s) => f.value ? $.value = !0 : R("goto"))
        }, {
          icon: ae(() => [
            L(o(I), { icon: "tabler:plus" })
          ]),
          _: 1
        }, 8, ["label"])
      ])),
      r.value.length ? (a(), n("ul", Zt, [
        (a(!0), n(O, null, z(r.value, (s) => (a(), n("li", {
          key: s.id,
          class: "ac-run"
        }, [
          e("button", {
            type: "button",
            class: "ac-run-main kx-focus-halo",
            onClick: (p) => U.value = s.id
          }, [
            e("span", ta, [
              e("span", aa, [
                e("span", na, l(s.prompt_summary.split(`
`)[0]), 1),
                e("span", {
                  class: F(["kx-tag-sm ac-tone", s.status])
                }, l(s.status), 3),
                s.workflow ? (a(), n("span", la, "Workflow")) : m("", !0)
              ]),
              e("span", sa, [
                e("span", null, [
                  L(o(I), {
                    icon: o(ue)(s.agent, o(u).agents)
                  }, null, 8, ["icon"]),
                  q(l(t(s.agent)), 1)
                ]),
                e("span", null, l(V(s.account_id)), 1),
                e("span", null, l(k(s.image_id)), 1),
                e("span", {
                  title: o(ne)(s.started_at || s.created_at)
                }, l(o(ge)(s.started_at || s.created_at, o(G))), 9, oa),
                s.started_at ? (a(), n("span", ua, l(o($e)(s, o(G))) + " " + l(s.status === "running" ? "elapsed" : "duration"), 1)) : m("", !0)
              ])
            ]),
            L(o(I), {
              icon: "tabler:chevron-right",
              class: "ac-run-chevron ac-muted"
            })
          ], 8, ea)
        ]))), 128))
      ])) : m("", !0),
      A.value ? (a(), n("div", ca, [
        L(o(de), {
          label: "Load more",
          loading: K.value,
          disabled: P.value,
          onClick: D
        }, null, 8, ["loading", "disabled"])
      ])) : m("", !0),
      $.value ? (a(), J(ie, {
        key: 5,
        title: "New task",
        busy: T.value,
        wide: "",
        onClose: v[7] || (v[7] = (s) => $.value = !1)
      }, {
        default: ae(() => [
          L(vt, {
            onBusy: v[3] || (v[3] = (s) => T.value = s),
            accounts: b.value,
            images: w.value,
            workspaces: x.value,
            drivers: S.value,
            onStarted: X,
            onCancel: v[4] || (v[4] = (s) => $.value = !1),
            onAgentChanged: v[5] || (v[5] = (s) => R("agentChanged", s)),
            onGoto: v[6] || (v[6] = (s, p) => R("goto", p))
          }, null, 8, ["accounts", "images", "workspaces", "drivers"])
        ]),
        _: 1
      }, 8, ["busy"])) : m("", !0),
      U.value ? (a(), J(ie, {
        key: 6,
        title: "Task details",
        wide: "",
        onClose: v[9] || (v[9] = (s) => U.value = null)
      }, {
        footer: ae(() => [
          e("button", {
            type: "button",
            class: "ac-btn kx-focus-halo",
            onClick: v[8] || (v[8] = (s) => U.value = null)
          }, "Close")
        ]),
        default: ae(() => [
          (a(), J(Gt, {
            key: U.value,
            "run-id": U.value,
            accounts: b.value,
            images: w.value,
            workspaces: x.value,
            onChanged: Y
          }, null, 8, ["run-id", "accounts", "images", "workspaces"]))
        ]),
        _: 1
      })) : m("", !0)
    ])) : (a(), n("div", Kt, [
      y.value ? (a(), n(O, { key: 0 }, [
        q(l(y.value) + " ", 1),
        e("button", {
          class: "ac-link kx-focus-outline",
          type: "button",
          onClick: v[0] || (v[0] = //@ts-ignore
          (...s) => o(E) && o(E)(...s))
        }, "Retry")
      ], 64)) : (a(), n(O, { key: 1 }, [
        L(o(I), {
          icon: "tabler:loader-2",
          class: "spin"
        }),
        v[10] || (v[10] = q(" Loading tasks…", -1))
      ], 64))
    ]));
  }
}), ra = { class: "ac-account-main" }, da = { class: "ac-row-title" }, va = ["onKeydown"], pa = {
  key: 1,
  class: "ac-row-name"
}, ma = {
  key: 2,
  class: "kx-tag-sm ac-tone"
}, ka = { class: "ac-muted" }, ga = ["title"], ya = { key: 1 }, fa = {
  key: 0,
  class: "ac-muted"
}, ba = {
  key: 1,
  class: "ac-muted ac-strong"
}, ha = {
  key: 2,
  class: "ac-muted"
}, _a = {
  key: 3,
  class: "ac-muted ac-mono"
}, $a = {
  key: 4,
  class: "ac-muted"
}, wa = {
  key: 5,
  class: "kx-err ac-small"
}, xa = { class: "ac-row-actions" }, Ca = ["title"], Aa = ["checked", "aria-label"], Ta = /* @__PURE__ */ te({
  __name: "account-row",
  props: {
    account: {},
    kindLabel: {},
    ownerLabel: {}
  },
  emits: ["toggle", "rename", "remove"],
  setup(i, { emit: W }) {
    const h = i, _ = W, R = { ready: "ready", cooling: "cooling down", disabled: "disabled", unavailable: "unavailable" }, u = le(), $ = H(() => se(h.account, u.value)), T = H(() => h.account.mine ? "" : `Shared with you by ${h.ownerLabel}`), b = c(!1), w = c(""), x = c(null);
    function S() {
      w.value = h.account.label, b.value = !0, me(() => x.value?.select());
    }
    function C() {
      if (!b.value) return;
      b.value = !1;
      const A = w.value.trim();
      A && A !== h.account.label && _("rename", A);
    }
    return (A, g) => (a(), n("li", {
      class: F(["ac-row ac-account ac-hover-actions", { off: !i.account.enabled || !i.account.usable }])
    }, [
      e("div", ra, [
        e("div", da, [
          e("span", {
            class: F(["kx-tag-sm ac-tone", $.value])
          }, l(R[$.value]), 3),
          b.value ? Z((a(), n("input", {
            key: 0,
            ref_key: "input",
            ref: x,
            "onUpdate:modelValue": g[0] || (g[0] = (y) => w.value = y),
            class: "ac-rename kx-focus-halo",
            "aria-label": "Account label",
            onKeydown: [
              be(he(C, ["prevent"]), ["enter"]),
              g[1] || (g[1] = be(he((y) => b.value = !1, ["prevent"]), ["escape"]))
            ],
            onBlur: C
          }, null, 40, va)), [
            [re, w.value]
          ]) : (a(), n("span", pa, l(i.account.label), 1)),
          i.account.subscription ? (a(), n("span", ma, "personal")) : m("", !0)
        ]),
        e("div", ka, [
          q(l(i.kindLabel) + " · " + l(i.account.runs_day) + " " + l(i.account.runs_day === 1 ? "task" : "tasks") + " in the last 24 hours · " + l(i.account.failures_day) + " " + l(i.account.failures_day === 1 ? "failure" : "failures") + " · ", 1),
          i.account.last_used_at ? (a(), n("span", {
            key: 0,
            title: o(ne)(i.account.last_used_at)
          }, "last used " + l(o(ge)(i.account.last_used_at, o(u))), 9, ga)) : (a(), n("span", ya, "never used"))
        ]),
        T.value ? (a(), n("div", fa, l(T.value), 1)) : m("", !0),
        i.account.usable ? i.account.subscription ? (a(), n("div", ha, "Subscription login: personal use only")) : m("", !0) : (a(), n("div", ba, [
          L(o(I), { icon: "tabler:lock" }),
          q(" " + l(i.account.unavailable_reason || "Account unavailable for tasks"), 1)
        ])),
        i.account.endpoint ? (a(), n("div", _a, l(i.account.endpoint.protocol) + " · " + l(i.account.endpoint.base_url) + l(i.account.endpoint.model ? " · " + i.account.endpoint.model : ""), 1)) : m("", !0),
        $.value === "cooling" ? (a(), n("div", $a, "Available at " + l(o(ne)(i.account.cooldown_until)), 1)) : m("", !0),
        i.account.last_error ? (a(), n("div", wa, l(i.account.last_error), 1)) : m("", !0)
      ]),
      e("div", xa, [
        i.account.writable ? (a(), n("label", {
          key: 0,
          class: "ac-switch",
          title: i.account.enabled ? "Disable account" : "Enable account"
        }, [
          e("input", {
            type: "checkbox",
            checked: i.account.enabled,
            "aria-label": i.account.enabled ? "Disable account" : "Enable account",
            onChange: g[2] || (g[2] = (y) => _("toggle"))
          }, null, 40, Aa),
          g[4] || (g[4] = e("span", null, null, -1))
        ], 8, Ca)) : m("", !0),
        i.account.writable ? (a(), n("button", {
          key: 1,
          type: "button",
          class: "ac-icon-btn kx-focus-outline",
          title: "Rename",
          "aria-label": "Rename account",
          onClick: S
        }, [
          L(o(I), { icon: "tabler:pencil" })
        ])) : m("", !0),
        i.account.deletable ? (a(), n("button", {
          key: 2,
          type: "button",
          class: "ac-icon-btn kx-focus-outline",
          title: "Delete",
          "aria-label": "Delete account",
          onClick: g[3] || (g[3] = (y) => _("remove"))
        }, [
          L(o(I), { icon: "tabler:trash" })
        ])) : m("", !0)
      ])
    ], 2));
  }
}), Va = { class: "ac-stack" }, La = {
  key: 0,
  class: "kx-err inline"
}, Ra = {
  key: 1,
  class: "kx-loading"
}, Sa = {
  key: 2,
  class: "kx-empty"
}, Ua = { class: "kx-empty-ico" }, Ea = {
  key: 3,
  class: "kx-empty"
}, qa = { class: "ac-card-head" }, Ia = { class: "ac-card-title" }, Na = { class: "ac-muted" }, Da = { class: "ac-account-grid" }, Ma = { class: "ac-form" }, Pa = ["^config"], Ba = /* @__PURE__ */ te({
  __name: "accounts",
  props: {
    query: {},
    selectedAgent: {}
  },
  emits: ["count"],
  setup(i, { expose: W, emit: h }) {
    const _ = i, R = h, u = c(!1);
    W({ open: () => {
      u.value = !0;
    } });
    const $ = oe(), T = le(), b = c([]), w = c({}), x = c(""), S = c(!1), C = c(!1), A = c(""), g = c(0), y = c(_.selectedAgent || $.value.agents[0]?.id || "");
    ee(() => _.selectedAgent, (t) => {
      t && (y.value = t);
    });
    const U = H(() => $.value.agents.find((t) => t.id === y.value)), G = H(() => JSON.stringify({ driver: U.value, busy: C.value, error: A.value, saved: g.value, limits: $.value.account_limits })), P = H(() => [...$.value.agents, ...[...new Set(b.value.map((t) => t.agent))].filter((t) => !$.value.agents.some((k) => k.id === t)).map((t) => ({ id: t, title: `Unavailable agent: ${t}`, icon: "tabler:terminal-2" }))].map((t) => ({ agent: t, accounts: b.value.filter((k) => k.agent === t.id && [k.label, t.title, k.credential_kind].join(" ").toLowerCase().includes(_.query.toLowerCase())) })).filter((t) => t.accounts.length));
    function N(t) {
      return $.value.agents.find((k) => k.id === t.agent)?.credentials.find((k) => k.id === t.credential_kind)?.label ?? t.credential_kind;
    }
    async function E(t) {
      const k = [...new Set(t.filter((V) => !V.mine).map((V) => V.owner))].filter((V) => !(V in w.value));
      w.value = { ...w.value, ...await Ee(k) };
    }
    const M = ye(async () => {
      try {
        const t = await j.accounts();
        b.value = t, await E(t), S.value = !0, x.value = "";
      } catch (t) {
        x.value = Q(t, "Could not load accounts.");
      }
    });
    _e(() => b.value.map((t) => t.id), () => {
      M();
    });
    const K = ke.runs(() => {
      M();
    });
    pe(K), ve(M);
    async function D(t, k) {
      x.value = "";
      try {
        await t(), await M();
      } catch (V) {
        x.value = Q(V, k);
      }
    }
    async function X(t) {
      if (!(t instanceof CustomEvent)) return;
      const k = We.safeParse(t.detail);
      if (!k.success || C.value) {
        A.value = "Invalid account submission.";
        return;
      }
      const V = k.data;
      A.value = "", C.value = !0;
      try {
        await j.createAccount(V), g.value++, u.value = !1, await M();
      } catch (d) {
        A.value = Q(d, "Could not save the account.");
      } finally {
        C.value = !1;
      }
    }
    ee(b, (t) => R("count", t.length));
    const Y = (t) => D(() => j.updateAccount(t.id, { enabled: !t.enabled }), "Could not update the account."), f = (t, k) => D(() => j.updateAccount(t.id, { label: k }), "Could not rename the account.");
    async function r(t) {
      await Pe.confirm({
        header: "Delete account",
        message: `Delete account "${t.label}"? Tasks keep their history.`,
        icon: "tabler:trash",
        acceptLabel: "Delete",
        rejectLabel: "Cancel",
        acceptClass: "p-button-danger"
      }) && await D(() => j.deleteAccount(t.id), "Could not delete the account.");
    }
    return Se(() => {
      Me("chestor-autocode-driver-account", { timeoutMs: 8e3 }).catch(() => {
        x.value = "The driver account card could not load.";
      });
    }), (t, k) => (a(), n("div", Va, [
      x.value ? (a(), n("p", La, [
        q(l(x.value) + " ", 1),
        e("button", {
          type: "button",
          class: "ac-link kx-focus-outline",
          onClick: k[0] || (k[0] = //@ts-ignore
          (...V) => o(M) && o(M)(...V))
        }, "Retry")
      ])) : m("", !0),
      !S.value && !x.value ? (a(), n("div", Ra, "Loading accounts…")) : m("", !0),
      S.value && !b.value.length ? (a(), n("div", Sa, [
        e("div", Ua, [
          L(o(I), { icon: "tabler:key" })
        ]),
        k[4] || (k[4] = e("div", { class: "kx-empty-title" }, "No accounts yet", -1)),
        k[5] || (k[5] = e("div", { class: "kx-empty-sub" }, "Add an API key, your own endpoint or a personal subscription login.", -1)),
        L(o(de), {
          label: "Add account",
          onClick: k[1] || (k[1] = (V) => u.value = !0)
        }, {
          icon: ae(() => [
            L(o(I), { icon: "tabler:plus" })
          ]),
          _: 1
        })
      ])) : S.value && !P.value.length ? (a(), n("div", Ea, [...k[6] || (k[6] = [
        e("div", { class: "kx-empty-title" }, "No matches", -1),
        e("div", { class: "kx-empty-sub" }, "Try another account or agent.", -1)
      ])])) : m("", !0),
      (a(!0), n(O, null, z(P.value, (V) => (a(), n("section", {
        key: V.agent.id,
        class: "ac-stack"
      }, [
        e("div", qa, [
          e("h2", Ia, [
            L(o(I), {
              icon: o(ue)(V.agent.id, o($).agents)
            }, null, 8, ["icon"]),
            q(l(V.agent.title), 1)
          ]),
          e("span", Na, l(V.accounts.filter((d) => d.usable && o(se)(d, o(T)) === "ready").length) + " of " + l(V.accounts.length) + " ready", 1)
        ]),
        e("ul", Da, [
          (a(!0), n(O, null, z(V.accounts, (d) => (a(), J(Ta, {
            key: d.id,
            account: d,
            "kind-label": N(d),
            "owner-label": w.value[d.owner] || d.owner,
            onToggle: (v) => Y(d),
            onRename: (v) => f(d, v),
            onRemove: (v) => r(d)
          }, null, 8, ["account", "kind-label", "owner-label", "onToggle", "onRename", "onRemove"]))), 128))
        ])
      ]))), 128)),
      u.value ? (a(), J(ie, {
        key: 4,
        title: "Add account",
        busy: C.value,
        onClose: k[3] || (k[3] = (V) => u.value = !1)
      }, {
        default: ae(() => [
          e("div", Ma, [
            L(we, {
              disabled: C.value,
              modelValue: y.value,
              "onUpdate:modelValue": k[2] || (k[2] = (V) => y.value = V),
              agents: o($).agents
            }, null, 8, ["disabled", "modelValue", "agents"]),
            k[7] || (k[7] = e("p", { class: "ac-hint" }, "Tasks balance across your ready accounts automatically.", -1)),
            U.value ? (a(), n("chestor-autocode-driver-account", {
              key: 0,
              "^config": G.value,
              onSubmit: X
            }, null, 40, Pa)) : m("", !0)
          ])
        ]),
        _: 1
      }, 8, ["busy"])) : m("", !0)
    ]));
  }
}), Wa = { class: "ac" }, ja = { class: "ac-bar" }, Ha = {
  class: "ac-tabs",
  "aria-label": "Autocode views"
}, Oa = ["aria-pressed", "onClick"], Ga = {
  key: 0,
  class: "kx-err"
}, Ka = {
  key: 1,
  class: "kx-loading"
}, za = {
  key: 2,
  class: "ac-body"
}, Fa = /* @__PURE__ */ te({
  __name: "autocode",
  setup(i) {
    const W = [
      { id: "tasks", label: "Tasks", icon: "tabler:player-play" },
      { id: "accounts", label: "Accounts", icon: "tabler:key" }
    ], h = c("tasks"), { catalog: _, error: R, load: u } = Ce(), $ = c(""), T = c(0), b = c(null), w = c(null), x = c("");
    async function S(A) {
      A && (x.value = A), h.value = "accounts", $.value = "", await me(), w.value?.open();
    }
    function C() {
      h.value === "tasks" ? b.value?.open() : w.value?.open();
    }
    return (A, g) => (a(), n("div", Wa, [
      L(Ae, {
        title: "Autocode",
        subtitle: "Run coding agents with your accounts and workspaces.",
        count: `${T.value} ${h.value === "tasks" ? "task" : "account"}${T.value === 1 ? "" : "s"}`,
        action: h.value === "tasks" ? "New task" : "Add account",
        query: $.value,
        "onUpdate:query": g[0] || (g[0] = (y) => $.value = y),
        placeholder: h.value === "tasks" ? "Search tasks…" : "Search accounts…",
        onCreate: C
      }, null, 8, ["count", "action", "query", "placeholder"]),
      e("div", ja, [
        e("nav", Ha, [
          (a(), n(O, null, z(W, (y) => e("button", {
            key: y.id,
            type: "button",
            class: F(["ac-tab kx-focus-outline", { active: h.value === y.id }]),
            "aria-pressed": h.value === y.id,
            onClick: (U) => {
              h.value = y.id, $.value = "", T.value = 0;
            }
          }, [
            L(o(I), {
              icon: y.icon
            }, null, 8, ["icon"]),
            q(" " + l(y.label), 1)
          ], 10, Oa)), 64))
        ])
      ]),
      o(R) && !o(_) ? (a(), n("p", Ga, [
        q(l(o(R)) + " ", 1),
        e("button", {
          class: "ac-link kx-focus-outline",
          type: "button",
          onClick: g[1] || (g[1] = //@ts-ignore
          (...y) => o(u) && o(u)(...y))
        }, "Retry")
      ])) : o(_) ? (a(), n("main", za, [
        h.value === "tasks" ? (a(), J(ia, {
          key: 0,
          ref_key: "tasks",
          ref: b,
          query: $.value,
          onCount: g[2] || (g[2] = (y) => T.value = y),
          onAgentChanged: g[3] || (g[3] = (y) => x.value = y),
          onGoto: S
        }, null, 8, ["query"])) : (a(), J(Ba, {
          key: 1,
          ref_key: "accounts",
          ref: w,
          query: $.value,
          "selected-agent": x.value,
          onCount: g[4] || (g[4] = (y) => T.value = y)
        }, null, 8, ["query", "selected-agent"]))
      ])) : (a(), n("div", Ka, [
        L(o(I), {
          icon: "tabler:loader-2",
          class: "spin"
        }),
        g[5] || (g[5] = q(" Loading…", -1))
      ]))
    ]));
  }
}), Ja = { props: { type: "object", properties: {} } }, Qa = {
  wippy: Ja
};
class Xa extends Le {
  static get wippyConfig() {
    return {
      propsSchema: Qa.wippy.props,
      hostCssKeys: ["themeConfigUrl", "primeVueCssUrl", "iframeCssUrl"],
      inlineCss: Te
    };
  }
  static get vueConfig() {
    return { rootComponent: Fa, plugins: [Ve] };
  }
}
Be(import.meta.url, Xa);
