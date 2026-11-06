import { u as ke, _ as Le, a as Be, b as Me, P as Oe } from "./app-dialog.vue_vue_type_script_setup_true_lang-DkqLDGJK.js";
import { defineComponent as ue, openBlock as n, createElementBlock as s, Fragment as Y, renderList as te, normalizeClass as ee, createVNode as L, unref as o, createTextVNode as q, toDisplayString as u, ref as c, computed as K, watch as ie, createElementVNode as e, withDirectives as ne, vModelText as re, createCommentVNode as d, isRef as ce, vModelSelect as ge, vModelCheckbox as We, createBlock as ae, onMounted as Ie, onUnmounted as ve, nextTick as be, withCtx as pe, withKeys as Re, withModifiers as Te } from "vue";
import { a as he, b as He, u as je } from "./wc-runtime-ClNbKZcC.js";
import { Icon as B } from "@iconify/vue";
import ye from "primevue/button";
import { b as me, d as _e, f as de, a as X, e as oe, g as fe, l as $e, h as we, i as Ue, t as Ge, s as xe, A as Je, c as Ve, u as Ee, r as Se, p as Ke } from "./presentation-CaNB3T5F.js";
import { d as ze, u as Fe, _ as Qe } from "./driver-options.vue_vue_type_script_setup_true_lang-DLZHHKYC.js";
import { config as Xe, loadByTagName as Ye, host as Ze } from "@wippy-fe/proxy";
import et from "primevue/toggleswitch";
import { a as tt } from "./driver-account-types-Br-slV5h.js";
const at = {
  key: 0,
  class: "ac-chips",
  role: "group",
  "aria-label": "Agent"
}, nt = ["disabled", "aria-pressed", "onClick"], lt = ["disabled", "value"], ot = ["value"], Ne = /* @__PURE__ */ ue({
  __name: "agent-picker",
  props: {
    agents: {},
    modelValue: {},
    disabled: { type: Boolean }
  },
  emits: ["update:modelValue"],
  setup(r) {
    return (P, D) => r.agents.length <= 6 ? (n(), s("div", at, [
      (n(!0), s(Y, null, te(r.agents, (a) => (n(), s("button", {
        key: a.id,
        disabled: r.disabled,
        type: "button",
        class: ee(["ac-chip kx-focus-halo", { active: r.modelValue === a.id }]),
        "aria-pressed": r.modelValue === a.id,
        onClick: (x) => P.$emit("update:modelValue", a.id)
      }, [
        L(o(B), {
          icon: o(me)(a.id, r.agents),
          "aria-hidden": "true"
        }, null, 8, ["icon"]),
        q(u(a.title), 1)
      ], 10, nt))), 128))
    ])) : (n(), s("select", {
      key: 1,
      disabled: r.disabled,
      class: "kx-focus-halo",
      "aria-label": "Agent",
      value: r.modelValue,
      onChange: D[0] || (D[0] = (a) => P.$emit("update:modelValue", a.target.value))
    }, [
      (n(!0), s(Y, null, te(r.agents, (a) => (n(), s("option", {
        key: a.id,
        value: a.id
      }, u(a.title), 9, ot))), 128))
    ], 40, lt));
  }
}), st = ["disabled"], ut = { class: "ac-field ac-composer" }, it = { class: "ac-field" }, ct = {
  key: 0,
  class: "ac-muted"
}, rt = {
  key: 1,
  class: "ac-muted"
}, dt = { class: "ac-picker-row" }, vt = { class: "ac-field" }, pt = { value: "" }, kt = ["value"], mt = { class: "ac-field" }, ft = ["value"], gt = { class: "ac-field" }, yt = ["value"], bt = { class: "ac-advanced" }, ht = { class: "ac-form" }, _t = { class: "ac-field" }, $t = { class: "ac-field" }, wt = { class: "ac-field" }, xt = {
  key: 0,
  class: "ac-check"
}, Ct = {
  key: 2,
  class: "kx-err",
  role: "alert"
}, At = { class: "ac-dialog-foot" }, Rt = ["disabled"], Tt = /* @__PURE__ */ ue({
  __name: "task-form",
  props: {
    accounts: {},
    images: {},
    workspaces: {}
  },
  emits: ["started", "goto", "agentChanged", "cancel", "busy"],
  setup(r, { emit: P }) {
    const D = r, a = P, x = ke(), M = c(null);
    function I() {
      const i = x.value.settings_path;
      i && M.value?.dispatchEvent(new CustomEvent("navigate", { detail: { path: i }, bubbles: !0, composed: !0 }));
    }
    const h = c({ agent: ze(x.value, D.accounts), account_id: "", image_id: "", workspace_id: "", repo_url: "" }), { now: y, driver: f, agentAccounts: N, ready: R, agentImages: W, invalidOptions: w, optionValues: _, normalizeConfig: $, selectAgent: U } = Fe(h, {
      catalog: () => x.value,
      accounts: () => D.accounts,
      images: () => D.images,
      workspaces: () => D.workspaces
    }, "live"), T = K({
      get: () => h.value.agent ?? "",
      set: (i) => {
        i !== h.value.agent && (h.value = U(i));
      }
    });
    function E(i) {
      return K({ get: () => h.value[i] ?? "", set: (l) => {
        h.value[i] = l;
      } });
    }
    const S = E("account_id"), V = E("image_id"), m = E("workspace_id"), k = E("repo_url"), J = E("repo_ref"), j = c(""), Q = c(""), Z = K({ get: () => _.value, set: (i) => {
      h.value.options = i;
    } }), O = K({ get: () => h.value.unattended !== !1, set: (i) => {
      h.value.unattended = i;
    } }), z = c(!1), H = c("");
    function se(i) {
      return _e(i, y.value) === "cooling" ? `${i.label} (cooling down until ${de(i.cooldown_until)})` : i.label;
    }
    ie(T, (i) => a("agentChanged", i), { immediate: !0 });
    let F;
    ie([T, S, V, m, k, J, j, Q, Z, O], () => {
      F = void 0;
    }, { deep: !0, flush: "sync" });
    async function g() {
      if (!z.value) {
        H.value = "", z.value = !0, a("busy", !0);
        try {
          const i = {
            agent: T.value,
            account_id: S.value,
            image_id: V.value,
            workspace_id: m.value,
            repo_url: k.value,
            repo_ref: J.value.trim() || void 0,
            timeout: j.value.trim() || void 0,
            prompt: Q.value,
            options: $(h.value).options ?? {},
            unattended: O.value
          }, l = JSON.stringify(i);
          (!F || F.snapshot !== l) && (F = { snapshot: l, key: crypto.randomUUID(), body: { ...i, options: JSON.parse(JSON.stringify(i.options)) } });
          const { run_id: t } = await X.startRun({ ...F.body, idempotency_key: F.key });
          F = void 0, Q.value = "", a("started", t);
        } catch (i) {
          H.value = oe(i, "Could not start the task.");
        } finally {
          z.value = !1, a("busy", !1);
        }
      }
    }
    return (i, l) => (n(), s("fieldset", {
      ref_key: "root",
      ref: M,
      class: "ac-form ac-new",
      disabled: z.value
    }, [
      e("label", ut, [
        l[13] || (l[13] = e("span", null, "Prompt", -1)),
        ne(e("textarea", {
          "onUpdate:modelValue": l[0] || (l[0] = (t) => Q.value = t),
          autofocus: "",
          rows: "8",
          class: "kx-focus-halo",
          placeholder: "What should the agent do?"
        }, null, 512), [
          [re, Q.value]
        ])
      ]),
      e("div", it, [
        l[14] || (l[14] = e("span", null, "Agent", -1)),
        L(Ne, {
          modelValue: T.value,
          "onUpdate:modelValue": l[1] || (l[1] = (t) => T.value = t),
          agents: o(x).agents
        }, null, 8, ["modelValue", "agents"])
      ]),
      T.value && !o(N).length ? (n(), s("p", ct, [
        q(" No " + u(o(f)?.title) + " accounts you can run on. ", 1),
        e("button", {
          class: "ac-link kx-focus-outline",
          type: "button",
          onClick: l[2] || (l[2] = (t) => a("goto", "accounts", T.value))
        }, "Add an account")
      ])) : d("", !0),
      o(W).length ? d("", !0) : (n(), s("p", rt, [
        q(" No image with " + u(o(f)?.title ?? T.value) + "; ask an administrator. ", 1),
        o(x).can_images && o(x).settings_path ? (n(), s("button", {
          key: 0,
          class: "ac-link kx-focus-outline",
          type: "button",
          onClick: I
        }, "Manage images")) : d("", !0)
      ])),
      e("div", dt, [
        e("label", vt, [
          l[15] || (l[15] = e("span", null, "Account", -1)),
          ne(e("select", {
            "onUpdate:modelValue": l[3] || (l[3] = (t) => ce(S) ? S.value = t : null),
            class: "kx-focus-halo"
          }, [
            e("option", pt, "Auto (" + u(o(R).length) + " ready)", 1),
            (n(!0), s(Y, null, te(o(N), (t) => (n(), s("option", {
              key: t.id,
              value: t.id
            }, u(se(t)), 9, kt))), 128))
          ], 512), [
            [ge, o(S)]
          ])
        ]),
        e("label", mt, [
          l[16] || (l[16] = e("span", null, "Image", -1)),
          ne(e("select", {
            "onUpdate:modelValue": l[4] || (l[4] = (t) => ce(V) ? V.value = t : null),
            class: "kx-focus-halo"
          }, [
            (n(!0), s(Y, null, te(o(W), (t) => (n(), s("option", {
              key: t.id,
              value: t.id
            }, u(t.label), 9, ft))), 128))
          ], 512), [
            [ge, o(V)]
          ])
        ]),
        e("label", gt, [
          l[18] || (l[18] = e("span", null, "Workspace", -1)),
          ne(e("select", {
            "onUpdate:modelValue": l[5] || (l[5] = (t) => ce(m) ? m.value = t : null),
            class: "kx-focus-halo"
          }, [
            l[17] || (l[17] = e("option", { value: "" }, "Scratch directory", -1)),
            (n(!0), s(Y, null, te(r.workspaces, (t) => (n(), s("option", {
              key: t.id,
              value: t.id
            }, u(t.name) + u(t.writable ? "" : " (read-only)"), 9, yt))), 128))
          ], 512), [
            [ge, o(m)]
          ])
        ])
      ]),
      e("details", bt, [
        l[23] || (l[23] = e("summary", { class: "kx-focus-outline" }, "Advanced", -1)),
        e("div", ht, [
          e("label", _t, [
            l[19] || (l[19] = e("span", null, "Git repository", -1)),
            ne(e("input", {
              "onUpdate:modelValue": l[6] || (l[6] = (t) => ce(k) ? k.value = t : null),
              class: "ac-mono kx-focus-halo",
              placeholder: "Optional: https://github.com/org/repo.git"
            }, null, 512), [
              [re, o(k)]
            ])
          ]),
          e("label", $t, [
            l[20] || (l[20] = e("span", null, "Repository ref", -1)),
            ne(e("input", {
              "onUpdate:modelValue": l[7] || (l[7] = (t) => ce(J) ? J.value = t : null),
              "aria-label": "Repository ref",
              class: "ac-mono kx-focus-halo",
              placeholder: "Default branch"
            }, null, 512), [
              [re, o(J)]
            ])
          ]),
          e("label", wt, [
            l[21] || (l[21] = e("span", null, "Run timeout", -1)),
            ne(e("input", {
              "onUpdate:modelValue": l[8] || (l[8] = (t) => j.value = t),
              maxlength: "64",
              class: "ac-mono kx-focus-halo",
              placeholder: "Use configured timeout"
            }, null, 512), [
              [re, j.value]
            ])
          ]),
          o(f)?.unattended ? (n(), s("label", xt, [
            ne(e("input", {
              "onUpdate:modelValue": l[9] || (l[9] = (t) => O.value = t),
              type: "checkbox",
              class: "kx-focus-outline"
            }, null, 512), [
              [We, O.value]
            ]),
            l[22] || (l[22] = q(" Unattended · skip permission prompts when the image allows it ", -1))
          ])) : d("", !0),
          o(f) ? (n(), ae(Qe, {
            key: o(f).id,
            modelValue: Z.value,
            "onUpdate:modelValue": l[10] || (l[10] = (t) => Z.value = t),
            options: o(f).options,
            locked: O.value && o(f).unattended ? o(f).unattended : {},
            onInvalid: l[11] || (l[11] = (t) => w.value = t)
          }, null, 8, ["modelValue", "options", "locked"])) : d("", !0)
        ])
      ]),
      H.value ? (n(), s("p", Ct, u(H.value), 1)) : d("", !0),
      e("footer", At, [
        e("button", {
          type: "button",
          class: "ac-btn kx-focus-halo",
          onClick: l[12] || (l[12] = (t) => a("cancel"))
        }, "Cancel"),
        e("button", {
          type: "button",
          class: "ac-btn primary kx-focus-halo",
          disabled: z.value || o(w) > 0 || !T.value || !(o(S) || o(R).length) || !o(V) || !Q.value.trim(),
          onClick: g
        }, [
          L(o(B), { icon: "tabler:player-play" }),
          q(" " + u(z.value ? "Starting…" : "Start"), 1)
        ], 8, Rt)
      ])
    ], 8, st));
  }
}), Lt = {
  key: 0,
  class: "kx-empty",
  role: "status"
}, It = {
  key: 1,
  class: "kx-err",
  role: "alert"
}, Ut = {
  key: 2,
  class: "kx-loading"
}, Vt = { class: "ac-detail-head" }, Et = { class: "ac-card-head" }, St = ["disabled"], Nt = { class: "ac-detail-title" }, qt = { class: "ac-run-meta ac-detail-meta" }, Pt = ["title"], Dt = { key: 0 }, Bt = { key: 1 }, Mt = { key: 2 }, Ot = { key: 3 }, Wt = { key: 4 }, Ht = { key: 5 }, jt = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, Gt = {
  class: "ac-detail-section",
  "aria-labelledby": "ac-prompt-heading"
}, Jt = { class: "ac-section-head" }, Kt = ["aria-expanded"], zt = {
  key: 1,
  class: "ac-detail-section ac-result",
  "aria-labelledby": "ac-result-heading"
}, Ft = { class: "ac-section-head" }, Qt = { id: "ac-result-heading" }, Xt = { class: "ac-row-actions" }, Yt = ["aria-expanded"], Zt = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, ea = {
  key: 2,
  class: "kx-err",
  role: "alert"
}, ta = {
  class: "ac-detail-section",
  "aria-labelledby": "ac-log-heading"
}, aa = { class: "ac-section-head" }, na = { class: "ac-muted" }, la = ["disabled"], oa = ["disabled"], sa = {
  class: "ac-stream",
  tabindex: "0",
  "aria-label": "Task log"
}, ua = { class: "ac-event-kind" }, ia = { class: "ac-event-text" }, ca = {
  key: 0,
  class: "ac-muted ac-pulse"
}, ra = {
  key: 1,
  class: "ac-muted"
}, da = 500, va = /* @__PURE__ */ ue({
  __name: "run-detail",
  props: {
    runId: {},
    accounts: {},
    images: {},
    workspaces: {}
  },
  setup(r) {
    const P = r, D = ke(), a = c(null), x = c([]), M = c(0), I = c(!1), h = c(!1);
    let y;
    const f = c(!1), N = c(""), R = c(!1), W = c(null), w = c(!1), _ = c("");
    let $ = null;
    const U = c(!1), T = c(!1), E = c(!1), S = c(""), V = fe(), m = K(() => (a.value?.prompt.length ?? 0) > 500 || (a.value?.prompt.split(`
`).length ?? 0) > 5), k = K(() => (a.value?.result.length ?? 0) > 1800 || (a.value?.result.split(`
`).length ?? 0) > 10);
    let J = !0, j = !0, Q, Z;
    const O = (b) => b.status === "queued" || b.status === "running";
    function z() {
      $ && (j = $.scrollHeight - $.scrollTop - $.clientHeight < 40);
    }
    Ie(() => {
      $ = W.value?.closest(".ac") ?? null, $?.addEventListener("scroll", z, { passive: !0 });
    }), ve(() => {
      $?.removeEventListener("scroll", z), $ = null;
    });
    const H = xe(async () => {
      try {
        const b = y ?? (a.value ? void 0 : 0);
        y = void 0;
        let v = await X.run(P.runId, b === void 0 ? M.value : void 0, b);
        if (!J) return;
        if (b === void 0 && (v.more || f.value && v.events.length)) {
          if (v = await X.run(P.runId, void 0, 0), !J) return;
          x.value = v.events, I.value = v.more, f.value = !1;
        } else if (b !== void 0)
          x.value = v.events, I.value = v.more, f.value = b !== 0;
        else if (v.events.length) {
          const G = Math.max(0, x.value.length + v.events.length - da);
          G && x.value.splice(0, G), x.value.push(...v.events), I.value = I.value || G > 0;
        }
        R.value = !1, a.value = v.run, f.value || (M.value = v.next_seq), await be(), J && j && $ && $.scrollTo({ top: $.scrollHeight }), N.value = "";
      } catch (b) {
        if (!J) return;
        R.value = b instanceof Je && b.code === "autocode.run_not_found", R.value && (a.value = null, x.value = []), N.value = R.value ? "" : oe(b, "Could not load the task.");
      } finally {
        h.value = !1;
      }
    });
    function se() {
      h.value || !x.value.length || (j = !1, h.value = !0, y = x.value[0].seq, H());
    }
    function F() {
      h.value || (j = !0, h.value = !0, y = 0, H());
    }
    const g = $e.run(P.runId, () => {
      H();
    });
    he(H), ve(() => {
      J = !1, g(), clearTimeout(Z), clearTimeout(Q);
    });
    async function i() {
      try {
        await X.cancelRun(P.runId), await H();
      } catch (b) {
        N.value = oe(b, "Could not cancel the task.");
      }
    }
    async function l(b) {
      try {
        await navigator.clipboard.writeText(b);
      } catch {
        const v = document.createElement("textarea"), G = W.value?.getRootNode(), Ae = G instanceof ShadowRoot || G instanceof Document ? G.activeElement : null, De = Ae instanceof HTMLElement ? Ae : null;
        v.value = b, v.readOnly = !0, v.style.cssText = "position:fixed;opacity:0;pointer-events:none;", W.value?.append(v);
        try {
          if (v.select(), !document.execCommand("copy")) throw new Error("Copy failed");
        } finally {
          v.remove(), De?.focus({ preventScroll: !0 });
        }
      }
    }
    async function t() {
      try {
        await l(a.value?.result ?? ""), E.value = !0, S.value = "", clearTimeout(Z), Z = setTimeout(() => {
          E.value = !1;
        }, 2e3);
      } catch {
        S.value = "Could not copy. Select the result text to copy it.";
      }
    }
    async function p() {
      try {
        const b = new URL(Xe.env.APP_API_URL || "/", window.location.href);
        await l(new URL(`/autocode/runs/${encodeURIComponent(P.runId)}`, b).href), w.value = !0, _.value = "", clearTimeout(Q), Q = setTimeout(() => {
          w.value = !1;
        }, 2e3);
      } catch {
        _.value = "Could not copy the link. Try again.";
      }
    }
    function A() {
      T.value = !T.value;
    }
    function C(b) {
      return typeof b.options?.model == "string" ? b.options.model : "";
    }
    function le(b) {
      return P.accounts.find((v) => v.id === b)?.label ?? "Unlisted account";
    }
    function qe(b) {
      return P.workspaces.find((v) => v.id === b)?.name ?? "Unlisted workspace";
    }
    function Pe(b) {
      return P.images.find((v) => v.id === b)?.label ?? "Unlisted image";
    }
    function Ce(b) {
      const v = [];
      return b.usage.input_tokens !== void 0 && v.push(`${b.usage.input_tokens} input`), b.usage.output_tokens !== void 0 && v.push(`${b.usage.output_tokens} output`), b.usage.cached_tokens !== void 0 && v.push(`${b.usage.cached_tokens} cached`), v.length ? `${v.join(" · ")} tokens` : "";
    }
    return (b, v) => (n(), s("section", {
      ref_key: "detail",
      ref: W,
      class: "ac-form ac-detail"
    }, [
      R.value ? (n(), s("div", Lt, [...v[2] || (v[2] = [
        e("h1", null, "Run not found", -1),
        e("p", null, "This run does not exist or you do not have access to it.", -1)
      ])])) : d("", !0),
      N.value ? (n(), s("p", It, [
        q(u(N.value) + " ", 1),
        e("button", {
          type: "button",
          class: "ac-link kx-focus-outline",
          onClick: v[0] || (v[0] = //@ts-ignore
          (...G) => o(H) && o(H)(...G))
        }, "Retry")
      ])) : d("", !0),
      !a.value && !N.value && !R.value ? (n(), s("div", Ut, [
        L(o(B), {
          icon: "tabler:loader-2",
          class: "spin"
        }),
        v[3] || (v[3] = q(" Loading the task…", -1))
      ])) : a.value ? (n(), s(Y, { key: 3 }, [
        e("header", Vt, [
          e("div", Et, [
            e("span", {
              class: ee(["kx-tag-sm ac-tone", a.value.status])
            }, u(a.value.status), 3),
            e("button", {
              type: "button",
              class: "ac-btn kx-focus-halo",
              "aria-live": "polite",
              onClick: p
            }, [
              L(o(B), {
                icon: w.value ? "tabler:check" : "tabler:link"
              }, null, 8, ["icon"]),
              q(u(w.value ? "Link copied" : "Copy link"), 1)
            ]),
            O(a.value) ? (n(), s("button", {
              key: 0,
              type: "button",
              class: "ac-btn danger kx-focus-halo",
              disabled: a.value.cancel_requested,
              onClick: i
            }, [
              L(o(B), { icon: "tabler:player-stop" }),
              q(" " + u(a.value.cancel_requested ? "Cancelling…" : "Cancel"), 1)
            ], 8, St)) : d("", !0)
          ]),
          e("h1", Nt, u(a.value.prompt.split(`
`)[0]), 1),
          e("div", qt, [
            e("span", null, [
              L(o(B), {
                icon: o(me)(a.value.agent, o(D).agents)
              }, null, 8, ["icon"]),
              q(u(o(D).agents.find((G) => G.id === a.value?.agent)?.title ?? a.value.agent), 1)
            ]),
            e("span", null, u(le(a.value.account_id)), 1),
            e("span", null, u(Pe(a.value.image_id)), 1),
            e("span", {
              title: o(de)(a.value.started_at || a.value.created_at)
            }, u(a.value.started_at ? "Started" : "Queued") + " " + u(o(we)(a.value.started_at || a.value.created_at, o(V))), 9, Pt),
            a.value.started_at ? (n(), s("span", Dt, u(o(Ue)(a.value, o(V))) + " " + u(O(a.value) ? "elapsed" : "duration"), 1)) : d("", !0),
            a.value.timeout_ms ? (n(), s("span", Bt, u(o(Ge)(a.value.timeout_ms)), 1)) : d("", !0),
            e("span", null, u(a.value.unattended ? "Unattended" : "Attended"), 1),
            a.value.workflow ? (n(), s("span", Mt, "Workflow")) : d("", !0),
            a.value.workspace_id ? (n(), s("span", Ot, u(qe(a.value.workspace_id)), 1)) : d("", !0),
            C(a.value) ? (n(), s("span", Wt, u(C(a.value)), 1)) : d("", !0),
            Ce(a.value) ? (n(), s("span", Ht, u(Ce(a.value)), 1)) : d("", !0)
          ])
        ]),
        _.value ? (n(), s("p", jt, u(_.value), 1)) : d("", !0),
        e("section", Gt, [
          e("div", Jt, [
            v[4] || (v[4] = e("h3", { id: "ac-prompt-heading" }, "Prompt", -1)),
            m.value ? (n(), s("button", {
              key: 0,
              type: "button",
              class: "ac-link kx-focus-outline",
              "aria-expanded": U.value,
              "aria-controls": "ac-prompt-text",
              onClick: v[1] || (v[1] = (G) => U.value = !U.value)
            }, u(U.value ? "Collapse prompt" : "Expand prompt"), 9, Kt)) : d("", !0)
          ]),
          e("pre", {
            id: "ac-prompt-text",
            class: ee(["ac-pre ac-prompt", { expanded: U.value || !m.value }])
          }, [
            e("span", null, u(a.value.prompt), 1)
          ], 2)
        ]),
        a.value.result ? (n(), s("section", zt, [
          e("div", Ft, [
            e("h3", Qt, u(a.value.status === "succeeded" ? "Result" : "Partial result"), 1),
            e("div", Xt, [
              k.value ? (n(), s("button", {
                key: 0,
                type: "button",
                class: "ac-link kx-focus-outline",
                "aria-expanded": T.value,
                "aria-controls": "ac-result-text",
                onClick: A
              }, u(T.value ? "Collapse result" : "Expand result"), 9, Yt)) : d("", !0),
              e("button", {
                type: "button",
                class: "ac-btn kx-focus-halo",
                onClick: t
              }, [
                L(o(B), {
                  icon: E.value ? "tabler:check" : "tabler:copy"
                }, null, 8, ["icon"]),
                q(u(E.value ? "Copied" : "Copy"), 1)
              ])
            ])
          ]),
          S.value ? (n(), s("p", Zt, u(S.value), 1)) : d("", !0),
          e("pre", {
            id: "ac-result-text",
            class: ee(["ac-pre ac-result-text", { expanded: T.value }]),
            tabindex: "0",
            "aria-label": "Result"
          }, u(a.value.result), 3)
        ])) : d("", !0),
        a.value.error ? (n(), s("p", ea, u(a.value.error), 1)) : d("", !0),
        e("section", ta, [
          e("div", aa, [
            v[5] || (v[5] = e("h3", { id: "ac-log-heading" }, "Log", -1)),
            e("span", na, u(x.value.length) + " events", 1)
          ]),
          I.value ? (n(), s("button", {
            key: 0,
            type: "button",
            class: "ac-link kx-focus-outline",
            disabled: h.value,
            onClick: se
          }, u(h.value ? "Loading…" : "Load earlier"), 9, la)) : d("", !0),
          f.value ? (n(), s("button", {
            key: 1,
            type: "button",
            class: "ac-link kx-focus-outline",
            disabled: h.value,
            onClick: F
          }, "Latest", 8, oa)) : d("", !0),
          e("div", sa, [
            (n(!0), s(Y, null, te(x.value, (G) => (n(), s("div", {
              key: G.seq,
              class: ee(["ac-event", G.kind])
            }, [
              e("span", ua, u(G.kind), 1),
              e("pre", ia, u(G.text), 1)
            ], 2))), 128)),
            O(a.value) ? (n(), s("div", ca, "Working…")) : x.value.length ? d("", !0) : (n(), s("div", ra, "No log events."))
          ])
        ])
      ], 64)) : d("", !0)
    ], 512));
  }
}), pa = {
  key: 0,
  "aria-label": "Task details"
}, ka = { class: "ac-detail-back" }, ma = {
  key: 1,
  class: "kx-loading"
}, fa = { key: 2 }, ga = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, ya = {
  key: 1,
  class: "kx-empty"
}, ba = { class: "kx-empty-ico" }, ha = { class: "kx-empty-sub" }, _a = {
  key: 2,
  class: "kx-empty"
}, $a = {
  key: 3,
  class: "ac-run-list"
}, wa = ["onClick"], xa = { class: "ac-run-copy" }, Ca = { class: "ac-run-title-row" }, Aa = { class: "ac-run-title" }, Ra = {
  key: 0,
  class: "kx-tag-sm ac-tone"
}, Ta = { class: "ac-run-meta" }, La = ["title"], Ia = { key: 0 }, Ua = {
  key: 4,
  class: "ac-load-more"
}, Va = /* @__PURE__ */ ue({
  __name: "tasks",
  props: {
    query: {},
    runId: {}
  },
  emits: ["goto", "agentChanged", "count", "open", "close"],
  setup(r, { expose: P, emit: D }) {
    const a = Ve(), x = c([]), M = r, I = D, h = ke(), y = c(!1), f = c(!1);
    P({ open: () => {
      y.value = !0;
    } });
    const N = c([]), R = c([]), W = c([]), w = c([]), _ = c(), $ = c(!1), U = c(""), T = fe(), E = c(!1);
    let S = 0, V = 1;
    async function m() {
      const g = [];
      let i;
      for (let l = 0; l < V; l++) {
        const t = await X.runs(i);
        if (!a() || (g.push(...t.runs), i = t.next_cursor, !i)) break;
      }
      return { runs: g, next_cursor: i };
    }
    const k = xe(async () => {
      S++, E.value = !0;
      try {
        const [g, i, l, t] = await Se(
          () => Promise.all([X.accounts(), X.images(), m(), X.workspaces()]),
          ([p, A, , C]) => [...p, ...A, ...C.workspaces].map((le) => le.id),
          x,
          a
        );
        if (!a()) return;
        N.value = g, R.value = i, w.value = l.runs, _.value = l.next_cursor, W.value = t.workspaces, $.value = !0, U.value = "";
      } catch (g) {
        a() && (U.value = oe(g, "Could not load tasks."));
      } finally {
        a() && (E.value = !1);
      }
    }, a), J = $e.runs(() => {
      k();
    });
    Ee(() => x.value, () => {
      k();
    }), he(k), ve(J);
    const j = c(!1);
    async function Q() {
      if (!(!_.value || j.value || E.value)) {
        j.value = !0;
        try {
          const g = S, i = await X.runs(_.value);
          if (!a() || S !== g) return;
          const l = new Set(w.value.map((t) => t.id));
          w.value.push(...i.runs.filter((t) => !l.has(t.id))), _.value = i.next_cursor, V++;
        } catch (g) {
          a() && (U.value = oe(g, "Could not load more tasks."));
        } finally {
          a() && (j.value = !1);
        }
      }
    }
    function Z(g) {
      y.value = !1, I("open", g);
    }
    const O = K(() => N.value.some((g) => g.usable && g.enabled)), z = K(() => w.value.filter((g) => [g.prompt_summary, g.status, g.agent, H(g.agent), F(g.account_id)].join(" ").toLowerCase().includes(M.query.trim().toLowerCase())));
    ie(() => w.value.length, (g) => I("count", g));
    function H(g) {
      return h.value.agents.find((i) => i.id === g)?.title ?? g;
    }
    function se(g) {
      return R.value.find((i) => i.id === g)?.label ?? "Unlisted image";
    }
    function F(g) {
      return N.value.find((i) => i.id === g)?.label ?? "Unlisted account";
    }
    return (g, i) => r.runId ? (n(), s("section", pa, [
      e("div", ka, [
        e("button", {
          type: "button",
          class: "ac-btn kx-focus-halo",
          onClick: i[0] || (i[0] = (l) => I("close"))
        }, [
          L(o(B), { icon: "tabler:arrow-left" }),
          i[9] || (i[9] = q(" Back to tasks", -1))
        ])
      ]),
      (n(), ae(va, {
        key: r.runId,
        "run-id": r.runId,
        accounts: N.value,
        images: R.value,
        workspaces: W.value
      }, null, 8, ["run-id", "accounts", "images", "workspaces"]))
    ])) : $.value ? (n(), s("div", fa, [
      U.value ? (n(), s("p", ga, [
        q(u(U.value) + " ", 1),
        e("button", {
          class: "ac-link kx-focus-outline",
          type: "button",
          onClick: i[2] || (i[2] = //@ts-ignore
          (...l) => o(k) && o(k)(...l))
        }, "Retry")
      ])) : d("", !0),
      w.value.length ? z.value.length ? d("", !0) : (n(), s("div", _a, [...i[12] || (i[12] = [
        e("div", { class: "kx-empty-title" }, "No matches", -1),
        e("div", { class: "kx-empty-sub" }, "Try another task, agent or account.", -1)
      ])])) : (n(), s("div", ya, [
        e("div", ba, [
          L(o(B), { icon: "tabler:terminal-2" })
        ]),
        i[11] || (i[11] = e("div", { class: "kx-empty-title" }, "No tasks yet", -1)),
        e("div", ha, u(O.value ? "Give a coding agent a task and follow its progress here." : "Add an account to give your coding agent a place to start."), 1),
        L(o(ye), {
          label: O.value ? "New task" : "Add account",
          onClick: i[3] || (i[3] = (l) => O.value ? y.value = !0 : I("goto"))
        }, {
          icon: pe(() => [
            L(o(B), { icon: "tabler:plus" })
          ]),
          _: 1
        }, 8, ["label"])
      ])),
      z.value.length ? (n(), s("ul", $a, [
        (n(!0), s(Y, null, te(z.value, (l) => (n(), s("li", {
          key: l.id,
          class: "ac-run"
        }, [
          e("button", {
            type: "button",
            class: "ac-run-main kx-focus-halo",
            onClick: (t) => I("open", l.id)
          }, [
            e("span", xa, [
              e("span", Ca, [
                e("span", Aa, u(l.prompt_summary.split(`
`)[0]), 1),
                e("span", {
                  class: ee(["kx-tag-sm ac-tone", l.status])
                }, u(l.status), 3),
                l.workflow ? (n(), s("span", Ra, "Workflow")) : d("", !0)
              ]),
              e("span", Ta, [
                e("span", null, [
                  L(o(B), {
                    icon: o(me)(l.agent, o(h).agents)
                  }, null, 8, ["icon"]),
                  q(u(H(l.agent)), 1)
                ]),
                e("span", null, u(F(l.account_id)), 1),
                e("span", null, u(se(l.image_id)), 1),
                e("span", {
                  title: o(de)(l.started_at || l.created_at)
                }, u(o(we)(l.started_at || l.created_at, o(T))), 9, La),
                l.started_at ? (n(), s("span", Ia, u(o(Ue)(l, o(T))) + " " + u(l.status === "running" ? "elapsed" : "duration"), 1)) : d("", !0)
              ])
            ]),
            L(o(B), {
              icon: "tabler:chevron-right",
              class: "ac-run-chevron ac-muted"
            })
          ], 8, wa)
        ]))), 128))
      ])) : d("", !0),
      _.value ? (n(), s("div", Ua, [
        L(o(ye), {
          label: "Load more",
          loading: j.value,
          disabled: E.value,
          onClick: Q
        }, null, 8, ["loading", "disabled"])
      ])) : d("", !0),
      y.value ? (n(), ae(Le, {
        key: 5,
        title: "New task",
        busy: f.value,
        wide: "",
        onClose: i[8] || (i[8] = (l) => y.value = !1)
      }, {
        default: pe(() => [
          L(Tt, {
            onBusy: i[4] || (i[4] = (l) => f.value = l),
            accounts: N.value,
            images: R.value,
            workspaces: W.value,
            onStarted: Z,
            onCancel: i[5] || (i[5] = (l) => y.value = !1),
            onAgentChanged: i[6] || (i[6] = (l) => I("agentChanged", l)),
            onGoto: i[7] || (i[7] = (l, t) => I("goto", t))
          }, null, 8, ["accounts", "images", "workspaces"])
        ]),
        _: 1
      }, 8, ["busy"])) : d("", !0)
    ])) : (n(), s("div", ma, [
      U.value ? (n(), s(Y, { key: 0 }, [
        q(u(U.value) + " ", 1),
        e("button", {
          class: "ac-link kx-focus-outline",
          type: "button",
          onClick: i[1] || (i[1] = //@ts-ignore
          (...l) => o(k) && o(k)(...l))
        }, "Retry")
      ], 64)) : (n(), s(Y, { key: 1 }, [
        L(o(B), {
          icon: "tabler:loader-2",
          class: "spin"
        }),
        i[10] || (i[10] = q(" Loading tasks…", -1))
      ], 64))
    ]));
  }
}), Ea = { class: "ac-account-main" }, Sa = { class: "ac-row-title" }, Na = ["onKeydown"], qa = {
  key: 1,
  class: "ac-row-name"
}, Pa = {
  key: 2,
  class: "kx-tag-sm ac-tone"
}, Da = { class: "ac-muted" }, Ba = ["title"], Ma = { key: 1 }, Oa = {
  key: 0,
  class: "ac-muted"
}, Wa = {
  key: 1,
  class: "ac-muted ac-strong"
}, Ha = {
  key: 2,
  class: "ac-muted"
}, ja = {
  key: 3,
  class: "ac-muted ac-mono"
}, Ga = {
  key: 4,
  class: "ac-muted"
}, Ja = {
  key: 5,
  class: "kx-err ac-small"
}, Ka = { class: "ac-row-actions" }, za = /* @__PURE__ */ ue({
  __name: "account-row",
  props: {
    account: {},
    kindLabel: {},
    ownerLabel: {}
  },
  emits: ["toggle", "rename", "remove", "edit"],
  setup(r, { emit: P }) {
    const D = r, a = P, x = { ready: "ready", cooling: "cooling down", disabled: "disabled", unavailable: "unavailable" }, M = fe(), I = K(() => _e(D.account, M.value)), h = K(() => D.account.mine ? "" : `Shared with you by ${D.ownerLabel}`), y = c(!1), f = c(""), N = c(null);
    function R() {
      f.value = D.account.label, y.value = !0, be(() => N.value?.select());
    }
    function W() {
      if (!y.value) return;
      y.value = !1;
      const w = f.value.trim();
      w && w !== D.account.label && a("rename", w);
    }
    return (w, _) => (n(), s("li", {
      class: ee(["ac-row ac-account ac-hover-actions", { off: !r.account.enabled || !r.account.usable }])
    }, [
      e("div", Ea, [
        e("div", Sa, [
          e("span", {
            class: ee(["kx-tag-sm ac-tone", I.value])
          }, u(x[I.value]), 3),
          y.value ? ne((n(), s("input", {
            key: 0,
            ref_key: "input",
            ref: N,
            "onUpdate:modelValue": _[0] || (_[0] = ($) => f.value = $),
            class: "ac-rename kx-focus-halo",
            "aria-label": "Account label",
            onKeydown: [
              Re(Te(W, ["prevent"]), ["enter"]),
              _[1] || (_[1] = Re(Te(($) => y.value = !1, ["prevent"]), ["escape"]))
            ],
            onBlur: W
          }, null, 40, Na)), [
            [re, f.value]
          ]) : (n(), s("span", qa, u(r.account.label), 1)),
          r.account.subscription ? (n(), s("span", Pa, "personal")) : d("", !0)
        ]),
        e("div", Da, [
          q(u(r.kindLabel) + " · " + u(r.account.runs_day) + " " + u(r.account.runs_day === 1 ? "task" : "tasks") + " in the last 24 hours · " + u(r.account.failures_day) + " " + u(r.account.failures_day === 1 ? "failure" : "failures") + " · ", 1),
          r.account.last_used_at ? (n(), s("span", {
            key: 0,
            title: o(de)(r.account.last_used_at)
          }, "last used " + u(o(we)(r.account.last_used_at, o(M))), 9, Ba)) : (n(), s("span", Ma, "never used"))
        ]),
        h.value ? (n(), s("div", Oa, u(h.value), 1)) : d("", !0),
        r.account.usable ? r.account.subscription ? (n(), s("div", Ha, "Subscription login: personal use only")) : d("", !0) : (n(), s("div", Wa, [
          L(o(B), { icon: "tabler:lock" }),
          q(" " + u(r.account.unavailable_reason || "Account unavailable for tasks"), 1)
        ])),
        r.account.endpoint ? (n(), s("div", ja, u(r.account.endpoint.protocol) + " · " + u(r.account.endpoint.base_url) + u(r.account.endpoint.model ? " · " + r.account.endpoint.model : ""), 1)) : d("", !0),
        I.value === "cooling" ? (n(), s("div", Ga, "Available at " + u(o(de)(r.account.cooldown_until)), 1)) : d("", !0),
        r.account.last_error ? (n(), s("div", Ja, u(r.account.last_error), 1)) : d("", !0)
      ]),
      e("div", Ka, [
        r.account.writable ? (n(), ae(o(et), {
          key: 0,
          "model-value": r.account.enabled,
          "aria-label": r.account.enabled ? "Disable account" : "Enable account",
          onChange: _[2] || (_[2] = ($) => a("toggle"))
        }, null, 8, ["model-value", "aria-label"])) : d("", !0),
        r.account.writable ? (n(), s("button", {
          key: 1,
          type: "button",
          class: "ac-icon-btn kx-focus-outline",
          title: "Rename",
          "aria-label": "Rename account",
          onClick: R
        }, [
          L(o(B), { icon: "tabler:pencil" })
        ])) : d("", !0),
        r.account.writable ? (n(), s("button", {
          key: 2,
          type: "button",
          class: "ac-icon-btn kx-focus-outline",
          title: "Edit credential and endpoint",
          "aria-label": "Edit account",
          onClick: _[3] || (_[3] = ($) => a("edit"))
        }, [
          L(o(B), { icon: "tabler:key" })
        ])) : d("", !0),
        r.account.deletable ? (n(), s("button", {
          key: 3,
          type: "button",
          class: "ac-icon-btn kx-focus-outline",
          title: "Delete",
          "aria-label": "Delete account",
          onClick: _[4] || (_[4] = ($) => a("remove"))
        }, [
          L(o(B), { icon: "tabler:trash" })
        ])) : d("", !0)
      ])
    ], 2));
  }
}), Fa = { class: "ac-stack" }, Qa = {
  key: 0,
  class: "kx-err inline"
}, Xa = {
  key: 1,
  class: "kx-err inline",
  role: "status"
}, Ya = {
  key: 2,
  class: "kx-loading"
}, Za = {
  key: 3,
  class: "kx-empty"
}, en = { class: "kx-empty-ico" }, tn = {
  key: 4,
  class: "kx-empty"
}, an = { class: "ac-card-head" }, nn = { class: "ac-card-title" }, ln = { class: "ac-muted" }, on = { class: "ac-account-grid" }, sn = { class: "ac-form" }, un = {
  key: 1,
  class: "ac-hint"
}, cn = ["^config"], rn = {
  key: 3,
  class: "kx-err",
  role: "alert"
}, dn = /* @__PURE__ */ ue({
  __name: "accounts",
  props: {
    query: {},
    selectedAgent: {}
  },
  emits: ["count"],
  setup(r, { expose: P, emit: D }) {
    const a = Ve(), x = c([]), M = r, I = D, h = c(!1), y = c(null);
    function f() {
      y.value = null, S.value = "", h.value = !0;
    }
    function N(t) {
      y.value = t, m.value = t.agent, S.value = "", h.value = !0;
    }
    P({ open: f });
    const R = ke(), W = fe(), w = c([]), _ = c({}), $ = c(""), U = c(""), T = c(!1), E = c(!1), S = c(""), V = c(0), m = c(M.selectedAgent || R.value.agents[0]?.id || "");
    ie(() => M.selectedAgent, (t) => {
      t && (m.value = t);
    });
    const k = K(() => R.value.agents.find((t) => t.id === m.value)), J = K(() => JSON.stringify({ driver: k.value, busy: E.value, error: S.value, saved: V.value, account: y.value ? { id: y.value.id, label: y.value.label, credential_kind: y.value.credential_kind, endpoint: y.value.endpoint } : void 0, limits: R.value.account_limits })), j = K(() => [...R.value.agents, ...[...new Set(w.value.map((t) => t.agent))].filter((t) => !R.value.agents.some((p) => p.id === t)).map((t) => ({ id: t, title: `Unavailable agent: ${t}`, icon: "tabler:terminal-2" }))].map((t) => ({ agent: t, accounts: w.value.filter((p) => p.agent === t.id && [p.label, t.title, p.credential_kind].join(" ").toLowerCase().includes(M.query.toLowerCase())) })).filter((t) => t.accounts.length));
    function Q(t) {
      return R.value.agents.find((p) => p.id === t.agent)?.credentials.find((p) => p.id === t.credential_kind)?.label ?? t.credential_kind;
    }
    async function Z(t) {
      const p = [...new Set(t.filter((C) => !C.mine).map((C) => C.owner))].filter((C) => !(C in _.value)), A = await Ke(p);
      a() && (_.value = { ..._.value, ...A });
    }
    const O = xe(async () => {
      try {
        const t = await Se(X.accounts, (p) => p.map((A) => A.id), x, a);
        if (!a() || (w.value = t, await Z(t), !a())) return;
        T.value = !0, $.value = "";
      } catch (t) {
        a() && ($.value = oe(t, "Could not load accounts."));
      }
    }, a);
    Ee(() => x.value, () => {
      O();
    });
    const z = $e.runs(() => {
      O();
    });
    ve(z), he(O);
    async function H(t, p) {
      $.value = "", U.value = "";
      try {
        if (await t(), !a()) return;
        await O();
      } catch (A) {
        a() && ($.value = oe(A, p));
      }
    }
    async function se(t) {
      if (!(t instanceof CustomEvent)) return;
      const p = tt.safeParse(t.detail);
      if (E.value) return;
      if (!p.success || p.data.agent !== m.value || y.value && !y.value.writable) {
        S.value = "Invalid account submission.";
        return;
      }
      const A = p.data;
      S.value = "", E.value = !0;
      try {
        if (y.value) {
          const C = await X.updateAccount(y.value.id, {
            label: A.label,
            endpoint: A.endpoint ?? { base_url: "" },
            ...A.secret ? { secret: A.secret } : {}
          });
          if (!a()) return;
          U.value = C.health_error ? `Account saved, but its health could not be refreshed: ${C.health_error.message}` : "";
        } else await X.createAccount(A);
        if (!a()) return;
        V.value++, h.value = !1, await O();
      } catch (C) {
        a() && (S.value = oe(C, "Could not save the account."));
      } finally {
        a() && (E.value = !1);
      }
    }
    ie(w, (t) => I("count", t.length));
    const F = (t, p, A) => H(async () => {
      const C = await X.updateAccount(t.id, p);
      a() && C.health_error && (U.value = `Account saved, but its health could not be refreshed: ${C.health_error.message}`);
    }, A), g = (t) => F(t, { enabled: !t.enabled }, "Could not update the account."), i = (t, p) => F(t, { label: p }, "Could not rename the account.");
    async function l(t) {
      const p = await Ze.confirm({
        header: "Delete account",
        message: `Delete account "${t.label}"? Tasks keep their history.`,
        icon: "tabler:trash",
        acceptLabel: "Delete",
        rejectLabel: "Cancel",
        acceptClass: "p-button-danger"
      });
      a() && p && await H(() => X.deleteAccount(t.id), "Could not delete the account.");
    }
    return Ie(() => {
      Ye("chestor-autocode-driver-account", { timeoutMs: 8e3 }).catch(() => {
        a() && ($.value = "The driver account card could not load.");
      });
    }), (t, p) => (n(), s("div", Fa, [
      $.value ? (n(), s("p", Qa, [
        q(u($.value) + " ", 1),
        e("button", {
          type: "button",
          class: "ac-link kx-focus-outline",
          onClick: p[0] || (p[0] = //@ts-ignore
          (...A) => o(O) && o(O)(...A))
        }, "Retry")
      ])) : d("", !0),
      U.value ? (n(), s("p", Xa, u(U.value), 1)) : d("", !0),
      !T.value && !$.value ? (n(), s("div", Ya, "Loading accounts…")) : d("", !0),
      T.value && !w.value.length ? (n(), s("div", Za, [
        e("div", en, [
          L(o(B), { icon: "tabler:key" })
        ]),
        p[3] || (p[3] = e("div", { class: "kx-empty-title" }, "No accounts yet", -1)),
        p[4] || (p[4] = e("div", { class: "kx-empty-sub" }, "Add an API key, your own endpoint or a personal subscription login.", -1)),
        L(o(ye), {
          label: "Add account",
          onClick: f
        }, {
          icon: pe(() => [
            L(o(B), { icon: "tabler:plus" })
          ]),
          _: 1
        })
      ])) : T.value && !j.value.length ? (n(), s("div", tn, [...p[5] || (p[5] = [
        e("div", { class: "kx-empty-title" }, "No matches", -1),
        e("div", { class: "kx-empty-sub" }, "Try another account or agent.", -1)
      ])])) : d("", !0),
      (n(!0), s(Y, null, te(j.value, (A) => (n(), s("section", {
        key: A.agent.id,
        class: "ac-stack"
      }, [
        e("div", an, [
          e("h2", nn, [
            L(o(B), {
              icon: o(me)(A.agent.id, o(R).agents)
            }, null, 8, ["icon"]),
            q(u(A.agent.title), 1)
          ]),
          e("span", ln, u(A.accounts.filter((C) => C.usable && o(_e)(C, o(W)) === "ready").length) + " of " + u(A.accounts.length) + " ready", 1)
        ]),
        e("ul", on, [
          (n(!0), s(Y, null, te(A.accounts, (C) => (n(), ae(za, {
            key: C.id,
            account: C,
            "kind-label": Q(C),
            "owner-label": _.value[C.owner] || C.owner,
            onEdit: (le) => N(C),
            onToggle: (le) => g(C),
            onRename: (le) => i(C, le),
            onRemove: (le) => l(C)
          }, null, 8, ["account", "kind-label", "owner-label", "onEdit", "onToggle", "onRename", "onRemove"]))), 128))
        ])
      ]))), 128)),
      h.value ? (n(), ae(Le, {
        key: 5,
        title: y.value ? "Edit account" : "Add account",
        busy: E.value,
        onClose: p[2] || (p[2] = (A) => h.value = !1)
      }, {
        default: pe(() => [
          e("div", sn, [
            y.value ? d("", !0) : (n(), ae(Ne, {
              key: 0,
              disabled: E.value,
              modelValue: m.value,
              "onUpdate:modelValue": p[1] || (p[1] = (A) => m.value = A),
              agents: o(R).agents
            }, null, 8, ["disabled", "modelValue", "agents"])),
            y.value ? d("", !0) : (n(), s("p", un, "Tasks balance across your ready accounts automatically.")),
            k.value ? (n(), s("chestor-autocode-driver-account", {
              key: 2,
              "^config": J.value,
              onSubmit: se
            }, null, 40, cn)) : (n(), s("p", rn, "This account’s agent is unavailable."))
          ])
        ]),
        _: 1
      }, 8, ["title", "busy"])) : d("", !0)
    ]));
  }
}), vn = { class: "ac" }, pn = {
  key: 1,
  class: "ac-bar"
}, kn = {
  class: "ac-tabs",
  "aria-label": "Autocode views"
}, mn = ["aria-pressed", "onClick"], fn = {
  key: 2,
  class: "kx-err"
}, gn = {
  key: 3,
  class: "kx-loading"
}, yn = {
  key: 0,
  class: "kx-empty"
}, bn = /* @__PURE__ */ ue({
  __name: "autocode",
  setup(r) {
    const P = He(), D = je(), a = c(null);
    ie(() => P.value?.route, () => {
      a.value = null;
    });
    const x = K(() => a.value ?? P.value?.route ?? ""), M = K(() => {
      const V = /^\/?runs\/([^/]+)\/?$/.exec(x.value);
      try {
        return V ? decodeURIComponent(V[1]) : "";
      } catch {
        return "";
      }
    }), I = K(() => !!x.value && x.value !== "/" && !M.value);
    function h(V) {
      f.value = "tasks", a.value = V, D("navigate", { path: V });
    }
    const y = [
      { id: "tasks", label: "Tasks", icon: "tabler:player-play" },
      { id: "accounts", label: "Accounts", icon: "tabler:key" }
    ], f = c("tasks"), { catalog: N, error: R, load: W } = Be(), w = c(""), _ = c(0), $ = c(null), U = c(null), T = c("");
    async function E(V) {
      V && (T.value = V), f.value = "accounts", w.value = "", await be(), U.value?.open();
    }
    function S() {
      f.value === "tasks" ? $.value?.open() : U.value?.open();
    }
    return (V, m) => (n(), s("div", vn, [
      !M.value && !I.value ? (n(), ae(Me, {
        key: 0,
        title: "Autocode",
        subtitle: "Run coding agents with your accounts and workspaces.",
        count: `${_.value} ${f.value === "tasks" ? "task" : "account"}${_.value === 1 ? "" : "s"}`,
        action: f.value === "tasks" ? "New task" : "Add account",
        query: w.value,
        "onUpdate:query": m[0] || (m[0] = (k) => w.value = k),
        placeholder: f.value === "tasks" ? "Search tasks…" : "Search accounts…",
        onCreate: S
      }, null, 8, ["count", "action", "query", "placeholder"])) : d("", !0),
      !M.value && !I.value ? (n(), s("div", pn, [
        e("nav", kn, [
          (n(), s(Y, null, te(y, (k) => e("button", {
            key: k.id,
            type: "button",
            class: ee(["ac-tab kx-focus-outline", { active: f.value === k.id }]),
            "aria-pressed": f.value === k.id,
            onClick: (J) => {
              f.value !== k.id && (f.value = k.id, w.value = "", _.value = 0);
            }
          }, [
            L(o(B), {
              icon: k.icon
            }, null, 8, ["icon"]),
            q(" " + u(k.label), 1)
          ], 10, mn)), 64))
        ])
      ])) : d("", !0),
      o(R) && !o(N) ? (n(), s("p", fn, [
        q(u(o(R)) + " ", 1),
        e("button", {
          class: "ac-link kx-focus-outline",
          type: "button",
          onClick: m[1] || (m[1] = //@ts-ignore
          (...k) => o(W) && o(W)(...k))
        }, "Retry")
      ])) : o(N) ? (n(), s("main", {
        key: 4,
        class: ee(["ac-body", { "ac-detail-page": M.value || I.value }])
      }, [
        I.value ? (n(), s("div", yn, [
          m[9] || (m[9] = e("h1", null, "Run not found", -1)),
          e("button", {
            type: "button",
            class: "ac-btn kx-focus-halo",
            onClick: m[2] || (m[2] = (k) => h(""))
          }, "Back to tasks")
        ])) : M.value || f.value === "tasks" ? (n(), ae(Va, {
          key: 1,
          ref_key: "tasks",
          ref: $,
          query: w.value,
          "run-id": M.value,
          onOpen: m[3] || (m[3] = (k) => h("runs/" + encodeURIComponent(k))),
          onClose: m[4] || (m[4] = (k) => h("")),
          onCount: m[5] || (m[5] = (k) => _.value = k),
          onAgentChanged: m[6] || (m[6] = (k) => T.value = k),
          onGoto: E
        }, null, 8, ["query", "run-id"])) : (n(), ae(dn, {
          key: 2,
          ref_key: "accounts",
          ref: U,
          query: w.value,
          "selected-agent": T.value,
          onCount: m[7] || (m[7] = (k) => _.value = k)
        }, null, 8, ["query", "selected-agent"]))
      ], 2)) : (n(), s("div", gn, [
        L(o(B), {
          icon: "tabler:loader-2",
          class: "spin"
        }),
        m[8] || (m[8] = q(" Loading…", -1))
      ]))
    ]));
  }
}), In = {
  rootComponent: bn,
  plugins: [Oe]
};
export {
  In as mountConfig
};
