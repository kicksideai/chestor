import { b as be, u as We, a as Je, P as Be } from "./wc-runtime-DbdXH-lj.js";
import { defineComponent as ke, ref as d, computed as G, onMounted as Ue, watch as fe, openBlock as a, createElementBlock as s, createElementVNode as e, withDirectives as q, vModelText as ae, Fragment as W, renderList as Y, toDisplayString as r, vModelSelect as le, createVNode as L, unref as o, createTextVNode as N, createCommentVNode as m, isRef as pe, vModelCheckbox as He, createBlock as oe, onUnmounted as ge, normalizeClass as re, nextTick as Ve, withCtx as _e, withModifiers as Re } from "vue";
import { Icon as J } from "@iconify/vue";
import { host as he, config as Ge } from "@wippy-fe/proxy";
import { u as me, e as je, b as Ce, a as Ie, d as Fe, c as ze } from "./accounts.vue_vue_type_script_setup_true_lang-DjUXxyse.js";
import { _ as Ke } from "./page-head.vue_vue_type_script_setup_true_lang-BCJ0hdjr.js";
import { a as j, e as se, f as Qe, g as $e, d as Le, l as Te, b as Ae, h as Ee, i as Se, t as Xe, s as xe, A as Ye, c as qe, u as Pe, r as Ne } from "./presentation-JHHKyan-.js";
import { d as Ze, e as et, u as tt, _ as Oe, a as De } from "./trait-tools.vue_vue_type_script_setup_true_lang-CCqf9vM5.js";
const at = ["disabled"], lt = { class: "ac-field ac-composer" }, ot = { class: "ac-field" }, st = ["value"], nt = { class: "ac-field" }, ut = {
  key: 0,
  class: "ac-muted"
}, it = {
  key: 1,
  class: "ac-muted"
}, rt = { class: "ac-picker-row" }, ct = { class: "ac-field" }, dt = ["value"], vt = { value: "" }, pt = ["value"], kt = { class: "ac-field" }, ft = ["value"], mt = ["value"], yt = { class: "ac-field" }, gt = ["value"], _t = ["value"], bt = { class: "ac-advanced" }, ht = { class: "ac-form" }, $t = { class: "ac-field" }, xt = { class: "ac-field" }, wt = { class: "ac-field" }, Ct = {
  key: 0,
  class: "ac-check"
}, Ut = {
  key: 2,
  class: "kx-err",
  role: "alert"
}, Vt = { class: "ac-dialog-foot" }, Rt = ["disabled"], It = /* @__PURE__ */ ke({
  __name: "task-form",
  props: {
    accounts: {},
    images: {},
    workspaces: {}
  },
  emits: ["started", "goto", "agentChanged", "cancel", "busy"],
  setup(ee, { emit: B }) {
    const Z = ee, i = B, C = me(), F = d(null), U = d([]), b = d(""), A = d({}), h = G(() => U.value.find((n) => n.id === b.value));
    Ue(async () => {
      try {
        U.value = await j.profiles();
      } catch (n) {
        ie.value = se(n, "Could not load profiles.");
      }
    });
    function V() {
      A.value = {};
    }
    function I(n) {
      b.value ? A.value = { ...A.value, ...n } : w.value = { ...w.value, ...n };
    }
    function O() {
      const n = C.value.settings_path;
      n && F.value?.dispatchEvent(new CustomEvent("navigate", { detail: { path: n }, bubbles: !0, composed: !0 }));
    }
    const w = d({ agent: Ze(C.value, Z.accounts), account_id: "", image_id: "", workspace_id: "", repo_url: "" }), $ = G(() => et(b.value ? A.value : w.value, h.value)), { now: R, driver: x, agentAccounts: D, ready: T, agentImages: p, invalidOptions: z, optionValues: E, invalidImage: _, invalidAccount: g, invalidWorkspace: K, selectAgent: Q } = tt($, {
      catalog: () => C.value,
      accounts: () => Z.accounts,
      images: () => Z.images,
      workspaces: () => Z.workspaces
    }, "live", () => !!b.value), P = G({
      get: () => $.value.agent ?? "",
      set: (n) => {
        if (n === $.value.agent) return;
        const u = Q(n);
        I({ agent: n, account_id: u.account_id, image_id: u.image_id, options: u.options, unattended: u.unattended });
      }
    });
    function X(n) {
      return G({ get: () => $.value[n] ?? "", set: (u) => I({ [n]: u }) });
    }
    const H = X("account_id"), S = X("image_id"), k = X("workspace_id"), l = X("repo_url"), t = X("repo_ref"), c = G({ get: () => $.value.run_timeout ?? "", set: (n) => I({ run_timeout: n }) }), v = d(""), M = G({ get: () => E.value, set: (n) => I({ options: n }) }), ue = G({ get: () => $.value.unattended ?? !!x.value?.unattended, set: (n) => I({ unattended: n }) }), ce = G({ get: () => $.value.tools, set: (n) => I({ tools: n }) }), de = d(!1), ne = d(!1), ie = d("");
    function ye(n) {
      return Qe(n, R.value) === "cooling" ? `${n.label} (cooling down${n.cooldown_until ? " until " + $e(n.cooldown_until) : ""})` : n.label;
    }
    fe(P, (n) => i("agentChanged", n), { immediate: !0 });
    let te;
    fe([b, P, H, S, k, l, t, c, v, M, ue, ce], () => {
      te = void 0;
    }, { deep: !0, flush: "sync" });
    async function y() {
      if (!(ne.value || de.value)) {
        ie.value = "", ne.value = !0, i("busy", !0);
        try {
          const n = {
            tools: ce.value,
            agent: P.value,
            account_id: H.value,
            image_id: S.value,
            workspace_id: k.value,
            repo_url: l.value,
            repo_ref: t.value.trim() || void 0,
            timeout: c.value.trim() || void 0,
            prompt: v.value,
            options: $.value.options ?? {},
            unattended: ue.value
          }, { run_timeout: u, ...f } = A.value, ve = b.value ? {
            profile_id: b.value,
            prompt: v.value,
            options: $.value.options ?? {},
            ...f,
            ...u !== void 0 ? { timeout: u } : {}
          } : n, we = JSON.stringify(ve);
          (!te || te.snapshot !== we) && (te = { snapshot: we, key: crypto.randomUUID(), body: { ...ve, options: JSON.parse(JSON.stringify(ve.options)) } });
          const { run_id: Me } = await j.startRun({ ...te.body, idempotency_key: te.key });
          te = void 0, v.value = "", i("started", Me);
        } catch (n) {
          ie.value = se(n, "Could not start the task.");
        } finally {
          ne.value = !1, i("busy", !1);
        }
      }
    }
    return (n, u) => (a(), s("fieldset", {
      ref_key: "root",
      ref: F,
      class: "ac-form ac-new",
      disabled: ne.value
    }, [
      e("label", lt, [
        u[16] || (u[16] = e("span", null, "Prompt", -1)),
        q(e("textarea", {
          "onUpdate:modelValue": u[0] || (u[0] = (f) => v.value = f),
          autofocus: "",
          rows: "8",
          class: "kx-focus-halo",
          placeholder: "What should the agent do?"
        }, null, 512), [
          [ae, v.value]
        ])
      ]),
      e("label", ot, [
        u[18] || (u[18] = e("span", null, "Profile", -1)),
        q(e("select", {
          "onUpdate:modelValue": u[1] || (u[1] = (f) => b.value = f),
          "aria-label": "Profile",
          class: "kx-focus-halo",
          onChange: V
        }, [
          u[17] || (u[17] = e("option", { value: "" }, "Custom task", -1)),
          (a(!0), s(W, null, Y(U.value, (f) => (a(), s("option", {
            key: f.id,
            value: f.id
          }, r(f.title), 9, st))), 128))
        ], 544), [
          [le, b.value]
        ])
      ]),
      e("div", nt, [
        u[19] || (u[19] = e("span", null, "Agent", -1)),
        L(je, {
          modelValue: P.value,
          "onUpdate:modelValue": u[2] || (u[2] = (f) => P.value = f),
          agents: o(C).agents
        }, null, 8, ["modelValue", "agents"])
      ]),
      P.value && !o(D).length ? (a(), s("p", ut, [
        N(" No " + r(o(x)?.title) + " accounts you can run on. ", 1),
        e("button", {
          class: "ac-link kx-focus-outline",
          type: "button",
          onClick: u[3] || (u[3] = (f) => i("goto", "accounts", P.value))
        }, "Add an account")
      ])) : m("", !0),
      o(p).length ? m("", !0) : (a(), s("p", it, [
        N(" No usable image with " + r(o(x)?.title ?? P.value) + ". " + r(o(C).can_images ? "Prepare an image in Autocode management." : "Ask an administrator to prepare and share an image.") + " ", 1),
        o(C).can_images && o(C).settings_path ? (a(), s("button", {
          key: 0,
          class: "ac-link kx-focus-outline",
          type: "button",
          onClick: O
        }, "Manage images")) : m("", !0)
      ])),
      e("div", rt, [
        e("label", ct, [
          u[20] || (u[20] = e("span", null, "Account", -1)),
          q(e("select", {
            "onUpdate:modelValue": u[4] || (u[4] = (f) => pe(H) ? H.value = f : null),
            class: "kx-focus-halo"
          }, [
            b.value && o(g) ? (a(), s("option", {
              key: 0,
              value: o(H)
            }, r(o(H)) + " (unavailable)", 9, dt)) : m("", !0),
            e("option", vt, "Auto (" + r(o(T).length) + " ready)", 1),
            (a(!0), s(W, null, Y(o(D), (f) => (a(), s("option", {
              key: f.id,
              value: f.id
            }, r(ye(f)), 9, pt))), 128))
          ], 512), [
            [le, o(H)]
          ])
        ]),
        e("label", kt, [
          u[21] || (u[21] = e("span", null, "Image", -1)),
          q(e("select", {
            "onUpdate:modelValue": u[5] || (u[5] = (f) => pe(S) ? S.value = f : null),
            class: "kx-focus-halo"
          }, [
            b.value && o(_) && o(S) ? (a(), s("option", {
              key: 0,
              value: o(S)
            }, r(o(S)) + " (unavailable)", 9, ft)) : m("", !0),
            (a(!0), s(W, null, Y(o(p), (f) => (a(), s("option", {
              key: f.id,
              value: f.id
            }, r(f.label), 9, mt))), 128))
          ], 512), [
            [le, o(S)]
          ])
        ]),
        e("label", yt, [
          u[23] || (u[23] = e("span", null, "Workspace", -1)),
          q(e("select", {
            "onUpdate:modelValue": u[6] || (u[6] = (f) => pe(k) ? k.value = f : null),
            class: "kx-focus-halo"
          }, [
            u[22] || (u[22] = e("option", { value: "" }, "Scratch directory", -1)),
            b.value && o(K) ? (a(), s("option", {
              key: 0,
              value: o(k)
            }, r(o(k)) + " (unavailable)", 9, gt)) : m("", !0),
            (a(!0), s(W, null, Y(ee.workspaces, (f) => (a(), s("option", {
              key: f.id,
              value: f.id
            }, r(f.name) + r(f.writable ? "" : " (read-only)"), 9, _t))), 128))
          ], 512), [
            [le, o(k)]
          ])
        ])
      ]),
      e("details", bt, [
        u[28] || (u[28] = e("summary", { class: "kx-focus-outline" }, "Advanced", -1)),
        e("div", ht, [
          e("label", $t, [
            u[24] || (u[24] = e("span", null, "Git repository", -1)),
            q(e("input", {
              "onUpdate:modelValue": u[7] || (u[7] = (f) => pe(l) ? l.value = f : null),
              class: "ac-mono kx-focus-halo",
              placeholder: "Optional: https://github.com/org/repo.git"
            }, null, 512), [
              [ae, o(l)]
            ])
          ]),
          e("label", xt, [
            u[25] || (u[25] = e("span", null, "Repository ref", -1)),
            q(e("input", {
              "onUpdate:modelValue": u[8] || (u[8] = (f) => pe(t) ? t.value = f : null),
              "aria-label": "Repository ref",
              class: "ac-mono kx-focus-halo",
              placeholder: "Default branch"
            }, null, 512), [
              [ae, o(t)]
            ])
          ]),
          e("label", wt, [
            u[26] || (u[26] = e("span", null, "Run timeout", -1)),
            q(e("input", {
              "onUpdate:modelValue": u[9] || (u[9] = (f) => c.value = f),
              maxlength: "64",
              class: "ac-mono kx-focus-halo",
              placeholder: "Use configured timeout"
            }, null, 512), [
              [ae, c.value]
            ])
          ]),
          o(x)?.unattended ? (a(), s("label", Ct, [
            q(e("input", {
              "onUpdate:modelValue": u[10] || (u[10] = (f) => ue.value = f),
              type: "checkbox",
              class: "kx-focus-outline"
            }, null, 512), [
              [He, ue.value]
            ]),
            u[27] || (u[27] = N(" Unattended · skip permission prompts when the image allows it ", -1))
          ])) : m("", !0),
          L(Oe, {
            modelValue: ce.value,
            "onUpdate:modelValue": u[11] || (u[11] = (f) => ce.value = f),
            agent: P.value,
            onInvalid: u[12] || (u[12] = (f) => de.value = f)
          }, null, 8, ["modelValue", "agent"]),
          o(x) ? (a(), oe(De, {
            key: b.value + o(x).id,
            modelValue: M.value,
            "onUpdate:modelValue": u[13] || (u[13] = (f) => M.value = f),
            options: o(x).options,
            defaults: { ...ue.value ? o(x).unattended : {}, ...h.value?.options },
            onInvalid: u[14] || (u[14] = (f) => z.value = f)
          }, null, 8, ["modelValue", "options", "defaults"])) : m("", !0)
        ])
      ]),
      ie.value ? (a(), s("p", Ut, r(ie.value), 1)) : m("", !0),
      e("footer", Vt, [
        e("button", {
          type: "button",
          class: "ac-btn kx-focus-halo",
          onClick: u[15] || (u[15] = (f) => i("cancel"))
        }, "Cancel"),
        e("button", {
          type: "button",
          class: "ac-btn primary kx-focus-halo",
          disabled: ne.value || de.value || o(z) > 0 || !b.value && (!P.value || !(o(H) || o(T).length) || !o(S)) || !v.value.trim(),
          onClick: y
        }, [
          L(o(J), { icon: "tabler:player-play" }),
          N(" " + r(ne.value ? "Starting…" : "Start"), 1)
        ], 8, Rt)
      ])
    ], 8, at));
  }
}), Lt = {
  key: 0,
  class: "kx-empty",
  role: "status"
}, Tt = {
  key: 1,
  class: "kx-err",
  role: "alert"
}, At = {
  key: 2,
  class: "kx-loading"
}, Et = { class: "ac-detail-head" }, St = { class: "ac-card-head" }, qt = ["disabled"], Pt = { class: "ac-detail-title" }, Nt = { class: "ac-run-meta ac-detail-meta" }, Ot = ["title"], Dt = { key: 0 }, Mt = { key: 1 }, Wt = { key: 2 }, Jt = { key: 3 }, Bt = { key: 4 }, Ht = { key: 5 }, Gt = { class: "ac-detail-section" }, jt = { class: "ac-pre" }, Ft = {
  key: 0,
  class: "ac-muted"
}, zt = {
  key: 0,
  class: "ac-detail-section",
  "aria-label": "Usage by model"
}, Kt = {
  key: 1,
  class: "kx-err",
  role: "alert"
}, Qt = {
  class: "ac-detail-section",
  "aria-labelledby": "ac-prompt-heading"
}, Xt = { class: "ac-section-head" }, Yt = ["aria-expanded"], Zt = {
  key: 2,
  class: "ac-detail-section ac-result",
  "aria-labelledby": "ac-result-heading"
}, ea = { class: "ac-section-head" }, ta = { id: "ac-result-heading" }, aa = { class: "ac-row-actions" }, la = ["aria-expanded"], oa = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, sa = {
  key: 3,
  class: "kx-err",
  role: "alert"
}, na = {
  class: "ac-detail-section",
  "aria-labelledby": "ac-log-heading"
}, ua = { class: "ac-section-head" }, ia = { class: "ac-muted" }, ra = ["disabled"], ca = ["disabled"], da = {
  class: "ac-stream",
  tabindex: "0",
  "aria-label": "Task log"
}, va = { class: "ac-event-kind" }, pa = { class: "ac-event-text" }, ka = {
  key: 0,
  class: "ac-muted ac-pulse"
}, fa = {
  key: 1,
  class: "ac-muted"
}, ma = 500, ya = /* @__PURE__ */ ke({
  __name: "run-detail",
  props: {
    runId: {},
    accounts: {},
    images: {},
    workspaces: {}
  },
  setup(ee) {
    const B = ee, Z = me(), i = d(null), C = d([]), F = d(0), U = d(!1), b = d(!1);
    let A;
    const h = d(!1), V = d(""), I = d(!1), O = d(null), w = d(!1), $ = d("");
    let R = null;
    const x = d(!1), D = d(!1), T = d(!1), p = d(""), z = Le(), E = G(() => (i.value?.prompt.length ?? 0) > 500 || (i.value?.prompt.split(`
`).length ?? 0) > 5), _ = G(() => (i.value?.result.length ?? 0) > 1800 || (i.value?.result.split(`
`).length ?? 0) > 10);
    let g = !0, K = !0, Q, P;
    const X = (y) => y.status === "queued" || y.status === "running";
    function H() {
      R && (K = R.scrollHeight - R.scrollTop - R.clientHeight < 40);
    }
    Ue(() => {
      R = O.value?.closest(".ac") ?? null, R?.addEventListener("scroll", H, { passive: !0 });
    }), ge(() => {
      R?.removeEventListener("scroll", H), R = null;
    });
    const S = xe(async () => {
      try {
        const y = A ?? (i.value ? void 0 : 0);
        A = void 0;
        let n = await j.run(B.runId, y === void 0 ? F.value : void 0, y);
        if (!g) return;
        if (y === void 0 && (n.more || h.value && n.events.length)) {
          if (n = await j.run(B.runId, void 0, 0), !g) return;
          C.value = n.events, U.value = n.more, h.value = !1;
        } else if (y !== void 0)
          C.value = n.events, U.value = n.more, h.value = y !== 0;
        else if (n.events.length) {
          const u = Math.max(0, C.value.length + n.events.length - ma);
          u && C.value.splice(0, u), C.value.push(...n.events), U.value = U.value || u > 0;
        }
        I.value = !1, i.value = n.run, h.value || (F.value = n.next_seq), await Ve(), g && K && R && R.scrollTo({ top: R.scrollHeight }), V.value = "";
      } catch (y) {
        if (!g) return;
        I.value = y instanceof Ye && y.code === "autocode.run_not_found", I.value && (i.value = null, C.value = []), V.value = I.value ? "" : se(y, "Could not load the task.");
      } finally {
        b.value = !1;
      }
    });
    function k() {
      b.value || !C.value.length || (K = !1, b.value = !0, A = C.value[0].seq, S());
    }
    function l() {
      b.value || (K = !0, b.value = !0, A = 0, S());
    }
    const t = Te.run(B.runId, () => {
      S();
    });
    be(S), ge(() => {
      g = !1, t(), clearTimeout(P), clearTimeout(Q);
    });
    async function c() {
      try {
        if (!i.value || !await he.confirm({
          header: "Cancel task",
          message: `Cancel "${i.value.prompt.split(`
`)[0]}" (${i.value.id})? Execution will stop; task history will remain.`,
          icon: "tabler:player-stop",
          acceptLabel: "Cancel task",
          rejectLabel: "Keep task",
          acceptClass: "p-button-danger"
        })) return;
        await j.cancelRun(B.runId), await S();
      } catch (y) {
        V.value = se(y, "Could not cancel the task.");
      }
    }
    async function v(y) {
      try {
        await navigator.clipboard.writeText(y);
      } catch {
        const n = document.createElement("textarea"), u = O.value?.getRootNode(), f = u instanceof ShadowRoot || u instanceof Document ? u.activeElement : null, ve = f instanceof HTMLElement ? f : null;
        n.value = y, n.readOnly = !0, n.style.cssText = "position:fixed;opacity:0;pointer-events:none;", O.value?.append(n);
        try {
          if (n.select(), !document.execCommand("copy")) throw new Error("Copy failed");
        } finally {
          n.remove(), ve?.focus({ preventScroll: !0 });
        }
      }
    }
    async function M() {
      try {
        await v(i.value?.result ?? ""), T.value = !0, p.value = "", clearTimeout(P), P = setTimeout(() => {
          T.value = !1;
        }, 2e3);
      } catch {
        p.value = "Could not copy. Select the result text to copy it.";
      }
    }
    async function ue() {
      try {
        const y = new URL(Ge.env.APP_API_URL || "/", window.location.href);
        await v(new URL(`/autocode/runs/${encodeURIComponent(B.runId)}`, y).href), w.value = !0, $.value = "", clearTimeout(Q), Q = setTimeout(() => {
          w.value = !1;
        }, 2e3);
      } catch {
        $.value = "Could not copy the link. Try again.";
      }
    }
    function ce() {
      D.value = !D.value;
    }
    function de(y) {
      return typeof y.options?.model == "string" ? y.options.model : "";
    }
    function ne(y) {
      return B.accounts.find((n) => n.id === y)?.label ?? "Unlisted account";
    }
    function ie(y) {
      return B.workspaces.find((n) => n.id === y)?.name ?? "Unlisted workspace";
    }
    function ye(y) {
      return B.images.find((n) => n.id === y)?.label ?? "Unlisted image";
    }
    function te(y) {
      const n = [];
      return y.input_tokens !== void 0 && n.push(`${y.input_tokens} input`), y.output_tokens !== void 0 && n.push(`${y.output_tokens} output`), y.cached_tokens !== void 0 && n.push(`${y.cached_tokens} cached`), y.cache_write_tokens !== void 0 && n.push(`${y.cache_write_tokens} cache write`), y.reasoning_tokens !== void 0 && n.push(`${y.reasoning_tokens} reasoning`), y.cost_decimal !== void 0 && y.currency ? n.push(`${y.cost_decimal} ${y.currency}`) : y.cost_usd !== void 0 && n.push(`$${y.cost_usd}`), n.join(" · ");
    }
    return (y, n) => (a(), s("section", {
      ref_key: "detail",
      ref: O,
      class: "ac-form ac-detail"
    }, [
      I.value ? (a(), s("div", Lt, [...n[2] || (n[2] = [
        e("h1", null, "Run not found", -1),
        e("p", null, "This run does not exist or you do not have access to it.", -1)
      ])])) : m("", !0),
      V.value ? (a(), s("p", Tt, [
        N(r(V.value) + " ", 1),
        e("button", {
          type: "button",
          class: "ac-link kx-focus-outline",
          onClick: n[0] || (n[0] = //@ts-ignore
          (...u) => o(S) && o(S)(...u))
        }, "Retry")
      ])) : m("", !0),
      !i.value && !V.value && !I.value ? (a(), s("div", At, [
        L(o(J), {
          icon: "tabler:loader-2",
          class: "spin"
        }),
        n[3] || (n[3] = N(" Loading the task…", -1))
      ])) : i.value ? (a(), s(W, { key: 3 }, [
        e("header", Et, [
          e("div", St, [
            e("span", {
              class: re(["kx-tag-sm ac-tone", i.value.status])
            }, r(i.value.status), 3),
            e("button", {
              type: "button",
              class: "ac-btn kx-focus-halo",
              "aria-live": "polite",
              onClick: ue
            }, [
              L(o(J), {
                icon: w.value ? "tabler:check" : "tabler:link"
              }, null, 8, ["icon"]),
              N(r(w.value ? "Link copied" : "Copy link"), 1)
            ]),
            X(i.value) ? (a(), s("button", {
              key: 0,
              type: "button",
              class: "ac-btn danger kx-focus-halo",
              disabled: i.value.cancel_requested,
              onClick: c
            }, [
              L(o(J), { icon: "tabler:player-stop" }),
              N(" " + r(i.value.cancel_requested ? "Cancelling…" : "Cancel"), 1)
            ], 8, qt)) : m("", !0)
          ]),
          e("h1", Pt, r(i.value.prompt.split(`
`)[0]), 1),
          e("div", Nt, [
            e("span", null, [
              L(o(J), {
                icon: o(Ae)(i.value.agent, o(Z).agents)
              }, null, 8, ["icon"]),
              N(r(o(Z).agents.find((u) => u.id === i.value?.agent)?.title ?? i.value.agent), 1)
            ]),
            e("span", null, r(ne(i.value.account_id)), 1),
            e("span", null, r(ye(i.value.image_id)), 1),
            e("span", {
              title: o($e)(i.value.started_at || i.value.created_at)
            }, r(i.value.started_at ? "Started" : "Queued") + " " + r(o(Ee)(i.value.started_at || i.value.created_at, o(z))), 9, Ot),
            i.value.started_at ? (a(), s("span", Dt, r(o(Se)(i.value, o(z))) + " " + r(X(i.value) ? "elapsed" : "duration"), 1)) : m("", !0),
            i.value.timeout_ms ? (a(), s("span", Mt, r(o(Xe)(i.value.timeout_ms)), 1)) : m("", !0),
            e("span", null, r(i.value.unattended ? "Unattended" : "Attended"), 1),
            i.value.workflow ? (a(), s("span", Wt, "Workflow")) : m("", !0),
            i.value.workspace_id ? (a(), s("span", Jt, r(ie(i.value.workspace_id)), 1)) : m("", !0),
            de(i.value) ? (a(), s("span", Bt, r(de(i.value)), 1)) : m("", !0),
            te(i.value.usage) ? (a(), s("span", Ht, r(te(i.value.usage)), 1)) : m("", !0)
          ])
        ]),
        e("details", Gt, [
          n[4] || (n[4] = e("summary", { class: "kx-focus-outline" }, "Effective options", -1)),
          e("pre", jt, r(JSON.stringify(i.value.options, null, 2)), 1),
          i.value.endpoint ? (a(), s("p", Ft, r(i.value.endpoint.protocol) + " · " + r(i.value.endpoint.base_url) + " · " + r(i.value.endpoint.model), 1)) : m("", !0)
        ]),
        i.value.usage.models ? (a(), s("section", zt, [
          n[5] || (n[5] = e("h3", null, "Usage by model", -1)),
          (a(!0), s(W, null, Y(i.value.usage.models, (u, f) => (a(), s("p", {
            key: f,
            class: "ac-muted"
          }, r(f) + " · " + r(te(u)), 1))), 128))
        ])) : m("", !0),
        $.value ? (a(), s("p", Kt, r($.value), 1)) : m("", !0),
        e("section", Qt, [
          e("div", Xt, [
            n[6] || (n[6] = e("h3", { id: "ac-prompt-heading" }, "Prompt", -1)),
            E.value ? (a(), s("button", {
              key: 0,
              type: "button",
              class: "ac-link kx-focus-outline",
              "aria-expanded": x.value,
              "aria-controls": "ac-prompt-text",
              onClick: n[1] || (n[1] = (u) => x.value = !x.value)
            }, r(x.value ? "Collapse prompt" : "Expand prompt"), 9, Yt)) : m("", !0)
          ]),
          e("pre", {
            id: "ac-prompt-text",
            class: re(["ac-pre ac-prompt", { expanded: x.value || !E.value }])
          }, [
            e("span", null, r(i.value.prompt), 1)
          ], 2)
        ]),
        i.value.result ? (a(), s("section", Zt, [
          e("div", ea, [
            e("h3", ta, r(i.value.status === "succeeded" ? "Result" : "Partial result"), 1),
            e("div", aa, [
              _.value ? (a(), s("button", {
                key: 0,
                type: "button",
                class: "ac-link kx-focus-outline",
                "aria-expanded": D.value,
                "aria-controls": "ac-result-text",
                onClick: ce
              }, r(D.value ? "Collapse result" : "Expand result"), 9, la)) : m("", !0),
              e("button", {
                type: "button",
                class: "ac-btn kx-focus-halo",
                onClick: M
              }, [
                L(o(J), {
                  icon: T.value ? "tabler:check" : "tabler:copy"
                }, null, 8, ["icon"]),
                N(r(T.value ? "Copied" : "Copy"), 1)
              ])
            ])
          ]),
          p.value ? (a(), s("p", oa, r(p.value), 1)) : m("", !0),
          e("pre", {
            id: "ac-result-text",
            class: re(["ac-pre ac-result-text", { expanded: D.value }]),
            tabindex: "0",
            "aria-label": "Result"
          }, r(i.value.result), 3)
        ])) : m("", !0),
        i.value.error ? (a(), s("p", sa, r(i.value.error), 1)) : m("", !0),
        e("section", na, [
          e("div", ua, [
            n[7] || (n[7] = e("h3", { id: "ac-log-heading" }, "Log", -1)),
            e("span", ia, r(C.value.length) + " events", 1)
          ]),
          U.value ? (a(), s("button", {
            key: 0,
            type: "button",
            class: "ac-link kx-focus-outline",
            disabled: b.value,
            onClick: k
          }, r(b.value ? "Loading…" : "Load earlier"), 9, ra)) : m("", !0),
          h.value ? (a(), s("button", {
            key: 1,
            type: "button",
            class: "ac-link kx-focus-outline",
            disabled: b.value,
            onClick: l
          }, "Latest", 8, ca)) : m("", !0),
          e("div", da, [
            (a(!0), s(W, null, Y(C.value, (u) => (a(), s("div", {
              key: u.seq,
              class: re(["ac-event", u.kind])
            }, [
              e("span", va, r(u.kind), 1),
              e("pre", pa, r(u.text), 1)
            ], 2))), 128)),
            X(i.value) ? (a(), s("div", ka, r(i.value.status === "queued" ? "Waiting to start…" : "Working…"), 1)) : C.value.length ? m("", !0) : (a(), s("div", fa, "No log events."))
          ])
        ])
      ], 64)) : m("", !0)
    ], 512));
  }
}), ga = {
  key: 0,
  "aria-label": "Task details"
}, _a = { class: "ac-detail-back" }, ba = {
  key: 1,
  class: "kx-loading"
}, ha = { key: 2 }, $a = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, xa = {
  key: 1,
  class: "kx-empty"
}, wa = { class: "kx-empty-ico" }, Ca = { class: "kx-empty-sub" }, Ua = {
  key: 2,
  class: "kx-empty"
}, Va = {
  key: 3,
  class: "ac-run-list"
}, Ra = ["onClick"], Ia = { class: "ac-run-copy" }, La = { class: "ac-run-title-row" }, Ta = { class: "ac-run-title" }, Aa = {
  key: 0,
  class: "kx-tag-sm ac-tone"
}, Ea = { class: "ac-run-meta" }, Sa = ["title"], qa = { key: 0 }, Pa = {
  key: 4,
  class: "ac-load-more"
}, Na = /* @__PURE__ */ ke({
  __name: "tasks",
  props: {
    query: {},
    runId: {}
  },
  emits: ["goto", "agentChanged", "count", "open", "close"],
  setup(ee, { expose: B, emit: Z }) {
    const i = qe(), C = d([]), F = ee, U = Z, b = me(), A = d(!1), h = d(!1);
    B({ open: () => {
      A.value = !0;
    } });
    const V = d([]), I = d([]), O = d([]), w = d([]), $ = d(), R = d(!1), x = d(""), D = Le(), T = d(!1);
    let p = 0, z = 1;
    async function E() {
      const t = [];
      let c;
      for (let v = 0; v < z; v++) {
        const M = await j.runs(c);
        if (!i() || (t.push(...M.runs), c = M.next_cursor, !c)) break;
      }
      return { runs: t, next_cursor: c };
    }
    const _ = xe(async () => {
      p++, T.value = !0;
      try {
        await Ne(
          () => Promise.all([j.accounts(), j.images(), E(), j.workspaces()]),
          ([t, c, , v]) => [...t, ...c, ...v.workspaces].map((M) => M.id),
          C,
          i,
          ([t, c, v, M]) => {
            V.value = t, I.value = c, w.value = v.runs, $.value = v.next_cursor, O.value = M.workspaces, R.value = !0, x.value = "";
          },
          () => {
            _();
          }
        );
      } catch (t) {
        i() && (x.value = se(t, "Could not load tasks."));
      } finally {
        i() && (T.value = !1);
      }
    }, i), g = Te.runs(() => {
      _();
    });
    Pe(() => C.value, () => {
      _();
    }), be(_), ge(g);
    const K = d(!1);
    async function Q() {
      if (!(!$.value || K.value || T.value)) {
        K.value = !0;
        try {
          const t = p, c = await j.runs($.value);
          if (!i() || p !== t) return;
          const v = new Set(w.value.map((M) => M.id));
          w.value.push(...c.runs.filter((M) => !v.has(M.id))), $.value = c.next_cursor, z++;
        } catch (t) {
          i() && (x.value = se(t, "Could not load more tasks."));
        } finally {
          i() && (K.value = !1);
        }
      }
    }
    function P(t) {
      A.value = !1, U("open", t);
    }
    const X = G(() => V.value.some((t) => t.usable && t.enabled)), H = G(() => w.value.filter((t) => [t.prompt_summary, t.status, t.agent, S(t.agent), l(t.account_id)].join(" ").toLowerCase().includes(F.query.trim().toLowerCase())));
    fe(() => w.value.length, (t) => U("count", t));
    function S(t) {
      return b.value.agents.find((c) => c.id === t)?.title ?? t;
    }
    function k(t) {
      return I.value.find((c) => c.id === t)?.label ?? "Unlisted image";
    }
    function l(t) {
      return V.value.find((c) => c.id === t)?.label ?? "Unlisted account";
    }
    return (t, c) => ee.runId ? (a(), s("section", ga, [
      e("div", _a, [
        e("button", {
          type: "button",
          class: "ac-btn kx-focus-halo",
          onClick: c[0] || (c[0] = (v) => U("close"))
        }, [
          L(o(J), { icon: "tabler:arrow-left" }),
          c[9] || (c[9] = N(" Back to tasks", -1))
        ])
      ]),
      (a(), oe(ya, {
        key: ee.runId,
        "run-id": ee.runId,
        accounts: V.value,
        images: I.value,
        workspaces: O.value
      }, null, 8, ["run-id", "accounts", "images", "workspaces"]))
    ])) : R.value ? (a(), s("div", ha, [
      x.value ? (a(), s("p", $a, [
        N(r(x.value) + " ", 1),
        e("button", {
          class: "ac-link kx-focus-outline",
          type: "button",
          onClick: c[2] || (c[2] = //@ts-ignore
          (...v) => o(_) && o(_)(...v))
        }, "Retry")
      ])) : m("", !0),
      w.value.length ? H.value.length ? m("", !0) : (a(), s("div", Ua, [...c[12] || (c[12] = [
        e("div", { class: "kx-empty-title" }, "No matches", -1),
        e("div", { class: "kx-empty-sub" }, "Try another task, agent or account.", -1)
      ])])) : (a(), s("div", xa, [
        e("div", wa, [
          L(o(J), { icon: "tabler:terminal-2" })
        ]),
        c[11] || (c[11] = e("div", { class: "kx-empty-title" }, "No tasks yet", -1)),
        e("div", Ca, r(X.value ? "Give a coding agent a task and follow its progress here." : "Add an account to give your coding agent a place to start."), 1),
        L(o(Ce), {
          label: X.value ? "New task" : "Add account",
          onClick: c[3] || (c[3] = (v) => X.value ? A.value = !0 : U("goto"))
        }, {
          icon: _e(() => [
            L(o(J), { icon: "tabler:plus" })
          ]),
          _: 1
        }, 8, ["label"])
      ])),
      H.value.length ? (a(), s("ul", Va, [
        (a(!0), s(W, null, Y(H.value, (v) => (a(), s("li", {
          key: v.id,
          class: "ac-run"
        }, [
          e("button", {
            type: "button",
            class: "ac-run-main kx-focus-halo",
            onClick: (M) => U("open", v.id)
          }, [
            e("span", Ia, [
              e("span", La, [
                e("span", Ta, r(v.prompt_summary.split(`
`)[0]), 1),
                e("span", {
                  class: re(["kx-tag-sm ac-tone", v.status])
                }, r(v.status), 3),
                v.workflow ? (a(), s("span", Aa, "Workflow")) : m("", !0)
              ]),
              e("span", Ea, [
                e("span", null, [
                  L(o(J), {
                    icon: o(Ae)(v.agent, o(b).agents)
                  }, null, 8, ["icon"]),
                  N(r(S(v.agent)), 1)
                ]),
                e("span", null, r(l(v.account_id)), 1),
                e("span", null, r(k(v.image_id)), 1),
                e("span", {
                  title: o($e)(v.started_at || v.created_at)
                }, r(o(Ee)(v.started_at || v.created_at, o(D))), 9, Sa),
                v.started_at ? (a(), s("span", qa, r(o(Se)(v, o(D))) + " " + r(v.status === "running" ? "elapsed" : "duration"), 1)) : m("", !0)
              ])
            ]),
            L(o(J), {
              icon: "tabler:chevron-right",
              class: "ac-run-chevron ac-muted"
            })
          ], 8, Ra)
        ]))), 128))
      ])) : m("", !0),
      $.value ? (a(), s("div", Pa, [
        L(o(Ce), {
          label: "Load more",
          loading: K.value,
          disabled: T.value,
          onClick: Q
        }, null, 8, ["loading", "disabled"])
      ])) : m("", !0),
      A.value ? (a(), oe(Ie, {
        key: 5,
        title: "New task",
        busy: h.value,
        wide: "",
        onClose: c[8] || (c[8] = (v) => A.value = !1)
      }, {
        default: _e(() => [
          L(It, {
            onBusy: c[4] || (c[4] = (v) => h.value = v),
            accounts: V.value,
            images: I.value,
            workspaces: O.value,
            onStarted: P,
            onCancel: c[5] || (c[5] = (v) => A.value = !1),
            onAgentChanged: c[6] || (c[6] = (v) => U("agentChanged", v)),
            onGoto: c[7] || (c[7] = (v, M) => U("goto", M))
          }, null, 8, ["accounts", "images", "workspaces"])
        ]),
        _: 1
      }, 8, ["busy"])) : m("", !0)
    ])) : (a(), s("div", ba, [
      x.value ? (a(), s(W, { key: 0 }, [
        N(r(x.value) + " ", 1),
        e("button", {
          class: "ac-link kx-focus-outline",
          type: "button",
          onClick: c[1] || (c[1] = //@ts-ignore
          (...v) => o(_) && o(_)(...v))
        }, "Retry")
      ], 64)) : (a(), s(W, { key: 1 }, [
        L(o(J), {
          icon: "tabler:loader-2",
          class: "spin"
        }),
        c[10] || (c[10] = N(" Loading tasks…", -1))
      ], 64))
    ]));
  }
}), Oa = ["aria-busy"], Da = {
  key: 0,
  class: "kx-empty",
  role: "status"
}, Ma = {
  key: 1,
  class: "kx-err",
  role: "alert"
}, Wa = {
  key: 2,
  class: "kx-empty"
}, Ja = {
  key: 3,
  class: "kx-empty"
}, Ba = {
  key: 4,
  class: "ac-list"
}, Ha = { class: "ac-account-main" }, Ga = { class: "ac-row-title" }, ja = { class: "ac-row-name" }, Fa = { class: "ac-muted" }, za = {
  key: 0,
  class: "ac-muted ac-mono"
}, Ka = { class: "ac-row-actions" }, Qa = ["onClick"], Xa = ["onClick"], Ya = ["onClick"], Za = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, el = ["disabled"], tl = { class: "ac-field" }, al = { class: "ac-field" }, ll = ["value"], ol = { class: "ac-field" }, sl = ["value"], nl = {
  key: 0,
  class: "ac-field"
}, ul = ["value"], il = { class: "ac-field" }, rl = ["value"], cl = { class: "ac-field" }, dl = ["value"], vl = { class: "ac-field" }, pl = ["value"], kl = { class: "ac-field" }, fl = { class: "ac-field" }, ml = { class: "ac-field" }, yl = { class: "ac-field" }, gl = { class: "ac-field" }, _l = {
  key: 2,
  class: "ac-check"
}, bl = ["checked"], hl = { class: "ac-dialog-foot" }, $l = ["disabled"], xl = /* @__PURE__ */ ke({
  __name: "profiles",
  props: {
    query: {}
  },
  emits: ["count"],
  setup(ee, { expose: B, emit: Z }) {
    const i = qe(), C = ee, F = Z, U = me(), b = d([]), A = d([]), h = d([]), V = d([]), I = d([]), O = d(""), w = d(""), $ = d(!0), R = d(!1), x = d(0), D = d(!1), T = d(null), p = d(null), z = d(""), E = d(""), _ = d(""), g = G(() => U.value.agents.find((k) => k.id === p.value?.agent)), K = G(() => b.value.filter((k) => `${k.title} ${k.agent}`.toLowerCase().includes(C.query.toLowerCase()))), Q = xe(async () => {
      try {
        await Ne(
          () => Promise.all([j.profiles(), j.accounts(), j.images(), j.workspaces()]),
          ([k, l, t, c]) => [...k.map((v) => v.id), ...l.map((v) => v.id), ...t.map((v) => v.id), ...c.workspaces.map((v) => v.id)],
          A,
          i,
          ([k, l, t, c]) => {
            b.value = k, h.value = l, V.value = t, I.value = c.workspaces, F("count", k.length), O.value = "";
          },
          () => {
            Q();
          }
        );
      } catch (k) {
        i() && (O.value = se(k, "Could not load profiles."));
      } finally {
        i() && ($.value = !1);
      }
    }, i);
    Pe(() => A.value, Q), be(Q);
    function P(k, l = !1) {
      T.value = k && !l ? k.id : null, p.value = k ? {
        title: k.title + (l ? " copy" : ""),
        agent: k.agent,
        account_id: k.account_id ?? "",
        account_pool: [...k.account_pool ?? []],
        image_id: k.image_id,
        workspace_id: k.workspace_id ?? "",
        tools: k.tools ? JSON.parse(JSON.stringify(k.tools)) : void 0,
        repo_url: k.repo_url,
        repo_ref: k.repo_ref,
        run_timeout: k.run_timeout,
        options: JSON.parse(JSON.stringify(k.options)),
        unattended: k.unattended
      } : { title: "", agent: U.value.agents[0]?.id ?? "", image_id: "", options: {}, account_pool: [], account_id: "", workspace_id: "" }, z.value = k?.endpoint?.protocol ?? g.value?.endpoints[0] ?? "", E.value = k?.endpoint?.base_url ?? "", _.value = k?.endpoint?.model ?? "", x.value = 0, w.value = "";
    }
    function X() {
      p.value && (p.value.account_id = "", p.value.account_pool = [], p.value.options = {}, z.value = g.value?.endpoints[0] ?? "", E.value = "", _.value = "");
    }
    async function H() {
      if (!(!p.value || R.value || x.value || D.value)) {
        R.value = !0, w.value = "";
        try {
          const k = { ...p.value, account_pool: p.value.account_id ? [] : p.value.account_pool };
          if (g.value?.endpoints.length ? k.endpoint = { protocol: z.value, base_url: E.value.trim(), model: _.value.trim() || void 0 } : T.value && b.value.some((l) => l.id === T.value && l.endpoint?.base_url) && (k.endpoint = { protocol: "", base_url: "" }), T.value ? await j.updateProfile(T.value, k) : await j.createProfile(k), !i()) return;
          p.value = null, await Q();
        } catch (k) {
          i() && (w.value = se(k, "Could not save the profile."));
        } finally {
          i() && (R.value = !1);
        }
      }
    }
    async function S(k) {
      if (await he.confirm({ header: "Delete profile", message: `Delete ${k.title}?`, acceptLabel: "Delete" }))
        try {
          await j.deleteProfile(k.id), await Q();
        } catch (l) {
          i() && (O.value = se(l, "Could not delete the profile."));
        }
    }
    return B({ open: P }), (k, l) => (a(), s("section", { "aria-busy": $.value }, [
      $.value ? (a(), s("p", Da, "Loading profiles…")) : O.value ? (a(), s("div", Ma, [
        N(r(O.value) + " ", 1),
        e("button", {
          type: "button",
          class: "ac-btn kx-focus-halo",
          "aria-label": "Retry profiles",
          onClick: l[0] || (l[0] = //@ts-ignore
          (...t) => o(Q) && o(Q)(...t))
        }, "Retry")
      ])) : b.value.length ? K.value.length ? (a(), s("ul", Ba, [
        (a(!0), s(W, null, Y(K.value, (t) => (a(), s("li", {
          key: t.id,
          class: "ac-row ac-account ac-hover-actions"
        }, [
          e("div", Ha, [
            e("div", Ga, [
              L(o(J), { icon: "tabler:robot" }),
              e("span", ja, r(t.title), 1)
            ]),
            e("p", Fa, r(o(U).agents.find((c) => c.id === t.agent)?.title ?? t.agent) + " · " + r(t.endpoint?.model ?? t.options.model ?? "CLI default model"), 1),
            t.endpoint ? (a(), s("p", za, r(t.endpoint.base_url), 1)) : m("", !0)
          ]),
          e("div", Ka, [
            e("button", {
              type: "button",
              class: "ac-icon-btn kx-focus-outline",
              "aria-label": "Duplicate profile",
              onClick: (c) => P(t, !0)
            }, [
              L(o(J), { icon: "tabler:copy" })
            ], 8, Qa),
            t.writable ? (a(), s("button", {
              key: 0,
              type: "button",
              class: "ac-icon-btn kx-focus-outline",
              "aria-label": "Edit profile",
              onClick: (c) => P(t)
            }, [
              L(o(J), { icon: "tabler:pencil" })
            ], 8, Xa)) : m("", !0),
            t.deletable ? (a(), s("button", {
              key: 1,
              type: "button",
              class: "ac-icon-btn kx-focus-outline",
              "aria-label": "Delete profile",
              onClick: (c) => S(t)
            }, [
              L(o(J), { icon: "tabler:trash" })
            ], 8, Ya)) : m("", !0)
          ])
        ]))), 128))
      ])) : (a(), s("p", Ja, "No matches.")) : (a(), s("p", Wa, "Create a profile to reuse agent and task settings.")),
      p.value ? (a(), oe(Ie, {
        key: 5,
        title: T.value ? "Edit profile" : "Create profile",
        busy: R.value,
        onClose: l[19] || (l[19] = (t) => p.value = null)
      }, {
        default: _e(() => [
          e("form", {
            class: "ac-form",
            onSubmit: Re(H, ["prevent"])
          }, [
            w.value ? (a(), s("p", Za, r(w.value), 1)) : m("", !0),
            e("fieldset", {
              class: "ac-form",
              disabled: R.value
            }, [
              e("label", tl, [
                l[20] || (l[20] = e("span", null, "Title", -1)),
                q(e("input", {
                  "onUpdate:modelValue": l[1] || (l[1] = (t) => p.value.title = t),
                  "aria-label": "Profile title",
                  class: "kx-focus-halo",
                  required: "",
                  maxlength: "200"
                }, null, 512), [
                  [ae, p.value.title]
                ])
              ]),
              e("label", al, [
                l[21] || (l[21] = e("span", null, "Agent", -1)),
                q(e("select", {
                  "onUpdate:modelValue": l[2] || (l[2] = (t) => p.value.agent = t),
                  class: "kx-focus-halo",
                  onChange: X
                }, [
                  (a(!0), s(W, null, Y(o(U).agents, (t) => (a(), s("option", {
                    key: t.id,
                    value: t.id
                  }, r(t.title), 9, ll))), 128))
                ], 544), [
                  [le, p.value.agent]
                ])
              ]),
              e("label", ol, [
                l[23] || (l[23] = e("span", null, "Account", -1)),
                q(e("select", {
                  "onUpdate:modelValue": l[3] || (l[3] = (t) => p.value.account_id = t),
                  class: "kx-focus-halo"
                }, [
                  l[22] || (l[22] = e("option", { value: "" }, "Auto balance", -1)),
                  (a(!0), s(W, null, Y(h.value.filter((t) => t.agent === p.value?.agent), (t) => (a(), s("option", {
                    key: t.id,
                    value: t.id
                  }, r(t.label), 9, sl))), 128))
                ], 512), [
                  [le, p.value.account_id]
                ])
              ]),
              p.value.account_id ? m("", !0) : (a(), s("label", nl, [
                l[24] || (l[24] = e("span", null, "Account pool (empty uses all usable accounts)", -1)),
                q(e("select", {
                  "onUpdate:modelValue": l[4] || (l[4] = (t) => p.value.account_pool = t),
                  multiple: "",
                  class: "kx-focus-halo"
                }, [
                  (a(!0), s(W, null, Y(h.value.filter((t) => t.agent === p.value?.agent), (t) => (a(), s("option", {
                    key: t.id,
                    value: t.id
                  }, r(t.label), 9, ul))), 128))
                ], 512), [
                  [le, p.value.account_pool]
                ])
              ])),
              e("label", il, [
                l[26] || (l[26] = e("span", null, "Image", -1)),
                q(e("select", {
                  "onUpdate:modelValue": l[5] || (l[5] = (t) => p.value.image_id = t),
                  required: "",
                  class: "kx-focus-halo"
                }, [
                  l[25] || (l[25] = e("option", { value: "" }, "Choose an image", -1)),
                  (a(!0), s(W, null, Y(V.value.filter((t) => t.agents.includes(p.value?.agent ?? "")), (t) => (a(), s("option", {
                    key: t.id,
                    value: t.id
                  }, r(t.label), 9, rl))), 128))
                ], 512), [
                  [le, p.value.image_id]
                ])
              ]),
              e("label", cl, [
                l[28] || (l[28] = e("span", null, "Workspace", -1)),
                q(e("select", {
                  "onUpdate:modelValue": l[6] || (l[6] = (t) => p.value.workspace_id = t),
                  class: "kx-focus-halo"
                }, [
                  l[27] || (l[27] = e("option", { value: "" }, "Scratch directory", -1)),
                  (a(!0), s(W, null, Y(I.value, (t) => (a(), s("option", {
                    key: t.id,
                    value: t.id
                  }, r(t.name), 9, dl))), 128))
                ], 512), [
                  [le, p.value.workspace_id]
                ])
              ]),
              g.value?.endpoints.length ? (a(), s(W, { key: 1 }, [
                e("label", vl, [
                  l[29] || (l[29] = e("span", null, "Endpoint protocol", -1)),
                  q(e("select", {
                    "onUpdate:modelValue": l[7] || (l[7] = (t) => z.value = t),
                    class: "kx-focus-halo"
                  }, [
                    (a(!0), s(W, null, Y(g.value.endpoints, (t) => (a(), s("option", {
                      key: t,
                      value: t
                    }, r(t), 9, pl))), 128))
                  ], 512), [
                    [le, z.value]
                  ])
                ]),
                e("label", kl, [
                  l[30] || (l[30] = e("span", null, "Endpoint URL", -1)),
                  q(e("input", {
                    "onUpdate:modelValue": l[8] || (l[8] = (t) => E.value = t),
                    class: "kx-focus-halo",
                    placeholder: "Use account endpoint",
                    maxlength: "512"
                  }, null, 512), [
                    [ae, E.value]
                  ])
                ]),
                e("label", fl, [
                  l[31] || (l[31] = e("span", null, "Endpoint model", -1)),
                  q(e("input", {
                    "onUpdate:modelValue": l[9] || (l[9] = (t) => _.value = t),
                    class: "kx-focus-halo",
                    maxlength: "200"
                  }, null, 512), [
                    [ae, _.value]
                  ])
                ])
              ], 64)) : m("", !0),
              e("label", ml, [
                l[32] || (l[32] = e("span", null, "Repository URL", -1)),
                q(e("input", {
                  "onUpdate:modelValue": l[10] || (l[10] = (t) => p.value.repo_url = t),
                  class: "kx-focus-halo",
                  maxlength: "2000"
                }, null, 512), [
                  [ae, p.value.repo_url]
                ])
              ]),
              e("label", yl, [
                l[33] || (l[33] = e("span", null, "Repository ref", -1)),
                q(e("input", {
                  "onUpdate:modelValue": l[11] || (l[11] = (t) => p.value.repo_ref = t),
                  class: "kx-focus-halo",
                  maxlength: "200"
                }, null, 512), [
                  [ae, p.value.repo_ref]
                ])
              ]),
              e("label", gl, [
                l[34] || (l[34] = e("span", null, "Run timeout", -1)),
                q(e("input", {
                  "onUpdate:modelValue": l[12] || (l[12] = (t) => p.value.run_timeout = t),
                  class: "kx-focus-halo",
                  placeholder: "Use configured timeout",
                  maxlength: "64"
                }, null, 512), [
                  [ae, p.value.run_timeout]
                ])
              ]),
              g.value?.unattended ? (a(), s("label", _l, [
                e("input", {
                  checked: p.value.unattended !== !1,
                  onChange: l[13] || (l[13] = (t) => p.value.unattended = t.target.checked),
                  type: "checkbox",
                  class: "kx-focus-outline"
                }, null, 40, bl),
                l[35] || (l[35] = N("Unattended · skip permission prompts when the image allows it", -1))
              ])) : m("", !0),
              L(Oe, {
                modelValue: p.value.tools,
                "onUpdate:modelValue": l[14] || (l[14] = (t) => p.value.tools = t),
                agent: p.value.agent,
                onInvalid: l[15] || (l[15] = (t) => D.value = t)
              }, null, 8, ["modelValue", "agent"]),
              g.value ? (a(), oe(De, {
                key: g.value.id,
                modelValue: p.value.options,
                "onUpdate:modelValue": l[16] || (l[16] = (t) => p.value.options = t),
                options: g.value.options,
                defaults: p.value.unattended !== !1 ? g.value.unattended : {},
                onInvalid: l[17] || (l[17] = (t) => x.value = t)
              }, null, 8, ["modelValue", "options", "defaults"])) : m("", !0),
              e("footer", hl, [
                e("button", {
                  type: "button",
                  class: "ac-btn kx-focus-halo",
                  onClick: l[18] || (l[18] = (t) => p.value = null)
                }, "Cancel"),
                e("button", {
                  type: "submit",
                  class: "ac-btn primary kx-focus-halo",
                  disabled: R.value || !!x.value || D.value
                }, "Save", 8, $l)
              ])
            ], 8, el)
          ], 32)
        ]),
        _: 1
      }, 8, ["title", "busy"])) : m("", !0)
    ], 8, Oa));
  }
}), wl = { class: "ac" }, Cl = {
  key: 1,
  class: "ac-bar"
}, Ul = {
  class: "ac-tabs",
  "aria-label": "Autocode views"
}, Vl = ["aria-pressed", "onClick"], Rl = ["href"], Il = {
  key: 2,
  class: "kx-err"
}, Ll = {
  key: 3,
  class: "kx-loading"
}, Tl = {
  key: 0,
  class: "kx-empty"
}, Al = /* @__PURE__ */ ke({
  __name: "autocode",
  setup(ee) {
    const B = We(), Z = Je(), i = d(null);
    fe(() => B.value?.route, () => {
      i.value = null;
    });
    const C = G(() => i.value ?? B.value?.route ?? ""), F = G(() => {
      const E = /^\/?runs\/([^/]+)\/?$/.exec(C.value);
      try {
        return E ? decodeURIComponent(E[1]) : "";
      } catch {
        return "";
      }
    }), U = G(() => !!C.value && C.value !== "/" && !F.value);
    function b(E) {
      h.value = "tasks", i.value = E, Z("navigate", { path: E });
    }
    const A = [
      { id: "tasks", label: "Tasks", icon: "tabler:player-play" },
      { id: "profiles", label: "Profiles", icon: "tabler:robot" },
      { id: "accounts", label: "Accounts", icon: "tabler:key" }
    ], h = d("tasks"), { catalog: V, error: I, load: O } = Fe(), w = d(""), $ = d(0), R = d(null), x = d(null), D = d(null), T = d("");
    async function p(E) {
      E && (T.value = E), h.value = "accounts", w.value = "", await Ve(), D.value?.open();
    }
    function z() {
      h.value === "tasks" ? R.value?.open() : h.value === "profiles" ? x.value?.open() : D.value?.open();
    }
    return (E, _) => (a(), s("div", wl, [
      !F.value && !U.value ? (a(), oe(Ke, {
        key: 0,
        title: "Autocode",
        subtitle: "Run coding agents with your accounts and workspaces.",
        count: `${$.value} ${h.value === "tasks" ? "task" : h.value === "profiles" ? "profile" : "account"}${$.value === 1 ? "" : "s"}`,
        action: h.value === "tasks" ? "New task" : h.value === "profiles" ? "Create profile" : "Add account",
        query: w.value,
        "onUpdate:query": _[0] || (_[0] = (g) => w.value = g),
        placeholder: h.value === "tasks" ? "Search tasks…" : h.value === "profiles" ? "Search profiles…" : "Search accounts…",
        onCreate: z
      }, null, 8, ["count", "action", "query", "placeholder"])) : m("", !0),
      !F.value && !U.value ? (a(), s("div", Cl, [
        e("nav", Ul, [
          (a(), s(W, null, Y(A, (g) => e("button", {
            key: g.id,
            type: "button",
            class: re(["ac-tab kx-focus-outline", { active: h.value === g.id }]),
            "aria-pressed": h.value === g.id,
            onClick: (K) => {
              h.value !== g.id && (h.value = g.id, w.value = "", $.value = 0);
            }
          }, [
            L(o(J), {
              icon: g.icon
            }, null, 8, ["icon"]),
            N(" " + r(g.label), 1)
          ], 10, Vl)), 64))
        ]),
        o(V)?.settings_path && (o(V).can_images || o(V).can_workspaces || o(V).can_prune) ? (a(), s("a", {
          key: 0,
          class: "ac-link kx-focus-outline",
          href: o(V).settings_path,
          onClick: _[1] || (_[1] = Re((g) => o(he).navigate(o(V).settings_path), ["prevent"]))
        }, "Images, workspaces and Docker", 8, Rl)) : m("", !0)
      ])) : m("", !0),
      o(I) && !o(V) ? (a(), s("p", Il, [
        N(r(o(I)) + " ", 1),
        e("button", {
          class: "ac-link kx-focus-outline",
          type: "button",
          onClick: _[2] || (_[2] = //@ts-ignore
          (...g) => o(O) && o(O)(...g))
        }, "Retry")
      ])) : o(V) ? (a(), s("main", {
        key: 4,
        class: re(["ac-body", { "ac-detail-page": F.value || U.value }])
      }, [
        U.value ? (a(), s("div", Tl, [
          _[11] || (_[11] = e("h1", null, "Run not found", -1)),
          e("button", {
            type: "button",
            class: "ac-btn kx-focus-halo",
            onClick: _[3] || (_[3] = (g) => b(""))
          }, "Back to tasks")
        ])) : F.value || h.value === "tasks" ? (a(), oe(Na, {
          key: 1,
          ref_key: "tasks",
          ref: R,
          query: w.value,
          "run-id": F.value,
          onOpen: _[4] || (_[4] = (g) => b("runs/" + encodeURIComponent(g))),
          onClose: _[5] || (_[5] = (g) => b("")),
          onCount: _[6] || (_[6] = (g) => $.value = g),
          onAgentChanged: _[7] || (_[7] = (g) => T.value = g),
          onGoto: p
        }, null, 8, ["query", "run-id"])) : h.value === "profiles" ? (a(), oe(xl, {
          key: 2,
          ref_key: "profiles",
          ref: x,
          query: w.value,
          onCount: _[8] || (_[8] = (g) => $.value = g)
        }, null, 8, ["query"])) : (a(), oe(ze, {
          key: 3,
          ref_key: "accounts",
          ref: D,
          query: w.value,
          "selected-agent": T.value,
          onCount: _[9] || (_[9] = (g) => $.value = g)
        }, null, 8, ["query", "selected-agent"]))
      ], 2)) : (a(), s("div", Ll, [
        L(o(J), {
          icon: "tabler:loader-2",
          class: "spin"
        }),
        _[10] || (_[10] = N(" Loading…", -1))
      ]))
    ]));
  }
}), Wl = {
  rootComponent: Al,
  plugins: [Be]
};
export {
  Wl as mountConfig
};
