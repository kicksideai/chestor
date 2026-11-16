import { defineComponent as X, computed as y, ref as _, watch as Y, openBlock as l, createElementBlock as a, toDisplayString as u, createCommentVNode as r, Fragment as f, createElementVNode as o, renderList as k, unref as n, createTextVNode as h, createBlock as Z, createStaticVNode as ee, nextTick as te } from "vue";
import { s as oe, a as x, e as le } from "./presentation-Dx9dN_rC.js";
import { b as ae, u as se, a as ne } from "./wc-runtime-6vw183jT.js";
import { e as ie, u as ue, d as re, _ as de } from "./driver-options.vue_vue_type_script_setup_true_lang-CCtXGWAx.js";
import { o as ce, s as v, r as pe, u as ve, c as G, e as fe, d as _e, t as ge } from "./dto-BbunlQ8U.js";
const ke = ce({
  tools: ge.optional(),
  profile_id: v().optional(),
  account_pool: _e(v()).optional(),
  endpoint: fe.optional(),
  agent: v().optional(),
  account_id: v().optional(),
  image_id: v().optional(),
  workspace_id: v().optional(),
  prompt: v().optional(),
  include_input: G().optional(),
  unattended: G().optional(),
  options: pe(ve()).optional(),
  run_timeout: v().max(64).optional(),
  repo_url: v().optional(),
  repo_ref: v().optional()
}).strict(), me = { class: "tc" }, he = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, be = {
  key: 1,
  class: "kx-err inline"
}, ye = {
  key: 2,
  class: "kx-loading"
}, xe = { class: "tc-field" }, Ce = ["value"], we = ["value"], Te = ["value"], Ae = {
  key: 0,
  class: "tc-hint"
}, Ue = { class: "tc-pair" }, Ee = { class: "tc-field" }, Pe = ["value"], Se = ["value"], Ve = ["value"], Ie = { class: "tc-field" }, Ne = ["value"], Oe = { value: "" }, Re = ["value"], $e = ["value"], We = {
  key: 1,
  class: "tc-field"
}, je = ["value"], Be = ["value"], De = {
  key: 2,
  class: "tc-hint",
  role: "alert"
}, Le = {
  key: 3,
  class: "tc-hint",
  role: "alert"
}, qe = {
  key: 4,
  class: "tc-hint"
}, Fe = { class: "tc-pair" }, Ge = { class: "tc-field" }, He = ["value"], ze = ["value"], Je = ["value"], Ke = { class: "tc-field" }, Me = ["value"], Qe = ["value"], Xe = ["value"], Ye = {
  key: 5,
  class: "tc-hint",
  role: "alert"
}, Ze = {
  key: 6,
  class: "tc-hint",
  role: "alert"
}, et = {
  key: 7,
  class: "tc-hint",
  role: "alert"
}, tt = { class: "tc-field" }, ot = ["value"], lt = {
  key: 8,
  class: "kx-err",
  role: "alert"
}, at = {
  key: 9,
  class: "kx-err",
  role: "alert"
}, st = { class: "tc-check" }, nt = ["checked"], it = { class: "ac-advanced" }, ut = { class: "tc" }, rt = {
  key: 0,
  class: "tc-check"
}, dt = ["checked"], ct = { class: "tc-field" }, pt = ["value"], vt = ["value"], ft = { class: "tc-field" }, _t = ["value"], gt = { class: "tc-field" }, kt = ["value"], mt = {
  key: 3,
  class: "kx-err",
  role: "alert"
}, ht = { class: "tc-field" }, bt = ["value"], yt = { class: "tc-field" }, xt = ["value"], Ct = { class: "tc-field" }, wt = ["value"], Vt = /* @__PURE__ */ X({
  __name: "task-config",
  setup(Tt) {
    const H = ae(), $ = se(), C = y(() => ke.safeParse(H.value.config ?? {})), w = y(() => C.value.success ? "" : "Workflow configuration is invalid."), d = _(C.value.success ? C.value.data : {});
    Y(C, (i) => {
      if (!i.success) return;
      const e = i.data;
      e && Object.keys(e).length ? (d.value = e, m.value = !1) : (d.value = {}, F());
    });
    const g = _(null), P = _([]), S = _([]), V = _([]), I = _([]), T = y(() => I.value.find((i) => i.id === d.value.profile_id)), s = y(() => ie(d.value, T.value)), A = _(""), m = _(!1), {
      driver: p,
      agentAccounts: N,
      ready: z,
      agentImages: U,
      invalidAgent: W,
      invalidImage: j,
      invalidAccount: B,
      invalidWorkspace: D,
      invalidOptions: b,
      optionValues: J,
      initialSelection: L
    } = ue(s, {
      catalog: () => g.value,
      accounts: () => P.value,
      images: () => S.value,
      workspaces: () => V.value
    }, "saved"), E = y(() => p.value?.title ?? d.value.agent ?? "this agent");
    function c(i) {
      const e = { ...d.value, ...i };
      if (d.value = e, b.value > 0) {
        m.value = !0;
        return;
      }
      m.value = !1, $("config-changed", e);
    }
    function O(i, e) {
      c({ endpoint: {
        protocol: s.value.endpoint?.protocol ?? p.value?.endpoints[0] ?? "",
        base_url: s.value.endpoint?.base_url ?? "",
        ...s.value.endpoint,
        [i]: e
      } });
    }
    function K(i) {
      b.value = i, !i && m.value && te(() => {
        !b.value && m.value && c({});
      });
    }
    function q(i) {
      c({ agent: i, account_id: "", image_id: S.value.find((e) => e.usable && e.agents.includes(i))?.id, options: {} });
    }
    function M(i) {
      const e = i ? { profile_id: i, prompt: d.value.prompt, include_input: d.value.include_input } : { ...L(), profile_id: void 0, prompt: d.value.prompt };
      d.value = e, m.value = !1, b.value = 0, $("config-changed", e);
    }
    function F() {
      !g.value || w.value || Object.keys(d.value).length || c({ ...L(), include_input: !0 });
    }
    return ne(oe(async () => {
      try {
        const [i, e, t, R, Q] = await Promise.all([x.catalog(), x.accounts(), x.images(), x.workspaces(), x.profiles()]);
        I.value = Q, g.value = i, P.value = e, S.value = t, V.value = R.workspaces, A.value = "", F();
      } catch (i) {
        A.value = le(i, "Could not load the agents.");
      }
    })), (i, e) => (l(), a("div", me, [
      w.value ? (l(), a("p", he, u(w.value), 1)) : r("", !0),
      A.value ? (l(), a("p", be, u(A.value), 1)) : g.value ? w.value ? r("", !0) : (l(), a(f, { key: 3 }, [
        o("label", xe, [
          e[21] || (e[21] = o("span", { class: "tc-lbl" }, "Profile", -1)),
          o("select", {
            class: "tc-input kx-focus-halo",
            "aria-label": "Profile",
            value: d.value.profile_id ?? "",
            onChange: e[0] || (e[0] = (t) => M(t.target.value))
          }, [
            e[20] || (e[20] = o("option", { value: "" }, "Custom task", -1)),
            d.value.profile_id && !T.value ? (l(), a("option", {
              key: 0,
              value: d.value.profile_id
            }, "Unavailable profile: " + u(d.value.profile_id), 9, we)) : r("", !0),
            (l(!0), a(f, null, k(I.value, (t) => (l(), a("option", {
              key: t.id,
              value: t.id
            }, u(t.title), 9, Te))), 128))
          ], 40, Ce)
        ]),
        T.value ? (l(), a("p", Ae, "Profile defaults apply at submission. Each field you edit overrides the profile; explicit driver options override unattended presets.")) : r("", !0),
        o("div", Ue, [
          o("label", Ee, [
            e[22] || (e[22] = o("span", { class: "tc-lbl" }, "Agent", -1)),
            o("select", {
              class: "tc-input kx-focus-halo",
              "aria-label": "Agent",
              value: s.value.agent,
              onChange: e[1] || (e[1] = (t) => q(t.target.value))
            }, [
              n(W) ? (l(), a("option", {
                key: 0,
                "aria-label": "Agent",
                value: s.value.agent
              }, "Unavailable agent: " + u(s.value.agent), 9, Se)) : r("", !0),
              (l(!0), a(f, null, k(g.value.agents, (t) => (l(), a("option", {
                key: t.id,
                value: t.id
              }, u(t.title), 9, Ve))), 128))
            ], 40, Pe)
          ]),
          o("label", Ie, [
            e[23] || (e[23] = o("span", { class: "tc-lbl" }, "Account", -1)),
            o("select", {
              class: "tc-input kx-focus-halo",
              value: s.value.account_id ?? "",
              onChange: e[2] || (e[2] = (t) => c({ account_id: t.target.value, account_pool: [] }))
            }, [
              o("option", Oe, "Auto (" + u(n(z).length) + " ready)", 1),
              n(B) ? (l(), a("option", {
                key: 0,
                value: s.value.account_id
              }, "Unavailable account: " + u(s.value.account_id), 9, Re)) : r("", !0),
              (l(!0), a(f, null, k(n(N), (t) => (l(), a("option", {
                key: t.id,
                value: t.id
              }, u(t.label), 9, $e))), 128))
            ], 40, Ne)
          ])
        ]),
        s.value.account_id ? r("", !0) : (l(), a("label", We, [
          e[24] || (e[24] = o("span", { class: "tc-lbl" }, "Account pool (empty uses all usable accounts)", -1)),
          o("select", {
            multiple: "",
            class: "tc-input kx-focus-halo",
            value: s.value.account_pool ?? [],
            onChange: e[3] || (e[3] = (t) => c({ account_id: "", account_pool: Array.from(t.target.selectedOptions, (R) => R.value) }))
          }, [
            (l(!0), a(f, null, k(n(N), (t) => (l(), a("option", {
              key: t.id,
              value: t.id
            }, u(t.label), 9, Be))), 128))
          ], 40, je)
        ])),
        n(W) ? (l(), a("p", De, [
          e[25] || (e[25] = h("This saved agent no longer exists. ", -1)),
          g.value.agents.length ? (l(), a("button", {
            key: 0,
            type: "button",
            class: "ac-link kx-focus-outline",
            onClick: e[4] || (e[4] = (t) => q(n(re)(g.value, P.value)))
          }, "Use default agent")) : r("", !0)
        ])) : r("", !0),
        n(B) ? (l(), a("p", Le, [
          h("This saved account no longer exists, is disabled or cannot run " + u(E.value) + ". ", 1),
          o("button", {
            type: "button",
            class: "ac-link kx-focus-outline",
            onClick: e[5] || (e[5] = (t) => c({ account_id: "" }))
          }, "Use Auto")
        ])) : r("", !0),
        n(N).length ? r("", !0) : (l(), a("p", qe, "Add an account on Autocode → Accounts to run " + u(E.value) + ".", 1)),
        o("div", Fe, [
          o("label", Ge, [
            e[26] || (e[26] = o("span", { class: "tc-lbl" }, "Image (required)", -1)),
            o("select", {
              class: "tc-input kx-focus-halo",
              value: s.value.image_id ?? "",
              onChange: e[6] || (e[6] = (t) => c({ image_id: t.target.value }))
            }, [
              n(j) ? (l(), a("option", {
                key: 0,
                value: s.value.image_id ?? ""
              }, u(s.value.image_id ? "Unavailable image: " + s.value.image_id : "Choose an image"), 9, ze)) : r("", !0),
              (l(!0), a(f, null, k(n(U), (t) => (l(), a("option", {
                key: t.id,
                value: t.id
              }, u(t.label), 9, Je))), 128))
            ], 40, He)
          ]),
          o("label", Ke, [
            e[28] || (e[28] = o("span", { class: "tc-lbl" }, "Workspace", -1)),
            o("select", {
              class: "tc-input kx-focus-halo",
              value: s.value.workspace_id ?? "",
              onChange: e[7] || (e[7] = (t) => c({ workspace_id: t.target.value }))
            }, [
              e[27] || (e[27] = o("option", { value: "" }, "Scratch directory", -1)),
              n(D) ? (l(), a("option", {
                key: 0,
                value: s.value.workspace_id
              }, "Unavailable workspace: " + u(s.value.workspace_id), 9, Qe)) : r("", !0),
              (l(!0), a(f, null, k(V.value, (t) => (l(), a("option", {
                key: t.id,
                value: t.id
              }, u(t.name) + u(t.writable ? "" : " (read-only)"), 9, Xe))), 128))
            ], 40, Me)
          ])
        ]),
        n(U).length ? n(j) ? (l(), a("p", Ze, [
          h("This saved image is missing, is not usable or does not include " + u(E.value) + ". ", 1),
          o("button", {
            type: "button",
            class: "ac-link kx-focus-outline",
            onClick: e[8] || (e[8] = (t) => c({ image_id: n(U)[0].id }))
          }, "Use " + u(n(U)[0].label), 1)
        ])) : r("", !0) : (l(), a("p", Ye, "No image with " + u(E.value) + "; ask an administrator.", 1)),
        n(D) ? (l(), a("p", et, [
          e[29] || (e[29] = h("This saved workspace no longer exists or is unavailable. ", -1)),
          o("button", {
            type: "button",
            class: "ac-link kx-focus-outline",
            onClick: e[9] || (e[9] = (t) => c({ workspace_id: "" }))
          }, "Use Scratch")
        ])) : r("", !0),
        o("label", tt, [
          e[30] || (e[30] = o("span", { class: "tc-lbl" }, "Task (required)", -1)),
          o("textarea", {
            class: "tc-input kx-focus-halo",
            rows: "4",
            value: s.value.prompt,
            placeholder: "What should the agent do?",
            onInput: e[10] || (e[10] = (t) => c({ prompt: t.target.value }))
          }, null, 40, ot)
        ]),
        s.value.prompt?.trim() ? r("", !0) : (l(), a("p", lt, "Enter a task prompt.")),
        !s.value.image_id && !d.value.profile_id ? (l(), a("p", at, "Choose an image.")) : r("", !0),
        o("label", st, [
          o("input", {
            type: "checkbox",
            class: "kx-focus-outline",
            checked: s.value.include_input !== !1,
            onChange: e[11] || (e[11] = (t) => c({ include_input: t.target.checked }))
          }, null, 40, nt),
          e[31] || (e[31] = h(" Pass the node's input to the agent after the task ", -1))
        ]),
        o("details", it, [
          e[39] || (e[39] = o("summary", { class: "kx-focus-outline" }, "Advanced", -1)),
          o("div", ut, [
            n(p)?.unattended ? (l(), a("label", rt, [
              o("input", {
                type: "checkbox",
                class: "kx-focus-outline",
                checked: s.value.unattended !== !1,
                onChange: e[12] || (e[12] = (t) => c({ unattended: t.target.checked }))
              }, null, 40, dt),
              e[32] || (e[32] = h(" Unattended: skip permission prompts ", -1))
            ])) : r("", !0),
            n(p)?.endpoints.length ? (l(), a(f, { key: 1 }, [
              o("label", ct, [
                e[33] || (e[33] = o("span", { class: "tc-lbl" }, "Endpoint protocol", -1)),
                o("select", {
                  class: "tc-input kx-focus-halo",
                  value: s.value.endpoint?.protocol ?? n(p).endpoints[0],
                  onChange: e[13] || (e[13] = (t) => O("protocol", t.target.value))
                }, [
                  (l(!0), a(f, null, k(n(p).endpoints, (t) => (l(), a("option", {
                    key: t,
                    value: t
                  }, u(t), 9, vt))), 128))
                ], 40, pt)
              ]),
              o("label", ft, [
                e[34] || (e[34] = o("span", { class: "tc-lbl" }, "Endpoint URL", -1)),
                o("input", {
                  class: "tc-input kx-focus-halo",
                  value: s.value.endpoint?.base_url,
                  placeholder: "Use account endpoint",
                  onChange: e[14] || (e[14] = (t) => O("base_url", t.target.value.trim()))
                }, null, 40, _t)
              ]),
              o("label", gt, [
                e[35] || (e[35] = o("span", { class: "tc-lbl" }, "Endpoint model", -1)),
                o("input", {
                  class: "tc-input kx-focus-halo",
                  value: s.value.endpoint?.model,
                  onChange: e[15] || (e[15] = (t) => O("model", t.target.value.trim()))
                }, null, 40, kt)
              ])
            ], 64)) : r("", !0),
            n(p) ? (l(), Z(de, {
              key: (d.value.profile_id ?? "") + n(p).id,
              options: n(p).options,
              "model-value": n(J),
              defaults: { ...s.value.unattended !== !1 ? n(p).unattended : {}, ...T.value?.options },
              onInvalid: K,
              "onUpdate:modelValue": e[16] || (e[16] = (t) => c({ options: t }))
            }, null, 8, ["options", "model-value", "defaults"])) : r("", !0),
            n(b) ? (l(), a("p", mt, "Driver options are invalid. These drafts and further changes are not applied to the workflow until all options are valid.")) : r("", !0),
            o("label", ht, [
              e[36] || (e[36] = o("span", { class: "tc-lbl" }, "Run timeout", -1)),
              o("input", {
                class: "tc-input tc-mono kx-focus-halo",
                value: s.value.run_timeout,
                placeholder: "Use configured timeout",
                onChange: e[17] || (e[17] = (t) => c({ run_timeout: t.target.value.trim() }))
              }, null, 40, bt)
            ]),
            o("label", yt, [
              e[37] || (e[37] = o("span", { class: "tc-lbl" }, "Git repository", -1)),
              o("input", {
                class: "tc-input tc-mono kx-focus-halo",
                value: s.value.repo_url,
                placeholder: "optional",
                onChange: e[18] || (e[18] = (t) => c({ repo_url: t.target.value }))
              }, null, 40, xt)
            ]),
            o("label", Ct, [
              e[38] || (e[38] = o("span", { class: "tc-lbl" }, "Repository ref", -1)),
              o("input", {
                class: "tc-input tc-mono kx-focus-halo",
                "aria-label": "Repository ref",
                value: s.value.repo_ref,
                placeholder: "Default branch",
                onChange: e[19] || (e[19] = (t) => c({ repo_ref: t.target.value.trim() }))
              }, null, 40, wt)
            ])
          ])
        ]),
        e[40] || (e[40] = ee('<p class="tc-hint">Output: <code>run_id</code>, <code>status</code>, <code>answer</code>, <code>error</code>, <code>usage</code>, <code>agent</code>, <code>account_id</code>; next nodes read them as <code>output.answer</code>.</p>', 1))
      ], 64)) : (l(), a("div", ye, "Loading agents…"))
    ]));
  }
});
export {
  Vt as default
};
