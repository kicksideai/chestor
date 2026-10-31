import { a as ar, b as er, W as or } from "./dto-CcYNmUR0.js";
import { defineComponent as pr, computed as b, ref as v, onUnmounted as cr, watch as z, openBlock as c, createElementBlock as i, Fragment as $, toDisplayString as l, createCommentVNode as s, createElementVNode as o, withDirectives as C, renderList as K, vModelSelect as W, createVNode as I, unref as T, createTextVNode as S, withModifiers as q, normalizeClass as ir, vModelText as M } from "vue";
import { Icon as J } from "@iconify/vue";
import { d as tr } from "./driver-account-types-Bir4q_IM.js";
import { define as nr } from "@wippy-fe/proxy";
const lr = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, sr = {
  key: 1,
  class: "da"
}, dr = { class: "kx-card-head" }, vr = { class: "kx-card-name" }, ur = { class: "da-field" }, mr = ["disabled"], gr = ["value"], xr = {
  key: 0,
  class: "da-notice",
  role: "note"
}, fr = { key: 0 }, br = ["disabled"], hr = { key: 1 }, yr = {
  key: 1,
  class: "da-field"
}, kr = { class: "da-lbl" }, wr = {
  key: 0,
  class: "da-opt"
}, _r = ["disabled", "placeholder"], zr = {
  key: 2,
  class: "kx-err",
  role: "alert"
}, Cr = { class: "da-field" }, Sr = ["disabled"], jr = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, Vr = {
  key: 0,
  class: "da-pair"
}, Ar = {
  key: 0,
  class: "da-field"
}, Dr = ["disabled"], Er = ["value"], Ur = { class: "da-field" }, Or = ["disabled"], $r = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, Mr = { class: "da-field" }, Nr = ["disabled"], Pr = {
  key: 4,
  class: "kx-err",
  role: "alert"
}, Lr = { class: "da-foot" }, Ir = ["disabled"], Tr = {
  key: 5,
  class: "kx-err inline"
}, Jr = /* @__PURE__ */ pr({
  __name: "driver-account",
  setup(H) {
    const B = ar(), Y = er(), N = b(() => tr.safeParse(B.value.config)), p = b(() => N.value.success ? N.value.data : null), R = b(() => B.value.config && !N.value.success ? "Account form configuration is invalid." : ""), t = b(() => p.value?.driver ?? null), u = b(() => p.value?.account), P = b(() => !u.value || m.value !== u.value.credential_kind), m = v(""), h = v(""), D = v(!1), g = v(""), x = v(""), k = v(""), j = v(""), w = v(""), V = v(!1), f = v("");
    let y = 0;
    cr(() => {
      y++;
    });
    const n = b(() => t.value?.credentials.find((a) => a.id === m.value) ?? null), L = b(() => !!n.value && !n.value.file && !n.value.subscription && (t.value?.endpoints.length ?? 0) > 0), E = (a) => new TextEncoder().encode(a).length, d = b(() => {
      const a = {}, r = p.value?.limits;
      r && E(h.value.trim()) > r.label_bytes && (a.label = `Label exceeds ${r.label_bytes} bytes.`);
      const e = g.value.trim();
      if (r && E(e) > r.secret_bytes) a.secret = `Credential exceeds ${r.secret_bytes} bytes.`;
      else if (e && n.value?.format === "single_line" && /[\r\n]/.test(e)) a.secret = "Credential must be a single line.";
      else if (e && n.value?.format === "json_object")
        try {
          const _ = JSON.parse(e);
          (!_ || typeof _ != "object" || Array.isArray(_)) && (a.secret = "Credential must be a JSON object.");
        } catch {
          a.secret = "Credential must be a JSON object.";
        }
      const A = k.value.trim();
      return L.value && A && (r && E(A) > r.endpoint_url_bytes && (a.endpoint = `Endpoint URL exceeds ${r.endpoint_url_bytes} bytes.`), r && E(j.value.trim()) > r.endpoint_model_bytes && (a.model = `Model exceeds ${r.endpoint_model_bytes} bytes.`)), a;
    });
    z(() => t.value?.id, () => {
      const a = t.value;
      m.value = a?.credentials.find((r) => !r.subscription && !r.file)?.id ?? a?.credentials[0]?.id ?? "", w.value = a?.endpoints[0] ?? "", U(!0);
    }, { immediate: !0 }), z(m, () => {
      w.value = t.value?.endpoints[0] ?? "", U();
    }, { flush: "sync" }), z(() => p.value?.busy, (a) => {
      a && y++;
    }, { flush: "sync" }), z(() => JSON.stringify(p.value?.account), () => {
      m.value = u.value?.credential_kind ?? t.value?.credentials.find((a) => !a.subscription && !a.file)?.id ?? t.value?.credentials[0]?.id ?? "", U();
    }, { immediate: !0 }), z(() => p.value?.saved, (a, r) => {
      a !== r && U();
    });
    function U(a = !1) {
      y++, V.value = !1, (!a || !D.value) && (D.value = !1, h.value = u.value?.label ?? F()), g.value = "", x.value = "";
      const r = m.value === u.value?.credential_kind ? u.value.endpoint : void 0;
      k.value = r?.base_url ?? "", j.value = r?.model ?? "", w.value = r?.protocol ?? t.value?.endpoints[0] ?? "", f.value = "";
    }
    function F() {
      return [t.value?.title, n.value?.label].filter(Boolean).join(" ");
    }
    z(() => [t.value?.title, n.value?.label], () => {
      D.value || (h.value = u.value?.label ?? F());
    });
    function G(a) {
      return a.split("/").pop() ?? a;
    }
    async function Q(a) {
      if (V.value = !1, p.value?.busy) return;
      const r = a.dataTransfer?.files?.[0];
      if (!r) return;
      const e = p.value?.limits?.secret_bytes;
      if (e && r.size > e) {
        f.value = `${r.name} exceeds the ${e}-byte credential limit.`;
        return;
      }
      const A = t.value?.credentials.find((O) => O.file && G(O.file) === r.name);
      A && (m.value = A.id);
      const _ = ++y;
      try {
        const O = await r.text();
        if (_ !== y || p.value?.busy) return;
        g.value = O.trim(), x.value = r.name, f.value = "";
      } catch {
        _ === y && (f.value = "Could not read the credential file. Try dropping it again.");
      }
    }
    function X() {
      y++, x.value = "", f.value = "";
    }
    function Z() {
      y++, g.value = "", x.value = "", f.value = "";
    }
    function rr() {
      f.value = "";
      const a = t.value, r = n.value;
      if (!a || !r || p.value?.busy || Object.keys(d.value).length || !h.value.trim() || P.value && !g.value.trim()) return;
      const e = L.value && k.value.trim() ? { protocol: w.value, base_url: k.value.trim(), model: j.value.trim() || void 0 } : void 0;
      Y("submit", { agent: a.id, credential_kind: r.id, label: h.value.trim(), secret: g.value.trim(), endpoint: e });
    }
    return (a, r) => (c(), i($, null, [
      R.value ? (c(), i("p", lr, l(R.value), 1)) : s("", !0),
      t.value ? (c(), i("section", sr, [
        o("div", dr, [
          o("div", vr, l(u.value ? "Edit" : "Add a") + " " + l(t.value.title) + " account", 1)
        ]),
        o("label", ur, [
          r[9] || (r[9] = o("span", { class: "da-lbl" }, "Credential", -1)),
          C(o("select", {
            disabled: p.value?.busy,
            "onUpdate:modelValue": r[0] || (r[0] = (e) => m.value = e),
            class: "da-input kx-focus-halo"
          }, [
            (c(!0), i($, null, K(t.value.credentials, (e) => (c(), i("option", {
              key: e.id,
              value: e.id
            }, l(e.label), 9, gr))), 128))
          ], 8, mr), [
            [W, m.value]
          ])
        ]),
        n.value?.subscription ? (c(), i("p", xr, [
          I(T(J), { icon: "tabler:alert-triangle" }),
          r[10] || (r[10] = o("span", null, [
            o("strong", null, "Personal use only."),
            S(" A subscription login is for your own personal use; running it through this tool for anyone else is not compliant with the provider's terms, and the provider may restrict or suspend the account. Only you run on it. Use an official API key or your own endpoint for production or multiple users.")
          ], -1))
        ])) : s("", !0),
        o("div", {
          class: ir(["da-drop", { over: V.value, filled: !!x.value }]),
          onDragover: r[1] || (r[1] = q((e) => V.value = !p.value?.busy, ["prevent"])),
          onDragleave: r[2] || (r[2] = (e) => V.value = !1),
          onDrop: q(Q, ["prevent"])
        }, [
          I(T(J), {
            icon: x.value ? "tabler:file-check" : "tabler:file-upload"
          }, null, 8, ["icon"]),
          x.value ? (c(), i("span", fr, [
            S(l(x.value) + " loaded. ", 1),
            o("button", {
              type: "button",
              class: "da-link kx-focus-outline",
              onClick: Z,
              disabled: p.value?.busy
            }, "Clear", 8, br)
          ])) : (c(), i("span", hr, "Drop " + l(n.value?.file ? "~/" + n.value.file : "a file with the value") + " here, or paste below.", 1))
        ], 34),
        x.value ? s("", !0) : (c(), i("label", yr, [
          o("span", kr, [
            S(l(n.value?.file ? "Login file content" : "Value"), 1),
            u.value && !P.value ? (c(), i("span", wr, " · leave empty to keep the credential")) : s("", !0)
          ]),
          C(o("textarea", {
            disabled: p.value?.busy,
            "onUpdate:modelValue": r[3] || (r[3] = (e) => g.value = e),
            onInput: X,
            rows: "4",
            class: "da-input da-mono kx-focus-halo",
            placeholder: n.value?.hint
          }, null, 40, _r), [
            [M, g.value]
          ])
        ])),
        d.value.secret ? (c(), i("small", zr, l(d.value.secret), 1)) : s("", !0),
        L.value ? (c(), i($, { key: 3 }, [
          o("label", Cr, [
            r[11] || (r[11] = o("span", { class: "da-lbl" }, [
              S("Custom endpoint "),
              o("span", { class: "da-opt" }, "optional")
            ], -1)),
            C(o("input", {
              disabled: p.value?.busy,
              "onUpdate:modelValue": r[4] || (r[4] = (e) => k.value = e),
              class: "da-input da-mono kx-focus-halo",
              placeholder: "http://api.example.com:8000/v1 - empty uses the vendor's API"
            }, null, 8, Sr), [
              [M, k.value]
            ]),
            d.value.endpoint ? (c(), i("small", jr, l(d.value.endpoint), 1)) : s("", !0),
            r[12] || (r[12] = o("small", { class: "da-hint" }, "Send this account's tasks to a gateway or a model server you operate; the key authenticates to it.", -1))
          ]),
          k.value.trim() ? (c(), i("div", Vr, [
            t.value.endpoints.length > 1 ? (c(), i("label", Ar, [
              r[13] || (r[13] = o("span", { class: "da-lbl" }, "Protocol", -1)),
              C(o("select", {
                disabled: p.value?.busy,
                "onUpdate:modelValue": r[5] || (r[5] = (e) => w.value = e),
                class: "da-input kx-focus-halo"
              }, [
                (c(!0), i($, null, K(t.value.endpoints, (e) => (c(), i("option", {
                  key: e,
                  value: e
                }, l(e), 9, Er))), 128))
              ], 8, Dr), [
                [W, w.value]
              ])
            ])) : s("", !0),
            o("label", Ur, [
              r[14] || (r[14] = o("span", { class: "da-lbl" }, [
                S("Model "),
                o("span", { class: "da-opt" }, "when the endpoint serves several")
              ], -1)),
              C(o("input", {
                disabled: p.value?.busy,
                "onUpdate:modelValue": r[6] || (r[6] = (e) => j.value = e),
                class: "da-input da-mono kx-focus-halo",
                placeholder: "qwen3-coder"
              }, null, 8, Or), [
                [M, j.value]
              ]),
              d.value.model ? (c(), i("small", $r, l(d.value.model), 1)) : s("", !0)
            ])
          ])) : s("", !0)
        ], 64)) : s("", !0),
        o("label", Mr, [
          r[15] || (r[15] = o("span", { class: "da-lbl" }, "Label", -1)),
          C(o("input", {
            disabled: p.value?.busy,
            "onUpdate:modelValue": r[7] || (r[7] = (e) => h.value = e),
            class: "da-input kx-focus-halo",
            onInput: r[8] || (r[8] = (e) => D.value = !0)
          }, null, 40, Nr), [
            [M, h.value]
          ])
        ]),
        d.value.label ? (c(), i("small", Pr, l(d.value.label), 1)) : s("", !0),
        o("div", Lr, [
          r[16] || (r[16] = o("small", { class: "da-hint" }, "Checked against the credential's format, kept in the account's private context, never shown again.", -1)),
          o("button", {
            type: "button",
            class: "da-btn kx-focus-halo",
            disabled: p.value?.busy || Object.keys(d.value).length > 0 || !n.value || !h.value.trim() || P.value && !g.value.trim(),
            onClick: rr
          }, [
            I(T(J), { icon: "tabler:key" }),
            S(" " + l(p.value?.busy ? "Saving…" : "Save account"), 1)
          ], 8, Ir)
        ]),
        f.value || p.value?.error ? (c(), i("p", Tr, l(f.value || p.value?.error), 1)) : s("", !0)
      ])) : s("", !0)
    ], 64));
  }
}), Br = ':root{--p-form-field-padding-x: .75rem;--p-form-field-padding-y: .5rem;--p-form-field-sm-padding-x: .625rem;--p-form-field-sm-padding-y: .375rem;--p-form-field-lg-padding-x: .875rem;--p-form-field-lg-padding-y: .625rem;--p-form-field-border-radius: .375rem;--p-form-field-transition-duration: .2s;--p-form-field-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), 0 1px 2px 0 rgba(18, 18, 23, .05);--p-focus-ring-width: 1px;--p-focus-ring-style: solid;--p-focus-ring-color: color-mix(in srgb, var(--p-primary-color) 100%, transparent);--p-focus-ring-offset: 2px;--p-toggleswitch-width: 2.5rem;--p-toggleswitch-height: 1.5rem;--p-toggleswitch-border-radius: 30px;--p-toggleswitch-gap: .25rem;--p-toggleswitch-border-width: 1px;--p-toggleswitch-transition-duration: .2s;--p-toggleswitch-slide-duration: .2s;--p-toggleswitch-handle-size: 1rem;--p-toggleswitch-handle-border-radius: 9999px}:root{color-scheme:light dark;--p-primary: rgb(0, 95, 178);--p-primary-50: color-mix(in srgb, var(--p-primary) 5%, white);--p-primary-100: color-mix(in srgb, var(--p-primary) 10%, white);--p-primary-200: color-mix(in srgb, var(--p-primary) 20%, white);--p-primary-300: color-mix(in srgb, var(--p-primary) 30%, white);--p-primary-400: color-mix(in srgb, var(--p-primary) 40%, white);--p-primary-500: var(--p-primary);--p-primary-600: color-mix(in srgb, var(--p-primary) 80%, black);--p-primary-700: color-mix(in srgb, var(--p-primary) 70%, black);--p-primary-800: color-mix(in srgb, var(--p-primary) 60%, black);--p-primary-900: color-mix(in srgb, var(--p-primary) 50%, black);--p-primary-950: color-mix(in srgb, var(--p-primary) 40%, black);--p-secondary: #6f7385;--p-secondary-50: color-mix(in srgb, var(--p-secondary) 5%, white);--p-secondary-100: color-mix(in srgb, var(--p-secondary) 10%, white);--p-secondary-200: color-mix(in srgb, var(--p-secondary) 20%, white);--p-secondary-300: color-mix(in srgb, var(--p-secondary) 35%, white);--p-secondary-400: color-mix(in srgb, var(--p-secondary) 65%, white);--p-secondary-500: var(--p-secondary);--p-secondary-600: color-mix(in srgb, var(--p-secondary) 80%, black);--p-secondary-700: color-mix(in srgb, var(--p-secondary) 65%, black);--p-secondary-800: color-mix(in srgb, var(--p-secondary) 55%, black);--p-secondary-900: color-mix(in srgb, var(--p-secondary) 50%, black);--p-secondary-950: color-mix(in srgb, var(--p-secondary) 30%, black);--p-danger: rgb(239, 68, 68);--p-danger-50: color-mix(in srgb, var(--p-danger) 5%, white);--p-danger-100: color-mix(in srgb, var(--p-danger) 10%, white);--p-danger-200: color-mix(in srgb, var(--p-danger) 20%, white);--p-danger-300: color-mix(in srgb, var(--p-danger) 30%, white);--p-danger-400: color-mix(in srgb, var(--p-danger) 40%, white);--p-danger-500: var(--p-danger);--p-danger-600: color-mix(in srgb, var(--p-danger) 80%, black);--p-danger-700: color-mix(in srgb, var(--p-danger) 70%, black);--p-danger-800: color-mix(in srgb, var(--p-danger) 60%, black);--p-danger-900: color-mix(in srgb, var(--p-danger) 50%, black);--p-danger-950: color-mix(in srgb, var(--p-danger) 40%, black);--p-success: rgb(34, 197, 94);--p-success-50: color-mix(in srgb, var(--p-success) 5%, white);--p-success-100: color-mix(in srgb, var(--p-success) 10%, white);--p-success-200: color-mix(in srgb, var(--p-success) 20%, white);--p-success-300: color-mix(in srgb, var(--p-success) 30%, white);--p-success-400: color-mix(in srgb, var(--p-success) 40%, white);--p-success-500: var(--p-success);--p-success-600: color-mix(in srgb, var(--p-success) 80%, black);--p-success-700: color-mix(in srgb, var(--p-success) 70%, black);--p-success-800: color-mix(in srgb, var(--p-success) 60%, black);--p-success-900: color-mix(in srgb, var(--p-success) 50%, black);--p-success-950: color-mix(in srgb, var(--p-success) 40%, black);--p-warn: rgb(249, 115, 22);--p-warn-50: color-mix(in srgb, var(--p-warn) 5%, white);--p-warn-100: color-mix(in srgb, var(--p-warn) 10%, white);--p-warn-200: color-mix(in srgb, var(--p-warn) 20%, white);--p-warn-300: color-mix(in srgb, var(--p-warn) 30%, white);--p-warn-400: color-mix(in srgb, var(--p-warn) 40%, white);--p-warn-500: var(--p-warn);--p-warn-600: color-mix(in srgb, var(--p-warn) 80%, black);--p-warn-700: color-mix(in srgb, var(--p-warn) 70%, black);--p-warn-800: color-mix(in srgb, var(--p-warn) 60%, black);--p-warn-900: color-mix(in srgb, var(--p-warn) 50%, black);--p-warn-950: color-mix(in srgb, var(--p-warn) 40%, black);--p-info: rgb(14, 165, 233);--p-info-50: color-mix(in srgb, var(--p-info) 5%, white);--p-info-100: color-mix(in srgb, var(--p-info) 10%, white);--p-info-200: color-mix(in srgb, var(--p-info) 20%, white);--p-info-300: color-mix(in srgb, var(--p-info) 30%, white);--p-info-400: color-mix(in srgb, var(--p-info) 40%, white);--p-info-500: var(--p-info);--p-info-600: color-mix(in srgb, var(--p-info) 80%, black);--p-info-700: color-mix(in srgb, var(--p-info) 70%, black);--p-info-800: color-mix(in srgb, var(--p-info) 60%, black);--p-info-900: color-mix(in srgb, var(--p-info) 50%, black);--p-info-950: color-mix(in srgb, var(--p-info) 40%, black);--p-help: rgb(168, 85, 247);--p-help-50: color-mix(in srgb, var(--p-help) 5%, white);--p-help-100: color-mix(in srgb, var(--p-help) 10%, white);--p-help-200: color-mix(in srgb, var(--p-help) 20%, white);--p-help-300: color-mix(in srgb, var(--p-help) 30%, white);--p-help-400: color-mix(in srgb, var(--p-help) 40%, white);--p-help-500: var(--p-help);--p-help-600: color-mix(in srgb, var(--p-help) 80%, black);--p-help-700: color-mix(in srgb, var(--p-help) 70%, black);--p-help-800: color-mix(in srgb, var(--p-help) 60%, black);--p-help-900: color-mix(in srgb, var(--p-help) 50%, black);--p-help-950: color-mix(in srgb, var(--p-help) 40%, black);--p-accent: rgb(20, 184, 166);--p-accent-50: color-mix(in srgb, var(--p-accent) 5%, white);--p-accent-100: color-mix(in srgb, var(--p-accent) 10%, white);--p-accent-200: color-mix(in srgb, var(--p-accent) 20%, white);--p-accent-300: color-mix(in srgb, var(--p-accent) 30%, white);--p-accent-400: color-mix(in srgb, var(--p-accent) 40%, white);--p-accent-500: var(--p-accent);--p-accent-600: color-mix(in srgb, var(--p-accent) 80%, black);--p-accent-700: color-mix(in srgb, var(--p-accent) 70%, black);--p-accent-800: color-mix(in srgb, var(--p-accent) 60%, black);--p-accent-900: color-mix(in srgb, var(--p-accent) 50%, black);--p-accent-950: color-mix(in srgb, var(--p-accent) 40%, black);--p-surface-0: #ffffff;--p-surface-50: #fafafa;--p-surface-100: #f5f5f5;--p-surface-200: #e5e5e5;--p-surface-300: #d4d4d4;--p-surface-400: #a3a3a3;--p-surface-500: #737373;--p-surface-600: #525252;--p-surface-700: #404040;--p-surface-800: #262626;--p-surface-850: color-mix(in srgb, var(--p-surface-800) 50%, var(--p-surface-900));--p-surface-900: #171717;--p-surface-950: #0a0a0a;--p-content-border-radius: 6px;--p-font-heading-family: var(--v-font-family-head, Arial);--p-font-heading-scale: 1;--p-font-heading-line-height: 1.5;--p-font-heading-letter-spacing: normal;--p-font-heading-stretch: normal;--p-font-heading-variation-settings: normal;--p-font-body-scale: 1;--p-font-body-line-height: 1.5;--p-font-body-letter-spacing: normal;--p-font-body-stretch: normal;--p-font-body-variation-settings: normal;--p-font-mono-family: ui-monospace}:root{--p-primary-color: var(--p-primary-500);--p-primary-contrast-color: var(--p-surface-0);--p-primary-hover-color: var(--p-primary-600);--p-primary-active-color: var(--p-primary-700);--p-secondary-color: var(--p-secondary-500);--p-secondary-contrast-color: var(--p-surface-0);--p-secondary-hover-color: var(--p-secondary-600);--p-secondary-active-color: var(--p-secondary-700);--p-danger-color: var(--p-danger-500);--p-danger-contrast-color: var(--p-surface-0);--p-danger-hover-color: var(--p-danger-600);--p-danger-active-color: var(--p-danger-700);--p-success-color: var(--p-success-500);--p-success-contrast-color: var(--p-surface-0);--p-success-hover-color: var(--p-success-600);--p-success-active-color: var(--p-success-700);--p-warn-color: var(--p-warn-500);--p-warn-contrast-color: var(--p-surface-0);--p-warn-hover-color: var(--p-warn-600);--p-warn-active-color: var(--p-warn-700);--p-info-color: var(--p-info-500);--p-info-contrast-color: var(--p-surface-0);--p-info-hover-color: var(--p-info-600);--p-info-active-color: var(--p-info-700);--p-help-color: var(--p-help-500);--p-help-contrast-color: var(--p-surface-0);--p-help-hover-color: var(--p-help-600);--p-help-active-color: var(--p-help-700);--p-accent-color: var(--p-accent-500);--p-accent-contrast-color: var(--p-surface-0);--p-accent-hover-color: var(--p-accent-600);--p-accent-active-color: var(--p-accent-700);--p-content-border-color: var(--p-surface-200);--p-content-hover-background: var(--p-surface-100);--p-content-hover-color: var(--p-surface-800);--p-highlight-background: var(--p-primary-50);--p-highlight-color: var(--p-primary-700);--p-highlight-focus-background: var(--p-primary-100);--p-highlight-focus-color: var(--p-primary-800);--p-content-background: var(--p-surface-0);--p-text-color: var(--p-surface-700);--p-text-hover-color: var(--p-surface-800);--p-text-muted-color: var(--p-surface-500);--p-text-hover-muted-color: var(--p-surface-600)}@media(prefers-color-scheme:dark){:root:not(.w-theme-light){--p-surface-D: #fff;--p-surface-0: #fff;--p-surface-50: #fafafa;--p-surface-100: #f4f4f5;--p-surface-200: #e4e4e7;--p-surface-300: #d4d4d8;--p-surface-400: #a1a1aa;--p-surface-500: #71717a;--p-surface-600: #545250;--p-surface-700: #403e3c;--p-surface-800: #2b2927;--p-surface-850: color-mix(in srgb, var(--p-surface-800) 50%, var(--p-surface-900));--p-surface-900: #1c1a19;--p-surface-950: #0f0e0d;--p-primary: rgb(0, 125, 178);--p-primary-50: color-mix(in srgb, var(--p-primary) 5%, white);--p-primary-100: color-mix(in srgb, var(--p-primary) 10%, white);--p-primary-200: color-mix(in srgb, var(--p-primary) 20%, white);--p-primary-300: color-mix(in srgb, var(--p-primary) 30%, white);--p-primary-400: color-mix(in srgb, var(--p-primary) 40%, white);--p-primary-500: var(--p-primary);--p-primary-600: color-mix(in srgb, var(--p-primary) 80%, black);--p-primary-700: color-mix(in srgb, var(--p-primary) 70%, black);--p-primary-800: color-mix(in srgb, var(--p-primary) 60%, black);--p-primary-900: color-mix(in srgb, var(--p-primary) 50%, black);--p-primary-950: color-mix(in srgb, var(--p-primary) 40%, black);--p-primary-color: var(--p-primary-400);--p-primary-contrast-color: var(--p-surface-900);--p-primary-hover-color: var(--p-primary-300);--p-primary-active-color: var(--p-primary-200);--p-secondary-color: var(--p-secondary-400);--p-secondary-contrast-color: var(--p-surface-900);--p-secondary-hover-color: var(--p-secondary-300);--p-secondary-active-color: var(--p-secondary-200);--p-danger-color: var(--p-danger-400);--p-danger-contrast-color: var(--p-surface-900);--p-danger-hover-color: var(--p-danger-300);--p-danger-active-color: var(--p-danger-200);--p-success-color: var(--p-success-400);--p-success-contrast-color: var(--p-surface-900);--p-success-hover-color: var(--p-success-300);--p-success-active-color: var(--p-success-200);--p-warn-color: var(--p-warn-400);--p-warn-contrast-color: var(--p-surface-900);--p-warn-hover-color: var(--p-warn-300);--p-warn-active-color: var(--p-warn-200);--p-info-color: var(--p-info-400);--p-info-contrast-color: var(--p-surface-900);--p-info-hover-color: var(--p-info-300);--p-info-active-color: var(--p-info-200);--p-help-color: var(--p-help-400);--p-help-contrast-color: var(--p-surface-900);--p-help-hover-color: var(--p-help-300);--p-help-active-color: var(--p-help-200);--p-accent-color: var(--p-accent-400);--p-accent-contrast-color: var(--p-surface-900);--p-accent-hover-color: var(--p-accent-300);--p-accent-active-color: var(--p-accent-200);--p-content-border-color: var(--p-surface-700);--p-content-hover-background: var(--p-surface-800);--p-content-hover-color: var(--p-surface-0);--p-highlight-background: color-mix(in srgb, var(--p-primary-400), transparent 84%);--p-highlight-color: rgba(255, 255, 255, 87%);--p-highlight-focus-background: color-mix(in srgb, var(--p-primary-400), transparent 76%);--p-highlight-focus-color: rgba(255, 255, 255, 87%);--p-content-background: var(--p-surface-900);--p-text-color: var(--p-surface-0);--p-text-hover-color: var(--p-surface-0);--p-text-muted-color: var(--p-surface-400);--p-text-hover-muted-color: var(--p-surface-300)}}:root.w-theme-dark,.w-theme-dark{color-scheme:dark;--p-surface-D: #fff;--p-surface-0: #fff;--p-surface-50: #fafafa;--p-surface-100: #f4f4f5;--p-surface-200: #e4e4e7;--p-surface-300: #d4d4d8;--p-surface-400: #a1a1aa;--p-surface-500: #71717a;--p-surface-600: #545250;--p-surface-700: #403e3c;--p-surface-800: #2b2927;--p-surface-850: color-mix(in srgb, var(--p-surface-800) 50%, var(--p-surface-900));--p-surface-900: #1c1a19;--p-surface-950: #0f0e0d;--p-primary: rgb(0, 125, 178);--p-primary-50: color-mix(in srgb, var(--p-primary) 5%, white);--p-primary-100: color-mix(in srgb, var(--p-primary) 10%, white);--p-primary-200: color-mix(in srgb, var(--p-primary) 20%, white);--p-primary-300: color-mix(in srgb, var(--p-primary) 30%, white);--p-primary-400: color-mix(in srgb, var(--p-primary) 40%, white);--p-primary-500: var(--p-primary);--p-primary-600: color-mix(in srgb, var(--p-primary) 80%, black);--p-primary-700: color-mix(in srgb, var(--p-primary) 70%, black);--p-primary-800: color-mix(in srgb, var(--p-primary) 60%, black);--p-primary-900: color-mix(in srgb, var(--p-primary) 50%, black);--p-primary-950: color-mix(in srgb, var(--p-primary) 40%, black);--p-primary-color: var(--p-primary-400);--p-primary-contrast-color: var(--p-surface-900);--p-primary-hover-color: var(--p-primary-300);--p-primary-active-color: var(--p-primary-200);--p-secondary-color: var(--p-secondary-400);--p-secondary-contrast-color: var(--p-surface-900);--p-secondary-hover-color: var(--p-secondary-300);--p-secondary-active-color: var(--p-secondary-200);--p-danger-color: var(--p-danger-400);--p-danger-contrast-color: var(--p-surface-900);--p-danger-hover-color: var(--p-danger-300);--p-danger-active-color: var(--p-danger-200);--p-success-color: var(--p-success-400);--p-success-contrast-color: var(--p-surface-900);--p-success-hover-color: var(--p-success-300);--p-success-active-color: var(--p-success-200);--p-warn-color: var(--p-warn-400);--p-warn-contrast-color: var(--p-surface-900);--p-warn-hover-color: var(--p-warn-300);--p-warn-active-color: var(--p-warn-200);--p-info-color: var(--p-info-400);--p-info-contrast-color: var(--p-surface-900);--p-info-hover-color: var(--p-info-300);--p-info-active-color: var(--p-info-200);--p-help-color: var(--p-help-400);--p-help-contrast-color: var(--p-surface-900);--p-help-hover-color: var(--p-help-300);--p-help-active-color: var(--p-help-200);--p-accent-color: var(--p-accent-400);--p-accent-contrast-color: var(--p-surface-900);--p-accent-hover-color: var(--p-accent-300);--p-accent-active-color: var(--p-accent-200);--p-content-border-color: var(--p-surface-700);--p-content-hover-background: var(--p-surface-800);--p-content-hover-color: var(--p-surface-0);--p-highlight-background: color-mix(in srgb, var(--p-primary-400), transparent 84%);--p-highlight-color: rgba(255, 255, 255, 87%);--p-highlight-focus-background: color-mix(in srgb, var(--p-primary-400), transparent 76%);--p-highlight-focus-color: rgba(255, 255, 255, 87%);--p-content-background: var(--p-surface-900);--p-text-color: var(--p-surface-0);--p-text-hover-color: var(--p-surface-0);--p-text-muted-color: var(--p-surface-400);--p-text-hover-muted-color: var(--p-surface-300)}:root.w-theme-light,.w-theme-light{color-scheme:light;--p-surface-0: #ffffff;--p-surface-50: #fafafa;--p-surface-100: #f5f5f5;--p-surface-200: #e5e5e5;--p-surface-300: #d4d4d4;--p-surface-400: #a3a3a3;--p-surface-500: #737373;--p-surface-600: #525252;--p-surface-700: #404040;--p-surface-800: #262626;--p-surface-850: color-mix(in srgb, var(--p-surface-800) 50%, var(--p-surface-900));--p-surface-900: #171717;--p-surface-950: #0a0a0a;--p-primary: rgb(0, 95, 178);--p-primary-50: color-mix(in srgb, var(--p-primary) 5%, white);--p-primary-100: color-mix(in srgb, var(--p-primary) 10%, white);--p-primary-200: color-mix(in srgb, var(--p-primary) 20%, white);--p-primary-300: color-mix(in srgb, var(--p-primary) 30%, white);--p-primary-400: color-mix(in srgb, var(--p-primary) 40%, white);--p-primary-500: var(--p-primary);--p-primary-600: color-mix(in srgb, var(--p-primary) 80%, black);--p-primary-700: color-mix(in srgb, var(--p-primary) 70%, black);--p-primary-800: color-mix(in srgb, var(--p-primary) 60%, black);--p-primary-900: color-mix(in srgb, var(--p-primary) 50%, black);--p-primary-950: color-mix(in srgb, var(--p-primary) 40%, black);--p-primary-color: var(--p-primary-500);--p-primary-contrast-color: var(--p-surface-0);--p-primary-hover-color: var(--p-primary-600);--p-primary-active-color: var(--p-primary-700);--p-secondary-color: var(--p-secondary-500);--p-secondary-contrast-color: var(--p-surface-0);--p-secondary-hover-color: var(--p-secondary-600);--p-secondary-active-color: var(--p-secondary-700);--p-danger-color: var(--p-danger-500);--p-danger-contrast-color: var(--p-surface-0);--p-danger-hover-color: var(--p-danger-600);--p-danger-active-color: var(--p-danger-700);--p-success-color: var(--p-success-500);--p-success-contrast-color: var(--p-surface-0);--p-success-hover-color: var(--p-success-600);--p-success-active-color: var(--p-success-700);--p-warn-color: var(--p-warn-500);--p-warn-contrast-color: var(--p-surface-0);--p-warn-hover-color: var(--p-warn-600);--p-warn-active-color: var(--p-warn-700);--p-info-color: var(--p-info-500);--p-info-contrast-color: var(--p-surface-0);--p-info-hover-color: var(--p-info-600);--p-info-active-color: var(--p-info-700);--p-help-color: var(--p-help-500);--p-help-contrast-color: var(--p-surface-0);--p-help-hover-color: var(--p-help-600);--p-help-active-color: var(--p-help-700);--p-accent-color: var(--p-accent-500);--p-accent-contrast-color: var(--p-surface-0);--p-accent-hover-color: var(--p-accent-600);--p-accent-active-color: var(--p-accent-700);--p-content-border-color: var(--p-surface-200);--p-content-hover-background: var(--p-surface-100);--p-content-hover-color: var(--p-surface-800);--p-highlight-background: var(--p-primary-50);--p-highlight-color: var(--p-primary-700);--p-highlight-focus-background: var(--p-primary-100);--p-highlight-focus-color: var(--p-primary-800);--p-content-background: var(--p-surface-0);--p-text-color: var(--p-surface-700);--p-text-hover-color: var(--p-surface-800);--p-text-muted-color: var(--p-surface-500);--p-text-hover-muted-color: var(--p-surface-600)}:host,:root{--kx-surface-1: color-mix(in srgb, var(--p-content-background) 96%, var(--p-text-color) 4%);--kx-surface-2: color-mix(in srgb, var(--p-content-background) 92%, var(--p-text-color) 8%);--kx-surface-3: color-mix(in srgb, var(--p-content-background) 86%, var(--p-text-color) 14%);--kx-surface-4: color-mix(in srgb, var(--p-content-background) 78%, var(--p-text-color) 22%);--kx-border-strong: color-mix(in srgb, var(--p-content-border-color) 60%, var(--p-text-color) 40%);--kx-border-stronger: color-mix(in srgb, var(--p-content-border-color) 30%, var(--p-text-color) 70%);--kx-text-faint: color-mix(in srgb, var(--p-text-muted-color) 70%, var(--p-content-background) 30%);--kx-text-fainter: color-mix(in srgb, var(--p-text-muted-color) 45%, var(--p-content-background) 55%);--kx-wash-primary: color-mix(in srgb, var(--p-primary-color) 12%, var(--p-content-background) 88%);--kx-wash-success: color-mix(in srgb, var(--p-success-500) 12%, var(--p-content-background) 88%);--kx-wash-info: color-mix(in srgb, var(--p-info-500) 12%, var(--p-content-background) 88%);--kx-wash-warn: color-mix(in srgb, var(--p-warn-500) 12%, var(--p-content-background) 88%);--kx-wash-danger: color-mix(in srgb, var(--p-danger-500) 12%, var(--p-content-background) 88%);--kx-wash-help: color-mix(in srgb, var(--p-help-500) 12%, var(--p-content-background) 88%);--kx-font-heading: "Outfit", system-ui, sans-serif;--kx-font-body: "Inter", system-ui, sans-serif;--kx-radius-4: 4px;--kx-radius-6: 6px;--kx-radius-8: 8px;--kx-radius-10: 10px;--kx-radius-14: 14px;--kx-radius-16: 16px;--kx-radius-tag: var(--p-content-border-radius, 6px);--kx-control-height: 34px;--kx-control-height-sm: 30px;--kx-rail-width: 264px;--kx-reading-measure: 880px;--kx-row-height: 32px;--kx-shadow-sm: 0 1px 2px rgba(0, 0, 0, .08);--kx-shadow-md: 0 4px 24px rgba(0, 0, 0, .12);--kx-shadow-lg: 0 16px 60px rgba(0, 0, 0, .18);--kx-overlay-hover: color-mix(in srgb, var(--p-text-color) 7%, transparent);--kx-overlay-subtle: color-mix(in srgb, var(--p-text-color) 4%, transparent)}@media(prefers-color-scheme:dark){:host(:not(.w-theme-light)),:root:not(.w-theme-light){--kx-shadow-sm: 0 1px 2px rgba(0, 0, 0, .35);--kx-shadow-md: 0 4px 24px rgba(0, 0, 0, .45);--kx-shadow-lg: 0 16px 60px rgba(0, 0, 0, .6)}}:host(.w-theme-dark),:root.w-theme-dark{--kx-shadow-sm: 0 1px 2px rgba(0, 0, 0, .35);--kx-shadow-md: 0 4px 24px rgba(0, 0, 0, .45);--kx-shadow-lg: 0 16px 60px rgba(0, 0, 0, .6)}.kx-focus-halo:focus-visible{border-color:var(--p-focus-ring-color);outline:none;box-shadow:var(--p-focus-ring-shadow)}.kx-focus-outline:focus-visible{outline:var(--p-focus-ring-width) var(--p-focus-ring-style) var(--p-focus-ring-color);outline-offset:var(--p-focus-ring-offset);box-shadow:none}.kx-card{position:relative;display:flex;flex-direction:column;gap:9px;padding:13px;cursor:pointer;border:1px solid var(--p-content-border-color);border-radius:14px;background:var(--p-content-background);transition:border-color .15s,box-shadow .15s,transform .15s}.kx-card:hover{border-color:color-mix(in srgb,var(--p-primary-color) 40%,var(--p-content-border-color));box-shadow:0 6px 20px color-mix(in srgb,var(--p-text-color) 8%,transparent);transform:translateY(-1px)}.kx-card-head{display:flex;align-items:center;gap:10px;min-width:0}.kx-card-id{display:flex;flex-direction:column;gap:3px;min-width:0;flex:1}.kx-card-name{font-size:14px;font-weight:700;letter-spacing:-.01em;color:var(--p-text-color);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.kx-card-meta{display:flex;gap:6px}.kx-card-desc{font-size:12px;color:var(--p-text-muted-color);line-height:1.4;display:-webkit-box;-webkit-line-clamp:2;line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;min-height:17px}.kx-card-actions{position:absolute;top:9px;right:9px;display:flex;gap:3px;opacity:0;transition:opacity .12s;background:var(--p-content-background);border-radius:8px}.kx-card:hover .kx-card-actions,.kx-card:focus-within .kx-card-actions{opacity:1}.kx-card .p-button:not(:disabled):hover{transform:none}.kx-card:focus-visible{border-color:var(--p-focus-ring-color);outline:none;box-shadow:var(--p-focus-ring-shadow)}.kx-empty{text-align:center;padding:44px 24px;display:flex;flex-direction:column;align-items:center;gap:8px}.kx-empty-ico{width:56px;height:56px;border-radius:14px;display:flex;align-items:center;justify-content:center;background:color-mix(in srgb,var(--p-primary-color) 12%,transparent);color:var(--p-primary-color);margin-bottom:4px}.kx-empty-ico svg{width:28px;height:28px}.kx-empty-title{font-size:15px;font-weight:700;color:var(--p-text-color);margin:0}.kx-empty-sub{font-size:13px;color:var(--p-text-muted-color);max-width:380px;margin:0}.kx-empty>.p-button{margin-top:6px}.kx-empty-actions{display:flex;gap:8px;margin-top:6px}.kx-loading{display:flex;align-items:center;gap:8px;color:var(--p-text-muted-color);font-size:13px;padding:24px}.kx-err{margin:0 20px 8px;padding:9px 12px;border-radius:10px;font-size:13px;background:color-mix(in srgb,var(--p-danger-500) 12%,transparent);color:var(--p-danger-600, var(--p-danger-500))}.kx-err.inline{margin:12px 0 0}.kx-empty.kx-empty-spacious{padding:60px 24px;gap:9px}.kx-empty-spacious .kx-empty-ico{width:58px;height:58px;margin-bottom:5px}.kx-empty-spacious .kx-empty-ico svg{width:27px;height:27px}.kx-empty-spacious .kx-empty-title{font-size:14.5px}.kx-empty-spacious .kx-empty-sub{font-size:12.5px;max-width:360px;line-height:1.55}.kx-empty-ico.primary{background:color-mix(in srgb,var(--p-primary-color) 14%,transparent);border:1px solid color-mix(in srgb,var(--p-primary-color) 28%,transparent)}.kx-empty-ico.muted{background:var(--kx-surface-2);color:color-mix(in srgb,var(--p-text-color) 45%,transparent);border:1px solid var(--p-content-border-color)}.kx-empty>.kx-empty-cta{margin-top:8px;padding-inline:16px}.kx-loading.kx-loading-centered{flex:1;display:grid;place-items:center;padding:64px 20px}.kx-loading-inner{display:flex;flex-direction:column;align-items:center;gap:12px;font-size:13px}.kx-loading-inner svg{width:24px;height:24px}input:not([type=checkbox]),select,textarea{font:inherit;color:var(--p-text-color);background-color:var(--p-content-background);border:1px solid var(--p-content-border-color);border-radius:var(--kx-radius-6);padding:8px 10px;width:100%;min-width:0}select{appearance:none;padding-right:32px;cursor:pointer;background-image:linear-gradient(45deg,transparent 50%,var(--p-text-muted-color) 50%),linear-gradient(135deg,var(--p-text-muted-color) 50%,transparent 50%);background-repeat:no-repeat;background-size:5px 5px,5px 5px;background-position:calc(100% - 15px) center,calc(100% - 10px) center}textarea{resize:vertical;line-height:1.6}input[type=checkbox]:not([role=switch]){accent-color:var(--p-primary-color);width:auto}.ac-tabs,.ac-seg{display:inline-flex;gap:4px;padding:3px;border-radius:var(--kx-radius-8);background:var(--kx-overlay-subtle)}.ac-tab,.ac-seg button{display:inline-flex;align-items:center;justify-content:center;gap:6px;font:inherit;cursor:pointer;padding:6px 12px;border-radius:var(--kx-radius-6);border:none;background:transparent;color:var(--p-text-muted-color)}.ac-seg button{flex:1}.ac-tab:hover,.ac-seg button:hover{color:var(--p-text-color)}.ac-tab.active,.ac-seg button.active{background:var(--p-content-background);color:var(--p-primary-color);font-weight:600;box-shadow:var(--kx-shadow-sm)}.ac-chips{display:flex;gap:6px;flex-wrap:wrap;align-items:center}.ac-chip,.ac-hint-chip{display:inline-flex;align-items:center;gap:6px;border:1px solid var(--p-content-border-color);border-radius:var(--kx-radius-6);padding:6px 9px;font:inherit;color:var(--p-text-muted-color);background:var(--p-content-background)}.ac-chip{cursor:pointer}.ac-chip.active{color:var(--p-primary-color);border-color:var(--p-primary-color);background:var(--kx-wash-primary)}.ac-chip:hover{border-color:var(--p-primary-color)}.ac-hint-chip{font-size:11px;background:var(--kx-overlay-subtle);overflow-wrap:anywhere}.ac-icon-btn{display:inline-flex;align-items:center;justify-content:center;width:30px;height:30px;cursor:pointer;border-radius:var(--kx-radius-6);border:none;background:transparent;color:var(--p-text-muted-color)}.ac-icon-btn:hover{color:var(--p-text-color);background:var(--kx-overlay-hover)}.ac-icon-btn:disabled{opacity:.5;cursor:default}.ac-advanced{border-top:1px solid var(--p-content-border-color);padding-top:12px}.ac-advanced>summary{color:var(--p-text-muted-color);cursor:pointer;font-size:12px;padding:4px 0}.ac-advanced[open]>summary{margin-bottom:12px}:host{display:block;font-family:var(--kx-font-body);color:var(--p-text-color)}*{box-sizing:border-box}.da{display:flex;flex-direction:column;gap:12px;padding:0;min-width:0;background:var(--p-content-background)}.da-field{display:flex;flex-direction:column;gap:4px;min-width:0}.da-lbl{font-size:12px;font-weight:600;color:var(--p-text-muted-color)}.da-opt{font-weight:400;color:var(--kx-text-faint)}.da-hint{font-size:12px;color:var(--p-text-muted-color);line-height:1.4}.da-mono{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:12px}.da-input::placeholder{font-family:var(--kx-font-body);color:var(--kx-text-faint)}.da-pair{display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:8px}.da-notice{margin:0;padding:10px 12px;border-radius:var(--kx-radius-10);display:flex;gap:8px;align-items:flex-start;font-size:12px;line-height:1.45;background:var(--kx-wash-warn);color:var(--p-text-color)}.da-notice svg{flex:none;margin-top:2px;color:var(--p-warn-color)}.da-drop{display:flex;align-items:center;gap:8px;padding:14px 12px;border-radius:var(--kx-radius-10);border:1px dashed var(--kx-border-strong);color:var(--p-text-muted-color);font-size:13px}.da-drop svg{width:18px;height:18px;flex:none}.da-drop.over{border-color:var(--p-primary-color);background:var(--kx-wash-primary);color:var(--p-text-color)}.da-drop.filled{border-style:solid;background:var(--kx-wash-success);color:var(--p-text-color)}.da-link{font:inherit;color:var(--p-primary-color);background:transparent;border:none;padding:0;cursor:pointer}.da-foot{display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap}.da-btn{font:inherit;display:inline-flex;align-items:center;gap:6px;cursor:pointer;height:var(--kx-control-height);padding:0 14px;border-radius:var(--kx-radius-8);border:1px solid var(--p-primary-color);background:var(--p-primary-color);color:var(--p-primary-contrast-color);font-weight:600}.da-btn:disabled{opacity:.5;cursor:default}', Rr = {
  type: "object",
  properties: {
    config: { type: "object", default: {}, description: "Driver credential card: { driver, busy, error, saved }" }
  }
};
class Fr extends or {
  static get wippyConfig() {
    return { propsSchema: Rr, hostCssKeys: ["themeConfigUrl"], inlineCss: Br };
  }
  static get vueConfig() {
    return { rootComponent: Jr };
  }
}
nr(import.meta.url, Fr);
