import { defineComponent as te, computed as y, ref as f, watch as le, openBlock as o, createElementBlock as a, toDisplayString as u, createCommentVNode as d, Fragment as _, createElementVNode as l, renderList as m, unref as n, createTextVNode as b, createVNode as H, withCtx as oe, createBlock as ae, createStaticVNode as se, nextTick as z } from "vue";
import { s as ne, a as x, e as ie, _ as ue } from "./Disclosure.vue_vue_type_script_setup_true_lang-CrWwplXA.js";
import { u as de, a as re, b as ce } from "./wc-runtime-CvWl7e3g.js";
import { e as pe, u as ve, d as fe, _ as _e, a as ge } from "./trait-tools.vue_vue_type_script_setup_true_lang-wf7bmzEl.js";
import { o as ke, s as v, r as me, u as he, c as J, e as be, d as ye, t as xe } from "./dto-CHThMR8e.js";
const Ce = ke({
  tools: xe.optional(),
  profile_id: v().optional(),
  account_pool: ye(v()).optional(),
  endpoint: be.optional(),
  agent: v().optional(),
  account_id: v().optional(),
  image_id: v().optional(),
  workspace_id: v().optional(),
  prompt: v().optional(),
  include_input: J().optional(),
  unattended: J().optional(),
  options: me(he()).optional(),
  run_timeout: v().max(64).optional(),
  repo_url: v().optional(),
  repo_ref: v().optional()
}).strict(), we = { class: "tc" }, Te = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, Ae = {
  key: 1,
  class: "kx-err inline"
}, Ue = {
  key: 2,
  class: "kx-loading"
}, Ee = { class: "tc-field" }, Ve = ["value"], Pe = ["value"], Se = ["value"], $e = {
  key: 0,
  class: "tc-hint"
}, Ie = { class: "tc-pair" }, Ne = { class: "tc-field" }, Oe = ["value"], Re = ["value"], We = ["value"], je = { class: "tc-field" }, Be = ["value"], De = { value: "" }, Le = ["value"], qe = ["value"], Fe = {
  key: 1,
  class: "tc-field"
}, Ge = ["value"], He = ["value"], ze = {
  key: 2,
  class: "tc-hint",
  role: "alert"
}, Je = {
  key: 3,
  class: "tc-hint",
  role: "alert"
}, Ke = {
  key: 4,
  class: "tc-hint"
}, Me = { class: "tc-pair" }, Qe = { class: "tc-field" }, Xe = ["value"], Ye = ["value"], Ze = ["value"], et = { class: "tc-field" }, tt = ["value"], lt = ["value"], ot = ["value"], at = {
  key: 5,
  class: "tc-hint",
  role: "alert"
}, st = {
  key: 6,
  class: "tc-hint",
  role: "alert"
}, nt = {
  key: 7,
  class: "tc-hint",
  role: "alert"
}, it = { class: "tc-field" }, ut = ["value"], dt = {
  key: 8,
  class: "kx-err",
  role: "alert"
}, rt = {
  key: 9,
  class: "kx-err",
  role: "alert"
}, ct = { class: "tc-check" }, pt = ["checked"], vt = { class: "tc" }, ft = {
  key: 0,
  class: "tc-check"
}, _t = ["checked"], gt = { class: "tc-field" }, kt = ["value"], mt = ["value"], ht = { class: "tc-field" }, bt = ["value"], yt = { class: "tc-field" }, xt = ["value"], Ct = {
  key: 3,
  class: "kx-err",
  role: "alert"
}, wt = { class: "tc-field" }, Tt = ["value"], At = { class: "tc-field" }, Ut = ["value"], Et = { class: "tc-field" }, Vt = ["value"], Rt = /* @__PURE__ */ te({
  __name: "task-config",
  setup(Pt) {
    const K = de(), W = re(), C = y(() => Ce.safeParse(K.value.config ?? {})), w = y(() => C.value.success ? "" : "Workflow configuration is invalid."), c = f(C.value.success ? C.value.data : {});
    le(C, (i) => {
      if (!i.success) return;
      const e = i.data;
      e && Object.keys(e).length ? (c.value = e, g.value = !1) : (c.value = {}, G());
    });
    const k = f(null), P = f([]), S = f([]), $ = f([]), I = f([]), T = y(() => I.value.find((i) => i.id === c.value.profile_id)), s = y(() => pe(c.value, T.value)), A = f(""), g = f(!1), U = f(!1), {
      driver: p,
      agentAccounts: N,
      ready: M,
      agentImages: E,
      invalidAgent: j,
      invalidImage: B,
      invalidAccount: D,
      invalidWorkspace: L,
      invalidOptions: h,
      optionValues: Q,
      initialSelection: q
    } = ve(s, {
      catalog: () => k.value,
      accounts: () => P.value,
      images: () => S.value,
      workspaces: () => $.value
    }, "saved"), V = y(() => p.value?.title ?? c.value.agent ?? "this agent");
    function r(i) {
      const e = { ...c.value, ...i };
      if (c.value = e, h.value > 0 || U.value) {
        g.value = !0;
        return;
      }
      g.value = !1, W("config-changed", e);
    }
    function O(i, e) {
      r({ endpoint: {
        protocol: s.value.endpoint?.protocol ?? p.value?.endpoints[0] ?? "",
        base_url: s.value.endpoint?.base_url ?? "",
        ...s.value.endpoint,
        [i]: e
      } });
    }
    function X(i) {
      h.value = i, !i && g.value && z(() => {
        !h.value && !U.value && g.value && r({});
      });
    }
    function Y(i) {
      U.value = i, !i && g.value && z(() => {
        !U.value && !h.value && g.value && r({});
      });
    }
    function F(i) {
      r({ agent: i, account_id: "", image_id: S.value.find((e) => e.usable && e.agents.includes(i))?.id, options: {} });
    }
    function Z(i) {
      const e = i ? { profile_id: i, prompt: c.value.prompt, include_input: c.value.include_input } : { ...q(), profile_id: void 0, prompt: c.value.prompt };
      c.value = e, g.value = !1, h.value = 0, W("config-changed", e);
    }
    function G() {
      !k.value || w.value || Object.keys(c.value).length || r({ ...q(), include_input: !0 });
    }
    return ce(ne(async () => {
      try {
        const [i, e, t, R, ee] = await Promise.all([x.catalog(), x.accounts(), x.images(), x.workspaces(), x.profiles()]);
        I.value = ee, k.value = i, P.value = e, S.value = t, $.value = R.workspaces, A.value = "", G();
      } catch (i) {
        A.value = ie(i, "Could not load the agents.");
      }
    })), (i, e) => (o(), a("div", we, [
      w.value ? (o(), a("p", Te, u(w.value), 1)) : d("", !0),
      A.value ? (o(), a("p", Ae, u(A.value), 1)) : k.value ? w.value ? d("", !0) : (o(), a(_, { key: 3 }, [
        l("label", Ee, [
          e[22] || (e[22] = l("span", { class: "tc-lbl" }, "Profile", -1)),
          l("select", {
            class: "tc-input kx-focus-halo",
            "aria-label": "Profile",
            value: c.value.profile_id ?? "",
            onChange: e[0] || (e[0] = (t) => Z(t.target.value))
          }, [
            e[21] || (e[21] = l("option", { value: "" }, "Custom task", -1)),
            c.value.profile_id && !T.value ? (o(), a("option", {
              key: 0,
              value: c.value.profile_id
            }, "Unavailable profile: " + u(c.value.profile_id), 9, Pe)) : d("", !0),
            (o(!0), a(_, null, m(I.value, (t) => (o(), a("option", {
              key: t.id,
              value: t.id
            }, u(t.title), 9, Se))), 128))
          ], 40, Ve)
        ]),
        T.value ? (o(), a("p", $e, "Profile defaults apply at submission. Each field you edit overrides the profile; explicit driver options override unattended presets.")) : d("", !0),
        l("div", Ie, [
          l("label", Ne, [
            e[23] || (e[23] = l("span", { class: "tc-lbl" }, "Agent", -1)),
            l("select", {
              class: "tc-input kx-focus-halo",
              "aria-label": "Agent",
              value: s.value.agent,
              onChange: e[1] || (e[1] = (t) => F(t.target.value))
            }, [
              n(j) ? (o(), a("option", {
                key: 0,
                "aria-label": "Agent",
                value: s.value.agent
              }, "Unavailable agent: " + u(s.value.agent), 9, Re)) : d("", !0),
              (o(!0), a(_, null, m(k.value.agents, (t) => (o(), a("option", {
                key: t.id,
                value: t.id
              }, u(t.title), 9, We))), 128))
            ], 40, Oe)
          ]),
          l("label", je, [
            e[24] || (e[24] = l("span", { class: "tc-lbl" }, "Account", -1)),
            l("select", {
              class: "tc-input kx-focus-halo",
              value: s.value.account_id ?? "",
              onChange: e[2] || (e[2] = (t) => r({ account_id: t.target.value, account_pool: [] }))
            }, [
              l("option", De, "Auto (" + u(n(M).length) + " ready)", 1),
              n(D) ? (o(), a("option", {
                key: 0,
                value: s.value.account_id
              }, "Unavailable account: " + u(s.value.account_id), 9, Le)) : d("", !0),
              (o(!0), a(_, null, m(n(N), (t) => (o(), a("option", {
                key: t.id,
                value: t.id
              }, u(t.label), 9, qe))), 128))
            ], 40, Be)
          ])
        ]),
        s.value.account_id ? d("", !0) : (o(), a("label", Fe, [
          e[25] || (e[25] = l("span", { class: "tc-lbl" }, "Account pool (empty uses all usable accounts)", -1)),
          l("select", {
            multiple: "",
            class: "tc-input kx-focus-halo",
            value: s.value.account_pool ?? [],
            onChange: e[3] || (e[3] = (t) => r({ account_id: "", account_pool: Array.from(t.target.selectedOptions, (R) => R.value) }))
          }, [
            (o(!0), a(_, null, m(n(N), (t) => (o(), a("option", {
              key: t.id,
              value: t.id
            }, u(t.label), 9, He))), 128))
          ], 40, Ge)
        ])),
        n(j) ? (o(), a("p", ze, [
          e[26] || (e[26] = b("This saved agent no longer exists. ", -1)),
          k.value.agents.length ? (o(), a("button", {
            key: 0,
            type: "button",
            class: "ac-link kx-focus-outline",
            onClick: e[4] || (e[4] = (t) => F(n(fe)(k.value, P.value)))
          }, "Use default agent")) : d("", !0)
        ])) : d("", !0),
        n(D) ? (o(), a("p", Je, [
          b("This saved account no longer exists, is disabled or cannot run " + u(V.value) + ". ", 1),
          l("button", {
            type: "button",
            class: "ac-link kx-focus-outline",
            onClick: e[5] || (e[5] = (t) => r({ account_id: "" }))
          }, "Use Auto")
        ])) : d("", !0),
        n(N).length ? d("", !0) : (o(), a("p", Ke, "Add an account on Autocode → Accounts to run " + u(V.value) + ".", 1)),
        l("div", Me, [
          l("label", Qe, [
            e[27] || (e[27] = l("span", { class: "tc-lbl" }, "Image (required)", -1)),
            l("select", {
              class: "tc-input kx-focus-halo",
              value: s.value.image_id ?? "",
              onChange: e[6] || (e[6] = (t) => r({ image_id: t.target.value }))
            }, [
              n(B) ? (o(), a("option", {
                key: 0,
                value: s.value.image_id ?? ""
              }, u(s.value.image_id ? "Unavailable image: " + s.value.image_id : "Choose an image"), 9, Ye)) : d("", !0),
              (o(!0), a(_, null, m(n(E), (t) => (o(), a("option", {
                key: t.id,
                value: t.id
              }, u(t.label), 9, Ze))), 128))
            ], 40, Xe)
          ]),
          l("label", et, [
            e[29] || (e[29] = l("span", { class: "tc-lbl" }, "Workspace", -1)),
            l("select", {
              class: "tc-input kx-focus-halo",
              value: s.value.workspace_id ?? "",
              onChange: e[7] || (e[7] = (t) => r({ workspace_id: t.target.value }))
            }, [
              e[28] || (e[28] = l("option", { value: "" }, "Scratch directory", -1)),
              n(L) ? (o(), a("option", {
                key: 0,
                value: s.value.workspace_id
              }, "Unavailable workspace: " + u(s.value.workspace_id), 9, lt)) : d("", !0),
              (o(!0), a(_, null, m($.value, (t) => (o(), a("option", {
                key: t.id,
                value: t.id
              }, u(t.name) + u(t.writable ? "" : " (read-only)"), 9, ot))), 128))
            ], 40, tt)
          ])
        ]),
        n(E).length ? n(B) ? (o(), a("p", st, [
          b("This saved image is missing, is not usable or does not include " + u(V.value) + ". ", 1),
          l("button", {
            type: "button",
            class: "ac-link kx-focus-outline",
            onClick: e[8] || (e[8] = (t) => r({ image_id: n(E)[0].id }))
          }, "Use " + u(n(E)[0].label), 1)
        ])) : d("", !0) : (o(), a("p", at, "No image with " + u(V.value) + "; ask an administrator.", 1)),
        n(L) ? (o(), a("p", nt, [
          e[30] || (e[30] = b("This saved workspace no longer exists or is unavailable. ", -1)),
          l("button", {
            type: "button",
            class: "ac-link kx-focus-outline",
            onClick: e[9] || (e[9] = (t) => r({ workspace_id: "" }))
          }, "Use Scratch")
        ])) : d("", !0),
        l("label", it, [
          e[31] || (e[31] = l("span", { class: "tc-lbl" }, "Task (required)", -1)),
          l("textarea", {
            class: "tc-input kx-focus-halo",
            rows: "4",
            value: s.value.prompt,
            placeholder: "What should the agent do?",
            onInput: e[10] || (e[10] = (t) => r({ prompt: t.target.value }))
          }, null, 40, ut)
        ]),
        s.value.prompt?.trim() ? d("", !0) : (o(), a("p", dt, "Enter a task prompt.")),
        !s.value.image_id && !c.value.profile_id ? (o(), a("p", rt, "Choose an image.")) : d("", !0),
        l("label", ct, [
          l("input", {
            type: "checkbox",
            class: "kx-focus-outline",
            checked: s.value.include_input !== !1,
            onChange: e[11] || (e[11] = (t) => r({ include_input: t.target.checked }))
          }, null, 40, pt),
          e[32] || (e[32] = b(" Pass the node's input to the agent after the task ", -1))
        ]),
        H(ue, {
          class: "ac-advanced",
          label: "Advanced"
        }, {
          default: oe(() => [
            l("div", vt, [
              n(p)?.unattended ? (o(), a("label", ft, [
                l("input", {
                  type: "checkbox",
                  class: "kx-focus-outline",
                  checked: s.value.unattended !== !1,
                  onChange: e[12] || (e[12] = (t) => r({ unattended: t.target.checked }))
                }, null, 40, _t),
                e[33] || (e[33] = b(" Unattended: skip permission prompts ", -1))
              ])) : d("", !0),
              n(p)?.endpoints.length ? (o(), a(_, { key: 1 }, [
                l("label", gt, [
                  e[34] || (e[34] = l("span", { class: "tc-lbl" }, "Endpoint protocol", -1)),
                  l("select", {
                    class: "tc-input kx-focus-halo",
                    value: s.value.endpoint?.protocol ?? n(p).endpoints[0],
                    onChange: e[13] || (e[13] = (t) => O("protocol", t.target.value))
                  }, [
                    (o(!0), a(_, null, m(n(p).endpoints, (t) => (o(), a("option", {
                      key: t,
                      value: t
                    }, u(t), 9, mt))), 128))
                  ], 40, kt)
                ]),
                l("label", ht, [
                  e[35] || (e[35] = l("span", { class: "tc-lbl" }, "Endpoint URL", -1)),
                  l("input", {
                    class: "tc-input kx-focus-halo",
                    value: s.value.endpoint?.base_url,
                    placeholder: "Use account endpoint",
                    onChange: e[14] || (e[14] = (t) => O("base_url", t.target.value.trim()))
                  }, null, 40, bt)
                ]),
                l("label", yt, [
                  e[36] || (e[36] = l("span", { class: "tc-lbl" }, "Endpoint model", -1)),
                  l("input", {
                    class: "tc-input kx-focus-halo",
                    value: s.value.endpoint?.model,
                    onChange: e[15] || (e[15] = (t) => O("model", t.target.value.trim()))
                  }, null, 40, xt)
                ])
              ], 64)) : d("", !0),
              H(_e, {
                "model-value": s.value.tools,
                agent: s.value.agent ?? "",
                "onUpdate:modelValue": e[16] || (e[16] = (t) => r({ tools: t })),
                onInvalid: Y
              }, null, 8, ["model-value", "agent"]),
              n(p) ? (o(), ae(ge, {
                key: (c.value.profile_id ?? "") + n(p).id,
                options: n(p).options,
                "model-value": n(Q),
                defaults: { ...s.value.unattended !== !1 ? n(p).unattended : {}, ...T.value?.options },
                onInvalid: X,
                "onUpdate:modelValue": e[17] || (e[17] = (t) => r({ options: t }))
              }, null, 8, ["options", "model-value", "defaults"])) : d("", !0),
              n(h) ? (o(), a("p", Ct, "Driver options are invalid. These drafts and further changes are not applied to the workflow until all options are valid.")) : d("", !0),
              l("label", wt, [
                e[37] || (e[37] = l("span", { class: "tc-lbl" }, "Run timeout", -1)),
                l("input", {
                  class: "tc-input tc-mono kx-focus-halo",
                  value: s.value.run_timeout,
                  placeholder: "Use configured timeout",
                  onChange: e[18] || (e[18] = (t) => r({ run_timeout: t.target.value.trim() }))
                }, null, 40, Tt)
              ]),
              l("label", At, [
                e[38] || (e[38] = l("span", { class: "tc-lbl" }, "Git repository", -1)),
                l("input", {
                  class: "tc-input tc-mono kx-focus-halo",
                  value: s.value.repo_url,
                  placeholder: "optional",
                  onChange: e[19] || (e[19] = (t) => r({ repo_url: t.target.value }))
                }, null, 40, Ut)
              ]),
              l("label", Et, [
                e[39] || (e[39] = l("span", { class: "tc-lbl" }, "Repository ref", -1)),
                l("input", {
                  class: "tc-input tc-mono kx-focus-halo",
                  "aria-label": "Repository ref",
                  value: s.value.repo_ref,
                  placeholder: "Default branch",
                  onChange: e[20] || (e[20] = (t) => r({ repo_ref: t.target.value.trim() }))
                }, null, 40, Vt)
              ])
            ])
          ]),
          _: 1
        }),
        e[40] || (e[40] = se('<p class="tc-hint">Output: <code>run_id</code>, <code>status</code>, <code>answer</code>, <code>error</code>, <code>usage</code>, <code>agent</code>, <code>account_id</code>; next nodes read them as <code>output.answer</code>.</p>', 1))
      ], 64)) : (o(), a("div", Ue, "Loading agents…"))
    ]));
  }
});
export {
  Rt as default
};
