import { u as $e, s as He, c as qe, B as Ge, f as Ke, a as Qe, b as Xe, P as Ye } from "./wc-runtime-CEQ5gZTA.js";
import { defineComponent as re, openBlock as t, createElementBlock as l, Fragment as z, renderList as Z, normalizeClass as ce, createVNode as P, unref as o, createTextVNode as M, toDisplayString as i, ref as p, computed as X, onMounted as Ue, watch as pe, createElementVNode as e, withDirectives as Q, vModelText as ue, vModelSelect as de, createCommentVNode as f, isRef as fe, vModelCheckbox as Ze, createBlock as oe, onUnmounted as ye, nextTick as Te, withCtx as me, mergeProps as be, renderSlot as et, withKeys as Be, withModifiers as _e } from "vue";
import { Icon as j } from "@iconify/vue";
import { host as we, config as tt, loadByTagName as at } from "@wippy-fe/proxy";
import { u as ke, s as Se, _ as Le, a as lt, b as nt } from "./app-dialog.vue_vue_type_script_setup_true_lang-Dl1DHcqw.js";
import { b as xe, a as Y, e as se, d as Fe, f as he, g as Ce, l as Re, h as Ee, i as De, t as ot, s as Ve, A as st, c as Ie, u as Ne, r as Pe, p as it } from "./presentation-Cex1VGvG.js";
import { d as ut, e as dt, u as ct, _ as Me, a as je } from "./trait-tools.vue_vue_type_script_setup_true_lang-Cyg37CmC.js";
import { a as rt } from "./driver-account-types-Ci_eiejv.js";
const vt = {
  key: 0,
  class: "ac-chips",
  role: "group",
  "aria-label": "Agent"
}, pt = ["disabled", "aria-pressed", "onClick"], gt = ["disabled", "value"], ft = ["value"], We = /* @__PURE__ */ re({
  __name: "agent-picker",
  props: {
    agents: {},
    modelValue: {},
    disabled: { type: Boolean }
  },
  emits: ["update:modelValue"],
  setup(s) {
    return (d, v) => s.agents.length <= 6 ? (t(), l("div", vt, [
      (t(!0), l(z, null, Z(s.agents, (a) => (t(), l("button", {
        key: a.id,
        disabled: s.disabled,
        type: "button",
        class: ce(["ac-chip kx-focus-halo", { active: s.modelValue === a.id }]),
        "aria-pressed": s.modelValue === a.id,
        onClick: (F) => d.$emit("update:modelValue", a.id)
      }, [
        P(o(j), {
          icon: o(xe)(a.id, s.agents),
          "aria-hidden": "true"
        }, null, 8, ["icon"]),
        M(i(a.title), 1)
      ], 10, pt))), 128))
    ])) : (t(), l("select", {
      key: 1,
      disabled: s.disabled,
      class: "kx-focus-halo",
      "aria-label": "Agent",
      value: s.modelValue,
      onChange: v[0] || (v[0] = (a) => d.$emit("update:modelValue", a.target.value))
    }, [
      (t(!0), l(z, null, Z(s.agents, (a) => (t(), l("option", {
        key: a.id,
        value: a.id
      }, i(a.title), 9, ft))), 128))
    ], 40, gt));
  }
}), mt = ["disabled"], ht = { class: "ac-field ac-composer" }, kt = { class: "ac-field" }, bt = ["value"], yt = { class: "ac-field" }, _t = {
  key: 0,
  class: "ac-muted"
}, $t = {
  key: 1,
  class: "ac-muted"
}, wt = { class: "ac-picker-row" }, xt = { class: "ac-field" }, Ct = ["value"], Vt = { value: "" }, At = ["value"], St = { class: "ac-field" }, Ut = ["value"], Tt = ["value"], Lt = { class: "ac-field" }, Ft = ["value"], Rt = ["value"], Et = { class: "ac-advanced" }, It = { class: "ac-form" }, Nt = { class: "ac-field" }, Pt = { class: "ac-field" }, Ot = { class: "ac-field" }, qt = {
  key: 0,
  class: "ac-check"
}, Bt = {
  key: 2,
  class: "kx-err",
  role: "alert"
}, Dt = { class: "ac-dialog-foot" }, Mt = ["disabled"], jt = /* @__PURE__ */ re({
  __name: "task-form",
  props: {
    accounts: {},
    images: {},
    workspaces: {}
  },
  emits: ["started", "goto", "agentChanged", "cancel", "busy"],
  setup(s, { emit: d }) {
    const v = s, a = d, F = ke(), A = p(null), I = p([]), S = p(""), U = p({}), T = X(() => I.value.find((c) => c.id === S.value));
    Ue(async () => {
      try {
        I.value = await Y.profiles();
      } catch (c) {
        ve.value = se(c, "Could not load profiles.");
      }
    });
    function q() {
      U.value = {};
    }
    function E(c) {
      S.value ? U.value = { ...U.value, ...c } : L.value = { ...L.value, ...c };
    }
    function H() {
      const c = F.value.settings_path;
      c && A.value?.dispatchEvent(new CustomEvent("navigate", { detail: { path: c }, bubbles: !0, composed: !0 }));
    }
    const L = p({ agent: ut(F.value, v.accounts), account_id: "", image_id: "", workspace_id: "", repo_url: "" }), x = X(() => dt(S.value ? U.value : L.value, T.value)), { now: _, driver: R, agentAccounts: W, ready: B, agentImages: m, invalidOptions: ee, optionValues: D, invalidImage: V, invalidAccount: C, invalidWorkspace: ae, selectAgent: le } = ct(x, {
      catalog: () => F.value,
      accounts: () => v.accounts,
      images: () => v.images,
      workspaces: () => v.workspaces
    }, "live", () => !!S.value), K = X({
      get: () => x.value.agent ?? "",
      set: (c) => {
        if (c === x.value.agent) return;
        const r = le(c);
        E({ agent: c, account_id: r.account_id, image_id: r.image_id, options: r.options, unattended: r.unattended });
      }
    });
    function G(c) {
      return X({ get: () => x.value[c] ?? "", set: (r) => E({ [c]: r }) });
    }
    const te = G("account_id"), J = G("image_id"), b = G("workspace_id"), u = G("repo_url"), n = G("repo_ref"), h = X({ get: () => x.value.run_timeout ?? "", set: (c) => E({ run_timeout: c }) }), k = p(""), g = X({ get: () => D.value, set: (c) => E({ options: c }) }), $ = X({ get: () => x.value.unattended ?? !!R.value?.unattended, set: (c) => E({ unattended: c }) }), O = X({ get: () => x.value.tools, set: (c) => E({ tools: c }) }), N = p(!1), ne = p(!1), ve = p("");
    function Ae(c) {
      return Fe(c, _.value) === "cooling" ? `${c.label} (cooling down${c.cooldown_until ? " until " + he(c.cooldown_until) : ""})` : c.label;
    }
    pe(K, (c) => a("agentChanged", c), { immediate: !0 });
    let ie;
    pe([S, K, te, J, b, u, n, h, k, g, $, O], () => {
      ie = void 0;
    }, { deep: !0, flush: "sync" });
    async function w() {
      if (!(ne.value || N.value)) {
        ve.value = "", ne.value = !0, a("busy", !0);
        try {
          const c = {
            tools: O.value,
            agent: K.value,
            account_id: te.value,
            image_id: J.value,
            workspace_id: b.value,
            repo_url: u.value,
            repo_ref: n.value.trim() || void 0,
            timeout: h.value.trim() || void 0,
            prompt: k.value,
            options: x.value.options ?? {},
            unattended: $.value
          }, { run_timeout: r, ...y } = U.value, ge = S.value ? {
            profile_id: S.value,
            prompt: k.value,
            options: x.value.options ?? {},
            ...y,
            ...r !== void 0 ? { timeout: r } : {}
          } : c, Oe = JSON.stringify(ge);
          (!ie || ie.snapshot !== Oe) && (ie = { snapshot: Oe, key: crypto.randomUUID(), body: { ...ge, options: JSON.parse(JSON.stringify(ge.options)) } });
          const { run_id: ze } = await Y.startRun({ ...ie.body, idempotency_key: ie.key });
          ie = void 0, k.value = "", a("started", ze);
        } catch (c) {
          ve.value = se(c, "Could not start the task.");
        } finally {
          ne.value = !1, a("busy", !1);
        }
      }
    }
    return (c, r) => (t(), l("fieldset", {
      ref_key: "root",
      ref: A,
      class: "ac-form ac-new",
      disabled: ne.value
    }, [
      e("label", ht, [
        r[16] || (r[16] = e("span", null, "Prompt", -1)),
        Q(e("textarea", {
          "onUpdate:modelValue": r[0] || (r[0] = (y) => k.value = y),
          autofocus: "",
          rows: "8",
          class: "kx-focus-halo",
          placeholder: "What should the agent do?"
        }, null, 512), [
          [ue, k.value]
        ])
      ]),
      e("label", kt, [
        r[18] || (r[18] = e("span", null, "Profile", -1)),
        Q(e("select", {
          "onUpdate:modelValue": r[1] || (r[1] = (y) => S.value = y),
          "aria-label": "Profile",
          class: "kx-focus-halo",
          onChange: q
        }, [
          r[17] || (r[17] = e("option", { value: "" }, "Custom task", -1)),
          (t(!0), l(z, null, Z(I.value, (y) => (t(), l("option", {
            key: y.id,
            value: y.id
          }, i(y.title), 9, bt))), 128))
        ], 544), [
          [de, S.value]
        ])
      ]),
      e("div", yt, [
        r[19] || (r[19] = e("span", null, "Agent", -1)),
        P(We, {
          modelValue: K.value,
          "onUpdate:modelValue": r[2] || (r[2] = (y) => K.value = y),
          agents: o(F).agents
        }, null, 8, ["modelValue", "agents"])
      ]),
      K.value && !o(W).length ? (t(), l("p", _t, [
        M(" No " + i(o(R)?.title) + " accounts you can run on. ", 1),
        e("button", {
          class: "ac-link kx-focus-outline",
          type: "button",
          onClick: r[3] || (r[3] = (y) => a("goto", "accounts", K.value))
        }, "Add an account")
      ])) : f("", !0),
      o(m).length ? f("", !0) : (t(), l("p", $t, [
        M(" No usable image with " + i(o(R)?.title ?? K.value) + ". " + i(o(F).can_images ? "Prepare an image in Autocode management." : "Ask an administrator to prepare and share an image.") + " ", 1),
        o(F).can_images && o(F).settings_path ? (t(), l("button", {
          key: 0,
          class: "ac-link kx-focus-outline",
          type: "button",
          onClick: H
        }, "Manage images")) : f("", !0)
      ])),
      e("div", wt, [
        e("label", xt, [
          r[20] || (r[20] = e("span", null, "Account", -1)),
          Q(e("select", {
            "onUpdate:modelValue": r[4] || (r[4] = (y) => fe(te) ? te.value = y : null),
            class: "kx-focus-halo"
          }, [
            S.value && o(C) ? (t(), l("option", {
              key: 0,
              value: o(te)
            }, i(o(te)) + " (unavailable)", 9, Ct)) : f("", !0),
            e("option", Vt, "Auto (" + i(o(B).length) + " ready)", 1),
            (t(!0), l(z, null, Z(o(W), (y) => (t(), l("option", {
              key: y.id,
              value: y.id
            }, i(Ae(y)), 9, At))), 128))
          ], 512), [
            [de, o(te)]
          ])
        ]),
        e("label", St, [
          r[21] || (r[21] = e("span", null, "Image", -1)),
          Q(e("select", {
            "onUpdate:modelValue": r[5] || (r[5] = (y) => fe(J) ? J.value = y : null),
            class: "kx-focus-halo"
          }, [
            S.value && o(V) && o(J) ? (t(), l("option", {
              key: 0,
              value: o(J)
            }, i(o(J)) + " (unavailable)", 9, Ut)) : f("", !0),
            (t(!0), l(z, null, Z(o(m), (y) => (t(), l("option", {
              key: y.id,
              value: y.id
            }, i(y.label), 9, Tt))), 128))
          ], 512), [
            [de, o(J)]
          ])
        ]),
        e("label", Lt, [
          r[23] || (r[23] = e("span", null, "Workspace", -1)),
          Q(e("select", {
            "onUpdate:modelValue": r[6] || (r[6] = (y) => fe(b) ? b.value = y : null),
            class: "kx-focus-halo"
          }, [
            r[22] || (r[22] = e("option", { value: "" }, "Scratch directory", -1)),
            S.value && o(ae) ? (t(), l("option", {
              key: 0,
              value: o(b)
            }, i(o(b)) + " (unavailable)", 9, Ft)) : f("", !0),
            (t(!0), l(z, null, Z(s.workspaces, (y) => (t(), l("option", {
              key: y.id,
              value: y.id
            }, i(y.name) + i(y.writable ? "" : " (read-only)"), 9, Rt))), 128))
          ], 512), [
            [de, o(b)]
          ])
        ])
      ]),
      e("details", Et, [
        r[28] || (r[28] = e("summary", { class: "kx-focus-outline" }, "Advanced", -1)),
        e("div", It, [
          e("label", Nt, [
            r[24] || (r[24] = e("span", null, "Git repository", -1)),
            Q(e("input", {
              "onUpdate:modelValue": r[7] || (r[7] = (y) => fe(u) ? u.value = y : null),
              class: "ac-mono kx-focus-halo",
              placeholder: "Optional: https://github.com/org/repo.git"
            }, null, 512), [
              [ue, o(u)]
            ])
          ]),
          e("label", Pt, [
            r[25] || (r[25] = e("span", null, "Repository ref", -1)),
            Q(e("input", {
              "onUpdate:modelValue": r[8] || (r[8] = (y) => fe(n) ? n.value = y : null),
              "aria-label": "Repository ref",
              class: "ac-mono kx-focus-halo",
              placeholder: "Default branch"
            }, null, 512), [
              [ue, o(n)]
            ])
          ]),
          e("label", Ot, [
            r[26] || (r[26] = e("span", null, "Run timeout", -1)),
            Q(e("input", {
              "onUpdate:modelValue": r[9] || (r[9] = (y) => h.value = y),
              maxlength: "64",
              class: "ac-mono kx-focus-halo",
              placeholder: "Use configured timeout"
            }, null, 512), [
              [ue, h.value]
            ])
          ]),
          o(R)?.unattended ? (t(), l("label", qt, [
            Q(e("input", {
              "onUpdate:modelValue": r[10] || (r[10] = (y) => $.value = y),
              type: "checkbox",
              class: "kx-focus-outline"
            }, null, 512), [
              [Ze, $.value]
            ]),
            r[27] || (r[27] = M(" Unattended · skip permission prompts when the image allows it ", -1))
          ])) : f("", !0),
          P(Me, {
            modelValue: O.value,
            "onUpdate:modelValue": r[11] || (r[11] = (y) => O.value = y),
            agent: K.value,
            onInvalid: r[12] || (r[12] = (y) => N.value = y)
          }, null, 8, ["modelValue", "agent"]),
          o(R) ? (t(), oe(je, {
            key: S.value + o(R).id,
            modelValue: g.value,
            "onUpdate:modelValue": r[13] || (r[13] = (y) => g.value = y),
            options: o(R).options,
            defaults: { ...$.value ? o(R).unattended : {}, ...T.value?.options },
            onInvalid: r[14] || (r[14] = (y) => ee.value = y)
          }, null, 8, ["modelValue", "options", "defaults"])) : f("", !0)
        ])
      ]),
      ve.value ? (t(), l("p", Bt, i(ve.value), 1)) : f("", !0),
      e("footer", Dt, [
        e("button", {
          type: "button",
          class: "ac-btn kx-focus-halo",
          onClick: r[15] || (r[15] = (y) => a("cancel"))
        }, "Cancel"),
        e("button", {
          type: "button",
          class: "ac-btn primary kx-focus-halo",
          disabled: ne.value || N.value || o(ee) > 0 || !S.value && (!K.value || !(o(te) || o(B).length) || !o(J)) || !k.value.trim(),
          onClick: w
        }, [
          P(o(j), { icon: "tabler:player-play" }),
          M(" " + i(ne.value ? "Starting…" : "Start"), 1)
        ], 8, Mt)
      ])
    ], 8, mt));
  }
}), Wt = {
  key: 0,
  class: "kx-empty",
  role: "status"
}, Jt = {
  key: 1,
  class: "kx-err",
  role: "alert"
}, zt = {
  key: 2,
  class: "kx-loading"
}, Ht = { class: "ac-detail-head" }, Gt = { class: "ac-card-head" }, Kt = ["disabled"], Qt = { class: "ac-detail-title" }, Xt = { class: "ac-run-meta ac-detail-meta" }, Yt = ["title"], Zt = { key: 0 }, ea = { key: 1 }, ta = { key: 2 }, aa = { key: 3 }, la = { key: 4 }, na = { key: 5 }, oa = { class: "ac-detail-section" }, sa = { class: "ac-pre" }, ia = {
  key: 0,
  class: "ac-muted"
}, ua = {
  key: 0,
  class: "ac-detail-section",
  "aria-label": "Usage by model"
}, da = {
  key: 1,
  class: "kx-err",
  role: "alert"
}, ca = {
  class: "ac-detail-section",
  "aria-labelledby": "ac-prompt-heading"
}, ra = { class: "ac-section-head" }, va = ["aria-expanded"], pa = {
  key: 2,
  class: "ac-detail-section ac-result",
  "aria-labelledby": "ac-result-heading"
}, ga = { class: "ac-section-head" }, fa = { id: "ac-result-heading" }, ma = { class: "ac-row-actions" }, ha = ["aria-expanded"], ka = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, ba = {
  key: 3,
  class: "kx-err",
  role: "alert"
}, ya = {
  class: "ac-detail-section",
  "aria-labelledby": "ac-log-heading"
}, _a = { class: "ac-section-head" }, $a = { class: "ac-muted" }, wa = ["disabled"], xa = ["disabled"], Ca = {
  class: "ac-stream",
  tabindex: "0",
  "aria-label": "Task log"
}, Va = { class: "ac-event-kind" }, Aa = { class: "ac-event-text" }, Sa = {
  key: 0,
  class: "ac-muted ac-pulse"
}, Ua = {
  key: 1,
  class: "ac-muted"
}, Ta = 500, La = /* @__PURE__ */ re({
  __name: "run-detail",
  props: {
    runId: {},
    accounts: {},
    images: {},
    workspaces: {}
  },
  setup(s) {
    const d = s, v = ke(), a = p(null), F = p([]), A = p(0), I = p(!1), S = p(!1);
    let U;
    const T = p(!1), q = p(""), E = p(!1), H = p(null), L = p(!1), x = p("");
    let _ = null;
    const R = p(!1), W = p(!1), B = p(!1), m = p(""), ee = Ce(), D = X(() => (a.value?.prompt.length ?? 0) > 500 || (a.value?.prompt.split(`
`).length ?? 0) > 5), V = X(() => (a.value?.result.length ?? 0) > 1800 || (a.value?.result.split(`
`).length ?? 0) > 10);
    let C = !0, ae = !0, le, K;
    const G = (w) => w.status === "queued" || w.status === "running";
    function te() {
      _ && (ae = _.scrollHeight - _.scrollTop - _.clientHeight < 40);
    }
    Ue(() => {
      _ = H.value?.closest(".ac") ?? null, _?.addEventListener("scroll", te, { passive: !0 });
    }), ye(() => {
      _?.removeEventListener("scroll", te), _ = null;
    });
    const J = Ve(async () => {
      try {
        const w = U ?? (a.value ? void 0 : 0);
        U = void 0;
        let c = await Y.run(d.runId, w === void 0 ? A.value : void 0, w);
        if (!C) return;
        if (w === void 0 && (c.more || T.value && c.events.length)) {
          if (c = await Y.run(d.runId, void 0, 0), !C) return;
          F.value = c.events, I.value = c.more, T.value = !1;
        } else if (w !== void 0)
          F.value = c.events, I.value = c.more, T.value = w !== 0;
        else if (c.events.length) {
          const r = Math.max(0, F.value.length + c.events.length - Ta);
          r && F.value.splice(0, r), F.value.push(...c.events), I.value = I.value || r > 0;
        }
        E.value = !1, a.value = c.run, T.value || (A.value = c.next_seq), await Te(), C && ae && _ && _.scrollTo({ top: _.scrollHeight }), q.value = "";
      } catch (w) {
        if (!C) return;
        E.value = w instanceof st && w.code === "autocode.run_not_found", E.value && (a.value = null, F.value = []), q.value = E.value ? "" : se(w, "Could not load the task.");
      } finally {
        S.value = !1;
      }
    });
    function b() {
      S.value || !F.value.length || (ae = !1, S.value = !0, U = F.value[0].seq, J());
    }
    function u() {
      S.value || (ae = !0, S.value = !0, U = 0, J());
    }
    const n = Re.run(d.runId, () => {
      J();
    });
    $e(J), ye(() => {
      C = !1, n(), clearTimeout(K), clearTimeout(le);
    });
    async function h() {
      try {
        if (!a.value || !await we.confirm({
          header: "Cancel task",
          message: `Cancel "${a.value.prompt.split(`
`)[0]}" (${a.value.id})? Execution will stop; task history will remain.`,
          icon: "tabler:player-stop",
          acceptLabel: "Cancel task",
          rejectLabel: "Keep task",
          acceptClass: "p-button-danger"
        })) return;
        await Y.cancelRun(d.runId), await J();
      } catch (w) {
        q.value = se(w, "Could not cancel the task.");
      }
    }
    async function k(w) {
      try {
        await navigator.clipboard.writeText(w);
      } catch {
        const c = document.createElement("textarea"), r = H.value?.getRootNode(), y = r instanceof ShadowRoot || r instanceof Document ? r.activeElement : null, ge = y instanceof HTMLElement ? y : null;
        c.value = w, c.readOnly = !0, c.style.cssText = "position:fixed;opacity:0;pointer-events:none;", H.value?.append(c);
        try {
          if (c.select(), !document.execCommand("copy")) throw new Error("Copy failed");
        } finally {
          c.remove(), ge?.focus({ preventScroll: !0 });
        }
      }
    }
    async function g() {
      try {
        await k(a.value?.result ?? ""), B.value = !0, m.value = "", clearTimeout(K), K = setTimeout(() => {
          B.value = !1;
        }, 2e3);
      } catch {
        m.value = "Could not copy. Select the result text to copy it.";
      }
    }
    async function $() {
      try {
        const w = new URL(tt.env.APP_API_URL || "/", window.location.href);
        await k(new URL(`/autocode/runs/${encodeURIComponent(d.runId)}`, w).href), L.value = !0, x.value = "", clearTimeout(le), le = setTimeout(() => {
          L.value = !1;
        }, 2e3);
      } catch {
        x.value = "Could not copy the link. Try again.";
      }
    }
    function O() {
      W.value = !W.value;
    }
    function N(w) {
      return typeof w.options?.model == "string" ? w.options.model : "";
    }
    function ne(w) {
      return d.accounts.find((c) => c.id === w)?.label ?? "Unlisted account";
    }
    function ve(w) {
      return d.workspaces.find((c) => c.id === w)?.name ?? "Unlisted workspace";
    }
    function Ae(w) {
      return d.images.find((c) => c.id === w)?.label ?? "Unlisted image";
    }
    function ie(w) {
      const c = [];
      return w.input_tokens !== void 0 && c.push(`${w.input_tokens} input`), w.output_tokens !== void 0 && c.push(`${w.output_tokens} output`), w.cached_tokens !== void 0 && c.push(`${w.cached_tokens} cached`), w.cache_write_tokens !== void 0 && c.push(`${w.cache_write_tokens} cache write`), w.reasoning_tokens !== void 0 && c.push(`${w.reasoning_tokens} reasoning`), w.cost_decimal !== void 0 && w.currency ? c.push(`${w.cost_decimal} ${w.currency}`) : w.cost_usd !== void 0 && c.push(`$${w.cost_usd}`), c.join(" · ");
    }
    return (w, c) => (t(), l("section", {
      ref_key: "detail",
      ref: H,
      class: "ac-form ac-detail"
    }, [
      E.value ? (t(), l("div", Wt, [...c[2] || (c[2] = [
        e("h1", null, "Run not found", -1),
        e("p", null, "This run does not exist or you do not have access to it.", -1)
      ])])) : f("", !0),
      q.value ? (t(), l("p", Jt, [
        M(i(q.value) + " ", 1),
        e("button", {
          type: "button",
          class: "ac-link kx-focus-outline",
          onClick: c[0] || (c[0] = //@ts-ignore
          (...r) => o(J) && o(J)(...r))
        }, "Retry")
      ])) : f("", !0),
      !a.value && !q.value && !E.value ? (t(), l("div", zt, [
        P(o(j), {
          icon: "tabler:loader-2",
          class: "spin"
        }),
        c[3] || (c[3] = M(" Loading the task…", -1))
      ])) : a.value ? (t(), l(z, { key: 3 }, [
        e("header", Ht, [
          e("div", Gt, [
            e("span", {
              class: ce(["kx-tag-sm ac-tone", a.value.status])
            }, i(a.value.status), 3),
            e("button", {
              type: "button",
              class: "ac-btn kx-focus-halo",
              "aria-live": "polite",
              onClick: $
            }, [
              P(o(j), {
                icon: L.value ? "tabler:check" : "tabler:link"
              }, null, 8, ["icon"]),
              M(i(L.value ? "Link copied" : "Copy link"), 1)
            ]),
            G(a.value) ? (t(), l("button", {
              key: 0,
              type: "button",
              class: "ac-btn danger kx-focus-halo",
              disabled: a.value.cancel_requested,
              onClick: h
            }, [
              P(o(j), { icon: "tabler:player-stop" }),
              M(" " + i(a.value.cancel_requested ? "Cancelling…" : "Cancel"), 1)
            ], 8, Kt)) : f("", !0)
          ]),
          e("h1", Qt, i(a.value.prompt.split(`
`)[0]), 1),
          e("div", Xt, [
            e("span", null, [
              P(o(j), {
                icon: o(xe)(a.value.agent, o(v).agents)
              }, null, 8, ["icon"]),
              M(i(o(v).agents.find((r) => r.id === a.value?.agent)?.title ?? a.value.agent), 1)
            ]),
            e("span", null, i(ne(a.value.account_id)), 1),
            e("span", null, i(Ae(a.value.image_id)), 1),
            e("span", {
              title: o(he)(a.value.started_at || a.value.created_at)
            }, i(a.value.started_at ? "Started" : "Queued") + " " + i(o(Ee)(a.value.started_at || a.value.created_at, o(ee))), 9, Yt),
            a.value.started_at ? (t(), l("span", Zt, i(o(De)(a.value, o(ee))) + " " + i(G(a.value) ? "elapsed" : "duration"), 1)) : f("", !0),
            a.value.timeout_ms ? (t(), l("span", ea, i(o(ot)(a.value.timeout_ms)), 1)) : f("", !0),
            e("span", null, i(a.value.unattended ? "Unattended" : "Attended"), 1),
            a.value.workflow ? (t(), l("span", ta, "Workflow")) : f("", !0),
            a.value.workspace_id ? (t(), l("span", aa, i(ve(a.value.workspace_id)), 1)) : f("", !0),
            N(a.value) ? (t(), l("span", la, i(N(a.value)), 1)) : f("", !0),
            ie(a.value.usage) ? (t(), l("span", na, i(ie(a.value.usage)), 1)) : f("", !0)
          ])
        ]),
        e("details", oa, [
          c[4] || (c[4] = e("summary", { class: "kx-focus-outline" }, "Effective options", -1)),
          e("pre", sa, i(JSON.stringify(a.value.options, null, 2)), 1),
          a.value.endpoint ? (t(), l("p", ia, i(a.value.endpoint.protocol) + " · " + i(a.value.endpoint.base_url) + " · " + i(a.value.endpoint.model), 1)) : f("", !0)
        ]),
        a.value.usage.models ? (t(), l("section", ua, [
          c[5] || (c[5] = e("h3", null, "Usage by model", -1)),
          (t(!0), l(z, null, Z(a.value.usage.models, (r, y) => (t(), l("p", {
            key: y,
            class: "ac-muted"
          }, i(y) + " · " + i(ie(r)), 1))), 128))
        ])) : f("", !0),
        x.value ? (t(), l("p", da, i(x.value), 1)) : f("", !0),
        e("section", ca, [
          e("div", ra, [
            c[6] || (c[6] = e("h3", { id: "ac-prompt-heading" }, "Prompt", -1)),
            D.value ? (t(), l("button", {
              key: 0,
              type: "button",
              class: "ac-link kx-focus-outline",
              "aria-expanded": R.value,
              "aria-controls": "ac-prompt-text",
              onClick: c[1] || (c[1] = (r) => R.value = !R.value)
            }, i(R.value ? "Collapse prompt" : "Expand prompt"), 9, va)) : f("", !0)
          ]),
          e("pre", {
            id: "ac-prompt-text",
            class: ce(["ac-pre ac-prompt", { expanded: R.value || !D.value }])
          }, [
            e("span", null, i(a.value.prompt), 1)
          ], 2)
        ]),
        a.value.result ? (t(), l("section", pa, [
          e("div", ga, [
            e("h3", fa, i(a.value.status === "succeeded" ? "Result" : "Partial result"), 1),
            e("div", ma, [
              V.value ? (t(), l("button", {
                key: 0,
                type: "button",
                class: "ac-link kx-focus-outline",
                "aria-expanded": W.value,
                "aria-controls": "ac-result-text",
                onClick: O
              }, i(W.value ? "Collapse result" : "Expand result"), 9, ha)) : f("", !0),
              e("button", {
                type: "button",
                class: "ac-btn kx-focus-halo",
                onClick: g
              }, [
                P(o(j), {
                  icon: B.value ? "tabler:check" : "tabler:copy"
                }, null, 8, ["icon"]),
                M(i(B.value ? "Copied" : "Copy"), 1)
              ])
            ])
          ]),
          m.value ? (t(), l("p", ka, i(m.value), 1)) : f("", !0),
          e("pre", {
            id: "ac-result-text",
            class: ce(["ac-pre ac-result-text", { expanded: W.value }]),
            tabindex: "0",
            "aria-label": "Result"
          }, i(a.value.result), 3)
        ])) : f("", !0),
        a.value.error ? (t(), l("p", ba, i(a.value.error), 1)) : f("", !0),
        e("section", ya, [
          e("div", _a, [
            c[7] || (c[7] = e("h3", { id: "ac-log-heading" }, "Log", -1)),
            e("span", $a, i(F.value.length) + " events", 1)
          ]),
          I.value ? (t(), l("button", {
            key: 0,
            type: "button",
            class: "ac-link kx-focus-outline",
            disabled: S.value,
            onClick: b
          }, i(S.value ? "Loading…" : "Load earlier"), 9, wa)) : f("", !0),
          T.value ? (t(), l("button", {
            key: 1,
            type: "button",
            class: "ac-link kx-focus-outline",
            disabled: S.value,
            onClick: u
          }, "Latest", 8, xa)) : f("", !0),
          e("div", Ca, [
            (t(!0), l(z, null, Z(F.value, (r) => (t(), l("div", {
              key: r.seq,
              class: ce(["ac-event", r.kind])
            }, [
              e("span", Va, i(r.kind), 1),
              e("pre", Aa, i(r.text), 1)
            ], 2))), 128)),
            G(a.value) ? (t(), l("div", Sa, i(a.value.status === "queued" ? "Waiting to start…" : "Working…"), 1)) : F.value.length ? f("", !0) : (t(), l("div", Ua, "No log events."))
          ])
        ])
      ], 64)) : f("", !0)
    ], 512));
  }
}), Fa = {
  key: 0,
  "aria-label": "Task details"
}, Ra = { class: "ac-detail-back" }, Ea = {
  key: 1,
  class: "kx-loading"
}, Ia = { key: 2 }, Na = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, Pa = {
  key: 1,
  class: "kx-empty"
}, Oa = { class: "kx-empty-ico" }, qa = { class: "kx-empty-sub" }, Ba = {
  key: 2,
  class: "kx-empty"
}, Da = {
  key: 3,
  class: "ac-run-list"
}, Ma = ["onClick"], ja = { class: "ac-run-copy" }, Wa = { class: "ac-run-title-row" }, Ja = { class: "ac-run-title" }, za = {
  key: 0,
  class: "kx-tag-sm ac-tone"
}, Ha = { class: "ac-run-meta" }, Ga = ["title"], Ka = { key: 0 }, Qa = {
  key: 4,
  class: "ac-load-more"
}, Xa = /* @__PURE__ */ re({
  __name: "tasks",
  props: {
    query: {},
    runId: {}
  },
  emits: ["goto", "agentChanged", "count", "open", "close"],
  setup(s, { expose: d, emit: v }) {
    const a = Ie(), F = p([]), A = s, I = v, S = ke(), U = p(!1), T = p(!1);
    d({ open: () => {
      U.value = !0;
    } });
    const q = p([]), E = p([]), H = p([]), L = p([]), x = p(), _ = p(!1), R = p(""), W = Ce(), B = p(!1);
    let m = 0, ee = 1;
    async function D() {
      const n = [];
      let h;
      for (let k = 0; k < ee; k++) {
        const g = await Y.runs(h);
        if (!a() || (n.push(...g.runs), h = g.next_cursor, !h)) break;
      }
      return { runs: n, next_cursor: h };
    }
    const V = Ve(async () => {
      m++, B.value = !0;
      try {
        await Pe(
          () => Promise.all([Y.accounts(), Y.images(), D(), Y.workspaces()]),
          ([n, h, , k]) => [...n, ...h, ...k.workspaces].map((g) => g.id),
          F,
          a,
          ([n, h, k, g]) => {
            q.value = n, E.value = h, L.value = k.runs, x.value = k.next_cursor, H.value = g.workspaces, _.value = !0, R.value = "";
          },
          () => {
            V();
          }
        );
      } catch (n) {
        a() && (R.value = se(n, "Could not load tasks."));
      } finally {
        a() && (B.value = !1);
      }
    }, a), C = Re.runs(() => {
      V();
    });
    Ne(() => F.value, () => {
      V();
    }), $e(V), ye(C);
    const ae = p(!1);
    async function le() {
      if (!(!x.value || ae.value || B.value)) {
        ae.value = !0;
        try {
          const n = m, h = await Y.runs(x.value);
          if (!a() || m !== n) return;
          const k = new Set(L.value.map((g) => g.id));
          L.value.push(...h.runs.filter((g) => !k.has(g.id))), x.value = h.next_cursor, ee++;
        } catch (n) {
          a() && (R.value = se(n, "Could not load more tasks."));
        } finally {
          a() && (ae.value = !1);
        }
      }
    }
    function K(n) {
      U.value = !1, I("open", n);
    }
    const G = X(() => q.value.some((n) => n.usable && n.enabled)), te = X(() => L.value.filter((n) => [n.prompt_summary, n.status, n.agent, J(n.agent), u(n.account_id)].join(" ").toLowerCase().includes(A.query.trim().toLowerCase())));
    pe(() => L.value.length, (n) => I("count", n));
    function J(n) {
      return S.value.agents.find((h) => h.id === n)?.title ?? n;
    }
    function b(n) {
      return E.value.find((h) => h.id === n)?.label ?? "Unlisted image";
    }
    function u(n) {
      return q.value.find((h) => h.id === n)?.label ?? "Unlisted account";
    }
    return (n, h) => s.runId ? (t(), l("section", Fa, [
      e("div", Ra, [
        e("button", {
          type: "button",
          class: "ac-btn kx-focus-halo",
          onClick: h[0] || (h[0] = (k) => I("close"))
        }, [
          P(o(j), { icon: "tabler:arrow-left" }),
          h[9] || (h[9] = M(" Back to tasks", -1))
        ])
      ]),
      (t(), oe(La, {
        key: s.runId,
        "run-id": s.runId,
        accounts: q.value,
        images: E.value,
        workspaces: H.value
      }, null, 8, ["run-id", "accounts", "images", "workspaces"]))
    ])) : _.value ? (t(), l("div", Ia, [
      R.value ? (t(), l("p", Na, [
        M(i(R.value) + " ", 1),
        e("button", {
          class: "ac-link kx-focus-outline",
          type: "button",
          onClick: h[2] || (h[2] = //@ts-ignore
          (...k) => o(V) && o(V)(...k))
        }, "Retry")
      ])) : f("", !0),
      L.value.length ? te.value.length ? f("", !0) : (t(), l("div", Ba, [...h[12] || (h[12] = [
        e("div", { class: "kx-empty-title" }, "No matches", -1),
        e("div", { class: "kx-empty-sub" }, "Try another task, agent or account.", -1)
      ])])) : (t(), l("div", Pa, [
        e("div", Oa, [
          P(o(j), { icon: "tabler:terminal-2" })
        ]),
        h[11] || (h[11] = e("div", { class: "kx-empty-title" }, "No tasks yet", -1)),
        e("div", qa, i(G.value ? "Give a coding agent a task and follow its progress here." : "Add an account to give your coding agent a place to start."), 1),
        P(o(Se), {
          label: G.value ? "New task" : "Add account",
          onClick: h[3] || (h[3] = (k) => G.value ? U.value = !0 : I("goto"))
        }, {
          icon: me(() => [
            P(o(j), { icon: "tabler:plus" })
          ]),
          _: 1
        }, 8, ["label"])
      ])),
      te.value.length ? (t(), l("ul", Da, [
        (t(!0), l(z, null, Z(te.value, (k) => (t(), l("li", {
          key: k.id,
          class: "ac-run"
        }, [
          e("button", {
            type: "button",
            class: "ac-run-main kx-focus-halo",
            onClick: (g) => I("open", k.id)
          }, [
            e("span", ja, [
              e("span", Wa, [
                e("span", Ja, i(k.prompt_summary.split(`
`)[0]), 1),
                e("span", {
                  class: ce(["kx-tag-sm ac-tone", k.status])
                }, i(k.status), 3),
                k.workflow ? (t(), l("span", za, "Workflow")) : f("", !0)
              ]),
              e("span", Ha, [
                e("span", null, [
                  P(o(j), {
                    icon: o(xe)(k.agent, o(S).agents)
                  }, null, 8, ["icon"]),
                  M(i(J(k.agent)), 1)
                ]),
                e("span", null, i(u(k.account_id)), 1),
                e("span", null, i(b(k.image_id)), 1),
                e("span", {
                  title: o(he)(k.started_at || k.created_at)
                }, i(o(Ee)(k.started_at || k.created_at, o(W))), 9, Ga),
                k.started_at ? (t(), l("span", Ka, i(o(De)(k, o(W))) + " " + i(k.status === "running" ? "elapsed" : "duration"), 1)) : f("", !0)
              ])
            ]),
            P(o(j), {
              icon: "tabler:chevron-right",
              class: "ac-run-chevron ac-muted"
            })
          ], 8, Ma)
        ]))), 128))
      ])) : f("", !0),
      x.value ? (t(), l("div", Qa, [
        P(o(Se), {
          label: "Load more",
          loading: ae.value,
          disabled: B.value,
          onClick: le
        }, null, 8, ["loading", "disabled"])
      ])) : f("", !0),
      U.value ? (t(), oe(Le, {
        key: 5,
        title: "New task",
        busy: T.value,
        wide: "",
        onClose: h[8] || (h[8] = (k) => U.value = !1)
      }, {
        default: me(() => [
          P(jt, {
            onBusy: h[4] || (h[4] = (k) => T.value = k),
            accounts: q.value,
            images: E.value,
            workspaces: H.value,
            onStarted: K,
            onCancel: h[5] || (h[5] = (k) => U.value = !1),
            onAgentChanged: h[6] || (h[6] = (k) => I("agentChanged", k)),
            onGoto: h[7] || (h[7] = (k, g) => I("goto", g))
          }, null, 8, ["accounts", "images", "workspaces"])
        ]),
        _: 1
      }, 8, ["busy"])) : f("", !0)
    ])) : (t(), l("div", Ea, [
      R.value ? (t(), l(z, { key: 0 }, [
        M(i(R.value) + " ", 1),
        e("button", {
          class: "ac-link kx-focus-outline",
          type: "button",
          onClick: h[1] || (h[1] = //@ts-ignore
          (...k) => o(V) && o(V)(...k))
        }, "Retry")
      ], 64)) : (t(), l(z, { key: 1 }, [
        P(o(j), {
          icon: "tabler:loader-2",
          class: "spin"
        }),
        h[10] || (h[10] = M(" Loading tasks…", -1))
      ], 64))
    ]));
  }
});
var Ya = {
  name: "BaseEditableHolder",
  extends: He,
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
      var a, F;
      this.controlled && (this.d_value = d, this.$emit("update:modelValue", d)), this.$emit("value-change", d), (a = (F = this.formField).onChange) === null || a === void 0 || a.call(F, {
        originalEvent: v,
        value: d
      });
    },
    // @todo move to @primeuix/utils
    findNonEmpty: function() {
      for (var d = arguments.length, v = new Array(d), a = 0; a < d; a++)
        v[a] = arguments[a];
      return v.find(qe);
    }
  },
  computed: {
    $filled: function() {
      return qe(this.d_value);
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
}, Za = `
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
`, el = {
  root: {
    position: "relative"
  }
}, tl = {
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
}, al = Ge.extend({
  name: "toggleswitch",
  style: Za,
  classes: tl,
  inlineStyles: el
}), ll = {
  name: "BaseToggleSwitch",
  extends: Ya,
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
  style: al,
  provide: function() {
    return {
      $pcToggleSwitch: this,
      $parentInstance: this
    };
  }
}, Je = {
  name: "ToggleSwitch",
  extends: ll,
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
      return Ke({
        checked: this.checked,
        disabled: this.disabled,
        invalid: this.$invalid
      });
    }
  }
}, nl = ["data-p-checked", "data-p-disabled", "data-p"], ol = ["id", "checked", "tabindex", "disabled", "readonly", "aria-checked", "aria-labelledby", "aria-label", "aria-invalid"], sl = ["data-p"], il = ["data-p"];
function ul(s, d, v, a, F, A) {
  return t(), l("div", be({
    class: s.cx("root"),
    style: s.sx("root")
  }, A.getPTOptions("root"), {
    "data-p-checked": A.checked,
    "data-p-disabled": s.disabled,
    "data-p": A.dataP
  }), [e("input", be({
    id: s.inputId,
    type: "checkbox",
    role: "switch",
    class: [s.cx("input"), s.inputClass],
    style: s.inputStyle,
    checked: A.checked,
    tabindex: s.tabindex,
    disabled: s.disabled,
    readonly: s.readonly,
    "aria-checked": A.checked,
    "aria-labelledby": s.ariaLabelledby,
    "aria-label": s.ariaLabel,
    "aria-invalid": s.invalid || void 0,
    onFocus: d[0] || (d[0] = function() {
      return A.onFocus && A.onFocus.apply(A, arguments);
    }),
    onBlur: d[1] || (d[1] = function() {
      return A.onBlur && A.onBlur.apply(A, arguments);
    }),
    onChange: d[2] || (d[2] = function() {
      return A.onChange && A.onChange.apply(A, arguments);
    })
  }, A.getPTOptions("input")), null, 16, ol), e("div", be({
    class: s.cx("slider")
  }, A.getPTOptions("slider"), {
    "data-p": A.dataP
  }), [e("div", be({
    class: s.cx("handle")
  }, A.getPTOptions("handle"), {
    "data-p": A.dataP
  }), [et(s.$slots, "handle", {
    checked: A.checked
  })], 16, il)], 16, sl)], 16, nl);
}
Je.render = ul;
const dl = { class: "ac-account-main" }, cl = { class: "ac-row-title" }, rl = ["onKeydown"], vl = {
  key: 1,
  class: "ac-row-name"
}, pl = {
  key: 2,
  class: "kx-tag-sm ac-tone"
}, gl = { class: "ac-muted" }, fl = ["title"], ml = { key: 1 }, hl = {
  key: 0,
  class: "ac-muted"
}, kl = {
  key: 1,
  class: "ac-muted ac-strong"
}, bl = {
  key: 2,
  class: "ac-muted"
}, yl = {
  key: 3,
  class: "ac-muted ac-mono"
}, _l = {
  key: 4,
  class: "ac-muted"
}, $l = {
  key: 5,
  class: "ac-muted"
}, wl = {
  key: 6,
  class: "kx-err ac-small"
}, xl = { class: "ac-row-actions" }, Cl = /* @__PURE__ */ re({
  __name: "account-row",
  props: {
    account: {},
    kindLabel: {},
    ownerLabel: {}
  },
  emits: ["toggle", "rename", "remove", "edit"],
  setup(s, { emit: d }) {
    const v = s, a = d, F = { ready: "ready", cooling: "cooling down", disabled: "disabled", unavailable: "unavailable" }, A = Ce(), I = X(() => Fe(v.account, A.value)), S = X(() => v.account.mine ? "" : `Shared with you by ${v.ownerLabel}`), U = p(!1), T = p(""), q = p(null);
    function E() {
      T.value = v.account.label, U.value = !0, Te(() => q.value?.select());
    }
    function H() {
      if (!U.value) return;
      U.value = !1;
      const L = T.value.trim();
      L && L !== v.account.label && a("rename", L);
    }
    return (L, x) => (t(), l("li", {
      class: ce(["ac-row ac-account ac-hover-actions", { off: !s.account.enabled || !s.account.usable }])
    }, [
      e("div", dl, [
        e("div", cl, [
          e("span", {
            class: ce(["kx-tag-sm ac-tone", I.value])
          }, i(F[I.value]), 3),
          U.value ? Q((t(), l("input", {
            key: 0,
            ref_key: "input",
            ref: q,
            "onUpdate:modelValue": x[0] || (x[0] = (_) => T.value = _),
            class: "ac-rename kx-focus-halo",
            "aria-label": "Account label",
            onKeydown: [
              Be(_e(H, ["prevent"]), ["enter"]),
              x[1] || (x[1] = Be(_e((_) => U.value = !1, ["prevent"]), ["escape"]))
            ],
            onBlur: H
          }, null, 40, rl)), [
            [ue, T.value]
          ]) : (t(), l("span", vl, i(s.account.label), 1)),
          s.account.subscription ? (t(), l("span", pl, "personal")) : f("", !0)
        ]),
        e("div", gl, [
          M(i(s.kindLabel) + " · " + i(s.account.runs_day) + " " + i(s.account.runs_day === 1 ? "task" : "tasks") + " in the last 24 hours · " + i(s.account.failures_day) + " " + i(s.account.failures_day === 1 ? "failure" : "failures") + " · ", 1),
          s.account.last_used_at ? (t(), l("span", {
            key: 0,
            title: o(he)(s.account.last_used_at)
          }, "last used " + i(o(Ee)(s.account.last_used_at, o(A))), 9, fl)) : (t(), l("span", ml, "never used"))
        ]),
        S.value ? (t(), l("div", hl, i(S.value), 1)) : f("", !0),
        s.account.usable ? s.account.subscription ? (t(), l("div", bl, "Subscription login: personal use only")) : f("", !0) : (t(), l("div", kl, [
          P(o(j), { icon: "tabler:lock" }),
          M(" " + i(s.account.unavailable_reason || "Account unavailable for tasks"), 1)
        ])),
        s.account.endpoint ? (t(), l("div", yl, i(s.account.endpoint.protocol) + " · " + i(s.account.endpoint.base_url) + i(s.account.endpoint.model ? " · " + s.account.endpoint.model : ""), 1)) : f("", !0),
        I.value === "cooling" && s.account.cooldown_until ? (t(), l("div", _l, "Available at " + i(o(he)(s.account.cooldown_until)), 1)) : f("", !0),
        (t(!0), l(z, null, Z(s.account.rate_limits?.windows ?? [], (_) => (t(), l("div", {
          key: _.window,
          class: "ac-muted"
        }, [
          M(i(_.window.replace("seven_day", "7-day").replace("five_hour", "5-hour").replaceAll("_", " ")) + ": " + i(_.utilization === void 0 ? _.status : `${Math.round(_.utilization * 100)}% used`), 1),
          _.resets_at ? (t(), l(z, { key: 0 }, [
            M(", resets " + i(new Date(_.resets_at * 1e3).toLocaleString(void 0, { weekday: "short", hour: "2-digit", minute: "2-digit" })), 1)
          ], 64)) : f("", !0)
        ]))), 128)),
        s.account.rate_limits?.overage_status ? (t(), l("div", $l, "Overage: " + i(s.account.rate_limits.overage_status) + i(s.account.rate_limits.overage_disabled_reason ? " · " + s.account.rate_limits.overage_disabled_reason : ""), 1)) : f("", !0),
        s.account.last_error ? (t(), l("div", wl, i(s.account.last_error), 1)) : f("", !0)
      ]),
      e("div", xl, [
        s.account.writable ? (t(), oe(o(Je), {
          key: 0,
          "model-value": s.account.enabled,
          "aria-label": s.account.enabled ? "Disable account" : "Enable account",
          onChange: x[2] || (x[2] = (_) => a("toggle"))
        }, null, 8, ["model-value", "aria-label"])) : f("", !0),
        s.account.writable ? (t(), l("button", {
          key: 1,
          type: "button",
          class: "ac-icon-btn kx-focus-outline",
          title: "Rename",
          "aria-label": "Rename account",
          onClick: E
        }, [
          P(o(j), { icon: "tabler:pencil" })
        ])) : f("", !0),
        s.account.writable ? (t(), l("button", {
          key: 2,
          type: "button",
          class: "ac-icon-btn kx-focus-outline",
          title: "Edit credential and endpoint",
          "aria-label": "Edit account",
          onClick: x[3] || (x[3] = (_) => a("edit"))
        }, [
          P(o(j), { icon: "tabler:key" })
        ])) : f("", !0),
        s.account.deletable ? (t(), l("button", {
          key: 3,
          type: "button",
          class: "ac-icon-btn kx-focus-outline",
          title: "Delete",
          "aria-label": "Delete account",
          onClick: x[4] || (x[4] = (_) => a("remove"))
        }, [
          P(o(j), { icon: "tabler:trash" })
        ])) : f("", !0)
      ])
    ], 2));
  }
}), Vl = { class: "ac-stack" }, Al = {
  key: 0,
  class: "kx-err inline"
}, Sl = {
  key: 1,
  class: "kx-err inline",
  role: "status"
}, Ul = {
  key: 2,
  class: "kx-loading"
}, Tl = {
  key: 3,
  class: "kx-empty"
}, Ll = { class: "kx-empty-ico" }, Fl = {
  key: 4,
  class: "kx-empty"
}, Rl = { class: "ac-card-head" }, El = { class: "ac-card-title" }, Il = { class: "ac-muted" }, Nl = { class: "ac-account-grid" }, Pl = { class: "ac-form" }, Ol = {
  key: 1,
  class: "ac-hint"
}, ql = ["^config"], Bl = {
  key: 3,
  class: "kx-err",
  role: "alert"
}, Dl = /* @__PURE__ */ re({
  __name: "accounts",
  props: {
    query: {},
    selectedAgent: {}
  },
  emits: ["count"],
  setup(s, { expose: d, emit: v }) {
    const a = Ie(), F = p([]), A = s, I = v, S = p(!1), U = p(null);
    function T() {
      U.value = null, m.value = "", S.value = !0;
    }
    function q(g) {
      U.value = g, D.value = g.agent, m.value = "", S.value = !0;
    }
    d({ open: T });
    const E = ke(), H = Ce(), L = p([]), x = p({}), _ = p(""), R = p(""), W = p(!1), B = p(!1), m = p(""), ee = p(0), D = p(A.selectedAgent || E.value.agents[0]?.id || "");
    pe(() => A.selectedAgent, (g) => {
      g && (D.value = g);
    });
    const V = X(() => E.value.agents.find((g) => g.id === D.value)), C = X(() => JSON.stringify({ driver: V.value, busy: B.value, error: m.value, saved: ee.value, account: U.value ? { id: U.value.id, label: U.value.label, credential_kind: U.value.credential_kind, endpoint: U.value.endpoint } : void 0, limits: E.value.account_limits })), ae = X(() => [...E.value.agents, ...[...new Set(L.value.map((g) => g.agent))].filter((g) => !E.value.agents.some(($) => $.id === g)).map((g) => ({ id: g, title: `Unavailable agent: ${g}`, icon: "tabler:terminal-2" }))].map((g) => ({ agent: g, accounts: L.value.filter(($) => $.agent === g.id && [$.label, g.title, $.credential_kind].join(" ").toLowerCase().includes(A.query.toLowerCase())) })).filter((g) => g.accounts.length));
    function le(g) {
      return E.value.agents.find(($) => $.id === g.agent)?.credentials.find(($) => $.id === g.credential_kind)?.label ?? g.credential_kind;
    }
    async function K(g) {
      const $ = [...new Set(g.filter((N) => !N.mine).map((N) => N.owner_user_id))].filter((N) => !(N in x.value)), O = await it($);
      a() && (x.value = { ...x.value, ...O });
    }
    const G = Ve(async () => {
      try {
        const g = await Pe(Y.accounts, ($) => $.map((O) => O.id), F, a, ($) => {
          L.value = $, W.value = !0, _.value = "";
        }, () => {
          G();
        });
        if (!a() || (await K(g), !a())) return;
        W.value = !0, _.value = "";
      } catch (g) {
        a() && (_.value = se(g, "Could not load accounts."));
      }
    }, a);
    Ne(() => F.value, () => {
      G();
    });
    const te = Re.runs(() => {
      G();
    });
    ye(te), $e(G);
    async function J(g, $) {
      _.value = "", R.value = "";
      try {
        if (await g(), !a()) return;
        await G();
      } catch (O) {
        a() && (_.value = se(O, $));
      }
    }
    async function b(g) {
      if (!(g instanceof CustomEvent)) return;
      const $ = rt.safeParse(g.detail);
      if (B.value) return;
      if (!$.success || $.data.agent !== D.value || U.value && (!U.value.writable || $.data.credential_kind !== U.value.credential_kind)) {
        m.value = "Invalid account submission.";
        return;
      }
      const O = $.data;
      m.value = "", B.value = !0;
      try {
        if (U.value) {
          const N = await Y.updateAccount(U.value.id, {
            label: O.label,
            endpoint: O.endpoint ?? { base_url: "" },
            ...O.secret ? { secret: O.secret } : {}
          });
          if (!a()) return;
          R.value = N.health_error ? `Account saved, but its health could not be refreshed: ${N.health_error.message}` : "";
        } else await Y.createAccount(O);
        if (!a()) return;
        ee.value++, S.value = !1, await G();
      } catch (N) {
        a() && (m.value = se(N, "Could not save the account."));
      } finally {
        a() && (B.value = !1);
      }
    }
    pe(L, (g) => I("count", g.length));
    const u = (g, $, O) => J(async () => {
      const N = await Y.updateAccount(g.id, $);
      a() && N.health_error && (R.value = `Account saved, but its health could not be refreshed: ${N.health_error.message}`);
    }, O), n = (g) => u(g, { enabled: !g.enabled }, "Could not update the account."), h = (g, $) => u(g, { label: $ }, "Could not rename the account.");
    async function k(g) {
      const $ = await we.confirm({
        header: "Delete account",
        message: `Delete account "${g.label}"? Tasks keep their history.`,
        icon: "tabler:trash",
        acceptLabel: "Delete",
        rejectLabel: "Cancel",
        acceptClass: "p-button-danger"
      });
      a() && $ && await J(() => Y.deleteAccount(g.id), "Could not delete the account.");
    }
    return Ue(() => {
      at("chestor-autocode-driver-account", { timeoutMs: 8e3 }).catch(() => {
        a() && (_.value = "The driver account card could not load.");
      });
    }), (g, $) => (t(), l("div", Vl, [
      _.value ? (t(), l("p", Al, [
        M(i(_.value) + " ", 1),
        e("button", {
          type: "button",
          class: "ac-link kx-focus-outline",
          onClick: $[0] || ($[0] = //@ts-ignore
          (...O) => o(G) && o(G)(...O))
        }, "Retry")
      ])) : f("", !0),
      R.value ? (t(), l("p", Sl, i(R.value), 1)) : f("", !0),
      !W.value && !_.value ? (t(), l("div", Ul, "Loading accounts…")) : f("", !0),
      W.value && !L.value.length ? (t(), l("div", Tl, [
        e("div", Ll, [
          P(o(j), { icon: "tabler:key" })
        ]),
        $[3] || ($[3] = e("div", { class: "kx-empty-title" }, "No accounts yet", -1)),
        $[4] || ($[4] = e("div", { class: "kx-empty-sub" }, "Add an API key, your own endpoint or a personal subscription login.", -1)),
        P(o(Se), {
          label: "Add account",
          onClick: T
        }, {
          icon: me(() => [
            P(o(j), { icon: "tabler:plus" })
          ]),
          _: 1
        })
      ])) : W.value && !ae.value.length ? (t(), l("div", Fl, [...$[5] || ($[5] = [
        e("div", { class: "kx-empty-title" }, "No matches", -1),
        e("div", { class: "kx-empty-sub" }, "Try another account or agent.", -1)
      ])])) : f("", !0),
      (t(!0), l(z, null, Z(ae.value, (O) => (t(), l("section", {
        key: O.agent.id,
        class: "ac-stack"
      }, [
        e("div", Rl, [
          e("h2", El, [
            P(o(j), {
              icon: o(xe)(O.agent.id, o(E).agents)
            }, null, 8, ["icon"]),
            M(i(O.agent.title), 1)
          ]),
          e("span", Il, i(O.accounts.filter((N) => N.usable && o(Fe)(N, o(H)) === "ready").length) + " of " + i(O.accounts.length) + " ready", 1)
        ]),
        e("ul", Nl, [
          (t(!0), l(z, null, Z(O.accounts, (N) => (t(), oe(Cl, {
            key: N.id,
            account: N,
            "kind-label": le(N),
            "owner-label": x.value[N.owner_user_id] || N.owner_user_id,
            onEdit: (ne) => q(N),
            onToggle: (ne) => n(N),
            onRename: (ne) => h(N, ne),
            onRemove: (ne) => k(N)
          }, null, 8, ["account", "kind-label", "owner-label", "onEdit", "onToggle", "onRename", "onRemove"]))), 128))
        ])
      ]))), 128)),
      S.value ? (t(), oe(Le, {
        key: 5,
        title: U.value ? "Edit account" : "Add account",
        busy: B.value,
        onClose: $[2] || ($[2] = (O) => S.value = !1)
      }, {
        default: me(() => [
          e("div", Pl, [
            U.value ? f("", !0) : (t(), oe(We, {
              key: 0,
              disabled: B.value,
              modelValue: D.value,
              "onUpdate:modelValue": $[1] || ($[1] = (O) => D.value = O),
              agents: o(E).agents
            }, null, 8, ["disabled", "modelValue", "agents"])),
            U.value ? f("", !0) : (t(), l("p", Ol, "Tasks balance across your ready accounts automatically.")),
            V.value ? (t(), l("chestor-autocode-driver-account", {
              key: 2,
              "^config": C.value,
              onSubmit: b
            }, null, 40, ql)) : (t(), l("p", Bl, "This account’s agent is unavailable."))
          ])
        ]),
        _: 1
      }, 8, ["title", "busy"])) : f("", !0)
    ]));
  }
}), Ml = ["aria-busy"], jl = {
  key: 0,
  class: "kx-empty",
  role: "status"
}, Wl = {
  key: 1,
  class: "kx-err",
  role: "alert"
}, Jl = {
  key: 2,
  class: "kx-empty"
}, zl = {
  key: 3,
  class: "kx-empty"
}, Hl = {
  key: 4,
  class: "ac-list"
}, Gl = { class: "ac-account-main" }, Kl = { class: "ac-row-title" }, Ql = { class: "ac-row-name" }, Xl = { class: "ac-muted" }, Yl = {
  key: 0,
  class: "ac-muted ac-mono"
}, Zl = { class: "ac-row-actions" }, en = ["onClick"], tn = ["onClick"], an = ["onClick"], ln = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, nn = ["disabled"], on = { class: "ac-field" }, sn = { class: "ac-field" }, un = ["value"], dn = { class: "ac-field" }, cn = ["value"], rn = {
  key: 0,
  class: "ac-field"
}, vn = ["value"], pn = { class: "ac-field" }, gn = ["value"], fn = { class: "ac-field" }, mn = ["value"], hn = { class: "ac-field" }, kn = ["value"], bn = { class: "ac-field" }, yn = { class: "ac-field" }, _n = { class: "ac-field" }, $n = { class: "ac-field" }, wn = { class: "ac-field" }, xn = {
  key: 2,
  class: "ac-check"
}, Cn = ["checked"], Vn = { class: "ac-dialog-foot" }, An = ["disabled"], Sn = /* @__PURE__ */ re({
  __name: "profiles",
  props: {
    query: {}
  },
  emits: ["count"],
  setup(s, { expose: d, emit: v }) {
    const a = Ie(), F = s, A = v, I = ke(), S = p([]), U = p([]), T = p([]), q = p([]), E = p([]), H = p(""), L = p(""), x = p(!0), _ = p(!1), R = p(0), W = p(!1), B = p(null), m = p(null), ee = p(""), D = p(""), V = p(""), C = X(() => I.value.agents.find((b) => b.id === m.value?.agent)), ae = X(() => S.value.filter((b) => `${b.title} ${b.agent}`.toLowerCase().includes(F.query.toLowerCase()))), le = Ve(async () => {
      try {
        await Pe(
          () => Promise.all([Y.profiles(), Y.accounts(), Y.images(), Y.workspaces()]),
          ([b, u, n, h]) => [...b.map((k) => k.id), ...u.map((k) => k.id), ...n.map((k) => k.id), ...h.workspaces.map((k) => k.id)],
          U,
          a,
          ([b, u, n, h]) => {
            S.value = b, T.value = u, q.value = n, E.value = h.workspaces, A("count", b.length), H.value = "";
          },
          () => {
            le();
          }
        );
      } catch (b) {
        a() && (H.value = se(b, "Could not load profiles."));
      } finally {
        a() && (x.value = !1);
      }
    }, a);
    Ne(() => U.value, le), $e(le);
    function K(b, u = !1) {
      B.value = b && !u ? b.id : null, m.value = b ? {
        title: b.title + (u ? " copy" : ""),
        agent: b.agent,
        account_id: b.account_id ?? "",
        account_pool: [...b.account_pool ?? []],
        image_id: b.image_id,
        workspace_id: b.workspace_id ?? "",
        tools: b.tools ? JSON.parse(JSON.stringify(b.tools)) : void 0,
        repo_url: b.repo_url,
        repo_ref: b.repo_ref,
        run_timeout: b.run_timeout,
        options: JSON.parse(JSON.stringify(b.options)),
        unattended: b.unattended
      } : { title: "", agent: I.value.agents[0]?.id ?? "", image_id: "", options: {}, account_pool: [], account_id: "", workspace_id: "" }, ee.value = b?.endpoint?.protocol ?? C.value?.endpoints[0] ?? "", D.value = b?.endpoint?.base_url ?? "", V.value = b?.endpoint?.model ?? "", R.value = 0, L.value = "";
    }
    function G() {
      m.value && (m.value.account_id = "", m.value.account_pool = [], m.value.options = {}, ee.value = C.value?.endpoints[0] ?? "", D.value = "", V.value = "");
    }
    async function te() {
      if (!(!m.value || _.value || R.value || W.value)) {
        _.value = !0, L.value = "";
        try {
          const b = { ...m.value, account_pool: m.value.account_id ? [] : m.value.account_pool };
          if (C.value?.endpoints.length ? b.endpoint = { protocol: ee.value, base_url: D.value.trim(), model: V.value.trim() || void 0 } : B.value && S.value.some((u) => u.id === B.value && u.endpoint?.base_url) && (b.endpoint = { protocol: "", base_url: "" }), B.value ? await Y.updateProfile(B.value, b) : await Y.createProfile(b), !a()) return;
          m.value = null, await le();
        } catch (b) {
          a() && (L.value = se(b, "Could not save the profile."));
        } finally {
          a() && (_.value = !1);
        }
      }
    }
    async function J(b) {
      if (await we.confirm({ header: "Delete profile", message: `Delete ${b.title}?`, acceptLabel: "Delete" }))
        try {
          await Y.deleteProfile(b.id), await le();
        } catch (u) {
          a() && (H.value = se(u, "Could not delete the profile."));
        }
    }
    return d({ open: K }), (b, u) => (t(), l("section", { "aria-busy": x.value }, [
      x.value ? (t(), l("p", jl, "Loading profiles…")) : H.value ? (t(), l("div", Wl, [
        M(i(H.value) + " ", 1),
        e("button", {
          type: "button",
          class: "ac-btn kx-focus-halo",
          "aria-label": "Retry profiles",
          onClick: u[0] || (u[0] = //@ts-ignore
          (...n) => o(le) && o(le)(...n))
        }, "Retry")
      ])) : S.value.length ? ae.value.length ? (t(), l("ul", Hl, [
        (t(!0), l(z, null, Z(ae.value, (n) => (t(), l("li", {
          key: n.id,
          class: "ac-row ac-account ac-hover-actions"
        }, [
          e("div", Gl, [
            e("div", Kl, [
              P(o(j), { icon: "tabler:robot" }),
              e("span", Ql, i(n.title), 1)
            ]),
            e("p", Xl, i(o(I).agents.find((h) => h.id === n.agent)?.title ?? n.agent) + " · " + i(n.endpoint?.model ?? n.options.model ?? "CLI default model"), 1),
            n.endpoint ? (t(), l("p", Yl, i(n.endpoint.base_url), 1)) : f("", !0)
          ]),
          e("div", Zl, [
            e("button", {
              type: "button",
              class: "ac-icon-btn kx-focus-outline",
              "aria-label": "Duplicate profile",
              onClick: (h) => K(n, !0)
            }, [
              P(o(j), { icon: "tabler:copy" })
            ], 8, en),
            n.writable ? (t(), l("button", {
              key: 0,
              type: "button",
              class: "ac-icon-btn kx-focus-outline",
              "aria-label": "Edit profile",
              onClick: (h) => K(n)
            }, [
              P(o(j), { icon: "tabler:pencil" })
            ], 8, tn)) : f("", !0),
            n.deletable ? (t(), l("button", {
              key: 1,
              type: "button",
              class: "ac-icon-btn kx-focus-outline",
              "aria-label": "Delete profile",
              onClick: (h) => J(n)
            }, [
              P(o(j), { icon: "tabler:trash" })
            ], 8, an)) : f("", !0)
          ])
        ]))), 128))
      ])) : (t(), l("p", zl, "No matches.")) : (t(), l("p", Jl, "Create a profile to reuse agent and task settings.")),
      m.value ? (t(), oe(Le, {
        key: 5,
        title: B.value ? "Edit profile" : "Create profile",
        busy: _.value,
        onClose: u[19] || (u[19] = (n) => m.value = null)
      }, {
        default: me(() => [
          e("form", {
            class: "ac-form",
            onSubmit: _e(te, ["prevent"])
          }, [
            L.value ? (t(), l("p", ln, i(L.value), 1)) : f("", !0),
            e("fieldset", {
              class: "ac-form",
              disabled: _.value
            }, [
              e("label", on, [
                u[20] || (u[20] = e("span", null, "Title", -1)),
                Q(e("input", {
                  "onUpdate:modelValue": u[1] || (u[1] = (n) => m.value.title = n),
                  "aria-label": "Profile title",
                  class: "kx-focus-halo",
                  required: "",
                  maxlength: "200"
                }, null, 512), [
                  [ue, m.value.title]
                ])
              ]),
              e("label", sn, [
                u[21] || (u[21] = e("span", null, "Agent", -1)),
                Q(e("select", {
                  "onUpdate:modelValue": u[2] || (u[2] = (n) => m.value.agent = n),
                  class: "kx-focus-halo",
                  onChange: G
                }, [
                  (t(!0), l(z, null, Z(o(I).agents, (n) => (t(), l("option", {
                    key: n.id,
                    value: n.id
                  }, i(n.title), 9, un))), 128))
                ], 544), [
                  [de, m.value.agent]
                ])
              ]),
              e("label", dn, [
                u[23] || (u[23] = e("span", null, "Account", -1)),
                Q(e("select", {
                  "onUpdate:modelValue": u[3] || (u[3] = (n) => m.value.account_id = n),
                  class: "kx-focus-halo"
                }, [
                  u[22] || (u[22] = e("option", { value: "" }, "Auto balance", -1)),
                  (t(!0), l(z, null, Z(T.value.filter((n) => n.agent === m.value?.agent), (n) => (t(), l("option", {
                    key: n.id,
                    value: n.id
                  }, i(n.label), 9, cn))), 128))
                ], 512), [
                  [de, m.value.account_id]
                ])
              ]),
              m.value.account_id ? f("", !0) : (t(), l("label", rn, [
                u[24] || (u[24] = e("span", null, "Account pool (empty uses all usable accounts)", -1)),
                Q(e("select", {
                  "onUpdate:modelValue": u[4] || (u[4] = (n) => m.value.account_pool = n),
                  multiple: "",
                  class: "kx-focus-halo"
                }, [
                  (t(!0), l(z, null, Z(T.value.filter((n) => n.agent === m.value?.agent), (n) => (t(), l("option", {
                    key: n.id,
                    value: n.id
                  }, i(n.label), 9, vn))), 128))
                ], 512), [
                  [de, m.value.account_pool]
                ])
              ])),
              e("label", pn, [
                u[26] || (u[26] = e("span", null, "Image", -1)),
                Q(e("select", {
                  "onUpdate:modelValue": u[5] || (u[5] = (n) => m.value.image_id = n),
                  required: "",
                  class: "kx-focus-halo"
                }, [
                  u[25] || (u[25] = e("option", { value: "" }, "Choose an image", -1)),
                  (t(!0), l(z, null, Z(q.value.filter((n) => n.agents.includes(m.value?.agent ?? "")), (n) => (t(), l("option", {
                    key: n.id,
                    value: n.id
                  }, i(n.label), 9, gn))), 128))
                ], 512), [
                  [de, m.value.image_id]
                ])
              ]),
              e("label", fn, [
                u[28] || (u[28] = e("span", null, "Workspace", -1)),
                Q(e("select", {
                  "onUpdate:modelValue": u[6] || (u[6] = (n) => m.value.workspace_id = n),
                  class: "kx-focus-halo"
                }, [
                  u[27] || (u[27] = e("option", { value: "" }, "Scratch directory", -1)),
                  (t(!0), l(z, null, Z(E.value, (n) => (t(), l("option", {
                    key: n.id,
                    value: n.id
                  }, i(n.name), 9, mn))), 128))
                ], 512), [
                  [de, m.value.workspace_id]
                ])
              ]),
              C.value?.endpoints.length ? (t(), l(z, { key: 1 }, [
                e("label", hn, [
                  u[29] || (u[29] = e("span", null, "Endpoint protocol", -1)),
                  Q(e("select", {
                    "onUpdate:modelValue": u[7] || (u[7] = (n) => ee.value = n),
                    class: "kx-focus-halo"
                  }, [
                    (t(!0), l(z, null, Z(C.value.endpoints, (n) => (t(), l("option", {
                      key: n,
                      value: n
                    }, i(n), 9, kn))), 128))
                  ], 512), [
                    [de, ee.value]
                  ])
                ]),
                e("label", bn, [
                  u[30] || (u[30] = e("span", null, "Endpoint URL", -1)),
                  Q(e("input", {
                    "onUpdate:modelValue": u[8] || (u[8] = (n) => D.value = n),
                    class: "kx-focus-halo",
                    placeholder: "Use account endpoint",
                    maxlength: "512"
                  }, null, 512), [
                    [ue, D.value]
                  ])
                ]),
                e("label", yn, [
                  u[31] || (u[31] = e("span", null, "Endpoint model", -1)),
                  Q(e("input", {
                    "onUpdate:modelValue": u[9] || (u[9] = (n) => V.value = n),
                    class: "kx-focus-halo",
                    maxlength: "200"
                  }, null, 512), [
                    [ue, V.value]
                  ])
                ])
              ], 64)) : f("", !0),
              e("label", _n, [
                u[32] || (u[32] = e("span", null, "Repository URL", -1)),
                Q(e("input", {
                  "onUpdate:modelValue": u[10] || (u[10] = (n) => m.value.repo_url = n),
                  class: "kx-focus-halo",
                  maxlength: "2000"
                }, null, 512), [
                  [ue, m.value.repo_url]
                ])
              ]),
              e("label", $n, [
                u[33] || (u[33] = e("span", null, "Repository ref", -1)),
                Q(e("input", {
                  "onUpdate:modelValue": u[11] || (u[11] = (n) => m.value.repo_ref = n),
                  class: "kx-focus-halo",
                  maxlength: "200"
                }, null, 512), [
                  [ue, m.value.repo_ref]
                ])
              ]),
              e("label", wn, [
                u[34] || (u[34] = e("span", null, "Run timeout", -1)),
                Q(e("input", {
                  "onUpdate:modelValue": u[12] || (u[12] = (n) => m.value.run_timeout = n),
                  class: "kx-focus-halo",
                  placeholder: "Use configured timeout",
                  maxlength: "64"
                }, null, 512), [
                  [ue, m.value.run_timeout]
                ])
              ]),
              C.value?.unattended ? (t(), l("label", xn, [
                e("input", {
                  checked: m.value.unattended !== !1,
                  onChange: u[13] || (u[13] = (n) => m.value.unattended = n.target.checked),
                  type: "checkbox",
                  class: "kx-focus-outline"
                }, null, 40, Cn),
                u[35] || (u[35] = M("Unattended · skip permission prompts when the image allows it", -1))
              ])) : f("", !0),
              P(Me, {
                modelValue: m.value.tools,
                "onUpdate:modelValue": u[14] || (u[14] = (n) => m.value.tools = n),
                agent: m.value.agent,
                onInvalid: u[15] || (u[15] = (n) => W.value = n)
              }, null, 8, ["modelValue", "agent"]),
              C.value ? (t(), oe(je, {
                key: C.value.id,
                modelValue: m.value.options,
                "onUpdate:modelValue": u[16] || (u[16] = (n) => m.value.options = n),
                options: C.value.options,
                defaults: m.value.unattended !== !1 ? C.value.unattended : {},
                onInvalid: u[17] || (u[17] = (n) => R.value = n)
              }, null, 8, ["modelValue", "options", "defaults"])) : f("", !0),
              e("footer", Vn, [
                e("button", {
                  type: "button",
                  class: "ac-btn kx-focus-halo",
                  onClick: u[18] || (u[18] = (n) => m.value = null)
                }, "Cancel"),
                e("button", {
                  type: "submit",
                  class: "ac-btn primary kx-focus-halo",
                  disabled: _.value || !!R.value || W.value
                }, "Save", 8, An)
              ])
            ], 8, nn)
          ], 32)
        ]),
        _: 1
      }, 8, ["title", "busy"])) : f("", !0)
    ], 8, Ml));
  }
}), Un = { class: "ac" }, Tn = {
  key: 1,
  class: "ac-bar"
}, Ln = {
  class: "ac-tabs",
  "aria-label": "Autocode views"
}, Fn = ["aria-pressed", "onClick"], Rn = ["href"], En = {
  key: 2,
  class: "kx-err"
}, In = {
  key: 3,
  class: "kx-loading"
}, Nn = {
  key: 0,
  class: "kx-empty"
}, Pn = /* @__PURE__ */ re({
  __name: "autocode",
  setup(s) {
    const d = Qe(), v = Xe(), a = p(null);
    pe(() => d.value?.route, () => {
      a.value = null;
    });
    const F = X(() => a.value ?? d.value?.route ?? ""), A = X(() => {
      const D = /^\/?runs\/([^/]+)\/?$/.exec(F.value);
      try {
        return D ? decodeURIComponent(D[1]) : "";
      } catch {
        return "";
      }
    }), I = X(() => !!F.value && F.value !== "/" && !A.value);
    function S(D) {
      T.value = "tasks", a.value = D, v("navigate", { path: D });
    }
    const U = [
      { id: "tasks", label: "Tasks", icon: "tabler:player-play" },
      { id: "profiles", label: "Profiles", icon: "tabler:robot" },
      { id: "accounts", label: "Accounts", icon: "tabler:key" }
    ], T = p("tasks"), { catalog: q, error: E, load: H } = lt(), L = p(""), x = p(0), _ = p(null), R = p(null), W = p(null), B = p("");
    async function m(D) {
      D && (B.value = D), T.value = "accounts", L.value = "", await Te(), W.value?.open();
    }
    function ee() {
      T.value === "tasks" ? _.value?.open() : T.value === "profiles" ? R.value?.open() : W.value?.open();
    }
    return (D, V) => (t(), l("div", Un, [
      !A.value && !I.value ? (t(), oe(nt, {
        key: 0,
        title: "Autocode",
        subtitle: "Run coding agents with your accounts and workspaces.",
        count: `${x.value} ${T.value === "tasks" ? "task" : T.value === "profiles" ? "profile" : "account"}${x.value === 1 ? "" : "s"}`,
        action: T.value === "tasks" ? "New task" : T.value === "profiles" ? "Create profile" : "Add account",
        query: L.value,
        "onUpdate:query": V[0] || (V[0] = (C) => L.value = C),
        placeholder: T.value === "tasks" ? "Search tasks…" : T.value === "profiles" ? "Search profiles…" : "Search accounts…",
        onCreate: ee
      }, null, 8, ["count", "action", "query", "placeholder"])) : f("", !0),
      !A.value && !I.value ? (t(), l("div", Tn, [
        e("nav", Ln, [
          (t(), l(z, null, Z(U, (C) => e("button", {
            key: C.id,
            type: "button",
            class: ce(["ac-tab kx-focus-outline", { active: T.value === C.id }]),
            "aria-pressed": T.value === C.id,
            onClick: (ae) => {
              T.value !== C.id && (T.value = C.id, L.value = "", x.value = 0);
            }
          }, [
            P(o(j), {
              icon: C.icon
            }, null, 8, ["icon"]),
            M(" " + i(C.label), 1)
          ], 10, Fn)), 64))
        ]),
        o(q)?.settings_path && (o(q).can_images || o(q).can_workspaces || o(q).can_prune) ? (t(), l("a", {
          key: 0,
          class: "ac-link kx-focus-outline",
          href: o(q).settings_path,
          onClick: V[1] || (V[1] = _e((C) => o(we).navigate(o(q).settings_path), ["prevent"]))
        }, "Images, workspaces and Docker", 8, Rn)) : f("", !0)
      ])) : f("", !0),
      o(E) && !o(q) ? (t(), l("p", En, [
        M(i(o(E)) + " ", 1),
        e("button", {
          class: "ac-link kx-focus-outline",
          type: "button",
          onClick: V[2] || (V[2] = //@ts-ignore
          (...C) => o(H) && o(H)(...C))
        }, "Retry")
      ])) : o(q) ? (t(), l("main", {
        key: 4,
        class: ce(["ac-body", { "ac-detail-page": A.value || I.value }])
      }, [
        I.value ? (t(), l("div", Nn, [
          V[11] || (V[11] = e("h1", null, "Run not found", -1)),
          e("button", {
            type: "button",
            class: "ac-btn kx-focus-halo",
            onClick: V[3] || (V[3] = (C) => S(""))
          }, "Back to tasks")
        ])) : A.value || T.value === "tasks" ? (t(), oe(Xa, {
          key: 1,
          ref_key: "tasks",
          ref: _,
          query: L.value,
          "run-id": A.value,
          onOpen: V[4] || (V[4] = (C) => S("runs/" + encodeURIComponent(C))),
          onClose: V[5] || (V[5] = (C) => S("")),
          onCount: V[6] || (V[6] = (C) => x.value = C),
          onAgentChanged: V[7] || (V[7] = (C) => B.value = C),
          onGoto: m
        }, null, 8, ["query", "run-id"])) : T.value === "profiles" ? (t(), oe(Sn, {
          key: 2,
          ref_key: "profiles",
          ref: R,
          query: L.value,
          onCount: V[8] || (V[8] = (C) => x.value = C)
        }, null, 8, ["query"])) : (t(), oe(Dl, {
          key: 3,
          ref_key: "accounts",
          ref: W,
          query: L.value,
          "selected-agent": B.value,
          onCount: V[9] || (V[9] = (C) => x.value = C)
        }, null, 8, ["query", "selected-agent"]))
      ], 2)) : (t(), l("div", In, [
        P(o(j), {
          icon: "tabler:loader-2",
          class: "spin"
        }),
        V[10] || (V[10] = M(" Loading…", -1))
      ]))
    ]));
  }
}), zn = {
  rootComponent: Pn,
  plugins: [Ye]
};
export {
  zn as mountConfig
};
