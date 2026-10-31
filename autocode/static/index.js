import { u as he, c as be, _ as Re, d as Me, e as Te, B as je, f as We, a as ze, b as He, s as Ge, P as Je } from "./styles-TWTr3X7x.js";
import { u as ye, a as Ke, b as Qe, W as Xe } from "./dto-CcYNmUR0.js";
import { defineComponent as ie, openBlock as n, createElementBlock as u, Fragment as Y, renderList as te, normalizeClass as ee, createVNode as L, unref as i, createTextVNode as O, toDisplayString as r, ref as v, computed as G, watch as ue, createElementVNode as t, withDirectives as ne, vModelText as re, createCommentVNode as p, isRef as ce, vModelSelect as ke, vModelCheckbox as Ye, createBlock as ae, onMounted as Le, onUnmounted as pe, nextTick as we, withCtx as ge, mergeProps as ve, renderSlot as Ze, withKeys as Ae, withModifiers as Se } from "vue";
import { Icon as q } from "@iconify/vue";
import { b as fe, d as $e, f as de, a as X, e as oe, g as me, l as _e, h as xe, i as Ee, t as et, s as Ce, A as tt, c as Ne, u as Ie, r as Ue, p as at } from "./presentation-Cbft0Qfp.js";
import { d as nt, u as lt, _ as ot } from "./driver-options.vue_vue_type_script_setup_true_lang-4EokJ2OO.js";
import { config as st, loadByTagName as it, host as ut, define as ct } from "@wippy-fe/proxy";
import { a as rt } from "./driver-account-types-Bir4q_IM.js";
const dt = {
  key: 0,
  class: "ac-chips",
  role: "group",
  "aria-label": "Agent"
}, vt = ["disabled", "aria-pressed", "onClick"], pt = ["disabled", "value"], gt = ["value"], Pe = /* @__PURE__ */ ie({
  __name: "agent-picker",
  props: {
    agents: {},
    modelValue: {},
    disabled: { type: Boolean }
  },
  emits: ["update:modelValue"],
  setup(l) {
    return (s, c) => l.agents.length <= 6 ? (n(), u("div", dt, [
      (n(!0), u(Y, null, te(l.agents, (e) => (n(), u("button", {
        key: e.id,
        disabled: l.disabled,
        type: "button",
        class: ee(["ac-chip kx-focus-halo", { active: l.modelValue === e.id }]),
        "aria-pressed": l.modelValue === e.id,
        onClick: (_) => s.$emit("update:modelValue", e.id)
      }, [
        L(i(q), {
          icon: i(fe)(e.id, l.agents),
          "aria-hidden": "true"
        }, null, 8, ["icon"]),
        O(r(e.title), 1)
      ], 10, vt))), 128))
    ])) : (n(), u("select", {
      key: 1,
      disabled: l.disabled,
      class: "kx-focus-halo",
      "aria-label": "Agent",
      value: l.modelValue,
      onChange: c[0] || (c[0] = (e) => s.$emit("update:modelValue", e.target.value))
    }, [
      (n(!0), u(Y, null, te(l.agents, (e) => (n(), u("option", {
        key: e.id,
        value: e.id
      }, r(e.title), 9, gt))), 128))
    ], 40, pt));
  }
}), ht = ["disabled"], ft = { class: "ac-field ac-composer" }, mt = { class: "ac-field" }, kt = {
  key: 0,
  class: "ac-muted"
}, bt = {
  key: 1,
  class: "ac-muted"
}, yt = { class: "ac-picker-row" }, wt = { class: "ac-field" }, $t = { value: "" }, _t = ["value"], xt = { class: "ac-field" }, Ct = ["value"], Vt = { class: "ac-field" }, Ft = ["value"], Tt = { class: "ac-advanced" }, At = { class: "ac-form" }, St = { class: "ac-field" }, Rt = { class: "ac-field" }, Lt = { class: "ac-field" }, Et = {
  key: 0,
  class: "ac-check"
}, Nt = {
  key: 2,
  class: "kx-err",
  role: "alert"
}, It = { class: "ac-dialog-foot" }, Ut = ["disabled"], Pt = /* @__PURE__ */ ie({
  __name: "task-form",
  props: {
    accounts: {},
    images: {},
    workspaces: {}
  },
  emits: ["started", "goto", "agentChanged", "cancel", "busy"],
  setup(l, { emit: s }) {
    const c = l, e = s, _ = he(), h = v(null);
    function E() {
      const d = _.value.settings_path;
      d && h.value?.dispatchEvent(new CustomEvent("navigate", { detail: { path: d }, bubbles: !0, composed: !0 }));
    }
    const x = v({ agent: nt(_.value, c.accounts), account_id: "", image_id: "", workspace_id: "", repo_url: "" }), { now: w, driver: b, agentAccounts: B, ready: S, agentImages: M, invalidOptions: F, optionValues: C, normalizeConfig: V, selectAgent: N } = lt(x, {
      catalog: () => _.value,
      accounts: () => c.accounts,
      images: () => c.images,
      workspaces: () => c.workspaces
    }, "live"), R = G({
      get: () => x.value.agent ?? "",
      set: (d) => {
        d !== x.value.agent && (x.value = N(d));
      }
    });
    function U(d) {
      return G({ get: () => x.value[d] ?? "", set: (o) => {
        x.value[d] = o;
      } });
    }
    const P = U("account_id"), I = U("image_id"), k = U("workspace_id"), m = U("repo_url"), H = U("repo_ref"), W = v(""), Q = v(""), Z = G({ get: () => C.value, set: (d) => {
      x.value.options = d;
    } }), D = G({ get: () => x.value.unattended !== !1, set: (d) => {
      x.value.unattended = d;
    } }), J = v(!1), j = v("");
    function se(d) {
      return $e(d, w.value) === "cooling" ? `${d.label} (cooling down until ${de(d.cooldown_until)})` : d.label;
    }
    ue(R, (d) => e("agentChanged", d), { immediate: !0 });
    let K;
    ue([R, P, I, k, m, H, W, Q, Z, D], () => {
      K = void 0;
    }, { deep: !0, flush: "sync" });
    async function y() {
      if (!J.value) {
        j.value = "", J.value = !0, e("busy", !0);
        try {
          const d = {
            agent: R.value,
            account_id: P.value,
            image_id: I.value,
            workspace_id: k.value,
            repo_url: m.value,
            repo_ref: H.value.trim() || void 0,
            timeout: W.value.trim() || void 0,
            prompt: Q.value,
            options: V(x.value).options ?? {},
            unattended: D.value
          }, o = JSON.stringify(d);
          (!K || K.snapshot !== o) && (K = { snapshot: o, key: crypto.randomUUID(), body: { ...d, options: JSON.parse(JSON.stringify(d.options)) } });
          const { run_id: a } = await X.startRun({ ...K.body, idempotency_key: K.key });
          K = void 0, Q.value = "", e("started", a);
        } catch (d) {
          j.value = oe(d, "Could not start the task.");
        } finally {
          J.value = !1, e("busy", !1);
        }
      }
    }
    return (d, o) => (n(), u("fieldset", {
      ref_key: "root",
      ref: h,
      class: "ac-form ac-new",
      disabled: J.value
    }, [
      t("label", ft, [
        o[13] || (o[13] = t("span", null, "Prompt", -1)),
        ne(t("textarea", {
          "onUpdate:modelValue": o[0] || (o[0] = (a) => Q.value = a),
          autofocus: "",
          rows: "8",
          class: "kx-focus-halo",
          placeholder: "What should the agent do?"
        }, null, 512), [
          [re, Q.value]
        ])
      ]),
      t("div", mt, [
        o[14] || (o[14] = t("span", null, "Agent", -1)),
        L(Pe, {
          modelValue: R.value,
          "onUpdate:modelValue": o[1] || (o[1] = (a) => R.value = a),
          agents: i(_).agents
        }, null, 8, ["modelValue", "agents"])
      ]),
      R.value && !i(B).length ? (n(), u("p", kt, [
        O(" No " + r(i(b)?.title) + " accounts you can run on. ", 1),
        t("button", {
          class: "ac-link kx-focus-outline",
          type: "button",
          onClick: o[2] || (o[2] = (a) => e("goto", "accounts", R.value))
        }, "Add an account")
      ])) : p("", !0),
      i(M).length ? p("", !0) : (n(), u("p", bt, [
        O(" No image with " + r(i(b)?.title ?? R.value) + "; ask an administrator. ", 1),
        i(_).can_images && i(_).settings_path ? (n(), u("button", {
          key: 0,
          class: "ac-link kx-focus-outline",
          type: "button",
          onClick: E
        }, "Manage images")) : p("", !0)
      ])),
      t("div", yt, [
        t("label", wt, [
          o[15] || (o[15] = t("span", null, "Account", -1)),
          ne(t("select", {
            "onUpdate:modelValue": o[3] || (o[3] = (a) => ce(P) ? P.value = a : null),
            class: "kx-focus-halo"
          }, [
            t("option", $t, "Auto (" + r(i(S).length) + " ready)", 1),
            (n(!0), u(Y, null, te(i(B), (a) => (n(), u("option", {
              key: a.id,
              value: a.id
            }, r(se(a)), 9, _t))), 128))
          ], 512), [
            [ke, i(P)]
          ])
        ]),
        t("label", xt, [
          o[16] || (o[16] = t("span", null, "Image", -1)),
          ne(t("select", {
            "onUpdate:modelValue": o[4] || (o[4] = (a) => ce(I) ? I.value = a : null),
            class: "kx-focus-halo"
          }, [
            (n(!0), u(Y, null, te(i(M), (a) => (n(), u("option", {
              key: a.id,
              value: a.id
            }, r(a.label), 9, Ct))), 128))
          ], 512), [
            [ke, i(I)]
          ])
        ]),
        t("label", Vt, [
          o[18] || (o[18] = t("span", null, "Workspace", -1)),
          ne(t("select", {
            "onUpdate:modelValue": o[5] || (o[5] = (a) => ce(k) ? k.value = a : null),
            class: "kx-focus-halo"
          }, [
            o[17] || (o[17] = t("option", { value: "" }, "Scratch directory", -1)),
            (n(!0), u(Y, null, te(l.workspaces, (a) => (n(), u("option", {
              key: a.id,
              value: a.id
            }, r(a.name) + r(a.writable ? "" : " (read-only)"), 9, Ft))), 128))
          ], 512), [
            [ke, i(k)]
          ])
        ])
      ]),
      t("details", Tt, [
        o[23] || (o[23] = t("summary", { class: "kx-focus-outline" }, "Advanced", -1)),
        t("div", At, [
          t("label", St, [
            o[19] || (o[19] = t("span", null, "Git repository", -1)),
            ne(t("input", {
              "onUpdate:modelValue": o[6] || (o[6] = (a) => ce(m) ? m.value = a : null),
              class: "ac-mono kx-focus-halo",
              placeholder: "Optional: https://github.com/org/repo.git"
            }, null, 512), [
              [re, i(m)]
            ])
          ]),
          t("label", Rt, [
            o[20] || (o[20] = t("span", null, "Repository ref", -1)),
            ne(t("input", {
              "onUpdate:modelValue": o[7] || (o[7] = (a) => ce(H) ? H.value = a : null),
              "aria-label": "Repository ref",
              class: "ac-mono kx-focus-halo",
              placeholder: "Default branch"
            }, null, 512), [
              [re, i(H)]
            ])
          ]),
          t("label", Lt, [
            o[21] || (o[21] = t("span", null, "Run timeout", -1)),
            ne(t("input", {
              "onUpdate:modelValue": o[8] || (o[8] = (a) => W.value = a),
              maxlength: "64",
              class: "ac-mono kx-focus-halo",
              placeholder: "Use configured timeout"
            }, null, 512), [
              [re, W.value]
            ])
          ]),
          i(b)?.unattended ? (n(), u("label", Et, [
            ne(t("input", {
              "onUpdate:modelValue": o[9] || (o[9] = (a) => D.value = a),
              type: "checkbox",
              class: "kx-focus-outline"
            }, null, 512), [
              [Ye, D.value]
            ]),
            o[22] || (o[22] = O(" Unattended · skip permission prompts when the image allows it ", -1))
          ])) : p("", !0),
          i(b) ? (n(), ae(ot, {
            key: i(b).id,
            modelValue: Z.value,
            "onUpdate:modelValue": o[10] || (o[10] = (a) => Z.value = a),
            options: i(b).options,
            locked: D.value && i(b).unattended ? i(b).unattended : {},
            onInvalid: o[11] || (o[11] = (a) => F.value = a)
          }, null, 8, ["modelValue", "options", "locked"])) : p("", !0)
        ])
      ]),
      j.value ? (n(), u("p", Nt, r(j.value), 1)) : p("", !0),
      t("footer", It, [
        t("button", {
          type: "button",
          class: "ac-btn kx-focus-halo",
          onClick: o[12] || (o[12] = (a) => e("cancel"))
        }, "Cancel"),
        t("button", {
          type: "button",
          class: "ac-btn primary kx-focus-halo",
          disabled: J.value || i(F) > 0 || !R.value || !(i(P) || i(S).length) || !i(I) || !Q.value.trim(),
          onClick: y
        }, [
          L(i(q), { icon: "tabler:player-play" }),
          O(" " + r(J.value ? "Starting…" : "Start"), 1)
        ], 8, Ut)
      ])
    ], 8, ht));
  }
}), Bt = {
  key: 0,
  class: "kx-empty",
  role: "status"
}, Ot = {
  key: 1,
  class: "kx-err",
  role: "alert"
}, qt = {
  key: 2,
  class: "kx-loading"
}, Dt = { class: "ac-detail-head" }, Mt = { class: "ac-card-head" }, jt = ["disabled"], Wt = { class: "ac-detail-title" }, zt = { class: "ac-run-meta ac-detail-meta" }, Ht = ["title"], Gt = { key: 0 }, Jt = { key: 1 }, Kt = { key: 2 }, Qt = { key: 3 }, Xt = { key: 4 }, Yt = { key: 5 }, Zt = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, ea = {
  class: "ac-detail-section",
  "aria-labelledby": "ac-prompt-heading"
}, ta = { class: "ac-section-head" }, aa = ["aria-expanded"], na = {
  key: 1,
  class: "ac-detail-section ac-result",
  "aria-labelledby": "ac-result-heading"
}, la = { class: "ac-section-head" }, oa = { id: "ac-result-heading" }, sa = { class: "ac-row-actions" }, ia = ["aria-expanded"], ua = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, ca = {
  key: 2,
  class: "kx-err",
  role: "alert"
}, ra = {
  class: "ac-detail-section",
  "aria-labelledby": "ac-log-heading"
}, da = { class: "ac-section-head" }, va = { class: "ac-muted" }, pa = ["disabled"], ga = ["disabled"], ha = {
  class: "ac-stream",
  tabindex: "0",
  "aria-label": "Task log"
}, fa = { class: "ac-event-kind" }, ma = { class: "ac-event-text" }, ka = {
  key: 0,
  class: "ac-muted ac-pulse"
}, ba = {
  key: 1,
  class: "ac-muted"
}, ya = 500, wa = /* @__PURE__ */ ie({
  __name: "run-detail",
  props: {
    runId: {},
    accounts: {},
    images: {},
    workspaces: {}
  },
  setup(l) {
    const s = l, c = he(), e = v(null), _ = v([]), h = v(0), E = v(!1), x = v(!1);
    let w;
    const b = v(!1), B = v(""), S = v(!1), M = v(null), F = v(!1), C = v("");
    let V = null;
    const N = v(!1), R = v(!1), U = v(!1), P = v(""), I = me(), k = G(() => (e.value?.prompt.length ?? 0) > 500 || (e.value?.prompt.split(`
`).length ?? 0) > 5), m = G(() => (e.value?.result.length ?? 0) > 1800 || (e.value?.result.split(`
`).length ?? 0) > 10);
    let H = !0, W = !0, Q, Z;
    const D = ($) => $.status === "queued" || $.status === "running";
    function J() {
      V && (W = V.scrollHeight - V.scrollTop - V.clientHeight < 40);
    }
    Le(() => {
      V = M.value?.closest(".ac") ?? null, V?.addEventListener("scroll", J, { passive: !0 });
    }), pe(() => {
      V?.removeEventListener("scroll", J), V = null;
    });
    const j = Ce(async () => {
      try {
        const $ = w ?? (e.value ? void 0 : 0);
        w = void 0;
        let g = await X.run(s.runId, $ === void 0 ? h.value : void 0, $);
        if (!H) return;
        if ($ === void 0 && (g.more || b.value && g.events.length)) {
          if (g = await X.run(s.runId, void 0, 0), !H) return;
          _.value = g.events, E.value = g.more, b.value = !1;
        } else if ($ !== void 0)
          _.value = g.events, E.value = g.more, b.value = $ !== 0;
        else if (g.events.length) {
          const z = Math.max(0, _.value.length + g.events.length - ya);
          z && _.value.splice(0, z), _.value.push(...g.events), E.value = E.value || z > 0;
        }
        S.value = !1, e.value = g.run, b.value || (h.value = g.next_seq), await we(), H && W && V && V.scrollTo({ top: V.scrollHeight }), B.value = "";
      } catch ($) {
        if (!H) return;
        S.value = $ instanceof tt && $.code === "autocode.run_not_found", S.value && (e.value = null, _.value = []), B.value = S.value ? "" : oe($, "Could not load the task.");
      } finally {
        x.value = !1;
      }
    });
    function se() {
      x.value || !_.value.length || (W = !1, x.value = !0, w = _.value[0].seq, j());
    }
    function K() {
      x.value || (W = !0, x.value = !0, w = 0, j());
    }
    const y = _e.run(s.runId, () => {
      j();
    });
    ye(j), pe(() => {
      H = !1, y(), clearTimeout(Z), clearTimeout(Q);
    });
    async function d() {
      try {
        await X.cancelRun(s.runId), await j();
      } catch ($) {
        B.value = oe($, "Could not cancel the task.");
      }
    }
    async function o($) {
      try {
        await navigator.clipboard.writeText($);
      } catch {
        const g = document.createElement("textarea"), z = M.value?.getRootNode(), Fe = z instanceof ShadowRoot || z instanceof Document ? z.activeElement : null, De = Fe instanceof HTMLElement ? Fe : null;
        g.value = $, g.readOnly = !0, g.style.cssText = "position:fixed;opacity:0;pointer-events:none;", M.value?.append(g);
        try {
          if (g.select(), !document.execCommand("copy")) throw new Error("Copy failed");
        } finally {
          g.remove(), De?.focus({ preventScroll: !0 });
        }
      }
    }
    async function a() {
      try {
        await o(e.value?.result ?? ""), U.value = !0, P.value = "", clearTimeout(Z), Z = setTimeout(() => {
          U.value = !1;
        }, 2e3);
      } catch {
        P.value = "Could not copy. Select the result text to copy it.";
      }
    }
    async function f() {
      try {
        const $ = new URL(st.env.APP_API_URL || "/", window.location.href);
        await o(new URL(`/autocode/runs/${encodeURIComponent(s.runId)}`, $).href), F.value = !0, C.value = "", clearTimeout(Q), Q = setTimeout(() => {
          F.value = !1;
        }, 2e3);
      } catch {
        C.value = "Could not copy the link. Try again.";
      }
    }
    function A() {
      R.value = !R.value;
    }
    function T($) {
      return typeof $.options?.model == "string" ? $.options.model : "";
    }
    function le($) {
      return s.accounts.find((g) => g.id === $)?.label ?? "Unlisted account";
    }
    function Oe($) {
      return s.workspaces.find((g) => g.id === $)?.name ?? "Unlisted workspace";
    }
    function qe($) {
      return s.images.find((g) => g.id === $)?.label ?? "Unlisted image";
    }
    function Ve($) {
      const g = [];
      return $.usage.input_tokens !== void 0 && g.push(`${$.usage.input_tokens} input`), $.usage.output_tokens !== void 0 && g.push(`${$.usage.output_tokens} output`), $.usage.cached_tokens !== void 0 && g.push(`${$.usage.cached_tokens} cached`), g.length ? `${g.join(" · ")} tokens` : "";
    }
    return ($, g) => (n(), u("section", {
      ref_key: "detail",
      ref: M,
      class: "ac-form ac-detail"
    }, [
      S.value ? (n(), u("div", Bt, [...g[2] || (g[2] = [
        t("h1", null, "Run not found", -1),
        t("p", null, "This run does not exist or you do not have access to it.", -1)
      ])])) : p("", !0),
      B.value ? (n(), u("p", Ot, [
        O(r(B.value) + " ", 1),
        t("button", {
          type: "button",
          class: "ac-link kx-focus-outline",
          onClick: g[0] || (g[0] = //@ts-ignore
          (...z) => i(j) && i(j)(...z))
        }, "Retry")
      ])) : p("", !0),
      !e.value && !B.value && !S.value ? (n(), u("div", qt, [
        L(i(q), {
          icon: "tabler:loader-2",
          class: "spin"
        }),
        g[3] || (g[3] = O(" Loading the task…", -1))
      ])) : e.value ? (n(), u(Y, { key: 3 }, [
        t("header", Dt, [
          t("div", Mt, [
            t("span", {
              class: ee(["kx-tag-sm ac-tone", e.value.status])
            }, r(e.value.status), 3),
            t("button", {
              type: "button",
              class: "ac-btn kx-focus-halo",
              "aria-live": "polite",
              onClick: f
            }, [
              L(i(q), {
                icon: F.value ? "tabler:check" : "tabler:link"
              }, null, 8, ["icon"]),
              O(r(F.value ? "Link copied" : "Copy link"), 1)
            ]),
            D(e.value) ? (n(), u("button", {
              key: 0,
              type: "button",
              class: "ac-btn danger kx-focus-halo",
              disabled: e.value.cancel_requested,
              onClick: d
            }, [
              L(i(q), { icon: "tabler:player-stop" }),
              O(" " + r(e.value.cancel_requested ? "Cancelling…" : "Cancel"), 1)
            ], 8, jt)) : p("", !0)
          ]),
          t("h1", Wt, r(e.value.prompt.split(`
`)[0]), 1),
          t("div", zt, [
            t("span", null, [
              L(i(q), {
                icon: i(fe)(e.value.agent, i(c).agents)
              }, null, 8, ["icon"]),
              O(r(i(c).agents.find((z) => z.id === e.value?.agent)?.title ?? e.value.agent), 1)
            ]),
            t("span", null, r(le(e.value.account_id)), 1),
            t("span", null, r(qe(e.value.image_id)), 1),
            t("span", {
              title: i(de)(e.value.started_at || e.value.created_at)
            }, r(e.value.started_at ? "Started" : "Queued") + " " + r(i(xe)(e.value.started_at || e.value.created_at, i(I))), 9, Ht),
            e.value.started_at ? (n(), u("span", Gt, r(i(Ee)(e.value, i(I))) + " " + r(D(e.value) ? "elapsed" : "duration"), 1)) : p("", !0),
            e.value.timeout_ms ? (n(), u("span", Jt, r(i(et)(e.value.timeout_ms)), 1)) : p("", !0),
            t("span", null, r(e.value.unattended ? "Unattended" : "Attended"), 1),
            e.value.workflow ? (n(), u("span", Kt, "Workflow")) : p("", !0),
            e.value.workspace_id ? (n(), u("span", Qt, r(Oe(e.value.workspace_id)), 1)) : p("", !0),
            T(e.value) ? (n(), u("span", Xt, r(T(e.value)), 1)) : p("", !0),
            Ve(e.value) ? (n(), u("span", Yt, r(Ve(e.value)), 1)) : p("", !0)
          ])
        ]),
        C.value ? (n(), u("p", Zt, r(C.value), 1)) : p("", !0),
        t("section", ea, [
          t("div", ta, [
            g[4] || (g[4] = t("h3", { id: "ac-prompt-heading" }, "Prompt", -1)),
            k.value ? (n(), u("button", {
              key: 0,
              type: "button",
              class: "ac-link kx-focus-outline",
              "aria-expanded": N.value,
              "aria-controls": "ac-prompt-text",
              onClick: g[1] || (g[1] = (z) => N.value = !N.value)
            }, r(N.value ? "Collapse prompt" : "Expand prompt"), 9, aa)) : p("", !0)
          ]),
          t("pre", {
            id: "ac-prompt-text",
            class: ee(["ac-pre ac-prompt", { expanded: N.value || !k.value }])
          }, [
            t("span", null, r(e.value.prompt), 1)
          ], 2)
        ]),
        e.value.result ? (n(), u("section", na, [
          t("div", la, [
            t("h3", oa, r(e.value.status === "succeeded" ? "Result" : "Partial result"), 1),
            t("div", sa, [
              m.value ? (n(), u("button", {
                key: 0,
                type: "button",
                class: "ac-link kx-focus-outline",
                "aria-expanded": R.value,
                "aria-controls": "ac-result-text",
                onClick: A
              }, r(R.value ? "Collapse result" : "Expand result"), 9, ia)) : p("", !0),
              t("button", {
                type: "button",
                class: "ac-btn kx-focus-halo",
                onClick: a
              }, [
                L(i(q), {
                  icon: U.value ? "tabler:check" : "tabler:copy"
                }, null, 8, ["icon"]),
                O(r(U.value ? "Copied" : "Copy"), 1)
              ])
            ])
          ]),
          P.value ? (n(), u("p", ua, r(P.value), 1)) : p("", !0),
          t("pre", {
            id: "ac-result-text",
            class: ee(["ac-pre ac-result-text", { expanded: R.value }]),
            tabindex: "0",
            "aria-label": "Result"
          }, r(e.value.result), 3)
        ])) : p("", !0),
        e.value.error ? (n(), u("p", ca, r(e.value.error), 1)) : p("", !0),
        t("section", ra, [
          t("div", da, [
            g[5] || (g[5] = t("h3", { id: "ac-log-heading" }, "Log", -1)),
            t("span", va, r(_.value.length) + " events", 1)
          ]),
          E.value ? (n(), u("button", {
            key: 0,
            type: "button",
            class: "ac-link kx-focus-outline",
            disabled: x.value,
            onClick: se
          }, r(x.value ? "Loading…" : "Load earlier"), 9, pa)) : p("", !0),
          b.value ? (n(), u("button", {
            key: 1,
            type: "button",
            class: "ac-link kx-focus-outline",
            disabled: x.value,
            onClick: K
          }, "Latest", 8, ga)) : p("", !0),
          t("div", ha, [
            (n(!0), u(Y, null, te(_.value, (z) => (n(), u("div", {
              key: z.seq,
              class: ee(["ac-event", z.kind])
            }, [
              t("span", fa, r(z.kind), 1),
              t("pre", ma, r(z.text), 1)
            ], 2))), 128)),
            D(e.value) ? (n(), u("div", ka, "Working…")) : _.value.length ? p("", !0) : (n(), u("div", ba, "No log events."))
          ])
        ])
      ], 64)) : p("", !0)
    ], 512));
  }
}), $a = {
  key: 0,
  "aria-label": "Task details"
}, _a = { class: "ac-detail-back" }, xa = {
  key: 1,
  class: "kx-loading"
}, Ca = { key: 2 }, Va = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, Fa = {
  key: 1,
  class: "kx-empty"
}, Ta = { class: "kx-empty-ico" }, Aa = { class: "kx-empty-sub" }, Sa = {
  key: 2,
  class: "kx-empty"
}, Ra = {
  key: 3,
  class: "ac-run-list"
}, La = ["onClick"], Ea = { class: "ac-run-copy" }, Na = { class: "ac-run-title-row" }, Ia = { class: "ac-run-title" }, Ua = {
  key: 0,
  class: "kx-tag-sm ac-tone"
}, Pa = { class: "ac-run-meta" }, Ba = ["title"], Oa = { key: 0 }, qa = {
  key: 4,
  class: "ac-load-more"
}, Da = /* @__PURE__ */ ie({
  __name: "tasks",
  props: {
    query: {},
    runId: {}
  },
  emits: ["goto", "agentChanged", "count", "open", "close"],
  setup(l, { expose: s, emit: c }) {
    const e = Ne(), _ = v([]), h = l, E = c, x = he(), w = v(!1), b = v(!1);
    s({ open: () => {
      w.value = !0;
    } });
    const B = v([]), S = v([]), M = v([]), F = v([]), C = v(), V = v(!1), N = v(""), R = me(), U = v(!1);
    let P = 0, I = 1;
    async function k() {
      const y = [];
      let d;
      for (let o = 0; o < I; o++) {
        const a = await X.runs(d);
        if (!e() || (y.push(...a.runs), d = a.next_cursor, !d)) break;
      }
      return { runs: y, next_cursor: d };
    }
    const m = Ce(async () => {
      P++, U.value = !0;
      try {
        const [y, d, o, a] = await Ue(
          () => Promise.all([X.accounts(), X.images(), k(), X.workspaces()]),
          ([f, A, , T]) => [...f, ...A, ...T.workspaces].map((le) => le.id),
          _,
          e
        );
        if (!e()) return;
        B.value = y, S.value = d, F.value = o.runs, C.value = o.next_cursor, M.value = a.workspaces, V.value = !0, N.value = "";
      } catch (y) {
        e() && (N.value = oe(y, "Could not load tasks."));
      } finally {
        e() && (U.value = !1);
      }
    }, e), H = _e.runs(() => {
      m();
    });
    Ie(() => _.value, () => {
      m();
    }), ye(m), pe(H);
    const W = v(!1);
    async function Q() {
      if (!(!C.value || W.value || U.value)) {
        W.value = !0;
        try {
          const y = P, d = await X.runs(C.value);
          if (!e() || P !== y) return;
          const o = new Set(F.value.map((a) => a.id));
          F.value.push(...d.runs.filter((a) => !o.has(a.id))), C.value = d.next_cursor, I++;
        } catch (y) {
          e() && (N.value = oe(y, "Could not load more tasks."));
        } finally {
          e() && (W.value = !1);
        }
      }
    }
    function Z(y) {
      w.value = !1, E("open", y);
    }
    const D = G(() => B.value.some((y) => y.usable && y.enabled)), J = G(() => F.value.filter((y) => [y.prompt_summary, y.status, y.agent, j(y.agent), K(y.account_id)].join(" ").toLowerCase().includes(h.query.trim().toLowerCase())));
    ue(() => F.value.length, (y) => E("count", y));
    function j(y) {
      return x.value.agents.find((d) => d.id === y)?.title ?? y;
    }
    function se(y) {
      return S.value.find((d) => d.id === y)?.label ?? "Unlisted image";
    }
    function K(y) {
      return B.value.find((d) => d.id === y)?.label ?? "Unlisted account";
    }
    return (y, d) => l.runId ? (n(), u("section", $a, [
      t("div", _a, [
        t("button", {
          type: "button",
          class: "ac-btn kx-focus-halo",
          onClick: d[0] || (d[0] = (o) => E("close"))
        }, [
          L(i(q), { icon: "tabler:arrow-left" }),
          d[9] || (d[9] = O(" Back to tasks", -1))
        ])
      ]),
      (n(), ae(wa, {
        key: l.runId,
        "run-id": l.runId,
        accounts: B.value,
        images: S.value,
        workspaces: M.value
      }, null, 8, ["run-id", "accounts", "images", "workspaces"]))
    ])) : V.value ? (n(), u("div", Ca, [
      N.value ? (n(), u("p", Va, [
        O(r(N.value) + " ", 1),
        t("button", {
          class: "ac-link kx-focus-outline",
          type: "button",
          onClick: d[2] || (d[2] = //@ts-ignore
          (...o) => i(m) && i(m)(...o))
        }, "Retry")
      ])) : p("", !0),
      F.value.length ? J.value.length ? p("", !0) : (n(), u("div", Sa, [...d[12] || (d[12] = [
        t("div", { class: "kx-empty-title" }, "No matches", -1),
        t("div", { class: "kx-empty-sub" }, "Try another task, agent or account.", -1)
      ])])) : (n(), u("div", Fa, [
        t("div", Ta, [
          L(i(q), { icon: "tabler:terminal-2" })
        ]),
        d[11] || (d[11] = t("div", { class: "kx-empty-title" }, "No tasks yet", -1)),
        t("div", Aa, r(D.value ? "Give a coding agent a task and follow its progress here." : "Add an account to give your coding agent a place to start."), 1),
        L(i(be), {
          label: D.value ? "New task" : "Add account",
          onClick: d[3] || (d[3] = (o) => D.value ? w.value = !0 : E("goto"))
        }, {
          icon: ge(() => [
            L(i(q), { icon: "tabler:plus" })
          ]),
          _: 1
        }, 8, ["label"])
      ])),
      J.value.length ? (n(), u("ul", Ra, [
        (n(!0), u(Y, null, te(J.value, (o) => (n(), u("li", {
          key: o.id,
          class: "ac-run"
        }, [
          t("button", {
            type: "button",
            class: "ac-run-main kx-focus-halo",
            onClick: (a) => E("open", o.id)
          }, [
            t("span", Ea, [
              t("span", Na, [
                t("span", Ia, r(o.prompt_summary.split(`
`)[0]), 1),
                t("span", {
                  class: ee(["kx-tag-sm ac-tone", o.status])
                }, r(o.status), 3),
                o.workflow ? (n(), u("span", Ua, "Workflow")) : p("", !0)
              ]),
              t("span", Pa, [
                t("span", null, [
                  L(i(q), {
                    icon: i(fe)(o.agent, i(x).agents)
                  }, null, 8, ["icon"]),
                  O(r(j(o.agent)), 1)
                ]),
                t("span", null, r(K(o.account_id)), 1),
                t("span", null, r(se(o.image_id)), 1),
                t("span", {
                  title: i(de)(o.started_at || o.created_at)
                }, r(i(xe)(o.started_at || o.created_at, i(R))), 9, Ba),
                o.started_at ? (n(), u("span", Oa, r(i(Ee)(o, i(R))) + " " + r(o.status === "running" ? "elapsed" : "duration"), 1)) : p("", !0)
              ])
            ]),
            L(i(q), {
              icon: "tabler:chevron-right",
              class: "ac-run-chevron ac-muted"
            })
          ], 8, La)
        ]))), 128))
      ])) : p("", !0),
      C.value ? (n(), u("div", qa, [
        L(i(be), {
          label: "Load more",
          loading: W.value,
          disabled: U.value,
          onClick: Q
        }, null, 8, ["loading", "disabled"])
      ])) : p("", !0),
      w.value ? (n(), ae(Re, {
        key: 5,
        title: "New task",
        busy: b.value,
        wide: "",
        onClose: d[8] || (d[8] = (o) => w.value = !1)
      }, {
        default: ge(() => [
          L(Pt, {
            onBusy: d[4] || (d[4] = (o) => b.value = o),
            accounts: B.value,
            images: S.value,
            workspaces: M.value,
            onStarted: Z,
            onCancel: d[5] || (d[5] = (o) => w.value = !1),
            onAgentChanged: d[6] || (d[6] = (o) => E("agentChanged", o)),
            onGoto: d[7] || (d[7] = (o, a) => E("goto", a))
          }, null, 8, ["accounts", "images", "workspaces"])
        ]),
        _: 1
      }, 8, ["busy"])) : p("", !0)
    ])) : (n(), u("div", xa, [
      N.value ? (n(), u(Y, { key: 0 }, [
        O(r(N.value) + " ", 1),
        t("button", {
          class: "ac-link kx-focus-outline",
          type: "button",
          onClick: d[1] || (d[1] = //@ts-ignore
          (...o) => i(m) && i(m)(...o))
        }, "Retry")
      ], 64)) : (n(), u(Y, { key: 1 }, [
        L(i(q), {
          icon: "tabler:loader-2",
          class: "spin"
        }),
        d[10] || (d[10] = O(" Loading tasks…", -1))
      ], 64))
    ]));
  }
});
var Ma = {
  name: "BaseEditableHolder",
  extends: Me,
  emits: ["update:modelValue", "value-change"],
  props: {
    modelValue: {
      type: null,
      default: void 0
    },
    defaultValue: {
      type: null,
      default: void 0
    },
    name: {
      type: String,
      default: void 0
    },
    invalid: {
      type: Boolean,
      default: void 0
    },
    disabled: {
      type: Boolean,
      default: !1
    },
    formControl: {
      type: Object,
      default: void 0
    }
  },
  inject: {
    $parentInstance: {
      default: void 0
    },
    $pcForm: {
      default: void 0
    },
    $pcFormField: {
      default: void 0
    }
  },
  data: function() {
    return {
      d_value: this.defaultValue !== void 0 ? this.defaultValue : this.modelValue
    };
  },
  watch: {
    modelValue: {
      deep: !0,
      handler: function(s) {
        this.d_value = s;
      }
    },
    defaultValue: function(s) {
      this.d_value = s;
    },
    $formName: {
      immediate: !0,
      handler: function(s) {
        var c, e;
        this.formField = ((c = this.$pcForm) === null || c === void 0 || (e = c.register) === null || e === void 0 ? void 0 : e.call(c, s, this.$formControl)) || {};
      }
    },
    $formControl: {
      immediate: !0,
      handler: function(s) {
        var c, e;
        this.formField = ((c = this.$pcForm) === null || c === void 0 || (e = c.register) === null || e === void 0 ? void 0 : e.call(c, this.$formName, s)) || {};
      }
    },
    $formDefaultValue: {
      immediate: !0,
      handler: function(s) {
        this.d_value !== s && (this.d_value = s);
      }
    },
    $formValue: {
      immediate: !1,
      handler: function(s) {
        var c;
        (c = this.$pcForm) !== null && c !== void 0 && c.getFieldState(this.$formName) && s !== this.d_value && (this.d_value = s);
      }
    }
  },
  formField: {},
  methods: {
    writeValue: function(s, c) {
      var e, _;
      this.controlled && (this.d_value = s, this.$emit("update:modelValue", s)), this.$emit("value-change", s), (e = (_ = this.formField).onChange) === null || e === void 0 || e.call(_, {
        originalEvent: c,
        value: s
      });
    },
    // @todo move to @primeuix/utils
    findNonEmpty: function() {
      for (var s = arguments.length, c = new Array(s), e = 0; e < s; e++)
        c[e] = arguments[e];
      return c.find(Te);
    }
  },
  computed: {
    $filled: function() {
      return Te(this.d_value);
    },
    $invalid: function() {
      var s, c;
      return !this.$formNovalidate && this.findNonEmpty(this.invalid, (s = this.$pcFormField) === null || s === void 0 || (s = s.$field) === null || s === void 0 ? void 0 : s.invalid, (c = this.$pcForm) === null || c === void 0 || (c = c.getFieldState(this.$formName)) === null || c === void 0 ? void 0 : c.invalid);
    },
    $formName: function() {
      var s;
      return this.$formNovalidate ? void 0 : this.name || ((s = this.$formControl) === null || s === void 0 ? void 0 : s.name);
    },
    $formControl: function() {
      var s;
      return this.formControl || ((s = this.$pcFormField) === null || s === void 0 ? void 0 : s.formControl);
    },
    $formNovalidate: function() {
      var s;
      return (s = this.$formControl) === null || s === void 0 ? void 0 : s.novalidate;
    },
    $formDefaultValue: function() {
      var s, c;
      return this.findNonEmpty(this.d_value, (s = this.$pcFormField) === null || s === void 0 ? void 0 : s.initialValue, (c = this.$pcForm) === null || c === void 0 || (c = c.initialValues) === null || c === void 0 ? void 0 : c[this.$formName]);
    },
    $formValue: function() {
      var s, c;
      return this.findNonEmpty((s = this.$pcFormField) === null || s === void 0 || (s = s.$field) === null || s === void 0 ? void 0 : s.value, (c = this.$pcForm) === null || c === void 0 || (c = c.getFieldState(this.$formName)) === null || c === void 0 ? void 0 : c.value);
    },
    controlled: function() {
      return this.$inProps.hasOwnProperty("modelValue") || !this.$inProps.hasOwnProperty("modelValue") && !this.$inProps.hasOwnProperty("defaultValue");
    },
    // @deprecated use $filled instead
    filled: function() {
      return this.$filled;
    }
  }
}, ja = `
    .p-toggleswitch {
        display: inline-block;
        width: dt('toggleswitch.width');
        height: dt('toggleswitch.height');
    }

    .p-toggleswitch-input {
        cursor: pointer;
        appearance: none;
        position: absolute;
        top: 0;
        inset-inline-start: 0;
        width: 100%;
        height: 100%;
        padding: 0;
        margin: 0;
        opacity: 0;
        z-index: 1;
        outline: 0 none;
        border-radius: dt('toggleswitch.border.radius');
    }

    .p-toggleswitch-slider {
        cursor: pointer;
        width: 100%;
        height: 100%;
        border-width: dt('toggleswitch.border.width');
        border-style: solid;
        border-color: dt('toggleswitch.border.color');
        background: dt('toggleswitch.background');
        transition:
            background dt('toggleswitch.transition.duration'),
            color dt('toggleswitch.transition.duration'),
            border-color dt('toggleswitch.transition.duration'),
            outline-color dt('toggleswitch.transition.duration'),
            box-shadow dt('toggleswitch.transition.duration');
        border-radius: dt('toggleswitch.border.radius');
        outline-color: transparent;
        box-shadow: dt('toggleswitch.shadow');
    }

    .p-toggleswitch-handle {
        position: absolute;
        top: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        background: dt('toggleswitch.handle.background');
        color: dt('toggleswitch.handle.color');
        width: dt('toggleswitch.handle.size');
        height: dt('toggleswitch.handle.size');
        inset-inline-start: dt('toggleswitch.gap');
        margin-block-start: calc(-1 * calc(dt('toggleswitch.handle.size') / 2));
        border-radius: dt('toggleswitch.handle.border.radius');
        transition:
            background dt('toggleswitch.transition.duration'),
            color dt('toggleswitch.transition.duration'),
            inset-inline-start dt('toggleswitch.slide.duration'),
            box-shadow dt('toggleswitch.slide.duration');
    }

    .p-toggleswitch.p-toggleswitch-checked .p-toggleswitch-slider {
        background: dt('toggleswitch.checked.background');
        border-color: dt('toggleswitch.checked.border.color');
    }

    .p-toggleswitch.p-toggleswitch-checked .p-toggleswitch-handle {
        background: dt('toggleswitch.handle.checked.background');
        color: dt('toggleswitch.handle.checked.color');
        inset-inline-start: calc(dt('toggleswitch.width') - calc(dt('toggleswitch.handle.size') + dt('toggleswitch.gap')));
    }

    .p-toggleswitch:not(.p-disabled):has(.p-toggleswitch-input:hover) .p-toggleswitch-slider {
        background: dt('toggleswitch.hover.background');
        border-color: dt('toggleswitch.hover.border.color');
    }

    .p-toggleswitch:not(.p-disabled):has(.p-toggleswitch-input:hover) .p-toggleswitch-handle {
        background: dt('toggleswitch.handle.hover.background');
        color: dt('toggleswitch.handle.hover.color');
    }

    .p-toggleswitch:not(.p-disabled):has(.p-toggleswitch-input:hover).p-toggleswitch-checked .p-toggleswitch-slider {
        background: dt('toggleswitch.checked.hover.background');
        border-color: dt('toggleswitch.checked.hover.border.color');
    }

    .p-toggleswitch:not(.p-disabled):has(.p-toggleswitch-input:hover).p-toggleswitch-checked .p-toggleswitch-handle {
        background: dt('toggleswitch.handle.checked.hover.background');
        color: dt('toggleswitch.handle.checked.hover.color');
    }

    .p-toggleswitch:not(.p-disabled):has(.p-toggleswitch-input:focus-visible) .p-toggleswitch-slider {
        box-shadow: dt('toggleswitch.focus.ring.shadow');
        outline: dt('toggleswitch.focus.ring.width') dt('toggleswitch.focus.ring.style') dt('toggleswitch.focus.ring.color');
        outline-offset: dt('toggleswitch.focus.ring.offset');
    }

    .p-toggleswitch.p-invalid > .p-toggleswitch-slider {
        border-color: dt('toggleswitch.invalid.border.color');
    }

    .p-toggleswitch.p-disabled {
        opacity: 1;
    }

    .p-toggleswitch.p-disabled .p-toggleswitch-slider {
        background: dt('toggleswitch.disabled.background');
    }

    .p-toggleswitch.p-disabled .p-toggleswitch-handle {
        background: dt('toggleswitch.handle.disabled.background');
    }
`, Wa = {
  root: {
    position: "relative"
  }
}, za = {
  root: function(s) {
    var c = s.instance, e = s.props;
    return ["p-toggleswitch p-component", {
      "p-toggleswitch-checked": c.checked,
      "p-disabled": e.disabled,
      "p-invalid": c.$invalid
    }];
  },
  input: "p-toggleswitch-input",
  slider: "p-toggleswitch-slider",
  handle: "p-toggleswitch-handle"
}, Ha = je.extend({
  name: "toggleswitch",
  style: ja,
  classes: za,
  inlineStyles: Wa
}), Ga = {
  name: "BaseToggleSwitch",
  extends: Ma,
  props: {
    trueValue: {
      type: null,
      default: !0
    },
    falseValue: {
      type: null,
      default: !1
    },
    readonly: {
      type: Boolean,
      default: !1
    },
    tabindex: {
      type: Number,
      default: null
    },
    inputId: {
      type: String,
      default: null
    },
    inputClass: {
      type: [String, Object],
      default: null
    },
    inputStyle: {
      type: Object,
      default: null
    },
    ariaLabelledby: {
      type: String,
      default: null
    },
    ariaLabel: {
      type: String,
      default: null
    }
  },
  style: Ha,
  provide: function() {
    return {
      $pcToggleSwitch: this,
      $parentInstance: this
    };
  }
}, Be = {
  name: "ToggleSwitch",
  extends: Ga,
  inheritAttrs: !1,
  emits: ["change", "focus", "blur"],
  methods: {
    getPTOptions: function(s) {
      var c = s === "root" ? this.ptmi : this.ptm;
      return c(s, {
        context: {
          checked: this.checked,
          disabled: this.disabled
        }
      });
    },
    onChange: function(s) {
      if (!this.disabled && !this.readonly) {
        var c = this.checked ? this.falseValue : this.trueValue;
        this.writeValue(c, s), this.$emit("change", s);
      }
    },
    onFocus: function(s) {
      this.$emit("focus", s);
    },
    onBlur: function(s) {
      var c, e;
      this.$emit("blur", s), (c = (e = this.formField).onBlur) === null || c === void 0 || c.call(e, s);
    }
  },
  computed: {
    checked: function() {
      return this.d_value === this.trueValue;
    },
    dataP: function() {
      return We({
        checked: this.checked,
        disabled: this.disabled,
        invalid: this.$invalid
      });
    }
  }
}, Ja = ["data-p-checked", "data-p-disabled", "data-p"], Ka = ["id", "checked", "tabindex", "disabled", "readonly", "aria-checked", "aria-labelledby", "aria-label", "aria-invalid"], Qa = ["data-p"], Xa = ["data-p"];
function Ya(l, s, c, e, _, h) {
  return n(), u("div", ve({
    class: l.cx("root"),
    style: l.sx("root")
  }, h.getPTOptions("root"), {
    "data-p-checked": h.checked,
    "data-p-disabled": l.disabled,
    "data-p": h.dataP
  }), [t("input", ve({
    id: l.inputId,
    type: "checkbox",
    role: "switch",
    class: [l.cx("input"), l.inputClass],
    style: l.inputStyle,
    checked: h.checked,
    tabindex: l.tabindex,
    disabled: l.disabled,
    readonly: l.readonly,
    "aria-checked": h.checked,
    "aria-labelledby": l.ariaLabelledby,
    "aria-label": l.ariaLabel,
    "aria-invalid": l.invalid || void 0,
    onFocus: s[0] || (s[0] = function() {
      return h.onFocus && h.onFocus.apply(h, arguments);
    }),
    onBlur: s[1] || (s[1] = function() {
      return h.onBlur && h.onBlur.apply(h, arguments);
    }),
    onChange: s[2] || (s[2] = function() {
      return h.onChange && h.onChange.apply(h, arguments);
    })
  }, h.getPTOptions("input")), null, 16, Ka), t("div", ve({
    class: l.cx("slider")
  }, h.getPTOptions("slider"), {
    "data-p": h.dataP
  }), [t("div", ve({
    class: l.cx("handle")
  }, h.getPTOptions("handle"), {
    "data-p": h.dataP
  }), [Ze(l.$slots, "handle", {
    checked: h.checked
  })], 16, Xa)], 16, Qa)], 16, Ja);
}
Be.render = Ya;
const Za = { class: "ac-account-main" }, en = { class: "ac-row-title" }, tn = ["onKeydown"], an = {
  key: 1,
  class: "ac-row-name"
}, nn = {
  key: 2,
  class: "kx-tag-sm ac-tone"
}, ln = { class: "ac-muted" }, on = ["title"], sn = { key: 1 }, un = {
  key: 0,
  class: "ac-muted"
}, cn = {
  key: 1,
  class: "ac-muted ac-strong"
}, rn = {
  key: 2,
  class: "ac-muted"
}, dn = {
  key: 3,
  class: "ac-muted ac-mono"
}, vn = {
  key: 4,
  class: "ac-muted"
}, pn = {
  key: 5,
  class: "kx-err ac-small"
}, gn = { class: "ac-row-actions" }, hn = /* @__PURE__ */ ie({
  __name: "account-row",
  props: {
    account: {},
    kindLabel: {},
    ownerLabel: {}
  },
  emits: ["toggle", "rename", "remove", "edit"],
  setup(l, { emit: s }) {
    const c = l, e = s, _ = { ready: "ready", cooling: "cooling down", disabled: "disabled", unavailable: "unavailable" }, h = me(), E = G(() => $e(c.account, h.value)), x = G(() => c.account.mine ? "" : `Shared with you by ${c.ownerLabel}`), w = v(!1), b = v(""), B = v(null);
    function S() {
      b.value = c.account.label, w.value = !0, we(() => B.value?.select());
    }
    function M() {
      if (!w.value) return;
      w.value = !1;
      const F = b.value.trim();
      F && F !== c.account.label && e("rename", F);
    }
    return (F, C) => (n(), u("li", {
      class: ee(["ac-row ac-account ac-hover-actions", { off: !l.account.enabled || !l.account.usable }])
    }, [
      t("div", Za, [
        t("div", en, [
          t("span", {
            class: ee(["kx-tag-sm ac-tone", E.value])
          }, r(_[E.value]), 3),
          w.value ? ne((n(), u("input", {
            key: 0,
            ref_key: "input",
            ref: B,
            "onUpdate:modelValue": C[0] || (C[0] = (V) => b.value = V),
            class: "ac-rename kx-focus-halo",
            "aria-label": "Account label",
            onKeydown: [
              Ae(Se(M, ["prevent"]), ["enter"]),
              C[1] || (C[1] = Ae(Se((V) => w.value = !1, ["prevent"]), ["escape"]))
            ],
            onBlur: M
          }, null, 40, tn)), [
            [re, b.value]
          ]) : (n(), u("span", an, r(l.account.label), 1)),
          l.account.subscription ? (n(), u("span", nn, "personal")) : p("", !0)
        ]),
        t("div", ln, [
          O(r(l.kindLabel) + " · " + r(l.account.runs_day) + " " + r(l.account.runs_day === 1 ? "task" : "tasks") + " in the last 24 hours · " + r(l.account.failures_day) + " " + r(l.account.failures_day === 1 ? "failure" : "failures") + " · ", 1),
          l.account.last_used_at ? (n(), u("span", {
            key: 0,
            title: i(de)(l.account.last_used_at)
          }, "last used " + r(i(xe)(l.account.last_used_at, i(h))), 9, on)) : (n(), u("span", sn, "never used"))
        ]),
        x.value ? (n(), u("div", un, r(x.value), 1)) : p("", !0),
        l.account.usable ? l.account.subscription ? (n(), u("div", rn, "Subscription login: personal use only")) : p("", !0) : (n(), u("div", cn, [
          L(i(q), { icon: "tabler:lock" }),
          O(" " + r(l.account.unavailable_reason || "Account unavailable for tasks"), 1)
        ])),
        l.account.endpoint ? (n(), u("div", dn, r(l.account.endpoint.protocol) + " · " + r(l.account.endpoint.base_url) + r(l.account.endpoint.model ? " · " + l.account.endpoint.model : ""), 1)) : p("", !0),
        E.value === "cooling" ? (n(), u("div", vn, "Available at " + r(i(de)(l.account.cooldown_until)), 1)) : p("", !0),
        l.account.last_error ? (n(), u("div", pn, r(l.account.last_error), 1)) : p("", !0)
      ]),
      t("div", gn, [
        l.account.writable ? (n(), ae(i(Be), {
          key: 0,
          "model-value": l.account.enabled,
          "aria-label": l.account.enabled ? "Disable account" : "Enable account",
          onChange: C[2] || (C[2] = (V) => e("toggle"))
        }, null, 8, ["model-value", "aria-label"])) : p("", !0),
        l.account.writable ? (n(), u("button", {
          key: 1,
          type: "button",
          class: "ac-icon-btn kx-focus-outline",
          title: "Rename",
          "aria-label": "Rename account",
          onClick: S
        }, [
          L(i(q), { icon: "tabler:pencil" })
        ])) : p("", !0),
        l.account.writable ? (n(), u("button", {
          key: 2,
          type: "button",
          class: "ac-icon-btn kx-focus-outline",
          title: "Edit credential and endpoint",
          "aria-label": "Edit account",
          onClick: C[3] || (C[3] = (V) => e("edit"))
        }, [
          L(i(q), { icon: "tabler:key" })
        ])) : p("", !0),
        l.account.deletable ? (n(), u("button", {
          key: 3,
          type: "button",
          class: "ac-icon-btn kx-focus-outline",
          title: "Delete",
          "aria-label": "Delete account",
          onClick: C[4] || (C[4] = (V) => e("remove"))
        }, [
          L(i(q), { icon: "tabler:trash" })
        ])) : p("", !0)
      ])
    ], 2));
  }
}), fn = { class: "ac-stack" }, mn = {
  key: 0,
  class: "kx-err inline"
}, kn = {
  key: 1,
  class: "kx-err inline",
  role: "status"
}, bn = {
  key: 2,
  class: "kx-loading"
}, yn = {
  key: 3,
  class: "kx-empty"
}, wn = { class: "kx-empty-ico" }, $n = {
  key: 4,
  class: "kx-empty"
}, _n = { class: "ac-card-head" }, xn = { class: "ac-card-title" }, Cn = { class: "ac-muted" }, Vn = { class: "ac-account-grid" }, Fn = { class: "ac-form" }, Tn = {
  key: 1,
  class: "ac-hint"
}, An = ["^config"], Sn = {
  key: 3,
  class: "kx-err",
  role: "alert"
}, Rn = /* @__PURE__ */ ie({
  __name: "accounts",
  props: {
    query: {},
    selectedAgent: {}
  },
  emits: ["count"],
  setup(l, { expose: s, emit: c }) {
    const e = Ne(), _ = v([]), h = l, E = c, x = v(!1), w = v(null);
    function b() {
      w.value = null, P.value = "", x.value = !0;
    }
    function B(a) {
      w.value = a, k.value = a.agent, P.value = "", x.value = !0;
    }
    s({ open: b });
    const S = he(), M = me(), F = v([]), C = v({}), V = v(""), N = v(""), R = v(!1), U = v(!1), P = v(""), I = v(0), k = v(h.selectedAgent || S.value.agents[0]?.id || "");
    ue(() => h.selectedAgent, (a) => {
      a && (k.value = a);
    });
    const m = G(() => S.value.agents.find((a) => a.id === k.value)), H = G(() => JSON.stringify({ driver: m.value, busy: U.value, error: P.value, saved: I.value, account: w.value ? { id: w.value.id, label: w.value.label, credential_kind: w.value.credential_kind, endpoint: w.value.endpoint } : void 0, limits: S.value.account_limits })), W = G(() => [...S.value.agents, ...[...new Set(F.value.map((a) => a.agent))].filter((a) => !S.value.agents.some((f) => f.id === a)).map((a) => ({ id: a, title: `Unavailable agent: ${a}`, icon: "tabler:terminal-2" }))].map((a) => ({ agent: a, accounts: F.value.filter((f) => f.agent === a.id && [f.label, a.title, f.credential_kind].join(" ").toLowerCase().includes(h.query.toLowerCase())) })).filter((a) => a.accounts.length));
    function Q(a) {
      return S.value.agents.find((f) => f.id === a.agent)?.credentials.find((f) => f.id === a.credential_kind)?.label ?? a.credential_kind;
    }
    async function Z(a) {
      const f = [...new Set(a.filter((T) => !T.mine).map((T) => T.owner))].filter((T) => !(T in C.value)), A = await at(f);
      e() && (C.value = { ...C.value, ...A });
    }
    const D = Ce(async () => {
      try {
        const a = await Ue(X.accounts, (f) => f.map((A) => A.id), _, e);
        if (!e() || (F.value = a, await Z(a), !e())) return;
        R.value = !0, V.value = "";
      } catch (a) {
        e() && (V.value = oe(a, "Could not load accounts."));
      }
    }, e);
    Ie(() => _.value, () => {
      D();
    });
    const J = _e.runs(() => {
      D();
    });
    pe(J), ye(D);
    async function j(a, f) {
      V.value = "", N.value = "";
      try {
        if (await a(), !e()) return;
        await D();
      } catch (A) {
        e() && (V.value = oe(A, f));
      }
    }
    async function se(a) {
      if (!(a instanceof CustomEvent)) return;
      const f = rt.safeParse(a.detail);
      if (U.value) return;
      if (!f.success || f.data.agent !== k.value || w.value && !w.value.writable) {
        P.value = "Invalid account submission.";
        return;
      }
      const A = f.data;
      P.value = "", U.value = !0;
      try {
        if (w.value) {
          const T = await X.updateAccount(w.value.id, {
            label: A.label,
            endpoint: A.endpoint ?? { base_url: "" },
            ...A.secret ? { secret: A.secret } : {}
          });
          if (!e()) return;
          N.value = T.health_error ? `Account saved, but its health could not be refreshed: ${T.health_error.message}` : "";
        } else await X.createAccount(A);
        if (!e()) return;
        I.value++, x.value = !1, await D();
      } catch (T) {
        e() && (P.value = oe(T, "Could not save the account."));
      } finally {
        e() && (U.value = !1);
      }
    }
    ue(F, (a) => E("count", a.length));
    const K = (a, f, A) => j(async () => {
      const T = await X.updateAccount(a.id, f);
      e() && T.health_error && (N.value = `Account saved, but its health could not be refreshed: ${T.health_error.message}`);
    }, A), y = (a) => K(a, { enabled: !a.enabled }, "Could not update the account."), d = (a, f) => K(a, { label: f }, "Could not rename the account.");
    async function o(a) {
      const f = await ut.confirm({
        header: "Delete account",
        message: `Delete account "${a.label}"? Tasks keep their history.`,
        icon: "tabler:trash",
        acceptLabel: "Delete",
        rejectLabel: "Cancel",
        acceptClass: "p-button-danger"
      });
      e() && f && await j(() => X.deleteAccount(a.id), "Could not delete the account.");
    }
    return Le(() => {
      it("chestor-autocode-driver-account", { timeoutMs: 8e3 }).catch(() => {
        e() && (V.value = "The driver account card could not load.");
      });
    }), (a, f) => (n(), u("div", fn, [
      V.value ? (n(), u("p", mn, [
        O(r(V.value) + " ", 1),
        t("button", {
          type: "button",
          class: "ac-link kx-focus-outline",
          onClick: f[0] || (f[0] = //@ts-ignore
          (...A) => i(D) && i(D)(...A))
        }, "Retry")
      ])) : p("", !0),
      N.value ? (n(), u("p", kn, r(N.value), 1)) : p("", !0),
      !R.value && !V.value ? (n(), u("div", bn, "Loading accounts…")) : p("", !0),
      R.value && !F.value.length ? (n(), u("div", yn, [
        t("div", wn, [
          L(i(q), { icon: "tabler:key" })
        ]),
        f[3] || (f[3] = t("div", { class: "kx-empty-title" }, "No accounts yet", -1)),
        f[4] || (f[4] = t("div", { class: "kx-empty-sub" }, "Add an API key, your own endpoint or a personal subscription login.", -1)),
        L(i(be), {
          label: "Add account",
          onClick: b
        }, {
          icon: ge(() => [
            L(i(q), { icon: "tabler:plus" })
          ]),
          _: 1
        })
      ])) : R.value && !W.value.length ? (n(), u("div", $n, [...f[5] || (f[5] = [
        t("div", { class: "kx-empty-title" }, "No matches", -1),
        t("div", { class: "kx-empty-sub" }, "Try another account or agent.", -1)
      ])])) : p("", !0),
      (n(!0), u(Y, null, te(W.value, (A) => (n(), u("section", {
        key: A.agent.id,
        class: "ac-stack"
      }, [
        t("div", _n, [
          t("h2", xn, [
            L(i(q), {
              icon: i(fe)(A.agent.id, i(S).agents)
            }, null, 8, ["icon"]),
            O(r(A.agent.title), 1)
          ]),
          t("span", Cn, r(A.accounts.filter((T) => T.usable && i($e)(T, i(M)) === "ready").length) + " of " + r(A.accounts.length) + " ready", 1)
        ]),
        t("ul", Vn, [
          (n(!0), u(Y, null, te(A.accounts, (T) => (n(), ae(hn, {
            key: T.id,
            account: T,
            "kind-label": Q(T),
            "owner-label": C.value[T.owner] || T.owner,
            onEdit: (le) => B(T),
            onToggle: (le) => y(T),
            onRename: (le) => d(T, le),
            onRemove: (le) => o(T)
          }, null, 8, ["account", "kind-label", "owner-label", "onEdit", "onToggle", "onRename", "onRemove"]))), 128))
        ])
      ]))), 128)),
      x.value ? (n(), ae(Re, {
        key: 5,
        title: w.value ? "Edit account" : "Add account",
        busy: U.value,
        onClose: f[2] || (f[2] = (A) => x.value = !1)
      }, {
        default: ge(() => [
          t("div", Fn, [
            w.value ? p("", !0) : (n(), ae(Pe, {
              key: 0,
              disabled: U.value,
              modelValue: k.value,
              "onUpdate:modelValue": f[1] || (f[1] = (A) => k.value = A),
              agents: i(S).agents
            }, null, 8, ["disabled", "modelValue", "agents"])),
            w.value ? p("", !0) : (n(), u("p", Tn, "Tasks balance across your ready accounts automatically.")),
            m.value ? (n(), u("chestor-autocode-driver-account", {
              key: 2,
              "^config": H.value,
              onSubmit: se
            }, null, 40, An)) : (n(), u("p", Sn, "This account’s agent is unavailable."))
          ])
        ]),
        _: 1
      }, 8, ["title", "busy"])) : p("", !0)
    ]));
  }
}), Ln = { class: "ac" }, En = {
  key: 1,
  class: "ac-bar"
}, Nn = {
  class: "ac-tabs",
  "aria-label": "Autocode views"
}, In = ["aria-pressed", "onClick"], Un = {
  key: 2,
  class: "kx-err"
}, Pn = {
  key: 3,
  class: "kx-loading"
}, Bn = {
  key: 0,
  class: "kx-empty"
}, On = /* @__PURE__ */ ie({
  __name: "autocode",
  setup(l) {
    const s = Ke(), c = Qe(), e = v(null);
    ue(() => s.value?.route, () => {
      e.value = null;
    });
    const _ = G(() => e.value ?? s.value?.route ?? ""), h = G(() => {
      const I = /^\/?runs\/([^/]+)\/?$/.exec(_.value);
      try {
        return I ? decodeURIComponent(I[1]) : "";
      } catch {
        return "";
      }
    }), E = G(() => !!_.value && _.value !== "/" && !h.value);
    function x(I) {
      b.value = "tasks", e.value = I, c("navigate", { path: I });
    }
    const w = [
      { id: "tasks", label: "Tasks", icon: "tabler:player-play" },
      { id: "accounts", label: "Accounts", icon: "tabler:key" }
    ], b = v("tasks"), { catalog: B, error: S, load: M } = ze(), F = v(""), C = v(0), V = v(null), N = v(null), R = v("");
    async function U(I) {
      I && (R.value = I), b.value = "accounts", F.value = "", await we(), N.value?.open();
    }
    function P() {
      b.value === "tasks" ? V.value?.open() : N.value?.open();
    }
    return (I, k) => (n(), u("div", Ln, [
      !h.value && !E.value ? (n(), ae(He, {
        key: 0,
        title: "Autocode",
        subtitle: "Run coding agents with your accounts and workspaces.",
        count: `${C.value} ${b.value === "tasks" ? "task" : "account"}${C.value === 1 ? "" : "s"}`,
        action: b.value === "tasks" ? "New task" : "Add account",
        query: F.value,
        "onUpdate:query": k[0] || (k[0] = (m) => F.value = m),
        placeholder: b.value === "tasks" ? "Search tasks…" : "Search accounts…",
        onCreate: P
      }, null, 8, ["count", "action", "query", "placeholder"])) : p("", !0),
      !h.value && !E.value ? (n(), u("div", En, [
        t("nav", Nn, [
          (n(), u(Y, null, te(w, (m) => t("button", {
            key: m.id,
            type: "button",
            class: ee(["ac-tab kx-focus-outline", { active: b.value === m.id }]),
            "aria-pressed": b.value === m.id,
            onClick: (H) => {
              b.value !== m.id && (b.value = m.id, F.value = "", C.value = 0);
            }
          }, [
            L(i(q), {
              icon: m.icon
            }, null, 8, ["icon"]),
            O(" " + r(m.label), 1)
          ], 10, In)), 64))
        ])
      ])) : p("", !0),
      i(S) && !i(B) ? (n(), u("p", Un, [
        O(r(i(S)) + " ", 1),
        t("button", {
          class: "ac-link kx-focus-outline",
          type: "button",
          onClick: k[1] || (k[1] = //@ts-ignore
          (...m) => i(M) && i(M)(...m))
        }, "Retry")
      ])) : i(B) ? (n(), u("main", {
        key: 4,
        class: ee(["ac-body", { "ac-detail-page": h.value || E.value }])
      }, [
        E.value ? (n(), u("div", Bn, [
          k[9] || (k[9] = t("h1", null, "Run not found", -1)),
          t("button", {
            type: "button",
            class: "ac-btn kx-focus-halo",
            onClick: k[2] || (k[2] = (m) => x(""))
          }, "Back to tasks")
        ])) : h.value || b.value === "tasks" ? (n(), ae(Da, {
          key: 1,
          ref_key: "tasks",
          ref: V,
          query: F.value,
          "run-id": h.value,
          onOpen: k[3] || (k[3] = (m) => x("runs/" + encodeURIComponent(m))),
          onClose: k[4] || (k[4] = (m) => x("")),
          onCount: k[5] || (k[5] = (m) => C.value = m),
          onAgentChanged: k[6] || (k[6] = (m) => R.value = m),
          onGoto: U
        }, null, 8, ["query", "run-id"])) : (n(), ae(Rn, {
          key: 2,
          ref_key: "accounts",
          ref: N,
          query: F.value,
          "selected-agent": R.value,
          onCount: k[7] || (k[7] = (m) => C.value = m)
        }, null, 8, ["query", "selected-agent"]))
      ], 2)) : (n(), u("div", Pn, [
        L(i(q), {
          icon: "tabler:loader-2",
          class: "spin"
        }),
        k[8] || (k[8] = O(" Loading…", -1))
      ]))
    ]));
  }
}), qn = { props: { type: "object", properties: { route: { type: "string", default: "", description: "Path relative to /autocode; runs/<run_id> opens a run." } } } }, Dn = {
  wippy: qn
};
class Mn extends Xe {
  static get wippyConfig() {
    return {
      propsSchema: Dn.wippy.props,
      hostCssKeys: ["themeConfigUrl", "primeVueCssUrl", "iframeCssUrl"],
      inlineCss: Ge
    };
  }
  static get vueConfig() {
    return { rootComponent: On, plugins: [Je] };
  }
}
ct(import.meta.url, Mn);
