import { u as ke, c as Ve, _ as Ae, d as ze, e as Ne, B as Je, f as He, a as Ge, b as Ke, s as Qe, P as Xe } from "./styles-C4tJ2C9e.js";
import { u as _e, a as Ye, b as Ze, W as et } from "./dto-BNKl23sa.js";
import { defineComponent as ve, openBlock as t, createElementBlock as l, Fragment as z, renderList as ee, normalizeClass as ue, createVNode as O, unref as n, createTextVNode as D, toDisplayString as i, ref as p, computed as Y, onMounted as Se, watch as ge, createElementVNode as e, withDirectives as Q, vModelText as se, vModelSelect as ie, createCommentVNode as f, isRef as fe, vModelCheckbox as tt, createBlock as ne, onUnmounted as ye, nextTick as Te, withCtx as he, mergeProps as be, renderSlot as at, withKeys as Oe, withModifiers as Ue } from "vue";
import { Icon as j } from "@iconify/vue";
import { b as $e, a as X, e as oe, d as Fe, f as me, g as we, l as Le, h as Re, i as qe, t as lt, s as xe, A as nt, c as Ee, u as Pe, r as Ie, p as ot } from "./presentation-zvMeYiCQ.js";
import { d as st, e as it, u as ut, _ as Be } from "./driver-options.vue_vue_type_script_setup_true_lang-7aqb2oKJ.js";
import { config as ct, loadByTagName as dt, host as De, define as rt } from "@wippy-fe/proxy";
import { a as vt } from "./driver-account-types-CyHjNRh_.js";
const pt = {
  key: 0,
  class: "ac-chips",
  role: "group",
  "aria-label": "Agent"
}, gt = ["disabled", "aria-pressed", "onClick"], ft = ["disabled", "value"], ht = ["value"], Me = /* @__PURE__ */ ve({
  __name: "agent-picker",
  props: {
    agents: {},
    modelValue: {},
    disabled: { type: Boolean }
  },
  emits: ["update:modelValue"],
  setup(s) {
    return (u, v) => s.agents.length <= 6 ? (t(), l("div", pt, [
      (t(!0), l(z, null, ee(s.agents, (a) => (t(), l("button", {
        key: a.id,
        disabled: s.disabled,
        type: "button",
        class: ue(["ac-chip kx-focus-halo", { active: s.modelValue === a.id }]),
        "aria-pressed": s.modelValue === a.id,
        onClick: (L) => u.$emit("update:modelValue", a.id)
      }, [
        O(n(j), {
          icon: n($e)(a.id, s.agents),
          "aria-hidden": "true"
        }, null, 8, ["icon"]),
        D(i(a.title), 1)
      ], 10, gt))), 128))
    ])) : (t(), l("select", {
      key: 1,
      disabled: s.disabled,
      class: "kx-focus-halo",
      "aria-label": "Agent",
      value: s.modelValue,
      onChange: v[0] || (v[0] = (a) => u.$emit("update:modelValue", a.target.value))
    }, [
      (t(!0), l(z, null, ee(s.agents, (a) => (t(), l("option", {
        key: a.id,
        value: a.id
      }, i(a.title), 9, ht))), 128))
    ], 40, ft));
  }
}), mt = ["disabled"], kt = { class: "ac-field ac-composer" }, bt = { class: "ac-field" }, yt = ["value"], _t = { class: "ac-field" }, $t = {
  key: 0,
  class: "ac-muted"
}, wt = {
  key: 1,
  class: "ac-muted"
}, xt = { class: "ac-picker-row" }, Ct = { class: "ac-field" }, Vt = ["value"], Ut = { value: "" }, At = ["value"], St = { class: "ac-field" }, Tt = ["value"], Ft = ["value"], Lt = { class: "ac-field" }, Rt = ["value"], Et = ["value"], Pt = { class: "ac-advanced" }, It = { class: "ac-form" }, Nt = { class: "ac-field" }, Ot = { class: "ac-field" }, qt = { class: "ac-field" }, Bt = {
  key: 0,
  class: "ac-check"
}, Dt = {
  key: 2,
  class: "kx-err",
  role: "alert"
}, Mt = { class: "ac-dialog-foot" }, jt = ["disabled"], Wt = /* @__PURE__ */ ve({
  __name: "task-form",
  props: {
    accounts: {},
    images: {},
    workspaces: {}
  },
  emits: ["started", "goto", "agentChanged", "cancel", "busy"],
  setup(s, { emit: u }) {
    const v = s, a = u, L = ke(), C = p(null), N = p([]), U = p(""), V = p({}), A = Y(() => N.value.find((F) => F.id === U.value));
    Se(async () => {
      try {
        N.value = await X.profiles();
      } catch (F) {
        E.value = oe(F, "Could not load profiles.");
      }
    });
    function W() {
      V.value = {};
    }
    function P(F) {
      U.value ? V.value = { ...V.value, ...F } : S.value = { ...S.value, ...F };
    }
    function J() {
      const F = L.value.settings_path;
      F && C.value?.dispatchEvent(new CustomEvent("navigate", { detail: { path: F }, bubbles: !0, composed: !0 }));
    }
    const S = p({ agent: st(L.value, v.accounts), account_id: "", image_id: "", workspace_id: "", repo_url: "" }), x = Y(() => it(U.value ? V.value : S.value, A.value)), { now: _, driver: R, agentAccounts: M, ready: h, agentImages: B, invalidOptions: Z, optionValues: q, invalidImage: w, invalidAccount: T, invalidWorkspace: G, selectAgent: le } = ut(x, {
      catalog: () => L.value,
      accounts: () => v.accounts,
      images: () => v.images,
      workspaces: () => v.workspaces
    }, "live", () => !!U.value), te = Y({
      get: () => x.value.agent ?? "",
      set: (F) => {
        if (F === x.value.agent) return;
        const o = le(F);
        P({ agent: F, account_id: o.account_id, image_id: o.image_id, options: o.options, unattended: o.unattended });
      }
    });
    function H(F) {
      return Y({ get: () => x.value[F] ?? "", set: (o) => P({ [F]: o }) });
    }
    const ae = H("account_id"), m = H("image_id"), r = H("workspace_id"), c = H("repo_url"), y = H("repo_ref"), k = Y({ get: () => x.value.run_timeout ?? "", set: (F) => P({ run_timeout: F }) }), b = p(""), g = Y({ get: () => q.value, set: (F) => P({ options: F }) }), $ = Y({ get: () => x.value.unattended ?? !!R.value?.unattended, set: (F) => P({ unattended: F }) }), I = p(!1), E = p("");
    function de(F) {
      return Fe(F, _.value) === "cooling" ? `${F.label} (cooling down${F.cooldown_until ? " until " + me(F.cooldown_until) : ""})` : F.label;
    }
    ge(te, (F) => a("agentChanged", F), { immediate: !0 });
    let ce;
    ge([U, te, ae, m, r, c, y, k, b, g, $], () => {
      ce = void 0;
    }, { deep: !0, flush: "sync" });
    async function Ce() {
      if (!I.value) {
        E.value = "", I.value = !0, a("busy", !0);
        try {
          const F = {
            agent: te.value,
            account_id: ae.value,
            image_id: m.value,
            workspace_id: r.value,
            repo_url: c.value,
            repo_ref: y.value.trim() || void 0,
            timeout: k.value.trim() || void 0,
            prompt: b.value,
            options: x.value.options ?? {},
            unattended: $.value
          }, { run_timeout: o, ...d } = V.value, K = U.value ? {
            profile_id: U.value,
            prompt: b.value,
            options: x.value.options ?? {},
            ...d,
            ...o !== void 0 ? { timeout: o } : {}
          } : F, re = JSON.stringify(K);
          (!ce || ce.snapshot !== re) && (ce = { snapshot: re, key: crypto.randomUUID(), body: { ...K, options: JSON.parse(JSON.stringify(K.options)) } });
          const { run_id: pe } = await X.startRun({ ...ce.body, idempotency_key: ce.key });
          ce = void 0, b.value = "", a("started", pe);
        } catch (F) {
          E.value = oe(F, "Could not start the task.");
        } finally {
          I.value = !1, a("busy", !1);
        }
      }
    }
    return (F, o) => (t(), l("fieldset", {
      ref_key: "root",
      ref: C,
      class: "ac-form ac-new",
      disabled: I.value
    }, [
      e("label", kt, [
        o[14] || (o[14] = e("span", null, "Prompt", -1)),
        Q(e("textarea", {
          "onUpdate:modelValue": o[0] || (o[0] = (d) => b.value = d),
          autofocus: "",
          rows: "8",
          class: "kx-focus-halo",
          placeholder: "What should the agent do?"
        }, null, 512), [
          [se, b.value]
        ])
      ]),
      e("label", bt, [
        o[16] || (o[16] = e("span", null, "Profile", -1)),
        Q(e("select", {
          "onUpdate:modelValue": o[1] || (o[1] = (d) => U.value = d),
          "aria-label": "Profile",
          class: "kx-focus-halo",
          onChange: W
        }, [
          o[15] || (o[15] = e("option", { value: "" }, "Custom task", -1)),
          (t(!0), l(z, null, ee(N.value, (d) => (t(), l("option", {
            key: d.id,
            value: d.id
          }, i(d.title), 9, yt))), 128))
        ], 544), [
          [ie, U.value]
        ])
      ]),
      e("div", _t, [
        o[17] || (o[17] = e("span", null, "Agent", -1)),
        O(Me, {
          modelValue: te.value,
          "onUpdate:modelValue": o[2] || (o[2] = (d) => te.value = d),
          agents: n(L).agents
        }, null, 8, ["modelValue", "agents"])
      ]),
      te.value && !n(M).length ? (t(), l("p", $t, [
        D(" No " + i(n(R)?.title) + " accounts you can run on. ", 1),
        e("button", {
          class: "ac-link kx-focus-outline",
          type: "button",
          onClick: o[3] || (o[3] = (d) => a("goto", "accounts", te.value))
        }, "Add an account")
      ])) : f("", !0),
      n(B).length ? f("", !0) : (t(), l("p", wt, [
        D(" No image with " + i(n(R)?.title ?? te.value) + "; ask an administrator. ", 1),
        n(L).can_images && n(L).settings_path ? (t(), l("button", {
          key: 0,
          class: "ac-link kx-focus-outline",
          type: "button",
          onClick: J
        }, "Manage images")) : f("", !0)
      ])),
      e("div", xt, [
        e("label", Ct, [
          o[18] || (o[18] = e("span", null, "Account", -1)),
          Q(e("select", {
            "onUpdate:modelValue": o[4] || (o[4] = (d) => fe(ae) ? ae.value = d : null),
            class: "kx-focus-halo"
          }, [
            U.value && n(T) ? (t(), l("option", {
              key: 0,
              value: n(ae)
            }, i(n(ae)) + " (unavailable)", 9, Vt)) : f("", !0),
            e("option", Ut, "Auto (" + i(n(h).length) + " ready)", 1),
            (t(!0), l(z, null, ee(n(M), (d) => (t(), l("option", {
              key: d.id,
              value: d.id
            }, i(de(d)), 9, At))), 128))
          ], 512), [
            [ie, n(ae)]
          ])
        ]),
        e("label", St, [
          o[19] || (o[19] = e("span", null, "Image", -1)),
          Q(e("select", {
            "onUpdate:modelValue": o[5] || (o[5] = (d) => fe(m) ? m.value = d : null),
            class: "kx-focus-halo"
          }, [
            U.value && n(w) && n(m) ? (t(), l("option", {
              key: 0,
              value: n(m)
            }, i(n(m)) + " (unavailable)", 9, Tt)) : f("", !0),
            (t(!0), l(z, null, ee(n(B), (d) => (t(), l("option", {
              key: d.id,
              value: d.id
            }, i(d.label), 9, Ft))), 128))
          ], 512), [
            [ie, n(m)]
          ])
        ]),
        e("label", Lt, [
          o[21] || (o[21] = e("span", null, "Workspace", -1)),
          Q(e("select", {
            "onUpdate:modelValue": o[6] || (o[6] = (d) => fe(r) ? r.value = d : null),
            class: "kx-focus-halo"
          }, [
            o[20] || (o[20] = e("option", { value: "" }, "Scratch directory", -1)),
            U.value && n(G) ? (t(), l("option", {
              key: 0,
              value: n(r)
            }, i(n(r)) + " (unavailable)", 9, Rt)) : f("", !0),
            (t(!0), l(z, null, ee(s.workspaces, (d) => (t(), l("option", {
              key: d.id,
              value: d.id
            }, i(d.name) + i(d.writable ? "" : " (read-only)"), 9, Et))), 128))
          ], 512), [
            [ie, n(r)]
          ])
        ])
      ]),
      e("details", Pt, [
        o[26] || (o[26] = e("summary", { class: "kx-focus-outline" }, "Advanced", -1)),
        e("div", It, [
          e("label", Nt, [
            o[22] || (o[22] = e("span", null, "Git repository", -1)),
            Q(e("input", {
              "onUpdate:modelValue": o[7] || (o[7] = (d) => fe(c) ? c.value = d : null),
              class: "ac-mono kx-focus-halo",
              placeholder: "Optional: https://github.com/org/repo.git"
            }, null, 512), [
              [se, n(c)]
            ])
          ]),
          e("label", Ot, [
            o[23] || (o[23] = e("span", null, "Repository ref", -1)),
            Q(e("input", {
              "onUpdate:modelValue": o[8] || (o[8] = (d) => fe(y) ? y.value = d : null),
              "aria-label": "Repository ref",
              class: "ac-mono kx-focus-halo",
              placeholder: "Default branch"
            }, null, 512), [
              [se, n(y)]
            ])
          ]),
          e("label", qt, [
            o[24] || (o[24] = e("span", null, "Run timeout", -1)),
            Q(e("input", {
              "onUpdate:modelValue": o[9] || (o[9] = (d) => k.value = d),
              maxlength: "64",
              class: "ac-mono kx-focus-halo",
              placeholder: "Use configured timeout"
            }, null, 512), [
              [se, k.value]
            ])
          ]),
          n(R)?.unattended ? (t(), l("label", Bt, [
            Q(e("input", {
              "onUpdate:modelValue": o[10] || (o[10] = (d) => $.value = d),
              type: "checkbox",
              class: "kx-focus-outline"
            }, null, 512), [
              [tt, $.value]
            ]),
            o[25] || (o[25] = D(" Unattended · skip permission prompts when the image allows it ", -1))
          ])) : f("", !0),
          n(R) ? (t(), ne(Be, {
            key: U.value + n(R).id,
            modelValue: g.value,
            "onUpdate:modelValue": o[11] || (o[11] = (d) => g.value = d),
            options: n(R).options,
            defaults: { ...$.value ? n(R).unattended : {}, ...A.value?.options },
            onInvalid: o[12] || (o[12] = (d) => Z.value = d)
          }, null, 8, ["modelValue", "options", "defaults"])) : f("", !0)
        ])
      ]),
      E.value ? (t(), l("p", Dt, i(E.value), 1)) : f("", !0),
      e("footer", Mt, [
        e("button", {
          type: "button",
          class: "ac-btn kx-focus-halo",
          onClick: o[13] || (o[13] = (d) => a("cancel"))
        }, "Cancel"),
        e("button", {
          type: "button",
          class: "ac-btn primary kx-focus-halo",
          disabled: I.value || n(Z) > 0 || !U.value && (!te.value || !(n(ae) || n(h).length) || !n(m)) || !b.value.trim(),
          onClick: Ce
        }, [
          O(n(j), { icon: "tabler:player-play" }),
          D(" " + i(I.value ? "Starting…" : "Start"), 1)
        ], 8, jt)
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
}, ca = {
  key: 0,
  class: "ac-detail-section",
  "aria-label": "Usage by model"
}, da = {
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
}, _a = {
  class: "ac-detail-section",
  "aria-labelledby": "ac-log-heading"
}, $a = { class: "ac-section-head" }, wa = { class: "ac-muted" }, xa = ["disabled"], Ca = ["disabled"], Va = {
  class: "ac-stream",
  tabindex: "0",
  "aria-label": "Task log"
}, Ua = { class: "ac-event-kind" }, Aa = { class: "ac-event-text" }, Sa = {
  key: 0,
  class: "ac-muted ac-pulse"
}, Ta = {
  key: 1,
  class: "ac-muted"
}, Fa = 500, La = /* @__PURE__ */ ve({
  __name: "run-detail",
  props: {
    runId: {},
    accounts: {},
    images: {},
    workspaces: {}
  },
  setup(s) {
    const u = s, v = ke(), a = p(null), L = p([]), C = p(0), N = p(!1), U = p(!1);
    let V;
    const A = p(!1), W = p(""), P = p(!1), J = p(null), S = p(!1), x = p("");
    let _ = null;
    const R = p(!1), M = p(!1), h = p(!1), B = p(""), Z = we(), q = Y(() => (a.value?.prompt.length ?? 0) > 500 || (a.value?.prompt.split(`
`).length ?? 0) > 5), w = Y(() => (a.value?.result.length ?? 0) > 1800 || (a.value?.result.split(`
`).length ?? 0) > 10);
    let T = !0, G = !0, le, te;
    const H = (o) => o.status === "queued" || o.status === "running";
    function ae() {
      _ && (G = _.scrollHeight - _.scrollTop - _.clientHeight < 40);
    }
    Se(() => {
      _ = J.value?.closest(".ac") ?? null, _?.addEventListener("scroll", ae, { passive: !0 });
    }), ye(() => {
      _?.removeEventListener("scroll", ae), _ = null;
    });
    const m = xe(async () => {
      try {
        const o = V ?? (a.value ? void 0 : 0);
        V = void 0;
        let d = await X.run(u.runId, o === void 0 ? C.value : void 0, o);
        if (!T) return;
        if (o === void 0 && (d.more || A.value && d.events.length)) {
          if (d = await X.run(u.runId, void 0, 0), !T) return;
          L.value = d.events, N.value = d.more, A.value = !1;
        } else if (o !== void 0)
          L.value = d.events, N.value = d.more, A.value = o !== 0;
        else if (d.events.length) {
          const K = Math.max(0, L.value.length + d.events.length - Fa);
          K && L.value.splice(0, K), L.value.push(...d.events), N.value = N.value || K > 0;
        }
        P.value = !1, a.value = d.run, A.value || (C.value = d.next_seq), await Te(), T && G && _ && _.scrollTo({ top: _.scrollHeight }), W.value = "";
      } catch (o) {
        if (!T) return;
        P.value = o instanceof nt && o.code === "autocode.run_not_found", P.value && (a.value = null, L.value = []), W.value = P.value ? "" : oe(o, "Could not load the task.");
      } finally {
        U.value = !1;
      }
    });
    function r() {
      U.value || !L.value.length || (G = !1, U.value = !0, V = L.value[0].seq, m());
    }
    function c() {
      U.value || (G = !0, U.value = !0, V = 0, m());
    }
    const y = Le.run(u.runId, () => {
      m();
    });
    _e(m), ye(() => {
      T = !1, y(), clearTimeout(te), clearTimeout(le);
    });
    async function k() {
      try {
        await X.cancelRun(u.runId), await m();
      } catch (o) {
        W.value = oe(o, "Could not cancel the task.");
      }
    }
    async function b(o) {
      try {
        await navigator.clipboard.writeText(o);
      } catch {
        const d = document.createElement("textarea"), K = J.value?.getRootNode(), re = K instanceof ShadowRoot || K instanceof Document ? K.activeElement : null, pe = re instanceof HTMLElement ? re : null;
        d.value = o, d.readOnly = !0, d.style.cssText = "position:fixed;opacity:0;pointer-events:none;", J.value?.append(d);
        try {
          if (d.select(), !document.execCommand("copy")) throw new Error("Copy failed");
        } finally {
          d.remove(), pe?.focus({ preventScroll: !0 });
        }
      }
    }
    async function g() {
      try {
        await b(a.value?.result ?? ""), h.value = !0, B.value = "", clearTimeout(te), te = setTimeout(() => {
          h.value = !1;
        }, 2e3);
      } catch {
        B.value = "Could not copy. Select the result text to copy it.";
      }
    }
    async function $() {
      try {
        const o = new URL(ct.env.APP_API_URL || "/", window.location.href);
        await b(new URL(`/autocode/runs/${encodeURIComponent(u.runId)}`, o).href), S.value = !0, x.value = "", clearTimeout(le), le = setTimeout(() => {
          S.value = !1;
        }, 2e3);
      } catch {
        x.value = "Could not copy the link. Try again.";
      }
    }
    function I() {
      M.value = !M.value;
    }
    function E(o) {
      return typeof o.options?.model == "string" ? o.options.model : "";
    }
    function de(o) {
      return u.accounts.find((d) => d.id === o)?.label ?? "Unlisted account";
    }
    function ce(o) {
      return u.workspaces.find((d) => d.id === o)?.name ?? "Unlisted workspace";
    }
    function Ce(o) {
      return u.images.find((d) => d.id === o)?.label ?? "Unlisted image";
    }
    function F(o) {
      const d = [];
      return o.usage.input_tokens !== void 0 && d.push(`${o.usage.input_tokens} input`), o.usage.output_tokens !== void 0 && d.push(`${o.usage.output_tokens} output`), o.usage.cached_tokens !== void 0 && d.push(`${o.usage.cached_tokens} cached`), o.usage.cache_write_tokens !== void 0 && d.push(`${o.usage.cache_write_tokens} cache write`), o.usage.reasoning_tokens !== void 0 && d.push(`${o.usage.reasoning_tokens} reasoning`), o.usage.cost_usd !== void 0 && d.push(`$${o.usage.cost_usd}`), d.join(" · ");
    }
    return (o, d) => (t(), l("section", {
      ref_key: "detail",
      ref: J,
      class: "ac-form ac-detail"
    }, [
      P.value ? (t(), l("div", zt, [...d[2] || (d[2] = [
        e("h1", null, "Run not found", -1),
        e("p", null, "This run does not exist or you do not have access to it.", -1)
      ])])) : f("", !0),
      W.value ? (t(), l("p", Jt, [
        D(i(W.value) + " ", 1),
        e("button", {
          type: "button",
          class: "ac-link kx-focus-outline",
          onClick: d[0] || (d[0] = //@ts-ignore
          (...K) => n(m) && n(m)(...K))
        }, "Retry")
      ])) : f("", !0),
      !a.value && !W.value && !P.value ? (t(), l("div", Ht, [
        O(n(j), {
          icon: "tabler:loader-2",
          class: "spin"
        }),
        d[3] || (d[3] = D(" Loading the task…", -1))
      ])) : a.value ? (t(), l(z, { key: 3 }, [
        e("header", Gt, [
          e("div", Kt, [
            e("span", {
              class: ue(["kx-tag-sm ac-tone", a.value.status])
            }, i(a.value.status), 3),
            e("button", {
              type: "button",
              class: "ac-btn kx-focus-halo",
              "aria-live": "polite",
              onClick: $
            }, [
              O(n(j), {
                icon: S.value ? "tabler:check" : "tabler:link"
              }, null, 8, ["icon"]),
              D(i(S.value ? "Link copied" : "Copy link"), 1)
            ]),
            H(a.value) ? (t(), l("button", {
              key: 0,
              type: "button",
              class: "ac-btn danger kx-focus-halo",
              disabled: a.value.cancel_requested,
              onClick: k
            }, [
              O(n(j), { icon: "tabler:player-stop" }),
              D(" " + i(a.value.cancel_requested ? "Cancelling…" : "Cancel"), 1)
            ], 8, Qt)) : f("", !0)
          ]),
          e("h1", Xt, i(a.value.prompt.split(`
`)[0]), 1),
          e("div", Yt, [
            e("span", null, [
              O(n(j), {
                icon: n($e)(a.value.agent, n(v).agents)
              }, null, 8, ["icon"]),
              D(i(n(v).agents.find((K) => K.id === a.value?.agent)?.title ?? a.value.agent), 1)
            ]),
            e("span", null, i(de(a.value.account_id)), 1),
            e("span", null, i(Ce(a.value.image_id)), 1),
            e("span", {
              title: n(me)(a.value.started_at || a.value.created_at)
            }, i(a.value.started_at ? "Started" : "Queued") + " " + i(n(Re)(a.value.started_at || a.value.created_at, n(Z))), 9, Zt),
            a.value.started_at ? (t(), l("span", ea, i(n(qe)(a.value, n(Z))) + " " + i(H(a.value) ? "elapsed" : "duration"), 1)) : f("", !0),
            a.value.timeout_ms ? (t(), l("span", ta, i(n(lt)(a.value.timeout_ms)), 1)) : f("", !0),
            e("span", null, i(a.value.unattended ? "Unattended" : "Attended"), 1),
            a.value.workflow ? (t(), l("span", aa, "Workflow")) : f("", !0),
            a.value.workspace_id ? (t(), l("span", la, i(ce(a.value.workspace_id)), 1)) : f("", !0),
            E(a.value) ? (t(), l("span", na, i(E(a.value)), 1)) : f("", !0),
            F(a.value) ? (t(), l("span", oa, i(F(a.value)), 1)) : f("", !0)
          ])
        ]),
        e("details", sa, [
          d[4] || (d[4] = e("summary", { class: "kx-focus-outline" }, "Effective options", -1)),
          e("pre", ia, i(JSON.stringify(a.value.options, null, 2)), 1),
          a.value.endpoint ? (t(), l("p", ua, i(a.value.endpoint.protocol) + " · " + i(a.value.endpoint.base_url) + " · " + i(a.value.endpoint.model), 1)) : f("", !0)
        ]),
        a.value.usage.models ? (t(), l("section", ca, [
          d[5] || (d[5] = e("h3", null, "Usage by model", -1)),
          (t(!0), l(z, null, ee(a.value.usage.models, (K, re) => (t(), l("p", {
            key: re,
            class: "ac-muted"
          }, i(re) + " · " + i(Object.entries(K).map(([pe, We]) => `${pe === "cost_usd" ? "$" : pe + ": "}${We}`).join(" · ")), 1))), 128))
        ])) : f("", !0),
        x.value ? (t(), l("p", da, i(x.value), 1)) : f("", !0),
        e("section", ra, [
          e("div", va, [
            d[6] || (d[6] = e("h3", { id: "ac-prompt-heading" }, "Prompt", -1)),
            q.value ? (t(), l("button", {
              key: 0,
              type: "button",
              class: "ac-link kx-focus-outline",
              "aria-expanded": R.value,
              "aria-controls": "ac-prompt-text",
              onClick: d[1] || (d[1] = (K) => R.value = !R.value)
            }, i(R.value ? "Collapse prompt" : "Expand prompt"), 9, pa)) : f("", !0)
          ]),
          e("pre", {
            id: "ac-prompt-text",
            class: ue(["ac-pre ac-prompt", { expanded: R.value || !q.value }])
          }, [
            e("span", null, i(a.value.prompt), 1)
          ], 2)
        ]),
        a.value.result ? (t(), l("section", ga, [
          e("div", fa, [
            e("h3", ha, i(a.value.status === "succeeded" ? "Result" : "Partial result"), 1),
            e("div", ma, [
              w.value ? (t(), l("button", {
                key: 0,
                type: "button",
                class: "ac-link kx-focus-outline",
                "aria-expanded": M.value,
                "aria-controls": "ac-result-text",
                onClick: I
              }, i(M.value ? "Collapse result" : "Expand result"), 9, ka)) : f("", !0),
              e("button", {
                type: "button",
                class: "ac-btn kx-focus-halo",
                onClick: g
              }, [
                O(n(j), {
                  icon: h.value ? "tabler:check" : "tabler:copy"
                }, null, 8, ["icon"]),
                D(i(h.value ? "Copied" : "Copy"), 1)
              ])
            ])
          ]),
          B.value ? (t(), l("p", ba, i(B.value), 1)) : f("", !0),
          e("pre", {
            id: "ac-result-text",
            class: ue(["ac-pre ac-result-text", { expanded: M.value }]),
            tabindex: "0",
            "aria-label": "Result"
          }, i(a.value.result), 3)
        ])) : f("", !0),
        a.value.error ? (t(), l("p", ya, i(a.value.error), 1)) : f("", !0),
        e("section", _a, [
          e("div", $a, [
            d[7] || (d[7] = e("h3", { id: "ac-log-heading" }, "Log", -1)),
            e("span", wa, i(L.value.length) + " events", 1)
          ]),
          N.value ? (t(), l("button", {
            key: 0,
            type: "button",
            class: "ac-link kx-focus-outline",
            disabled: U.value,
            onClick: r
          }, i(U.value ? "Loading…" : "Load earlier"), 9, xa)) : f("", !0),
          A.value ? (t(), l("button", {
            key: 1,
            type: "button",
            class: "ac-link kx-focus-outline",
            disabled: U.value,
            onClick: c
          }, "Latest", 8, Ca)) : f("", !0),
          e("div", Va, [
            (t(!0), l(z, null, ee(L.value, (K) => (t(), l("div", {
              key: K.seq,
              class: ue(["ac-event", K.kind])
            }, [
              e("span", Ua, i(K.kind), 1),
              e("pre", Aa, i(K.text), 1)
            ], 2))), 128)),
            H(a.value) ? (t(), l("div", Sa, "Working…")) : L.value.length ? f("", !0) : (t(), l("div", Ta, "No log events."))
          ])
        ])
      ], 64)) : f("", !0)
    ], 512));
  }
}), Ra = {
  key: 0,
  "aria-label": "Task details"
}, Ea = { class: "ac-detail-back" }, Pa = {
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
}, Ma = {
  key: 3,
  class: "ac-run-list"
}, ja = ["onClick"], Wa = { class: "ac-run-copy" }, za = { class: "ac-run-title-row" }, Ja = { class: "ac-run-title" }, Ha = {
  key: 0,
  class: "kx-tag-sm ac-tone"
}, Ga = { class: "ac-run-meta" }, Ka = ["title"], Qa = { key: 0 }, Xa = {
  key: 4,
  class: "ac-load-more"
}, Ya = /* @__PURE__ */ ve({
  __name: "tasks",
  props: {
    query: {},
    runId: {}
  },
  emits: ["goto", "agentChanged", "count", "open", "close"],
  setup(s, { expose: u, emit: v }) {
    const a = Ee(), L = p([]), C = s, N = v, U = ke(), V = p(!1), A = p(!1);
    u({ open: () => {
      V.value = !0;
    } });
    const W = p([]), P = p([]), J = p([]), S = p([]), x = p(), _ = p(!1), R = p(""), M = we(), h = p(!1);
    let B = 0, Z = 1;
    async function q() {
      const y = [];
      let k;
      for (let b = 0; b < Z; b++) {
        const g = await X.runs(k);
        if (!a() || (y.push(...g.runs), k = g.next_cursor, !k)) break;
      }
      return { runs: y, next_cursor: k };
    }
    const w = xe(async () => {
      B++, h.value = !0;
      try {
        await Ie(
          () => Promise.all([X.accounts(), X.images(), q(), X.workspaces()]),
          ([y, k, , b]) => [...y, ...k, ...b.workspaces].map((g) => g.id),
          L,
          a,
          ([y, k, b, g]) => {
            W.value = y, P.value = k, S.value = b.runs, x.value = b.next_cursor, J.value = g.workspaces, _.value = !0, R.value = "";
          },
          () => {
            w();
          }
        );
      } catch (y) {
        a() && (R.value = oe(y, "Could not load tasks."));
      } finally {
        a() && (h.value = !1);
      }
    }, a), T = Le.runs(() => {
      w();
    });
    Pe(() => L.value, () => {
      w();
    }), _e(w), ye(T);
    const G = p(!1);
    async function le() {
      if (!(!x.value || G.value || h.value)) {
        G.value = !0;
        try {
          const y = B, k = await X.runs(x.value);
          if (!a() || B !== y) return;
          const b = new Set(S.value.map((g) => g.id));
          S.value.push(...k.runs.filter((g) => !b.has(g.id))), x.value = k.next_cursor, Z++;
        } catch (y) {
          a() && (R.value = oe(y, "Could not load more tasks."));
        } finally {
          a() && (G.value = !1);
        }
      }
    }
    function te(y) {
      V.value = !1, N("open", y);
    }
    const H = Y(() => W.value.some((y) => y.usable && y.enabled)), ae = Y(() => S.value.filter((y) => [y.prompt_summary, y.status, y.agent, m(y.agent), c(y.account_id)].join(" ").toLowerCase().includes(C.query.trim().toLowerCase())));
    ge(() => S.value.length, (y) => N("count", y));
    function m(y) {
      return U.value.agents.find((k) => k.id === y)?.title ?? y;
    }
    function r(y) {
      return P.value.find((k) => k.id === y)?.label ?? "Unlisted image";
    }
    function c(y) {
      return W.value.find((k) => k.id === y)?.label ?? "Unlisted account";
    }
    return (y, k) => s.runId ? (t(), l("section", Ra, [
      e("div", Ea, [
        e("button", {
          type: "button",
          class: "ac-btn kx-focus-halo",
          onClick: k[0] || (k[0] = (b) => N("close"))
        }, [
          O(n(j), { icon: "tabler:arrow-left" }),
          k[9] || (k[9] = D(" Back to tasks", -1))
        ])
      ]),
      (t(), ne(La, {
        key: s.runId,
        "run-id": s.runId,
        accounts: W.value,
        images: P.value,
        workspaces: J.value
      }, null, 8, ["run-id", "accounts", "images", "workspaces"]))
    ])) : _.value ? (t(), l("div", Ia, [
      R.value ? (t(), l("p", Na, [
        D(i(R.value) + " ", 1),
        e("button", {
          class: "ac-link kx-focus-outline",
          type: "button",
          onClick: k[2] || (k[2] = //@ts-ignore
          (...b) => n(w) && n(w)(...b))
        }, "Retry")
      ])) : f("", !0),
      S.value.length ? ae.value.length ? f("", !0) : (t(), l("div", Da, [...k[12] || (k[12] = [
        e("div", { class: "kx-empty-title" }, "No matches", -1),
        e("div", { class: "kx-empty-sub" }, "Try another task, agent or account.", -1)
      ])])) : (t(), l("div", Oa, [
        e("div", qa, [
          O(n(j), { icon: "tabler:terminal-2" })
        ]),
        k[11] || (k[11] = e("div", { class: "kx-empty-title" }, "No tasks yet", -1)),
        e("div", Ba, i(H.value ? "Give a coding agent a task and follow its progress here." : "Add an account to give your coding agent a place to start."), 1),
        O(n(Ve), {
          label: H.value ? "New task" : "Add account",
          onClick: k[3] || (k[3] = (b) => H.value ? V.value = !0 : N("goto"))
        }, {
          icon: he(() => [
            O(n(j), { icon: "tabler:plus" })
          ]),
          _: 1
        }, 8, ["label"])
      ])),
      ae.value.length ? (t(), l("ul", Ma, [
        (t(!0), l(z, null, ee(ae.value, (b) => (t(), l("li", {
          key: b.id,
          class: "ac-run"
        }, [
          e("button", {
            type: "button",
            class: "ac-run-main kx-focus-halo",
            onClick: (g) => N("open", b.id)
          }, [
            e("span", Wa, [
              e("span", za, [
                e("span", Ja, i(b.prompt_summary.split(`
`)[0]), 1),
                e("span", {
                  class: ue(["kx-tag-sm ac-tone", b.status])
                }, i(b.status), 3),
                b.workflow ? (t(), l("span", Ha, "Workflow")) : f("", !0)
              ]),
              e("span", Ga, [
                e("span", null, [
                  O(n(j), {
                    icon: n($e)(b.agent, n(U).agents)
                  }, null, 8, ["icon"]),
                  D(i(m(b.agent)), 1)
                ]),
                e("span", null, i(c(b.account_id)), 1),
                e("span", null, i(r(b.image_id)), 1),
                e("span", {
                  title: n(me)(b.started_at || b.created_at)
                }, i(n(Re)(b.started_at || b.created_at, n(M))), 9, Ka),
                b.started_at ? (t(), l("span", Qa, i(n(qe)(b, n(M))) + " " + i(b.status === "running" ? "elapsed" : "duration"), 1)) : f("", !0)
              ])
            ]),
            O(n(j), {
              icon: "tabler:chevron-right",
              class: "ac-run-chevron ac-muted"
            })
          ], 8, ja)
        ]))), 128))
      ])) : f("", !0),
      x.value ? (t(), l("div", Xa, [
        O(n(Ve), {
          label: "Load more",
          loading: G.value,
          disabled: h.value,
          onClick: le
        }, null, 8, ["loading", "disabled"])
      ])) : f("", !0),
      V.value ? (t(), ne(Ae, {
        key: 5,
        title: "New task",
        busy: A.value,
        wide: "",
        onClose: k[8] || (k[8] = (b) => V.value = !1)
      }, {
        default: he(() => [
          O(Wt, {
            onBusy: k[4] || (k[4] = (b) => A.value = b),
            accounts: W.value,
            images: P.value,
            workspaces: J.value,
            onStarted: te,
            onCancel: k[5] || (k[5] = (b) => V.value = !1),
            onAgentChanged: k[6] || (k[6] = (b) => N("agentChanged", b)),
            onGoto: k[7] || (k[7] = (b, g) => N("goto", g))
          }, null, 8, ["accounts", "images", "workspaces"])
        ]),
        _: 1
      }, 8, ["busy"])) : f("", !0)
    ])) : (t(), l("div", Pa, [
      R.value ? (t(), l(z, { key: 0 }, [
        D(i(R.value) + " ", 1),
        e("button", {
          class: "ac-link kx-focus-outline",
          type: "button",
          onClick: k[1] || (k[1] = //@ts-ignore
          (...b) => n(w) && n(w)(...b))
        }, "Retry")
      ], 64)) : (t(), l(z, { key: 1 }, [
        O(n(j), {
          icon: "tabler:loader-2",
          class: "spin"
        }),
        k[10] || (k[10] = D(" Loading tasks…", -1))
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
      handler: function(u) {
        this.d_value = u;
      }
    },
    defaultValue: function(u) {
      this.d_value = u;
    },
    $formName: {
      immediate: !0,
      handler: function(u) {
        var v, a;
        this.formField = ((v = this.$pcForm) === null || v === void 0 || (a = v.register) === null || a === void 0 ? void 0 : a.call(v, u, this.$formControl)) || {};
      }
    },
    $formControl: {
      immediate: !0,
      handler: function(u) {
        var v, a;
        this.formField = ((v = this.$pcForm) === null || v === void 0 || (a = v.register) === null || a === void 0 ? void 0 : a.call(v, this.$formName, u)) || {};
      }
    },
    $formDefaultValue: {
      immediate: !0,
      handler: function(u) {
        this.d_value !== u && (this.d_value = u);
      }
    },
    $formValue: {
      immediate: !1,
      handler: function(u) {
        var v;
        (v = this.$pcForm) !== null && v !== void 0 && v.getFieldState(this.$formName) && u !== this.d_value && (this.d_value = u);
      }
    }
  },
  formField: {},
  methods: {
    writeValue: function(u, v) {
      var a, L;
      this.controlled && (this.d_value = u, this.$emit("update:modelValue", u)), this.$emit("value-change", u), (a = (L = this.formField).onChange) === null || a === void 0 || a.call(L, {
        originalEvent: v,
        value: u
      });
    },
    // @todo move to @primeuix/utils
    findNonEmpty: function() {
      for (var u = arguments.length, v = new Array(u), a = 0; a < u; a++)
        v[a] = arguments[a];
      return v.find(Ne);
    }
  },
  computed: {
    $filled: function() {
      return Ne(this.d_value);
    },
    $invalid: function() {
      var u, v;
      return !this.$formNovalidate && this.findNonEmpty(this.invalid, (u = this.$pcFormField) === null || u === void 0 || (u = u.$field) === null || u === void 0 ? void 0 : u.invalid, (v = this.$pcForm) === null || v === void 0 || (v = v.getFieldState(this.$formName)) === null || v === void 0 ? void 0 : v.invalid);
    },
    $formName: function() {
      var u;
      return this.$formNovalidate ? void 0 : this.name || ((u = this.$formControl) === null || u === void 0 ? void 0 : u.name);
    },
    $formControl: function() {
      var u;
      return this.formControl || ((u = this.$pcFormField) === null || u === void 0 ? void 0 : u.formControl);
    },
    $formNovalidate: function() {
      var u;
      return (u = this.$formControl) === null || u === void 0 ? void 0 : u.novalidate;
    },
    $formDefaultValue: function() {
      var u, v;
      return this.findNonEmpty(this.d_value, (u = this.$pcFormField) === null || u === void 0 ? void 0 : u.initialValue, (v = this.$pcForm) === null || v === void 0 || (v = v.initialValues) === null || v === void 0 ? void 0 : v[this.$formName]);
    },
    $formValue: function() {
      var u, v;
      return this.findNonEmpty((u = this.$pcFormField) === null || u === void 0 || (u = u.$field) === null || u === void 0 ? void 0 : u.value, (v = this.$pcForm) === null || v === void 0 || (v = v.getFieldState(this.$formName)) === null || v === void 0 ? void 0 : v.value);
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
  root: function(u) {
    var v = u.instance, a = u.props;
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
    getPTOptions: function(u) {
      var v = u === "root" ? this.ptmi : this.ptm;
      return v(u, {
        context: {
          checked: this.checked,
          disabled: this.disabled
        }
      });
    },
    onChange: function(u) {
      if (!this.disabled && !this.readonly) {
        var v = this.checked ? this.falseValue : this.trueValue;
        this.writeValue(v, u), this.$emit("change", u);
      }
    },
    onFocus: function(u) {
      this.$emit("focus", u);
    },
    onBlur: function(u) {
      var v, a;
      this.$emit("blur", u), (v = (a = this.formField).onBlur) === null || v === void 0 || v.call(a, u);
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
function cl(s, u, v, a, L, C) {
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
    onFocus: u[0] || (u[0] = function() {
      return C.onFocus && C.onFocus.apply(C, arguments);
    }),
    onBlur: u[1] || (u[1] = function() {
      return C.onBlur && C.onBlur.apply(C, arguments);
    }),
    onChange: u[2] || (u[2] = function() {
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
je.render = cl;
const dl = { class: "ac-account-main" }, rl = { class: "ac-row-title" }, vl = ["onKeydown"], pl = {
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
}, _l = {
  key: 3,
  class: "ac-muted ac-mono"
}, $l = {
  key: 4,
  class: "ac-muted"
}, wl = {
  key: 5,
  class: "ac-muted"
}, xl = {
  key: 6,
  class: "kx-err ac-small"
}, Cl = { class: "ac-row-actions" }, Vl = /* @__PURE__ */ ve({
  __name: "account-row",
  props: {
    account: {},
    kindLabel: {},
    ownerLabel: {}
  },
  emits: ["toggle", "rename", "remove", "edit"],
  setup(s, { emit: u }) {
    const v = s, a = u, L = { ready: "ready", cooling: "cooling down", disabled: "disabled", unavailable: "unavailable" }, C = we(), N = Y(() => Fe(v.account, C.value)), U = Y(() => v.account.mine ? "" : `Shared with you by ${v.ownerLabel}`), V = p(!1), A = p(""), W = p(null);
    function P() {
      A.value = v.account.label, V.value = !0, Te(() => W.value?.select());
    }
    function J() {
      if (!V.value) return;
      V.value = !1;
      const S = A.value.trim();
      S && S !== v.account.label && a("rename", S);
    }
    return (S, x) => (t(), l("li", {
      class: ue(["ac-row ac-account ac-hover-actions", { off: !s.account.enabled || !s.account.usable }])
    }, [
      e("div", dl, [
        e("div", rl, [
          e("span", {
            class: ue(["kx-tag-sm ac-tone", N.value])
          }, i(L[N.value]), 3),
          V.value ? Q((t(), l("input", {
            key: 0,
            ref_key: "input",
            ref: W,
            "onUpdate:modelValue": x[0] || (x[0] = (_) => A.value = _),
            class: "ac-rename kx-focus-halo",
            "aria-label": "Account label",
            onKeydown: [
              Oe(Ue(J, ["prevent"]), ["enter"]),
              x[1] || (x[1] = Oe(Ue((_) => V.value = !1, ["prevent"]), ["escape"]))
            ],
            onBlur: J
          }, null, 40, vl)), [
            [se, A.value]
          ]) : (t(), l("span", pl, i(s.account.label), 1)),
          s.account.subscription ? (t(), l("span", gl, "personal")) : f("", !0)
        ]),
        e("div", fl, [
          D(i(s.kindLabel) + " · " + i(s.account.runs_day) + " " + i(s.account.runs_day === 1 ? "task" : "tasks") + " in the last 24 hours · " + i(s.account.failures_day) + " " + i(s.account.failures_day === 1 ? "failure" : "failures") + " · ", 1),
          s.account.last_used_at ? (t(), l("span", {
            key: 0,
            title: n(me)(s.account.last_used_at)
          }, "last used " + i(n(Re)(s.account.last_used_at, n(C))), 9, hl)) : (t(), l("span", ml, "never used"))
        ]),
        U.value ? (t(), l("div", kl, i(U.value), 1)) : f("", !0),
        s.account.usable ? s.account.subscription ? (t(), l("div", yl, "Subscription login: personal use only")) : f("", !0) : (t(), l("div", bl, [
          O(n(j), { icon: "tabler:lock" }),
          D(" " + i(s.account.unavailable_reason || "Account unavailable for tasks"), 1)
        ])),
        s.account.endpoint ? (t(), l("div", _l, i(s.account.endpoint.protocol) + " · " + i(s.account.endpoint.base_url) + i(s.account.endpoint.model ? " · " + s.account.endpoint.model : ""), 1)) : f("", !0),
        N.value === "cooling" && s.account.cooldown_until ? (t(), l("div", $l, "Available at " + i(n(me)(s.account.cooldown_until)), 1)) : f("", !0),
        (t(!0), l(z, null, ee(s.account.rate_limits?.windows ?? [], (_) => (t(), l("div", {
          key: _.window,
          class: "ac-muted"
        }, [
          D(i(_.window.replace("seven_day", "7-day").replace("five_hour", "5-hour").replaceAll("_", " ")) + ": " + i(_.utilization === void 0 ? _.status : `${Math.round(_.utilization * 100)}% used`), 1),
          _.resets_at ? (t(), l(z, { key: 0 }, [
            D(", resets " + i(new Date(_.resets_at * 1e3).toLocaleString(void 0, { weekday: "short", hour: "2-digit", minute: "2-digit" })), 1)
          ], 64)) : f("", !0)
        ]))), 128)),
        s.account.rate_limits?.overage_status ? (t(), l("div", wl, "Overage: " + i(s.account.rate_limits.overage_status) + i(s.account.rate_limits.overage_disabled_reason ? " · " + s.account.rate_limits.overage_disabled_reason : ""), 1)) : f("", !0),
        s.account.last_error ? (t(), l("div", xl, i(s.account.last_error), 1)) : f("", !0)
      ]),
      e("div", Cl, [
        s.account.writable ? (t(), ne(n(je), {
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
          onClick: P
        }, [
          O(n(j), { icon: "tabler:pencil" })
        ])) : f("", !0),
        s.account.writable ? (t(), l("button", {
          key: 2,
          type: "button",
          class: "ac-icon-btn kx-focus-outline",
          title: "Edit credential and endpoint",
          "aria-label": "Edit account",
          onClick: x[3] || (x[3] = (_) => a("edit"))
        }, [
          O(n(j), { icon: "tabler:key" })
        ])) : f("", !0),
        s.account.deletable ? (t(), l("button", {
          key: 3,
          type: "button",
          class: "ac-icon-btn kx-focus-outline",
          title: "Delete",
          "aria-label": "Delete account",
          onClick: x[4] || (x[4] = (_) => a("remove"))
        }, [
          O(n(j), { icon: "tabler:trash" })
        ])) : f("", !0)
      ])
    ], 2));
  }
}), Ul = { class: "ac-stack" }, Al = {
  key: 0,
  class: "kx-err inline"
}, Sl = {
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
}, El = { class: "ac-card-head" }, Pl = { class: "ac-card-title" }, Il = { class: "ac-muted" }, Nl = { class: "ac-account-grid" }, Ol = { class: "ac-form" }, ql = {
  key: 1,
  class: "ac-hint"
}, Bl = ["^config"], Dl = {
  key: 3,
  class: "kx-err",
  role: "alert"
}, Ml = /* @__PURE__ */ ve({
  __name: "accounts",
  props: {
    query: {},
    selectedAgent: {}
  },
  emits: ["count"],
  setup(s, { expose: u, emit: v }) {
    const a = Ee(), L = p([]), C = s, N = v, U = p(!1), V = p(null);
    function A() {
      V.value = null, B.value = "", U.value = !0;
    }
    function W(g) {
      V.value = g, q.value = g.agent, B.value = "", U.value = !0;
    }
    u({ open: A });
    const P = ke(), J = we(), S = p([]), x = p({}), _ = p(""), R = p(""), M = p(!1), h = p(!1), B = p(""), Z = p(0), q = p(C.selectedAgent || P.value.agents[0]?.id || "");
    ge(() => C.selectedAgent, (g) => {
      g && (q.value = g);
    });
    const w = Y(() => P.value.agents.find((g) => g.id === q.value)), T = Y(() => JSON.stringify({ driver: w.value, busy: h.value, error: B.value, saved: Z.value, account: V.value ? { id: V.value.id, label: V.value.label, credential_kind: V.value.credential_kind, endpoint: V.value.endpoint } : void 0, limits: P.value.account_limits })), G = Y(() => [...P.value.agents, ...[...new Set(S.value.map((g) => g.agent))].filter((g) => !P.value.agents.some(($) => $.id === g)).map((g) => ({ id: g, title: `Unavailable agent: ${g}`, icon: "tabler:terminal-2" }))].map((g) => ({ agent: g, accounts: S.value.filter(($) => $.agent === g.id && [$.label, g.title, $.credential_kind].join(" ").toLowerCase().includes(C.query.toLowerCase())) })).filter((g) => g.accounts.length));
    function le(g) {
      return P.value.agents.find(($) => $.id === g.agent)?.credentials.find(($) => $.id === g.credential_kind)?.label ?? g.credential_kind;
    }
    async function te(g) {
      const $ = [...new Set(g.filter((E) => !E.mine).map((E) => E.owner_user_id))].filter((E) => !(E in x.value)), I = await ot($);
      a() && (x.value = { ...x.value, ...I });
    }
    const H = xe(async () => {
      try {
        const g = await Ie(X.accounts, ($) => $.map((I) => I.id), L, a, ($) => {
          S.value = $, M.value = !0, _.value = "";
        }, () => {
          H();
        });
        if (!a() || (await te(g), !a())) return;
        M.value = !0, _.value = "";
      } catch (g) {
        a() && (_.value = oe(g, "Could not load accounts."));
      }
    }, a);
    Pe(() => L.value, () => {
      H();
    });
    const ae = Le.runs(() => {
      H();
    });
    ye(ae), _e(H);
    async function m(g, $) {
      _.value = "", R.value = "";
      try {
        if (await g(), !a()) return;
        await H();
      } catch (I) {
        a() && (_.value = oe(I, $));
      }
    }
    async function r(g) {
      if (!(g instanceof CustomEvent)) return;
      const $ = vt.safeParse(g.detail);
      if (h.value) return;
      if (!$.success || $.data.agent !== q.value || V.value && (!V.value.writable || $.data.credential_kind !== V.value.credential_kind)) {
        B.value = "Invalid account submission.";
        return;
      }
      const I = $.data;
      B.value = "", h.value = !0;
      try {
        if (V.value) {
          const E = await X.updateAccount(V.value.id, {
            label: I.label,
            endpoint: I.endpoint ?? { base_url: "" },
            ...I.secret ? { secret: I.secret } : {}
          });
          if (!a()) return;
          R.value = E.health_error ? `Account saved, but its health could not be refreshed: ${E.health_error.message}` : "";
        } else await X.createAccount(I);
        if (!a()) return;
        Z.value++, U.value = !1, await H();
      } catch (E) {
        a() && (B.value = oe(E, "Could not save the account."));
      } finally {
        a() && (h.value = !1);
      }
    }
    ge(S, (g) => N("count", g.length));
    const c = (g, $, I) => m(async () => {
      const E = await X.updateAccount(g.id, $);
      a() && E.health_error && (R.value = `Account saved, but its health could not be refreshed: ${E.health_error.message}`);
    }, I), y = (g) => c(g, { enabled: !g.enabled }, "Could not update the account."), k = (g, $) => c(g, { label: $ }, "Could not rename the account.");
    async function b(g) {
      const $ = await De.confirm({
        header: "Delete account",
        message: `Delete account "${g.label}"? Tasks keep their history.`,
        icon: "tabler:trash",
        acceptLabel: "Delete",
        rejectLabel: "Cancel",
        acceptClass: "p-button-danger"
      });
      a() && $ && await m(() => X.deleteAccount(g.id), "Could not delete the account.");
    }
    return Se(() => {
      dt("chestor-autocode-driver-account", { timeoutMs: 8e3 }).catch(() => {
        a() && (_.value = "The driver account card could not load.");
      });
    }), (g, $) => (t(), l("div", Ul, [
      _.value ? (t(), l("p", Al, [
        D(i(_.value) + " ", 1),
        e("button", {
          type: "button",
          class: "ac-link kx-focus-outline",
          onClick: $[0] || ($[0] = //@ts-ignore
          (...I) => n(H) && n(H)(...I))
        }, "Retry")
      ])) : f("", !0),
      R.value ? (t(), l("p", Sl, i(R.value), 1)) : f("", !0),
      !M.value && !_.value ? (t(), l("div", Tl, "Loading accounts…")) : f("", !0),
      M.value && !S.value.length ? (t(), l("div", Fl, [
        e("div", Ll, [
          O(n(j), { icon: "tabler:key" })
        ]),
        $[3] || ($[3] = e("div", { class: "kx-empty-title" }, "No accounts yet", -1)),
        $[4] || ($[4] = e("div", { class: "kx-empty-sub" }, "Add an API key, your own endpoint or a personal subscription login.", -1)),
        O(n(Ve), {
          label: "Add account",
          onClick: A
        }, {
          icon: he(() => [
            O(n(j), { icon: "tabler:plus" })
          ]),
          _: 1
        })
      ])) : M.value && !G.value.length ? (t(), l("div", Rl, [...$[5] || ($[5] = [
        e("div", { class: "kx-empty-title" }, "No matches", -1),
        e("div", { class: "kx-empty-sub" }, "Try another account or agent.", -1)
      ])])) : f("", !0),
      (t(!0), l(z, null, ee(G.value, (I) => (t(), l("section", {
        key: I.agent.id,
        class: "ac-stack"
      }, [
        e("div", El, [
          e("h2", Pl, [
            O(n(j), {
              icon: n($e)(I.agent.id, n(P).agents)
            }, null, 8, ["icon"]),
            D(i(I.agent.title), 1)
          ]),
          e("span", Il, i(I.accounts.filter((E) => E.usable && n(Fe)(E, n(J)) === "ready").length) + " of " + i(I.accounts.length) + " ready", 1)
        ]),
        e("ul", Nl, [
          (t(!0), l(z, null, ee(I.accounts, (E) => (t(), ne(Vl, {
            key: E.id,
            account: E,
            "kind-label": le(E),
            "owner-label": x.value[E.owner_user_id] || E.owner_user_id,
            onEdit: (de) => W(E),
            onToggle: (de) => y(E),
            onRename: (de) => k(E, de),
            onRemove: (de) => b(E)
          }, null, 8, ["account", "kind-label", "owner-label", "onEdit", "onToggle", "onRename", "onRemove"]))), 128))
        ])
      ]))), 128)),
      U.value ? (t(), ne(Ae, {
        key: 5,
        title: V.value ? "Edit account" : "Add account",
        busy: h.value,
        onClose: $[2] || ($[2] = (I) => U.value = !1)
      }, {
        default: he(() => [
          e("div", Ol, [
            V.value ? f("", !0) : (t(), ne(Me, {
              key: 0,
              disabled: h.value,
              modelValue: q.value,
              "onUpdate:modelValue": $[1] || ($[1] = (I) => q.value = I),
              agents: n(P).agents
            }, null, 8, ["disabled", "modelValue", "agents"])),
            V.value ? f("", !0) : (t(), l("p", ql, "Tasks balance across your ready accounts automatically.")),
            w.value ? (t(), l("chestor-autocode-driver-account", {
              key: 2,
              "^config": T.value,
              onSubmit: r
            }, null, 40, Bl)) : (t(), l("p", Dl, "This account’s agent is unavailable."))
          ])
        ]),
        _: 1
      }, 8, ["title", "busy"])) : f("", !0)
    ]));
  }
}), jl = ["aria-busy"], Wl = {
  key: 0,
  class: "kx-empty",
  role: "status"
}, zl = {
  key: 1,
  class: "kx-err",
  role: "alert"
}, Jl = {
  key: 2,
  class: "kx-empty"
}, Hl = {
  key: 3,
  class: "kx-empty"
}, Gl = {
  key: 4,
  class: "ac-list"
}, Kl = { class: "ac-account-main" }, Ql = { class: "ac-row-title" }, Xl = { class: "ac-row-name" }, Yl = { class: "ac-muted" }, Zl = {
  key: 0,
  class: "ac-muted ac-mono"
}, en = { class: "ac-row-actions" }, tn = ["onClick"], an = ["onClick"], ln = ["onClick"], nn = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, on = ["disabled"], sn = { class: "ac-field" }, un = { class: "ac-field" }, cn = ["value"], dn = { class: "ac-field" }, rn = ["value"], vn = {
  key: 0,
  class: "ac-field"
}, pn = ["value"], gn = { class: "ac-field" }, fn = ["value"], hn = { class: "ac-field" }, mn = ["value"], kn = { class: "ac-field" }, bn = ["value"], yn = { class: "ac-field" }, _n = { class: "ac-field" }, $n = { class: "ac-field" }, wn = { class: "ac-field" }, xn = { class: "ac-field" }, Cn = {
  key: 2,
  class: "ac-check"
}, Vn = ["checked"], Un = { class: "ac-dialog-foot" }, An = ["disabled"], Sn = /* @__PURE__ */ ve({
  __name: "profiles",
  props: {
    query: {}
  },
  emits: ["count"],
  setup(s, { expose: u, emit: v }) {
    const a = Ee(), L = s, C = v, N = ke(), U = p([]), V = p([]), A = p([]), W = p([]), P = p([]), J = p(""), S = p(""), x = p(!0), _ = p(!1), R = p(0), M = p(null), h = p(null), B = p(""), Z = p(""), q = p(""), w = Y(() => N.value.agents.find((m) => m.id === h.value?.agent)), T = Y(() => U.value.filter((m) => `${m.title} ${m.agent}`.toLowerCase().includes(L.query.toLowerCase()))), G = xe(async () => {
      try {
        await Ie(
          () => Promise.all([X.profiles(), X.accounts(), X.images(), X.workspaces()]),
          ([m, r, c, y]) => [...m.map((k) => k.id), ...r.map((k) => k.id), ...c.map((k) => k.id), ...y.workspaces.map((k) => k.id)],
          V,
          a,
          ([m, r, c, y]) => {
            U.value = m, A.value = r, W.value = c, P.value = y.workspaces, C("count", m.length), J.value = "";
          },
          () => {
            G();
          }
        );
      } catch (m) {
        a() && (J.value = oe(m, "Could not load profiles."));
      } finally {
        a() && (x.value = !1);
      }
    }, a);
    Pe(() => V.value, G), _e(G);
    function le(m, r = !1) {
      M.value = m && !r ? m.id : null, h.value = m ? {
        title: m.title + (r ? " copy" : ""),
        agent: m.agent,
        account_id: m.account_id ?? "",
        account_pool: [...m.account_pool ?? []],
        image_id: m.image_id,
        workspace_id: m.workspace_id ?? "",
        tools: m.tools,
        repo_url: m.repo_url,
        repo_ref: m.repo_ref,
        run_timeout: m.run_timeout,
        options: JSON.parse(JSON.stringify(m.options)),
        unattended: m.unattended
      } : { title: "", agent: N.value.agents[0]?.id ?? "", image_id: "", options: {}, account_pool: [], account_id: "", workspace_id: "" }, B.value = m?.endpoint?.protocol ?? w.value?.endpoints[0] ?? "", Z.value = m?.endpoint?.base_url ?? "", q.value = m?.endpoint?.model ?? "", R.value = 0, S.value = "";
    }
    function te() {
      h.value && (h.value.account_id = "", h.value.account_pool = [], h.value.options = {}, B.value = w.value?.endpoints[0] ?? "", Z.value = "", q.value = "");
    }
    async function H() {
      if (!(!h.value || _.value || R.value)) {
        _.value = !0, S.value = "";
        try {
          const m = { ...h.value, account_pool: h.value.account_id ? [] : h.value.account_pool, endpoint: Z.value ? { protocol: B.value, base_url: Z.value.trim(), model: q.value.trim() || void 0 } : { protocol: B.value, base_url: "" } };
          if (M.value ? await X.updateProfile(M.value, m) : await X.createProfile(m), !a()) return;
          h.value = null, await G();
        } catch (m) {
          a() && (S.value = oe(m, "Could not save the profile."));
        } finally {
          a() && (_.value = !1);
        }
      }
    }
    async function ae(m) {
      if (await De.confirm({ header: "Delete profile", message: `Delete ${m.title}?`, acceptLabel: "Delete" }))
        try {
          await X.deleteProfile(m.id), await G();
        } catch (r) {
          a() && (J.value = oe(r, "Could not delete the profile."));
        }
    }
    return u({ open: le }), (m, r) => (t(), l("section", { "aria-busy": x.value }, [
      x.value ? (t(), l("p", Wl, "Loading profiles…")) : J.value ? (t(), l("div", zl, [
        D(i(J.value) + " ", 1),
        e("button", {
          type: "button",
          class: "ac-btn kx-focus-halo",
          "aria-label": "Retry profiles",
          onClick: r[0] || (r[0] = //@ts-ignore
          (...c) => n(G) && n(G)(...c))
        }, "Retry")
      ])) : U.value.length ? T.value.length ? (t(), l("ul", Gl, [
        (t(!0), l(z, null, ee(T.value, (c) => (t(), l("li", {
          key: c.id,
          class: "ac-row ac-account ac-hover-actions"
        }, [
          e("div", Kl, [
            e("div", Ql, [
              O(n(j), { icon: "tabler:robot" }),
              e("span", Xl, i(c.title), 1)
            ]),
            e("p", Yl, i(n(N).agents.find((y) => y.id === c.agent)?.title ?? c.agent) + " · " + i(c.endpoint?.model ?? c.options.model ?? "CLI default model"), 1),
            c.endpoint ? (t(), l("p", Zl, i(c.endpoint.base_url), 1)) : f("", !0)
          ]),
          e("div", en, [
            e("button", {
              type: "button",
              class: "ac-icon-btn kx-focus-outline",
              "aria-label": "Duplicate profile",
              onClick: (y) => le(c, !0)
            }, [
              O(n(j), { icon: "tabler:copy" })
            ], 8, tn),
            c.writable ? (t(), l("button", {
              key: 0,
              type: "button",
              class: "ac-icon-btn kx-focus-outline",
              "aria-label": "Edit profile",
              onClick: (y) => le(c)
            }, [
              O(n(j), { icon: "tabler:pencil" })
            ], 8, an)) : f("", !0),
            c.deletable ? (t(), l("button", {
              key: 1,
              type: "button",
              class: "ac-icon-btn kx-focus-outline",
              "aria-label": "Delete profile",
              onClick: (y) => ae(c)
            }, [
              O(n(j), { icon: "tabler:trash" })
            ], 8, ln)) : f("", !0)
          ])
        ]))), 128))
      ])) : (t(), l("p", Hl, "No matches.")) : (t(), l("p", Jl, "Create a profile to reuse an agent, endpoint and task settings.")),
      h.value ? (t(), ne(Ae, {
        key: 5,
        title: M.value ? "Edit profile" : "Create profile",
        busy: _.value,
        onClose: r[17] || (r[17] = (c) => h.value = null)
      }, {
        default: he(() => [
          e("form", {
            class: "ac-form",
            onSubmit: Ue(H, ["prevent"])
          }, [
            S.value ? (t(), l("p", nn, i(S.value), 1)) : f("", !0),
            e("fieldset", {
              class: "ac-form",
              disabled: _.value
            }, [
              e("label", sn, [
                r[18] || (r[18] = e("span", null, "Title", -1)),
                Q(e("input", {
                  "onUpdate:modelValue": r[1] || (r[1] = (c) => h.value.title = c),
                  "aria-label": "Profile title",
                  class: "kx-focus-halo",
                  required: "",
                  maxlength: "200"
                }, null, 512), [
                  [se, h.value.title]
                ])
              ]),
              e("label", un, [
                r[19] || (r[19] = e("span", null, "Agent", -1)),
                Q(e("select", {
                  "onUpdate:modelValue": r[2] || (r[2] = (c) => h.value.agent = c),
                  class: "kx-focus-halo",
                  onChange: te
                }, [
                  (t(!0), l(z, null, ee(n(N).agents, (c) => (t(), l("option", {
                    key: c.id,
                    value: c.id
                  }, i(c.title), 9, cn))), 128))
                ], 544), [
                  [ie, h.value.agent]
                ])
              ]),
              e("label", dn, [
                r[21] || (r[21] = e("span", null, "Account", -1)),
                Q(e("select", {
                  "onUpdate:modelValue": r[3] || (r[3] = (c) => h.value.account_id = c),
                  class: "kx-focus-halo"
                }, [
                  r[20] || (r[20] = e("option", { value: "" }, "Auto balance", -1)),
                  (t(!0), l(z, null, ee(A.value.filter((c) => c.agent === h.value?.agent), (c) => (t(), l("option", {
                    key: c.id,
                    value: c.id
                  }, i(c.label), 9, rn))), 128))
                ], 512), [
                  [ie, h.value.account_id]
                ])
              ]),
              h.value.account_id ? f("", !0) : (t(), l("label", vn, [
                r[22] || (r[22] = e("span", null, "Account pool (empty uses all usable accounts)", -1)),
                Q(e("select", {
                  "onUpdate:modelValue": r[4] || (r[4] = (c) => h.value.account_pool = c),
                  multiple: "",
                  class: "kx-focus-halo"
                }, [
                  (t(!0), l(z, null, ee(A.value.filter((c) => c.agent === h.value?.agent), (c) => (t(), l("option", {
                    key: c.id,
                    value: c.id
                  }, i(c.label), 9, pn))), 128))
                ], 512), [
                  [ie, h.value.account_pool]
                ])
              ])),
              e("label", gn, [
                r[24] || (r[24] = e("span", null, "Image", -1)),
                Q(e("select", {
                  "onUpdate:modelValue": r[5] || (r[5] = (c) => h.value.image_id = c),
                  required: "",
                  class: "kx-focus-halo"
                }, [
                  r[23] || (r[23] = e("option", { value: "" }, "Choose an image", -1)),
                  (t(!0), l(z, null, ee(W.value.filter((c) => c.agents.includes(h.value?.agent ?? "")), (c) => (t(), l("option", {
                    key: c.id,
                    value: c.id
                  }, i(c.label), 9, fn))), 128))
                ], 512), [
                  [ie, h.value.image_id]
                ])
              ]),
              e("label", hn, [
                r[26] || (r[26] = e("span", null, "Workspace", -1)),
                Q(e("select", {
                  "onUpdate:modelValue": r[6] || (r[6] = (c) => h.value.workspace_id = c),
                  class: "kx-focus-halo"
                }, [
                  r[25] || (r[25] = e("option", { value: "" }, "Scratch directory", -1)),
                  (t(!0), l(z, null, ee(P.value, (c) => (t(), l("option", {
                    key: c.id,
                    value: c.id
                  }, i(c.name), 9, mn))), 128))
                ], 512), [
                  [ie, h.value.workspace_id]
                ])
              ]),
              w.value?.endpoints.length ? (t(), l(z, { key: 1 }, [
                e("label", kn, [
                  r[27] || (r[27] = e("span", null, "Endpoint protocol", -1)),
                  Q(e("select", {
                    "onUpdate:modelValue": r[7] || (r[7] = (c) => B.value = c),
                    class: "kx-focus-halo"
                  }, [
                    (t(!0), l(z, null, ee(w.value.endpoints, (c) => (t(), l("option", {
                      key: c,
                      value: c
                    }, i(c), 9, bn))), 128))
                  ], 512), [
                    [ie, B.value]
                  ])
                ]),
                e("label", yn, [
                  r[28] || (r[28] = e("span", null, "Endpoint URL", -1)),
                  Q(e("input", {
                    "onUpdate:modelValue": r[8] || (r[8] = (c) => Z.value = c),
                    class: "kx-focus-halo",
                    placeholder: "Use account endpoint",
                    maxlength: "512"
                  }, null, 512), [
                    [se, Z.value]
                  ])
                ]),
                e("label", _n, [
                  r[29] || (r[29] = e("span", null, "Endpoint model", -1)),
                  Q(e("input", {
                    "onUpdate:modelValue": r[9] || (r[9] = (c) => q.value = c),
                    class: "kx-focus-halo",
                    maxlength: "200"
                  }, null, 512), [
                    [se, q.value]
                  ])
                ])
              ], 64)) : f("", !0),
              e("label", $n, [
                r[30] || (r[30] = e("span", null, "Repository URL", -1)),
                Q(e("input", {
                  "onUpdate:modelValue": r[10] || (r[10] = (c) => h.value.repo_url = c),
                  class: "kx-focus-halo",
                  maxlength: "2000"
                }, null, 512), [
                  [se, h.value.repo_url]
                ])
              ]),
              e("label", wn, [
                r[31] || (r[31] = e("span", null, "Repository ref", -1)),
                Q(e("input", {
                  "onUpdate:modelValue": r[11] || (r[11] = (c) => h.value.repo_ref = c),
                  class: "kx-focus-halo",
                  maxlength: "200"
                }, null, 512), [
                  [se, h.value.repo_ref]
                ])
              ]),
              e("label", xn, [
                r[32] || (r[32] = e("span", null, "Run timeout", -1)),
                Q(e("input", {
                  "onUpdate:modelValue": r[12] || (r[12] = (c) => h.value.run_timeout = c),
                  class: "kx-focus-halo",
                  placeholder: "Use configured timeout",
                  maxlength: "64"
                }, null, 512), [
                  [se, h.value.run_timeout]
                ])
              ]),
              w.value?.unattended ? (t(), l("label", Cn, [
                e("input", {
                  checked: h.value.unattended !== !1,
                  onChange: r[13] || (r[13] = (c) => h.value.unattended = c.target.checked),
                  type: "checkbox",
                  class: "kx-focus-outline"
                }, null, 40, Vn),
                r[33] || (r[33] = D("Unattended", -1))
              ])) : f("", !0),
              w.value ? (t(), ne(Be, {
                key: w.value.id,
                modelValue: h.value.options,
                "onUpdate:modelValue": r[14] || (r[14] = (c) => h.value.options = c),
                options: w.value.options,
                defaults: h.value.unattended !== !1 ? w.value.unattended : {},
                onInvalid: r[15] || (r[15] = (c) => R.value = c)
              }, null, 8, ["modelValue", "options", "defaults"])) : f("", !0),
              e("footer", Un, [
                e("button", {
                  type: "button",
                  class: "ac-btn kx-focus-halo",
                  onClick: r[16] || (r[16] = (c) => h.value = null)
                }, "Cancel"),
                e("button", {
                  type: "submit",
                  class: "ac-btn primary kx-focus-halo",
                  disabled: _.value || !!R.value
                }, "Save", 8, An)
              ])
            ], 8, on)
          ], 32)
        ]),
        _: 1
      }, 8, ["title", "busy"])) : f("", !0)
    ], 8, jl));
  }
}), Tn = { class: "ac" }, Fn = {
  key: 1,
  class: "ac-bar"
}, Ln = {
  class: "ac-tabs",
  "aria-label": "Autocode views"
}, Rn = ["aria-pressed", "onClick"], En = {
  key: 2,
  class: "kx-err"
}, Pn = {
  key: 3,
  class: "kx-loading"
}, In = {
  key: 0,
  class: "kx-empty"
}, Nn = /* @__PURE__ */ ve({
  __name: "autocode",
  setup(s) {
    const u = Ye(), v = Ze(), a = p(null);
    ge(() => u.value?.route, () => {
      a.value = null;
    });
    const L = Y(() => a.value ?? u.value?.route ?? ""), C = Y(() => {
      const q = /^\/?runs\/([^/]+)\/?$/.exec(L.value);
      try {
        return q ? decodeURIComponent(q[1]) : "";
      } catch {
        return "";
      }
    }), N = Y(() => !!L.value && L.value !== "/" && !C.value);
    function U(q) {
      A.value = "tasks", a.value = q, v("navigate", { path: q });
    }
    const V = [
      { id: "tasks", label: "Tasks", icon: "tabler:player-play" },
      { id: "profiles", label: "Profiles", icon: "tabler:robot" },
      { id: "accounts", label: "Accounts", icon: "tabler:key" }
    ], A = p("tasks"), { catalog: W, error: P, load: J } = Ge(), S = p(""), x = p(0), _ = p(null), R = p(null), M = p(null), h = p("");
    async function B(q) {
      q && (h.value = q), A.value = "accounts", S.value = "", await Te(), M.value?.open();
    }
    function Z() {
      A.value === "tasks" ? _.value?.open() : A.value === "profiles" ? R.value?.open() : M.value?.open();
    }
    return (q, w) => (t(), l("div", Tn, [
      !C.value && !N.value ? (t(), ne(Ke, {
        key: 0,
        title: "Autocode",
        subtitle: "Run coding agents with your accounts and workspaces.",
        count: `${x.value} ${A.value === "tasks" ? "task" : A.value === "profiles" ? "profile" : "account"}${x.value === 1 ? "" : "s"}`,
        action: A.value === "tasks" ? "New task" : A.value === "profiles" ? "Create profile" : "Add account",
        query: S.value,
        "onUpdate:query": w[0] || (w[0] = (T) => S.value = T),
        placeholder: A.value === "tasks" ? "Search tasks…" : A.value === "profiles" ? "Search profiles…" : "Search accounts…",
        onCreate: Z
      }, null, 8, ["count", "action", "query", "placeholder"])) : f("", !0),
      !C.value && !N.value ? (t(), l("div", Fn, [
        e("nav", Ln, [
          (t(), l(z, null, ee(V, (T) => e("button", {
            key: T.id,
            type: "button",
            class: ue(["ac-tab kx-focus-outline", { active: A.value === T.id }]),
            "aria-pressed": A.value === T.id,
            onClick: (G) => {
              A.value !== T.id && (A.value = T.id, S.value = "", x.value = 0);
            }
          }, [
            O(n(j), {
              icon: T.icon
            }, null, 8, ["icon"]),
            D(" " + i(T.label), 1)
          ], 10, Rn)), 64))
        ])
      ])) : f("", !0),
      n(P) && !n(W) ? (t(), l("p", En, [
        D(i(n(P)) + " ", 1),
        e("button", {
          class: "ac-link kx-focus-outline",
          type: "button",
          onClick: w[1] || (w[1] = //@ts-ignore
          (...T) => n(J) && n(J)(...T))
        }, "Retry")
      ])) : n(W) ? (t(), l("main", {
        key: 4,
        class: ue(["ac-body", { "ac-detail-page": C.value || N.value }])
      }, [
        N.value ? (t(), l("div", In, [
          w[10] || (w[10] = e("h1", null, "Run not found", -1)),
          e("button", {
            type: "button",
            class: "ac-btn kx-focus-halo",
            onClick: w[2] || (w[2] = (T) => U(""))
          }, "Back to tasks")
        ])) : C.value || A.value === "tasks" ? (t(), ne(Ya, {
          key: 1,
          ref_key: "tasks",
          ref: _,
          query: S.value,
          "run-id": C.value,
          onOpen: w[3] || (w[3] = (T) => U("runs/" + encodeURIComponent(T))),
          onClose: w[4] || (w[4] = (T) => U("")),
          onCount: w[5] || (w[5] = (T) => x.value = T),
          onAgentChanged: w[6] || (w[6] = (T) => h.value = T),
          onGoto: B
        }, null, 8, ["query", "run-id"])) : A.value === "profiles" ? (t(), ne(Sn, {
          key: 2,
          ref_key: "profiles",
          ref: R,
          query: S.value,
          onCount: w[7] || (w[7] = (T) => x.value = T)
        }, null, 8, ["query"])) : (t(), ne(Ml, {
          key: 3,
          ref_key: "accounts",
          ref: M,
          query: S.value,
          "selected-agent": h.value,
          onCount: w[8] || (w[8] = (T) => x.value = T)
        }, null, 8, ["query", "selected-agent"]))
      ], 2)) : (t(), l("div", Pn, [
        O(n(j), {
          icon: "tabler:loader-2",
          class: "spin"
        }),
        w[9] || (w[9] = D(" Loading…", -1))
      ]))
    ]));
  }
}), On = { props: { type: "object", properties: { route: { type: "string", default: "", description: "Path relative to /autocode; runs/<run_id> opens a run." } } } }, qn = {
  wippy: On
};
class Bn extends et {
  static get wippyConfig() {
    return {
      propsSchema: qn.wippy.props,
      hostCssKeys: ["themeConfigUrl", "primeVueCssUrl", "iframeCssUrl"],
      inlineCss: Qe
    };
  }
  static get vueConfig() {
    return { rootComponent: Nn, plugins: [Xe] };
  }
}
rt(import.meta.url, Bn);
