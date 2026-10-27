import { o as K, s as u, r as J, g as Q, f as D, a as X, b as Y, u as Z, W as rr } from "./dto-CcYNmUR0.js";
import { defineComponent as ar, computed as S, ref as g, watch as or, openBlock as c, createElementBlock as p, toDisplayString as n, createCommentVNode as i, Fragment as x, createElementVNode as o, unref as t, renderList as C, createTextVNode as m, createBlock as er, createStaticVNode as cr, nextTick as pr } from "vue";
import { s as tr, a as z, e as nr } from "./presentation-Cbft0Qfp.js";
import { u as ir, d as sr, _ as lr } from "./driver-options.vue_vue_type_script_setup_true_lang-4EokJ2OO.js";
import "@iconify/vue";
import { define as ur } from "@wippy-fe/proxy";
const vr = K({
  agent: u().optional(),
  account_id: u().optional(),
  image_id: u().optional(),
  workspace_id: u().optional(),
  prompt: u().optional(),
  include_input: D().optional(),
  unattended: D().optional(),
  options: J(Q()).optional(),
  run_timeout: u().max(64).optional(),
  repo_url: u().optional(),
  repo_ref: u().optional()
}).strict(), dr = { class: "tc" }, gr = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, mr = {
  key: 1,
  class: "kx-err inline"
}, fr = {
  key: 2,
  class: "kx-loading"
}, xr = { class: "tc-pair" }, hr = { class: "tc-field" }, br = ["value"], yr = ["value"], kr = ["value"], wr = { class: "tc-field" }, _r = ["value"], Cr = { value: "" }, zr = ["value"], Tr = ["value"], Ar = {
  key: 0,
  class: "tc-hint",
  role: "alert"
}, Ur = {
  key: 1,
  class: "tc-hint",
  role: "alert"
}, Sr = {
  key: 2,
  class: "tc-hint"
}, Er = { class: "tc-pair" }, Vr = { class: "tc-field" }, jr = ["value"], Rr = ["value"], Ir = ["value"], Or = { class: "tc-field" }, Pr = ["value"], Wr = ["value"], Dr = ["value"], Mr = {
  key: 3,
  class: "tc-hint",
  role: "alert"
}, Nr = {
  key: 4,
  class: "tc-hint",
  role: "alert"
}, $r = {
  key: 5,
  class: "tc-hint",
  role: "alert"
}, Br = { class: "tc-field" }, Fr = ["value"], qr = {
  key: 6,
  class: "kx-err",
  role: "alert"
}, Hr = {
  key: 7,
  class: "kx-err",
  role: "alert"
}, Lr = { class: "tc-check" }, Gr = ["checked"], Kr = { class: "ac-advanced" }, Jr = { class: "tc" }, Qr = {
  key: 0,
  class: "tc-check"
}, Xr = ["checked"], Yr = {
  key: 2,
  class: "kx-err",
  role: "alert"
}, Zr = { class: "tc-field" }, ra = ["value"], aa = { class: "tc-field" }, oa = ["value"], ea = { class: "tc-field" }, ca = ["value"], pa = /* @__PURE__ */ ar({
  __name: "task-config",
  setup(M) {
    const N = X(), $ = Y(), h = S(() => vr.safeParse(N.value.config ?? {})), b = S(() => h.value.success ? "" : "Workflow configuration is invalid."), e = g(h.value.success ? h.value.data : {});
    or(h, (l) => {
      if (!l.success) return;
      const r = l.data;
      r && Object.keys(r).length ? (e.value = U(r), f.value = !1) : (e.value = {}, W());
    });
    const v = g(null), T = g([]), E = g([]), A = g([]), y = g(""), f = g(!1), {
      driver: d,
      agentAccounts: V,
      ready: B,
      agentImages: k,
      invalidAgent: j,
      invalidImage: R,
      invalidAccount: I,
      invalidWorkspace: O,
      invalidOptions: w,
      optionValues: F,
      normalizeConfig: U,
      selectAgent: q,
      initialSelection: H
    } = ir(e, {
      catalog: () => v.value,
      accounts: () => T.value,
      images: () => E.value,
      workspaces: () => A.value
    }, "saved"), _ = S(() => d.value?.title ?? e.value.agent ?? "this agent");
    function s(l) {
      const r = U({ ...e.value, ...l });
      if (e.value = r, w.value > 0) {
        f.value = !0;
        return;
      }
      f.value = !1, $("config-changed", r);
    }
    function L(l) {
      w.value = l, !l && f.value && pr(() => {
        !w.value && f.value && s({});
      });
    }
    function P(l) {
      s(q(l));
    }
    function W() {
      !v.value || b.value || Object.keys(e.value).length || s({ ...H(), include_input: !0 });
    }
    return Z(tr(async () => {
      try {
        const [l, r, a, G] = await Promise.all([z.catalog(), z.accounts(), z.images(), z.workspaces()]);
        v.value = l, T.value = r, E.value = a, A.value = G.workspaces, y.value = "", e.value = U(e.value), W();
      } catch (l) {
        y.value = nr(l, "Could not load the agents.");
      }
    })), (l, r) => (c(), p("div", dr, [
      b.value ? (c(), p("p", gr, n(b.value), 1)) : i("", !0),
      y.value ? (c(), p("p", mr, n(y.value), 1)) : v.value ? b.value ? i("", !0) : (c(), p(x, { key: 3 }, [
        o("div", xr, [
          o("label", hr, [
            r[15] || (r[15] = o("span", { class: "tc-lbl" }, "Agent", -1)),
            o("select", {
              class: "tc-input kx-focus-halo",
              value: e.value.agent,
              onChange: r[0] || (r[0] = (a) => P(a.target.value))
            }, [
              t(j) ? (c(), p("option", {
                key: 0,
                value: e.value.agent
              }, "Unavailable agent: " + n(e.value.agent), 9, yr)) : i("", !0),
              (c(!0), p(x, null, C(v.value.agents, (a) => (c(), p("option", {
                key: a.id,
                value: a.id
              }, n(a.title), 9, kr))), 128))
            ], 40, br)
          ]),
          o("label", wr, [
            r[16] || (r[16] = o("span", { class: "tc-lbl" }, "Account", -1)),
            o("select", {
              class: "tc-input kx-focus-halo",
              value: e.value.account_id ?? "",
              onChange: r[1] || (r[1] = (a) => s({ account_id: a.target.value }))
            }, [
              o("option", Cr, "Auto (" + n(t(B).length) + " ready)", 1),
              t(I) ? (c(), p("option", {
                key: 0,
                value: e.value.account_id
              }, "Unavailable account: " + n(e.value.account_id), 9, zr)) : i("", !0),
              (c(!0), p(x, null, C(t(V), (a) => (c(), p("option", {
                key: a.id,
                value: a.id
              }, n(a.label), 9, Tr))), 128))
            ], 40, _r)
          ])
        ]),
        t(j) ? (c(), p("p", Ar, [
          r[17] || (r[17] = m("This saved agent no longer exists. ", -1)),
          v.value.agents.length ? (c(), p("button", {
            key: 0,
            type: "button",
            class: "ac-link kx-focus-outline",
            onClick: r[2] || (r[2] = (a) => P(t(sr)(v.value, T.value)))
          }, "Use default agent")) : i("", !0)
        ])) : i("", !0),
        t(I) ? (c(), p("p", Ur, [
          m("This saved account no longer exists, is disabled or cannot run " + n(_.value) + ". ", 1),
          o("button", {
            type: "button",
            class: "ac-link kx-focus-outline",
            onClick: r[3] || (r[3] = (a) => s({ account_id: "" }))
          }, "Use Auto")
        ])) : i("", !0),
        t(V).length ? i("", !0) : (c(), p("p", Sr, "Add an account on Autocode → Accounts to run " + n(_.value) + ".", 1)),
        o("div", Er, [
          o("label", Vr, [
            r[18] || (r[18] = o("span", { class: "tc-lbl" }, "Image (required)", -1)),
            o("select", {
              class: "tc-input kx-focus-halo",
              value: e.value.image_id ?? "",
              onChange: r[4] || (r[4] = (a) => s({ image_id: a.target.value }))
            }, [
              t(R) ? (c(), p("option", {
                key: 0,
                value: e.value.image_id ?? ""
              }, n(e.value.image_id ? "Unavailable image: " + e.value.image_id : "Choose an image"), 9, Rr)) : i("", !0),
              (c(!0), p(x, null, C(t(k), (a) => (c(), p("option", {
                key: a.id,
                value: a.id
              }, n(a.label), 9, Ir))), 128))
            ], 40, jr)
          ]),
          o("label", Or, [
            r[20] || (r[20] = o("span", { class: "tc-lbl" }, "Workspace", -1)),
            o("select", {
              class: "tc-input kx-focus-halo",
              value: e.value.workspace_id ?? "",
              onChange: r[5] || (r[5] = (a) => s({ workspace_id: a.target.value }))
            }, [
              r[19] || (r[19] = o("option", { value: "" }, "Scratch directory", -1)),
              t(O) ? (c(), p("option", {
                key: 0,
                value: e.value.workspace_id
              }, "Unavailable workspace: " + n(e.value.workspace_id), 9, Wr)) : i("", !0),
              (c(!0), p(x, null, C(A.value, (a) => (c(), p("option", {
                key: a.id,
                value: a.id
              }, n(a.name) + n(a.writable ? "" : " (read-only)"), 9, Dr))), 128))
            ], 40, Pr)
          ])
        ]),
        t(k).length ? t(R) ? (c(), p("p", Nr, [
          m("This saved image is missing, is not usable or does not include " + n(_.value) + ". ", 1),
          o("button", {
            type: "button",
            class: "ac-link kx-focus-outline",
            onClick: r[6] || (r[6] = (a) => s({ image_id: t(k)[0].id }))
          }, "Use " + n(t(k)[0].label), 1)
        ])) : i("", !0) : (c(), p("p", Mr, "No image with " + n(_.value) + "; ask an administrator.", 1)),
        t(O) ? (c(), p("p", $r, [
          r[21] || (r[21] = m("This saved workspace no longer exists or is unavailable. ", -1)),
          o("button", {
            type: "button",
            class: "ac-link kx-focus-outline",
            onClick: r[7] || (r[7] = (a) => s({ workspace_id: "" }))
          }, "Use Scratch")
        ])) : i("", !0),
        o("label", Br, [
          r[22] || (r[22] = o("span", { class: "tc-lbl" }, "Task (required)", -1)),
          o("textarea", {
            class: "tc-input kx-focus-halo",
            rows: "4",
            value: e.value.prompt,
            placeholder: "What should the agent do?",
            onInput: r[8] || (r[8] = (a) => s({ prompt: a.target.value }))
          }, null, 40, Fr)
        ]),
        e.value.prompt?.trim() ? i("", !0) : (c(), p("p", qr, "Enter a task prompt.")),
        e.value.image_id ? i("", !0) : (c(), p("p", Hr, "Choose an image.")),
        o("label", Lr, [
          o("input", {
            type: "checkbox",
            class: "kx-focus-outline",
            checked: e.value.include_input !== !1,
            onChange: r[9] || (r[9] = (a) => s({ include_input: a.target.checked }))
          }, null, 40, Gr),
          r[23] || (r[23] = m(" Pass the node's input to the agent after the task ", -1))
        ]),
        o("details", Kr, [
          r[28] || (r[28] = o("summary", { class: "kx-focus-outline" }, "Advanced", -1)),
          o("div", Jr, [
            t(d)?.unattended ? (c(), p("label", Qr, [
              o("input", {
                type: "checkbox",
                class: "kx-focus-outline",
                checked: e.value.unattended !== !1,
                onChange: r[10] || (r[10] = (a) => s({ unattended: a.target.checked }))
              }, null, 40, Xr),
              r[24] || (r[24] = m(" Unattended: skip permission prompts ", -1))
            ])) : i("", !0),
            t(d) ? (c(), er(lr, {
              key: t(d).id,
              options: t(d).options,
              "model-value": t(F),
              locked: e.value.unattended !== !1 && t(d).unattended ? t(d).unattended : {},
              onInvalid: L,
              "onUpdate:modelValue": r[11] || (r[11] = (a) => s({ options: a }))
            }, null, 8, ["options", "model-value", "locked"])) : i("", !0),
            t(w) ? (c(), p("p", Yr, "Driver options are invalid. These drafts and further changes are not applied to the workflow until all options are valid.")) : i("", !0),
            o("label", Zr, [
              r[25] || (r[25] = o("span", { class: "tc-lbl" }, "Run timeout", -1)),
              o("input", {
                class: "tc-input tc-mono kx-focus-halo",
                value: e.value.run_timeout,
                placeholder: "Use configured timeout",
                onChange: r[12] || (r[12] = (a) => s({ run_timeout: a.target.value.trim() || void 0 }))
              }, null, 40, ra)
            ]),
            o("label", aa, [
              r[26] || (r[26] = o("span", { class: "tc-lbl" }, "Git repository", -1)),
              o("input", {
                class: "tc-input tc-mono kx-focus-halo",
                value: e.value.repo_url,
                placeholder: "optional",
                onChange: r[13] || (r[13] = (a) => s({ repo_url: a.target.value }))
              }, null, 40, oa)
            ]),
            o("label", ea, [
              r[27] || (r[27] = o("span", { class: "tc-lbl" }, "Repository ref", -1)),
              o("input", {
                class: "tc-input tc-mono kx-focus-halo",
                "aria-label": "Repository ref",
                value: e.value.repo_ref,
                placeholder: "Default branch",
                onChange: r[14] || (r[14] = (a) => s({ repo_ref: a.target.value.trim() || void 0 }))
              }, null, 40, ca)
            ])
          ])
        ]),
        r[29] || (r[29] = cr('<p class="tc-hint">Output: <code>run_id</code>, <code>status</code>, <code>answer</code>, <code>error</code>, <code>usage</code>, <code>agent</code>, <code>account_id</code>; next nodes read them as <code>output.answer</code>.</p>', 1))
      ], 64)) : (c(), p("div", fr, "Loading agents…"))
    ]));
  }
}), ta = ':root{--p-form-field-padding-x: .75rem;--p-form-field-padding-y: .5rem;--p-form-field-sm-padding-x: .625rem;--p-form-field-sm-padding-y: .375rem;--p-form-field-lg-padding-x: .875rem;--p-form-field-lg-padding-y: .625rem;--p-form-field-border-radius: .375rem;--p-form-field-transition-duration: .2s;--p-form-field-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), 0 1px 2px 0 rgba(18, 18, 23, .05);--p-focus-ring-width: 1px;--p-focus-ring-style: solid;--p-focus-ring-color: color-mix(in srgb, var(--p-primary-color) 100%, transparent);--p-focus-ring-offset: 2px;--p-toggleswitch-width: 2.5rem;--p-toggleswitch-height: 1.5rem;--p-toggleswitch-border-radius: 30px;--p-toggleswitch-gap: .25rem;--p-toggleswitch-border-width: 1px;--p-toggleswitch-transition-duration: .2s;--p-toggleswitch-slide-duration: .2s;--p-toggleswitch-handle-size: 1rem;--p-toggleswitch-handle-border-radius: 9999px}:root{color-scheme:light dark;--p-primary: rgb(0, 95, 178);--p-primary-50: color-mix(in srgb, var(--p-primary) 5%, white);--p-primary-100: color-mix(in srgb, var(--p-primary) 10%, white);--p-primary-200: color-mix(in srgb, var(--p-primary) 20%, white);--p-primary-300: color-mix(in srgb, var(--p-primary) 30%, white);--p-primary-400: color-mix(in srgb, var(--p-primary) 40%, white);--p-primary-500: var(--p-primary);--p-primary-600: color-mix(in srgb, var(--p-primary) 80%, black);--p-primary-700: color-mix(in srgb, var(--p-primary) 70%, black);--p-primary-800: color-mix(in srgb, var(--p-primary) 60%, black);--p-primary-900: color-mix(in srgb, var(--p-primary) 50%, black);--p-primary-950: color-mix(in srgb, var(--p-primary) 40%, black);--p-secondary: #6f7385;--p-secondary-50: color-mix(in srgb, var(--p-secondary) 5%, white);--p-secondary-100: color-mix(in srgb, var(--p-secondary) 10%, white);--p-secondary-200: color-mix(in srgb, var(--p-secondary) 20%, white);--p-secondary-300: color-mix(in srgb, var(--p-secondary) 35%, white);--p-secondary-400: color-mix(in srgb, var(--p-secondary) 65%, white);--p-secondary-500: var(--p-secondary);--p-secondary-600: color-mix(in srgb, var(--p-secondary) 80%, black);--p-secondary-700: color-mix(in srgb, var(--p-secondary) 65%, black);--p-secondary-800: color-mix(in srgb, var(--p-secondary) 55%, black);--p-secondary-900: color-mix(in srgb, var(--p-secondary) 50%, black);--p-secondary-950: color-mix(in srgb, var(--p-secondary) 30%, black);--p-danger: rgb(239, 68, 68);--p-danger-50: color-mix(in srgb, var(--p-danger) 5%, white);--p-danger-100: color-mix(in srgb, var(--p-danger) 10%, white);--p-danger-200: color-mix(in srgb, var(--p-danger) 20%, white);--p-danger-300: color-mix(in srgb, var(--p-danger) 30%, white);--p-danger-400: color-mix(in srgb, var(--p-danger) 40%, white);--p-danger-500: var(--p-danger);--p-danger-600: color-mix(in srgb, var(--p-danger) 80%, black);--p-danger-700: color-mix(in srgb, var(--p-danger) 70%, black);--p-danger-800: color-mix(in srgb, var(--p-danger) 60%, black);--p-danger-900: color-mix(in srgb, var(--p-danger) 50%, black);--p-danger-950: color-mix(in srgb, var(--p-danger) 40%, black);--p-success: rgb(34, 197, 94);--p-success-50: color-mix(in srgb, var(--p-success) 5%, white);--p-success-100: color-mix(in srgb, var(--p-success) 10%, white);--p-success-200: color-mix(in srgb, var(--p-success) 20%, white);--p-success-300: color-mix(in srgb, var(--p-success) 30%, white);--p-success-400: color-mix(in srgb, var(--p-success) 40%, white);--p-success-500: var(--p-success);--p-success-600: color-mix(in srgb, var(--p-success) 80%, black);--p-success-700: color-mix(in srgb, var(--p-success) 70%, black);--p-success-800: color-mix(in srgb, var(--p-success) 60%, black);--p-success-900: color-mix(in srgb, var(--p-success) 50%, black);--p-success-950: color-mix(in srgb, var(--p-success) 40%, black);--p-warn: rgb(249, 115, 22);--p-warn-50: color-mix(in srgb, var(--p-warn) 5%, white);--p-warn-100: color-mix(in srgb, var(--p-warn) 10%, white);--p-warn-200: color-mix(in srgb, var(--p-warn) 20%, white);--p-warn-300: color-mix(in srgb, var(--p-warn) 30%, white);--p-warn-400: color-mix(in srgb, var(--p-warn) 40%, white);--p-warn-500: var(--p-warn);--p-warn-600: color-mix(in srgb, var(--p-warn) 80%, black);--p-warn-700: color-mix(in srgb, var(--p-warn) 70%, black);--p-warn-800: color-mix(in srgb, var(--p-warn) 60%, black);--p-warn-900: color-mix(in srgb, var(--p-warn) 50%, black);--p-warn-950: color-mix(in srgb, var(--p-warn) 40%, black);--p-info: rgb(14, 165, 233);--p-info-50: color-mix(in srgb, var(--p-info) 5%, white);--p-info-100: color-mix(in srgb, var(--p-info) 10%, white);--p-info-200: color-mix(in srgb, var(--p-info) 20%, white);--p-info-300: color-mix(in srgb, var(--p-info) 30%, white);--p-info-400: color-mix(in srgb, var(--p-info) 40%, white);--p-info-500: var(--p-info);--p-info-600: color-mix(in srgb, var(--p-info) 80%, black);--p-info-700: color-mix(in srgb, var(--p-info) 70%, black);--p-info-800: color-mix(in srgb, var(--p-info) 60%, black);--p-info-900: color-mix(in srgb, var(--p-info) 50%, black);--p-info-950: color-mix(in srgb, var(--p-info) 40%, black);--p-help: rgb(168, 85, 247);--p-help-50: color-mix(in srgb, var(--p-help) 5%, white);--p-help-100: color-mix(in srgb, var(--p-help) 10%, white);--p-help-200: color-mix(in srgb, var(--p-help) 20%, white);--p-help-300: color-mix(in srgb, var(--p-help) 30%, white);--p-help-400: color-mix(in srgb, var(--p-help) 40%, white);--p-help-500: var(--p-help);--p-help-600: color-mix(in srgb, var(--p-help) 80%, black);--p-help-700: color-mix(in srgb, var(--p-help) 70%, black);--p-help-800: color-mix(in srgb, var(--p-help) 60%, black);--p-help-900: color-mix(in srgb, var(--p-help) 50%, black);--p-help-950: color-mix(in srgb, var(--p-help) 40%, black);--p-accent: rgb(20, 184, 166);--p-accent-50: color-mix(in srgb, var(--p-accent) 5%, white);--p-accent-100: color-mix(in srgb, var(--p-accent) 10%, white);--p-accent-200: color-mix(in srgb, var(--p-accent) 20%, white);--p-accent-300: color-mix(in srgb, var(--p-accent) 30%, white);--p-accent-400: color-mix(in srgb, var(--p-accent) 40%, white);--p-accent-500: var(--p-accent);--p-accent-600: color-mix(in srgb, var(--p-accent) 80%, black);--p-accent-700: color-mix(in srgb, var(--p-accent) 70%, black);--p-accent-800: color-mix(in srgb, var(--p-accent) 60%, black);--p-accent-900: color-mix(in srgb, var(--p-accent) 50%, black);--p-accent-950: color-mix(in srgb, var(--p-accent) 40%, black);--p-surface-0: #ffffff;--p-surface-50: #fafafa;--p-surface-100: #f5f5f5;--p-surface-200: #e5e5e5;--p-surface-300: #d4d4d4;--p-surface-400: #a3a3a3;--p-surface-500: #737373;--p-surface-600: #525252;--p-surface-700: #404040;--p-surface-800: #262626;--p-surface-850: color-mix(in srgb, var(--p-surface-800) 50%, var(--p-surface-900));--p-surface-900: #171717;--p-surface-950: #0a0a0a;--p-content-border-radius: 6px;--p-font-heading-family: var(--v-font-family-head, Arial);--p-font-heading-scale: 1;--p-font-heading-line-height: 1.5;--p-font-heading-letter-spacing: normal;--p-font-heading-stretch: normal;--p-font-heading-variation-settings: normal;--p-font-body-scale: 1;--p-font-body-line-height: 1.5;--p-font-body-letter-spacing: normal;--p-font-body-stretch: normal;--p-font-body-variation-settings: normal;--p-font-mono-family: ui-monospace}:root{--p-primary-color: var(--p-primary-500);--p-primary-contrast-color: var(--p-surface-0);--p-primary-hover-color: var(--p-primary-600);--p-primary-active-color: var(--p-primary-700);--p-secondary-color: var(--p-secondary-500);--p-secondary-contrast-color: var(--p-surface-0);--p-secondary-hover-color: var(--p-secondary-600);--p-secondary-active-color: var(--p-secondary-700);--p-danger-color: var(--p-danger-500);--p-danger-contrast-color: var(--p-surface-0);--p-danger-hover-color: var(--p-danger-600);--p-danger-active-color: var(--p-danger-700);--p-success-color: var(--p-success-500);--p-success-contrast-color: var(--p-surface-0);--p-success-hover-color: var(--p-success-600);--p-success-active-color: var(--p-success-700);--p-warn-color: var(--p-warn-500);--p-warn-contrast-color: var(--p-surface-0);--p-warn-hover-color: var(--p-warn-600);--p-warn-active-color: var(--p-warn-700);--p-info-color: var(--p-info-500);--p-info-contrast-color: var(--p-surface-0);--p-info-hover-color: var(--p-info-600);--p-info-active-color: var(--p-info-700);--p-help-color: var(--p-help-500);--p-help-contrast-color: var(--p-surface-0);--p-help-hover-color: var(--p-help-600);--p-help-active-color: var(--p-help-700);--p-accent-color: var(--p-accent-500);--p-accent-contrast-color: var(--p-surface-0);--p-accent-hover-color: var(--p-accent-600);--p-accent-active-color: var(--p-accent-700);--p-content-border-color: var(--p-surface-200);--p-content-hover-background: var(--p-surface-100);--p-content-hover-color: var(--p-surface-800);--p-highlight-background: var(--p-primary-50);--p-highlight-color: var(--p-primary-700);--p-highlight-focus-background: var(--p-primary-100);--p-highlight-focus-color: var(--p-primary-800);--p-content-background: var(--p-surface-0);--p-text-color: var(--p-surface-700);--p-text-hover-color: var(--p-surface-800);--p-text-muted-color: var(--p-surface-500);--p-text-hover-muted-color: var(--p-surface-600)}@media(prefers-color-scheme:dark){:root:not(.w-theme-light){--p-surface-D: #fff;--p-surface-0: #fff;--p-surface-50: #fafafa;--p-surface-100: #f4f4f5;--p-surface-200: #e4e4e7;--p-surface-300: #d4d4d8;--p-surface-400: #a1a1aa;--p-surface-500: #71717a;--p-surface-600: #545250;--p-surface-700: #403e3c;--p-surface-800: #2b2927;--p-surface-850: color-mix(in srgb, var(--p-surface-800) 50%, var(--p-surface-900));--p-surface-900: #1c1a19;--p-surface-950: #0f0e0d;--p-primary: rgb(0, 125, 178);--p-primary-50: color-mix(in srgb, var(--p-primary) 5%, white);--p-primary-100: color-mix(in srgb, var(--p-primary) 10%, white);--p-primary-200: color-mix(in srgb, var(--p-primary) 20%, white);--p-primary-300: color-mix(in srgb, var(--p-primary) 30%, white);--p-primary-400: color-mix(in srgb, var(--p-primary) 40%, white);--p-primary-500: var(--p-primary);--p-primary-600: color-mix(in srgb, var(--p-primary) 80%, black);--p-primary-700: color-mix(in srgb, var(--p-primary) 70%, black);--p-primary-800: color-mix(in srgb, var(--p-primary) 60%, black);--p-primary-900: color-mix(in srgb, var(--p-primary) 50%, black);--p-primary-950: color-mix(in srgb, var(--p-primary) 40%, black);--p-primary-color: var(--p-primary-400);--p-primary-contrast-color: var(--p-surface-900);--p-primary-hover-color: var(--p-primary-300);--p-primary-active-color: var(--p-primary-200);--p-secondary-color: var(--p-secondary-400);--p-secondary-contrast-color: var(--p-surface-900);--p-secondary-hover-color: var(--p-secondary-300);--p-secondary-active-color: var(--p-secondary-200);--p-danger-color: var(--p-danger-400);--p-danger-contrast-color: var(--p-surface-900);--p-danger-hover-color: var(--p-danger-300);--p-danger-active-color: var(--p-danger-200);--p-success-color: var(--p-success-400);--p-success-contrast-color: var(--p-surface-900);--p-success-hover-color: var(--p-success-300);--p-success-active-color: var(--p-success-200);--p-warn-color: var(--p-warn-400);--p-warn-contrast-color: var(--p-surface-900);--p-warn-hover-color: var(--p-warn-300);--p-warn-active-color: var(--p-warn-200);--p-info-color: var(--p-info-400);--p-info-contrast-color: var(--p-surface-900);--p-info-hover-color: var(--p-info-300);--p-info-active-color: var(--p-info-200);--p-help-color: var(--p-help-400);--p-help-contrast-color: var(--p-surface-900);--p-help-hover-color: var(--p-help-300);--p-help-active-color: var(--p-help-200);--p-accent-color: var(--p-accent-400);--p-accent-contrast-color: var(--p-surface-900);--p-accent-hover-color: var(--p-accent-300);--p-accent-active-color: var(--p-accent-200);--p-content-border-color: var(--p-surface-700);--p-content-hover-background: var(--p-surface-800);--p-content-hover-color: var(--p-surface-0);--p-highlight-background: color-mix(in srgb, var(--p-primary-400), transparent 84%);--p-highlight-color: rgba(255, 255, 255, 87%);--p-highlight-focus-background: color-mix(in srgb, var(--p-primary-400), transparent 76%);--p-highlight-focus-color: rgba(255, 255, 255, 87%);--p-content-background: var(--p-surface-900);--p-text-color: var(--p-surface-0);--p-text-hover-color: var(--p-surface-0);--p-text-muted-color: var(--p-surface-400);--p-text-hover-muted-color: var(--p-surface-300)}}:root.w-theme-dark,.w-theme-dark{color-scheme:dark;--p-surface-D: #fff;--p-surface-0: #fff;--p-surface-50: #fafafa;--p-surface-100: #f4f4f5;--p-surface-200: #e4e4e7;--p-surface-300: #d4d4d8;--p-surface-400: #a1a1aa;--p-surface-500: #71717a;--p-surface-600: #545250;--p-surface-700: #403e3c;--p-surface-800: #2b2927;--p-surface-850: color-mix(in srgb, var(--p-surface-800) 50%, var(--p-surface-900));--p-surface-900: #1c1a19;--p-surface-950: #0f0e0d;--p-primary: rgb(0, 125, 178);--p-primary-50: color-mix(in srgb, var(--p-primary) 5%, white);--p-primary-100: color-mix(in srgb, var(--p-primary) 10%, white);--p-primary-200: color-mix(in srgb, var(--p-primary) 20%, white);--p-primary-300: color-mix(in srgb, var(--p-primary) 30%, white);--p-primary-400: color-mix(in srgb, var(--p-primary) 40%, white);--p-primary-500: var(--p-primary);--p-primary-600: color-mix(in srgb, var(--p-primary) 80%, black);--p-primary-700: color-mix(in srgb, var(--p-primary) 70%, black);--p-primary-800: color-mix(in srgb, var(--p-primary) 60%, black);--p-primary-900: color-mix(in srgb, var(--p-primary) 50%, black);--p-primary-950: color-mix(in srgb, var(--p-primary) 40%, black);--p-primary-color: var(--p-primary-400);--p-primary-contrast-color: var(--p-surface-900);--p-primary-hover-color: var(--p-primary-300);--p-primary-active-color: var(--p-primary-200);--p-secondary-color: var(--p-secondary-400);--p-secondary-contrast-color: var(--p-surface-900);--p-secondary-hover-color: var(--p-secondary-300);--p-secondary-active-color: var(--p-secondary-200);--p-danger-color: var(--p-danger-400);--p-danger-contrast-color: var(--p-surface-900);--p-danger-hover-color: var(--p-danger-300);--p-danger-active-color: var(--p-danger-200);--p-success-color: var(--p-success-400);--p-success-contrast-color: var(--p-surface-900);--p-success-hover-color: var(--p-success-300);--p-success-active-color: var(--p-success-200);--p-warn-color: var(--p-warn-400);--p-warn-contrast-color: var(--p-surface-900);--p-warn-hover-color: var(--p-warn-300);--p-warn-active-color: var(--p-warn-200);--p-info-color: var(--p-info-400);--p-info-contrast-color: var(--p-surface-900);--p-info-hover-color: var(--p-info-300);--p-info-active-color: var(--p-info-200);--p-help-color: var(--p-help-400);--p-help-contrast-color: var(--p-surface-900);--p-help-hover-color: var(--p-help-300);--p-help-active-color: var(--p-help-200);--p-accent-color: var(--p-accent-400);--p-accent-contrast-color: var(--p-surface-900);--p-accent-hover-color: var(--p-accent-300);--p-accent-active-color: var(--p-accent-200);--p-content-border-color: var(--p-surface-700);--p-content-hover-background: var(--p-surface-800);--p-content-hover-color: var(--p-surface-0);--p-highlight-background: color-mix(in srgb, var(--p-primary-400), transparent 84%);--p-highlight-color: rgba(255, 255, 255, 87%);--p-highlight-focus-background: color-mix(in srgb, var(--p-primary-400), transparent 76%);--p-highlight-focus-color: rgba(255, 255, 255, 87%);--p-content-background: var(--p-surface-900);--p-text-color: var(--p-surface-0);--p-text-hover-color: var(--p-surface-0);--p-text-muted-color: var(--p-surface-400);--p-text-hover-muted-color: var(--p-surface-300)}:root.w-theme-light,.w-theme-light{color-scheme:light;--p-surface-0: #ffffff;--p-surface-50: #fafafa;--p-surface-100: #f5f5f5;--p-surface-200: #e5e5e5;--p-surface-300: #d4d4d4;--p-surface-400: #a3a3a3;--p-surface-500: #737373;--p-surface-600: #525252;--p-surface-700: #404040;--p-surface-800: #262626;--p-surface-850: color-mix(in srgb, var(--p-surface-800) 50%, var(--p-surface-900));--p-surface-900: #171717;--p-surface-950: #0a0a0a;--p-primary: rgb(0, 95, 178);--p-primary-50: color-mix(in srgb, var(--p-primary) 5%, white);--p-primary-100: color-mix(in srgb, var(--p-primary) 10%, white);--p-primary-200: color-mix(in srgb, var(--p-primary) 20%, white);--p-primary-300: color-mix(in srgb, var(--p-primary) 30%, white);--p-primary-400: color-mix(in srgb, var(--p-primary) 40%, white);--p-primary-500: var(--p-primary);--p-primary-600: color-mix(in srgb, var(--p-primary) 80%, black);--p-primary-700: color-mix(in srgb, var(--p-primary) 70%, black);--p-primary-800: color-mix(in srgb, var(--p-primary) 60%, black);--p-primary-900: color-mix(in srgb, var(--p-primary) 50%, black);--p-primary-950: color-mix(in srgb, var(--p-primary) 40%, black);--p-primary-color: var(--p-primary-500);--p-primary-contrast-color: var(--p-surface-0);--p-primary-hover-color: var(--p-primary-600);--p-primary-active-color: var(--p-primary-700);--p-secondary-color: var(--p-secondary-500);--p-secondary-contrast-color: var(--p-surface-0);--p-secondary-hover-color: var(--p-secondary-600);--p-secondary-active-color: var(--p-secondary-700);--p-danger-color: var(--p-danger-500);--p-danger-contrast-color: var(--p-surface-0);--p-danger-hover-color: var(--p-danger-600);--p-danger-active-color: var(--p-danger-700);--p-success-color: var(--p-success-500);--p-success-contrast-color: var(--p-surface-0);--p-success-hover-color: var(--p-success-600);--p-success-active-color: var(--p-success-700);--p-warn-color: var(--p-warn-500);--p-warn-contrast-color: var(--p-surface-0);--p-warn-hover-color: var(--p-warn-600);--p-warn-active-color: var(--p-warn-700);--p-info-color: var(--p-info-500);--p-info-contrast-color: var(--p-surface-0);--p-info-hover-color: var(--p-info-600);--p-info-active-color: var(--p-info-700);--p-help-color: var(--p-help-500);--p-help-contrast-color: var(--p-surface-0);--p-help-hover-color: var(--p-help-600);--p-help-active-color: var(--p-help-700);--p-accent-color: var(--p-accent-500);--p-accent-contrast-color: var(--p-surface-0);--p-accent-hover-color: var(--p-accent-600);--p-accent-active-color: var(--p-accent-700);--p-content-border-color: var(--p-surface-200);--p-content-hover-background: var(--p-surface-100);--p-content-hover-color: var(--p-surface-800);--p-highlight-background: var(--p-primary-50);--p-highlight-color: var(--p-primary-700);--p-highlight-focus-background: var(--p-primary-100);--p-highlight-focus-color: var(--p-primary-800);--p-content-background: var(--p-surface-0);--p-text-color: var(--p-surface-700);--p-text-hover-color: var(--p-surface-800);--p-text-muted-color: var(--p-surface-500);--p-text-hover-muted-color: var(--p-surface-600)}:host,:root{--kx-surface-1: color-mix(in srgb, var(--p-content-background) 96%, var(--p-text-color) 4%);--kx-surface-2: color-mix(in srgb, var(--p-content-background) 92%, var(--p-text-color) 8%);--kx-surface-3: color-mix(in srgb, var(--p-content-background) 86%, var(--p-text-color) 14%);--kx-surface-4: color-mix(in srgb, var(--p-content-background) 78%, var(--p-text-color) 22%);--kx-border-strong: color-mix(in srgb, var(--p-content-border-color) 60%, var(--p-text-color) 40%);--kx-border-stronger: color-mix(in srgb, var(--p-content-border-color) 30%, var(--p-text-color) 70%);--kx-text-faint: color-mix(in srgb, var(--p-text-muted-color) 70%, var(--p-content-background) 30%);--kx-text-fainter: color-mix(in srgb, var(--p-text-muted-color) 45%, var(--p-content-background) 55%);--kx-wash-primary: color-mix(in srgb, var(--p-primary-color) 12%, var(--p-content-background) 88%);--kx-wash-success: color-mix(in srgb, var(--p-success-500) 12%, var(--p-content-background) 88%);--kx-wash-info: color-mix(in srgb, var(--p-info-500) 12%, var(--p-content-background) 88%);--kx-wash-warn: color-mix(in srgb, var(--p-warn-500) 12%, var(--p-content-background) 88%);--kx-wash-danger: color-mix(in srgb, var(--p-danger-500) 12%, var(--p-content-background) 88%);--kx-wash-help: color-mix(in srgb, var(--p-help-500) 12%, var(--p-content-background) 88%);--kx-font-heading: "Outfit", system-ui, sans-serif;--kx-font-body: "Inter", system-ui, sans-serif;--kx-radius-4: 4px;--kx-radius-6: 6px;--kx-radius-8: 8px;--kx-radius-10: 10px;--kx-radius-14: 14px;--kx-radius-16: 16px;--kx-radius-tag: var(--p-content-border-radius, 6px);--kx-control-height: 34px;--kx-shadow-sm: 0 1px 2px rgba(0, 0, 0, .08);--kx-shadow-md: 0 4px 24px rgba(0, 0, 0, .12);--kx-shadow-lg: 0 16px 60px rgba(0, 0, 0, .18);--kx-overlay-hover: color-mix(in srgb, var(--p-text-color) 7%, transparent);--kx-overlay-subtle: color-mix(in srgb, var(--p-text-color) 4%, transparent)}@media(prefers-color-scheme:dark){:host(:not(.w-theme-light)),:root:not(.w-theme-light){--kx-shadow-sm: 0 1px 2px rgba(0, 0, 0, .35);--kx-shadow-md: 0 4px 24px rgba(0, 0, 0, .45);--kx-shadow-lg: 0 16px 60px rgba(0, 0, 0, .6)}}:host(.w-theme-dark),:root.w-theme-dark{--kx-shadow-sm: 0 1px 2px rgba(0, 0, 0, .35);--kx-shadow-md: 0 4px 24px rgba(0, 0, 0, .45);--kx-shadow-lg: 0 16px 60px rgba(0, 0, 0, .6)}.kx-focus-halo:focus-visible{border-color:var(--p-focus-ring-color);outline:none;box-shadow:var(--p-focus-ring-shadow)}.kx-focus-outline:focus-visible{outline:var(--p-focus-ring-width) var(--p-focus-ring-style) var(--p-focus-ring-color);outline-offset:var(--p-focus-ring-offset);box-shadow:none}.kx-empty{text-align:center;padding:44px 24px;display:flex;flex-direction:column;align-items:center;gap:8px}.kx-empty-ico{width:56px;height:56px;border-radius:14px;display:flex;align-items:center;justify-content:center;background:color-mix(in srgb,var(--p-primary-color) 12%,transparent);color:var(--p-primary-color);margin-bottom:4px}.kx-empty-ico svg{width:28px;height:28px}.kx-empty-title{font-size:15px;font-weight:700;color:var(--p-text-color);margin:0}.kx-empty-sub{font-size:13px;color:var(--p-text-muted-color);max-width:380px;margin:0}.kx-empty>.p-button{margin-top:6px}.kx-empty-actions{display:flex;gap:8px;margin-top:6px}.kx-loading{display:flex;align-items:center;gap:8px;color:var(--p-text-muted-color);font-size:13px;padding:24px}.kx-err{margin:0 20px 8px;padding:9px 12px;border-radius:10px;font-size:13px;background:color-mix(in srgb,var(--p-danger-500) 12%,transparent);color:var(--p-danger-600, var(--p-danger-500))}.kx-err.inline{margin:12px 0 0}.ac-mono{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:12px}.ac-muted{color:var(--p-text-muted-color);font-size:12px;overflow-wrap:anywhere}.ac-options{border:1px solid var(--p-content-border-color);border-radius:var(--kx-radius-8);padding:8px 12px}.ac-options summary{cursor:pointer;font-size:13px}.ac-options-filter{width:100%;margin:8px 0}.ac-option{display:grid;gap:4px;padding:6px 0;border-top:1px solid var(--p-content-border-color)}.ac-option-head{display:flex;flex-wrap:wrap;gap:8px;align-items:baseline}input:not([type=checkbox]),select,textarea{font:inherit;color:var(--p-text-color);background-color:var(--p-content-background);border:1px solid var(--p-content-border-color);border-radius:var(--kx-radius-6);padding:8px 10px;width:100%;min-width:0}select{appearance:none;padding-right:32px;cursor:pointer;background-image:linear-gradient(45deg,transparent 50%,var(--p-text-muted-color) 50%),linear-gradient(135deg,var(--p-text-muted-color) 50%,transparent 50%);background-repeat:no-repeat;background-size:5px 5px,5px 5px;background-position:calc(100% - 15px) center,calc(100% - 10px) center}textarea{resize:vertical;line-height:1.6}input[type=checkbox]:not([role=switch]){accent-color:var(--p-primary-color);width:auto}.ac-tabs,.ac-seg{display:inline-flex;gap:4px;padding:3px;border-radius:var(--kx-radius-8);background:var(--kx-overlay-subtle)}.ac-tab,.ac-seg button{display:inline-flex;align-items:center;justify-content:center;gap:6px;font:inherit;cursor:pointer;padding:6px 12px;border-radius:var(--kx-radius-6);border:none;background:transparent;color:var(--p-text-muted-color)}.ac-seg button{flex:1}.ac-tab:hover,.ac-seg button:hover{color:var(--p-text-color)}.ac-tab.active,.ac-seg button.active{background:var(--p-content-background);color:var(--p-primary-color);font-weight:600;box-shadow:var(--kx-shadow-sm)}.ac-chips{display:flex;gap:6px;flex-wrap:wrap;align-items:center}.ac-chip,.ac-hint-chip{display:inline-flex;align-items:center;gap:6px;border:1px solid var(--p-content-border-color);border-radius:var(--kx-radius-6);padding:6px 9px;font:inherit;color:var(--p-text-muted-color);background:var(--p-content-background)}.ac-chip{cursor:pointer}.ac-chip.active{color:var(--p-primary-color);border-color:var(--p-primary-color);background:var(--kx-wash-primary)}.ac-chip:hover{border-color:var(--p-primary-color)}.ac-hint-chip{font-size:11px;background:var(--kx-overlay-subtle);overflow-wrap:anywhere}.ac-icon-btn{display:inline-flex;align-items:center;justify-content:center;width:30px;height:30px;cursor:pointer;border-radius:var(--kx-radius-6);border:none;background:transparent;color:var(--p-text-muted-color)}.ac-icon-btn:hover{color:var(--p-text-color);background:var(--kx-overlay-hover)}.ac-icon-btn:disabled{opacity:.5;cursor:default}.ac-advanced{border-top:1px solid var(--p-content-border-color);padding-top:12px}.ac-advanced>summary{color:var(--p-text-muted-color);cursor:pointer;font-size:12px;padding:4px 0}.ac-advanced[open]>summary{margin-bottom:12px}:host{display:block;font-family:var(--kx-font-body);color:var(--p-text-color)}*{box-sizing:border-box}.tc{display:flex;flex-direction:column;gap:10px}.tc-pair{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:8px}.tc-field{display:flex;flex-direction:column;gap:4px;min-width:0}.tc-lbl{font-size:12px;font-weight:600;color:var(--p-text-muted-color)}.tc-hint{margin:0;font-size:12px;color:var(--p-text-muted-color);line-height:1.45}.tc-hint code{font-size:11px}.tc-mono{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:12px}.tc-check{display:flex;align-items:center;gap:8px;font-size:13px}.tc-check input{accent-color:var(--p-primary-color)}.tc-hint .ac-link{font:inherit;cursor:pointer;color:var(--p-primary-color);background:transparent;border:none;padding:0}.tc-hint .ac-link:hover{text-decoration:underline}', na = {
  type: "object",
  properties: { config: { type: "object", default: {}, description: "Coding agent task Block instance configuration." } }
};
class ia extends rr {
  static get wippyConfig() {
    return { propsSchema: na, hostCssKeys: ["themeConfigUrl"], inlineCss: ta };
  }
  static get vueConfig() {
    return { rootComponent: pa };
  }
}
ur(import.meta.url, ia);
