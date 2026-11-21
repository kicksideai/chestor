import { b as be, u as Je, a as Be, P as He } from "./wc-runtime-CvWl7e3g.js";
import { defineComponent as ke, ref as d, computed as j, onMounted as Ue, watch as me, openBlock as a, createElementBlock as s, createElementVNode as e, withDirectives as q, vModelText as ae, Fragment as W, renderList as Y, toDisplayString as r, vModelSelect as le, createVNode as I, unref as o, createTextVNode as N, createCommentVNode as m, isRef as pe, withCtx as fe, vModelCheckbox as je, createBlock as oe, onUnmounted as _e, normalizeClass as re, nextTick as Ve, withModifiers as Re } from "vue";
import { Icon as J } from "@iconify/vue";
import { host as he, config as Ge } from "@wippy-fe/proxy";
import { u as ye, j as Fe, s as Ce, a as Ie, f as ze, e as Ke } from "./accounts.vue_vue_type_script_setup_true_lang-BS36zsOI.js";
import { _ as Qe } from "./page-head.vue_vue_type_script_setup_true_lang-DuTqRM3S.js";
import { a as G, e as se, _ as Le, f as Xe, g as $e, d as Te, l as Ae, b as Ee, h as Se, i as qe, t as Ye, s as xe, A as Ze, c as Pe, u as Ne, r as Oe } from "./Disclosure.vue_vue_type_script_setup_true_lang-CrWwplXA.js";
import { d as et, e as tt, u as at, _ as De, a as Me } from "./trait-tools.vue_vue_type_script_setup_true_lang-wf7bmzEl.js";
const lt = ["disabled"], ot = { class: "ac-field ac-composer" }, st = { class: "ac-field" }, nt = ["value"], ut = { class: "ac-field" }, it = {
  key: 0,
  class: "ac-muted"
}, rt = {
  key: 1,
  class: "ac-muted"
}, ct = { class: "ac-picker-row" }, dt = { class: "ac-field" }, vt = ["value"], pt = { value: "" }, ft = ["value"], kt = { class: "ac-field" }, mt = ["value"], yt = ["value"], gt = { class: "ac-field" }, _t = ["value"], bt = ["value"], ht = { class: "ac-form" }, $t = { class: "ac-field" }, xt = { class: "ac-field" }, wt = { class: "ac-field" }, Ct = {
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
    const Z = ee, u = B, C = ye(), F = d(null), U = d([]), b = d(""), A = d({}), h = j(() => U.value.find((n) => n.id === b.value));
    Ue(async () => {
      try {
        U.value = await G.profiles();
      } catch (n) {
        ie.value = se(n, "Could not load profiles.");
      }
    });
    function V() {
      A.value = {};
    }
    function L(n) {
      b.value ? A.value = { ...A.value, ...n } : w.value = { ...w.value, ...n };
    }
    function O() {
      const n = C.value.settings_path;
      n && F.value?.dispatchEvent(new CustomEvent("navigate", { detail: { path: n }, bubbles: !0, composed: !0 }));
    }
    const w = d({ agent: et(C.value, Z.accounts), account_id: "", image_id: "", workspace_id: "", repo_url: "" }), $ = j(() => tt(b.value ? A.value : w.value, h.value)), { now: R, driver: x, agentAccounts: D, ready: T, agentImages: p, invalidOptions: z, optionValues: E, invalidImage: _, invalidAccount: g, invalidWorkspace: K, selectAgent: Q } = at($, {
      catalog: () => C.value,
      accounts: () => Z.accounts,
      images: () => Z.images,
      workspaces: () => Z.workspaces
    }, "live", () => !!b.value), P = j({
      get: () => $.value.agent ?? "",
      set: (n) => {
        if (n === $.value.agent) return;
        const i = Q(n);
        L({ agent: n, account_id: i.account_id, image_id: i.image_id, options: i.options, unattended: i.unattended });
      }
    });
    function X(n) {
      return j({ get: () => $.value[n] ?? "", set: (i) => L({ [n]: i }) });
    }
    const H = X("account_id"), S = X("image_id"), f = X("workspace_id"), l = X("repo_url"), t = X("repo_ref"), c = j({ get: () => $.value.run_timeout ?? "", set: (n) => L({ run_timeout: n }) }), v = d(""), M = j({ get: () => E.value, set: (n) => L({ options: n }) }), ue = j({ get: () => $.value.unattended ?? !!x.value?.unattended, set: (n) => L({ unattended: n }) }), ce = j({ get: () => $.value.tools, set: (n) => L({ tools: n }) }), de = d(!1), ne = d(!1), ie = d("");
    function ge(n) {
      return Xe(n, R.value) === "cooling" ? `${n.label} (cooling down${n.cooldown_until ? " until " + $e(n.cooldown_until) : ""})` : n.label;
    }
    me(P, (n) => u("agentChanged", n), { immediate: !0 });
    let te;
    me([b, P, H, S, f, l, t, c, v, M, ue, ce], () => {
      te = void 0;
    }, { deep: !0, flush: "sync" });
    async function y() {
      if (!(ne.value || de.value)) {
        ie.value = "", ne.value = !0, u("busy", !0);
        try {
          const n = {
            tools: ce.value,
            agent: P.value,
            account_id: H.value,
            image_id: S.value,
            workspace_id: f.value,
            repo_url: l.value,
            repo_ref: t.value.trim() || void 0,
            timeout: c.value.trim() || void 0,
            prompt: v.value,
            options: $.value.options ?? {},
            unattended: ue.value
          }, { run_timeout: i, ...k } = A.value, ve = b.value ? {
            profile_id: b.value,
            prompt: v.value,
            options: $.value.options ?? {},
            ...k,
            ...i !== void 0 ? { timeout: i } : {}
          } : n, we = JSON.stringify(ve);
          (!te || te.snapshot !== we) && (te = { snapshot: we, key: crypto.randomUUID(), body: { ...ve, options: JSON.parse(JSON.stringify(ve.options)) } });
          const { run_id: We } = await G.startRun({ ...te.body, idempotency_key: te.key });
          te = void 0, v.value = "", u("started", We);
        } catch (n) {
          ie.value = se(n, "Could not start the task.");
        } finally {
          ne.value = !1, u("busy", !1);
        }
      }
    }
    return (n, i) => (a(), s("fieldset", {
      ref_key: "root",
      ref: F,
      class: "ac-form ac-new",
      disabled: ne.value
    }, [
      e("label", ot, [
        i[16] || (i[16] = e("span", null, "Prompt", -1)),
        q(e("textarea", {
          "onUpdate:modelValue": i[0] || (i[0] = (k) => v.value = k),
          autofocus: "",
          rows: "8",
          class: "kx-focus-halo",
          placeholder: "What should the agent do?"
        }, null, 512), [
          [ae, v.value]
        ])
      ]),
      e("label", st, [
        i[18] || (i[18] = e("span", null, "Profile", -1)),
        q(e("select", {
          "onUpdate:modelValue": i[1] || (i[1] = (k) => b.value = k),
          "aria-label": "Profile",
          class: "kx-focus-halo",
          onChange: V
        }, [
          i[17] || (i[17] = e("option", { value: "" }, "Custom task", -1)),
          (a(!0), s(W, null, Y(U.value, (k) => (a(), s("option", {
            key: k.id,
            value: k.id
          }, r(k.title), 9, nt))), 128))
        ], 544), [
          [le, b.value]
        ])
      ]),
      e("div", ut, [
        i[19] || (i[19] = e("span", null, "Agent", -1)),
        I(Fe, {
          modelValue: P.value,
          "onUpdate:modelValue": i[2] || (i[2] = (k) => P.value = k),
          agents: o(C).agents
        }, null, 8, ["modelValue", "agents"])
      ]),
      P.value && !o(D).length ? (a(), s("p", it, [
        N(" No " + r(o(x)?.title) + " accounts you can run on. ", 1),
        e("button", {
          class: "ac-link kx-focus-outline",
          type: "button",
          onClick: i[3] || (i[3] = (k) => u("goto", "accounts", P.value))
        }, "Add an account")
      ])) : m("", !0),
      o(p).length ? m("", !0) : (a(), s("p", rt, [
        N(" No usable image with " + r(o(x)?.title ?? P.value) + ". " + r(o(C).can_images ? "Prepare an image in Autocode management." : "Ask an administrator to prepare and share an image.") + " ", 1),
        o(C).can_images && o(C).settings_path ? (a(), s("button", {
          key: 0,
          class: "ac-link kx-focus-outline",
          type: "button",
          onClick: O
        }, "Manage images")) : m("", !0)
      ])),
      e("div", ct, [
        e("label", dt, [
          i[20] || (i[20] = e("span", null, "Account", -1)),
          q(e("select", {
            "onUpdate:modelValue": i[4] || (i[4] = (k) => pe(H) ? H.value = k : null),
            class: "kx-focus-halo"
          }, [
            b.value && o(g) ? (a(), s("option", {
              key: 0,
              value: o(H)
            }, r(o(H)) + " (unavailable)", 9, vt)) : m("", !0),
            e("option", pt, "Auto (" + r(o(T).length) + " ready)", 1),
            (a(!0), s(W, null, Y(o(D), (k) => (a(), s("option", {
              key: k.id,
              value: k.id
            }, r(ge(k)), 9, ft))), 128))
          ], 512), [
            [le, o(H)]
          ])
        ]),
        e("label", kt, [
          i[21] || (i[21] = e("span", null, "Image", -1)),
          q(e("select", {
            "onUpdate:modelValue": i[5] || (i[5] = (k) => pe(S) ? S.value = k : null),
            class: "kx-focus-halo"
          }, [
            b.value && o(_) && o(S) ? (a(), s("option", {
              key: 0,
              value: o(S)
            }, r(o(S)) + " (unavailable)", 9, mt)) : m("", !0),
            (a(!0), s(W, null, Y(o(p), (k) => (a(), s("option", {
              key: k.id,
              value: k.id
            }, r(k.label), 9, yt))), 128))
          ], 512), [
            [le, o(S)]
          ])
        ]),
        e("label", gt, [
          i[23] || (i[23] = e("span", null, "Workspace", -1)),
          q(e("select", {
            "onUpdate:modelValue": i[6] || (i[6] = (k) => pe(f) ? f.value = k : null),
            class: "kx-focus-halo"
          }, [
            i[22] || (i[22] = e("option", { value: "" }, "Scratch directory", -1)),
            b.value && o(K) ? (a(), s("option", {
              key: 0,
              value: o(f)
            }, r(o(f)) + " (unavailable)", 9, _t)) : m("", !0),
            (a(!0), s(W, null, Y(ee.workspaces, (k) => (a(), s("option", {
              key: k.id,
              value: k.id
            }, r(k.name) + r(k.writable ? "" : " (read-only)"), 9, bt))), 128))
          ], 512), [
            [le, o(f)]
          ])
        ])
      ]),
      I(Le, {
        class: "ac-advanced",
        label: "Advanced"
      }, {
        default: fe(() => [
          e("div", ht, [
            e("label", $t, [
              i[24] || (i[24] = e("span", null, "Git repository", -1)),
              q(e("input", {
                "onUpdate:modelValue": i[7] || (i[7] = (k) => pe(l) ? l.value = k : null),
                class: "ac-mono kx-focus-halo",
                placeholder: "Optional: https://github.com/org/repo.git"
              }, null, 512), [
                [ae, o(l)]
              ])
            ]),
            e("label", xt, [
              i[25] || (i[25] = e("span", null, "Repository ref", -1)),
              q(e("input", {
                "onUpdate:modelValue": i[8] || (i[8] = (k) => pe(t) ? t.value = k : null),
                "aria-label": "Repository ref",
                class: "ac-mono kx-focus-halo",
                placeholder: "Default branch"
              }, null, 512), [
                [ae, o(t)]
              ])
            ]),
            e("label", wt, [
              i[26] || (i[26] = e("span", null, "Run timeout", -1)),
              q(e("input", {
                "onUpdate:modelValue": i[9] || (i[9] = (k) => c.value = k),
                maxlength: "64",
                class: "ac-mono kx-focus-halo",
                placeholder: "Use configured timeout"
              }, null, 512), [
                [ae, c.value]
              ])
            ]),
            o(x)?.unattended ? (a(), s("label", Ct, [
              q(e("input", {
                "onUpdate:modelValue": i[10] || (i[10] = (k) => ue.value = k),
                type: "checkbox",
                class: "kx-focus-outline"
              }, null, 512), [
                [je, ue.value]
              ]),
              i[27] || (i[27] = N(" Unattended · skip permission prompts when the image allows it ", -1))
            ])) : m("", !0),
            I(De, {
              modelValue: ce.value,
              "onUpdate:modelValue": i[11] || (i[11] = (k) => ce.value = k),
              agent: P.value,
              onInvalid: i[12] || (i[12] = (k) => de.value = k)
            }, null, 8, ["modelValue", "agent"]),
            o(x) ? (a(), oe(Me, {
              key: b.value + o(x).id,
              modelValue: M.value,
              "onUpdate:modelValue": i[13] || (i[13] = (k) => M.value = k),
              options: o(x).options,
              defaults: { ...ue.value ? o(x).unattended : {}, ...h.value?.options },
              onInvalid: i[14] || (i[14] = (k) => z.value = k)
            }, null, 8, ["modelValue", "options", "defaults"])) : m("", !0)
          ])
        ]),
        _: 1
      }),
      ie.value ? (a(), s("p", Ut, r(ie.value), 1)) : m("", !0),
      e("footer", Vt, [
        e("button", {
          type: "button",
          class: "ac-btn kx-focus-halo",
          onClick: i[15] || (i[15] = (k) => u("cancel"))
        }, "Cancel"),
        e("button", {
          type: "button",
          class: "ac-btn primary kx-focus-halo",
          disabled: ne.value || de.value || o(z) > 0 || !b.value && (!P.value || !(o(H) || o(T).length) || !o(S)) || !v.value.trim(),
          onClick: y
        }, [
          I(o(J), { icon: "tabler:player-play" }),
          N(" " + r(ne.value ? "Starting…" : "Start"), 1)
        ], 8, Rt)
      ])
    ], 8, lt));
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
}, Et = { class: "ac-detail-head" }, St = { class: "ac-card-head" }, qt = ["disabled"], Pt = { class: "ac-detail-title" }, Nt = { class: "ac-run-meta ac-detail-meta" }, Ot = ["title"], Dt = { key: 0 }, Mt = { key: 1 }, Wt = { key: 2 }, Jt = { key: 3 }, Bt = { key: 4 }, Ht = { key: 5 }, jt = { class: "ac-pre" }, Gt = {
  key: 0,
  class: "ac-muted"
}, Ft = {
  key: 0,
  class: "ac-detail-section",
  "aria-label": "Usage by model"
}, zt = {
  key: 1,
  class: "kx-err",
  role: "alert"
}, Kt = {
  class: "ac-detail-section",
  "aria-labelledby": "ac-prompt-heading"
}, Qt = { class: "ac-section-head" }, Xt = ["aria-expanded"], Yt = {
  key: 2,
  class: "ac-detail-section ac-result",
  "aria-labelledby": "ac-result-heading"
}, Zt = { class: "ac-section-head" }, ea = { id: "ac-result-heading" }, ta = { class: "ac-row-actions" }, aa = ["aria-expanded"], la = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, oa = {
  key: 3,
  class: "kx-err",
  role: "alert"
}, sa = {
  class: "ac-detail-section",
  "aria-labelledby": "ac-log-heading"
}, na = { class: "ac-section-head" }, ua = { class: "ac-muted" }, ia = ["disabled"], ra = ["disabled"], ca = {
  class: "ac-stream",
  tabindex: "0",
  "aria-label": "Task log"
}, da = { class: "ac-event-kind" }, va = { class: "ac-event-text" }, pa = {
  key: 0,
  class: "ac-muted ac-pulse"
}, fa = {
  key: 1,
  class: "ac-muted"
}, ka = 500, ma = /* @__PURE__ */ ke({
  __name: "run-detail",
  props: {
    runId: {},
    accounts: {},
    images: {},
    workspaces: {}
  },
  setup(ee) {
    const B = ee, Z = ye(), u = d(null), C = d([]), F = d(0), U = d(!1), b = d(!1);
    let A;
    const h = d(!1), V = d(""), L = d(!1), O = d(null), w = d(!1), $ = d("");
    let R = null;
    const x = d(!1), D = d(!1), T = d(!1), p = d(""), z = Te(), E = j(() => (u.value?.prompt.length ?? 0) > 500 || (u.value?.prompt.split(`
`).length ?? 0) > 5), _ = j(() => (u.value?.result.length ?? 0) > 1800 || (u.value?.result.split(`
`).length ?? 0) > 10);
    let g = !0, K = !0, Q, P;
    const X = (y) => y.status === "queued" || y.status === "running";
    function H() {
      R && (K = R.scrollHeight - R.scrollTop - R.clientHeight < 40);
    }
    Ue(() => {
      R = O.value?.closest(".ac") ?? null, R?.addEventListener("scroll", H, { passive: !0 });
    }), _e(() => {
      R?.removeEventListener("scroll", H), R = null;
    });
    const S = xe(async () => {
      try {
        const y = A ?? (u.value ? void 0 : 0);
        A = void 0;
        let n = await G.run(B.runId, y === void 0 ? F.value : void 0, y);
        if (!g) return;
        if (y === void 0 && (n.more || h.value && n.events.length)) {
          if (n = await G.run(B.runId, void 0, 0), !g) return;
          C.value = n.events, U.value = n.more, h.value = !1;
        } else if (y !== void 0)
          C.value = n.events, U.value = n.more, h.value = y !== 0;
        else if (n.events.length) {
          const i = Math.max(0, C.value.length + n.events.length - ka);
          i && C.value.splice(0, i), C.value.push(...n.events), U.value = U.value || i > 0;
        }
        L.value = !1, u.value = n.run, h.value || (F.value = n.next_seq), await Ve(), g && K && R && R.scrollTo({ top: R.scrollHeight }), V.value = "";
      } catch (y) {
        if (!g) return;
        L.value = y instanceof Ze && y.code === "autocode.run_not_found", L.value && (u.value = null, C.value = []), V.value = L.value ? "" : se(y, "Could not load the task.");
      } finally {
        b.value = !1;
      }
    });
    function f() {
      b.value || !C.value.length || (K = !1, b.value = !0, A = C.value[0].seq, S());
    }
    function l() {
      b.value || (K = !0, b.value = !0, A = 0, S());
    }
    const t = Ae.run(B.runId, () => {
      S();
    });
    be(S), _e(() => {
      g = !1, t(), clearTimeout(P), clearTimeout(Q);
    });
    async function c() {
      try {
        if (!u.value || !await he.confirm({
          header: "Cancel task",
          message: `Cancel "${u.value.prompt.split(`
`)[0]}" (${u.value.id})? Execution will stop; task history will remain.`,
          icon: "tabler:player-stop",
          acceptLabel: "Cancel task",
          rejectLabel: "Keep task",
          acceptClass: "p-button-danger"
        })) return;
        await G.cancelRun(B.runId), await S();
      } catch (y) {
        V.value = se(y, "Could not cancel the task.");
      }
    }
    async function v(y) {
      try {
        await navigator.clipboard.writeText(y);
      } catch {
        const n = document.createElement("textarea"), i = O.value?.getRootNode(), k = i instanceof ShadowRoot || i instanceof Document ? i.activeElement : null, ve = k instanceof HTMLElement ? k : null;
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
        await v(u.value?.result ?? ""), T.value = !0, p.value = "", clearTimeout(P), P = setTimeout(() => {
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
    function ge(y) {
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
      L.value ? (a(), s("div", Lt, [...n[2] || (n[2] = [
        e("h1", null, "Run not found", -1),
        e("p", null, "This run does not exist or you do not have access to it.", -1)
      ])])) : m("", !0),
      V.value ? (a(), s("p", Tt, [
        N(r(V.value) + " ", 1),
        e("button", {
          type: "button",
          class: "ac-link kx-focus-outline",
          onClick: n[0] || (n[0] = //@ts-ignore
          (...i) => o(S) && o(S)(...i))
        }, "Retry")
      ])) : m("", !0),
      !u.value && !V.value && !L.value ? (a(), s("div", At, [
        I(o(J), {
          icon: "tabler:loader-2",
          class: "spin"
        }),
        n[3] || (n[3] = N(" Loading the task…", -1))
      ])) : u.value ? (a(), s(W, { key: 3 }, [
        e("header", Et, [
          e("div", St, [
            e("span", {
              class: re(["kx-tag-sm ac-tone", u.value.status])
            }, r(u.value.status), 3),
            e("button", {
              type: "button",
              class: "ac-btn kx-focus-halo",
              "aria-live": "polite",
              onClick: ue
            }, [
              I(o(J), {
                icon: w.value ? "tabler:check" : "tabler:link"
              }, null, 8, ["icon"]),
              N(r(w.value ? "Link copied" : "Copy link"), 1)
            ]),
            X(u.value) ? (a(), s("button", {
              key: 0,
              type: "button",
              class: "ac-btn danger kx-focus-halo",
              disabled: u.value.cancel_requested,
              onClick: c
            }, [
              I(o(J), { icon: "tabler:player-stop" }),
              N(" " + r(u.value.cancel_requested ? "Cancelling…" : "Cancel"), 1)
            ], 8, qt)) : m("", !0)
          ]),
          e("h1", Pt, r(u.value.prompt.split(`
`)[0]), 1),
          e("div", Nt, [
            e("span", null, [
              I(o(J), {
                icon: o(Ee)(u.value.agent, o(Z).agents)
              }, null, 8, ["icon"]),
              N(r(o(Z).agents.find((i) => i.id === u.value?.agent)?.title ?? u.value.agent), 1)
            ]),
            e("span", null, r(ne(u.value.account_id)), 1),
            e("span", null, r(ge(u.value.image_id)), 1),
            e("span", {
              title: o($e)(u.value.started_at || u.value.created_at)
            }, r(u.value.started_at ? "Started" : "Queued") + " " + r(o(Se)(u.value.started_at || u.value.created_at, o(z))), 9, Ot),
            u.value.started_at ? (a(), s("span", Dt, r(o(qe)(u.value, o(z))) + " " + r(X(u.value) ? "elapsed" : "duration"), 1)) : m("", !0),
            u.value.timeout_ms ? (a(), s("span", Mt, r(o(Ye)(u.value.timeout_ms)), 1)) : m("", !0),
            e("span", null, r(u.value.unattended ? "Unattended" : "Attended"), 1),
            u.value.workflow ? (a(), s("span", Wt, "Workflow")) : m("", !0),
            u.value.workspace_id ? (a(), s("span", Jt, r(ie(u.value.workspace_id)), 1)) : m("", !0),
            de(u.value) ? (a(), s("span", Bt, r(de(u.value)), 1)) : m("", !0),
            te(u.value.usage) ? (a(), s("span", Ht, r(te(u.value.usage)), 1)) : m("", !0)
          ])
        ]),
        I(Le, {
          class: "ac-detail-section",
          label: "Effective options"
        }, {
          default: fe(() => [
            e("pre", jt, r(JSON.stringify(u.value.options, null, 2)), 1),
            u.value.endpoint ? (a(), s("p", Gt, r(u.value.endpoint.protocol) + " · " + r(u.value.endpoint.base_url) + " · " + r(u.value.endpoint.model), 1)) : m("", !0)
          ]),
          _: 1
        }),
        u.value.usage.models ? (a(), s("section", Ft, [
          n[4] || (n[4] = e("h3", null, "Usage by model", -1)),
          (a(!0), s(W, null, Y(u.value.usage.models, (i, k) => (a(), s("p", {
            key: k,
            class: "ac-muted"
          }, r(k) + " · " + r(te(i)), 1))), 128))
        ])) : m("", !0),
        $.value ? (a(), s("p", zt, r($.value), 1)) : m("", !0),
        e("section", Kt, [
          e("div", Qt, [
            n[5] || (n[5] = e("h3", { id: "ac-prompt-heading" }, "Prompt", -1)),
            E.value ? (a(), s("button", {
              key: 0,
              type: "button",
              class: "ac-link kx-focus-outline",
              "aria-expanded": x.value,
              "aria-controls": "ac-prompt-text",
              onClick: n[1] || (n[1] = (i) => x.value = !x.value)
            }, r(x.value ? "Collapse prompt" : "Expand prompt"), 9, Xt)) : m("", !0)
          ]),
          e("pre", {
            id: "ac-prompt-text",
            class: re(["ac-pre ac-prompt", { expanded: x.value || !E.value }])
          }, [
            e("span", null, r(u.value.prompt), 1)
          ], 2)
        ]),
        u.value.result ? (a(), s("section", Yt, [
          e("div", Zt, [
            e("h3", ea, r(u.value.status === "succeeded" ? "Result" : "Partial result"), 1),
            e("div", ta, [
              _.value ? (a(), s("button", {
                key: 0,
                type: "button",
                class: "ac-link kx-focus-outline",
                "aria-expanded": D.value,
                "aria-controls": "ac-result-text",
                onClick: ce
              }, r(D.value ? "Collapse result" : "Expand result"), 9, aa)) : m("", !0),
              e("button", {
                type: "button",
                class: "ac-btn kx-focus-halo",
                onClick: M
              }, [
                I(o(J), {
                  icon: T.value ? "tabler:check" : "tabler:copy"
                }, null, 8, ["icon"]),
                N(r(T.value ? "Copied" : "Copy"), 1)
              ])
            ])
          ]),
          p.value ? (a(), s("p", la, r(p.value), 1)) : m("", !0),
          e("pre", {
            id: "ac-result-text",
            class: re(["ac-pre ac-result-text", { expanded: D.value }]),
            tabindex: "0",
            "aria-label": "Result"
          }, r(u.value.result), 3)
        ])) : m("", !0),
        u.value.error ? (a(), s("p", oa, r(u.value.error), 1)) : m("", !0),
        e("section", sa, [
          e("div", na, [
            n[6] || (n[6] = e("h3", { id: "ac-log-heading" }, "Log", -1)),
            e("span", ua, r(C.value.length) + " events", 1)
          ]),
          U.value ? (a(), s("button", {
            key: 0,
            type: "button",
            class: "ac-link kx-focus-outline",
            disabled: b.value,
            onClick: f
          }, r(b.value ? "Loading…" : "Load earlier"), 9, ia)) : m("", !0),
          h.value ? (a(), s("button", {
            key: 1,
            type: "button",
            class: "ac-link kx-focus-outline",
            disabled: b.value,
            onClick: l
          }, "Latest", 8, ra)) : m("", !0),
          e("div", ca, [
            (a(!0), s(W, null, Y(C.value, (i) => (a(), s("div", {
              key: i.seq,
              class: re(["ac-event", i.kind])
            }, [
              e("span", da, r(i.kind), 1),
              e("pre", va, r(i.text), 1)
            ], 2))), 128)),
            X(u.value) ? (a(), s("div", pa, r(u.value.status === "queued" ? "Waiting to start…" : "Working…"), 1)) : C.value.length ? m("", !0) : (a(), s("div", fa, "No log events."))
          ])
        ])
      ], 64)) : m("", !0)
    ], 512));
  }
}), ya = {
  key: 0,
  "aria-label": "Task details"
}, ga = { class: "ac-detail-back" }, _a = {
  key: 1,
  class: "kx-loading"
}, ba = { key: 2 }, ha = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, $a = {
  key: 1,
  class: "kx-empty"
}, xa = { class: "kx-empty-ico" }, wa = { class: "kx-empty-sub" }, Ca = {
  key: 2,
  class: "kx-empty"
}, Ua = {
  key: 3,
  class: "ac-run-list"
}, Va = ["onClick"], Ra = { class: "ac-run-copy" }, Ia = { class: "ac-run-title-row" }, La = { class: "ac-run-title" }, Ta = {
  key: 0,
  class: "kx-tag-sm ac-tone"
}, Aa = { class: "ac-run-meta" }, Ea = ["title"], Sa = { key: 0 }, qa = {
  key: 4,
  class: "ac-load-more"
}, Pa = /* @__PURE__ */ ke({
  __name: "tasks",
  props: {
    query: {},
    runId: {}
  },
  emits: ["goto", "agentChanged", "count", "open", "close"],
  setup(ee, { expose: B, emit: Z }) {
    const u = Pe(), C = d([]), F = ee, U = Z, b = ye(), A = d(!1), h = d(!1);
    B({ open: () => {
      A.value = !0;
    } });
    const V = d([]), L = d([]), O = d([]), w = d([]), $ = d(), R = d(!1), x = d(""), D = Te(), T = d(!1);
    let p = 0, z = 1;
    async function E() {
      const t = [];
      let c;
      for (let v = 0; v < z; v++) {
        const M = await G.runs(c);
        if (!u() || (t.push(...M.runs), c = M.next_cursor, !c)) break;
      }
      return { runs: t, next_cursor: c };
    }
    const _ = xe(async () => {
      p++, T.value = !0;
      try {
        await Oe(
          () => Promise.all([G.accounts(), G.images(), E(), G.workspaces()]),
          ([t, c, , v]) => [...t, ...c, ...v.workspaces].map((M) => M.id),
          C,
          u,
          ([t, c, v, M]) => {
            V.value = t, L.value = c, w.value = v.runs, $.value = v.next_cursor, O.value = M.workspaces, R.value = !0, x.value = "";
          },
          () => {
            _();
          }
        );
      } catch (t) {
        u() && (x.value = se(t, "Could not load tasks."));
      } finally {
        u() && (T.value = !1);
      }
    }, u), g = Ae.runs(() => {
      _();
    });
    Ne(() => C.value, () => {
      _();
    }), be(_), _e(g);
    const K = d(!1);
    async function Q() {
      if (!(!$.value || K.value || T.value)) {
        K.value = !0;
        try {
          const t = p, c = await G.runs($.value);
          if (!u() || p !== t) return;
          const v = new Set(w.value.map((M) => M.id));
          w.value.push(...c.runs.filter((M) => !v.has(M.id))), $.value = c.next_cursor, z++;
        } catch (t) {
          u() && (x.value = se(t, "Could not load more tasks."));
        } finally {
          u() && (K.value = !1);
        }
      }
    }
    function P(t) {
      A.value = !1, U("open", t);
    }
    const X = j(() => V.value.some((t) => t.usable && t.enabled)), H = j(() => w.value.filter((t) => [t.prompt_summary, t.status, t.agent, S(t.agent), l(t.account_id)].join(" ").toLowerCase().includes(F.query.trim().toLowerCase())));
    me(() => w.value.length, (t) => U("count", t));
    function S(t) {
      return b.value.agents.find((c) => c.id === t)?.title ?? t;
    }
    function f(t) {
      return L.value.find((c) => c.id === t)?.label ?? "Unlisted image";
    }
    function l(t) {
      return V.value.find((c) => c.id === t)?.label ?? "Unlisted account";
    }
    return (t, c) => ee.runId ? (a(), s("section", ya, [
      e("div", ga, [
        e("button", {
          type: "button",
          class: "ac-btn kx-focus-halo",
          onClick: c[0] || (c[0] = (v) => U("close"))
        }, [
          I(o(J), { icon: "tabler:arrow-left" }),
          c[9] || (c[9] = N(" Back to tasks", -1))
        ])
      ]),
      (a(), oe(ma, {
        key: ee.runId,
        "run-id": ee.runId,
        accounts: V.value,
        images: L.value,
        workspaces: O.value
      }, null, 8, ["run-id", "accounts", "images", "workspaces"]))
    ])) : R.value ? (a(), s("div", ba, [
      x.value ? (a(), s("p", ha, [
        N(r(x.value) + " ", 1),
        e("button", {
          class: "ac-link kx-focus-outline",
          type: "button",
          onClick: c[2] || (c[2] = //@ts-ignore
          (...v) => o(_) && o(_)(...v))
        }, "Retry")
      ])) : m("", !0),
      w.value.length ? H.value.length ? m("", !0) : (a(), s("div", Ca, [...c[12] || (c[12] = [
        e("div", { class: "kx-empty-title" }, "No matches", -1),
        e("div", { class: "kx-empty-sub" }, "Try another task, agent or account.", -1)
      ])])) : (a(), s("div", $a, [
        e("div", xa, [
          I(o(J), { icon: "tabler:terminal-2" })
        ]),
        c[11] || (c[11] = e("div", { class: "kx-empty-title" }, "No tasks yet", -1)),
        e("div", wa, r(X.value ? "Give a coding agent a task and follow its progress here." : "Add an account to give your coding agent a place to start."), 1),
        I(o(Ce), {
          label: X.value ? "New task" : "Add account",
          onClick: c[3] || (c[3] = (v) => X.value ? A.value = !0 : U("goto"))
        }, {
          icon: fe(() => [
            I(o(J), { icon: "tabler:plus" })
          ]),
          _: 1
        }, 8, ["label"])
      ])),
      H.value.length ? (a(), s("ul", Ua, [
        (a(!0), s(W, null, Y(H.value, (v) => (a(), s("li", {
          key: v.id,
          class: "ac-run"
        }, [
          e("button", {
            type: "button",
            class: "ac-run-main kx-focus-halo",
            onClick: (M) => U("open", v.id)
          }, [
            e("span", Ra, [
              e("span", Ia, [
                e("span", La, r(v.prompt_summary.split(`
`)[0]), 1),
                e("span", {
                  class: re(["kx-tag-sm ac-tone", v.status])
                }, r(v.status), 3),
                v.workflow ? (a(), s("span", Ta, "Workflow")) : m("", !0)
              ]),
              e("span", Aa, [
                e("span", null, [
                  I(o(J), {
                    icon: o(Ee)(v.agent, o(b).agents)
                  }, null, 8, ["icon"]),
                  N(r(S(v.agent)), 1)
                ]),
                e("span", null, r(l(v.account_id)), 1),
                e("span", null, r(f(v.image_id)), 1),
                e("span", {
                  title: o($e)(v.started_at || v.created_at)
                }, r(o(Se)(v.started_at || v.created_at, o(D))), 9, Ea),
                v.started_at ? (a(), s("span", Sa, r(o(qe)(v, o(D))) + " " + r(v.status === "running" ? "elapsed" : "duration"), 1)) : m("", !0)
              ])
            ]),
            I(o(J), {
              icon: "tabler:chevron-right",
              class: "ac-run-chevron ac-muted"
            })
          ], 8, Va)
        ]))), 128))
      ])) : m("", !0),
      $.value ? (a(), s("div", qa, [
        I(o(Ce), {
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
        default: fe(() => [
          I(It, {
            onBusy: c[4] || (c[4] = (v) => h.value = v),
            accounts: V.value,
            images: L.value,
            workspaces: O.value,
            onStarted: P,
            onCancel: c[5] || (c[5] = (v) => A.value = !1),
            onAgentChanged: c[6] || (c[6] = (v) => U("agentChanged", v)),
            onGoto: c[7] || (c[7] = (v, M) => U("goto", M))
          }, null, 8, ["accounts", "images", "workspaces"])
        ]),
        _: 1
      }, 8, ["busy"])) : m("", !0)
    ])) : (a(), s("div", _a, [
      x.value ? (a(), s(W, { key: 0 }, [
        N(r(x.value) + " ", 1),
        e("button", {
          class: "ac-link kx-focus-outline",
          type: "button",
          onClick: c[1] || (c[1] = //@ts-ignore
          (...v) => o(_) && o(_)(...v))
        }, "Retry")
      ], 64)) : (a(), s(W, { key: 1 }, [
        I(o(J), {
          icon: "tabler:loader-2",
          class: "spin"
        }),
        c[10] || (c[10] = N(" Loading tasks…", -1))
      ], 64))
    ]));
  }
}), Na = ["aria-busy"], Oa = {
  key: 0,
  class: "kx-empty",
  role: "status"
}, Da = {
  key: 1,
  class: "kx-err",
  role: "alert"
}, Ma = {
  key: 2,
  class: "kx-empty"
}, Wa = {
  key: 3,
  class: "kx-empty"
}, Ja = {
  key: 4,
  class: "ac-list"
}, Ba = { class: "ac-account-main" }, Ha = { class: "ac-row-title" }, ja = { class: "ac-row-name" }, Ga = { class: "ac-muted" }, Fa = {
  key: 0,
  class: "ac-muted ac-mono"
}, za = { class: "ac-row-actions" }, Ka = ["onClick"], Qa = ["onClick"], Xa = ["onClick"], Ya = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, Za = ["disabled"], el = { class: "ac-field" }, tl = { class: "ac-field" }, al = ["value"], ll = { class: "ac-field" }, ol = ["value"], sl = {
  key: 0,
  class: "ac-field"
}, nl = ["value"], ul = { class: "ac-field" }, il = ["value"], rl = { class: "ac-field" }, cl = ["value"], dl = { class: "ac-field" }, vl = ["value"], pl = { class: "ac-field" }, fl = { class: "ac-field" }, kl = { class: "ac-field" }, ml = { class: "ac-field" }, yl = { class: "ac-field" }, gl = {
  key: 2,
  class: "ac-check"
}, _l = ["checked"], bl = { class: "ac-dialog-foot" }, hl = ["disabled"], $l = /* @__PURE__ */ ke({
  __name: "profiles",
  props: {
    query: {}
  },
  emits: ["count"],
  setup(ee, { expose: B, emit: Z }) {
    const u = Pe(), C = ee, F = Z, U = ye(), b = d([]), A = d([]), h = d([]), V = d([]), L = d([]), O = d(""), w = d(""), $ = d(!0), R = d(!1), x = d(0), D = d(!1), T = d(null), p = d(null), z = d(""), E = d(""), _ = d(""), g = j(() => U.value.agents.find((f) => f.id === p.value?.agent)), K = j(() => b.value.filter((f) => `${f.title} ${f.agent}`.toLowerCase().includes(C.query.toLowerCase()))), Q = xe(async () => {
      try {
        await Oe(
          () => Promise.all([G.profiles(), G.accounts(), G.images(), G.workspaces()]),
          ([f, l, t, c]) => [...f.map((v) => v.id), ...l.map((v) => v.id), ...t.map((v) => v.id), ...c.workspaces.map((v) => v.id)],
          A,
          u,
          ([f, l, t, c]) => {
            b.value = f, h.value = l, V.value = t, L.value = c.workspaces, F("count", f.length), O.value = "";
          },
          () => {
            Q();
          }
        );
      } catch (f) {
        u() && (O.value = se(f, "Could not load profiles."));
      } finally {
        u() && ($.value = !1);
      }
    }, u);
    Ne(() => A.value, Q), be(Q);
    function P(f, l = !1) {
      T.value = f && !l ? f.id : null, p.value = f ? {
        title: f.title + (l ? " copy" : ""),
        agent: f.agent,
        account_id: f.account_id ?? "",
        account_pool: [...f.account_pool ?? []],
        image_id: f.image_id,
        workspace_id: f.workspace_id ?? "",
        tools: f.tools ? JSON.parse(JSON.stringify(f.tools)) : void 0,
        repo_url: f.repo_url,
        repo_ref: f.repo_ref,
        run_timeout: f.run_timeout,
        options: JSON.parse(JSON.stringify(f.options)),
        unattended: f.unattended
      } : { title: "", agent: U.value.agents[0]?.id ?? "", image_id: "", options: {}, account_pool: [], account_id: "", workspace_id: "" }, z.value = f?.endpoint?.protocol ?? g.value?.endpoints[0] ?? "", E.value = f?.endpoint?.base_url ?? "", _.value = f?.endpoint?.model ?? "", x.value = 0, w.value = "";
    }
    function X() {
      p.value && (p.value.account_id = "", p.value.account_pool = [], p.value.options = {}, z.value = g.value?.endpoints[0] ?? "", E.value = "", _.value = "");
    }
    async function H() {
      if (!(!p.value || R.value || x.value || D.value)) {
        R.value = !0, w.value = "";
        try {
          const f = { ...p.value, account_pool: p.value.account_id ? [] : p.value.account_pool };
          if (g.value?.endpoints.length ? f.endpoint = { protocol: z.value, base_url: E.value.trim(), model: _.value.trim() || void 0 } : T.value && b.value.some((l) => l.id === T.value && l.endpoint?.base_url) && (f.endpoint = { protocol: "", base_url: "" }), T.value ? await G.updateProfile(T.value, f) : await G.createProfile(f), !u()) return;
          p.value = null, await Q();
        } catch (f) {
          u() && (w.value = se(f, "Could not save the profile."));
        } finally {
          u() && (R.value = !1);
        }
      }
    }
    async function S(f) {
      if (await he.confirm({ header: "Delete profile", message: `Delete ${f.title}?`, acceptLabel: "Delete" }))
        try {
          await G.deleteProfile(f.id), await Q();
        } catch (l) {
          u() && (O.value = se(l, "Could not delete the profile."));
        }
    }
    return B({ open: P }), (f, l) => (a(), s("section", { "aria-busy": $.value }, [
      $.value ? (a(), s("p", Oa, "Loading profiles…")) : O.value ? (a(), s("div", Da, [
        N(r(O.value) + " ", 1),
        e("button", {
          type: "button",
          class: "ac-btn kx-focus-halo",
          "aria-label": "Retry profiles",
          onClick: l[0] || (l[0] = //@ts-ignore
          (...t) => o(Q) && o(Q)(...t))
        }, "Retry")
      ])) : b.value.length ? K.value.length ? (a(), s("ul", Ja, [
        (a(!0), s(W, null, Y(K.value, (t) => (a(), s("li", {
          key: t.id,
          class: "ac-row ac-account ac-hover-actions"
        }, [
          e("div", Ba, [
            e("div", Ha, [
              I(o(J), { icon: "tabler:robot" }),
              e("span", ja, r(t.title), 1)
            ]),
            e("p", Ga, r(o(U).agents.find((c) => c.id === t.agent)?.title ?? t.agent) + " · " + r(t.endpoint?.model ?? t.options.model ?? "CLI default model"), 1),
            t.endpoint ? (a(), s("p", Fa, r(t.endpoint.base_url), 1)) : m("", !0)
          ]),
          e("div", za, [
            e("button", {
              type: "button",
              class: "ac-icon-btn kx-focus-outline",
              "aria-label": "Duplicate profile",
              onClick: (c) => P(t, !0)
            }, [
              I(o(J), { icon: "tabler:copy" })
            ], 8, Ka),
            t.writable ? (a(), s("button", {
              key: 0,
              type: "button",
              class: "ac-icon-btn kx-focus-outline",
              "aria-label": "Edit profile",
              onClick: (c) => P(t)
            }, [
              I(o(J), { icon: "tabler:pencil" })
            ], 8, Qa)) : m("", !0),
            t.deletable ? (a(), s("button", {
              key: 1,
              type: "button",
              class: "ac-icon-btn kx-focus-outline",
              "aria-label": "Delete profile",
              onClick: (c) => S(t)
            }, [
              I(o(J), { icon: "tabler:trash" })
            ], 8, Xa)) : m("", !0)
          ])
        ]))), 128))
      ])) : (a(), s("p", Wa, "No matches.")) : (a(), s("p", Ma, "Create a profile to reuse agent and task settings.")),
      p.value ? (a(), oe(Ie, {
        key: 5,
        title: T.value ? "Edit profile" : "Create profile",
        busy: R.value,
        onClose: l[19] || (l[19] = (t) => p.value = null)
      }, {
        default: fe(() => [
          e("form", {
            class: "ac-form",
            onSubmit: Re(H, ["prevent"])
          }, [
            w.value ? (a(), s("p", Ya, r(w.value), 1)) : m("", !0),
            e("fieldset", {
              class: "ac-form",
              disabled: R.value
            }, [
              e("label", el, [
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
              e("label", tl, [
                l[21] || (l[21] = e("span", null, "Agent", -1)),
                q(e("select", {
                  "onUpdate:modelValue": l[2] || (l[2] = (t) => p.value.agent = t),
                  class: "kx-focus-halo",
                  onChange: X
                }, [
                  (a(!0), s(W, null, Y(o(U).agents, (t) => (a(), s("option", {
                    key: t.id,
                    value: t.id
                  }, r(t.title), 9, al))), 128))
                ], 544), [
                  [le, p.value.agent]
                ])
              ]),
              e("label", ll, [
                l[23] || (l[23] = e("span", null, "Account", -1)),
                q(e("select", {
                  "onUpdate:modelValue": l[3] || (l[3] = (t) => p.value.account_id = t),
                  class: "kx-focus-halo"
                }, [
                  l[22] || (l[22] = e("option", { value: "" }, "Auto balance", -1)),
                  (a(!0), s(W, null, Y(h.value.filter((t) => t.agent === p.value?.agent), (t) => (a(), s("option", {
                    key: t.id,
                    value: t.id
                  }, r(t.label), 9, ol))), 128))
                ], 512), [
                  [le, p.value.account_id]
                ])
              ]),
              p.value.account_id ? m("", !0) : (a(), s("label", sl, [
                l[24] || (l[24] = e("span", null, "Account pool (empty uses all usable accounts)", -1)),
                q(e("select", {
                  "onUpdate:modelValue": l[4] || (l[4] = (t) => p.value.account_pool = t),
                  multiple: "",
                  class: "kx-focus-halo"
                }, [
                  (a(!0), s(W, null, Y(h.value.filter((t) => t.agent === p.value?.agent), (t) => (a(), s("option", {
                    key: t.id,
                    value: t.id
                  }, r(t.label), 9, nl))), 128))
                ], 512), [
                  [le, p.value.account_pool]
                ])
              ])),
              e("label", ul, [
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
                  }, r(t.label), 9, il))), 128))
                ], 512), [
                  [le, p.value.image_id]
                ])
              ]),
              e("label", rl, [
                l[28] || (l[28] = e("span", null, "Workspace", -1)),
                q(e("select", {
                  "onUpdate:modelValue": l[6] || (l[6] = (t) => p.value.workspace_id = t),
                  class: "kx-focus-halo"
                }, [
                  l[27] || (l[27] = e("option", { value: "" }, "Scratch directory", -1)),
                  (a(!0), s(W, null, Y(L.value, (t) => (a(), s("option", {
                    key: t.id,
                    value: t.id
                  }, r(t.name), 9, cl))), 128))
                ], 512), [
                  [le, p.value.workspace_id]
                ])
              ]),
              g.value?.endpoints.length ? (a(), s(W, { key: 1 }, [
                e("label", dl, [
                  l[29] || (l[29] = e("span", null, "Endpoint protocol", -1)),
                  q(e("select", {
                    "onUpdate:modelValue": l[7] || (l[7] = (t) => z.value = t),
                    class: "kx-focus-halo"
                  }, [
                    (a(!0), s(W, null, Y(g.value.endpoints, (t) => (a(), s("option", {
                      key: t,
                      value: t
                    }, r(t), 9, vl))), 128))
                  ], 512), [
                    [le, z.value]
                  ])
                ]),
                e("label", pl, [
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
              e("label", kl, [
                l[32] || (l[32] = e("span", null, "Repository URL", -1)),
                q(e("input", {
                  "onUpdate:modelValue": l[10] || (l[10] = (t) => p.value.repo_url = t),
                  class: "kx-focus-halo",
                  maxlength: "2000"
                }, null, 512), [
                  [ae, p.value.repo_url]
                ])
              ]),
              e("label", ml, [
                l[33] || (l[33] = e("span", null, "Repository ref", -1)),
                q(e("input", {
                  "onUpdate:modelValue": l[11] || (l[11] = (t) => p.value.repo_ref = t),
                  class: "kx-focus-halo",
                  maxlength: "200"
                }, null, 512), [
                  [ae, p.value.repo_ref]
                ])
              ]),
              e("label", yl, [
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
              g.value?.unattended ? (a(), s("label", gl, [
                e("input", {
                  checked: p.value.unattended !== !1,
                  onChange: l[13] || (l[13] = (t) => p.value.unattended = t.target.checked),
                  type: "checkbox",
                  class: "kx-focus-outline"
                }, null, 40, _l),
                l[35] || (l[35] = N("Unattended · skip permission prompts when the image allows it", -1))
              ])) : m("", !0),
              I(De, {
                modelValue: p.value.tools,
                "onUpdate:modelValue": l[14] || (l[14] = (t) => p.value.tools = t),
                agent: p.value.agent,
                onInvalid: l[15] || (l[15] = (t) => D.value = t)
              }, null, 8, ["modelValue", "agent"]),
              g.value ? (a(), oe(Me, {
                key: g.value.id,
                modelValue: p.value.options,
                "onUpdate:modelValue": l[16] || (l[16] = (t) => p.value.options = t),
                options: g.value.options,
                defaults: p.value.unattended !== !1 ? g.value.unattended : {},
                onInvalid: l[17] || (l[17] = (t) => x.value = t)
              }, null, 8, ["modelValue", "options", "defaults"])) : m("", !0),
              e("footer", bl, [
                e("button", {
                  type: "button",
                  class: "ac-btn kx-focus-halo",
                  onClick: l[18] || (l[18] = (t) => p.value = null)
                }, "Cancel"),
                e("button", {
                  type: "submit",
                  class: "ac-btn primary kx-focus-halo",
                  disabled: R.value || !!x.value || D.value
                }, "Save", 8, hl)
              ])
            ], 8, Za)
          ], 32)
        ]),
        _: 1
      }, 8, ["title", "busy"])) : m("", !0)
    ], 8, Na));
  }
}), xl = { class: "ac" }, wl = {
  key: 1,
  class: "ac-bar"
}, Cl = {
  class: "ac-tabs",
  "aria-label": "Autocode views"
}, Ul = ["aria-pressed", "onClick"], Vl = ["href"], Rl = {
  key: 2,
  class: "kx-err"
}, Il = {
  key: 3,
  class: "kx-loading"
}, Ll = {
  key: 0,
  class: "kx-empty"
}, Tl = /* @__PURE__ */ ke({
  __name: "autocode",
  setup(ee) {
    const B = Je(), Z = Be(), u = d(null);
    me(() => B.value?.route, () => {
      u.value = null;
    });
    const C = j(() => u.value ?? B.value?.route ?? ""), F = j(() => {
      const E = /^\/?runs\/([^/]+)\/?$/.exec(C.value);
      try {
        return E ? decodeURIComponent(E[1]) : "";
      } catch {
        return "";
      }
    }), U = j(() => !!C.value && C.value !== "/" && !F.value);
    function b(E) {
      h.value = "tasks", u.value = E, Z("navigate", { path: E });
    }
    const A = [
      { id: "tasks", label: "Tasks", icon: "tabler:player-play" },
      { id: "profiles", label: "Profiles", icon: "tabler:robot" },
      { id: "accounts", label: "Accounts", icon: "tabler:key" }
    ], h = d("tasks"), { catalog: V, error: L, load: O } = ze(), w = d(""), $ = d(0), R = d(null), x = d(null), D = d(null), T = d("");
    async function p(E) {
      E && (T.value = E), h.value = "accounts", w.value = "", await Ve(), D.value?.open();
    }
    function z() {
      h.value === "tasks" ? R.value?.open() : h.value === "profiles" ? x.value?.open() : D.value?.open();
    }
    return (E, _) => (a(), s("div", xl, [
      !F.value && !U.value ? (a(), oe(Qe, {
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
      !F.value && !U.value ? (a(), s("div", wl, [
        e("nav", Cl, [
          (a(), s(W, null, Y(A, (g) => e("button", {
            key: g.id,
            type: "button",
            class: re(["ac-tab kx-focus-outline", { active: h.value === g.id }]),
            "aria-pressed": h.value === g.id,
            onClick: (K) => {
              h.value !== g.id && (h.value = g.id, w.value = "", $.value = 0);
            }
          }, [
            I(o(J), {
              icon: g.icon
            }, null, 8, ["icon"]),
            N(" " + r(g.label), 1)
          ], 10, Ul)), 64))
        ]),
        o(V)?.settings_path && (o(V).can_images || o(V).can_workspaces || o(V).can_prune) ? (a(), s("a", {
          key: 0,
          class: "ac-link kx-focus-outline",
          href: o(V).settings_path,
          onClick: _[1] || (_[1] = Re((g) => o(he).navigate(o(V).settings_path), ["prevent"]))
        }, "Images, workspaces and Docker", 8, Vl)) : m("", !0)
      ])) : m("", !0),
      o(L) && !o(V) ? (a(), s("p", Rl, [
        N(r(o(L)) + " ", 1),
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
        U.value ? (a(), s("div", Ll, [
          _[11] || (_[11] = e("h1", null, "Run not found", -1)),
          e("button", {
            type: "button",
            class: "ac-btn kx-focus-halo",
            onClick: _[3] || (_[3] = (g) => b(""))
          }, "Back to tasks")
        ])) : F.value || h.value === "tasks" ? (a(), oe(Pa, {
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
        }, null, 8, ["query", "run-id"])) : h.value === "profiles" ? (a(), oe($l, {
          key: 2,
          ref_key: "profiles",
          ref: x,
          query: w.value,
          onCount: _[8] || (_[8] = (g) => $.value = g)
        }, null, 8, ["query"])) : (a(), oe(Ke, {
          key: 3,
          ref_key: "accounts",
          ref: D,
          query: w.value,
          "selected-agent": T.value,
          onCount: _[9] || (_[9] = (g) => $.value = g)
        }, null, 8, ["query", "selected-agent"]))
      ], 2)) : (a(), s("div", Il, [
        I(o(J), {
          icon: "tabler:loader-2",
          class: "spin"
        }),
        _[10] || (_[10] = N(" Loading…", -1))
      ]))
    ]));
  }
}), Ml = {
  rootComponent: Tl,
  plugins: [He]
};
export {
  Ml as mountConfig
};
