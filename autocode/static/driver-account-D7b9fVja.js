import { defineComponent as ae, computed as m, ref as y, onUnmounted as se, watch as A, openBlock as s, createElementBlock as n, Fragment as $, toDisplayString as v, createCommentVNode as d, createElementVNode as o, withDirectives as w, renderList as G, vModelSelect as H, createVNode as J, unref as K, createTextVNode as C, withModifiers as Q, normalizeClass as ne, vModelText as j } from "vue";
import { Icon as q } from "@iconify/vue";
import { u as oe, a as ue } from "./wc-runtime-CvWl7e3g.js";
import { d as ie } from "./driver-account-types-CH0REEbr.js";
const de = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, re = {
  key: 1,
  class: "da"
}, ve = {
  key: 0,
  class: "kx-card-head"
}, ce = { class: "kx-card-name" }, pe = { class: "da-field" }, fe = ["disabled"], be = ["value"], me = {
  key: 1,
  class: "da-notice",
  role: "note"
}, ye = { key: 0 }, ke = ["disabled"], _e = { key: 1 }, he = {
  key: 3,
  class: "da-field"
}, ge = { class: "da-lbl" }, xe = {
  key: 0,
  class: "da-opt"
}, we = ["disabled", "placeholder"], Ce = ["disabled", "placeholder"], Se = {
  key: 4,
  class: "kx-err",
  role: "alert"
}, Ve = { class: "da-field" }, Ae = ["disabled"], De = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, Ue = {
  key: 0,
  class: "da-pair"
}, $e = {
  key: 0,
  class: "da-field"
}, je = ["disabled"], Ee = ["value"], Ne = { class: "da-field" }, Le = ["disabled"], Oe = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, Pe = { class: "da-field" }, Te = ["disabled"], Ie = {
  key: 6,
  class: "kx-err",
  role: "alert"
}, Me = { class: "da-foot" }, Je = ["disabled"], Ke = {
  key: 7,
  class: "kx-err inline",
  role: "alert"
}, Ge = /* @__PURE__ */ ae({
  __name: "driver-account",
  setup(qe) {
    const B = oe(), W = ue(), P = m(() => ie.safeParse(B.value.config)), a = m(() => P.value.success ? P.value.data : null), z = m(() => B.value.config && !P.value.success ? "Account form configuration is invalid." : ""), u = m(() => a.value?.driver ?? null), r = m(() => a.value?.account), T = m(() => !r.value || f.value !== r.value.credential_kind), f = y(""), _ = y(""), E = y(!1), c = y(""), k = y(""), g = y(""), D = y(""), S = y(""), U = y(!1), p = y("");
    let h = 0;
    se(() => {
      h++;
    });
    const i = m(() => u.value?.credentials.find((t) => t.id === f.value) ?? null);
    function R() {
      const t = u.value?.credentials, e = a.value?.initialKind;
      return t?.find((l) => l.id === e)?.id ?? t?.find((l) => !l.subscription && !l.file)?.id ?? t?.[0]?.id ?? "";
    }
    const X = m(() => u.value?.credentials.some((t) => !t.file && !t.subscription) === !0), I = m(() => !!i.value && !i.value.file && !i.value.subscription && (u.value?.endpoints.length ?? 0) > 0), N = (t) => new TextEncoder().encode(t).length, b = m(() => {
      const t = {}, e = a.value?.limits;
      e && N(_.value.trim()) > e.label_bytes && (t.label = `Label exceeds ${e.label_bytes} bytes.`);
      const l = c.value.trim();
      if (e && N(l) > e.secret_bytes) t.secret = `Credential exceeds ${e.secret_bytes} bytes.`;
      else if (l && i.value?.format === "single_line" && /[\r\n]/.test(l)) t.secret = "Credential must be a single line.";
      else if (l && i.value?.format === "json_object")
        try {
          const V = JSON.parse(l);
          (!V || typeof V != "object" || Array.isArray(V)) && (t.secret = "Credential must be a JSON object.");
        } catch {
          t.secret = "Credential must be a JSON object.";
        }
      const x = g.value.trim();
      return I.value && x && (e && N(x) > e.endpoint_url_bytes && (t.endpoint = `Endpoint URL exceeds ${e.endpoint_url_bytes} bytes.`), e && N(D.value.trim()) > e.endpoint_model_bytes && (t.model = `Model exceeds ${e.endpoint_model_bytes} bytes.`)), t;
    });
    A(() => u.value?.id, () => {
      const t = u.value;
      f.value = R(), S.value = t?.endpoints[0] ?? "", L(!0);
    }, { immediate: !0 }), A(f, () => {
      S.value = u.value?.endpoints[0] ?? "", L();
    }, { flush: "sync" }), A(() => a.value?.busy, (t) => {
      t && h++;
    }, { flush: "sync" }), A(() => JSON.stringify(a.value?.account), () => {
      f.value = r.value?.credential_kind ?? R(), L();
    }, { immediate: !0 }), A(() => a.value?.saved, (t, e) => {
      t !== e && L();
    });
    function L(t = !1) {
      h++, U.value = !1, (!t || !E.value) && (E.value = !1, _.value = r.value?.label ?? F()), c.value = "", k.value = "";
      const e = f.value === r.value?.credential_kind ? r.value.endpoint : void 0;
      g.value = e?.base_url ?? "", D.value = e?.model ?? "", S.value = e?.protocol ?? u.value?.endpoints[0] ?? "", p.value = "";
    }
    function F() {
      return [u.value?.title, i.value?.label].filter(Boolean).join(" ");
    }
    A(() => [u.value?.title, i.value?.label], () => {
      E.value || (_.value = r.value?.label ?? F());
    });
    function Y(t) {
      return t.split("/").pop() ?? t;
    }
    async function Z(t) {
      if (U.value = !1, a.value?.busy) return;
      const e = t.dataTransfer?.files?.[0];
      if (!e) return;
      const l = a.value?.limits?.secret_bytes;
      if (l && e.size > l) {
        p.value = `${e.name} exceeds the ${l}-byte credential limit.`;
        return;
      }
      const x = u.value?.credentials.find((O) => O.file && Y(O.file) === e.name);
      if (r.value && x && x.id !== r.value.credential_kind) {
        p.value = "A different credential kind requires a new account.";
        return;
      }
      x && (f.value = x.id);
      const V = ++h;
      try {
        const O = await e.text();
        if (V !== h || a.value?.busy) return;
        c.value = O.trim(), k.value = e.name, p.value = "";
      } catch {
        V === h && (p.value = "Could not read the credential file. Try dropping it again.");
      }
    }
    function ee(t) {
      !a.value?.guided || !t.clipboardData || (t.preventDefault(), c.value = t.clipboardData.getData("text"), M());
    }
    function M() {
      h++, k.value = "", p.value = "";
    }
    function le() {
      h++, c.value = "", k.value = "", p.value = "";
    }
    function te() {
      p.value = "";
      const t = u.value, e = i.value;
      if (r.value && f.value !== r.value.credential_kind) {
        p.value = "A different credential kind requires a new account.";
        return;
      }
      if (!t || !e || a.value?.busy || Object.keys(b.value).length || !_.value.trim() || T.value && !c.value.trim()) return;
      const l = I.value && g.value.trim() ? { protocol: S.value, base_url: g.value.trim(), model: D.value.trim() || void 0 } : void 0;
      W("submit", { agent: t.id, credential_kind: e.id, label: _.value.trim(), secret: c.value.trim(), endpoint: l });
    }
    return (t, e) => (s(), n($, null, [
      z.value ? (s(), n("p", de, v(z.value), 1)) : d("", !0),
      u.value ? (s(), n("section", re, [
        a.value?.guided ? d("", !0) : (s(), n("div", ve, [
          o("div", ce, v(r.value ? "Edit" : "Add a") + " " + v(u.value.title) + " account", 1)
        ])),
        o("label", pe, [
          e[10] || (e[10] = o("span", { class: "da-lbl" }, "Credential", -1)),
          w(o("select", {
            disabled: a.value?.busy || !!r.value,
            "onUpdate:modelValue": e[0] || (e[0] = (l) => f.value = l),
            class: "da-input kx-focus-halo"
          }, [
            (s(!0), n($, null, G(u.value.credentials, (l) => (s(), n("option", {
              key: l.id,
              value: l.id
            }, v(l.label), 9, be))), 128))
          ], 8, fe), [
            [H, f.value]
          ])
        ]),
        i.value?.subscription && !a.value?.guided ? (s(), n("p", me, [
          J(K(q), { icon: "tabler:alert-triangle" }),
          o("span", null, [
            e[11] || (e[11] = o("strong", null, "Personal use only.", -1)),
            e[12] || (e[12] = C(" A subscription login is for your own personal use. Running it through this tool for anyone else is not compliant with the provider's terms, and the provider may restrict or suspend the account. Only you run on it. ", -1)),
            X.value ? (s(), n($, { key: 0 }, [
              C("Use an official API key or your own endpoint for production or multiple users.")
            ], 64)) : d("", !0)
          ])
        ])) : d("", !0),
        !a.value?.guided || i.value?.file ? (s(), n("div", {
          key: 2,
          class: ne(["da-drop", { over: U.value, filled: !!k.value }]),
          onDragover: e[1] || (e[1] = Q((l) => U.value = !a.value?.busy, ["prevent"])),
          onDragleave: e[2] || (e[2] = (l) => U.value = !1),
          onDrop: Q(Z, ["prevent"])
        }, [
          J(K(q), {
            icon: k.value ? "tabler:file-check" : "tabler:file-upload"
          }, null, 8, ["icon"]),
          k.value ? (s(), n("span", ye, [
            C(v(k.value) + " loaded. ", 1),
            o("button", {
              type: "button",
              class: "da-link kx-focus-outline",
              onClick: le,
              disabled: a.value?.busy
            }, "Clear", 8, ke)
          ])) : (s(), n("span", _e, "Drop " + v(i.value?.file ? "~/" + i.value.file : "a file with the value") + " here, or paste below.", 1))
        ], 34)) : d("", !0),
        k.value ? d("", !0) : (s(), n("label", he, [
          o("span", ge, [
            C(v(i.value?.file ? "Login file content" : a.value?.guided ? i.value?.label : "Value"), 1),
            r.value && !T.value ? (s(), n("span", xe, " · leave empty to keep the credential")) : d("", !0)
          ]),
          a.value?.guided ? w((s(), n("input", {
            key: 0,
            disabled: a.value.busy,
            "onUpdate:modelValue": e[3] || (e[3] = (l) => c.value = l),
            onPaste: ee,
            onInput: M,
            type: "password",
            autocomplete: "new-password",
            spellcheck: "false",
            class: "da-input kx-focus-halo",
            placeholder: i.value?.hint
          }, null, 40, we)), [
            [j, c.value]
          ]) : w((s(), n("textarea", {
            key: 1,
            disabled: a.value?.busy,
            "onUpdate:modelValue": e[4] || (e[4] = (l) => c.value = l),
            onInput: M,
            rows: "4",
            class: "da-input da-mono kx-focus-halo",
            placeholder: i.value?.hint
          }, null, 40, Ce)), [
            [j, c.value]
          ])
        ])),
        b.value.secret ? (s(), n("small", Se, v(b.value.secret), 1)) : d("", !0),
        I.value ? (s(), n($, { key: 5 }, [
          o("label", Ve, [
            e[13] || (e[13] = o("span", { class: "da-lbl" }, [
              C("Custom endpoint "),
              o("span", { class: "da-opt" }, "optional")
            ], -1)),
            w(o("input", {
              disabled: a.value?.busy,
              "onUpdate:modelValue": e[5] || (e[5] = (l) => g.value = l),
              class: "da-input da-mono kx-focus-halo",
              placeholder: "http://api.example.com:8000/v1 - empty uses the vendor's API"
            }, null, 8, Ae), [
              [j, g.value]
            ]),
            b.value.endpoint ? (s(), n("small", De, v(b.value.endpoint), 1)) : d("", !0),
            e[14] || (e[14] = o("small", { class: "da-hint" }, "Send this account's tasks to a gateway or a model server you operate; the key authenticates to it.", -1))
          ]),
          g.value.trim() ? (s(), n("div", Ue, [
            u.value.endpoints.length > 1 ? (s(), n("label", $e, [
              e[15] || (e[15] = o("span", { class: "da-lbl" }, "Protocol", -1)),
              w(o("select", {
                disabled: a.value?.busy,
                "onUpdate:modelValue": e[6] || (e[6] = (l) => S.value = l),
                class: "da-input kx-focus-halo"
              }, [
                (s(!0), n($, null, G(u.value.endpoints, (l) => (s(), n("option", {
                  key: l,
                  value: l
                }, v(l), 9, Ee))), 128))
              ], 8, je), [
                [H, S.value]
              ])
            ])) : d("", !0),
            o("label", Ne, [
              e[16] || (e[16] = o("span", { class: "da-lbl" }, [
                C("Model "),
                o("span", { class: "da-opt" }, "when the endpoint serves several")
              ], -1)),
              w(o("input", {
                disabled: a.value?.busy,
                "onUpdate:modelValue": e[7] || (e[7] = (l) => D.value = l),
                class: "da-input da-mono kx-focus-halo",
                placeholder: "qwen3-coder"
              }, null, 8, Le), [
                [j, D.value]
              ]),
              b.value.model ? (s(), n("small", Oe, v(b.value.model), 1)) : d("", !0)
            ])
          ])) : d("", !0)
        ], 64)) : d("", !0),
        o("label", Pe, [
          e[17] || (e[17] = o("span", { class: "da-lbl" }, "Label", -1)),
          w(o("input", {
            disabled: a.value?.busy,
            "onUpdate:modelValue": e[8] || (e[8] = (l) => _.value = l),
            class: "da-input kx-focus-halo",
            onInput: e[9] || (e[9] = (l) => E.value = !0)
          }, null, 40, Te), [
            [j, _.value]
          ])
        ]),
        b.value.label ? (s(), n("small", Ie, v(b.value.label), 1)) : d("", !0),
        o("div", Me, [
          e[18] || (e[18] = o("small", { class: "da-hint" }, "Checked against the credential's format, kept in the account's private context, never shown again.", -1)),
          o("button", {
            type: "button",
            class: "da-btn kx-focus-halo",
            disabled: a.value?.busy || Object.keys(b.value).length > 0 || !i.value || !_.value.trim() || T.value && !c.value.trim(),
            onClick: te
          }, [
            J(K(q), { icon: "tabler:key" }),
            C(" " + v(a.value?.guided && !r.value ? a.value.busy ? "Testing credential…" : "Test and save" : a.value?.busy ? "Saving…" : "Save account"), 1)
          ], 8, Je)
        ]),
        p.value || a.value?.error ? (s(), n("p", Ke, v(p.value || a.value?.error), 1)) : d("", !0)
      ])) : d("", !0)
    ], 64));
  }
});
export {
  Ge as default
};
