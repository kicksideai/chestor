import { o as Q, s as g, r as X, g as Y, e as R, a as Z, b as rr, u as ar, W as or } from "./dto-BHfrzLGW.js";
import { defineComponent as er, computed as l, ref as u, watch as cr, openBlock as p, createElementBlock as t, toDisplayString as n, createCommentVNode as i, Fragment as y, createElementVNode as c, renderList as E, createTextVNode as m, unref as pr, createBlock as tr, createStaticVNode as nr, nextTick as ir } from "vue";
import { u as sr, c as lr, s as vr, a as k, e as ur } from "./presentation-Qrstrb4O.js";
import { m as j, a as D, d as $, _ as dr } from "./driver-options.vue_vue_type_script_setup_true_lang-P5mXashh.js";
import "@iconify/vue";
import { define as gr } from "@wippy-fe/proxy";
const mr = Q({
  agent: g().optional(),
  account_id: g().optional(),
  image_id: g().optional(),
  workspace_id: g().optional(),
  prompt: g().optional(),
  include_input: R().optional(),
  unattended: R().optional(),
  options: X(Y()).optional(),
  timeout: g().max(64).optional(),
  repo_url: g().optional()
}).strict(), fr = { class: "tc" }, xr = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, hr = {
  key: 1,
  class: "kx-err inline"
}, br = {
  key: 2,
  class: "kx-loading"
}, yr = { class: "tc-pair" }, kr = { class: "tc-field" }, wr = ["value"], _r = ["value"], Cr = ["value"], zr = { class: "tc-field" }, Tr = ["value"], Ar = { value: "" }, Ur = ["value"], Sr = ["value"], Er = {
  key: 0,
  class: "tc-hint",
  role: "alert"
}, Vr = {
  key: 1,
  class: "tc-hint",
  role: "alert"
}, jr = {
  key: 2,
  class: "tc-hint"
}, Dr = { class: "tc-pair" }, Ir = { class: "tc-field" }, Or = ["value"], Pr = ["value"], Wr = ["value"], Mr = { class: "tc-field" }, Nr = ["value"], Rr = ["value"], $r = ["value"], Br = {
  key: 3,
  class: "tc-hint",
  role: "alert"
}, Fr = {
  key: 4,
  class: "tc-hint",
  role: "alert"
}, qr = {
  key: 5,
  class: "tc-hint",
  role: "alert"
}, Hr = { class: "tc-field" }, Lr = ["value"], Gr = {
  key: 6,
  class: "kx-err",
  role: "alert"
}, Kr = {
  key: 7,
  class: "kx-err",
  role: "alert"
}, Jr = { class: "tc-check" }, Qr = ["checked"], Xr = { class: "ac-advanced" }, Yr = { class: "tc" }, Zr = {
  key: 0,
  class: "tc-check"
}, ra = ["checked"], aa = {
  key: 2,
  class: "kx-err",
  role: "alert"
}, oa = { class: "tc-field" }, ea = ["value"], ca = { class: "tc-field" }, pa = ["value"], ta = /* @__PURE__ */ er({
  __name: "task-config",
  setup(B) {
    const F = Z(), q = rr(), w = l(() => mr.safeParse(F.value.config ?? {})), _ = l(() => w.value.success ? "" : "Workflow configuration is invalid."), o = u(w.value.success ? w.value.data : {});
    cr(w, (e) => {
      if (!e.success) return;
      const r = e.data;
      r && Object.keys(r).length ? (o.value = { ...r }, x.value = !1) : (o.value = {}, N());
    });
    const v = u(null), C = u([]), z = u([]), V = u([]), T = u([]), A = u(""), f = u(0), x = u(!1), U = l(() => C.value.filter((e) => e.agent === o.value.agent && e.usable && e.enabled)), H = sr(), L = l(() => U.value.filter((e) => lr(e, H.value) === "ready")), h = l(() => j(z.value, o.value.agent ?? "")), d = l(() => T.value.find((e) => e.id === o.value.agent)), S = l(() => v.value?.agents.find((e) => e.id === o.value.agent)?.title ?? o.value.agent ?? "this agent"), I = l(() => !!o.value.agent && !v.value?.agents.some((e) => e.id === o.value.agent)), O = l(() => !h.value.some((e) => e.id === o.value.image_id)), P = l(() => !!o.value.account_id && !U.value.some((e) => e.id === o.value.account_id)), W = l(() => !!o.value.workspace_id && !V.value.some((e) => e.id === o.value.workspace_id)), G = l(() => ({ ...D(d.value), ...o.value.options }));
    function s(e) {
      const r = { ...o.value, ...e };
      if (o.value = r, f.value > 0) {
        x.value = !0;
        return;
      }
      x.value = !1, q("config-changed", r);
    }
    function K(e) {
      f.value = e, !e && x.value && ir(() => {
        !f.value && x.value && s({});
      });
    }
    function M(e) {
      f.value = 0;
      const r = j(z.value, e), a = T.value.find((b) => b.id === e);
      s({
        agent: e,
        account_id: "",
        options: D(a),
        unattended: !!a?.unattended,
        image_id: r.find((b) => b.id === o.value.image_id)?.id ?? r[0]?.id ?? ""
      });
    }
    function N() {
      if (!v.value || _.value || Object.keys(o.value).length) return;
      const e = $(v.value, C.value), r = T.value.find((a) => a.id === e);
      s({
        agent: e,
        image_id: j(z.value, e)[0]?.id ?? "",
        account_id: "",
        workspace_id: "",
        include_input: !0,
        unattended: !!r?.unattended,
        options: D(r)
      });
    }
    return ar(vr(async () => {
      try {
        const [e, r, a, b, J] = await Promise.all([k.catalog(), k.accounts(), k.images(), k.workspaces(), k.drivers()]);
        v.value = e, C.value = r, z.value = a, V.value = b.workspaces, T.value = J, A.value = "", N();
      } catch (e) {
        A.value = ur(e, "Could not load the agents.");
      }
    })), (e, r) => (p(), t("div", fr, [
      _.value ? (p(), t("p", xr, n(_.value), 1)) : i("", !0),
      A.value ? (p(), t("p", hr, n(A.value), 1)) : v.value ? _.value ? i("", !0) : (p(), t(y, { key: 3 }, [
        c("div", yr, [
          c("label", kr, [
            r[14] || (r[14] = c("span", { class: "tc-lbl" }, "Agent", -1)),
            c("select", {
              class: "tc-input kx-focus-halo",
              value: o.value.agent,
              onChange: r[0] || (r[0] = (a) => M(a.target.value))
            }, [
              I.value ? (p(), t("option", {
                key: 0,
                value: o.value.agent
              }, "Unavailable agent: " + n(o.value.agent), 9, _r)) : i("", !0),
              (p(!0), t(y, null, E(v.value.agents, (a) => (p(), t("option", {
                key: a.id,
                value: a.id
              }, n(a.title), 9, Cr))), 128))
            ], 40, wr)
          ]),
          c("label", zr, [
            r[15] || (r[15] = c("span", { class: "tc-lbl" }, "Account", -1)),
            c("select", {
              class: "tc-input kx-focus-halo",
              value: o.value.account_id ?? "",
              onChange: r[1] || (r[1] = (a) => s({ account_id: a.target.value }))
            }, [
              c("option", Ar, "Auto (" + n(L.value.length) + " ready)", 1),
              P.value ? (p(), t("option", {
                key: 0,
                value: o.value.account_id
              }, "Unavailable account: " + n(o.value.account_id), 9, Ur)) : i("", !0),
              (p(!0), t(y, null, E(U.value, (a) => (p(), t("option", {
                key: a.id,
                value: a.id
              }, n(a.label), 9, Sr))), 128))
            ], 40, Tr)
          ])
        ]),
        I.value ? (p(), t("p", Er, [
          r[16] || (r[16] = m("This saved agent no longer exists. ", -1)),
          v.value.agents.length ? (p(), t("button", {
            key: 0,
            type: "button",
            class: "ac-link kx-focus-outline",
            onClick: r[2] || (r[2] = (a) => M(pr($)(v.value, C.value)))
          }, "Use default agent")) : i("", !0)
        ])) : i("", !0),
        P.value ? (p(), t("p", Vr, [
          m("This saved account no longer exists, is disabled or cannot run " + n(S.value) + ". ", 1),
          c("button", {
            type: "button",
            class: "ac-link kx-focus-outline",
            onClick: r[3] || (r[3] = (a) => s({ account_id: "" }))
          }, "Use Auto")
        ])) : i("", !0),
        U.value.length ? i("", !0) : (p(), t("p", jr, "Add an account on Autocode → Accounts to run " + n(S.value) + ".", 1)),
        c("div", Dr, [
          c("label", Ir, [
            r[17] || (r[17] = c("span", { class: "tc-lbl" }, "Image (required)", -1)),
            c("select", {
              class: "tc-input kx-focus-halo",
              value: o.value.image_id ?? "",
              onChange: r[4] || (r[4] = (a) => s({ image_id: a.target.value }))
            }, [
              O.value ? (p(), t("option", {
                key: 0,
                value: o.value.image_id ?? ""
              }, n(o.value.image_id ? "Unavailable image: " + o.value.image_id : "Choose an image"), 9, Pr)) : i("", !0),
              (p(!0), t(y, null, E(h.value, (a) => (p(), t("option", {
                key: a.id,
                value: a.id
              }, n(a.label), 9, Wr))), 128))
            ], 40, Or)
          ]),
          c("label", Mr, [
            r[19] || (r[19] = c("span", { class: "tc-lbl" }, "Workspace", -1)),
            c("select", {
              class: "tc-input kx-focus-halo",
              value: o.value.workspace_id ?? "",
              onChange: r[5] || (r[5] = (a) => s({ workspace_id: a.target.value }))
            }, [
              r[18] || (r[18] = c("option", { value: "" }, "Scratch directory", -1)),
              W.value ? (p(), t("option", {
                key: 0,
                value: o.value.workspace_id
              }, "Unavailable workspace: " + n(o.value.workspace_id), 9, Rr)) : i("", !0),
              (p(!0), t(y, null, E(V.value, (a) => (p(), t("option", {
                key: a.id,
                value: a.id
              }, n(a.name) + n(a.writable ? "" : " (read-only)"), 9, $r))), 128))
            ], 40, Nr)
          ])
        ]),
        h.value.length ? O.value ? (p(), t("p", Fr, [
          m("This saved image is missing, is not ready or does not include " + n(S.value) + ". ", 1),
          c("button", {
            type: "button",
            class: "ac-link kx-focus-outline",
            onClick: r[6] || (r[6] = (a) => s({ image_id: h.value[0].id }))
          }, "Use " + n(h.value[0].label), 1)
        ])) : i("", !0) : (p(), t("p", Br, "No image with " + n(S.value) + "; ask an administrator.", 1)),
        W.value ? (p(), t("p", qr, [
          r[20] || (r[20] = m("This saved workspace no longer exists or is unavailable. ", -1)),
          c("button", {
            type: "button",
            class: "ac-link kx-focus-outline",
            onClick: r[7] || (r[7] = (a) => s({ workspace_id: "" }))
          }, "Use Scratch")
        ])) : i("", !0),
        c("label", Hr, [
          r[21] || (r[21] = c("span", { class: "tc-lbl" }, "Task (required)", -1)),
          c("textarea", {
            class: "tc-input kx-focus-halo",
            rows: "4",
            value: o.value.prompt,
            placeholder: "What should the agent do?",
            onInput: r[8] || (r[8] = (a) => s({ prompt: a.target.value }))
          }, null, 40, Lr)
        ]),
        o.value.prompt?.trim() ? i("", !0) : (p(), t("p", Gr, "Enter a task prompt.")),
        o.value.image_id ? i("", !0) : (p(), t("p", Kr, "Choose an image.")),
        c("label", Jr, [
          c("input", {
            type: "checkbox",
            class: "kx-focus-outline",
            checked: o.value.include_input !== !1,
            onChange: r[9] || (r[9] = (a) => s({ include_input: a.target.checked }))
          }, null, 40, Qr),
          r[22] || (r[22] = m(" Pass the node's input to the agent after the task ", -1))
        ]),
        c("details", Xr, [
          r[26] || (r[26] = c("summary", { class: "kx-focus-outline" }, "Advanced", -1)),
          c("div", Yr, [
            d.value?.unattended ? (p(), t("label", Zr, [
              c("input", {
                type: "checkbox",
                class: "kx-focus-outline",
                checked: o.value.unattended !== !1,
                onChange: r[10] || (r[10] = (a) => s({ unattended: a.target.checked }))
              }, null, 40, ra),
              r[23] || (r[23] = m(" Unattended: skip permission prompts ", -1))
            ])) : i("", !0),
            d.value ? (p(), tr(dr, {
              key: d.value.id,
              options: d.value.options,
              "model-value": G.value,
              locked: o.value.unattended !== !1 && d.value.unattended ? d.value.unattended : {},
              onInvalid: K,
              "onUpdate:modelValue": r[11] || (r[11] = (a) => s({ options: a }))
            }, null, 8, ["options", "model-value", "locked"])) : i("", !0),
            f.value ? (p(), t("p", aa, "Driver options are invalid. These drafts and further changes are not applied to the workflow until all options are valid.")) : i("", !0),
            c("label", oa, [
              r[24] || (r[24] = c("span", { class: "tc-lbl" }, "Timeout", -1)),
              c("input", {
                class: "tc-input tc-mono kx-focus-halo",
                value: o.value.timeout,
                placeholder: "Use configured timeout",
                onChange: r[12] || (r[12] = (a) => s({ timeout: a.target.value }))
              }, null, 40, ea)
            ]),
            c("label", ca, [
              r[25] || (r[25] = c("span", { class: "tc-lbl" }, "Git repository", -1)),
              c("input", {
                class: "tc-input tc-mono kx-focus-halo",
                value: o.value.repo_url,
                placeholder: "optional",
                onChange: r[13] || (r[13] = (a) => s({ repo_url: a.target.value }))
              }, null, 40, pa)
            ])
          ])
        ]),
        r[27] || (r[27] = nr('<p class="tc-hint">Output: <code>run_id</code>, <code>status</code>, <code>answer</code>, <code>error</code>, <code>usage</code>, <code>agent</code>, <code>account_id</code>; next nodes read them as <code>output.answer</code>.</p>', 1))
      ], 64)) : (p(), t("div", br, "Loading agents…"))
    ]));
  }
}), na = ':root{--p-form-field-padding-x: .75rem;--p-form-field-padding-y: .5rem;--p-form-field-sm-padding-x: .625rem;--p-form-field-sm-padding-y: .375rem;--p-form-field-lg-padding-x: .875rem;--p-form-field-lg-padding-y: .625rem;--p-form-field-border-radius: .375rem;--p-form-field-transition-duration: .2s;--p-form-field-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), 0 1px 2px 0 rgba(18, 18, 23, .05);--p-focus-ring-width: 1px;--p-focus-ring-style: solid;--p-focus-ring-color: color-mix(in srgb, var(--p-primary-color) 100%, transparent);--p-focus-ring-offset: 2px;--p-toggleswitch-width: 2.5rem;--p-toggleswitch-height: 1.5rem;--p-toggleswitch-border-radius: 30px;--p-toggleswitch-gap: .25rem;--p-toggleswitch-border-width: 1px;--p-toggleswitch-transition-duration: .2s;--p-toggleswitch-slide-duration: .2s;--p-toggleswitch-handle-size: 1rem;--p-toggleswitch-handle-border-radius: 9999px}:root{color-scheme:light dark;--p-primary: rgb(0, 95, 178);--p-primary-50: color-mix(in srgb, var(--p-primary) 5%, white);--p-primary-100: color-mix(in srgb, var(--p-primary) 10%, white);--p-primary-200: color-mix(in srgb, var(--p-primary) 20%, white);--p-primary-300: color-mix(in srgb, var(--p-primary) 30%, white);--p-primary-400: color-mix(in srgb, var(--p-primary) 40%, white);--p-primary-500: var(--p-primary);--p-primary-600: color-mix(in srgb, var(--p-primary) 80%, black);--p-primary-700: color-mix(in srgb, var(--p-primary) 70%, black);--p-primary-800: color-mix(in srgb, var(--p-primary) 60%, black);--p-primary-900: color-mix(in srgb, var(--p-primary) 50%, black);--p-primary-950: color-mix(in srgb, var(--p-primary) 40%, black);--p-secondary: #6f7385;--p-secondary-50: color-mix(in srgb, var(--p-secondary) 5%, white);--p-secondary-100: color-mix(in srgb, var(--p-secondary) 10%, white);--p-secondary-200: color-mix(in srgb, var(--p-secondary) 20%, white);--p-secondary-300: color-mix(in srgb, var(--p-secondary) 35%, white);--p-secondary-400: color-mix(in srgb, var(--p-secondary) 65%, white);--p-secondary-500: var(--p-secondary);--p-secondary-600: color-mix(in srgb, var(--p-secondary) 80%, black);--p-secondary-700: color-mix(in srgb, var(--p-secondary) 65%, black);--p-secondary-800: color-mix(in srgb, var(--p-secondary) 55%, black);--p-secondary-900: color-mix(in srgb, var(--p-secondary) 50%, black);--p-secondary-950: color-mix(in srgb, var(--p-secondary) 30%, black);--p-danger: rgb(239, 68, 68);--p-danger-50: color-mix(in srgb, var(--p-danger) 5%, white);--p-danger-100: color-mix(in srgb, var(--p-danger) 10%, white);--p-danger-200: color-mix(in srgb, var(--p-danger) 20%, white);--p-danger-300: color-mix(in srgb, var(--p-danger) 30%, white);--p-danger-400: color-mix(in srgb, var(--p-danger) 40%, white);--p-danger-500: var(--p-danger);--p-danger-600: color-mix(in srgb, var(--p-danger) 80%, black);--p-danger-700: color-mix(in srgb, var(--p-danger) 70%, black);--p-danger-800: color-mix(in srgb, var(--p-danger) 60%, black);--p-danger-900: color-mix(in srgb, var(--p-danger) 50%, black);--p-danger-950: color-mix(in srgb, var(--p-danger) 40%, black);--p-success: rgb(34, 197, 94);--p-success-50: color-mix(in srgb, var(--p-success) 5%, white);--p-success-100: color-mix(in srgb, var(--p-success) 10%, white);--p-success-200: color-mix(in srgb, var(--p-success) 20%, white);--p-success-300: color-mix(in srgb, var(--p-success) 30%, white);--p-success-400: color-mix(in srgb, var(--p-success) 40%, white);--p-success-500: var(--p-success);--p-success-600: color-mix(in srgb, var(--p-success) 80%, black);--p-success-700: color-mix(in srgb, var(--p-success) 70%, black);--p-success-800: color-mix(in srgb, var(--p-success) 60%, black);--p-success-900: color-mix(in srgb, var(--p-success) 50%, black);--p-success-950: color-mix(in srgb, var(--p-success) 40%, black);--p-warn: rgb(249, 115, 22);--p-warn-50: color-mix(in srgb, var(--p-warn) 5%, white);--p-warn-100: color-mix(in srgb, var(--p-warn) 10%, white);--p-warn-200: color-mix(in srgb, var(--p-warn) 20%, white);--p-warn-300: color-mix(in srgb, var(--p-warn) 30%, white);--p-warn-400: color-mix(in srgb, var(--p-warn) 40%, white);--p-warn-500: var(--p-warn);--p-warn-600: color-mix(in srgb, var(--p-warn) 80%, black);--p-warn-700: color-mix(in srgb, var(--p-warn) 70%, black);--p-warn-800: color-mix(in srgb, var(--p-warn) 60%, black);--p-warn-900: color-mix(in srgb, var(--p-warn) 50%, black);--p-warn-950: color-mix(in srgb, var(--p-warn) 40%, black);--p-info: rgb(14, 165, 233);--p-info-50: color-mix(in srgb, var(--p-info) 5%, white);--p-info-100: color-mix(in srgb, var(--p-info) 10%, white);--p-info-200: color-mix(in srgb, var(--p-info) 20%, white);--p-info-300: color-mix(in srgb, var(--p-info) 30%, white);--p-info-400: color-mix(in srgb, var(--p-info) 40%, white);--p-info-500: var(--p-info);--p-info-600: color-mix(in srgb, var(--p-info) 80%, black);--p-info-700: color-mix(in srgb, var(--p-info) 70%, black);--p-info-800: color-mix(in srgb, var(--p-info) 60%, black);--p-info-900: color-mix(in srgb, var(--p-info) 50%, black);--p-info-950: color-mix(in srgb, var(--p-info) 40%, black);--p-help: rgb(168, 85, 247);--p-help-50: color-mix(in srgb, var(--p-help) 5%, white);--p-help-100: color-mix(in srgb, var(--p-help) 10%, white);--p-help-200: color-mix(in srgb, var(--p-help) 20%, white);--p-help-300: color-mix(in srgb, var(--p-help) 30%, white);--p-help-400: color-mix(in srgb, var(--p-help) 40%, white);--p-help-500: var(--p-help);--p-help-600: color-mix(in srgb, var(--p-help) 80%, black);--p-help-700: color-mix(in srgb, var(--p-help) 70%, black);--p-help-800: color-mix(in srgb, var(--p-help) 60%, black);--p-help-900: color-mix(in srgb, var(--p-help) 50%, black);--p-help-950: color-mix(in srgb, var(--p-help) 40%, black);--p-accent: rgb(20, 184, 166);--p-accent-50: color-mix(in srgb, var(--p-accent) 5%, white);--p-accent-100: color-mix(in srgb, var(--p-accent) 10%, white);--p-accent-200: color-mix(in srgb, var(--p-accent) 20%, white);--p-accent-300: color-mix(in srgb, var(--p-accent) 30%, white);--p-accent-400: color-mix(in srgb, var(--p-accent) 40%, white);--p-accent-500: var(--p-accent);--p-accent-600: color-mix(in srgb, var(--p-accent) 80%, black);--p-accent-700: color-mix(in srgb, var(--p-accent) 70%, black);--p-accent-800: color-mix(in srgb, var(--p-accent) 60%, black);--p-accent-900: color-mix(in srgb, var(--p-accent) 50%, black);--p-accent-950: color-mix(in srgb, var(--p-accent) 40%, black);--p-surface-0: #ffffff;--p-surface-50: #fafafa;--p-surface-100: #f5f5f5;--p-surface-200: #e5e5e5;--p-surface-300: #d4d4d4;--p-surface-400: #a3a3a3;--p-surface-500: #737373;--p-surface-600: #525252;--p-surface-700: #404040;--p-surface-800: #262626;--p-surface-850: color-mix(in srgb, var(--p-surface-800) 50%, var(--p-surface-900));--p-surface-900: #171717;--p-surface-950: #0a0a0a;--p-content-border-radius: 6px;--p-font-heading-family: var(--v-font-family-head, Arial);--p-font-heading-scale: 1;--p-font-heading-line-height: 1.5;--p-font-heading-letter-spacing: normal;--p-font-heading-stretch: normal;--p-font-heading-variation-settings: normal;--p-font-body-scale: 1;--p-font-body-line-height: 1.5;--p-font-body-letter-spacing: normal;--p-font-body-stretch: normal;--p-font-body-variation-settings: normal;--p-font-mono-family: ui-monospace}:root{--p-primary-color: var(--p-primary-500);--p-primary-contrast-color: var(--p-surface-0);--p-primary-hover-color: var(--p-primary-600);--p-primary-active-color: var(--p-primary-700);--p-secondary-color: var(--p-secondary-500);--p-secondary-contrast-color: var(--p-surface-0);--p-secondary-hover-color: var(--p-secondary-600);--p-secondary-active-color: var(--p-secondary-700);--p-danger-color: var(--p-danger-500);--p-danger-contrast-color: var(--p-surface-0);--p-danger-hover-color: var(--p-danger-600);--p-danger-active-color: var(--p-danger-700);--p-success-color: var(--p-success-500);--p-success-contrast-color: var(--p-surface-0);--p-success-hover-color: var(--p-success-600);--p-success-active-color: var(--p-success-700);--p-warn-color: var(--p-warn-500);--p-warn-contrast-color: var(--p-surface-0);--p-warn-hover-color: var(--p-warn-600);--p-warn-active-color: var(--p-warn-700);--p-info-color: var(--p-info-500);--p-info-contrast-color: var(--p-surface-0);--p-info-hover-color: var(--p-info-600);--p-info-active-color: var(--p-info-700);--p-help-color: var(--p-help-500);--p-help-contrast-color: var(--p-surface-0);--p-help-hover-color: var(--p-help-600);--p-help-active-color: var(--p-help-700);--p-accent-color: var(--p-accent-500);--p-accent-contrast-color: var(--p-surface-0);--p-accent-hover-color: var(--p-accent-600);--p-accent-active-color: var(--p-accent-700);--p-content-border-color: var(--p-surface-200);--p-content-hover-background: var(--p-surface-100);--p-content-hover-color: var(--p-surface-800);--p-highlight-background: var(--p-primary-50);--p-highlight-color: var(--p-primary-700);--p-highlight-focus-background: var(--p-primary-100);--p-highlight-focus-color: var(--p-primary-800);--p-content-background: var(--p-surface-0);--p-text-color: var(--p-surface-700);--p-text-hover-color: var(--p-surface-800);--p-text-muted-color: var(--p-surface-500);--p-text-hover-muted-color: var(--p-surface-600)}@media(prefers-color-scheme:dark){:root:not(.w-theme-light){--p-surface-D: #fff;--p-surface-0: #fff;--p-surface-50: #fafafa;--p-surface-100: #f4f4f5;--p-surface-200: #e4e4e7;--p-surface-300: #d4d4d8;--p-surface-400: #a1a1aa;--p-surface-500: #71717a;--p-surface-600: #545250;--p-surface-700: #403e3c;--p-surface-800: #2b2927;--p-surface-850: color-mix(in srgb, var(--p-surface-800) 50%, var(--p-surface-900));--p-surface-900: #1c1a19;--p-surface-950: #0f0e0d;--p-primary: rgb(0, 125, 178);--p-primary-50: color-mix(in srgb, var(--p-primary) 5%, white);--p-primary-100: color-mix(in srgb, var(--p-primary) 10%, white);--p-primary-200: color-mix(in srgb, var(--p-primary) 20%, white);--p-primary-300: color-mix(in srgb, var(--p-primary) 30%, white);--p-primary-400: color-mix(in srgb, var(--p-primary) 40%, white);--p-primary-500: var(--p-primary);--p-primary-600: color-mix(in srgb, var(--p-primary) 80%, black);--p-primary-700: color-mix(in srgb, var(--p-primary) 70%, black);--p-primary-800: color-mix(in srgb, var(--p-primary) 60%, black);--p-primary-900: color-mix(in srgb, var(--p-primary) 50%, black);--p-primary-950: color-mix(in srgb, var(--p-primary) 40%, black);--p-primary-color: var(--p-primary-400);--p-primary-contrast-color: var(--p-surface-900);--p-primary-hover-color: var(--p-primary-300);--p-primary-active-color: var(--p-primary-200);--p-secondary-color: var(--p-secondary-400);--p-secondary-contrast-color: var(--p-surface-900);--p-secondary-hover-color: var(--p-secondary-300);--p-secondary-active-color: var(--p-secondary-200);--p-danger-color: var(--p-danger-400);--p-danger-contrast-color: var(--p-surface-900);--p-danger-hover-color: var(--p-danger-300);--p-danger-active-color: var(--p-danger-200);--p-success-color: var(--p-success-400);--p-success-contrast-color: var(--p-surface-900);--p-success-hover-color: var(--p-success-300);--p-success-active-color: var(--p-success-200);--p-warn-color: var(--p-warn-400);--p-warn-contrast-color: var(--p-surface-900);--p-warn-hover-color: var(--p-warn-300);--p-warn-active-color: var(--p-warn-200);--p-info-color: var(--p-info-400);--p-info-contrast-color: var(--p-surface-900);--p-info-hover-color: var(--p-info-300);--p-info-active-color: var(--p-info-200);--p-help-color: var(--p-help-400);--p-help-contrast-color: var(--p-surface-900);--p-help-hover-color: var(--p-help-300);--p-help-active-color: var(--p-help-200);--p-accent-color: var(--p-accent-400);--p-accent-contrast-color: var(--p-surface-900);--p-accent-hover-color: var(--p-accent-300);--p-accent-active-color: var(--p-accent-200);--p-content-border-color: var(--p-surface-700);--p-content-hover-background: var(--p-surface-800);--p-content-hover-color: var(--p-surface-0);--p-highlight-background: color-mix(in srgb, var(--p-primary-400), transparent 84%);--p-highlight-color: rgba(255, 255, 255, 87%);--p-highlight-focus-background: color-mix(in srgb, var(--p-primary-400), transparent 76%);--p-highlight-focus-color: rgba(255, 255, 255, 87%);--p-content-background: var(--p-surface-900);--p-text-color: var(--p-surface-0);--p-text-hover-color: var(--p-surface-0);--p-text-muted-color: var(--p-surface-400);--p-text-hover-muted-color: var(--p-surface-300)}}:root.w-theme-dark,.w-theme-dark{color-scheme:dark;--p-surface-D: #fff;--p-surface-0: #fff;--p-surface-50: #fafafa;--p-surface-100: #f4f4f5;--p-surface-200: #e4e4e7;--p-surface-300: #d4d4d8;--p-surface-400: #a1a1aa;--p-surface-500: #71717a;--p-surface-600: #545250;--p-surface-700: #403e3c;--p-surface-800: #2b2927;--p-surface-850: color-mix(in srgb, var(--p-surface-800) 50%, var(--p-surface-900));--p-surface-900: #1c1a19;--p-surface-950: #0f0e0d;--p-primary: rgb(0, 125, 178);--p-primary-50: color-mix(in srgb, var(--p-primary) 5%, white);--p-primary-100: color-mix(in srgb, var(--p-primary) 10%, white);--p-primary-200: color-mix(in srgb, var(--p-primary) 20%, white);--p-primary-300: color-mix(in srgb, var(--p-primary) 30%, white);--p-primary-400: color-mix(in srgb, var(--p-primary) 40%, white);--p-primary-500: var(--p-primary);--p-primary-600: color-mix(in srgb, var(--p-primary) 80%, black);--p-primary-700: color-mix(in srgb, var(--p-primary) 70%, black);--p-primary-800: color-mix(in srgb, var(--p-primary) 60%, black);--p-primary-900: color-mix(in srgb, var(--p-primary) 50%, black);--p-primary-950: color-mix(in srgb, var(--p-primary) 40%, black);--p-primary-color: var(--p-primary-400);--p-primary-contrast-color: var(--p-surface-900);--p-primary-hover-color: var(--p-primary-300);--p-primary-active-color: var(--p-primary-200);--p-secondary-color: var(--p-secondary-400);--p-secondary-contrast-color: var(--p-surface-900);--p-secondary-hover-color: var(--p-secondary-300);--p-secondary-active-color: var(--p-secondary-200);--p-danger-color: var(--p-danger-400);--p-danger-contrast-color: var(--p-surface-900);--p-danger-hover-color: var(--p-danger-300);--p-danger-active-color: var(--p-danger-200);--p-success-color: var(--p-success-400);--p-success-contrast-color: var(--p-surface-900);--p-success-hover-color: var(--p-success-300);--p-success-active-color: var(--p-success-200);--p-warn-color: var(--p-warn-400);--p-warn-contrast-color: var(--p-surface-900);--p-warn-hover-color: var(--p-warn-300);--p-warn-active-color: var(--p-warn-200);--p-info-color: var(--p-info-400);--p-info-contrast-color: var(--p-surface-900);--p-info-hover-color: var(--p-info-300);--p-info-active-color: var(--p-info-200);--p-help-color: var(--p-help-400);--p-help-contrast-color: var(--p-surface-900);--p-help-hover-color: var(--p-help-300);--p-help-active-color: var(--p-help-200);--p-accent-color: var(--p-accent-400);--p-accent-contrast-color: var(--p-surface-900);--p-accent-hover-color: var(--p-accent-300);--p-accent-active-color: var(--p-accent-200);--p-content-border-color: var(--p-surface-700);--p-content-hover-background: var(--p-surface-800);--p-content-hover-color: var(--p-surface-0);--p-highlight-background: color-mix(in srgb, var(--p-primary-400), transparent 84%);--p-highlight-color: rgba(255, 255, 255, 87%);--p-highlight-focus-background: color-mix(in srgb, var(--p-primary-400), transparent 76%);--p-highlight-focus-color: rgba(255, 255, 255, 87%);--p-content-background: var(--p-surface-900);--p-text-color: var(--p-surface-0);--p-text-hover-color: var(--p-surface-0);--p-text-muted-color: var(--p-surface-400);--p-text-hover-muted-color: var(--p-surface-300)}:root.w-theme-light,.w-theme-light{color-scheme:light;--p-surface-0: #ffffff;--p-surface-50: #fafafa;--p-surface-100: #f5f5f5;--p-surface-200: #e5e5e5;--p-surface-300: #d4d4d4;--p-surface-400: #a3a3a3;--p-surface-500: #737373;--p-surface-600: #525252;--p-surface-700: #404040;--p-surface-800: #262626;--p-surface-850: color-mix(in srgb, var(--p-surface-800) 50%, var(--p-surface-900));--p-surface-900: #171717;--p-surface-950: #0a0a0a;--p-primary: rgb(0, 95, 178);--p-primary-50: color-mix(in srgb, var(--p-primary) 5%, white);--p-primary-100: color-mix(in srgb, var(--p-primary) 10%, white);--p-primary-200: color-mix(in srgb, var(--p-primary) 20%, white);--p-primary-300: color-mix(in srgb, var(--p-primary) 30%, white);--p-primary-400: color-mix(in srgb, var(--p-primary) 40%, white);--p-primary-500: var(--p-primary);--p-primary-600: color-mix(in srgb, var(--p-primary) 80%, black);--p-primary-700: color-mix(in srgb, var(--p-primary) 70%, black);--p-primary-800: color-mix(in srgb, var(--p-primary) 60%, black);--p-primary-900: color-mix(in srgb, var(--p-primary) 50%, black);--p-primary-950: color-mix(in srgb, var(--p-primary) 40%, black);--p-primary-color: var(--p-primary-500);--p-primary-contrast-color: var(--p-surface-0);--p-primary-hover-color: var(--p-primary-600);--p-primary-active-color: var(--p-primary-700);--p-secondary-color: var(--p-secondary-500);--p-secondary-contrast-color: var(--p-surface-0);--p-secondary-hover-color: var(--p-secondary-600);--p-secondary-active-color: var(--p-secondary-700);--p-danger-color: var(--p-danger-500);--p-danger-contrast-color: var(--p-surface-0);--p-danger-hover-color: var(--p-danger-600);--p-danger-active-color: var(--p-danger-700);--p-success-color: var(--p-success-500);--p-success-contrast-color: var(--p-surface-0);--p-success-hover-color: var(--p-success-600);--p-success-active-color: var(--p-success-700);--p-warn-color: var(--p-warn-500);--p-warn-contrast-color: var(--p-surface-0);--p-warn-hover-color: var(--p-warn-600);--p-warn-active-color: var(--p-warn-700);--p-info-color: var(--p-info-500);--p-info-contrast-color: var(--p-surface-0);--p-info-hover-color: var(--p-info-600);--p-info-active-color: var(--p-info-700);--p-help-color: var(--p-help-500);--p-help-contrast-color: var(--p-surface-0);--p-help-hover-color: var(--p-help-600);--p-help-active-color: var(--p-help-700);--p-accent-color: var(--p-accent-500);--p-accent-contrast-color: var(--p-surface-0);--p-accent-hover-color: var(--p-accent-600);--p-accent-active-color: var(--p-accent-700);--p-content-border-color: var(--p-surface-200);--p-content-hover-background: var(--p-surface-100);--p-content-hover-color: var(--p-surface-800);--p-highlight-background: var(--p-primary-50);--p-highlight-color: var(--p-primary-700);--p-highlight-focus-background: var(--p-primary-100);--p-highlight-focus-color: var(--p-primary-800);--p-content-background: var(--p-surface-0);--p-text-color: var(--p-surface-700);--p-text-hover-color: var(--p-surface-800);--p-text-muted-color: var(--p-surface-500);--p-text-hover-muted-color: var(--p-surface-600)}:host,:root{--kx-surface-1: color-mix(in srgb, var(--p-content-background) 96%, var(--p-text-color) 4%);--kx-surface-2: color-mix(in srgb, var(--p-content-background) 92%, var(--p-text-color) 8%);--kx-surface-3: color-mix(in srgb, var(--p-content-background) 86%, var(--p-text-color) 14%);--kx-surface-4: color-mix(in srgb, var(--p-content-background) 78%, var(--p-text-color) 22%);--kx-border-strong: color-mix(in srgb, var(--p-content-border-color) 60%, var(--p-text-color) 40%);--kx-border-stronger: color-mix(in srgb, var(--p-content-border-color) 30%, var(--p-text-color) 70%);--kx-text-faint: color-mix(in srgb, var(--p-text-muted-color) 70%, var(--p-content-background) 30%);--kx-text-fainter: color-mix(in srgb, var(--p-text-muted-color) 45%, var(--p-content-background) 55%);--kx-wash-primary: color-mix(in srgb, var(--p-primary-color) 12%, var(--p-content-background) 88%);--kx-wash-success: color-mix(in srgb, var(--p-success-500) 12%, var(--p-content-background) 88%);--kx-wash-info: color-mix(in srgb, var(--p-info-500) 12%, var(--p-content-background) 88%);--kx-wash-warn: color-mix(in srgb, var(--p-warn-500) 12%, var(--p-content-background) 88%);--kx-wash-danger: color-mix(in srgb, var(--p-danger-500) 12%, var(--p-content-background) 88%);--kx-wash-help: color-mix(in srgb, var(--p-help-500) 12%, var(--p-content-background) 88%);--kx-font-heading: "Outfit", system-ui, sans-serif;--kx-font-body: "Inter", system-ui, sans-serif;--kx-radius-4: 4px;--kx-radius-6: 6px;--kx-radius-8: 8px;--kx-radius-10: 10px;--kx-radius-14: 14px;--kx-radius-16: 16px;--kx-radius-tag: var(--p-content-border-radius, 6px);--kx-control-height: 34px;--kx-shadow-sm: 0 1px 2px rgba(0, 0, 0, .08);--kx-shadow-md: 0 4px 24px rgba(0, 0, 0, .12);--kx-shadow-lg: 0 16px 60px rgba(0, 0, 0, .18);--kx-overlay-hover: color-mix(in srgb, var(--p-text-color) 7%, transparent);--kx-overlay-subtle: color-mix(in srgb, var(--p-text-color) 4%, transparent)}@media(prefers-color-scheme:dark){:host(:not(.w-theme-light)),:root:not(.w-theme-light){--kx-shadow-sm: 0 1px 2px rgba(0, 0, 0, .35);--kx-shadow-md: 0 4px 24px rgba(0, 0, 0, .45);--kx-shadow-lg: 0 16px 60px rgba(0, 0, 0, .6)}}:host(.w-theme-dark),:root.w-theme-dark{--kx-shadow-sm: 0 1px 2px rgba(0, 0, 0, .35);--kx-shadow-md: 0 4px 24px rgba(0, 0, 0, .45);--kx-shadow-lg: 0 16px 60px rgba(0, 0, 0, .6)}.kx-focus-halo:focus-visible{border-color:var(--p-focus-ring-color);outline:none;box-shadow:var(--p-focus-ring-shadow)}.kx-focus-outline:focus-visible{outline:var(--p-focus-ring-width) var(--p-focus-ring-style) var(--p-focus-ring-color);outline-offset:var(--p-focus-ring-offset);box-shadow:none}.kx-empty{text-align:center;padding:44px 24px;display:flex;flex-direction:column;align-items:center;gap:8px}.kx-empty-ico{width:56px;height:56px;border-radius:14px;display:flex;align-items:center;justify-content:center;background:color-mix(in srgb,var(--p-primary-color) 12%,transparent);color:var(--p-primary-color);margin-bottom:4px}.kx-empty-ico svg{width:28px;height:28px}.kx-empty-title{font-size:15px;font-weight:700;color:var(--p-text-color);margin:0}.kx-empty-sub{font-size:13px;color:var(--p-text-muted-color);max-width:380px;margin:0}.kx-empty>.p-button{margin-top:6px}.kx-empty-actions{display:flex;gap:8px;margin-top:6px}.kx-loading{display:flex;align-items:center;gap:8px;color:var(--p-text-muted-color);font-size:13px;padding:24px}.kx-err{margin:0 20px 8px;padding:9px 12px;border-radius:10px;font-size:13px;background:color-mix(in srgb,var(--p-danger-500) 12%,transparent);color:var(--p-danger-600, var(--p-danger-500))}.kx-err.inline{margin:12px 0 0}.ac-mono{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:12px}.ac-muted{color:var(--p-text-muted-color);font-size:12px;overflow-wrap:anywhere}.ac-options{border:1px solid var(--p-content-border-color);border-radius:var(--kx-radius-8);padding:8px 12px}.ac-options summary{cursor:pointer;font-size:13px}.ac-options-filter{width:100%;margin:8px 0}.ac-option{display:grid;gap:4px;padding:6px 0;border-top:1px solid var(--p-content-border-color)}.ac-option-head{display:flex;flex-wrap:wrap;gap:8px;align-items:baseline}input:not([type=checkbox]),select,textarea{font:inherit;color:var(--p-text-color);background-color:var(--p-content-background);border:1px solid var(--p-content-border-color);border-radius:var(--kx-radius-6);padding:8px 10px;width:100%;min-width:0}select{appearance:none;padding-right:32px;cursor:pointer;background-image:linear-gradient(45deg,transparent 50%,var(--p-text-muted-color) 50%),linear-gradient(135deg,var(--p-text-muted-color) 50%,transparent 50%);background-repeat:no-repeat;background-size:5px 5px,5px 5px;background-position:calc(100% - 15px) center,calc(100% - 10px) center}textarea{resize:vertical;line-height:1.6}input[type=checkbox]{accent-color:var(--p-primary-color);width:auto}.ac-tabs,.ac-seg{display:inline-flex;gap:4px;padding:3px;border-radius:var(--kx-radius-8);background:var(--kx-overlay-subtle)}.ac-tab,.ac-seg button{display:inline-flex;align-items:center;justify-content:center;gap:6px;font:inherit;cursor:pointer;padding:6px 12px;border-radius:var(--kx-radius-6);border:none;background:transparent;color:var(--p-text-muted-color)}.ac-seg button{flex:1}.ac-tab:hover,.ac-seg button:hover{color:var(--p-text-color)}.ac-tab.active,.ac-seg button.active{background:var(--p-content-background);color:var(--p-primary-color);font-weight:600;box-shadow:var(--kx-shadow-sm)}.ac-chips{display:flex;gap:6px;flex-wrap:wrap;align-items:center}.ac-chip,.ac-hint-chip{display:inline-flex;align-items:center;gap:6px;border:1px solid var(--p-content-border-color);border-radius:var(--kx-radius-6);padding:6px 9px;font:inherit;color:var(--p-text-muted-color);background:var(--p-content-background)}.ac-chip{cursor:pointer}.ac-chip.active{color:var(--p-primary-color);border-color:var(--p-primary-color);background:var(--kx-wash-primary)}.ac-chip:hover{border-color:var(--p-primary-color)}.ac-hint-chip{font-size:11px;background:var(--kx-overlay-subtle);overflow-wrap:anywhere}.ac-icon-btn{display:inline-flex;align-items:center;justify-content:center;width:30px;height:30px;cursor:pointer;border-radius:var(--kx-radius-6);border:none;background:transparent;color:var(--p-text-muted-color)}.ac-icon-btn:hover{color:var(--p-text-color);background:var(--kx-overlay-hover)}.ac-icon-btn:disabled{opacity:.5;cursor:default}.ac-advanced{border-top:1px solid var(--p-content-border-color);padding-top:12px}.ac-advanced>summary{color:var(--p-text-muted-color);cursor:pointer;font-size:12px;padding:4px 0}.ac-advanced[open]>summary{margin-bottom:12px}:host{display:block;font-family:var(--kx-font-body);color:var(--p-text-color)}*{box-sizing:border-box}.tc{display:flex;flex-direction:column;gap:10px}.tc-pair{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:8px}.tc-field{display:flex;flex-direction:column;gap:4px;min-width:0}.tc-lbl{font-size:12px;font-weight:600;color:var(--p-text-muted-color)}.tc-hint{margin:0;font-size:12px;color:var(--p-text-muted-color);line-height:1.45}.tc-hint code{font-size:11px}.tc-mono{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:12px}.tc-check{display:flex;align-items:center;gap:8px;font-size:13px}.tc-check input{accent-color:var(--p-primary-color)}.tc-hint .ac-link{font:inherit;cursor:pointer;color:var(--p-primary-color);background:transparent;border:none;padding:0}.tc-hint .ac-link:hover{text-decoration:underline}', ia = {
  type: "object",
  properties: { config: { type: "object", description: "Coding agent task Block instance configuration." } }
};
class sa extends or {
  static get wippyConfig() {
    return { propsSchema: ia, hostCssKeys: ["themeConfigUrl"], inlineCss: na };
  }
  static get vueConfig() {
    return { rootComponent: ta };
  }
}
gr(import.meta.url, sa);
