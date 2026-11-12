import { u as me, c as Ue, _ as Ae, d as ze, e as Ie, B as Je, f as He, a as Ge, b as Ke, s as Qe, P as Xe } from "./styles-BK6emoe6.js";
import { u as $e, a as Ye, b as Ze, W as et } from "./dto-B0C2sWl2.js";
import { defineComponent as re, openBlock as t, createElementBlock as l, Fragment as z, renderList as Y, normalizeClass as ue, createVNode as q, unref as o, createTextVNode as D, toDisplayString as u, ref as g, computed as K, onMounted as Te, watch as pe, createElementVNode as e, withDirectives as G, vModelText as ie, vModelSelect as ne, createCommentVNode as f, isRef as ge, vModelCheckbox as tt, createBlock as ae, onUnmounted as ye, nextTick as Fe, withCtx as fe, mergeProps as be, renderSlot as at, withKeys as Ne, withModifiers as Se } from "vue";
import { Icon as M } from "@iconify/vue";
import { b as we, a as Q, e as oe, d as Le, f as he, g as _e, l as Re, h as Pe, i as Oe, t as lt, s as xe, A as nt, c as Ee, u as qe, r as Be, p as ot } from "./presentation-BuuH51nX.js";
import { d as st, e as it, u as ut, _ as De } from "./driver-options.vue_vue_type_script_setup_true_lang-N3_dbeBI.js";
import { config as dt, loadByTagName as ct, host as We, define as rt } from "@wippy-fe/proxy";
import { a as vt } from "./driver-account-types-DYC85wDl.js";
const pt = {
  key: 0,
  class: "ac-chips",
  role: "group",
  "aria-label": "Agent"
}, gt = ["disabled", "aria-pressed", "onClick"], ft = ["disabled", "value"], ht = ["value"], Me = /* @__PURE__ */ re({
  __name: "agent-picker",
  props: {
    agents: {},
    modelValue: {},
    disabled: { type: Boolean }
  },
  emits: ["update:modelValue"],
  setup(s) {
    return (d, v) => s.agents.length <= 6 ? (t(), l("div", pt, [
      (t(!0), l(z, null, Y(s.agents, (a) => (t(), l("button", {
        key: a.id,
        disabled: s.disabled,
        type: "button",
        class: ue(["ac-chip kx-focus-halo", { active: s.modelValue === a.id }]),
        "aria-pressed": s.modelValue === a.id,
        onClick: (L) => d.$emit("update:modelValue", a.id)
      }, [
        q(o(M), {
          icon: o(we)(a.id, s.agents),
          "aria-hidden": "true"
        }, null, 8, ["icon"]),
        D(u(a.title), 1)
      ], 10, gt))), 128))
    ])) : (t(), l("select", {
      key: 1,
      disabled: s.disabled,
      class: "kx-focus-halo",
      "aria-label": "Agent",
      value: s.modelValue,
      onChange: v[0] || (v[0] = (a) => d.$emit("update:modelValue", a.target.value))
    }, [
      (t(!0), l(z, null, Y(s.agents, (a) => (t(), l("option", {
        key: a.id,
        value: a.id
      }, u(a.title), 9, ht))), 128))
    ], 40, ft));
  }
}), mt = ["disabled"], kt = { class: "ac-field ac-composer" }, bt = { class: "ac-field" }, yt = ["value"], $t = { class: "ac-field" }, wt = {
  key: 0,
  class: "ac-muted"
}, _t = {
  key: 1,
  class: "ac-muted"
}, xt = { class: "ac-picker-row" }, Ct = { class: "ac-field" }, Vt = ["value"], Ut = { value: "" }, St = ["value"], At = { class: "ac-field" }, Tt = ["value"], Ft = ["value"], Lt = { class: "ac-field" }, Rt = ["value"], Pt = ["value"], Et = { class: "ac-advanced" }, It = { class: "ac-form" }, Nt = { class: "ac-field" }, Ot = { class: "ac-field" }, qt = { class: "ac-field" }, Bt = {
  key: 0,
  class: "ac-check"
}, Dt = {
  key: 2,
  class: "kx-err",
  role: "alert"
}, Wt = { class: "ac-dialog-foot" }, Mt = ["disabled"], jt = /* @__PURE__ */ re({
  __name: "task-form",
  props: {
    accounts: {},
    images: {},
    workspaces: {}
  },
  emits: ["started", "goto", "agentChanged", "cancel", "busy"],
  setup(s, { emit: d }) {
    const v = s, a = d, L = me(), C = g(null), I = g([]), V = g(""), x = g({}), A = K(() => I.value.find((r) => r.id === V.value));
    Te(async () => {
      try {
        I.value = await Q.profiles();
      } catch (r) {
        le.value = oe(r, "Could not load profiles.");
      }
    });
    function j() {
      x.value = {};
    }
    function T(r) {
      V.value ? x.value = { ...x.value, ...r } : R.value = { ...R.value, ...r };
    }
    function J() {
      const r = L.value.settings_path;
      r && C.value?.dispatchEvent(new CustomEvent("navigate", { detail: { path: r }, bubbles: !0, composed: !0 }));
    }
    const R = g({ agent: st(L.value, v.accounts), account_id: "", image_id: "", workspace_id: "", repo_url: "" }), y = K(() => it(V.value ? x.value : R.value, A.value)), { now: w, driver: P, agentAccounts: m, ready: B, agentImages: W, invalidOptions: Z, optionValues: N, invalidImage: S, invalidAccount: F, invalidWorkspace: ee, selectAgent: se } = ut(y, {
      catalog: () => L.value,
      accounts: () => v.accounts,
      images: () => v.images,
      workspaces: () => v.workspaces
    }, "live", () => !!V.value), te = K({
      get: () => y.value.agent ?? "",
      set: (r) => {
        if (r === y.value.agent) return;
        const n = se(r);
        T({ agent: r, account_id: n.account_id, image_id: n.image_id, options: n.options, unattended: n.unattended });
      }
    });
    function H(r) {
      return K({ get: () => y.value[r] ?? "", set: (n) => T({ [r]: n }) });
    }
    const k = H("account_id"), i = H("image_id"), c = H("workspace_id"), X = H("repo_url"), U = K({ get: () => y.value.isolation ?? "", set: (r) => {
      T({ isolation: r === "worktree" || r === "shared" ? r : void 0 });
    } }), b = H("repo_ref"), $ = K({ get: () => y.value.run_timeout ?? "", set: (r) => T({ run_timeout: r }) }), p = g(""), _ = K({ get: () => N.value, set: (r) => T({ options: r }) }), O = K({ get: () => y.value.unattended ?? !!P.value?.unattended, set: (r) => T({ unattended: r }) }), E = g(!1), le = g("");
    function Ce(r) {
      return Le(r, w.value) === "cooling" ? `${r.label} (cooling down${r.cooldown_until ? " until " + he(r.cooldown_until) : ""})` : r.label;
    }
    pe(te, (r) => a("agentChanged", r), { immediate: !0 });
    let de;
    pe([V, te, k, i, c, X, b, U, $, p, _, O], () => {
      de = void 0;
    }, { deep: !0, flush: "sync" });
    async function ke() {
      if (!E.value) {
        le.value = "", E.value = !0, a("busy", !0);
        try {
          const r = {
            agent: te.value,
            account_id: k.value,
            image_id: i.value,
            workspace_id: c.value,
            isolation: y.value.isolation,
            repo_url: X.value,
            repo_ref: b.value.trim() || void 0,
            timeout: $.value.trim() || void 0,
            prompt: p.value,
            options: y.value.options ?? {},
            unattended: O.value
          }, { run_timeout: n, ...h } = x.value, ce = V.value ? {
            profile_id: V.value,
            prompt: p.value,
            options: y.value.options ?? {},
            ...h,
            ...n !== void 0 ? { timeout: n } : {}
          } : r, ve = JSON.stringify(ce);
          (!de || de.snapshot !== ve) && (de = { snapshot: ve, key: crypto.randomUUID(), body: { ...ce, options: JSON.parse(JSON.stringify(ce.options)) } });
          const { run_id: Ve } = await Q.startRun({ ...de.body, idempotency_key: de.key });
          de = void 0, p.value = "", a("started", Ve);
        } catch (r) {
          le.value = oe(r, "Could not start the task.");
        } finally {
          E.value = !1, a("busy", !1);
        }
      }
    }
    return (r, n) => (t(), l("fieldset", {
      ref_key: "root",
      ref: C,
      class: "ac-form ac-new",
      disabled: E.value
    }, [
      e("label", kt, [
        n[15] || (n[15] = e("span", null, "Prompt", -1)),
        G(e("textarea", {
          "onUpdate:modelValue": n[0] || (n[0] = (h) => p.value = h),
          autofocus: "",
          rows: "8",
          class: "kx-focus-halo",
          placeholder: "What should the agent do?"
        }, null, 512), [
          [ie, p.value]
        ])
      ]),
      e("label", bt, [
        n[17] || (n[17] = e("span", null, "Profile", -1)),
        G(e("select", {
          "onUpdate:modelValue": n[1] || (n[1] = (h) => V.value = h),
          "aria-label": "Profile",
          class: "kx-focus-halo",
          onChange: j
        }, [
          n[16] || (n[16] = e("option", { value: "" }, "Custom task", -1)),
          (t(!0), l(z, null, Y(I.value, (h) => (t(), l("option", {
            key: h.id,
            value: h.id
          }, u(h.title), 9, yt))), 128))
        ], 544), [
          [ne, V.value]
        ])
      ]),
      e("div", $t, [
        n[18] || (n[18] = e("span", null, "Agent", -1)),
        q(Me, {
          modelValue: te.value,
          "onUpdate:modelValue": n[2] || (n[2] = (h) => te.value = h),
          agents: o(L).agents
        }, null, 8, ["modelValue", "agents"])
      ]),
      te.value && !o(m).length ? (t(), l("p", wt, [
        D(" No " + u(o(P)?.title) + " accounts you can run on. ", 1),
        e("button", {
          class: "ac-link kx-focus-outline",
          type: "button",
          onClick: n[3] || (n[3] = (h) => a("goto", "accounts", te.value))
        }, "Add an account")
      ])) : f("", !0),
      o(W).length ? f("", !0) : (t(), l("p", _t, [
        D(" No image with " + u(o(P)?.title ?? te.value) + "; ask an administrator. ", 1),
        o(L).can_images && o(L).settings_path ? (t(), l("button", {
          key: 0,
          class: "ac-link kx-focus-outline",
          type: "button",
          onClick: J
        }, "Manage images")) : f("", !0)
      ])),
      e("div", xt, [
        e("label", Ct, [
          n[19] || (n[19] = e("span", null, "Account", -1)),
          G(e("select", {
            "onUpdate:modelValue": n[4] || (n[4] = (h) => ge(k) ? k.value = h : null),
            class: "kx-focus-halo"
          }, [
            V.value && o(F) ? (t(), l("option", {
              key: 0,
              value: o(k)
            }, u(o(k)) + " (unavailable)", 9, Vt)) : f("", !0),
            e("option", Ut, "Auto (" + u(o(B).length) + " ready)", 1),
            (t(!0), l(z, null, Y(o(m), (h) => (t(), l("option", {
              key: h.id,
              value: h.id
            }, u(Ce(h)), 9, St))), 128))
          ], 512), [
            [ne, o(k)]
          ])
        ]),
        e("label", At, [
          n[20] || (n[20] = e("span", null, "Image", -1)),
          G(e("select", {
            "onUpdate:modelValue": n[5] || (n[5] = (h) => ge(i) ? i.value = h : null),
            class: "kx-focus-halo"
          }, [
            V.value && o(S) && o(i) ? (t(), l("option", {
              key: 0,
              value: o(i)
            }, u(o(i)) + " (unavailable)", 9, Tt)) : f("", !0),
            (t(!0), l(z, null, Y(o(W), (h) => (t(), l("option", {
              key: h.id,
              value: h.id
            }, u(h.label), 9, Ft))), 128))
          ], 512), [
            [ne, o(i)]
          ])
        ]),
        e("label", Lt, [
          n[22] || (n[22] = e("span", null, "Workspace", -1)),
          G(e("select", {
            "onUpdate:modelValue": n[6] || (n[6] = (h) => ge(c) ? c.value = h : null),
            class: "kx-focus-halo"
          }, [
            n[21] || (n[21] = e("option", { value: "" }, "Scratch directory", -1)),
            V.value && o(ee) ? (t(), l("option", {
              key: 0,
              value: o(c)
            }, u(o(c)) + " (unavailable)", 9, Rt)) : f("", !0),
            (t(!0), l(z, null, Y(s.workspaces, (h) => (t(), l("option", {
              key: h.id,
              value: h.id
            }, u(h.name) + u(h.writable ? "" : " (read-only)"), 9, Pt))), 128))
          ], 512), [
            [ne, o(c)]
          ])
        ])
      ]),
      e("details", Et, [
        n[29] || (n[29] = e("summary", { class: "kx-focus-outline" }, "Advanced", -1)),
        e("div", It, [
          e("label", null, [
            n[24] || (n[24] = D("Workspace isolation ", -1)),
            G(e("select", {
              "onUpdate:modelValue": n[7] || (n[7] = (h) => U.value = h),
              class: "kx-focus-halo",
              "aria-label": "Workspace isolation"
            }, [...n[23] || (n[23] = [
              e("option", { value: "" }, "Workspace default", -1),
              e("option", { value: "shared" }, "Shared checkout", -1),
              e("option", { value: "worktree" }, "Private git worktree", -1)
            ])], 512), [
              [ne, U.value]
            ])
          ]),
          e("label", Nt, [
            n[25] || (n[25] = e("span", null, "Git repository", -1)),
            G(e("input", {
              "onUpdate:modelValue": n[8] || (n[8] = (h) => ge(X) ? X.value = h : null),
              class: "ac-mono kx-focus-halo",
              placeholder: "Optional: https://github.com/org/repo.git"
            }, null, 512), [
              [ie, o(X)]
            ])
          ]),
          e("label", Ot, [
            n[26] || (n[26] = e("span", null, "Repository ref", -1)),
            G(e("input", {
              "onUpdate:modelValue": n[9] || (n[9] = (h) => ge(b) ? b.value = h : null),
              "aria-label": "Repository ref",
              class: "ac-mono kx-focus-halo",
              placeholder: "Default branch"
            }, null, 512), [
              [ie, o(b)]
            ])
          ]),
          e("label", qt, [
            n[27] || (n[27] = e("span", null, "Run timeout", -1)),
            G(e("input", {
              "onUpdate:modelValue": n[10] || (n[10] = (h) => $.value = h),
              maxlength: "64",
              class: "ac-mono kx-focus-halo",
              placeholder: "Use configured timeout"
            }, null, 512), [
              [ie, $.value]
            ])
          ]),
          o(P)?.unattended ? (t(), l("label", Bt, [
            G(e("input", {
              "onUpdate:modelValue": n[11] || (n[11] = (h) => O.value = h),
              type: "checkbox",
              class: "kx-focus-outline"
            }, null, 512), [
              [tt, O.value]
            ]),
            n[28] || (n[28] = D(" Unattended · skip permission prompts when the image allows it ", -1))
          ])) : f("", !0),
          o(P) ? (t(), ae(De, {
            key: V.value + o(P).id,
            modelValue: _.value,
            "onUpdate:modelValue": n[12] || (n[12] = (h) => _.value = h),
            options: o(P).options,
            defaults: { ...O.value ? o(P).unattended : {}, ...A.value?.options },
            onInvalid: n[13] || (n[13] = (h) => Z.value = h)
          }, null, 8, ["modelValue", "options", "defaults"])) : f("", !0)
        ])
      ]),
      le.value ? (t(), l("p", Dt, u(le.value), 1)) : f("", !0),
      e("footer", Wt, [
        e("button", {
          type: "button",
          class: "ac-btn kx-focus-halo",
          onClick: n[14] || (n[14] = (h) => a("cancel"))
        }, "Cancel"),
        e("button", {
          type: "button",
          class: "ac-btn primary kx-focus-halo",
          disabled: E.value || o(Z) > 0 || !V.value && (!te.value || !(o(k) || o(B).length) || !o(i)) || !p.value.trim(),
          onClick: ke
        }, [
          q(o(M), { icon: "tabler:player-play" }),
          D(" " + u(E.value ? "Starting…" : "Start"), 1)
        ], 8, Mt)
      ])
    ], 8, mt));
  }
}), zt = {
  key: 0,
  class: "kx-empty",
  role: "status"
}, Jt = {
  key: 1,
  class: "kx-err",
  role: "alert"
}, Ht = {
  key: 2,
  class: "kx-loading"
}, Gt = { class: "ac-detail-head" }, Kt = { class: "ac-card-head" }, Qt = ["disabled"], Xt = { class: "ac-detail-title" }, Yt = { class: "ac-run-meta ac-detail-meta" }, Zt = ["title"], ea = { key: 0 }, ta = { key: 1 }, aa = { key: 2 }, la = { key: 3 }, na = { key: 4 }, oa = { key: 5 }, sa = { class: "ac-detail-section" }, ia = { class: "ac-pre" }, ua = {
  key: 0,
  class: "ac-muted"
}, da = {
  key: 0,
  class: "ac-detail-section",
  "aria-label": "Usage by model"
}, ca = {
  key: 1,
  class: "kx-err",
  role: "alert"
}, ra = {
  class: "ac-detail-section",
  "aria-labelledby": "ac-prompt-heading"
}, va = { class: "ac-section-head" }, pa = ["aria-expanded"], ga = {
  key: 2,
  class: "ac-detail-section ac-result",
  "aria-labelledby": "ac-result-heading"
}, fa = { class: "ac-section-head" }, ha = { id: "ac-result-heading" }, ma = { class: "ac-row-actions" }, ka = ["aria-expanded"], ba = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, ya = {
  key: 3,
  class: "kx-err",
  role: "alert"
}, $a = {
  class: "ac-detail-section",
  "aria-labelledby": "ac-log-heading"
}, wa = { class: "ac-section-head" }, _a = { class: "ac-muted" }, xa = ["disabled"], Ca = ["disabled"], Va = {
  class: "ac-stream",
  tabindex: "0",
  "aria-label": "Task log"
}, Ua = { class: "ac-event-kind" }, Sa = { class: "ac-event-text" }, Aa = {
  key: 0,
  class: "ac-muted ac-pulse"
}, Ta = {
  key: 1,
  class: "ac-muted"
}, Fa = 500, La = /* @__PURE__ */ re({
  __name: "run-detail",
  props: {
    runId: {},
    accounts: {},
    images: {},
    workspaces: {}
  },
  setup(s) {
    const d = s, v = me(), a = g(null), L = g([]), C = g(0), I = g(!1), V = g(!1);
    let x;
    const A = g(!1), j = g(""), T = g(!1), J = g(null), R = g(!1), y = g("");
    let w = null;
    const P = g(!1), m = g(!1), B = g(!1), W = g(""), Z = _e(), N = K(() => (a.value?.prompt.length ?? 0) > 500 || (a.value?.prompt.split(`
`).length ?? 0) > 5), S = K(() => (a.value?.result.length ?? 0) > 1800 || (a.value?.result.split(`
`).length ?? 0) > 10);
    let F = !0, ee = !0, se, te;
    const H = (r) => r.status === "queued" || r.status === "running";
    function k() {
      w && (ee = w.scrollHeight - w.scrollTop - w.clientHeight < 40);
    }
    Te(() => {
      w = J.value?.closest(".ac") ?? null, w?.addEventListener("scroll", k, { passive: !0 });
    }), ye(() => {
      w?.removeEventListener("scroll", k), w = null;
    });
    const i = xe(async () => {
      try {
        const r = x ?? (a.value ? void 0 : 0);
        x = void 0;
        let n = await Q.run(d.runId, r === void 0 ? C.value : void 0, r);
        if (!F) return;
        if (r === void 0 && (n.more || A.value && n.events.length)) {
          if (n = await Q.run(d.runId, void 0, 0), !F) return;
          L.value = n.events, I.value = n.more, A.value = !1;
        } else if (r !== void 0)
          L.value = n.events, I.value = n.more, A.value = r !== 0;
        else if (n.events.length) {
          const h = Math.max(0, L.value.length + n.events.length - Fa);
          h && L.value.splice(0, h), L.value.push(...n.events), I.value = I.value || h > 0;
        }
        T.value = !1, a.value = n.run, A.value || (C.value = n.next_seq), await Fe(), F && ee && w && w.scrollTo({ top: w.scrollHeight }), j.value = "";
      } catch (r) {
        if (!F) return;
        T.value = r instanceof nt && r.code === "autocode.run_not_found", T.value && (a.value = null, L.value = []), j.value = T.value ? "" : oe(r, "Could not load the task.");
      } finally {
        V.value = !1;
      }
    });
    function c() {
      V.value || !L.value.length || (ee = !1, V.value = !0, x = L.value[0].seq, i());
    }
    function X() {
      V.value || (ee = !0, V.value = !0, x = 0, i());
    }
    const U = Re.run(d.runId, () => {
      i();
    });
    $e(i), ye(() => {
      F = !1, U(), clearTimeout(te), clearTimeout(se);
    });
    async function b() {
      try {
        await Q.cancelRun(d.runId), await i();
      } catch (r) {
        j.value = oe(r, "Could not cancel the task.");
      }
    }
    async function $(r) {
      try {
        await navigator.clipboard.writeText(r);
      } catch {
        const n = document.createElement("textarea"), h = J.value?.getRootNode(), ce = h instanceof ShadowRoot || h instanceof Document ? h.activeElement : null, ve = ce instanceof HTMLElement ? ce : null;
        n.value = r, n.readOnly = !0, n.style.cssText = "position:fixed;opacity:0;pointer-events:none;", J.value?.append(n);
        try {
          if (n.select(), !document.execCommand("copy")) throw new Error("Copy failed");
        } finally {
          n.remove(), ve?.focus({ preventScroll: !0 });
        }
      }
    }
    async function p() {
      try {
        await $(a.value?.result ?? ""), B.value = !0, W.value = "", clearTimeout(te), te = setTimeout(() => {
          B.value = !1;
        }, 2e3);
      } catch {
        W.value = "Could not copy. Select the result text to copy it.";
      }
    }
    async function _() {
      try {
        const r = new URL(dt.env.APP_API_URL || "/", window.location.href);
        await $(new URL(`/autocode/runs/${encodeURIComponent(d.runId)}`, r).href), R.value = !0, y.value = "", clearTimeout(se), se = setTimeout(() => {
          R.value = !1;
        }, 2e3);
      } catch {
        y.value = "Could not copy the link. Try again.";
      }
    }
    function O() {
      m.value = !m.value;
    }
    function E(r) {
      return typeof r.options?.model == "string" ? r.options.model : "";
    }
    function le(r) {
      return d.accounts.find((n) => n.id === r)?.label ?? "Unlisted account";
    }
    function Ce(r) {
      return d.workspaces.find((n) => n.id === r)?.name ?? "Unlisted workspace";
    }
    function de(r) {
      return d.images.find((n) => n.id === r)?.label ?? "Unlisted image";
    }
    function ke(r) {
      const n = [];
      return r.usage.input_tokens !== void 0 && n.push(`${r.usage.input_tokens} input`), r.usage.output_tokens !== void 0 && n.push(`${r.usage.output_tokens} output`), r.usage.cached_tokens !== void 0 && n.push(`${r.usage.cached_tokens} cached`), r.usage.cache_write_tokens !== void 0 && n.push(`${r.usage.cache_write_tokens} cache write`), r.usage.reasoning_tokens !== void 0 && n.push(`${r.usage.reasoning_tokens} reasoning`), r.usage.cost_usd !== void 0 && n.push(`$${r.usage.cost_usd}`), n.join(" · ");
    }
    return (r, n) => (t(), l("section", {
      ref_key: "detail",
      ref: J,
      class: "ac-form ac-detail"
    }, [
      T.value ? (t(), l("div", zt, [...n[2] || (n[2] = [
        e("h1", null, "Run not found", -1),
        e("p", null, "This run does not exist or you do not have access to it.", -1)
      ])])) : f("", !0),
      j.value ? (t(), l("p", Jt, [
        D(u(j.value) + " ", 1),
        e("button", {
          type: "button",
          class: "ac-link kx-focus-outline",
          onClick: n[0] || (n[0] = //@ts-ignore
          (...h) => o(i) && o(i)(...h))
        }, "Retry")
      ])) : f("", !0),
      !a.value && !j.value && !T.value ? (t(), l("div", Ht, [
        q(o(M), {
          icon: "tabler:loader-2",
          class: "spin"
        }),
        n[3] || (n[3] = D(" Loading the task…", -1))
      ])) : a.value ? (t(), l(z, { key: 3 }, [
        e("header", Gt, [
          e("div", Kt, [
            e("span", {
              class: ue(["kx-tag-sm ac-tone", a.value.status])
            }, u(a.value.status), 3),
            e("button", {
              type: "button",
              class: "ac-btn kx-focus-halo",
              "aria-live": "polite",
              onClick: _
            }, [
              q(o(M), {
                icon: R.value ? "tabler:check" : "tabler:link"
              }, null, 8, ["icon"]),
              D(u(R.value ? "Link copied" : "Copy link"), 1)
            ]),
            H(a.value) ? (t(), l("button", {
              key: 0,
              type: "button",
              class: "ac-btn danger kx-focus-halo",
              disabled: a.value.cancel_requested,
              onClick: b
            }, [
              q(o(M), { icon: "tabler:player-stop" }),
              D(" " + u(a.value.cancel_requested ? "Cancelling…" : "Cancel"), 1)
            ], 8, Qt)) : f("", !0)
          ]),
          e("h1", Xt, u(a.value.prompt.split(`
`)[0]), 1),
          e("div", Yt, [
            e("span", null, [
              q(o(M), {
                icon: o(we)(a.value.agent, o(v).agents)
              }, null, 8, ["icon"]),
              D(u(o(v).agents.find((h) => h.id === a.value?.agent)?.title ?? a.value.agent), 1)
            ]),
            e("span", null, u(le(a.value.account_id)), 1),
            e("span", null, u(de(a.value.image_id)), 1),
            e("span", {
              title: o(he)(a.value.started_at || a.value.created_at)
            }, u(a.value.started_at ? "Started" : "Queued") + " " + u(o(Pe)(a.value.started_at || a.value.created_at, o(Z))), 9, Zt),
            a.value.started_at ? (t(), l("span", ea, u(o(Oe)(a.value, o(Z))) + " " + u(H(a.value) ? "elapsed" : "duration"), 1)) : f("", !0),
            a.value.timeout_ms ? (t(), l("span", ta, u(o(lt)(a.value.timeout_ms)), 1)) : f("", !0),
            e("span", null, u(a.value.unattended ? "Unattended" : "Attended"), 1),
            a.value.workflow ? (t(), l("span", aa, "Workflow")) : f("", !0),
            a.value.workspace_id ? (t(), l("span", la, u(Ce(a.value.workspace_id)), 1)) : f("", !0),
            e("span", null, u(a.value.isolation === "worktree" ? "Private git worktree" : "Shared checkout"), 1),
            E(a.value) ? (t(), l("span", na, u(E(a.value)), 1)) : f("", !0),
            ke(a.value) ? (t(), l("span", oa, u(ke(a.value)), 1)) : f("", !0)
          ])
        ]),
        e("details", sa, [
          n[4] || (n[4] = e("summary", { class: "kx-focus-outline" }, "Effective options", -1)),
          e("pre", ia, u(JSON.stringify(a.value.options, null, 2)), 1),
          a.value.endpoint ? (t(), l("p", ua, u(a.value.endpoint.protocol) + " · " + u(a.value.endpoint.base_url) + " · " + u(a.value.endpoint.model), 1)) : f("", !0)
        ]),
        a.value.usage.models ? (t(), l("section", da, [
          n[5] || (n[5] = e("h3", null, "Usage by model", -1)),
          (t(!0), l(z, null, Y(a.value.usage.models, (h, ce) => (t(), l("p", {
            key: ce,
            class: "ac-muted"
          }, u(ce) + " · " + u(Object.entries(h).map(([ve, Ve]) => `${ve === "cost_usd" ? "$" : ve + ": "}${Ve}`).join(" · ")), 1))), 128))
        ])) : f("", !0),
        y.value ? (t(), l("p", ca, u(y.value), 1)) : f("", !0),
        e("section", ra, [
          e("div", va, [
            n[6] || (n[6] = e("h3", { id: "ac-prompt-heading" }, "Prompt", -1)),
            N.value ? (t(), l("button", {
              key: 0,
              type: "button",
              class: "ac-link kx-focus-outline",
              "aria-expanded": P.value,
              "aria-controls": "ac-prompt-text",
              onClick: n[1] || (n[1] = (h) => P.value = !P.value)
            }, u(P.value ? "Collapse prompt" : "Expand prompt"), 9, pa)) : f("", !0)
          ]),
          e("pre", {
            id: "ac-prompt-text",
            class: ue(["ac-pre ac-prompt", { expanded: P.value || !N.value }])
          }, [
            e("span", null, u(a.value.prompt), 1)
          ], 2)
        ]),
        a.value.result ? (t(), l("section", ga, [
          e("div", fa, [
            e("h3", ha, u(a.value.status === "succeeded" ? "Result" : "Partial result"), 1),
            e("div", ma, [
              S.value ? (t(), l("button", {
                key: 0,
                type: "button",
                class: "ac-link kx-focus-outline",
                "aria-expanded": m.value,
                "aria-controls": "ac-result-text",
                onClick: O
              }, u(m.value ? "Collapse result" : "Expand result"), 9, ka)) : f("", !0),
              e("button", {
                type: "button",
                class: "ac-btn kx-focus-halo",
                onClick: p
              }, [
                q(o(M), {
                  icon: B.value ? "tabler:check" : "tabler:copy"
                }, null, 8, ["icon"]),
                D(u(B.value ? "Copied" : "Copy"), 1)
              ])
            ])
          ]),
          W.value ? (t(), l("p", ba, u(W.value), 1)) : f("", !0),
          e("pre", {
            id: "ac-result-text",
            class: ue(["ac-pre ac-result-text", { expanded: m.value }]),
            tabindex: "0",
            "aria-label": "Result"
          }, u(a.value.result), 3)
        ])) : f("", !0),
        a.value.error ? (t(), l("p", ya, u(a.value.error), 1)) : f("", !0),
        e("section", $a, [
          e("div", wa, [
            n[7] || (n[7] = e("h3", { id: "ac-log-heading" }, "Log", -1)),
            e("span", _a, u(L.value.length) + " events", 1)
          ]),
          I.value ? (t(), l("button", {
            key: 0,
            type: "button",
            class: "ac-link kx-focus-outline",
            disabled: V.value,
            onClick: c
          }, u(V.value ? "Loading…" : "Load earlier"), 9, xa)) : f("", !0),
          A.value ? (t(), l("button", {
            key: 1,
            type: "button",
            class: "ac-link kx-focus-outline",
            disabled: V.value,
            onClick: X
          }, "Latest", 8, Ca)) : f("", !0),
          e("div", Va, [
            (t(!0), l(z, null, Y(L.value, (h) => (t(), l("div", {
              key: h.seq,
              class: ue(["ac-event", h.kind])
            }, [
              e("span", Ua, u(h.kind), 1),
              e("pre", Sa, u(h.text), 1)
            ], 2))), 128)),
            H(a.value) ? (t(), l("div", Aa, "Working…")) : L.value.length ? f("", !0) : (t(), l("div", Ta, "No log events."))
          ])
        ])
      ], 64)) : f("", !0)
    ], 512));
  }
}), Ra = {
  key: 0,
  "aria-label": "Task details"
}, Pa = { class: "ac-detail-back" }, Ea = {
  key: 1,
  class: "kx-loading"
}, Ia = { key: 2 }, Na = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, Oa = {
  key: 1,
  class: "kx-empty"
}, qa = { class: "kx-empty-ico" }, Ba = { class: "kx-empty-sub" }, Da = {
  key: 2,
  class: "kx-empty"
}, Wa = {
  key: 3,
  class: "ac-run-list"
}, Ma = ["onClick"], ja = { class: "ac-run-copy" }, za = { class: "ac-run-title-row" }, Ja = { class: "ac-run-title" }, Ha = {
  key: 0,
  class: "kx-tag-sm ac-tone"
}, Ga = { class: "ac-run-meta" }, Ka = ["title"], Qa = { key: 0 }, Xa = {
  key: 4,
  class: "ac-load-more"
}, Ya = /* @__PURE__ */ re({
  __name: "tasks",
  props: {
    query: {},
    runId: {}
  },
  emits: ["goto", "agentChanged", "count", "open", "close"],
  setup(s, { expose: d, emit: v }) {
    const a = Ee(), L = g([]), C = s, I = v, V = me(), x = g(!1), A = g(!1);
    d({ open: () => {
      x.value = !0;
    } });
    const j = g([]), T = g([]), J = g([]), R = g([]), y = g(), w = g(!1), P = g(""), m = _e(), B = g(!1);
    let W = 0, Z = 1;
    async function N() {
      const U = [];
      let b;
      for (let $ = 0; $ < Z; $++) {
        const p = await Q.runs(b);
        if (!a() || (U.push(...p.runs), b = p.next_cursor, !b)) break;
      }
      return { runs: U, next_cursor: b };
    }
    const S = xe(async () => {
      W++, B.value = !0;
      try {
        await Be(
          () => Promise.all([Q.accounts(), Q.images(), N(), Q.workspaces()]),
          ([U, b, , $]) => [...U, ...b, ...$.workspaces].map((p) => p.id),
          L,
          a,
          ([U, b, $, p]) => {
            j.value = U, T.value = b, R.value = $.runs, y.value = $.next_cursor, J.value = p.workspaces, w.value = !0, P.value = "";
          },
          () => {
            S();
          }
        );
      } catch (U) {
        a() && (P.value = oe(U, "Could not load tasks."));
      } finally {
        a() && (B.value = !1);
      }
    }, a), F = Re.runs(() => {
      S();
    });
    qe(() => L.value, () => {
      S();
    }), $e(S), ye(F);
    const ee = g(!1);
    async function se() {
      if (!(!y.value || ee.value || B.value)) {
        ee.value = !0;
        try {
          const U = W, b = await Q.runs(y.value);
          if (!a() || W !== U) return;
          const $ = new Set(R.value.map((p) => p.id));
          R.value.push(...b.runs.filter((p) => !$.has(p.id))), y.value = b.next_cursor, Z++;
        } catch (U) {
          a() && (P.value = oe(U, "Could not load more tasks."));
        } finally {
          a() && (ee.value = !1);
        }
      }
    }
    function te(U) {
      x.value = !1, I("open", U);
    }
    const H = K(() => j.value.some((U) => U.usable && U.enabled)), k = K(() => R.value.filter((U) => [U.prompt_summary, U.status, U.agent, i(U.agent), X(U.account_id)].join(" ").toLowerCase().includes(C.query.trim().toLowerCase())));
    pe(() => R.value.length, (U) => I("count", U));
    function i(U) {
      return V.value.agents.find((b) => b.id === U)?.title ?? U;
    }
    function c(U) {
      return T.value.find((b) => b.id === U)?.label ?? "Unlisted image";
    }
    function X(U) {
      return j.value.find((b) => b.id === U)?.label ?? "Unlisted account";
    }
    return (U, b) => s.runId ? (t(), l("section", Ra, [
      e("div", Pa, [
        e("button", {
          type: "button",
          class: "ac-btn kx-focus-halo",
          onClick: b[0] || (b[0] = ($) => I("close"))
        }, [
          q(o(M), { icon: "tabler:arrow-left" }),
          b[9] || (b[9] = D(" Back to tasks", -1))
        ])
      ]),
      (t(), ae(La, {
        key: s.runId,
        "run-id": s.runId,
        accounts: j.value,
        images: T.value,
        workspaces: J.value
      }, null, 8, ["run-id", "accounts", "images", "workspaces"]))
    ])) : w.value ? (t(), l("div", Ia, [
      P.value ? (t(), l("p", Na, [
        D(u(P.value) + " ", 1),
        e("button", {
          class: "ac-link kx-focus-outline",
          type: "button",
          onClick: b[2] || (b[2] = //@ts-ignore
          (...$) => o(S) && o(S)(...$))
        }, "Retry")
      ])) : f("", !0),
      R.value.length ? k.value.length ? f("", !0) : (t(), l("div", Da, [...b[12] || (b[12] = [
        e("div", { class: "kx-empty-title" }, "No matches", -1),
        e("div", { class: "kx-empty-sub" }, "Try another task, agent or account.", -1)
      ])])) : (t(), l("div", Oa, [
        e("div", qa, [
          q(o(M), { icon: "tabler:terminal-2" })
        ]),
        b[11] || (b[11] = e("div", { class: "kx-empty-title" }, "No tasks yet", -1)),
        e("div", Ba, u(H.value ? "Give a coding agent a task and follow its progress here." : "Add an account to give your coding agent a place to start."), 1),
        q(o(Ue), {
          label: H.value ? "New task" : "Add account",
          onClick: b[3] || (b[3] = ($) => H.value ? x.value = !0 : I("goto"))
        }, {
          icon: fe(() => [
            q(o(M), { icon: "tabler:plus" })
          ]),
          _: 1
        }, 8, ["label"])
      ])),
      k.value.length ? (t(), l("ul", Wa, [
        (t(!0), l(z, null, Y(k.value, ($) => (t(), l("li", {
          key: $.id,
          class: "ac-run"
        }, [
          e("button", {
            type: "button",
            class: "ac-run-main kx-focus-halo",
            onClick: (p) => I("open", $.id)
          }, [
            e("span", ja, [
              e("span", za, [
                e("span", Ja, u($.prompt_summary.split(`
`)[0]), 1),
                e("span", {
                  class: ue(["kx-tag-sm ac-tone", $.status])
                }, u($.status), 3),
                $.workflow ? (t(), l("span", Ha, "Workflow")) : f("", !0)
              ]),
              e("span", Ga, [
                e("span", null, [
                  q(o(M), {
                    icon: o(we)($.agent, o(V).agents)
                  }, null, 8, ["icon"]),
                  D(u(i($.agent)), 1)
                ]),
                e("span", null, u(X($.account_id)), 1),
                e("span", null, u(c($.image_id)), 1),
                e("span", {
                  title: o(he)($.started_at || $.created_at)
                }, u(o(Pe)($.started_at || $.created_at, o(m))), 9, Ka),
                $.started_at ? (t(), l("span", Qa, u(o(Oe)($, o(m))) + " " + u($.status === "running" ? "elapsed" : "duration"), 1)) : f("", !0)
              ])
            ]),
            q(o(M), {
              icon: "tabler:chevron-right",
              class: "ac-run-chevron ac-muted"
            })
          ], 8, Ma)
        ]))), 128))
      ])) : f("", !0),
      y.value ? (t(), l("div", Xa, [
        q(o(Ue), {
          label: "Load more",
          loading: ee.value,
          disabled: B.value,
          onClick: se
        }, null, 8, ["loading", "disabled"])
      ])) : f("", !0),
      x.value ? (t(), ae(Ae, {
        key: 5,
        title: "New task",
        busy: A.value,
        wide: "",
        onClose: b[8] || (b[8] = ($) => x.value = !1)
      }, {
        default: fe(() => [
          q(jt, {
            onBusy: b[4] || (b[4] = ($) => A.value = $),
            accounts: j.value,
            images: T.value,
            workspaces: J.value,
            onStarted: te,
            onCancel: b[5] || (b[5] = ($) => x.value = !1),
            onAgentChanged: b[6] || (b[6] = ($) => I("agentChanged", $)),
            onGoto: b[7] || (b[7] = ($, p) => I("goto", p))
          }, null, 8, ["accounts", "images", "workspaces"])
        ]),
        _: 1
      }, 8, ["busy"])) : f("", !0)
    ])) : (t(), l("div", Ea, [
      P.value ? (t(), l(z, { key: 0 }, [
        D(u(P.value) + " ", 1),
        e("button", {
          class: "ac-link kx-focus-outline",
          type: "button",
          onClick: b[1] || (b[1] = //@ts-ignore
          (...$) => o(S) && o(S)(...$))
        }, "Retry")
      ], 64)) : (t(), l(z, { key: 1 }, [
        q(o(M), {
          icon: "tabler:loader-2",
          class: "spin"
        }),
        b[10] || (b[10] = D(" Loading tasks…", -1))
      ], 64))
    ]));
  }
});
var Za = {
  name: "BaseEditableHolder",
  extends: ze,
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
      handler: function(d) {
        this.d_value = d;
      }
    },
    defaultValue: function(d) {
      this.d_value = d;
    },
    $formName: {
      immediate: !0,
      handler: function(d) {
        var v, a;
        this.formField = ((v = this.$pcForm) === null || v === void 0 || (a = v.register) === null || a === void 0 ? void 0 : a.call(v, d, this.$formControl)) || {};
      }
    },
    $formControl: {
      immediate: !0,
      handler: function(d) {
        var v, a;
        this.formField = ((v = this.$pcForm) === null || v === void 0 || (a = v.register) === null || a === void 0 ? void 0 : a.call(v, this.$formName, d)) || {};
      }
    },
    $formDefaultValue: {
      immediate: !0,
      handler: function(d) {
        this.d_value !== d && (this.d_value = d);
      }
    },
    $formValue: {
      immediate: !1,
      handler: function(d) {
        var v;
        (v = this.$pcForm) !== null && v !== void 0 && v.getFieldState(this.$formName) && d !== this.d_value && (this.d_value = d);
      }
    }
  },
  formField: {},
  methods: {
    writeValue: function(d, v) {
      var a, L;
      this.controlled && (this.d_value = d, this.$emit("update:modelValue", d)), this.$emit("value-change", d), (a = (L = this.formField).onChange) === null || a === void 0 || a.call(L, {
        originalEvent: v,
        value: d
      });
    },
    // @todo move to @primeuix/utils
    findNonEmpty: function() {
      for (var d = arguments.length, v = new Array(d), a = 0; a < d; a++)
        v[a] = arguments[a];
      return v.find(Ie);
    }
  },
  computed: {
    $filled: function() {
      return Ie(this.d_value);
    },
    $invalid: function() {
      var d, v;
      return !this.$formNovalidate && this.findNonEmpty(this.invalid, (d = this.$pcFormField) === null || d === void 0 || (d = d.$field) === null || d === void 0 ? void 0 : d.invalid, (v = this.$pcForm) === null || v === void 0 || (v = v.getFieldState(this.$formName)) === null || v === void 0 ? void 0 : v.invalid);
    },
    $formName: function() {
      var d;
      return this.$formNovalidate ? void 0 : this.name || ((d = this.$formControl) === null || d === void 0 ? void 0 : d.name);
    },
    $formControl: function() {
      var d;
      return this.formControl || ((d = this.$pcFormField) === null || d === void 0 ? void 0 : d.formControl);
    },
    $formNovalidate: function() {
      var d;
      return (d = this.$formControl) === null || d === void 0 ? void 0 : d.novalidate;
    },
    $formDefaultValue: function() {
      var d, v;
      return this.findNonEmpty(this.d_value, (d = this.$pcFormField) === null || d === void 0 ? void 0 : d.initialValue, (v = this.$pcForm) === null || v === void 0 || (v = v.initialValues) === null || v === void 0 ? void 0 : v[this.$formName]);
    },
    $formValue: function() {
      var d, v;
      return this.findNonEmpty((d = this.$pcFormField) === null || d === void 0 || (d = d.$field) === null || d === void 0 ? void 0 : d.value, (v = this.$pcForm) === null || v === void 0 || (v = v.getFieldState(this.$formName)) === null || v === void 0 ? void 0 : v.value);
    },
    controlled: function() {
      return this.$inProps.hasOwnProperty("modelValue") || !this.$inProps.hasOwnProperty("modelValue") && !this.$inProps.hasOwnProperty("defaultValue");
    },
    // @deprecated use $filled instead
    filled: function() {
      return this.$filled;
    }
  }
}, el = `
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
`, tl = {
  root: {
    position: "relative"
  }
}, al = {
  root: function(d) {
    var v = d.instance, a = d.props;
    return ["p-toggleswitch p-component", {
      "p-toggleswitch-checked": v.checked,
      "p-disabled": a.disabled,
      "p-invalid": v.$invalid
    }];
  },
  input: "p-toggleswitch-input",
  slider: "p-toggleswitch-slider",
  handle: "p-toggleswitch-handle"
}, ll = Je.extend({
  name: "toggleswitch",
  style: el,
  classes: al,
  inlineStyles: tl
}), nl = {
  name: "BaseToggleSwitch",
  extends: Za,
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
  style: ll,
  provide: function() {
    return {
      $pcToggleSwitch: this,
      $parentInstance: this
    };
  }
}, je = {
  name: "ToggleSwitch",
  extends: nl,
  inheritAttrs: !1,
  emits: ["change", "focus", "blur"],
  methods: {
    getPTOptions: function(d) {
      var v = d === "root" ? this.ptmi : this.ptm;
      return v(d, {
        context: {
          checked: this.checked,
          disabled: this.disabled
        }
      });
    },
    onChange: function(d) {
      if (!this.disabled && !this.readonly) {
        var v = this.checked ? this.falseValue : this.trueValue;
        this.writeValue(v, d), this.$emit("change", d);
      }
    },
    onFocus: function(d) {
      this.$emit("focus", d);
    },
    onBlur: function(d) {
      var v, a;
      this.$emit("blur", d), (v = (a = this.formField).onBlur) === null || v === void 0 || v.call(a, d);
    }
  },
  computed: {
    checked: function() {
      return this.d_value === this.trueValue;
    },
    dataP: function() {
      return He({
        checked: this.checked,
        disabled: this.disabled,
        invalid: this.$invalid
      });
    }
  }
}, ol = ["data-p-checked", "data-p-disabled", "data-p"], sl = ["id", "checked", "tabindex", "disabled", "readonly", "aria-checked", "aria-labelledby", "aria-label", "aria-invalid"], il = ["data-p"], ul = ["data-p"];
function dl(s, d, v, a, L, C) {
  return t(), l("div", be({
    class: s.cx("root"),
    style: s.sx("root")
  }, C.getPTOptions("root"), {
    "data-p-checked": C.checked,
    "data-p-disabled": s.disabled,
    "data-p": C.dataP
  }), [e("input", be({
    id: s.inputId,
    type: "checkbox",
    role: "switch",
    class: [s.cx("input"), s.inputClass],
    style: s.inputStyle,
    checked: C.checked,
    tabindex: s.tabindex,
    disabled: s.disabled,
    readonly: s.readonly,
    "aria-checked": C.checked,
    "aria-labelledby": s.ariaLabelledby,
    "aria-label": s.ariaLabel,
    "aria-invalid": s.invalid || void 0,
    onFocus: d[0] || (d[0] = function() {
      return C.onFocus && C.onFocus.apply(C, arguments);
    }),
    onBlur: d[1] || (d[1] = function() {
      return C.onBlur && C.onBlur.apply(C, arguments);
    }),
    onChange: d[2] || (d[2] = function() {
      return C.onChange && C.onChange.apply(C, arguments);
    })
  }, C.getPTOptions("input")), null, 16, sl), e("div", be({
    class: s.cx("slider")
  }, C.getPTOptions("slider"), {
    "data-p": C.dataP
  }), [e("div", be({
    class: s.cx("handle")
  }, C.getPTOptions("handle"), {
    "data-p": C.dataP
  }), [at(s.$slots, "handle", {
    checked: C.checked
  })], 16, ul)], 16, il)], 16, ol);
}
je.render = dl;
const cl = { class: "ac-account-main" }, rl = { class: "ac-row-title" }, vl = ["onKeydown"], pl = {
  key: 1,
  class: "ac-row-name"
}, gl = {
  key: 2,
  class: "kx-tag-sm ac-tone"
}, fl = { class: "ac-muted" }, hl = ["title"], ml = { key: 1 }, kl = {
  key: 0,
  class: "ac-muted"
}, bl = {
  key: 1,
  class: "ac-muted ac-strong"
}, yl = {
  key: 2,
  class: "ac-muted"
}, $l = {
  key: 3,
  class: "ac-muted ac-mono"
}, wl = {
  key: 4,
  class: "ac-muted"
}, _l = {
  key: 5,
  class: "ac-muted"
}, xl = {
  key: 6,
  class: "kx-err ac-small"
}, Cl = { class: "ac-row-actions" }, Vl = /* @__PURE__ */ re({
  __name: "account-row",
  props: {
    account: {},
    kindLabel: {},
    ownerLabel: {}
  },
  emits: ["toggle", "rename", "remove", "edit"],
  setup(s, { emit: d }) {
    const v = s, a = d, L = { ready: "ready", cooling: "cooling down", disabled: "disabled", unavailable: "unavailable" }, C = _e(), I = K(() => Le(v.account, C.value)), V = K(() => v.account.mine ? "" : `Shared with you by ${v.ownerLabel}`), x = g(!1), A = g(""), j = g(null);
    function T() {
      A.value = v.account.label, x.value = !0, Fe(() => j.value?.select());
    }
    function J() {
      if (!x.value) return;
      x.value = !1;
      const R = A.value.trim();
      R && R !== v.account.label && a("rename", R);
    }
    return (R, y) => (t(), l("li", {
      class: ue(["ac-row ac-account ac-hover-actions", { off: !s.account.enabled || !s.account.usable }])
    }, [
      e("div", cl, [
        e("div", rl, [
          e("span", {
            class: ue(["kx-tag-sm ac-tone", I.value])
          }, u(L[I.value]), 3),
          x.value ? G((t(), l("input", {
            key: 0,
            ref_key: "input",
            ref: j,
            "onUpdate:modelValue": y[0] || (y[0] = (w) => A.value = w),
            class: "ac-rename kx-focus-halo",
            "aria-label": "Account label",
            onKeydown: [
              Ne(Se(J, ["prevent"]), ["enter"]),
              y[1] || (y[1] = Ne(Se((w) => x.value = !1, ["prevent"]), ["escape"]))
            ],
            onBlur: J
          }, null, 40, vl)), [
            [ie, A.value]
          ]) : (t(), l("span", pl, u(s.account.label), 1)),
          s.account.subscription ? (t(), l("span", gl, "personal")) : f("", !0)
        ]),
        e("div", fl, [
          D(u(s.kindLabel) + " · " + u(s.account.runs_day) + " " + u(s.account.runs_day === 1 ? "task" : "tasks") + " in the last 24 hours · " + u(s.account.failures_day) + " " + u(s.account.failures_day === 1 ? "failure" : "failures") + " · ", 1),
          s.account.last_used_at ? (t(), l("span", {
            key: 0,
            title: o(he)(s.account.last_used_at)
          }, "last used " + u(o(Pe)(s.account.last_used_at, o(C))), 9, hl)) : (t(), l("span", ml, "never used"))
        ]),
        V.value ? (t(), l("div", kl, u(V.value), 1)) : f("", !0),
        s.account.usable ? s.account.subscription ? (t(), l("div", yl, "Subscription login: personal use only")) : f("", !0) : (t(), l("div", bl, [
          q(o(M), { icon: "tabler:lock" }),
          D(" " + u(s.account.unavailable_reason || "Account unavailable for tasks"), 1)
        ])),
        s.account.endpoint ? (t(), l("div", $l, u(s.account.endpoint.protocol) + " · " + u(s.account.endpoint.base_url) + u(s.account.endpoint.model ? " · " + s.account.endpoint.model : ""), 1)) : f("", !0),
        I.value === "cooling" && s.account.cooldown_until ? (t(), l("div", wl, "Available at " + u(o(he)(s.account.cooldown_until)), 1)) : f("", !0),
        (t(!0), l(z, null, Y(s.account.rate_limits?.windows ?? [], (w) => (t(), l("div", {
          key: w.window,
          class: "ac-muted"
        }, [
          D(u(w.window.replace("seven_day", "7-day").replace("five_hour", "5-hour").replaceAll("_", " ")) + ": " + u(w.utilization === void 0 ? w.status : `${Math.round(w.utilization * 100)}% used`), 1),
          w.resets_at ? (t(), l(z, { key: 0 }, [
            D(", resets " + u(new Date(w.resets_at * 1e3).toLocaleString(void 0, { weekday: "short", hour: "2-digit", minute: "2-digit" })), 1)
          ], 64)) : f("", !0)
        ]))), 128)),
        s.account.rate_limits?.overage_status ? (t(), l("div", _l, "Overage: " + u(s.account.rate_limits.overage_status) + u(s.account.rate_limits.overage_disabled_reason ? " · " + s.account.rate_limits.overage_disabled_reason : ""), 1)) : f("", !0),
        s.account.last_error ? (t(), l("div", xl, u(s.account.last_error), 1)) : f("", !0)
      ]),
      e("div", Cl, [
        s.account.writable ? (t(), ae(o(je), {
          key: 0,
          "model-value": s.account.enabled,
          "aria-label": s.account.enabled ? "Disable account" : "Enable account",
          onChange: y[2] || (y[2] = (w) => a("toggle"))
        }, null, 8, ["model-value", "aria-label"])) : f("", !0),
        s.account.writable ? (t(), l("button", {
          key: 1,
          type: "button",
          class: "ac-icon-btn kx-focus-outline",
          title: "Rename",
          "aria-label": "Rename account",
          onClick: T
        }, [
          q(o(M), { icon: "tabler:pencil" })
        ])) : f("", !0),
        s.account.writable ? (t(), l("button", {
          key: 2,
          type: "button",
          class: "ac-icon-btn kx-focus-outline",
          title: "Edit credential and endpoint",
          "aria-label": "Edit account",
          onClick: y[3] || (y[3] = (w) => a("edit"))
        }, [
          q(o(M), { icon: "tabler:key" })
        ])) : f("", !0),
        s.account.deletable ? (t(), l("button", {
          key: 3,
          type: "button",
          class: "ac-icon-btn kx-focus-outline",
          title: "Delete",
          "aria-label": "Delete account",
          onClick: y[4] || (y[4] = (w) => a("remove"))
        }, [
          q(o(M), { icon: "tabler:trash" })
        ])) : f("", !0)
      ])
    ], 2));
  }
}), Ul = { class: "ac-stack" }, Sl = {
  key: 0,
  class: "kx-err inline"
}, Al = {
  key: 1,
  class: "kx-err inline",
  role: "status"
}, Tl = {
  key: 2,
  class: "kx-loading"
}, Fl = {
  key: 3,
  class: "kx-empty"
}, Ll = { class: "kx-empty-ico" }, Rl = {
  key: 4,
  class: "kx-empty"
}, Pl = { class: "ac-card-head" }, El = { class: "ac-card-title" }, Il = { class: "ac-muted" }, Nl = { class: "ac-account-grid" }, Ol = { class: "ac-form" }, ql = {
  key: 1,
  class: "ac-hint"
}, Bl = ["^config"], Dl = {
  key: 3,
  class: "kx-err",
  role: "alert"
}, Wl = /* @__PURE__ */ re({
  __name: "accounts",
  props: {
    query: {},
    selectedAgent: {}
  },
  emits: ["count"],
  setup(s, { expose: d, emit: v }) {
    const a = Ee(), L = g([]), C = s, I = v, V = g(!1), x = g(null);
    function A() {
      x.value = null, W.value = "", V.value = !0;
    }
    function j(p) {
      x.value = p, N.value = p.agent, W.value = "", V.value = !0;
    }
    d({ open: A });
    const T = me(), J = _e(), R = g([]), y = g({}), w = g(""), P = g(""), m = g(!1), B = g(!1), W = g(""), Z = g(0), N = g(C.selectedAgent || T.value.agents[0]?.id || "");
    pe(() => C.selectedAgent, (p) => {
      p && (N.value = p);
    });
    const S = K(() => T.value.agents.find((p) => p.id === N.value)), F = K(() => JSON.stringify({ driver: S.value, busy: B.value, error: W.value, saved: Z.value, account: x.value ? { id: x.value.id, label: x.value.label, credential_kind: x.value.credential_kind, endpoint: x.value.endpoint } : void 0, limits: T.value.account_limits })), ee = K(() => [...T.value.agents, ...[...new Set(R.value.map((p) => p.agent))].filter((p) => !T.value.agents.some((_) => _.id === p)).map((p) => ({ id: p, title: `Unavailable agent: ${p}`, icon: "tabler:terminal-2" }))].map((p) => ({ agent: p, accounts: R.value.filter((_) => _.agent === p.id && [_.label, p.title, _.credential_kind].join(" ").toLowerCase().includes(C.query.toLowerCase())) })).filter((p) => p.accounts.length));
    function se(p) {
      return T.value.agents.find((_) => _.id === p.agent)?.credentials.find((_) => _.id === p.credential_kind)?.label ?? p.credential_kind;
    }
    async function te(p) {
      const _ = [...new Set(p.filter((E) => !E.mine).map((E) => E.owner))].filter((E) => !(E in y.value)), O = await ot(_);
      a() && (y.value = { ...y.value, ...O });
    }
    const H = xe(async () => {
      try {
        const p = await Be(Q.accounts, (_) => _.map((O) => O.id), L, a, (_) => {
          R.value = _, m.value = !0, w.value = "";
        }, () => {
          H();
        });
        if (!a() || (await te(p), !a())) return;
        m.value = !0, w.value = "";
      } catch (p) {
        a() && (w.value = oe(p, "Could not load accounts."));
      }
    }, a);
    qe(() => L.value, () => {
      H();
    });
    const k = Re.runs(() => {
      H();
    });
    ye(k), $e(H);
    async function i(p, _) {
      w.value = "", P.value = "";
      try {
        if (await p(), !a()) return;
        await H();
      } catch (O) {
        a() && (w.value = oe(O, _));
      }
    }
    async function c(p) {
      if (!(p instanceof CustomEvent)) return;
      const _ = vt.safeParse(p.detail);
      if (B.value) return;
      if (!_.success || _.data.agent !== N.value || x.value && (!x.value.writable || _.data.credential_kind !== x.value.credential_kind)) {
        W.value = "Invalid account submission.";
        return;
      }
      const O = _.data;
      W.value = "", B.value = !0;
      try {
        if (x.value) {
          const E = await Q.updateAccount(x.value.id, {
            label: O.label,
            endpoint: O.endpoint ?? { base_url: "" },
            ...O.secret ? { secret: O.secret } : {}
          });
          if (!a()) return;
          P.value = E.health_error ? `Account saved, but its health could not be refreshed: ${E.health_error.message}` : "";
        } else await Q.createAccount(O);
        if (!a()) return;
        Z.value++, V.value = !1, await H();
      } catch (E) {
        a() && (W.value = oe(E, "Could not save the account."));
      } finally {
        a() && (B.value = !1);
      }
    }
    pe(R, (p) => I("count", p.length));
    const X = (p, _, O) => i(async () => {
      const E = await Q.updateAccount(p.id, _);
      a() && E.health_error && (P.value = `Account saved, but its health could not be refreshed: ${E.health_error.message}`);
    }, O), U = (p) => X(p, { enabled: !p.enabled }, "Could not update the account."), b = (p, _) => X(p, { label: _ }, "Could not rename the account.");
    async function $(p) {
      const _ = await We.confirm({
        header: "Delete account",
        message: `Delete account "${p.label}"? Tasks keep their history.`,
        icon: "tabler:trash",
        acceptLabel: "Delete",
        rejectLabel: "Cancel",
        acceptClass: "p-button-danger"
      });
      a() && _ && await i(() => Q.deleteAccount(p.id), "Could not delete the account.");
    }
    return Te(() => {
      ct("chestor-autocode-driver-account", { timeoutMs: 8e3 }).catch(() => {
        a() && (w.value = "The driver account card could not load.");
      });
    }), (p, _) => (t(), l("div", Ul, [
      w.value ? (t(), l("p", Sl, [
        D(u(w.value) + " ", 1),
        e("button", {
          type: "button",
          class: "ac-link kx-focus-outline",
          onClick: _[0] || (_[0] = //@ts-ignore
          (...O) => o(H) && o(H)(...O))
        }, "Retry")
      ])) : f("", !0),
      P.value ? (t(), l("p", Al, u(P.value), 1)) : f("", !0),
      !m.value && !w.value ? (t(), l("div", Tl, "Loading accounts…")) : f("", !0),
      m.value && !R.value.length ? (t(), l("div", Fl, [
        e("div", Ll, [
          q(o(M), { icon: "tabler:key" })
        ]),
        _[3] || (_[3] = e("div", { class: "kx-empty-title" }, "No accounts yet", -1)),
        _[4] || (_[4] = e("div", { class: "kx-empty-sub" }, "Add an API key, your own endpoint or a personal subscription login.", -1)),
        q(o(Ue), {
          label: "Add account",
          onClick: A
        }, {
          icon: fe(() => [
            q(o(M), { icon: "tabler:plus" })
          ]),
          _: 1
        })
      ])) : m.value && !ee.value.length ? (t(), l("div", Rl, [..._[5] || (_[5] = [
        e("div", { class: "kx-empty-title" }, "No matches", -1),
        e("div", { class: "kx-empty-sub" }, "Try another account or agent.", -1)
      ])])) : f("", !0),
      (t(!0), l(z, null, Y(ee.value, (O) => (t(), l("section", {
        key: O.agent.id,
        class: "ac-stack"
      }, [
        e("div", Pl, [
          e("h2", El, [
            q(o(M), {
              icon: o(we)(O.agent.id, o(T).agents)
            }, null, 8, ["icon"]),
            D(u(O.agent.title), 1)
          ]),
          e("span", Il, u(O.accounts.filter((E) => E.usable && o(Le)(E, o(J)) === "ready").length) + " of " + u(O.accounts.length) + " ready", 1)
        ]),
        e("ul", Nl, [
          (t(!0), l(z, null, Y(O.accounts, (E) => (t(), ae(Vl, {
            key: E.id,
            account: E,
            "kind-label": se(E),
            "owner-label": y.value[E.owner] || E.owner,
            onEdit: (le) => j(E),
            onToggle: (le) => U(E),
            onRename: (le) => b(E, le),
            onRemove: (le) => $(E)
          }, null, 8, ["account", "kind-label", "owner-label", "onEdit", "onToggle", "onRename", "onRemove"]))), 128))
        ])
      ]))), 128)),
      V.value ? (t(), ae(Ae, {
        key: 5,
        title: x.value ? "Edit account" : "Add account",
        busy: B.value,
        onClose: _[2] || (_[2] = (O) => V.value = !1)
      }, {
        default: fe(() => [
          e("div", Ol, [
            x.value ? f("", !0) : (t(), ae(Me, {
              key: 0,
              disabled: B.value,
              modelValue: N.value,
              "onUpdate:modelValue": _[1] || (_[1] = (O) => N.value = O),
              agents: o(T).agents
            }, null, 8, ["disabled", "modelValue", "agents"])),
            x.value ? f("", !0) : (t(), l("p", ql, "Tasks balance across your ready accounts automatically.")),
            S.value ? (t(), l("chestor-autocode-driver-account", {
              key: 2,
              "^config": F.value,
              onSubmit: c
            }, null, 40, Bl)) : (t(), l("p", Dl, "This account’s agent is unavailable."))
          ])
        ]),
        _: 1
      }, 8, ["title", "busy"])) : f("", !0)
    ]));
  }
}), Ml = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, jl = {
  key: 1,
  class: "kx-empty"
}, zl = { class: "ac-list" }, Jl = { class: "ac-account-main" }, Hl = { class: "ac-row-title" }, Gl = { class: "ac-row-name" }, Kl = { class: "ac-muted" }, Ql = {
  key: 0,
  class: "ac-muted ac-mono"
}, Xl = { class: "ac-row-actions" }, Yl = ["onClick"], Zl = ["onClick"], en = ["onClick"], tn = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, an = ["disabled"], ln = { class: "ac-field" }, nn = { class: "ac-field" }, on = ["value"], sn = { class: "ac-field" }, un = ["value"], dn = {
  key: 0,
  class: "ac-field"
}, cn = ["value"], rn = { class: "ac-field" }, vn = ["value"], pn = { class: "ac-field" }, gn = ["value"], fn = { class: "ac-field" }, hn = ["value"], mn = { class: "ac-field" }, kn = { class: "ac-field" }, bn = { class: "ac-field" }, yn = { class: "ac-field" }, $n = { class: "ac-field" }, wn = {
  key: 2,
  class: "ac-check"
}, _n = ["checked"], xn = { class: "ac-dialog-foot" }, Cn = ["disabled"], Vn = /* @__PURE__ */ re({
  __name: "profiles",
  props: {
    query: {}
  },
  emits: ["count"],
  setup(s, { expose: d, emit: v }) {
    const a = Ee(), L = s, C = v, I = me(), V = g([]), x = g([]), A = g([]), j = g([]), T = g(""), J = g(""), R = g(!0), y = g(!1), w = g(0), P = g(null), m = g(null), B = g(""), W = g(""), Z = g(""), N = K(() => I.value.agents.find((k) => k.id === m.value?.agent)), S = K(() => V.value.filter((k) => `${k.title} ${k.agent}`.toLowerCase().includes(L.query.toLowerCase()))), F = xe(async () => {
      try {
        const [k, i, c, X] = await Promise.all([Q.profiles(), Q.accounts(), Q.images(), Q.workspaces()]);
        if (!a()) return;
        V.value = k, x.value = i, A.value = c, j.value = X.workspaces, C("count", k.length), T.value = "";
      } catch (k) {
        a() && (T.value = oe(k, "Could not load profiles."));
      } finally {
        a() && (R.value = !1);
      }
    }, a);
    $e(F);
    function ee(k, i = !1) {
      P.value = k && !i ? k.id : null, m.value = k ? {
        title: k.title + (i ? " copy" : ""),
        agent: k.agent,
        account_id: k.account_id ?? "",
        account_pool: [...k.account_pool ?? []],
        image_id: k.image_id,
        workspace_id: k.workspace_id ?? "",
        tools: k.tools,
        isolation: k.isolation,
        repo_url: k.repo_url,
        repo_ref: k.repo_ref,
        run_timeout: k.run_timeout,
        options: JSON.parse(JSON.stringify(k.options)),
        unattended: k.unattended
      } : { title: "", agent: I.value.agents[0]?.id ?? "", image_id: "", options: {}, account_pool: [], account_id: "", workspace_id: "" }, B.value = k?.endpoint?.protocol ?? N.value?.endpoints[0] ?? "", W.value = k?.endpoint?.base_url ?? "", Z.value = k?.endpoint?.model ?? "", w.value = 0, J.value = "";
    }
    function se() {
      m.value && (m.value.account_id = "", m.value.account_pool = [], m.value.options = {}, B.value = N.value?.endpoints[0] ?? "", W.value = "", Z.value = "");
    }
    async function te() {
      if (!(!m.value || y.value || w.value)) {
        y.value = !0, J.value = "";
        try {
          const k = { ...m.value, account_pool: m.value.account_id ? [] : m.value.account_pool, endpoint: W.value ? { protocol: B.value, base_url: W.value.trim(), model: Z.value.trim() || void 0 } : { protocol: B.value, base_url: "" } };
          if (P.value ? await Q.updateProfile(P.value, k) : await Q.createProfile(k), !a()) return;
          m.value = null, await F();
        } catch (k) {
          a() && (J.value = oe(k, "Could not save the profile."));
        } finally {
          a() && (y.value = !1);
        }
      }
    }
    async function H(k) {
      if (await We.confirm({ header: "Delete profile", message: `Delete ${k.title}?`, acceptLabel: "Delete" }))
        try {
          await Q.deleteProfile(k.id), await F();
        } catch (i) {
          a() && (T.value = oe(i, "Could not delete the profile."));
        }
    }
    return d({ open: ee }), (k, i) => (t(), l("section", null, [
      T.value ? (t(), l("p", Ml, u(T.value), 1)) : f("", !0),
      !R.value && !T.value && !V.value.length ? (t(), l("p", jl, "Create a profile to reuse an agent, endpoint and task settings.")) : f("", !0),
      e("ul", zl, [
        (t(!0), l(z, null, Y(S.value, (c) => (t(), l("li", {
          key: c.id,
          class: "ac-row ac-account ac-hover-actions"
        }, [
          e("div", Jl, [
            e("div", Hl, [
              q(o(M), { icon: "tabler:robot" }),
              e("span", Gl, u(c.title), 1)
            ]),
            e("p", Kl, u(o(I).agents.find((X) => X.id === c.agent)?.title ?? c.agent) + " · " + u(c.endpoint?.model ?? c.options.model ?? "CLI default model"), 1),
            c.endpoint ? (t(), l("p", Ql, u(c.endpoint.base_url), 1)) : f("", !0)
          ]),
          e("div", Xl, [
            e("button", {
              type: "button",
              class: "ac-icon-btn kx-focus-outline",
              "aria-label": "Duplicate profile",
              onClick: (X) => ee(c, !0)
            }, [
              q(o(M), { icon: "tabler:copy" })
            ], 8, Yl),
            c.writable ? (t(), l("button", {
              key: 0,
              type: "button",
              class: "ac-icon-btn kx-focus-outline",
              "aria-label": "Edit profile",
              onClick: (X) => ee(c)
            }, [
              q(o(M), { icon: "tabler:pencil" })
            ], 8, Zl)) : f("", !0),
            c.deletable ? (t(), l("button", {
              key: 1,
              type: "button",
              class: "ac-icon-btn kx-focus-outline",
              "aria-label": "Delete profile",
              onClick: (X) => H(c)
            }, [
              q(o(M), { icon: "tabler:trash" })
            ], 8, en)) : f("", !0)
          ])
        ]))), 128))
      ]),
      m.value ? (t(), ae(Ae, {
        key: 2,
        title: P.value ? "Edit profile" : "Create profile",
        busy: y.value,
        onClose: i[17] || (i[17] = (c) => m.value = null)
      }, {
        default: fe(() => [
          e("form", {
            class: "ac-form",
            onSubmit: Se(te, ["prevent"])
          }, [
            J.value ? (t(), l("p", tn, u(J.value), 1)) : f("", !0),
            e("fieldset", {
              class: "ac-form",
              disabled: y.value
            }, [
              e("label", ln, [
                i[18] || (i[18] = e("span", null, "Title", -1)),
                G(e("input", {
                  "onUpdate:modelValue": i[0] || (i[0] = (c) => m.value.title = c),
                  "aria-label": "Profile title",
                  class: "kx-focus-halo",
                  required: "",
                  maxlength: "200"
                }, null, 512), [
                  [ie, m.value.title]
                ])
              ]),
              e("label", nn, [
                i[19] || (i[19] = e("span", null, "Agent", -1)),
                G(e("select", {
                  "onUpdate:modelValue": i[1] || (i[1] = (c) => m.value.agent = c),
                  class: "kx-focus-halo",
                  onChange: se
                }, [
                  (t(!0), l(z, null, Y(o(I).agents, (c) => (t(), l("option", {
                    key: c.id,
                    value: c.id
                  }, u(c.title), 9, on))), 128))
                ], 544), [
                  [ne, m.value.agent]
                ])
              ]),
              e("label", sn, [
                i[21] || (i[21] = e("span", null, "Account", -1)),
                G(e("select", {
                  "onUpdate:modelValue": i[2] || (i[2] = (c) => m.value.account_id = c),
                  class: "kx-focus-halo"
                }, [
                  i[20] || (i[20] = e("option", { value: "" }, "Auto balance", -1)),
                  (t(!0), l(z, null, Y(x.value.filter((c) => c.agent === m.value?.agent), (c) => (t(), l("option", {
                    key: c.id,
                    value: c.id
                  }, u(c.label), 9, un))), 128))
                ], 512), [
                  [ne, m.value.account_id]
                ])
              ]),
              m.value.account_id ? f("", !0) : (t(), l("label", dn, [
                i[22] || (i[22] = e("span", null, "Account pool (empty uses all usable accounts)", -1)),
                G(e("select", {
                  "onUpdate:modelValue": i[3] || (i[3] = (c) => m.value.account_pool = c),
                  multiple: "",
                  class: "kx-focus-halo"
                }, [
                  (t(!0), l(z, null, Y(x.value.filter((c) => c.agent === m.value?.agent), (c) => (t(), l("option", {
                    key: c.id,
                    value: c.id
                  }, u(c.label), 9, cn))), 128))
                ], 512), [
                  [ne, m.value.account_pool]
                ])
              ])),
              e("label", rn, [
                i[24] || (i[24] = e("span", null, "Image", -1)),
                G(e("select", {
                  "onUpdate:modelValue": i[4] || (i[4] = (c) => m.value.image_id = c),
                  required: "",
                  class: "kx-focus-halo"
                }, [
                  i[23] || (i[23] = e("option", { value: "" }, "Choose an image", -1)),
                  (t(!0), l(z, null, Y(A.value.filter((c) => c.agents.includes(m.value?.agent ?? "")), (c) => (t(), l("option", {
                    key: c.id,
                    value: c.id
                  }, u(c.label), 9, vn))), 128))
                ], 512), [
                  [ne, m.value.image_id]
                ])
              ]),
              e("label", pn, [
                i[26] || (i[26] = e("span", null, "Workspace", -1)),
                G(e("select", {
                  "onUpdate:modelValue": i[5] || (i[5] = (c) => m.value.workspace_id = c),
                  class: "kx-focus-halo"
                }, [
                  i[25] || (i[25] = e("option", { value: "" }, "Scratch directory", -1)),
                  (t(!0), l(z, null, Y(j.value, (c) => (t(), l("option", {
                    key: c.id,
                    value: c.id
                  }, u(c.name), 9, gn))), 128))
                ], 512), [
                  [ne, m.value.workspace_id]
                ])
              ]),
              e("label", null, [
                i[28] || (i[28] = D("Workspace isolation", -1)),
                G(e("select", {
                  "onUpdate:modelValue": i[6] || (i[6] = (c) => m.value.isolation = c),
                  class: "kx-focus-halo",
                  "aria-label": "Workspace isolation"
                }, [...i[27] || (i[27] = [
                  e("option", { value: void 0 }, "Workspace default", -1),
                  e("option", { value: "shared" }, "Shared checkout", -1),
                  e("option", { value: "worktree" }, "Private git worktree", -1)
                ])], 512), [
                  [ne, m.value.isolation]
                ])
              ]),
              N.value?.endpoints.length ? (t(), l(z, { key: 1 }, [
                e("label", fn, [
                  i[29] || (i[29] = e("span", null, "Endpoint protocol", -1)),
                  G(e("select", {
                    "onUpdate:modelValue": i[7] || (i[7] = (c) => B.value = c),
                    class: "kx-focus-halo"
                  }, [
                    (t(!0), l(z, null, Y(N.value.endpoints, (c) => (t(), l("option", {
                      key: c,
                      value: c
                    }, u(c), 9, hn))), 128))
                  ], 512), [
                    [ne, B.value]
                  ])
                ]),
                e("label", mn, [
                  i[30] || (i[30] = e("span", null, "Endpoint URL", -1)),
                  G(e("input", {
                    "onUpdate:modelValue": i[8] || (i[8] = (c) => W.value = c),
                    class: "kx-focus-halo",
                    placeholder: "Use account endpoint",
                    maxlength: "512"
                  }, null, 512), [
                    [ie, W.value]
                  ])
                ]),
                e("label", kn, [
                  i[31] || (i[31] = e("span", null, "Endpoint model", -1)),
                  G(e("input", {
                    "onUpdate:modelValue": i[9] || (i[9] = (c) => Z.value = c),
                    class: "kx-focus-halo",
                    maxlength: "200"
                  }, null, 512), [
                    [ie, Z.value]
                  ])
                ])
              ], 64)) : f("", !0),
              e("label", bn, [
                i[32] || (i[32] = e("span", null, "Repository URL", -1)),
                G(e("input", {
                  "onUpdate:modelValue": i[10] || (i[10] = (c) => m.value.repo_url = c),
                  class: "kx-focus-halo",
                  maxlength: "2000"
                }, null, 512), [
                  [ie, m.value.repo_url]
                ])
              ]),
              e("label", yn, [
                i[33] || (i[33] = e("span", null, "Repository ref", -1)),
                G(e("input", {
                  "onUpdate:modelValue": i[11] || (i[11] = (c) => m.value.repo_ref = c),
                  class: "kx-focus-halo",
                  maxlength: "200"
                }, null, 512), [
                  [ie, m.value.repo_ref]
                ])
              ]),
              e("label", $n, [
                i[34] || (i[34] = e("span", null, "Run timeout", -1)),
                G(e("input", {
                  "onUpdate:modelValue": i[12] || (i[12] = (c) => m.value.run_timeout = c),
                  class: "kx-focus-halo",
                  placeholder: "Use configured timeout",
                  maxlength: "64"
                }, null, 512), [
                  [ie, m.value.run_timeout]
                ])
              ]),
              N.value?.unattended ? (t(), l("label", wn, [
                e("input", {
                  checked: m.value.unattended !== !1,
                  onChange: i[13] || (i[13] = (c) => m.value.unattended = c.target.checked),
                  type: "checkbox",
                  class: "kx-focus-outline"
                }, null, 40, _n),
                i[35] || (i[35] = D("Unattended", -1))
              ])) : f("", !0),
              N.value ? (t(), ae(De, {
                key: N.value.id,
                modelValue: m.value.options,
                "onUpdate:modelValue": i[14] || (i[14] = (c) => m.value.options = c),
                options: N.value.options,
                defaults: m.value.unattended !== !1 ? N.value.unattended : {},
                onInvalid: i[15] || (i[15] = (c) => w.value = c)
              }, null, 8, ["modelValue", "options", "defaults"])) : f("", !0),
              e("footer", xn, [
                e("button", {
                  type: "button",
                  class: "ac-btn kx-focus-halo",
                  onClick: i[16] || (i[16] = (c) => m.value = null)
                }, "Cancel"),
                e("button", {
                  type: "submit",
                  class: "ac-btn primary kx-focus-halo",
                  disabled: y.value || !!w.value
                }, "Save", 8, Cn)
              ])
            ], 8, an)
          ], 32)
        ]),
        _: 1
      }, 8, ["title", "busy"])) : f("", !0)
    ]));
  }
}), Un = { class: "ac" }, Sn = {
  key: 1,
  class: "ac-bar"
}, An = {
  class: "ac-tabs",
  "aria-label": "Autocode views"
}, Tn = ["aria-pressed", "onClick"], Fn = {
  key: 2,
  class: "kx-err"
}, Ln = {
  key: 3,
  class: "kx-loading"
}, Rn = {
  key: 0,
  class: "kx-empty"
}, Pn = /* @__PURE__ */ re({
  __name: "autocode",
  setup(s) {
    const d = Ye(), v = Ze(), a = g(null);
    pe(() => d.value?.route, () => {
      a.value = null;
    });
    const L = K(() => a.value ?? d.value?.route ?? ""), C = K(() => {
      const N = /^\/?runs\/([^/]+)\/?$/.exec(L.value);
      try {
        return N ? decodeURIComponent(N[1]) : "";
      } catch {
        return "";
      }
    }), I = K(() => !!L.value && L.value !== "/" && !C.value);
    function V(N) {
      A.value = "tasks", a.value = N, v("navigate", { path: N });
    }
    const x = [
      { id: "tasks", label: "Tasks", icon: "tabler:player-play" },
      { id: "profiles", label: "Profiles", icon: "tabler:robot" },
      { id: "accounts", label: "Accounts", icon: "tabler:key" }
    ], A = g("tasks"), { catalog: j, error: T, load: J } = Ge(), R = g(""), y = g(0), w = g(null), P = g(null), m = g(null), B = g("");
    async function W(N) {
      N && (B.value = N), A.value = "accounts", R.value = "", await Fe(), m.value?.open();
    }
    function Z() {
      A.value === "tasks" ? w.value?.open() : A.value === "profiles" ? P.value?.open() : m.value?.open();
    }
    return (N, S) => (t(), l("div", Un, [
      !C.value && !I.value ? (t(), ae(Ke, {
        key: 0,
        title: "Autocode",
        subtitle: "Run coding agents with your accounts and workspaces.",
        count: `${y.value} ${A.value === "tasks" ? "task" : A.value === "profiles" ? "profile" : "account"}${y.value === 1 ? "" : "s"}`,
        action: A.value === "tasks" ? "New task" : A.value === "profiles" ? "Create profile" : "Add account",
        query: R.value,
        "onUpdate:query": S[0] || (S[0] = (F) => R.value = F),
        placeholder: A.value === "tasks" ? "Search tasks…" : A.value === "profiles" ? "Search profiles…" : "Search accounts…",
        onCreate: Z
      }, null, 8, ["count", "action", "query", "placeholder"])) : f("", !0),
      !C.value && !I.value ? (t(), l("div", Sn, [
        e("nav", An, [
          (t(), l(z, null, Y(x, (F) => e("button", {
            key: F.id,
            type: "button",
            class: ue(["ac-tab kx-focus-outline", { active: A.value === F.id }]),
            "aria-pressed": A.value === F.id,
            onClick: (ee) => {
              A.value !== F.id && (A.value = F.id, R.value = "", y.value = 0);
            }
          }, [
            q(o(M), {
              icon: F.icon
            }, null, 8, ["icon"]),
            D(" " + u(F.label), 1)
          ], 10, Tn)), 64))
        ])
      ])) : f("", !0),
      o(T) && !o(j) ? (t(), l("p", Fn, [
        D(u(o(T)) + " ", 1),
        e("button", {
          class: "ac-link kx-focus-outline",
          type: "button",
          onClick: S[1] || (S[1] = //@ts-ignore
          (...F) => o(J) && o(J)(...F))
        }, "Retry")
      ])) : o(j) ? (t(), l("main", {
        key: 4,
        class: ue(["ac-body", { "ac-detail-page": C.value || I.value }])
      }, [
        I.value ? (t(), l("div", Rn, [
          S[10] || (S[10] = e("h1", null, "Run not found", -1)),
          e("button", {
            type: "button",
            class: "ac-btn kx-focus-halo",
            onClick: S[2] || (S[2] = (F) => V(""))
          }, "Back to tasks")
        ])) : C.value || A.value === "tasks" ? (t(), ae(Ya, {
          key: 1,
          ref_key: "tasks",
          ref: w,
          query: R.value,
          "run-id": C.value,
          onOpen: S[3] || (S[3] = (F) => V("runs/" + encodeURIComponent(F))),
          onClose: S[4] || (S[4] = (F) => V("")),
          onCount: S[5] || (S[5] = (F) => y.value = F),
          onAgentChanged: S[6] || (S[6] = (F) => B.value = F),
          onGoto: W
        }, null, 8, ["query", "run-id"])) : A.value === "profiles" ? (t(), ae(Vn, {
          key: 2,
          ref_key: "profiles",
          ref: P,
          query: R.value,
          onCount: S[7] || (S[7] = (F) => y.value = F)
        }, null, 8, ["query"])) : (t(), ae(Wl, {
          key: 3,
          ref_key: "accounts",
          ref: m,
          query: R.value,
          "selected-agent": B.value,
          onCount: S[8] || (S[8] = (F) => y.value = F)
        }, null, 8, ["query", "selected-agent"]))
      ], 2)) : (t(), l("div", Ln, [
        q(o(M), {
          icon: "tabler:loader-2",
          class: "spin"
        }),
        S[9] || (S[9] = D(" Loading…", -1))
      ]))
    ]));
  }
}), En = { props: { type: "object", properties: { route: { type: "string", default: "", description: "Path relative to /autocode; runs/<run_id> opens a run." } } } }, In = {
  wippy: En
};
class Nn extends et {
  static get wippyConfig() {
    return {
      propsSchema: In.wippy.props,
      hostCssKeys: ["themeConfigUrl", "primeVueCssUrl", "iframeCssUrl"],
      inlineCss: Qe
    };
  }
  static get vueConfig() {
    return { rootComponent: Pn, plugins: [Xe] };
  }
}
rt(import.meta.url, Nn);
