import { a as _e, s as We, c as qe, B as ze, f as Je, b as He, u as Ge, P as Ke } from "./wc-runtime-6vw183jT.js";
import { defineComponent as ve, openBlock as t, createElementBlock as l, Fragment as z, renderList as ee, normalizeClass as ue, createVNode as O, unref as n, createTextVNode as M, toDisplayString as i, ref as p, computed as Y, onMounted as Ue, watch as pe, createElementVNode as e, withDirectives as Q, vModelText as se, vModelSelect as ie, createCommentVNode as f, isRef as ge, vModelCheckbox as Qe, createBlock as ne, onUnmounted as be, nextTick as Le, withCtx as fe, mergeProps as ke, renderSlot as Xe, withKeys as Oe, withModifiers as ye } from "vue";
import { Icon as W } from "@iconify/vue";
import { host as $e, config as Ye, loadByTagName as Ze } from "@wippy-fe/proxy";
import { u as me, s as Se, _ as Te, a as et, b as tt } from "./app-dialog.vue_vue_type_script_setup_true_lang-DPnDfcrz.js";
import { b as we, a as X, e as oe, d as Fe, f as he, g as xe, l as Re, h as Ee, i as Be, t as at, s as Ce, A as lt, c as Pe, u as Ie, r as Ne, p as nt } from "./presentation-C75LgO9q.js";
import { d as ot, e as st, u as it, _ as De } from "./driver-options.vue_vue_type_script_setup_true_lang-eMDMCVal.js";
import { a as ut } from "./driver-account-types-Ci_eiejv.js";
const ct = {
  key: 0,
  class: "ac-chips",
  role: "group",
  "aria-label": "Agent"
}, dt = ["disabled", "aria-pressed", "onClick"], rt = ["disabled", "value"], vt = ["value"], Me = /* @__PURE__ */ ve({
  __name: "agent-picker",
  props: {
    agents: {},
    modelValue: {},
    disabled: { type: Boolean }
  },
  emits: ["update:modelValue"],
  setup(s) {
    return (u, v) => s.agents.length <= 6 ? (t(), l("div", ct, [
      (t(!0), l(z, null, ee(s.agents, (a) => (t(), l("button", {
        key: a.id,
        disabled: s.disabled,
        type: "button",
        class: ue(["ac-chip kx-focus-halo", { active: s.modelValue === a.id }]),
        "aria-pressed": s.modelValue === a.id,
        onClick: (F) => u.$emit("update:modelValue", a.id)
      }, [
        O(n(W), {
          icon: n(we)(a.id, s.agents),
          "aria-hidden": "true"
        }, null, 8, ["icon"]),
        M(i(a.title), 1)
      ], 10, dt))), 128))
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
      }, i(a.title), 9, vt))), 128))
    ], 40, rt));
  }
}), pt = ["disabled"], gt = { class: "ac-field ac-composer" }, ft = { class: "ac-field" }, ht = ["value"], mt = { class: "ac-field" }, kt = {
  key: 0,
  class: "ac-muted"
}, bt = {
  key: 1,
  class: "ac-muted"
}, yt = { class: "ac-picker-row" }, _t = { class: "ac-field" }, $t = ["value"], wt = { value: "" }, xt = ["value"], Ct = { class: "ac-field" }, Vt = ["value"], At = ["value"], St = { class: "ac-field" }, Ut = ["value"], Lt = ["value"], Tt = { class: "ac-advanced" }, Ft = { class: "ac-form" }, Rt = { class: "ac-field" }, Et = { class: "ac-field" }, Pt = { class: "ac-field" }, It = {
  key: 0,
  class: "ac-check"
}, Nt = {
  key: 2,
  class: "kx-err",
  role: "alert"
}, qt = { class: "ac-dialog-foot" }, Ot = ["disabled"], Bt = /* @__PURE__ */ ve({
  __name: "task-form",
  props: {
    accounts: {},
    images: {},
    workspaces: {}
  },
  emits: ["started", "goto", "agentChanged", "cancel", "busy"],
  setup(s, { emit: u }) {
    const v = s, a = u, F = me(), C = p(null), N = p([]), A = p(""), V = p({}), S = Y(() => N.value.find((T) => T.id === A.value));
    Ue(async () => {
      try {
        N.value = await X.profiles();
      } catch (T) {
        E.value = oe(T, "Could not load profiles.");
      }
    });
    function q() {
      V.value = {};
    }
    function P(T) {
      A.value ? V.value = { ...V.value, ...T } : U.value = { ...U.value, ...T };
    }
    function J() {
      const T = F.value.settings_path;
      T && C.value?.dispatchEvent(new CustomEvent("navigate", { detail: { path: T }, bubbles: !0, composed: !0 }));
    }
    const U = p({ agent: ot(F.value, v.accounts), account_id: "", image_id: "", workspace_id: "", repo_url: "" }), x = Y(() => st(A.value ? V.value : U.value, S.value)), { now: _, driver: R, agentAccounts: j, ready: h, agentImages: D, invalidOptions: Z, optionValues: B, invalidImage: $, invalidAccount: L, invalidWorkspace: G, selectAgent: le } = it(x, {
      catalog: () => F.value,
      accounts: () => v.accounts,
      images: () => v.images,
      workspaces: () => v.workspaces
    }, "live", () => !!A.value), te = Y({
      get: () => x.value.agent ?? "",
      set: (T) => {
        if (T === x.value.agent) return;
        const o = le(T);
        P({ agent: T, account_id: o.account_id, image_id: o.image_id, options: o.options, unattended: o.unattended });
      }
    });
    function H(T) {
      return Y({ get: () => x.value[T] ?? "", set: (o) => P({ [T]: o }) });
    }
    const ae = H("account_id"), m = H("image_id"), r = H("workspace_id"), d = H("repo_url"), y = H("repo_ref"), k = Y({ get: () => x.value.run_timeout ?? "", set: (T) => P({ run_timeout: T }) }), b = p(""), g = Y({ get: () => B.value, set: (T) => P({ options: T }) }), w = Y({ get: () => x.value.unattended ?? !!R.value?.unattended, set: (T) => P({ unattended: T }) }), I = p(!1), E = p("");
    function de(T) {
      return Fe(T, _.value) === "cooling" ? `${T.label} (cooling down${T.cooldown_until ? " until " + he(T.cooldown_until) : ""})` : T.label;
    }
    pe(te, (T) => a("agentChanged", T), { immediate: !0 });
    let ce;
    pe([A, te, ae, m, r, d, y, k, b, g, w], () => {
      ce = void 0;
    }, { deep: !0, flush: "sync" });
    async function Ve() {
      if (!I.value) {
        E.value = "", I.value = !0, a("busy", !0);
        try {
          const T = {
            agent: te.value,
            account_id: ae.value,
            image_id: m.value,
            workspace_id: r.value,
            repo_url: d.value,
            repo_ref: y.value.trim() || void 0,
            timeout: k.value.trim() || void 0,
            prompt: b.value,
            options: x.value.options ?? {},
            unattended: w.value
          }, { run_timeout: o, ...c } = V.value, K = A.value ? {
            profile_id: A.value,
            prompt: b.value,
            options: x.value.options ?? {},
            ...c,
            ...o !== void 0 ? { timeout: o } : {}
          } : T, re = JSON.stringify(K);
          (!ce || ce.snapshot !== re) && (ce = { snapshot: re, key: crypto.randomUUID(), body: { ...K, options: JSON.parse(JSON.stringify(K.options)) } });
          const { run_id: Ae } = await X.startRun({ ...ce.body, idempotency_key: ce.key });
          ce = void 0, b.value = "", a("started", Ae);
        } catch (T) {
          E.value = oe(T, "Could not start the task.");
        } finally {
          I.value = !1, a("busy", !1);
        }
      }
    }
    return (T, o) => (t(), l("fieldset", {
      ref_key: "root",
      ref: C,
      class: "ac-form ac-new",
      disabled: I.value
    }, [
      e("label", gt, [
        o[14] || (o[14] = e("span", null, "Prompt", -1)),
        Q(e("textarea", {
          "onUpdate:modelValue": o[0] || (o[0] = (c) => b.value = c),
          autofocus: "",
          rows: "8",
          class: "kx-focus-halo",
          placeholder: "What should the agent do?"
        }, null, 512), [
          [se, b.value]
        ])
      ]),
      e("label", ft, [
        o[16] || (o[16] = e("span", null, "Profile", -1)),
        Q(e("select", {
          "onUpdate:modelValue": o[1] || (o[1] = (c) => A.value = c),
          "aria-label": "Profile",
          class: "kx-focus-halo",
          onChange: q
        }, [
          o[15] || (o[15] = e("option", { value: "" }, "Custom task", -1)),
          (t(!0), l(z, null, ee(N.value, (c) => (t(), l("option", {
            key: c.id,
            value: c.id
          }, i(c.title), 9, ht))), 128))
        ], 544), [
          [ie, A.value]
        ])
      ]),
      e("div", mt, [
        o[17] || (o[17] = e("span", null, "Agent", -1)),
        O(Me, {
          modelValue: te.value,
          "onUpdate:modelValue": o[2] || (o[2] = (c) => te.value = c),
          agents: n(F).agents
        }, null, 8, ["modelValue", "agents"])
      ]),
      te.value && !n(j).length ? (t(), l("p", kt, [
        M(" No " + i(n(R)?.title) + " accounts you can run on. ", 1),
        e("button", {
          class: "ac-link kx-focus-outline",
          type: "button",
          onClick: o[3] || (o[3] = (c) => a("goto", "accounts", te.value))
        }, "Add an account")
      ])) : f("", !0),
      n(D).length ? f("", !0) : (t(), l("p", bt, [
        M(" No usable image with " + i(n(R)?.title ?? te.value) + ". " + i(n(F).can_images ? "Prepare an image in Autocode management." : "Ask an administrator to prepare and share an image.") + " ", 1),
        n(F).can_images && n(F).settings_path ? (t(), l("button", {
          key: 0,
          class: "ac-link kx-focus-outline",
          type: "button",
          onClick: J
        }, "Manage images")) : f("", !0)
      ])),
      e("div", yt, [
        e("label", _t, [
          o[18] || (o[18] = e("span", null, "Account", -1)),
          Q(e("select", {
            "onUpdate:modelValue": o[4] || (o[4] = (c) => ge(ae) ? ae.value = c : null),
            class: "kx-focus-halo"
          }, [
            A.value && n(L) ? (t(), l("option", {
              key: 0,
              value: n(ae)
            }, i(n(ae)) + " (unavailable)", 9, $t)) : f("", !0),
            e("option", wt, "Auto (" + i(n(h).length) + " ready)", 1),
            (t(!0), l(z, null, ee(n(j), (c) => (t(), l("option", {
              key: c.id,
              value: c.id
            }, i(de(c)), 9, xt))), 128))
          ], 512), [
            [ie, n(ae)]
          ])
        ]),
        e("label", Ct, [
          o[19] || (o[19] = e("span", null, "Image", -1)),
          Q(e("select", {
            "onUpdate:modelValue": o[5] || (o[5] = (c) => ge(m) ? m.value = c : null),
            class: "kx-focus-halo"
          }, [
            A.value && n($) && n(m) ? (t(), l("option", {
              key: 0,
              value: n(m)
            }, i(n(m)) + " (unavailable)", 9, Vt)) : f("", !0),
            (t(!0), l(z, null, ee(n(D), (c) => (t(), l("option", {
              key: c.id,
              value: c.id
            }, i(c.label), 9, At))), 128))
          ], 512), [
            [ie, n(m)]
          ])
        ]),
        e("label", St, [
          o[21] || (o[21] = e("span", null, "Workspace", -1)),
          Q(e("select", {
            "onUpdate:modelValue": o[6] || (o[6] = (c) => ge(r) ? r.value = c : null),
            class: "kx-focus-halo"
          }, [
            o[20] || (o[20] = e("option", { value: "" }, "Scratch directory", -1)),
            A.value && n(G) ? (t(), l("option", {
              key: 0,
              value: n(r)
            }, i(n(r)) + " (unavailable)", 9, Ut)) : f("", !0),
            (t(!0), l(z, null, ee(s.workspaces, (c) => (t(), l("option", {
              key: c.id,
              value: c.id
            }, i(c.name) + i(c.writable ? "" : " (read-only)"), 9, Lt))), 128))
          ], 512), [
            [ie, n(r)]
          ])
        ])
      ]),
      e("details", Tt, [
        o[26] || (o[26] = e("summary", { class: "kx-focus-outline" }, "Advanced", -1)),
        e("div", Ft, [
          e("label", Rt, [
            o[22] || (o[22] = e("span", null, "Git repository", -1)),
            Q(e("input", {
              "onUpdate:modelValue": o[7] || (o[7] = (c) => ge(d) ? d.value = c : null),
              class: "ac-mono kx-focus-halo",
              placeholder: "Optional: https://github.com/org/repo.git"
            }, null, 512), [
              [se, n(d)]
            ])
          ]),
          e("label", Et, [
            o[23] || (o[23] = e("span", null, "Repository ref", -1)),
            Q(e("input", {
              "onUpdate:modelValue": o[8] || (o[8] = (c) => ge(y) ? y.value = c : null),
              "aria-label": "Repository ref",
              class: "ac-mono kx-focus-halo",
              placeholder: "Default branch"
            }, null, 512), [
              [se, n(y)]
            ])
          ]),
          e("label", Pt, [
            o[24] || (o[24] = e("span", null, "Run timeout", -1)),
            Q(e("input", {
              "onUpdate:modelValue": o[9] || (o[9] = (c) => k.value = c),
              maxlength: "64",
              class: "ac-mono kx-focus-halo",
              placeholder: "Use configured timeout"
            }, null, 512), [
              [se, k.value]
            ])
          ]),
          n(R)?.unattended ? (t(), l("label", It, [
            Q(e("input", {
              "onUpdate:modelValue": o[10] || (o[10] = (c) => w.value = c),
              type: "checkbox",
              class: "kx-focus-outline"
            }, null, 512), [
              [Qe, w.value]
            ]),
            o[25] || (o[25] = M(" Unattended · skip permission prompts when the image allows it ", -1))
          ])) : f("", !0),
          n(R) ? (t(), ne(De, {
            key: A.value + n(R).id,
            modelValue: g.value,
            "onUpdate:modelValue": o[11] || (o[11] = (c) => g.value = c),
            options: n(R).options,
            defaults: { ...w.value ? n(R).unattended : {}, ...S.value?.options },
            onInvalid: o[12] || (o[12] = (c) => Z.value = c)
          }, null, 8, ["modelValue", "options", "defaults"])) : f("", !0)
        ])
      ]),
      E.value ? (t(), l("p", Nt, i(E.value), 1)) : f("", !0),
      e("footer", qt, [
        e("button", {
          type: "button",
          class: "ac-btn kx-focus-halo",
          onClick: o[13] || (o[13] = (c) => a("cancel"))
        }, "Cancel"),
        e("button", {
          type: "button",
          class: "ac-btn primary kx-focus-halo",
          disabled: I.value || n(Z) > 0 || !A.value && (!te.value || !(n(ae) || n(h).length) || !n(m)) || !b.value.trim(),
          onClick: Ve
        }, [
          O(n(W), { icon: "tabler:player-play" }),
          M(" " + i(I.value ? "Starting…" : "Start"), 1)
        ], 8, Ot)
      ])
    ], 8, pt));
  }
}), Dt = {
  key: 0,
  class: "kx-empty",
  role: "status"
}, Mt = {
  key: 1,
  class: "kx-err",
  role: "alert"
}, jt = {
  key: 2,
  class: "kx-loading"
}, Wt = { class: "ac-detail-head" }, zt = { class: "ac-card-head" }, Jt = ["disabled"], Ht = { class: "ac-detail-title" }, Gt = { class: "ac-run-meta ac-detail-meta" }, Kt = ["title"], Qt = { key: 0 }, Xt = { key: 1 }, Yt = { key: 2 }, Zt = { key: 3 }, ea = { key: 4 }, ta = { key: 5 }, aa = { class: "ac-detail-section" }, la = { class: "ac-pre" }, na = {
  key: 0,
  class: "ac-muted"
}, oa = {
  key: 0,
  class: "ac-detail-section",
  "aria-label": "Usage by model"
}, sa = {
  key: 1,
  class: "kx-err",
  role: "alert"
}, ia = {
  class: "ac-detail-section",
  "aria-labelledby": "ac-prompt-heading"
}, ua = { class: "ac-section-head" }, ca = ["aria-expanded"], da = {
  key: 2,
  class: "ac-detail-section ac-result",
  "aria-labelledby": "ac-result-heading"
}, ra = { class: "ac-section-head" }, va = { id: "ac-result-heading" }, pa = { class: "ac-row-actions" }, ga = ["aria-expanded"], fa = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, ha = {
  key: 3,
  class: "kx-err",
  role: "alert"
}, ma = {
  class: "ac-detail-section",
  "aria-labelledby": "ac-log-heading"
}, ka = { class: "ac-section-head" }, ba = { class: "ac-muted" }, ya = ["disabled"], _a = ["disabled"], $a = {
  class: "ac-stream",
  tabindex: "0",
  "aria-label": "Task log"
}, wa = { class: "ac-event-kind" }, xa = { class: "ac-event-text" }, Ca = {
  key: 0,
  class: "ac-muted ac-pulse"
}, Va = {
  key: 1,
  class: "ac-muted"
}, Aa = 500, Sa = /* @__PURE__ */ ve({
  __name: "run-detail",
  props: {
    runId: {},
    accounts: {},
    images: {},
    workspaces: {}
  },
  setup(s) {
    const u = s, v = me(), a = p(null), F = p([]), C = p(0), N = p(!1), A = p(!1);
    let V;
    const S = p(!1), q = p(""), P = p(!1), J = p(null), U = p(!1), x = p("");
    let _ = null;
    const R = p(!1), j = p(!1), h = p(!1), D = p(""), Z = xe(), B = Y(() => (a.value?.prompt.length ?? 0) > 500 || (a.value?.prompt.split(`
`).length ?? 0) > 5), $ = Y(() => (a.value?.result.length ?? 0) > 1800 || (a.value?.result.split(`
`).length ?? 0) > 10);
    let L = !0, G = !0, le, te;
    const H = (o) => o.status === "queued" || o.status === "running";
    function ae() {
      _ && (G = _.scrollHeight - _.scrollTop - _.clientHeight < 40);
    }
    Ue(() => {
      _ = J.value?.closest(".ac") ?? null, _?.addEventListener("scroll", ae, { passive: !0 });
    }), be(() => {
      _?.removeEventListener("scroll", ae), _ = null;
    });
    const m = Ce(async () => {
      try {
        const o = V ?? (a.value ? void 0 : 0);
        V = void 0;
        let c = await X.run(u.runId, o === void 0 ? C.value : void 0, o);
        if (!L) return;
        if (o === void 0 && (c.more || S.value && c.events.length)) {
          if (c = await X.run(u.runId, void 0, 0), !L) return;
          F.value = c.events, N.value = c.more, S.value = !1;
        } else if (o !== void 0)
          F.value = c.events, N.value = c.more, S.value = o !== 0;
        else if (c.events.length) {
          const K = Math.max(0, F.value.length + c.events.length - Aa);
          K && F.value.splice(0, K), F.value.push(...c.events), N.value = N.value || K > 0;
        }
        P.value = !1, a.value = c.run, S.value || (C.value = c.next_seq), await Le(), L && G && _ && _.scrollTo({ top: _.scrollHeight }), q.value = "";
      } catch (o) {
        if (!L) return;
        P.value = o instanceof lt && o.code === "autocode.run_not_found", P.value && (a.value = null, F.value = []), q.value = P.value ? "" : oe(o, "Could not load the task.");
      } finally {
        A.value = !1;
      }
    });
    function r() {
      A.value || !F.value.length || (G = !1, A.value = !0, V = F.value[0].seq, m());
    }
    function d() {
      A.value || (G = !0, A.value = !0, V = 0, m());
    }
    const y = Re.run(u.runId, () => {
      m();
    });
    _e(m), be(() => {
      L = !1, y(), clearTimeout(te), clearTimeout(le);
    });
    async function k() {
      try {
        if (!a.value || !await $e.confirm({
          header: "Cancel task",
          message: `Cancel "${a.value.prompt.split(`
`)[0]}" (${a.value.id})? Execution will stop; task history will remain.`,
          icon: "tabler:player-stop",
          acceptLabel: "Cancel task",
          rejectLabel: "Keep task",
          acceptClass: "p-button-danger"
        })) return;
        await X.cancelRun(u.runId), await m();
      } catch (o) {
        q.value = oe(o, "Could not cancel the task.");
      }
    }
    async function b(o) {
      try {
        await navigator.clipboard.writeText(o);
      } catch {
        const c = document.createElement("textarea"), K = J.value?.getRootNode(), re = K instanceof ShadowRoot || K instanceof Document ? K.activeElement : null, Ae = re instanceof HTMLElement ? re : null;
        c.value = o, c.readOnly = !0, c.style.cssText = "position:fixed;opacity:0;pointer-events:none;", J.value?.append(c);
        try {
          if (c.select(), !document.execCommand("copy")) throw new Error("Copy failed");
        } finally {
          c.remove(), Ae?.focus({ preventScroll: !0 });
        }
      }
    }
    async function g() {
      try {
        await b(a.value?.result ?? ""), h.value = !0, D.value = "", clearTimeout(te), te = setTimeout(() => {
          h.value = !1;
        }, 2e3);
      } catch {
        D.value = "Could not copy. Select the result text to copy it.";
      }
    }
    async function w() {
      try {
        const o = new URL(Ye.env.APP_API_URL || "/", window.location.href);
        await b(new URL(`/autocode/runs/${encodeURIComponent(u.runId)}`, o).href), U.value = !0, x.value = "", clearTimeout(le), le = setTimeout(() => {
          U.value = !1;
        }, 2e3);
      } catch {
        x.value = "Could not copy the link. Try again.";
      }
    }
    function I() {
      j.value = !j.value;
    }
    function E(o) {
      return typeof o.options?.model == "string" ? o.options.model : "";
    }
    function de(o) {
      return u.accounts.find((c) => c.id === o)?.label ?? "Unlisted account";
    }
    function ce(o) {
      return u.workspaces.find((c) => c.id === o)?.name ?? "Unlisted workspace";
    }
    function Ve(o) {
      return u.images.find((c) => c.id === o)?.label ?? "Unlisted image";
    }
    function T(o) {
      const c = [];
      return o.input_tokens !== void 0 && c.push(`${o.input_tokens} input`), o.output_tokens !== void 0 && c.push(`${o.output_tokens} output`), o.cached_tokens !== void 0 && c.push(`${o.cached_tokens} cached`), o.cache_write_tokens !== void 0 && c.push(`${o.cache_write_tokens} cache write`), o.reasoning_tokens !== void 0 && c.push(`${o.reasoning_tokens} reasoning`), o.cost_decimal !== void 0 && o.currency ? c.push(`${o.cost_decimal} ${o.currency}`) : o.cost_usd !== void 0 && c.push(`$${o.cost_usd}`), c.join(" · ");
    }
    return (o, c) => (t(), l("section", {
      ref_key: "detail",
      ref: J,
      class: "ac-form ac-detail"
    }, [
      P.value ? (t(), l("div", Dt, [...c[2] || (c[2] = [
        e("h1", null, "Run not found", -1),
        e("p", null, "This run does not exist or you do not have access to it.", -1)
      ])])) : f("", !0),
      q.value ? (t(), l("p", Mt, [
        M(i(q.value) + " ", 1),
        e("button", {
          type: "button",
          class: "ac-link kx-focus-outline",
          onClick: c[0] || (c[0] = //@ts-ignore
          (...K) => n(m) && n(m)(...K))
        }, "Retry")
      ])) : f("", !0),
      !a.value && !q.value && !P.value ? (t(), l("div", jt, [
        O(n(W), {
          icon: "tabler:loader-2",
          class: "spin"
        }),
        c[3] || (c[3] = M(" Loading the task…", -1))
      ])) : a.value ? (t(), l(z, { key: 3 }, [
        e("header", Wt, [
          e("div", zt, [
            e("span", {
              class: ue(["kx-tag-sm ac-tone", a.value.status])
            }, i(a.value.status), 3),
            e("button", {
              type: "button",
              class: "ac-btn kx-focus-halo",
              "aria-live": "polite",
              onClick: w
            }, [
              O(n(W), {
                icon: U.value ? "tabler:check" : "tabler:link"
              }, null, 8, ["icon"]),
              M(i(U.value ? "Link copied" : "Copy link"), 1)
            ]),
            H(a.value) ? (t(), l("button", {
              key: 0,
              type: "button",
              class: "ac-btn danger kx-focus-halo",
              disabled: a.value.cancel_requested,
              onClick: k
            }, [
              O(n(W), { icon: "tabler:player-stop" }),
              M(" " + i(a.value.cancel_requested ? "Cancelling…" : "Cancel"), 1)
            ], 8, Jt)) : f("", !0)
          ]),
          e("h1", Ht, i(a.value.prompt.split(`
`)[0]), 1),
          e("div", Gt, [
            e("span", null, [
              O(n(W), {
                icon: n(we)(a.value.agent, n(v).agents)
              }, null, 8, ["icon"]),
              M(i(n(v).agents.find((K) => K.id === a.value?.agent)?.title ?? a.value.agent), 1)
            ]),
            e("span", null, i(de(a.value.account_id)), 1),
            e("span", null, i(Ve(a.value.image_id)), 1),
            e("span", {
              title: n(he)(a.value.started_at || a.value.created_at)
            }, i(a.value.started_at ? "Started" : "Queued") + " " + i(n(Ee)(a.value.started_at || a.value.created_at, n(Z))), 9, Kt),
            a.value.started_at ? (t(), l("span", Qt, i(n(Be)(a.value, n(Z))) + " " + i(H(a.value) ? "elapsed" : "duration"), 1)) : f("", !0),
            a.value.timeout_ms ? (t(), l("span", Xt, i(n(at)(a.value.timeout_ms)), 1)) : f("", !0),
            e("span", null, i(a.value.unattended ? "Unattended" : "Attended"), 1),
            a.value.workflow ? (t(), l("span", Yt, "Workflow")) : f("", !0),
            a.value.workspace_id ? (t(), l("span", Zt, i(ce(a.value.workspace_id)), 1)) : f("", !0),
            E(a.value) ? (t(), l("span", ea, i(E(a.value)), 1)) : f("", !0),
            T(a.value.usage) ? (t(), l("span", ta, i(T(a.value.usage)), 1)) : f("", !0)
          ])
        ]),
        e("details", aa, [
          c[4] || (c[4] = e("summary", { class: "kx-focus-outline" }, "Effective options", -1)),
          e("pre", la, i(JSON.stringify(a.value.options, null, 2)), 1),
          a.value.endpoint ? (t(), l("p", na, i(a.value.endpoint.protocol) + " · " + i(a.value.endpoint.base_url) + " · " + i(a.value.endpoint.model), 1)) : f("", !0)
        ]),
        a.value.usage.models ? (t(), l("section", oa, [
          c[5] || (c[5] = e("h3", null, "Usage by model", -1)),
          (t(!0), l(z, null, ee(a.value.usage.models, (K, re) => (t(), l("p", {
            key: re,
            class: "ac-muted"
          }, i(re) + " · " + i(T(K)), 1))), 128))
        ])) : f("", !0),
        x.value ? (t(), l("p", sa, i(x.value), 1)) : f("", !0),
        e("section", ia, [
          e("div", ua, [
            c[6] || (c[6] = e("h3", { id: "ac-prompt-heading" }, "Prompt", -1)),
            B.value ? (t(), l("button", {
              key: 0,
              type: "button",
              class: "ac-link kx-focus-outline",
              "aria-expanded": R.value,
              "aria-controls": "ac-prompt-text",
              onClick: c[1] || (c[1] = (K) => R.value = !R.value)
            }, i(R.value ? "Collapse prompt" : "Expand prompt"), 9, ca)) : f("", !0)
          ]),
          e("pre", {
            id: "ac-prompt-text",
            class: ue(["ac-pre ac-prompt", { expanded: R.value || !B.value }])
          }, [
            e("span", null, i(a.value.prompt), 1)
          ], 2)
        ]),
        a.value.result ? (t(), l("section", da, [
          e("div", ra, [
            e("h3", va, i(a.value.status === "succeeded" ? "Result" : "Partial result"), 1),
            e("div", pa, [
              $.value ? (t(), l("button", {
                key: 0,
                type: "button",
                class: "ac-link kx-focus-outline",
                "aria-expanded": j.value,
                "aria-controls": "ac-result-text",
                onClick: I
              }, i(j.value ? "Collapse result" : "Expand result"), 9, ga)) : f("", !0),
              e("button", {
                type: "button",
                class: "ac-btn kx-focus-halo",
                onClick: g
              }, [
                O(n(W), {
                  icon: h.value ? "tabler:check" : "tabler:copy"
                }, null, 8, ["icon"]),
                M(i(h.value ? "Copied" : "Copy"), 1)
              ])
            ])
          ]),
          D.value ? (t(), l("p", fa, i(D.value), 1)) : f("", !0),
          e("pre", {
            id: "ac-result-text",
            class: ue(["ac-pre ac-result-text", { expanded: j.value }]),
            tabindex: "0",
            "aria-label": "Result"
          }, i(a.value.result), 3)
        ])) : f("", !0),
        a.value.error ? (t(), l("p", ha, i(a.value.error), 1)) : f("", !0),
        e("section", ma, [
          e("div", ka, [
            c[7] || (c[7] = e("h3", { id: "ac-log-heading" }, "Log", -1)),
            e("span", ba, i(F.value.length) + " events", 1)
          ]),
          N.value ? (t(), l("button", {
            key: 0,
            type: "button",
            class: "ac-link kx-focus-outline",
            disabled: A.value,
            onClick: r
          }, i(A.value ? "Loading…" : "Load earlier"), 9, ya)) : f("", !0),
          S.value ? (t(), l("button", {
            key: 1,
            type: "button",
            class: "ac-link kx-focus-outline",
            disabled: A.value,
            onClick: d
          }, "Latest", 8, _a)) : f("", !0),
          e("div", $a, [
            (t(!0), l(z, null, ee(F.value, (K) => (t(), l("div", {
              key: K.seq,
              class: ue(["ac-event", K.kind])
            }, [
              e("span", wa, i(K.kind), 1),
              e("pre", xa, i(K.text), 1)
            ], 2))), 128)),
            H(a.value) ? (t(), l("div", Ca, i(a.value.status === "queued" ? "Waiting to start…" : "Working…"), 1)) : F.value.length ? f("", !0) : (t(), l("div", Va, "No log events."))
          ])
        ])
      ], 64)) : f("", !0)
    ], 512));
  }
}), Ua = {
  key: 0,
  "aria-label": "Task details"
}, La = { class: "ac-detail-back" }, Ta = {
  key: 1,
  class: "kx-loading"
}, Fa = { key: 2 }, Ra = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, Ea = {
  key: 1,
  class: "kx-empty"
}, Pa = { class: "kx-empty-ico" }, Ia = { class: "kx-empty-sub" }, Na = {
  key: 2,
  class: "kx-empty"
}, qa = {
  key: 3,
  class: "ac-run-list"
}, Oa = ["onClick"], Ba = { class: "ac-run-copy" }, Da = { class: "ac-run-title-row" }, Ma = { class: "ac-run-title" }, ja = {
  key: 0,
  class: "kx-tag-sm ac-tone"
}, Wa = { class: "ac-run-meta" }, za = ["title"], Ja = { key: 0 }, Ha = {
  key: 4,
  class: "ac-load-more"
}, Ga = /* @__PURE__ */ ve({
  __name: "tasks",
  props: {
    query: {},
    runId: {}
  },
  emits: ["goto", "agentChanged", "count", "open", "close"],
  setup(s, { expose: u, emit: v }) {
    const a = Pe(), F = p([]), C = s, N = v, A = me(), V = p(!1), S = p(!1);
    u({ open: () => {
      V.value = !0;
    } });
    const q = p([]), P = p([]), J = p([]), U = p([]), x = p(), _ = p(!1), R = p(""), j = xe(), h = p(!1);
    let D = 0, Z = 1;
    async function B() {
      const y = [];
      let k;
      for (let b = 0; b < Z; b++) {
        const g = await X.runs(k);
        if (!a() || (y.push(...g.runs), k = g.next_cursor, !k)) break;
      }
      return { runs: y, next_cursor: k };
    }
    const $ = Ce(async () => {
      D++, h.value = !0;
      try {
        await Ne(
          () => Promise.all([X.accounts(), X.images(), B(), X.workspaces()]),
          ([y, k, , b]) => [...y, ...k, ...b.workspaces].map((g) => g.id),
          F,
          a,
          ([y, k, b, g]) => {
            q.value = y, P.value = k, U.value = b.runs, x.value = b.next_cursor, J.value = g.workspaces, _.value = !0, R.value = "";
          },
          () => {
            $();
          }
        );
      } catch (y) {
        a() && (R.value = oe(y, "Could not load tasks."));
      } finally {
        a() && (h.value = !1);
      }
    }, a), L = Re.runs(() => {
      $();
    });
    Ie(() => F.value, () => {
      $();
    }), _e($), be(L);
    const G = p(!1);
    async function le() {
      if (!(!x.value || G.value || h.value)) {
        G.value = !0;
        try {
          const y = D, k = await X.runs(x.value);
          if (!a() || D !== y) return;
          const b = new Set(U.value.map((g) => g.id));
          U.value.push(...k.runs.filter((g) => !b.has(g.id))), x.value = k.next_cursor, Z++;
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
    const H = Y(() => q.value.some((y) => y.usable && y.enabled)), ae = Y(() => U.value.filter((y) => [y.prompt_summary, y.status, y.agent, m(y.agent), d(y.account_id)].join(" ").toLowerCase().includes(C.query.trim().toLowerCase())));
    pe(() => U.value.length, (y) => N("count", y));
    function m(y) {
      return A.value.agents.find((k) => k.id === y)?.title ?? y;
    }
    function r(y) {
      return P.value.find((k) => k.id === y)?.label ?? "Unlisted image";
    }
    function d(y) {
      return q.value.find((k) => k.id === y)?.label ?? "Unlisted account";
    }
    return (y, k) => s.runId ? (t(), l("section", Ua, [
      e("div", La, [
        e("button", {
          type: "button",
          class: "ac-btn kx-focus-halo",
          onClick: k[0] || (k[0] = (b) => N("close"))
        }, [
          O(n(W), { icon: "tabler:arrow-left" }),
          k[9] || (k[9] = M(" Back to tasks", -1))
        ])
      ]),
      (t(), ne(Sa, {
        key: s.runId,
        "run-id": s.runId,
        accounts: q.value,
        images: P.value,
        workspaces: J.value
      }, null, 8, ["run-id", "accounts", "images", "workspaces"]))
    ])) : _.value ? (t(), l("div", Fa, [
      R.value ? (t(), l("p", Ra, [
        M(i(R.value) + " ", 1),
        e("button", {
          class: "ac-link kx-focus-outline",
          type: "button",
          onClick: k[2] || (k[2] = //@ts-ignore
          (...b) => n($) && n($)(...b))
        }, "Retry")
      ])) : f("", !0),
      U.value.length ? ae.value.length ? f("", !0) : (t(), l("div", Na, [...k[12] || (k[12] = [
        e("div", { class: "kx-empty-title" }, "No matches", -1),
        e("div", { class: "kx-empty-sub" }, "Try another task, agent or account.", -1)
      ])])) : (t(), l("div", Ea, [
        e("div", Pa, [
          O(n(W), { icon: "tabler:terminal-2" })
        ]),
        k[11] || (k[11] = e("div", { class: "kx-empty-title" }, "No tasks yet", -1)),
        e("div", Ia, i(H.value ? "Give a coding agent a task and follow its progress here." : "Add an account to give your coding agent a place to start."), 1),
        O(n(Se), {
          label: H.value ? "New task" : "Add account",
          onClick: k[3] || (k[3] = (b) => H.value ? V.value = !0 : N("goto"))
        }, {
          icon: fe(() => [
            O(n(W), { icon: "tabler:plus" })
          ]),
          _: 1
        }, 8, ["label"])
      ])),
      ae.value.length ? (t(), l("ul", qa, [
        (t(!0), l(z, null, ee(ae.value, (b) => (t(), l("li", {
          key: b.id,
          class: "ac-run"
        }, [
          e("button", {
            type: "button",
            class: "ac-run-main kx-focus-halo",
            onClick: (g) => N("open", b.id)
          }, [
            e("span", Ba, [
              e("span", Da, [
                e("span", Ma, i(b.prompt_summary.split(`
`)[0]), 1),
                e("span", {
                  class: ue(["kx-tag-sm ac-tone", b.status])
                }, i(b.status), 3),
                b.workflow ? (t(), l("span", ja, "Workflow")) : f("", !0)
              ]),
              e("span", Wa, [
                e("span", null, [
                  O(n(W), {
                    icon: n(we)(b.agent, n(A).agents)
                  }, null, 8, ["icon"]),
                  M(i(m(b.agent)), 1)
                ]),
                e("span", null, i(d(b.account_id)), 1),
                e("span", null, i(r(b.image_id)), 1),
                e("span", {
                  title: n(he)(b.started_at || b.created_at)
                }, i(n(Ee)(b.started_at || b.created_at, n(j))), 9, za),
                b.started_at ? (t(), l("span", Ja, i(n(Be)(b, n(j))) + " " + i(b.status === "running" ? "elapsed" : "duration"), 1)) : f("", !0)
              ])
            ]),
            O(n(W), {
              icon: "tabler:chevron-right",
              class: "ac-run-chevron ac-muted"
            })
          ], 8, Oa)
        ]))), 128))
      ])) : f("", !0),
      x.value ? (t(), l("div", Ha, [
        O(n(Se), {
          label: "Load more",
          loading: G.value,
          disabled: h.value,
          onClick: le
        }, null, 8, ["loading", "disabled"])
      ])) : f("", !0),
      V.value ? (t(), ne(Te, {
        key: 5,
        title: "New task",
        busy: S.value,
        wide: "",
        onClose: k[8] || (k[8] = (b) => V.value = !1)
      }, {
        default: fe(() => [
          O(Bt, {
            onBusy: k[4] || (k[4] = (b) => S.value = b),
            accounts: q.value,
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
    ])) : (t(), l("div", Ta, [
      R.value ? (t(), l(z, { key: 0 }, [
        M(i(R.value) + " ", 1),
        e("button", {
          class: "ac-link kx-focus-outline",
          type: "button",
          onClick: k[1] || (k[1] = //@ts-ignore
          (...b) => n($) && n($)(...b))
        }, "Retry")
      ], 64)) : (t(), l(z, { key: 1 }, [
        O(n(W), {
          icon: "tabler:loader-2",
          class: "spin"
        }),
        k[10] || (k[10] = M(" Loading tasks…", -1))
      ], 64))
    ]));
  }
});
var Ka = {
  name: "BaseEditableHolder",
  extends: We,
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
      var a, F;
      this.controlled && (this.d_value = u, this.$emit("update:modelValue", u)), this.$emit("value-change", u), (a = (F = this.formField).onChange) === null || a === void 0 || a.call(F, {
        originalEvent: v,
        value: u
      });
    },
    // @todo move to @primeuix/utils
    findNonEmpty: function() {
      for (var u = arguments.length, v = new Array(u), a = 0; a < u; a++)
        v[a] = arguments[a];
      return v.find(qe);
    }
  },
  computed: {
    $filled: function() {
      return qe(this.d_value);
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
}, Qa = `
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
`, Xa = {
  root: {
    position: "relative"
  }
}, Ya = {
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
}, Za = ze.extend({
  name: "toggleswitch",
  style: Qa,
  classes: Ya,
  inlineStyles: Xa
}), el = {
  name: "BaseToggleSwitch",
  extends: Ka,
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
  style: Za,
  provide: function() {
    return {
      $pcToggleSwitch: this,
      $parentInstance: this
    };
  }
}, je = {
  name: "ToggleSwitch",
  extends: el,
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
      return Je({
        checked: this.checked,
        disabled: this.disabled,
        invalid: this.$invalid
      });
    }
  }
}, tl = ["data-p-checked", "data-p-disabled", "data-p"], al = ["id", "checked", "tabindex", "disabled", "readonly", "aria-checked", "aria-labelledby", "aria-label", "aria-invalid"], ll = ["data-p"], nl = ["data-p"];
function ol(s, u, v, a, F, C) {
  return t(), l("div", ke({
    class: s.cx("root"),
    style: s.sx("root")
  }, C.getPTOptions("root"), {
    "data-p-checked": C.checked,
    "data-p-disabled": s.disabled,
    "data-p": C.dataP
  }), [e("input", ke({
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
  }, C.getPTOptions("input")), null, 16, al), e("div", ke({
    class: s.cx("slider")
  }, C.getPTOptions("slider"), {
    "data-p": C.dataP
  }), [e("div", ke({
    class: s.cx("handle")
  }, C.getPTOptions("handle"), {
    "data-p": C.dataP
  }), [Xe(s.$slots, "handle", {
    checked: C.checked
  })], 16, nl)], 16, ll)], 16, tl);
}
je.render = ol;
const sl = { class: "ac-account-main" }, il = { class: "ac-row-title" }, ul = ["onKeydown"], cl = {
  key: 1,
  class: "ac-row-name"
}, dl = {
  key: 2,
  class: "kx-tag-sm ac-tone"
}, rl = { class: "ac-muted" }, vl = ["title"], pl = { key: 1 }, gl = {
  key: 0,
  class: "ac-muted"
}, fl = {
  key: 1,
  class: "ac-muted ac-strong"
}, hl = {
  key: 2,
  class: "ac-muted"
}, ml = {
  key: 3,
  class: "ac-muted ac-mono"
}, kl = {
  key: 4,
  class: "ac-muted"
}, bl = {
  key: 5,
  class: "ac-muted"
}, yl = {
  key: 6,
  class: "kx-err ac-small"
}, _l = { class: "ac-row-actions" }, $l = /* @__PURE__ */ ve({
  __name: "account-row",
  props: {
    account: {},
    kindLabel: {},
    ownerLabel: {}
  },
  emits: ["toggle", "rename", "remove", "edit"],
  setup(s, { emit: u }) {
    const v = s, a = u, F = { ready: "ready", cooling: "cooling down", disabled: "disabled", unavailable: "unavailable" }, C = xe(), N = Y(() => Fe(v.account, C.value)), A = Y(() => v.account.mine ? "" : `Shared with you by ${v.ownerLabel}`), V = p(!1), S = p(""), q = p(null);
    function P() {
      S.value = v.account.label, V.value = !0, Le(() => q.value?.select());
    }
    function J() {
      if (!V.value) return;
      V.value = !1;
      const U = S.value.trim();
      U && U !== v.account.label && a("rename", U);
    }
    return (U, x) => (t(), l("li", {
      class: ue(["ac-row ac-account ac-hover-actions", { off: !s.account.enabled || !s.account.usable }])
    }, [
      e("div", sl, [
        e("div", il, [
          e("span", {
            class: ue(["kx-tag-sm ac-tone", N.value])
          }, i(F[N.value]), 3),
          V.value ? Q((t(), l("input", {
            key: 0,
            ref_key: "input",
            ref: q,
            "onUpdate:modelValue": x[0] || (x[0] = (_) => S.value = _),
            class: "ac-rename kx-focus-halo",
            "aria-label": "Account label",
            onKeydown: [
              Oe(ye(J, ["prevent"]), ["enter"]),
              x[1] || (x[1] = Oe(ye((_) => V.value = !1, ["prevent"]), ["escape"]))
            ],
            onBlur: J
          }, null, 40, ul)), [
            [se, S.value]
          ]) : (t(), l("span", cl, i(s.account.label), 1)),
          s.account.subscription ? (t(), l("span", dl, "personal")) : f("", !0)
        ]),
        e("div", rl, [
          M(i(s.kindLabel) + " · " + i(s.account.runs_day) + " " + i(s.account.runs_day === 1 ? "task" : "tasks") + " in the last 24 hours · " + i(s.account.failures_day) + " " + i(s.account.failures_day === 1 ? "failure" : "failures") + " · ", 1),
          s.account.last_used_at ? (t(), l("span", {
            key: 0,
            title: n(he)(s.account.last_used_at)
          }, "last used " + i(n(Ee)(s.account.last_used_at, n(C))), 9, vl)) : (t(), l("span", pl, "never used"))
        ]),
        A.value ? (t(), l("div", gl, i(A.value), 1)) : f("", !0),
        s.account.usable ? s.account.subscription ? (t(), l("div", hl, "Subscription login: personal use only")) : f("", !0) : (t(), l("div", fl, [
          O(n(W), { icon: "tabler:lock" }),
          M(" " + i(s.account.unavailable_reason || "Account unavailable for tasks"), 1)
        ])),
        s.account.endpoint ? (t(), l("div", ml, i(s.account.endpoint.protocol) + " · " + i(s.account.endpoint.base_url) + i(s.account.endpoint.model ? " · " + s.account.endpoint.model : ""), 1)) : f("", !0),
        N.value === "cooling" && s.account.cooldown_until ? (t(), l("div", kl, "Available at " + i(n(he)(s.account.cooldown_until)), 1)) : f("", !0),
        (t(!0), l(z, null, ee(s.account.rate_limits?.windows ?? [], (_) => (t(), l("div", {
          key: _.window,
          class: "ac-muted"
        }, [
          M(i(_.window.replace("seven_day", "7-day").replace("five_hour", "5-hour").replaceAll("_", " ")) + ": " + i(_.utilization === void 0 ? _.status : `${Math.round(_.utilization * 100)}% used`), 1),
          _.resets_at ? (t(), l(z, { key: 0 }, [
            M(", resets " + i(new Date(_.resets_at * 1e3).toLocaleString(void 0, { weekday: "short", hour: "2-digit", minute: "2-digit" })), 1)
          ], 64)) : f("", !0)
        ]))), 128)),
        s.account.rate_limits?.overage_status ? (t(), l("div", bl, "Overage: " + i(s.account.rate_limits.overage_status) + i(s.account.rate_limits.overage_disabled_reason ? " · " + s.account.rate_limits.overage_disabled_reason : ""), 1)) : f("", !0),
        s.account.last_error ? (t(), l("div", yl, i(s.account.last_error), 1)) : f("", !0)
      ]),
      e("div", _l, [
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
          O(n(W), { icon: "tabler:pencil" })
        ])) : f("", !0),
        s.account.writable ? (t(), l("button", {
          key: 2,
          type: "button",
          class: "ac-icon-btn kx-focus-outline",
          title: "Edit credential and endpoint",
          "aria-label": "Edit account",
          onClick: x[3] || (x[3] = (_) => a("edit"))
        }, [
          O(n(W), { icon: "tabler:key" })
        ])) : f("", !0),
        s.account.deletable ? (t(), l("button", {
          key: 3,
          type: "button",
          class: "ac-icon-btn kx-focus-outline",
          title: "Delete",
          "aria-label": "Delete account",
          onClick: x[4] || (x[4] = (_) => a("remove"))
        }, [
          O(n(W), { icon: "tabler:trash" })
        ])) : f("", !0)
      ])
    ], 2));
  }
}), wl = { class: "ac-stack" }, xl = {
  key: 0,
  class: "kx-err inline"
}, Cl = {
  key: 1,
  class: "kx-err inline",
  role: "status"
}, Vl = {
  key: 2,
  class: "kx-loading"
}, Al = {
  key: 3,
  class: "kx-empty"
}, Sl = { class: "kx-empty-ico" }, Ul = {
  key: 4,
  class: "kx-empty"
}, Ll = { class: "ac-card-head" }, Tl = { class: "ac-card-title" }, Fl = { class: "ac-muted" }, Rl = { class: "ac-account-grid" }, El = { class: "ac-form" }, Pl = {
  key: 1,
  class: "ac-hint"
}, Il = ["^config"], Nl = {
  key: 3,
  class: "kx-err",
  role: "alert"
}, ql = /* @__PURE__ */ ve({
  __name: "accounts",
  props: {
    query: {},
    selectedAgent: {}
  },
  emits: ["count"],
  setup(s, { expose: u, emit: v }) {
    const a = Pe(), F = p([]), C = s, N = v, A = p(!1), V = p(null);
    function S() {
      V.value = null, D.value = "", A.value = !0;
    }
    function q(g) {
      V.value = g, B.value = g.agent, D.value = "", A.value = !0;
    }
    u({ open: S });
    const P = me(), J = xe(), U = p([]), x = p({}), _ = p(""), R = p(""), j = p(!1), h = p(!1), D = p(""), Z = p(0), B = p(C.selectedAgent || P.value.agents[0]?.id || "");
    pe(() => C.selectedAgent, (g) => {
      g && (B.value = g);
    });
    const $ = Y(() => P.value.agents.find((g) => g.id === B.value)), L = Y(() => JSON.stringify({ driver: $.value, busy: h.value, error: D.value, saved: Z.value, account: V.value ? { id: V.value.id, label: V.value.label, credential_kind: V.value.credential_kind, endpoint: V.value.endpoint } : void 0, limits: P.value.account_limits })), G = Y(() => [...P.value.agents, ...[...new Set(U.value.map((g) => g.agent))].filter((g) => !P.value.agents.some((w) => w.id === g)).map((g) => ({ id: g, title: `Unavailable agent: ${g}`, icon: "tabler:terminal-2" }))].map((g) => ({ agent: g, accounts: U.value.filter((w) => w.agent === g.id && [w.label, g.title, w.credential_kind].join(" ").toLowerCase().includes(C.query.toLowerCase())) })).filter((g) => g.accounts.length));
    function le(g) {
      return P.value.agents.find((w) => w.id === g.agent)?.credentials.find((w) => w.id === g.credential_kind)?.label ?? g.credential_kind;
    }
    async function te(g) {
      const w = [...new Set(g.filter((E) => !E.mine).map((E) => E.owner_user_id))].filter((E) => !(E in x.value)), I = await nt(w);
      a() && (x.value = { ...x.value, ...I });
    }
    const H = Ce(async () => {
      try {
        const g = await Ne(X.accounts, (w) => w.map((I) => I.id), F, a, (w) => {
          U.value = w, j.value = !0, _.value = "";
        }, () => {
          H();
        });
        if (!a() || (await te(g), !a())) return;
        j.value = !0, _.value = "";
      } catch (g) {
        a() && (_.value = oe(g, "Could not load accounts."));
      }
    }, a);
    Ie(() => F.value, () => {
      H();
    });
    const ae = Re.runs(() => {
      H();
    });
    be(ae), _e(H);
    async function m(g, w) {
      _.value = "", R.value = "";
      try {
        if (await g(), !a()) return;
        await H();
      } catch (I) {
        a() && (_.value = oe(I, w));
      }
    }
    async function r(g) {
      if (!(g instanceof CustomEvent)) return;
      const w = ut.safeParse(g.detail);
      if (h.value) return;
      if (!w.success || w.data.agent !== B.value || V.value && (!V.value.writable || w.data.credential_kind !== V.value.credential_kind)) {
        D.value = "Invalid account submission.";
        return;
      }
      const I = w.data;
      D.value = "", h.value = !0;
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
        Z.value++, A.value = !1, await H();
      } catch (E) {
        a() && (D.value = oe(E, "Could not save the account."));
      } finally {
        a() && (h.value = !1);
      }
    }
    pe(U, (g) => N("count", g.length));
    const d = (g, w, I) => m(async () => {
      const E = await X.updateAccount(g.id, w);
      a() && E.health_error && (R.value = `Account saved, but its health could not be refreshed: ${E.health_error.message}`);
    }, I), y = (g) => d(g, { enabled: !g.enabled }, "Could not update the account."), k = (g, w) => d(g, { label: w }, "Could not rename the account.");
    async function b(g) {
      const w = await $e.confirm({
        header: "Delete account",
        message: `Delete account "${g.label}"? Tasks keep their history.`,
        icon: "tabler:trash",
        acceptLabel: "Delete",
        rejectLabel: "Cancel",
        acceptClass: "p-button-danger"
      });
      a() && w && await m(() => X.deleteAccount(g.id), "Could not delete the account.");
    }
    return Ue(() => {
      Ze("chestor-autocode-driver-account", { timeoutMs: 8e3 }).catch(() => {
        a() && (_.value = "The driver account card could not load.");
      });
    }), (g, w) => (t(), l("div", wl, [
      _.value ? (t(), l("p", xl, [
        M(i(_.value) + " ", 1),
        e("button", {
          type: "button",
          class: "ac-link kx-focus-outline",
          onClick: w[0] || (w[0] = //@ts-ignore
          (...I) => n(H) && n(H)(...I))
        }, "Retry")
      ])) : f("", !0),
      R.value ? (t(), l("p", Cl, i(R.value), 1)) : f("", !0),
      !j.value && !_.value ? (t(), l("div", Vl, "Loading accounts…")) : f("", !0),
      j.value && !U.value.length ? (t(), l("div", Al, [
        e("div", Sl, [
          O(n(W), { icon: "tabler:key" })
        ]),
        w[3] || (w[3] = e("div", { class: "kx-empty-title" }, "No accounts yet", -1)),
        w[4] || (w[4] = e("div", { class: "kx-empty-sub" }, "Add an API key, your own endpoint or a personal subscription login.", -1)),
        O(n(Se), {
          label: "Add account",
          onClick: S
        }, {
          icon: fe(() => [
            O(n(W), { icon: "tabler:plus" })
          ]),
          _: 1
        })
      ])) : j.value && !G.value.length ? (t(), l("div", Ul, [...w[5] || (w[5] = [
        e("div", { class: "kx-empty-title" }, "No matches", -1),
        e("div", { class: "kx-empty-sub" }, "Try another account or agent.", -1)
      ])])) : f("", !0),
      (t(!0), l(z, null, ee(G.value, (I) => (t(), l("section", {
        key: I.agent.id,
        class: "ac-stack"
      }, [
        e("div", Ll, [
          e("h2", Tl, [
            O(n(W), {
              icon: n(we)(I.agent.id, n(P).agents)
            }, null, 8, ["icon"]),
            M(i(I.agent.title), 1)
          ]),
          e("span", Fl, i(I.accounts.filter((E) => E.usable && n(Fe)(E, n(J)) === "ready").length) + " of " + i(I.accounts.length) + " ready", 1)
        ]),
        e("ul", Rl, [
          (t(!0), l(z, null, ee(I.accounts, (E) => (t(), ne($l, {
            key: E.id,
            account: E,
            "kind-label": le(E),
            "owner-label": x.value[E.owner_user_id] || E.owner_user_id,
            onEdit: (de) => q(E),
            onToggle: (de) => y(E),
            onRename: (de) => k(E, de),
            onRemove: (de) => b(E)
          }, null, 8, ["account", "kind-label", "owner-label", "onEdit", "onToggle", "onRename", "onRemove"]))), 128))
        ])
      ]))), 128)),
      A.value ? (t(), ne(Te, {
        key: 5,
        title: V.value ? "Edit account" : "Add account",
        busy: h.value,
        onClose: w[2] || (w[2] = (I) => A.value = !1)
      }, {
        default: fe(() => [
          e("div", El, [
            V.value ? f("", !0) : (t(), ne(Me, {
              key: 0,
              disabled: h.value,
              modelValue: B.value,
              "onUpdate:modelValue": w[1] || (w[1] = (I) => B.value = I),
              agents: n(P).agents
            }, null, 8, ["disabled", "modelValue", "agents"])),
            V.value ? f("", !0) : (t(), l("p", Pl, "Tasks balance across your ready accounts automatically.")),
            $.value ? (t(), l("chestor-autocode-driver-account", {
              key: 2,
              "^config": L.value,
              onSubmit: r
            }, null, 40, Il)) : (t(), l("p", Nl, "This account’s agent is unavailable."))
          ])
        ]),
        _: 1
      }, 8, ["title", "busy"])) : f("", !0)
    ]));
  }
}), Ol = ["aria-busy"], Bl = {
  key: 0,
  class: "kx-empty",
  role: "status"
}, Dl = {
  key: 1,
  class: "kx-err",
  role: "alert"
}, Ml = {
  key: 2,
  class: "kx-empty"
}, jl = {
  key: 3,
  class: "kx-empty"
}, Wl = {
  key: 4,
  class: "ac-list"
}, zl = { class: "ac-account-main" }, Jl = { class: "ac-row-title" }, Hl = { class: "ac-row-name" }, Gl = { class: "ac-muted" }, Kl = {
  key: 0,
  class: "ac-muted ac-mono"
}, Ql = { class: "ac-row-actions" }, Xl = ["onClick"], Yl = ["onClick"], Zl = ["onClick"], en = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, tn = ["disabled"], an = { class: "ac-field" }, ln = { class: "ac-field" }, nn = ["value"], on = { class: "ac-field" }, sn = ["value"], un = {
  key: 0,
  class: "ac-field"
}, cn = ["value"], dn = { class: "ac-field" }, rn = ["value"], vn = { class: "ac-field" }, pn = ["value"], gn = { class: "ac-field" }, fn = ["value"], hn = { class: "ac-field" }, mn = { class: "ac-field" }, kn = { class: "ac-field" }, bn = { class: "ac-field" }, yn = { class: "ac-field" }, _n = {
  key: 2,
  class: "ac-check"
}, $n = ["checked"], wn = { class: "ac-dialog-foot" }, xn = ["disabled"], Cn = /* @__PURE__ */ ve({
  __name: "profiles",
  props: {
    query: {}
  },
  emits: ["count"],
  setup(s, { expose: u, emit: v }) {
    const a = Pe(), F = s, C = v, N = me(), A = p([]), V = p([]), S = p([]), q = p([]), P = p([]), J = p(""), U = p(""), x = p(!0), _ = p(!1), R = p(0), j = p(null), h = p(null), D = p(""), Z = p(""), B = p(""), $ = Y(() => N.value.agents.find((m) => m.id === h.value?.agent)), L = Y(() => A.value.filter((m) => `${m.title} ${m.agent}`.toLowerCase().includes(F.query.toLowerCase()))), G = Ce(async () => {
      try {
        await Ne(
          () => Promise.all([X.profiles(), X.accounts(), X.images(), X.workspaces()]),
          ([m, r, d, y]) => [...m.map((k) => k.id), ...r.map((k) => k.id), ...d.map((k) => k.id), ...y.workspaces.map((k) => k.id)],
          V,
          a,
          ([m, r, d, y]) => {
            A.value = m, S.value = r, q.value = d, P.value = y.workspaces, C("count", m.length), J.value = "";
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
    Ie(() => V.value, G), _e(G);
    function le(m, r = !1) {
      j.value = m && !r ? m.id : null, h.value = m ? {
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
      } : { title: "", agent: N.value.agents[0]?.id ?? "", image_id: "", options: {}, account_pool: [], account_id: "", workspace_id: "" }, D.value = m?.endpoint?.protocol ?? $.value?.endpoints[0] ?? "", Z.value = m?.endpoint?.base_url ?? "", B.value = m?.endpoint?.model ?? "", R.value = 0, U.value = "";
    }
    function te() {
      h.value && (h.value.account_id = "", h.value.account_pool = [], h.value.options = {}, D.value = $.value?.endpoints[0] ?? "", Z.value = "", B.value = "");
    }
    async function H() {
      if (!(!h.value || _.value || R.value)) {
        _.value = !0, U.value = "";
        try {
          const m = { ...h.value, account_pool: h.value.account_id ? [] : h.value.account_pool, endpoint: Z.value ? { protocol: D.value, base_url: Z.value.trim(), model: B.value.trim() || void 0 } : { protocol: D.value, base_url: "" } };
          if (j.value ? await X.updateProfile(j.value, m) : await X.createProfile(m), !a()) return;
          h.value = null, await G();
        } catch (m) {
          a() && (U.value = oe(m, "Could not save the profile."));
        } finally {
          a() && (_.value = !1);
        }
      }
    }
    async function ae(m) {
      if (await $e.confirm({ header: "Delete profile", message: `Delete ${m.title}?`, acceptLabel: "Delete" }))
        try {
          await X.deleteProfile(m.id), await G();
        } catch (r) {
          a() && (J.value = oe(r, "Could not delete the profile."));
        }
    }
    return u({ open: le }), (m, r) => (t(), l("section", { "aria-busy": x.value }, [
      x.value ? (t(), l("p", Bl, "Loading profiles…")) : J.value ? (t(), l("div", Dl, [
        M(i(J.value) + " ", 1),
        e("button", {
          type: "button",
          class: "ac-btn kx-focus-halo",
          "aria-label": "Retry profiles",
          onClick: r[0] || (r[0] = //@ts-ignore
          (...d) => n(G) && n(G)(...d))
        }, "Retry")
      ])) : A.value.length ? L.value.length ? (t(), l("ul", Wl, [
        (t(!0), l(z, null, ee(L.value, (d) => (t(), l("li", {
          key: d.id,
          class: "ac-row ac-account ac-hover-actions"
        }, [
          e("div", zl, [
            e("div", Jl, [
              O(n(W), { icon: "tabler:robot" }),
              e("span", Hl, i(d.title), 1)
            ]),
            e("p", Gl, i(n(N).agents.find((y) => y.id === d.agent)?.title ?? d.agent) + " · " + i(d.endpoint?.model ?? d.options.model ?? "CLI default model"), 1),
            d.endpoint ? (t(), l("p", Kl, i(d.endpoint.base_url), 1)) : f("", !0)
          ]),
          e("div", Ql, [
            e("button", {
              type: "button",
              class: "ac-icon-btn kx-focus-outline",
              "aria-label": "Duplicate profile",
              onClick: (y) => le(d, !0)
            }, [
              O(n(W), { icon: "tabler:copy" })
            ], 8, Xl),
            d.writable ? (t(), l("button", {
              key: 0,
              type: "button",
              class: "ac-icon-btn kx-focus-outline",
              "aria-label": "Edit profile",
              onClick: (y) => le(d)
            }, [
              O(n(W), { icon: "tabler:pencil" })
            ], 8, Yl)) : f("", !0),
            d.deletable ? (t(), l("button", {
              key: 1,
              type: "button",
              class: "ac-icon-btn kx-focus-outline",
              "aria-label": "Delete profile",
              onClick: (y) => ae(d)
            }, [
              O(n(W), { icon: "tabler:trash" })
            ], 8, Zl)) : f("", !0)
          ])
        ]))), 128))
      ])) : (t(), l("p", jl, "No matches.")) : (t(), l("p", Ml, "Create a profile to reuse an agent, endpoint and task settings.")),
      h.value ? (t(), ne(Te, {
        key: 5,
        title: j.value ? "Edit profile" : "Create profile",
        busy: _.value,
        onClose: r[17] || (r[17] = (d) => h.value = null)
      }, {
        default: fe(() => [
          e("form", {
            class: "ac-form",
            onSubmit: ye(H, ["prevent"])
          }, [
            U.value ? (t(), l("p", en, i(U.value), 1)) : f("", !0),
            e("fieldset", {
              class: "ac-form",
              disabled: _.value
            }, [
              e("label", an, [
                r[18] || (r[18] = e("span", null, "Title", -1)),
                Q(e("input", {
                  "onUpdate:modelValue": r[1] || (r[1] = (d) => h.value.title = d),
                  "aria-label": "Profile title",
                  class: "kx-focus-halo",
                  required: "",
                  maxlength: "200"
                }, null, 512), [
                  [se, h.value.title]
                ])
              ]),
              e("label", ln, [
                r[19] || (r[19] = e("span", null, "Agent", -1)),
                Q(e("select", {
                  "onUpdate:modelValue": r[2] || (r[2] = (d) => h.value.agent = d),
                  class: "kx-focus-halo",
                  onChange: te
                }, [
                  (t(!0), l(z, null, ee(n(N).agents, (d) => (t(), l("option", {
                    key: d.id,
                    value: d.id
                  }, i(d.title), 9, nn))), 128))
                ], 544), [
                  [ie, h.value.agent]
                ])
              ]),
              e("label", on, [
                r[21] || (r[21] = e("span", null, "Account", -1)),
                Q(e("select", {
                  "onUpdate:modelValue": r[3] || (r[3] = (d) => h.value.account_id = d),
                  class: "kx-focus-halo"
                }, [
                  r[20] || (r[20] = e("option", { value: "" }, "Auto balance", -1)),
                  (t(!0), l(z, null, ee(S.value.filter((d) => d.agent === h.value?.agent), (d) => (t(), l("option", {
                    key: d.id,
                    value: d.id
                  }, i(d.label), 9, sn))), 128))
                ], 512), [
                  [ie, h.value.account_id]
                ])
              ]),
              h.value.account_id ? f("", !0) : (t(), l("label", un, [
                r[22] || (r[22] = e("span", null, "Account pool (empty uses all usable accounts)", -1)),
                Q(e("select", {
                  "onUpdate:modelValue": r[4] || (r[4] = (d) => h.value.account_pool = d),
                  multiple: "",
                  class: "kx-focus-halo"
                }, [
                  (t(!0), l(z, null, ee(S.value.filter((d) => d.agent === h.value?.agent), (d) => (t(), l("option", {
                    key: d.id,
                    value: d.id
                  }, i(d.label), 9, cn))), 128))
                ], 512), [
                  [ie, h.value.account_pool]
                ])
              ])),
              e("label", dn, [
                r[24] || (r[24] = e("span", null, "Image", -1)),
                Q(e("select", {
                  "onUpdate:modelValue": r[5] || (r[5] = (d) => h.value.image_id = d),
                  required: "",
                  class: "kx-focus-halo"
                }, [
                  r[23] || (r[23] = e("option", { value: "" }, "Choose an image", -1)),
                  (t(!0), l(z, null, ee(q.value.filter((d) => d.agents.includes(h.value?.agent ?? "")), (d) => (t(), l("option", {
                    key: d.id,
                    value: d.id
                  }, i(d.label), 9, rn))), 128))
                ], 512), [
                  [ie, h.value.image_id]
                ])
              ]),
              e("label", vn, [
                r[26] || (r[26] = e("span", null, "Workspace", -1)),
                Q(e("select", {
                  "onUpdate:modelValue": r[6] || (r[6] = (d) => h.value.workspace_id = d),
                  class: "kx-focus-halo"
                }, [
                  r[25] || (r[25] = e("option", { value: "" }, "Scratch directory", -1)),
                  (t(!0), l(z, null, ee(P.value, (d) => (t(), l("option", {
                    key: d.id,
                    value: d.id
                  }, i(d.name), 9, pn))), 128))
                ], 512), [
                  [ie, h.value.workspace_id]
                ])
              ]),
              $.value?.endpoints.length ? (t(), l(z, { key: 1 }, [
                e("label", gn, [
                  r[27] || (r[27] = e("span", null, "Endpoint protocol", -1)),
                  Q(e("select", {
                    "onUpdate:modelValue": r[7] || (r[7] = (d) => D.value = d),
                    class: "kx-focus-halo"
                  }, [
                    (t(!0), l(z, null, ee($.value.endpoints, (d) => (t(), l("option", {
                      key: d,
                      value: d
                    }, i(d), 9, fn))), 128))
                  ], 512), [
                    [ie, D.value]
                  ])
                ]),
                e("label", hn, [
                  r[28] || (r[28] = e("span", null, "Endpoint URL", -1)),
                  Q(e("input", {
                    "onUpdate:modelValue": r[8] || (r[8] = (d) => Z.value = d),
                    class: "kx-focus-halo",
                    placeholder: "Use account endpoint",
                    maxlength: "512"
                  }, null, 512), [
                    [se, Z.value]
                  ])
                ]),
                e("label", mn, [
                  r[29] || (r[29] = e("span", null, "Endpoint model", -1)),
                  Q(e("input", {
                    "onUpdate:modelValue": r[9] || (r[9] = (d) => B.value = d),
                    class: "kx-focus-halo",
                    maxlength: "200"
                  }, null, 512), [
                    [se, B.value]
                  ])
                ])
              ], 64)) : f("", !0),
              e("label", kn, [
                r[30] || (r[30] = e("span", null, "Repository URL", -1)),
                Q(e("input", {
                  "onUpdate:modelValue": r[10] || (r[10] = (d) => h.value.repo_url = d),
                  class: "kx-focus-halo",
                  maxlength: "2000"
                }, null, 512), [
                  [se, h.value.repo_url]
                ])
              ]),
              e("label", bn, [
                r[31] || (r[31] = e("span", null, "Repository ref", -1)),
                Q(e("input", {
                  "onUpdate:modelValue": r[11] || (r[11] = (d) => h.value.repo_ref = d),
                  class: "kx-focus-halo",
                  maxlength: "200"
                }, null, 512), [
                  [se, h.value.repo_ref]
                ])
              ]),
              e("label", yn, [
                r[32] || (r[32] = e("span", null, "Run timeout", -1)),
                Q(e("input", {
                  "onUpdate:modelValue": r[12] || (r[12] = (d) => h.value.run_timeout = d),
                  class: "kx-focus-halo",
                  placeholder: "Use configured timeout",
                  maxlength: "64"
                }, null, 512), [
                  [se, h.value.run_timeout]
                ])
              ]),
              $.value?.unattended ? (t(), l("label", _n, [
                e("input", {
                  checked: h.value.unattended !== !1,
                  onChange: r[13] || (r[13] = (d) => h.value.unattended = d.target.checked),
                  type: "checkbox",
                  class: "kx-focus-outline"
                }, null, 40, $n),
                r[33] || (r[33] = M("Unattended · skip permission prompts when the image allows it", -1))
              ])) : f("", !0),
              $.value ? (t(), ne(De, {
                key: $.value.id,
                modelValue: h.value.options,
                "onUpdate:modelValue": r[14] || (r[14] = (d) => h.value.options = d),
                options: $.value.options,
                defaults: h.value.unattended !== !1 ? $.value.unattended : {},
                onInvalid: r[15] || (r[15] = (d) => R.value = d)
              }, null, 8, ["modelValue", "options", "defaults"])) : f("", !0),
              e("footer", wn, [
                e("button", {
                  type: "button",
                  class: "ac-btn kx-focus-halo",
                  onClick: r[16] || (r[16] = (d) => h.value = null)
                }, "Cancel"),
                e("button", {
                  type: "submit",
                  class: "ac-btn primary kx-focus-halo",
                  disabled: _.value || !!R.value
                }, "Save", 8, xn)
              ])
            ], 8, tn)
          ], 32)
        ]),
        _: 1
      }, 8, ["title", "busy"])) : f("", !0)
    ], 8, Ol));
  }
}), Vn = { class: "ac" }, An = {
  key: 1,
  class: "ac-bar"
}, Sn = {
  class: "ac-tabs",
  "aria-label": "Autocode views"
}, Un = ["aria-pressed", "onClick"], Ln = ["href"], Tn = {
  key: 2,
  class: "kx-err"
}, Fn = {
  key: 3,
  class: "kx-loading"
}, Rn = {
  key: 0,
  class: "kx-empty"
}, En = /* @__PURE__ */ ve({
  __name: "autocode",
  setup(s) {
    const u = He(), v = Ge(), a = p(null);
    pe(() => u.value?.route, () => {
      a.value = null;
    });
    const F = Y(() => a.value ?? u.value?.route ?? ""), C = Y(() => {
      const B = /^\/?runs\/([^/]+)\/?$/.exec(F.value);
      try {
        return B ? decodeURIComponent(B[1]) : "";
      } catch {
        return "";
      }
    }), N = Y(() => !!F.value && F.value !== "/" && !C.value);
    function A(B) {
      S.value = "tasks", a.value = B, v("navigate", { path: B });
    }
    const V = [
      { id: "tasks", label: "Tasks", icon: "tabler:player-play" },
      { id: "profiles", label: "Profiles", icon: "tabler:robot" },
      { id: "accounts", label: "Accounts", icon: "tabler:key" }
    ], S = p("tasks"), { catalog: q, error: P, load: J } = et(), U = p(""), x = p(0), _ = p(null), R = p(null), j = p(null), h = p("");
    async function D(B) {
      B && (h.value = B), S.value = "accounts", U.value = "", await Le(), j.value?.open();
    }
    function Z() {
      S.value === "tasks" ? _.value?.open() : S.value === "profiles" ? R.value?.open() : j.value?.open();
    }
    return (B, $) => (t(), l("div", Vn, [
      !C.value && !N.value ? (t(), ne(tt, {
        key: 0,
        title: "Autocode",
        subtitle: "Run coding agents with your accounts and workspaces.",
        count: `${x.value} ${S.value === "tasks" ? "task" : S.value === "profiles" ? "profile" : "account"}${x.value === 1 ? "" : "s"}`,
        action: S.value === "tasks" ? "New task" : S.value === "profiles" ? "Create profile" : "Add account",
        query: U.value,
        "onUpdate:query": $[0] || ($[0] = (L) => U.value = L),
        placeholder: S.value === "tasks" ? "Search tasks…" : S.value === "profiles" ? "Search profiles…" : "Search accounts…",
        onCreate: Z
      }, null, 8, ["count", "action", "query", "placeholder"])) : f("", !0),
      !C.value && !N.value ? (t(), l("div", An, [
        e("nav", Sn, [
          (t(), l(z, null, ee(V, (L) => e("button", {
            key: L.id,
            type: "button",
            class: ue(["ac-tab kx-focus-outline", { active: S.value === L.id }]),
            "aria-pressed": S.value === L.id,
            onClick: (G) => {
              S.value !== L.id && (S.value = L.id, U.value = "", x.value = 0);
            }
          }, [
            O(n(W), {
              icon: L.icon
            }, null, 8, ["icon"]),
            M(" " + i(L.label), 1)
          ], 10, Un)), 64))
        ]),
        n(q)?.settings_path && (n(q).can_images || n(q).can_workspaces || n(q).can_prune) ? (t(), l("a", {
          key: 0,
          class: "ac-link kx-focus-outline",
          href: n(q).settings_path,
          onClick: $[1] || ($[1] = ye((L) => n($e).navigate(n(q).settings_path), ["prevent"]))
        }, "Images, workspaces and Docker", 8, Ln)) : f("", !0)
      ])) : f("", !0),
      n(P) && !n(q) ? (t(), l("p", Tn, [
        M(i(n(P)) + " ", 1),
        e("button", {
          class: "ac-link kx-focus-outline",
          type: "button",
          onClick: $[2] || ($[2] = //@ts-ignore
          (...L) => n(J) && n(J)(...L))
        }, "Retry")
      ])) : n(q) ? (t(), l("main", {
        key: 4,
        class: ue(["ac-body", { "ac-detail-page": C.value || N.value }])
      }, [
        N.value ? (t(), l("div", Rn, [
          $[11] || ($[11] = e("h1", null, "Run not found", -1)),
          e("button", {
            type: "button",
            class: "ac-btn kx-focus-halo",
            onClick: $[3] || ($[3] = (L) => A(""))
          }, "Back to tasks")
        ])) : C.value || S.value === "tasks" ? (t(), ne(Ga, {
          key: 1,
          ref_key: "tasks",
          ref: _,
          query: U.value,
          "run-id": C.value,
          onOpen: $[4] || ($[4] = (L) => A("runs/" + encodeURIComponent(L))),
          onClose: $[5] || ($[5] = (L) => A("")),
          onCount: $[6] || ($[6] = (L) => x.value = L),
          onAgentChanged: $[7] || ($[7] = (L) => h.value = L),
          onGoto: D
        }, null, 8, ["query", "run-id"])) : S.value === "profiles" ? (t(), ne(Cn, {
          key: 2,
          ref_key: "profiles",
          ref: R,
          query: U.value,
          onCount: $[8] || ($[8] = (L) => x.value = L)
        }, null, 8, ["query"])) : (t(), ne(ql, {
          key: 3,
          ref_key: "accounts",
          ref: j,
          query: U.value,
          "selected-agent": h.value,
          onCount: $[9] || ($[9] = (L) => x.value = L)
        }, null, 8, ["query", "selected-agent"]))
      ], 2)) : (t(), l("div", Fn, [
        O(n(W), {
          icon: "tabler:loader-2",
          class: "spin"
        }),
        $[10] || ($[10] = M(" Loading…", -1))
      ]))
    ]));
  }
}), jn = {
  rootComponent: En,
  plugins: [Ke]
};
export {
  jn as mountConfig
};
