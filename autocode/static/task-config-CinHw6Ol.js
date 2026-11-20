import { defineComponent as ee, computed as y, ref as f, watch as te, openBlock as l, createElementBlock as a, toDisplayString as u, createCommentVNode as d, Fragment as g, createElementVNode as o, renderList as m, unref as n, createTextVNode as b, createVNode as oe, createBlock as le, createStaticVNode as ae, nextTick as H } from "vue";
import { s as se, a as x, e as ne } from "./presentation-JHHKyan-.js";
import { u as ie, a as ue, b as de } from "./wc-runtime-DbdXH-lj.js";
import { e as re, u as ce, d as pe, _ as ve, a as fe } from "./trait-tools.vue_vue_type_script_setup_true_lang-CCqf9vM5.js";
import { o as ge, s as v, r as _e, u as ke, c as z, e as me, d as he, t as be } from "./dto-PQMIoW9W.js";
const ye = ge({
  tools: be.optional(),
  profile_id: v().optional(),
  account_pool: he(v()).optional(),
  endpoint: me.optional(),
  agent: v().optional(),
  account_id: v().optional(),
  image_id: v().optional(),
  workspace_id: v().optional(),
  prompt: v().optional(),
  include_input: z().optional(),
  unattended: z().optional(),
  options: _e(ke()).optional(),
  run_timeout: v().max(64).optional(),
  repo_url: v().optional(),
  repo_ref: v().optional()
}).strict(), xe = { class: "tc" }, Ce = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, we = {
  key: 1,
  class: "kx-err inline"
}, Te = {
  key: 2,
  class: "kx-loading"
}, Ae = { class: "tc-field" }, Ue = ["value"], Ee = ["value"], Ve = ["value"], Pe = {
  key: 0,
  class: "tc-hint"
}, Se = { class: "tc-pair" }, Ie = { class: "tc-field" }, Ne = ["value"], $e = ["value"], Oe = ["value"], Re = { class: "tc-field" }, We = ["value"], je = { value: "" }, Be = ["value"], De = ["value"], Le = {
  key: 1,
  class: "tc-field"
}, qe = ["value"], Fe = ["value"], Ge = {
  key: 2,
  class: "tc-hint",
  role: "alert"
}, He = {
  key: 3,
  class: "tc-hint",
  role: "alert"
}, ze = {
  key: 4,
  class: "tc-hint"
}, Je = { class: "tc-pair" }, Ke = { class: "tc-field" }, Me = ["value"], Qe = ["value"], Xe = ["value"], Ye = { class: "tc-field" }, Ze = ["value"], et = ["value"], tt = ["value"], ot = {
  key: 5,
  class: "tc-hint",
  role: "alert"
}, lt = {
  key: 6,
  class: "tc-hint",
  role: "alert"
}, at = {
  key: 7,
  class: "tc-hint",
  role: "alert"
}, st = { class: "tc-field" }, nt = ["value"], it = {
  key: 8,
  class: "kx-err",
  role: "alert"
}, ut = {
  key: 9,
  class: "kx-err",
  role: "alert"
}, dt = { class: "tc-check" }, rt = ["checked"], ct = { class: "ac-advanced" }, pt = { class: "tc" }, vt = {
  key: 0,
  class: "tc-check"
}, ft = ["checked"], gt = { class: "tc-field" }, _t = ["value"], kt = ["value"], mt = { class: "tc-field" }, ht = ["value"], bt = { class: "tc-field" }, yt = ["value"], xt = {
  key: 3,
  class: "kx-err",
  role: "alert"
}, Ct = { class: "tc-field" }, wt = ["value"], Tt = { class: "tc-field" }, At = ["value"], Ut = { class: "tc-field" }, Et = ["value"], Ot = /* @__PURE__ */ ee({
  __name: "task-config",
  setup(Vt) {
    const J = ie(), W = ue(), C = y(() => ye.safeParse(J.value.config ?? {})), w = y(() => C.value.success ? "" : "Workflow configuration is invalid."), c = f(C.value.success ? C.value.data : {});
    te(C, (i) => {
      if (!i.success) return;
      const e = i.data;
      e && Object.keys(e).length ? (c.value = e, _.value = !1) : (c.value = {}, G());
    });
    const k = f(null), P = f([]), S = f([]), I = f([]), N = f([]), T = y(() => N.value.find((i) => i.id === c.value.profile_id)), s = y(() => re(c.value, T.value)), A = f(""), _ = f(!1), U = f(!1), {
      driver: p,
      agentAccounts: $,
      ready: K,
      agentImages: E,
      invalidAgent: j,
      invalidImage: B,
      invalidAccount: D,
      invalidWorkspace: L,
      invalidOptions: h,
      optionValues: M,
      initialSelection: q
    } = ce(s, {
      catalog: () => k.value,
      accounts: () => P.value,
      images: () => S.value,
      workspaces: () => I.value
    }, "saved"), V = y(() => p.value?.title ?? c.value.agent ?? "this agent");
    function r(i) {
      const e = { ...c.value, ...i };
      if (c.value = e, h.value > 0 || U.value) {
        _.value = !0;
        return;
      }
      _.value = !1, W("config-changed", e);
    }
    function O(i, e) {
      r({ endpoint: {
        protocol: s.value.endpoint?.protocol ?? p.value?.endpoints[0] ?? "",
        base_url: s.value.endpoint?.base_url ?? "",
        ...s.value.endpoint,
        [i]: e
      } });
    }
    function Q(i) {
      h.value = i, !i && _.value && H(() => {
        !h.value && !U.value && _.value && r({});
      });
    }
    function X(i) {
      U.value = i, !i && _.value && H(() => {
        !U.value && !h.value && _.value && r({});
      });
    }
    function F(i) {
      r({ agent: i, account_id: "", image_id: S.value.find((e) => e.usable && e.agents.includes(i))?.id, options: {} });
    }
    function Y(i) {
      const e = i ? { profile_id: i, prompt: c.value.prompt, include_input: c.value.include_input } : { ...q(), profile_id: void 0, prompt: c.value.prompt };
      c.value = e, _.value = !1, h.value = 0, W("config-changed", e);
    }
    function G() {
      !k.value || w.value || Object.keys(c.value).length || r({ ...q(), include_input: !0 });
    }
    return de(se(async () => {
      try {
        const [i, e, t, R, Z] = await Promise.all([x.catalog(), x.accounts(), x.images(), x.workspaces(), x.profiles()]);
        N.value = Z, k.value = i, P.value = e, S.value = t, I.value = R.workspaces, A.value = "", G();
      } catch (i) {
        A.value = ne(i, "Could not load the agents.");
      }
    })), (i, e) => (l(), a("div", xe, [
      w.value ? (l(), a("p", Ce, u(w.value), 1)) : d("", !0),
      A.value ? (l(), a("p", we, u(A.value), 1)) : k.value ? w.value ? d("", !0) : (l(), a(g, { key: 3 }, [
        o("label", Ae, [
          e[22] || (e[22] = o("span", { class: "tc-lbl" }, "Profile", -1)),
          o("select", {
            class: "tc-input kx-focus-halo",
            "aria-label": "Profile",
            value: c.value.profile_id ?? "",
            onChange: e[0] || (e[0] = (t) => Y(t.target.value))
          }, [
            e[21] || (e[21] = o("option", { value: "" }, "Custom task", -1)),
            c.value.profile_id && !T.value ? (l(), a("option", {
              key: 0,
              value: c.value.profile_id
            }, "Unavailable profile: " + u(c.value.profile_id), 9, Ee)) : d("", !0),
            (l(!0), a(g, null, m(N.value, (t) => (l(), a("option", {
              key: t.id,
              value: t.id
            }, u(t.title), 9, Ve))), 128))
          ], 40, Ue)
        ]),
        T.value ? (l(), a("p", Pe, "Profile defaults apply at submission. Each field you edit overrides the profile; explicit driver options override unattended presets.")) : d("", !0),
        o("div", Se, [
          o("label", Ie, [
            e[23] || (e[23] = o("span", { class: "tc-lbl" }, "Agent", -1)),
            o("select", {
              class: "tc-input kx-focus-halo",
              "aria-label": "Agent",
              value: s.value.agent,
              onChange: e[1] || (e[1] = (t) => F(t.target.value))
            }, [
              n(j) ? (l(), a("option", {
                key: 0,
                "aria-label": "Agent",
                value: s.value.agent
              }, "Unavailable agent: " + u(s.value.agent), 9, $e)) : d("", !0),
              (l(!0), a(g, null, m(k.value.agents, (t) => (l(), a("option", {
                key: t.id,
                value: t.id
              }, u(t.title), 9, Oe))), 128))
            ], 40, Ne)
          ]),
          o("label", Re, [
            e[24] || (e[24] = o("span", { class: "tc-lbl" }, "Account", -1)),
            o("select", {
              class: "tc-input kx-focus-halo",
              value: s.value.account_id ?? "",
              onChange: e[2] || (e[2] = (t) => r({ account_id: t.target.value, account_pool: [] }))
            }, [
              o("option", je, "Auto (" + u(n(K).length) + " ready)", 1),
              n(D) ? (l(), a("option", {
                key: 0,
                value: s.value.account_id
              }, "Unavailable account: " + u(s.value.account_id), 9, Be)) : d("", !0),
              (l(!0), a(g, null, m(n($), (t) => (l(), a("option", {
                key: t.id,
                value: t.id
              }, u(t.label), 9, De))), 128))
            ], 40, We)
          ])
        ]),
        s.value.account_id ? d("", !0) : (l(), a("label", Le, [
          e[25] || (e[25] = o("span", { class: "tc-lbl" }, "Account pool (empty uses all usable accounts)", -1)),
          o("select", {
            multiple: "",
            class: "tc-input kx-focus-halo",
            value: s.value.account_pool ?? [],
            onChange: e[3] || (e[3] = (t) => r({ account_id: "", account_pool: Array.from(t.target.selectedOptions, (R) => R.value) }))
          }, [
            (l(!0), a(g, null, m(n($), (t) => (l(), a("option", {
              key: t.id,
              value: t.id
            }, u(t.label), 9, Fe))), 128))
          ], 40, qe)
        ])),
        n(j) ? (l(), a("p", Ge, [
          e[26] || (e[26] = b("This saved agent no longer exists. ", -1)),
          k.value.agents.length ? (l(), a("button", {
            key: 0,
            type: "button",
            class: "ac-link kx-focus-outline",
            onClick: e[4] || (e[4] = (t) => F(n(pe)(k.value, P.value)))
          }, "Use default agent")) : d("", !0)
        ])) : d("", !0),
        n(D) ? (l(), a("p", He, [
          b("This saved account no longer exists, is disabled or cannot run " + u(V.value) + ". ", 1),
          o("button", {
            type: "button",
            class: "ac-link kx-focus-outline",
            onClick: e[5] || (e[5] = (t) => r({ account_id: "" }))
          }, "Use Auto")
        ])) : d("", !0),
        n($).length ? d("", !0) : (l(), a("p", ze, "Add an account on Autocode → Accounts to run " + u(V.value) + ".", 1)),
        o("div", Je, [
          o("label", Ke, [
            e[27] || (e[27] = o("span", { class: "tc-lbl" }, "Image (required)", -1)),
            o("select", {
              class: "tc-input kx-focus-halo",
              value: s.value.image_id ?? "",
              onChange: e[6] || (e[6] = (t) => r({ image_id: t.target.value }))
            }, [
              n(B) ? (l(), a("option", {
                key: 0,
                value: s.value.image_id ?? ""
              }, u(s.value.image_id ? "Unavailable image: " + s.value.image_id : "Choose an image"), 9, Qe)) : d("", !0),
              (l(!0), a(g, null, m(n(E), (t) => (l(), a("option", {
                key: t.id,
                value: t.id
              }, u(t.label), 9, Xe))), 128))
            ], 40, Me)
          ]),
          o("label", Ye, [
            e[29] || (e[29] = o("span", { class: "tc-lbl" }, "Workspace", -1)),
            o("select", {
              class: "tc-input kx-focus-halo",
              value: s.value.workspace_id ?? "",
              onChange: e[7] || (e[7] = (t) => r({ workspace_id: t.target.value }))
            }, [
              e[28] || (e[28] = o("option", { value: "" }, "Scratch directory", -1)),
              n(L) ? (l(), a("option", {
                key: 0,
                value: s.value.workspace_id
              }, "Unavailable workspace: " + u(s.value.workspace_id), 9, et)) : d("", !0),
              (l(!0), a(g, null, m(I.value, (t) => (l(), a("option", {
                key: t.id,
                value: t.id
              }, u(t.name) + u(t.writable ? "" : " (read-only)"), 9, tt))), 128))
            ], 40, Ze)
          ])
        ]),
        n(E).length ? n(B) ? (l(), a("p", lt, [
          b("This saved image is missing, is not usable or does not include " + u(V.value) + ". ", 1),
          o("button", {
            type: "button",
            class: "ac-link kx-focus-outline",
            onClick: e[8] || (e[8] = (t) => r({ image_id: n(E)[0].id }))
          }, "Use " + u(n(E)[0].label), 1)
        ])) : d("", !0) : (l(), a("p", ot, "No image with " + u(V.value) + "; ask an administrator.", 1)),
        n(L) ? (l(), a("p", at, [
          e[30] || (e[30] = b("This saved workspace no longer exists or is unavailable. ", -1)),
          o("button", {
            type: "button",
            class: "ac-link kx-focus-outline",
            onClick: e[9] || (e[9] = (t) => r({ workspace_id: "" }))
          }, "Use Scratch")
        ])) : d("", !0),
        o("label", st, [
          e[31] || (e[31] = o("span", { class: "tc-lbl" }, "Task (required)", -1)),
          o("textarea", {
            class: "tc-input kx-focus-halo",
            rows: "4",
            value: s.value.prompt,
            placeholder: "What should the agent do?",
            onInput: e[10] || (e[10] = (t) => r({ prompt: t.target.value }))
          }, null, 40, nt)
        ]),
        s.value.prompt?.trim() ? d("", !0) : (l(), a("p", it, "Enter a task prompt.")),
        !s.value.image_id && !c.value.profile_id ? (l(), a("p", ut, "Choose an image.")) : d("", !0),
        o("label", dt, [
          o("input", {
            type: "checkbox",
            class: "kx-focus-outline",
            checked: s.value.include_input !== !1,
            onChange: e[11] || (e[11] = (t) => r({ include_input: t.target.checked }))
          }, null, 40, rt),
          e[32] || (e[32] = b(" Pass the node's input to the agent after the task ", -1))
        ]),
        o("details", ct, [
          e[40] || (e[40] = o("summary", { class: "kx-focus-outline" }, "Advanced", -1)),
          o("div", pt, [
            n(p)?.unattended ? (l(), a("label", vt, [
              o("input", {
                type: "checkbox",
                class: "kx-focus-outline",
                checked: s.value.unattended !== !1,
                onChange: e[12] || (e[12] = (t) => r({ unattended: t.target.checked }))
              }, null, 40, ft),
              e[33] || (e[33] = b(" Unattended: skip permission prompts ", -1))
            ])) : d("", !0),
            n(p)?.endpoints.length ? (l(), a(g, { key: 1 }, [
              o("label", gt, [
                e[34] || (e[34] = o("span", { class: "tc-lbl" }, "Endpoint protocol", -1)),
                o("select", {
                  class: "tc-input kx-focus-halo",
                  value: s.value.endpoint?.protocol ?? n(p).endpoints[0],
                  onChange: e[13] || (e[13] = (t) => O("protocol", t.target.value))
                }, [
                  (l(!0), a(g, null, m(n(p).endpoints, (t) => (l(), a("option", {
                    key: t,
                    value: t
                  }, u(t), 9, kt))), 128))
                ], 40, _t)
              ]),
              o("label", mt, [
                e[35] || (e[35] = o("span", { class: "tc-lbl" }, "Endpoint URL", -1)),
                o("input", {
                  class: "tc-input kx-focus-halo",
                  value: s.value.endpoint?.base_url,
                  placeholder: "Use account endpoint",
                  onChange: e[14] || (e[14] = (t) => O("base_url", t.target.value.trim()))
                }, null, 40, ht)
              ]),
              o("label", bt, [
                e[36] || (e[36] = o("span", { class: "tc-lbl" }, "Endpoint model", -1)),
                o("input", {
                  class: "tc-input kx-focus-halo",
                  value: s.value.endpoint?.model,
                  onChange: e[15] || (e[15] = (t) => O("model", t.target.value.trim()))
                }, null, 40, yt)
              ])
            ], 64)) : d("", !0),
            oe(ve, {
              "model-value": s.value.tools,
              agent: s.value.agent ?? "",
              "onUpdate:modelValue": e[16] || (e[16] = (t) => r({ tools: t })),
              onInvalid: X
            }, null, 8, ["model-value", "agent"]),
            n(p) ? (l(), le(fe, {
              key: (c.value.profile_id ?? "") + n(p).id,
              options: n(p).options,
              "model-value": n(M),
              defaults: { ...s.value.unattended !== !1 ? n(p).unattended : {}, ...T.value?.options },
              onInvalid: Q,
              "onUpdate:modelValue": e[17] || (e[17] = (t) => r({ options: t }))
            }, null, 8, ["options", "model-value", "defaults"])) : d("", !0),
            n(h) ? (l(), a("p", xt, "Driver options are invalid. These drafts and further changes are not applied to the workflow until all options are valid.")) : d("", !0),
            o("label", Ct, [
              e[37] || (e[37] = o("span", { class: "tc-lbl" }, "Run timeout", -1)),
              o("input", {
                class: "tc-input tc-mono kx-focus-halo",
                value: s.value.run_timeout,
                placeholder: "Use configured timeout",
                onChange: e[18] || (e[18] = (t) => r({ run_timeout: t.target.value.trim() }))
              }, null, 40, wt)
            ]),
            o("label", Tt, [
              e[38] || (e[38] = o("span", { class: "tc-lbl" }, "Git repository", -1)),
              o("input", {
                class: "tc-input tc-mono kx-focus-halo",
                value: s.value.repo_url,
                placeholder: "optional",
                onChange: e[19] || (e[19] = (t) => r({ repo_url: t.target.value }))
              }, null, 40, At)
            ]),
            o("label", Ut, [
              e[39] || (e[39] = o("span", { class: "tc-lbl" }, "Repository ref", -1)),
              o("input", {
                class: "tc-input tc-mono kx-focus-halo",
                "aria-label": "Repository ref",
                value: s.value.repo_ref,
                placeholder: "Default branch",
                onChange: e[20] || (e[20] = (t) => r({ repo_ref: t.target.value.trim() }))
              }, null, 40, Et)
            ])
          ])
        ]),
        e[41] || (e[41] = ae('<p class="tc-hint">Output: <code>run_id</code>, <code>status</code>, <code>answer</code>, <code>error</code>, <code>usage</code>, <code>agent</code>, <code>account_id</code>; next nodes read them as <code>output.answer</code>.</p>', 1))
      ], 64)) : (l(), a("div", Te, "Loading agents…"))
    ]));
  }
});
export {
  Ot as default
};
