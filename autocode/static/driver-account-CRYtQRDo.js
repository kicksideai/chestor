import { defineComponent as ee, computed as _, ref as b, onUnmounted as le, watch as S, openBlock as n, createElementBlock as o, Fragment as L, toDisplayString as d, createCommentVNode as v, createElementVNode as a, withDirectives as V, renderList as K, vModelSelect as R, createVNode as T, unref as J, createTextVNode as A, withModifiers as G, normalizeClass as te, vModelText as O } from "vue";
import { Icon as q } from "@iconify/vue";
import { b as ae, u as se } from "./wc-runtime-6vw183jT.js";
import { d as ne } from "./driver-account-types-D-TWStaw.js";
const oe = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, ie = {
  key: 1,
  class: "da"
}, ue = { class: "kx-card-head" }, re = { class: "kx-card-name" }, de = { class: "da-field" }, ve = ["disabled"], ce = ["value"], pe = {
  key: 0,
  class: "da-notice",
  role: "note"
}, fe = { key: 0 }, be = ["disabled"], me = { key: 1 }, ye = {
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
}, Ae = ["disabled"], Ue = ["value"], $e = { class: "da-field" }, je = ["disabled"], Ee = {
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
}, ze = /* @__PURE__ */ ee({
  __name: "driver-account",
  setup(Me) {
    const B = ae(), H = se(), P = _(() => ne.safeParse(B.value.config)), s = _(() => P.value.success ? P.value.data : null), z = _(() => B.value.config && !P.value.success ? "Account form configuration is invalid." : ""), i = _(() => s.value?.driver ?? null), u = _(() => s.value?.account), I = _(() => !u.value || p.value !== u.value.credential_kind), p = b(""), k = b(""), j = b(!1), m = b(""), y = b(""), g = b(""), U = b(""), w = b(""), $ = b(!1), c = b("");
    let h = 0;
    le(() => {
      h++;
    });
    const r = _(() => i.value?.credentials.find((l) => l.id === p.value) ?? null), M = _(() => !!r.value && !r.value.file && !r.value.subscription && (i.value?.endpoints.length ?? 0) > 0), E = (l) => new TextEncoder().encode(l).length, f = _(() => {
      const l = {}, e = s.value?.limits;
      e && E(k.value.trim()) > e.label_bytes && (l.label = `Label exceeds ${e.label_bytes} bytes.`);
      const t = m.value.trim();
      if (e && E(t) > e.secret_bytes) l.secret = `Credential exceeds ${e.secret_bytes} bytes.`;
      else if (t && r.value?.format === "single_line" && /[\r\n]/.test(t)) l.secret = "Credential must be a single line.";
      else if (t && r.value?.format === "json_object")
        try {
          const C = JSON.parse(t);
          (!C || typeof C != "object" || Array.isArray(C)) && (l.secret = "Credential must be a JSON object.");
        } catch {
          l.secret = "Credential must be a JSON object.";
        }
      const x = g.value.trim();
      return M.value && x && (e && E(x) > e.endpoint_url_bytes && (l.endpoint = `Endpoint URL exceeds ${e.endpoint_url_bytes} bytes.`), e && E(U.value.trim()) > e.endpoint_model_bytes && (l.model = `Model exceeds ${e.endpoint_model_bytes} bytes.`)), l;
    });
    S(() => i.value?.id, () => {
      const l = i.value;
      p.value = l?.credentials.find((e) => !e.subscription && !e.file)?.id ?? l?.credentials[0]?.id ?? "", w.value = l?.endpoints[0] ?? "", N(!0);
    }, { immediate: !0 }), S(p, () => {
      w.value = i.value?.endpoints[0] ?? "", N();
    }, { flush: "sync" }), S(() => s.value?.busy, (l) => {
      l && h++;
    }, { flush: "sync" }), S(() => JSON.stringify(s.value?.account), () => {
      p.value = u.value?.credential_kind ?? i.value?.credentials.find((l) => !l.subscription && !l.file)?.id ?? i.value?.credentials[0]?.id ?? "", N();
    }, { immediate: !0 }), S(() => s.value?.saved, (l, e) => {
      l !== e && N();
    });
    function N(l = !1) {
      h++, $.value = !1, (!l || !j.value) && (j.value = !1, k.value = u.value?.label ?? F()), m.value = "", y.value = "";
      const e = p.value === u.value?.credential_kind ? u.value.endpoint : void 0;
      g.value = e?.base_url ?? "", U.value = e?.model ?? "", w.value = e?.protocol ?? i.value?.endpoints[0] ?? "", c.value = "";
    }
    function F() {
      return [i.value?.title, r.value?.label].filter(Boolean).join(" ");
    }
    S(() => [i.value?.title, r.value?.label], () => {
      j.value || (k.value = u.value?.label ?? F());
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
        c.value = `${e.name} exceeds the ${t}-byte credential limit.`;
        return;
      }
      const x = i.value?.credentials.find((D) => D.file && Q(D.file) === e.name);
      if (u.value && x && x.id !== u.value.credential_kind) {
        c.value = "A different credential kind requires a new account.";
        return;
      }
      x && (p.value = x.id);
      const C = ++h;
      try {
        const D = await e.text();
        if (C !== h || s.value?.busy) return;
        m.value = D.trim(), y.value = e.name, c.value = "";
      } catch {
        C === h && (c.value = "Could not read the credential file. Try dropping it again.");
      }
    }
    function X() {
      h++, y.value = "", c.value = "";
    }
    function Y() {
      h++, m.value = "", y.value = "", c.value = "";
    }
    function Z() {
      c.value = "";
      const l = i.value, e = r.value;
      if (u.value && p.value !== u.value.credential_kind) {
        c.value = "A different credential kind requires a new account.";
        return;
      }
      if (!l || !e || s.value?.busy || Object.keys(f.value).length || !k.value.trim() || I.value && !m.value.trim()) return;
      const t = M.value && g.value.trim() ? { protocol: w.value, base_url: g.value.trim(), model: U.value.trim() || void 0 } : void 0;
      H("submit", { agent: l.id, credential_kind: e.id, label: k.value.trim(), secret: m.value.trim(), endpoint: t });
    }
    return (l, e) => (n(), o(L, null, [
      z.value ? (n(), o("p", oe, d(z.value), 1)) : v("", !0),
      i.value ? (n(), o("section", ie, [
        a("div", ue, [
          a("div", re, d(u.value ? "Edit" : "Add a") + " " + d(i.value.title) + " account", 1)
        ]),
        a("label", de, [
          e[9] || (e[9] = a("span", { class: "da-lbl" }, "Credential", -1)),
          V(a("select", {
            disabled: s.value?.busy || !!u.value,
            "onUpdate:modelValue": e[0] || (e[0] = (t) => p.value = t),
            class: "da-input kx-focus-halo"
          }, [
            (n(!0), o(L, null, K(i.value.credentials, (t) => (n(), o("option", {
              key: t.id,
              value: t.id
            }, d(t.label), 9, ce))), 128))
          ], 8, ve), [
            [R, p.value]
          ])
        ]),
        r.value?.subscription ? (n(), o("p", pe, [
          T(J(q), { icon: "tabler:alert-triangle" }),
          e[10] || (e[10] = a("span", null, [
            a("strong", null, "Personal use only."),
            A(" A subscription login is for your own personal use; running it through this tool for anyone else is not compliant with the provider's terms, and the provider may restrict or suspend the account. Only you run on it. Use an official API key or your own endpoint for production or multiple users.")
          ], -1))
        ])) : v("", !0),
        a("div", {
          class: te(["da-drop", { over: $.value, filled: !!y.value }]),
          onDragover: e[1] || (e[1] = G((t) => $.value = !s.value?.busy, ["prevent"])),
          onDragleave: e[2] || (e[2] = (t) => $.value = !1),
          onDrop: G(W, ["prevent"])
        }, [
          T(J(q), {
            icon: y.value ? "tabler:file-check" : "tabler:file-upload"
          }, null, 8, ["icon"]),
          y.value ? (n(), o("span", fe, [
            A(d(y.value) + " loaded. ", 1),
            a("button", {
              type: "button",
              class: "da-link kx-focus-outline",
              onClick: Y,
              disabled: s.value?.busy
            }, "Clear", 8, be)
          ])) : (n(), o("span", me, "Drop " + d(r.value?.file ? "~/" + r.value.file : "a file with the value") + " here, or paste below.", 1))
        ], 34),
        y.value ? v("", !0) : (n(), o("label", ye, [
          a("span", _e, [
            A(d(r.value?.file ? "Login file content" : "Value"), 1),
            u.value && !I.value ? (n(), o("span", ke, " · leave empty to keep the credential")) : v("", !0)
          ]),
          V(a("textarea", {
            disabled: s.value?.busy,
            "onUpdate:modelValue": e[3] || (e[3] = (t) => m.value = t),
            onInput: X,
            rows: "4",
            class: "da-input da-mono kx-focus-halo",
            placeholder: r.value?.hint
          }, null, 40, he), [
            [O, m.value]
          ])
        ])),
        f.value.secret ? (n(), o("small", ge, d(f.value.secret), 1)) : v("", !0),
        M.value ? (n(), o(L, { key: 3 }, [
          a("label", xe, [
            e[11] || (e[11] = a("span", { class: "da-lbl" }, [
              A("Custom endpoint "),
              a("span", { class: "da-opt" }, "optional")
            ], -1)),
            V(a("input", {
              disabled: s.value?.busy,
              "onUpdate:modelValue": e[4] || (e[4] = (t) => g.value = t),
              class: "da-input da-mono kx-focus-halo",
              placeholder: "http://api.example.com:8000/v1 - empty uses the vendor's API"
            }, null, 8, we), [
              [O, g.value]
            ]),
            f.value.endpoint ? (n(), o("small", Ce, d(f.value.endpoint), 1)) : v("", !0),
            e[12] || (e[12] = a("small", { class: "da-hint" }, "Send this account's tasks to a gateway or a model server you operate; the key authenticates to it.", -1))
          ]),
          g.value.trim() ? (n(), o("div", Se, [
            i.value.endpoints.length > 1 ? (n(), o("label", Ve, [
              e[13] || (e[13] = a("span", { class: "da-lbl" }, "Protocol", -1)),
              V(a("select", {
                disabled: s.value?.busy,
                "onUpdate:modelValue": e[5] || (e[5] = (t) => w.value = t),
                class: "da-input kx-focus-halo"
              }, [
                (n(!0), o(L, null, K(i.value.endpoints, (t) => (n(), o("option", {
                  key: t,
                  value: t
                }, d(t), 9, Ue))), 128))
              ], 8, Ae), [
                [R, w.value]
              ])
            ])) : v("", !0),
            a("label", $e, [
              e[14] || (e[14] = a("span", { class: "da-lbl" }, [
                A("Model "),
                a("span", { class: "da-opt" }, "when the endpoint serves several")
              ], -1)),
              V(a("input", {
                disabled: s.value?.busy,
                "onUpdate:modelValue": e[6] || (e[6] = (t) => U.value = t),
                class: "da-input da-mono kx-focus-halo",
                placeholder: "qwen3-coder"
              }, null, 8, je), [
                [O, U.value]
              ]),
              f.value.model ? (n(), o("small", Ee, d(f.value.model), 1)) : v("", !0)
            ])
          ])) : v("", !0)
        ], 64)) : v("", !0),
        a("label", Ne, [
          e[15] || (e[15] = a("span", { class: "da-lbl" }, "Label", -1)),
          V(a("input", {
            disabled: s.value?.busy,
            "onUpdate:modelValue": e[7] || (e[7] = (t) => k.value = t),
            class: "da-input kx-focus-halo",
            onInput: e[8] || (e[8] = (t) => j.value = !0)
          }, null, 40, De), [
            [O, k.value]
          ])
        ]),
        f.value.label ? (n(), o("small", Le, d(f.value.label), 1)) : v("", !0),
        a("div", Oe, [
          e[16] || (e[16] = a("small", { class: "da-hint" }, "Checked against the credential's format, kept in the account's private context, never shown again.", -1)),
          a("button", {
            type: "button",
            class: "da-btn kx-focus-halo",
            disabled: s.value?.busy || Object.keys(f.value).length > 0 || !r.value || !k.value.trim() || I.value && !m.value.trim(),
            onClick: Z
          }, [
            T(J(q), { icon: "tabler:key" }),
            A(" " + d(s.value?.busy ? "Saving…" : "Save account"), 1)
          ], 8, Pe)
        ]),
        c.value || s.value?.error ? (n(), o("p", Ie, d(c.value || s.value?.error), 1)) : v("", !0)
      ])) : v("", !0)
    ], 64));
  }
});
export {
  ze as default
};
