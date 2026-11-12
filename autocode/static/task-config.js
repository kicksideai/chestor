import { o as Y, s as v, r as Z, g as rr, f as L, e as or, h as ar, i as er, t as tr, a as pr, b as cr, u as ir, W as nr } from "./dto-B0C2sWl2.js";
import { defineComponent as sr, computed as k, ref as m, watch as lr, openBlock as e, createElementBlock as t, toDisplayString as n, createCommentVNode as s, Fragment as g, createElementVNode as a, renderList as x, unref as c, createTextVNode as h, createBlock as ur, createStaticVNode as dr, nextTick as vr } from "vue";
import { s as gr, a as w, e as mr } from "./presentation-BuuH51nX.js";
import { e as fr, u as xr, d as hr, _ as br } from "./driver-options.vue_vue_type_script_setup_true_lang-N3_dbeBI.js";
import "@iconify/vue";
import { define as yr } from "@wippy-fe/proxy";
const kr = Y({
  tools: tr.optional(),
  isolation: er(["shared", "worktree"]).optional(),
  profile_id: v().optional(),
  account_pool: ar(v()).optional(),
  endpoint: or.optional(),
  agent: v().optional(),
  account_id: v().optional(),
  image_id: v().optional(),
  workspace_id: v().optional(),
  prompt: v().optional(),
  include_input: L().optional(),
  unattended: L().optional(),
  options: Z(rr()).optional(),
  run_timeout: v().max(64).optional(),
  repo_url: v().optional(),
  repo_ref: v().optional()
}).strict(), wr = { class: "tc" }, _r = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, Cr = {
  key: 1,
  class: "kx-err inline"
}, Tr = {
  key: 2,
  class: "kx-loading"
}, zr = { class: "tc-field" }, Ar = ["value"], Ur = ["value"], Er = ["value"], Sr = {
  key: 0,
  class: "tc-hint"
}, Pr = { class: "tc-pair" }, Vr = { class: "tc-field" }, Wr = ["value"], jr = ["value"], Rr = ["value"], Or = { class: "tc-field" }, Ir = ["value"], Dr = { value: "" }, Mr = ["value"], Nr = ["value"], $r = {
  key: 1,
  class: "tc-field"
}, Br = ["value"], Fr = ["value"], Lr = {
  key: 2,
  class: "tc-hint",
  role: "alert"
}, qr = {
  key: 3,
  class: "tc-hint",
  role: "alert"
}, Hr = {
  key: 4,
  class: "tc-hint"
}, Gr = { class: "tc-pair" }, Kr = { class: "tc-field" }, Jr = ["value"], Qr = ["value"], Xr = ["value"], Yr = { class: "tc-field" }, Zr = ["value"], ro = ["value"], oo = ["value"], ao = {
  key: 5,
  class: "tc-hint",
  role: "alert"
}, eo = {
  key: 6,
  class: "tc-hint",
  role: "alert"
}, to = { class: "tc-field" }, po = ["value"], co = {
  key: 7,
  class: "tc-hint",
  role: "alert"
}, io = { class: "tc-field" }, no = ["value"], so = {
  key: 8,
  class: "kx-err",
  role: "alert"
}, lo = {
  key: 9,
  class: "kx-err",
  role: "alert"
}, uo = { class: "tc-check" }, vo = ["checked"], go = { class: "ac-advanced" }, mo = { class: "tc" }, fo = {
  key: 0,
  class: "tc-check"
}, xo = ["checked"], ho = { class: "tc-field" }, bo = ["value"], yo = ["value"], ko = { class: "tc-field" }, wo = ["value"], _o = { class: "tc-field" }, Co = ["value"], To = {
  key: 3,
  class: "kx-err",
  role: "alert"
}, zo = { class: "tc-field" }, Ao = ["value"], Uo = { class: "tc-field" }, Eo = ["value"], So = { class: "tc-field" }, Po = ["value"], Vo = /* @__PURE__ */ sr({
  __name: "task-config",
  setup(q) {
    const H = pr(), O = cr(), _ = k(() => kr.safeParse(H.value.config ?? {})), C = k(() => _.value.success ? "" : "Workflow configuration is invalid."), u = m(_.value.success ? _.value.data : {});
    lr(_, (i) => {
      if (!i.success) return;
      const r = i.data;
      r && Object.keys(r).length ? (u.value = r, b.value = !1) : (u.value = {}, F());
    });
    const f = m(null), E = m([]), S = m([]), P = m([]), V = m([]), T = k(() => V.value.find((i) => i.id === u.value.profile_id)), p = k(() => fr(u.value, T.value)), z = m(""), b = m(!1), {
      driver: d,
      agentAccounts: W,
      ready: G,
      agentImages: A,
      invalidAgent: I,
      invalidImage: D,
      invalidAccount: M,
      invalidWorkspace: N,
      invalidOptions: y,
      optionValues: K,
      initialSelection: $
    } = xr(p, {
      catalog: () => f.value,
      accounts: () => E.value,
      images: () => S.value,
      workspaces: () => P.value
    }, "saved"), U = k(() => d.value?.title ?? u.value.agent ?? "this agent");
    function l(i) {
      const r = { ...u.value, ...i };
      if (u.value = r, y.value > 0) {
        b.value = !0;
        return;
      }
      b.value = !1, O("config-changed", r);
    }
    function j(i, r) {
      l({ endpoint: {
        protocol: p.value.endpoint?.protocol ?? d.value?.endpoints[0] ?? "",
        base_url: p.value.endpoint?.base_url ?? "",
        ...p.value.endpoint,
        [i]: r
      } });
    }
    function J(i) {
      y.value = i, !i && b.value && vr(() => {
        !y.value && b.value && l({});
      });
    }
    function B(i) {
      l({ agent: i, account_id: "", image_id: S.value.find((r) => r.usable && r.agents.includes(i))?.id, options: {} });
    }
    function Q(i) {
      const r = i ? { profile_id: i, prompt: u.value.prompt, include_input: u.value.include_input } : { ...$(), profile_id: void 0, prompt: u.value.prompt };
      u.value = r, b.value = !1, y.value = 0, O("config-changed", r);
    }
    function F() {
      !f.value || C.value || Object.keys(u.value).length || l({ ...$(), include_input: !0 });
    }
    return ir(gr(async () => {
      try {
        const [i, r, o, R, X] = await Promise.all([w.catalog(), w.accounts(), w.images(), w.workspaces(), w.profiles()]);
        V.value = X, f.value = i, E.value = r, S.value = o, P.value = R.workspaces, z.value = "", F();
      } catch (i) {
        z.value = mr(i, "Could not load the agents.");
      }
    })), (i, r) => (e(), t("div", wr, [
      C.value ? (e(), t("p", _r, n(C.value), 1)) : s("", !0),
      z.value ? (e(), t("p", Cr, n(z.value), 1)) : f.value ? C.value ? s("", !0) : (e(), t(g, { key: 3 }, [
        a("label", zr, [
          r[22] || (r[22] = a("span", { class: "tc-lbl" }, "Profile", -1)),
          a("select", {
            class: "tc-input kx-focus-halo",
            "aria-label": "Profile",
            value: u.value.profile_id ?? "",
            onChange: r[0] || (r[0] = (o) => Q(o.target.value))
          }, [
            r[21] || (r[21] = a("option", { value: "" }, "Custom task", -1)),
            u.value.profile_id && !T.value ? (e(), t("option", {
              key: 0,
              value: u.value.profile_id
            }, "Unavailable profile: " + n(u.value.profile_id), 9, Ur)) : s("", !0),
            (e(!0), t(g, null, x(V.value, (o) => (e(), t("option", {
              key: o.id,
              value: o.id
            }, n(o.title), 9, Er))), 128))
          ], 40, Ar)
        ]),
        T.value ? (e(), t("p", Sr, "Profile defaults apply at submission. Each field you edit overrides the profile; explicit driver options override unattended presets.")) : s("", !0),
        a("div", Pr, [
          a("label", Vr, [
            r[23] || (r[23] = a("span", { class: "tc-lbl" }, "Agent", -1)),
            a("select", {
              class: "tc-input kx-focus-halo",
              "aria-label": "Agent",
              value: p.value.agent,
              onChange: r[1] || (r[1] = (o) => B(o.target.value))
            }, [
              c(I) ? (e(), t("option", {
                key: 0,
                "aria-label": "Agent",
                value: p.value.agent
              }, "Unavailable agent: " + n(p.value.agent), 9, jr)) : s("", !0),
              (e(!0), t(g, null, x(f.value.agents, (o) => (e(), t("option", {
                key: o.id,
                value: o.id
              }, n(o.title), 9, Rr))), 128))
            ], 40, Wr)
          ]),
          a("label", Or, [
            r[24] || (r[24] = a("span", { class: "tc-lbl" }, "Account", -1)),
            a("select", {
              class: "tc-input kx-focus-halo",
              value: p.value.account_id ?? "",
              onChange: r[2] || (r[2] = (o) => l({ account_id: o.target.value, account_pool: [] }))
            }, [
              a("option", Dr, "Auto (" + n(c(G).length) + " ready)", 1),
              c(M) ? (e(), t("option", {
                key: 0,
                value: p.value.account_id
              }, "Unavailable account: " + n(p.value.account_id), 9, Mr)) : s("", !0),
              (e(!0), t(g, null, x(c(W), (o) => (e(), t("option", {
                key: o.id,
                value: o.id
              }, n(o.label), 9, Nr))), 128))
            ], 40, Ir)
          ])
        ]),
        p.value.account_id ? s("", !0) : (e(), t("label", $r, [
          r[25] || (r[25] = a("span", { class: "tc-lbl" }, "Account pool (empty uses all usable accounts)", -1)),
          a("select", {
            multiple: "",
            class: "tc-input kx-focus-halo",
            value: p.value.account_pool ?? [],
            onChange: r[3] || (r[3] = (o) => l({ account_id: "", account_pool: Array.from(o.target.selectedOptions, (R) => R.value) }))
          }, [
            (e(!0), t(g, null, x(c(W), (o) => (e(), t("option", {
              key: o.id,
              value: o.id
            }, n(o.label), 9, Fr))), 128))
          ], 40, Br)
        ])),
        c(I) ? (e(), t("p", Lr, [
          r[26] || (r[26] = h("This saved agent no longer exists. ", -1)),
          f.value.agents.length ? (e(), t("button", {
            key: 0,
            type: "button",
            class: "ac-link kx-focus-outline",
            onClick: r[4] || (r[4] = (o) => B(c(hr)(f.value, E.value)))
          }, "Use default agent")) : s("", !0)
        ])) : s("", !0),
        c(M) ? (e(), t("p", qr, [
          h("This saved account no longer exists, is disabled or cannot run " + n(U.value) + ". ", 1),
          a("button", {
            type: "button",
            class: "ac-link kx-focus-outline",
            onClick: r[5] || (r[5] = (o) => l({ account_id: "" }))
          }, "Use Auto")
        ])) : s("", !0),
        c(W).length ? s("", !0) : (e(), t("p", Hr, "Add an account on Autocode → Accounts to run " + n(U.value) + ".", 1)),
        a("div", Gr, [
          a("label", Kr, [
            r[27] || (r[27] = a("span", { class: "tc-lbl" }, "Image (required)", -1)),
            a("select", {
              class: "tc-input kx-focus-halo",
              value: p.value.image_id ?? "",
              onChange: r[6] || (r[6] = (o) => l({ image_id: o.target.value }))
            }, [
              c(D) ? (e(), t("option", {
                key: 0,
                value: p.value.image_id ?? ""
              }, n(p.value.image_id ? "Unavailable image: " + p.value.image_id : "Choose an image"), 9, Qr)) : s("", !0),
              (e(!0), t(g, null, x(c(A), (o) => (e(), t("option", {
                key: o.id,
                value: o.id
              }, n(o.label), 9, Xr))), 128))
            ], 40, Jr)
          ]),
          a("label", Yr, [
            r[29] || (r[29] = a("span", { class: "tc-lbl" }, "Workspace", -1)),
            a("select", {
              class: "tc-input kx-focus-halo",
              value: p.value.workspace_id ?? "",
              onChange: r[7] || (r[7] = (o) => l({ workspace_id: o.target.value }))
            }, [
              r[28] || (r[28] = a("option", { value: "" }, "Scratch directory", -1)),
              c(N) ? (e(), t("option", {
                key: 0,
                value: p.value.workspace_id
              }, "Unavailable workspace: " + n(p.value.workspace_id), 9, ro)) : s("", !0),
              (e(!0), t(g, null, x(P.value, (o) => (e(), t("option", {
                key: o.id,
                value: o.id
              }, n(o.name) + n(o.writable ? "" : " (read-only)"), 9, oo))), 128))
            ], 40, Zr)
          ])
        ]),
        c(A).length ? c(D) ? (e(), t("p", eo, [
          h("This saved image is missing, is not usable or does not include " + n(U.value) + ". ", 1),
          a("button", {
            type: "button",
            class: "ac-link kx-focus-outline",
            onClick: r[8] || (r[8] = (o) => l({ image_id: c(A)[0].id }))
          }, "Use " + n(c(A)[0].label), 1)
        ])) : s("", !0) : (e(), t("p", ao, "No image with " + n(U.value) + "; ask an administrator.", 1)),
        a("label", to, [
          r[31] || (r[31] = h("Workspace isolation ", -1)),
          a("select", {
            class: "tc-input kx-focus-halo",
            "aria-label": "Workspace isolation",
            value: p.value.isolation ?? "",
            onChange: r[9] || (r[9] = (o) => l({ isolation: o.target.value || void 0 }))
          }, [...r[30] || (r[30] = [
            a("option", { value: "" }, "Workspace default", -1),
            a("option", { value: "shared" }, "Shared checkout", -1),
            a("option", { value: "worktree" }, "Private git worktree", -1)
          ])], 40, po)
        ]),
        c(N) ? (e(), t("p", co, [
          r[32] || (r[32] = h("This saved workspace no longer exists or is unavailable. ", -1)),
          a("button", {
            type: "button",
            class: "ac-link kx-focus-outline",
            onClick: r[10] || (r[10] = (o) => l({ workspace_id: "" }))
          }, "Use Scratch")
        ])) : s("", !0),
        a("label", io, [
          r[33] || (r[33] = a("span", { class: "tc-lbl" }, "Task (required)", -1)),
          a("textarea", {
            class: "tc-input kx-focus-halo",
            rows: "4",
            value: p.value.prompt,
            placeholder: "What should the agent do?",
            onInput: r[11] || (r[11] = (o) => l({ prompt: o.target.value }))
          }, null, 40, no)
        ]),
        p.value.prompt?.trim() ? s("", !0) : (e(), t("p", so, "Enter a task prompt.")),
        !p.value.image_id && !u.value.profile_id ? (e(), t("p", lo, "Choose an image.")) : s("", !0),
        a("label", uo, [
          a("input", {
            type: "checkbox",
            class: "kx-focus-outline",
            checked: p.value.include_input !== !1,
            onChange: r[12] || (r[12] = (o) => l({ include_input: o.target.checked }))
          }, null, 40, vo),
          r[34] || (r[34] = h(" Pass the node's input to the agent after the task ", -1))
        ]),
        a("details", go, [
          r[42] || (r[42] = a("summary", { class: "kx-focus-outline" }, "Advanced", -1)),
          a("div", mo, [
            c(d)?.unattended ? (e(), t("label", fo, [
              a("input", {
                type: "checkbox",
                class: "kx-focus-outline",
                checked: p.value.unattended !== !1,
                onChange: r[13] || (r[13] = (o) => l({ unattended: o.target.checked }))
              }, null, 40, xo),
              r[35] || (r[35] = h(" Unattended: skip permission prompts ", -1))
            ])) : s("", !0),
            c(d)?.endpoints.length ? (e(), t(g, { key: 1 }, [
              a("label", ho, [
                r[36] || (r[36] = a("span", { class: "tc-lbl" }, "Endpoint protocol", -1)),
                a("select", {
                  class: "tc-input kx-focus-halo",
                  value: p.value.endpoint?.protocol ?? c(d).endpoints[0],
                  onChange: r[14] || (r[14] = (o) => j("protocol", o.target.value))
                }, [
                  (e(!0), t(g, null, x(c(d).endpoints, (o) => (e(), t("option", {
                    key: o,
                    value: o
                  }, n(o), 9, yo))), 128))
                ], 40, bo)
              ]),
              a("label", ko, [
                r[37] || (r[37] = a("span", { class: "tc-lbl" }, "Endpoint URL", -1)),
                a("input", {
                  class: "tc-input kx-focus-halo",
                  value: p.value.endpoint?.base_url,
                  placeholder: "Use account endpoint",
                  onChange: r[15] || (r[15] = (o) => j("base_url", o.target.value.trim()))
                }, null, 40, wo)
              ]),
              a("label", _o, [
                r[38] || (r[38] = a("span", { class: "tc-lbl" }, "Endpoint model", -1)),
                a("input", {
                  class: "tc-input kx-focus-halo",
                  value: p.value.endpoint?.model,
                  onChange: r[16] || (r[16] = (o) => j("model", o.target.value.trim()))
                }, null, 40, Co)
              ])
            ], 64)) : s("", !0),
            c(d) ? (e(), ur(br, {
              key: (u.value.profile_id ?? "") + c(d).id,
              options: c(d).options,
              "model-value": c(K),
              defaults: { ...p.value.unattended !== !1 ? c(d).unattended : {}, ...T.value?.options },
              onInvalid: J,
              "onUpdate:modelValue": r[17] || (r[17] = (o) => l({ options: o }))
            }, null, 8, ["options", "model-value", "defaults"])) : s("", !0),
            c(y) ? (e(), t("p", To, "Driver options are invalid. These drafts and further changes are not applied to the workflow until all options are valid.")) : s("", !0),
            a("label", zo, [
              r[39] || (r[39] = a("span", { class: "tc-lbl" }, "Run timeout", -1)),
              a("input", {
                class: "tc-input tc-mono kx-focus-halo",
                value: p.value.run_timeout,
                placeholder: "Use configured timeout",
                onChange: r[18] || (r[18] = (o) => l({ run_timeout: o.target.value.trim() }))
              }, null, 40, Ao)
            ]),
            a("label", Uo, [
              r[40] || (r[40] = a("span", { class: "tc-lbl" }, "Git repository", -1)),
              a("input", {
                class: "tc-input tc-mono kx-focus-halo",
                value: p.value.repo_url,
                placeholder: "optional",
                onChange: r[19] || (r[19] = (o) => l({ repo_url: o.target.value }))
              }, null, 40, Eo)
            ]),
            a("label", So, [
              r[41] || (r[41] = a("span", { class: "tc-lbl" }, "Repository ref", -1)),
              a("input", {
                class: "tc-input tc-mono kx-focus-halo",
                "aria-label": "Repository ref",
                value: p.value.repo_ref,
                placeholder: "Default branch",
                onChange: r[20] || (r[20] = (o) => l({ repo_ref: o.target.value.trim() }))
              }, null, 40, Po)
            ])
          ])
        ]),
        r[43] || (r[43] = dr('<p class="tc-hint">Output: <code>run_id</code>, <code>status</code>, <code>answer</code>, <code>error</code>, <code>usage</code>, <code>agent</code>, <code>account_id</code>; next nodes read them as <code>output.answer</code>.</p>', 1))
      ], 64)) : (e(), t("div", Tr, "Loading agents…"))
    ]));
  }
}), Wo = ':root{--p-form-field-padding-x: .75rem;--p-form-field-padding-y: .5rem;--p-form-field-sm-padding-x: .625rem;--p-form-field-sm-padding-y: .375rem;--p-form-field-lg-padding-x: .875rem;--p-form-field-lg-padding-y: .625rem;--p-form-field-border-radius: .375rem;--p-form-field-transition-duration: .2s;--p-form-field-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), 0 1px 2px 0 rgba(18, 18, 23, .05);--p-focus-ring-width: 1px;--p-focus-ring-style: solid;--p-focus-ring-color: color-mix(in srgb, var(--p-primary-color) 100%, transparent);--p-focus-ring-offset: 2px;--p-toggleswitch-width: 2.5rem;--p-toggleswitch-height: 1.5rem;--p-toggleswitch-border-radius: 30px;--p-toggleswitch-gap: .25rem;--p-toggleswitch-border-width: 1px;--p-toggleswitch-transition-duration: .2s;--p-toggleswitch-slide-duration: .2s;--p-toggleswitch-handle-size: 1rem;--p-toggleswitch-handle-border-radius: 9999px}:root{color-scheme:light dark;--p-primary: rgb(0, 95, 178);--p-primary-50: color-mix(in srgb, var(--p-primary) 5%, white);--p-primary-100: color-mix(in srgb, var(--p-primary) 10%, white);--p-primary-200: color-mix(in srgb, var(--p-primary) 20%, white);--p-primary-300: color-mix(in srgb, var(--p-primary) 30%, white);--p-primary-400: color-mix(in srgb, var(--p-primary) 40%, white);--p-primary-500: var(--p-primary);--p-primary-600: color-mix(in srgb, var(--p-primary) 80%, black);--p-primary-700: color-mix(in srgb, var(--p-primary) 70%, black);--p-primary-800: color-mix(in srgb, var(--p-primary) 60%, black);--p-primary-900: color-mix(in srgb, var(--p-primary) 50%, black);--p-primary-950: color-mix(in srgb, var(--p-primary) 40%, black);--p-secondary: #6f7385;--p-secondary-50: color-mix(in srgb, var(--p-secondary) 5%, white);--p-secondary-100: color-mix(in srgb, var(--p-secondary) 10%, white);--p-secondary-200: color-mix(in srgb, var(--p-secondary) 20%, white);--p-secondary-300: color-mix(in srgb, var(--p-secondary) 35%, white);--p-secondary-400: color-mix(in srgb, var(--p-secondary) 65%, white);--p-secondary-500: var(--p-secondary);--p-secondary-600: color-mix(in srgb, var(--p-secondary) 80%, black);--p-secondary-700: color-mix(in srgb, var(--p-secondary) 65%, black);--p-secondary-800: color-mix(in srgb, var(--p-secondary) 55%, black);--p-secondary-900: color-mix(in srgb, var(--p-secondary) 50%, black);--p-secondary-950: color-mix(in srgb, var(--p-secondary) 30%, black);--p-danger: rgb(239, 68, 68);--p-danger-50: color-mix(in srgb, var(--p-danger) 5%, white);--p-danger-100: color-mix(in srgb, var(--p-danger) 10%, white);--p-danger-200: color-mix(in srgb, var(--p-danger) 20%, white);--p-danger-300: color-mix(in srgb, var(--p-danger) 30%, white);--p-danger-400: color-mix(in srgb, var(--p-danger) 40%, white);--p-danger-500: var(--p-danger);--p-danger-600: color-mix(in srgb, var(--p-danger) 80%, black);--p-danger-700: color-mix(in srgb, var(--p-danger) 70%, black);--p-danger-800: color-mix(in srgb, var(--p-danger) 60%, black);--p-danger-900: color-mix(in srgb, var(--p-danger) 50%, black);--p-danger-950: color-mix(in srgb, var(--p-danger) 40%, black);--p-success: rgb(34, 197, 94);--p-success-50: color-mix(in srgb, var(--p-success) 5%, white);--p-success-100: color-mix(in srgb, var(--p-success) 10%, white);--p-success-200: color-mix(in srgb, var(--p-success) 20%, white);--p-success-300: color-mix(in srgb, var(--p-success) 30%, white);--p-success-400: color-mix(in srgb, var(--p-success) 40%, white);--p-success-500: var(--p-success);--p-success-600: color-mix(in srgb, var(--p-success) 80%, black);--p-success-700: color-mix(in srgb, var(--p-success) 70%, black);--p-success-800: color-mix(in srgb, var(--p-success) 60%, black);--p-success-900: color-mix(in srgb, var(--p-success) 50%, black);--p-success-950: color-mix(in srgb, var(--p-success) 40%, black);--p-warn: rgb(249, 115, 22);--p-warn-50: color-mix(in srgb, var(--p-warn) 5%, white);--p-warn-100: color-mix(in srgb, var(--p-warn) 10%, white);--p-warn-200: color-mix(in srgb, var(--p-warn) 20%, white);--p-warn-300: color-mix(in srgb, var(--p-warn) 30%, white);--p-warn-400: color-mix(in srgb, var(--p-warn) 40%, white);--p-warn-500: var(--p-warn);--p-warn-600: color-mix(in srgb, var(--p-warn) 80%, black);--p-warn-700: color-mix(in srgb, var(--p-warn) 70%, black);--p-warn-800: color-mix(in srgb, var(--p-warn) 60%, black);--p-warn-900: color-mix(in srgb, var(--p-warn) 50%, black);--p-warn-950: color-mix(in srgb, var(--p-warn) 40%, black);--p-info: rgb(14, 165, 233);--p-info-50: color-mix(in srgb, var(--p-info) 5%, white);--p-info-100: color-mix(in srgb, var(--p-info) 10%, white);--p-info-200: color-mix(in srgb, var(--p-info) 20%, white);--p-info-300: color-mix(in srgb, var(--p-info) 30%, white);--p-info-400: color-mix(in srgb, var(--p-info) 40%, white);--p-info-500: var(--p-info);--p-info-600: color-mix(in srgb, var(--p-info) 80%, black);--p-info-700: color-mix(in srgb, var(--p-info) 70%, black);--p-info-800: color-mix(in srgb, var(--p-info) 60%, black);--p-info-900: color-mix(in srgb, var(--p-info) 50%, black);--p-info-950: color-mix(in srgb, var(--p-info) 40%, black);--p-help: rgb(168, 85, 247);--p-help-50: color-mix(in srgb, var(--p-help) 5%, white);--p-help-100: color-mix(in srgb, var(--p-help) 10%, white);--p-help-200: color-mix(in srgb, var(--p-help) 20%, white);--p-help-300: color-mix(in srgb, var(--p-help) 30%, white);--p-help-400: color-mix(in srgb, var(--p-help) 40%, white);--p-help-500: var(--p-help);--p-help-600: color-mix(in srgb, var(--p-help) 80%, black);--p-help-700: color-mix(in srgb, var(--p-help) 70%, black);--p-help-800: color-mix(in srgb, var(--p-help) 60%, black);--p-help-900: color-mix(in srgb, var(--p-help) 50%, black);--p-help-950: color-mix(in srgb, var(--p-help) 40%, black);--p-accent: rgb(20, 184, 166);--p-accent-50: color-mix(in srgb, var(--p-accent) 5%, white);--p-accent-100: color-mix(in srgb, var(--p-accent) 10%, white);--p-accent-200: color-mix(in srgb, var(--p-accent) 20%, white);--p-accent-300: color-mix(in srgb, var(--p-accent) 30%, white);--p-accent-400: color-mix(in srgb, var(--p-accent) 40%, white);--p-accent-500: var(--p-accent);--p-accent-600: color-mix(in srgb, var(--p-accent) 80%, black);--p-accent-700: color-mix(in srgb, var(--p-accent) 70%, black);--p-accent-800: color-mix(in srgb, var(--p-accent) 60%, black);--p-accent-900: color-mix(in srgb, var(--p-accent) 50%, black);--p-accent-950: color-mix(in srgb, var(--p-accent) 40%, black);--p-surface-0: #ffffff;--p-surface-50: #fafafa;--p-surface-100: #f5f5f5;--p-surface-200: #e5e5e5;--p-surface-300: #d4d4d4;--p-surface-400: #a3a3a3;--p-surface-500: #737373;--p-surface-600: #525252;--p-surface-700: #404040;--p-surface-800: #262626;--p-surface-850: color-mix(in srgb, var(--p-surface-800) 50%, var(--p-surface-900));--p-surface-900: #171717;--p-surface-950: #0a0a0a;--p-content-border-radius: 6px;--p-font-heading-family: var(--v-font-family-head, Arial);--p-font-heading-scale: 1;--p-font-heading-line-height: 1.5;--p-font-heading-letter-spacing: normal;--p-font-heading-stretch: normal;--p-font-heading-variation-settings: normal;--p-font-body-scale: 1;--p-font-body-line-height: 1.5;--p-font-body-letter-spacing: normal;--p-font-body-stretch: normal;--p-font-body-variation-settings: normal;--p-font-mono-family: ui-monospace}:root{--p-primary-color: var(--p-primary-500);--p-primary-contrast-color: var(--p-surface-0);--p-primary-hover-color: var(--p-primary-600);--p-primary-active-color: var(--p-primary-700);--p-secondary-color: var(--p-secondary-500);--p-secondary-contrast-color: var(--p-surface-0);--p-secondary-hover-color: var(--p-secondary-600);--p-secondary-active-color: var(--p-secondary-700);--p-danger-color: var(--p-danger-500);--p-danger-contrast-color: var(--p-surface-0);--p-danger-hover-color: var(--p-danger-600);--p-danger-active-color: var(--p-danger-700);--p-success-color: var(--p-success-500);--p-success-contrast-color: var(--p-surface-0);--p-success-hover-color: var(--p-success-600);--p-success-active-color: var(--p-success-700);--p-warn-color: var(--p-warn-500);--p-warn-contrast-color: var(--p-surface-0);--p-warn-hover-color: var(--p-warn-600);--p-warn-active-color: var(--p-warn-700);--p-info-color: var(--p-info-500);--p-info-contrast-color: var(--p-surface-0);--p-info-hover-color: var(--p-info-600);--p-info-active-color: var(--p-info-700);--p-help-color: var(--p-help-500);--p-help-contrast-color: var(--p-surface-0);--p-help-hover-color: var(--p-help-600);--p-help-active-color: var(--p-help-700);--p-accent-color: var(--p-accent-500);--p-accent-contrast-color: var(--p-surface-0);--p-accent-hover-color: var(--p-accent-600);--p-accent-active-color: var(--p-accent-700);--p-content-border-color: var(--p-surface-200);--p-content-hover-background: var(--p-surface-100);--p-content-hover-color: var(--p-surface-800);--p-highlight-background: var(--p-primary-50);--p-highlight-color: var(--p-primary-700);--p-highlight-focus-background: var(--p-primary-100);--p-highlight-focus-color: var(--p-primary-800);--p-content-background: var(--p-surface-0);--p-text-color: var(--p-surface-700);--p-text-hover-color: var(--p-surface-800);--p-text-muted-color: var(--p-surface-500);--p-text-hover-muted-color: var(--p-surface-600)}@media(prefers-color-scheme:dark){:root:not(.w-theme-light){--p-surface-D: #fff;--p-surface-0: #fff;--p-surface-50: #fafafa;--p-surface-100: #f4f4f5;--p-surface-200: #e4e4e7;--p-surface-300: #d4d4d8;--p-surface-400: #a1a1aa;--p-surface-500: #71717a;--p-surface-600: #545250;--p-surface-700: #403e3c;--p-surface-800: #2b2927;--p-surface-850: color-mix(in srgb, var(--p-surface-800) 50%, var(--p-surface-900));--p-surface-900: #1c1a19;--p-surface-950: #0f0e0d;--p-primary: rgb(0, 125, 178);--p-primary-50: color-mix(in srgb, var(--p-primary) 5%, white);--p-primary-100: color-mix(in srgb, var(--p-primary) 10%, white);--p-primary-200: color-mix(in srgb, var(--p-primary) 20%, white);--p-primary-300: color-mix(in srgb, var(--p-primary) 30%, white);--p-primary-400: color-mix(in srgb, var(--p-primary) 40%, white);--p-primary-500: var(--p-primary);--p-primary-600: color-mix(in srgb, var(--p-primary) 80%, black);--p-primary-700: color-mix(in srgb, var(--p-primary) 70%, black);--p-primary-800: color-mix(in srgb, var(--p-primary) 60%, black);--p-primary-900: color-mix(in srgb, var(--p-primary) 50%, black);--p-primary-950: color-mix(in srgb, var(--p-primary) 40%, black);--p-primary-color: var(--p-primary-400);--p-primary-contrast-color: var(--p-surface-900);--p-primary-hover-color: var(--p-primary-300);--p-primary-active-color: var(--p-primary-200);--p-secondary-color: var(--p-secondary-400);--p-secondary-contrast-color: var(--p-surface-900);--p-secondary-hover-color: var(--p-secondary-300);--p-secondary-active-color: var(--p-secondary-200);--p-danger-color: var(--p-danger-400);--p-danger-contrast-color: var(--p-surface-900);--p-danger-hover-color: var(--p-danger-300);--p-danger-active-color: var(--p-danger-200);--p-success-color: var(--p-success-400);--p-success-contrast-color: var(--p-surface-900);--p-success-hover-color: var(--p-success-300);--p-success-active-color: var(--p-success-200);--p-warn-color: var(--p-warn-400);--p-warn-contrast-color: var(--p-surface-900);--p-warn-hover-color: var(--p-warn-300);--p-warn-active-color: var(--p-warn-200);--p-info-color: var(--p-info-400);--p-info-contrast-color: var(--p-surface-900);--p-info-hover-color: var(--p-info-300);--p-info-active-color: var(--p-info-200);--p-help-color: var(--p-help-400);--p-help-contrast-color: var(--p-surface-900);--p-help-hover-color: var(--p-help-300);--p-help-active-color: var(--p-help-200);--p-accent-color: var(--p-accent-400);--p-accent-contrast-color: var(--p-surface-900);--p-accent-hover-color: var(--p-accent-300);--p-accent-active-color: var(--p-accent-200);--p-content-border-color: var(--p-surface-700);--p-content-hover-background: var(--p-surface-800);--p-content-hover-color: var(--p-surface-0);--p-highlight-background: color-mix(in srgb, var(--p-primary-400), transparent 84%);--p-highlight-color: rgba(255, 255, 255, 87%);--p-highlight-focus-background: color-mix(in srgb, var(--p-primary-400), transparent 76%);--p-highlight-focus-color: rgba(255, 255, 255, 87%);--p-content-background: var(--p-surface-900);--p-text-color: var(--p-surface-0);--p-text-hover-color: var(--p-surface-0);--p-text-muted-color: var(--p-surface-400);--p-text-hover-muted-color: var(--p-surface-300)}}:root.w-theme-dark,.w-theme-dark{color-scheme:dark;--p-surface-D: #fff;--p-surface-0: #fff;--p-surface-50: #fafafa;--p-surface-100: #f4f4f5;--p-surface-200: #e4e4e7;--p-surface-300: #d4d4d8;--p-surface-400: #a1a1aa;--p-surface-500: #71717a;--p-surface-600: #545250;--p-surface-700: #403e3c;--p-surface-800: #2b2927;--p-surface-850: color-mix(in srgb, var(--p-surface-800) 50%, var(--p-surface-900));--p-surface-900: #1c1a19;--p-surface-950: #0f0e0d;--p-primary: rgb(0, 125, 178);--p-primary-50: color-mix(in srgb, var(--p-primary) 5%, white);--p-primary-100: color-mix(in srgb, var(--p-primary) 10%, white);--p-primary-200: color-mix(in srgb, var(--p-primary) 20%, white);--p-primary-300: color-mix(in srgb, var(--p-primary) 30%, white);--p-primary-400: color-mix(in srgb, var(--p-primary) 40%, white);--p-primary-500: var(--p-primary);--p-primary-600: color-mix(in srgb, var(--p-primary) 80%, black);--p-primary-700: color-mix(in srgb, var(--p-primary) 70%, black);--p-primary-800: color-mix(in srgb, var(--p-primary) 60%, black);--p-primary-900: color-mix(in srgb, var(--p-primary) 50%, black);--p-primary-950: color-mix(in srgb, var(--p-primary) 40%, black);--p-primary-color: var(--p-primary-400);--p-primary-contrast-color: var(--p-surface-900);--p-primary-hover-color: var(--p-primary-300);--p-primary-active-color: var(--p-primary-200);--p-secondary-color: var(--p-secondary-400);--p-secondary-contrast-color: var(--p-surface-900);--p-secondary-hover-color: var(--p-secondary-300);--p-secondary-active-color: var(--p-secondary-200);--p-danger-color: var(--p-danger-400);--p-danger-contrast-color: var(--p-surface-900);--p-danger-hover-color: var(--p-danger-300);--p-danger-active-color: var(--p-danger-200);--p-success-color: var(--p-success-400);--p-success-contrast-color: var(--p-surface-900);--p-success-hover-color: var(--p-success-300);--p-success-active-color: var(--p-success-200);--p-warn-color: var(--p-warn-400);--p-warn-contrast-color: var(--p-surface-900);--p-warn-hover-color: var(--p-warn-300);--p-warn-active-color: var(--p-warn-200);--p-info-color: var(--p-info-400);--p-info-contrast-color: var(--p-surface-900);--p-info-hover-color: var(--p-info-300);--p-info-active-color: var(--p-info-200);--p-help-color: var(--p-help-400);--p-help-contrast-color: var(--p-surface-900);--p-help-hover-color: var(--p-help-300);--p-help-active-color: var(--p-help-200);--p-accent-color: var(--p-accent-400);--p-accent-contrast-color: var(--p-surface-900);--p-accent-hover-color: var(--p-accent-300);--p-accent-active-color: var(--p-accent-200);--p-content-border-color: var(--p-surface-700);--p-content-hover-background: var(--p-surface-800);--p-content-hover-color: var(--p-surface-0);--p-highlight-background: color-mix(in srgb, var(--p-primary-400), transparent 84%);--p-highlight-color: rgba(255, 255, 255, 87%);--p-highlight-focus-background: color-mix(in srgb, var(--p-primary-400), transparent 76%);--p-highlight-focus-color: rgba(255, 255, 255, 87%);--p-content-background: var(--p-surface-900);--p-text-color: var(--p-surface-0);--p-text-hover-color: var(--p-surface-0);--p-text-muted-color: var(--p-surface-400);--p-text-hover-muted-color: var(--p-surface-300)}:root.w-theme-light,.w-theme-light{color-scheme:light;--p-surface-0: #ffffff;--p-surface-50: #fafafa;--p-surface-100: #f5f5f5;--p-surface-200: #e5e5e5;--p-surface-300: #d4d4d4;--p-surface-400: #a3a3a3;--p-surface-500: #737373;--p-surface-600: #525252;--p-surface-700: #404040;--p-surface-800: #262626;--p-surface-850: color-mix(in srgb, var(--p-surface-800) 50%, var(--p-surface-900));--p-surface-900: #171717;--p-surface-950: #0a0a0a;--p-primary: rgb(0, 95, 178);--p-primary-50: color-mix(in srgb, var(--p-primary) 5%, white);--p-primary-100: color-mix(in srgb, var(--p-primary) 10%, white);--p-primary-200: color-mix(in srgb, var(--p-primary) 20%, white);--p-primary-300: color-mix(in srgb, var(--p-primary) 30%, white);--p-primary-400: color-mix(in srgb, var(--p-primary) 40%, white);--p-primary-500: var(--p-primary);--p-primary-600: color-mix(in srgb, var(--p-primary) 80%, black);--p-primary-700: color-mix(in srgb, var(--p-primary) 70%, black);--p-primary-800: color-mix(in srgb, var(--p-primary) 60%, black);--p-primary-900: color-mix(in srgb, var(--p-primary) 50%, black);--p-primary-950: color-mix(in srgb, var(--p-primary) 40%, black);--p-primary-color: var(--p-primary-500);--p-primary-contrast-color: var(--p-surface-0);--p-primary-hover-color: var(--p-primary-600);--p-primary-active-color: var(--p-primary-700);--p-secondary-color: var(--p-secondary-500);--p-secondary-contrast-color: var(--p-surface-0);--p-secondary-hover-color: var(--p-secondary-600);--p-secondary-active-color: var(--p-secondary-700);--p-danger-color: var(--p-danger-500);--p-danger-contrast-color: var(--p-surface-0);--p-danger-hover-color: var(--p-danger-600);--p-danger-active-color: var(--p-danger-700);--p-success-color: var(--p-success-500);--p-success-contrast-color: var(--p-surface-0);--p-success-hover-color: var(--p-success-600);--p-success-active-color: var(--p-success-700);--p-warn-color: var(--p-warn-500);--p-warn-contrast-color: var(--p-surface-0);--p-warn-hover-color: var(--p-warn-600);--p-warn-active-color: var(--p-warn-700);--p-info-color: var(--p-info-500);--p-info-contrast-color: var(--p-surface-0);--p-info-hover-color: var(--p-info-600);--p-info-active-color: var(--p-info-700);--p-help-color: var(--p-help-500);--p-help-contrast-color: var(--p-surface-0);--p-help-hover-color: var(--p-help-600);--p-help-active-color: var(--p-help-700);--p-accent-color: var(--p-accent-500);--p-accent-contrast-color: var(--p-surface-0);--p-accent-hover-color: var(--p-accent-600);--p-accent-active-color: var(--p-accent-700);--p-content-border-color: var(--p-surface-200);--p-content-hover-background: var(--p-surface-100);--p-content-hover-color: var(--p-surface-800);--p-highlight-background: var(--p-primary-50);--p-highlight-color: var(--p-primary-700);--p-highlight-focus-background: var(--p-primary-100);--p-highlight-focus-color: var(--p-primary-800);--p-content-background: var(--p-surface-0);--p-text-color: var(--p-surface-700);--p-text-hover-color: var(--p-surface-800);--p-text-muted-color: var(--p-surface-500);--p-text-hover-muted-color: var(--p-surface-600)}:host,:root{--kx-surface-1: color-mix(in srgb, var(--p-content-background) 96%, var(--p-text-color) 4%);--kx-surface-2: color-mix(in srgb, var(--p-content-background) 92%, var(--p-text-color) 8%);--kx-surface-3: color-mix(in srgb, var(--p-content-background) 86%, var(--p-text-color) 14%);--kx-surface-4: color-mix(in srgb, var(--p-content-background) 78%, var(--p-text-color) 22%);--kx-border-strong: color-mix(in srgb, var(--p-content-border-color) 60%, var(--p-text-color) 40%);--kx-border-stronger: color-mix(in srgb, var(--p-content-border-color) 30%, var(--p-text-color) 70%);--kx-text-faint: color-mix(in srgb, var(--p-text-muted-color) 70%, var(--p-content-background) 30%);--kx-text-fainter: color-mix(in srgb, var(--p-text-muted-color) 45%, var(--p-content-background) 55%);--kx-wash-primary: color-mix(in srgb, var(--p-primary-color) 12%, var(--p-content-background) 88%);--kx-wash-success: color-mix(in srgb, var(--p-success-500) 12%, var(--p-content-background) 88%);--kx-wash-info: color-mix(in srgb, var(--p-info-500) 12%, var(--p-content-background) 88%);--kx-wash-warn: color-mix(in srgb, var(--p-warn-500) 12%, var(--p-content-background) 88%);--kx-wash-danger: color-mix(in srgb, var(--p-danger-500) 12%, var(--p-content-background) 88%);--kx-wash-help: color-mix(in srgb, var(--p-help-500) 12%, var(--p-content-background) 88%);--kx-font-heading: "Outfit", system-ui, sans-serif;--kx-font-body: "Inter", system-ui, sans-serif;--kx-radius-4: 4px;--kx-radius-6: 6px;--kx-radius-8: 8px;--kx-radius-10: 10px;--kx-radius-14: 14px;--kx-radius-16: 16px;--kx-radius-tag: var(--p-content-border-radius, 6px);--kx-control-height: 34px;--kx-control-height-sm: 30px;--kx-rail-width: 264px;--kx-reading-measure: 880px;--kx-row-height: 32px;--kx-shadow-sm: 0 1px 2px rgba(0, 0, 0, .08);--kx-shadow-md: 0 4px 24px rgba(0, 0, 0, .12);--kx-shadow-lg: 0 16px 60px rgba(0, 0, 0, .18);--kx-overlay-hover: color-mix(in srgb, var(--p-text-color) 7%, transparent);--kx-overlay-subtle: color-mix(in srgb, var(--p-text-color) 4%, transparent)}@media(prefers-color-scheme:dark){:host(:not(.w-theme-light)),:root:not(.w-theme-light){--kx-shadow-sm: 0 1px 2px rgba(0, 0, 0, .35);--kx-shadow-md: 0 4px 24px rgba(0, 0, 0, .45);--kx-shadow-lg: 0 16px 60px rgba(0, 0, 0, .6)}}:host(.w-theme-dark),:root.w-theme-dark{--kx-shadow-sm: 0 1px 2px rgba(0, 0, 0, .35);--kx-shadow-md: 0 4px 24px rgba(0, 0, 0, .45);--kx-shadow-lg: 0 16px 60px rgba(0, 0, 0, .6)}.kx-focus-halo:focus-visible{border-color:var(--p-focus-ring-color);outline:none;box-shadow:var(--p-focus-ring-shadow)}.kx-focus-outline:focus-visible{outline:var(--p-focus-ring-width) var(--p-focus-ring-style) var(--p-focus-ring-color);outline-offset:var(--p-focus-ring-offset);box-shadow:none}.kx-empty{text-align:center;padding:44px 24px;display:flex;flex-direction:column;align-items:center;gap:8px}.kx-empty-ico{width:56px;height:56px;border-radius:14px;display:flex;align-items:center;justify-content:center;background:color-mix(in srgb,var(--p-primary-color) 12%,transparent);color:var(--p-primary-color);margin-bottom:4px}.kx-empty-ico svg{width:28px;height:28px}.kx-empty-title{font-size:15px;font-weight:700;color:var(--p-text-color);margin:0}.kx-empty-sub{font-size:13px;color:var(--p-text-muted-color);max-width:380px;margin:0}.kx-empty>.p-button{margin-top:6px}.kx-empty-actions{display:flex;gap:8px;margin-top:6px}.kx-loading{display:flex;align-items:center;gap:8px;color:var(--p-text-muted-color);font-size:13px;padding:24px}.kx-err{margin:0 20px 8px;padding:9px 12px;border-radius:10px;font-size:13px;background:color-mix(in srgb,var(--p-danger-500) 12%,transparent);color:var(--p-danger-600, var(--p-danger-500))}.kx-err.inline{margin:12px 0 0}.kx-empty.kx-empty-spacious{padding:60px 24px;gap:9px}.kx-empty-spacious .kx-empty-ico{width:58px;height:58px;margin-bottom:5px}.kx-empty-spacious .kx-empty-ico svg{width:27px;height:27px}.kx-empty-spacious .kx-empty-title{font-size:14.5px}.kx-empty-spacious .kx-empty-sub{font-size:12.5px;max-width:360px;line-height:1.55}.kx-empty-ico.primary{background:color-mix(in srgb,var(--p-primary-color) 14%,transparent);border:1px solid color-mix(in srgb,var(--p-primary-color) 28%,transparent)}.kx-empty-ico.muted{background:var(--kx-surface-2);color:color-mix(in srgb,var(--p-text-color) 45%,transparent);border:1px solid var(--p-content-border-color)}.kx-empty>.kx-empty-cta{margin-top:8px;padding-inline:16px}.kx-loading.kx-loading-centered{flex:1;display:grid;place-items:center;padding:64px 20px}.kx-loading-inner{display:flex;flex-direction:column;align-items:center;gap:12px;font-size:13px}.kx-loading-inner svg{width:24px;height:24px}.ac-mono{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:12px}.ac-muted{color:var(--p-text-muted-color);font-size:12px;overflow-wrap:anywhere}.ac-options{border:1px solid var(--p-content-border-color);border-radius:var(--kx-radius-8);padding:8px 12px}.ac-options summary{cursor:pointer;font-size:13px}.ac-options-filter{width:100%;margin:8px 0}.ac-option{display:grid;gap:4px;padding:6px 0;border-top:1px solid var(--p-content-border-color)}.ac-option-head{display:flex;flex-wrap:wrap;gap:8px;align-items:baseline}input:not([type=checkbox]),select,textarea{font:inherit;color:var(--p-text-color);background-color:var(--p-content-background);border:1px solid var(--p-content-border-color);border-radius:var(--kx-radius-6);padding:8px 10px;width:100%;min-width:0}select{appearance:none;padding-right:32px;cursor:pointer;background-image:linear-gradient(45deg,transparent 50%,var(--p-text-muted-color) 50%),linear-gradient(135deg,var(--p-text-muted-color) 50%,transparent 50%);background-repeat:no-repeat;background-size:5px 5px,5px 5px;background-position:calc(100% - 15px) center,calc(100% - 10px) center}textarea{resize:vertical;line-height:1.6}input[type=checkbox]:not([role=switch]){accent-color:var(--p-primary-color);width:auto}.ac-tabs,.ac-seg{display:inline-flex;gap:4px;padding:3px;border-radius:var(--kx-radius-8);background:var(--kx-overlay-subtle)}.ac-tab,.ac-seg button{display:inline-flex;align-items:center;justify-content:center;gap:6px;font:inherit;cursor:pointer;padding:6px 12px;border-radius:var(--kx-radius-6);border:none;background:transparent;color:var(--p-text-muted-color)}.ac-seg button{flex:1}.ac-tab:hover,.ac-seg button:hover{color:var(--p-text-color)}.ac-tab.active,.ac-seg button.active{background:var(--p-content-background);color:var(--p-primary-color);font-weight:600;box-shadow:var(--kx-shadow-sm)}.ac-chips{display:flex;gap:6px;flex-wrap:wrap;align-items:center}.ac-chip,.ac-hint-chip{display:inline-flex;align-items:center;gap:6px;border:1px solid var(--p-content-border-color);border-radius:var(--kx-radius-6);padding:6px 9px;font:inherit;color:var(--p-text-muted-color);background:var(--p-content-background)}.ac-chip{cursor:pointer}.ac-chip.active{color:var(--p-primary-color);border-color:var(--p-primary-color);background:var(--kx-wash-primary)}.ac-chip:hover{border-color:var(--p-primary-color)}.ac-hint-chip{font-size:11px;background:var(--kx-overlay-subtle);overflow-wrap:anywhere}.ac-icon-btn{display:inline-flex;align-items:center;justify-content:center;width:30px;height:30px;cursor:pointer;border-radius:var(--kx-radius-6);border:none;background:transparent;color:var(--p-text-muted-color)}.ac-icon-btn:hover{color:var(--p-text-color);background:var(--kx-overlay-hover)}.ac-icon-btn:disabled{opacity:.5;cursor:default}.ac-advanced{border-top:1px solid var(--p-content-border-color);padding-top:12px}.ac-advanced>summary{color:var(--p-text-muted-color);cursor:pointer;font-size:12px;padding:4px 0}.ac-advanced[open]>summary{margin-bottom:12px}:host{display:block;font-family:var(--kx-font-body);color:var(--p-text-color)}*{box-sizing:border-box}.tc{display:flex;flex-direction:column;gap:10px}.tc-pair{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:8px}.tc-field{display:flex;flex-direction:column;gap:4px;min-width:0}.tc-lbl{font-size:12px;font-weight:600;color:var(--p-text-muted-color)}.tc-hint{margin:0;font-size:12px;color:var(--p-text-muted-color);line-height:1.45}.tc-hint code{font-size:11px}.tc-mono{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:12px}.tc-check{display:flex;align-items:center;gap:8px;font-size:13px}.tc-check input{accent-color:var(--p-primary-color)}.tc-hint .ac-link{font:inherit;cursor:pointer;color:var(--p-primary-color);background:transparent;border:none;padding:0}.tc-hint .ac-link:hover{text-decoration:underline}', jo = {
  type: "object",
  properties: { config: { type: "object", default: {}, description: "Coding agent task Block instance configuration." } }
};
class Ro extends nr {
  static get wippyConfig() {
    return { propsSchema: jo, hostCssKeys: ["themeConfigUrl"], inlineCss: Wo };
  }
  static get vueConfig() {
    return { rootComponent: Vo };
  }
}
yr(import.meta.url, Ro);
