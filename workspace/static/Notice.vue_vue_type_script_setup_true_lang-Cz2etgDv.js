import { ref as v, defineComponent as $, onMounted as F, watch as S, onBeforeUnmount as D, openBlock as m, createElementBlock as y, createElementVNode as w, createTextVNode as L, toDisplayString as E, createCommentVNode as V, normalizeClass as C, createBlock as j, unref as x, renderSlot as A, createVNode as I } from "vue";
import { api as d, loadByTagName as M } from "@wippy-fe/proxy";
import { Icon as B } from "@iconify/vue";
const p = "/api/v1/workspace/entries";
function T(e, s) {
  const o = e?.response?.data ?? e?.data;
  return typeof o?.error == "string" && o.error ? o.error : e instanceof Error ? e.message : s;
}
function Y() {
  const e = v([]), s = v("");
  async function o() {
    try {
      const { data: a } = await d.get(`${p}/types`);
      a.success && (e.value = a.types ?? []);
    } catch (a) {
      s.value = T(a, "failed to load types");
    }
  }
  async function u(a) {
    const t = a ? `${p}?parent_id=${encodeURIComponent(a)}` : p;
    try {
      const { data: n } = await d.get(t);
      if (!n.success) throw new Error(n.error || "Could not load this folder.");
      return n.entries ?? [];
    } catch (n) {
      throw new Error(T(n, "Could not load this folder."));
    }
  }
  async function i(a) {
    const { data: t } = await d.get(`${p}/${a}`);
    return t.success ? t.entry : null;
  }
  async function c(a) {
    const { data: t } = await d.get(`${p}/${a}/breadcrumbs`);
    return t.success ? t.breadcrumbs ?? [] : [];
  }
  async function k(a) {
    const { data: t } = await d.post(p, a);
    if (!t.success) throw new Error(t.error || "failed to create");
    return t.entry;
  }
  async function r(a, t) {
    const n = new FormData();
    n.append("file", a), n.append("metadata", JSON.stringify({ target_parent_id: t ?? "", filename: a.name }));
    const { data: f } = await d.post("/api/v1/uploads", n, { headers: { "Content-Type": "multipart/form-data" } }), N = f.uuid || f.upload_id || f.id || f.upload?.id;
    if (!N) throw new Error(f.error || "upload failed");
    return String(N);
  }
  async function b(a, t) {
    const { data: n } = await d.put(`${p}/${a}`, t);
    if (!n.success) throw new Error(n.error || "failed to update");
    return n.entry;
  }
  async function g(a) {
    const { data: t } = await d.post(
      "/api/v1/transfer/export",
      { component_ids: [a] },
      { responseType: "blob" }
    );
    return t;
  }
  async function _(a, t) {
    const { data: n } = await d.post(`${p}/${a}/move`, { parent_id: t ?? "" });
    if (!n.success) throw new Error(n.error || "failed to move");
  }
  async function l(a) {
    const { data: t } = await d.delete(`${p}/${a}`);
    if (!t.success) throw new Error(t.error || "failed to delete");
    return { in_progress: t.in_progress === !0, job_id: t.job_id };
  }
  async function h(a) {
    const t = await u(a);
    let n = t.length;
    for (const f of t)
      (f.type === "folder" || f.container) && (n += await h(f.id));
    return n;
  }
  return { types: e, error: s, loadTypes: o, list: u, get: i, breadcrumbs: c, create: k, uploadFile: r, update: b, move: _, remove: l, countDescendants: h, exportEntry: g };
}
const O = { class: "wc-iconfield" }, P = {
  key: 0,
  role: "status"
}, R = {
  key: 1,
  role: "alert"
}, Z = /* @__PURE__ */ $({
  __name: "IconField",
  props: {
    modelValue: {},
    fallback: {}
  },
  emits: ["update:modelValue"],
  setup(e, { emit: s }) {
    const o = e, u = s, i = v(null), c = v(!1), k = v("");
    let r = null, b = 0;
    function g(l) {
      u("update:modelValue", String(l.detail || ""));
    }
    async function _() {
      const l = ++b, h = i.value;
      if (h) {
        if (c.value = !0, k.value = "", !customElements.get("wc-icon-picker"))
          try {
            await M("wc-icon-picker", { timeoutMs: 8e3 });
          } catch {
            l === b && (k.value = "Icon picker is unavailable."), l === b && (c.value = !1);
            return;
          }
        l !== b || i.value !== h || (r = document.createElement("wc-icon-picker"), r.setAttribute("value", o.modelValue || ""), o.fallback && r.setAttribute("fallback", o.fallback), r.addEventListener("select", g), h.replaceChildren(r), c.value = !1);
      }
    }
    return F(() => {
      _();
    }), S(() => o.modelValue, (l) => {
      r && r.getAttribute("value") !== l && r.setAttribute("value", l || "");
    }), S(() => o.fallback, (l) => {
      r && (l ? r.setAttribute("fallback", l) : r.removeAttribute("fallback"));
    }), D(() => {
      b += 1, r && r.removeEventListener("select", g), r = null;
    }), (l, h) => (m(), y("div", O, [
      w("div", {
        ref_key: "host",
        ref: i
      }, null, 512),
      c.value ? (m(), y("span", P, "Loading icon picker…")) : k.value ? (m(), y("span", R, [
        L(E(k.value) + " ", 1),
        w("button", {
          type: "button",
          onClick: _
        }, "Retry")
      ])) : V("", !0)
    ]));
  }
}), U = ["type", "disabled"], z = {
  key: 0,
  class: "km-spin",
  "aria-hidden": "true"
}, ee = /* @__PURE__ */ $({
  __name: "Button",
  props: {
    icon: {},
    variant: { default: "primary" },
    type: { default: "button" },
    loading: { type: Boolean },
    disabled: { type: Boolean },
    small: { type: Boolean }
  },
  emits: ["click"],
  setup(e, { emit: s }) {
    const o = s;
    return (u, i) => (m(), y("button", {
      type: e.type,
      class: C(["km-btn", [`km-btn-${e.variant}`, e.small && "sm"]]),
      disabled: e.disabled || e.loading,
      onClick: i[0] || (i[0] = (c) => o("click"))
    }, [
      e.loading ? (m(), y("span", z)) : e.icon ? (m(), j(x(B), {
        key: 1,
        icon: e.icon,
        "aria-hidden": "true"
      }, null, 8, ["icon"])) : V("", !0),
      A(u.$slots, "default")
    ], 10, U));
  }
}), G = { class: "km-field" }, J = { class: "km-field-label" }, W = {
  key: 0,
  class: "km-field-help"
}, te = /* @__PURE__ */ $({
  __name: "FormField",
  props: {
    label: {},
    help: {}
  },
  setup(e) {
    return (s, o) => (m(), y("label", G, [
      w("span", J, E(e.label), 1),
      A(s.$slots, "default"),
      e.help ? (m(), y("small", W, E(e.help), 1)) : V("", !0)
    ]));
  }
}), q = ["type", "value", "placeholder", "readonly", "disabled", "autocomplete", "min", "max", "step"], ae = /* @__PURE__ */ $({
  __name: "TextInput",
  props: {
    modelValue: {},
    type: { default: "text" },
    placeholder: {},
    readonly: { type: Boolean },
    disabled: { type: Boolean },
    autocomplete: {},
    min: {},
    max: {},
    step: {},
    mono: { type: Boolean }
  },
  emits: ["update:modelValue"],
  setup(e, { emit: s }) {
    const o = s;
    function u(i) {
      const c = i.target;
      o("update:modelValue", c.value);
    }
    return (i, c) => (m(), y("input", {
      class: C(["km-input", e.mono && "mono"]),
      type: e.type,
      value: e.modelValue,
      placeholder: e.placeholder,
      readonly: e.readonly,
      disabled: e.disabled,
      autocomplete: e.autocomplete,
      min: e.min,
      max: e.max,
      step: e.step,
      onInput: u
    }, null, 42, q));
  }
}), H = { class: "km-notice-text" }, ne = /* @__PURE__ */ $({
  __name: "Notice",
  props: {
    tone: { default: "info" }
  },
  emits: ["dismiss"],
  setup(e, { emit: s }) {
    const o = s;
    return (u, i) => (m(), y("div", {
      class: C(["km-notice", `t-${e.tone}`]),
      role: "status"
    }, [
      I(x(B), {
        icon: e.tone === "error" ? "tabler:alert-triangle" : "tabler:info-circle",
        "aria-hidden": "true"
      }, null, 8, ["icon"]),
      w("span", H, [
        A(u.$slots, "default")
      ]),
      w("button", {
        class: "km-notice-x",
        "aria-label": "Dismiss",
        onClick: i[0] || (i[0] = (c) => o("dismiss"))
      }, [
        I(x(B), {
          icon: "tabler:x",
          "aria-hidden": "true"
        })
      ])
    ], 2));
  }
});
export {
  te as _,
  Z as a,
  ae as b,
  ne as c,
  ee as d,
  Y as u
};
//# sourceMappingURL=Notice.vue_vue_type_script_setup_true_lang-Cz2etgDv.js.map
