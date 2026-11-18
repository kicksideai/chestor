import { defineComponent as le, computed as b, ref as m, onUnmounted as te, watch as A, openBlock as n, createElementBlock as o, Fragment as j, toDisplayString as d, createCommentVNode as v, createElementVNode as a, withDirectives as V, renderList as R, vModelSelect as F, createVNode as T, unref as J, createTextVNode as w, withModifiers as G, normalizeClass as ae, vModelText as O } from "vue";
import { Icon as q } from "@iconify/vue";
import { a as se, b as ne } from "./wc-runtime-CEQ5gZTA.js";
import { d as oe } from "./driver-account-types-Ci_eiejv.js";
const ie = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, ue = {
  key: 1,
  class: "da"
}, re = { class: "kx-card-head" }, de = { class: "kx-card-name" }, ve = { class: "da-field" }, ce = ["disabled"], pe = ["value"], fe = {
  key: 0,
  class: "da-notice",
  role: "note"
}, be = { key: 0 }, me = ["disabled"], ye = { key: 1 }, _e = {
  key: 1,
  class: "da-field"
}, ke = { class: "da-lbl" }, he = {
  key: 0,
  class: "da-opt"
}, ge = ["disabled", "placeholder"], xe = {
  key: 2,
  class: "kx-err",
  role: "alert"
}, we = { class: "da-field" }, Ce = ["disabled"], Se = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, Ae = {
  key: 0,
  class: "da-pair"
}, Ve = {
  key: 0,
  class: "da-field"
}, Ue = ["disabled"], $e = ["value"], je = { class: "da-field" }, Ee = ["disabled"], Ne = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, De = { class: "da-field" }, Le = ["disabled"], Oe = {
  key: 4,
  class: "kx-err",
  role: "alert"
}, Pe = { class: "da-foot" }, Ie = ["disabled"], Me = {
  key: 5,
  class: "kx-err inline"
}, Ke = /* @__PURE__ */ le({
  __name: "driver-account",
  setup(Te) {
    const B = se(), H = ne(), P = b(() => oe.safeParse(B.value.config)), s = b(() => P.value.success ? P.value.data : null), z = b(() => B.value.config && !P.value.success ? "Account form configuration is invalid." : ""), i = b(() => s.value?.driver ?? null), u = b(() => s.value?.account), I = b(() => !u.value || p.value !== u.value.credential_kind), p = m(""), k = m(""), E = m(!1), y = m(""), _ = m(""), g = m(""), U = m(""), C = m(""), $ = m(!1), c = m("");
    let h = 0;
    te(() => {
      h++;
    });
    const r = b(() => i.value?.credentials.find((l) => l.id === p.value) ?? null), Q = b(() => i.value?.credentials.some((l) => !l.file && !l.subscription) === !0), M = b(() => !!r.value && !r.value.file && !r.value.subscription && (i.value?.endpoints.length ?? 0) > 0), N = (l) => new TextEncoder().encode(l).length, f = b(() => {
      const l = {}, e = s.value?.limits;
      e && N(k.value.trim()) > e.label_bytes && (l.label = `Label exceeds ${e.label_bytes} bytes.`);
      const t = y.value.trim();
      if (e && N(t) > e.secret_bytes) l.secret = `Credential exceeds ${e.secret_bytes} bytes.`;
      else if (t && r.value?.format === "single_line" && /[\r\n]/.test(t)) l.secret = "Credential must be a single line.";
      else if (t && r.value?.format === "json_object")
        try {
          const S = JSON.parse(t);
          (!S || typeof S != "object" || Array.isArray(S)) && (l.secret = "Credential must be a JSON object.");
        } catch {
          l.secret = "Credential must be a JSON object.";
        }
      const x = g.value.trim();
      return M.value && x && (e && N(x) > e.endpoint_url_bytes && (l.endpoint = `Endpoint URL exceeds ${e.endpoint_url_bytes} bytes.`), e && N(U.value.trim()) > e.endpoint_model_bytes && (l.model = `Model exceeds ${e.endpoint_model_bytes} bytes.`)), l;
    });
    A(() => i.value?.id, () => {
      const l = i.value;
      p.value = l?.credentials.find((e) => !e.subscription && !e.file)?.id ?? l?.credentials[0]?.id ?? "", C.value = l?.endpoints[0] ?? "", D(!0);
    }, { immediate: !0 }), A(p, () => {
      C.value = i.value?.endpoints[0] ?? "", D();
    }, { flush: "sync" }), A(() => s.value?.busy, (l) => {
      l && h++;
    }, { flush: "sync" }), A(() => JSON.stringify(s.value?.account), () => {
      p.value = u.value?.credential_kind ?? i.value?.credentials.find((l) => !l.subscription && !l.file)?.id ?? i.value?.credentials[0]?.id ?? "", D();
    }, { immediate: !0 }), A(() => s.value?.saved, (l, e) => {
      l !== e && D();
    });
    function D(l = !1) {
      h++, $.value = !1, (!l || !E.value) && (E.value = !1, k.value = u.value?.label ?? K()), y.value = "", _.value = "";
      const e = p.value === u.value?.credential_kind ? u.value.endpoint : void 0;
      g.value = e?.base_url ?? "", U.value = e?.model ?? "", C.value = e?.protocol ?? i.value?.endpoints[0] ?? "", c.value = "";
    }
    function K() {
      return [i.value?.title, r.value?.label].filter(Boolean).join(" ");
    }
    A(() => [i.value?.title, r.value?.label], () => {
      E.value || (k.value = u.value?.label ?? K());
    });
    function W(l) {
      return l.split("/").pop() ?? l;
    }
    async function X(l) {
      if ($.value = !1, s.value?.busy) return;
      const e = l.dataTransfer?.files?.[0];
      if (!e) return;
      const t = s.value?.limits?.secret_bytes;
      if (t && e.size > t) {
        c.value = `${e.name} exceeds the ${t}-byte credential limit.`;
        return;
      }
      const x = i.value?.credentials.find((L) => L.file && W(L.file) === e.name);
      if (u.value && x && x.id !== u.value.credential_kind) {
        c.value = "A different credential kind requires a new account.";
        return;
      }
      x && (p.value = x.id);
      const S = ++h;
      try {
        const L = await e.text();
        if (S !== h || s.value?.busy) return;
        y.value = L.trim(), _.value = e.name, c.value = "";
      } catch {
        S === h && (c.value = "Could not read the credential file. Try dropping it again.");
      }
    }
    function Y() {
      h++, _.value = "", c.value = "";
    }
    function Z() {
      h++, y.value = "", _.value = "", c.value = "";
    }
    function ee() {
      c.value = "";
      const l = i.value, e = r.value;
      if (u.value && p.value !== u.value.credential_kind) {
        c.value = "A different credential kind requires a new account.";
        return;
      }
      if (!l || !e || s.value?.busy || Object.keys(f.value).length || !k.value.trim() || I.value && !y.value.trim()) return;
      const t = M.value && g.value.trim() ? { protocol: C.value, base_url: g.value.trim(), model: U.value.trim() || void 0 } : void 0;
      H("submit", { agent: l.id, credential_kind: e.id, label: k.value.trim(), secret: y.value.trim(), endpoint: t });
    }
    return (l, e) => (n(), o(j, null, [
      z.value ? (n(), o("p", ie, d(z.value), 1)) : v("", !0),
      i.value ? (n(), o("section", ue, [
        a("div", re, [
          a("div", de, d(u.value ? "Edit" : "Add a") + " " + d(i.value.title) + " account", 1)
        ]),
        a("label", ve, [
          e[9] || (e[9] = a("span", { class: "da-lbl" }, "Credential", -1)),
          V(a("select", {
            disabled: s.value?.busy || !!u.value,
            "onUpdate:modelValue": e[0] || (e[0] = (t) => p.value = t),
            class: "da-input kx-focus-halo"
          }, [
            (n(!0), o(j, null, R(i.value.credentials, (t) => (n(), o("option", {
              key: t.id,
              value: t.id
            }, d(t.label), 9, pe))), 128))
          ], 8, ce), [
            [F, p.value]
          ])
        ]),
        r.value?.subscription ? (n(), o("p", fe, [
          T(J(q), { icon: "tabler:alert-triangle" }),
          a("span", null, [
            e[10] || (e[10] = a("strong", null, "Personal use only.", -1)),
            e[11] || (e[11] = w(" A subscription login is for your own personal use. Running it through this tool for anyone else is not compliant with the provider's terms, and the provider may restrict or suspend the account. Only you run on it. ", -1)),
            Q.value ? (n(), o(j, { key: 0 }, [
              w("Use an official API key or your own endpoint for production or multiple users.")
            ], 64)) : v("", !0)
          ])
        ])) : v("", !0),
        a("div", {
          class: ae(["da-drop", { over: $.value, filled: !!_.value }]),
          onDragover: e[1] || (e[1] = G((t) => $.value = !s.value?.busy, ["prevent"])),
          onDragleave: e[2] || (e[2] = (t) => $.value = !1),
          onDrop: G(X, ["prevent"])
        }, [
          T(J(q), {
            icon: _.value ? "tabler:file-check" : "tabler:file-upload"
          }, null, 8, ["icon"]),
          _.value ? (n(), o("span", be, [
            w(d(_.value) + " loaded. ", 1),
            a("button", {
              type: "button",
              class: "da-link kx-focus-outline",
              onClick: Z,
              disabled: s.value?.busy
            }, "Clear", 8, me)
          ])) : (n(), o("span", ye, "Drop " + d(r.value?.file ? "~/" + r.value.file : "a file with the value") + " here, or paste below.", 1))
        ], 34),
        _.value ? v("", !0) : (n(), o("label", _e, [
          a("span", ke, [
            w(d(r.value?.file ? "Login file content" : "Value"), 1),
            u.value && !I.value ? (n(), o("span", he, " · leave empty to keep the credential")) : v("", !0)
          ]),
          V(a("textarea", {
            disabled: s.value?.busy,
            "onUpdate:modelValue": e[3] || (e[3] = (t) => y.value = t),
            onInput: Y,
            rows: "4",
            class: "da-input da-mono kx-focus-halo",
            placeholder: r.value?.hint
          }, null, 40, ge), [
            [O, y.value]
          ])
        ])),
        f.value.secret ? (n(), o("small", xe, d(f.value.secret), 1)) : v("", !0),
        M.value ? (n(), o(j, { key: 3 }, [
          a("label", we, [
            e[12] || (e[12] = a("span", { class: "da-lbl" }, [
              w("Custom endpoint "),
              a("span", { class: "da-opt" }, "optional")
            ], -1)),
            V(a("input", {
              disabled: s.value?.busy,
              "onUpdate:modelValue": e[4] || (e[4] = (t) => g.value = t),
              class: "da-input da-mono kx-focus-halo",
              placeholder: "http://api.example.com:8000/v1 - empty uses the vendor's API"
            }, null, 8, Ce), [
              [O, g.value]
            ]),
            f.value.endpoint ? (n(), o("small", Se, d(f.value.endpoint), 1)) : v("", !0),
            e[13] || (e[13] = a("small", { class: "da-hint" }, "Send this account's tasks to a gateway or a model server you operate; the key authenticates to it.", -1))
          ]),
          g.value.trim() ? (n(), o("div", Ae, [
            i.value.endpoints.length > 1 ? (n(), o("label", Ve, [
              e[14] || (e[14] = a("span", { class: "da-lbl" }, "Protocol", -1)),
              V(a("select", {
                disabled: s.value?.busy,
                "onUpdate:modelValue": e[5] || (e[5] = (t) => C.value = t),
                class: "da-input kx-focus-halo"
              }, [
                (n(!0), o(j, null, R(i.value.endpoints, (t) => (n(), o("option", {
                  key: t,
                  value: t
                }, d(t), 9, $e))), 128))
              ], 8, Ue), [
                [F, C.value]
              ])
            ])) : v("", !0),
            a("label", je, [
              e[15] || (e[15] = a("span", { class: "da-lbl" }, [
                w("Model "),
                a("span", { class: "da-opt" }, "when the endpoint serves several")
              ], -1)),
              V(a("input", {
                disabled: s.value?.busy,
                "onUpdate:modelValue": e[6] || (e[6] = (t) => U.value = t),
                class: "da-input da-mono kx-focus-halo",
                placeholder: "qwen3-coder"
              }, null, 8, Ee), [
                [O, U.value]
              ]),
              f.value.model ? (n(), o("small", Ne, d(f.value.model), 1)) : v("", !0)
            ])
          ])) : v("", !0)
        ], 64)) : v("", !0),
        a("label", De, [
          e[16] || (e[16] = a("span", { class: "da-lbl" }, "Label", -1)),
          V(a("input", {
            disabled: s.value?.busy,
            "onUpdate:modelValue": e[7] || (e[7] = (t) => k.value = t),
            class: "da-input kx-focus-halo",
            onInput: e[8] || (e[8] = (t) => E.value = !0)
          }, null, 40, Le), [
            [O, k.value]
          ])
        ]),
        f.value.label ? (n(), o("small", Oe, d(f.value.label), 1)) : v("", !0),
        a("div", Pe, [
          e[17] || (e[17] = a("small", { class: "da-hint" }, "Checked against the credential's format, kept in the account's private context, never shown again.", -1)),
          a("button", {
            type: "button",
            class: "da-btn kx-focus-halo",
            disabled: s.value?.busy || Object.keys(f.value).length > 0 || !r.value || !k.value.trim() || I.value && !y.value.trim(),
            onClick: ee
          }, [
            T(J(q), { icon: "tabler:key" }),
            w(" " + d(s.value?.busy ? "Saving…" : "Save account"), 1)
          ], 8, Ie)
        ]),
        c.value || s.value?.error ? (n(), o("p", Me, d(c.value || s.value?.error), 1)) : v("", !0)
      ])) : v("", !0)
    ], 64));
  }
});
export {
  Ke as default
};
