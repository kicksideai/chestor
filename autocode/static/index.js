import { u as fe, c as ye, _ as Re, d as De, e as Te, B as Me, f as je, a as We, b as ze, s as He, P as Ge } from "./styles-K-SJETe9.js";
import { u as we, a as Je, b as Ke, W as Qe } from "./dto-CcYNmUR0.js";
import { defineComponent as se, openBlock as n, createElementBlock as u, Fragment as Y, renderList as te, normalizeClass as ee, createVNode as R, unref as i, createTextVNode as O, toDisplayString as d, ref as v, computed as J, watch as ue, createElementVNode as a, withDirectives as ne, vModelText as re, createCommentVNode as p, isRef as ce, vModelSelect as be, vModelCheckbox as Xe, createBlock as ae, onMounted as Le, onUnmounted as ge, nextTick as ve, withCtx as he, mergeProps as pe, renderSlot as Ye, withKeys as Ae, withModifiers as Se } from "vue";
import { Icon as q } from "@iconify/vue";
import { b as me, d as $e, f as de, a as W, e as le, g as ke, l as _e, r as xe, h as Ee, t as Ze, s as Ce, A as et, c as Ne, u as Ie, p as tt } from "./presentation-BDm-VNGA.js";
import { d as at, u as nt, _ as lt } from "./driver-options.vue_vue_type_script_setup_true_lang-CqZ_tcnn.js";
import { config as ot, loadByTagName as st, host as it, define as ut } from "@wippy-fe/proxy";
import { a as ct } from "./driver-account-types-Bir4q_IM.js";
const rt = {
  key: 0,
  class: "ac-chips",
  role: "group",
  "aria-label": "Agent"
}, dt = ["disabled", "aria-pressed", "onClick"], vt = ["disabled", "value"], pt = ["value"], Pe = /* @__PURE__ */ se({
  __name: "agent-picker",
  props: {
    agents: {},
    modelValue: {},
    disabled: { type: Boolean }
  },
  emits: ["update:modelValue"],
  setup(o) {
    return (s, r) => o.agents.length <= 6 ? (n(), u("div", rt, [
      (n(!0), u(Y, null, te(o.agents, (e) => (n(), u("button", {
        key: e.id,
        disabled: o.disabled,
        type: "button",
        class: ee(["ac-chip kx-focus-halo", { active: o.modelValue === e.id }]),
        "aria-pressed": o.modelValue === e.id,
        onClick: (b) => s.$emit("update:modelValue", e.id)
      }, [
        R(i(q), {
          icon: i(me)(e.id, o.agents),
          "aria-hidden": "true"
        }, null, 8, ["icon"]),
        O(d(e.title), 1)
      ], 10, dt))), 128))
    ])) : (n(), u("select", {
      key: 1,
      disabled: o.disabled,
      class: "kx-focus-halo",
      "aria-label": "Agent",
      value: o.modelValue,
      onChange: r[0] || (r[0] = (e) => s.$emit("update:modelValue", e.target.value))
    }, [
      (n(!0), u(Y, null, te(o.agents, (e) => (n(), u("option", {
        key: e.id,
        value: e.id
      }, d(e.title), 9, pt))), 128))
    ], 40, vt));
  }
}), gt = ["disabled"], ht = { class: "ac-field ac-composer" }, ft = { class: "ac-field" }, mt = {
  key: 0,
  class: "ac-muted"
}, kt = {
  key: 1,
  class: "ac-muted"
}, bt = { class: "ac-picker-row" }, yt = { class: "ac-field" }, wt = { value: "" }, $t = ["value"], _t = { class: "ac-field" }, xt = ["value"], Ct = { class: "ac-field" }, Vt = ["value"], Ft = { class: "ac-advanced" }, Tt = { class: "ac-form" }, At = { class: "ac-field" }, St = { class: "ac-field" }, Rt = { class: "ac-field" }, Lt = {
  key: 0,
  class: "ac-check"
}, Et = {
  key: 2,
  class: "kx-err",
  role: "alert"
}, Nt = { class: "ac-dialog-foot" }, It = ["disabled"], Pt = /* @__PURE__ */ se({
  __name: "task-form",
  props: {
    accounts: {},
    images: {},
    workspaces: {}
  },
  emits: ["started", "goto", "agentChanged", "cancel", "busy"],
  setup(o, { emit: s }) {
    const r = o, e = s, b = fe(), f = v(null);
    function L() {
      const c = b.value.settings_path;
      c && f.value?.dispatchEvent(new CustomEvent("navigate", { detail: { path: c }, bubbles: !0, composed: !0 }));
    }
    const x = v({ agent: at(b.value, r.accounts), account_id: "", image_id: "", workspace_id: "", repo_url: "" }), { now: $, driver: w, agentAccounts: B, ready: A, agentImages: M, invalidOptions: F, optionValues: C, normalizeConfig: V, selectAgent: E } = nt(x, {
      catalog: () => b.value,
      accounts: () => r.accounts,
      images: () => r.images,
      workspaces: () => r.workspaces
    }, "live"), S = J({
      get: () => x.value.agent ?? "",
      set: (c) => {
        c !== x.value.agent && (x.value = E(c));
      }
    });
    function P(c) {
      return J({ get: () => x.value[c] ?? "", set: (l) => {
        x.value[c] = l;
      } });
    }
    const U = P("account_id"), N = P("image_id"), y = P("workspace_id"), k = P("repo_url"), G = P("repo_ref"), z = v(""), X = v(""), Z = J({ get: () => C.value, set: (c) => {
      x.value.options = c;
    } }), D = J({ get: () => x.value.unattended !== !1, set: (c) => {
      x.value.unattended = c;
    } }), K = v(!1), j = v("");
    function oe(c) {
      return $e(c, $.value) === "cooling" ? `${c.label} (cooling down until ${de(c.cooldown_until)})` : c.label;
    }
    ue(S, (c) => e("agentChanged", c), { immediate: !0 });
    let Q;
    ue([S, U, N, y, k, G, z, X, Z, D], () => {
      Q = void 0;
    }, { deep: !0, flush: "sync" });
    async function m() {
      if (!K.value) {
        j.value = "", K.value = !0, e("busy", !0);
        try {
          const c = {
            agent: S.value,
            account_id: U.value,
            image_id: N.value,
            workspace_id: y.value,
            repo_url: k.value,
            repo_ref: G.value.trim() || void 0,
            timeout: z.value.trim() || void 0,
            prompt: X.value,
            options: V(x.value).options ?? {},
            unattended: D.value
          }, l = JSON.stringify(c);
          (!Q || Q.snapshot !== l) && (Q = { snapshot: l, key: crypto.randomUUID(), body: { ...c, options: JSON.parse(JSON.stringify(c.options)) } });
          const { run_id: t } = await W.startRun({ ...Q.body, idempotency_key: Q.key });
          Q = void 0, X.value = "", e("started", t);
        } catch (c) {
          j.value = le(c, "Could not start the task.");
        } finally {
          K.value = !1, e("busy", !1);
        }
      }
    }
    return (c, l) => (n(), u("fieldset", {
      ref_key: "root",
      ref: f,
      class: "ac-form ac-new",
      disabled: K.value
    }, [
      a("label", ht, [
        l[13] || (l[13] = a("span", null, "Prompt", -1)),
        ne(a("textarea", {
          "onUpdate:modelValue": l[0] || (l[0] = (t) => X.value = t),
          autofocus: "",
          rows: "8",
          class: "kx-focus-halo",
          placeholder: "What should the agent do?"
        }, null, 512), [
          [re, X.value]
        ])
      ]),
      a("div", ft, [
        l[14] || (l[14] = a("span", null, "Agent", -1)),
        R(Pe, {
          modelValue: S.value,
          "onUpdate:modelValue": l[1] || (l[1] = (t) => S.value = t),
          agents: i(b).agents
        }, null, 8, ["modelValue", "agents"])
      ]),
      S.value && !i(B).length ? (n(), u("p", mt, [
        O(" No " + d(i(w)?.title) + " accounts you can run on. ", 1),
        a("button", {
          class: "ac-link kx-focus-outline",
          type: "button",
          onClick: l[2] || (l[2] = (t) => e("goto", "accounts", S.value))
        }, "Add an account")
      ])) : p("", !0),
      i(M).length ? p("", !0) : (n(), u("p", kt, [
        O(" No image with " + d(i(w)?.title ?? S.value) + "; ask an administrator. ", 1),
        i(b).can_images && i(b).settings_path ? (n(), u("button", {
          key: 0,
          class: "ac-link kx-focus-outline",
          type: "button",
          onClick: L
        }, "Manage images")) : p("", !0)
      ])),
      a("div", bt, [
        a("label", yt, [
          l[15] || (l[15] = a("span", null, "Account", -1)),
          ne(a("select", {
            "onUpdate:modelValue": l[3] || (l[3] = (t) => ce(U) ? U.value = t : null),
            class: "kx-focus-halo"
          }, [
            a("option", wt, "Auto (" + d(i(A).length) + " ready)", 1),
            (n(!0), u(Y, null, te(i(B), (t) => (n(), u("option", {
              key: t.id,
              value: t.id
            }, d(oe(t)), 9, $t))), 128))
          ], 512), [
            [be, i(U)]
          ])
        ]),
        a("label", _t, [
          l[16] || (l[16] = a("span", null, "Image", -1)),
          ne(a("select", {
            "onUpdate:modelValue": l[4] || (l[4] = (t) => ce(N) ? N.value = t : null),
            class: "kx-focus-halo"
          }, [
            (n(!0), u(Y, null, te(i(M), (t) => (n(), u("option", {
              key: t.id,
              value: t.id
            }, d(t.label), 9, xt))), 128))
          ], 512), [
            [be, i(N)]
          ])
        ]),
        a("label", Ct, [
          l[18] || (l[18] = a("span", null, "Workspace", -1)),
          ne(a("select", {
            "onUpdate:modelValue": l[5] || (l[5] = (t) => ce(y) ? y.value = t : null),
            class: "kx-focus-halo"
          }, [
            l[17] || (l[17] = a("option", { value: "" }, "Scratch directory", -1)),
            (n(!0), u(Y, null, te(o.workspaces, (t) => (n(), u("option", {
              key: t.id,
              value: t.id
            }, d(t.name) + d(t.writable ? "" : " (read-only)"), 9, Vt))), 128))
          ], 512), [
            [be, i(y)]
          ])
        ])
      ]),
      a("details", Ft, [
        l[23] || (l[23] = a("summary", { class: "kx-focus-outline" }, "Advanced", -1)),
        a("div", Tt, [
          a("label", At, [
            l[19] || (l[19] = a("span", null, "Git repository", -1)),
            ne(a("input", {
              "onUpdate:modelValue": l[6] || (l[6] = (t) => ce(k) ? k.value = t : null),
              class: "ac-mono kx-focus-halo",
              placeholder: "Optional: https://github.com/org/repo.git"
            }, null, 512), [
              [re, i(k)]
            ])
          ]),
          a("label", St, [
            l[20] || (l[20] = a("span", null, "Repository ref", -1)),
            ne(a("input", {
              "onUpdate:modelValue": l[7] || (l[7] = (t) => ce(G) ? G.value = t : null),
              "aria-label": "Repository ref",
              class: "ac-mono kx-focus-halo",
              placeholder: "Default branch"
            }, null, 512), [
              [re, i(G)]
            ])
          ]),
          a("label", Rt, [
            l[21] || (l[21] = a("span", null, "Run timeout", -1)),
            ne(a("input", {
              "onUpdate:modelValue": l[8] || (l[8] = (t) => z.value = t),
              maxlength: "64",
              class: "ac-mono kx-focus-halo",
              placeholder: "Use configured timeout"
            }, null, 512), [
              [re, z.value]
            ])
          ]),
          i(w)?.unattended ? (n(), u("label", Lt, [
            ne(a("input", {
              "onUpdate:modelValue": l[9] || (l[9] = (t) => D.value = t),
              type: "checkbox",
              class: "kx-focus-outline"
            }, null, 512), [
              [Xe, D.value]
            ]),
            l[22] || (l[22] = O(" Unattended · skip permission prompts when the image allows it ", -1))
          ])) : p("", !0),
          i(w) ? (n(), ae(lt, {
            key: i(w).id,
            modelValue: Z.value,
            "onUpdate:modelValue": l[10] || (l[10] = (t) => Z.value = t),
            options: i(w).options,
            locked: D.value && i(w).unattended ? i(w).unattended : {},
            onInvalid: l[11] || (l[11] = (t) => F.value = t)
          }, null, 8, ["modelValue", "options", "locked"])) : p("", !0)
        ])
      ]),
      j.value ? (n(), u("p", Et, d(j.value), 1)) : p("", !0),
      a("footer", Nt, [
        a("button", {
          type: "button",
          class: "ac-btn kx-focus-halo",
          onClick: l[12] || (l[12] = (t) => e("cancel"))
        }, "Cancel"),
        a("button", {
          type: "button",
          class: "ac-btn primary kx-focus-halo",
          disabled: K.value || i(F) > 0 || !S.value || !(i(U) || i(A).length) || !i(N) || !X.value.trim(),
          onClick: m
        }, [
          R(i(q), { icon: "tabler:player-play" }),
          O(" " + d(K.value ? "Starting…" : "Start"), 1)
        ], 8, It)
      ])
    ], 8, gt));
  }
}), Ut = {
  key: 0,
  class: "kx-empty",
  role: "status"
}, Bt = {
  key: 1,
  class: "kx-err",
  role: "alert"
}, Ot = {
  key: 2,
  class: "kx-loading"
}, qt = { class: "ac-detail-head" }, Dt = { class: "ac-card-head" }, Mt = ["disabled"], jt = { class: "ac-detail-title" }, Wt = { class: "ac-run-meta ac-detail-meta" }, zt = ["title"], Ht = { key: 0 }, Gt = { key: 1 }, Jt = { key: 2 }, Kt = { key: 3 }, Qt = { key: 4 }, Xt = { key: 5 }, Yt = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, Zt = {
  class: "ac-detail-section",
  "aria-labelledby": "ac-prompt-heading"
}, ea = { class: "ac-section-head" }, ta = ["aria-expanded"], aa = {
  key: 1,
  class: "ac-detail-section ac-result",
  "aria-labelledby": "ac-result-heading"
}, na = { class: "ac-section-head" }, la = { id: "ac-result-heading" }, oa = { class: "ac-row-actions" }, sa = ["aria-expanded"], ia = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, ua = {
  key: 2,
  class: "kx-err",
  role: "alert"
}, ca = {
  class: "ac-detail-section",
  "aria-labelledby": "ac-log-heading"
}, ra = { class: "ac-section-head" }, da = { class: "ac-muted" }, va = ["disabled"], pa = ["disabled"], ga = {
  class: "ac-stream",
  tabindex: "0",
  "aria-label": "Task log"
}, ha = { class: "ac-event-kind" }, fa = { class: "ac-event-text" }, ma = {
  key: 0,
  class: "ac-muted ac-pulse"
}, ka = {
  key: 1,
  class: "ac-muted"
}, ba = 500, ya = /* @__PURE__ */ se({
  __name: "run-detail",
  props: {
    runId: {},
    accounts: {},
    images: {},
    workspaces: {}
  },
  setup(o) {
    const s = o, r = fe(), e = v(null), b = v([]), f = v(0), L = v(!1), x = v(!1);
    let $;
    const w = v(!1), B = v(""), A = v(!1), M = v(null), F = v(!1), C = v("");
    let V = null;
    const E = v(!1), S = v(!1), P = v(!1), U = v(""), N = ke(), y = J(() => (e.value?.prompt.length ?? 0) > 500 || (e.value?.prompt.split(`
`).length ?? 0) > 5), k = J(() => (e.value?.result.length ?? 0) > 1800 || (e.value?.result.split(`
`).length ?? 0) > 10);
    let G = !0, z = !0, X, Z;
    const D = (_) => _.status === "queued" || _.status === "running";
    function K() {
      V && (z = V.scrollHeight - V.scrollTop - V.clientHeight < 40);
    }
    Le(() => {
      V = M.value?.closest(".ac") ?? null, V?.addEventListener("scroll", K, { passive: !0 });
    }), ge(() => {
      V?.removeEventListener("scroll", K), V = null;
    });
    const j = Ce(async () => {
      try {
        const _ = $ ?? (e.value ? void 0 : 0);
        $ = void 0;
        let h = await W.run(s.runId, _ === void 0 ? f.value : void 0, _);
        if (!G) return;
        if (_ === void 0 && (h.more || w.value && h.events.length)) {
          if (h = await W.run(s.runId, void 0, 0), !G) return;
          b.value = h.events, L.value = h.more, w.value = !1;
        } else if (_ !== void 0)
          b.value = h.events, L.value = h.more, w.value = _ !== 0;
        else if (h.events.length) {
          const H = Math.max(0, b.value.length + h.events.length - ba);
          H && b.value.splice(0, H), b.value.push(...h.events), L.value = L.value || H > 0;
        }
        A.value = !1, e.value = h.run, w.value || (f.value = h.next_seq), await ve(), G && z && V && V.scrollTo({ top: V.scrollHeight }), B.value = "";
      } catch (_) {
        if (!G) return;
        A.value = _ instanceof et && _.code === "autocode.run_not_found", A.value && (e.value = null, b.value = []), B.value = A.value ? "" : le(_, "Could not load the task.");
      } finally {
        x.value = !1;
      }
    });
    function oe() {
      x.value || !b.value.length || (z = !1, x.value = !0, $ = b.value[0].seq, j());
    }
    function Q() {
      x.value || (z = !0, x.value = !0, $ = 0, j());
    }
    const m = _e.run(s.runId, () => {
      j();
    });
    we(j), ge(() => {
      G = !1, m(), clearTimeout(Z), clearTimeout(X);
    });
    async function c() {
      try {
        await W.cancelRun(s.runId), await j();
      } catch (_) {
        B.value = le(_, "Could not cancel the task.");
      }
    }
    async function l(_) {
      try {
        await navigator.clipboard.writeText(_);
      } catch {
        const h = document.createElement("textarea"), H = M.value?.getRootNode(), Fe = H instanceof ShadowRoot || H instanceof Document ? H.activeElement : null, qe = Fe instanceof HTMLElement ? Fe : null;
        h.value = _, h.readOnly = !0, h.style.cssText = "position:fixed;opacity:0;pointer-events:none;", M.value?.append(h);
        try {
          if (h.select(), !document.execCommand("copy")) throw new Error("Copy failed");
        } finally {
          h.remove(), qe?.focus({ preventScroll: !0 });
        }
      }
    }
    async function t() {
      try {
        await l(e.value?.result ?? ""), P.value = !0, U.value = "", clearTimeout(Z), Z = setTimeout(() => {
          P.value = !1;
        }, 2e3);
      } catch {
        U.value = "Could not copy. Select the result text to copy it.";
      }
    }
    async function g() {
      try {
        const _ = new URL(ot.env.APP_API_URL || "/", window.location.href);
        await l(new URL(`/autocode/runs/${encodeURIComponent(s.runId)}`, _).href), F.value = !0, C.value = "", clearTimeout(X), X = setTimeout(() => {
          F.value = !1;
        }, 2e3);
      } catch {
        C.value = "Could not copy the link. Try again.";
      }
    }
    function I() {
      S.value = !S.value;
    }
    function T(_) {
      return typeof _.options?.model == "string" ? _.options.model : "";
    }
    function ie(_) {
      return s.accounts.find((h) => h.id === _)?.label ?? "Unlisted account";
    }
    function Be(_) {
      return s.workspaces.find((h) => h.id === _)?.name ?? "Unlisted workspace";
    }
    function Oe(_) {
      return s.images.find((h) => h.id === _)?.label ?? "Unlisted image";
    }
    function Ve(_) {
      const h = [];
      return _.usage.input_tokens !== void 0 && h.push(`${_.usage.input_tokens} input`), _.usage.output_tokens !== void 0 && h.push(`${_.usage.output_tokens} output`), _.usage.cached_tokens !== void 0 && h.push(`${_.usage.cached_tokens} cached`), h.length ? `${h.join(" · ")} tokens` : "";
    }
    return (_, h) => (n(), u("section", {
      ref_key: "detail",
      ref: M,
      class: "ac-form ac-detail"
    }, [
      A.value ? (n(), u("div", Ut, [...h[2] || (h[2] = [
        a("h1", null, "Run not found", -1),
        a("p", null, "This run does not exist or you do not have access to it.", -1)
      ])])) : p("", !0),
      B.value ? (n(), u("p", Bt, [
        O(d(B.value) + " ", 1),
        a("button", {
          type: "button",
          class: "ac-link kx-focus-outline",
          onClick: h[0] || (h[0] = //@ts-ignore
          (...H) => i(j) && i(j)(...H))
        }, "Retry")
      ])) : p("", !0),
      !e.value && !B.value && !A.value ? (n(), u("div", Ot, [
        R(i(q), {
          icon: "tabler:loader-2",
          class: "spin"
        }),
        h[3] || (h[3] = O(" Loading the task…", -1))
      ])) : e.value ? (n(), u(Y, { key: 3 }, [
        a("header", qt, [
          a("div", Dt, [
            a("span", {
              class: ee(["kx-tag-sm ac-tone", e.value.status])
            }, d(e.value.status), 3),
            a("button", {
              type: "button",
              class: "ac-btn kx-focus-halo",
              "aria-live": "polite",
              onClick: g
            }, [
              R(i(q), {
                icon: F.value ? "tabler:check" : "tabler:link"
              }, null, 8, ["icon"]),
              O(d(F.value ? "Link copied" : "Copy link"), 1)
            ]),
            D(e.value) ? (n(), u("button", {
              key: 0,
              type: "button",
              class: "ac-btn danger kx-focus-halo",
              disabled: e.value.cancel_requested,
              onClick: c
            }, [
              R(i(q), { icon: "tabler:player-stop" }),
              O(" " + d(e.value.cancel_requested ? "Cancelling…" : "Cancel"), 1)
            ], 8, Mt)) : p("", !0)
          ]),
          a("h1", jt, d(e.value.prompt.split(`
`)[0]), 1),
          a("div", Wt, [
            a("span", null, [
              R(i(q), {
                icon: i(me)(e.value.agent, i(r).agents)
              }, null, 8, ["icon"]),
              O(d(i(r).agents.find((H) => H.id === e.value?.agent)?.title ?? e.value.agent), 1)
            ]),
            a("span", null, d(ie(e.value.account_id)), 1),
            a("span", null, d(Oe(e.value.image_id)), 1),
            a("span", {
              title: i(de)(e.value.started_at || e.value.created_at)
            }, d(e.value.started_at ? "Started" : "Queued") + " " + d(i(xe)(e.value.started_at || e.value.created_at, i(N))), 9, zt),
            e.value.started_at ? (n(), u("span", Ht, d(i(Ee)(e.value, i(N))) + " " + d(D(e.value) ? "elapsed" : "duration"), 1)) : p("", !0),
            e.value.timeout_ms ? (n(), u("span", Gt, d(i(Ze)(e.value.timeout_ms)), 1)) : p("", !0),
            a("span", null, d(e.value.unattended ? "Unattended" : "Attended"), 1),
            e.value.workflow ? (n(), u("span", Jt, "Workflow")) : p("", !0),
            e.value.workspace_id ? (n(), u("span", Kt, d(Be(e.value.workspace_id)), 1)) : p("", !0),
            T(e.value) ? (n(), u("span", Qt, d(T(e.value)), 1)) : p("", !0),
            Ve(e.value) ? (n(), u("span", Xt, d(Ve(e.value)), 1)) : p("", !0)
          ])
        ]),
        C.value ? (n(), u("p", Yt, d(C.value), 1)) : p("", !0),
        a("section", Zt, [
          a("div", ea, [
            h[4] || (h[4] = a("h3", { id: "ac-prompt-heading" }, "Prompt", -1)),
            y.value ? (n(), u("button", {
              key: 0,
              type: "button",
              class: "ac-link kx-focus-outline",
              "aria-expanded": E.value,
              "aria-controls": "ac-prompt-text",
              onClick: h[1] || (h[1] = (H) => E.value = !E.value)
            }, d(E.value ? "Collapse prompt" : "Expand prompt"), 9, ta)) : p("", !0)
          ]),
          a("pre", {
            id: "ac-prompt-text",
            class: ee(["ac-pre ac-prompt", { expanded: E.value || !y.value }])
          }, [
            a("span", null, d(e.value.prompt), 1)
          ], 2)
        ]),
        e.value.result ? (n(), u("section", aa, [
          a("div", na, [
            a("h3", la, d(e.value.status === "succeeded" ? "Result" : "Partial result"), 1),
            a("div", oa, [
              k.value ? (n(), u("button", {
                key: 0,
                type: "button",
                class: "ac-link kx-focus-outline",
                "aria-expanded": S.value,
                "aria-controls": "ac-result-text",
                onClick: I
              }, d(S.value ? "Collapse result" : "Expand result"), 9, sa)) : p("", !0),
              a("button", {
                type: "button",
                class: "ac-btn kx-focus-halo",
                onClick: t
              }, [
                R(i(q), {
                  icon: P.value ? "tabler:check" : "tabler:copy"
                }, null, 8, ["icon"]),
                O(d(P.value ? "Copied" : "Copy"), 1)
              ])
            ])
          ]),
          U.value ? (n(), u("p", ia, d(U.value), 1)) : p("", !0),
          a("pre", {
            id: "ac-result-text",
            class: ee(["ac-pre ac-result-text", { expanded: S.value }]),
            tabindex: "0",
            "aria-label": "Result"
          }, d(e.value.result), 3)
        ])) : p("", !0),
        e.value.error ? (n(), u("p", ua, d(e.value.error), 1)) : p("", !0),
        a("section", ca, [
          a("div", ra, [
            h[5] || (h[5] = a("h3", { id: "ac-log-heading" }, "Log", -1)),
            a("span", da, d(b.value.length) + " events", 1)
          ]),
          L.value ? (n(), u("button", {
            key: 0,
            type: "button",
            class: "ac-link kx-focus-outline",
            disabled: x.value,
            onClick: oe
          }, d(x.value ? "Loading…" : "Load earlier"), 9, va)) : p("", !0),
          w.value ? (n(), u("button", {
            key: 1,
            type: "button",
            class: "ac-link kx-focus-outline",
            disabled: x.value,
            onClick: Q
          }, "Latest", 8, pa)) : p("", !0),
          a("div", ga, [
            (n(!0), u(Y, null, te(b.value, (H) => (n(), u("div", {
              key: H.seq,
              class: ee(["ac-event", H.kind])
            }, [
              a("span", ha, d(H.kind), 1),
              a("pre", fa, d(H.text), 1)
            ], 2))), 128)),
            D(e.value) ? (n(), u("div", ma, "Working…")) : b.value.length ? p("", !0) : (n(), u("div", ka, "No log events."))
          ])
        ])
      ], 64)) : p("", !0)
    ], 512));
  }
}), wa = {
  key: 0,
  "aria-label": "Task details"
}, $a = { class: "ac-detail-back" }, _a = {
  key: 1,
  class: "kx-loading"
}, xa = { key: 2 }, Ca = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, Va = {
  key: 1,
  class: "kx-empty"
}, Fa = { class: "kx-empty-ico" }, Ta = { class: "kx-empty-sub" }, Aa = {
  key: 2,
  class: "kx-empty"
}, Sa = {
  key: 3,
  class: "ac-run-list"
}, Ra = ["onClick"], La = { class: "ac-run-copy" }, Ea = { class: "ac-run-title-row" }, Na = { class: "ac-run-title" }, Ia = {
  key: 0,
  class: "kx-tag-sm ac-tone"
}, Pa = { class: "ac-run-meta" }, Ua = ["title"], Ba = { key: 0 }, Oa = {
  key: 4,
  class: "ac-load-more"
}, qa = /* @__PURE__ */ se({
  __name: "tasks",
  props: {
    query: {},
    runId: {}
  },
  emits: ["goto", "agentChanged", "count", "open", "close"],
  setup(o, { expose: s, emit: r }) {
    const e = Ne(), b = v([]), f = o, L = r, x = fe(), $ = v(!1), w = v(!1);
    s({ open: () => {
      $.value = !0;
    } });
    const B = v([]), A = v([]), M = v([]), F = v([]), C = v(), V = v(!1), E = v(""), S = ke(), P = v(!1);
    let U = 0, N = 1;
    async function y() {
      const m = [];
      let c;
      for (let l = 0; l < N; l++) {
        const t = await W.runs(c);
        if (!e() || (m.push(...t.runs), c = t.next_cursor, !c)) break;
      }
      return { runs: m, next_cursor: c };
    }
    const k = Ce(async () => {
      U++, P.value = !0;
      try {
        let [m, c, l, t] = await Promise.all([W.accounts(), W.images(), y(), W.workspaces()]);
        for (; e() && [...m, ...c, ...t.workspaces].some((g) => !b.value.includes(g.id)); ) {
          if (b.value = [...m, ...c, ...t.workspaces].map((g) => g.id), await ve(), !e()) return;
          [m, c, l, t] = await Promise.all([W.accounts(), W.images(), y(), W.workspaces()]);
        }
        if (!e()) return;
        b.value = [...m, ...c, ...t.workspaces].map((g) => g.id), B.value = m, A.value = c, F.value = l.runs, C.value = l.next_cursor, M.value = t.workspaces, V.value = !0, E.value = "";
      } catch (m) {
        e() && (E.value = le(m, "Could not load tasks."));
      } finally {
        e() && (P.value = !1);
      }
    }, e), G = _e.runs(() => {
      k();
    });
    Ie(() => b.value, () => {
      k();
    }), we(k), ge(G);
    const z = v(!1);
    async function X() {
      if (!(!C.value || z.value || P.value)) {
        z.value = !0;
        try {
          const m = U, c = await W.runs(C.value);
          if (!e() || U !== m) return;
          const l = new Set(F.value.map((t) => t.id));
          F.value.push(...c.runs.filter((t) => !l.has(t.id))), C.value = c.next_cursor, N++;
        } catch (m) {
          e() && (E.value = le(m, "Could not load more tasks."));
        } finally {
          e() && (z.value = !1);
        }
      }
    }
    function Z(m) {
      $.value = !1, L("open", m);
    }
    const D = J(() => B.value.some((m) => m.usable && m.enabled)), K = J(() => F.value.filter((m) => [m.prompt_summary, m.status, m.agent, j(m.agent), Q(m.account_id)].join(" ").toLowerCase().includes(f.query.trim().toLowerCase())));
    ue(() => F.value.length, (m) => L("count", m));
    function j(m) {
      return x.value.agents.find((c) => c.id === m)?.title ?? m;
    }
    function oe(m) {
      return A.value.find((c) => c.id === m)?.label ?? "Unlisted image";
    }
    function Q(m) {
      return B.value.find((c) => c.id === m)?.label ?? "Unlisted account";
    }
    return (m, c) => o.runId ? (n(), u("section", wa, [
      a("div", $a, [
        a("button", {
          type: "button",
          class: "ac-btn kx-focus-halo",
          onClick: c[0] || (c[0] = (l) => L("close"))
        }, [
          R(i(q), { icon: "tabler:arrow-left" }),
          c[9] || (c[9] = O(" Back to tasks", -1))
        ])
      ]),
      (n(), ae(ya, {
        key: o.runId,
        "run-id": o.runId,
        accounts: B.value,
        images: A.value,
        workspaces: M.value
      }, null, 8, ["run-id", "accounts", "images", "workspaces"]))
    ])) : V.value ? (n(), u("div", xa, [
      E.value ? (n(), u("p", Ca, [
        O(d(E.value) + " ", 1),
        a("button", {
          class: "ac-link kx-focus-outline",
          type: "button",
          onClick: c[2] || (c[2] = //@ts-ignore
          (...l) => i(k) && i(k)(...l))
        }, "Retry")
      ])) : p("", !0),
      F.value.length ? K.value.length ? p("", !0) : (n(), u("div", Aa, [...c[12] || (c[12] = [
        a("div", { class: "kx-empty-title" }, "No matches", -1),
        a("div", { class: "kx-empty-sub" }, "Try another task, agent or account.", -1)
      ])])) : (n(), u("div", Va, [
        a("div", Fa, [
          R(i(q), { icon: "tabler:terminal-2" })
        ]),
        c[11] || (c[11] = a("div", { class: "kx-empty-title" }, "No tasks yet", -1)),
        a("div", Ta, d(D.value ? "Give a coding agent a task and follow its progress here." : "Add an account to give your coding agent a place to start."), 1),
        R(i(ye), {
          label: D.value ? "New task" : "Add account",
          onClick: c[3] || (c[3] = (l) => D.value ? $.value = !0 : L("goto"))
        }, {
          icon: he(() => [
            R(i(q), { icon: "tabler:plus" })
          ]),
          _: 1
        }, 8, ["label"])
      ])),
      K.value.length ? (n(), u("ul", Sa, [
        (n(!0), u(Y, null, te(K.value, (l) => (n(), u("li", {
          key: l.id,
          class: "ac-run"
        }, [
          a("button", {
            type: "button",
            class: "ac-run-main kx-focus-halo",
            onClick: (t) => L("open", l.id)
          }, [
            a("span", La, [
              a("span", Ea, [
                a("span", Na, d(l.prompt_summary.split(`
`)[0]), 1),
                a("span", {
                  class: ee(["kx-tag-sm ac-tone", l.status])
                }, d(l.status), 3),
                l.workflow ? (n(), u("span", Ia, "Workflow")) : p("", !0)
              ]),
              a("span", Pa, [
                a("span", null, [
                  R(i(q), {
                    icon: i(me)(l.agent, i(x).agents)
                  }, null, 8, ["icon"]),
                  O(d(j(l.agent)), 1)
                ]),
                a("span", null, d(Q(l.account_id)), 1),
                a("span", null, d(oe(l.image_id)), 1),
                a("span", {
                  title: i(de)(l.started_at || l.created_at)
                }, d(i(xe)(l.started_at || l.created_at, i(S))), 9, Ua),
                l.started_at ? (n(), u("span", Ba, d(i(Ee)(l, i(S))) + " " + d(l.status === "running" ? "elapsed" : "duration"), 1)) : p("", !0)
              ])
            ]),
            R(i(q), {
              icon: "tabler:chevron-right",
              class: "ac-run-chevron ac-muted"
            })
          ], 8, Ra)
        ]))), 128))
      ])) : p("", !0),
      C.value ? (n(), u("div", Oa, [
        R(i(ye), {
          label: "Load more",
          loading: z.value,
          disabled: P.value,
          onClick: X
        }, null, 8, ["loading", "disabled"])
      ])) : p("", !0),
      $.value ? (n(), ae(Re, {
        key: 5,
        title: "New task",
        busy: w.value,
        wide: "",
        onClose: c[8] || (c[8] = (l) => $.value = !1)
      }, {
        default: he(() => [
          R(Pt, {
            onBusy: c[4] || (c[4] = (l) => w.value = l),
            accounts: B.value,
            images: A.value,
            workspaces: M.value,
            onStarted: Z,
            onCancel: c[5] || (c[5] = (l) => $.value = !1),
            onAgentChanged: c[6] || (c[6] = (l) => L("agentChanged", l)),
            onGoto: c[7] || (c[7] = (l, t) => L("goto", t))
          }, null, 8, ["accounts", "images", "workspaces"])
        ]),
        _: 1
      }, 8, ["busy"])) : p("", !0)
    ])) : (n(), u("div", _a, [
      E.value ? (n(), u(Y, { key: 0 }, [
        O(d(E.value) + " ", 1),
        a("button", {
          class: "ac-link kx-focus-outline",
          type: "button",
          onClick: c[1] || (c[1] = //@ts-ignore
          (...l) => i(k) && i(k)(...l))
        }, "Retry")
      ], 64)) : (n(), u(Y, { key: 1 }, [
        R(i(q), {
          icon: "tabler:loader-2",
          class: "spin"
        }),
        c[10] || (c[10] = O(" Loading tasks…", -1))
      ], 64))
    ]));
  }
});
var Da = {
  name: "BaseEditableHolder",
  extends: De,
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
        var r, e;
        this.formField = ((r = this.$pcForm) === null || r === void 0 || (e = r.register) === null || e === void 0 ? void 0 : e.call(r, s, this.$formControl)) || {};
      }
    },
    $formControl: {
      immediate: !0,
      handler: function(s) {
        var r, e;
        this.formField = ((r = this.$pcForm) === null || r === void 0 || (e = r.register) === null || e === void 0 ? void 0 : e.call(r, this.$formName, s)) || {};
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
        var r;
        (r = this.$pcForm) !== null && r !== void 0 && r.getFieldState(this.$formName) && s !== this.d_value && (this.d_value = s);
      }
    }
  },
  formField: {},
  methods: {
    writeValue: function(s, r) {
      var e, b;
      this.controlled && (this.d_value = s, this.$emit("update:modelValue", s)), this.$emit("value-change", s), (e = (b = this.formField).onChange) === null || e === void 0 || e.call(b, {
        originalEvent: r,
        value: s
      });
    },
    // @todo move to @primeuix/utils
    findNonEmpty: function() {
      for (var s = arguments.length, r = new Array(s), e = 0; e < s; e++)
        r[e] = arguments[e];
      return r.find(Te);
    }
  },
  computed: {
    $filled: function() {
      return Te(this.d_value);
    },
    $invalid: function() {
      var s, r;
      return !this.$formNovalidate && this.findNonEmpty(this.invalid, (s = this.$pcFormField) === null || s === void 0 || (s = s.$field) === null || s === void 0 ? void 0 : s.invalid, (r = this.$pcForm) === null || r === void 0 || (r = r.getFieldState(this.$formName)) === null || r === void 0 ? void 0 : r.invalid);
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
      var s, r;
      return this.findNonEmpty(this.d_value, (s = this.$pcFormField) === null || s === void 0 ? void 0 : s.initialValue, (r = this.$pcForm) === null || r === void 0 || (r = r.initialValues) === null || r === void 0 ? void 0 : r[this.$formName]);
    },
    $formValue: function() {
      var s, r;
      return this.findNonEmpty((s = this.$pcFormField) === null || s === void 0 || (s = s.$field) === null || s === void 0 ? void 0 : s.value, (r = this.$pcForm) === null || r === void 0 || (r = r.getFieldState(this.$formName)) === null || r === void 0 ? void 0 : r.value);
    },
    controlled: function() {
      return this.$inProps.hasOwnProperty("modelValue") || !this.$inProps.hasOwnProperty("modelValue") && !this.$inProps.hasOwnProperty("defaultValue");
    },
    // @deprecated use $filled instead
    filled: function() {
      return this.$filled;
    }
  }
}, Ma = `
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
`, ja = {
  root: {
    position: "relative"
  }
}, Wa = {
  root: function(s) {
    var r = s.instance, e = s.props;
    return ["p-toggleswitch p-component", {
      "p-toggleswitch-checked": r.checked,
      "p-disabled": e.disabled,
      "p-invalid": r.$invalid
    }];
  },
  input: "p-toggleswitch-input",
  slider: "p-toggleswitch-slider",
  handle: "p-toggleswitch-handle"
}, za = Me.extend({
  name: "toggleswitch",
  style: Ma,
  classes: Wa,
  inlineStyles: ja
}), Ha = {
  name: "BaseToggleSwitch",
  extends: Da,
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
  style: za,
  provide: function() {
    return {
      $pcToggleSwitch: this,
      $parentInstance: this
    };
  }
}, Ue = {
  name: "ToggleSwitch",
  extends: Ha,
  inheritAttrs: !1,
  emits: ["change", "focus", "blur"],
  methods: {
    getPTOptions: function(s) {
      var r = s === "root" ? this.ptmi : this.ptm;
      return r(s, {
        context: {
          checked: this.checked,
          disabled: this.disabled
        }
      });
    },
    onChange: function(s) {
      if (!this.disabled && !this.readonly) {
        var r = this.checked ? this.falseValue : this.trueValue;
        this.writeValue(r, s), this.$emit("change", s);
      }
    },
    onFocus: function(s) {
      this.$emit("focus", s);
    },
    onBlur: function(s) {
      var r, e;
      this.$emit("blur", s), (r = (e = this.formField).onBlur) === null || r === void 0 || r.call(e, s);
    }
  },
  computed: {
    checked: function() {
      return this.d_value === this.trueValue;
    },
    dataP: function() {
      return je({
        checked: this.checked,
        disabled: this.disabled,
        invalid: this.$invalid
      });
    }
  }
}, Ga = ["data-p-checked", "data-p-disabled", "data-p"], Ja = ["id", "checked", "tabindex", "disabled", "readonly", "aria-checked", "aria-labelledby", "aria-label", "aria-invalid"], Ka = ["data-p"], Qa = ["data-p"];
function Xa(o, s, r, e, b, f) {
  return n(), u("div", pe({
    class: o.cx("root"),
    style: o.sx("root")
  }, f.getPTOptions("root"), {
    "data-p-checked": f.checked,
    "data-p-disabled": o.disabled,
    "data-p": f.dataP
  }), [a("input", pe({
    id: o.inputId,
    type: "checkbox",
    role: "switch",
    class: [o.cx("input"), o.inputClass],
    style: o.inputStyle,
    checked: f.checked,
    tabindex: o.tabindex,
    disabled: o.disabled,
    readonly: o.readonly,
    "aria-checked": f.checked,
    "aria-labelledby": o.ariaLabelledby,
    "aria-label": o.ariaLabel,
    "aria-invalid": o.invalid || void 0,
    onFocus: s[0] || (s[0] = function() {
      return f.onFocus && f.onFocus.apply(f, arguments);
    }),
    onBlur: s[1] || (s[1] = function() {
      return f.onBlur && f.onBlur.apply(f, arguments);
    }),
    onChange: s[2] || (s[2] = function() {
      return f.onChange && f.onChange.apply(f, arguments);
    })
  }, f.getPTOptions("input")), null, 16, Ja), a("div", pe({
    class: o.cx("slider")
  }, f.getPTOptions("slider"), {
    "data-p": f.dataP
  }), [a("div", pe({
    class: o.cx("handle")
  }, f.getPTOptions("handle"), {
    "data-p": f.dataP
  }), [Ye(o.$slots, "handle", {
    checked: f.checked
  })], 16, Qa)], 16, Ka)], 16, Ga);
}
Ue.render = Xa;
const Ya = { class: "ac-account-main" }, Za = { class: "ac-row-title" }, en = ["onKeydown"], tn = {
  key: 1,
  class: "ac-row-name"
}, an = {
  key: 2,
  class: "kx-tag-sm ac-tone"
}, nn = { class: "ac-muted" }, ln = ["title"], on = { key: 1 }, sn = {
  key: 0,
  class: "ac-muted"
}, un = {
  key: 1,
  class: "ac-muted ac-strong"
}, cn = {
  key: 2,
  class: "ac-muted"
}, rn = {
  key: 3,
  class: "ac-muted ac-mono"
}, dn = {
  key: 4,
  class: "ac-muted"
}, vn = {
  key: 5,
  class: "kx-err ac-small"
}, pn = { class: "ac-row-actions" }, gn = /* @__PURE__ */ se({
  __name: "account-row",
  props: {
    account: {},
    kindLabel: {},
    ownerLabel: {}
  },
  emits: ["toggle", "rename", "remove", "edit"],
  setup(o, { emit: s }) {
    const r = o, e = s, b = { ready: "ready", cooling: "cooling down", disabled: "disabled", unavailable: "unavailable" }, f = ke(), L = J(() => $e(r.account, f.value)), x = J(() => r.account.mine ? "" : `Shared with you by ${r.ownerLabel}`), $ = v(!1), w = v(""), B = v(null);
    function A() {
      w.value = r.account.label, $.value = !0, ve(() => B.value?.select());
    }
    function M() {
      if (!$.value) return;
      $.value = !1;
      const F = w.value.trim();
      F && F !== r.account.label && e("rename", F);
    }
    return (F, C) => (n(), u("li", {
      class: ee(["ac-row ac-account ac-hover-actions", { off: !o.account.enabled || !o.account.usable }])
    }, [
      a("div", Ya, [
        a("div", Za, [
          a("span", {
            class: ee(["kx-tag-sm ac-tone", L.value])
          }, d(b[L.value]), 3),
          $.value ? ne((n(), u("input", {
            key: 0,
            ref_key: "input",
            ref: B,
            "onUpdate:modelValue": C[0] || (C[0] = (V) => w.value = V),
            class: "ac-rename kx-focus-halo",
            "aria-label": "Account label",
            onKeydown: [
              Ae(Se(M, ["prevent"]), ["enter"]),
              C[1] || (C[1] = Ae(Se((V) => $.value = !1, ["prevent"]), ["escape"]))
            ],
            onBlur: M
          }, null, 40, en)), [
            [re, w.value]
          ]) : (n(), u("span", tn, d(o.account.label), 1)),
          o.account.subscription ? (n(), u("span", an, "personal")) : p("", !0)
        ]),
        a("div", nn, [
          O(d(o.kindLabel) + " · " + d(o.account.runs_day) + " " + d(o.account.runs_day === 1 ? "task" : "tasks") + " in the last 24 hours · " + d(o.account.failures_day) + " " + d(o.account.failures_day === 1 ? "failure" : "failures") + " · ", 1),
          o.account.last_used_at ? (n(), u("span", {
            key: 0,
            title: i(de)(o.account.last_used_at)
          }, "last used " + d(i(xe)(o.account.last_used_at, i(f))), 9, ln)) : (n(), u("span", on, "never used"))
        ]),
        x.value ? (n(), u("div", sn, d(x.value), 1)) : p("", !0),
        o.account.usable ? o.account.subscription ? (n(), u("div", cn, "Subscription login: personal use only")) : p("", !0) : (n(), u("div", un, [
          R(i(q), { icon: "tabler:lock" }),
          O(" " + d(o.account.unavailable_reason || "Account unavailable for tasks"), 1)
        ])),
        o.account.endpoint ? (n(), u("div", rn, d(o.account.endpoint.protocol) + " · " + d(o.account.endpoint.base_url) + d(o.account.endpoint.model ? " · " + o.account.endpoint.model : ""), 1)) : p("", !0),
        L.value === "cooling" ? (n(), u("div", dn, "Available at " + d(i(de)(o.account.cooldown_until)), 1)) : p("", !0),
        o.account.last_error ? (n(), u("div", vn, d(o.account.last_error), 1)) : p("", !0)
      ]),
      a("div", pn, [
        o.account.writable ? (n(), ae(i(Ue), {
          key: 0,
          "model-value": o.account.enabled,
          "aria-label": o.account.enabled ? "Disable account" : "Enable account",
          onChange: C[2] || (C[2] = (V) => e("toggle"))
        }, null, 8, ["model-value", "aria-label"])) : p("", !0),
        o.account.writable ? (n(), u("button", {
          key: 1,
          type: "button",
          class: "ac-icon-btn kx-focus-outline",
          title: "Rename",
          "aria-label": "Rename account",
          onClick: A
        }, [
          R(i(q), { icon: "tabler:pencil" })
        ])) : p("", !0),
        o.account.writable ? (n(), u("button", {
          key: 2,
          type: "button",
          class: "ac-icon-btn kx-focus-outline",
          title: "Edit credential and endpoint",
          "aria-label": "Edit account",
          onClick: C[3] || (C[3] = (V) => e("edit"))
        }, [
          R(i(q), { icon: "tabler:key" })
        ])) : p("", !0),
        o.account.deletable ? (n(), u("button", {
          key: 3,
          type: "button",
          class: "ac-icon-btn kx-focus-outline",
          title: "Delete",
          "aria-label": "Delete account",
          onClick: C[4] || (C[4] = (V) => e("remove"))
        }, [
          R(i(q), { icon: "tabler:trash" })
        ])) : p("", !0)
      ])
    ], 2));
  }
}), hn = { class: "ac-stack" }, fn = {
  key: 0,
  class: "kx-err inline"
}, mn = {
  key: 1,
  class: "kx-err inline",
  role: "status"
}, kn = {
  key: 2,
  class: "kx-loading"
}, bn = {
  key: 3,
  class: "kx-empty"
}, yn = { class: "kx-empty-ico" }, wn = {
  key: 4,
  class: "kx-empty"
}, $n = { class: "ac-card-head" }, _n = { class: "ac-card-title" }, xn = { class: "ac-muted" }, Cn = { class: "ac-account-grid" }, Vn = { class: "ac-form" }, Fn = {
  key: 1,
  class: "ac-hint"
}, Tn = ["^config"], An = {
  key: 3,
  class: "kx-err",
  role: "alert"
}, Sn = /* @__PURE__ */ se({
  __name: "accounts",
  props: {
    query: {},
    selectedAgent: {}
  },
  emits: ["count"],
  setup(o, { expose: s, emit: r }) {
    const e = Ne(), b = v([]), f = o, L = r, x = v(!1), $ = v(null);
    function w() {
      $.value = null, U.value = "", x.value = !0;
    }
    function B(t) {
      $.value = t, y.value = t.agent, U.value = "", x.value = !0;
    }
    s({ open: w });
    const A = fe(), M = ke(), F = v([]), C = v({}), V = v(""), E = v(""), S = v(!1), P = v(!1), U = v(""), N = v(0), y = v(f.selectedAgent || A.value.agents[0]?.id || "");
    ue(() => f.selectedAgent, (t) => {
      t && (y.value = t);
    });
    const k = J(() => A.value.agents.find((t) => t.id === y.value)), G = J(() => JSON.stringify({ driver: k.value, busy: P.value, error: U.value, saved: N.value, account: $.value ? { id: $.value.id, label: $.value.label, credential_kind: $.value.credential_kind, endpoint: $.value.endpoint } : void 0, limits: A.value.account_limits })), z = J(() => [...A.value.agents, ...[...new Set(F.value.map((t) => t.agent))].filter((t) => !A.value.agents.some((g) => g.id === t)).map((t) => ({ id: t, title: `Unavailable agent: ${t}`, icon: "tabler:terminal-2" }))].map((t) => ({ agent: t, accounts: F.value.filter((g) => g.agent === t.id && [g.label, t.title, g.credential_kind].join(" ").toLowerCase().includes(f.query.toLowerCase())) })).filter((t) => t.accounts.length));
    function X(t) {
      return A.value.agents.find((g) => g.id === t.agent)?.credentials.find((g) => g.id === t.credential_kind)?.label ?? t.credential_kind;
    }
    async function Z(t) {
      const g = [...new Set(t.filter((T) => !T.mine).map((T) => T.owner))].filter((T) => !(T in C.value)), I = await tt(g);
      e() && (C.value = { ...C.value, ...I });
    }
    const D = Ce(async () => {
      try {
        let t = await W.accounts();
        for (; e() && t.some((g) => !b.value.includes(g.id)); ) {
          if (b.value = t.map((g) => g.id), await ve(), !e()) return;
          t = await W.accounts();
        }
        if (!e() || (b.value = t.map((g) => g.id), F.value = t, await Z(t), !e())) return;
        S.value = !0, V.value = "";
      } catch (t) {
        e() && (V.value = le(t, "Could not load accounts."));
      }
    }, e);
    Ie(() => b.value, () => {
      D();
    });
    const K = _e.runs(() => {
      D();
    });
    ge(K), we(D);
    async function j(t, g) {
      V.value = "", E.value = "";
      try {
        if (await t(), !e()) return;
        await D();
      } catch (I) {
        e() && (V.value = le(I, g));
      }
    }
    async function oe(t) {
      if (!(t instanceof CustomEvent)) return;
      const g = ct.safeParse(t.detail);
      if (P.value) return;
      if (!g.success || g.data.agent !== y.value || $.value && !$.value.writable) {
        U.value = "Invalid account submission.";
        return;
      }
      const I = g.data;
      U.value = "", P.value = !0;
      try {
        if ($.value) {
          const T = await W.updateAccount($.value.id, {
            label: I.label,
            endpoint: I.endpoint ?? { base_url: "" },
            ...I.secret ? { secret: I.secret } : {}
          });
          if (!e()) return;
          E.value = T.health_error ? `Account saved, but its health could not be refreshed: ${T.health_error.message}` : "";
        } else await W.createAccount(I);
        if (!e()) return;
        N.value++, x.value = !1, await D();
      } catch (T) {
        e() && (U.value = le(T, "Could not save the account."));
      } finally {
        e() && (P.value = !1);
      }
    }
    ue(F, (t) => L("count", t.length));
    const Q = (t, g, I) => j(async () => {
      const T = await W.updateAccount(t.id, g);
      e() && T.health_error && (E.value = `Account saved, but its health could not be refreshed: ${T.health_error.message}`);
    }, I), m = (t) => Q(t, { enabled: !t.enabled }, "Could not update the account."), c = (t, g) => Q(t, { label: g }, "Could not rename the account.");
    async function l(t) {
      const g = await it.confirm({
        header: "Delete account",
        message: `Delete account "${t.label}"? Tasks keep their history.`,
        icon: "tabler:trash",
        acceptLabel: "Delete",
        rejectLabel: "Cancel",
        acceptClass: "p-button-danger"
      });
      e() && g && await j(() => W.deleteAccount(t.id), "Could not delete the account.");
    }
    return Le(() => {
      st("chestor-autocode-driver-account", { timeoutMs: 8e3 }).catch(() => {
        e() && (V.value = "The driver account card could not load.");
      });
    }), (t, g) => (n(), u("div", hn, [
      V.value ? (n(), u("p", fn, [
        O(d(V.value) + " ", 1),
        a("button", {
          type: "button",
          class: "ac-link kx-focus-outline",
          onClick: g[0] || (g[0] = //@ts-ignore
          (...I) => i(D) && i(D)(...I))
        }, "Retry")
      ])) : p("", !0),
      E.value ? (n(), u("p", mn, d(E.value), 1)) : p("", !0),
      !S.value && !V.value ? (n(), u("div", kn, "Loading accounts…")) : p("", !0),
      S.value && !F.value.length ? (n(), u("div", bn, [
        a("div", yn, [
          R(i(q), { icon: "tabler:key" })
        ]),
        g[3] || (g[3] = a("div", { class: "kx-empty-title" }, "No accounts yet", -1)),
        g[4] || (g[4] = a("div", { class: "kx-empty-sub" }, "Add an API key, your own endpoint or a personal subscription login.", -1)),
        R(i(ye), {
          label: "Add account",
          onClick: w
        }, {
          icon: he(() => [
            R(i(q), { icon: "tabler:plus" })
          ]),
          _: 1
        })
      ])) : S.value && !z.value.length ? (n(), u("div", wn, [...g[5] || (g[5] = [
        a("div", { class: "kx-empty-title" }, "No matches", -1),
        a("div", { class: "kx-empty-sub" }, "Try another account or agent.", -1)
      ])])) : p("", !0),
      (n(!0), u(Y, null, te(z.value, (I) => (n(), u("section", {
        key: I.agent.id,
        class: "ac-stack"
      }, [
        a("div", $n, [
          a("h2", _n, [
            R(i(q), {
              icon: i(me)(I.agent.id, i(A).agents)
            }, null, 8, ["icon"]),
            O(d(I.agent.title), 1)
          ]),
          a("span", xn, d(I.accounts.filter((T) => T.usable && i($e)(T, i(M)) === "ready").length) + " of " + d(I.accounts.length) + " ready", 1)
        ]),
        a("ul", Cn, [
          (n(!0), u(Y, null, te(I.accounts, (T) => (n(), ae(gn, {
            key: T.id,
            account: T,
            "kind-label": X(T),
            "owner-label": C.value[T.owner] || T.owner,
            onEdit: (ie) => B(T),
            onToggle: (ie) => m(T),
            onRename: (ie) => c(T, ie),
            onRemove: (ie) => l(T)
          }, null, 8, ["account", "kind-label", "owner-label", "onEdit", "onToggle", "onRename", "onRemove"]))), 128))
        ])
      ]))), 128)),
      x.value ? (n(), ae(Re, {
        key: 5,
        title: $.value ? "Edit account" : "Add account",
        busy: P.value,
        onClose: g[2] || (g[2] = (I) => x.value = !1)
      }, {
        default: he(() => [
          a("div", Vn, [
            $.value ? p("", !0) : (n(), ae(Pe, {
              key: 0,
              disabled: P.value,
              modelValue: y.value,
              "onUpdate:modelValue": g[1] || (g[1] = (I) => y.value = I),
              agents: i(A).agents
            }, null, 8, ["disabled", "modelValue", "agents"])),
            $.value ? p("", !0) : (n(), u("p", Fn, "Tasks balance across your ready accounts automatically.")),
            k.value ? (n(), u("chestor-autocode-driver-account", {
              key: 2,
              "^config": G.value,
              onSubmit: oe
            }, null, 40, Tn)) : (n(), u("p", An, "This account’s agent is unavailable."))
          ])
        ]),
        _: 1
      }, 8, ["title", "busy"])) : p("", !0)
    ]));
  }
}), Rn = { class: "ac" }, Ln = {
  key: 1,
  class: "ac-bar"
}, En = {
  class: "ac-tabs",
  "aria-label": "Autocode views"
}, Nn = ["aria-pressed", "onClick"], In = {
  key: 2,
  class: "kx-err"
}, Pn = {
  key: 3,
  class: "kx-loading"
}, Un = {
  key: 0,
  class: "kx-empty"
}, Bn = /* @__PURE__ */ se({
  __name: "autocode",
  setup(o) {
    const s = Je(), r = Ke(), e = v(null);
    ue(() => s.value?.route, () => {
      e.value = null;
    });
    const b = J(() => e.value ?? s.value?.route ?? ""), f = J(() => {
      const N = /^\/?runs\/([^/]+)\/?$/.exec(b.value);
      try {
        return N ? decodeURIComponent(N[1]) : "";
      } catch {
        return "";
      }
    }), L = J(() => !!b.value && b.value !== "/" && !f.value);
    function x(N) {
      w.value = "tasks", e.value = N, r("navigate", { path: N });
    }
    const $ = [
      { id: "tasks", label: "Tasks", icon: "tabler:player-play" },
      { id: "accounts", label: "Accounts", icon: "tabler:key" }
    ], w = v("tasks"), { catalog: B, error: A, load: M } = We(), F = v(""), C = v(0), V = v(null), E = v(null), S = v("");
    async function P(N) {
      N && (S.value = N), w.value = "accounts", F.value = "", await ve(), E.value?.open();
    }
    function U() {
      w.value === "tasks" ? V.value?.open() : E.value?.open();
    }
    return (N, y) => (n(), u("div", Rn, [
      !f.value && !L.value ? (n(), ae(ze, {
        key: 0,
        title: "Autocode",
        subtitle: "Run coding agents with your accounts and workspaces.",
        count: `${C.value} ${w.value === "tasks" ? "task" : "account"}${C.value === 1 ? "" : "s"}`,
        action: w.value === "tasks" ? "New task" : "Add account",
        query: F.value,
        "onUpdate:query": y[0] || (y[0] = (k) => F.value = k),
        placeholder: w.value === "tasks" ? "Search tasks…" : "Search accounts…",
        onCreate: U
      }, null, 8, ["count", "action", "query", "placeholder"])) : p("", !0),
      !f.value && !L.value ? (n(), u("div", Ln, [
        a("nav", En, [
          (n(), u(Y, null, te($, (k) => a("button", {
            key: k.id,
            type: "button",
            class: ee(["ac-tab kx-focus-outline", { active: w.value === k.id }]),
            "aria-pressed": w.value === k.id,
            onClick: (G) => {
              w.value !== k.id && (w.value = k.id, F.value = "", C.value = 0);
            }
          }, [
            R(i(q), {
              icon: k.icon
            }, null, 8, ["icon"]),
            O(" " + d(k.label), 1)
          ], 10, Nn)), 64))
        ])
      ])) : p("", !0),
      i(A) && !i(B) ? (n(), u("p", In, [
        O(d(i(A)) + " ", 1),
        a("button", {
          class: "ac-link kx-focus-outline",
          type: "button",
          onClick: y[1] || (y[1] = //@ts-ignore
          (...k) => i(M) && i(M)(...k))
        }, "Retry")
      ])) : i(B) ? (n(), u("main", {
        key: 4,
        class: ee(["ac-body", { "ac-detail-page": f.value || L.value }])
      }, [
        L.value ? (n(), u("div", Un, [
          y[9] || (y[9] = a("h1", null, "Run not found", -1)),
          a("button", {
            type: "button",
            class: "ac-btn kx-focus-halo",
            onClick: y[2] || (y[2] = (k) => x(""))
          }, "Back to tasks")
        ])) : f.value || w.value === "tasks" ? (n(), ae(qa, {
          key: 1,
          ref_key: "tasks",
          ref: V,
          query: F.value,
          "run-id": f.value,
          onOpen: y[3] || (y[3] = (k) => x("runs/" + encodeURIComponent(k))),
          onClose: y[4] || (y[4] = (k) => x("")),
          onCount: y[5] || (y[5] = (k) => C.value = k),
          onAgentChanged: y[6] || (y[6] = (k) => S.value = k),
          onGoto: P
        }, null, 8, ["query", "run-id"])) : (n(), ae(Sn, {
          key: 2,
          ref_key: "accounts",
          ref: E,
          query: F.value,
          "selected-agent": S.value,
          onCount: y[7] || (y[7] = (k) => C.value = k)
        }, null, 8, ["query", "selected-agent"]))
      ], 2)) : (n(), u("div", Pn, [
        R(i(q), {
          icon: "tabler:loader-2",
          class: "spin"
        }),
        y[8] || (y[8] = O(" Loading…", -1))
      ]))
    ]));
  }
}), On = { props: { type: "object", properties: { route: { type: "string", default: "", description: "Path relative to /autocode; runs/<run_id> opens a run." } } } }, qn = {
  wippy: On
};
class Dn extends Qe {
  static get wippyConfig() {
    return {
      propsSchema: qn.wippy.props,
      hostCssKeys: ["themeConfigUrl", "primeVueCssUrl", "iframeCssUrl"],
      inlineCss: He
    };
  }
  static get vueConfig() {
    return { rootComponent: Bn, plugins: [Ge] };
  }
}
ut(import.meta.url, Dn);
