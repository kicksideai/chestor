import { defineComponent as ee, computed as _, ref as c, onUnmounted as le, watch as C, openBlock as o, createElementBlock as n, Fragment as L, toDisplayString as d, createCommentVNode as r, createElementVNode as a, withDirectives as S, renderList as K, vModelSelect as R, createVNode as T, unref as J, createTextVNode as V, withModifiers as G, normalizeClass as te, vModelText as O } from "vue";
import { Icon as B } from "@iconify/vue";
import { b as ae, u as se } from "./wc-runtime-ClNbKZcC.js";
import { d as oe } from "./driver-account-types-Br-slV5h.js";
const ne = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, ie = {
  key: 1,
  class: "da"
}, ue = { class: "kx-card-head" }, de = { class: "kx-card-name" }, re = { class: "da-field" }, ve = ["disabled"], ce = ["value"], pe = {
  key: 0,
  class: "da-notice",
  role: "note"
}, be = { key: 0 }, fe = ["disabled"], me = { key: 1 }, ye = {
  key: 1,
  class: "da-field"
}, _e = { class: "da-lbl" }, ke = {
  key: 0,
  class: "da-opt"
}, he = ["disabled", "placeholder"], ge = {
  key: 2,
  class: "kx-err",
  role: "alert"
}, xe = { class: "da-field" }, we = ["disabled"], Ce = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, Se = {
  key: 0,
  class: "da-pair"
}, Ve = {
  key: 0,
  class: "da-field"
}, Ue = ["disabled"], $e = ["value"], je = { class: "da-field" }, Ae = ["disabled"], Ee = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, Ne = { class: "da-field" }, De = ["disabled"], Le = {
  key: 4,
  class: "kx-err",
  role: "alert"
}, Oe = { class: "da-foot" }, Pe = ["disabled"], Ie = {
  key: 5,
  class: "kx-err inline"
}, qe = /* @__PURE__ */ ee({
  __name: "driver-account",
  setup(Me) {
    const z = ae(), H = se(), P = _(() => oe.safeParse(z.value.config)), s = _(() => P.value.success ? P.value.data : null), q = _(() => z.value.config && !P.value.success ? "Account form configuration is invalid." : ""), i = _(() => s.value?.driver ?? null), p = _(() => s.value?.account), I = _(() => !p.value || b.value !== p.value.credential_kind), b = c(""), k = c(""), A = c(!1), f = c(""), m = c(""), g = c(""), U = c(""), x = c(""), $ = c(!1), y = c("");
    let h = 0;
    le(() => {
      h++;
    });
    const u = _(() => i.value?.credentials.find((l) => l.id === b.value) ?? null), M = _(() => !!u.value && !u.value.file && !u.value.subscription && (i.value?.endpoints.length ?? 0) > 0), E = (l) => new TextEncoder().encode(l).length, v = _(() => {
      const l = {}, e = s.value?.limits;
      e && E(k.value.trim()) > e.label_bytes && (l.label = `Label exceeds ${e.label_bytes} bytes.`);
      const t = f.value.trim();
      if (e && E(t) > e.secret_bytes) l.secret = `Credential exceeds ${e.secret_bytes} bytes.`;
      else if (t && u.value?.format === "single_line" && /[\r\n]/.test(t)) l.secret = "Credential must be a single line.";
      else if (t && u.value?.format === "json_object")
        try {
          const w = JSON.parse(t);
          (!w || typeof w != "object" || Array.isArray(w)) && (l.secret = "Credential must be a JSON object.");
        } catch {
          l.secret = "Credential must be a JSON object.";
        }
      const j = g.value.trim();
      return M.value && j && (e && E(j) > e.endpoint_url_bytes && (l.endpoint = `Endpoint URL exceeds ${e.endpoint_url_bytes} bytes.`), e && E(U.value.trim()) > e.endpoint_model_bytes && (l.model = `Model exceeds ${e.endpoint_model_bytes} bytes.`)), l;
    });
    C(() => i.value?.id, () => {
      const l = i.value;
      b.value = l?.credentials.find((e) => !e.subscription && !e.file)?.id ?? l?.credentials[0]?.id ?? "", x.value = l?.endpoints[0] ?? "", N(!0);
    }, { immediate: !0 }), C(b, () => {
      x.value = i.value?.endpoints[0] ?? "", N();
    }, { flush: "sync" }), C(() => s.value?.busy, (l) => {
      l && h++;
    }, { flush: "sync" }), C(() => JSON.stringify(s.value?.account), () => {
      b.value = p.value?.credential_kind ?? i.value?.credentials.find((l) => !l.subscription && !l.file)?.id ?? i.value?.credentials[0]?.id ?? "", N();
    }, { immediate: !0 }), C(() => s.value?.saved, (l, e) => {
      l !== e && N();
    });
    function N(l = !1) {
      h++, $.value = !1, (!l || !A.value) && (A.value = !1, k.value = p.value?.label ?? F()), f.value = "", m.value = "";
      const e = b.value === p.value?.credential_kind ? p.value.endpoint : void 0;
      g.value = e?.base_url ?? "", U.value = e?.model ?? "", x.value = e?.protocol ?? i.value?.endpoints[0] ?? "", y.value = "";
    }
    function F() {
      return [i.value?.title, u.value?.label].filter(Boolean).join(" ");
    }
    C(() => [i.value?.title, u.value?.label], () => {
      A.value || (k.value = p.value?.label ?? F());
    });
    function Q(l) {
      return l.split("/").pop() ?? l;
    }
    async function W(l) {
      if ($.value = !1, s.value?.busy) return;
      const e = l.dataTransfer?.files?.[0];
      if (!e) return;
      const t = s.value?.limits?.secret_bytes;
      if (t && e.size > t) {
        y.value = `${e.name} exceeds the ${t}-byte credential limit.`;
        return;
      }
      const j = i.value?.credentials.find((D) => D.file && Q(D.file) === e.name);
      j && (b.value = j.id);
      const w = ++h;
      try {
        const D = await e.text();
        if (w !== h || s.value?.busy) return;
        f.value = D.trim(), m.value = e.name, y.value = "";
      } catch {
        w === h && (y.value = "Could not read the credential file. Try dropping it again.");
      }
    }
    function X() {
      h++, m.value = "", y.value = "";
    }
    function Y() {
      h++, f.value = "", m.value = "", y.value = "";
    }
    function Z() {
      y.value = "";
      const l = i.value, e = u.value;
      if (!l || !e || s.value?.busy || Object.keys(v.value).length || !k.value.trim() || I.value && !f.value.trim()) return;
      const t = M.value && g.value.trim() ? { protocol: x.value, base_url: g.value.trim(), model: U.value.trim() || void 0 } : void 0;
      H("submit", { agent: l.id, credential_kind: e.id, label: k.value.trim(), secret: f.value.trim(), endpoint: t });
    }
    return (l, e) => (o(), n(L, null, [
      q.value ? (o(), n("p", ne, d(q.value), 1)) : r("", !0),
      i.value ? (o(), n("section", ie, [
        a("div", ue, [
          a("div", de, d(p.value ? "Edit" : "Add a") + " " + d(i.value.title) + " account", 1)
        ]),
        a("label", re, [
          e[9] || (e[9] = a("span", { class: "da-lbl" }, "Credential", -1)),
          S(a("select", {
            disabled: s.value?.busy,
            "onUpdate:modelValue": e[0] || (e[0] = (t) => b.value = t),
            class: "da-input kx-focus-halo"
          }, [
            (o(!0), n(L, null, K(i.value.credentials, (t) => (o(), n("option", {
              key: t.id,
              value: t.id
            }, d(t.label), 9, ce))), 128))
          ], 8, ve), [
            [R, b.value]
          ])
        ]),
        u.value?.subscription ? (o(), n("p", pe, [
          T(J(B), { icon: "tabler:alert-triangle" }),
          e[10] || (e[10] = a("span", null, [
            a("strong", null, "Personal use only."),
            V(" A subscription login is for your own personal use; running it through this tool for anyone else is not compliant with the provider's terms, and the provider may restrict or suspend the account. Only you run on it. Use an official API key or your own endpoint for production or multiple users.")
          ], -1))
        ])) : r("", !0),
        a("div", {
          class: te(["da-drop", { over: $.value, filled: !!m.value }]),
          onDragover: e[1] || (e[1] = G((t) => $.value = !s.value?.busy, ["prevent"])),
          onDragleave: e[2] || (e[2] = (t) => $.value = !1),
          onDrop: G(W, ["prevent"])
        }, [
          T(J(B), {
            icon: m.value ? "tabler:file-check" : "tabler:file-upload"
          }, null, 8, ["icon"]),
          m.value ? (o(), n("span", be, [
            V(d(m.value) + " loaded. ", 1),
            a("button", {
              type: "button",
              class: "da-link kx-focus-outline",
              onClick: Y,
              disabled: s.value?.busy
            }, "Clear", 8, fe)
          ])) : (o(), n("span", me, "Drop " + d(u.value?.file ? "~/" + u.value.file : "a file with the value") + " here, or paste below.", 1))
        ], 34),
        m.value ? r("", !0) : (o(), n("label", ye, [
          a("span", _e, [
            V(d(u.value?.file ? "Login file content" : "Value"), 1),
            p.value && !I.value ? (o(), n("span", ke, " · leave empty to keep the credential")) : r("", !0)
          ]),
          S(a("textarea", {
            disabled: s.value?.busy,
            "onUpdate:modelValue": e[3] || (e[3] = (t) => f.value = t),
            onInput: X,
            rows: "4",
            class: "da-input da-mono kx-focus-halo",
            placeholder: u.value?.hint
          }, null, 40, he), [
            [O, f.value]
          ])
        ])),
        v.value.secret ? (o(), n("small", ge, d(v.value.secret), 1)) : r("", !0),
        M.value ? (o(), n(L, { key: 3 }, [
          a("label", xe, [
            e[11] || (e[11] = a("span", { class: "da-lbl" }, [
              V("Custom endpoint "),
              a("span", { class: "da-opt" }, "optional")
            ], -1)),
            S(a("input", {
              disabled: s.value?.busy,
              "onUpdate:modelValue": e[4] || (e[4] = (t) => g.value = t),
              class: "da-input da-mono kx-focus-halo",
              placeholder: "http://api.example.com:8000/v1 - empty uses the vendor's API"
            }, null, 8, we), [
              [O, g.value]
            ]),
            v.value.endpoint ? (o(), n("small", Ce, d(v.value.endpoint), 1)) : r("", !0),
            e[12] || (e[12] = a("small", { class: "da-hint" }, "Send this account's tasks to a gateway or a model server you operate; the key authenticates to it.", -1))
          ]),
          g.value.trim() ? (o(), n("div", Se, [
            i.value.endpoints.length > 1 ? (o(), n("label", Ve, [
              e[13] || (e[13] = a("span", { class: "da-lbl" }, "Protocol", -1)),
              S(a("select", {
                disabled: s.value?.busy,
                "onUpdate:modelValue": e[5] || (e[5] = (t) => x.value = t),
                class: "da-input kx-focus-halo"
              }, [
                (o(!0), n(L, null, K(i.value.endpoints, (t) => (o(), n("option", {
                  key: t,
                  value: t
                }, d(t), 9, $e))), 128))
              ], 8, Ue), [
                [R, x.value]
              ])
            ])) : r("", !0),
            a("label", je, [
              e[14] || (e[14] = a("span", { class: "da-lbl" }, [
                V("Model "),
                a("span", { class: "da-opt" }, "when the endpoint serves several")
              ], -1)),
              S(a("input", {
                disabled: s.value?.busy,
                "onUpdate:modelValue": e[6] || (e[6] = (t) => U.value = t),
                class: "da-input da-mono kx-focus-halo",
                placeholder: "qwen3-coder"
              }, null, 8, Ae), [
                [O, U.value]
              ]),
              v.value.model ? (o(), n("small", Ee, d(v.value.model), 1)) : r("", !0)
            ])
          ])) : r("", !0)
        ], 64)) : r("", !0),
        a("label", Ne, [
          e[15] || (e[15] = a("span", { class: "da-lbl" }, "Label", -1)),
          S(a("input", {
            disabled: s.value?.busy,
            "onUpdate:modelValue": e[7] || (e[7] = (t) => k.value = t),
            class: "da-input kx-focus-halo",
            onInput: e[8] || (e[8] = (t) => A.value = !0)
          }, null, 40, De), [
            [O, k.value]
          ])
        ]),
        v.value.label ? (o(), n("small", Le, d(v.value.label), 1)) : r("", !0),
        a("div", Oe, [
          e[16] || (e[16] = a("small", { class: "da-hint" }, "Checked against the credential's format, kept in the account's private context, never shown again.", -1)),
          a("button", {
            type: "button",
            class: "da-btn kx-focus-halo",
            disabled: s.value?.busy || Object.keys(v.value).length > 0 || !u.value || !k.value.trim() || I.value && !f.value.trim(),
            onClick: Z
          }, [
            T(J(B), { icon: "tabler:key" }),
            V(" " + d(s.value?.busy ? "Saving…" : "Save account"), 1)
          ], 8, Pe)
        ]),
        y.value || s.value?.error ? (o(), n("p", Ie, d(y.value || s.value?.error), 1)) : r("", !0)
      ])) : r("", !0)
    ], 64));
  }
});
export {
  qe as default
};
